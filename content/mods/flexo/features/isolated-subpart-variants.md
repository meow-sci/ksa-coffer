---
type: Mod Feature
title: Isolate customized built-in SubParts with export variants
description: Redeclare only changed built-in templates under deterministic per-part IDs while reusing their Core meshes and materials
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - id-remapping
game_types:
  - KSA.PartTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:31:29Z
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
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
---

Editing a shared Core SubPart’s data must not change every other part that uses that template. Flexo emits a new template for the edited part and points its placements and GameData at that new identity.

## How it works

The variant map considers each distinct placed built-in template. A changed interior-only flag or nonempty template GameData, collider or light triggers a new ID incorporating project name, part namespace and original template ID. Custom meshes are excluded because they already have their own declarations. The new SubPart reuses the original mesh and material, but writes a fresh PartModel ID and explicitly carries interior, ray-tracing and shadow flags. Inherited colliders and eligible mass definitions are copied because naming a mesh and material does not clone the original template. A missing source mesh or material leaves the reference unchanged with a warning.[^flexo-src-ksa-modexport][^flexo-src-ksa-assetsxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L306-L407) | Variant eligibility and project-part namespace |
| [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L261-L323) | Fresh model identity and explicit inherited properties |

## Snippets

```typescript
// src/ksa/modExport.ts L382-L400
    out.set(templateId, {
      originalId: templateId,
      variantId: `flexo_${base}_${ns}_${templateId}`,
      meshId: entry.meshNodeName,
      materialId: entry.materialId,
      colliders: entry.colliders ?? [],
      massDefinitions: part.subPartGameData.some(
        (data) =>
          data.subPartTemplateId === templateId &&
          (data.massDefinitionsOverride ||
            data.unknownChildren.some((node) =>
              (MASS_SHAPES as readonly string[]).includes(node.tag),
            )),
      )
        ? []
        : (entry.data?.gameData?.massDefinitions ?? []),
      internal: wantInternal,
      rayTracing: entry.rayTracing ?? null,
      shadowCaster: entry.shadowCaster ?? null,
```

## Game APIs touched

KSA.PartTemplate.ApplyGameData changes the target template.[^ksa-current-decomp-ksa-parttemplate]

## Pitfalls and version notes

A variant is scoped per template within a part, not independently per placement. Two instances using the same variant share its template data. Namespace sanitization can collapse distinct user IDs; the export plan detects this collision. Retaining only geometry and omitting inherited collision or mass would change behavior even if the preview looked correct.

## See also

- [native asset mod export](native-asset-mod-export.md)
- [mass and resource authoring](mass-and-resource-authoring.md)
- [iva seat authoring](iva-seat-authoring.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-ksa-modexport]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L306-L407)
[^flexo-src-ksa-assetsxmlserializer]: [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L261-L323)
[^ksa-current-decomp-ksa-parttemplate]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L265-L350)
