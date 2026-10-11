---
type: Game Feature
title: Show live vehicle and editor data in an ImGui window or HUD
description: Where the controlled vehicle's settled physics, orbit and engine state (or the editor's part tree) can be read safely, and three ways to present it - a StarMap GUI hook, a postfix on Vehicle.OnDrawUi, a postfix on VehicleEditor.OnDrawUi
topic: show-live-vehicle-data-in-a-window
category: ui
group: windows
approaches: 3
game_types: [KSA.Program, KSA.Vehicle, KSA.PhysicsEnvironment, KSA.PhysicsStates, KSA.PartTree, KSA.VehicleEditor, KSA.VehicleEditingSpace, KSA.CelestialSystem, Brutal.ImGuiApi.ImGui, KSA.GameViewport]
lifecycle: ['frame:apply-solvers', 'frame:draw-ui', 'editor:draw-ui', 'editor:on-frame']
demonstrated_by: [mods/ksaero/features/aero-readout-window, mods/kitten-engineer-redux/features/flight-hud-controlled-vehicle-postfix, mods/kitten-engineer-redux/features/editor-panel-injection]
tags: [readout, hud, controlled-vehicle, editor, part-tree, harmony-postfix, starmap-lifecycle]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:20:47Z }
status: stable
repos:
- name: KSAero
  git: https://github.com/cairn5/KSAero.git
  ref: "3e7e26c9c694a563048261bd6e426e817377d404"
- name: Kitten-Engineer-Redux
  git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
  ref: "d5786a0e75203a18a96936fb3537220d44b7a18b"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
- id: ksa-vehicle
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Vehicle.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
  title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
- id: ksa-universe
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Universe.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
  title: KSA.Universe (decompiled, build 2026.10.10.5554)
- id: ksa-celestialsystem
  repo: ksa-game-assemblies
  path: current/decomp/KSA/CelestialSystem.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
  title: KSA.CelestialSystem (decompiled, build 2026.10.10.5554)
- id: ksa-vehicleeditor
  repo: ksa-game-assemblies
  path: current/decomp/KSA/VehicleEditor.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleEditor.cs
  title: KSA.VehicleEditor (decompiled, build 2026.10.10.5554)
---
A mod that shows live data about the player's craft has to answer two questions: when is the data safe to read, and from which call does the window get drawn? KSA answers the first the same way for every approach (the main thread holds a settled copy of the finished physics step for the whole UI pass) and offers three practical answers to the second.

## Engine background

| Piece | File | Role |
|---|---|---|
| `Program.ControlledVehicle`, `MainViewport`, `Editor`, `EditorFlag` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L225-L227), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L502-L502) | The vehicle the player controls (null in the editor), the main viewport and the editor object |
| `Program.OnFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2290) | `PrepareFrame`, `OnFrameEditor`, then the gated UI calls, then `ImGui.Render` |
| `Universe.ApplyVehicleSolvers` | [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1922-L1952) | Copies the finished physics step onto each `Vehicle` before UI |
| `Vehicle` `ref readonly` state | [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L537-L543) | `BubbleOrigin`, `KinematicStates`, `Props`, `PhysicsEnvironment` |
| `CelestialSystem.OnDrawUi` | [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L363-L408) | Calls `Astronomical.OnDrawUi` per object in view; always includes the controlled vehicle |
| `Program.OnDrawUiThreadSafe` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3178-L3240) | `Universe.OnDrawUi(MainViewport)` when no editor; `Editor?.OnDrawUi(MainViewport)` near the end |
| `VehicleEditor.OnDrawUi` | [current/decomp/KSA/VehicleEditor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleEditor.cs#L5747-L5747) | The editor's UI method (postfix target) |

**Frame order.** `frame:apply-solvers` (state settled) precedes `frame:draw-ui` (reads and drawing); the next physics step runs on worker copies. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Plain ImGui window from StarMapAfterGui](show-live-vehicle-data-in-a-window-1.md) | KSAero | StarMap hook, `ref readonly` reads, guarded `Begin`/`End` | `frame:draw-ui` | Smallest; you test for the vehicle and for the HUD yourself |
| 2 | [Harmony postfix on Vehicle.OnDrawUi](show-live-vehicle-data-in-a-window-2.md) | Kitten Engineer Redux | Postfix filtered to the main viewport and controlled vehicle | `frame:draw-ui` | Inherits the game's draw decisions; Harmony patch on a stock method |
| 3 | [Harmony postfix on VehicleEditor.OnDrawUi](show-live-vehicle-data-in-a-window-3.md) | Kitten Engineer Redux | Postfix, reads the editor's `PartTree` | `editor:draw-ui` | The only way into the editor; no flight state |

## Choosing

- A readout or small window while flying: approach 1.
- A HUD that must follow the game's own "draw this vehicle" decision, or has many sections and alerts: approach 2.
- Anything that has to appear in the vehicle editor: approach 3.

## See also

- [Build a tabbed ImGui window](../build-a-tabbed-imgui-window/overview.md)
- [Keep UI running when the HUD is hidden](../../overlays/draw-ui-while-the-hud-is-hidden/overview.md)
- [Read a vehicle's position, velocity, attitude, orbit and flight instruments](../../../flight-and-orbits/flight-state/read-vehicle-flight-state/overview.md)
- [Build custom-drawn ImGui widgets, icons, trees and alert tiles on the draw list](../../draw-lists/build-custom-drawn-imgui-widgets/overview.md)
- [Inject UI into the game's own windows and menus, including the orbit right-click menu](../../menus/inject-ui-into-a-stock-window/overview.md)

