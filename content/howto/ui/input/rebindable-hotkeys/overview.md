---
type: Game Feature
title: Implement rebindable hotkeys with ImGui key state
description: How mods bind, poll and re-capture hotkeys from ImGui key state instead of KSA's input bindings, with enum-name JSON and key-plus-modifier TOML variants
topic: rebindable-hotkeys
category: ui
group: input
approaches: 2
game_types: [Brutal.ImGuiApi.ImGuiKey, Brutal.ImGuiApi.ImGuiIOPtr, KSA.Program]
lifecycle: ['frame:draw-ui', 'frame:input', 'startup:all-mods-loaded']
demonstrated_by: [mods/ksa-public-telemetry/features/rebindable-numpad-hotkeys, mods/purrtty/features/rebindable-toggle-hotkey]
tags: [hotkeys, imgui, imguikey, rebinding, capture, config]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T17:53:22Z }
status: stable
repos:
- name: KSA-Public-Telemetry
  git: https://github.com/elevatorctln/KSA-Public-Telemetry/
  ref: "90608fb465f87d6008208798cc4d20ed8182c9a0"
- name: purrtty
  git: https://github.com/meow-sci/purrtty.git
  ref: "71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: brutal-imguiapi-imgui
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImGui.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs
  title: Brutal.ImGuiApi.ImGui (decompiled, build 2026.10.10.5554)
- id: brutal-imguiapi-imguikey
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImGuiKey.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGuiKey.cs
  title: Brutal.ImGuiApi.ImGuiKey (decompiled, build 2026.10.10.5554)
- id: brutal-imguiapi-imguiioptr
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImGuiIOPtr.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGuiIOPtr.cs
  title: Brutal.ImGuiApi.ImGuiIOPtr (decompiled, build 2026.10.10.5554)
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
- id: ksa-input
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Input.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Input.cs
  title: KSA.Input (decompiled, build 2026.10.10.5554)
---
KSA has a binding system of its own (`Input`, `InputAction`, stored in the game settings and matched in `Program.OnKey`), but it is not an extension point: a mod cannot add an action to the
player's bindings screen. Both mods that offer a configurable hotkey bypass it and poll ImGui key state, which also means they work whether or not the 3D view has focus. The recipe is
the same in both: store an `ImGuiKey` (and modifiers), poll `IsKeyPressed(key, repeat: false)` outside text input, and capture a new binding by scanning the keys for the first press.

## Engine background

| Piece | File | Notes |
|---|---|---|
| `ImGui.IsKeyPressed(ImGuiKey, bool repeat)` | [current/decomp/Brutal.ImGuiApi/ImGui.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs#L8146) | Press edge; use `repeat: false` |
| `ImGuiKey` | [current/decomp/Brutal.ImGuiApi/ImGuiKey.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGuiKey.cs#L6) | `NamedKey_BEGIN = 512` through `Oem102 = 631`; function, keypad, letters, modifiers |
| `ImGuiIOPtr.WantTextInput`, `KeyShift`, `KeyCtrl`, `KeyAlt`, `KeySuper` | [current/decomp/Brutal.ImGuiApi/ImGuiIOPtr.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGuiIOPtr.cs#L140-L186) | Text-field suppression and modifier match |
| `Program.OnKey` / `DispatchKeyEvent` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1745-L1776) | KSA's own binding dispatch, which a mod hotkey does not join |
| `Input` | [current/decomp/KSA/Input.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Input.cs#L90-L129) | `Matches`, `Contains`, `MouseBound` over `GameSettings.KeyBindings` |

**Frame order.** Keys reach ImGui during `Glfw.PollEvents` in `PrepareFrame` (`frame:input`) and ImGui evaluates them in `NewFrame`; `IsKeyPressed` is then valid anywhere in the UI pass (`frame:draw-ui`). A hotkey
polled from the StarMap GUI hook stops when the HUD is hidden unless it is also polled from a call that still runs (see
[keep UI running when the HUD is hidden](../../overlays/draw-ui-while-the-hud-is-hidden/overview.md)). See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Enum names in JSON and a capture loop over the ImGuiKey range](rebindable-hotkeys-1.md) | KSA-Public-Telemetry | Three single-key bindings, a click-then-press button, JSON enum names | `frame:draw-ui` | Tiny; no modifiers |
| 2 | [Key plus modifiers with a modal capture, stored in TOML](rebindable-hotkeys-2.md) | purrTTY | Readonly binding struct with exact modifier match, modal capture, TOML round trip | `frame:draw-ui`, `startup:all-mods-loaded` | More code; handles chords, Super via reflection |

## Choosing

- A handful of single-key toggles: approach 1. A chord users expect to customise, with a proper dialog: approach 2.
- Either way, also decide what happens to the same key in the game ([block game hotkeys while typing](../block-game-hotkeys-while-typing/overview.md)).

## See also

- [Block game hotkeys while typing into an ImGui field](../block-game-hotkeys-while-typing/overview.md)
- [Read typed text, key chords and the clipboard from ImGui](../read-typed-text-and-key-chords-from-imgui/overview.md)
- [Share the keyboard and mouse between ImGui, mod tools and the game](../coordinate-imgui-focus-with-game-input/overview.md)
- [Persist mod settings as TOML](../../../persistence/settings-formats/persist-mod-settings-toml/overview.md)

