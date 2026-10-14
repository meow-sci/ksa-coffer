---
type: Game Feature
title: Declare glTF meshes and PBR materials in asset XML and author their texture sets
description: How native mesh and PBR material declarations combine with baked, generated or browser-authored diffuse, normal, ORM and emissive textures
topic: declare-gltf-and-pbr-material-assets
category: assets
group: models-and-textures
approaches: 5
demonstrated_by:
  - mods/ksagolf/features/prop-and-course-asset-xml
  - mods/ksacars/features/car-part-assets-glb-pbr
  - mods/ksarmory/features/blender-model-pipeline-and-checks
  - mods/ksastructures/features/generated-deep-ramp
  - mods/ksacars/features/art-and-audio-pipeline-tooling
  - mods/unscience/features/parts-now-bundle-validation
  - mods/ksagolf/features/glb-authoring-and-mesh-checks
  - mods/flexo/features/material-and-ktx2-pipeline
  - mods/flexo/features/emissive-paint-and-ramp-baking
game_types:
  - KSA.AssetBundle
  - KSA.Gltf2Reference
  - KSA.PbrMaterialReference
  - KSA.TextureReference
  - KSA.TexturePowerReference
  - KSA.FileReference
  - KSA.ModLibrary
  - KSA.TextureCategory
lifecycle:
  - startup:asset-load
  - startup:all-mods-loaded
  - tool:authoring
  - tool:build
tags:
  - gltf
  - pbr
  - material
  - texture
  - authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:48:15Z
status: stable
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-gltf2reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Gltf2Reference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Gltf2Reference.cs
    title: current/decomp/KSA/Gltf2Reference.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-pbrmaterialreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PbrMaterialReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs
    title: current/decomp/KSA/PbrMaterialReference.cs
  - id: ksa-texturereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TextureReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs
    title: current/decomp/KSA/TextureReference.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-partmodel
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartModel.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModel.cs
    title: current/decomp/KSA/PartModel.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-gpumaterialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GpuMaterialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuMaterialSystem.cs
    title: current/decomp/KSA/GpuMaterialSystem.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-modlibrary
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs
    title: current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)
  - id: ksagolf-ksagolfcourse
    repo: KSAGolf
    path: src/KSAGolf/KSAGolfCourse.xml
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfCourse.xml
    title: "KSAGolf: src/KSAGolf/KSAGolfCourse.xml"
  - id: ksagolf-ksagolfprops
    repo: KSAGolf
    path: src/KSAGolf/KSAGolfProps.xml
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/KSAGolfProps.xml
    title: "KSAGolf: src/KSAGolf/KSAGolfProps.xml"
  - id: ksagolf-attachmentmesh
    repo: KSAGolf
    path: src/KSAGolf/Ksa/AttachmentMesh.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/AttachmentMesh.cs
    title: "KSAGolf: src/KSAGolf/Ksa/AttachmentMesh.cs"
  - id: ksa-gamesettings
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameSettings.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSettings.cs
    title: current/decomp/KSA/GameSettings.cs (decompiled, build 2026.10.10.5554)
  - id: ksagolf-validate-parts
    repo: KSAGolf
    path: tools/validate-parts.py
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/validate-parts.py
    title: "KSAGolf: tools/validate-parts.py"
  - id: unscience-bundlevalidatorrulesschema
    repo: unscience
    path: parts-now.lib/Runtime/BundleValidatorRulesSchema.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/BundleValidatorRulesSchema.cs
    title: "unscience: parts-now.lib/Runtime/BundleValidatorRulesSchema.cs"
  - id: ksacars-skill
    repo: KSACars
    path: .claude/skills/ksa-blender/SKILL.md
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/.claude/skills/ksa-blender/SKILL.md
    title: "KSACars: .claude/skills/ksa-blender/SKILL.md"
  - id: ksacars-dilate-atlas
    repo: KSACars
    path: tools/model/dilate-atlas.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/dilate-atlas.py
    title: "KSACars: tools/model/dilate-atlas.py"
  - id: ksacars-ksacarsassets
    repo: KSACars
    path: src/KSACars/KSACarsAssets.xml
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/KSACarsAssets.xml
    title: "KSACars: src/KSACars/KSACarsAssets.xml"
  - id: ksa-texturemanifest
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TextureManifest.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureManifest.cs
    title: current/decomp/KSA/TextureManifest.cs (decompiled, build 2026.10.10.5554)
  - id: ksagolf-dilate-atlas
    repo: KSAGolf
    path: tools/model/dilate-atlas.py
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/model/dilate-atlas.py
    title: "KSAGolf: tools/model/dilate-atlas.py"
  - id: ksarmory-palette
    repo: KSArmory
    path: tools/model/palette.py
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/palette.py
    title: "KSArmory: tools/model/palette.py"
  - id: ksarmory-pantsir
    repo: KSArmory
    path: tools/model/pantsir.py
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/pantsir.py
    title: "KSArmory: tools/model/pantsir.py"
  - id: ksarmory-palette-2
    repo: KSArmory
    path: tools/model/palette.json
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/model/palette.json
    title: "KSArmory: tools/model/palette.json"
  - id: ksarmory-ksarmoryassets
    repo: KSArmory
    path: src/KSArmory/KSArmoryAssets.xml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryAssets.xml
    title: "KSArmory: src/KSArmory/KSArmoryAssets.xml"
  - id: ksastructures-office-deep
    repo: KSAStructures
    path: tools/model/office-deep.py
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/model/office-deep.py
    title: "KSAStructures: tools/model/office-deep.py"
  - id: ksa-filereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FileReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs
    title: current/decomp/KSA/FileReference.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-staticobjectmodel
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObjectModel.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectModel.cs
    title: current/decomp/KSA/StaticObjectModel.cs (decompiled, build 2026.10.10.5554)
  - id: ksastructures-ksastructuresoffice
    repo: KSAStructures
    path: src/KSAStructures/KSAStructuresOffice.xml
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/KSAStructuresOffice.xml
    title: "KSAStructures: src/KSAStructures/KSAStructuresOffice.xml"
  - id: ksa-current-content-core-shaders-mesh-meshindirect
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    title: current/Content/Core/Shaders/Mesh/MeshIndirect.frag
  - id: flexo-src-ktx-encodektx2
    repo: flexo
    path: src/ktx/encodeKtx2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts
    title: src/ktx/encodeKtx2.ts
  - id: flexo-src-ktx-glowcomposite
    repo: flexo
    path: src/ktx/glowComposite.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts
    title: src/ktx/glowComposite.ts
  - id: flexo-src-ksa-importmaterials
    repo: flexo
    path: src/ksa/importMaterials.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts
    title: src/ksa/importMaterials.ts
  - id: flexo-src-ktx-channeltransforms
    repo: flexo
    path: src/ktx/channelTransforms.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts
    title: src/ktx/channelTransforms.ts
  - id: flexo-src-ktx-decodeimage
    repo: flexo
    path: src/ktx/decodeImage.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/decodeImage.ts
    title: src/ktx/decodeImage.ts
  - id: flexo-src-ui-glowpaintdialog
    repo: flexo
    path: src/ui/GlowPaintDialog.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx
    title: src/ui/GlowPaintDialog.tsx
  - id: flexo-src-ktx-glowramp
    repo: flexo
    path: src/ktx/glowRamp.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowRamp.ts
    title: src/ktx/glowRamp.ts
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
---

A mod that needs a mesh and a look can declare them directly: `<GltfFile>` for the mesh and `<PbrMaterial>` for its textures. Parts and static objects pair them by id in XML; props
and ghost tints pair them in code. Either way the textures are a Diffuse, Normal and AoRoughMetal set (plus optional Emissive, ThinFilm and Alpha), and authoring that set is
where most of the time goes.

## Engine background

- `Gltf2Reference` (`GltfFile`): `Source`, `Skeleton`, `Image`, `Material`, `Usage`; registers in the glTF table under its `Id` ([current/decomp/KSA/Gltf2Reference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Gltf2Reference.cs#L7-L60)).
- `PbrMaterialReference` (`PbrMaterial`): `Diffuse`, `Normal`, `AoRoughMetal`, `Emissive`, `ThinFilm`, `Alpha`; an element with none of the first three is a reference
  ([current/decomp/KSA/PbrMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs#L7-L94)).
- `TextureReference`: `Category`, `IsVirtual`, optional sidecar `.toml`, loaded by `DoLoad` and bound later; a texture that loses id registration is a reference and keeps handle 0
  ([current/decomp/KSA/TextureReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs#L20-L156)).
- The part and static-object render paths read the three main handles without a null check ([current/decomp/KSA/PartModel.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModel.cs#L516-L523)); `GpuMaterialSystem` falls back to a default
  texture ([current/decomp/KSA/GpuMaterialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuMaterialSystem.cs#L67-L82)).
- Registries: `ModLibrary.AllGltfs`, `AllMaterials`, `AllMeshes` ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L581-L615)).
- Phase: `startup:asset-load`. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

Browser-authored materials use the same native slots. Flexo keeps color bytes and data channels distinct, encodes RGBA8 UNORM KTX2 with optional Zstd, and composites painted color plus a scalar emissive mask. The editable ramp remains project metadata. [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L24-L111) [src/ktx/glowComposite.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts#L115-L165)

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Declare bare GltfFile and PbrMaterial assets and pair them by id in code](declare-gltf-and-pbr-material-assets-1.md) | KSAGolf | Bare `GltfFile` and `PbrMaterial`, one shared atlas and material for many meshes, ghost tints, paired by id in code | `startup:asset-load` | Lightest way to get a mesh into the renderer; no parts, no collisions from XML |
| [Bake diffuse, normal, ORM and emissive maps from Blender and dilate the atlas](declare-gltf-and-pbr-material-assets-2.md) | KSACars | Bake diffuse, normal, ORM and emissive from Blender over a key colour and dilate the atlas | `startup:asset-load` | Full painted PBR; many ways to fail quietly, needs offline tools |
| [Generate a flat-swatch palette atlas with a JSON swatch map](declare-gltf-and-pbr-material-assets-3.md) | KSArmory | Generated flat-swatch palette atlas with a JSON swatch map, per-face box projection | `startup:asset-load` | Deterministic and diffable; no surface detail |
| [Emit flat-colour textures from the same script that generates the geometry](declare-gltf-and-pbr-material-assets-4.md) | KSAStructures | Flat-colour textures emitted by the geometry script, one set per material | `startup:asset-load` | Geometry, UVs and textures cannot drift; no Blender; still one set per material |
| [5: Author PBR textures and bake emissive paint into native material assets](declare-gltf-and-pbr-material-assets-5.md) | Flexo | `xml-asset`, `ktx2-texture`, `channel-packing`, `texture-painting`, `texture-compositing` | `tool:authoring`, `tool:build` | Create and paint maps without a DCC tool; emitted RGBA8 textures and scalar emission have different limits from block-compressed or custom-shader materials |

## See also

- [Know which asset XML elements the game accepts and what they load](../../asset-xml/asset-xml-element-reference/overview.md), [Resolve asset ids and file paths correctly across mods](../../asset-xml/resolve-asset-ids-and-mod-relative-paths/overview.md), [Add a part's art with its own GLB model and PBR textures](../add-a-part-model-with-glb-and-pbr-textures/overview.md),
  [Export or generate a GLB that KSA loads correctly](../export-glb-from-blender-for-ksa/overview.md), [Import GLB models and their materials at runtime](../import-glb-models-at-runtime/overview.md), [Composite an image over a stock texture](../composite-png-over-stock-texture/overview.md),
  [Check GLB meshes offline: z-fighting, degenerate UVs, names and bounds](../../validation/find-z-fighting-and-degenerate-uvs-in-glb/overview.md), [Recolour vessel parts and kittens with a patched part shader](../../../rendering/textures-and-decals/paint-vessel-parts-with-custom-colours/overview.md)
- [Prop and course asset XML](../../../../mods/ksagolf/features/prop-and-course-asset-xml.md), [Car part assets: GLB atlases, PBR materials and subparts](../../../../mods/ksacars/features/car-part-assets-glb-pbr.md), [Headless Blender model generation and offline GLB checks](../../../../mods/ksarmory/features/blender-model-pipeline-and-checks.md),
  [A generated spiral ramp - mesh, shadow caster, box colliders and lamps from one script](../../../../mods/ksastructures/features/generated-deep-ramp.md)
- [Attach a prop to a kitten's hand or another bone at runtime, building the prop mesh from mod assets](../../../kittens/appearance/attach-a-prop-to-a-kitten-bone/overview.md) - related topic
- [Draw your own meshes through the engine's mesh renderers](../../../rendering/meshes/draw-mod-meshes-with-the-engine-renderers/overview.md) - related topic
