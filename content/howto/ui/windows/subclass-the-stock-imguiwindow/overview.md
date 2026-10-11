---
type: Game Feature
title: Build a mod window on the game's ImGuiWindow base class, with stable ids and saved placement
description: How KSA.ImGuiWindow gives mod windows stock chrome, menu integration and static registration, what it does not persist, and when a plain ImGui.Begin window is the better choice
topic: subclass-the-stock-imguiwindow
category: ui
group: windows
approaches: 5
game_types: [KSA.ImGuiWindow, KSA.IStaticWindow, KSA.IViewport, KSA.IGameViewport, KSA.VersionInfo, KSA.Program, Brutal.ImGuiApi.ImGui, Brutal.ImGuiApi.ImGuiWindowFlags, Brutal.ImGuiApi.ImGuiViewportPtr]
lifecycle: ['frame:draw-ui', 'event:starmap-unload', 'startup:all-mods-loaded']
demonstrated_by: [mods/ksa-deltavmap/features/map-window-and-menu-entry, mods/ksa-measuretools/features/measure-menu-and-tool-window, mods/ksa-public-telemetry/features/panels-as-static-imgui-windows, mods/purrtty/features/named-terminal-registry-and-theme-dialog, mods/ksastructures/features/settings-menu, mods/purrtty/features/terminal-window-chrome-tabs-and-resize-snap]
tags: [window, imguiwindow, istaticwindow, chrome, menu, placement, imgui-id]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:13Z }
status: stable
repos:
- name: KSA-DeltaVMap
  git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
  ref: "0441981a4c59b90e462fd81fc20d3924b356841a"
- name: KSA-MeasureTools
  git: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools.git
  ref: "aed7f874f1c925c10c733b1dee72bd04b9b1985c"
- name: KSA-Public-Telemetry
  git: https://github.com/elevatorctln/KSA-Public-Telemetry/
  ref: "90608fb465f87d6008208798cc4d20ed8182c9a0"
- name: KSAStructures
  git: https://github.com/LaurensDeV/KSAStructures
  ref: "c24759358381fb10290c61f9a6980b7d832ba3d4"
- name: purrtty
  git: https://github.com/meow-sci/purrtty.git
  ref: "71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: ksa-imguiwindow
  repo: ksa-game-assemblies
  path: current/decomp/KSA/ImGuiWindow.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiWindow.cs
  title: KSA.ImGuiWindow (decompiled, build 2026.10.10.5554)
- id: ksa-istaticwindow
  repo: ksa-game-assemblies
  path: current/decomp/KSA/IStaticWindow.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IStaticWindow.cs
  title: KSA.IStaticWindow (decompiled, build 2026.10.10.5554)
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
- id: ksa-versioninfo
  repo: ksa-game-assemblies
  path: current/decomp/KSA/VersionInfo.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionInfo.cs
  title: KSA.VersionInfo (decompiled, build 2026.10.10.5554)
---
Almost every KSA mod with a UI needs at least one window. KSA ships a base class for exactly this, `KSA.ImGuiWindow`, which the game uses for its own tool windows (thread profiler, saves, layouts, kitten roster, tuning windows). Subclassing it gets a mod a window that looks and behaves like the game's: title
bar, close handling, a **View** menu with always-on-top, detach and autohide, and the stock console chrome if you opt in. It also takes decisions away from you: placement is never persisted, the ImGui id is derived from the type, and your `DrawContent` runs without a safety net.

## Engine background

| Piece | File | What it does |
|---|---|---|
| `ImGuiWindow` | [current/decomp/KSA/ImGuiWindow.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiWindow.cs#L10-L126) | Abstract base; ctor needs an ImGui context; `OnDrawUi(IGameViewport)` does Begin / menu bar / `DrawContent` / End; virtual `DrawMenuBar`, `DrawViewMenu`; protected `_show`, `_scrollbar`, `_noChrome`, `_initialPosition`, `_initialSize`, `UseConsoleChrome` |
| `IStaticWindow` | [current/decomp/KSA/IStaticWindow.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IStaticWindow.cs) | `IsShown` and `OnDrawUi`; an `ImGuiWindow` that implements it is registered by its constructor |
| `ImGuiWindow.DrawAllStaticWindows` | [current/decomp/KSA/ImGuiWindow.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiWindow.cs#L128-L138) | Called from `Program.OnDrawUiFrame` with the main viewport |
| `Program.DrawProgramMenusHook` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4018-L4020) | Empty hook at the end of the menu bar |
| `VersionInfo.Current.VersionString` | [current/decomp/KSA/VersionInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionInfo.cs#L115) | The running build, for tested-version warnings |

Three facts shape every approach:

1. **Default chrome is `NoSavedSettings`.** Position and size are applied with `ImGuiCond.Once` from `_initialPosition`/`_initialSize` and never written to `imgui.ini`. Persist them yourself ([approach 3](subclass-the-stock-imguiwindow-3.md)).
2. **The id comes from the type.** `name + "###" + FullTypeName_`: two open instances of one subclass collide, and the `###` part is what keeps a renamed stock window the same window ([approach 4](subclass-the-stock-imguiwindow-4.md)).
3. **`DrawContent` is unguarded.** An exception skips `ImGui.End` ([approaches 1 and 2](subclass-the-stock-imguiwindow-1.md)).

**Frame order.** `OnDrawUiFrame` draws static windows (before `[StarMapAfterGui]`), `[StarMapAfterGui]` draws your own `OnDrawUi` calls, and `OnDrawUiThreadSafe` draws the menu bar after both. All three are skipped with the HUD hidden. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Lazily created window drawn from StarMapAfterGui](subclass-the-stock-imguiwindow-1.md) | KSA-DeltaVMap | Menu postfix creates it, AfterGui draws it, version warning | `frame:draw-ui` | Most explicit; you own the draw call |
| 2 | [Guarded DrawContent with title-bar close detection](subclass-the-stock-imguiwindow-2.md) | KSA-MeasureTools | Same base, shared teardown, View menu plus a custom menu | `frame:draw-ui`, `event:starmap-unload` | Handles the X button and exceptions |
| 3 | [IStaticWindow auto-registration, layout persisted to mod config](subclass-the-stock-imguiwindow-3.md) | KSA-Public-Telemetry | The game draws the window; placement captured and debounced into config | `frame:draw-ui` | No draw code; one window per subclass |
| 4 | [Stable window ids](subclass-the-stock-imguiwindow-4.md) | purrTTY, KSAStructures | `Label###id` | `frame:draw-ui` | Tiny; the `##` versus `###` trap |
| 5 | [Chrome-less plain-ImGui window](subclass-the-stock-imguiwindow-5.md) | purrTTY | Own chrome: alpha-0 strip, drag guard, cell-snapped resize | `frame:draw-ui` | Full control; you rebuild everything the base gave you |

## Choosing

- A conventional tool window: approach 1 or 2 (explicit draw) or 3 (game draws it).
- It must keep its place across restarts: add approach 3's capture.
- A window that must not look like a window: approach 5.

## See also

- [Make mod UI look like the game: console widgets, window skin and global theme](../match-the-stock-console-ui-style/overview.md)
- [Build a tabbed ImGui window](../build-a-tabbed-imgui-window/overview.md)
- [Build a mod settings window](../build-a-settings-window/overview.md)
- [Draw full-screen click-through overlays](../../overlays/draw-a-fullscreen-click-through-overlay/overview.md)
- [Add a menu to the game's top menu bar](../../menus/add-items-to-the-game-menu-bar/overview.md)
- [Persist ImGui window state and layouts](../../../persistence/user-data/persist-imgui-window-state/overview.md)
- [Draw per-frame text efficiently: monospace grids and allocation-free labels](../../draw-lists/draw-a-monospace-text-grid/overview.md)

