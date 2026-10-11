---
type: Guide
title: Knowledge extraction pipeline
description: How the mod bundles and how-to articles under content/ were produced and how to refresh them when a reference mod or the game changes
tags: [process, pipeline, refresh, agents]
generated: { by: claude-code/opus-5.5, at: 2026-10-11T22:30:00Z }
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

Refreshes are incremental and mostly mechanical. The full procedure, with exact commands, is the
"maintaining the corpus" section of `AGENTS.md`; this section explains why it is cheap.

- `scripts/references_pull.ts` fast-forwards every reference checkout and the game assemblies (and
  clones or unshallows as needed); `scripts/references_check_refs.ts --update` records the new
  commits and any new checkout in `data/references.yml`.
- `scripts/content_refresh_plan.ts` reads every concept's pins and cited line ranges, diffs each cited
  file from its pin to HEAD, ignores decompiler noise, and classifies each page as current, repin
  (cited code unchanged: rewritten mechanically with remapped anchors), review (a real hunk overlaps
  a cited range) or unknown (pinned commit missing locally). In a simulated one-build game update
  (2026.10.7.5541 to 2026.10.10.5554) file-level matching would have sent 1,268 pages to review;
  range-level matching sent 367, grouped into 88 distinct changes, and marking a dozen frame-loop
  profiling hunks benign moved 208 of those to repin. Of the 8,068 anchors remapped, every one
  pointed at identical code afterwards, apart from ranges that correctly grew to include the
  inserted benign lines.
- Review work is grouped by change (`h-` hunk or `f-` file id), so each change is judged once.
  Changes judged irrelevant are recorded in `ai/refresh/triage.yml` (`--benign`); the remaining
  pages go to agents with `ai/briefs/REFRESH_BRIEF.md`, who finish each with `--accept`.
- New upstream code that no page cites is reported per mod against a triage baseline (`ref:` in
  `ai/catalog/<slug>.yml`), and each new game build's changelog against `ai/catalog/game.yml`.
  Baselines move only with `--ack` after triage, so the signal is never lost between runs.
- New mods appear as inventory drift (a recorded repo with no bundle) and go through the phase 1
  briefs; their features reach how-tos through `--coverage` and the how-to brief.

Progress and decisions of the original run are recorded in the status tracker.[^status]

[^conventions]: Content bundle conventions
[^status]: Orchestration status tracker
