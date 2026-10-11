# Review: how-to category flight-and-orbits (batches flight-and-orbits-1 and -2)

Scope: 29 topics (5 groups: flight-state 6, autopilot 7, transfers 6, guidance 6, map-view 3), 105 articles plus 29 overviews. Checked against the mod checkouts under `references/`, the decompiled build 2026.10.10.5554 (Orbit, FlightComputer, BurnPlan, TransferPlanner, Vehicle, Universe, Program, PhysicsBubble, CelestialSystem), the lifecycle reference and `flight-computer-worker-copy-channels.md`.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Engine claims and snippets are very strong; defects were mostly secondary claims, shorthand identifiers and one unit slip |
| Coverage | 5 | Every plan topic and approach has an article; every plan `features` id is cited; no silent drops |
| Lifecycle correctness | 4 | Flight-computer write windows, copy-back, `PrepareFrame` order and hook targets all match the authority; two unload-timing and one worker-ownership claim were wrong |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0 errors, group indexes current |

## Mechanical checks run

- 396 fenced blocks with a source path compared line by line with the pinned checkouts (multi-range `L a-b, L c-d` headers, `// ...` elisions): all verbatim after one range fix. The two `// adapted from` blocks (`SolveJob<T>`, `SlicedSearch`) are pure C# and compile.
- Every backticked identifier looked up in decomp plus mods; every `Type.Member` pair checked against `Type.cs`; every frontmatter `hooks` target checked against the decomp; all `starmap Star*` attributes exist in `references/StarMap`.
- Plan coverage: files, `approaches` count, `approach` numbers, `demonstrated_by` existence, plan `features` cited, overview approaches table vs articles (links and lifecycle values): no gaps.
- All internal links resolve (0 broken); `lifecycle` frontmatter compared with the Lifecycle section.

## Defects found

| File | Defect | Fixed |
|---|---|---|
| `content/mods/ksa-advancedflightcomputer/features/apse-and-inclination-quick-tools.md` | Said stock `Orbit.Inclination` is against the ecliptic and CCI +Z is the ecliptic normal. It is `acos(h.Z/abs h)` against CCI +Z, the parent pole (`Orbit.cs` L1611-L1630). AFC's `Ecliptic` option is really the equatorial plane and its `Equatorial` option (CCE +Z) the ecliptic. Rewrote intro, reference-normal bullet, added a pitfall; logged in the AFC `log.md` | yes |
| `understand-ksa-coordinate-frames-and-epochs-4.md` | Cited that feature page as saying stock inclination is ecliptic (now stale) | yes |
| Plan/catalog notes (`batches/flight-and-orbits-1.yml`, `howto-plan.yml`, `plan-parts/flight-and-orbits*.yml`, `ksa-advancedflightcomputer.yml`) | Same "Orbit.Inclination is ecliptic" note | yes |
| `create-and-read-maneuver-nodes-4.md`, `execute-planned-burns-with-the-stock-autopilot-2.md`, AFC `multi-pass-burn-splitting.md` | Claimed the stock `SequencePerformanceList` is filled by `NearestOrbitAndPerformanceWorker`. In flight it is recomputed by `PhysicsBubble` on the vehicle worker while the Sequence or EngineControl canvas is enabled (`PhysicsBubble.cs` L793-L796); that worker's `SequencePerformanceJob` targets the editor list. This contradicted the lifecycle reference | yes |
| `create-and-read-maneuver-nodes-4.md` | Invented parameter names for `CalculateBurnPatch`, `ComputeCompleteTrajectory` (`polynomialOrderN`), `CreateUninitialized(KeyHash)` | yes |
| `understand-ksa-coordinate-frames-and-epochs-2.md` | Said drawing from `StarMapAfterOnFrame` "appears next frame"; gizmo instances are wiped by `GizmosRenderer.ResetInstances` at the start of the next `OnFrame` (`Program.cs` L2260) | yes |
| `set-simulation-speed-from-a-mod-3.md`, `set-and-clear-the-vehicle-target-2.md`, `drive-...-8.md`, `add-plan-type-to-the-transfer-planner-1.md` | Advised cleanup or speed restore in `[StarMapUnload]` "before unpatching"; under StarMap that hook runs after the game exited and after the id-less `UnpatchAll()` (lifecycle reference row 16) | yes |
| `draw-a-predicted-trajectory-and-map-markers-6.md` and overview | Body and hooks install from `[StarMapImmediateLoad]` but frontmatter `lifecycle` lacked `startup:immediate-load` | yes |
| `draw-a-predicted-trajectory-and-map-markers-1.md` | Snippet header L23-L48 dropped the closing brace (L49); leaked planning remark ("The how-to plan described...") | yes |
| `aim-a-transfer-at-a-flyby-periapsis-3.md`, `predict-impact-point-and-build-a-ballistic-computer-3.md`, `icbm-ballistic-computer.md` | "54 million km" of planet travel in half an hour; 29.8 km/s x 1,800 s is about 54,000 km (the KSArmory source repeats the slip; noted in text) | yes |
| `compute-transfer-windows-1.md` | Same-SOI lead angle attributed to "vehicle radius"; code uses the source's current CCI radius and the vehicle's phase (`OrbitalTransfers.cs` L717-L718) | yes |
| `plan-and-fly-a-powered-landing-3.md` | `TerminalBurn` and `LandingEngineWait` are not identifiers; now `LandingPhase.TerminalCoast`/`TerminalBrake` (`StepTerminalBurn`) and `LandingEngineWaitStart`/`ResetLandingEngineWait` | yes |
| `aim-a-transfer-at-a-flyby-periapsis-1.md` | Quoted a Lambert call with an invented argument (`targetCenterAtArrival`); now the mod's real call | yes |
| `plan-multi-leg-and-interstellar-delta-v-routes-2.md` | Link text `[Per-body state ladder and "you are here]` missing closing quote (2 places) | yes |
| 28 overviews/articles | "Related topic(s) in another batch: <slug>" and "(topic `x`, covered in another batch)": process jargon, unlinked, though all targets exist; replaced with real links. Bare slug in `plan-multi-leg-...-1.md` linked too | yes |
| `run-an-expensive-solve-without-stalling-the-frame-5.md` | Escaped backticks rendered literally | yes |

Files with a material change carry `generated.by: claude-code/sonnet-5.5`; topic and mod `log.md` files have `**Update**` entries.

## Features added

None. Coverage was complete for this category; no new mod feature concepts were needed.

## Open concerns

- Many prose link clusters (`[Program.cs#L...]` after a sentence) were only spot-checked for anchor relevance (about 12 of 91 heuristic flags inspected, all correct); a full semantic pass of every anchor was not done.
- Numeric claims sourced only from mod comments (solve times, "2 ms per vehicle", 1.15x max-q relaxation) are not independently checkable from the decomp.
- `draw-a-predicted-trajectory-and-map-markers-3` and others link to `ui/` and `rendering/` how-tos outside this batch; they resolve today.
- `steer-by-zero-effort-miss` overview lists `render:imgui` in `lifecycle` though no article hooks it; left as vocabulary-only.
- The category-level `index.md` is out of date and has no group descriptions (ignored per instruction).
