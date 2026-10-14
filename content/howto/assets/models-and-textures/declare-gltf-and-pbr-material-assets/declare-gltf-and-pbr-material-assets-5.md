---
type: How-To
title: Author PBR textures and bake emissive paint into native material assets
description: Convert browser-authored colors, images and glow paint into native PBR texture slots using RGBA8 KTX2 and baked emissive masks
topic: declare-gltf-and-pbr-material-assets
category: assets
group: models-and-textures
approach: 5
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/material-and-ktx2-pipeline
  - mods/flexo/features/emissive-paint-and-ramp-baking
techniques:
  - xml-asset
  - ktx2-texture
  - channel-packing
  - texture-painting
  - texture-compositing
game_types:
  - KSA.PbrMaterialReference
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:48:15Z
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

Use this approach to let an author make textures in the browser, import existing maps or paint a glow from a blank canvas. Flexo turns those editable inputs into ordinary texture files and PbrMaterial XML; the target mod needs no custom painting or ramp shader.

## Background: how the game does it

The game material schema exposes Diffuse, Normal, AoRoughMetal, Emissive, ThinFilm and Alpha slots in [current/decomp/KSA/PbrMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs#L7-L28). The mesh shader gamma-decodes diffuse samples and reads emissive from the red channel: [current/Content/Core/Shaders/Mesh/MeshIndirect.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag#L101-L113) and [current/Content/Core/Shaders/Mesh/MeshIndirect.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag#L271-L288). An editable RGB ramp must therefore be baked into supported texture outputs.

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Separate color channels from scalar data

Represent base color, normal strength, occlusion, roughness and metalness independently. Preserve diffuse’s encoded color bytes; treat ORM and masks as linear data. When importing a glTF base-color factor, decode color to linear, multiply there and re-encode; do not multiply the stored color bytes directly. [src/ksa/importMaterials.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts#L173-L186) Convert ordinary uploaded normal maps once by flipping X, applying strength around the byte midpoint and reconstructing Z, then rebuild mipmaps.

```typescript
// src/ktx/channelTransforms.ts L48-L62
export function transformNormalLevel(level: ImageLevel, strength: number): ImageLevel {
  const out = new Uint8Array(level.rgba.length);
  for (let i = 0; i < level.rgba.length; i += 4) {
    const x = 255 - level.rgba[i]; // KSA shader: normalMap.x = -normalMap.x
    const y = level.rgba[i + 1];
    const sx = clampByte(128 + (x - 128) * strength);
    const sy = clampByte(128 + (y - 128) * strength);
    out[i] = sx;
    out[i + 1] = sy;
    out[i + 2] = reconstructZ(sx, sy);
    out[i + 3] = 255;
  }
  return { width: level.width, height: level.height, rgba: out };
}

```

[src/ktx/channelTransforms.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts#L48-L62)

### 2. Pack occlusion, roughness and metalness in the native order

Accept a grayscale map or uniform value for each component. Choose output dimensions from the largest source; write AO to R, roughness to G and metalness to B. Smaller inputs are nearest-resampled in this implementation, so choose matching source resolution when that approximation is undesirable.

```typescript
// src/ktx/channelTransforms.ts L83-L101
 */
export function packOrmLevel(ao: OrmSource, rough: OrmSource, metal: OrmSource): ImageLevel {
  const dims = [ao, rough, metal]
    .filter((s): s is { level: ImageLevel } => 'level' in s)
    .map((s) => s.level);
  const width = Math.max(1, ...dims.map((l) => l.width));
  const height = Math.max(1, ...dims.map((l) => l.height));
  const rgba = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      rgba[o] = sampleOrm(ao, x, y, width, height);
      rgba[o + 1] = sampleOrm(rough, x, y, width, height);
      rgba[o + 2] = sampleOrm(metal, x, y, width, height);
      rgba[o + 3] = 255;
    }
  }
  return { width, height, rgba };
}
```

[src/ktx/channelTransforms.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts#L83-L101)

### 3. Encode a complete UNORM KTX2 mip chain

Build the supplied mip chain through byte-space 2×2 box filtering in [src/ktx/decodeImage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/decodeImage.ts#L70-L104). Set the container to RGBA8 UNORM and linear transfer metadata even when diffuse bytes contain encoded color. The game’s shader performs the diffuse decode. Set levelCount explicitly to match the supplied mip chain, and optionally Zstd-compress each level. Solid scalar/color inputs may use one texel.

```typescript
// src/ktx/encodeKtx2.ts L63-L87
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

  // levels[0] = base (largest); ktx-parse handles the on-disk level ordering/padding.
  container.levels = [];
  for (const level of image.levels) {
    const raw = level.rgba;
    const levelData = useZstd ? await compressZstd(raw) : raw;
    container.levels.push({
      levelData,
      uncompressedByteLength: raw.byteLength,
    });
  }
```

[src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L63-L87)

### 4. Paint color and a grayscale key together

Start from a blank or imported glow bitmap. Preserve RGB as paint color and alpha as its grayscale key; the brush combines falloff and intensity into that key. Snapshot strokes for local undo, and apply the painter as one document edit.

```typescript
// src/ui/GlowPaintDialog.tsx L149-L163
    const flat = hexToRgb(color);
    const peak = eraser ? 1 : intensity;
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    const grad = ctx.createRadialGradient(x, y, 0, x, y, brush);
    for (let i = 0; i <= STAMP_STEPS; i++) {
      const t = i / STAMP_STEPS;
      const key = peak * (1 - t);
      const c = ramp && !eraser ? sampleGlowRamp(ramp, key) : flat;
      grad.addColorStop(t, `rgba(${c.r},${c.g},${c.b},${key})`);
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, brush, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
```

[src/ui/GlowPaintDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx#L149-L163)

### 5. Bake coverage, strength and the optional ramp

Normalize ramp stops into ascending positions. At each output pixel, use the bitmap alpha to select ramp color, blend that color over diffuse by key × coverage, and emit key × strength as a grayscale mask. Choose a sufficiently detailed base image because the composite follows the base dimensions. [src/ktx/glowRamp.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowRamp.ts#L32-L66)

```typescript
// src/ktx/glowComposite.ts L148-L161
      const key = glow.rgba[gi + 3] / 255;
      const color = ramp
        ? sampleGlowRamp(ramp, key)
        : { r: glow.rgba[gi], g: glow.rgba[gi + 1], b: glow.rgba[gi + 2] };
      const t = key * coverage;
      diffuse[bi] = lerp8(base.rgba[bi], color.r, t);
      diffuse[bi + 1] = lerp8(base.rgba[bi + 1], color.g, t);
      diffuse[bi + 2] = lerp8(base.rgba[bi + 2], color.b, t);
      diffuse[bi + 3] = 255;
      const m = Math.round(key * strength * 255);
      mask[bi] = m;
      mask[bi + 1] = m;
      mask[bi + 2] = m;
      mask[bi + 3] = 255;
```

[src/ktx/glowComposite.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts#L148-L161)

### 6. Declare the texture files in a native material

Assign a stable material ID, then emit the Diffuse, Normal and AoRoughMetal paths plus Emissive when present. Give the texture references Category Vessel and point SubParts at this material identity. Save a full editable project as well as the game-facing package.

```typescript
// src/ksa/assetsXmlSerializer.ts L190-L208
    // Channel order mirrors Core: Diffuse, Normal, AoRoughMetal, then Emissive.
    for (const m of plan.materials ?? []) {
      claimId(materialIds, 'PbrMaterial', m.id);
      const mat = doc.createElement('PbrMaterial');
      mat.setAttribute('Id', m.id);
      const channels: Array<[string, string | undefined]> = [
        ['Diffuse', m.diffusePath],
        ['Normal', m.normalPath],
        ['AoRoughMetal', m.aoRoughMetalPath],
        ['Emissive', m.emissivePath],
      ];
      for (const [name, path] of channels) {
        if (!path) continue;
        const el = doc.createElement(name);
        el.setAttribute('Path', path);
        el.setAttribute('Category', 'Vessel');
        mat.appendChild(el);
      }
      assets.appendChild(mat);
```

[src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L190-L208)

## Complete example

The complete conversion chain is [src/ktx/channelTransforms.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/channelTransforms.ts#L1-L109), [src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L24-L132), [src/ktx/glowComposite.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts#L115-L165) and [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L174-L208). Begin with a solid base and constant ORM values, add one painted emissive spot, then inspect midtones, normal direction and emission in the target game.

## Variations and gotchas

Zstd supercompression reduces stored bytes; it is not BC7 or UASTC GPU block compression. A scalar emissive mask with baked diffuse color does not provide arbitrary colored emission. Glow does not automatically create a cast light. The duplicate/inset glassGlow route is limited to kitten visors; ordinary imported glass does not receive an emissive layer. [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L762-L834) The browser’s shading and bloom are aids, and native visual parity has not been tested in this documentation task.

## See also

- [Bare GltfFile and PbrMaterial assets, one shared atlas and material for many meshes](declare-gltf-and-pbr-material-assets-1.md)
- [Bake diffuse, normal, ORM and emissive maps from Blender and dilate the atlas](declare-gltf-and-pbr-material-assets-2.md)
- [Generated flat-swatch palette atlas with a JSON swatch map](declare-gltf-and-pbr-material-assets-3.md)
- [Flat-colour textures emitted by a geometry script](declare-gltf-and-pbr-material-assets-4.md)
- [Build KSA material channels and KTX2 textures in the browser](../../../../mods/flexo/features/material-and-ktx2-pipeline.md)
- [Paint emissive masks and bake color ramps](../../../../mods/flexo/features/emissive-paint-and-ramp-baking.md)
- [Know which asset XML elements the game accepts and what they load](../../asset-xml/asset-xml-element-reference/overview.md)
- [Attach a prop to a kitten's hand or another bone at runtime, building the prop mesh from mod assets](../../../kittens/appearance/attach-a-prop-to-a-kitten-bone/overview.md)
- [Draw your own meshes through the engine's mesh renderers](../../../rendering/meshes/draw-mod-meshes-with-the-engine-renderers/overview.md)
- [Export or generate a GLB that KSA loads correctly](../export-glb-from-blender-for-ksa/overview.md)
- [Resolve asset ids and file paths correctly across mods](../../asset-xml/resolve-asset-ids-and-mod-relative-paths/overview.md)
- [Import GLB models and their materials at runtime](../import-glb-models-at-runtime/overview.md)
- [Composite an image over a stock texture](../composite-png-over-stock-texture/overview.md)
- [Recolour vessel parts and kittens with a patched part shader](../../../rendering/textures-and-decals/paint-vessel-parts-with-custom-colours/overview.md)
- [Check GLB meshes offline: z-fighting, degenerate UVs, names and bounds](../../validation/find-z-fighting-and-degenerate-uvs-in-glb/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
