---
type: Game Feature
title: Author part colliders and convex-hull assets
description: Author primitive and existing convex-hull collider references with explicit owner frames,
  dimensions and sampled coverage diagnostics
topic: author-part-colliders-and-convex-hulls
category: assets
group: asset-xml
approaches: 1
game_types:
  - KSA.ColliderTemplate
  - KSA.ConvexHullColliderTemplate
lifecycle:
  - tool:authoring
  - tool:build
demonstrated_by:
  - mods/flexo/features/collider-authoring-and-coverage
  - mods/flexo/features/convex-hull-atlas-import
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:59:00Z
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
  - id: ksa-current-decomp-ksa-collidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs
    title: current/decomp/KSA/ColliderTemplate.cs
  - id: ksa-current-decomp-ksa-convexhullcollidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConvexHullColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs
    title: current/decomp/KSA/ConvexHullColliderTemplate.cs
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-ksa-collidersize
    repo: flexo
    path: src/ksa/colliderSize.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts
    title: src/ksa/colliderSize.ts
  - id: flexo-src-ksa-collisionatlas
    repo: flexo
    path: src/ksa/collisionAtlas.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts
    title: src/ksa/collisionAtlas.ts
  - id: flexo-src-three-collisionmeshcache
    repo: flexo
    path: src/three/CollisionMeshCache.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts
    title: src/three/CollisionMeshCache.ts
  - id: flexo-src-ksa-collidervalidation
    repo: flexo
    path: src/ksa/colliderValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts
    title: src/ksa/colliderValidation.ts
  - id: flexo-src-measure-collidercoverage
    repo: flexo
    path: src/measure/colliderCoverage.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts
    title: src/measure/colliderCoverage.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
---

Use Flexo’s collider model to build an external collision authoring workflow for parts. Keep render geometry, picking geometry and physical collision separate. This approach edits analytic shapes and references existing collision-atlas hulls; it is not a general concave-mesh collider generator.

## Engine background

KSA’s ColliderTemplate stores an authored location and rotation, then adds any shape-center offset when constructing its module: [current/decomp/KSA/ColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs#L68-L79). ConvexHullColliderTemplate scales source points, builds a nondegenerate hull and retains its center offset in [current/decomp/KSA/ConvexHullColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs#L38-L68). The browser must not assume its display triangulation is the runtime Bepu shape.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Author part colliders and convex-hull assets](author-part-colliders-and-convex-hulls.md) | Flexo | `xml-asset`, `geometry-validation`, `glb-model`, `binary-accessor` | `tool:authoring`, `tool:build` | Inspect explicit collision data before export; preflight is advisory, and sampled coverage and browser hulls do not replace game collision tests |

## See also

- [Author collision shapes and inspect sampled coverage](../../../../mods/flexo/features/collider-authoring-and-coverage.md)
- [Read mesh-only collision atlases for convex hull previews](../../../../mods/flexo/features/convex-hull-atlas-import.md)
- [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../../validation/validate-asset-xml-references/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
