# Review: how-to category vehicles-and-parts (batches vehicles-and-parts-1 and -2)

Reviewer: claude-code/sonnet-5.5, 2026-10-10. Scope: 26 topics, 109 concepts under `content/howto/vehicles-and-parts/`, checked against the pinned mod checkouts under `references/`, the decomp (build 2026.10.10.5554) and the lifecycle reference.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Every fenced snippet matched its checkout verbatim; engine members and line anchors held up. Defects were in prose around timing, a game type name and two plan features |
| Coverage | 5 | All 26 topics, all plan approaches have articles, overviews count correctly; two plan features were uncited and are now cited |
| Lifecycle correctness | 4 | One real wrong-frame claim and several places that missed the default-UI worker recompute; all fixed |
| Conformance | 5 | validate_bundle 0 errors 0 warnings, content_check_refs 0 errors, build_indexes --check clean except the category-level index |

## Method

- Mechanical: all fenced blocks with a path header resolved against the checkout (contiguous, verbatim, in the stated line range, including multi-range headers); every GitHub blob link range checked against file length; every backticked `Type.Member` in prose grepped in the decomp; `hooks` and `game_types` grepped; plan-vs-article feature citations; footnote labels vs `sources[].id`.
- Manual: read the lifecycle section, background and gotchas of every article and overview, and verified the load-bearing claims in `Program.PrepareFrame`, `Program.OnFrame`, `PhysicsBubble.RunVehiclePostWorkInner`, `SequencePerformanceList`, `PartTree.EnsureResourceManagersBuilt`, `VehicleUpdateTask.Run`, `InputEvents`, `ModLibrary`, `VehicleEditor`.

## Defects found

| File | Defect | Fixed |
|---|---|---|
| staging-and-engines/stage-a-vehicle-from-code/stage-a-vehicle-from-code-2.md | Lifecycle said the staged request executes in "the same frame's" dispatch; a request made in `frame:draw-ui` or any StarMap hook waits for the next frame's `Vehicle.PrepareWorker` prefix | yes |
| same file | Plan feature `ksarmory/fly-another-vehicle` not in `demonstrated_by` or cited | yes |
| stage-a-vehicle-from-code-1.md, -2.md, overview.md | Worker-recompute hazard described as "when the staging window or gauge is open"; the `Sequence` and `EngineControl` canvases start enabled, so the worker walks the live `SequenceList` every step by default. Article 1 now says the unguarded `ActivateNextSequence` overlaps that walk | yes |
| vehicles/change-vehicles-without-racing-the-solver-5.md | Plan feature `ksarmory/per-part-store-mass` not cited; same conditional-gauge wording | yes |
| vehicles/take-control-of-another-vehicle-2.md | Same conditional-gauge wording | yes |
| change-vehicles-...-6.md, -7.md, modules-and-resources/refill-or-drain-resources-3.md | "SetDirty refreshes delta-v" stated flatly; in flight with the default canvases the worker recomputes every step, `SetDirty` matters to `IsDirty`/`RecomputeIfDirty` readers and `HasUnsavedChanges` | yes |
| vehicles/scale-a-vessel-or-its-parts-at-runtime/overview.md and -4.md | `lifecycle` value `editor:pre-render` is not in the vocabulary; `Editor.OnPreRender` runs inside `Program.OnPreRender`, so `frame:pre-render`. `game_types` listed `KSA.ScaleGizmo`, which is a field of type `GenericGizmo`, not a type | yes |
| vehicles/spawn-a-vehicle-at-runtime-2.md | Table said the drone joins a bubble at the next `ApplyVehicleSolvers`; it is assigned in the next dispatch (`VehicleUpdateTask.Run` -> `AssignOrphanVehicles`) | yes |
| staging-and-engines/read-staged-delta-v-from-the-game-4.md, modules-and-resources/add-parts-to-a-live-vessel-3.md | Said the `ResourceManager` getter "may build managers on the UI thread" without the in-flight consequence; added that `PrepareFrame` flushes first and a post-dispatch edit makes the draw-time rebuild race the worker | yes |
| add-parts-to-a-live-vessel-2.md | Said the in-flight worker is unaffected until the next frame while the build forces a UI-thread rebuild; now points at article 1's known-risk paragraph | yes |
| 11 link anchors in 9 files (Decoy.cs, FireLadder.cs, FrameLatch.cs, SavedPartReference.cs, PartIdentitySnapshot.cs, ManualControlInputs.cs, XmlLoader.cs, CoreEditorTagsGameData.xml, mod.toml, SubPartGameDataReference.cs) | Whole-file `#L1-Ln` ranges ran past the end of the file | yes |
| ai/catalog/batches/vehicles-and-parts-1.yml and -2.yml | Topic `lifecycle` lists differed from the overview frontmatter for 8 topics; `editor:pre-render` | yes |
| ai/catalog/howto-plan.yml | `editor:pre-render` for the scale topic | yes (one value) |

False positives checked and left alone: `[^1]` in `scale-...-1.md` is C# `_originals[^1]` inside code; the `# ` lines in `define-a-part-with-game-data-1.md`, `-2.md` and `ship-ready-made-craft-1.md` are comments inside fences; `KSA.MeshReference.<HostPrimitives>k__BackingField` is a legitimate reflection target.

## Features added

None. Reusable mechanisms in the cited mods map onto existing topics; no feature or topic was removed or merged.

## Open concerns

- `ai/catalog/howto-plan.yml` still carries the original `lifecycle` and `game_types` starting points for the 8 topics whose batch excerpts were synced (it is shared across categories, so only the one wrong value was edited).
- `anchor-to-parts-across-vehicle-changes-4` and `customize-parachute-materials-and-limits-2` use `editor:draw-ui` for code that runs inside the editor's draw pass without a patch on `VehicleEditor.OnDrawUi` itself; the convention text is strict about "via a patch on them". Left as is, as it is defensible and the body explains it.
- `add-parts-to-a-live-vessel-1` documents a real unguarded UI-time part-tree swap against a running worker as a "known risk"; the article does not give a tested settled-window recipe.
- The mod feature pages for `fly-another-vehicle` and `prepareworker-prefix-command-window` say the recompute happens "with the gauge open" without noting the default; they are outside this bundle.
