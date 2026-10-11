# Review: content/howto/getting-started (batch getting-started-1)

Reviewer: claude-code/sonnet-5.5, 2026-10-10. Scope: 19 new topics (19 overviews + 61 articles) in the groups
loader, lifecycle, dependencies and build, plus agreement with the already-reviewed
`lifecycle/game-loop-and-lifecycle` reference (treated as authority, not edited).

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Almost every claim traced to StarMap 4dc60f8, the decomp or the mod checkouts; three minor defects fixed |
| Coverage | 5 | All 19 topics, all 61 planned approach articles, every plan `features` id cited by its article |
| Lifecycle correctness | 5 | No wrong timing claim found; all five enforced facts hold everywhere |
| Conformance | 5 | validate_bundle, content_check_refs and build_indexes --check clean (category index info ignored) |

## What was checked

- Structure script over the plan: topic dir, `overview.md` (type Game Feature, `approaches` equals article count),
  article naming (`<slug>.md` vs `<slug>-N.md`), `log.md`, generated `index.md`, `approach` field, required body
  sections, `demonstrated_by` ids exist on disk, every plan `features` id present in the article for that approach.
  Result: 19/19 topics, no gaps, no silently dropped approaches.
- Snippets: 214 fenced blocks that claim a source path and lines were compared line by line with the checkout
  restricted to the cited range: 0 mismatches. All `#Lx-Ly` link anchors lie inside their files (0 out of range).
  Adapted blocks are labelled.
- Engine claims: every `Type.Member` named in backticks that matches a decomp type was grepped (only mod-side or
  historical names did not resolve). Spot-verified against decomp: `Program` ctor line map (L692-L1317), `OnFrame`
  (L2238, hooks at L2267/2268), `PostRender` clearing `_vehiclesInFrame`, `ModLibrary.PrepareManifest/AddMods/PrepareAll/
  LoadAll/Find`, `Mod.TomlField` set, `LogSystem/LogCategory` drop behaviour before `IsEnabled`, `VersionInfo`
  (CompareTo order, `Master`), `EnumTypeOption.GetName`, `ConfirmMods`/`Loading`/`SelectSystem` `Environment.Exit`,
  `Constants` path getters, shipped `KSA.dll` informational version.
- StarMap behaviour re-derived from source (ModLoader, RuntimeMod, ModRegistry, ModAssemblyLoadContext, patches,
  GameSurveyer, DocumentsPathPatches): parking and release order (including the C -> B -> A single-pass quirk),
  import sets, hook binding, `DeInit`, restart flow, API surface unchanged since tag 0.3.6.

## Facts enforced (all hold in the bundle)

| Fact | Verdict |
|---|---|
| `ExportedAssemblies` never populated by StarMap | Stated consistently (mod-toml-reference, share-types 1/overview, declare-dependency 2, write-log 4); only `ImportedAssemblies` is described as effective |
| Zero-argument `[StarMapImmediateLoad]` never runs | Stated in create-minimal 1/2, choose-hook 2/4; purrTTY, gatOS, unscience template flagged as inert |
| `UnpatchAll` before `StarMapUnload`; instance-path redirect gone by then | create-minimal 1/2, how-launches 1/3, clean-up 1/overview, choose-hook 4, write-log 2/6 |
| `EntryAssembly` defaults to manifest id / folder name | mod-toml-reference, create-minimal, how-launches 1/2 (and the "table present but key missing" edge case) |
| KittenExtensions patches in a `ModLibrary.PrepareAll` prefix | choose-hook 2 (also notes the `Program.Main` prefix for assets) |

## Defects found

| File | Defect | Fixed |
|---|---|---|
| `build/deploy-a-mod-on-every-build/deploy-a-mod-on-every-build-3.md` | Gotcha claimed an unregistered mod folder "loads nothing and logs nothing". KSA adds it as a new, disabled mod (log line, enable dialog) and StarMap loads no code until the offered restart; contradicted how-starmap-launches-ksa-2 | yes |
| `lifecycle/write-a-per-mod-log-file/write-a-per-mod-log-file-6.md` | Asserted that an exception in a vehicle-worker patch "ends that worker's step for the whole physics bubble"; no handler or job-system behaviour in the decomp supports it | yes (reworded to what is verified) |
| `dependencies/declare-a-mod-dependency/declare-a-mod-dependency-1.md` | Generated `mod.toml` block was presented as a file excerpt with a source-style header although it is an illustrative generator output | yes (labelled adapted, with the generator line range) |
| `dependencies/ship-native-libraries-with-a-mod/index.md` | Topic index out of date (descriptions differed from concept frontmatter) | yes (regenerated) |

Previous reviewer's in-place fixes were present and correct as far as checked; no regression found.

## Features added

None. This is a how-to bundle; no mod feature concepts were missing for the plan.

## Open concerns (not changed)

- Link texts in about 450 intra-bundle links use the plan's approach titles (75 distinct labels), not the
  article's actual `title` (for example "Folder and manifest rules as StarMap consumes them" points at an article
  titled "Understand the mod folder, manifest and enable/ordering rules"). Links resolve; the labels are a
  consistent short-name scheme. A mechanical rewrite to real titles would be a cheap polish.
- Pure build-time articles carry `lifecycle: []` and `game_types: []` (build, deploy, CI, packaging, native and
  third-party DLL topics). Bodies say "build time only", so frontmatter and body agree; the generate-mod-toml
  article could list `startup:starmap-before-main`/`startup:asset-load` for when the file is read.
- Still `inferred, untested` in the text and not provable from source: Linux behaviour of `dotnet StarMap.dll`
  relaunch, `Tomlet` not enforcing C# `required` on `EntryAssembly`, and StarMap CI quirks in
  package-and-publish-6. They are labelled as such.
- References to not-yet-written topics (`isolate-patch-failures-and-fault-proof-patch-bodies`,
  `draw-ui-while-the-hud-is-hidden`, `measure-and-budget-mod-performance`) are plain text, not links, as required.
- The category-level `index.md` of content/howto/getting-started is out of date and lacks group descriptions
  (expected; orchestrator regenerates).
