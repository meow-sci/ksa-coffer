---
type: Mod Feature
title: Bridge KSA transforms to a three.js editor
description: Keep authoring data in KSA space and centralize Euler-order conversion plus explicit XML defaults
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - coordinate-conversion
game_types:
  - KSA.TransformReference
  - KSA.QuaternionEx
  - KSA.Vector3Reference
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:31:29Z
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
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-transformreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TransformReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs
    title: current/decomp/KSA/TransformReference.cs
  - id: ksa-current-decomp-ksa-quaternionex
    repo: ksa-game-assemblies
    path: current/decomp/KSA/QuaternionEx.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/QuaternionEx.cs
    title: current/decomp/KSA/QuaternionEx.cs
  - id: ksa-current-decomp-ksa-vector3reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vector3Reference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs
    title: current/decomp/KSA/Vector3Reference.cs
---

Flexo stores transforms in the game’s coordinates and converts only at the viewport boundary. This avoids baking an editor-specific axis convention into the exported part.

## How it works

Position and scale transfer directly. KSA XYZ Euler values are applied using three.js ZYX ordering; the same calibrated order is used for reading a gizmo transform and composing or decomposing matrices. XML serialization compares values at G6 precision before omitting default transforms. Position and rotation can omit zero axes, but a present Scale element writes all three axes: only an absent Scale element receives the game’s unit-scale fallback.[^flexo-src-three-coords][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L4-L77) | Single transform conversion boundary |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1294-L1365) | Default omission and full-axis scale serialization |

## Snippets

```typescript
// src/three/coords.ts L27-L34
// KSA's Euler "XYZ" equals three.js 'ZYX' (opposite compose order) — see above.
const EULER_ORDER = 'ZYX' as const;

export function applyPlacement(obj: THREE.Object3D, p: Transform): void {
  obj.position.set(p.position.x, p.position.y, p.position.z);
  obj.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z, EULER_ORDER);
  obj.scale.set(p.scale.x, p.scale.y, p.scale.z);
}
```

## Game APIs touched

KSA.TransformReference defaults absent scale to one and absent rotation to identity.[^ksa-current-decomp-ksa-transformreference]

KSA.QuaternionEx.CreateFromXyzRadians gives the rotation composition.[^ksa-current-decomp-ksa-quaternionex]

KSA.Vector3Reference defaults missing attributes to zero.[^ksa-current-decomp-ksa-vector3reference]

## Pitfalls and version notes

Single-axis test rotations cannot reveal a multiplication-order error; use a known assembled part with compound rotations. A partial Scale such as X=2 silently zeroes omitted axes in the game. The static-object mini app has an additional assembly-frame root transform; do not apply that mapping to ordinary part placements.

## See also

- [builtin part composition](builtin-part-composition.md)
- [static object composition](static-object-composition.md)
- [keyframe animation authoring](keyframe-animation-authoring.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-three-coords]: [src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L4-L77)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1294-L1365)
[^ksa-current-decomp-ksa-transformreference]: [current/decomp/KSA/TransformReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs#L8-L53)
[^ksa-current-decomp-ksa-quaternionex]: [current/decomp/KSA/QuaternionEx.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/QuaternionEx.cs#L178-L192)
[^ksa-current-decomp-ksa-vector3reference]: [current/decomp/KSA/Vector3Reference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs#L8-L17)
