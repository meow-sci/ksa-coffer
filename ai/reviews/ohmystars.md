# Review: content/mods/ohmystars

Reviewed 2026-10-10 against OhMyStars `4bb602e3bfe36bcd3670b71b88bf644fe95fa407`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, KSA_AircraftHUD `4e4c717` (one cited line) and decompiled KSA
build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). The review read every C# file in the mod (6.3k
lines), the csproj, `mod.toml`, `settings.ini`, NOTICE and README. On the game side it covered `Program.cs`
(`OnFrame`, `PrepareFrame`, `OnDrawUi*`, constructor), `Universe.cs` (`ApplyVehicleSolvers`,
`ExecuteNextVehicleSolvers`, `PrepareVehicleWorkers`, `DrawGalacticGrid`), `Camera.cs`, `GalacticPlane.cs`,
`InstancedStarTechnique.cs`, `InstancedRenderTechnique.cs`, `Mod.cs`, `ModLibrary.cs`, `FlightComputer.cs`,
`Vehicle.cs`, `KittenEva.cs`, `PhysicsBubble.cs`, `VehicleUpdateData.cs`, `VehicleUpdateState.cs`,
`VehicleUpdateTask.cs`, `InputEvents.cs`, `GaugeButtonFlightComputer.cs`, `UncompressedSave.cs`,
`GameSaves.cs`, `Popup.cs`, `ConfirmActionPopup.cs`, `TimedAlert.cs`, `KSA.Rendering/RetiredResourceQueue.cs`,
`RenderCore/ReverseDepthBufferUtils.cs`, `Star.vert`, `NavballMarkers.glsl`, and StarMap's patchers, `ModLoader`,
`RuntimeMod`, `ModRegistry` and `StarMapCore`.

Independent checks run:

- **Projection pipeline (the "draw lines on the sky" claims).** All verified.
  - `RaDecToDirection` rotating by -23.439281 deg about X gives exactly the formula of
    `GalacticPlane.EquatorialToEcliptic` (0.4090928040284034 rad = 23.4392911 deg). The constants differ
    by 0.036 arcsec.
  - `Mod.LoadStarBinaries` passes `distance: 19.5f` (L282), and `AddInstance` stores
    `NormalizeOrZero(forward) * distance`. `Star.vert` multiplies by `global.camera.viewProjection`, and
    the view part is rotation-only (`Camera.OnFrame`). `EclToEgo` only subtracts `PositionEcl`.
  - `EgoToScreen` returns `(NaN, NaN)` when `Dot(posEgo, GetForwardEcl()) < 0`.
  - The overlay is a `NoInputs`/`NoBackground` full-viewport window begun from the `StarMapAfterGui`
    postfix on `OnDrawUiViewports`. Both StarMap GUI hooks sit inside `if (DrawUI)`.
  - `Universe.DrawGalacticGrid` uses the foreground list, radius 1000, 2 deg pieces, a NaN skip and the
    viewport offset.
  - The "asterism FOV test is off" pitfall holds. In `ReverseDepthBufferUtils` M41, M42 and M44 are 0,
    and the view matrix is rotation-only, so the four side planes pass through the eye and
    `IsPointWithinFov(Zero)` is true.
- **Data counts.** Recomputed from the shipped files:
  - catalog: 330,327 rows, 108,592 HIP, 460 proper names, 1,525 Bayer, 12 named without HIP; 69,306,172 bytes
  - `lines_in_20.txt`: 6,524 same-key pairs, max 1.0000013 deg
  - grid segment counts as stated
  - default sky-culture index 29 = `modern`
- **Harmony targets.** There are 14: ten attitude targets (`TargetMethods` yields two), two save
  targets and two star-technique targets. Each was found in the decomp with the stated kind. `__4` is
  `inMaxInstances`.
  - `KSA.dll` carries a `DebuggableAttribute` with blob `01 00 07 01 00 00 00 00`
    (`DisableOptimizations`), so `AggressiveInlining` is unlikely to bypass the prefixes in this build.
- **Snippets and anchors.**
  - All 34 sourced snippets, including the 3 in the new concept, are verbatim; multi-range blocks mark
    elisions.
  - About 290 line anchors were dumped and read. Five distinct ranges, used in 15 links, stopped short
    of the cited construct and were fixed.
  - `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean before and
    after the review (17 concepts).

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 3 | The projection, catalog and patch inventory were right. Several behavioural claims were wrong: overwrites "missed" by the save hook, a saved star-binary selection "applied when the window opens", the buffer resize described as growth-only, the behind-camera pointer going "down", and "write after dispatch is racy" |
| Coverage | 4 | Fifteen concepts covered nearly everything. Missing: the reusable `KSA.Popup` subclass and `TimedAlert` toasts (now a concept), the worker-side `SetNullRot` path, the auto-burn bypass, and the Sol navball bug |
| Lifecycle correctness | 3 | StarMap hook placement, `PrepareWorker` and the MMU worker thread were right. Gauge-button attitude changes were placed in `frame:draw-ui` (they queue `InputEvents` for the next `frame:input`). `SetNullRot` running on vehicle-solver workers was missing, and so was the `FlightComputer.CopyFrom` copy-back that forces the per-dispatch re-apply. 5 after fixes |
| Conformance | 4 | Tools were clean. Five anchor ranges (15 links) stopped short of the cited code. The catalog `game_types` were out of sync for 12 features, and two overview lifecycle cells did not match the frontmatter |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/attitude-mode-handoff-patches.md | Lifecycle said stock attitude changes run "or gauge buttons during `frame:draw-ui`". `GaugeButtonFlightComputer.OnReleased` and `Vehicle.OnKey` only queue `InputEvents`, and `ApplyInputEvents` runs `SetEnum`/`ToggleEnum`/`SetStabilization` at the next `frame:input` | yes |
| features/attitude-mode-handoff-patches.md | Missed that `SetNullRot` runs on vehicle-solver workers. `FlightComputer.ComputeControl` calls it through `UpdateBurnTarget` and `SetInertialNullRot` on the worker's flight computer copy, where the prefix enumerates the mod's unsynchronized collections and never matches an owner. `TrackTarget`/`RateHold` call sites (the mod's own `DisengagePending` in the `PrepareWorker` prefix, kitten `RateTrim`) were not listed | yes |
| features/attitude-mode-handoff-patches.md | The inlining pitfall did not mention `DisableOptimizations` on `KSA.dll`, which makes the prefixes (including worker-side ones) likely to fire | yes |
| features/attitude-mode-handoff-patches.md | Missing pitfall: auto-burn alignment writes `AttitudeTrackTarget = PositiveDv` directly and `FlightComputerBurnMode` is not treated as a mode change, so star mode and auto burns fight | yes |
| features/attitude-mode-handoff-patches.md | Missing pitfall: no `try`/`catch` around patching in `OnFullyLoaded`, nor in StarMap's `LoadAll` postfix, so a renamed target aborts initialisation and propagates into the `Program` constructor | yes |
| features/attitude-mode-handoff-patches.md | "No unpatch" did not say that StarMap's id-less `UnpatchAll` removes all patches before any `StarMapUnload` | yes |
| features/attitude-mode-handoff-patches.md | Enum row linked `FlightComputer.cs` L34-L52 (fields), not the enum definitions; `KittenEvaAction` is not in that file | yes |
| features/orient-to-star.md | Pitfall said writing the flight computer "after the dispatch would be racy". The worker steers its own copy, so such a write is not racy but is overwritten by `FlightComputer.CopyFrom` at the next apply. Only worker-thread writes (the MMU prefix) are racy | yes |
| features/orient-to-star.md | Lifecycle did not explain the copy-back at `ApplyVehicleSolvers` that makes the per-dispatch re-apply necessary, or how a UI engage is reverted and then re-applied | yes |
| features/star-instance-restyle-patch.md | Description and intro said the buffer grows "when more stars are loaded than it was sized for". It is re-created whenever selected + 1,000 differs from the capacity (stock is headers + 200). The first apply of every session always re-creates it, and it can shrink | yes |
| features/star-instance-restyle-patch.md | Disposal pitfall did not name the game's deferred-free mechanism (`KSA.Rendering.RetiredResourceQueue.Retire`). It also omitted that every apply rewrites the single mapped buffer that frames in flight read, and that arrays are allocated for all eight slots | yes |
| features/star-instance-restyle-patch.md | "Slider values are read from `starsedit_settings.ini`" did not say that these are the last saved or used preset's values, because slider moves are never written | yes |
| features/star-binary-switcher.md | "The whole file is rewritten on each change". It is written only on creation and on preset save, use or delete | yes |
| features/star-binary-switcher.md | Pitfall said a saved binary selection "is only applied after the player opens the Star Editor". It is never applied at start-up: the deferred apply reloads the stock selection, and only Restore Settings > LAST USED or a preset re-applies the saved one | yes |
| features/star-binary-switcher.md | "Grows the buffer if needed" (same as above) | yes |
| features/save-scoped-settings-sidecar.md | "Overwrites are missed". `UncompressedSave.Overwrite()` calls `Make(base.Id)`, so the `Make` postfix fires. Added that the load postfix also records refused or failed loads | yes |
| features/overlay-occlusion-by-bodies.md | Description said the occluder list is built "from the camera-followed object up to the system root". It walks up to the root, then collects every body and body-orbiting vehicle of the system | yes |
| features/star-pointer.md | A target straight behind the camera was said to point "straight down". NDC y = -1 maps to the top edge | yes |
| features/navball-star-marker.md | Undocumented bug: the marker uses Sol's catalog direction (no HIP, RA/Dec 0/0, so ecliptic +X), unlike the pointer and orientation, which use the live root body | yes |
| features/sky-overlay-lines-and-labels.md | Lifecycle did not state that the next physics step is already dispatched when `StarMapAfterGui` runs | yes |
| features/ini-settings-persistence.md | "Fresh file from the in-memory defaults": the first-run file uses field initializers, which differ from `Defaults` (for example IAU opacity 1 against 0.4) | yes |
| features/modmenu-entry-and-console-style-windows.md | Said the gatOS bundle describes ModMenu's menu location. It describes gatOS's own fallback. Rewritten as unverified, with the menu-bar window order (separate `BeginMenuBar` window after both StarMap GUI hooks) | yes |
| overview.md | Harmony resolution "StarMap's copy in the default load context" was overstated; architecture and compatibility rows did not mention worker-side `SetNullRot` or `DisableOptimizations`; the feature table's lifecycle for two rows did not match the frontmatter | yes |
| several features | Anchors: `Mod.cs#L231-L280` (stops before the `19.5f` call at L282) in 6 links, `Camera.cs#L529-L544` in 4, `RuntimeMod.cs#L129-L160` in 3, `InstancedRenderTechnique.cs#L86-L95` and `UncompressedSave.cs#L45-L60` once each | yes |
| ai/catalog/ohmystars.yml | `game_types` out of sync with the frontmatter for 12 features. Summaries for occlusion, instance restyle, switcher, save and attitude carried the errors above. The save how-to note said "patch Make, Load and Overwrite" | yes |
| howto/.../game-loop-and-lifecycle (reference) | `game-loop-and-lifecycle-1.md` listed OhMyStars as demonstrating a prerequisite `[StarMap] EntryAssembly`, and overview startup row 3 named only that table. StarMap falls back to `<manifest id>.dll` (the folder name), which OhMyStars uses | yes, logged |

The reference and the bundle agree on every other OhMyStars timing point:

- `StarMapBeforeMain` runs before StarMap's own patches
- `StarMapAllModsLoaded` runs at `Program.cs` L942, before the star technique exists
- both GUI hooks run inside `DrawUI` and before `OnDrawUiThreadSafe`
- `PrepareWorker` is the last settled point
- `FlightComputer.CopyFrom` runs at apply

## Features added

- `features/game-styled-popups-and-toasts.md` (ui). It covers:
  - the `KSA.Popup` subclass that self-registers for `Popup.DrawAll` and draws with the protected
    console-modal helpers
  - the public `ConfirmActionPopup.Create` alternative
  - `TimedAlert` toasts
  - timing: in `OnDrawUiFrame` right after `StarMapBeforeGui`, not drawn with the HUD hidden, one popup
    at a time
- Added to the catalog with two how-to topics.
- New topics on other features:
  - `harmony-prefixes-on-worker-threads`
  - `safe-gpu-resource-replacement`

## Open concerns

- Inlining is not verified in game; under `DisableOptimizations` the JIT is not expected to inline, but
  an optimized future build could.
- The worker-thread dictionary races (`SetNullRot` and MMU prefixes) and the Vulkan hazard of disposing
  the star buffer with frames in flight come from reading the code. They were not observed, and no
  validation layer was run.
- What ImGui and the GPU do with the `NaN` endpoints the overlay emits was not verified.
- ModMenu is not in the corpus, so how and when it calls `[ModMenuEntry]` methods is unverified.
- The stock `briars_binary_dimmer_better_99k_stars.bin` is not in the assemblies checkout, so the
  bit-exact asterism filter could not be tested.
- Harmony's behaviour for an empty `TargetMethods` or a missing attribute target is library behaviour
  that cannot be verified from these checkouts.
- `StarMap.API` 0.3.6 (NuGet) against the pinned StarMap source is not checked.
