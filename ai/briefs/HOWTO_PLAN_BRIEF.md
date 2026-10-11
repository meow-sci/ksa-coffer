# Brief: propose how-to topics for one category (planning pass)

You are planning, not writing articles. The orchestrator will merge the proposals from every category
into `ai/catalog/howto-plan.yml`, then writers produce the articles. Your output is one YAML file:
`/Users/asherwin/repos/meow-sci/ksa-coffer/ai/catalog/plan-parts/<category>.yml`.

## Inputs

- `/Users/asherwin/repos/meow-sci/ksa-coffer/docs/content-conventions.md` (category list, lifecycle
  vocabulary, techniques vocabulary; read the Layout and Lifecycle sections).
- `/Users/asherwin/repos/meow-sci/ksa-coffer/ai/briefs/HOWTO_BUNDLE_BRIEF.md`, section "Plan file
  schema": the exact shape to produce.
- Every `ai/catalog/<mod>.yml`: each feature has `category`, `summary`, `techniques`, `lifecycle`,
  `hooks`, `game_types`, `key_paths` and a `howto_topics` list of free-form suggestions. Only features
  whose `category` equals yours are in scope, plus any feature of another category whose suggested
  topic clearly belongs to yours (note it in `borrowed_from` so the orchestrator can dedupe).
- The feature pages `content/mods/<mod>/features/<feature>.md` for anything the catalog summary leaves
  unclear.

Run `python3 /private/tmp/claude-501/-Users-asherwin-repos-meow-sci-ksa-coffer/7cf72b8f-7507-457a-aef8-6d2fc633b7f2/scratchpad/dump_topics.py <category>` for a compact listing of every suggestion in your category (slug | title | mod:feature | note).

## What a good topic is

A how-to topic is a game feature or modding problem seen from the modder's side, independent of any
one mod: "draw lines on the sky", "add a part with its own GLB model and textures", "run code at a
safe point relative to the physics step", "block game hotkeys while an ImGui text field has focus".
Rules:

- Merge suggestions that solve the same problem into one topic, even when the mods named them
  differently. Where mods solve it differently, each distinct solution is an approach (numbered).
  A topic with one approach is fine. Do not invent approaches that no feature demonstrates.
- Keep the grain useful: a topic should produce an article of roughly 150-500 lines with concrete
  steps. Split a sprawling suggestion into several topics; fold trivia into a bigger topic.
- Every approach must point at at least one existing feature concept id (`mods/<mod>/features/<slug>`),
  check the file exists. Features of monorepo sub-mods are under `mods/unscience/features/`.
- Slugs: lowercase kebab-case, self-descriptive, generic (no mod names). Titles are imperative
  ("Draw lines and labels on the sky"). Summaries explain the player-visible or modder-visible outcome.
- `lifecycle` lists the vocabulary values the approaches use; `game_types` the main decomp types;
  `engine_pointers` free-text leads into `current/decomp` or `current/Content`.
- `related` lists other topic slugs (in any category) that a reader would want next; guess sensibly,
  the orchestrator reconciles names.
- Aim for completeness over economy: every reusable mechanism in your category's features should be
  reachable from some topic. Expect 8-20 topics for a small category and 20-40 for ui, rendering,
  vehicles-and-parts or flight-and-orbits.

## Output

```yaml
category: rendering
description: one sentence for the category index
topics:
  - slug: draw-lines-on-the-sky
    title: Draw lines and labels on the sky
    summary: ...
    game_types: [KSA.Camera]
    engine_pointers: [current/decomp/KSA/Universe.cs DrawGalacticGrid]
    lifecycle: [frame:draw-ui]
    approaches:
      - n: 1
        title: ImGui fullscreen window draw list from StarMapAfterGui
        mod: ohmystars
        features: [mods/ohmystars/features/sky-overlay-lines-and-labels]
        technique: imgui-drawlist
        note: ...
    related: [project-world-to-screen]
    borrowed_from: []        # feature ids from other categories you pulled in, if any
```

Write only that file. Do not touch `content/`. Return at most 200 words: topic count, approach count,
and any suggestion you deliberately dropped and why.
