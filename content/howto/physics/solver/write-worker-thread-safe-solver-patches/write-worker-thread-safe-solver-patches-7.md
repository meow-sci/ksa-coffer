---
type: How-To
title: Sample nozzle thrust on the solver and hand exposure to the main thread
description: Capture nozzle burn samples on vehicle workers and drain a bounded immutable queue
  after native solver results reach the main thread
topic: write-worker-thread-safe-solver-patches
category: physics
group: solver
approach: 7
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/worker-nozzle-exposure-handoff
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
tags:
  - physics
  - blasto
  - harmony-postfix
  - background-thread
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:13Z
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
  - id: ksa-game-assemblies-current-decomp-ksa-vehicleupdatestate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleUpdateState.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateState.cs
    title: "ksa-game-assemblies: current/decomp/KSA/VehicleUpdateState.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-rocketnozzle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketNozzle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketNozzle.cs
    title: "ksa-game-assemblies: current/decomp/KSA/RocketNozzle.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-physicsbubble-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: "ksa-game-assemblies: current/decomp/KSA/PhysicsBubble.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Universe.cs"
  - id: blasto-blasto-gamemod-simulation-blastsimulation-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: "blasto: Blasto.GameMod/Simulation/BlastSimulation.cs"
  - id: blasto-blasto-gamemod-mod-cs
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: "blasto: Blasto.GameMod/Mod.cs"
  - id: ksa-vehicle-update-task
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleUpdateTask.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateTask.cs
    title: Native apply only accepts ready physics bubbles
---

Use this approach when an effect needs actual engine output but terrain lookup, particles and persistent state must stay on the main thread. Start with a working StarMap entry class and Harmony instance. Port Blasto’s detached sample record, queue and both callbacks together.

## Background: how the game does it

The native module pass updates gimbals before rockets and populates actual nozzle thrust time and performance. The physics bubble calls it per vehicle substep: [current/decomp/KSA/VehicleUpdateState.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateState.cs#L381-L407)[^ksa-game-assemblies-current-decomp-ksa-vehicleupdatestate-cs], [current/decomp/KSA/RocketNozzle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketNozzle.cs#L291-L324)[^ksa-game-assemblies-current-decomp-ksa-rocketnozzle-cs] and [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L29-L43)[^ksa-game-assemblies-current-decomp-ksa-physicsbubble-cs]. This yields simulated output instead of commanded throttle.

## Lifecycle and timing

Produce in the VehicleUpdateState.UpdateModules postfix (physics:vehicle-solver), consume in the Universe.ApplyVehicleSolvers postfix (frame:apply-solvers). Program.PrepareFrame joins workers before apply and dispatches later; Universe publishes the completed step before the consumer runs. See [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222)[^ksa-game-assemblies-current-decomp-ksa-program-cs] and [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1922-L1952)[^ksa-game-assemblies-current-decomp-ksa-universe-cs]. Ordinary UI drawing follows the next dispatch.

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Create a detached record and install both hooks.** Copy the value-only NozzleSample shape, generation and epoch fields, and bounded concurrent queue from [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L14-L28)[^blasto-blasto-gamemod-simulation-blastsimulation-cs]. Keep identities instead of live worker references. Install the producer and consumer from loader initialization:

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L58-L68
// ...
    public void Install(Harmony harmony)
    {
        if (_active is not null && _active != this) throw new InvalidOperationException("Blast simulation already installed.");
        _active = this;
        harmony.Patch(AccessTools.Method(typeof(VehicleUpdateState), nameof(VehicleUpdateState.UpdateModules)),
            postfix: new HarmonyMethod(typeof(BlastSimulation), nameof(CapturePostfix)));
        harmony.Patch(AccessTools.Method(typeof(Universe), nameof(Universe.ApplyVehicleSolvers)),
            postfix: new HarmonyMethod(typeof(BlastSimulation), nameof(ApplyPostfix)));
    }
    private static void CapturePostfix(VehicleUpdateState __instance, SimStep step) => _active?.Capture(__instance, step);
    private static void ApplyPostfix()
// ...
```


2. **Capture worker geometry and actual burn output.** Obtain read-only worker states and the nozzle array. Subtract assembly center of mass, rotate into the celestial body-fixed frame and negate thrust direction for exhaust. Clamp duration and retain the sample budget:

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L92-L112
// ...
        {
            var states = worker.GetReadOnlyStates();
            if (states.Origin.Parent is not Celestial body) return;
            states.GetStatesCcf(out var position, out _, out var body2Ccf);
            var centerOfMass = double3.Unpack(states.Props.CenterOfMassAsmb);
            var nozzles = worker.UpdateData.RocketNozzles.GetReadOnlyStates();
            for (int i = 0; i < nozzles.Length; i++)
            {
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
// ...
```
Preserve the outer one-second cutoff and exception accounting in [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L83-L120)[^blasto-blasto-gamemod-simulation-blastsimulation-cs]. Reject exhaust only when its outward radial dot exceeds 0.12; slightly outward grazing directions are allowed.

3. **Drain only globally published epochs and current generations.** Resolve the celestial by identity after dequeueing; missing bodies are skipped:

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L132-L142
// ...
        double appliedEpoch = Universe.GetLastSimStep().NextTime.Seconds();
        _dust.Tick(appliedEpoch);
        // This hook runs after the worker join/apply, before next dispatch. No viewport can add exposure.
        while (_samples.TryPeek(out var peek) && peek.Epoch <= appliedEpoch + 1e-6)
        {
            if (!_samples.TryDequeue(out var sample)) break;
            Interlocked.Decrement(ref _queued);
            if (!_enabled || sample.Generation != Volatile.Read(ref _generation)) continue;
            if (Universe.CurrentSystem?.All.TryGet(sample.BodyId, out Astronomical? resolved) != true || resolved is not Celestial body) continue;
            try
            {
// ...
```
Terrain probing, dust emission and deposition belong after this gate. Blasto reuses hits for less than 0.08 seconds only while pose and thrust remain close; see [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L143-L169)[^blasto-blasto-gamemod-simulation-blastsimulation-cs].

4. **Join before resetting a generation.** Clear queued samples and transient state together:

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L208-L215
    public void Reset()
    {
        Interlocked.Increment(ref _generation);
        while (_samples.TryDequeue(out _)) Interlocked.Decrement(ref _queued);
        _probeCache.Clear(); _dust.Clear(); _debugPending = 0; _faultLogged = false; _lastCapacityRejected = 0;
        DebugPlacementStatus = "No test placement requested";
    }
    public void Dispose() { _enabled = false; if (_active == this) _active = null; Reset(); }
```
The generation alone cannot prevent an old worker from enqueueing afterward with a fresh generation. Blasto drains destructive UI commands through an apply prefix and joins workers first when commands exist: [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L132-L139)[^blasto-blasto-gamemod-mod-cs].

## Complete example

Use [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L14-L215)[^blasto-blasto-gamemod-simulation-blastsimulation-cs] with the owner wiring in [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L32-L63)[^blasto-blasto-gamemod-mod-cs]. Near dry terrain, captured samples should lead to increasing applied samples and saved sites; warp, queue and error counters explain skipped work.

## Variations and gotchas

This bounded queue is not an allocation-free solver kernel: queue growth and error diagnostics can allocate. Do not call ImGui, terrain samplers or GPU APIs from capture. Capacity can drop samples; cache thresholds approximate exposure; long substeps deliberately skip new history. Viewport count must not multiply deposition. Source review establishes the handoff, while live performance still needs measurement.

The epoch gate is a frame handoff, not a per-bubble commit acknowledgement. Native `PhysicsBubble.PublishResults` in [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L1115-L1121) leaves failed bubbles unready, and `VehicleUpdateTask.ApplyResultsToMainThread` in [current/decomp/KSA/VehicleUpdateTask.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleUpdateTask.cs#L226-L259) skips them; the universe still publishes the global step when apply returns. Blasto carries no per-bubble success token, so a sample captured before a later bubble failure can still become exposure. If the effect must represent only committed physics, extend the handoff with an explicit success acknowledgement before deposition.[^ksa-game-assemblies-current-decomp-ksa-physicsbubble-cs][^ksa-vehicle-update-task][^ksa-game-assemblies-current-decomp-ksa-universe-cs][^blasto-blasto-gamemod-simulation-blastsimulation-cs]

## See also

- [Compare approaches](overview.md)
- [Worker nozzle exposure handoff](../../../../mods/blasto/features/worker-nozzle-exposure-handoff.md)
- [Approach 1: Pure, allocation-free, never-throwing code over the in arguments](write-worker-thread-safe-solver-patches-1.md)
- [Approach 2: Read-only tables filled on the main thread before physics starts](write-worker-thread-safe-solver-patches-2.md)
- [Approach 3: Concurrent registries keyed by reference](write-worker-thread-safe-solver-patches-3.md)
- [Approach 4: Volatile snapshot handoff from worker patches to the main thread](write-worker-thread-safe-solver-patches-4.md)
- [Approach 5: Identify the vehicle a callback runs for with a ThreadStatic set in a prefix and cleared in a finalizer](write-worker-thread-safe-solver-patches-5.md)
- [Approach 6: Immutable commands published before the solver job is queued](write-worker-thread-safe-solver-patches-6.md)

[^ksa-game-assemblies-current-decomp-ksa-vehicleupdatestate-cs]: ksa-game-assemblies: current/decomp/KSA/VehicleUpdateState.cs.
[^ksa-game-assemblies-current-decomp-ksa-rocketnozzle-cs]: ksa-game-assemblies: current/decomp/KSA/RocketNozzle.cs.
[^ksa-game-assemblies-current-decomp-ksa-physicsbubble-cs]: ksa-game-assemblies: current/decomp/KSA/PhysicsBubble.cs.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^ksa-game-assemblies-current-decomp-ksa-universe-cs]: ksa-game-assemblies: current/decomp/KSA/Universe.cs.
[^blasto-blasto-gamemod-simulation-blastsimulation-cs]: blasto: Blasto.GameMod/Simulation/BlastSimulation.cs.
[^blasto-blasto-gamemod-mod-cs]: blasto: Blasto.GameMod/Mod.cs.
[^ksa-vehicle-update-task]: Native apply only accepts ready physics bubbles.
