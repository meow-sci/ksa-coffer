---
type: Game Feature
title: Chase a projectile or other fast body with the main camera
description: A mod-simulated shell, ball or missile is not a Vehicle, so the camera follows it through a custom IFollowable and a level, stable pose behind the flight path
topic: chase-a-fast-body-with-the-main-camera
category: camera
group: main-view
approaches: 2
game_types: [KSA.IFollowable, KSA.Camera, KSA.FixedController, KSA.OrbitView, KSA.CameraReferenceFrame, KSA.WreckageMarker]
lifecycle: [frame:viewports, frame:draw-ui, frame:render]
demonstrated_by: [mods/ksarmory/features/chase-camera-on-a-round, mods/ksarmory/features/mod-simulated-rounds, mods/ksagolf/features/borrowed-chase-camera]
tags: [camera, chase, projectile, followable, fixed-camera]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:39:56Z }
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ifollowable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IFollowable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IFollowable.cs
    title: KSA.IFollowable (decompiled, build 2026.10.10.5554)
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: KSA.Camera (decompiled, build 2026.10.10.5554)
  - id: ksa-fixedcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FixedController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs
    title: KSA.FixedController (decompiled, build 2026.10.10.5554)
  - id: ksa-wreckagemarker
    repo: ksa-game-assemblies
    path: current/decomp/KSA/WreckageMarker.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/WreckageMarker.cs
    title: KSA.WreckageMarker (decompiled, build 2026.10.10.5554)
---
A chase camera needs three things the stock modes do not give a mod-simulated body: a followable that the engine accepts, a stable up so the horizon does not roll or flip, and a pose that is solved in phase with the frame. The chase is assembled from the other camera topics;
this one shows the whole.

## Engine background

| Type | Role | Source |
|---|---|---|
| `IFollowable`, `Camera.Following` | What the camera tracks | [current/decomp/KSA/IFollowable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IFollowable.cs#L1-L6), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L110-L131) |
| `FixedController` | Placement and the roll rule | [current/decomp/KSA/FixedController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs#L22-L47) |
| `Camera.SetFollow` | Teleport and control swap | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L602-L618) |
| `WreckageMarker` | The engine's non-vehicle followable | [current/decomp/KSA/WreckageMarker.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/WreckageMarker.cs#L1-L30) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. `RoundFollowable` on a level-horizon controller](chase-a-fast-body-with-the-main-camera-1.md) | KSArmory | `custom-followable` | `frame:viewports`, `frame:draw-ui`, `frame:render` | A complete working chase; four mod classes plus the controller install |
| [2. Line to the target near the flight path with carried lift](chase-a-fast-body-with-the-main-camera-2.md) | KSAGolf | `camera-arbitration` | `frame:viewports`, `frame:draw-ui` | Pure geometry and tests; `ChaseView` has no in-game caller at the pinned ref (only `StableUp` and the hand-back are wired) |

## See also

- [Make the camera follow a point or mod-simulated object, and change the follow target without a jump](../follow-a-point-that-is-not-a-vehicle/overview.md), [Drive the main camera through Fixed mode without crashing it, with a stable up vector](../../controllers/drive-the-main-camera-in-fixed-mode/overview.md), [Play scripted cinematic camera tracks with blends and easing](../../special-views/play-cinematic-camera-tracks/overview.md), [Replace a viewport's camera controller and take input through it](../../controllers/replace-a-viewport-camera-controller/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
