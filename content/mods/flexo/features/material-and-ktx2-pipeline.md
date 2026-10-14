---
type: Mod Feature
title: Build KSA material channels and KTX2 textures in the browser
description: Convert images and scalar surface choices into explicit diffuse, normal and packed ORM KTX2 textures
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - ktx2-texture
  - channel-packing
game_types:
  - KSA.PbrMaterialReference
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:45:35Z
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
  - id: flexo-src-ktx-encodektx2
    repo: flexo
    path: src/ktx/encodeKtx2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts
    title: src/ktx/encodeKtx2.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
  - id: flexo-src-three-materialfactory
    repo: flexo
    path: src/three/MaterialFactory.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts
    title: src/three/MaterialFactory.ts
  - id: flexo-src-ktx-channeltransforms
    repo: flexo
    path: src/ktx/channelTransforms.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts
    title: src/ktx/channelTransforms.ts
  - id: ksa-current-decomp-ksa-pbrmaterialreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PbrMaterialReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs
    title: current/decomp/KSA/PbrMaterialReference.cs
  - id: ksa-current-content-core-shaders-mesh-meshindirect
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    title: current/Content/Core/Shaders/Mesh/MeshIndirect.frag
  - id: flexo-import-materials
    repo: flexo
    path: src/ksa/importMaterials.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts
    title: src/ksa/importMaterials.ts
  - id: flexo-image-mips
    repo: flexo
    path: src/ktx/decodeImage.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/decodeImage.ts
    title: src/ktx/decodeImage.ts
---

Flexo turns imported images or authored scalar colors into standalone game textures. It keeps material definitions separate from meshes so multiple SubParts can share one surface definition.

## How it works

The material layer represents base color, normal strength and occlusion/roughness/metalness as scalar or image inputs. Export packs ORM channels and supplies explicit textures through PbrMaterial declarations. Image decoding builds a complete mip chain with byte-space 2×2 box filtering; the KTX2 encoder packages those supplied levels as RGBA8 UNORM with linear transfer metadata and optional per-level Zstd supercompression. Solid values can be encoded as one texel. Diffuse bytes retain their color encoding because the game shader performs the diffuse decode itself. Browser preview selects texture color space by usage and applies normal-map conventions separately.[^flexo-src-ktx-encodektx2][^flexo-src-ksa-assetsxmlserializer][^flexo-src-three-materialfactory][^flexo-src-ktx-channeltransforms]

For imported glTF, base-color multipliers are baked after decoding sRGB to linear and the result is encoded back to sRGB bytes. Occlusion and metallic/roughness inputs are packed into R/G/B with their factors; normal strength follows the normal encoding path. Generated images are retained as source PNG bytes so later edits can regenerate KTX2. This factor baking matters because the exported PBR data uses texture references, not arbitrary glTF scalar fields.[^flexo-import-materials][^flexo-image-mips]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L24-L132) | UNORM RGBA8 mip containers with optional Zstd |
| [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L174-L208) | Separate PBR material declarations and texture paths |
| [src/three/MaterialFactory.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts#L30-L103) | Scalar/map channels and preview settings |
| [src/ktx/channelTransforms.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts#L1-L109) | Channel normalization and packing |

## Snippets

```typescript
// src/ktx/encodeKtx2.ts L63-L76
  const container = createDefaultContainer();
  container.vkFormat = VK_FORMAT_R8G8B8A8_UNORM;
  container.typeSize = 1;
  container.pixelWidth = image.width;
  container.pixelHeight = image.height;
  container.pixelDepth = 0;
  container.layerCount = 0;
  container.faceCount = 1;
  // ktx-parse's write() emits exactly `levelCount` levels — it does NOT infer the
  // count from the levels array — so it must equal the mip chain length.
  container.levelCount = image.levels.length;
  container.supercompressionScheme = useZstd
    ? KHR_SUPERCOMPRESSION_ZSTD
    : KHR_SUPERCOMPRESSION_NONE;
```

## Game APIs touched

KSA.PbrMaterialReference declares diffuse, normal, ORM, emissive, thin-film and alpha slots.[^ksa-current-decomp-ksa-pbrmaterialreference]

The KSA mesh shader gamma-decodes diffuse samples.[^ksa-current-content-core-shaders-mesh-meshindirect]

## Pitfalls and version notes

Zstd reduces download size but this output is not BC7 block-compressed texture memory. Do not label it UASTC merely because the built-in preview assets use a transcoder. Material authoring does not expose every slot available in the game schema. Matching channel conventions still requires visual checks for normal orientation, mid-tone brightness and lighting under the target build.

## See also

- [emissive paint and ramp baking](emissive-paint-and-ramp-baking.md)
- [gltf model import](gltf-model-import.md)
- [demand driven preview](demand-driven-preview.md)
- [Author PBR textures and bake emissive paint into native material assets](../../../howto/assets/models-and-textures/declare-gltf-and-pbr-material-assets/declare-gltf-and-pbr-material-assets-5.md) - how-to article demonstrating this feature

[^flexo-src-ktx-encodektx2]: [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L24-L132)
[^flexo-src-ksa-assetsxmlserializer]: [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L174-L208)
[^flexo-src-three-materialfactory]: [src/three/MaterialFactory.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts#L30-L103)
[^flexo-src-ktx-channeltransforms]: [src/ktx/channelTransforms.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts#L1-L109)
[^ksa-current-decomp-ksa-pbrmaterialreference]: [current/decomp/KSA/PbrMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs#L7-L28)
[^ksa-current-content-core-shaders-mesh-meshindirect]: [current/Content/Core/Shaders/Mesh/MeshIndirect.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag#L101-L113)

[^flexo-import-materials]: [src/ksa/importMaterials.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts#L327-L455)

[^flexo-image-mips]: [src/ktx/decodeImage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/decodeImage.ts#L29-L107)
