---
type: Mod Feature
title: Assemble parts from the built-in SubPart catalog
description: Resolve Core assets and GameData into reusable SubPart templates and complete editable part assemblies
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - asset-catalog
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
  - id: flexo-src-ksa-catalog
    repo: flexo
    path: src/ksa/catalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/catalog.ts
    title: src/ksa/catalog.ts
  - id: flexo-src-ksa-partcatalog
    repo: flexo
    path: src/ksa/partCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts
    title: src/ksa/partCatalog.ts
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

A custom part can reuse existing meshes and materials entirely. Flexo reads the Core catalog, places SubPart instances with independent transforms, and exports their arrangement as native Part XML.

## How it works

The SubPart catalog resolves references through mesh atlases and material definitions instead of assuming a file per piece. Whole-part import gathers placements and connectors, then merges the corresponding GameData. It carries editor tags, mass, power, propulsion, collider, light and seat data into the editing model. GameData-added placements with previously unseen instance IDs are appended, so assets such as packed parachutes are not lost merely because their placement was outside the geometry document. Export puts the final arranged placements in the Part document.[^flexo-src-ksa-catalog][^flexo-src-ksa-partcatalog][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/catalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/catalog.ts#L183-L304) | Resolve template mesh and material references |
| [src/ksa/partCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts#L455-L567) | Merge part GameData and additional placements |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L126-L162) | Emit arranged SubPart instances and connectors |

## Snippets

```typescript
// src/ksa/partCatalog.ts L518-L527
      // GameData-ADDED placements (`ApplyOrAddSubPartInstance`: an Id matching no geometry
      // instance is appended). Normalised into the one placement list exactly like colliders —
      // flexo re-emits every placement in the geometry `<Part>`, which the game treats
      // identically. A matching Id is NOT re-applied: KSA would only overlay its Transform /
      // Gimbal / SolarTracker, and Core authors no such overlay with an InstanceOf.
      const placed = new Set(part.placements.map((p) => p.instanceId));
      for (const p of gd.subPartPlacements) {
        if (placed.has(p.instanceId)) continue;
        part.placements.push(p);
        placed.add(p.instanceId);
```

## Game APIs touched

KSA.PartTemplate.ApplyGameData merges game data into a geometry template.[^ksa-current-decomp-ksa-parttemplate]

## Pitfalls and version notes

The catalog is a supported subset of Core files, not a general importer for every installed mod. Matching GameData placement IDs are not reapplied as arbitrary transform overlays by this merge; the source documents the narrower Core pattern it handles. A project containing only built-in references still needs the relevant Core assets in the target game.

## See also

- [schema aware gamedata roundtrip](schema-aware-gamedata-roundtrip.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [isolated subpart variants](isolated-subpart-variants.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-ksa-catalog]: [src/ksa/catalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/catalog.ts#L183-L304)
[^flexo-src-ksa-partcatalog]: [src/ksa/partCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts#L455-L567)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L126-L162)
[^ksa-current-decomp-ksa-parttemplate]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L265-L350)
