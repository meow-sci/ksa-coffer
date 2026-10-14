# Independent review: Flexo workflow how-to integration

Reviewed 2026-10-13 by `codex/gpt-6` against `ai/catalog/batches/add-flexo-workflows.yml`, Flexo commit `e804879abfc1d45ca1c174a9c95c5fded58c1bf2`, and KSA build `2026.10.10.5554` at `935a32b4dbc34cbcd16e87d16cf9732eb90030c0`.

Scope: seven assigned articles and their topic overview/log/index files. Existing approach articles, mod bundles and central catalogs were not edited. All 14 planned features are demonstrated. The three new topics have one unnumbered article each; the four existing topics retain their previous approach links and the repository union of their articles.

## Scores after corrections

| Dimension | Score |
|---|---:|
| Accuracy | 5/5 |
| Coverage | 5/5 |
| Lifecycle correctness | 5/5 |
| Conformance | 5/5 |

These scores describe documentation checked against source, not execution or native game acceptance.

## Defects fixed

| File | Defect | Fixed |
|---|---|---|
| `design-engine-game-data.md` | Background overstated the requirement for instance-specific parent-feed wiring. Native resolution prefers scoped wiring but permits an unscoped fallback. Corrected that distinction. | Yes |
| `design-engine-game-data.md` | Aggregation guidance omitted scope and multiplier differences. Added explicit placement references, SubPart template instance counts, the minimum count for an unplaced design, and the unmultiplied legacy first-pair view. | Yes |
| `design-engine-game-data.md` | Grain authoring lacked actionable input constraints and the browser/native validation difference. Added solid reaction and pressure requirements, scoped feed deduplication, normalized grain-table rules and dimensional conversion, and the browser's filtering of non-finite rows versus native rejection. | Yes |
| `persist-user-created-presets-and-content-7.md` | Archive verification could imply that Undo history travels in the portable archive. Clarified that new archive imports start empty stacks; local IndexedDB reopening can restore separate histories, and fresh edits can verify per-part Undo isolation. | Yes |
| `persist-user-created-presets-and-content-7.md` | “Rejects incompatible stored formats” omitted the destructive boot behavior. Explained that incompatible or malformed local projects trigger deletion attempts for records and asset blobs, with no migration. | Yes |
| Persistence topic `overview.md` | The seventh approach row was below the selection bullets rather than inside the table; the introduction still counted six and shared runtime timing with the browser approach. Repaired the table, count and timing scope, and added the browser choice to the selection guidance. | Yes |
| Static-placement topic `overview.md` | The introduction still said a mod had two placement routes after adding offline asset authoring. Limited that sentence to runtime approaches while retaining the new asset route. | Yes |
| Source excerpts across all seven articles | 25 partial excerpts omitted surrounding declaration/control-flow context without explicit markers. Added boundary elisions without changing quoted source lines or line-range headers. | Yes |

Eight defect groups were corrected: seven semantic/readability groups and 25 excerpt-boundary corrections. No concepts or approaches were added during review.

## Evidence and checks

Compared all 36 sourced article snippets verbatim against their pinned source ranges. Checked every planned feature ID, approach count and prior article link, and the topic overviews' repository unions. Reviewed the two adapted clutter XML fragments separately against current native declarations: top-level `MeshAtlas` and `GroundClutterMaterial`, a full `ClutterObject` with required `Atlas` and five LODs, ID-only LOD mesh/material references, and an ecotype object reference.

Direct semantic review covered engine scope and reaction/nozzle calculations, liquid/RCS/solid candidate construction, grain feed resolution and numerical limits; bind-pose geometry, normals, socket transforms and texture dependencies; project/part isolation, chain evaluation, debounced local writes, archive adoption and non-atomic blob/document publication; browser scheduling, shader adaptation, command/mode routing and embed state; prepared asset serving, fixture refresh, export tests, smoke checks and thumbnail fingerprints; static coordinates, collision scaling, separate GameData and global body registration; and the legacy clutter generator's schema, random-selection and object-count mismatches.

The documented workflow stays in `tool:authoring` and/or `tool:build` with empty hooks. Kitten baking remains a static bind-pose path. Browser preview results are distinct from native rendering, physics and resource supply. Tooling requires an already prepared private asset tree; no absent extraction implementation is presented as available. The generator's extra spare biases the current selector, and five LODs limit an ecotype to 51 objects. No claim is made that unchanged legacy output works in the pinned game.

Per-topic indexes regenerated and checked. All seven topic scopes, containing 29 concepts, pass OKF validation with zero errors, warnings or information findings. Scoped reference checks report zero errors, warnings, stale entries or information findings. All indexes are current. Only assigned topic files and this report were retained as review changes.

## Open concerns

No unresolved documentation defects. No Flexo unit suite, browser session, generator output, shader or native game load was executed for this review. Numerical preview accuracy, static collider approximations and the adapted clutter package still require the separate acceptance checks stated in the articles. The grain-parser filtering difference was also sent to the parent, who corrected the corresponding feature page for consistency.
