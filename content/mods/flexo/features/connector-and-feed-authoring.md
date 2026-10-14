---
type: Mod Feature
title: Author connectors and scoped resource feed wiring
description: Preserve attachment flags, connector capabilities and placement-scoped feed targets in a data-only part
mod: flexo
category: vehicles-and-parts
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - id-remapping
game_types:
  - KSA.FeedsFromReference
  - KSA.ConsumerFeedWiring
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
  - id: flexo-src-state-feedtargets
    repo: flexo
    path: src/state/feedTargets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts
    title: src/state/feedTargets.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-feedsfromreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FeedsFromReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FeedsFromReference.cs
    title: current/decomp/KSA/FeedsFromReference.cs
  - id: ksa-current-decomp-ksa-consumerfeedwiring
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConsumerFeedWiring.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConsumerFeedWiring.cs
    title: current/decomp/KSA/ConsumerFeedWiring.cs
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
---

Attachment geometry and resource plumbing are related but distinct. Flexo retains connector orientation and flags while separately modeling what may flow through that connector and which consumer receives it.

## How it works

A feed-target query lists part tanks and grain segments, then enumerates the containers on each placed SubPart using that placement’s instance ID. The consumer list follows the same scope rule, so two instances of one engine template remain separately addressable. Parent-deferred consumers are matched against explicit wiring with instance-scoped entries or an unscoped fallback. Serialization uses one discriminated feed form and emits flag and capability lists separated by spaces in both connector documents.[^flexo-src-state-feedtargets][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/state/feedTargets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts#L11-L129) | Derive explicit containers and consumers per placement |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L76-L109) | Whitespace-separated connector flags and capabilities |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L791-L810) | Emit discriminated feed references |

## Snippets

```typescript
// src/state/feedTargets.ts L48-L61
  for (const t of part.gameData.tanks) push(t.id, null, 'part');
  for (const s of part.gameData.solidGrainSegments) push(s.id, null, 'part');
  // A SubPart's containers are addressed THROUGH the placement that carries them
  // (`<FeedsFrom SubPart=… Container=…>`), so one template placed twice yields two
  // distinct feed targets.
  for (const placement of part.placements) {
    const spd = part.subPartGameData.find(
      (s) => s.subPartTemplateId === placement.subPartTemplateId,
    );
    if (!spd) continue;
    for (const t of spd.tanks) push(t.id, placement.instanceId, placement.instanceId);
    for (const s of spd.solidGrainSegments) push(s.id, placement.instanceId, placement.instanceId);
  }
  return { connectorIds: part.connectors.map((c) => c.id), containers };
```

## Game APIs touched

KSA.FeedsFromReference permits exactly one container, connector or parent source.[^ksa-current-decomp-ksa-feedsfromreference]

KSA.ConsumerFeedWiring holds feeds and rejects parent deferral in wiring itself.[^ksa-current-decomp-ksa-consumerfeedwiring]

KSA.PartTemplate.ApplyGameData combines connector flags and capabilities.[^ksa-current-decomp-ksa-parttemplate]

## Pitfalls and version notes

A connector capability does not create fuel or automatically select a valid feed source. Empty container IDs cannot be selected as addressable containers. Copying a template ID into a field that expects a placement ID can produce a visually correct part with disconnected propulsion. Inspect wiring after imports, duplication and namespace changes.

## See also

- [engine design and validation](engine-design-and-validation.md)
- [propulsion design wizards](propulsion-design-wizards.md)
- [mass and resource authoring](mass-and-resource-authoring.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-state-feedtargets]: [src/state/feedTargets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts#L11-L129)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L791-L810)
[^ksa-current-decomp-ksa-feedsfromreference]: [current/decomp/KSA/FeedsFromReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FeedsFromReference.cs#L7-L24)
[^ksa-current-decomp-ksa-consumerfeedwiring]: [current/decomp/KSA/ConsumerFeedWiring.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConsumerFeedWiring.cs#L8-L46)
[^ksa-current-decomp-ksa-parttemplate]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L279-L301)
