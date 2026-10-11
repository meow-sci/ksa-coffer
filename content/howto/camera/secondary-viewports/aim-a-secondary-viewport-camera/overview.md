---
type: Game Feature
title: Aim a secondary viewport camera, rebuild its matrices and give it its nearby body
description: A secondary camera follows nothing and has its matrices built before a GUI hook runs, and the engine fills its nearby planet only for the frame camera; two ways to aim it correctly
topic: aim-a-secondary-viewport-camera
category: camera
group: secondary-viewports
approaches: 2
game_types: [KSA.Camera, KSA.IGameViewport, KSA.FixedController, KSA.Program, KSA.Celestial, KSA.StaticCelestialDistanceRendering, KSA.StaticObjectRenderer]
lifecycle: [frame:draw-ui, frame:viewports, frame:render, frame:celestials]
demonstrated_by: [mods/ksarmory/features/director-camera-window, mods/unscience/features/hot-pursuit-part-mounted-cameras]
tags: [camera, secondary-viewport, aim, matrices, nearby-celestial]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:20:07Z }
repos:
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
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: KSA.Camera (decompiled, build 2026.10.10.5554)
---
Leasing a secondary viewport ([Lease a secondary viewport for a mod camera and show it in a window](../borrow-a-secondary-viewport/overview.md)) gives a mod a camera. Aiming it correctly takes care of two engine facts: the camera's view matrices are built in `Camera.OnFrame` during the viewport pass, before any GUI hook, and the nearby body, distances and altitude that terrain, sky and static objects read are computed only for
the frame camera in `Program.OnFrameCelestials`.

## Engine background

| Type | Role | Source |
|---|---|---|
| `Camera.LookAt`, `OnFrame`, `ClampCamera` | Pose, matrices, 0.5 m terrain clamp | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L211-L220), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L487-L497), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L633-L639) |
| `Camera.NearbyCelestial` and the distance fields; `GetEffectiveNearbyCelestial` | Per-camera state | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L21-L28), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L164-L167) |
| `Program.OnFrameCelestials` | Fills those fields for the frame camera only | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2701-L2732) |
| `Program.UpdateShaderData`, `SetCameraUbo`, `FindNearbyCelestial` | Per-viewport shader data and the nearby lookup | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1346-L1360), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2854-L2860), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5228) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. `LookAt` from the hook, then `OnFrame`, `UpdateShaderData`, `SetCameraUbo`; `SetNearbyContext`](aim-a-secondary-viewport-camera-1.md) | KSArmory | `direct-camera-write` | `frame:draw-ui`, `frame:render` | Works from a plain hook; three manual rebuilds that may be redundant |
| [2. Pose written in a `FixedController.OnFrame` prefix; nearby sync inside it](aim-a-secondary-viewport-camera-2.md) | unscience | `harmony-prefix` | `frame:viewports` | In phase, no rebuilds; a Harmony patch scoped to owned viewports |

## See also

- [Lease a secondary viewport for a mod camera and show it in a window](../borrow-a-secondary-viewport/overview.md), [Write the camera pose inside the viewport pass so it has no frame of lag, or pre-empt a stock controller](../../controllers/write-the-camera-pose-in-phase-with-the-frame/overview.md), [Mount a camera on a vessel part and look through it](../mount-a-camera-on-a-part/overview.md), [Turn the mouse cursor into a world ray and pick points on a construction plane](../../../ui/input/cursor-to-world-ray/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
