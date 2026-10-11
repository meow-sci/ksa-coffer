---
type: Game Feature
title: Execute planned burns hands-free with the stock Auto burn
description: Split a long burn into several passes, hand each computed maneuver to the stock Auto burn, detect which planned burn the flight computer just finished, and remove completed burns from the plan so a sequence runs without the player
topic: execute-planned-burns-with-the-stock-autopilot
category: flight-and-orbits
group: autopilot
approaches: 5
game_types: [KSA.FlightComputer, KSA.BurnPlan, KSA.Burn, KSA.Vehicle, KSA.InputEvents, KSA.TransferPlanner, KSA.FlightPlan, KSA.PatchedConic, KSA.SequencePerformanceList, KSA.SequencePerformance, KSA.PatchTransition, KSA.FlightComputerBurnMode, KSA.BurnTarget, KSA.Program, KSA.Constants]
lifecycle: [frame:apply-solvers, frame:prepare, frame:input, frame:draw-ui, frame:dispatch-solvers]
demonstrated_by: [mods/ksa-advancedflightcomputer/features/multi-pass-execution, mods/ksa-advancedflightcomputer/features/multi-pass-burn-splitting, mods/ksa-advancedflightcomputer/features/deorbit-landing-planner, mods/ksa-advancedflightcomputer/features/stock-burn-end-detection, mods/ksa-advancedflightcomputer/features/auto-remove-finished-burns]
tags: [auto-burn, burn-plan, multi-pass, burn-end, raise-pending-alerts, flight-computer]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:08:44Z }
status: stable
repos:
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-flightcomputer
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FlightComputer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs
    title: "KSA.FlightComputer (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
---

The stock **Auto** burn mode already knows how to align, ignite and cut off a node. A mod that wants a hands-free sequence (several
periapsis kicks, a deorbit node followed by landing guidance) does not need to fly burns itself: it places nodes, arms Auto when the
stock autopilot can take them, and reacts when the stock autopilot says a burn is over. The game has no event for that last part, so
the pattern is to wrap the method that consumes the end-of-burn flags.

## Engine background

- **Burn modes.** `FlightComputer.BurnMode` is `FlightComputerBurnMode.Manual` or `Auto`. `FlightComputer.AddBurn(burn)` loads the burn
  (`LoadBurn` sets `BurnMode = Manual` and `Burn = BurnTarget.CreateFromBurn(burn)`) only when it is the first executable burn.[^ksa-flightcomputer]
  [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L346-L353) [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L2209-L2217) So Auto must be selected again after every pass; `Vehicle.SetEnum(FlightComputerBurnMode.Auto)` is the player-equivalent path.[^ksa-vehicle] [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L6321)
- **End of burn.** On the vehicle worker `UpdateBurnTarget` sets `AutoBurnCompleted = true` (and `BurnMode = Manual`) when the delta-v to go is used up,
  and `ComputeControl` sets `AutoBurnStoppedOutOfPropellant = true` when every active engine is dry.[current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L1240-L1253)
  [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L505-L512) `CopyFrom` carries both flags back to the vehicle at `ApplyVehicleSolvers`.[current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L205-L225)
- **Consuming the flags.** `Program.PrepareFrame` calls `vehicle.FlightComputer.RaisePendingAlerts(vehicle)` for every vehicle in frame after `ApplyInputEvents`
  and before `ExecuteNextVehicleSolvers`. It clears the flags, shows the alert and calls `EndAutoBurn`, which stops warp, resets the speed and
  **removes the first executable burn only when the plan has more than one burn**.[current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2186-L2196) [current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L540-L629)
- **Settled window.** `RaisePendingAlerts` runs with the workers joined, so the burn plan can be edited directly there; the next step sees the change.

See [Reach the physics worker through the references FlightComputer.CopyFrom shares](../../../../mods/ksa-advancedflightcomputer/features/flight-computer-worker-copy-channels.md) and the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Multi-pass state machine on stock Auto](execute-planned-burns-with-the-stock-autopilot-1.md) | KSA-AdvancedFlightComputer | save sidecar | `frame:apply-solvers`, `frame:prepare` | Hands-free chain; two entry points and re-arming logic, persisted per vehicle |
| [Equal-time or equal-dv allocation](execute-planned-burns-with-the-stock-autopilot-2.md) | KSA-AdvancedFlightComputer | custom physics | `frame:draw-ui` | Splits the budget from a private staging model; needs fuel data |
| [Stock computes ignition timing first](execute-planned-burns-with-the-stock-autopilot-3.md) | KSA-AdvancedFlightComputer | harmony prefix | `frame:dispatch-solvers` | Reuses stock's alignment and ignition lead; asynchronous read-back |
| [RaisePendingAlerts prefix and postfix](execute-planned-burns-with-the-stock-autopilot-4.md) | KSA-AdvancedFlightComputer | harmony prefix | `frame:prepare` | The reliable burn-end signal; identity must be checked |
| [Remove the last finished burn](execute-planned-burns-with-the-stock-autopilot-5.md) | KSA-AdvancedFlightComputer | harmony postfix | `frame:prepare` | Cleans the stale node stock leaves; must run after stock's own removal |

## See also

- [Create, chain and read stock maneuver nodes from code](../create-and-read-maneuver-nodes/overview.md)
- [Compute phase angles, synodic periods and the time to the next transfer window](../../transfers/compute-transfer-windows/overview.md)
- [Execute burns with RCS translation and throttle inputs from code](../execute-burns-with-rcs-and-throttle-inputs/overview.md)
- Related topics: [Reading staged delta-v, thrust and Isp from the game or from your own stage model](../../../vehicles-and-parts/staging-and-engines/read-staged-delta-v-from-the-game/overview.md)

[^ksa-flightcomputer]: KSA.FlightComputer (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: KSA.Vehicle (decompiled, build 2026.10.10.5554)
