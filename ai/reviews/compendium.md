# Review: content/mods/compendium

Reviewed 2026-10-10 against Compendium `62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies`
`935a32b`). The review also covered the catalog `ai/catalog/compendium.yml` and the lifecycle reference
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`. The bundle has 17 features. No features were added.

Independent checks I ran:

- **Mechanics.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean
  before and after (18 concepts, 0 errors, 0 warnings). The same holds for the lifecycle reference
  bundle after my edit.
- **Snippets.** A script compared all 43 fenced blocks with the checkout, in order and inside the stated
  range. Two blocks span two ranges; I checked those by hand. All are verbatim.
- **Anchors.** I printed the first and last line behind every anchored link in the 18 files. None
  pointed at the wrong code. The new anchors were checked the same way.
- **Engine members.** All 67 `game_types` exist in the decomp. A `MetadataLoadContext` reflection run
  over `KSA.dll` checked three things:
  - Every patch target exists with the expected signature.
  - None carries `AggressiveInlining` (all implementation flags are `IL`).
  - `ComputeControl`'s `nav` is `ref readonly` (`RequiresLocation` plus `In`, no modreq).

  The run used `MetadataLoadContext` because the x64-only `KSA.dll` cannot load on this arm64 host.
  `KSA.dll` is not ReadyToRun.
- **Priority claims, settled from code:**
  1. **Target selection.** `Universe.SetTargetCommand` and `UnsetTargetCommand` only validate ids and add
     an `InputEvents.ChangeTargetData` to `ChangeTargetBuffer`. `ApplyInputEvents` applies it in
     `PrepareFrame` (`frame:input`). That is after `ApplyVehicleSolvers` and before
     `ExecuteNextVehicleSolvers`. Confirmed.
  2. **Flight computer.** The prefix and finalizer on `ComputeControl` run on the vehicle workers. There
     are three `PhysicsBubble` call sites:
     - `ApplySingleVehicleMotion`.
     - `FullPhysicsPreStep`, when the wake-up time is due.
     - `FullPhysicsStepUntil`, once per flight-computer tick, at least `1/MaxFlightComputerRate` apart.

     The receiver is `UpdateData.NewFlightComputer`. `VehicleUpdateData.Prepare` fills it with
     `CopyFrom`, and `CopyFrom` assigns `BurnPlan` by reference. `BurnPlan` has a private setter that
     only the constructor and `CopyFrom` set, so the side table keyed by it reaches the worker copy.
     `UpdateFromTaskResultsUnsynchronized` copies the computer back unconditionally at
     `ApplyVehicleSolvers` (Vehicle.cs L2530).
     - This matches the KSA-AdvancedFlightComputer review. Every Compendium flight-computer write happens
       in the input window (`Select`, `Clear`, the queued Toward/Away). The worker-side
       `StopRootTracking` travels back through the copy-back.
     - The bundle now states this contract explicitly and links AFC's copy-channel feature.
     - The finalizer's restore is defensive. The `FlightComputerNavigation` field is rebuilt before
       every call and is read nowhere else.
  3. **Navball patches.** `UpdateNavballData` and `UpdateNavBallMarkers` are private. Their only caller
     is `Vehicle.UpdatePerFrameData`. Per frame that runs from
     `ApplyVehicleSolvers -> CurrentSystem.UpdatePerFrameData -> IParentBody.UpdatePerFrameDataTree`, so
     the patches are `frame:apply-solvers`. That is before `ApplyInputEvents`, which gives the one-frame
     navball lag.
  4. **Transpilers.** I dumped the IL with ilspycmd:
     - `UpdateNavBallMarkers` and `UpdateNavballData` each have exactly one `NavigationTarget::Create`.
     - `UpdateNavballData`, `GaugeCanvas.IsContextVisible`, `GaugeButtonNavBallMode.IsDisabled` and
       `OnReleased` each have exactly one `get_Target(); ldnull; ceq`. The three gauge methods use
       `callvirt`, which the transpiler rewrites to `call`.
     - `UpdateNavballData` is patched by two transpilers that match different instructions.
     - In total there are six transpiler applications over five methods, and each finds exactly one
       match.
  5. **Orbit-line binding.** `[HarmonyPatch]` resolves through `AccessTools.DeclaredMethod`, which calls
     `Type.GetMethod(name, flags, null, types, modifiers)` (Harmony 2.4.2, decompiled).
     `IGameViewport : IViewport`, and `Astronomical` implements neither `IOrbiter` nor `IParentBody`.
     The reflection run bound `(Astronomical, IGameViewport, Orbit)` to
     `ShouldDrawLines(Astronomical, IViewport, Orbit)`. Confirmed.
  6. **Fonts.** `FontManager.RegenerateFonts` starts with `ImGui.GetIO().Fonts.Clear()`. It runs from
     `PrepareFrame` after `GameSettings.SaveChanges -> ScheduleFontRebuild`. Compendium never re-adds its
     fonts. Confirmed.
  7. **Camera focus.** `Universe.MoveCameraTo` calls
     `HoveredViewport.GetCamera().SetFollow(obj, ..., hoveredViewport.IsMain())`. `SetFollow` with
     `changeControl` sets `Program.ControlledVehicle = target as Vehicle`, which is null for a body.
     Confirmed for the main (hovered) viewport.
- **Known pitfalls.** None of these applied:
  - `[StarMapImmediateLoad]` takes `Mod`, so it runs.
  - The `[StarMapUnload]` text already said StarMap unpatches everything first.
  - No patch target is `AggressiveInlining`.
  - No menu-bar code exists.
  - No render-data postfix was mislabelled.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Every snippet was verbatim, every member exists, and all seven priority claims held. Wrong or overstated before the fix: a README citation for map-orbit star targeting the README does not make (the game's orbit picker skips `StellarBody`); "scans all installed mods" (only one mods root); "exception-safe" ImGui cleanup; 512+512 samples (511+511 interior); "tree changes only at input"; `ControlledVehicle` called a plain static; 202 evaluations (204) |
| Coverage | 5 | All 15 patched methods (17 Harmony patches), all 16 source files and the tooling map to concepts. No reusable mechanism was missing and no concept was redundant. One how-to topic was added |
| Lifecycle correctness | 4 | Hook targets, patch kinds and the core timing (settarget queue, input drain, worker call sites, copy-back, apply-time navball) were right. Missing: the `IsDisabled` patches also run at `frame:render` via gauge `PackData`. Spurious: `startup:game-loaded` on the body-tree feature. Imprecise: `UnsetTargetCommand` from the console is `frame:input` |
| Conformance | 5 | Validators were clean and the catalog matched every frontmatter. One title was not self-descriptive ("ModMenu toggle") |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/navball-target-marker-and-tgt-frame.md | `GaugeButtonNavBallMode.IsDisabled` (transpiled) and the `Vehicle.IsDisabled(VehicleReferenceFrame)` postfix also run in `RenderGame`'s gauge pass (`GaugeBundle.UpdateInstanceBuffer` -> `PackData`). The text and the lifecycle had only `frame:draw-ui`. Now `frame:render` is in the lifecycle with a timing bullet | yes |
| features/navball-target-marker-and-tgt-frame.md | Did not say that `UpdateNavballData` carries two transpilers or that the gauge getters are `callvirt` (why the opcode becomes `call`) | yes |
| features/flight-computer-root-attitude-tracking.md | The same `PackData` omission for `IsDisabled(FlightComputerAttitudeTrackTarget)`. The copy-back contract that AFC documents was implicit only. Added `frame:render`, a copy-back bullet and a cross-link | yes |
| features/star-systems-and-body-tree.md | `startup:game-loaded` was in `lifecycle` although nothing hooks it. "The tree changes only at the input point": SOI moves happen at apply (`ApplyPendingParentChildrenFix`) | yes |
| features/native-target-selection.md | Intro cited the README for "the map view also allows it by clicking the star's orbit". The README does not say this, and `SetNearestOrbitPoint` skips every `StellarBody`. Step 5 said "clicking an orbit" where the game uses Shift+click on the cursor target (`IOrbiter.OnMouseButtonOrbit`) | yes |
| features/cross-mod-json-catalog.md | "Scans the folders of all installed mods". It walks only the parent of its own folder, so mods in the other StarMap root (`Content` vs the user mods folder) are never read. Fixed the intro and description, and added a pitfall | yes |
| features/celestial-info-window.md | Called the catch-block cleanup a guarantee. The waiting branch skips `End` when `Begin` returns false, and the catch calls one `EndChild`/`End` blindly (wrong scope if the throw happens before `Begin` or inside nested scopes) and never pops fonts. `ControlledVehicle` was called a "plain static" (its setter clears held input) | yes |
| features/root-closest-approach-search.md | "512 uniform and 512 log" samples (the code adds 511 of each plus both ends). Missing pitfall: full-physics steps install a new `FlightPlan` every step (`PopulateAnalyticStatesFromKinematicStates -> SetCurrentOrbit`), so the plan-identity cache misses every frame | yes |
| features/root-navigation-targets.md | Did not say that `Select`'s own `SetTarget(null)` runs the `SetTarget` prefix and stops tracking when switching roots, or the one-frame navball lag | yes |
| features/custom-fonts-in-imgui.md | The rebuild pitfall did not mention that cached pointers may dangle (marked unverified, native) or where a mod could re-add fonts | yes |
| features/atmosphere-profile-graph.md | "202 model evaluations" (204) | yes |
| features/modmenu-window-toggle.md | Title "ModMenu toggle" was not self-descriptive. Retitled "ModMenu entry that toggles the window" in the file, overview, links and catalog | yes |
| overview.md | Patch table: `IsDisabled` rows lacked `frame:render`, and `UnsetTargetCommand` from the console is `frame:input`. Feature table lifecycles. "Copies exactly these files" (there is also a `Data/` glob). The copy-back rule and the inlining / immediate-load checks were absent | yes |
| ai/catalog/compendium.yml | Lifecycle of three features, two summaries ("every mod folder", "512+512"), the "exception-safe" summary and the ModMenu title followed the fixes. Added the generic topic `gauge-button-state-timing` and a thread-safety note on the orbit-line topic | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The Apply bullet did not name `CurrentSystem.UpdatePerFrameData` (navball data is refreshed there, before `ApplyInputEvents`). Render row 21 did not say that gauge-binding `PackData` (button `IsDisabled`/`IsSet`) runs in the gauge pass, which AFC and Compendium both rely on. Added; sources gained `CanvasRenderer.cs` and `GaugeBundle.cs` | yes, logged |

## Features added

None. The survey found no uncovered mechanism:
- Every `[HarmonyPatch]` class maps to a concept: `Patcher`, `RootTargetPatches`,
  `RootTargetPresencePatches` and `RootTargetFlightComputerPatches`.
- So do every `Cdm*` file, the two `Root*` state files, the JSON data, the fonts, the photos,
  `settings.ini`, ModMenu and the tooling.
- The `ModLibrary.LoadAll` postfix is a log line only, described in the overview.

## Open concerns

- **ModMenu's call site** (when and where it invokes `[ModMenuEntry]` methods) is not in the corpus. It
  stays marked unverified.
- **Native ImGui behaviour.** What happens to cached `ImFontPtr`s after `ImFontAtlas.Clear`, and whether
  a missing `End` asserts or is recovered, depends on the native `imgui.dll` build. The decomp cannot
  show it. The text marks it.
- **`ImGui.Image` with a default `ImTextureRef`** (logo load failure) is still unverified, as the
  author noted.
- **Worker reads of `Universe.Roots`/`CurrentSystem`** in `IsLoadedRoot` are safe as long as no system
  load runs during a solver step. I did not trace whether every `Universe.LoadSystem` path joins the
  workers first. Root positions themselves are constant (`FixedStar`/`Barycenter` `_positionEcl`, zero
  velocity), so there is no main/worker time skew.
- **Overload binding.** The reflection check used `MetadataLoadContext` with the default binder, not a
  live Harmony run in the game process.
