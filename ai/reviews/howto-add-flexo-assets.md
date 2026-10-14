# Flexo asset how-to review

Reviewed 2026-10-13 by `codex/gpt-6`, independently of the article author. Scope: the seven approaches assigned by `ai/catalog/batches/add-flexo-assets.yml`, their topic overviews/logs/indexes, and this report. Existing sibling articles were preserved.

Source pins: Flexo `e804879abfc1d45ca1c174a9c95c5fded58c1bf2`; KSA build `2026.10.10.5554` at `935a32b4dbc34cbcd16e87d16cf9732eb90030c0`. No existing repository or game pins were changed.

## Scores after corrections

| Dimension | Score |
|---|---:|
| Accuracy | 5/5 |
| Coverage | 5/5 |
| Lifecycle correctness | 5/5 |
| Conformance | 5/5 |

## Defects and corrections

Paths below are relative to `content/howto/`.

| File | Defect | Fixed |
|---|---|---|
| `assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md` | Resource guidance implied authored tank contents. The current Tank model and serializer carry geometry, wall material, owner frame, RoleAffinity and MagneticTrap; native contents belong to runtime/save data. Replaced the claim and cited both contracts. | Yes |
| Same article and its overview metadata | The assigned mass/resource mechanism had no concrete power serialization instructions. Added tank dimensions/units and battery Wh-to-joule conversion, generator/solar production, consumption and switch fields; added a verbatim power excerpt and native schema sources/types. | Yes |
| `assets/asset-xml/author-part-colliders-and-convex-hulls/author-part-colliders-and-convex-hulls.md` and overview | “Reject” suggested that collider severity `block` prevents delivery. The current ExportKsaDialog still enables ZIP/folder delivery and offers “Export anyway”. Explained the advisory policy and the separate hard gate an adapter would need. Also stated the actual raw-size threshold. | Yes |
| Same collider article | Claimed the browser decoder rejects a zero-volume hull. It checks whether the generated position buffer is empty; that is not an independent numeric volume check. Narrowed the claim. | Yes |
| `vehicles-and-parts/parts/add-crew-seats-and-eva-doors/add-crew-seats-and-eva-doors-3.md` | Axis-conversion step quoted only an unfinished comment. Replaced it with the real `seatAxesFromRotation` function, corrected the inverse-conversion range, and explained that the parser drops degenerate seats with a console warning. | Yes |
| `vehicles-and-parts/parts/define-and-animate-subparts/define-and-animate-subparts-5.md` | “Missing members” overstated shared clip diagnostics. They detect joints without members, cross-clip membership and bad solar targets; they do not detect every dangling ordinary member ID. Added the separate placement-ID check and missing-leaf export behavior. | Yes |
| `rendering/lights-and-particles/add-dynamic-lights-to-the-world/add-dynamic-lights-to-the-world-4.md` | The DisableInIva behavior was too vague to safely author a switchable lamp, and the recipe omitted switch creation. Explained its IsActive bypass, per-IVA suppression, PowerConsumer flags/units, behavior without a switch, and advisory diagnostics. | Yes |
| `vehicles-and-parts/parts/add-crew-seats-and-eva-doors/overview.md`; `vehicles-and-parts/parts/define-and-animate-subparts/overview.md` | Approach comparisons omitted required technique/lifecycle columns. Added those columns from the actual article metadata while preserving existing links and descriptions. | Yes |

Eight correction groups; no concepts or features added. Two new topics and five extended topics remain as planned. All eighteen assigned Flexo feature IDs are present in the intended articles and their overviews.

## Verification

- Compared every original source snippet against its pinned checkout: all 43 matched before editing. Compared the final 44 snippets, including the added power excerpt and replacement seat excerpt: all match exactly.
- Inspected browser code for XML preservation, built-in variants, instance-scoped feeds, transform order, multi-part packaging and folder overwrite behavior; model normalization, mirrored winding, procedural surfaces, separate picking meshes and mesh-name repair; KTX2 encoding, channel conversion, painting and emissive compositing; collider ownership/dimensions/coverage; seat basis conversion; light ownership and activation; and animation import, rest anchors, fitting and LINEAR baking.
- Checked the associated native contracts in the decompiled game and shader sources. Browser phases remain `tool:authoring`/`tool:build` with empty hooks. Native consumption is explained separately from browser execution.
- Ran scoped OKF validation across all seven topic bundles: 29 concepts, zero errors or warnings.
- Ran `content_check_refs.ts` across the same scope: 29 concepts, zero errors, warnings or stale pins.
- Regenerated each topic index and ran index `--check`: zero out-of-date indexes.
- Checked article counts, assigned feature coverage, overview repo unions and final snippet text. Added a dated review Update entry to each topic log.

No browser interaction, native package installation, game execution, or visual/performance test was performed. The documentation explicitly preserves that boundary.

## Remaining limitations and central metadata follow-up

No unresolved documentation defect remains in the owned scope. Upstream limitations remain documented: advisory preflight, sampled collider coverage, unsupported source-model behavior, scalar native emission, discarded cubic tangents/STEP approximation, and the dense scale-only animation fitter defect. Native visual and behavioral validation is still required for an actual asset package.

The parent owns central planning artifacts. Reported two alignment updates: add `curve-fitting` to the Flexo animation approach’s plan/batch techniques, and add `KSA.Tank`, `KSA.BatteryTemplate`, `KSA.PowerConsumerTemplate` to the composition topic’s game-type planning metadata. The parent was also notified of the same tank-contents overclaim in the separately owned Flexo feature page.
