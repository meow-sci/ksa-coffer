---
type: Mod Feature
title: Read mesh-only collision atlases for convex hull previews
description: Decode named GLB position accessors directly when collision atlases contain no ordinary scene or node hierarchy
mod: flexo
category: physics
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - binary-accessor
  - geometry-validation
game_types:
  - KSA.ConvexHullColliderTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:31:47Z
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
  - id: flexo-src-three-collisionmeshcache
    repo: flexo
    path: src/three/CollisionMeshCache.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts
    title: src/three/CollisionMeshCache.ts
  - id: flexo-src-ksa-collisionatlas
    repo: flexo
    path: src/ksa/collisionAtlas.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts
    title: src/ksa/collisionAtlas.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-convexhullcollidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConvexHullColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs
    title: current/decomp/KSA/ConvexHullColliderTemplate.cs
---

Some KSA collision GLBs are mesh collections without renderable scenes. Flexo reads their binary positions directly, then creates a browser hull for display and coverage analysis.

## How it works

The parser resolves each glTF mesh name, takes the first primitive’s POSITION accessor, verifies FLOAT VEC3 data, and combines buffer-view offset, accessor offset and stride. It reads little-endian coordinates and constructs a convex geometry, rejecting a zero-volume result. A shared promise cache loads each atlas once. Hull planes and volume are derived from the scaled geometry for the coverage evaluator. Export preserves the original collision mesh reference and its scale rather than shipping the preview triangulation.[^flexo-src-three-collisionmeshcache][^flexo-src-ksa-collisionatlas][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/three/CollisionMeshCache.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts#L12-L110) | Direct accessor decode, atlas caching and hull planes |
| [src/ksa/collisionAtlas.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts#L1-L17) | Map named collision meshes to atlas paths |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L493-L518) | Preserve hull mesh identity and axis scale |

## Snippets

```typescript
// src/three/CollisionMeshCache.ts L31-L47
    const accessor = gltf.accessors[definition.primitives[0].attributes.POSITION];
    if (accessor.componentType !== 5126 || accessor.type.toUpperCase() !== 'VEC3') {
      throw new Error(`Collision mesh "${definition.name}" must carry FLOAT VEC3 positions.`);
    }
    const view = gltf.bufferViews[accessor.bufferView];
    const base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
    const stride = view.byteStride ?? 12;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < accessor.count; i++) {
      const offset = base + i * stride;
      points.push(
        new THREE.Vector3(
          bin.getFloat32(offset, true),
          bin.getFloat32(offset + 4, true),
          bin.getFloat32(offset + 8, true),
        ),
      );
```

## Game APIs touched

KSA.ConvexHullColliderTemplate builds a nondegenerate hull from scaled points.[^ksa-current-decomp-ksa-convexhullcollidertemplate]

## Pitfalls and version notes

This reader supports the collision atlas layout it checks, not arbitrary sparse, compressed or multi-primitive glTF geometry. The reconstructed browser hull is a preview; KSA builds and centers its own hull. The source feature imports existing collision meshes and should not be described as a general custom concave-collider generator.

## See also

- [collider authoring and coverage](collider-authoring-and-coverage.md)
- [gltf model import](gltf-model-import.md)
- [Author part colliders and convex-hull assets](../../../howto/assets/asset-xml/author-part-colliders-and-convex-hulls/author-part-colliders-and-convex-hulls.md) - how-to article demonstrating this feature

[^flexo-src-three-collisionmeshcache]: [src/three/CollisionMeshCache.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts#L12-L110)
[^flexo-src-ksa-collisionatlas]: [src/ksa/collisionAtlas.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts#L1-L17)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L493-L518)
[^ksa-current-decomp-ksa-convexhullcollidertemplate]: [current/decomp/KSA/ConvexHullColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs#L38-L68)
