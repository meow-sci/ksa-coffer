---
type: Game Feature
title: Resolve asset ids and file paths correctly across mods
description: How the global asset registry, first-wins Id registration and Mod.GetPath path resolution behave, with a layout for your own assets and a way to reach another mod's or Core's files
topic: resolve-asset-ids-and-mod-relative-paths
category: assets
group: asset-xml
approaches: 2
demonstrated_by: [mods/ksacars/features/car-part-assets-glb-pbr, mods/ksagolf/features/prop-and-course-asset-xml, mods/realatmospheres/features/cloud-layers-in-system-xml, mods/realatmospheres/features/core-xml-entry-redirect]
game_types: [KSA.Mod, KSA.FileReference, KSA.SerializedId, KSA.ModLibrary, KSA.MeshAtlasFileReference, KSA.MeshReference]
lifecycle: ['startup:asset-load', 'startup:starmap-before-main']
tags: [xml, ids, paths, registry, mod-folder]
generated: {by: claude-code/sonnet-5.5, at: '2026-10-10T22:31:08Z'}
status: stable
repos:
- {name: KSACars, git: 'https://github.com/LaurensDeV/KSACars', ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f}
- {name: KSAGolf, git: 'https://github.com/LaurensDeV/KSAGolf.git', ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688}
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
- {name: RealAtmospheres, git: 'https://github.com/Brimfyr/RealAtmospheres.git', ref: 19dc37a55b2e359bd8eec2f5b41722ab11ae0c46}
- {name: gatOS, git: 'https://github.com/meow-sci/gatOS.git', ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-filereference, repo: ksa-game-assemblies, path: current/decomp/KSA/FileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs', title: 'current/decomp/KSA/FileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-mod, repo: ksa-game-assemblies, path: current/decomp/KSA/Mod.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs', title: 'current/decomp/KSA/Mod.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-meshatlasfilereference, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshAtlasFileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs', title: 'current/decomp/KSA/MeshAtlasFileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-serializedcollection, repo: ksa-game-assemblies, path: current/decomp/KSA/SerializedCollection.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs', title: 'current/decomp/KSA/SerializedCollection.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksacars-ksacarsassets, repo: KSACars, path: src/KSACars/KSACarsAssets.xml, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/KSACarsAssets.xml', title: 'KSACars: src/KSACars/KSACarsAssets.xml'}
- {id: ksagolf-ksagolfprops, repo: KSAGolf, path: src/KSAGolf/KSAGolfProps.xml, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfProps.xml', title: 'KSAGolf: src/KSAGolf/KSAGolfProps.xml'}
- {id: ksa-corefueltankaassets, repo: ksa-game-assemblies, path: current/Content/Core/CoreFuelTankAAssets.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/CoreFuelTankAAssets.xml', title: current/Content/Core/CoreFuelTankAAssets.xml (build 2026.10.10.5554)}
- {id: ksarmory-ksarmoryassets, repo: KSArmory, path: src/KSArmory/KSArmoryAssets.xml, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryAssets.xml', title: 'KSArmory: src/KSArmory/KSArmoryAssets.xml'}
- {id: ksagolf-validate-parts, repo: KSAGolf, path: tools/validate-parts.py, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/validate-parts.py', title: 'KSAGolf: tools/validate-parts.py'}
- {id: ksagolf-attachmentmesh, repo: KSAGolf, path: src/KSAGolf/Ksa/AttachmentMesh.cs, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/AttachmentMesh.cs', title: 'KSAGolf: src/KSAGolf/Ksa/AttachmentMesh.cs'}
- {id: ksagolf-ksagolfcourse, repo: KSAGolf, path: src/KSAGolf/KSAGolfCourse.xml, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfCourse.xml', title: 'KSAGolf: src/KSAGolf/KSAGolfCourse.xml'}
- {id: ksa-partmodelmodule, repo: ksa-game-assemblies, path: current/decomp/KSA/PartModelModule.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelModule.cs', title: 'current/decomp/KSA/PartModelModule.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-filepath, repo: ksa-game-assemblies, path: current/decomp/Core.Files.Paths/Filepath.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core.Files.Paths/Filepath.cs', title: 'current/decomp/Core.Files.Paths/Filepath.cs (decompiled, build 2026.10.10.5554)'}
- {id: realatmospheres-payloads, repo: RealAtmospheres, path: Payloads.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/Payloads.cs', title: 'RealAtmospheres: Payloads.cs'}
- {id: realatmospheres-shadowbuilder, repo: RealAtmospheres, path: ShadowBuilder.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/ShadowBuilder.cs', title: 'RealAtmospheres: ShadowBuilder.cs'}
- {id: gatos-corelaseraassets, repo: gatOS, path: docs/examples/CoreLaserAAssets.xml, resource: 'https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/docs/examples/CoreLaserAAssets.xml', title: 'gatOS: docs/examples/CoreLaserAAssets.xml'}
- {id: ksa-meshreference, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshReference.cs', title: 'current/decomp/KSA/MeshReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-pbrmaterialreference, repo: ksa-game-assemblies, path: current/decomp/KSA/PbrMaterialReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs', title: 'current/decomp/KSA/PbrMaterialReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: realatmospheres-modmain, repo: RealAtmospheres, path: ModMain.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/ModMain.cs', title: 'RealAtmospheres: ModMain.cs'}
---

Two rules govern every asset XML a mod ships. A `Path` is joined to the mod folder (the folder containing `mod.toml`),
not to the XML file, and a rooted path escapes the folder. An `Id` is a key in a registry shared by all mods and Core,
and the first registration of a key wins silently. This topic turns those into a layout and naming scheme, and shows
how to point XML at files that belong to someone else.

## Engine background

- `FileReference`: `Path` attribute (`LocalPath`), `ModPath` through `Mod.GetPath`, Id defaults to the absolute path
  when none is given, an empty `Path` makes a reference, a refused registration downgrades to a reference
  ([current/decomp/KSA/FileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs#L10-L72)).
- `Mod.GetPath` and `DirectoryPath` ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L100-L125), [current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L389-L392)).
- `MeshAtlasFileReference.DoLoad`: Id = glTF mesh name, a duplicate reuses the registered mesh
  ([current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L50)).
- `ModLibrary.Register` / `Get<T>` / `TryGet<T>` and `SerializedCollection.Register` (first wins)
  ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L575-L776), [current/decomp/KSA/SerializedCollection.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs#L20-L33)).
- Phase: `startup:asset-load`, see [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Lay out mod-folder-relative paths and prefixed global asset ids](resolve-asset-ids-and-mod-relative-paths-1.md) | KSACars, KSAGolf | Mod-folder-relative paths, mod-prefixed ids, case-exact names, ids looked up by code | `startup:asset-load` | Simple and portable; ids are global, so the prefix is your only protection |
| [Reach another mod's or Core's files with absolute paths and Id-only references](resolve-asset-ids-and-mod-relative-paths-2.md) | RealAtmospheres | Absolute paths to files outside the mod folder, existence gates, Id-only references to Core assets | `startup:starmap-before-main`, `startup:asset-load` | Reaches anything on disk; machine-specific, so only for generated copies |

## See also

- [Know which asset XML elements the game accepts and what they load](../asset-xml-element-reference/overview.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../../models-and-textures/declare-gltf-and-pbr-material-assets/overview.md), [Redirect the game to patched copies of its XML and coordinate edits between mods](../../xml-patching/redirect-game-xml-loading/overview.md),
  [Ship assets and code in one mod folder and find it at runtime](../../../getting-started/loader/ship-content-and-code-in-one-mod/overview.md), [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md)
- [Car part assets: GLB atlases, PBR materials and subparts](../../../../mods/ksacars/features/car-part-assets-glb-pbr.md), [Prop and course asset XML](../../../../mods/ksagolf/features/prop-and-course-asset-xml.md), [Cloud layers in the system XML](../../../../mods/realatmospheres/features/cloud-layers-in-system-xml.md)
