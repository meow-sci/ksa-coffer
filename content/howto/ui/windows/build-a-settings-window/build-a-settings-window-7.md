---
type: How-To
title: Tune saved terrain effects and diagnose rendering from an ImGui window
description: Build a scene-persisted tuning panel with typed values beyond drag ranges, validated
  immutable settings, hidden-HUD drawing and rendering diagnostics
topic: build-a-settings-window
category: ui
group: windows
approach: 7
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/live-effect-tuning-and-input
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
tags:
  - ui
  - blasto
  - starmap-lifecycle
  - harmony-prefix
  - harmony-postfix
  - imgui-window
  - imgui-menu
  - json-config
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:13Z
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
  - id: starmap-starmap-core-patches-programpatcher-cs
    repo: StarMap
    path: StarMap.Core/Patches/ProgramPatcher.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs
    title: "StarMap: StarMap.Core/Patches/ProgramPatcher.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-gamesettings-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameSettings.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSettings.cs
    title: "ksa-game-assemblies: current/decomp/KSA/GameSettings.cs"
  - id: blasto-blasto-gamemod-simulation-blastsimulation-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: "blasto: Blasto.GameMod/Simulation/BlastSimulation.cs"
  - id: blasto-blasto-gamemod-mod-ui-cs
    repo: blasto
    path: Blasto.GameMod/Mod.Ui.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs
    title: "blasto: Blasto.GameMod/Mod.Ui.cs"
  - id: blasto-blasto-gamemod-mod-cs
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: "blasto: Blasto.GameMod/Mod.cs"
  - id: blasto-blasto-gamemod-mod-tuning-cs
    repo: blasto
    path: Blasto.GameMod/Mod.Tuning.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs
    title: "blasto: Blasto.GameMod/Mod.Tuning.cs"
  - id: blasto-blasto-gamemod-mod-diagnostics-cs
    repo: blasto
    path: Blasto.GameMod/Mod.Diagnostics.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Diagnostics.cs
    title: "blasto: Blasto.GameMod/Mod.Diagnostics.cs"
  - id: blasto-blasto-gamemod-persistence-blastsavedocument-cs
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastSaveDocument.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs
    title: "blasto: Blasto.GameMod/Persistence/BlastSaveDocument.cs"
---

Use this approach when visual controls must affect existing effects immediately while simulation controls affect future deposits. Blasto demonstrates eleven numeric controls, two switches, diagnostics and a confirmed clear action. Start with a StarMap/Harmony entry class, immutable settings record and subsystem owners that can validate settings before applying them.

## Background: how the game does it

StarMapAfterGui is a postfix on Program.OnDrawUiViewports; native HUD hiding skips that method. Program.OnDrawUiConsole still runs before ImGui.Render on continuing frames, so a separate prefix can draw the already-open window when DrawUI is false. See [StarMap.Core/Patches/ProgramPatcher.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs#L26-L36)[^starmap-starmap-core-patches-programpatcher-cs] and [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2240-L2288)[^ksa-game-assemblies-current-decomp-ksa-program-cs]. GameSettings.OnKeyAll returns whether the key was consumed: [current/decomp/KSA/GameSettings.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSettings.cs#L3422-L3435)[^ksa-game-assemblies-current-decomp-ksa-gamesettings-cs].

## Lifecycle and timing

Draw the ordinary and hidden-HUD window paths only during frame:draw-ui. Consume text input during frame:input. Queue destructive clearing for frame:apply-solvers, because physics workers are already running while the UI draws. Live settings are validated immutable values; the worker capture switch is volatile in [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L25-L37)[^blasto-blasto-gamemod-simulation-blastsimulation-cs].

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Provide a native menu entry and both draw paths.** Port DrawMenu/DrawWindow from [Blasto.GameMod/Mod.Ui.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs#L9-L35)[^blasto-blasto-gamemod-mod-ui-cs]. Register the native menu postfix, console prefix and key prefix from startup:

```csharp
// Blasto.GameMod/Mod.cs L44-L51
// ...
            _simulation.Install(_harmony);
            _persistence.Install(_harmony);
            Patch(typeof(KSA.Program), "DrawProgramMenusHook", nameof(DrawMenu), false);
            Patch(typeof(KSA.Program), "OnDrawUiConsole", nameof(DrawHiddenUi), true);
            Patch(typeof(KSA.Program), nameof(KSA.Program.Dispose), nameof(BeforeGameDispose), true);
            Patch(typeof(GameSettings), nameof(GameSettings.OnKeyAll), nameof(GuardTextInput), true);
            _harmony.Patch(AccessTools.Method(typeof(Universe), nameof(Universe.ApplyVehicleSolvers)),
                prefix: new HarmonyMethod(typeof(Mod), nameof(DrainCommands)) { priority = Priority.First });
// ...
```
The ordinary callback is StarMapAfterGui. The hidden path must check DrawUI before drawing, avoiding duplicate windows:

```csharp
// Blasto.GameMod/Mod.cs L141-L143

    private static void BeforeGameDispose() => _instance?.ReleaseResources();
    private static void DrawHiddenUi() { if (!KSA.Program.DrawUI) _instance?.DrawWindow(); }
```


2. **Distinguish suggested drag ranges from valid typed values.** Use a reusable numeric helper with ImGuiSliderFlags.None, then reject invalid signs and nonfinite input yourself:

```csharp
// Blasto.GameMod/Mod.Tuning.cs L81-L96
// ...
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
// ...
```
Build the six appearance rows, buildup/threshold rows and three dust rows with [Blasto.GameMod/Mod.Tuning.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs#L11-L59)[^blasto-blasto-gamemod-mod-tuning-cs]. A larger typed value may be valid even when outside the suggested mouse-drag interval.

3. **Validate the complete settings snapshot before committing.** Check scalar validity and derived GPU/dust products first, then update the renderer, shared settings and simulation controls:

```csharp
// Blasto.GameMod/Mod.cs L88-L101
// ...
    private void ApplySettings(BlastSettings settings)
    {
        if (!settings.IsValid()) throw new ArgumentException("Invalid effect settings.");
        LandingDust.ValidateTuning(settings);
        // Validate products used by the GPU before committing any part of the new settings.
        if (_renderer is { } renderer) { renderer.Settings = settings; renderer.Enabled = settings.Enabled; }
        _settings = settings;
        if (_simulation is { } simulation)
        {
            simulation.Enabled = settings.Enabled; simulation.DustEnabled = settings.DustEnabled;
            simulation.Intensity = settings.Intensity; simulation.ErosionThreshold = settings.ErosionThreshold;
            simulation.DustOpacity = settings.DustOpacity; simulation.DustSize = settings.DustSize;
            simulation.DustSpeed = settings.DustSpeed;
        }
// ...
```
Retain the previous snapshot on ArgumentException and show an inline error using [Blasto.GameMod/Mod.Tuning.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs#L67-L79)[^blasto-blasto-gamemod-mod-tuning-cs]. Keep render-time radius/visibility separate from stored history; buildup/threshold affect future exposure. Dust size/speed affect new bursts and opacity affects current owners.

4. **Protect text entry without swallowing the game console.** Set the consumed result and skip native key processing only when the console is closed and ImGui wants text input:

```csharp
// Blasto.GameMod/Mod.Ui.cs L107-L112
    private static bool GuardTextInput(ref bool __result)
    {
        if (!KSA.Program.ConsoleWindow.IsOpen && ImGui.GetIO().WantTextInput)
        { __result = true; return false; }
        return true;
    }
```
This does not require ModMenu. The hidden-HUD hook keeps an open panel visible; it does not supply a new opener while the menu itself is hidden.

5. **Queue destructive controls and expose useful diagnostics.** Require in-window confirmation and enqueue clear work for the next joined apply boundary:

```csharp
// Blasto.GameMod/Mod.Ui.cs L82-L99
// ...
                }
                if (!_confirmClear)
                {
                    if (ImGui.Button("Clear this scene's marks...")) _confirmClear = true;
                }
                else
                {
                    ImGui.TextWrapped("Remove all marks in the current scene? Existing disk saves change only when saved again.");
                    if (ImGui.Button("Clear marks"))
                    {
                        _commands.Enqueue(() => { ResetSimulation(); _store.Clear(); _message = "Scene marks cleared."; });
                        _confirmClear = false;
                    }
                    ImGui.SameLine();
                    if (ImGui.Button("Cancel")) _confirmClear = false;
                }
                ImGui.Separator();
                ImGui.TextWrapped(_message);
// ...
```
Add the strong test-mark/highlight path and copyable report from [Blasto.GameMod/Mod.Ui.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs#L40-L80)[^blasto-blasto-gamemod-mod-ui-cs] and [Blasto.GameMod/Mod.Diagnostics.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Diagnostics.cs#L7-L35)[^blasto-blasto-gamemod-mod-diagnostics-cs]. Track actual descriptor binds, selected marks and capture errors so “pipeline built” is not mistaken for “effect drawn.”

6. **Persist tuning with the scene and retain old defaults.** Use an immutable settings record with initialized optional appearance properties, preserving the original constructor fields:

```csharp
// Blasto.GameMod/Persistence/BlastSaveDocument.cs L7-L19
// ...
public sealed record BlastSettings(bool Enabled = true, bool DustEnabled = true, double Intensity = 3)
{
    // Optional properties preserve schema-1 saves and the original three-argument API.
    public double SizeMultiplier { get; init; } = 3;
    public double Visibility { get; init; } = 8;
    public double Darkness { get; init; } = 3;
    public double StreakStrength { get; init; } = 2;
    public double CenterStrength { get; init; } = 1;
    public double EdgeSoftness { get; init; } = 1;
    public double ErosionThreshold { get; init; } = 0;
    public double DustOpacity { get; init; } = 1;
    public double DustSize { get; init; } = 1;
    public double DustSpeed { get; init; } = 1;
// ...
```
Pair its snapshot with native saves using the sidecar approach linked from the feature page. The complete [Blasto.GameMod/Persistence/BlastSaveDocument.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs#L7-L34) defines compatibility defaults and scalar validation.[^blasto-blasto-gamemod-persistence-blastsavedocument-cs] Keep temporary highlight out of serialized settings; a diagnostic test mark itself remains persistent.

## Complete example

Use [Blasto.GameMod/Mod.Ui.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Ui.cs#L9-L112)[^blasto-blasto-gamemod-mod-ui-cs], [Blasto.GameMod/Mod.Tuning.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.Tuning.cs#L11-L97)[^blasto-blasto-gamemod-mod-tuning-cs] and [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L32-L101).[^blasto-blasto-gamemod-mod-cs] Expected behavior includes an inline rejection that leaves old values intact, an open panel surviving HUD hiding, and diagnostics copied to both clipboard and game log.

## Variations and gotchas

No UI runs on early-exit frames. A rejected checkbox application can follow the broader window-error path; the inline retention helper specifically wraps numeric tuning. Do not clear the store directly from a UI callback. Suggested ranges are not serialization limits, but finite float representation and derived products still constrain accepted values. Manual-entry behavior, dust tuning and 0.1.3 appearance remain live-validation tasks.

## See also

- [Compare approaches](overview.md)
- [Live effect tuning and input](../../../../mods/blasto/features/live-effect-tuning-and-input.md)
- [Approach 1: Tabs, three-column table, collapsing headers and ColorPicker4 bound to a float4](build-a-settings-window-1.md)
- [Approach 2: Label-gutter form tables and full-width widgets](build-a-settings-window-2.md)
- [Approach 3: Settings window with ColorButton popups and INI persistence](build-a-settings-window-3.md)
- [Approach 4: Menu entry plus small settings window with wrapped tooltips](build-a-settings-window-4.md)
- [Approach 5: Reflected XKCD catalog with a filterable picker](build-a-settings-window-5.md)
- [Approach 6: Panel opened from menu, ModMenu or a floating button](build-a-settings-window-6.md)

[^starmap-starmap-core-patches-programpatcher-cs]: StarMap: StarMap.Core/Patches/ProgramPatcher.cs.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^ksa-game-assemblies-current-decomp-ksa-gamesettings-cs]: ksa-game-assemblies: current/decomp/KSA/GameSettings.cs.
[^blasto-blasto-gamemod-simulation-blastsimulation-cs]: blasto: Blasto.GameMod/Simulation/BlastSimulation.cs.
[^blasto-blasto-gamemod-mod-ui-cs]: blasto: Blasto.GameMod/Mod.Ui.cs.
[^blasto-blasto-gamemod-mod-cs]: blasto: Blasto.GameMod/Mod.cs.
[^blasto-blasto-gamemod-mod-tuning-cs]: blasto: Blasto.GameMod/Mod.Tuning.cs.
[^blasto-blasto-gamemod-mod-diagnostics-cs]: blasto: Blasto.GameMod/Mod.Diagnostics.cs.
[^blasto-blasto-gamemod-persistence-blastsavedocument-cs]: blasto: Blasto.GameMod/Persistence/BlastSaveDocument.cs.
