---
type: Game Feature
title: Force a kitten to play a chosen clip, freeze it or change its speed, and hold values the game rewrites
description: Why a clip set from a StarMap callback is overwritten every frame, why a Harmony prefix on AnimatedRenderable.UpdateAnimation is the point where a forced clip, a freeze or a rate multiplier still lands, and the patch-the-consumer pattern for any per-frame rewrite
topic: play-a-specific-kitten-animation-clip
category: kittens
group: animation
approaches: 1
game_types: [KSA.AnimatedRenderable, KSA.BoneAnimRuntime, KSA.KittenRenderable, KSA.KittenEva, KSA.IAnimation, KSA.LocomotionState, KSA.CatEyeAnim, KSA.CatEarAnim, KSA.CatExpressionAnim]
lifecycle: [frame:draw-ui, frame:render]
demonstrated_by: [mods/unscience/features/kitten-animations-forced-clip-playback]
tags: [kitten, animation, clip, harmony-prefix, freeze, playback-rate, per-frame-write]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:39Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-kittenrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-animatedrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AnimatedRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs
    title: KSA.AnimatedRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-boneanimruntime
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BoneAnimRuntime.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BoneAnimRuntime.cs
    title: KSA.BoneAnimRuntime (decompiled, build 2026.10.10.5554)
  - id: unscience-kitten-animations-lib-kittenanimationpatches-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationPatches.cs
    title: kitten-animations.lib/KittenAnimationPatches.cs
  - id: unscience-kitten-animations-lib-kittenanimationdriver-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationDriver.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationDriver.cs
    title: kitten-animations.lib/KittenAnimationDriver.cs
  - id: unscience-kitten-animations-patcher-cs
    repo: unscience
    path: kitten-animations/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/Patcher.cs
    title: kitten-animations/Patcher.cs
---
The game chooses a kitten's body clip itself, every frame, from its locomotion state: idle, walk, run, jump, tumble, ladder, swim or the MMU blend. A mod that calls `AnimatedRenderable.SetAnimation` from a StarMap callback has its clip replaced before it is ever sampled. The same is true of other values the game rewrites per frame (the reactive expression weight, the eye pitch offset, `FreezeAnimation`). Unscience's Kitten Animations solves it by moving the write to the one moment after the game's choice and before the pose is evaluated: a Harmony prefix on `AnimatedRenderable.UpdateAnimation`. This topic explains the engine order, the prefix, and the generalisation: when the game rewrites a value every frame, patch the consumer, not the producer.

## Engine background

| Piece | Role | Source |
|---|---|---|
| `KittenRenderable.UpdateRenderData` | Per viewport: zero `dt` after the first call in a frame, call `UpdateLocomotionAnimationState`, then `CharacterModel.UpdateAnimation(dt2)` | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L311-L355) |
| `KittenRenderable.UpdateLocomotionAnimationState` | Chooses the clip by locomotion mode with `SetAnimation` / `PlayAnimation` and writes `FreezeAnimation` and the playback rate | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L432-L535) |
| `AnimatedRenderable.SetAnimation`, `PlayAnimation`, `UpdateAnimation`, `FreezeAnimation` | `SetAnimation` is a no-op when the clip is already current; `PlayAnimation` restarts it; a frozen model skips `RuntimeAnim.Update` | [current/decomp/KSA/AnimatedRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs#L124-L152) |
| `BoneAnimRuntime` | Holds the current clip, cross-fade time and clock; `IsBlending`, `SampleCurrentAnimation` | [current/decomp/KSA/BoneAnimRuntime.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BoneAnimRuntime.cs) |
| `CatEyeAnim`, `CatEarAnim`, `CatExpressionAnim` | Processors whose weights the game also writes each frame | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L342-L345) |

The order is fixed: the game picks the clip (step 3 in the [draw path](../../characters/reach-a-kittens-avatar-and-skeleton/reach-a-kittens-avatar-and-skeleton-4.md)), then calls `UpdateAnimation(dt2)` with `dt2 = dt * simulationSpeed * achievedSpeedFraction * groundAnimPlaybackRate`. A prefix on `UpdateAnimation` therefore sees the game's choice and can replace it; the `ref double dt` parameter lets it change the playback rate.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Prefix on `UpdateAnimation` compares the instance by reference and re-applies](play-a-specific-kitten-animation-clip.md) | unscience | `harmony-prefix` | `frame:draw-ui`, `frame:render` | The last point in the frame where an override lands; runs for every animated renderable, so it must be a reference compare and return |

## See also

- [Reach a kitten's avatar, skeleton, bones and animation catalog](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md), [approach 2: the clip catalog](../../characters/reach-a-kittens-avatar-and-skeleton/reach-a-kittens-avatar-and-skeleton-2.md)
- [Restore kitten colours, clips and tuning after a save load](../../characters/restore-kitten-customizations-after-a-load/overview.md)
- [Make a kitten pull a facial expression](../make-a-kitten-pull-a-facial-expression/overview.md)
- [Isolate patch failures and fault-proof patch bodies](../../../patching/safety/isolate-patch-failures-and-fault-proof-patch-bodies/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
