---
type: Game Feature
title: Record telemetry and diagnostics to files without stalling the frame
description: Write flight telemetry to files for later analysis, as an on-demand export of a history buffer, a continuous per-step recorder that never throws and never waits on the disk, or one-shot latched validation dumps
topic: record-telemetry-and-diagnostics-to-files
category: external-io
group: telemetry
approaches: 3
game_types: [KSA.Vehicle, KSA.Universe, KSA.Program, KSA.App, KSA.CelestialSystem, KSA.Celestial, Brutal.Logging.DefaultCategory, Brutal.Logging.LogCategory]
lifecycle: [frame:draw-ui, frame:dispatch-solvers]
demonstrated_by: [mods/kitten-engineer-redux/features/telemetry-history-and-csv-export, mods/ksa-advancedflightcomputer/features/guidance-flight-telemetry-csv, mods/ksa-deltavmap/features/in-game-validation-dumps-and-perf, mods/ksa-deltavmap/features/offline-layout-and-math-tests]
tags: [csv, logging, telemetry, diagnostics, buffered-io, svg, dedupe]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:30:38Z }
status: stable
repos:
  - name: Kitten-Engineer-Redux
    git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
    ref: d5786a0e75203a18a96936fb3537220d44b7a18b
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: kitten-engineer-redux-flighthud-cs
    repo: Kitten-Engineer-Redux
    path: FlightHud.cs
    resource: https://github.com/BarneyCompiler/Kitten-Engineer-Redux/blob/d5786a0e75203a18a96936fb3537220d44b7a18b/FlightHud.cs
    title: "Kitten-Engineer-Redux/FlightHud.cs"
  - id: kitten-engineer-redux-settingsstore-cs
    repo: Kitten-Engineer-Redux
    path: SettingsStore.cs
    resource: https://github.com/BarneyCompiler/Kitten-Engineer-Redux/blob/d5786a0e75203a18a96936fb3537220d44b7a18b/SettingsStore.cs
    title: "Kitten-Engineer-Redux/SettingsStore.cs"
  - id: kitten-engineer-redux-telemetryhistory-cs
    repo: Kitten-Engineer-Redux
    path: TelemetryHistory.cs
    resource: https://github.com/BarneyCompiler/Kitten-Engineer-Redux/blob/d5786a0e75203a18a96936fb3537220d44b7a18b/TelemetryHistory.cs
    title: "Kitten-Engineer-Redux/TelemetryHistory.cs"
  - id: ksa-advancedflightcomputer-sixdoflog-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Adapters/Scvx/SixDof/SixDofLog.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Adapters/Scvx/SixDof/SixDofLog.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Adapters/Scvx/SixDof/SixDofLog.cs"
  - id: ksa-advancedflightcomputer-guidancefeature-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/GuidanceFeature.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/GuidanceFeature.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/GuidanceFeature.cs"
  - id: ksa-advancedflightcomputer-guidancelog-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/GuidanceLog.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/GuidanceLog.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/GuidanceLog.cs"
  - id: ksa-advancedflightcomputer-autopilot-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Modes/Autopilot.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Modes/Autopilot.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Modes/Autopilot.cs"
  - id: ksa-advancedflightcomputer-sixdof-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Modes/SixDof.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Modes/SixDof.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Modes/SixDof.cs"
  - id: ksa-advancedflightcomputer-mod-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Mod.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Mod.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Mod.cs"
  - id: ksa-deltavmap-deltavmap-tests-csproj
    repo: KSA-DeltaVMap
    path: DeltaVMap.Tests/DeltaVMap.Tests.csproj
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap.Tests/DeltaVMap.Tests.csproj
    title: "KSA-DeltaVMap/DeltaVMap.Tests/DeltaVMap.Tests.csproj"
  - id: ksa-deltavmap-program-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap.Tests/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap.Tests/Program.cs
    title: "KSA-DeltaVMap/DeltaVMap.Tests/Program.cs"
  - id: ksa-deltavmap-debugconfig-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Core/DebugConfig.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Core/DebugConfig.cs
    title: "KSA-DeltaVMap/DeltaVMap/Core/DebugConfig.cs"
  - id: ksa-deltavmap-loghelper-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Core/LogHelper.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Core/LogHelper.cs
    title: "KSA-DeltaVMap/DeltaVMap/Core/LogHelper.cs"
  - id: ksa-deltavmap-perftracker-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Core/PerfTracker.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Core/PerfTracker.cs
    title: "KSA-DeltaVMap/DeltaVMap/Core/PerfTracker.cs"
  - id: ksa-deltavmap-layoutdump-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Layout/LayoutDump.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Layout/LayoutDump.cs
    title: "KSA-DeltaVMap/DeltaVMap/Layout/LayoutDump.cs"
  - id: ksa-deltavmap-layoutdumpformat-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Layout/LayoutDumpFormat.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Layout/LayoutDumpFormat.cs
    title: "KSA-DeltaVMap/DeltaVMap/Layout/LayoutDumpFormat.cs"
  - id: ksa-deltavmap-overlapcheck-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Layout/OverlapCheck.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Layout/OverlapCheck.cs
    title: "KSA-DeltaVMap/DeltaVMap/Layout/OverlapCheck.cs"
  - id: ksa-deltavmap-mod-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Mod.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Mod.cs
    title: "KSA-DeltaVMap/DeltaVMap/Mod.cs"
  - id: ksa-defaultcategory-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.Logging/DefaultCategory.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.Logging/DefaultCategory.cs
    title: "KSA decomp: Brutal.Logging/DefaultCategory.cs (build 2026.10.10.5554)"
  - id: ksa-app-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/App.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/App.cs
    title: "KSA decomp: KSA/App.cs (build 2026.10.10.5554)"
  - id: ksa-celestialsystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA decomp: KSA/CelestialSystem.cs (build 2026.10.10.5554)"
  - id: ksa-constants-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Constants.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs
    title: "KSA decomp: KSA/Constants.cs (build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA decomp: KSA/Program.cs (build 2026.10.10.5554)"
  - id: ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA decomp: KSA/Universe.cs (build 2026.10.10.5554)"
  - id: ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA decomp: KSA/Vehicle.cs (build 2026.10.10.5554)"
---

A mod that needs data after the fact (a landing that went wrong, a graph the player wants in a spreadsheet, a layout that must be eyeballed) writes it to a file. Three shapes appear in the reference mods and they differ in who triggers the write, how often rows are produced, and how disk errors are contained:

- an **on-demand export** of an in-memory history that the HUD already fills;
- a **continuous recorder** fed every simulation step, with buffered writes and an exception-proof sink;
- a **one-shot dump** that fires once when the universe exists, built by pure code that offline tests also run.

All three run on the main thread. None may stall the frame or throw into the render path.

## Engine background

| Type or member | Use | File |
|---|---|---|
| `Constants.DocumentsFolderPath`, `LogsFolderPath` | Root for exports and logs: `<Documents>/My Games/Kitten Space Agency` and its `logs` folder | [current/decomp/KSA/Constants.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs#L281-L283) |
| `Program.GetPlayerTime()` | Wall-clock time of the current frame (the unclamped `App.Run` stopwatch value); keeps counting while paused and ignores time warp | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5263-L5266) |
| `App.Run` | Computes `dtPlayer`, clamped to `1 / MinTargetFrameRate` | [current/decomp/KSA/App.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/App.cs#L39-L74) |
| `Universe.GetElapsedSeconds()`, `Universe.GetLastSimStep()` | Simulation time and step length, the clocks for time-warp-correct rows | [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2392-L2396) |
| `Vehicle.PrepareWorker` | Called per vehicle on the main thread inside `Universe.ExecuteNextVehicleSolvers`, once per physics step | [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2396-L2423) |
| `Universe.CurrentSystem` | Null until a system is loaded; the guard for one-shot dumps | [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L114-L114) |
| `Brutal.Logging.DefaultCategory.Log` | The game's log (`Info`, `Warning`, `Error`, `Debug`) | [current/decomp/Brutal.Logging/DefaultCategory.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.Logging/DefaultCategory.cs) |

See [the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for where `frame:draw-ui` and `frame:dispatch-solvers` sit relative to the physics step.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: wall-clock interval feeding a history array, CSV on click](record-telemetry-and-diagnostics-to-files-1.md) | kitten-engineer-redux | `telemetry-sampling` | `frame:draw-ui` | Simple, no extra hooks; ticks while paused, ignores warp, synchronous export |
| [2: static single-owner buffered sink](record-telemetry-and-diagnostics-to-files-2.md) | ksa-advancedflightcomputer | `buffered-file-sink` | `frame:dispatch-solvers` | Per-step rows with exact numbers and bounded I/O cost; one owner, batches lost on failure |
| [3: latched dumps from StarMapAfterGui behind a flag](record-telemetry-and-diagnostics-to-files-3.md) | ksa-deltavmap | `starmap-lifecycle` | `frame:draw-ui` | Zero cost in release; one shot per session and a hardcoded directory |

## See also

- [Export live game state to background threads](../export-game-state-to-other-threads/overview.md): the fixed-interval sample clock for sim-time sampling
- [Compute mission elapsed time and detect liftoff](../../../flight-and-orbits/flight-state/compute-mission-elapsed-time-and-detect-liftoff/overview.md), [Schedule timed command sequences](../../control/schedule-timed-commands/overview.md)
- [Write a per-mod log file](../../../getting-started/lifecycle/write-a-per-mod-log-file/overview.md)
- Related topics in other categories: drawing a monospace text grid, driving a running game through a file bridge, measuring and budgeting mod performance, unit-testing mod logic without the game, laying out a tree or graph diagram and testing a solver or controller offline
- [Drive a running game from scripts through a file-drop command bridge](../../../testing-and-tooling/in-game-testing/drive-a-running-game-through-a-file-bridge/overview.md) - related topic
- [Measure what a mod costs per frame, throttle expensive work and warm up hot code](../../../testing-and-tooling/in-game-testing/measure-and-budget-mod-performance/overview.md) - related topic
- [Unit-test mod logic without launching the game](../../../testing-and-tooling/offline-tests/unit-test-mod-logic-without-game/overview.md) - related topic
- [Lay out a tree or graph diagram and keep it usable at scale](../../../ui/draw-lists/lay-out-a-tree-or-graph-diagram/overview.md) - related topic
- [Test a solver or controller offline: closed loop, purity and replay](../../../testing-and-tooling/offline-tests/test-a-solver-or-controller-offline/overview.md) - related topic
- [Draw per-frame text efficiently: monospace grids and allocation-free labels](../../../ui/draw-lists/draw-a-monospace-text-grid/overview.md) - related topic

