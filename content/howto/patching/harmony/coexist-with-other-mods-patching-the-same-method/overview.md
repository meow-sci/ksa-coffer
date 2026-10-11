---
type: Game Feature
title: Coexisting with other mods that patch the same method
description: How Harmony orders and re-runs patches when several mods target one game method, and how KSA mods order, share and merge patches so that features and neighbouring mods do not break each other
topic: coexist-with-other-mods-patching-the-same-method
category: patching
group: harmony
approaches: 5
game_types: [KSA.Universe, KSA.Program, KSA.PhysicsStates, KSA.PartTreeRenderData, KSA.Vehicle, KSA.FlightComputer]
lifecycle: [startup:all-mods-loaded, frame:dispatch-solvers, frame:apply-solvers, physics:vehicle-solver, frame:prepare, frame:render]
demonstrated_by: [mods/gatos/features/solver-phase-command-drain, mods/ksastructures/features/terrain-height-roof-override, mods/shaderextensions/features/rendergame-render-pass-transpiler, mods/ksaero/features/computedrag-call-site-transpiler, mods/unscience/features/lib-part-render-filter, mods/unscience/features/unscience-consolidated-patcher, mods/unscience/features/lib-physics-frame-hook, mods/unscience/features/lib-hotkey-guard, mods/ksa-advancedflightcomputer/features/post-solver-vehicle-tick, mods/ksa-advancedflightcomputer/features/feature-gated-patch-sets, mods/ksa-advancedflightcomputer/features/flight-computer-command-sink]
tags: [harmony, coexistence, priority, transpiler, shared-seam, patching]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:24:11Z }
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: ShaderExtensions
    git: https://github.com/AMPW-german/ShaderExtensions.git
    ref: 6a2eb66ea85bcaa2d4657e502a4f75e92693ea77
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksa-parttreerenderdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTreeRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs
    title: "KSA.PartTreeRenderData (decompiled, build 2026.10.10.5554)"
  - id: ksa-flightcomputer
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FlightComputer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs
    title: "KSA.FlightComputer (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsstates
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsStates.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs
    title: "KSA.PhysicsStates (decompiled, build 2026.10.10.5554)"
  - id: starmap-starmap-core
    repo: StarMap
    path: StarMap.Core/StarMap.Core.csproj
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMap.Core.csproj
    title: "StarMap/StarMap.Core/StarMap.Core.csproj"
---

Every mod that patches a hot game method shares it with the others. Harmony does the arithmetic of combining the
patches, but the combination has rules mods must design for: prefixes and finalizers run in priority order, a
prefix that returns `false` stops later `bool` prefixes, and every registered transpiler is re-run against the
original IL whenever any patch on the method is added or removed. This topic collects five ways KSA mods handle that:
ordering with `Priority`, anchors that tolerate earlier transpilers, idempotent shared installs, one shared tick
with per-feature flags, and one postfix that merges every writer.

## Engine background

| Type | Member | Why it is shared |
|---|---|---|
| `Universe` | `ExecuteNextVehicleSolvers`, `ApplyVehicleSolvers`, `GetJobSimStep` | The solver handoff in `Program.PrepareFrame` ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1922-L1950)[^ksa-universe], [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2126-L2139)) |
| `Program` | `PrepareFrame`, `RenderGame` | One method per frame with seams between calls ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2141-L2222)[^ksa-program], [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4947-L4952)) |
| `Vehicle` | `PrepareWorker` | Snapshots state for the worker ([current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2396-L2398)[^ksa-vehicle]) |
| `PartTreeRenderData` | `Compose`, `ComposeDynamic`, `ComposeGlass` | Appends draw ranges that filters compact ([current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L1258-L1264)[^ksa-parttreerenderdata]) |
| `FlightComputer` | `ComputeControl` | Called on solver threads with by-ref arguments ([current/decomp/KSA/FlightComputer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FlightComputer.cs#L400-L404)[^ksa-flightcomputer]) |
| `PhysicsStates` | `ComputeDerivatives` | Two `ComputeDrag` calls ([current/decomp/KSA/PhysicsStates.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs#L1002-L1017)[^ksa-physicsstates]) |

Phases from [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md): `PrepareFrame` applies results (`frame:apply-solvers`), polls input and dispatches the next step
(`frame:dispatch-solvers`) on the main thread; `RenderGame` records commands in `frame:render`; the vehicle solver
and its flight-computer calls run on workers in `physics:vehicle-solver`.

## Harmony rules that shape coexistence (checked against Lib.Harmony 2.4.2)

StarMap references Lib.Harmony 2.4.2 ([StarMap.Core/StarMap.Core.csproj](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMap.Core.csproj#L11)[^starmap-starmap-core]). Local tests of the
version showed:

| Question | Observed |
|---|---|
| Prefix order | `Priority.First`, default, `Priority.Last` |
| Finalizer order | the same, `First` to `Last` |
| Equal priority | the prefix registered first ran first; `before = new[] { "other.id" }` on the later patch reversed it |
| A prefix returns `false` | later prefixes that return `bool` did not run (including one that also takes `__runOriginal`); later `void` prefixes, postfixes and finalizers did |
| A second transpiler is added | the first transpiler ran again, on the original IL; the second saw the first's output |
| A transpiler's owner is unpatched by id | the remaining transpilers ran again |

The Harmony-specific consequence is that **ordering is a design decision, not luck**: patches that must precede or
follow everyone say so with priority; transpilers must tolerate being run again and must tolerate that an earlier
transpiler already changed the code they are looking for.

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Priority.First prefixes and Priority.Last finalizers around shared seams](coexist-with-other-mods-patching-the-same-method-1.md) | gatOS, KSAStructures | `Priority.First` prefix and `Priority.Last` finalizer around shared seams | `frame:dispatch-solvers` | Cheap; priority is a convention, not a lock |
| 2 | [Anchors that one mod can consume (and what the next transpiler then sees)](coexist-with-other-mods-patching-the-same-method-2.md) | ShaderExtensions, KSAero | Anchors that one mod can consume, and what the next transpiler sees | `startup:starmap-before-main`, `frame:render` | Fails loudly by name; two mods cannot share one consumed anchor |
| 3 | [Idempotent shared installs with a registration API](coexist-with-other-mods-patching-the-same-method-3.md) | unscience | Idempotent shared installs with a registration API | `startup:all-mods-loaded`, `frame:render` | Needs a shared library; works inside one assembly |
| 4 | [One shared tick with per-feature enable flags set from TryApply results](coexist-with-other-mods-patching-the-same-method-4.md) | KSA-AdvancedFlightComputer | One shared tick, flags set from `TryApply` results | `frame:apply-solvers` | Each feature depends on a flag being honest |
| 5 | [One worker-side postfix merging every writer](coexist-with-other-mods-patching-the-same-method-5.md) | KSA-AdvancedFlightComputer | One worker-side postfix merging every writer | `physics:vehicle-solver` | Worker-thread rules apply to every writer |

## See also

- [Writing a Harmony transpiler for a KSA method](../../transpilers/write-a-harmony-transpiler/overview.md) and [Identifying the right call in a method that makes several similar calls](../../transpilers/identify-a-call-by-its-argument-il/overview.md) for the transpiler side of approach 2
- [Harmony finalizers, cleanup and scoped overrides](../run-cleanup-or-recover-from-exceptions-with-a-finalizer/overview.md) for the finalizers used in approach 1
- [Isolating patch failures and keeping patch bodies from throwing](../../safety/isolate-patch-failures-and-fault-proof-patch-bodies/overview.md) and [Refusing a patch and rolling back when the game changes](../../safety/refuse-a-patch-and-roll-back-when-the-game-changes/overview.md) for per-feature owners and rollback
- Related tasks: mutate-vehicles-at-a-physics-safe-point, drive-the-flight-computer-and-attitude-modes-from-a-mod, create-a-minimal-starmap-mod
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Mutate vehicles at a physics-safe point](../../../physics/solver/mutate-vehicles-at-a-physics-safe-point/overview.md) - related topic
- [Drive the flight computer and attitude modes from a mod](../../../flight-and-orbits/autopilot/drive-the-flight-computer-and-attitude-modes-from-a-mod/overview.md) - related topic
- [Create a minimal StarMap mod](../../../getting-started/loader/create-a-minimal-starmap-mod/overview.md) - related topic

[^ksa-universe]: KSA.Universe (decompiled, build 2026.10.10.5554)
[^ksa-program]: KSA.Program (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: KSA.Vehicle (decompiled, build 2026.10.10.5554)
[^ksa-parttreerenderdata]: KSA.PartTreeRenderData (decompiled, build 2026.10.10.5554)
[^ksa-flightcomputer]: KSA.FlightComputer (decompiled, build 2026.10.10.5554)
[^ksa-physicsstates]: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
[^starmap-starmap-core]: StarMap/StarMap.Core/StarMap.Core.csproj
