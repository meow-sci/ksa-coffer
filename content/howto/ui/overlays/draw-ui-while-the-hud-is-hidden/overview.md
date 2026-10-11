---
type: Game Feature
title: Keep mod UI and per-frame work running when the HUD is hidden (F2)
description: Why StarMap's GUI hooks stop when the player hides the HUD, which game calls still run, and four ways mods keep drawing or stepping
topic: draw-ui-while-the-hud-is-hidden
category: ui
group: overlays
approaches: 4
game_types: [KSA.Program, KSA.Universe]
lifecycle: ['frame:viewports', 'frame:draw-ui', 'frame:celestials', 'startup:all-mods-loaded', 'frame:after-on-frame', 'frame:apply-solvers']
demonstrated_by: [mods/ksa-aircrafthud/features/fullscreen-drawlist-hud, mods/ksa-public-telemetry/features/draw-while-ui-hidden-drawfps-postfix, mods/unscience/features/lib-hidden-ui-frame-hook, mods/unscience/features/pebbles-workshop-editor, mods/ksarmory/features/dual-hook-simulation-step, mods/ksagolf/features/dual-hook-frame-stepping, mods/gatos/features/frame-hooks-and-f2-fallback, mods/ksarmory/features/cursor-ray-world-click-tools, mods/ksastructures/features/frame-step-plumbing, mods/ksacars/features/frame-step-latch-and-car-registry, mods/ksacars/features/pose-subparts-at-runtime]
tags: [hud-hidden, f2, hooks, frame-order, drawui, latch]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:03:46Z }
status: stable
repos:
- name: KSA_AircraftHUD
  git: https://github.com/uriahgnu/KSA_AircraftHUD.git
  ref: "4e4c71719a8355afb1fc608f54d531676bec4ef3"
- name: KSA-Public-Telemetry
  git: https://github.com/elevatorctln/KSA-Public-Telemetry/
  ref: "90608fb465f87d6008208798cc4d20ed8182c9a0"
- name: StarMap
  git: https://github.com/StarMapLoader/StarMap.git
  ref: "4dc60f8dfeb1d9b035d44af2601d09115c16d2aa"
- name: unscience
  git: https://github.com/meow-sci/unscience.git
  ref: "1829b3b298dd0fa5a67342cafff29074c8c29286"
- name: KSArmory
  git: https://github.com/LaurensDeV/KSArmory.git
  ref: "cbd63d6d84da7a48a13641a641d3557bad216435"
- name: KSAGolf
  git: https://github.com/LaurensDeV/KSAGolf.git
  ref: "f3e6ab72b5b963f615cb4ed41f7765a7bce42688"
- name: KSACars
  git: https://github.com/LaurensDeV/KSACars
  ref: "1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f"
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
---
Players hide the game UI with F2 for clean footage, and `ScreenshotCapture` clears the same flag during captures. StarMap's `[StarMapBeforeGui]` and `[StarMapAfterGui]` are a prefix on `Program.OnDrawUiFrame` and a postfix on `Program.OnDrawUiViewports`, and `Program.OnFrame` calls both
inside `if (DrawUI)`. So with the HUD hidden, mod windows and overlays vanish, **and** any per-frame logic hung on those attributes silently freezes: timers stop, animations stall, simulation steps stop. The overlay case may be acceptable ("hide with the HUD"); the
logic case rarely is.

## Engine background

The UI section of `Program.OnFrame` decides everything:

```csharp
// current/decomp/KSA/Program.cs L2260-L2290
GizmosRenderer.ResetInstances();
PrepareImGui(dtPlayer);
OnFrameEditor(dtPlayer);
OnFrameViewports(dtPlayer);
Profiler.MainThread.Begin(Profiler.Tag.DrawUi);
if (DrawUI)
{
    OnDrawUiFrame(dtPlayer);
    OnDrawUiViewports(dtPlayer);
}
if (DrawUI)
{
    OnDrawUiThreadSafe(dtPlayer);
}
DrawFps();
OnDrawUiConsole(dtPlayer);
Profiler.MainThread.End();
SequencePerformanceList sequencePerformanceList = Editor?.EditingSpace.Parts?.PerformanceSequences;
if (sequencePerformanceList != null && sequencePerformanceList.IsDirty && JobSystems.NearestOrbitAndPerformanceWorker.IsReady())
{
    _sequencePerformanceJob.Target = sequencePerformanceList;
    JobSystems.NearestOrbitAndPerformanceWorker.Queue(_sequencePerformanceJob, 1);
    JobSystems.NearestOrbitAndPerformanceWorkerProfiler.Prepare();
    JobSystems.NearestOrbitAndPerformanceWorker.ExecuteJobs();
}
Profiler.MainThread.Begin(Profiler.Tag.ImguiRender);
ImGui.Render();
Profiler.MainThread.End();
if (!IsLoaded)
{
    Profiler.MainThread.EndFrame();
```

| Call | Inside `if (DrawUI)`? | Notes |
|---|---|---|
| `GizmosRenderer.ResetInstances`, `PrepareImGui`, `OnFrameEditor`, `OnFrameViewports` | No | `OnFrameEditor` right after `NewFrame` (cameras not moved yet); `OnFrameViewports` builds the cameras |
| `OnDrawUiFrame` (= `StarMapBeforeGui` prefix), `OnDrawUiViewports` (= `StarMapAfterGui` postfix) | Yes | Gone with the HUD |
| `OnDrawUiThreadSafe` | Yes | Menu bar, vehicle windows, gauges UI |
| `DrawFps`, `OnDrawUiConsole` | No | Still run; `ImGui.Render` follows |
| `OnFrameCelestials`, `OnPreRender`, `Render`, `PostRender` | No | The step prefix point; render |
| `StarMapAfterOnFrame` (postfix on `OnFrame`) | No | After the render; also runs when `PrepareFrame` returned `Exit` |

None of this runs on frames where `PrepareFrame` returns `Exit` (window close, font rebuild) except `StarMapAfterOnFrame`. The HUD flag flips only during `Glfw.PollEvents` (F2 is `InputAction.ToggleUi`) and around screenshot capture, so it is stable across the UI section. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Which hook to use

| Hook | Runs with HUD hidden | ImGui frame open | Order and camera |
|---|---|---|---|
| Postfix on `Program.OnFrameEditor` ([1](draw-ui-while-the-hud-is-hidden-1.md)) | Yes | Yes | Before every game window; camera not yet moved |
| Postfix on `Program.OnFrameViewports` | Yes | Yes | Before every game window; camera moved for this frame |
| `[StarMapBeforeGui]` / `[StarMapAfterGui]` | No | Yes | Around the gated UI calls |
| Postfix on `Program.DrawFps` ([2](draw-ui-while-the-hud-is-hidden-2.md)) | Yes | Yes | After every game window |
| Prefix on `Program.OnDrawUiConsole` ([3](draw-ui-while-the-hud-is-hidden-3.md)) | Yes | Yes | After every game window |
| Prefix on `Program.OnFrameCelestials` ([4](draw-ui-while-the-hud-is-hidden-4.md)) | Yes | No (after `Render`) | Before the render; camera moved |
| `[StarMapAfterOnFrame]` | Yes | No | After the render; one frame late |

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Harmony postfix on Program.OnFrameEditor](draw-ui-while-the-hud-is-hidden-1.md) | KSA_AircraftHUD | Always-on draw hook before the gated UI | `frame:viewports` | Simple; camera one frame behind; private target |
| 2 | [Reflection-installed postfix on private Program.DrawFps](draw-ui-while-the-hud-is-hidden-2.md) | KSA-Public-Telemetry | Patch with no compile-time Harmony reference, degrade gracefully | `frame:draw-ui` | No build dependency; stale `dt`; private target |
| 3 | [Replay StarMap GUI work from a prefix on OnDrawUiConsole](draw-ui-while-the-hud-is-hidden-3.md) | unscience | Registered callbacks replayed only when `DrawUI` is false | `frame:draw-ui` | Keeps update loops alive; windows stay hidden by design |
| 4 | [Frame-latched step claimed by whichever hook fires first](draw-ui-while-the-hud-is-hidden-4.md) | KSArmory, KSAGolf, gatOS, KSAStructures, KSACars | `FrameLatch`, GUI hook plus `OnFrameCelestials` prefix plus frame postfix, sim-time step gate | `frame:draw-ui`, `frame:celestials`, `frame:after-on-frame` | Exactly once per frame, before the render; the most plumbing |

## Choosing

- Draw only, accept it hiding with the HUD: use `[StarMapAfterGui]` and do nothing else.
- Draw and survive F2: approach 1 (draw early) or 2 (draw late, no Harmony reference).
- Logic or timers that must keep running: approach 3 for a simple update loop, approach 4 when the logic moves things that the render must show.

## See also

- [Draw full-screen click-through overlays](../draw-a-fullscreen-click-through-overlay/overview.md)
- [Show transient alerts and game-styled popups](../../windows/show-alerts-and-popups-in-game/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Patching private and overloaded game methods by name](../../../patching/internals/patch-a-private-game-method-by-name/overview.md)
- [Build a KSA mod that references only StarMap.API and Harmony](../../../getting-started/build/build-a-mod-without-game-references/overview.md)
- [Isolating patch failures and keeping patch bodies from throwing](../../../patching/safety/isolate-patch-failures-and-fault-proof-patch-bodies/overview.md)
- [Choose and use the right StarMap lifecycle hook](../../../getting-started/lifecycle/choose-a-starmap-startup-hook/overview.md)

