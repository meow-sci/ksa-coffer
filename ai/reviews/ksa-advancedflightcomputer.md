# Review: content/mods/ksa-advancedflightcomputer

Reviewed 2026-10-10 against KSA-AdvancedFlightComputer `77c0ccf5608e49c459eec72c3a56d0b30d62da63`,
StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, KittenExtensions `b52467541a4fda3c3771eb2c157ed7574f9e2d7c`
and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). The review also covered
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` and the catalog `ai/catalog/ksa-advancedflightcomputer.yml`.
The bundle had 59 features; it now has 60.

Independent checks I ran:

- **Mechanics.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean
  before and after (61 concepts, 0 errors, 0 warnings).
- **Snippets.** A script compared every fenced block that has a source header with the checkout or the
  decomp, line by line, in order, inside the stated range, and flagged unmarked gaps and early ends. All
  85 original snippets were verbatim with elisions marked. The 3 new snippets pass the same check.
- **Anchors.** A script printed the first and last line behind each of the 499 anchored links. None ran
  past a file. Seven pointed at the wrong lines (fixed, see the table). About 30 more start or end one
  line off, on a blank line or a brace. That is harmless and I left them.
- **Engine members.** All 100 `game_types` exist in the decomp. Every `harmony-*`/`reflection` hook
  target exists in the named type. None of AFC's 35 patch targets carries `AggressiveInlining`.
- **Frame order.** I read `Program.PrepareFrame`/`OnFrame`, `Universe.ApplyVehicleSolvers`/`ExecuteNextVehicleSolvers`/
  `PrepareVehicleWorkers`, `Vehicle.PrepareWorker`/`UpdateFromTaskResultsUnsynchronized`, `VehicleUpdateData.Prepare`,
  `FlightComputer.CopyFrom`/`ComputeControl`/`RaisePendingAlerts`/`UpdateAttitudeTarget`,
  `PhysicsBubble`'s three `ComputeControl` call sites, `InputEvents.ApplyInputEvents`, `NearestOrbitPointJob`, the
  gauge render path (`RenderGame` -> `GaugeCanvas.CanvasesRender` -> `CanvasRenderer.Render` ->
  `GaugeBundle.UpdateInstanceBuffer` -> `PackData`) and StarMap's `ModPatches`, `ModLoader`, `StarMapCore.DeInit`
  and `GameSurveyer`. I checked them against every `## Lifecycle and timing` section.
- **Priority claims, settled from code:**
  1. **Command sink.** One postfix on `FlightComputer.ComputeControl` runs on the vehicle workers. It is
     called from three `PhysicsBubble` sites (the full-physics segment loop, `FullPhysicsPreStep` and
     `ApplySingleVehicleMotion`). It receives `UpdateData.NewFlightComputer`, a copy that
     `VehicleUpdateData.Prepare` fills with `CopyFrom` at the end of `Vehicle.PrepareWorker`.
     `UpdateFromTaskResultsUnsynchronized` copies that copy back over the vehicle's flight computer,
     unconditionally, at the next `ApplyVehicleSolvers` (Vehicle.cs L2530). The bundle said worker writes
     to `BurnMode` "do not reach the main-thread vehicle reliably". That is wrong: stock's own
     `BurnMode = Manual`/`AutoBurnCompleted` travel exactly that way. The copy-back is also what erases
     main-thread writes made after dispatch.
  2. **Post-solver tick.** The prefix and postfix on `Universe.ApplyVehicleSolvers` run on the main
     thread with all four schedulers joined. They come before `Glfw.PollEvents`/`ApplyInputEvents`,
     before the `RaisePendingAlerts` loop and before the nearest-orbit job is queued. Staging
     activations queued there (`IActivateInputBuffer`) land in the same frame's drain, and
     `PartTree.FlushDirtyDerived` rebuilds before `ExecuteNextVehicleSolvers`.
  3. **Guidance step.** The prefix on `Vehicle.PrepareWorker` is main-thread, inside
     `PrepareVehicleWorkers`, before `VehicleSolver.Queue`. It is the last point before that vehicle's
     snapshot. It is not "the only one after the drain" (the `RaisePendingAlerts` loop is also after
     it). The cloth jobs and the nearest-orbit job are already running at that point. The nearest-orbit
     job iterates burn lists (`BurnPlan.FindNearestBurnPoint`), so AFC's direct
     `FlightComputer.AddBurn`/`RemoveBurn` of the deorbit node from that prefix races it.
     `KittenEva.PrepareWorker` calls base, so the prefix fires for EVA kittens, and AFC filters them.
  4. **RCS execution and staging writes.** `Vehicle.SetEnum` is reached from
     `InputEvents.FlightComputerInputBuffer` in `ApplyInputEvents` (`frame:input`). The executor raises
     `AutoBurnCompleted`/`AutoBurnStoppedOutOfPropellant` in the post-solver tick, after the copy-back
     and before `RaisePendingAlerts`. Pulses are written to `outputs.Thrusters` `CommandPulseTime` in
     the sink. The new-engine seed writes committed `EngineControllerState` in the `PrepareWorker`
     prefix, after `FlushDirtyResourceManagers`.
  5. **Planner and context-menu transpilers.** In `TransferPlanner.DrawPlanWindow` the order is
     `DrawCorrectionTransfer` L624, the first `PopWidgetStyle` L731, `PrimaryButton("CREATE")` L748, the
     only direct `Burn.Create` L778 and `BurnUpdateBuffer.Add` L786, as described. In
     `BurnContextMenu.Draw` the early `EndPopup` returns, the final `EndPopup` L347 and the `u8`
     submenu labels all match.
  6. **Native interop.** StarMap's `ModAssemblyLoadContext` has no `LoadUnmanagedDll`. AFC's resolver
     is a `[ModuleInitializer]` in the Conic assembly. G-FOLD runs synchronously in the `PrepareWorker`
     prefix. SCvx runs on `afc-6dof-solve`/`afc-ascent-scvx` threads.
  7. **Drag table.** The static `PhysicsStates.ComputeDerivatives` writes nothing. With `dt = 0`,
     `ComputeDrag`'s limiter term vanishes. It reads `origin.Parent.Mu` and the angular velocity besides
     its arguments.
  8. **Harness test mod.** The empty `[StarMapMod]` has no hooks. There are 72 named tests, not 73.
- **Lifecycle reference.** It already had the flight-computer copy-back and the step order. It lacked
  two things AFC depends on. `PrepareWorker` clears `EngineOn` in Auto. The step-4 window is settled
  for the vehicle solver only: the nearest-orbit job walks burn plans concurrently. Both are now added
  to `game-loop-and-lifecycle-3.md` and logged.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets were all verbatim and every named member exists. About a dozen claims were wrong or overstated: the copy-back pitfall, "the only point after the drain", worker-thread reflection reads, the default P/Invoke probing claim, `FindClosestApproaches` "on the orbit solver jobs", the test count, and `PhysicsBubble` "iterating" during the apply postfix |
| Coverage | 4 | All 35 Harmony targets and every source folder map to a concept. One cross-cutting mechanism had no concept of its own: the flight-computer copy contract and the `BurnPlan`/`VehicleConfigInfo`-keyed worker channels. Now added; 5 after the fix |
| Lifecycle correctness | 3 | Hook targets and patch kinds were right. Wrong labels or timing: `PackData` runs in `frame:render`, not the draw; `[StarMapUnload]` runs after `Main` returned and after StarMap's id-less `UnpatchAll`, so AFC's "ordered teardown" is moot; multi-pass adds queued from the tick land in the same frame; spurious `startup:all-mods-loaded` on the native and harness concepts; `physics:vehicle-solver` missing on hyperbolic targets; burn-plan edits in the `PrepareWorker` prefix race the nearest-orbit job. 5 after fixes |
| Conformance | 5 | All three validators were clean, the catalog matched every frontmatter, and the overview table matched the files. Seven anchors were wrong |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/flight-computer-command-sink.md | The pitfall said worker writes to `BurnMode` do not reach the vehicle. `CopyFrom` at `ApplyVehicleSolvers` copies them back, which is how stock's own worker writes travel and what erases post-dispatch main-thread writes | yes |
| features/flight-computer-command-sink.md | One anchor (`FullPhysicsPreStep` L1782-L1798) was cited for all three call sites, including "once per analytic step". The text did not explain the copy-back | yes |
| features/guidance-vehicle-step-loop.md | Repeated the mod's "the only one after `ApplyInputEvents`" (the `RaisePendingAlerts` loop is also after the drain). Did not say why the draw cannot write (copy-back). Did not mention the concurrent nearest-orbit job | yes |
| features/guidance-vehicle-step-loop.md | The KittenEva pitfall implied the override bypasses the prefix. It calls `base.PrepareWorker`, so the prefix fires for kittens. The menu hook's second `DrawMenuBar` caller (secondary viewports) was missing | yes |
| features/guidance-vehicle-step-loop.md | Anchors `Vehicle.cs#L2396-L2426` (ran into the next method), `Autopilot.cs#L948-L971` and `GuidanceFeature.cs#L113-L152` (off the code) | yes |
| features/deorbit-landing-planner.md | "No vehicle worker runs, so `FlightComputer.AddBurn` ... are safe". The nearest-orbit job queued just before iterates the same burn list; added a pitfall and alternatives | yes |
| features/autostage-gauge-button.md | `IsSet`/`IsFlightComputerDisabled` labelled `frame:draw-ui` "when the gauge packs its button data". `PackData` runs in the `RenderGame` gauge pass (`frame:render`); `IsDisabled` runs in the draw | yes |
| features/rcs-burn-editor-and-gauge-ui.md | The same `PackData` timing error. It also stated that Harmony "cannot patch" `IsSet<T>`, while the AUTOSTAGE feature patches the `Enum` instantiation and `afc-autostage-per-vehicle` tests it | yes |
| features/feature-gated-patch-sets.md | Presented the `[StarMapUnload]` order (flush, then unpatch) as meaningful. StarMap calls `Harmony.UnpatchAll()` before `ModLoader.Dispose`, after the game's `Main` returned | yes |
| features/staging-delays.md, features/automatic-staging.md | The unload flush was described as effective. Under StarMap no frame drains it | yes |
| features/automatic-staging.md | "PhysicsBubble may be iterating those lists" during the apply postfix. The workers are joined there; the real reason is the stock drain and flush order | yes |
| features/multi-pass-execution.md | "Queued add applied: next frame". A pass queued from the tick lands in the same frame's `ApplyInputEvents` | yes |
| features/native-conic-solver-interop.md | Claimed default P/Invoke probing "would look in the game's directories". The mod does not say this and the decomp cannot show it. `startup:all-mods-loaded` was in `lifecycle` with nothing behind it | yes |
| features/headless-harness-test-mod.md, overview.md | 73 tests (the code has 72 distinct `Name`s). `startup:all-mods-loaded` for a mod with no hooks | yes |
| features/validated-reflection-handles.md | Said handles are read "from vehicle worker threads (for example the manual control inputs)". Every reader is on the main thread | yes |
| features/hyperbolic-transfer-targets.md | Said `FindClosestApproaches` runs "including the orbit solver jobs" (those propagate celestials only). The vehicle-worker callers were missing from `lifecycle` | yes |
| features/optional-kittenextensions-patches.md | `hooks` listed only the `PrepareSystems` transpiler. KittenExtensions also transpiles `LoadAssetBundles`, `LoadPlanetMeshes` and `LoadSystems` (the body was right) | yes |
| features/drag-table-measurement.md | "`ComputeDerivatives` is a pure function of its arguments". It also reads the parent body through `origin.Parent` | yes |
| features/guidance-panel-and-overlays.md | "After the game's own viewport UI". It runs before `OnDrawUiThreadSafe` and after dispatch; the reason clicks are queued was not given | yes |
| features/vehicle-control-ownership.md, features/post-solver-vehicle-tick.md | Did not state the copy-back or the `BurnPlan` safety of the tick window | yes |
| features/rcs-burn-execution.md | Anchors `InputEvents.cs#L596-L606`, `RcsExecutor.cs#L700-L760`, `GaugeButtonFlightComputer.cs#L129-L142` | yes |
| overview.md | `[StarMapUnload]` row, the frame placement (render step, copy-back), the thread table and the feature lifecycles were out of date with the above | yes |
| ai/catalog/ksa-advancedflightcomputer.yml | The lifecycle and hooks of 6 features had to follow the fixes, and the new feature was missing | yes |
| howto/.../game-loop-and-lifecycle-3.md (reference) | The `PrepareWorker` body omitted the Auto `EngineOn` clear. Did not say that step-4 prefixes run beside the nearest-orbit job that walks burn plans | yes, logged |
| ~30 anchors across features | Start or end one line off, on a blank or brace line | no, cosmetic |

## Features added

- `features/flight-computer-worker-copy-channels.md` (patching). It covers the `CopyFrom` snapshot in
  `PrepareWorker` and the write-back in `ApplyVehicleSolvers`. It lists what `CopyFrom` shares by
  reference (`BurnPlan`, `VehicleConfig`, `Burn`), what it never copies back (`Ctrl2Asmb`), and AFC's
  three `ConditionalWeakTable` worker channels keyed by those shared objects. It also gives the rule
  that confines flight-computer writes to the window before the snapshot, and notes that
  `ReadUpdatedVehicleConfiguration` replaces the key on split, merge and load. The feature is in the
  catalog with three generic how-to topics, is linked from the command sink, control ownership, the
  post-solver tick, the guidance step, RCS execution and guidance actuation, and is in the overview
  table.

## Open concerns

- **HeadlessHarness** is not in the corpus. Its `SimDriver` frame order (which `Apply*`/`Execute*` it
  calls, and whether it runs `PrepareFrame`'s nearest-orbit job) is taken from AFC's comments and README.
- **Generic patches.** Whether a Harmony patch on `Vehicle.IsSet<Enum>` covers every reference-type
  instantiation (shared canonical code) is runtime behaviour outside the decomp. The text only states
  what AFC does and tests.
- **Native probing.** Whether .NET's default P/Invoke probing would find `clarabel_c`/`scs` beside the
  Conic assembly without the resolver was not settled. The text now just says AFC does not rely on it.
- **`DrawProgramMenusHook`** is an empty instance method. If a game build JIT-compiled `DrawMenuBar`
  before the postfix were applied, the call could already be inlined. AFC patches at all-mods-loaded,
  before any frame, so this was not pursued.
- The GFOLD/SCvx/UPFG/MPC math concepts were checked for snippet fidelity and engine touch points
  only. Their formulations were not re-derived.
