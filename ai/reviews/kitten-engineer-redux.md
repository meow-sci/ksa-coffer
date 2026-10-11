# Review: content/mods/kitten-engineer-redux

Reviewed 2026-10-10 against Kitten-Engineer-Redux `d5786a0e75203a18a96936fb3537220d44b7a18b`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, gatOS `b88c285` (one cited file) and decompiled KSA build
2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). I read all 26 C# files, the extensionless
`Patch_StandaloneMenu`, `mod.toml`, the csproj, `.gitignore`, README and the git history. I also
unpacked `dist/KittenEngineerRedux.zip`. On the game side I read `Program.cs` (`PrepareFrame`, `OnFrame`,
`OnDrawUi*`, `DrawMenuBar`, `GetPlayerTime`), `App.cs`, `VehicleEditor.cs`, `Vehicle.cs`,
`CelestialSystem.cs`, `Universe.cs`, `GameViewport.cs`, `SequencePerformanceList.cs`,
`PhysicsBubble.cs`, `ResourceGroups.cs`, `GaugeCanvas.cs`, `Content/Core/Gauges.xml`,
`AtmosphericBody.cs`/`Astronomical.cs`, `Orbit.cs`, `ModLibrary.cs`/`Mod.cs`,
`RocketControllerData.cs`, `EngineController.cs` and `SolidMotor.cs`. I also checked StarMap's
`RuntimeMod`, `ModLoader`, `StarMapCore`, `GameSurveyer` and `ModAssemblyLoadContext`, and the
lifecycle reference under `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

Independent checks:

- **Harmony binding.** I decompiled `HarmonyLib.MethodCreatorTools.EmitCallParameter` from
  Lib.Harmony 2.4.2 in the local NuGet cache; StarMap.Core references 2.4.2. For a patch parameter
  matched by name where both types are non-by-ref reference types, Harmony emits a bare `ldarg` with
  no `castclass` or type check. `GameViewport` is the only class implementing `IGameViewport` in
  build 5554, so both postfixes bind and receive a real `GameViewport`. Git history of the assemblies
  repo shows the targets took `Viewport` up to 2026.8.22.5348 and `IGameViewport` from 2026.9.7.5402.
  The bundle had said 5438.
- **Unpatch order.** Decompiled `Harmony.UnpatchAll(string harmonyID = null)`: a null id removes
  every patch. `StarMapCore.DeInit` calls it before `ModLoader.Dispose` invokes `[StarMapUnload]`.
- **Release zip.** The DLL strings carry `v0.5.2`; the source says `v0.5.7`. The zip last changed in
  `8635580` and the DLL timestamp is 2026-10-02 21:39. The bundled `ModMenu.Attributes.dll` is
  assembly 1.0.2. Its constructor is `(string menuName, string isModMenuActivePropertyName = null)`,
  and its description says the property lets "ModMenu signal when your menu is active". The cached
  1.0.1 package has only the one-argument constructor.
- **Flight cache.** In `PhysicsBubble.RunVehiclePostWorkInner` (L793-L796) the condition is
  `ResourceGroups.IsOpen || Program.EngineControlGaugeOpen`. `ResourceGroups.IsOpen` is
  `Program.SequenceCanvas.Enabled`. Both canvases are defined in `Gauges.xml` (`Sequence`,
  `EngineControl`), and `GaugeCanvas._enabled` starts `true`.
- **Snippets.** I diffed all 23 fenced snippets (21 original, 2 new) line by line against the
  checkout. All are verbatim. I printed every line-anchored link's first and last line: one range
  was off and one link pointed at the wrong member. Both are fixed.
- **Validators.** All three tools were clean before and after the review, for both the bundle and
  the lifecycle reference.

## Scores

| Area | Score (1-5) | Notes |
|---|---|---|
| Accuracy | 3 | Snippets and most engine reads were right. Several load-bearing claims were wrong or unverified: flight cache condition, unpatch order, the `name` key, the ModMenu attribute, hyperbolic periapsis, section registration order |
| Coverage | 4 | 13 good features; the thrust/TWR/pressure mechanism used by four of them had no concept |
| Lifecycle correctness | 3 | `lifecycle`/`hooks` values were right. Prose had `VehicleEditor.OnFrame` in `frame:viewports`, omitted that `StarMapUnload` runs after all patches are gone, and described the flight cache as normally stale when it is refreshed every step by default |
| Conformance | 5 | Validators clean, footnotes match sources, headings at `##`, overview table matched the files; the catalog had drifted from the frontmatter |

## Defects

| File | Defect | Fixed |
|---|---|---|
| overview.md, native-stage-performance-readout.md, catalog | Flight recompute described as "while the Resource Groups window or engine-control gauge is open", framed as rare. It is gated on the `Sequence`/`EngineControl` gauge canvases, which start enabled, so the cache is normally refreshed every vehicle step. Also added the stale-but-clean case | yes |
| native-stage-performance-readout.md | Publish model described only as swap plus `Volatile.Read`; the pitfall said the struct is "reused between recomputes". Now describes the double buffer and when each buffer's lists are rewritten | yes |
| native-stage-performance-readout.md | `SetDirty` caller list missed `Tank.ConfigureFor`, `RefillAllTanks`/`DepleteAllTanks` and the `Sequence.Environment` setter, and did not say a new list starts dirty | yes |
| native-stage-performance-readout.md | Flight-mode recompute differences (live pressure or live nozzle thrust for the active stage, lower stages get no engines) missing; pressure pitfall overstated | yes |
| native-stage-performance-readout.md | Editor job bullet did not say the job is queued only while dirty, or why KER's main-thread recompute cannot overlap it | yes |
| native-stage-performance-readout.md | Decomp anchor `SequencePerformanceList.cs#L110-L290` started on a blank line | yes (L111-L291) |
| overview.md, dist-zip-and-post-build-deploy.md | `[StarMapUnload]` row and lifecycle omitted that `StarMapCore.DeInit` has already run an id-less `UnpatchAll`, so KER's `UnpatchAll(id)` is a no-op | yes |
| dist-zip-and-post-build-deploy.md, overview.md | "The folder, the DLL and the `name` must all be `KittenEngineerRedux`". The default `EntryAssembly` is the folder name (the game builds `ModEntry` from `modDir.Name`); `name` is only `Mod.Name`. A missing DLL is skipped without a log line | yes |
| overview.md, editor-panel-injection.md, flight-hud-controlled-vehicle-postfix.md | `GameViewport` vs `IGameViewport` binding left "unverified", with a wrong build range (5438) | yes (verified, 5402) |
| editor-panel-injection.md | `VehicleEditor.OnFrame` placed in `frame:viewports`; it runs from `Program.OnFrameEditor` (`editor:on-frame`) | yes |
| editor-panel-injection.md | Part-count pitfall tied the `- 1` to the "Fixed part count bug" commit. That commit (`e32071b`) changed only the stage counts; the `- 1` came from `8635580` | yes |
| modmenu-entry-with-standalone-fallback.md | Said the two-argument `ModMenuEntry` could not be checked; the shipped 1.0.2 DLL documents it | yes |
| modmenu-entry-with-standalone-fallback.md | "Same call the stock HUD menu makes" was inaccurate; the menu-bar window, `BeginMenuBar` context and auto-hide reset were not explained | yes |
| flight-hud-controlled-vehicle-postfix.md | "Sorted last, so it draws on top" (it is called last; ImGui window z-order is separate) | yes |
| flight-hud-controlled-vehicle-postfix.md | Popped windows said to "disappear when the controlled vehicle changes"; they reappear for the next vehicle | yes |
| flight-hud-controlled-vehicle-postfix.md | `ComputeActiveThrust` described as "active engines only"; it also drops engines without propellant | yes |
| suicide-burn-calculator.md | Abort list incomplete (`m0 <= 0`, negative or NaN duration, non-positive average deceleration) | yes |
| suicide-burn-calculator.md | `Vehicle.TotalMass` linked to L371-L373 (`Orbit`/`Parent`) | yes (L567 added) |
| suicide-burn-calculator.md | Missing: `ActiveEngineThrust.Compute` ignores `IsPropellantAvailable`; airless-body case and the game's own use of `GetNearSurfaceRadius` | yes |
| orbit-readouts-and-hohmann-estimate.md | Pitfall said hyperbolic time to periapsis uses `EndOfTime`. For e >= 1, `GetNextPeriapsisTime` returns `TimeAtPeriapsis`, so the countdown goes negative after periapsis | yes |
| telemetry-history-and-csv-export.md | "About 4 KB per array per sample"; actual is 719 floats, about 2.9 KB (17 KB for all six) | yes |
| json-settings-autosave.md | "Editor panel's section is only constructed when the editor first draws". Static initialisation can be triggered by `Load`/`Capture` or the menu; corrected the ordering argument | yes |
| draw-list-widget-kit.md | `DrawFloating` index pitfall implied several editor popped windows (there is one section) | yes |
| ai/catalog/kitten-engineer-redux.yml | `game_types` out of sync in 8 entries, `techniques` in 1; flight-cache note wrong; thrust topics attached to the wrong features | yes |
| game-loop-and-lifecycle/overview.md (reference) | Threading-table row 489 said "while the staging window or engine gauge is open"; it is gauge canvases, enabled by default. Corrected, sources added, logged in its log.md | yes |

The following claims were verified correct as written and needed no change:

- the wall-clock basis of telemetry sampling (`Program.GetPlayerTime` is the unclamped `Stopwatch` time from `KSA.App.Run`);
- `GetNearSurfaceRadius` returning the top of the atmosphere on an `AtmosphericBody`;
- the stale `Patch_StandaloneMenu` (not compiled; it matches the pre-5402 `Viewport.MenuBarInUse` field);
- the dist zip version gap;
- the `[StarMap]` fallback mechanism (apart from the `name` claim);
- the editor postfix reading `EditingSpace.Parts` with mass from `ComputeInertMassPropertiesAsmb` plus `ComputePropellantMassPropertiesAsmb`.

## Features added

- `features/live-engine-thrust-and-twr.md` (vehicles-and-parts). It covers:
  - actual thrust from applied `RocketNozzleState.Performance`;
  - rated thrust from `Vehicle.ComputeActiveThrust` and `RocketControllerData.ComputeFromCores`, including the solid-motor dependence on current grain;
  - gravity and pressure at any altitude;
  - the apply path that makes nozzle states consistent during the draw.

  It was added to the catalog with four generic how-to topics. I moved the `read-live-engine-thrust` and `engine-thrust-at-ambient-pressure` topics there from the HUD and estimator entries, and added `harmony-postfix-parameter-binding` and `clean-up-on-unload`.

No concepts were removed or merged; the remaining 13 are distinct mechanisms.

## Open concerns

- **ModMenu runtime.** ModMenu's runtime source is not in the corpus, so when (or whether) it sets `IsHandledByModMenu` is unverified. A related risk is also unverified: when ModMenu is installed, KER's load context may resolve its own copy of `ModMenu.Attributes.dll` rather than ModMenu's. A type-identity attribute lookup by ModMenu would then miss KER's entry, and both menus would show.
- **Part count.** What `Parts.Length - 1` is meant to exclude is undocumented.
- **Harmony binding source.** The binding behaviour was read from the decompiled Lib.Harmony 2.4.2 in the local NuGet cache, which is not a pinned corpus repo. I did not test it at runtime.
- **Sibling bundles.** `ksa-deltavmap/features/vehicle-staged-dv-readout.md` and possibly the AFC staging feature describe the flight recompute as running only while the canvases are "open". It would be worth adding that both are enabled by default; this is outside this bundle's scope.
