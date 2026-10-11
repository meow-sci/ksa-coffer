---
type: Game Feature
title: Hide a kitten's body from the main view only, keeping its shadow
description: "How a mod hides a kitten body from the main view only by folding its skeleton per viewport and restoring the full pose in the shadow pool, and what the engine HideHead switch does instead"
topic: hide-a-kitten-body-from-one-viewport
category: kittens
group: appearance
approaches: 2
game_types: [KSA.KittenEva, KSA.KittenRenderable, KSA.AnimatedRenderable, KSA.IAnimProcessor, KSA.Program, RenderCore.Animation.Skeleton, KSA.SuperMeshRenderSystem, KSA.ShadowRenderable, KSA.InstanceData, KSA.StaticMeshRenderable, KSA.MeshRenderTechnique, KSA.IVASeat]
lifecycle: [startup:all-mods-loaded, frame:draw-ui, frame:render, render:prepass, render:shadows]
demonstrated_by: [mods/ksastructures/features/first-person-body-hiding-and-shadow, mods/ksagolf/features/first-person-kitten-view]
tags: [kitten, first-person, shadow, skinning, viewport]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:14:55Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-animatedrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AnimatedRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs
    title: KSA.AnimatedRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-supermeshrendersystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)
  - id: ksastructures-src-ksastructures-ksa-firstpersonhook-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/FirstPersonHook.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/FirstPersonHook.cs
    title: src/KSAStructures/Ksa/FirstPersonHook.cs
  - id: ksastructures-src-ksastructures-ksa-firstperson-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/FirstPerson.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/FirstPerson.cs
    title: src/KSAStructures/Ksa/FirstPerson.cs
  - id: ksa-ksa-ivaseat-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IVASeat.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs
    title: KSA.IVASeat (decompiled, build 2026.10.10.5554)
  - id: ksagolf-src-ksagolf-ksa-firstpersonhook-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/FirstPersonHook.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/FirstPersonHook.cs
    title: src/KSAGolf/Ksa/FirstPersonHook.cs
  - id: ksagolf-src-ksagolf-ksa-golfpose-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/GolfPose.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/GolfPose.cs
    title: src/KSAGolf/Ksa/GolfPose.cs
  - id: ksa-ksa-kitteneva-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-shadowrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ShadowRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShadowRenderable.cs
    title: KSA.ShadowRenderable (decompiled, build 2026.10.10.5554)
---
A first-person camera sits inside the flown kitten's head, so the kitten has to disappear from that view while staying visible in camera windows and crew portraits, and while still casting its shadow. KSA draws a kitten once per viewport and rebuilds its skeleton for each, which is the seam both mods use: mark the view being drawn, fold the skeleton for that view alone, and put the whole-body pose back into the shadow pool. The engine also has a simpler per-view switch, `KittenRenderable.HideHead`, which an IVA seat sets and which hides only the head meshes and fur.

## Engine background

| Piece | Where | What it does | Source |
|---|---|---|---|
| Per-view draw | `Program.RenderGame`, `RenderViewport`, `KittenEva.UpdateRenderData` | Secondary viewports first, main view last; each clears buckets (and the shadow pool) | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4672-L4683), [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L1062-L1078) |
| Per-view skeleton | `AnimatedRenderable.UpdateAnimation`, `IAnimProcessor.UpdateSkeleton` | World transforms rebuilt and processors rerun for every call; skin is `InverseBindPose * WorldTransform` | [current/decomp/KSA/AnimatedRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs#L173-L185) |
| Shadow entries | `AnimatedRenderable.Draw`, `SuperMeshRenderSystem.ShadowRenderablePool`, `ShadowRenderable` | One entry per shadow-casting mesh using the view's skin | [current/decomp/KSA/AnimatedRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs#L209-L266), [current/decomp/KSA/ShadowRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShadowRenderable.cs#L6-L15) |
| Attachments | `KittenRenderable.UpdateRenderData`, `AnimatedRenderable.GetBoneTransform` | Helmet and visor matrices derive from the bone world transform | [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L353-L370) |
| Engine head switch | `KittenRenderable.HideHead`, `IVASeat.UpdateSeatedRenderable` | Masked head meshes and fur skipped in colour and shadow | [current/decomp/KSA/IVASeat.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs#L103), [current/decomp/KSA/KittenRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs#L357-L361) |

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for where these render calls sit in the frame.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Fold all bones onto the head with zero-scale matrices, then give the shadow pass the full-body pose](hide-a-kitten-body-from-one-viewport-1.md) | ksastructures (and ksagolf) | `anim-processor` | `startup:all-mods-loaded`, `frame:draw-ui`, `frame:render` | Whole body gone from one view, full shadow kept; four patches, reflection for the bind pose, and a second skinning per frame |
| [2. Fold onto the wrist and keep the club-holding paw; or `HideHead` per view](hide-a-kitten-body-from-one-viewport-2.md) | ksagolf | `anim-processor` | `startup:all-mods-loaded`, `frame:render` | Keeps a viewmodel paw; the `HideHead` variant is two small patches but hides only head and fur |

## See also

- [First-person camera for a kitten](../../../camera/special-views/first-person-camera-for-a-kitten/overview.md), [Steer a walking kitten](../../eva/steer-a-walking-kitten/overview.md)
- [Pose kitten bones with an anim processor](../../animation/pose-kitten-bones-with-an-anim-processor/overview.md), [Reach a kitten's avatar and skeleton](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md)
- [Attach a prop to a kitten bone](../attach-a-prop-to-a-kitten-bone/overview.md), [Tint and restyle kitten appearance](../tint-and-restyle-kitten-appearance/overview.md), [Animate and draw seated kitten crew](../../animation/animate-and-draw-seated-kitten-crew/overview.md)
- [Add invisible shadow casters](../../../rendering/meshes/add-invisible-shadow-casters/overview.md), [Hide parts or subparts from rendering](../../../rendering/meshes/hide-parts-or-subparts-from-rendering/overview.md)
- Mod features: [First-person body hiding and shadow](../../../../mods/ksastructures/features/first-person-body-hiding-and-shadow.md), [First-person kitten view](../../../../mods/ksagolf/features/first-person-kitten-view.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Let the IVA camera leave the seat and fly around the cabin](../../../camera/special-views/unlock-the-iva-camera/overview.md) - related topic
- [Replace a game texture or model texture with a user PNG at runtime](../../../rendering/textures-and-decals/replace-a-game-texture-at-runtime/overview.md) - related topic

