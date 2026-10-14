---
type: Mod Feature
title: Preserve unmodeled GameData through structured XML passthrough
description: Combine typed editable modules with raw XML children and attributes to retain unsupported GameData during import and export
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - schema-passthrough
game_types:
  - KSA.PartTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:30:12Z
status: stable
repos:
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
---

Flexo edits selected KSA schemas without discarding every unfamiliar module. Typed fields live beside preserved XML fragments, providing a practical migration path for a growing authoring tool.

## How it works

Explicit allow-lists distinguish modeled children from unknown children separately for PartGameData and SubPartGameData. Unknown elements become recursive objects containing tag, attributes, child nodes and leaf text; unknown root attributes are retained independently. The serializer reconstructs these objects in the output DOM. Connector-reference remapping traverses the preserved nodes when imported connector IDs change. SubPart IVA seats remain in passthrough deliberately because only part-level seats have a dedicated editor.[^flexo-src-ksa-partxmlparser][^flexo-src-ksa-partxmlserializer][^flexo-src-ksa-partxmlparser]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L971-L1062) | Known-field boundaries and recursive raw-node capture |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L603-L649) | Rebuild typed mass entries and raw XML |
| [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1178-L1203) | Remap preserved connector references |

## Snippets

```typescript
// src/ksa/partXmlParser.ts L1045-L1054
function elementToRawNode(el: Element): RawXmlNode {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) attrs[attr.name] = attr.value;
  const kids = childElements(el);
  const node: RawXmlNode = { tag: el.tagName, attrs, children: kids.map(elementToRawNode) };
  if (kids.length === 0) {
    const text = el.textContent?.trim();
    if (text) node.text = text;
  }
  return node;
```

## Game APIs touched

KSA.PartTemplate.ApplyGameData appends components rather than replacing all data.[^ksa-current-decomp-ksa-parttemplate]

## Pitfalls and version notes

This is semantic preservation of supported XML shapes, not byte-for-byte source retention: comments, formatting and mixed text content are not reproduced by the recursive representation. It is not a universal guarantee for unknown geometry-level Part children. Moving a tag into the known set before implementing both parse and emit paths can silently lose it. Additive game-side components also mean emitting a module at both geometry and GameData sites can duplicate it.

## See also

- [builtin part composition](builtin-part-composition.md)
- [mass and resource authoring](mass-and-resource-authoring.md)
- [iva seat authoring](iva-seat-authoring.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-ksa-partxmlparser]: [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1178-L1203)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L603-L649)
[^ksa-current-decomp-ksa-parttemplate]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L265-L350)
