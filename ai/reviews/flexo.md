# Flexo independent bundle review

Reviewed by `codex/gpt-6` on 2026-10-13 (local date), against Flexo
`e804879abfc1d45ca1c174a9c95c5fded58c1bf2` and KSA
`935a32b4dbc34cbcd16e87d16cf9732eb90030c0` / `2026.10.10.5554`.

The author handed off the completed 31-feature bundle before reviewer edits. The final bundle has
32 features and one overview. Review scope was source analysis and documentation validation; no
Flexo application build, browser session, generator execution or in-game export test was performed.
No `verified` attestations were added.

## Scores after fixes

| Dimension | Score | Basis |
|---|---|---|
| Accuracy | 5/5 | All 32 source snippets match their exact declared ranges; material, animation, physics and loader claims were checked against implementation and current game contracts; incompatible legacy output is identified explicitly |
| Coverage | 5/5 | Added the independently discovered offline clutter generator and expanded fitting, archive adoption, scaling, codecs, layered glow and incremental thumbnails within existing concepts |
| Lifecycle correctness | 5/5 | Every feature has only external `tool:*` phases and empty hooks; native game consumption is described separately from tool execution |
| Conformance | 5/5 | Scoped OKF, source-reference and generated-index checks pass; the 32-entry catalog matches feature metadata and all declared game types exist |

These scores assess the documentation against the pinned sources. They do not certify the upstream
application or its generated packages as correct at runtime.

## Defects and coverage corrections

| File | Finding | Fixed |
|---|---|---|
| `overview.md`; new `features/offline-ground-clutter-generation.md` | Overview classified ground-clutter work as proposals, overlooking the implemented 802-line Bun generator. Added its atlas, geometry and scenario pipeline, with current-build schema and selection failures | Yes |
| `features/animation-import-and-linear-baking.md` | Omitted inverse easing fitting and its approximation bounds. Added local residual gates, dense fallback, segment subdivision, rest anchoring and the scale-only constancy defect inferred directly from the fitter | Yes |
| `features/project-persistence-and-archives.md` | Omitted import modes, asset adoption, remapped references and share-link encoding. Clarified that incoming manifest digests/sizes are not verified and blob writes plus document mutation are not one transaction | Yes |
| `features/static-object-composition.md` | Scaled-collider variants lacked the rotated/nonuniform approximation and shape-normalization limits; added the game-side omission of visual scale | Yes |
| `features/material-and-ktx2-pipeline.md` | Attributed a complete mip chain to the encoder without separating image decoding/filter generation; added that boundary and glTF factor baking | Yes |
| `features/gltf-model-import.md` | Codec/sidecar limits and bind-pose handling were too implicit; added Draco/meshopt support, unwired BasisU/KTX2 input decoding, and skeletal-animation limits | Yes |
| `features/emissive-paint-and-ramp-baking.md` | Omitted the special two-piece glass/glow implementation and its kitten-only scope; added inset geometry and imported-glass limitation | Yes |
| `features/asset-pipeline-and-regression-tooling.md` | Omitted implemented incremental thumbnail pipelines; added render/asset fingerprints, orphan pruning and remembered failures | Yes |
| `features/native-asset-mod-export.md`; `overview.md`; catalog | External-tool feature lifecycle metadata included `startup:asset-load`, even though only its output is consumed there; retained `tool:build` and kept game loading in the body | Yes |
| `features/command-registry-and-mode-routing.md` | Exact snippet started with the tail of a JSDoc comment and stopped before the return; replaced with the complete dispatch function | Yes |

Total: 10 documentation defects or material coverage omissions corrected; one feature concept added.
The new ground-clutter feature also records multiple upstream compatibility defects, which were not
changed in the reference checkout.

## Independent source discovery

The review surveyed the pure XML/catalog layer, model and texture import/export, transform bridge,
procedural geometry, material encoding and painting, animation import/rig/export/fitting, engine and
solid-motor calculations, validation and wizard transactions, project storage/archive/transfer,
multi-part state, action chains, command/mode state, demand-driven rendering, both companion apps,
and build/smoke/thumbnail/generator scripts. UI widgets that expose the same underlying authoring
mechanism remain grouped rather than receiving duplicate concepts.

The independent generator discovery materially changed the compatibility conclusion. In the pinned
game:

- `ClutterObjectTemplate.OnDataLoad` rejects an authored object without `Atlas`; the generator omits it.
- LOD meshes are ID-only references, so the generator's LOD `Mesh Path` does not register geometry.
- Ecotype material lists are XML-ignored runtime collections; material declarations belong to native
  asset definitions referenced by the LODs.
- GPU object selection includes the final object, so the historical spare object is selectable and
  biases the first image's frequency.
- Five LODs still are required, and five times object count must not exceed 256.
- The shared KTX2 encoder no longer accepts a functional `srgb` option, despite the legacy caller's
  comments and extra option properties.

These are not treated as evidence that the generator was tested successfully. The concept is a stable
analysis of an implemented legacy mechanism and a basis for a current-contract audit how-to.

## Validation

- OKF validator: 33 concepts, 0 errors, 0 warnings, 0 informational findings.
- Pinned-source checker: 33 concepts, 0 errors, 0 warnings, 0 stale, 0 informational findings.
- Index regeneration and subsequent index check: clean.
- Independent exact-snippet comparison: all 32 fenced source excerpts match checkout ranges.
- Catalog audit: 32 features; title, category, techniques, lifecycle, hooks and game types match
  frontmatter; no duplicate footnote definitions; all game-type source files exist.

## Remaining limits

- Browser shader appearance, native mod installation, launch-site terrain contact, exported animation
  playback and propulsion behavior remain untested in this session. The bundle says so.
- Dense scale-only animation fitting can lose scale variation; its initial classification ignores the
  scale channel. This upstream defect is documented, not repaired.
- Archive parsing trusts declared incoming hashes. The documented deduplication path is not a data
  integrity guarantee.
- Static nonuniform collision scaling and sampled coverage are approximations; browser previews do not
  establish game collision fidelity.
- The offline ground-clutter generator needs a schema and selection update before a current-build
  compatibility claim. Its destructive regeneration is limited to documented output subdirectories;
  no generator command was run during review.
- Private catalog assets and dependencies were not installed or fetched for execution. Application
  source licensing and game asset licensing remain separate.

The original 31 slugs remain stable. The added slug is
`mods/flexo/features/offline-ground-clutter-generation`, category `celestials`, lifecycle
`tool:build`, suggested topic `exclude-or-replace-ground-clutter`.
