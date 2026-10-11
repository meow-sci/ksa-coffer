# Orchestration status (ksa-coffer knowledge extraction)

Orchestrator: Claude Fable 5.1 session. Started 2026-10-10 (UTC). This file is the recovery point if
context is compacted: phases, per-mod status, and where artifacts live.

## Artifacts

- Conventions: `docs/content-conventions.md` (lifecycle vocabulary lives there)
- Briefs: `ai/briefs/MOD_BUNDLE_BRIEF.md`, `ai/briefs/HOWTO_BUNDLE_BRIEF.md`, `ai/briefs/REVIEW_BRIEF.md`, `ai/briefs/REPOS.md`
- Catalogs: `ai/catalog/<mod-slug>.yml` (per mod), `ai/catalog/howto-plan.yml` (phase 2), `ai/catalog/howto-status.yml`
- Reviews: `ai/reviews/<slug>.md`
- Checker: `scripts/content_check_refs.ts`
- Bundle: `content/` (root), `content/mods/<slug>/`, `content/howto/<category>/<topic>/`

## DONE 2026-10-11T21:30Z

All phases complete: 21 mod bundles (610 features) reviewed; 309 how-to topics (1309 concepts) in 16 categories written and reviewed; cross-links (1433 feature->article, 221 related) applied; indexes regenerated; validators clean (1974 concepts, 0 errors, 0 warnings). Nothing committed (user did not ask). Open items are listed in the individual ai/reviews/*.md reports (mostly in-game-untested inferences and ModMenu, whose source is not in the corpus).

## Phases

1. Mod bundles (21 repos) -> coordinator agent per mod (opus/xhigh), then review agent (opus/xhigh)
   that verifies and fixes. Lifecycle reference article written in parallel at
   `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.
2. Pivot: orchestrator reads all catalogs, writes `ai/catalog/howto-plan.yml` (topics, approaches,
   numbering), then category coordinators write howto bundles, then reviews.
3. Cross-link mod features -> howto articles; regenerate root indexes; validate whole bundle;
   update REFERENCES.md, README.md, AGENTS.md, docs/.

## Notes

- Agent concurrency ceiling observed around 10-12 concurrent agents; coordinators that spawn tier-2 workers must cap at 1-2 workers each. Rate limit (session) hit at 2026-10-10T06:50Z and reset; three coordinators were cut off mid-write and resumed.
- Conventions lifecycle table corrected 2026-10-10T07:05Z (UpdateRenderingResources in Render; OnFrameController cursor-only; render phases interleaved; AllModsLoaded before AttachGameData).
- User instruction 2026-10-10T19:10Z: add a group folder layer `content/howto/<category>/<group>/<topic>/` (3-6 groups per category, 3-12 topics each). Conventions, merge brief and writer brief updated. The existing lifecycle reference must move to `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` with link rewrites in content/mods/* AFTER the six running reviews finish (they edit it at the old path).
- Follow-up for the final lifecycle pass: KER reviewer notes the in-flight staging recompute runs on a vehicle-solver worker while the Sequence/EngineControl gauge canvases are enabled (default on); check DeltaVMap vehicle-staged-dv-readout and AFC stage-model features describe it the same way.
- Review pass: ALL 21 done (2026-10-10T21:05Z). Lifecycle reference moved 21:05Z; final consistency review done 21:55Z (20 fixes; report ai/reviews/game-loop-and-lifecycle.md). Open vocabulary gap: no lifecycle value for constructor work after startup:all-mods-loaded (ModLibrary.Bind / AttachGameData) - consider `startup:bind` later. (kitten-engineer-redux, ksa-measuretools, realatmospheres, ohmystars, compendium, ksa-public-telemetry).
- User decision 2026-10-10: interrupted bundles are finished by fresh completion agents, not by resuming the originals. How-to phase agents must be Sonnet 5.5 / high (user instruction); reviews stay Opus 5.5 / xhigh.

## Phase 2 (how-to) status

- Planning pass: one Sonnet/high agent per category writes `ai/catalog/plan-parts/<category>.yml` (brief: `ai/briefs/HOWTO_PLAN_BRIEF.md`); orchestrator merges into `ai/catalog/howto-plan.yml`.
- Started 2026-10-10T10:30Z: ui, rendering. 10:45Z: vehicles-and-parts. 11:00Z: flight-and-orbits. rendering done (53 topics/118 approaches). 11:10Z: shaders. ui done (65/125). 11:20Z: physics. vehicles-and-parts done (56/101). 11:30Z: getting-started. flight-and-orbits done (74/131), shaders done (47/88). 11:50Z: patching, celestials. physics done (50/92). 12:00Z: camera. getting-started done (39/72). 12:15Z: kittens. celestials done (38/56), camera done (33/77). 12:40Z: persistence, external-io. kittens done (38/57).
- Plan parts done (10/16): ui, rendering, vehicles-and-parts, flight-and-orbits, shaders, physics, getting-started, celestials, camera, kittens. Running: patching, persistence, external-io. Not started: audio, assets, testing-and-tooling.
- Next: merge via `ai/briefs/HOWTO_MERGE_BRIEF.md` (opus/xhigh) -> `ai/catalog/howto-plan.yml`; then batch writers (sonnet/high) per `batch`; then per-category reviews (opus/xhigh); then final lifecycle-reference consistency review; then cross-link features->howtos, root indexes, REFERENCES.md/README/AGENTS.md.
- Reviews running at 2026-10-10T13:00Z: ohmystars, compendium, kitten-engineer-redux, ksa-measuretools, ksa-public-telemetry, realatmospheres. Session usage limit hit again at ~13:00Z; killed 6 reviews + 3 planners (no output written). Relaunched fresh at 2026-10-10T17:40Z: planners patching, persistence, external-io, audio, assets, testing-and-tooling; reviews kitten-engineer-redux, ksa-measuretools, realatmospheres, ohmystars (compendium, ksa-public-telemetry queued). audio plan done (18/31); compendium review launched 18:10Z. persistence plan done (28/59); ksa-public-telemetry review launched 18:25Z. external-io plan done (40/59). testing-and-tooling plan done (47/84). assets plan done (29/51). All 16 plan parts done (patching 30/89); totals 685 topics/1290 approaches -> condense stage added (`ai/briefs/HOWTO_CONDENSE_BRIEF.md`, sonnet/high, quotas sum ~350, outputs `plan-parts/<cat>.condensed.yml`), then merge (`HOWTO_MERGE_BRIEF.md`, opus/xhigh) reads the condensed files. Condensers launched 18:55Z: ui, rendering, flight-and-orbits, vehicles-and-parts; 19:05Z: physics. All 16 condensed (2026-10-10T20:10Z), 356 topics total; merge done 21:20Z: `ai/catalog/howto-plan.yml` 309 topics / 995 approaches / 21 batches (`ai/catalog/batches/<batch>.yml`, summary in `howto-plan-summary.md`). Lifecycle reference moved to getting-started/lifecycle/ 21:05Z.
- Batch writers (sonnet/high, no sub-agents, prompt = HOWTO_BUNDLE_BRIEF + batch file): wave 1 launched 21:30Z: getting-started-1, patching-1, ui-1, rendering-1, physics-1, vehicles-and-parts-1, flight-and-orbits-1, shaders-1, assets-1. camera-1 launched 22:00Z. physics-1 writer stopped by the safety filter after the solver group (4 topics) + 2 articles of simulate-bodies; fresh finisher launched 22:20Z for the remaining 14 topics (same pattern as KSArmory: weapons/projectile vocabulary trips the filter; frame prompts as game-mod engineering). flight-and-orbits-1 done 22:35Z (19 topics, 89 concepts; finding for the how-to review: Orbit.Inclination is measured against CCI +Z (parent pole), not the ecliptic as the AFC feature page apse-and-inclination-quick-tools / plan say; reconcile the mod page). flight-and-orbits-2 launched 22:35Z. rendering-1 done 22:50Z (19 topics, 86 concepts). rendering-2 launched 22:50Z. assets-1 done 23:05Z (16 topics, 59 concepts). celestials-1 launched 23:05Z. physics-1 done 23:20Z (18 topics, 78 concepts; NOTE physics frontmatter lacks `group` key: run a scripted pass at the end to set `group`/`category` from the path on every howto concept). physics-2 launched 23:20Z. camera-1 done 23:35Z (15 topics, 67 concepts). kittens-1 launched 23:35Z. vehicles-and-parts-1 done 23:50Z (20 topics, 83 concepts). vehicles-and-parts-2 launched 23:50Z. flight-and-orbits-2 writer stopped by the safety filter after 4/10 topics (guidance group partial, map-view group not started, nothing validated); fresh finisher launched 2026-10-11T00:05Z. getting-started-1 done 00:15Z (19 topics, 85 concepts). persistence-1 launched 00:15Z. ui-1 done 00:25Z (18 topics, 86 concepts). ui-2 launched 00:25Z. physics-2 done 00:40Z (5 topics). external-io-1 launched 00:40Z. shaders-1 done 00:50Z (22 topics, 85 concepts). testing-and-tooling-1 and audio-1 launched 00:50Z. All 21 batches launched. patching-1 done 01:15Z (15 topics, 95 concepts). How-to reviews (opus/xhigh, REVIEW_BRIEF how-to section): getting-started launched 01:15Z; rendering-2 done 01:30Z (9 topics) -> rendering review launched 01:30Z; vehicles-and-parts-2 done 01:40Z (6 topics) -> vehicles-and-parts review launched 01:40Z; celestials-1 done 01:50Z (17 topics) -> celestials review launched 01:50Z. RATE LIMIT at ~02:00Z killed 7 writers (ui-2, testing-and-tooling-1, kittens-1, persistence-1, audio-1, external-io-1, f&o-2 opus finisher) and 4 reviews (none wrote reports). User instruction 2026-10-11: continue with Sonnet 5.5 subagents for everything (reviews too). Relaunched 2026-10-11T18:00Z as Sonnet/high finishers + 4 Sonnet/high reviews. How-to reviews done: getting-started (acc 4, cov 5, life 5, conf 5; 4 fixes). patching review launched 18:20Z. rendering review done (acc 4.5, cov 5, life 4.5, conf 5; 5 fixes; note: content/mods/unscience/features/lib-iva-force-render.md still uses editor:render for a Compose patch, fix at the end). flight-and-orbits-2 finished 18:30Z (all 10 topics). Reviews launched 18:30Z: flight-and-orbits, shaders. vehicles-and-parts review done (acc 4, cov 5, life 4, conf 5; ~13 defect groups; note: ksarmory feature pages still say staging recompute needs a gauge "open" - grep content/mods for that wording at the end). physics review launched 18:50Z. persistence-1 finished 19:00Z (13 topics) -> persistence review launched 19:00Z. celestials review done (acc 4, cov 5, life 4, conf 5; 11 fixes). assets review launched 19:10Z. kittens-1 finished 19:20Z (15 topics) -> kittens review launched 19:20Z. external-io-1 finished 19:30Z (16 topics) -> external-io review launched 19:30Z. audio-1 finished 19:40Z (10 topics) -> audio review launched 19:40Z. ui-2 finished 19:50Z (ui complete, 29 topics; draw-lists topics missing from howto-status.yml, add at the end) -> ui review launched 19:50Z. patching review done (acc 4, cov 5, life 5, conf 5; 6 fixes). camera review launched 20:00Z. testing-and-tooling-1 finished 20:10Z: ALL 21 BATCHES WRITTEN. testing-and-tooling review launched 20:10Z (last of 16). Reviews done so far: getting-started, rendering, vehicles-and-parts, celestials, patching, persistence, flight-and-orbits, physics, shaders (13/16: + external-io, assets, audio, kittens; remaining ui, camera, testing-and-tooling). Final-pass notes: content/mods/unscience/features/doh-runtime-gpu-materials.md calls GpuObjectSystem.CreateObject private (it is public; doh reflects because AssetName is in an unreferenced assembly) - fix; content/mods/ksastructures/features/generated-deep-ramp.md repeats the axis-aligned collider claim contradicted by the decomp - check; KER Patch_FlightHud GameViewport vs IGameViewport is already documented in the KER bundle. lifecycle reference says FrameNumber++ is in PostRender but in 5554 it follows the PostRender call (fix row); grep content/mods for "gauge open"/"staging window" staging-recompute wording; persistence article mentions unwritten build-a-filesystem-file-picker (plain text, fine). flight-and-orbits-2 Sonnet finisher was killed by the model safeguard (general_harms) on the projectile-guidance topics; guidance group now has 6/7 topics (two without log.md), map-view group missing; Opus/high finisher launched 01:05Z for steer-by-zero-effort-miss + map-view + validation.
- After writing: per-category reviews (opus/xhigh), then `node scripts/content_crosslink.ts`, root indexes, final validation, REFERENCES/README/AGENTS/docs pipeline doc.

## Mod status

| Slug | Writer | Review | Notes |
|---|---|---|---|
| starmap | done (13 features) | | |
| kittenextensions | done (10) | | |
| shaderextensions | done (16) | | |
| mpfx | done (10) | | |
| ksa-aircrafthud | done (10) | | |
| ohmystars | done (15) | | |
| compendium | done (17) | | |
| kitten-engineer-redux | done (13) | | |
| ksa-measuretools | done (17) | | |
| ksa-public-telemetry | done (17) | | |
| ksaero | done (9) | | |
| realatmospheres | done (21) | | |
| ksa-deltavmap | done (19) | | |
| ksacars | done (32) | | |
| ksagolf | done (32) | | |
| ksastructures | done (22) | | |
| purrtty | done (35) | | |
| ksa-advancedflightcomputer | done (59; completed by fresh agent) | | |
| gatos | done (44) | | |
| ksarmory | done (80; completed by fresh finisher) | | |
| unscience | completion agent running (fresh opus/xhigh, 2026-10-10T07:20Z) after rate-limit cutoff | | |
| (howto) game-loop-and-lifecycle | done (overview + 4 articles) | | |
