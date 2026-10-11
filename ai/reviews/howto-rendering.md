# Review: how-to category rendering (batches rendering-1 and rendering-2)

Scope: `content/howto/rendering/` (5 groups, 28 topics, 100 articles, 28 overviews, 128 concepts). Reviewer: claude-code/sonnet-5.5, 2026-10-10. Checked against build 2026.10.10.5554 decomp, the pinned `references/` checkouts and `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` (the render-phase authority).

## Scores (1-5)

| Axis | Score | Note |
|---|---|---|
| Accuracy | 4.5 | All 461 path-labelled snippets are verbatim; engine members, line anchors and numeric claims held up except three small defects below |
| Coverage | 5 | All 28 topics, every plan approach has an article, every plan `features` id is in `demonstrated_by` and cited in the body |
| Lifecycle correctness | 4.5 | Frame positions match the lifecycle reference everywhere checked; one vocabulary misuse fixed; hook lists were incomplete in 16 articles |
| Conformance | 5 | validate_bundle 0 errors / 0 warnings; content_check_refs 0 errors; build_indexes `--check` clean except the category-level `index.md` (ignored as instructed) |

## Method

- Scripts (scratchpad): plan vs disk (slugs, article names, `approaches`, per-article `approach`, plan features cited, `demonstrated_by` ids exist, required headings, overview approach table vs files); verbatim snippet comparison against the checkout (line order and claimed range); every backticked identifier and every `Type.Member` pair looked up in decomp, Content and mod checkouts; every `hooks` target looked up; frontmatter hooks vs the body's lifecycle section.
- Read end to end: draw-lines-on-the-sky (headline), project-world-positions-to-screen (all 6), choose-a-render-frame 1-3, free-vulkan-resources-safely (all), submit-your-own-vulkan-commands overview/1/2, insert-a-custom-pass (all 5), build-a-vulkan-pipeline (all 3), capture-rendered-frames (both), handle-renderer-rebuilds 1, add-dynamic-lights (all 3), control-part-light 1-3, spawn-particle-effects (all 3), keep-vessels (all 4), draw-world-space-lines-and-gizmos 1. Every `## Lifecycle and timing` section in the category was read.

## Headline topic: draw-lines-on-the-sky

Read both articles against `content/mods/ohmystars/features/sky-overlay-lines-and-labels.md` and the OhMyStars sources. Verified: sphere radius 19.5 (`Mod.LoadStarBinaries`, `InstancedStarTechnique.AddInstance`), ecliptic conversion and the 0.036 arcsec constant difference, `Camera.EclToEgo`/`OnFrame`/`EgoToScreen` behaviour and anchors, `DrawGalacticGrid` (2 degree pieces, NaN skip, viewport origin, `skygrid`), `StarMapAfterGui` = postfix on `OnDrawUiViewports` inside `if (DrawUI)` (ProgramPatcher), draw list consumed at RenderGame step 25 after the composite, hidden-HUD recipe, `HUDFullscreenWindow` collision with KSA_AircraftHUD, grid segment-count table, `showRaDecGrid` default, `ImColor8`/`AddLine`/`AddText` extension signatures used by the adapted code. No content defects. Only the generated `index.md` was stale; regenerated.

## Defects found

| File | Defect | Fixed |
|---|---|---|
| lights-and-particles/add-dynamic-lights-to-the-world/-1.md, -2.md | Said `WriteForwardLights` keeps "the top 8" per viewport; code keeps 8 only for clustered (main) viewports and `clamp(2000000/(w*h),1,16)` for forward-mode camera windows | yes |
| vulkan-passes/submit-your-own-vulkan-commands/-2.md | Claimed same-queue submit order guarantees the result is ready for the scene; no semaphore or barrier links them. Reworded to "in practice" and pointed at the render-pass dependency gotcha | yes |
| meshes/hide-parts-or-subparts-from-rendering/overview.md, -4.md | `editor:render` used for Compose patches that run in `UpdateRenderingResources` (`frame:render`); conventions reserve `editor:*` for patches on the editor entry points. Removed; `generated.by` set to sonnet-5.5 | yes |
| 16 articles (free-vulkan-resources-safely-2, upload-an-image-1, paint-vessel-parts-1/2, replace-a-game-texture-1/3, project-decals-1, capture-rendered-frames-1, draw-a-textured-quad-1, render-imgui-into-a-texture-1, modify-hdr-scene-2, grow-game-gpu-buffers-2, draw-exhaust-plumes-4, project-world-positions-4, draw-markers-5, handle-renderer-rebuilds-3) | Frontmatter `hooks` omitted hooks the body's lifecycle section relies on (`GameViewport.OnFrame` prefix, `StarMapAllModsLoaded`, `StarMapBeforeGui`, `StarMapAfterOnFrame`, `OnDrawUiConsole` prefix, `ExecuteNextClothSolvers` prefix) | yes |
| overlays/draw-lines-on-the-sky/index.md | Generated index stale vs concept descriptions | yes (regenerated) |

Topic `log.md` files carry an `**Update**` entry for each change. Not defects (checked): the snippet range hits that looked off by a few lines (`Camera.cs L339-L355`, others) were checker artefacts; ranges are correct.

## Features added

None; the task is a how-to review and the plan is fully covered.

## Open concerns

- Unverifiable from source: that submitting a mod command buffer ahead of the frame without a barrier is synchronization-validation clean (the articles hedge this); the single-float-store atomicity claim in control-part-light-5 (marked as inference); gatOS' 0.81 degree cone-dimming analysis (attributed to the mod).
- Mod feature pages (out of scope, not edited): `content/mods/unscience/features/lib-iva-force-render.md` carries the same `editor:render` lifecycle value on Compose patches.
- Category-level `index.md` is out of date (ignored per instructions).
- Overview `lifecycle` differs from the plan excerpt in 5 topics (overview is the more accurate in each); left as is.
- Not every sentence of every article was read; remaining unread bodies (control-part-light 4-5, draw-exhaust-plumes 1-5 prose beyond the lifecycle and engine background, draw-markers 1-5, hide-parts 1-6 prose, modify-hdr 1-3, remaining texture topics) were covered by the automated checks and the lifecycle-section read only.
