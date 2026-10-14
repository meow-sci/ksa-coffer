---
type: Mod Feature
title: Live effect tuning and input
description: Expose validated live appearance controls and persistent scene settings through a
  HUD-independent ImGui window with rendering diagnostics
mod: blasto
category: ui
tags:
  - blasto
  - ui
  - starmap-lifecycle
  - harmony-prefix
  - harmony-postfix
  - imgui-window
  - imgui-menu
  - json-config
techniques:
  - starmap-lifecycle
  - harmony-prefix
  - harmony-postfix
  - imgui-window
  - imgui-menu
  - json-config
game_types:
  - KSA.Program
  - KSA.GameSettings
lifecycle:
  - frame:draw-ui
  - frame:input
  - frame:apply-solvers
hooks:
  - starmap StarMapAfterGui
  - harmony-postfix KSA.Program.DrawProgramMenusHook
  - harmony-prefix KSA.Program.OnDrawUiConsole
  - harmony-prefix KSA.GameSettings.OnKeyAll
  - harmony-prefix KSA.Universe.ApplyVehicleSolvers
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:05Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ui
    repo: blasto
    path: Blasto.GameMod/Mod.Ui.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs
    title: Native menu, diagnostics, clear confirmation and text guard
  - id: tuning
    repo: blasto
    path: Blasto.GameMod/Mod.Tuning.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs
    title: Eleven controls, suggested drag bounds and retained settings
  - id: entry
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Menu, hidden UI and input patch registration
  - id: commit
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Validate before committing settings to subsystems
  - id: settings
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastSaveDocument.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs
    title: Legacy-compatible settings with finite float checks
  - id: diagnostics
    repo: blasto
    path: Blasto.GameMod/Mod.Diagnostics.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Diagnostics.cs
    title: Copyable pipeline, view, simulation and save counters
  - id: program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: HUD-dependent and unconditional UI calls
  - id: keys
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameSettings.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSettings.cs
    title: Native key handling returns a consumed flag
  - id: starmap
    repo: StarMap
    path: StarMap.Core/Patches/ProgramPatcher.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs
    title: AfterGui is the viewport-UI postfix
---

The Blasto menu opens one ImGui window for surface appearance, future exposure, dust and diagnostics. Its alternate console-UI hook keeps an already-open window available when the game's HUD is hidden.[^ui][^entry][^program]

## How it works

Six appearance controls modify live radius, visibility and material weights; buildup and threshold affect future exposure; dust opacity updates active emitters while size/speed apply to new particles. The settings record is persisted with the scene.[^tuning][^settings]

`DragFloat` uses `ImGuiSliderFlags.None`: mouse-drag ranges are suggestions, while manually entered values may exceed them. Reject invalid sign, nonfinite values and GPU-unrepresentable products before committing the immutable settings snapshot. A rejected tuning value displays an inline error and retains previous settings.[^tuning][^commit][^settings]

A `GameSettings.OnKeyAll` prefix consumes key events when ImGui wants text input and the game console is closed. The native menu and hidden-HUD path are independent patches, not a ModMenu dependency.[^ui][^entry][^keys]

Diagnostics expose both pipeline creation and actual private descriptor-bind counts, plus per-view selection, surface/queue errors and save status. A queued strong test mark enables magenta projection highlight to separate placement/binding failures from ordinary material visibility. Clear requires an in-window confirmation and queues destructive work for the next safe apply boundary.[^ui][^diagnostics]

## Lifecycle and timing

`StarMapAfterGui` is a postfix on `Program.OnDrawUiViewports`, which runs only when `DrawUI` is true. The prefix on `OnDrawUiConsole` draws only when `DrawUI` is false; both paths occur before `ImGui.Render` on frames that continue past preparation. Key handling is `frame:input`; destructive clear work is deferred to `frame:apply-solvers`.[^starmap][^program][^ui][^entry]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Mod.Ui.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs#L9-L112) | Native menu, diagnostics, clear confirmation and text guard[^ui] |
| [Blasto.GameMod/Mod.Tuning.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs#L11-L97) | Eleven controls, suggested drag bounds and retained settings[^tuning] |
| [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L32-L51) | Menu, hidden UI and input patch registration[^entry] |
| [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L88-L101) | Validate before committing settings to subsystems[^commit] |
| [Blasto.GameMod/Persistence/BlastSaveDocument.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs#L7-L34) | Legacy-compatible settings with finite float checks[^settings] |
| [Blasto.GameMod/Mod.Diagnostics.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Diagnostics.cs#L7-L35) | Copyable pipeline, view, simulation and save counters[^diagnostics] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2240-L2288) | HUD-dependent and unconditional UI calls[^program] |
| [current/decomp/KSA/GameSettings.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSettings.cs#L3422-L3435) | Native key handling returns a consumed flag[^keys] |
| [StarMap.Core/Patches/ProgramPatcher.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs#L26-L36) | AfterGui is the viewport-UI postfix[^starmap] |

## Snippets

```csharp
// Blasto.GameMod/Mod.Tuning.cs L81-L96
    private bool DrawTuningControl(ImString label, double current, float speed, float minimum,
        float maximum, bool positive, ImString tooltip, out double updated)
    {
        float value = (float)current;
        // None intentionally leaves manual text entry free of the drag range.
        bool changed = ImGui.DragFloat(label, ref value, speed, minimum, maximum, "%.3g"u8, ImGuiSliderFlags.None);
        ImGui.SetItemTooltip(tooltip);
        updated = value;
        if (!changed) return false;
        if (!float.IsFinite(value) || (positive ? value <= 0 : value < 0))
        {
            _tuningError = $"{label.ToString()}: enter a finite {(positive ? "positive" : "nonnegative")} number. The previous value is retained.";
            return false;
        }
        _tuningError = "";
        return true;
```

```csharp
// Blasto.GameMod/Mod.Ui.cs L107-L111
    private static bool GuardTextInput(ref bool __result)
    {
        if (!KSA.Program.ConsoleWindow.IsOpen && ImGui.GetIO().WantTextInput)
        { __result = true; return false; }
        return true;
```

## Game APIs touched

`Program.DrawProgramMenusHook` hosts the native-menu extension. `Program.OnDrawUiConsole` supplies the HUD-independent draw point. `GameSettings.OnKeyAll` returns whether input was consumed; the prefix sets that result and skips native processing during text input.[^entry][^program][^keys]

## Pitfalls and version notes

The menu itself is part of the ordinary HUD; hiding it does not create a new way to open a closed window. There is no UI draw on early-exit frames. Highlight is temporary and unsaved, while its test mark is persistent. Drag/manual-entry behavior and new 0.1.3 visuals still require live game verification.

## See also

- [Persistent exposure site store](persistent-exposure-site-store.md)
- [Unsigned Vulkan limit validation](unsigned-vulkan-limit-validation.md)
- [Save-bound sidecar transactions](save-bound-sidecar-transactions.md)
- [Tune saved terrain effects and diagnose rendering from an ImGui window](../../../howto/ui/windows/build-a-settings-window/build-a-settings-window-7.md) - how-to article demonstrating this feature

[^ui]: Native menu, diagnostics, clear confirmation and text guard.
[^tuning]: Eleven controls, suggested drag bounds and retained settings.
[^entry]: Menu, hidden UI and input patch registration.
[^commit]: Validate before committing settings to subsystems.
[^settings]: Legacy-compatible settings with finite float checks.
[^diagnostics]: Copyable pipeline, view, simulation and save counters.
[^program]: HUD-dependent and unconditional UI calls.
[^keys]: Native key handling returns a consumed flag.
[^starmap]: AfterGui is the viewport-UI postfix.
