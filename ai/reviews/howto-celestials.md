# Review: content/howto/celestials (batch celestials-1)

Review of 17 topics (3 groups, 52 concept files) against decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`), the pinned `references/` checkouts and `current/Content/Core` XML.
A previous reviewer's in-place fixes were present and were kept.

## What was checked

- Validators: `validate_bundle` 0 errors, 0 warnings; `content_check_refs` 0 errors; `build_indexes --check`
  clean for all three groups (the category-level index is out of date, ignored as instructed).
- Snippets: all 175 fenced blocks carry a path comment; a script compared each with its checkout. All are verbatim,
  in order, inside the stated line range and contiguous (no silent gaps). Range-bounded excerpts that stop mid-function
  are exact line ranges and were left as they are.
- Identifiers: 498 backticked identifiers grepped across decomp, `Content/` and `references/`; the only miss is a prose
  fragment (`CoreLaunchPadA`, fixed below).
- Link anchors: every line-anchored link resolved and the cited lines were read against the sentence for the engine-heavy
  ones (terrain query, modifier render data, launch-pad collision, rings renderer, clutter, star binaries, orbit swap).
- Plan coverage: every plan approach has an article, every plan `features` id is cited by its article, `approaches`
  equals the article count, every topic has `log.md`, groups have generated indexes.
- Lifecycle: terrain modifier render data built once (Program constructor, after `LoadDefaultSystem`) and
  `StarMapAllModsLoaded` before `AttachGameData` both hold; `PrepareFrame` order, `OnFrameCelestials` outside the
  `DrawUI` guard, `Render` calling `UpdateShaderData`/`UpdateWorldSun`, `ClearBuckets` call sites all confirmed.

## Scores

| Area | Score | Note |
|---|---|---|
| Accuracy | 4 | Strong; five wrong or overstated engine/mod claims fixed |
| Coverage | 5 | Nothing in the plan dropped; sub-step sections present |
| Lifecycle correctness | 4 | Two timing statements corrected (Sphinx anchor, cloth worker overclaim) plus one engine claim about rebuilds |
| Conformance | 5 | Clean validators; frontmatter, sources and indexes consistent |

## Defects

| File | Defect | Fixed |
|---|---|---|
| terrain/measure-slope.../-2.md | Said the Sphinx anchor and normal are computed in the submod `Update`; the code computes them in the panel ImGui pass (`BesideControlled`, `TryCursor` from the button and armed click) and only queues entry creation to `Update` | yes (body and hooks) |
| atmospheres.../change-loaded-game-data.../-4.md | "A renderer rebuild restores stock values": the biome-material buffer is written only in the `PlanetRenderer` constructor (and its debug editor); `RebuildFrameResources` does not rewrite it. "Until the renderer is rebuilt" also wrong | yes |
| systems.../move-or-reparent.../-2.md | "No worker is running" in the `ExecuteNextVehicleSolvers` prefix; `ExecuteNextClothSolvers` has just kicked the cloth step | yes (scoped to orbit and vehicle workers) |
| terrain/exclude-or-replace-ground-clutter/-1.md | Stock pad static object named `CoreLaunchPadA`; real id is `CoreLaunchPadA_Prefab_LaunchPadA` | yes (+ source) |
| terrain/place-static-objects.../-3.md | `ClearBuckets` called "by `Program.RenderViewport` for each viewport straight before kittens"; it is called by `RenderViewport`, `RenderGame` (main) and `RenderEditor`, before kitten, parachute and seated-crew draws | yes |
| atmospheres.../define-atmospheres.../-1.md | First-person wording ("I found"); element names `Rayleigh`/`Mie` instead of `RayleighScattering`/`MieScattering` | yes |
| atmospheres.../define-atmospheres.../-3.md and overview | `lifecycle: []` / "build time" for an article whose outputs load at asset-load | yes (`startup:asset-load`) |
| atmospheres.../generate-measured.../ | Lifecycle said "main thread" without the load path; main-thread readers of the patched lookups not mentioned | yes (+ two sources) |
| systems.../bundle-and-query-a-star-catalog/overview.md | Attributed the 19.5 radius to `InstancedStarTechnique`; it is passed by `Mod.LoadStarBinaries` | yes |
| terrain/click-a-planet.../-2.md | Gotcha implied surface pins can sit on a mountain; they are resolved at `MeanRadius` | yes |
| terrain/measure-slope.../-3.md, query-terrain.../-2.md | Contact snippet stopped mid-comment with an open brace | yes (`// ...`) |

## Features added

None. No reusable mechanism in the checked areas lacked a feature concept; no concept merged or removed.

## Open concerns

- Rings articles call `Program.RebuildRenderer()` from inside the ImGui frame; the articles say it is unverified in game, and I could not verify it either.
- `lifecycle: [frame:prepare]` for save replay of rings (and `PhysicsFrameHook` handoff) rests on unscience's `PhysicsFrameHook`, whose implementation is not in the pinned checkout (only test fixtures); it matches `NativeSaveHooks` wiring.
- Mod feature pages (outside this bundle) may repeat the rebuild-restores-stock claim for the live terrain material override; not touched.
- Percentages and counts quoted from mod docs (for example 108,592 Hipparcos rows, 84 allocations per tick) were not recounted.
