---
type: Submod
title: "Blinky"
description: "Builds NxM grids of real engine parts on a live vessel at runtime and lights them as an LCD display by switching engine controllers, with feed wiring, patterns and scrolling text"
mod: unscience
submod: blinky
mod_id: blinky
tags: [pixel-grid, engines, runtime-parts, propellant-feed, animation]
categories: [vehicles-and-parts]
features: [mods/unscience/features/blinky-engine-pixel-feed-wiring, mods/unscience/features/blinky-runtime-part-grid-builder, mods/unscience/features/blinky-scroll-animation-and-patterns]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T11:56:27Z }
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
  - id: blinky-readme-md
    repo: unscience
    path: blinky/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/README.md
    title: blinky/README.md
  - id: blinky-lib-readme-md
    repo: unscience
    path: blinky.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/README.md
    title: blinky.lib/README.md
  - id: scope-pixel-grids-and-render-md
    repo: unscience
    path: scope/pixel-grids-and-render.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/pixel-grids-and-render.md
    title: scope/pixel-grids-and-render.md
  - id: blinky-mod-toml
    repo: unscience
    path: blinky/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/mod.toml
    title: blinky/mod.toml
  - id: blinky-mod-cs
    repo: unscience
    path: blinky/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/Mod.cs
    title: blinky/Mod.cs
  - id: blinky-patcher-cs
    repo: unscience
    path: blinky/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/Patcher.cs
    title: blinky/Patcher.cs
  - id: blinky-lib-blinkysubmod-cs
    repo: unscience
    path: blinky.lib/BlinkySubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/BlinkySubmod.cs
    title: blinky.lib/BlinkySubmod.cs
  - id: blinky-lib-blinkypatches-cs
    repo: unscience
    path: blinky.lib/BlinkyPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/BlinkyPatches.cs
    title: blinky.lib/BlinkyPatches.cs
---

Blinky turns a vessel into a dot-matrix display. It creates an NxM grid of engine parts (two per
pixel) from a part template, attaches them under the vessel root in one part-tree rebuild, wires each
engine to a tank through its declared feed connector so it can actually ignite, and then shows patterns,
static images or a scrolling marquee by switching engine controllers on and off. Several named grids can
live on one vessel, keyed by `(vehicleId, gridName)`; a global scan finds existing grids by their
`pixel_<grid>_<row>_<col>_<a|b>` part ids. The tiny engine meshes can be hidden through the shared
[part render filter](../features/lib-part-render-filter.md).

## Hosting

- Manifest id `blinky`, entry assembly `MeowSci.Blinky` (development host only; only unscience ships).
- Standalone host: F11 toggles the window; its Patcher applies `BlinkyPatches` (render-skip registration
  with the shared `PartRenderFilter`) and `HotkeyGuard`.
- In unscience: `BlinkySubmod` is constructed in `Mod.cs` and `Patcher.cs` applies `BlinkyPatches` on the
  consolidated Harmony instance.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Feed runtime-created engines through their declared feed connectors](../features/blinky-engine-pixel-feed-wiring.md) | vehicles-and-parts | `frame:draw-ui`, `frame:prepare`, `event:load` | Blinky connects each pixel engine's RocketCore.FeedConnectors entry to a tank part, aligns its stage, rebuilds the resource managers and reads Combustor.ResourceManager.ConsumptionOrder to prove every engine can reach propellant |
| [Build NxM grids of real engine parts on a live vessel at runtime](../features/blinky-runtime-part-grid-builder.md) | vehicles-and-parts | `frame:draw-ui`, `frame:prepare`, `event:load` | Blinky creates hundreds of engine parts from a PartTemplate, wires them under the vessel root by hand through TreeParent and TreeChildren, and rebuilds the vessel with one PartTree.CreateFromNewPartTree call instead of merging part by part |
| [Drive a pixel display by switching engine controllers on and off](../features/blinky-scroll-animation-and-patterns.md) | vehicles-and-parts | `frame:draw-ui`, `frame:input`, `frame:render`, `event:load` | Blinky lights grid pixels with buffered EngineController.SetIsActive calls, offering pattern presets, a diffing static display and a column-stepped scrolling marquee, while the shared PartRenderFilter hides the tiny engine meshes |

## Library classes

`BlinkySubmod` (UI), `BlinkyGridManager` (compound-key registry; pattern, static, scroll and off APIs;
`ScanAllVehicles`), `LcdGridBuilder` (`BuildGrid`, `DestroyGrid`, `ScanExistingGrid`, `RepairFuelFeeds`),
`LcdGridConfig`, `PixelGrid`, `BlinkyPixelGrid`, `PixelPatterns`, `ScrollAnimation`, `BuiltInScrollPixels`,
`PropellantFeedDiagnostics`, `NonLcdEngineCache`, `BlinkyPatches` / `BlinkyPatchState`.

## Scene saves and persistence

Record `blinky` (order 30): the render-meshes flag and, per grid, vehicle id, name, ownership, cell list
and scroll state. Restore does not rebuild parts, because KSA's own save already recreated them: it
re-registers the grid on the reconstructed parts, calls `LcdGridBuilder.RepairFuelFeeds` and resumes the
display, warning per grid on failure. See the [scene save sidecar](../features/unscience-scene-save-sidecar.md).

## Further reading

- [blinky/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/README.md)
- [blinky.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/README.md)
- [scope/pixel-grids-and-render.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/pixel-grids-and-render.md)

## Entry points

- [blinky/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/mod.toml)
- [blinky/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/Mod.cs)
- [blinky/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky/Patcher.cs)
- [blinky.lib/BlinkySubmod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/BlinkySubmod.cs)
- [blinky.lib/BlinkyPatches.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/blinky.lib/BlinkyPatches.cs)

## See also

- [unscience overview](../overview.md)
- [Its So Shiny](./its-so-shiny.md) (the same grid idea with light parts)
- [Zippo](./zippo.md) (light control)
