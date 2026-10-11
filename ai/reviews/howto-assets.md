# Review: how-to category assets (batch assets-1)

Scope: `content/howto/assets` (16 topics, 4 groups, 59 concepts: 16 overviews and 43 articles) against `ai/catalog/batches/assets-1.yml`, the pinned mod checkouts under `references/`, the decompiled game (build 2026.10.10.5554) and `current/Content/Core`. The reviewed KittenExtensions bundle was the authority for the patch pipeline. Reviewer: claude-code/sonnet-5.5.

## Scores (1-5)

| Dimension | Score | Notes |
|---|---|---|
| Accuracy | 4 | Snippets are verbatim and the engine claims largely hold; the defects were over-claims or paraphrased mod comments, all fixed |
| Coverage | 5 | All 16 topics and 43 approaches exist; every plan `features` id is cited; overview `demonstrated_by`, `game_types`, `lifecycle` and `repos` are now the union of the articles |
| Lifecycle correctness | 4 | One wrong enum-binding timing and four frontmatter lifecycle values that did not match the bodies, all fixed |
| Conformance | 5 | validate_bundle 0 errors and 0 warnings, content_check_refs 0, build_indexes --check clean for the bundle and for each group (only the category-level index description warning remains, as instructed) |

## Verification performed

- Every fenced snippet that claims a path and line range was compared line by line with the checkout, including the game, mod, StarMap and README sources. No paraphrased or wrong-file snippet was found. The repeated `tools/validate-parts.py` path exists in several repos; each snippet was matched to its repo.
- The 65-element `AssetBundle` table, the `TextureCategory` and `TextureManifest` keys, `Mod`/`ModLibrary` call order, `XmlLoader`, `Mod.GetPath`, `Gltf2Reference`, `PbrMaterialReference`, `PartTemplate`, `PartModel` render paths, registries and `ModLibrary.Get<T>` versus `TryGet<T>` were checked against the decomp. The three-channel rule was checked on all four render paths (`PartModel`, `PartModelDynamic`, `PartModelGlass`, `StaticObjectModel`).
- Patch pipeline points confirmed against the KX bundle and code: `PrepareAll` prefix, disabled mods still imported, `LoadEditorTags` and `LoadPlanetRandomHeightmaps` bypass the redirect, `ModManifest.Save` dropping `debug = true`, `KittenExtensionsContinued` id for the flag, and the operation semantics attributed to the README because the XPathPatch submodule is not checked out.

## Defects found and fixed

| File | Defect | Fixed |
|---|---|---|
| xml-patching/patch-game-xml-data-2 | Said gauge XML is bound "before LoadAll loads Gauges.xml". The `Action` enum name is resolved in `GaugeButtonFlightComputer.OnDataLoad`, which runs during `LoadAll` (not in preload); text now says so and names the `unknown enum type` log | yes |
| xml-patching/patch-game-xml-data-1 | Unpatchable-files gotcha omitted the editor-tag bypass and the random-heightmap disk read; a "silent no-match" claim was stated as fact | yes |
| xml-patching/xpath-xml-patch-recipes-1, patch-game-xml-data-1, validation/debug-xml-patches-1, -2 | "Path matches nothing is silent / not an error" is not documented by the README or KX code (executor not checked out); hedged and pointed at the stepper | yes |
| validation/debug-xml-patches-2 | "applied=0 and no failures means paths matched nothing" is wrong: `applied` counts completed operations, and the summary only lists files with at least one completed or failed operation | yes |
| validation/debug-xml-patches-1, -2 | Three snippets ended mid-block without an elision (`DebugEnabled`, `WriteSummary`, the stepper buttons) | yes, widened to whole blocks |
| xml-patching/xpath-xml-patch-recipes-1 | `debug = true` step did not name the `KittenExtensionsContinued` entry or that the game's manifest save drops the flag | yes |
| xml-patching/xpath-xml-patch-recipes-3 | Venus note: system id is `Sol` (not `SolSystem`) and `SolSystem.xml` only has `LoadFromLibrary`; README's lowercase `id` typo in the Merge result unflagged | yes |
| xml-patching/redirect-game-xml-loading-2 | Step 6 told the reader to prepare data "before step 1 runs" | yes |
| xml-patching/redirect-game-xml-loading-4 | StarMap `BeforeMain` order called plain manifest order; a mod with an unloaded required dependency is delayed | yes |
| asset-xml/register-custom-xml-asset-type-1 | Claimed MPFX and ShaderExtensions carry "this exact" `Attributes.cs`; they declare the same classes in their own files (ShaderExtensions adds `Sx*` attributes) | yes |
| asset-xml/register-custom-xml-asset-type-2 | Attributed the `XmlAttributeOverrides.Add` catch to KX having overridden `AssetBundle.Assets`; the real cause is several asset types sharing `ShaderEx.XmlBindings` | yes |
| asset-xml/resolve-asset-ids-and-mod-relative-paths-1 | Repeated KSArmory's comment that the loader keeps the first of a SubPart and mesh with one name without noting the separate `AllParts` and `AllMeshes` registries | yes |
| asset-xml/ship-and-share-data-files-between-mods-1, -4, -2 | Frontmatter `lifecycle` listed values the body does not use (`startup:immediate-load`, `frame:draw-ui`); parts-now's `OnImmediateLoad()` takes no argument and never runs; -2 lacked its `StarMapAfterGui` hook | yes |
| models-and-textures/export-glb-from-blender-for-ksa-4 and overview | "A static object's colliders are boxes, axis-aligned": the decomp supports boxes, capsules, cylinders, spheres and convex hulls with `Collider2Asmb` rotations in one `BigCompound`. Now stated as KSAStructures' own choice | yes |
| models-and-textures/import-glb-models-at-runtime-3 and overview | `frame:prepare` in lifecycle; the code runs from `StarMapBeforeGui` (`frame:draw-ui`) | yes |
| models-and-textures/declare-gltf-and-pbr-material-assets-3 | NaN-tangent explanation had no engine citation; added `cotangent_frame` in `SharedFrag.glsl` (used by `MeshIndirect.frag`) | yes |
| validation/find-z-fighting-and-degenerate-uvs-in-glb-1 | "0.2 mm bucket, coarser than an 8 mm skin" (copied from the script's comment) is backwards | yes |
| validation/validate-asset-xml-references/overview | "A material missing one texture channel takes the game down" is true only for part and static-object paths | yes |
| validation/validate-asset-xml-references-2 | Six `tools/validate-parts.py` snippets from three repos had identical headers; now prefixed with the repo and the example list names the repo | yes |
| validation/validate-asset-xml-references/overview, -3 | Unrelated `game_types` (`PhysicalAtmosphereReference`, `AtmosphereRenderer`) | yes |
| Bundle-wide | Approaches tables and cross references used the topic title as link text for every numbered article; now each article's own title | yes (55 files) |
| Bundle-wide | 16 italic `(slug)` placeholders for topics that now exist, plus `add-or-change-a-stock-gauge-button` (never written) | yes, linked; the missing slug points at `work-with-stock-cockpit-gauges` |
| Bundle-wide | About 50 C# and XML snippets ended or began mid-block with no `// ...` | yes, elision markers added |
| Six overviews | `lifecycle`, `game_types` or `demonstrated_by` not the union of the articles | yes |

## Features added

None. This was a how-to review; the mod feature bundles are outside the allowed scope.

## Open concerns

- Operation semantics (empty selection, `Remove` versus `Delete`, `Step Over` and `Step Out`) rest on the README because the XPathPatch submodule is not checked out.
- The RealAtmospheres Core XML redirect conflicts with KittenExtensions by code (the swapped absolute path is not a key in the KX document, so `XmlPatcher.Load<T>` returns null silently). This is documented in redirect-1, -2 and -4 as untested in game.
- Mod-bundle pages outside this scope repeat the static-object "axis-aligned colliders" claim (KSAStructures `generated-deep-ramp`); it should be softened there.
- AFC declares `ModId = "KittenExtensions"`, while the Continued fork installs as `KittenExtensionsContinued`; the optional dependency may never match. Documented, not tested.
- `XmlAttributeOverrides.Add` throwing on a second add for the same member is inferred from ShaderExtensions' try/catch, not exercised.
- Many claims about stock texture formats (BC7 KTX2) are the mods' own comments; Core texture binaries are not in the checkout.
