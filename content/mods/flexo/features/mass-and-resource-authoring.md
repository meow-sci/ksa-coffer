---
type: Mod Feature
title: Author mass shapes, tanks and power GameData
description: Represent inert mass and resource modules as editable native schemas with source-aware mass estimates
mod: flexo
category: vehicles-and-parts
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
game_types:
  - KSA.AsmbVolumetricMassTemplate
  - KSA.PartTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:58:52Z
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
  - id: flexo-src-ksa-massdefinitions
    repo: flexo
    path: src/ksa/massDefinitions.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts
    title: src/ksa/massDefinitions.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-ksa-partcatalog
    repo: flexo
    path: src/ksa/partCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts
    title: src/ksa/partCatalog.ts
  - id: ksa-current-decomp-ksa-asmbvolumetricmasstemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    title: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
---

An assembled mesh needs physical and resource metadata to function as a part. Flexo’s Data model provides mass definitions, tank shapes, power fields and imported GameData without requiring C# code.

## How it works

Mass entries preserve dimensions, assembly offsets, rotations, optional inertia and a mass source. The supported set includes CustomMass, three solid analytic shapes and four hollow analytic shapes. The estimate resolves material density first, explicit density second, and direct mass last; missing density produces an unknown result rather than a fabricated number. The XML writer preserves these choices and their units. Tanks carry an ID, shape dimensions, wall material, assembly offset, role affinity and magnetic-trap setting; [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L663-L700) does not author a substance fill. Solar panels and imported battery, generator and power-consumer data travel through the same part data model. Template data remains separate from placement transforms.[^flexo-src-ksa-massdefinitions][^flexo-src-ksa-partxmlserializer][^flexo-src-ksa-partcatalog]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/massDefinitions.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts#L8-L59) | Supported shape inventory and editable mass representation |
| [src/ksa/massDefinitions.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts#L283-L306) | Material, density and explicit mass precedence |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L603-L713) | Mass, solar panel and tank serialization |
| [src/ksa/partCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts#L475-L505) | Imported part resource and power data |

## Snippets

```typescript
// src/ksa/massDefinitions.ts L292-L306
  const volume = massDefinitionVolumeM3(definition);
  if (!Number.isFinite(volume)) return null;
  let mass: number;
  if (definition.materialId) {
    const density = materialDensities.get(definition.materialId);
    if (density == null) return null;
    mass = density * volume;
  } else if (definition.densityKgM3 != null && definition.densityKgM3 > 0) {
    mass = definition.densityKgM3 * volume;
  } else if (definition.massKg != null && definition.massKg > 0) {
    mass = definition.massKg;
  } else {
    return null;
  }
  return Number.isFinite(mass) ? mass : null;
```

## Game APIs touched

KSA.AsmbVolumetricMassTemplate.GetMassFromVolume prioritizes material, then density, then mass.[^ksa-current-decomp-ksa-asmbvolumetricmasstemplate]

KSA.PartTemplate.ApplyGameData adds power modules.[^ksa-current-decomp-ksa-parttemplate]

## Pitfalls and version notes

The displayed mass estimate is not an assembled vehicle simulation. Tank contents, unsupported preserved mass nodes and game runtime state can change what a player observes. Materials must resolve in the target game. A visual scale change is not evidence that every independent physical definition changed with it; inspect mass and collider definitions explicitly.

## See also

- [connector and feed authoring](connector-and-feed-authoring.md)
- [isolated subpart variants](isolated-subpart-variants.md)
- [engine design and validation](engine-design-and-validation.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-ksa-massdefinitions]: [src/ksa/massDefinitions.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts#L283-L306)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L603-L713)
[^flexo-src-ksa-partcatalog]: [src/ksa/partCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts#L475-L505)
[^ksa-current-decomp-ksa-asmbvolumetricmasstemplate]: [current/decomp/KSA/AsmbVolumetricMassTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AsmbVolumetricMassTemplate.cs#L6-L59)
[^ksa-current-decomp-ksa-parttemplate]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L329-L335)
