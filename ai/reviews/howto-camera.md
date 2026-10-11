# Review: content/howto/camera (batch camera-1)

Reviewer: claude-code/sonnet-5.5, 2026-10-10. Game build 2026.10.10.5554, decomp at `ksa-game-assemblies/current/decomp`.

## Scores (1 to 5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Snippets and member names were clean; the defects were in prose claims (see table) |
| Coverage | 5 | All 15 topics, 52 approach articles, every plan `features` id cited, nothing dropped |
| Lifecycle correctness | 4 | Frame order and hook targets verified; three timing/exit claims were wrong and are fixed |
| Conformance | 5 | validate_bundle 0 errors 0 warnings, content_check_refs 0 errors, group indexes current |

## Mechanical checks

- 15 topics x (overview, N articles, index, log) present; `approaches` equals article count; `approach` field correct; every plan `features` id is in the article's `demonstrated_by`; all `demonstrated_by` ids exist on disk (one overview gap fixed).
- 210 fenced blocks, all with a source path comment: all verbatim and inside their stated line ranges (script comparing against the checkouts, mutation-tested).
- Every `Type.Member` named in prose exists in the decomp (script over all prose); hook targets exist with the right kind (`GameViewport.OnFrame(double)`, `FixedController.OnFrame(IViewport,double)`, Orbit/Fly `OnFrame`, `Camera.ChangeFieldOfView`/`UpdateProjection`, `IVASeat.IsCameraInThisSeat`, `KittenLocomotion.StepGrounded`, `Program.OnFrameCelestials`, `Program.OnGameLoaded`).
- Known facts confirmed: `BaseCamera` public (article 2 says so); KSAGolf `ViewClaim`/`ChaseView`/`SmoothedStep`/`ChaseOrbit` drag logic have no caller outside tests (stated in replace-6, borrow-2, chase-2, play-2); `double3.Normalize` throws on exactly zero; projection builder throws for FOV <= 0 or >= pi; KSA-CAMERAS.md viewport sections flagged stale.
- Timing agrees with the lifecycle reference: cameras move in `frame:viewports` (`GameViewport.OnFrame` = controller then `Camera.OnFrame`); `OnFrameController` only syncs cursor mode; StarMap GUI hooks run after the viewport pass and only with the HUD shown.

## Defects found

| File(s) | Defect | Fixed |
|---|---|---|
| understand overview, understand-1 | Said Map cannot be left from the keyboard; `MapController.OnKey` handles the toggle-map key back to Orbit | yes |
| understand-2 | BurstFlash step timing named only `StarMapAfterGui`; it runs from StepOnce via AfterGui, an `OnFrameCelestials` prefix (HUD hidden) and AfterOnFrame; lifecycle lacked `frame:celestials` | yes |
| understand-2 | Unsupported "map camera sits millions of metres out"; Map-mode `BaseCamera` note imprecise | yes |
| drive overview, drive-1 | "Only built-in way out of Fixed is the View menu" overstated (SetCamera console command, vehicle editor open, save load also set mode) | yes |
| drive-1 | "Within 2.6 degrees divides by zero" imprecise: only exactly parallel divides by zero, near-parallel flips roll | yes |
| drive-3 | Alert silencing mechanism unclear: direct Mode write never calls OnSwitchOn; the override matters only on the SetCameraMode fallback | yes |
| borrow-2 | Wrong timing claim that hook-time SetFollow/mode switch leaves no half-borrowed frame (SetFollow moves the camera at once; approach 1 undoes it); FOV builder throw missing; KSArmory `ViewClaim` snippet presented as KSAGolf's | yes |
| borrow-5 | "Any write takes effect next viewport pass" (not true of SetFollow) | yes |
| borrow-4, follow-3 | `TidalLocking` "only SetFollow can set it"; `ToggleTidalLocking` exists; wrong anchor for the tidal command (L213-L300 vs L1082-L1156) | yes |
| follow overview, follow-1, follow-2 | `MeanRadius` divisor attributed to FixedController/Camera; it is in `OrbitController` L602-L606; IFollowable member set not listed | yes |
| follow-2, chase-1 | Step 1 "declare constants" showed a class docstring, not the constants | yes |
| follow-5 | "Teleport never shows" overclaim; garbled lifecycle sentence | yes |
| override-2 | "GameSettings.ApplyTo sets FOV once at creation": settings Apply also resets the frame camera | yes |
| override-1, override-2 | Missing: `UpdateProjection` updates `MVP.projection` at once but `viewProjection` only in `Camera.OnFrame`; unsupported "authors re-check on every update"; "only through Glass" | yes |
| write-1 | Unsupported pixel/percent error figures presented as fact | yes (attributed to KSArmory's comment) |
| write overview | `demonstrated_by` missing `hot-pursuit-mesh-ray-placement` used by approach 3 | yes |
| chase-2 | `VelocityLocal` is a KSArmory property; hooks listed an unwired patch; overview trade-off blurred what is wired; ambiguous "approach 2" link | yes |
| first-person-1, -2 | Other-kittens caveat stated unverified/ambiguously | yes (reworded to what was checked) |
| play-3 | Hand-back claim glossed Free-camera position behaviour | yes |
| borrow-secondary-1 | Unverified "no ocean or clouds" phrased as engine fact (true by absence of passes, now tied to option flags) | yes |
| understand-1 | Wording slip "first four non-map controllers" | yes |
| replace-2, drive-3 | Alert text "Fixed Camera"; engine string is "Fixed camera" | yes |
| 22 articles | Internal "this is the plan's ... section" wording leaked into reader text | yes |
| 14 files | Bare backticked topic slugs instead of links (hide-parts..., steer-a-walking-kitten, schedule-timed-commands, etc.) | yes |
| mount-2 | Snippet started mid-signature; internal "borrowed from category" note | yes |

Counts: about 50 defect instances in 45 files; 0 left open. Changed files carry `generated.by: claude-code/sonnet-5.5`; link-only changes (slug links) were not re-stamped. Each affected topic `log.md` has an Update entry.

## Features added

None; the batch is how-to articles and no new feature concepts were warranted. No catalog edit was needed (`ai/catalog/batches/camera-1.yml` still matches the files).

## Open concerns

- Readability: several articles do not state the expected log line or visible result for a successful install (for example replace-1 has the log text only inside the snippet); not rewritten.
- Statements sourced only from mod comments (gatOS in-game revalidation pending, KSArmory's 0.007 degree residual, KSAGolf's 8.33/25 ms pacing) are reported as the mod's, not independently measured.
- Part-level claims about secondary feeds omitting ocean/clouds/particles rest on reading `RenderViewport`; not tested in game.
- Category-level `content/howto/camera/index.md` is out of date (ignored per the brief; orchestrator regenerates).
