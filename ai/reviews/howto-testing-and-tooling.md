# Review: how-to category testing-and-tooling (batch testing-and-tooling-1)

Scope: `content/howto/testing-and-tooling/` (16 topics, 64 concepts incl. overviews, groups in-game-testing, offline-tests, game-updates). Plan: `ai/catalog/batches/testing-and-tooling-1.yml`.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | 282 fenced blocks and 575 pinned links machine-checked (0 bad); engine claims grepped against the decomp; a handful of paraphrase-level defects fixed |
| Coverage | 5 | All 16 topics, every plan approach has an article (counts match `approaches`); the three plan features missing from the bridge article 1 were added |
| Lifecycle correctness | 4 | No wrong frame-position claims found; several frontmatter `lifecycle`/`hooks` values and two timing explanations corrected |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0 errors, build_indexes clean (only the category-level index/description info remains) |

## Verification performed

- Every fenced block with a source-path comment compared line by line (and for gaps without `// ...`) against `references/` and the decomp: no mismatches. Blocks labelled "adapted" read for compilability and game members.
- Every GitHub link path and line range checked to exist; decomp anchors spot-read (ScreenshotCapture, Program.OnFrame/PrepareFrame, Universe step publication, GameSaves, Popup, VersionInfo, GpuProfiler, Profiler, Sample, App.Run).
- `game_types` and backticked `Type.Member` names grepped against the decomp.
- HeadlessHarness described only as the consumer mods use it; `scripts/run-headless.ps1` is attributed to the harness repository in the only place it appears.

## Defects found

| File | Defect | Fixed |
|---|---|---|
| drive-a-running-game-through-a-file-bridge-1 | Plan features (KSArmory bridge/MCP, KSAStructures dev bridge, KSAGolf putting session) not cited; `startup:game-loaded` listed without a hook | yes |
| drive...-3 | "a button cannot start a capture" overstated (capture clears `DrawUI` only on the next `PrepareFrame`) | yes |
| take-screenshots-from-code-5 | Wrong reasoning that arming mid-UI-pass makes the pass vanish; real hazard is UI hooks stop ticking | yes |
| visual-regression overview | Approaches table lacked Lifecycle column; "KSA cannot render headlessly" contradicts HeadlessHarness | yes |
| run-unattended overview | "KSA cannot run headless" contradicts HeadlessHarness topic | yes |
| run-unattended-2 | Auto-warp/speed gotcha attributed to `SetSimulationSpeed`; the checks are in private `SetSimulationSpeedDirect` | yes |
| live-tweak (overview + article) | Unverified "assembly cannot be unloaded" | yes |
| measure-and-budget-3 / overview | 1/30 s sim cap uncited (now `App.Run` clamp to `1/MinTargetFrameRate`, default 30); "five instruments and one fix" miscount | yes |
| unit-test-mod-logic-2 | `ComputeDrag` implied to live in `VehicleProperties` (it is `PhysicsStates.ComputeDrag`) | yes |
| headless-harness-2 | `FlushDirtyDerived` described as "before the draw"; it precedes `ExecuteNextVehicleSolvers` | yes |
| headless-harness-1, harmony-3 | Harness thread claims not backed by consumer mods | yes |
| test-harmony-patches-2 | purrTTY hook is a postfix, frontmatter said prefix (hooks and techniques) | yes |
| test-harmony overview/2/3 | `HarmonyLib.PatchProcessor` in `game_types` | yes |
| run-repo-checks 1, 2, 4 + overview | `lifecycle: [thread:background]` for repo/CI-only scripts | yes |
| decompile-2 / overview | "pinned ilspycmd": script only recommends a version and prints it | yes |
| 7 overviews | repos/game_types/lifecycle not the union of their articles | yes |

`generated.by` normalised to claude-code/sonnet-5.5 on the 12 files with material rewrites; others left as is. `log.md` Update entries added to 11 topics.

## Features added

None; no uncovered reusable mechanism within this category's remit was found beyond what the plan already merged.

## Open concerns

- Unattended-scenario and bridge articles rely on KSArmory/KSAGolf code comments for some numbers (e.g. 24 warm-up frames, 14.49 vs 5.43 km); they are attributed to the mods, not independently measured.
- `event:headless-test-run`, `event:game-update` are free-form lifecycle labels (allowed by the conventions) rather than frame positions.
- Category-level `index.md` and group descriptions are the orchestrator's to generate.
