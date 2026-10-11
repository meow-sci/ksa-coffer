---
type: Game Feature
title: Make the camera follow a point or mod-simulated object, and change the follow target without a jump
description: Camera.Following takes any IFollowable, so a mod object can be followed with no registration; what the interface must answer, and how SetFollow's teleport and control swap are avoided
topic: follow-a-point-that-is-not-a-vehicle
category: camera
group: main-view
approaches: 5
game_types: [KSA.IFollowable, KSA.Camera, KSA.OrbitView, KSA.WreckageMarker, KSA.OrbitController, KSA.FixedController, KSA.CameraReferenceFrame, KSA.Program, KSA.Vehicle]
lifecycle: [frame:viewports, frame:celestials, frame:draw-ui]
demonstrated_by: [mods/gatos/features/synthetic-camera-follow-anchor, mods/gatos/features/programmable-camera-director, mods/ksarmory/features/chase-camera-on-a-round, mods/ksarmory/features/borrow-main-view-camera, mods/unscience/features/hot-pursuit-part-mounted-cameras]
tags: [camera, followable, follow, setfollow, teleport]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:20:07Z }
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
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
  - id: ksa-wreckagemarker
    repo: ksa-game-assemblies
    path: current/decomp/KSA/WreckageMarker.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/WreckageMarker.cs
    title: KSA.WreckageMarker (decompiled, build 2026.10.10.5554)
  - id: ksa-fixedcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FixedController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs
    title: KSA.FixedController (decompiled, build 2026.10.10.5554)
  - id: ksa-orbitcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/OrbitController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitController.cs
    title: KSA.OrbitController (decompiled, build 2026.10.10.5554)
---
`Camera.Following` is an `IFollowable`: an object that can say where it is, how fast it moves, how it is oriented and how big it is, plus an `OrbitView`. The engine implements it for
vehicles, celestials and the editing space, and for one non-registered class, `WreckageMarker`, which proves a mod can do the same. Following a mod object gives a camera that tracks something the game never
heard of, with the stock controllers' orbit, reference frames and zoom, but it has to answer the way the controllers expect, and `SetFollow` has two side effects to avoid.

## Engine background

| Type | What matters | Source |
|---|---|---|
| `IFollowable` | `IObjectId, IPosition, IVelocity, IOrientation, IRadius` plus `OrbitView` | [current/decomp/KSA/IFollowable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IFollowable.cs#L1-L6) |
| `Camera.PositionEcl`, `PositionCce` | Derived from `Following.GetPositionEcl()` and `GetBodyFixed2Ecl()` while following | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L81-L131) |
| `Camera.SetFollow`, `Unfollow` | `SetFollow` teleports to 2.5 mean radii and can swap `Program.ControlledVehicle` | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L602-L631) |
| `WreckageMarker` | The engine's own non-vehicle followable | [current/decomp/KSA/WreckageMarker.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/WreckageMarker.cs#L1-L30) |
| `FixedController`, `OrbitController` | Dereference `OrbitView`; `MeanRadius` is a divisor | [current/decomp/KSA/FixedController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs#L36-L38), [current/decomp/KSA/OrbitController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitController.cs#L487-L500), [current/decomp/KSA/OrbitController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitController.cs#L602-L606) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Anchor that re-resolves a vessel, part, body or held point](follow-a-point-that-is-not-a-vehicle-1.md) | gatOS | `custom-followable` | `frame:viewports` | Offsets stay precise at orbital speed; identity body-fixed rotation |
| [2. `RoundFollowable` for the drawn position of a simulated round](follow-a-point-that-is-not-a-vehicle-2.md) | KSArmory | `custom-followable` | `frame:viewports`, `frame:render` | Camera and mesh from one expression; a ladder of fallbacks |
| [3. `SetFollow(false, false)` then write the captured position back](follow-a-point-that-is-not-a-vehicle-3.md) | gatOS | `direct-camera-write` | `frame:viewports` | Exact restore; must be done every time |
| [4. `TryFollowOnMainViewport` without taking control](follow-a-point-that-is-not-a-vehicle-4.md) | KSArmory | `state-record-and-restore` | `frame:draw-ui` | Follow and mode stay separate halves |
| [5. Re-apply the follow after every viewport claim](follow-a-point-that-is-not-a-vehicle-5.md) | unscience | `viewport-lease` | `frame:draw-ui`, `frame:viewports` | A claim resets the viewport; the pose prefix hides the teleport |

## See also

- [Chase a projectile or other fast body with the main camera](../chase-a-fast-body-with-the-main-camera/overview.md), [Play scripted cinematic camera tracks with blends and easing](../../special-views/play-cinematic-camera-tracks/overview.md), [Borrow the main camera, hand it back and arbitrate between camera users](../borrow-the-main-camera-and-hand-it-back/overview.md), [Taking control of another vehicle](../../../vehicles-and-parts/vehicles/take-control-of-another-vehicle/overview.md)
- [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../../../flight-and-orbits/flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
