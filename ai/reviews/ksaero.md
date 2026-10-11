# Review: content/mods/ksaero

Reviewed 2026-10-10 against KSAero `3e7e26c9c694a563048261bd6e426e817377d404`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, KSA-AdvancedFlightComputer `77c0ccf` (one cited file) and
decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). The cross-check covered all five
KSAero C# files, both project files, `build/ModDeploy.targets`, `mod.toml`, the README, and on the game
side `Program.cs` (`PrepareFrame`, `OnFrame`, constructor), `Universe.cs` (`ApplyVehicleSolvers`,
`ExecuteNextVehicleSolvers`), `JobSystems.cs`, `VehicleUpdateTask.cs`, `PhysicsBubble.cs` (the full step
path), `PhysicsStates.cs`, `ReadOnlyPhysicsStates.cs`, `DormandPrince8.cs`, `IBubbleJob.cs`,
`KSA.Concurrency/ParallelBatch.cs` and `DynamicWorkerPool.cs`. It also covered
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

Independent checks I ran:

- **IL.** Disassembled `KSA.PhysicsStates` from `current/dll/KSA.dll` with ilspycmd 11.0. Both
  `ComputeDrag` calls sit at `IL_022c` (ocean) and `IL_02cf` (atmospheric). The backward argument
  sequences match the bundle's table instruction for instruction. The `AtmosphericDensity` load
  (`IL_02c3`) is exactly five instructions before the atmospheric call. The ocean call's 12-instruction
  window ends at `ldarg.1` with no match, and no call instruction occurs before that point.
- **AggressiveInlining.** `[MethodImpl(MethodImplOptions.AggressiveInlining)]` is on
  `PhysicsStates.ComputeDrag` at `PhysicsStates.cs` L1089, and the IL header reads
  `cil managed aggressiveinlining`.
- **Assembly attributes.** Read with `System.Reflection.Metadata`:
  - The `DebuggableAttribute` blob is `01-00-07-01-00-00-00-00`, which is `DebuggingModes` `0x107` and
    includes `DisableOptimizations`.
  - `AssemblyInformationalVersion` is `2026.10.10.5554+ea506daffa75e919075b7fc042633abdae551d6a`.
- **Physics call chain.** Confirmed from the decomp:
  1. `Program.PrepareFrame` (L2141-L2220) waits on `VehicleSolver`, then calls `ApplyVehicleSolvers`,
     then `ExecuteNextVehicleSolvers`.
  2. `ExecuteNextVehicleSolvers` queues the `VehicleUpdateTask` on the one-runner `VehicleSolver`.
  3. `VehicleUpdateTask.Run` runs the contact islands as a `ParallelBatch` on `VehicleWorkerPool`.
  4. Each island goes through `ContactIsland.Execute`, which calls `PhysicsBubble.RunStep` or, for a
     multi-bubble island, `RunIsland` with `BubbleStepSegmentJob`s. Both reach `StepFrameTo`.
  5. From `StepFrameTo` the path is `StepFullPhysicsTo` -> `FullPhysicsStepUntil`, which loops over
     substeps.
  6. Each substep runs either `FullPhysicsConstrainedStep`, which calls
     `ReadOnlyPhysicsStates.ComputeDerivatives` once per vehicle, or `FullPhysicsUnconstrainedStep`. The
     unconstrained step goes through `RunUnconstrainedVehicleStep` to `IntegrateVelocityVerlet` (two
     calls per substep) or `IntegrateRk8` (12 stage calls, only outside the physics radius).
  7. All of these reach the static `PhysicsStates.ComputeDerivatives`.

  Those four `ComputeDerivatives` call sites are the only ones in the game.
- **Snippets and anchors.** All 23 sourced snippets are verbatim. All 70 decomp anchors, 61 KSAero
  anchors and 12 StarMap anchors land on the cited code; these counts include the anchors added in this
  review.
- **Tests.** Re-ran `KSAero.Tests` from a scratch copy with the .NET 10.0.100 SDK. It prints `PASS` and
  reproduces the README tables.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets, anchors, IL and engine members were all correct. Three claims were wrong: the exception path out of the vehicle step, StarMap's shutdown `UnpatchAll` scope, and the `ComputeBuoyancy` call-boundary example |
| Coverage | 5 | The independent survey of all 712 C# lines, both project files, the targets file, `mod.toml` and the README found no reusable mechanism without a concept, and nothing to merge |
| Lifecycle correctness | 3 | All hook targets, patch kinds and frame positions were right. However, the worker-failure path was wrong, the full-physics entry conditions were incomplete (multi-vehicle bubbles, freefall entering the atmosphere), and the unload ordering (StarMap unpatches everything before `StarMapUnload`) was misstated. 5 after fixes |
| Conformance | 5 | The validator, ref checker and index check were clean before and after. One regex was in an unsourced `text` block; it is now a verbatim sourced snippet |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/body-of-revolution-aerodynamics.md | "Never throw" said a worker exception is rethrown on the main thread as "physics bubble result apply failed" by `RethrowApplyFailure`. In the code, `IBubbleJob` and `ContactIsland.Execute` catch the exception and `MarkFailed` logs an error. The failed bubble skips `PublishResults`, so `ApplyResultsToMainThread` neither applies nor rethrows its step and the vehicles do not advance that frame. `RethrowApplyFailure` only covers failures in the apply job | yes |
| features/body-of-revolution-aerodynamics.md | Call-chain step 6 said a lone vehicle takes the full-physics path "when manoeuvring". It omitted two cases: `StepFrameTo` sends every bubble with two or more vehicles to full physics, and `FreefallNeedsFullPhysics` forces it for freefall inside or entering the atmosphere, which is the case that matters for aero | yes |
| features/body-of-revolution-aerodynamics.md | Step 7 gave the constrained-step condition loosely ("has contacts"; the code tests `ConstraintSim.IsAnyConstrained`). Step 8b omitted that the leader runs before the other vehicles. Step 8a did not say the constrained force is held across the Bepu timesteps. Step 11 did not name the 12 stages or the CCI-frame condition | yes |
| features/body-of-revolution-aerodynamics.md | The thread labels did not say that the `VehicleSolver` runner also executes pool items while it waits on a batch (`DynamicWorkerPool.AwaitBatch`), or that the main thread never runs the step | yes |
| features/body-of-revolution-aerodynamics.md, features/computedrag-call-site-transpiler.md, overview.md | Said the function runs "several" or "one to several" times per substep. It runs once (constrained) or twice (Verlet) per vehicle per substep in air; RK8 never takes the drag branch | yes |
| features/body-of-revolution-aerodynamics.md | Said "the same state can be evaluated twice in one substep". Reworded to describe Verlet's two evaluations and the shared state at substep boundaries. Also added that no substep limit comes from drag (2 s free cap, angular, buoyancy, chutes), which is why the limiter matters | yes |
| features/computedrag-call-site-transpiler.md | The call-boundary example claimed the stop protects against the atmospheric `ComputeBuoyancy` load. That load (`IL_02db`) comes after the drag call and is never scanned | yes |
| features/computedrag-call-site-transpiler.md | The "Other transpilers" note omitted that Harmony re-runs every transpiler on each repatch, so KSAero's throw can surface in another mod's `Patch` call | yes |
| features/patch-refusal-and-rollback.md, overview.md | Said StarMap "only uses the no-argument form for its own instance at shutdown". `StarMapCore.DeInit` calls the id-less `UnpatchAll()`, which removes every patch in the process, before `ModLoader.Dispose` invokes `[StarMapUnload]`. KSAero's unload unpatch is therefore a no-op | yes |
| features/game-version-check.md | The version regex was quoted in a `text` block with no source header. It is now the verbatim `VersionInfo.cs` L178 line | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The worker-side bullet said anything "in contact" runs `FullPhysicsStepUntil`, but on-rails landed, floating and bottomed vehicles take the analytic surface path. It also omitted multi-vehicle bubbles and the atmosphere rule | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Listed "the 1/60 s contact rate" as a substep limit. 1/60 s is the floor of the contact-time limit and the Bepu timestep inside a constrained substep. The 2 s free cap was not mentioned | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Gave the RK8 condition as "off-surface". The exact condition is a CCI bubble frame, outside the physics radius and no chutes, so RK8 never runs with drag | yes, logged |
| howto/.../game-loop-and-lifecycle/game-loop-and-lifecycle-4.md (reference) | Said "KSAero keeps the stock delegate for exactly this" (exception recovery). KSAero has no `try`/`catch` on the hot path; the delegate covers geometry it cannot model | yes, logged |

The agreement check found one direct contradiction: the bundle said the exception is rethrown, while the
reference said "vehicles freeze, not a crash". The code supports the reference, and the bundle was
corrected. The other differences were omissions or imprecision on one side, and both sides now give the
same account.

## Features added

None. KSAero is about 700 lines of C#. The nine existing concepts cover:

- the call-site transpiler
- refusal and rollback
- the stock delegate fallback
- the aero model
- Mach from the atmosphere
- the readout
- the version check
- headless tests
- build and deploy

The remaining mechanisms are already sections of those concepts:

- the equivalent-cylinder geometry
- the exposed-fraction scaling
- the semi-implicit limiter
- the log-once ImGui guard
- invariant-culture formatting
- the launch-profile generation
- the deploy stamp

None of these is a separately reusable feature at the brief's grain. The catalog gained three generic
how-to topics:

- `starmap-shutdown-unpatch-order`
- `physics-step-exception-behaviour`
- a corrected `vehicle-solver-call-chain` note

## Open concerns

- Whether the JIT actually inlines `ComputeDrag` at runtime in this build, which carries
  `DisableOptimizations`, is not verified in game. The bundle already states this.
- The statement that Harmony rebuilds from the original IL and re-runs every transpiler on each
  repatch is Harmony library behaviour. No checkout here contains Harmony to verify it against, so it is
  labelled as library behaviour.
- The freeze on a worker exception (main-thread `Vehicle` not advanced while universe time advances) is
  derived from reading the code, not observed in game.
- `StarMap.API` 0.3.6 (NuGet) against the pinned StarMap checkout is still unverified, as the bundle notes.
- The reference articles 1-3 were not re-reviewed beyond lines that mention KSAero or the vehicle step.
