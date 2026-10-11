# Review: content/mods/ksa-deltavmap

Reviewed 2026-10-10 against KSA-DeltaVMap `0441981a4c59b90e462fd81fc20d3924b356841a`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`).

**Scope.** On the mod side: `Mod.cs`, `Patch_MenuBar.cs`, `StagedDv.cs`, `StockPlannerBridge.cs`,
`TransferWindowMapOverlay.cs`, `ConsoleUi.cs`, `TransferWindow.cs`, `DebugConfig.cs`, the csproj, the
README and the relevant parts of `MapWindow.cs` and `InterstellarSection.cs`. Every one of the 74 C#
files is cited somewhere in the bundle.

On the game side:

- `Program.cs`: `PrepareFrame`, `OnFrame`, the `OnDrawUi*` methods, `DrawMenuBar`, `DrawProgramMenusHook`
- `GameViewport.DrawImGui`
- `ImGuiHelper.GetOverlayDrawList`
- `ImGuiWindow`: constructor, `OnDrawUi`, `OnDrawUiConsole`
- `TransferPlanner` (statics, `DrawPlanWindow`, `DrawSliderFloatRow`)
- `SequencePerformanceList`
- `PartTree`: `EnsureDerived`, `FlushDirtyDerived`, `MarkDerivedDirty` and every caller
- `PhysicsBubble.RunVehiclePostWorkInner` and `ApplyResultsToVehicles`
- `ModuleStateful.StateUpdater`
- `VehicleUpdateTask.ApplyResultsToMainThread`
- `InputEvents`, `SequenceList`, `ResourceGroupList`
- `ConsoleWidgets`, `ConsoleStyle`
- `OrbitalTransfers.AlignmentTime`, `InterstellarBurnPlan`

Also covered: StarMap `ProgramPatcher.cs`, `StarMapCore.cs` and `ModLoader.cs`, and
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

## Points settled from code

| Question | Answer from the decomp |
|---|---|
| Which list does `ImGuiHelper.GetOverlayDrawList` return? | `viewport.IsMain() ? GetMainOverlayDrawList() : ImGui.GetWindowDrawList()`, where `GetMainOverlayDrawList()` is `ImGui.GetBackgroundDrawList(ImGui.GetMainViewport())` (`ImGuiHelper.cs` L43-L51). `Mod.Draw` passes `Program.MainViewport`, so the overlay draws on the main ImGui viewport's background list, the same list `Program.DrawFps` uses. It renders over the 3D composite and under every ImGui window. The non-main branch exists because `GameViewport.DrawImGui` calls `Universe.OnDrawUi(this)` from inside the secondary viewport's own window. |
| Does the overlay survive a hidden HUD? | The list survives: `ImGui.Render` and the imgui render pass run regardless, and `DrawFps` still writes to it. The overlay itself does not. `OnDrawUiViewports` is called only inside `if (DrawUI)` (`Program.cs` L2265-L2273), so StarMap's postfix (`StarMapAfterGui`), `Mod.Draw`, the window and the overlay never run. Stock map markers disappear the same way. The bundle said "skipped when the HUD is hidden", which was correct but did not separate the list from the hook; it now does. |
| Transfer Planner bridge: FieldRefs or Harmony? | No Harmony patch. Ten private statics are bound once with `AccessTools.DeclaredField` and `StaticFieldRefAccess<T>`, after checking `IsStatic` and `FieldType`. `SetTransferInfo` is bound with `DeclaredMethod(..., Type.EmptyTypes).CreateDelegate<Action>()`. `Patches/` holds only the menu postfix. All field names and types exist in the build. The bundle was already right, including its correction of the mod's own comment: AfterGui runs before `OnDrawUiThreadSafe`, which draws `TransferPlanner.DrawPlanWindow`, so stock draws after the bridge's writes in the same frame. |
| How is staged delta-v read, and can it race the solver? | See the next section. |
| `DrawProgramMenusHook` postfix | It is an empty public instance method that `DrawMenuBar` calls after both the editor and flight menu branches, before the version text (L4005, L4018). It has two callers. The main bar is drawn from `OnDrawUiThreadSafe` when the main viewport is hovered, which is after AfterGui. A hovered secondary viewport's bar is drawn from `GameViewport.DrawImGui` inside `OnDrawUiViewports`, which is before AfterGui. Both are behind `DrawUI`, and neither runs while the bar is auto-hidden. The bundle named only the first caller. |

### Staged delta-v read and the vehicle solver

**How the mod reads it.** On the main thread in AfterGui, the mod runs its own private
`new SequencePerformanceList(tree)`. In flight it calls `.RecomputeForFlight(0f)`; in the editor it uses
a fresh instance with `RecomputeIfDirty()`. It reads `PerformanceSequences`. Two checks gate the
recompute:

- a signature of propellant mass, part count and sequence count, with a 0.25 s floor
- in flight, a reflected check of `PartTree._derivedDirty` against
  `SubstanceStores | SolidMotorStacks | Sequences`

**Why it does not race.**

1. While the vehicle step runs, the worker writes module states into `StateUpdater` copy-on-write
   buffers.
2. The live `PartTree.Moles` list changes only through `UpdateFromTaskResults` / `UpdateBulkStates`
   inside `ApplyVehicleSolvers`, which the main thread joins.
3. The only shared rebuild path is `EnsureDerived`, and it is a pure read on a clean tree.
4. `PrepareFrame` flushes every dirty tree before dispatch.
5. Every `MarkDerivedDirty` caller runs on the main thread before that flush: input events, docking
   and part-failure render events, and the editor. The staging UI only enqueues `InputEvents`
   operations.

The worker's own `RecomputeForFlight` on the shared list (only while the staging window or engine gauge
is open) therefore never meets a dirty tree that the mod could rebuild concurrently.

**What was wrong in the bundle.** It said the staging window dirties the tree in `OnDrawUiThreadSafe`
while the solver runs. That is wrong, and it is now fixed.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Engine members, `game_types` (all 56 distinct types checked), the AlignmentTime mirror, bridge keys and the 64 snippets were nearly all right. The defects were the staging-UI claim, an incomplete menu-hook caller list, the unload no-op, and four snippets with unmarked or paraphrased elisions |
| Coverage | 4 | All 74 files are cited. One reusable mechanism had no concept: the panels built on the stock `ConsoleWidgets`/`ConsoleStyle` kit, including the `UseConsoleChrome` style gap. Nothing needed merging |
| Lifecycle correctness | 4 | Every hook target, patch kind and frame position was right. The original author had already caught the mod's own wrong comment about the planner frame order. The wrong staged-dv staging-window timing claim, the missing secondary-viewport menu path and the `StarMapUnload` ordering are fixed. 5 after fixes |
| Conformance | 4 | The validator, ref checker and index check were clean before and after. Four snippets were not verbatim. `headless-harness-tests` misused `thread:background` and carried a pseudo-hook. The catalog `game_types` had drifted for 5 features |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/vehicle-staged-dv-readout.md | Lifecycle and Pitfalls said the staging window's edits run in `OnDrawUiThreadSafe` and dirty the tree while the solver runs. In fact `SequenceList` and `ResourceGroupList` enqueue `InputEvents.SequenceChangeBuffer` and `StageChangeBuffer` operations, which `ApplyInputEvents` applies in the next `PrepareFrame` before `FlushDirtyDerived` | yes |
| features/vehicle-staged-dv-readout.md | The caller list for derived-data dirtying named the staging UI as a direct caller and omitted `PartFailureEvent` | yes |
| features/vehicle-staged-dv-readout.md | Said worker module states "are applied on the main thread". The precise path is: `StateUpdater.GetNewStates` copies on first write, and the live list is overwritten by `PartTree.UpdateFromTaskResults` -> `UpdateBulkStates` inside `ApplyVehicleSolvers` | yes |
| features/map-window-and-menu-entry.md, overview.md | Named only the `OnDrawUiThreadSafe` caller of `DrawMenuBar`. It omitted the hovered secondary viewport's bar from `GameViewport.DrawImGui` (before AfterGui) and the auto-hide early return | yes |
| features/map-window-and-menu-entry.md, overview.md | Presented `UnpatchAll(_harmony.Id)` in `StarMapUnload` as effective. `StarMapCore.DeInit` has already called the id-less `UnpatchAll()`, so it is a no-op | yes |
| features/map-window-and-menu-entry.md | `Patch_MenuBar.cs` snippet labelled L13-L31 but included L32 | yes |
| features/map-mode-transfer-overlay.md | Snippet L59-L96 dropped four comment lines without `// ...` | yes (verbatim) |
| features/map-mode-transfer-overlay.md | The pitfall called the non-main fallback "the map window's own list". From `DrawCanvas` the current window is the `##dvmap_canvas_col` child. The hidden-HUD statement did not separate the surviving background list from the skipped hook, and the full draw gate was not listed | yes |
| features/headless-harness-tests.md | `lifecycle: [thread:background]` was used to mean "outside the frame". There was a pseudo-hook `starmap StarMapMod (no lifecycle methods)`, and the technique was `starmap-lifecycle` even though the test mod has no lifecycle methods | yes |
| features/multi-system-scene-composition.md | Snippet L2148-L2178 replaced the `else if` fallback with a paraphrased `// ... else fall back ...` comment | yes (verbatim) |
| features/subway-map-canvas-rendering.md | Snippet L1128-L1163 dropped a two-line comment without a marker | yes |
| features/three-layout-modes.md | Snippet L86-L134 ended with a paraphrased elision comment | yes (pure `// ...`) |
| ai/catalog/ksa-deltavmap.yml | `game_types` differed from frontmatter for five features (live graph, ladder, route, interstellar, staged dv). The headless entry carried the old lifecycle and hooks | yes |
| howto/.../game-loop-and-lifecycle-2.md (reference) | The `DrawProgramMenusHook` row said only "inside the menu bar, only when `DrawUI` is true". It now names both callers, their position relative to `StarMapAfterGui`, and the auto-hide return | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Per-frame row 13 did not say what `GameViewport.DrawImGui` draws: the window, `Universe.OnDrawUi` into that window's list, and the menu bar | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The "racy after dispatch" table did not cover lazy `PartTree.EnsureDerived` rebuilds racing the worker's `RecomputeForFlight` | yes (row added), logged |

## Features added

- `features/stock-console-widget-panels.md` (ui, `frame:draw-ui`). It covers:
  - checkbox, log-slider and status rows on `ConsoleWidgets` / `ConsoleStyle`
  - the copy of the private `TransferPlanner.DrawSliderFloatRow` pattern
  - region headers, segmented presets and readouts in the interstellar section
  - the finding that `MapWindow` does not enable `UseConsoleChrome`, so `ConsoleStyle.PushWidgetStyle`
    is never applied (the `ConsoleUi` header comment says otherwise)

  It was added to the catalog with two generic howto topics, the overview feature table and the
  See also sections of three features.

## Open concerns

- The thread and timing of HeadlessHarness's `IHarnessTest.Run` can't be verified because HeadlessHarness
  is not in `references/`. The feature marks this unverified.
- I traced every `MarkDerivedDirty` / `RecomputeAllDerivedData` caller in this build to the main thread
  before the flush, but did not prove it for every indirect path (for example a UI path that calls
  `Vehicle.Split` during the draw). The mod's guard covers that case.
- The visual effect of the missing `PushWidgetStyle` was not checked in game.
- I verified the algorithm-heavy features (patched conics, layouts, scene composition, interstellar
  math) by member name, snippet and spot-checked formulas (AlignmentTime, HohmannFlight threshold,
  `InterstellarBurnPlan` step rule), not line by line.
- Several descriptions run 280-300 characters. They are single sentences under the validator's limit and
  were left as written.
