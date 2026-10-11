# Brief: merge the per-category how-to proposals into the final plan

Sixteen planning agents each proposed topics for one category in
`/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/plan-parts/<category>.yml`, and a condensing pass then
folded each to a quota in `<category>.condensed.yml` (read the condensed files as your input; the raw
files are only for tracing `merged_from`). Condensed topics carry `dedupe_with` hints naming sibling
topics that cover the same problem; honour them (schema: see
`ai/briefs/HOWTO_BUNDLE_BRIEF.md`, section "Plan file schema"). They worked mostly independently, so the
union has cross-category duplicates, slugs in `related` that were guessed, and many thin topics. Your
job is to produce the single authoritative plan `/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/howto-plan.yml`
plus a compact summary `/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/howto-plan-summary.md` for the
orchestrator (one line per topic: `category | slug | approaches | mods | merged-from`).

Read first: `docs/content-conventions.md` (Layout, category list, lifecycle vocabulary),
`ai/briefs/HOWTO_BUNDLE_BRIEF.md`, then every plan part, then skim `content/mods/*/features/index.md` so
you know what the feature pages are.

## Rules

1. **One topic per modding problem, across all categories.** When two parts propose the same problem
   (for example world-to-screen projection appears in ui, rendering and camera; drawing while the HUD is
   hidden appears in ui, patching and getting-started; share-types-between-mods appears in getting-started
   and external-io), keep ONE topic, choose the category where a reader would look first, union the
   approaches (dedupe approaches that cite the same features), union `related`, and record the dropped
   slugs in `merged_from` so the orchestrator can trace them.
2. **Fold thin topics.** A topic whose only approach is a single feature that is already an approach of
   another topic, or whose summary is a sub-step of a bigger topic, becomes a section of that bigger topic
   (append its features to the parent's matching approach or add an approach; mention the fold in the
   parent's `note`). "Understand X" background topics with no steps become `engine_pointers`/notes on
   the how-to topic that needs them, except where X is a genuine reference readers need on its own (for
   example coordinate frames and epochs, the camera mode model, the asset XML element reference); keep
   at most about 15 such reference topics corpus-wide and give them `kind: reference`.
3. **Target size: 280-340 topics total** (the condensed inputs sum to about 350), no category above 34 and none below 8. Completeness beats
   economy, but every topic must justify an article of 150-500 lines with concrete steps grounded in
   the cited feature pages.
4. **Approaches.** Number them 1..N in the order a newcomer should read (simplest or most canonical
   first). Each approach keeps `mod`, `features` (existing concept ids only, verify the files exist),
   `technique`, `note`. If several mods use the same technique with no meaningful difference, keep one
   approach that lists all their features and name the canonical mod first.
5. **Resolve every `related` slug** to a final slug, or drop it. The existing topic
   `getting-started/game-loop-and-lifecycle` (already written, do not re-plan it) is the target for all
   lifecycle/frame-order references.
6. **Slugs and titles** stay generic (no mod names), kebab-case, imperative titles. Rename when merging
   if neither original slug describes the merged topic well.
7. **Category assignment** uses the conventions' category list only. Move topics between categories
   freely when the merge makes the owner obvious.
8. **Groups.** The user asked for an extra folder layer so no directory holds dozens of entries: every
   topic gets `group: <group-slug>`, a short kebab-case noun (`overlays`, `vulkan-passes`, `decals`,
   `lights-and-particles`, `loader`, `hooks`, `dependencies`, `transpilers`, `safety`, ...). Each
   category has 3-6 groups of 3-12 topics; a group loosely aggregates tangentially related topics, it
   is a navigation aid, not a taxonomy. Add a `groups:` map per category with a one-sentence
   description per group slug (used for the group index.md). The already-written topic
   `getting-started/game-loop-and-lifecycle` must also be assigned a group (suggest `lifecycle`); report
   the group so the orchestrator moves the directory.
9. **Batches for writing.** Add `batch: <category>-<n>` to each topic, splitting any category with more
   than 22 topics into consecutive batches of at most 22 that do not split a group, ordered so that
   foundational groups come first (getting-started's loader/hooks/dependencies groups; patching's
   generic Harmony technique group; others ordered by how often other topics list them in `related`).

## Output shape

`howto-plan.yml`:

```yaml
game_loop_reference: getting-started/game-loop-and-lifecycle
categories:
  <category>:
    description: one sentence for the category index.md
    groups:
      <group-slug>: one sentence for the group index.md
    topics:
      - slug: ...
        title: ...
        kind: howto | reference
        group: <group-slug>
        batch: rendering-1
        summary: ...
        game_types: [...]
        engine_pointers: [...]
        lifecycle: [...]
        approaches:
          - n: 1
            title: ...
            mod: ...
            features: [...]
            technique: ...
            note: ...
        related: [...]
        merged_from: [slug-a, slug-b]     # slugs from plan parts folded into this topic (omit if none)
```

Validate with a script before finishing: YAML parses; slugs unique corpus-wide; every feature file
exists; every `related` entry is a final slug or `game-loop-and-lifecycle`; batch sizes <= 22 and no batch splits a group; every topic has a group that exists in its category's
`groups` map; groups hold 3-12 topics; category counts within the limits; every feature id that appeared in any plan part's approaches still appears in
some final topic (print the ones that do not, and explain each drop in your report). Return at most 300
words: final counts per category, number of topics merged, features dropped with reasons.
