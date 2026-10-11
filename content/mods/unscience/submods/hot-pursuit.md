---
type: Submod
title: "Hot Pursuit"
description: "Mounts live cameras on clicked vessel parts by leasing the stock secondary viewports and replacing the fixed camera controller only for those viewports, with mesh-precise placement and stable part anchoring"
mod: unscience
submod: hot-pursuit
mod_id: hot-pursuit
tags: [camera, secondary-viewport, raycast, part-anchor, harmony]
categories: [camera]
features: [mods/unscience/features/hot-pursuit-mesh-ray-placement, mods/unscience/features/hot-pursuit-part-mounted-cameras]
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
  - id: hot-pursuit-readme-md
    repo: unscience
    path: hot-pursuit/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/README.md
    title: hot-pursuit/README.md
  - id: hot-pursuit-lib-readme-md
    repo: unscience
    path: hot-pursuit.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/README.md
    title: hot-pursuit.lib/README.md
  - id: scope-camera-md
    repo: unscience
    path: scope/camera.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md
    title: scope/camera.md
  - id: hot-pursuit-mod-toml
    repo: unscience
    path: hot-pursuit/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/mod.toml
    title: hot-pursuit/mod.toml
  - id: hot-pursuit-mod-cs
    repo: unscience
    path: hot-pursuit/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/Mod.cs
    title: hot-pursuit/Mod.cs
  - id: hot-pursuit-patcher-cs
    repo: unscience
    path: hot-pursuit/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/Patcher.cs
    title: hot-pursuit/Patcher.cs
  - id: hot-pursuit-lib-hotpursuitpatches-cs
    repo: unscience
    path: hot-pursuit.lib/HotPursuitPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/HotPursuitPatches.cs
    title: hot-pursuit.lib/HotPursuitPatches.cs
  - id: hot-pursuit-lib-hotpursuitsubmod-saves-cs
    repo: unscience
    path: hot-pursuit.lib/HotPursuitSubmod.Saves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/HotPursuitSubmod.Saves.cs
    title: hot-pursuit.lib/HotPursuitSubmod.Saves.cs
---

Hot Pursuit ("Hot Pursuit - Extra Cameras") lets the player arm placement, click a rendered vessel part and
get a live camera welded to that exact surface in one of KSA's stock secondary viewport windows. Placement is
mesh-precise (cursor ego ray against part meshes); the mount is stored in the hit sub-part's local frame and
re-resolved every frame by vehicle id and part instance id, so cameras follow robotics, floating-origin
shifts and scaled parts, and go dormant when their target disappears. It uses only the stock viewport
rendering; no custom Vulkan path.

## Hosting

- Manifest id `hot-pursuit`, entry assembly `MeowSci.HotPursuit` (development host only).
- Standalone host: F11 toggles the window; its Patcher applies `HotkeyGuard` and `HotPursuitPatches`
  (a selective `FixedController.OnFrame` prefix).
- In unscience: `HotPursuitSubmod` is constructed in `Mod.cs` and `Patcher.cs` applies `HotPursuitPatches`.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Click-to-mount picking on vessel meshes with stable part anchoring](../features/hot-pursuit-mesh-ray-placement.md) | camera | `frame:draw-ui`, `frame:viewports` | A one-shot click casts Cursor.GetEgoRay against every vessel with Part.RayCastEgo, stores the hit in the hit sub-part's local frame and re-resolves the anchor each frame by vehicle id and Part.InstanceId, going dormant when the target is gone |
| [Live part-mounted cameras in leased stock secondary viewports](../features/hot-pursuit-part-mounted-cameras.md) | camera | `frame:viewports`, `frame:draw-ui`, `frame:render`, `event:save`, `event:load` | Hot Pursuit claims stock secondary viewports through ViewportRegistry and replaces FixedController.OnFrame only for its own viewports with a part-relative pose and nearby-celestial sync, so the stock renderer draws a camera riding a sub-part |

## Library classes

`HotPursuitSubmod` (+ `.Placement`, `.Ui`, `.Saves`), `HotPursuitCamera` (camera and owner state),
`HotPursuitPicker` (ray pick), `HotPursuitPose` (part-relative pose math), `HotPursuitCelestialState`
(nearby-celestial sync), `HotPursuitPatches`.

## Scene saves and persistence

Record `hot-pursuit` (order 180): per camera, a [stable part reference](../features/lib-save-part-identity.md),
mount pose, FOV, resolution, visibility and whether its viewport was open. Restore re-resolves the part and
reopens the viewport when a slot is free; otherwise the camera is restored closed with a warning. The viewport
index and lease token are never saved.

## Further reading

- [hot-pursuit/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/README.md)
- [hot-pursuit.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/README.md)
- [scope/camera.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/camera.md)

## Entry points

- [hot-pursuit/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/mod.toml)
- [hot-pursuit/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/Mod.cs)
- [hot-pursuit/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit/Patcher.cs)
- [hot-pursuit.lib/HotPursuitPatches.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/HotPursuitPatches.cs)
- [hot-pursuit.lib/HotPursuitSubmod.Saves.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/hot-pursuit.lib/HotPursuitSubmod.Saves.cs)

## See also

- [unscience overview](../overview.md)
- [Graffiti](./graffiti.md) (same part ray pick)
- [Kitchen Sink](./kitchen-sink.md) (IVA camera unlock)
