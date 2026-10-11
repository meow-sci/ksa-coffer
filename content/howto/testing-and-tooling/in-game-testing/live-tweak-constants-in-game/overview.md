---
type: Game Feature
title: Tweak layout and animation constants live in the running game
description: Reflect public static fields into ImGui sliders, persist only the values that differ from the defaults and dump the result as C# source to paste back into the code
topic: live-tweak-constants-in-game
category: testing-and-tooling
group: in-game-testing
approaches: 1
game_types: [Brutal.ImGuiApi.ImGui]
lifecycle: [startup:all-mods-loaded, frame:draw-ui]
demonstrated_by: [mods/ksa-public-telemetry/features/live-tuning-and-palette-reflection]
tags: [tuning, reflection, imgui, sliders, iteration, developer-tools]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:53:11Z }
repos:
  - name: KSA-Public-Telemetry
    git: https://github.com/elevatorctln/KSA-Public-Telemetry/
    ref: 90608fb465f87d6008208798cc4d20ed8182c9a0
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-imgui-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi/ImGui.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs
    title: "Brutal.ImGuiApi.ImGui (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-public-telemetry-rendering-tuning-cs
    repo: KSA-Public-Telemetry
    path: Rendering/Tuning.cs
    resource: https://github.com/elevatorctln/KSA-Public-Telemetry/blob/90608fb465f87d6008208798cc4d20ed8182c9a0/Rendering/Tuning.cs
    title: "KSA-Public-Telemetry/Rendering/Tuning.cs"
---

Visual numbers (animation timings, margins, sizes) are found by trial and error, and a C# change in KSA costs a game restart because StarMap loads a mod assembly once at startup and nothing reloads it. KSA-Public-Telemetry removes the loop for constants:
it keeps every such number as a `public static` field in one class, shows them as sliders in an in-game window, saves only the ones that differ from the compiled defaults, and can print the whole set as C# source to paste back into the file.
The mechanism is plain reflection plus Brutal ImGui; no engine hook beyond the ordinary UI frame is involved.

## Engine background

- The sliders are ordinary Brutal ImGui widgets drawn in the UI pass: `[StarMapAfterGui]` runs after `Program.OnDrawUiViewports`, inside `if (DrawUI)` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2265-L2269)), so the window is visible only while the game UI is. Frame order: [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).
- `ImGui.SetClipboardText(ImString)` is the binding for the clipboard ([current/decomp/Brutal.ImGuiApi/ImGui.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs#L8299-L8303)), used by "Copy as source".
- `ImGui.SliderFloat(label, ref value, min, max, format)` takes the value by `ref`; a `public static float` field can be passed directly (`ref Tuning.BoxPadding`), so the slider edits the live field and every reader sees the change on its next frame.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Reflection over Tuning fields, override-only persistence and Copy as source](live-tweak-constants-in-game.md) | ksa-public-telemetry ([Rendering/Tuning.cs](https://github.com/elevatorctln/KSA-Public-Telemetry/blob/90608fb465f87d6008208798cc4d20ed8182c9a0/Rendering/Tuning.cs)) | `reflection` | `startup:all-mods-loaded`, `frame:draw-ui` | About 50 float and int fields editable with no rebuild; the slider ranges and groups are hand-written; reflection is only on load, save and dump |

## See also

- [Build a settings window](../../../ui/windows/build-a-settings-window/overview.md), [Measure what a mod costs per frame](../measure-and-budget-mod-performance/overview.md)
- Related topics: [Modify the HDR scene with a compute pass](../../../rendering/vulkan-passes/modify-the-hdr-scene-with-a-compute-pass/overview.md); the kitten locomotion reference and the exhaust plume topic are not written yet.
- Mod feature: [Live tuning and palette reflection](../../../../mods/ksa-public-telemetry/features/live-tuning-and-palette-reflection.md)
- [Kitten locomotion, modes and the servo, from the decompiled game](../../../kittens/eva/kitten-locomotion-and-servo-reference/overview.md) - related topic
- [Draw volumetric exhaust plumes and smoke trails without a real engine](../../../rendering/lights-and-particles/draw-exhaust-plumes-without-an-engine/overview.md) - related topic

