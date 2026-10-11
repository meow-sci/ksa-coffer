---
type: Submod
title: "I Feel Seen"
description: "Keeps selected vessels and EVA kittens rendered at any distance by bypassing the game's one-pixel cull with skip-original prefixes on two Vehicle render methods"
mod: unscience
submod: i-feel-seen
mod_id: i-feel-seen
tags: [rendering, culling, harmony]
categories: [rendering]
features: [mods/unscience/features/i-feel-seen-render-distance-override]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T04:26:03Z }
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
  - id: i-feel-seen-lib-readme-md
    repo: unscience
    path: i-feel-seen.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen.lib/README.md
    title: i-feel-seen.lib/README.md
  - id: i-feel-seen-readme-md
    repo: unscience
    path: i-feel-seen/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/README.md
    title: i-feel-seen/README.md
  - id: scope-vehicle-physics-md
    repo: unscience
    path: scope/vehicle-physics.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md
    title: scope/vehicle-physics.md
  - id: i-feel-seen-mod-toml
    repo: unscience
    path: i-feel-seen/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/mod.toml
    title: i-feel-seen/mod.toml
  - id: i-feel-seen-mod-cs
    repo: unscience
    path: i-feel-seen/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/Mod.cs
    title: i-feel-seen/Mod.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
---

I Feel Seen keeps chosen vessels and EVA kittens drawn regardless of distance. Two skip-original
Harmony prefixes, resolved by method name, on `Vehicle.GetWorldMatrix(Camera)` and
`Vehicle.UpdateRenderData(IViewport, int)` rebuild the native result without the one-pixel cull
(`Vehicle.IsLargeEnoughToRender` in 5482 and later). It removes the cull only; nothing is enlarged.

## Hosting

- Manifest id `i-feel-seen`, entry assembly `MeowSci.IFeelSeen` (development host only).
- Standalone host: F11 toggles "I Feel Seen"; its Patcher applies `IFeelSeenPatches.Apply(harmony, tracker)`
  and `HotkeyGuard`.
- In unscience the sub-mod's `VehicleTracker` is handed to `Patcher.IFeelSeenTracker` before patching.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Bypass the one-pixel render cull for chosen vessels](../features/i-feel-seen-render-distance-override.md) | rendering | `frame:render`, `frame:draw-ui` | I Feel Seen keeps selected vessels and EVA kittens drawn at any distance with skip-original Harmony prefixes on Vehicle.GetWorldMatrix and Vehicle.UpdateRenderData, both resolved by name, that rebuild the native result without the pixel-size cull |

## Library classes

`IFeelSeenPatches` (both prefixes), `VehicleTracker` / `TrackedVehicle` (vessel reference and visibility
flag), `IFeelSeenSubmod` (filterable combo and tracked table).

## Scene saves and persistence

Participant `i-feel-seen`, version 1: `{VehicleId, Visible}` per tracked vessel, rebound by id; reset
clears the tracker.

## Notes

The standalone project's README shows illustrative pseudocode with members that do not exist in the
game (`ComputeWorldMatrix`, `ForceUpdateRenderData`); the library README and the feature page reflect
the real code.

## Further reading

- [i-feel-seen.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen.lib/README.md)
- [i-feel-seen/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/README.md)
- [scope/vehicle-physics.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md)

## Entry points

- [i-feel-seen/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/mod.toml)
- [i-feel-seen/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/i-feel-seen/Mod.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs)

## See also

- [unscience overview](../overview.md)
- [Godzilla](./godzilla.md) (redirects the same cull for scaled vessels)
