---
type: Game Feature
title: Bake kitten poses into static asset meshes
description: Bake character positions and socket attachments into static mesh groups while preserving material boundaries and explicit texture dependencies
topic: bake-kitten-poses-as-static-meshes
category: kittens
group: appearance
approaches: 1
demonstrated_by:
  - mods/flexo/features/kitten-pose-baking
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
tags:
  - flexo
  - asset-authoring
  - kittens
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:12:22Z
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
  - id: source-flexo-src-three-kittenbake-ts
    repo: flexo
    path: src/three/kittenBake.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts
    title: src/three/kittenBake.ts
  - id: source-flexo-src-ksa-modexport-ts
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Convert catalog character geometry into static decorative assets or editor reference figures without introducing a new character runtime.

## Engine background

The transformation lives entirely in [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L76-L120). The export planner maps the results into ordinary native mesh/material assets through [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L681-L762); no game character method is invoked.

See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Bake a kitten bind pose into ordinary static SubParts](bake-kitten-poses-as-static-meshes.md) | Flexo | `glb-model`, `cpu-pose-baking` | `tool:authoring`, `tool:build` | Simple static geometry with shared asset provenance; no crew behavior or general animated-skin conversion |

## See also

- [Bake kitten geometry into static part assets](../../../../mods/flexo/features/kitten-pose-baking.md)
- [Reach a kitten's avatar, skeleton, bones and animation catalog](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md)
- [Add a part's art with its own GLB model and PBR textures](../../../assets/models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
