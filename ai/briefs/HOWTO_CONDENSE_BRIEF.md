# Brief: condense one category's how-to proposals to its quota

The planning pass produced about 700 topics across 16 categories; the writing phase can carry about
350. Each category is condensed to a quota by one agent before the cross-category merge. Input:
`/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/plan-parts/<category>.yml`. Output:
`/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/plan-parts/<category>.condensed.yml`, same schema
(see `ai/briefs/HOWTO_BUNDLE_BRIEF.md`, "Plan file schema"), plus the keys below. Read
`docs/content-conventions.md` (Layout, category list) first. Do not edit the input file or `content/`.

Quotas (topics): ui 32, rendering 32, flight-and-orbits 32, vehicles-and-parts 30, physics 26,
shaders 24, testing-and-tooling 22, getting-started 22, external-io 20, celestials 20, kittens 18,
camera 18, persistence 16, assets 16, patching 18, audio 10. A category may end up to 2 under its
quota, never over.

## How to condense

1. **Fold, do not drop.** Every feature id that appears in any approach of the input must still appear
   in some approach of the output (the merge step checks this). When folding topic B into topic A,
   add B's approaches to A (merge approaches that cite the same features; otherwise append and
   renumber), union `related`, union `game_types`/`lifecycle`/`engine_pointers`, and list B's slug in
   A's `merged_from`. If B's problem is really a sub-step, say so in the note of the approach that
   absorbs it so the writer gives it a section.
2. **What to fold first:** single-approach topics whose feature is already an approach elsewhere;
   "understand X" background topics (fold into the how-to that needs X, keep at most 2 `kind: reference`
   topics per category and only when readers need them standalone); near-synonym topics; topics
   whose summary is a variant of another's (keep the general one, make the variant an approach or a
   note); micro-topics that would produce an article under about 120 lines.
3. **What to keep separate:** distinct modding problems a reader would search for by name; topics
   with 2+ genuinely different approaches; anything the user named explicitly as an example of what
   the corpus must teach (drawing lines on the sky, interesting ImGui windows, wheel physics, adding
   models and textures, adding or modifying shaders, physics-safe timing, mod skeleton and loader).
4. **Cross-category duplicates:** do not resolve them here (other categories are condensed in
   parallel). Instead add `dedupe_with: [<category>/<slug>, ...]` on a topic when you know a sibling
   part proposed the same problem (the planners' reports flagged many: world-to-screen projection in
   ui/rendering/camera; draw while HUD hidden in ui/patching/getting-started; share types between
   mods in getting-started/external-io; take screenshots in camera/rendering/testing-and-tooling; hot
   reload and offline shader checks in shaders/testing-and-tooling; command bridges in
   external-io/testing-and-tooling; and so on). Grep the sibling files' slugs to find them.
5. Keep slugs and titles generic (no mod names), kebab-case, imperative titles. Renaming a kept topic
   is fine when the merged scope needs it; record the old slug in `merged_from`.
6. Order the topics so foundational ones come first (what other topics list in `related`).

Validate with a script: YAML parses; topic count within quota; slugs unique; every feature id in the
input appears in the output; every `related` slug resolves to a slug in this output or in another part
(plain or condensed) or is `game-loop-and-lifecycle`. Return at most 150 words: before/after counts,
the folds you were least sure about.
