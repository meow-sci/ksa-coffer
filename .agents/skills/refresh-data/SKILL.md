---
name: refresh-data
description: >-
  Refresh the ksa-coffer corpus after reference mods or the decompiled game assemblies changed:
  fetch checkouts, plan the refresh deterministically, triage changes, re-pin unaffected pages,
  review only pages whose cited code changed, and triage new upstream code and game builds. Use when
  the user asks to refresh, update, re-sync or check the data for bitrot.
---

# Refresh the corpus

Goal: every page pinned to current checkouts with its claims still true, at the lowest cost. Scripts
do all detection and mechanical rewriting; agents only judge real code changes. The authoritative,
detailed procedure is `AGENTS.md` section "maintaining the corpus"; read it once, then follow this.

## Steps

1. **Fetch and record**
   ```bash
   node scripts/references_pull.ts                 # fix anything flagged "!" before continuing
   node scripts/references_check_refs.ts --update
   ```
2. **Plan**: `node scripts/content_refresh_plan.ts --out ai/refresh/plan.md --json ai/refresh/plan.json`.
   Read only `ai/refresh/plan.md`. If every count is zero and every section says `none`, report
   "corpus current" and stop.
3. **Drift**: a repo with no bundle is a new mod (use the `add-mod` skill after finishing here). A bundle
   with no repo entry gets `status: deprecated` on its overview plus a log line.
4. **Triage changes, cheapest first** ("Review work, grouped by change", most-cited first). For each
   `h-`/`f-` id read the diff shown; if it cannot change what the listed pages claim (logging,
   profiling, comments, version strings, unrelated branches), record it:
   `node scripts/content_refresh_plan.ts --benign <id>,<id>`, then add a short reason after each id in
   `ai/refresh/triage.yml`. When unsure, leave it for review. Do not open pages during this step.
5. **Re-pin**: `node scripts/content_refresh_plan.ts --repin`, then
   `node scripts/content_check_refs.ts content --quiet` (0 errors; "stale" = pages still in review).
6. **Review the rest**: re-run step 2, then dispatch remaining review pages to subagents with
   `ai/briefs/REFRESH_BRIEF.md` (Sonnet, high effort; about 15-25 pages per agent, batched by repo or
   change id). Each finishes a page with `--accept content/<page>.md`. Afterwards re-read the how-tos the
   plan lists under "depending on reviewed features".
7. **New upstream code and game builds**: for each repo under "Untriaged upstream changes", decide
   whether any path is a new reusable feature (if so run `ai/briefs/MOD_BUNDLE_BRIEF.md` scoped to those
   paths, then `REVIEW_BRIEF.md`, then add how-to approaches as in `add-mod` step 6), then
   `--ack <RepoName>`. For "Game builds since the game baseline", read the changelog, update the
   lifecycle reference or how-tos only if an engine change warrants it, then `--ack game`.
8. **Finish**: run the finish block from `AGENTS.md` step 10 (crosslinks, indexes, validators,
   `references_build_md.ts`), add `**Update**` lines to touched `log.md` files and one summary line to
   `content/log.md`. Done when `node scripts/content_refresh_plan.ts --check` exits 0.

Never hand-edit pins, anchors or snippet headers; `--ack` only after triage. If a page is `unknown`,
fetch full history in that checkout and re-plan.

Report: pages re-pinned, changes marked benign, pages reviewed and fixed, features added, builds acked.
