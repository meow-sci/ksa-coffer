---
type: Game Feature
title: Add a part's art with its own GLB model and PBR textures
description: How a Blender export becomes a placeable part through MeshAtlas, PbrMaterial, SubPart and Part elements, with two ways to organise atlases, materials and preview twins
topic: add-a-part-model-with-glb-and-pbr-textures
category: assets
group: models-and-textures
approaches: 2
demonstrated_by: [mods/ksacars/features/car-part-assets-glb-pbr, mods/ksarmory/features/weapon-part-definitions-xml, mods/ksarmory/features/blender-model-pipeline-and-checks]
game_types: [KSA.PartTemplate, KSA.SubPartTemplate, KSA.PartInstance, KSA.PartModelModule, KSA.PartModelGlassModule, KSA.MeshViewModule, KSA.MeshAtlasFileReference, KSA.PbrMaterialReference, KSA.TransformReference]
lifecycle: ['startup:asset-load']
tags: [part, subpart, glb, pbr, meshview, assets]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:16:09Z'}
status: stable
repos:
- {name: KSACars, git: 'https://github.com/LaurensDeV/KSACars', ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f}
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-meshatlasfilereference, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshAtlasFileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs', title: 'current/decomp/KSA/MeshAtlasFileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-parttemplate, repo: ksa-game-assemblies, path: current/decomp/KSA/PartTemplate.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs', title: 'current/decomp/KSA/PartTemplate.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-subparttemplate, repo: ksa-game-assemblies, path: current/decomp/KSA/SubPartTemplate.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SubPartTemplate.cs', title: 'current/decomp/KSA/SubPartTemplate.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partinstance, repo: ksa-game-assemblies, path: current/decomp/KSA/PartInstance.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartInstance.cs', title: 'current/decomp/KSA/PartInstance.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-transformreference, repo: ksa-game-assemblies, path: current/decomp/KSA/TransformReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs', title: 'current/decomp/KSA/TransformReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partmodelmodule, repo: ksa-game-assemblies, path: current/decomp/KSA/PartModelModule.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelModule.cs', title: 'current/decomp/KSA/PartModelModule.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partmodelglassmodule, repo: ksa-game-assemblies, path: current/decomp/KSA/PartModelGlassModule.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelGlassModule.cs', title: 'current/decomp/KSA/PartModelGlassModule.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-meshviewmodule, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshViewModule.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshViewModule.cs', title: 'current/decomp/KSA/MeshViewModule.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partassetbundler, repo: ksa-game-assemblies, path: current/decomp/KSA.GlbImport/PartAssetBundler.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.GlbImport/PartAssetBundler.cs', title: 'current/decomp/KSA.GlbImport/PartAssetBundler.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksacars-ksacarsassets, repo: KSACars, path: src/KSACars/KSACarsAssets.xml, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/KSACarsAssets.xml', title: 'KSACars: src/KSACars/KSACarsAssets.xml'}
- {id: ksa-meshglassindirect, repo: ksa-game-assemblies, path: current/Content/Core/Shaders/Mesh/MeshGlassIndirect.frag, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshGlassIndirect.frag', title: current/Content/Core/Shaders/Mesh/MeshGlassIndirect.frag (build 2026.10.10.5554)}
- {id: ksacars-mod, repo: KSACars, path: src/KSACars/mod.toml, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/mod.toml', title: 'KSACars: src/KSACars/mod.toml'}
- {id: ksarmory-ksarmoryassets, repo: KSArmory, path: src/KSArmory/KSArmoryAssets.xml, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryAssets.xml', title: 'KSArmory: src/KSArmory/KSArmoryAssets.xml'}
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksarmory-ksarmorygamedata, repo: KSArmory, path: src/KSArmory/KSArmoryGameData.xml, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryGameData.xml', title: 'KSArmory: src/KSArmory/KSArmoryGameData.xml'}
- {id: ksarmory-palette, repo: KSArmory, path: tools/model/palette.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/palette.py', title: 'KSArmory: tools/model/palette.py'}
- {id: ksarmory-pantsir, repo: KSArmory, path: tools/model/pantsir.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/pantsir.py', title: 'KSArmory: tools/model/pantsir.py'}
---

A part's art is four XML elements and a GLB. A `MeshAtlas` registers every glTF mesh by name, a `PbrMaterial` binds the textures, a `SubPart` pairs a mesh with a material (and an editor
preview mesh), and a `Part` instances the subparts at positions in part space. Core's own asset files are generated this way from GLBs by the game's `GlbImport` bundler. The part's
simulation data (mass, colliders, connectors) lives in a separate `PartGameData` and is the sibling topic [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md).

## Engine background

- `MeshAtlasFileReference.DoLoad`: one `MeshReference` per glTF mesh, `Id` = mesh name, node transforms never read, a duplicate id reuses the registered mesh
  ([current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L50)).
- `PartTemplate` / `SubPartTemplate` / `PartInstance` / `TransformReference`: the part tree, `InstanceOf`, XYZ-radian rotations ([current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L12-L125), [current/decomp/KSA/SubPartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SubPartTemplate.cs),
  [current/decomp/KSA/PartInstance.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartInstance.cs#L8-L40), [current/decomp/KSA/TransformReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs#L7-L40)).
- Module templates: `PartModelModule.Template` (`PartModel`), `PartModelGlassModule.Template` (`PartModelGlass`), `MeshViewModule.Template` (`MeshView`), registered by `[XmlType]` name
  ([current/decomp/KSA/PartModelModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelModule.cs#L17-L42), [current/decomp/KSA/PartModelGlassModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelGlassModule.cs#L9-L26), [current/decomp/KSA/MeshViewModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshViewModule.cs#L8-L18)).
- `KSA.GlbImport.PartAssetBundler`: the game's GLB-to-XML generator that Core's `*Assets.xml` files come from ([current/decomp/KSA.GlbImport/PartAssetBundler.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.GlbImport/PartAssetBundler.cs#L22-L188)).
- Phase: `startup:asset-load`; game data merges in `AttachGameData`. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Build a part from one atlas per vehicle with subparts for moving bodies, glass and hidden doors](add-a-part-model-with-glb-and-pbr-textures-1.md) | KSACars | One atlas per vehicle, one `SubPart` per moving body, `PartModelGlass` window and hidden mesh-less subparts | `startup:asset-load` | Everything animatable, but many subparts and per-body pivots |
| [Share one palette atlas across parts, add _VM preview twins and keep subpart ids apart](add-a-part-model-with-glb-and-pbr-textures-2.md) | KSArmory | Shared palette atlas, `_VM` preview twins, namespaced subpart ids, Assets/GameData file split | `startup:asset-load` | Few textures for generated parts; per-body materials for hand-modelled art |

## See also

- [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md), [Define articulated subparts and mounts, animate and hide them from code](../../../vehicles-and-parts/parts/define-and-animate-subparts/overview.md), [Change a shipped part without breaking saves](../../../vehicles-and-parts/parts/evolve-a-shipped-part-without-breaking-saves/overview.md),
  [Export or generate a GLB that KSA loads correctly](../export-glb-from-blender-for-ksa/overview.md), [Validate asset XML ids and paths before launching the game (offline)](../../validation/validate-asset-xml-references/overview.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../declare-gltf-and-pbr-material-assets/overview.md), [Know which asset XML elements the game accepts and what they load](../../asset-xml/asset-xml-element-reference/overview.md)
- [Car part assets: GLB atlases, PBR materials and subparts](../../../../mods/ksacars/features/car-part-assets-glb-pbr.md), [Weapon parts as inert KSA parts split into an Assets file and a GameData file](../../../../mods/ksarmory/features/weapon-part-definitions-xml.md)
