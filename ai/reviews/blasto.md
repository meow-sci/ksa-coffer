# Blasto independent review

Reviewed 2026-10-13 by `codex/gpt-6` against Blasto commit `21f7657c42534774001acabcf93289e9412c5242` and KSA commit `935a32b4dbc34cbcd16e87d16cf9732eb90030c0` (build `2026.10.10.5554`). This was an independent source review after the authoring agent handed over the bundle.

## Scores after corrections

| Dimension | Score | Evidence |
|---|---|---|
| Accuracy | 5/5 | Checked production source, game members, shader transforms, save boundaries and all 18 quoted snippets |
| Coverage | 5/5 | Twelve distinct features cover the delivered runtime, pure core, controls, persistence, shader validation and packaging mechanisms |
| Lifecycle correctness | 5/5 | Verified worker capture/apply ordering, main-thread particle spawning, render buffer upload, both rebuild windows and shutdown ownership against decompiled callers |
| Conformance | 5/5 | Thirteen concepts; scoped OKF and reference validation clean; catalog and generated indexes consistent |

## Defects corrected

| File | Defect | Fixed |
|---|---|---|
| `features/owned-surface-dust-emitters.md` | Lifecycle omitted native emitter spawning in `Program.OnPreRender`; the upstream comment suggests a worker even though the pinned engine invokes the spawn callback synchronously on the main thread | Yes: added the pre-render phase, call-chain explanation and exact game citations |
| `features/owned-surface-dust-emitters.md` | Handle-retention explanation did not distinguish the source snippet's “fenced cleanup” wording from native frame-count-based delayed reclamation | Yes: documented `TryUnregisterEmitter` and its `MaxFramesInFlight` countdown without claiming an emitter-specific fence |
| `features/private-terrain-pipeline-swap.md`, `features/unsigned-vulkan-limit-validation.md`, overview and catalog | Runtime rebuild coverage only named `frame:prepare`; `Program.PostRender` also calls `RebuildRenderer` after frame submission and screenshot handling | Yes: added the second phase, native call-site citation and synchronized metadata |
| `features/private-terrain-pipeline-swap.md` | Exact-version rejection was insufficiently distinguished from later private-pipeline failure | Yes: documented that registration failure tears down the complete Blasto initialization, while later build failure retains native terrain for that renderer |
| `features/worker-nozzle-exposure-handoff.md`, `features/terrain-plume-intersection.md` | “Upward-facing” or “pointing away” overgeneralized the actual ray rejection threshold | Yes: stated the outward radial dot-product threshold of 0.12 and preserved grazing/cone behavior |
| `features/persistent-exposure-site-store.md` | Claimed both dose and exposure were bounded, though the implementation rejects negligible dose and bounds stored exposure | Yes: stated the actual acceptance and saturation behavior |
| `features/terrain-material-shader-injection.md` | GLSL quoted from a C# raw string was fenced as C# | Yes: retained exact source text and changed the fence language to GLSL |
| `ai/catalog/blasto.yml` | UI feature repeated `Blasto.GameMod/Mod.cs` in `key_paths` | Yes: removed the duplicate |

Eight defect groups fixed; no concepts added, removed or merged. All existing snippets were exact before review and remain exact afterward. New source citations support the additional lifecycle explanations; no pins or existing line anchors were remapped by hand.

## Coverage audit

Surveyed the repository's production C#, project/manifest files, portable harness, packaging and shader-validation scripts, release notes and integration documentation. Worker queue handoff, radial probing and biome response, exposure indexing and stable seeds, private pipeline swaps, descriptor/buffer packing, material shader transformation, unsigned GPU limits, native dust ownership, save-sidecar integrity/recovery, scene cleanup, ImGui controls and portable validation all have feature concepts. The hidden copied KSA/Harmony/ImGui reference skills are upstream development aids rather than additional mechanisms implemented by Blasto. Historical future-work plans are not represented as delivered features.

## Validation

- `python3 .claude/skills/okf/scripts/validate_bundle.py content/mods/blasto`: 13 concepts, 0 errors, 0 warnings.
- `node scripts/content_check_refs.ts content/mods/blasto`: 13 concepts, 0 errors, 0 warnings, 0 stale.
- `python3 .claude/skills/okf/scripts/build_indexes.py content/mods/blasto --check`: clean after scoped regeneration.
- Independently compared all 18 source-labelled snippets against their exact line ranges; no mismatches.
- Compared all catalog feature ids, titles, categories, lifecycle lists, hooks, techniques and game types with page frontmatter; all agree.

## Open concerns

No unresolved documentation defects. Live 0.1.3 appearance, ImGui manual-entry behavior, native dust behavior, GPU synchronization under real multi-view workloads and performance remain unverified. The reported 33/33 portable checks and six shader validations are upstream evidence, not new runtime execution during this review. Scores assess source-grounded documentation, not live product acceptance.
