---
type: Game Feature
title: Compose and export native asset-only mods in a browser
description: Build a browser pipeline that composes built-in SubParts, preserves GameData, validates ownership
  and exports a native KSA mod
topic: author-native-asset-mods-in-a-browser
category: assets
group: asset-xml
approaches: 1
game_types:
  - KSA.Mod
  - KSA.AssetBundle
  - KSA.PartTemplate
  - KSA.TransformReference
  - KSA.QuaternionEx
  - KSA.Vector3Reference
  - KSA.FeedsFromReference
  - KSA.ConsumerFeedWiring
  - KSA.AsmbVolumetricMassTemplate
  - KSA.Tank
  - KSA.BatteryTemplate
  - KSA.PowerConsumerTemplate
lifecycle:
  - tool:build
  - tool:authoring
demonstrated_by:
  - mods/flexo/features/native-asset-mod-export
  - mods/flexo/features/builtin-part-composition
  - mods/flexo/features/schema-aware-gamedata-roundtrip
  - mods/flexo/features/isolated-subpart-variants
  - mods/flexo/features/coordinate-transform-bridge
  - mods/flexo/features/connector-and-feed-authoring
  - mods/flexo/features/mass-and-resource-authoring
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:59:00Z
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
  - id: ksa-current-decomp-ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: current/decomp/KSA/AssetBundle.cs
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
  - id: ksa-current-decomp-ksa-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: current/decomp/KSA/Mod.cs
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
  - id: ksa-current-decomp-ksa-quaternionex
    repo: ksa-game-assemblies
    path: current/decomp/KSA/QuaternionEx.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/QuaternionEx.cs
    title: current/decomp/KSA/QuaternionEx.cs
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-transformreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TransformReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs
    title: current/decomp/KSA/TransformReference.cs
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
  - id: flexo-src-state-feedtargets
    repo: flexo
    path: src/state/feedTargets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts
    title: src/state/feedTargets.ts
  - id: ksa-current-decomp-ksa-asmbvolumetricmasstemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    title: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
  - id: flexo-src-ksa-massdefinitions
    repo: flexo
    path: src/ksa/massDefinitions.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts
    title: src/ksa/massDefinitions.ts
---

Use this approach to build or extend an external part authoring tool without a runtime plugin. Flexo demonstrates the full path from existing Core pieces to Part XML, GameData and a downloadable native mod. You need a supported KSA catalog and familiarity with XML identifiers; custom geometry is optional.

## Engine background

KSA registers Part, SubPart, PartGameData and SubPartGameData through [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L38-L42). GameData is merged into its target template: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L265-L350) appends many module collections, so duplicating a component in geometry and GameData can change behavior. Native mod asset paths are loaded by [current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L157-L191).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Compose and export native asset-only mods in a browser](author-native-asset-mods-in-a-browser.md) | Flexo | `xml-asset`, `toml-config`, `browser-file-system`, `asset-catalog`, `schema-passthrough`, `id-remapping`, `coordinate-conversion` | `tool:build`, `tool:authoring` | Reuse Core geometry and author behavior without a runtime assembly; references and browser previews still require game-side validation |

## See also

- [Native asset-only mod export from a browser](../../../../mods/flexo/features/native-asset-mod-export.md)
- [Assemble parts from the built-in SubPart catalog](../../../../mods/flexo/features/builtin-part-composition.md)
- [Preserve unmodeled GameData through structured XML passthrough](../../../../mods/flexo/features/schema-aware-gamedata-roundtrip.md)
- [Isolate customized built-in SubParts with export variants](../../../../mods/flexo/features/isolated-subpart-variants.md)
- [Bridge KSA transforms to a three.js editor](../../../../mods/flexo/features/coordinate-transform-bridge.md)
- [Author connectors and scoped resource feed wiring](../../../../mods/flexo/features/connector-and-feed-authoring.md)
- [Author mass shapes, tanks and power GameData](../../../../mods/flexo/features/mass-and-resource-authoring.md)
- [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md)
- [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md)
- [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
