---
type: Submod
title: "Glass"
description: "Overrides the main camera field of view with lens presets from 15 degree telephoto to 120 degree fisheye, kept in place by two main-camera-only Harmony prefixes"
mod: unscience
submod: glass
mod_id: glass
tags: [camera, fov, presets, harmony]
categories: [camera]
features: [mods/unscience/features/glass-fov-override]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T11:56:29Z }
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
  - id: glass-readme-md
    repo: unscience
    path: glass/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/README.md
    title: glass/README.md
  - id: glass-lib-readme-md
    repo: unscience
    path: glass.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/README.md
    title: glass.lib/README.md
  - id: scope-camera-md
    repo: unscience
    path: scope/camera.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md
    title: scope/camera.md
  - id: glass-mod-toml
    repo: unscience
    path: glass/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/mod.toml
    title: glass/mod.toml
  - id: glass-mod-cs
    repo: unscience
    path: glass/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/Mod.cs
    title: glass/Mod.cs
  - id: glass-patcher-cs
    repo: unscience
    path: glass/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/Patcher.cs
    title: glass/Patcher.cs
  - id: glass-lib-glasspatches-cs
    repo: unscience
    path: glass.lib/GlassPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/GlassPatches.cs
    title: glass.lib/GlassPatches.cs
  - id: glass-lib-fovcontroller-cs
    repo: unscience
    path: glass.lib/FovController.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/FovController.cs
    title: glass.lib/FovController.cs
---

Glass ("Glass - Camera Lens") sets the main viewport camera's field of view from eight lens presets or a
manual slider. A static `FovController` owns the override and two prefixes keep it in force: one swallows
the stock FOV key changes on the main camera and one writes the field before the projection is rebuilt.
Secondary cameras (Hot Pursuit, docking) are left alone.

## Hosting

- Manifest id `glass`, entry assembly `MeowSci.Glass` (development host only).
- Standalone host: F9 toggles the window; its Patcher applies `GlassPatches` and `HotkeyGuard`.
- In unscience: `GlassSubmod` is constructed in `Mod.cs` and `Patcher.cs` applies `GlassPatches`.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Main-camera field-of-view override with lens presets](../features/glass-fov-override.md) | camera | `frame:draw-ui`, `frame:input`, `event:load` | Glass drives the main viewport camera's FOV from a static FovController and keeps it there with two main-camera-only prefixes, one on Camera.ChangeFieldOfView that swallows the stock FOV keys and one on Camera.UpdateProjection that writes the private _fovRadians field before every projection rebuild |

## Library classes

`GlassSubmod` (+ `.Saves`), `FovController` (`SetFov`, `DisableOverride`, `ApplyFov`,
`GetCurrentFovDegrees`), `GlassPatches`.

## Scene saves and persistence

Record `glass` (order 200): `SavedLens(Enabled, Degrees)`, validated as finite. Restored after the main
camera has been rebuilt by the native load.

## Further reading

- [glass/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/README.md)
- [glass.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/README.md)
- [scope/camera.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md)

## Entry points

- [glass/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/mod.toml)
- [glass/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/Mod.cs)
- [glass/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass/Patcher.cs)
- [glass.lib/GlassPatches.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/GlassPatches.cs)
- [glass.lib/FovController.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/glass.lib/FovController.cs)

## See also

- [unscience overview](../overview.md)
- [Camera Controller Override](./camera-controller-override.md)
- [Hot Pursuit](./hot-pursuit.md) (per-camera FOV for mounted cameras)
