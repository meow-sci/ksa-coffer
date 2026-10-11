---
type: Game Feature
title: Export or generate a GLB that KSA loads correctly
description: The glTF export contract KSA reads (Y-up off, part space, transforms applied, node name equal to mesh name, a _VM twin, pivot-centred moving bodies) and four ways mods meet it
topic: export-glb-from-blender-for-ksa
category: assets
group: models-and-textures
approaches: 4
demonstrated_by: [mods/ksacars/features/art-and-audio-pipeline-tooling, mods/ksacars/features/car-part-assets-glb-pbr, mods/ksagolf/features/glb-authoring-and-mesh-checks, mods/ksarmory/features/blender-model-pipeline-and-checks, mods/ksastructures/features/generated-deep-ramp]
game_types: [KSA.MeshAtlasFileReference, KSA.MeshReference, KSA.Gltf2Reference, Brutal.GltfApi.GltfLoader, KSA.MeshViewModule, KSA.PartModelModule, KSA.StaticObjectTemplate, KSA.StaticSubObjectTemplate]
lifecycle: ['startup:asset-load']
tags: [glb, blender, export, contract, generation]
generated: {by: claude-code/sonnet-5.5, at: '2026-10-10T22:31:08Z'}
status: stable
repos:
- {name: KSACars, git: 'https://github.com/LaurensDeV/KSACars', ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f}
- {name: KSAGolf, git: 'https://github.com/LaurensDeV/KSAGolf.git', ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688}
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
- {name: KSAStructures, git: 'https://github.com/LaurensDeV/KSAStructures', ref: c24759358381fb10290c61f9a6980b7d832ba3d4}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-gltfloader, repo: ksa-game-assemblies, path: current/decomp/Brutal.GltfApi/GltfLoader.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.GltfApi/GltfLoader.cs', title: 'current/decomp/Brutal.GltfApi/GltfLoader.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-meshatlasfilereference, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshAtlasFileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs', title: 'current/decomp/KSA/MeshAtlasFileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partassetbundler, repo: ksa-game-assemblies, path: current/decomp/KSA.GlbImport/PartAssetBundler.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.GlbImport/PartAssetBundler.cs', title: 'current/decomp/KSA.GlbImport/PartAssetBundler.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-staticobjecttemplate, repo: ksa-game-assemblies, path: current/decomp/KSA/StaticObjectTemplate.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs', title: 'current/decomp/KSA/StaticObjectTemplate.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksacars-skill, repo: KSACars, path: .claude/skills/ksa-blender/SKILL.md, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/.claude/skills/ksa-blender/SKILL.md', title: 'KSACars: .claude/skills/ksa-blender/SKILL.md'}
- {id: ksacars-preview-glb, repo: KSACars, path: tools/model/preview-glb.py, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/preview-glb.py', title: 'KSACars: tools/model/preview-glb.py'}
- {id: ksacars-preview, repo: KSACars, path: tools/model/preview.sh, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/preview.sh', title: 'KSACars: tools/model/preview.sh'}
- {id: ksacars-checkmesh, repo: KSACars, path: tools/model/checkmesh.py, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/checkmesh.py', title: 'KSACars: tools/model/checkmesh.py'}
- {id: ksagolf-skill, repo: KSAGolf, path: .claude/skills/ksa-blender/SKILL.md, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/.claude/skills/ksa-blender/SKILL.md', title: 'KSAGolf: .claude/skills/ksa-blender/SKILL.md'}
- {id: ksagolf-ksa-modding-notes, repo: KSAGolf, path: docs/KSA-MODDING-NOTES.md, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/docs/KSA-MODDING-NOTES.md', title: 'KSAGolf: docs/KSA-MODDING-NOTES.md'}
- {id: ksagolf-readme, repo: KSAGolf, path: tools/model/README.md, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/model/README.md', title: 'KSAGolf: tools/model/README.md'}
- {id: ksagolf-checkmesh, repo: KSAGolf, path: tools/model/checkmesh.py, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/model/checkmesh.py', title: 'KSAGolf: tools/model/checkmesh.py'}
- {id: ksagolf-validate-parts, repo: KSAGolf, path: tools/validate-parts.py, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/validate-parts.py', title: 'KSAGolf: tools/validate-parts.py'}
- {id: ksarmory-import-litening, repo: KSArmory, path: tools/model/import-litening.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/import-litening.py', title: 'KSArmory: tools/model/import-litening.py'}
- {id: ksarmory-pantsir, repo: KSArmory, path: tools/model/pantsir.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/pantsir.py', title: 'KSArmory: tools/model/pantsir.py'}
- {id: ksarmory-build, repo: KSArmory, path: tools/model/build.sh, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/build.sh', title: 'KSArmory: tools/model/build.sh'}
- {id: ksarmory-validate-parts, repo: KSArmory, path: tools/validate-parts.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/validate-parts.py', title: 'KSArmory: tools/validate-parts.py'}
- {id: ksarmory-meshinfo, repo: KSArmory, path: tools/meshinfo.py, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/meshinfo.py', title: 'KSArmory: tools/meshinfo.py'}
- {id: ksastructures-office-deep, repo: KSAStructures, path: tools/model/office-deep.py, resource: 'https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/model/office-deep.py', title: 'KSAStructures: tools/model/office-deep.py'}
- {id: ksastructures-ksastructuresoffice, repo: KSAStructures, path: src/KSAStructures/KSAStructuresOffice.xml, resource: 'https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/KSAStructuresOffice.xml', title: 'KSAStructures: src/KSAStructures/KSAStructuresOffice.xml'}
- {id: ksastructures-officedeeplayout, repo: KSAStructures, path: src/KSAStructures/Sim/OfficeDeepLayout.cs, resource: 'https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Sim/OfficeDeepLayout.cs', title: 'KSAStructures: src/KSAStructures/Sim/OfficeDeepLayout.cs'}
---

KSA reads meshes out of a glTF binary by name. It does not read the node graph, so a transform left on a node is silently dropped, and a body modelled in the wrong frame or off its pivot is wrong in game in ways nothing reports. The export has to follow a contract, and
Core's own assets are generated from GLBs that follow it.

## Engine background

- `GltfLoader` (`Brutal.GltfApi`) parses the GLB; `MeshAtlasFileReference.DoLoad` registers a `MeshReference` per glTF mesh with `Id` = mesh name, ignoring nodes ([current/decomp/Brutal.GltfApi/GltfLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.GltfApi/GltfLoader.cs#L1-L35), [current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L45)).
- `KSA.GlbImport.PartAssetBundler`: the game's GLB-to-XML generator; a node not starting with `_` and not ending in `_VM` becomes a subpart, `<name>_VM` its `MeshView`, `_glass`, `_raytrace` and `_Col*` children set flags, a non-identity node transform produces a warning
  ([current/decomp/KSA.GlbImport/PartAssetBundler.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.GlbImport/PartAssetBundler.cs#L44-L62), [current/decomp/KSA.GlbImport/PartAssetBundler.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.GlbImport/PartAssetBundler.cs#L273-L345)).
- `StaticObjectTemplate` and `StaticSubObjectTemplate` for non-part world objects ([current/decomp/KSA/StaticObjectTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs#L7-L28)).
- Phase: `startup:asset-load`. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Export a part-space GLB with pivot-centred subparts and preview it headless](export-glb-from-blender-for-ksa-1.md) | KSACars | Part-space export from Blender, pivot-centred subparts, `_VM` twins, headless preview of the export | `startup:asset-load` | Full Blender workflow; source `.blend` is outside the repo |
| [Verify the export contract against Core and keep a human sign-off before unwrapping](export-glb-from-blender-for-ksa-2.md) | KSAGolf | Contract verified against Core, human geometry sign-off before unwrapping, units by drawer | `startup:asset-load` | Cheap human gate; props need centimetres and baked scale |
| [Reframe hand-modelled assets and generate hard-surface parts with headless Blender](export-glb-from-blender-for-ksa-3.md) | KSArmory | Headless Blender: reframe authored models, generate hard-surface parts from primitives, report muzzles | `startup:asset-load` | Reproducible and diffable; Blender as a Windows binary under WSL |
| [Write the GLB, textures, collider XML and C# table from one Python script (no Blender)](export-glb-from-blender-for-ksa-4.md) | KSAStructures | One Python script writes GLB, textures, collider XML and a C# table, no Blender | `startup:asset-load` | Everything in sync; the script emits axis-aligned box colliders only (slopes become steps) |

## See also

- [Check GLB meshes offline: z-fighting, degenerate UVs, names and bounds](../../validation/find-z-fighting-and-degenerate-uvs-in-glb/overview.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../declare-gltf-and-pbr-material-assets/overview.md), [Add a part's art with its own GLB model and PBR textures](../add-a-part-model-with-glb-and-pbr-textures/overview.md),
  [Define articulated subparts and mounts, animate and hide them from code](../../../vehicles-and-parts/parts/define-and-animate-subparts/overview.md), [Redirect the game to patched copies of its XML and coordinate edits between mods](../../xml-patching/redirect-game-xml-loading/overview.md), [Place a static object on a planet surface at a latitude and longitude, and keep it anchored](../../../celestials/terrain/place-static-objects-on-a-planet-surface/overview.md), [Add terrain decals from code and flatten or dig the ground under a custom site](../../../celestials/terrain/add-terrain-decals-and-dig-a-site/overview.md)
- [Art and audio pipeline tooling](../../../../mods/ksacars/features/art-and-audio-pipeline-tooling.md), [GLB authoring pipeline and mesh checks](../../../../mods/ksagolf/features/glb-authoring-and-mesh-checks.md), [Headless Blender model generation and offline GLB checks](../../../../mods/ksarmory/features/blender-model-pipeline-and-checks.md),
  [A generated spiral ramp - mesh, shadow caster, box colliders and lamps from one script](../../../../mods/ksastructures/features/generated-deep-ramp.md)
