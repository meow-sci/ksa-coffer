---
type: Game Feature
title: Measure what a mod costs per frame, throttle expensive work and warm up hot code
description: Wrap hot code in zero-cost-when-off scopes with periodic reports, read a mod pass's GPU cost from the game profiler with a pinned camera, throttle per-frame work on wall-clock intervals and state versions and pre-compile hot paths on a background thread
topic: measure-and-budget-mod-performance
category: testing-and-tooling
group: in-game-testing
approaches: 6
game_types: [KSA.GpuProfiler, KSA.Profiler, KSA.FixedController, KSA.Program, KSA.Vehicle, KSA.Universe, KSA.PartFailure]
lifecycle: [frame:draw-ui, frame:after-on-frame, frame:render, startup:all-mods-loaded, thread:background]
demonstrated_by: [mods/ksa-deltavmap/features/in-game-validation-dumps-and-perf, mods/ksa-measuretools/features/resilient-patching-and-diagnostics, mods/ksa-advancedflightcomputer/features/warn-once-logging-and-diagnostics, mods/gatos/features/logging-and-perfstats, mods/ksarmory/features/starmap-entry-and-fault-containment, mods/ksarmory/features/raymarched-mushroom-cloud, mods/ksa-measuretools/features/overlay-drawlist-rendering, mods/ksarmory/features/jit-warmup-kill-path]
tags: [performance, profiling, stopwatch, gpu-profiler, throttle, jit, budget]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:55:56Z }
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSA-MeasureTools
    git: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools.git
    ref: aed7f874f1c925c10c733b1dee72bd04b9b1985c
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-gatos-logging-perfstat-cs
    repo: gatOS
    path: gatOS.Logging/PerfStat.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Logging/PerfStat.cs
    title: "gatOS/gatOS.Logging/PerfStat.cs"
  - id: ksa-deltavmap-deltavmap-core-perftracker-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Core/PerfTracker.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Core/PerfTracker.cs
    title: "KSA-DeltaVMap/DeltaVMap/Core/PerfTracker.cs"
  - id: ksa-gpuprofiler-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GpuProfiler.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuProfiler.cs
    title: "KSA.GpuProfiler (decompiled, build 2026.10.10.5554)"
  - id: ksa-measuretools-measuretools-features-measure-measureoverlay-cs
    repo: KSA-MeasureTools
    path: MeasureTools/Features/Measure/MeasureOverlay.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools/blob/aed7f874f1c925c10c733b1dee72bd04b9b1985c/MeasureTools/Features/Measure/MeasureOverlay.cs
    title: "KSA-MeasureTools/MeasureTools/Features/Measure/MeasureOverlay.cs"
  - id: ksa-profiler-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Profiler.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Profiler.cs
    title: "KSA.Profiler (decompiled, build 2026.10.10.5554)"
  - id: ksa-profilerframe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ProfilerFrame.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerFrame.cs
    title: "KSA.ProfilerFrame (decompiled, build 2026.10.10.5554)"
  - id: ksa-profilerwindowbase-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ProfilerWindowBase.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerWindowBase.cs
    title: "KSA.ProfilerWindowBase (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-sample-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Sample.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Sample.cs
    title: "KSA.Sample (decompiled, build 2026.10.10.5554)"
  - id: ksarmory-src-ksarmory-ksa-cloudpasscost-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/CloudPassCost.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/CloudPassCost.cs
    title: "KSArmory/src/KSArmory/Ksa/CloudPassCost.cs"
  - id: ksarmory-src-ksarmory-ksa-jitwarmup-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/JitWarmup.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/JitWarmup.cs
    title: "KSArmory/src/KSArmory/Ksa/JitWarmup.cs"
  - id: ksarmory-src-ksarmory-sim-framebudget-cs
    repo: KSArmory
    path: src/KSArmory/Sim/FrameBudget.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/FrameBudget.cs
    title: "KSArmory/src/KSArmory/Sim/FrameBudget.cs"
---

A mod that runs code every frame has to know what that code costs, and the engine's frame time is the only thing that buys simulation rate: KSArmory's mod-side comment records that the engine advances the world by at most a thirtieth of a second per frame, so the simulation rate is bounded by the frame time
([src/KSArmory/Sim/FrameBudget.cs](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/FrameBudget.cs#L8-L12)). The analyzed mods measure cost with four instruments and two fixes: scopes that compile out or cost two timestamp reads, counters shown in a window, nested budget spans with a periodic line, the game's own GPU profiler read back for a mod pass,
a wall-clock throttle for work that would otherwise scale with FPS, and an ahead-of-time compile sweep on a background thread. Identity-keyed caches with real and simulated time limits for expensive solves are in
[Run an expensive solve without stalling the frame](../../../flight-and-orbits/guidance/run-an-expensive-solve-without-stalling-the-frame/overview.md).

## Engine background

| Piece | Where | Use |
|---|---|---|
| `Profiler.Gpu` (a `GpuProfiler`) | [current/decomp/KSA/Profiler.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Profiler.cs#L574) | The game's GPU timestamp profiler; off by default |
| `GpuProfiler.IsActive`, `Paused`, `Frames`, `LastCompleteFrameIndex` | [current/decomp/KSA/GpuProfiler.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuProfiler.cs#L73-L83) | A mod can switch it on and read the newest complete frame |
| `ProfilerFrame.IsValid`, `AsSpan()`; `Sample.Ticks`, `ParentIndex`, `Id` | [current/decomp/KSA/ProfilerFrame.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerFrame.cs#L30-L39), [current/decomp/KSA/Sample.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Sample.cs#L9-L23) | Per-region timings; root samples (`ParentIndex == ushort.MaxValue`) sum to the frame |
| `ProfilerWindowBase.TicksToMs` | [current/decomp/KSA/ProfilerWindowBase.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProfilerWindowBase.cs#L124) | Ticks to milliseconds |
| Frame order and hook sites | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2275) | Where a scope placed in `StarMapAfterGui` or the frame postfix lands. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) |
| Main-thread profiler regions | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2243) | The game tags its own phases (`Profiler.MainThread.Begin(...)`), so a mod's cost shows up inside `DrawUi` or `PrepareFrame` in the stock profiler window |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: DEBUG-only ref struct scope with a periodic report](measure-and-budget-mod-performance-1.md) | ksa-deltavmap ([DeltaVMap/Core/PerfTracker.cs](https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Core/PerfTracker.cs)) | `logging` | `frame:draw-ui` | Zero cost in release; invisible to testers on a release build |
| [2: always-on single-writer counters in a window](measure-and-budget-mod-performance-2.md) | gatos ([gatOS.Logging/PerfStat.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Logging/PerfStat.cs)) | `imgui-window` | `frame:draw-ui` | Live in any build, no allocation; a number per path, no history |
| [3: nested budget spans, worst frame and rate-limited warnings](measure-and-budget-mod-performance-3.md) | ksarmory ([src/KSArmory/Sim/FrameBudget.cs](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/FrameBudget.cs)) | `logging` | `frame:draw-ui`, `frame:after-on-frame` | Says where the frame went and what the worst frame was; needs discipline about nesting |
| [4: GPU cost from the game's profiler with a pinned view](measure-and-budget-mod-performance-4.md) | ksarmory ([src/KSArmory/Ksa/CloudPassCost.cs](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/CloudPassCost.cs)) | `reflection` | `frame:render`, `frame:after-on-frame` | The only way to cost an asynchronous dispatch; a control run is required to mean anything |
| [5: wall-clock throttle plus a state-version check](measure-and-budget-mod-performance-5.md) | ksa-measuretools ([MeasureTools/Features/Measure/MeasureOverlay.cs](https://github.com/Maximilian-Nesslauer/KSA-MeasureTools/blob/aed7f874f1c925c10c733b1dee72bd04b9b1985c/MeasureTools/Features/Measure/MeasureOverlay.cs)) | `imgui-drawlist` | `frame:draw-ui` | Cost independent of refresh rate; the result may be about 45 ms stale |
| [6: Task.Run PrepareMethod sweep](measure-and-budget-mod-performance-6.md) | ksarmory ([src/KSArmory/Ksa/JitWarmup.cs](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/JitWarmup.cs)) | `background-thread` | `startup:all-mods-loaded`, `thread:background` | Removes tens of milliseconds from the first use; compiles methods you may never run |

## See also

- [Write a per-mod log file](../../../getting-started/lifecycle/write-a-per-mod-log-file/overview.md), [Take clean screenshots from code](../take-screenshots-from-code/overview.md), [Fly scripted scenarios unattended](../run-unattended-scenarios-and-report-a-verdict/overview.md), [Choose a StarMap startup hook](../../../getting-started/lifecycle/choose-a-starmap-startup-hook/overview.md)
- [Pick objects under the cursor](../../../ui/input/pick-objects-under-the-cursor/overview.md); the monospace text grid and closest-approach topics are not written yet.
- Mod features: [KSA-DeltaVMap validation dumps and perf](../../../../mods/ksa-deltavmap/features/in-game-validation-dumps-and-perf.md), [gatOS logging and perf stats](../../../../mods/gatos/features/logging-and-perfstats.md), [KSArmory raymarched mushroom cloud](../../../../mods/ksarmory/features/raymarched-mushroom-cloud.md)
- [Draw per-frame text efficiently: monospace grids and allocation-free labels](../../../ui/draw-lists/draw-a-monospace-text-grid/overview.md) - related topic
- [Find the closest approach to a target along a trajectory](../../../flight-and-orbits/map-view/find-closest-approach-along-the-flight-plan/overview.md) - related topic

