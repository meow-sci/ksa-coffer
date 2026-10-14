# Independent review: Blasto how-to integration

Reviewed 2026-10-13 by `codex/gpt-6` against `ai/catalog/batches/add-blasto.yml`, Blasto commit `21f7657c42534774001acabcf93289e9412c5242`, StarMap commit `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, and KSA build `2026.10.10.5554` at `935a32b4dbc34cbcd16e87d16cf9732eb90030c0`.

Scope: seven new articles and their topic overview/log/index files; existing approach articles and central catalogs were not changed. All 12 Blasto features in the batch are demonstrated by the assigned approaches. The new terrain-material topic has one unnumbered article; the six existing topics retain every previous approach link and their repository union.

## Scores after corrections

| Dimension | Score |
|---|---:|
| Accuracy | 5/5 |
| Coverage | 5/5 |
| Lifecycle correctness | 5/5 |
| Conformance | 5/5 |

These scores describe source-grounded documentation, not live game acceptance.

## Defects fixed

| File | Defect | Fixed |
|---|---|---|
| `write-worker-thread-safe-solver-patches-7.md` | “Completed epochs” could imply each bubble committed successfully. Added the distinction between global epoch publication and per-bubble readiness, including the possibility that a captured sample survives a later bubble failure, with direct native citations. | Yes |
| Worker-patch topic `overview.md` | Still described six approaches and universally forbade allocations; the decision table omitted the new worker-to-main-thread queue. Updated to seven, distinguished module versus derivative cadence and documented the commit-acknowledgement limitation. | Yes |
| `save-mod-state-with-the-scene-4.md` | “Atomic replacement” overpromised rollback of store replacement under every failure. Specified validation-before-clear, invalid/duplicate-input preservation and the separate allocation-failure limit; preserved the existing warning that native saves and sidecars are not one atomic transaction. | Yes |
| `blend-persistent-marks-into-terrain.md` | “Footprints within 5 km” did not explain why centers beyond 5 km remain eligible. Specified intersection with the range using effective radius times anisotropy. | Yes |
| `spawn-particle-effects-4.md` | Retirement guidance omitted the global particles setting: native emitter updates return early while disabled, pausing retirement countdowns. Added this explicit ownership caveat. | Yes |
| Settings-window topic `overview.md` | Description and introduction still counted six approaches. Updated both to seven and included live tuning, persistence and diagnostics. | Yes |
| `unit-test-mod-logic-without-game-6.md` | Test and shader invocation prose omitted ready-to-use project/argument forms. Added exact invocation examples while retaining attribution of upstream results and all runtime limits. | Yes |
| Source excerpts across all seven articles | 27 excerpts began or ended inside larger declarations/control flow without explicit omission markers. Added boundary elisions while preserving every quoted source line and existing line-range header. | Yes |

Eight defect groups were corrected, comprising seven semantic/readability corrections and 27 excerpt-boundary corrections. No concepts or additional approaches were required.

## Evidence and checks

All 40 sourced article snippets were compared verbatim with their pinned checkout line ranges before adding elision markers. Direct source review covered capture/drain and reset ownership, terrain intersections and ocean policy, detached store and save codec, native load/save behavior, the private render contracts and shader transformation, emitter spawning/retirement, settings/input hooks, and the portable test/shader/package tools.

Critical lifecycle checks were confirmed directly: renderer rebuilds occur inside `Program.PostRender` after submission and screenshot work; native particle callbacks run synchronously from main-thread `Program.OnPreRender`; worker samples are consumed after native joins/apply and before the next dispatch; destructive UI clearing joins before changing generations. Native-save success does not make sidecar publication atomic with the save. Offline tests and shader checks do not prove live rendering or synchronization.

Per-topic indexes regenerated and checked. The seven topic scopes contain 41 concepts and pass OKF validation with zero errors/warnings; scoped reference checks pass with zero errors/warnings/stale entries. All 12 planned Blasto feature IDs are covered. Only owned topic files and this report were retained as review changes.

## Open concerns

No unresolved documentation defects. No new game-runtime, managed harness, release-build or GPU execution is claimed by this review. The articles explicitly retain the upstream 0.1.3 appearance/manual-entry/particle-performance acceptance gap. The worker queue's lack of per-bubble success acknowledgement is an upstream behavioral limitation, now documented; its feature page was referred to the parent reviewer for the matching correction.
