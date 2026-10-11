---
name: add-mod
description: >-
  Add a new KSA mod repository to the ksa-coffer corpus: check it out under references/, record it,
  write and review its content/mods bundle and catalog, and fold its features into the how-to
  articles. Use when the user asks to add, analyze or onboard a new mod or reference repo.
---

# Add a mod to the corpus

Goal: a new reviewed bundle `content/mods/<slug>/`, a catalog `ai/catalog/<slug>.yml`, and its
reusable features cited by how-to articles, with every validator clean. Slug = repo folder name
lower-cased with `_` replaced by `-`.

Read before starting (do not skim the rest of the repo):
- `AGENTS.md` sections "instructions" and "maintaining the corpus" (step 4 and step 9 are this task).
- `docs/content-conventions.md` (layout, frontmatter pins, lifecycle vocabulary, refresh-safe citations).

## Steps

1. **Check out** with full history: `git clone <url> references/<RepoName>` (folder = GitHub repo name).
2. **Record**: `node scripts/references_check_refs.ts`. Confirm the new entry in `data/references.yml`
   has the right `license` and that `attribution/` gained its license file.
3. **Confirm the gap**: `node scripts/content_refresh_plan.ts` must list the repo under
   "NEW MOD, no content/mods bundle". Nothing else should be pending; if it is, run the
   `refresh-data` skill first.
4. **Write the bundle**: spawn one coordinator subagent with `ai/briefs/MOD_BUNDLE_BRIEF.md` for this
   repo (Opus at xhigh for engine research; it may use 1-2 tier-2 workers if the repo is large).
   Give it the repo name, slug, path and pinned ref (`data/references.yml`). It writes the bundle and
   `ai/catalog/<slug>.yml`, whose `ref:` becomes the triage baseline.
5. **Review the bundle**: spawn an independent subagent with `ai/briefs/REVIEW_BRIEF.md` for
   `content/mods/<slug>`. Do not skip this; reviews found 10-30 defects per bundle in the initial build.
6. **Fold into how-tos**: `node scripts/content_refresh_plan.ts --coverage` lists the new feature pages
   no how-to cites. For each, pick the matching topic in `ai/catalog/howto-plan.yml`
   (`ai/catalog/howto-plan-summary.md` is the quick index) and add an approach, or add a new topic in the
   right `<category>/<group>`. Write the articles with subagents using `ai/briefs/HOWTO_BUNDLE_BRIEF.md`
   (Sonnet at high effort), then review with `REVIEW_BRIEF.md` (how-to section). Skip features that are
   too mod-specific to teach anything; say so in your report.
7. **Finish**:
   ```bash
   node scripts/content_crosslink.ts && node scripts/content_howto_related.ts
   python3 .claude/skills/okf/scripts/build_indexes.py content
   python3 .claude/skills/okf/scripts/validate_bundle.py content   # 0 errors, 0 warnings
   node scripts/content_check_refs.ts content                      # 0 errors
   node scripts/references_build_md.ts
   node scripts/content_refresh_plan.ts --check                    # exit 0
   ```
   Add the mod to the "References" list in `README.md`, a `**Creation**` line to `content/mods/log.md`,
   and an `**Update**` line to each touched how-to topic's `log.md`.

Report: feature count, how-to topics extended or added, anything left unverified.
