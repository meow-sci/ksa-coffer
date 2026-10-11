---
type: Game Feature
title: Make static objects cast sun and lamp shadows with invisible casters
description: Static objects never enter a shadow pass, so add depth-only caster meshes to the SuperMesh shadow pool and let a building, roof or pillar block sunlight and lamp light without drawing a second mesh
topic: add-invisible-shadow-casters
category: rendering
group: meshes
approaches: 1
game_types: [KSA.SuperMeshRenderSystem, KSA.StaticMeshRenderable, KSA.ShadowRenderable, KSA.SuperMeshShadowCasterProvider, KSA.StaticObjectRenderer]
lifecycle: [startup:all-mods-loaded, frame:render, render:shadows]
demonstrated_by: [mods/ksastructures/features/invisible-shadow-casters]
tags: [shadows, shadow-caster, static-object, cascades, shadow-atlas]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:27:37Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: g-current-decomp-ksa-supermeshrendersystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: "KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-shadowrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ShadowRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShadowRenderable.cs
    title: "KSA.ShadowRenderable (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-supermeshshadowcasterprovider-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshShadowCasterProvider.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshShadowCasterProvider.cs
    title: "KSA.SuperMeshShadowCasterProvider (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-staticmeshrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticMeshRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs
    title: "KSA.StaticMeshRenderable (decompiled, build 2026.10.10.5554)"
---
KSA's static objects (buildings, landmarks, imported statics) receive shadows but cast none: the cascade loop in `RenderGame` draws terrain, the SuperMesh shadow pool, part models and splines, and `StaticObjectRenderer` records no shadow commands. A garage dug under the ground therefore gets daylight on its floor, and lamp light passes through its pillars. The fix is an additional, never-drawn mesh that sits inside the real geometry and is added to the shadow pool both consumers read.

## Engine background

- `SuperMeshRenderSystem.ShadowRenderablePool` [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L54) is a `List<ShadowRenderable>` ([current/decomp/KSA/ShadowRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShadowRenderable.cs#L7-L16)) emptied by `ClearBuckets` and `OnFrameEnd`.
- Sun cascades: `AddPoolToShadowBucket` culls against cascade planes and fills `MeshPass.ShadowCsm` (called per cascade in `RenderGame`, only when `GameSettings.ShowVesselInCascadeShadows()` is true).
- Lamps: `SuperMeshShadowCasterProvider.PrepareShadowCasters` [current/decomp/KSA/SuperMeshShadowCasterProvider.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshShadowCasterProvider.cs#L131-L179) fills each casting light's `MeshPass.ShadowAtlas` bucket from the same pool.
- `StaticMeshRenderable` [current/decomp/KSA/StaticMeshRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs#L9-L90) registers a glTF's meshes for the depth passes and, in `Draw`, adds exactly such pool entries when `CastShadows` is true.
- Render order: ClearBuckets, prepass, ambient occlusion, **lamp shadow atlas**, planet generation, **sun cascades**, scene colour. See the RenderGame table in [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Append ShadowRenderables from a prefix on PrepareShadowCasters and AddPoolToShadowBucket](add-invisible-shadow-casters.md) | KSAStructures | `harmony-prefix` on both consumers, reflection-built `StaticMeshRenderable`, latch per frame | `render:shadows` | Real sun and lamp shadows from a hidden proxy mesh; main view only, depends on the vessel-shadows graphics setting, uses reflection on protected members |

## See also

- [Draw your own meshes through the engine's mesh renderers](../draw-mod-meshes-with-the-engine-renderers/overview.md)
- [Add dynamic spot and point lights to the world from a mod](../../lights-and-particles/add-dynamic-lights-to-the-world/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
