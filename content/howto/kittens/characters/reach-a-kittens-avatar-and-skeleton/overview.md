---
type: Game Feature
title: Reach a kitten's avatar, skeleton, bones and animation catalog
description: How a mod gets from a KittenEva to its CharacterAvatar, Skeleton, named bones, private clip fields and materials, and where in the frame the kitten is animated and drawn
topic: reach-a-kittens-avatar-and-skeleton
category: kittens
group: characters
approaches: 4
game_types: [KSA.KittenEva, KSA.KittenRenderable, KSA.CharacterAvatar, KSA.AnimatedRenderable, RenderCore.Animation.Skeleton, KSA.Program, KSA.IAnimProcessor, KSA.IVASeat, KSA.Vehicle, KSA.AnimationAssetRef, KSA.IAnimation, KSA.CatExpressionAnim, KSA.CatEyeAnim, KSA.CatEarAnim, KSA.BoneAnimRuntime]
lifecycle: [frame:draw-ui, frame:after-on-frame, frame:render, render:prepass, render:shadows]
demonstrated_by: [mods/ksagolf/features/kitten-pose-processor, mods/ksastructures/features/first-person-body-hiding-and-shadow, mods/unscience/features/kitten-animations-clip-catalog, mods/unscience/features/doh-runtime-gpu-materials, mods/unscience/features/humble-arteest-kitten-visor-toggle, mods/ksacars/features/seated-crew-of-unflown-craft, mods/unscience/features/kitten-animations-forced-clip-playback]
tags: [kitten, avatar, skeleton, bones, reflection, animation, render-order]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:38Z }
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-characteravatar
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAvatar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs
    title: KSA.CharacterAvatar (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-animatedrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AnimatedRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs
    title: KSA.AnimatedRenderable (decompiled, build 2026.10.10.5554)
  - id: ksagolf-src-ksagolf-ksa-kittenposeprobe-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/KittenPoseProbe.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/KittenPoseProbe.cs
    title: src/KSAGolf/Ksa/KittenPoseProbe.cs
  - id: ksagolf-src-ksagolf-ksa-ksaworld-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/KsaWorld.cs
    title: src/KSAGolf/Ksa/KsaWorld.cs
  - id: ksastructures-src-ksastructures-ksa-kittenframe-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/KittenFrame.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/KittenFrame.cs
    title: src/KSAStructures/Ksa/KittenFrame.cs
  - id: ksa-ksa-ianimation
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IAnimation.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IAnimation.cs
    title: KSA.IAnimation (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-boneanimruntime
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BoneAnimRuntime.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BoneAnimRuntime.cs
    title: KSA.BoneAnimRuntime (decompiled, build 2026.10.10.5554)
  - id: unscience-kitten-animations-lib-kittenanimationcatalog-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationCatalog.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationCatalog.cs
    title: kitten-animations.lib/KittenAnimationCatalog.cs
  - id: unscience-kitten-animations-lib-kittenanimprocessors-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimProcessors.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimProcessors.cs
    title: kitten-animations.lib/KittenAnimProcessors.cs
  - id: unscience-kitten-animations-lib-kittenanimationssubmod-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationsSubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationsSubmod.cs
    title: kitten-animations.lib/KittenAnimationsSubmod.cs
  - id: unscience-kitten-animations-lib-ui-animationlibrarysection-cs
    repo: unscience
    path: kitten-animations.lib/Ui/AnimationLibrarySection.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/Ui/AnimationLibrarySection.cs
    title: kitten-animations.lib/Ui/AnimationLibrarySection.cs
  - id: unscience-kitten-animations-lib-kittenavataraccessor-cs
    repo: unscience
    path: kitten-animations.lib/KittenAvatarAccessor.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAvatarAccessor.cs
    title: kitten-animations.lib/KittenAvatarAccessor.cs
  - id: unscience-ksa-abstractions-lib-reflectionhelpers-cs
    repo: unscience
    path: ksa-abstractions.lib/ReflectionHelpers.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/ReflectionHelpers.cs
    title: ksa-abstractions.lib/ReflectionHelpers.cs
  - id: ksa-ksa-catfurrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatFurRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatFurRenderable.cs
    title: KSA.CatFurRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-staticmeshrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticMeshRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs
    title: KSA.StaticMeshRenderable (decompiled, build 2026.10.10.5554)
  - id: unscience-doh-lib-spawning-kittenspawner-materials-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.Materials.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.Materials.cs
    title: doh.lib/Spawning/KittenSpawner.Materials.cs
  - id: ksa-ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-supermeshrendersystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-supermeshshadowcasterprovider
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshShadowCasterProvider.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshShadowCasterProvider.cs
    title: KSA.SuperMeshShadowCasterProvider (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-ivaseat
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IVASeat.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs
    title: KSA.IVASeat (decompiled, build 2026.10.10.5554)
  - id: ksastructures-src-ksastructures-ksa-firstpersonhook-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/FirstPersonHook.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/FirstPersonHook.cs
    title: src/KSAStructures/Ksa/FirstPersonHook.cs
  - id: ksacars-src-ksacars-ksa-seatedcrewhook-cs
    repo: KSACars
    path: src/KSACars/Ksa/SeatedCrewHook.cs
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/Ksa/SeatedCrewHook.cs
    title: src/KSACars/Ksa/SeatedCrewHook.cs
---
Almost every kitten mod starts with the same question: given a `KittenEva` that the game owns, how do I get at the animated model, its bones, its clips and its materials? The game exposes only a thin slice publicly. The rest sits in private fields of `KittenRenderable` and in struct fields of `CharacterAvatar`, so the mods in the reference set all use a small amount of reflection, and they differ mainly in how visibly they fail when a game update renames something. This topic compares those approaches and explains, as an engine background article, where in the frame a kitten is animated and drawn so you know when your code sees what.

## Engine background

The object chain, from the vehicle to the bones:

| Step | Member | Visibility | Source |
|---|---|---|---|
| `KittenEva` to its renderable | `KittenEva.Renderable` (field `_renderable`) | public getter; field private | [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L59) |
| renderable to avatar | `KittenRenderable._characterAvatar` | **private** | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L13) |
| avatar to the animated model | `CharacterAvatar.Core.CharacterModel` (an `AnimatedRenderable`) | public field of a public struct field | [current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L30-L51) |
| model to bones | `AnimatedRenderable.Skeleton` (`Skeleton.BoneNames`, `WorldTransforms`, `LocalTransforms`, `InverseBindPose`) | public | [current/decomp/KSA/AnimatedRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs#L54) |
| model to processors | `AnimatedRenderable.AnimProcessors` (`List<IAnimProcessor>`) | public | [current/decomp/KSA/AnimatedRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs#L56) |
| avatar to attachments | `CharacterAvatar.Attachments` (`Helmet`, `Mmu`, `CosmeticAttachments`) | public structs | [current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L73-L141) |
| renderable to ground clips, samplers, processors | `_groundIdleAnim`, `_walkPairSampler`, `_catEyeAnim` and so on | **private** | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L31-L73) |

- `CharacterAvatar` is a class whose parts (`Core`, `Fur`, `Attachments`, `Expressions`, `Animations`) are **structs held in public fields**. Reading `avatar.Core.CharacterModel` in compiled code is fine and the `CharacterModel` it returns is the live shared object. A reflected read of a struct field boxes a copy, so reflection that walks `Core`, `Fur` or `Attachments` is reading copies of structs whose class-typed members still point at the live renderables (this is what [approach 3](reach-a-kittens-avatar-and-skeleton-3.md) relies on). Writing into a struct field of a class instance from compiled code (`avatar.Attachments.Helmet.Enabled = false`) writes through to the avatar.
- `KittenRenderable` has two public helpers that do the bone lookup for you: `TryFindBoneIndex(string, out int)` (case-insensitive over `Skeleton.BoneNames`) and `GetBoneAsmbOffset(int)` (the bone position in the vehicle's assembly frame via `ModelToBodyMatrix`) ([current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L107-L134)). They avoid the avatar hop for the simplest bone queries, but give no access to the pose span or the processor list.
- Every `KittenEva` constructor builds a non-seated `KittenRenderable(Character.Id)`; only an `IVASeat` builds a `seated: true` one, which loads the seated clips, disables the MMU and helmet attachments and uses a different animation path ([current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L136-L244), [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L66-L110)).
- The constructor installs four processors on `CharacterModel.AnimProcessors`: an optional personality `CatExpressionAnim` (priority 1, absent for Neutral), the reactive `CatExpressionAnim` (priority 1), `CatEyeAnim` (priority 0.8) and `CatEarAnim` (priority 2). Two of them are the same type, which is why the clip-catalog approach reads them by field name ([current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L202-L237)).
- The ground clips are loaded from `CharacterGroundAnimationsReference` into private fields; `CharacterAvatar.Animations.WalkingAnimations` is declared but `InitalizeFromCharacterRef` assigns only `WalkingAnim` and never `RunningAnim` ([current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L181-L186), [current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L404-L410)).

## Where kittens are animated and drawn

Unlike part models, kittens are not updated by `UpdateRenderingResources`. Each viewport's `RenderGame` or `RenderViewport` clears that viewport's mesh buckets and then calls `KittenEva.UpdateRenderData(viewport, ...)` for every kitten in `VehiclesInFrame`, followed by `ControlledVehicle.UpdateSeatedCrewRenderData`. The animation, the skinning and the shadow-pool entries are all produced in that one call, [approach 4](reach-a-kittens-avatar-and-skeleton-4.md) walks through it.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. One reflection hop to the private avatar, bones resolved by name](reach-a-kittens-avatar-and-skeleton-1.md) | KSAGolf | `reflection` | `frame:after-on-frame`, `frame:render` | One helper (`AvatarOf`) so every feature breaks together; unknown bones are reported, not thrown |
| [2. Cached FieldInfo reads of the private clip and processor fields](reach-a-kittens-avatar-and-skeleton-2.md) | unscience | `reflection` | `frame:draw-ui` | Thirteen clip fields, four samplers, four processors; unresolved names are shown in the UI |
| [3. Walk renderable struct fields down to the live MaterialIndices arrays](reach-a-kittens-avatar-and-skeleton-3.md) | unscience | `reflection` | `frame:draw-ui` | Reaches protected `int[]` arrays across boxed structs; path of field names to maintain |
| [4. Background: the per-viewport draw path and animation order](reach-a-kittens-avatar-and-skeleton-4.md) | KSAStructures | `starmap-lifecycle` | `frame:render`, `render:prepass`, `render:shadows` | An explainer, not a technique: when your processor, patch or toggle is seen |

## See also

- [Pose a kitten's bones and aim its limbs with an IAnimProcessor](../../animation/pose-kitten-bones-with-an-anim-processor/overview.md)
- [Force a kitten to play a chosen clip, freeze it or change its speed](../../animation/play-a-specific-kitten-animation-clip/overview.md)
- [Make a kitten pull a facial expression](../../animation/make-a-kitten-pull-a-facial-expression/overview.md)
- [Read and extend the character asset XML](../define-a-kitten-character-in-asset-xml/overview.md)
- [Tint kitten fur, body and eyes, and hide the visor, helmet or MMU](../../appearance/tint-and-restyle-kitten-appearance/overview.md)
- [Hide a kitten's body from the main view only, keeping its shadow](../../appearance/hide-a-kitten-body-from-one-viewport/overview.md)
- [Animate seated kittens, draw them on unflown craft and fly another craft from a chair](../../animation/animate-and-draw-seated-kitten-crew/overview.md)
- [Contain exceptions in StarMap hooks](../../../getting-started/lifecycle/contain-exceptions-in-starmap-hooks/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Hide part meshes or subparts without removing them](../../../rendering/meshes/hide-parts-or-subparts-from-rendering/overview.md) - related topic

