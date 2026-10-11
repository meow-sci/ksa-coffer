# Brief: critical review of an OKF bundle (verify and fix)

You are an independent, adversarial reviewer. A bundle under
`/Users/asherwin/repos/meow-sci/ksa-coffer/content/` was just written by another agent. Your job is to
make it correct, complete and conformant, and to say exactly what you changed. You have full tools:
read the mod checkout under `references/`, the decompiled game at
`/Users/asherwin/repos/meow-sci/ksa-game-assemblies/current/decomp/`, and the conventions at
`/Users/asherwin/repos/meow-sci/ksa-coffer/docs/content-conventions.md` (read it first; also
`ai/briefs/REPOS.md` and, for the deliverable definition, `ai/briefs/MOD_BUNDLE_BRIEF.md` or
`ai/briefs/HOWTO_BUNDLE_BRIEF.md`).

## What to verify (all of it)

1. Mechanical conformance. Run and make clean:
   ```bash
   cd /Users/asherwin/repos/meow-sci/ksa-coffer
   python3 .claude/skills/okf/scripts/validate_bundle.py <bundle-dir>
   node scripts/content_check_refs.ts <bundle-dir>
   python3 .claude/skills/okf/scripts/build_indexes.py <bundle-dir> --check
   ```
2. Snippets. Open every fenced code block that claims a source path and compare it with the checkout.
   Fix any that are paraphrased, truncated without `// ...`, or from the wrong file or lines. Fix the
   line anchors in links where they are wrong.
3. Engine claims. For every game type, member, attribute, XML element or shader binding named in the
   body or in `game_types`, grep the decomp or `current/Content/` and confirm it exists and does what
   the text says. Correct or remove anything that does not hold.
4. Lifecycle and timing. For every `lifecycle`/`hooks` value and every `## Lifecycle and timing`
   section, confirm the hook target exists, the patch kind is right, and the stated frame position
   matches `Program.OnFrame` / `PrepareFrame` / `RenderGame` / `Universe` and
   `StarMap.Core/Patches/ProgramPatcher.cs`. Wrong timing claims are the most damaging defect in this
   corpus; be strict.
5. Coverage. Independently survey the repo (see the discovery checklist in the mod brief) and list
   reusable mechanisms that have no feature concept. Add the missing feature concepts yourself,
   following the conventions, and add them to the catalog YAML. Also remove or merge concepts that are
   not actually distinct features.
6. Quality. Descriptions are one sentence and specific; titles are self-descriptive; `category` is one
   value from the list; `techniques` and `game_types` are accurate; `## See also` links resolve;
   headings start at `##`; no `# Citations`; footnotes match `sources[].id`; no prose that only
   restates the README without code grounding; the overview's feature table matches the files on disk.
7. Catalog consistency (`ai/catalog/<slug>.yml` or `ai/catalog/howto-plan.yml` as applicable): ids match
   files, categories and lifecycle match the frontmatter, `howto_topics` are generic (not tied to the
   mod name) and complete.

## How to fix

Edit in place. Preserve the original author's `generated` block unless you change content materially,
in which case set `generated` to `{ by: claude-code/opus-5.5, at: <now UTC> }`. Never add `verified`.
Regenerate indexes with `build_indexes.py <bundle-dir>` after adding or renaming files, and add a
`**Update**` entry to the bundle's `log.md` describing the review changes. Do not touch files outside
the bundle directory and its catalog file.

## Report

Write `/Users/asherwin/repos/meow-sci/ksa-coffer/ai/reviews/<bundle-slug>.md` with: a score 1-5 for
accuracy, coverage, lifecycle correctness and conformance; a table of defects found (file, defect,
fixed yes/no); features added; open concerns you could not resolve. Return to the orchestrator a summary
of at most 250 words: the four scores, counts of defects fixed, concepts added, and unresolved concerns.

## How-to bundles (additional checks)

When the bundle is a how-to batch or category under `content/howto/`, the deliverable definition is
`ai/briefs/HOWTO_BUNDLE_BRIEF.md` and the plan excerpt `ai/catalog/batches/<batch>.yml`. Also verify:

1. Every topic in the batch exists at `content/howto/<category>/<group>/<slug>/` with `overview.md`
   (type Game Feature, `approaches` equal to the number of articles) and the articles named per the
   conventions (`<slug>.md` for one approach, `<slug>-N.md` otherwise); each group has a generated
   `index.md`; each topic has `log.md`.
2. `demonstrated_by` ids exist on disk, and the article actually walks the mechanism those feature
   pages describe (no drift into generic advice); every step has code grounded in the cited mod or
   clearly labelled `// adapted from <path>`; adapted code uses only game members that exist in the
   decomp.
3. `## Lifecycle and timing` agrees with the lifecycle reference
   (`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`) and the cited feature pages;
   the frontmatter `lifecycle`/`hooks` match the body.
4. The overview's approaches table matches the articles; trade-offs are specific, not boilerplate.
5. Coverage: every approach in the plan excerpt has an article; every `features` id in the plan is
   cited by the article for that approach; nothing in the plan was silently dropped.
6. Readability for the target reader (a C# developer new to KSA): prerequisites stated, expected log
   output or visible result stated, failure modes named.

Report scores and defects the same way; write the report to `ai/reviews/howto-<batch>.md`.
