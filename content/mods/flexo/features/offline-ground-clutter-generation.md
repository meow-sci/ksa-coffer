---
type: Mod Feature
title: Generate ground-clutter atlases and audit legacy scenario output
description: Convert PNGs into shared clutter textures and named GLB geometry while identifying obsolete XML and selection assumptions in the offline generator
mod: flexo
category: celestials
tags:
  - flexo
  - ground-clutter
  - asset-authoring
  - compatibility
techniques:
  - xml-asset
  - glb-model
  - texture-atlas
  - offline-generation
game_types:
  - KSA.ClutterEcotypeReference
  - KSA.ClutterObjectTemplate
  - KSA.GroundClutterLodReference
  - KSA.ClutterEcotypeRenderData
  - KSA.AssetBundle
  - KSA.SerializedReference
  - KSA.SystemTemplate
lifecycle:
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:48:03Z
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
  - id: generator
    repo: flexo
    path: scripts/build-cartoon-moon.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts
    title: Offline PNG, geometry and moon-scenario generator
  - id: encoder
    repo: flexo
    path: src/ktx/encodeKtx2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts
    title: Current UNORM KTX2 encoder
  - id: game-clutter-object
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterObjectTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterObjectTemplate.cs
    title: Current clutter object identity, atlas and LOD contract
  - id: game-lod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GroundClutterLodReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs
    title: Current ID references and material validation
  - id: game-reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SerializedReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedReference.cs
    title: ID-only serialized reference
  - id: game-ecotype
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterEcotypeReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeReference.cs
    title: Ecotype data and runtime material list
  - id: game-assets
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: Mesh atlas and clutter material asset declarations
  - id: game-renderer
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterEcotypeRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeRenderData.cs
    title: Five-LOD indexing and object-count limit
  - id: game-selection
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp
    title: Current clutter object selection
  - id: game-system
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: Scenario body list and parent resolution
---

Flexo includes an implemented Bun command that turns PNG images into a ground-clutter mod and a cloned moon scenario. This is an offline generator separate from the browser editor. Its image and geometry pipeline is reusable, but its emitted clutter XML targets older game contracts and requires revision before use with KSA 2026.10.10.5554.

## How it works

The command reads explicit PNGs or a directory, sorts inputs, derives unique names, optionally keys an opaque background into alpha, and downsizes images. It packs aspect-preserving images into one tiled atlas with transparent margins. Flat or crossed cards keep an opacity map and dilated edge RGB; solid rounded cylinders composite over a chosen opaque fill instead. Each generated GLB contains indexed positions, normals and UVs, and matching node/mesh names. All pieces share the atlas, synthetic normal and ORM textures ([scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L143-L301), [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L303-L481)).

The XML writer places one object per image inside one ecotype, with five LOD rows reusing that image’s mesh. It also appends a duplicate of the first object as a historical selection workaround. A line-oriented transform clones the indented Luna body, renames it Looney, changes its orbital semimajor axis and replaces its clutter. A separate fixed scenario lists stock bodies plus Looney; the manifest names both asset and system files. Existing manifest/scenario files are preserved on regeneration, whereas generated clutter textures and meshes are cleared first ([scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L507-L659), [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L711-L787)).

## Lifecycle and timing

`tool:build`: the command reads PNGs and an explicitly supplied stock astronomical XML file, then writes a generated mod directory. It runs in Bun and has no game hooks. A corrected package would later be loaded through native assets and the selected system scenario; generating files is not an installation or in-game validation result.

## Key code

| Source | Role |
|---|---|
| [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L187-L217) | Tiled atlas with aspect fitting and margins |
| [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L507-L580) | Legacy clutter declarations and duplicate-object workaround |
| [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L590-L659) | Formatting-sensitive body clone and fixed scenario |
| [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L47-L84) | Shared encoder with UNORM output regardless of legacy caller flags |

## Snippets

This exact writer output illustrates the compatibility problem: the emitted object has no atlas identity.

```typescript
// scripts/build-cartoon-moon.ts L519-L525
function clutterObjectXml(id: string, mesh: string): string {
  return `                <ClutterObject Name="${id}">
                    <LODs>
${lodsXml(mesh)}
                    </LODs>
                </ClutterObject>`
}
```

## Game APIs touched

| Current contract | Consequence for this generator |
|---|---|
| `ClutterObjectTemplate.OnDataLoad` requires a nonempty `Atlas` and exactly five LODs | Five rows remain correct; the absent atlas causes an explicit load exception.[^game-clutter-object] |
| `GroundClutterLodReference.MeshIds` contains `SerializedReference` values | A LOD’s legacy `Mesh Path` does not load a file; references must resolve to meshes from declared atlases.[^game-lod][^game-reference] |
| `ClutterEcotypeReference.MaterialReferences` is ignored by XML serialization | The generator’s nested ecotype material is not the current declaration route. `AssetBundle` accepts `GroundClutterMaterial` and `MeshAtlas` assets; LODs use material ID references.[^game-ecotype][^game-assets] |
| Current generation shader selects across all object entries | Its historical spare is now selectable and duplicates the first image’s probability; the old last-object workaround no longer applies.[^game-selection] |
| `ClutterEcotypeRenderData` rejects five times the object count above 256 | The unmodified generator’s extra object leaves at most 50 real image entries before this renderer limit; the command does not enforce that bound.[^game-renderer] |
| `SystemTemplate` owns its body list and resolves parent relationships | The generated scenario must actually include the new body and must be reconciled with the target game’s stock scenario.[^game-system] |

## Pitfalls and version notes

- Treat the command as a source example needing a current-schema update, not a working export path for this pinned build. Its comments and generated README contain older compatibility claims. This review did not execute it or load its output in KSA.
- Its `srgb` caller option is obsolete: the current encoder accepts only the Zstd option and always writes UNORM/linear container metadata. The caller’s comments do not determine the generated format.[^encoder]
- Use a dedicated generated output directory: the command deletes its clutter texture and mesh subdirectories before rebuilding. A failed later step can leave a partial output. The fixed scenario and formatting-sensitive Luna clone need separate review after game updates.[^generator]
- A shared material ID and per-image names are fixed within this example; multiple generated packages need deliberate global asset namespaces. Clutter placement is visual here; the script supplies no authored collision data.

## See also

- [Build material channels and KTX2 textures](material-and-ktx2-pipeline.md)
- [Export named mesh atlases](mesh-atlas-and-picking-export.md)
- [Launch-site system export](launch-site-system-export.md)
- [Asset pipeline and regression tooling](asset-pipeline-and-regression-tooling.md)
- [Audit and update an offline ground-clutter generator for current asset contracts](../../../howto/celestials/terrain/exclude-or-replace-ground-clutter/exclude-or-replace-ground-clutter-4.md) - how-to article demonstrating this feature

[^generator]: [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L711-L787)
[^encoder]: [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L47-L84)
[^game-clutter-object]: [current/decomp/KSA/ClutterObjectTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterObjectTemplate.cs#L91-L144)
[^game-lod]: [current/decomp/KSA/GroundClutterLodReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs#L8-L17), [current/decomp/KSA/GroundClutterLodReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs#L59-L121)
[^game-reference]: [current/decomp/KSA/SerializedReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedReference.cs#L6-L32)
[^game-ecotype]: [current/decomp/KSA/ClutterEcotypeReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeReference.cs#L10-L25)
[^game-assets]: [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L25-L35)
[^game-renderer]: [current/decomp/KSA/ClutterEcotypeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeRenderData.cs#L149-L175), [current/decomp/KSA/ClutterEcotypeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeRenderData.cs#L202-L220)
[^game-selection]: [current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp#L492-L503)
[^game-system]: [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L20-L32), [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L70-L93)
