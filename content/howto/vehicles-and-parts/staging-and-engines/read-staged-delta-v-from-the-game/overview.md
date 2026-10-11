---
type: Game Feature
title: Reading staged delta-v, thrust and Isp from the game or from your own stage model
description: How KSA's SequencePerformanceList simulates stage performance, when its published results are fresh, and four recipes for reading it, gating it or rebuilding a stage model yourself
topic: read-staged-delta-v-from-the-game
category: vehicles-and-parts
group: staging-and-engines
approaches: 4
game_types: [KSA.PartTree, KSA.SequencePerformanceList, KSA.SequencePerformance, KSA.SequenceList, KSA.RocketControllerData, KSA.EngineController, KSA.PlumbedCore, KSA.SequencePhaseInfo]
lifecycle: [frame:draw-ui, editor:draw-ui, frame:dispatch-solvers]
demonstrated_by: [mods/kitten-engineer-redux/features/native-stage-performance-readout, mods/ksa-deltavmap/features/vehicle-staged-dv-readout, mods/ksa-advancedflightcomputer/features/stage-model-from-staging-simulator, mods/kitten-engineer-redux/features/custom-stage-delta-v-estimator]
tags: [delta-v, staging, sequence-performance, thrust, isp, rocket-equation]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:26:22Z }
repos:
  - name: Kitten-Engineer-Redux
    git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
    ref: d5786a0e75203a18a96936fb3537220d44b7a18b
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-parttree
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTree.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs
    title: "current/decomp/KSA/PartTree.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-sequenceperformance
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SequencePerformance.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformance.cs
    title: "current/decomp/KSA/SequencePerformance.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-sequencephaseinfo
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SequencePhaseInfo.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePhaseInfo.cs
    title: "current/decomp/KSA/SequencePhaseInfo.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-sequenceperformancelist
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SequencePerformanceList.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformanceList.cs
    title: "current/decomp/KSA/SequencePerformanceList.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsbubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: "current/decomp/KSA/PhysicsBubble.cs (decompiled, build 2026.10.10.5554)"
---
KSA already computes per-stage delta-v, thrust, Isp, burn phases and fuel: `SequencePerformanceList` is what backs the
stock staging window. The questions for a mod are whether its results are fresh when you read them, and whether you can
recompute without racing the vehicle solver.

## Engine background

- **Where it lives.** `PartTree.PerformanceSequences` is a `SequencePerformanceList` [current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs#L58)[^ksa-parttree]. Its published
  `PerformanceSequences` span is one `SequencePerformance` per `SequenceList.Sequences` entry, index-paired: `DeltaV`, `Twr`,
  `Isp`, `Thrust`, `MassFlowRate`, `WetMass`, `InertMass`, `FuelMass`, `BurnedFuelMass`, `SolidResidueMass`,
  `AttachedParts`, `Propellants` and `Phases` (`SequencePhaseInfo`: `DeltaV`, `Duration`, `Thrust`, `MassFlowRate`,
  `ActiveEngineCount`) [current/decomp/KSA/SequencePerformance.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformance.cs#L1-L34)[^ksa-sequenceperformance] [current/decomp/KSA/SequencePhaseInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePhaseInfo.cs#L1-L14)[^ksa-sequencephaseinfo]. `TotalDeltaV` is a volatile float
  [current/decomp/KSA/SequencePerformanceList.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformanceList.cs#L63-L67)[^ksa-sequenceperformancelist].
- **Recompute.** `RecomputeIfDirty()` runs `Recompute` when `_dirty`; `RecomputeForFlight(ambientPressure)` sets a flight
  flag and always recomputes. `Recompute` calls `_partTree.EnsureDerived(SolidMotorStacks | Sequences)`, simulates a
  per-reactant drain from the live mole masses through every sequence, and publishes through a double buffer
  (`_performanceScratch = Interlocked.Exchange(ref _performanceSequences, scratch)`; readers use `Volatile.Read`)
  [current/decomp/KSA/SequencePerformanceList.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformanceList.cs#L74-L135) [current/decomp/KSA/SequencePerformanceList.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequencePerformanceList.cs#L289). `SetDirty()` also sets
  `PartTree.HasUnsavedChanges`.
- **Who recomputes.** In the editor the game queues a `SequencePerformanceJob` on the nearest-orbit worker after the UI draw. In
  flight it recomputes on a vehicle worker, in `PhysicsBubble.RunVehiclePostWorkInner`, for the controlled vehicle and only
  while `ResourceGroups.IsOpen` (the `Sequence` gauge canvas) or `Program.EngineControlGaugeOpen` is true
  [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L757-L798)[^ksa-physicsbubble]; gauge canvases start enabled, so the default UI recomputes every step.
- **Pressure.** Each sequence drains at its own `Environment` (101325 Pa if atmospheric, 0 Pa in vacuum); in flight mode the
  ambient pressure only pins the headline thrust of the active sequence, and sequences below `ActiveSequence` register no
  engines. `Twr` uses 9.80665.

## Approaches

| Article | Mod | Technique | When |
|---|---|---|---|
| [1: read `PerformanceSequences` paired by index](read-staged-delta-v-from-the-game-1.md) | Kitten-Engineer-Redux | `game-simulator-reuse` | the game keeps it fresh (editor, or flight with a gauge open) |
| [2: private list, change-gated recompute](read-staged-delta-v-from-the-game-2.md) | KSA-DeltaVMap | `change-gating` | freshness independent of the player's gauges, UI-draw reads |
| [3: phases as constant-thrust stages](read-staged-delta-v-from-the-game-3.md) | KSA-AdvancedFlightComputer | `game-simulator-reuse` | guidance that needs per-phase thrust and Isp |
| [4: rebuild from tanks and engine cores](read-staged-delta-v-from-the-game-4.md) | Kitten-Engineer-Redux | `stage-model-recompute` | sweep ambient pressure, or the native list is dirty |

## See also

- [game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/game-loop-and-lifecycle-3.md) and [game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/game-loop-and-lifecycle-4.md)
- [Compute engine thrust, Isp and mass flow at ambient pressure and invert for throttle](../compute-engine-thrust-at-ambient-pressure/overview.md), [Ignite engines, activate the next stage, fire a decoupler or undock from code](../stage-a-vehicle-from-code/overview.md), [Create and attach parts to a live vessel and feed runtime engines from tanks](../../modules-and-resources/add-parts-to-a-live-vessel/overview.md)
- Mod features: [kitten-engineer-redux/native-stage-performance-readout](../../../../mods/kitten-engineer-redux/features/native-stage-performance-readout.md), [ksa-deltavmap/vehicle-staged-dv-readout](../../../../mods/ksa-deltavmap/features/vehicle-staged-dv-readout.md), [ksa-advancedflightcomputer/stage-model-from-staging-simulator](../../../../mods/ksa-advancedflightcomputer/features/stage-model-from-staging-simulator.md), [kitten-engineer-redux/custom-stage-delta-v-estimator](../../../../mods/kitten-engineer-redux/features/custom-stage-delta-v-estimator.md)

[^ksa-sequencephaseinfo]: current/decomp/KSA/SequencePhaseInfo.cs (decompiled, build 2026.10.10.5554)
[^ksa-physicsbubble]: current/decomp/KSA/PhysicsBubble.cs (decompiled, build 2026.10.10.5554)
[^ksa-parttree]: current/decomp/KSA/PartTree.cs (decompiled, build 2026.10.10.5554)
[^ksa-sequenceperformance]: current/decomp/KSA/SequencePerformance.cs (decompiled, build 2026.10.10.5554)
[^ksa-sequenceperformancelist]: current/decomp/KSA/SequencePerformanceList.cs (decompiled, build 2026.10.10.5554)
