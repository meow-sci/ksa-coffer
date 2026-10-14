---
type: Mod Feature
title: Import native animation rigs and bake easing into linear GLB samples
description: Read named animation hierarchies and export per-channel easing as dense linear samples with explicit approximation limits
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - animation-baking
  - curve-fitting
game_types:
  - KSA.KeyframeAnimationData
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
  - id: flexo-src-ksa-animationimport
    repo: flexo
    path: src/ksa/animationImport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts
    title: src/ksa/animationImport.ts
  - id: flexo-src-ksa-animationrig
    repo: flexo
    path: src/ksa/animationRig.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts
    title: src/ksa/animationRig.ts
  - id: flexo-src-ksa-exportanimationglb
    repo: flexo
    path: src/ksa/exportAnimationGlb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts
    title: src/ksa/exportAnimationGlb.ts
  - id: ksa-current-decomp-ksa-keyframeanimationdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KeyframeAnimationData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs
    title: current/decomp/KSA/KeyframeAnimationData.cs
  - id: flexo-easing-fit
    repo: flexo
    path: src/ksa/easingFit.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts
    title: src/ksa/easingFit.ts
  - id: flexo-part-import
    repo: flexo
    path: src/state/partImport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partImport.ts
    title: src/state/partImport.ts
---

Flexo can bring existing KSA clip hierarchies into its editor and export hand-authored easing without relying on a custom runtime animation system.

## How it works

Import reads the first animation, associates node channels with known member instance IDs, and unifies channel times into pose columns. Cubic-spline output rows are reduced to their value rows, with an approximation flag recording the discarded tangents. Browser sampling interpolates position and scale and slerps rotation, applying independent easing per channel. Export leaves linear segments sparse and subdivides eased segments at the default 30 samples per second. Consecutive quaternions are put in the same hemisphere, and the GLB writer emits only LINEAR samplers with shared input accessors when time arrays match.[^flexo-src-ksa-animationimport][^flexo-src-ksa-animationrig][^flexo-src-ksa-exportanimationglb]

Whole-part import also reverse-fits dense native clips into editable Bézier segments. It tries a full moving window, then trims holds, splits large rotation arcs or poor fits, and tests reconstructed joint-local poses at the original sample times. Accepted fits must stay within 4 mm position, 2.5 degrees rotation and 0.003 scale-vector distance. Failed joints retain dense keys; boundaries from all joints are united, and de Casteljau subdivision preserves each channel’s curve where another joint introduces a boundary. The import result records per-joint outcomes; clips marked with a final-key rest pose retain that anchor.[^flexo-easing-fit][^flexo-part-import]

These are sampled local tolerances, not bounds on world-space tip error or all times between samples. The current fitter’s initial constancy test considers translation and rotation only: a scale-only clip with more than two keys can be classified as constant and compacted to its initial scale. Inspect such imports before re-export; the source does not justify a general lossless-import claim ([src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L101-L126), [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L636-L749)).

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/animationImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts#L203-L271) | First-clip import, channel union and cubic tangent loss |
| [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L101-L180) | Per-channel interpolation and adaptive sample times |
| [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L309-L348) | Quaternion continuity and varying-scale channels |
| [src/ksa/exportAnimationGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts#L68-L118) | Shared time accessors and LINEAR sampler emission |

## Snippets

```typescript
// src/ksa/exportAnimationGlb.ts L80-L87
  const samplers: { input: number; output: number; interpolation: 'LINEAR' }[] = [];
  const channels: { sampler: number; target: { node: number; path: string } }[] = [];
  for (const ch of rig.channels) {
    const input = inputAccessor(ch.times);
    const output = addAccessor(ch.values, ch.path === 'rotation' ? 'VEC4' : 'VEC3', false);
    samplers.push({ input, output, interpolation: 'LINEAR' });
    channels.push({ sampler: samplers.length - 1, target: { node: ch.node, path: ch.path } });
  }
```

## Game APIs touched

KSA.KeyframeAnimationData.Template reads the first animation from the file.[^ksa-current-decomp-ksa-keyframeanimationdata]

## Pitfalls and version notes

Imported cubic-spline motion between keys is approximate. STEP data can be sampled during import, but the emitted representation is linear; do not promise a lossless arbitrary glTF animation round-trip. This specialized KSA animation importer is distinct from general model import and should not be described as importing every DCC skeletal animation.

## See also

- [keyframe animation authoring](keyframe-animation-authoring.md)
- [gltf model import](gltf-model-import.md)
- [Author and import keyframe clips and bake native GLB animations](../../../howto/vehicles-and-parts/parts/define-and-animate-subparts/define-and-animate-subparts-5.md) - how-to article demonstrating this feature

[^flexo-src-ksa-animationimport]: [src/ksa/animationImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts#L203-L271)
[^flexo-src-ksa-animationrig]: [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L309-L348)
[^flexo-src-ksa-exportanimationglb]: [src/ksa/exportAnimationGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts#L68-L118)
[^ksa-current-decomp-ksa-keyframeanimationdata]: [current/decomp/KSA/KeyframeAnimationData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs#L63-L100)

[^flexo-easing-fit]: [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L264-L390)

[^flexo-part-import]: [src/state/partImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partImport.ts#L49-L90)
