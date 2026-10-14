---
type: Mod Feature
title: Worker nozzle exposure handoff
description: Capture actual rocket nozzle burn intervals on vehicle workers and consume immutable
  samples after solver results are applied
mod: blasto
category: physics
tags:
  - blasto
  - physics
  - harmony-postfix
  - background-thread
techniques:
  - harmony-postfix
  - background-thread
game_types:
  - KSA.VehicleUpdateState
  - KSA.RocketNozzleState
  - KSA.Universe
lifecycle:
  - physics:vehicle-solver
  - frame:apply-solvers
hooks:
  - harmony-postfix KSA.VehicleUpdateState.UpdateModules
  - harmony-postfix KSA.Universe.ApplyVehicleSolvers
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:36Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: capture
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Worker capture and main-thread queue consumption
  - id: modules
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleUpdateState.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateState.cs
    title: Gimbals and rocket modules run before the postfix
  - id: nozzle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketNozzle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketNozzle.cs
    title: Native nozzle geometry and actual thrust time
  - id: bubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: Per-substep worker module execution
  - id: program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Worker joins, solver apply and next dispatch
  - id: universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: Apply results and publish the completed simulation step
  - id: apply-task
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleUpdateTask.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateTask.cs
    title: Only ready physics bubbles apply results
---

Blasto deposits exhaust exposure from simulated engine output, including launches and hovering. It copies each nozzle's geometry, thrust and burn duration into a bounded concurrent queue, then touches terrain and particles only on the main thread.[^capture]

## How it works

1. A postfix on `VehicleUpdateState.UpdateModules` runs after native gimbal and rocket updates. Read the worker's states and nozzle state array, rather than querying the live controlled vehicle.[^modules]
2. Transform the assembly-space thrust location, minus assembly center of mass, through the worker's body-to-CCF rotation. Negate the thrust direction to obtain the exhaust direction. Copy body/vehicle identities and nozzle index into an immutable sample.[^capture]
3. Clamp `ThrustTime` to the current step duration; use `Performance.TotalThrust`, not commanded throttle. Reject invalid or weak thrust, exhaust with an outward radial dot product above 0.12, nonpositive duration and steps over one second. The queue admits at most 8,192 samples.[^capture][^nozzle]
4. After apply, drain samples whose epoch is no later than the globally published step, reject obsolete capture generations, resolve the body, probe the ground and independently emit dust and deposit exposure. Cache hits briefly when position, direction and thrust remain close.[^capture]

## Lifecycle and timing

`physics:vehicle-solver` is the producer: `PhysicsBubble.UpdateModulesJob` invokes the module update per substep. `frame:apply-solvers` is the consumer: `Program.PrepareFrame` has waited on the vehicle solver before calling `Universe.ApplyVehicleSolvers`, which publishes the completed step; next workers are dispatched later in the same method.[^bubble][^program][^universe] No ImGui, terrain sampling or GPU calls occur in capture. Viewport count cannot multiply deposition because rendering only consumes the stored snapshot.

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L62-L179) | Worker capture and main-thread queue consumption[^capture] |
| [current/decomp/KSA/VehicleUpdateState.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateState.cs#L381-L407) | Gimbals and rocket modules run before the postfix[^modules] |
| [current/decomp/KSA/RocketNozzle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketNozzle.cs#L277-L324) | Native nozzle geometry and actual thrust time[^nozzle] |
| [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L29-L43) | Per-substep worker module execution[^bubble] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222) | Worker joins, solver apply and next dispatch[^program] |
| [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1922-L1952) | Apply results and publish the completed simulation step[^universe] |

## Snippets

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L100-L112
                ref readonly var nozzle = ref nozzles[i];
                Interlocked.Increment(ref _nozzlesExamined);
                double burn = Math.Clamp(nozzle.ThrustTime, 0, step.DeltaTime);
                double thrust = nozzle.Performance.TotalThrust;
                if (burn <= 0 || thrust <= 1 || !double.IsFinite(thrust)) continue;
                var origin = position + (double3.Unpack(nozzle.ThrustLocationVehicleAsmb) - centerOfMass).Transform(body2Ccf);
                var exhaust = (-double3.Unpack(nozzle.ThrustDirectionVehicleAsmb)).Transform(body2Ccf);
                if (double3.Dot(origin.NormalizeOrZero(), exhaust.NormalizeOrZero()) > .12) continue;
                if (Interlocked.Increment(ref _queued) > 8192)
                { Interlocked.Decrement(ref _queued); Interlocked.Increment(ref _queueRejected); continue; }
                _samples.Enqueue(new NozzleSample(Volatile.Read(ref _generation), body.Id, worker.ReadOnlyVehicle.Id, i,
                    SurfaceProbe.FromNative(origin), SurfaceProbe.FromNative(exhaust).Normalized(), thrust, burn, step.NextTime.Seconds()));
                Interlocked.Increment(ref _captured);
```

## Game APIs touched

`VehicleUpdateState.UpdateModules` supplies the post-module sampling point; `RocketNozzle.UpdateState` populates nozzle thrust data; `Universe.ApplyVehicleSolvers` makes the completed worker step available on the main thread.[^modules][^nozzle][^universe]

## Pitfalls and version notes

The one-second cutoff is an explicit fidelity limit under time warp. The queue and hit cache reduce workload but do not establish a measured performance guarantee. Worker counters use interlocked operations; the persistent store is not shared with workers. Keep the generation barrier when adding clear/load controls.

The epoch gate is a frame handoff, not a per-bubble commit acknowledgement. Failed bubbles do not publish ready results in [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L1072-L1121), and the apply task skips bubbles that are not ready in [current/decomp/KSA/VehicleUpdateTask.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateTask.cs#L226-L259). `Universe.ApplyVehicleSolvers` still publishes the global step after that task returns. Blasto samples carry no bubble-success token, so samples captured before a later bubble failure can still become exposure.[^bubble][^apply-task][^universe][^capture]

## See also

- [Terrain plume intersection](terrain-plume-intersection.md)
- [Persistent exposure site store](persistent-exposure-site-store.md)
- [Scene reset and native cleanup](scene-reset-and-native-cleanup.md)
- [Sample nozzle thrust on the solver and hand exposure to the main thread](../../../howto/physics/solver/write-worker-thread-safe-solver-patches/write-worker-thread-safe-solver-patches-7.md) - how-to article demonstrating this feature

[^capture]: Worker capture and main-thread queue consumption.
[^modules]: Gimbals and rocket modules run before the postfix.
[^nozzle]: Native nozzle geometry and actual thrust time.
[^bubble]: Per-substep worker module execution.
[^program]: Worker joins, solver apply and next dispatch.
[^universe]: Apply results and publish the completed simulation step.
[^apply-task]: Only ready physics bubbles apply results.
