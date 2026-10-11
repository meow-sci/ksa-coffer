# Review: content/howto/physics (batches physics-1 and physics-2)

Reviewer: claude-code/sonnet-5.5. Scope: 23 topics, 5 groups, 92 concepts. Checked against decomp build 2026.10.10.5554, the pinned mod checkouts under `references/`, and the lifecycle reference.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Snippets verbatim; engine claims largely exact; a handful of overstatements fixed |
| Coverage | 5 | All 23 topics and every plan approach have articles; one plan feature citation added |
| Lifecycle correctness | 4 | Known race/thread facts already present and consistent; three windows overstated, now fixed |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0 errors, build_indexes --check clean (category index excepted) |

## Defects

| File | Defect | Fixed |
|---|---|---|
| 78 files | `group` frontmatter key missing (`category` was present in 78 of 92; all had it after check) | yes |
| sample-the-ground-1 (+ overview, -2, -3 links, index, log, physics-2.yml title) | Titled "from the worker window", but the sampling runs in the main-thread `PrepareWorker` prefix | yes (retitled "in the PrepareWorker prefix") |
| sample-the-ground-1, simulate-bodies-5 | "Only TerrainImpactFinder passes `accurate: false`"; `Camera.IsVisibleTo` and `LocationReference.DrawUi` do too (default is true in 5554, confirmed) | yes |
| sample-the-ground overview, mutate-registry-1, mutate-vehicles-2 | Shapes registry called writable at "the one moment"/"only place"; it is writable whenever no vehicle step runs (also `PrepareWorker`, input drain, handoff) | yes |
| mutate-vehicles overview | Teleport listed under window 2 with no mention of the nearest-orbit race; "all workers idle" misleading | yes |
| mutate-vehicles-3 | "every worker joined" at the handoff; the nearest-orbit job is still running | yes |
| mutate-vehicles-4 | `VehicleSolver.Wait()` presented as a sufficient barrier for `Vehicle.Teleport`; nearest-orbit job not joined | yes (inferred-race caveat added) |
| run-your-own-bepu | Said `ExecuteNextVehicleSolvers` "runs inside the physics step"; it is the main-thread dispatcher | yes |
| add-static-colliders overview and -1 | `BeginStaticObjectPass` attributed to `FullPhysicsStepUntil`/"each substep"; it is called in `FullPhysicsConstrainedStep` per contact pass (L2220) | yes |
| ray-cast overview | Duplicate `demonstrated_by` id | yes |
| ray-cast-1 | Implied KSAGolf hull test is live; it has no caller at f3e6ab72 | yes |
| weld-1 | Plan feature `garrys-torch-weld-animation-and-presets` not cited | yes |
| 12 files | Non-existent `game_types`: `KSA.BodyTemplate`, `KSA.Kinematic`, `KSA.SubPart`, `KSA.PhysicsFrameHook` | yes |
| 11 overviews | `lifecycle` not the union of article values; write-worker and simulate-bodies overviews missed a `demonstrated_by` id / KSACars repo pin | yes |
| place overview | "top of PrepareFrame" for `ApplyInputEvents` | yes (wording) |

Generated block set to claude-code/sonnet-5.5 on 30 materially changed files; an `**Update**` entry added to all 23 topic logs.

## Known facts, verified

- KSAGolf `ContactSweep.TryStrike` and `HullTest.Shared` have no caller (grep of src and tests); stated in four articles, now five.
- gatOS teleports from an `ExecuteNextVehicleSolvers` prefix: the nearest-orbit job is queued at Program.cs L2196-L2201, before the dispatch; gatOS never waits on it (only unscience joins). Marked inferred everywhere it appears.
- KSACars samples terrain in the main-thread `Vehicle.PrepareWorker` prefix (`Universe.PrepareVehicleWorkers`); `PrepareWorker` ends with `PrepareFromVehicle`.
- `accurate` defaults to true on every overload in 5554.
- All snippets with a path header match their pinned ranges; all decomp links resolve (a few anchors are off by one line, left as is).

## Features added

None. No reusable physics mechanism without a concept was found in the survey beyond what these topics cover.

## Open concerns

- Rail/gotchas statements marked "inferred" (nearest-orbit race for gatOS teleports and welds, unscience-style joins) are not observed in game.
- Category-level `content/howto/physics/index.md` is not yet generated (orchestrator task).
- A few decomp line anchors in prose links start or end one line off (e.g. `TerrainPatch.cs` L517-L524, `IParentBody.cs` L60-L64); content is correct.
- The mod comment in gatOS `IvaPhysicsManager.cs` repeats the "inside the physics step" mistake; the article corrects it.
