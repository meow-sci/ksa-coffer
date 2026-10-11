---
type: Game Feature
title: Make a kitten pull a facial expression
description: How the five authored faces are mixed over a kitten's pose by CatExpressionAnim processors, why writing the game's reactive processor never holds, and two ways to drive faces and the eye, ear and personality weights
topic: make-a-kitten-pull-a-facial-expression
category: kittens
group: animation
approaches: 2
game_types: [KSA.CatExpressionAnim, KSA.CatPostAnim, KSA.CatEyeAnim, KSA.CatEarAnim, KSA.CharacterAvatar, KSA.KittenRenderable]
lifecycle: [frame:draw-ui, frame:render]
demonstrated_by: [mods/unscience/features/kitten-animations-facial-expressions]
tags: [kitten, expression, face, anim-processor, eyes, ears, personality]
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
  - id: ksa-ksa-characteravatar
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAvatar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs
    title: KSA.CharacterAvatar (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-catexpressionanim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatExpressionAnim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatExpressionAnim.cs
    title: KSA.CatExpressionAnim (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-catpostanim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatPostAnim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatPostAnim.cs
    title: KSA.CatPostAnim (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-catearanim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatEarAnim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatEarAnim.cs
    title: KSA.CatEarAnim (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-cateyeanim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatEyeAnim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatEyeAnim.cs
    title: KSA.CatEyeAnim (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-animatedrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AnimatedRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs
    title: KSA.AnimatedRenderable (decompiled, build 2026.10.10.5554)
  - id: unscience-kitten-animations-lib-ui-expressionsection-cs
    repo: unscience
    path: kitten-animations.lib/Ui/ExpressionSection.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/Ui/ExpressionSection.cs
    title: kitten-animations.lib/Ui/ExpressionSection.cs
  - id: unscience-kitten-animations-lib-kittenexpressioncontroller-cs
    repo: unscience
    path: kitten-animations.lib/KittenExpressionController.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenExpressionController.cs
    title: kitten-animations.lib/KittenExpressionController.cs
  - id: unscience-kitten-animations-lib-kittenanimationdriver-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationDriver.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationDriver.cs
    title: kitten-animations.lib/KittenAnimationDriver.cs
  - id: unscience-kitten-animations-lib-ui-strengthsection-cs
    repo: unscience
    path: kitten-animations.lib/Ui/StrengthSection.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/Ui/StrengthSection.cs
    title: kitten-animations.lib/Ui/StrengthSection.cs
---
A kitten's face is not a separate mesh with morph targets: each expression is an authored full-pose clip (angry, awe, happy, sad, scared; two variants for happy, angry and awe) that a `CatExpressionAnim` processor blends over the head subtree with a weight. The game installs two of these on every kitten, plus an eye processor (look-at, blink, saccades) and an ear processor, and rewrites some of their fields every frame. To make a kitten pull a face on demand you either add a processor of your own, appended last so it mixes over everything, or you re-apply values after the game's write. unscience's Kitten Animations does both.

## Engine background

| Piece | Behaviour | Source |
|---|---|---|
| `CharacterAvatar.Expressions` | `Happy`, `Angry`, `Sad`, `Scared`, `Awe` lists of `AnimationAssetRef`; `ExpressionRootIndex` (the helmet socket bone, `Head_M`) and `ExpressionCenterIndex` | [current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L188-L207) |
| `CatExpressionAnim` | Samples `ExpressionAnim` once into a private `_expressionPose`, then `MixPoseLocal` blends it over the subtree below `ExpressionRootIndex` with `ExpressionWeight` | [current/decomp/KSA/CatExpressionAnim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatExpressionAnim.cs) |
| `CatPostAnim` | Abstract base: required `CharacterAvatar`, settable `Priority`, `CanCacheAnimation` always true, protected `MixPoseLocal` | [current/decomp/KSA/CatPostAnim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatPostAnim.cs) |
| `KittenRenderable` constructor | Adds the personality face (non-Neutral kittens, weight 1), the reactive face, the eye processor (priority 0.8, `MaxLookAtAngle` 30) and the ear processor (priority 2, weight 0 seated or 1) in that list order | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L185-L237) |
| `KittenRenderable.UpdateRenderData` | Rewrites the reactive `ExpressionWeight` every frame from acceleration; sets `CatEyeAnim.LookPitchOffsetDeg` every frame | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L342-L346) |
| `CatEarAnim`, `CatEyeAnim` | Ear weight mixes the helmet-mask clip on the ear bones; eye look angle, pitch offset and blink | [current/decomp/KSA/CatEarAnim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatEarAnim.cs), [current/decomp/KSA/CatEyeAnim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatEyeAnim.cs#L8-L40) |

The personality face is picked when the avatar is built (a random expression of the kitten's personality), so the same character can have different moods across spawns. Processors run in list order on the local pose, once per frame, and a later processor's `MixPoseLocal` lerps over whatever the earlier ones produced.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Own `CatExpressionAnim` appended after the game's four, pose cache busted on every swap](make-a-kitten-pull-a-facial-expression-1.md) | unscience | `anim-processor` | `frame:draw-ui`, `frame:render` | A face that holds, with ease-in, hold, ease-out or latch; relies on a private cache field |
| [2. Re-apply each frame, cap with `Math.Min`, restore the bind-time value on unbind](make-a-kitten-pull-a-facial-expression-2.md) | unscience | `harmony-prefix` | `frame:render` | Ear, eye and personality weights and a cap on the reactive face; needs the `UpdateAnimation` prefix |

## See also

- [Force a kitten to play a chosen clip, freeze it or change its speed, and hold values the game rewrites](../play-a-specific-kitten-animation-clip/overview.md)
- [Reach a kitten's avatar, skeleton, bones and animation catalog](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md)
- [Pose a kitten's bones and aim its limbs with an IAnimProcessor](../pose-kitten-bones-with-an-anim-processor/overview.md)
- [Read and extend the character asset XML](../../characters/define-a-kitten-character-in-asset-xml/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
