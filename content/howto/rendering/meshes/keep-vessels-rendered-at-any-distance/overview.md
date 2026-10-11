---
type: Game Feature
title: Keep a vessel or kitten rendered at any distance
description: KSA culls vehicles that project below one pixel; override the cull so a distant ship, a projectile launcher or a scaled-up vessel still draws
topic: keep-vessels-rendered-at-any-distance
category: rendering
group: meshes
approaches: 4
game_types: [KSA.Vehicle, KSA.PartModelRenderer, KSA.PartTreeRenderData, KSA.PartTree, KSA.KittenEva]
lifecycle: [frame:render, frame:draw-ui, frame:prepare]
demonstrated_by: [mods/unscience/features/i-feel-seen-render-distance-override, mods/gatos/features/scale-and-force-render-cheats, mods/ksarmory/features/round-body-draw-hooks, mods/unscience/features/godzilla-visual-scaling]
tags: [cull, render-distance, pixel-size, vehicle, scaling]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:27:37Z }
status: stable
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: g-current-decomp-ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
---
KSA builds render data for a vessel only if its bounding sphere projects to at least one pixel. Everything farther away, or smaller, is not submitted at all; the vessel's physics is unaffected. For mods the effect is that a distant ship vanishes, a launcher's projectile (a subpart of the launcher) vanishes with it, and a vessel whose true size is tiny disappears even when it has been scaled up for display.

## Engine background

- **The cull.** `Vehicle.UpdateRenderData` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3713-L3726) calls the public `IsLargeEnoughToRender(Camera)` (`!(camera.GetObjectDiameterPixels(2 * MeanRadius, range) < 1)`) before building `GetMatrixAsmb2Ego` and calling `Parts.UpdateRenderData`. `Vehicle.GetWorldMatrix(Camera)` repeats the same test and returns `null`; its only caller is `KittenEva.UpdateRenderData`.
- **Where it runs.** `Program.UpdateRenderingResources` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4337-L4377)) calls `vehicle.UpdateRenderData(viewport, frameIndex)` for every non-kitten vessel in frame, per visible viewport, then `PartModelRenderer.UpdateRenderData` uploads the lists. Kittens are submitted later, in `RenderViewport` and `RenderGame`. See rows 21 and 22 of [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#per-frame-sequence).
- **Nothing to turn off.** There is no setting. The three ways in are: replace the methods for chosen vessels (1, 2), add the parts back from a postfix when the engine skipped them (3), or redirect the individual call sites to a scaled radius (4).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: skip-original prefixes, patched by name](keep-vessels-rendered-at-any-distance-1.md) | unscience | `harmony-prefix` on `GetWorldMatrix` and `UpdateRenderData`, a tracker | `frame:render`, `frame:draw-ui` | Straightforward; re-implements the original body, so later engine additions are skipped |
| [2: same prefixes, lazily installed](keep-vessels-rendered-at-any-distance-2.md) | gatOS | Dedicated Harmony instance, installed on first mark and removed on last, id-keyed volatile set | `frame:render` | Zero cost when unused; same re-implementation caveat |
| [3: postfix asks the pixel test again](keep-vessels-rendered-at-any-distance-3.md) | KSArmory | `harmony-postfix` on `UpdateRenderData`, draw only if the engine culled | `frame:render` | Does not replace anything; limited to adding parts back for chosen vessels |
| [4: call-site transpilers enlarge the cull radius](keep-vessels-rendered-at-any-distance-4.md) | unscience (Godzilla) | `harmony-transpiler` on two call sites plus draw-matrix prefix, finalizer and postfix | `frame:render`, `frame:prepare` | Culls a scaled vessel at its visual size; five coordinated patches |

Note that approaches 1 to 3 remove or repeat the cull but never enlarge a vessel; a tracked sub-pixel vessel is still drawn at its true size. To draw many separate copies of a mesh without any vessel behind them, use [part-model instances](../draw-mod-meshes-with-the-engine-renderers/draw-mod-meshes-with-the-engine-renderers-3.md).

## See also

- [Hide part meshes or subparts without removing them](../hide-parts-or-subparts-from-rendering/overview.md)
- [Draw your own meshes through the engine's mesh renderers](../draw-mod-meshes-with-the-engine-renderers/overview.md)
- The topic on scaling a vessel or its parts at runtime (vehicles-and-parts category, not yet written)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Scaling a vessel or its parts at runtime](../../../vehicles-and-parts/vehicles/scale-a-vessel-or-its-parts-at-runtime/overview.md) - related topic

