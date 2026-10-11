---
type: Game Feature
title: Computing engine thrust, Isp and mass flow at ambient pressure, and inverting for throttle
description: How KSA evaluates an engine at a pressure and throttle, which cores follow the throttle, the manual g-load throttle cap, and two ways to reuse the model
topic: compute-engine-thrust-at-ambient-pressure
category: vehicles-and-parts
group: staging-and-engines
approaches: 2
game_types: [KSA.EngineController, KSA.RocketControllerData, KSA.FlightComputer, KSA.SolidMotor, KSA.RocketCore, KSA.RocketNozzle]
lifecycle: [frame:dispatch-solvers, frame:draw-ui]
demonstrated_by: [mods/ksa-advancedflightcomputer/features/engine-performance-and-throttle-inversion, mods/kitten-engineer-redux/features/custom-stage-delta-v-estimator]
tags: [thrust, isp, mass-flow, throttle, ambient-pressure, g-load-cap]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:26:22Z }
repos:
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: Kitten-Engineer-Redux
    git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
    ref: d5786a0e75203a18a96936fb3537220d44b7a18b
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-enginecontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EngineController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineController.cs
    title: "current/decomp/KSA/EngineController.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-rocketcontrollerdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketControllerData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketControllerData.cs
    title: "current/decomp/KSA/RocketControllerData.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-combustor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Combustor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Combustor.cs
    title: "current/decomp/KSA/Combustor.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-thermalcore
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ThermalCore.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ThermalCore.cs
    title: "current/decomp/KSA/ThermalCore.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-antimatterramcore
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AntimatterRamCore.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AntimatterRamCore.cs
    title: "current/decomp/KSA/AntimatterRamCore.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-solidmotor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs
    title: "current/decomp/KSA/SolidMotor.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-flightcomputer
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FlightComputer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs
    title: "current/decomp/KSA/FlightComputer.cs (decompiled, build 2026.10.10.5554)"
---
Planners need three answers about engines: how much thrust and mass flow they deliver at a throttle and ambient pressure,
how much of that the flight computer will let through, and which throttle produces a requested thrust. KSA has the model; a
mod's job is to call it correctly and mirror the limits that act later on the worker.

## Engine background

- **The model.** `EngineController.ComputeActivePerformance(in state, centerOfMassAsmb, ambientPressure, throttle)` returns
  `RocketControllerData.Zero` for an inactive or unsupplied engine, `VacuumData` at 0 Pa and full throttle, and otherwise
  `RocketControllerData.ComputeFromCores(Cores, pressure, throttle)` [current/decomp/KSA/EngineController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineController.cs#L68-L75)[^ksa-enginecontroller].
- **Per core.** `ComputeFromCores` clamps the throttle to each core's `MinimumThrottle`, calls
  `core.ComputeConditions(throttle)`, then for each nozzle `ComputePerformance(conditions, pressure)`, summing thrust along
  the exhaust direction and `MassFlowRate`; an overload computes two pressures at once
  [current/decomp/KSA/RocketControllerData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketControllerData.cs#L21-L64)[^ksa-rocketcontrollerdata].
- **Which cores follow throttle.** `Combustor` and `ThermalCore` are `PlumbedCore`s that set chamber pressure from the throttle;
  `SolidMotor` ignores it and `AntimatterRamCore` delivers what its ram speed allows
  [current/decomp/KSA/Combustor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Combustor.cs#L3)[^ksa-combustor] [current/decomp/KSA/ThermalCore.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ThermalCore.cs#L3)[^ksa-thermalcore] [current/decomp/KSA/AntimatterRamCore.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AntimatterRamCore.cs#L6)[^ksa-antimatterramcore] [current/decomp/KSA/SolidMotor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs#L9)[^ksa-solidmotor].
- **The g-load cap.** In a Manual (non-Auto) burn `FlightComputer.ComputeControl` limits the engine throttle to
  `SolveGLoadThrottleCap`: thrust held to `0.9 * MaxGLoad * 9.80665 * mass`, from a linear estimate refined twice against
  `ComputeActiveEnginePerformance`, clamped to the minimum throttle [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L489-L494)[^ksa-flightcomputer]
  [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L1067-L1093).

## Approaches

| Article | Mod | Technique | Subject |
|---|---|---|---|
| [1: `ComputeActivePerformance` with core-type checks](compute-engine-thrust-at-ambient-pressure-1.md) | KSA-AdvancedFlightComputer | `engine-model-reuse` | live thrust, the cap, throttle inversion |
| [2: `ComputeFromCores` or `VacuumData` in a delta-v estimator](compute-engine-thrust-at-ambient-pressure-2.md) | Kitten-Engineer-Redux | `stage-model-recompute` | pressure-dependent thrust per stage |

## See also

- [game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/game-loop-and-lifecycle-3.md)
- [Read staged delta-v, thrust and Isp from the game or from your own stage model](../read-staged-delta-v-from-the-game/overview.md), [Switch engines on and off, set throttle and RCS commands, and choose which RCS jets fire](../../modules-and-resources/command-engines-throttle-and-rcs-from-code/overview.md)
- Mod features: [ksa-advancedflightcomputer/engine-performance-and-throttle-inversion](../../../../mods/ksa-advancedflightcomputer/features/engine-performance-and-throttle-inversion.md), [kitten-engineer-redux/custom-stage-delta-v-estimator](../../../../mods/kitten-engineer-redux/features/custom-stage-delta-v-estimator.md)

[^ksa-solidmotor]: current/decomp/KSA/SolidMotor.cs (decompiled, build 2026.10.10.5554)
[^ksa-flightcomputer]: current/decomp/KSA/FlightComputer.cs (decompiled, build 2026.10.10.5554)
[^ksa-enginecontroller]: current/decomp/KSA/EngineController.cs (decompiled, build 2026.10.10.5554)
[^ksa-antimatterramcore]: current/decomp/KSA/AntimatterRamCore.cs (decompiled, build 2026.10.10.5554)
[^ksa-combustor]: current/decomp/KSA/Combustor.cs (decompiled, build 2026.10.10.5554)
[^ksa-rocketcontrollerdata]: current/decomp/KSA/RocketControllerData.cs (decompiled, build 2026.10.10.5554)
[^ksa-thermalcore]: current/decomp/KSA/ThermalCore.cs (decompiled, build 2026.10.10.5554)
