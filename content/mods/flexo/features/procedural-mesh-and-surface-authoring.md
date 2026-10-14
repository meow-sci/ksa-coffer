---
type: Mod Feature
title: Create primitive meshes with per-face surfaces
description: Generate editable primitive geometry and bake face-specific surface choices into exported SubParts
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - procedural-geometry
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:35Z
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
  - id: flexo-src-three-primitives
    repo: flexo
    path: src/three/primitives.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts
    title: src/three/primitives.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Flexo can create box, cylinder, sphere and plane meshes without a separate modeling package. The saved primitive parameters remain editable and the exported geometry is regenerated from them.

## How it works

The geometry constructors produce indexed positions, normals and UVs. Stable face-group names identify six box faces, cylinder side and caps, or one all-surface group for a sphere or plane. Per-face UV scale and offset change the geometry’s texture coordinates; the export planner resolves face texture and material choices into the atlas and asset declarations. This is reusable procedural asset authoring built on the same path used by imported models.[^flexo-src-three-primitives][^flexo-src-ksa-modexport]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/three/primitives.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts#L26-L154) | Primitive constructors, face groups and UV transforms |
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L902-L1120) | Resolve custom meshes and per-face export plans |

## Snippets

```typescript
// src/three/primitives.ts L56-L74
export function buildPrimitiveGeometry(spec: PrimitiveSpec): THREE.BufferGeometry {
  switch (spec.kind) {
    case 'box': {
      const { width, height, depth } = spec.params;
      return new THREE.BoxGeometry(width, height, depth);
    }
    case 'cylinder': {
      const { radius, height, radialSegments } = spec.params;
      return new THREE.CylinderGeometry(radius, radius, height, Math.max(3, radialSegments));
    }
    case 'sphere': {
      const { radius, segments } = spec.params;
      const s = Math.max(3, segments);
      return new THREE.SphereGeometry(radius, s * 2, s);
    }
    case 'plane': {
      const { width, height } = spec.params;
      return new THREE.PlaneGeometry(width, height);
    }
```

## Game APIs touched

This is browser-side geometry construction. The native output uses the mesh-atlas and material declarations documented in the linked export features.

## Pitfalls and version notes

Primitive editing is not a general mesh modeler or a constructive-solid-geometry system. Face grouping is an export concern, so one visible primitive can require multiple material-bearing output pieces. Plane geometry has no physical thickness. Collision remains a separate authored definition.

## See also

- [material and ktx2 pipeline](material-and-ktx2-pipeline.md)
- [mesh atlas and picking export](mesh-atlas-and-picking-export.md)
- [collider authoring and coverage](collider-authoring-and-coverage.md)
- [Import models and author procedural meshes in a browser asset pipeline](../../../howto/assets/models-and-textures/add-a-part-model-with-glb-and-pbr-textures/add-a-part-model-with-glb-and-pbr-textures-3.md) - how-to article demonstrating this feature

[^flexo-src-three-primitives]: [src/three/primitives.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts#L26-L154)
[^flexo-src-ksa-modexport]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L902-L1120)
