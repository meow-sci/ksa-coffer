---
type: Game Feature
title: Know which asset XML elements the game accepts and what they load
description: How KSA turns the XML files a mod lists under assets into registered templates and file references, with the AssetBundle element table, the registration rules and the attributes that matter
topic: asset-xml-element-reference
category: assets
group: asset-xml
approaches: 1
demonstrated_by: [mods/ksagolf/features/prop-and-course-asset-xml, mods/ksacars/features/car-part-assets-glb-pbr, mods/ksarmory/features/weapon-part-definitions-xml]
game_types: [KSA.AssetBundle, KSA.SerializedId, KSA.XmlHelper, KSA.FileReference, KSA.MeshAtlasFileReference, KSA.Gltf2Reference, KSA.PbrMaterialReference, KSA.PartTemplate]
lifecycle: ['startup:asset-load']
tags: [reference, xml, assetbundle, elements, registry]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:15:53Z'}
status: stable
repos:
- {name: KSAGolf, git: 'https://github.com/LaurensDeV/KSAGolf.git', ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688}
- {name: KSACars, git: 'https://github.com/LaurensDeV/KSACars', ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f}
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-assetbundle, repo: ksa-game-assemblies, path: current/decomp/KSA/AssetBundle.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs', title: 'current/decomp/KSA/AssetBundle.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-serializedid, repo: ksa-game-assemblies, path: current/decomp/KSA/SerializedId.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedId.cs', title: 'current/decomp/KSA/SerializedId.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-filereference, repo: ksa-game-assemblies, path: current/decomp/KSA/FileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs', title: 'current/decomp/KSA/FileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-xmlhelper, repo: ksa-game-assemblies, path: current/decomp/KSA/XmlHelper.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlHelper.cs', title: 'current/decomp/KSA/XmlHelper.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-meshatlasfilereference, repo: ksa-game-assemblies, path: current/decomp/KSA/MeshAtlasFileReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs', title: 'current/decomp/KSA/MeshAtlasFileReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksagolf-ksagolfprops, repo: KSAGolf, path: src/KSAGolf/KSAGolfProps.xml, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfProps.xml', title: 'KSAGolf: src/KSAGolf/KSAGolfProps.xml'}
- {id: ksacars-ksacarsassets, repo: KSACars, path: src/KSACars/KSACarsAssets.xml, resource: 'https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/KSACarsAssets.xml', title: 'KSACars: src/KSACars/KSACarsAssets.xml'}
- {id: ksarmory-ksarmorygamedata, repo: KSArmory, path: src/KSArmory/KSArmoryGameData.xml, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryGameData.xml', title: 'KSArmory: src/KSArmory/KSArmoryGameData.xml'}
- {id: ksa-serializedcollection, repo: ksa-game-assemblies, path: current/decomp/KSA/SerializedCollection.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs', title: 'current/decomp/KSA/SerializedCollection.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-partmodelmodule, repo: ksa-game-assemblies, path: current/decomp/KSA/PartModelModule.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelModule.cs', title: 'current/decomp/KSA/PartModelModule.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-corefueltankaassets, repo: ksa-game-assemblies, path: current/Content/Core/CoreFuelTankAAssets.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/CoreFuelTankAAssets.xml', title: current/Content/Core/CoreFuelTankAAssets.xml (build 2026.10.10.5554)}
- {id: ksagolf-ksagolfcourse, repo: KSAGolf, path: src/KSAGolf/KSAGolfCourse.xml, resource: 'https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfCourse.xml', title: 'KSAGolf: src/KSAGolf/KSAGolfCourse.xml'}
- {id: ksarmory-ksarmoryassets, repo: KSArmory, path: src/KSArmory/KSArmoryAssets.xml, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryAssets.xml', title: 'KSArmory: src/KSArmory/KSArmoryAssets.xml'}
- {id: ksa-xmlloader, repo: ksa-game-assemblies, path: current/decomp/KSA/XmlLoader.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs', title: 'current/decomp/KSA/XmlLoader.cs (decompiled, build 2026.10.10.5554)'}
---

Everything a content mod ships (meshes, textures, parts, sounds, gauges, bodies) is declared in XML files whose
root is `<Assets>`. The game deserializes each into a `KSA.AssetBundle`; the only thing in that class is a list
mapping about sixty-five element names to template classes. If an element name is not in that list, the game does
not know it. This topic is the lookup reference; the Ids and paths those elements use are
[Resolve asset ids and file paths correctly across mods](../resolve-asset-ids-and-mod-relative-paths/overview.md), and the order in which files are read is [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md).

## Engine background

- `AssetBundle` ([current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L9-L109)): the `[XmlElement]` table, and `OnDataLoad` which registers
  celestials conditionally and processes everything else outside preload.
- `SerializedId` ([current/decomp/KSA/SerializedId.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedId.cs#L6-L31)): the `Id` attribute and hash; `FileReference`
  ([current/decomp/KSA/FileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs#L10-L72)): `Path`, `ModPath`, loader queueing, and a silent downgrade to a reference
  when the Id already exists.
- `XmlHelper` ([current/decomp/KSA/XmlHelper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlHelper.cs#L17-L47)): registers every `ModuleBase.TemplateDataBase` subclass as a legal child
  of `Part` by `[XmlType]` name, so new module element names cannot be added without extending the serializer.
- `ModLibrary.Register` overloads and `Get<T>`/`TryGet<T>` ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L575-L776)): the registries behind
  each element family.
- Phase: `startup:asset-load`. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Know which asset XML elements the game accepts and what they load](asset-xml-element-reference.md) | KSAGolf, KSACars, KSArmory | The AssetBundle element table read against three real files: bare glTF and material, atlas-and-subpart parts, art/simulation file split | `startup:asset-load` | Reference, not a tutorial; sound, character and gauge elements are only listed |

## See also

- [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md), [Resolve asset ids and file paths correctly across mods](../resolve-asset-ids-and-mod-relative-paths/overview.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../../models-and-textures/declare-gltf-and-pbr-material-assets/overview.md),
  [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md), [Register a custom XML asset type or inject new child elements into game XML](../register-custom-xml-asset-type/overview.md), [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md)
- [Prop and course asset XML](../../../../mods/ksagolf/features/prop-and-course-asset-xml.md), [Car part assets: GLB atlases, PBR materials and subparts](../../../../mods/ksacars/features/car-part-assets-glb-pbr.md), [Weapon parts as inert KSA parts split into an Assets file and a GameData file](../../../../mods/ksarmory/features/weapon-part-definitions-xml.md)
