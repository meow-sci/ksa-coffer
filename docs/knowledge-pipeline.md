---
type: Guide
title: Knowledge extraction pipeline
description: How the mod bundles and how-to articles under content/ were produced and how to refresh them when a reference mod or the game changes
tags: [process, pipeline, refresh, agents]
generated: { by: claude-code/fable-5.1, at: 2026-10-10T21:40:00Z }
status: stable
sources:
  - id: conventions
    resource: content-conventions.md
    title: Content bundle conventions
  - id: status
    resource: ../ai/STATUS.md
    title: Orchestration status tracker
---

The corpus under `content/` was produced in two phases by an orchestrating agent and tiers of
subagents, using the briefs under `ai/briefs/`. Every page records the exact reference commit and game
build it was checked against, which is what makes incremental refreshes possible.[^conventions]

## Phase 1: mod bundles

1. One coordinator per reference repository (`ai/briefs/MOD_BUNDLE_BRIEF.md`) surveyed the checkout,
   verified every engine claim against the decompiled game, and wrote `content/mods/<slug>/`
   (overview, one page per reusable feature, sub-mod pages for monorepos) plus a machine-readable
   catalog `ai/catalog/<slug>.yml` listing each feature with its category, lifecycle, hooks and the
   generic how-to topics it could teach. Large repositories split the work across tier-2 workers.
2. An independent reviewer per bundle (`ai/briefs/REVIEW_BRIEF.md`) re-verified snippets, engine
   members and lifecycle claims, added missing features, synced the catalog and wrote
   `ai/reviews/<slug>.md`. Reviewers also corrected the shared lifecycle reference whenever a bundle
   contradicted it.
3. The game loop reference `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` was
   written first from the decomp and then hardened by every reviewer.

## Phase 2: how-to articles

1. Planning: one agent per category clustered the catalog suggestions into topics
   (`ai/briefs/HOWTO_PLAN_BRIEF.md`, output `ai/catalog/plan-parts/<category>.yml`), a condensing
   pass folded each category to a quota (`HOWTO_CONDENSE_BRIEF.md`, `<category>.condensed.yml`), and a
   merge agent resolved cross-category duplicates, assigned groups and batches, and wrote the
   authoritative `ai/catalog/howto-plan.yml` (`HOWTO_MERGE_BRIEF.md`; summary in
   `howto-plan-summary.md`; per-batch excerpts under `ai/catalog/batches/`).
2. Writing: one agent per batch (`HOWTO_BUNDLE_BRIEF.md`) wrote each topic as a sub-bundle
   `content/howto/<category>/<group>/<topic>/` with an overview and one article per approach, citing
   the feature pages as primary sources and the checkouts and decomp as ground truth.
3. Review per batch, then `scripts/content_crosslink.ts` added See-also links from feature pages to
   the articles that cite them, and `scripts/content_howto_related.ts` linked topics to their
   `related` topics.

## Refreshing after an update

1. Update the checkout under `references/` (or the game assemblies) and run
   `node scripts/references_check_refs.ts --update` to record the new commit.
2. Run `node scripts/content_check_refs.ts content --stale`: every page whose `repos[].ref` or
   `game.ref` no longer matches is listed. Those pages (and the catalog entries behind them) are the
   re-analysis set; pages that cite only unchanged repos need nothing.
3. Re-run the mod coordinator brief for the changed mod with a scope limited to the listed pages, then
   the review brief, then regenerate `REFERENCES.md` (`node scripts/references_build_md.ts`) and the
   indexes (`python3 .claude/skills/okf/scripts/build_indexes.py content`).
4. How-to articles cite feature pages through `demonstrated_by`; re-check the articles whose
   `demonstrated_by` includes a re-analyzed feature.

Progress and decisions of the original run are recorded in the status tracker.[^status]

[^conventions]: Content bundle conventions
[^status]: Orchestration status tracker
