---
type: Game Feature
title: Write the camera pose inside the viewport pass so it has no frame of lag, or pre-empt a stock controller
description: Why a camera pose set from a StarMap GUI hook is drawn a frame late and the four ways mods write it where the engine's own controller does
topic: write-the-camera-pose-in-phase-with-the-frame
category: camera
group: controllers
approaches: 4
game_types: [KSA.FixedController, KSA.GameViewport, KSA.Camera, KSA.IViewport, KSA.OrbitController, KSA.FlyController, KSA.Controller, KSA.Transform3D]
lifecycle: [frame:viewports, frame:draw-ui]
demonstrated_by: [mods/ksagolf/features/level-horizon-camera-controller, mods/ksastructures/features/level-horizon-camera-controller, mods/ksarmory/features/chase-camera-on-a-round, mods/gatos/features/programmable-camera-director, mods/gatos/features/synthetic-camera-follow-anchor, mods/unscience/features/hot-pursuit-part-mounted-cameras, mods/unscience/features/hot-pursuit-mesh-ray-placement, mods/unscience/features/camera-controller-override-camera-animations]
tags: [camera, phase, frame-order, fixed-camera, controller, jitter]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:39:56Z }
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-gameviewport
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameViewport.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs
    title: KSA.GameViewport (decompiled, build 2026.10.10.5554)
  - id: ksa-fixedcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FixedController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs
    title: KSA.FixedController (decompiled, build 2026.10.10.5554)
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: KSA.Camera (decompiled, build 2026.10.10.5554)
  - id: ksa-orbitcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/OrbitController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitController.cs
    title: KSA.OrbitController (decompiled, build 2026.10.10.5554)
  - id: ksa-flycontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FlyController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlyController.cs
    title: KSA.FlyController (decompiled, build 2026.10.10.5554)
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
---
In one frame `Program.OnFrame` runs `OnFrameViewports` (controllers write cameras, `Camera.OnFrame` builds
matrices) and **then** `OnDrawUiFrame` / `OnDrawUiViewports`, where StarMap's `StarMapBeforeGui` and
`StarMapAfterGui` fire. A pose written from a hook is consumed by the next frame's viewport pass, while the
followed body has moved on; against a target at orbital speed that is jitter, scaling with simulation speed.
The cure is to write the pose where the engine writes it: inside the viewport pass, immediately before
`Camera.OnFrame`.

## Engine background

| Type | Role | Source |
|---|---|---|
| `GameViewport.OnFrame` | `GetActiveController().OnFrame` then `GetCamera().OnFrame` | [current/decomp/KSA/GameViewport.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs#L116-L124) |
| `FixedController.OnFrame` | The two stock writes: `PositionEcl = following + CameraOffset`, `LocalRotation` | [current/decomp/KSA/FixedController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs#L22-L47) |
| `Camera.OnFrame`, `ClampCamera` | Clamp then matrices | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L487-L497), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L633-L639) |
| `OrbitController.OnFrame`, `FlyController.OnFrame` | Rewrite the pose from their own state every frame | [current/decomp/KSA/OrbitController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitController.cs#L487-L500), [current/decomp/KSA/FlyController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlyController.cs#L653-L660) |
| `Program.OnFrameViewports` | Runs every viewport's `OnFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2608-L2689) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. `FixedController` subclass asks a pose source](write-the-camera-pose-in-phase-with-the-frame-1.md) | KSAGolf, KSAStructures, KSArmory | `controller-subclass` | `frame:viewports`, `frame:draw-ui` | Exact phase; needs a controller install ([reflection](../replace-a-viewport-camera-controller/overview.md)) |
| [2. Offset against the followed object sampled in the same call](write-the-camera-pose-in-phase-with-the-frame-2.md) | gatOS | `controller-subclass` | `frame:viewports` | Also in phase and keeps precision at orbital speed; viewport prefix and postfix for sampling and publishing |
| [3. Prefix `FixedController.OnFrame` for owned viewports](write-the-camera-pose-in-phase-with-the-frame-3.md) | unscience (Hot Pursuit) | `harmony-prefix` | `frame:viewports` | No controller swap and other Fixed cameras run stock; Harmony on a hot path |
| [4. Shared name-resolved prefix on Orbit and Free](write-the-camera-pose-in-phase-with-the-frame-4.md) | unscience (Camera Controller Override) | `harmony-prefix` | `frame:viewports`, `frame:draw-ui` | Keeps the player's camera; every Orbit/Free viewport is affected and the pose jumps back when it ends |

## See also

- [Replace a viewport's camera controller and take input through it](../replace-a-viewport-camera-controller/overview.md), [Drive the main camera through Fixed mode without crashing it, with a stable up vector](../drive-the-main-camera-in-fixed-mode/overview.md), [Mount a camera on a vessel part and look through it](../../secondary-viewports/mount-a-camera-on-a-part/overview.md), [Understand KSA camera modes, controllers, the viewport frame order and which camera is which](../understand-camera-modes-and-controllers/overview.md)
- [Keep mod UI and per-frame work running when the HUD is hidden (F2)](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md), [Animate the flight camera with eased moves, keyframe sequences and saved recipes](../../special-views/chain-camera-moves-into-keyframe-sequences/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
