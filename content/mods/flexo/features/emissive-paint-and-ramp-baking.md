---
type: Mod Feature
title: Paint emissive masks and bake color ramps
description: Create glow textures from a blank paint surface or image and bake editable ramps into diffuse and grayscale emissive outputs
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - ktx2-texture
  - texture-painting
  - texture-compositing
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
  - id: flexo-src-ui-glowpaintdialog
    repo: flexo
    path: src/ui/GlowPaintDialog.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx
    title: src/ui/GlowPaintDialog.tsx
  - id: flexo-src-ktx-glowcomposite
    repo: flexo
    path: src/ktx/glowComposite.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts
    title: src/ktx/glowComposite.ts
  - id: flexo-src-ktx-glowramp
    repo: flexo
    path: src/ktx/glowRamp.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowRamp.ts
    title: src/ktx/glowRamp.ts
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
  - id: flexo-layered-glow
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Flexo’s glow painter creates an image in the browser, including from an initially blank canvas. Color, coverage and emission strength remain separate inputs so a painted shape can become both surface color and a game-compatible emissive mask.

## How it works

A glow bitmap stores color in RGB and its grayscale key in alpha. Whole-surface glow can synthesize a solid bitmap; painted or imported glow provides detailed keys. At composite time, an optional color ramp maps each key to an RGB value. Coverage blends that color over the base diffuse, while strength produces an equal-channel grayscale mask. The outputs are ordinary textures; the editable ramp is not installed as a new game shader. Brush strokes have local undo history and applying the painter becomes one document operation.[^flexo-src-ui-glowpaintdialog][^flexo-src-ktx-glowcomposite][^flexo-src-ktx-glowramp]

The special layered-glow export is limited to transparent kitten visor meshes. It creates an additional opaque glow SubPart and parallel placement, insets that geometry toward its bounding-box center by 0.99, and leaves the glass shell as a separate piece. General imported glass meshes do not receive that duplication; their glass path does not use the emissive mask. This avoids treating arbitrary open or nonconvex imported geometry as a valid inset shell.[^flexo-layered-glow]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ui/GlowPaintDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx#L20-L42) | Canvas painting and local stroke undo |
| [src/ui/GlowPaintDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx#L139-L178) | Brush stamping and save boundary |
| [src/ktx/glowComposite.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts#L115-L165) | Diffuse-plus-mask compositing |
| [src/ktx/glowRamp.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowRamp.ts#L32-L66) | Sorted ramp stops and byte-space interpolation |

## Snippets

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

## Game APIs touched

KSA.PbrMaterialReference includes an emissive texture slot, with no arbitrary color-ramp slot.[^ksa-current-decomp-ksa-pbrmaterialreference]

The KSA mesh shader samples the emissive red channel.[^ksa-current-content-core-shaders-mesh-meshindirect]

## Pitfalls and version notes

The game emissive shader reads a scalar mask; baked diffuse color is not equivalent to an arbitrary RGB emission shader. The output resolution follows the base image, so synthesized bases must be sized to preserve paint detail. Browser bloom and lighting do not prove visual parity in KSA. A project archive is required to retain editable paint and ramp data.

## See also

- [material and ktx2 pipeline](material-and-ktx2-pipeline.md)
- [cast light authoring](cast-light-authoring.md)
- [procedural mesh and surface authoring](procedural-mesh-and-surface-authoring.md)
- [Author PBR textures and bake emissive paint into native material assets](../../../howto/assets/models-and-textures/declare-gltf-and-pbr-material-assets/declare-gltf-and-pbr-material-assets-5.md) - how-to article demonstrating this feature

[^flexo-src-ui-glowpaintdialog]: [src/ui/GlowPaintDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/GlowPaintDialog.tsx#L139-L178)
[^flexo-src-ktx-glowcomposite]: [src/ktx/glowComposite.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowComposite.ts#L115-L165)
[^flexo-src-ktx-glowramp]: [src/ktx/glowRamp.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/glowRamp.ts#L32-L66)
[^ksa-current-decomp-ksa-pbrmaterialreference]: [current/decomp/KSA/PbrMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs#L12-L28)
[^ksa-current-content-core-shaders-mesh-meshindirect]: [current/Content/Core/Shaders/Mesh/MeshIndirect.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag#L271-L288)

[^flexo-layered-glow]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L762-L834)
