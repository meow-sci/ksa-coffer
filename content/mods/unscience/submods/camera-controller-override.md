---
type: Submod
title: "Camera Controller Override"
description: "Cinematic camera animations and keyframe sequences that pre-empt the stock Orbit and Fly camera controllers while a sequence plays, with eased target-relative moves and saved recipes"
mod: unscience
submod: camera-controller-override
mod_id: camera-controller-override
tags: [camera, animation, keyframes, easing, harmony]
categories: [camera]
features: [mods/unscience/features/camera-controller-override-camera-animations, mods/unscience/features/camera-controller-override-keyframe-sequences]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T11:56:28Z }
status: stable
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: camera-controller-override-readme-md
    repo: unscience
    path: camera-controller-override/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/README.md
    title: camera-controller-override/README.md
  - id: camera-controller-override-lib-readme-md
    repo: unscience
    path: camera-controller-override.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override.lib/README.md
    title: camera-controller-override.lib/README.md
  - id: scope-camera-md
    repo: unscience
    path: scope/camera.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md
    title: scope/camera.md
  - id: camera-saves-tests-readme-md
    repo: unscience
    path: camera-saves.tests/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-saves.tests/README.md
    title: camera-saves.tests/README.md
  - id: camera-controller-override-mod-toml
    repo: unscience
    path: camera-controller-override/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/mod.toml
    title: camera-controller-override/mod.toml
  - id: camera-controller-override-mod-cs
    repo: unscience
    path: camera-controller-override/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/Mod.cs
    title: camera-controller-override/Mod.cs
  - id: camera-controller-override-patcher-cs
    repo: unscience
    path: camera-controller-override/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/Patcher.cs
    title: camera-controller-override/Patcher.cs
  - id: camera-controller-override-lib-cameracontrolleroverridepatches-cs
    repo: unscience
    path: camera-controller-override.lib/CameraControllerOverridePatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override.lib/CameraControllerOverridePatches.cs
    title: camera-controller-override.lib/CameraControllerOverridePatches.cs
---

Camera Controller Override (shown as "Camera Animations" in the toolbox) plays eased camera moves (zoom in
and out, zoom to offset, spirals, orbit, loopy orbit, shake, pan, rotate) and chains them into keyframe
sequences with parallel groups and an optional blend back to the starting pose. A shared Harmony prefix on
the stock `OrbitController.OnFrame` and `FlyController.OnFrame` hands the live camera to the sequence
player while it runs, so the stock controllers resume untouched afterwards.

## Hosting

- Manifest id `camera-controller-override`, entry assembly `MeowSci.CameraControllerOverride` (development
  host only).
- Standalone host: F11 toggles the window; its Patcher applies `CameraControllerOverridePatches` with the
  host's `KeyframeSequencePlayer`, and `HotkeyGuard`.
- In unscience: `Mod.cs` hands `cameraOverride.SequencePlayer` to `Patcher.CameraSequencePlayer` before
  `CameraControllerOverridePatches.Apply` runs on the consolidated instance.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Cinematic camera moves by pre-empting the Orbit and Fly controllers](../features/camera-controller-override-camera-animations.md) | camera | `frame:viewports`, `frame:draw-ui` | A shared Harmony prefix on OrbitController.OnFrame and FlyController.OnFrame hands the controller's live Camera to an animation player while a sequence plays, so ten eased, target-relative moves (zooms, spirals, orbits, loopy orbit, shake, pan, rotate) replace the stock camera math for that frame |
| [Keyframe camera sequences with parallel groups, return-to-start and saved recipes](../features/camera-controller-override-keyframe-sequences.md) | camera | `frame:viewports`, `frame:draw-ui`, `event:save`, `event:load` | KeyframeSequencePlayer chains camera animations into a played, paused or stopped sequence, composes simultaneous moves as one keyframe, blends back to the captured start pose, and saves the authored sequence as validated recipe JSON with the scene |

## Library classes

`CameraControllerOverrideSubmod` (configuration and UI, + `.Saves`), `CameraControllerOverridePatches`,
`Animation/KeyframeSequencePlayer`, `Animation/Keyframe`, `Animation/AnimationGroup`,
`Animation/IKeyframeAnimation`, `Animation/AnimationHelpers`, `Animation/SavedAnimation`, ten animation classes
under `Animation/Animations/`, `UI/KeyframeSequencePanel`; easing from `ksa-abstractions.lib/EasingHelper`.

## Scene saves and persistence

Record `camera-controller-override` (order 210, after the main camera exists): the authored keyframes, a
pending parallel group and the return-to-start settings, as `SavedAnimation` recipes. Sequences restore
stopped; playback state is not a checkpoint. Covered by `camera-saves.tests`.

## Further reading

- [camera-controller-override/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/README.md)
- [camera-controller-override.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override.lib/README.md)
- [scope/camera.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md)
- [camera-saves.tests/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-saves.tests/README.md)

## Entry points

- [camera-controller-override/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/mod.toml)
- [camera-controller-override/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/Mod.cs)
- [camera-controller-override/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override/Patcher.cs)
- [camera-controller-override.lib/CameraControllerOverridePatches.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/camera-controller-override.lib/CameraControllerOverridePatches.cs)

## See also

- [unscience overview](../overview.md)
- [Glass](./glass.md) (field of view)
- [Hot Pursuit](./hot-pursuit.md) (secondary cameras)
