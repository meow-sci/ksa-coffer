---
type: Game Feature
title: Draw charts, scopes and relief maps with the ImGui draw list
description: Plotting time series, functions of altitude and map-like instruments from ImDrawList primitives inside a KSA mod window, with the game data each one samples
topic: draw-a-chart-with-imdrawlist
category: ui
group: draw-lists
approaches: 3
game_types: [Brutal.ImGuiApi.ImDrawListPtr, Brutal.ImGuiApi.ImGui, Brutal.ImGuiApi.ImDrawListExtensions, KSA.PhysicalAtmosphereReference, KSA.AtmosphereReference, KSA.Celestial, KSA.Vehicle, KSA.Universe]
lifecycle: ['frame:draw-ui']
demonstrated_by: [mods/kitten-engineer-redux/features/draw-list-line-graph, mods/compendium/features/atmosphere-profile-graph, mods/ksarmory/features/radar-scope-and-relief-map]
tags: [chart, graph, plot, scope, relief-map, draw-list, imgui]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:52:21Z }
status: stable
repos:
- name: Compendium
  git: https://github.com/meow-sci/Compendium.git
  ref: "62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c"
- name: Kitten-Engineer-Redux
  git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
  ref: "d5786a0e75203a18a96936fb3537220d44b7a18b"
- name: KSArmory
  git: https://github.com/LaurensDeV/KSArmory.git
  ref: "cbd63d6d84da7a48a13641a641d3557bad216435"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: brutal-imguiapi-imgui
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImGui.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs
  title: "Brutal.ImGuiApi.ImGui (decompiled, build 2026.10.10.5554)"
- id: brutal-imguiapi-imdrawlistextensions
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
  title: "Brutal.ImGuiApi.ImDrawListExtensions (decompiled, build 2026.10.10.5554)"
- id: brutal-implotapi-implot
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImPlotApi/ImPlot.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImPlotApi/ImPlot.cs
  title: "Brutal.ImPlotApi.ImPlot (decompiled, build 2026.10.10.5554)"
- id: ksa-profilerplots
  repo: ksa-game-assemblies
  path: current/decomp/KSA/ProfilerPlots.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerPlots.cs
  title: "KSA.ProfilerPlots (decompiled, build 2026.10.10.5554)"
- id: ksa-physicalatmospherereference
  repo: ksa-game-assemblies
  path: current/decomp/KSA/PhysicalAtmosphereReference.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicalAtmosphereReference.cs
  title: "KSA.PhysicalAtmosphereReference (decompiled, build 2026.10.10.5554)"
- id: ksa-celestial
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Celestial.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
  title: "KSA.Celestial (decompiled, build 2026.10.10.5554)"
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: "KSA.Program (decompiled, build 2026.10.10.5554)"
---
KSA gives mod windows no charting widget of its own. A mod that wants a graph, a polar scope or a terrain map has two choices: use the ImPlot binding that ships with the game, or draw the picture itself from `ImDrawListPtr` primitives (lines, rectangles, circles, text). The three reference mods in this topic all draw by hand, and each shows a different level of the problem: a general time-series chart with nice axes and hover, a plain function plot over a game quantity, and instruments (a plan-position scope and a hill-shaded map) whose coordinates come from the game's celestial frames. Every drawing call is legal only while ImGui is building the frame, so all of it runs in `frame:draw-ui`; see [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Engine background

| Piece | File | What it gives you |
|---|---|---|
| `ImGui.GetWindowDrawList`, `InvisibleButton`, `Dummy`, `CalcTextSize`, `GetCursorScreenPos`, `GetContentRegionAvail` | [current/decomp/Brutal.ImGuiApi/ImGui.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs#L5648-L5652)[^brutal-imguiapi-imgui] and the neighbours at `InvisibleButton` (L6255) and `Dummy` (L6090) | The window's draw list, layout reservation and text measuring |
| `ImDrawListExtensions` (`AddLine`, `AddRectFilled`, `AddCircle`, `AddText`, `AddNgon`, `AddTriangle`) | [current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs#L51-L60)[^brutal-imguiapi-imdrawlistextensions] | Every mark; colours are `ImColor8`, text is `ImString` (implicitly built from `string`) |
| `Brutal.ImPlotApi.ImPlot` | [current/decomp/Brutal.ImPlotApi/ImPlot.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImPlotApi/ImPlot.cs#L2261)[^brutal-implotapi-implot] | The ImPlot binding. The game's own profiler plots with it (`ImPlot.BeginPlot`, `PlotLine` in [current/decomp/KSA/ProfilerPlots.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerPlots.cs#L141-L162)[^ksa-profilerplots]), so it is the stock alternative to everything below |
| `PhysicalAtmosphereReference` | [current/decomp/KSA/PhysicalAtmosphereReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicalAtmosphereReference.cs#L80-L88)[^ksa-physicalatmospherereference] | `GetAtmosphericDensityAtAltitude` and `GetAtmosphericPressureAtAltitude`: exponentials of altitude over `ScaleHeight` |
| `Celestial` | [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L777)[^ksa-celestial] | `GetTerrainHeightFromDirCce(direction, accurate)` and `GetRotationAxisCce()` (L615) for map frames |
| `Program.OnFrame` UI section | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2262-L2286)[^ksa-program] | Draw calls are legal between `PrepareImGui` and `ImGui.Render()`, and only while `DrawUI` is true |

**What a draw-list chart has to supply itself.** No axis, no tick generator, no clipping to a plot rectangle (the lists clip to the window), no hover test (compare the mouse position with your own rectangle, or reserve the area with `InvisibleButton` and ask `IsItemHovered`). Everything on a chart is a screen-space coordinate, so the first design decision is the data-to-pixel mapping: pick the plot rectangle, then derive `x = left + width * t` and `y = bottom - height * (v - min) / range`.

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Time-series chart with nice-number ticks, extrema, a dashed threshold and a hover crosshair](draw-a-chart-with-imdrawlist-1.md) | Kitten-Engineer-Redux | One function, no state, no ImGui item | `frame:draw-ui` | Best-looking and most reusable; manual layout and raw-mouse hover |
| 2 | [Function plot of density and pressure against altitude](draw-a-chart-with-imdrawlist-2.md) | Compendium | `InvisibleButton` reserves the area, 101 samples of a game function | `frame:draw-ui` | Short and ImGui-layout friendly; fixed five-division ticks, no hover |
| 3 | [Polar scope and cached 64x64 relief map](draw-a-chart-with-imdrawlist-3.md) | KSArmory | East-north-up frame from the rotation axis, cached height grid | `frame:draw-ui` | Instruments, not charts; sampling cost needs a cache |

## Choosing

- A metric against time, with gridlines a human can read: approach 1 (its `NiceAxis` and time-step helpers drop into any panel).
- A quantity against a game variable such as altitude, inside a normal ImGui window: approach 2, which keeps layout in the hands of ImGui.
- Anything that plots world positions or terrain on a flat surface: approach 3, then read [pannable canvases](../build-a-pan-zoom-canvas-in-imgui/overview.md) if the view must zoom and pan.
- If you need many series, zooming and legends, check ImPlot first: it is already in the game and the profiler proves it works in KSA's ImGui backend.

## See also

- [Build custom-drawn ImGui widgets, icons, trees and alert tiles on the draw list](../../../../howto/ui/draw-lists/build-custom-drawn-imgui-widgets/overview.md)
- [Draw per-frame text efficiently: monospace grids and allocation-free labels](../../../../howto/ui/draw-lists/draw-a-monospace-text-grid/overview.md)
- [Build pannable, zoomable and 3D canvases inside an ImGui window](../../../../howto/ui/draw-lists/build-a-pan-zoom-canvas-in-imgui/overview.md)
- [Draw HUD instruments: arc gauges, gradients, scrolling tapes and animated intros](../../../../howto/ui/overlays/draw-hud-instruments-with-the-draw-list/overview.md)
- [Build custom-drawn ImGui widgets, icons, trees and alert tiles on the draw list](../build-custom-drawn-imgui-widgets/overview.md) - related topic
- [Draw per-frame text efficiently: monospace grids and allocation-free labels](../draw-a-monospace-text-grid/overview.md) - related topic

[^brutal-imguiapi-imgui]: Brutal.ImGuiApi.ImGui (decompiled, build 2026.10.10.5554)
[^brutal-imguiapi-imdrawlistextensions]: Brutal.ImGuiApi.ImDrawListExtensions (decompiled, build 2026.10.10.5554)
[^brutal-implotapi-implot]: Brutal.ImPlotApi.ImPlot (decompiled, build 2026.10.10.5554)
[^ksa-profilerplots]: KSA.ProfilerPlots (decompiled, build 2026.10.10.5554)
[^ksa-physicalatmospherereference]: KSA.PhysicalAtmosphereReference (decompiled, build 2026.10.10.5554)
[^ksa-celestial]: KSA.Celestial (decompiled, build 2026.10.10.5554)
[^ksa-program]: KSA.Program (decompiled, build 2026.10.10.5554)
