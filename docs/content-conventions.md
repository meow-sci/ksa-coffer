---
type: Guide
title: Content bundle conventions
description: Layout, frontmatter, code-reference and body rules for the OKF knowledge bundle under content/ (mods and how-to articles)
tags: [okf, conventions, content, starlight]
generated: { by: codex/gpt-6, at: 2026-10-14T01:56:41Z }
status: stable
sources:
  - id: okf-skill
    resource: .claude/skills/okf/SKILL.md
    title: OKF v0.2 authoring skill
  - id: references-yml
    resource: data/references.yml
    title: Reference repository inventory
---

Everything under `content/` is one OKF v0.2 bundle whose root is `content/index.md`. It holds two
groups: `mods/` (one self-contained sub-bundle per analyzed mod or authoring-tool repository) and `howto/` (one
self-contained sub-bundle per how-to topic, grouped by category). The bundle is written so that it
can later be dropped into an Astro Starlight site with little or no change, so the rules below
serve both OKF conformance and Starlight compatibility.[^okf-skill]

## Layout

```
content/
  index.md                      okf_version: "0.2"; lists mods/ and howto/
  log.md
  mods/
    index.md                    one Subdirectories entry per mod
    log.md
    <mod-slug>/
      index.md
      log.md
      overview.md               type: Mod   (bundle root concept, carries repos + game)
      features/
        index.md
        <feature-slug>.md       type: Mod Feature
      submods/                  only for monorepos (unscience)
        index.md
        <submod-slug>.md        type: Submod
  howto/
    index.md                    one Subdirectories entry per category
    log.md
    <category>/
      index.md                  one Subdirectories entry per group
      <group>/                  loose grouping of related topics (3-12 topics each)
        index.md
        <topic-slug>/
          index.md
          log.md
          overview.md           type: Game Feature (bundle root concept, carries repos + game)
          <topic-slug>.md       type: How-To, when there is a single approach
          <topic-slug>-1.md     type: How-To, approach 1 of N (and -2, -3, ...)
```

Rules:

- `index.md` and `log.md` are reserved OKF files: no frontmatter (except `okf_version` on
  `content/index.md`). Regenerate indexes with `build_indexes.py`; never hand-edit entries.
- Every other `.md` file is a concept and must start with YAML frontmatter with a `type`.
- Slugs are lowercase kebab-case. A mod slug is the folder name under `references/` lower-cased
  with `_` replaced by `-` (`KSA_AircraftHUD` becomes `ksa-aircrafthud`, `KSA-DeltaVMap` becomes
  `ksa-deltavmap`). Feature and topic slugs are short, self-descriptive, and stable.
- A how-to topic is a game feature or modding problem seen from the feature lens, not from a mod.
  When several mods solve the same problem differently, each solution is its own numbered article
  inside the same topic directory and the topic `overview.md` compares them.
- Topics are grouped one level below the category (`howto/rendering/overlays/`,
  `howto/rendering/vulkan-passes/`) so that no directory lists more than about a dozen entries. A
  group is a navigation aid only: it has an `index.md` (generated) and no concept of its own. Group
  slugs are short kebab-case nouns; the plan in `ai/catalog/howto-plan.yml` assigns them.

## Concept types

Use these exact `type` strings so consumers can group by them.

| Type | Where | Purpose |
|---|---|---|
| `Mod` | `mods/<mod>/overview.md` | What the mod is, how it loads, its feature catalog, repo pins |
| `Mod Feature` | `mods/<mod>/features/*.md` | One novel thing the mod does, with code references and snippets |
| `Submod` | `mods/<mod>/submods/*.md` | One sub-mod of a monorepo mod, linking its features |
| `Game Feature` | `howto/<cat>/<group>/<topic>/overview.md` | The game system or modding problem, engine background, approach comparison |
| `How-To` | `howto/<cat>/<group>/<topic>/<topic>[-N].md` | Step-by-step implementation of one approach |
| `Guide` | `docs/*.md` | Project-level documentation (this file) |

## Frontmatter

### Common keys (all content concepts)

```yaml
---
type: Mod Feature
title: Body-of-revolution aerodynamics
description: One sentence, no trailing period, quoted if it contains a colon
tags: [physics, aerodynamics, harmony, transpiler]
category: physics                       # exactly one value from the category list below
techniques: [harmony-transpiler]        # from the techniques list below, free additions allowed
game_types: [KSA.PhysicsStates, KSA.PhysicsEnvironment]   # fully qualified game types touched
lifecycle: [physics:vehicle-solver]      # see Lifecycle and timing
hooks: ["harmony-transpiler KSA.PhysicsStates.ComputeDerivatives"]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T03:40:00Z }
status: stable                          # draft while incomplete
repos:                                  # every reference repo this concept cites
  - name: KSAero                        # folder under references/, exactly as in data/references.yml
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
game:                                   # the decompiled game build the claims were checked against
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksaero-airforcepatch            # footnote label; kebab-case, unique in the file
    repo: KSAero                        # folder under references/ (or ksa-game-assemblies)
    path: KSAero/AirForcePatch.cs       # path relative to that repo root
    resource: https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero/AirForcePatch.cs
    title: KSAero/AirForcePatch.cs
  - id: ksa-physicsstates
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsStates.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs
    title: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
---
```

- `repos` and `game` are custom keys that make refreshes cheap: a later run compares each
  `repos[].ref` with `data/references.yml` and `game.ref` with the assemblies checkout and
  re-analyzes only the bundles whose pins changed. Every concept that cites code carries them; a
  bundle root concept (`overview.md`) carries the union of its subtree.[^references-yml]
- `sources[]` entries that point at code carry `repo` and `path` in addition to the OKF `resource`
  URL. The URL is derived, never invented: web URL of the repo (strip `.git` and any trailing
  slash) + `/blob/<ref>/<path>`.
- `generated.by` identifies the actual producer, such as `claude-code/<model>` or `codex/<model>`. Set `generated.at` to the
  current UTC time with `date -u +%Y-%m-%dT%H:%M:%SZ`. Never add `verified` unless the claims were
  checked against the cited files in the same session, and then only with the same actor form.

### Type-specific keys

`Mod` (`overview.md`):

```yaml
mod: ksaero                 # mod slug
repo: KSAero                # folder under references/
license: MIT                # from data/references.yml
author: cairn5              # from mod.toml or README when stated
loader: starmap             # starmap | native | both | loader (StarMap itself) | none (external tool)
mod_id: KSAero              # the `name` in mod.toml (the manifest id)
tested_against: 2026.10.7.5541   # KSA build the mod README says it targets, when stated
categories: [physics, ui]   # union of feature categories
```

External authoring tools such as Flexo stay under `mods/` and retain the `Mod` / `Mod Feature`
types so catalogs, refresh planning and links use the same structure. Set `kind: authoring-tool`
and `loader: none` on their overview, and omit `mod_id` when the tool has no installed game mod
identity. Describe the exported mod's manifest and loader separately. Browser previews and export
validation are not evidence of in-game behavior or a successful in-game test.

`Mod Feature`: `mod: <slug>`, optional `submod: <slug>`, `category`, `techniques`, `game_types`.

`Submod`: `mod: unscience`, `submod: <slug>`, `mod_id: <name in the submod mod.toml>`.

`Game Feature` (`howto/.../overview.md`): `topic: <slug>`, `category`, `group`, `approaches: <N>`,
`game_types`, `demonstrated_by: [<mod feature concept ids>]`.

`How-To`: `topic: <slug>`, `category`, `group`, `approach: <N>` (omit when single),
`difficulty: beginner | intermediate | advanced`, `prerequisites: [starmap, harmony, ...]`,
`demonstrated_by: [mods/<mod>/features/<feature>, ...]`, `techniques`, `game_types`.

### Category list

Exactly one per concept. Add a value only by editing this list first.

| Category | Covers |
|---|---|
| `getting-started` | Mod skeleton, StarMap lifecycle hooks, mod.toml, manifest, build and deploy, logging, mod dependencies |
| `patching` | Harmony prefix/postfix/transpiler patterns, reflection into internals, hooking game loops, call-site rewriting |
| `ui` | ImGui windows, menus, fonts, draw lists, ModMenu integration, hotkeys and input, HUD overlays, settings UIs |
| `rendering` | World-space and sky overlays, Vulkan pipelines and buffers, textures, decals, lights, particles, meshes |
| `shaders` | GLSL post-processing, ShaderExtensions assets, shader patching and hot reload |
| `assets` | Part/asset XML, GLB models, textures, sounds XML, asset bundles, XML patching |
| `physics` | Forces, drag and aero, wheels and suspension, colliders, Bepu, custom motion and kinematics |
| `vehicles-and-parts` | Part modules, spawning vehicles, staging, resources, thrusters, parachutes, part scaling |
| `celestials` | Atmospheres, rings, star catalogs, system XML, terrain, static objects, ground clutter |
| `camera` | Camera modes, viewports, secondary cameras, IVA, camera animation |
| `kittens` | Characters, EVA, animation, materials, spawning |
| `flight-and-orbits` | Flight computer, maneuver planning, orbit propagation, trajectories, map view overlays, targets |
| `persistence` | Saves and sidecars, settings and config files, scene state |
| `audio` | FMOD sounds, music, channel groups |
| `external-io` | Telemetry export, HTTP/MQTT/serial, hosting processes, terminals, inter-mod contracts |
| `testing-and-tooling` | Headless harnesses, API surface diffing, decompiling, packaging, CI |

### Techniques vocabulary

Prefer these; add free values when none fits.
`starmap-lifecycle`, `harmony-prefix`, `harmony-postfix`, `harmony-transpiler`, `harmony-finalizer`,
`reflection`, `imgui-window`, `imgui-drawlist`, `imgui-font`, `imgui-menu`, `vulkan-pipeline`,
`vulkan-buffer`, `vulkan-texture`, `glsl-shader`, `post-processing`, `xml-asset`, `xml-patch`,
`glb-model`, `bepu-physics`, `custom-physics`, `fmod-audio`, `json-config`, `toml-config`,
`save-sidecar`, `background-thread`, `native-interop`, `inter-mod-api`, `assembly-load-context`.

## Lifecycle and timing (required)

KSA runs one main-thread frame per `Program.OnFrame` call and steps physics on worker threads
between frames, so a feature only works if it hooks the right moment. Every `Mod Feature` and
`How-To` concept carries a `lifecycle` list and a `hooks` list in frontmatter and a
`## Lifecycle and timing` body section that states where the code runs, what state is readable or
writable at that moment, and why the mod chose that point. Verify every claim against
`current/decomp/KSA/Program.cs`, `current/decomp/KSA/Universe.cs` and the StarMap patchers in
`StarMap.Core/Patches/`; do not infer timing from other engines.

```yaml
lifecycle: [frame:draw-ui, physics:vehicle-solver]        # values from the list below
hooks:                                                     # how the code attaches, one per hook
  - "starmap StarMapAfterGui"                              # StarMap attribute
  - "harmony-transpiler KSA.PhysicsStates.ComputeDerivatives"   # harmony-<prefix|postfix|transpiler|finalizer> <Type.Member>
  - "reflection KSA.Program._renderer"                     # reflection access to a private member
```

Frame structure of `Program.OnFrame(currentPlayerTime, dtPlayer)` in build 2026.10.10.5554, with the
lifecycle values to use:

| Value | What runs | Notes for modders |
|---|---|---|
| `tool:authoring` | External editor interaction, document editing and browser preview | Not a KSA frame phase; use `hooks: []` when no game hook exists. Describe game consumption separately |
| `tool:build` | Offline extraction, conversion, export, packaging and tests | Not a KSA frame phase; identify required inputs and the generated artifacts |
| `startup:starmap-before-main` | `StarMapBeforeMain`, before `Program.Main` | No game state exists; only loader-level work. Harmony prefixes on `Program.Main` registered here (KittenExtensions, ShaderExtensions) also use this value |
| `startup:immediate-load` | `StarMapImmediateLoad(Mod)`, Harmony prefix on `Mod.PrepareSystems` | Per-mod, before systems and asset bundles load. Only a method with exactly one `KSA.Mod` parameter is called; a zero-argument one never runs |
| `startup:asset-load` | `ModLibrary.PreloadAssetBundles`, `LoadEditorTags`, `LoadAll`: mod.toml `assets`, XML asset bundles, then every `ILoader.Load` (file assets, shader compiles) on .NET thread-pool threads; KittenExtensions' XML patch run, a `ModLibrary.PrepareAll` prefix on the main thread that finishes before the first `startup:immediate-load` | Content mods live here; no code hooks except patches, and patches on loader paths must be thread-safe |
| `startup:all-mods-loaded` | `StarMapAllModsLoaded`, Harmony postfix on `ModLibrary.LoadAll` | Asset bundles are loaded but `ModLibrary.AttachGameData` has not run yet, so part templates do not have their game data merged; the universe/scene does not exist |
| `startup:game-loaded` | `Program.OnGameLoaded`, `Universe.OnLoaded` | Scene exists; typical place to resolve vehicles, celestials, statics |
| `frame:prepare` | `Program.PrepareFrame`: renderer rebuild, wait on job systems, apply solver results, poll input, dispatch next solvers, `Network.Tick` | The only main-thread window where physics results are settled, between the `Apply*Solvers` calls and the `ExecuteNext*Solvers` calls |
| `frame:apply-solvers` | `Universe.ApplyOrbitSolvers` / `ApplyVehicleSolvers` / `ApplyClothSolvers` inside `PrepareFrame` | Main-thread vehicle and orbit state receives the finished physics step; the worker's flight computer is copied back over the vehicle's with `FlightComputer.CopyFrom` |
| `frame:input` | `Glfw.PollEvents`, `InputEvents.ApplyInputEvents`, key dispatch (`GameSettings.OnKeyAll`) | Hotkeys, mouse; ImGui text focus interplay |
| `frame:dispatch-solvers` | `Universe.ExecuteNextClothSolvers` / `ExecuteNextVehicleSolvers` / `ExecuteNextOrbitSolvers` | Next physics step starts on worker threads; a prefix on `ExecuteNextVehicleSolvers` or on `Vehicle.PrepareWorker` (main thread, per vehicle, right before its snapshot) is the last settled point; main-thread mutation of simulated state after this is racy until the next `frame:apply-solvers` |
| `frame:imgui-new-frame` | `Program.PrepareImGui` (`ImGui.NewFrame`) | ImGui calls are legal from here until `frame:imgui-render` |
| `frame:viewports` | `OnFrameEditor`, `OnFrameViewports` (viewport and camera `OnFrame`) | Camera state for this frame is computed here |
| `frame:draw-ui` | `OnDrawUiFrame` (prefix = `StarMapBeforeGui`), `OnDrawUiViewports` (postfix = `StarMapAfterGui`), `OnDrawUiThreadSafe` (menu bar, vehicle windows, gauges, `Universe.OnDrawUi`), `OnDrawUiConsole` | Skipped entirely when the HUD is hidden (`DrawUI == false`); only `DrawFps` and `OnDrawUiConsole` still run in that state (mods postfix `DrawFps` or prefix `OnDrawUiConsole` to keep drawing; `StarMapBeforeGui` and `StarMapAfterGui` do not fire), and none of this runs on frames where `PrepareFrame` returns `Exit`; ImGui draw lists for sky/world overlays are built here |
| `frame:imgui-render` | `ImGui.Render` | Draw data is final; no more ImGui calls this frame |
| `frame:gauges` | `GaugeCanvas.UpdateCanvasesOnFrame` (before `PrepareImGui`), then after `ImGui.Render` `UpdateGauges`, `GaugeData.AnimateAll` | Cockpit gauge values |
| `frame:controller` | `OnFrameController` | Only syncs the cursor mode with the active controller; cameras actually move in `frame:viewports` |
| `frame:lights` | `LightSystem.ClearLights` / `OnFrame` | Light registration for this frame |
| `frame:celestials` | `OnFrameCelestials` (planet renderer `OnFrame`) | Terrain and planet streaming |
| `frame:pre-render` | `OnPreRender`: swapchain frame acquire, `Universe.OnPreRender` per viewport, `Editor.OnPreRender` | Per-frame render data has NOT been uploaded yet; `UpdateRenderingResources` / `Universe.UpdateRenderData` (vehicles, static objects, particles) run inside `Render`, so a postfix on one of those is `frame:render` |
| `frame:render` | `Render`: `Universe.UpdateWorldSun`, `UpdateRenderingResources` / `Universe.UpdateRenderData` (GPU buffers for this frame are filled), then `RenderGame` / `RenderEditor` Vulkan command recording (see render phases) | Custom pipelines and draws go into a specific phase; buffer updates happen here, not in `OnPreRender` |
| `frame:post-render` | `PostRender`: submit, present, `GizmoPass.PostRender` | Readbacks and screenshots |
| `frame:after-on-frame` | `StarMapAfterOnFrame`, Harmony postfix on `Program.OnFrame` | Everything above has run; the next physics step is already executing. Also fires on frames where `PrepareFrame` returned `Exit` (no UI, no render) |
| `physics:vehicle-solver` | Worker-thread vehicle step: `PhysicsBubble` jobs, `PhysicsStates.ComputeDerivatives` per substep (gravity, `ComputeDrag`, thrust, chutes), integration, Bepu constraint sim | Patches here run off the main thread and per substep; must be allocation-free and must not touch ImGui or Vulkan |
| `physics:orbit-solver` | Orbit propagation jobs (`JobSystems.OrbitSolvers`), one `CelestialUpdateTask` per celestial or orbiting star | Celestial bodies only; vehicle flight-plan and burn-plan prediction runs in the vehicle solver's post-work (`PhysicsBubble.RunVehiclePostWorkInner`) and is `physics:vehicle-solver` |
| `physics:cloth-solver` | Parachute cloth (`JobSystems.ClothSolvers`) | |
| `physics:bepu` | Bepu simulation inside the vehicle step (part trees, kittens, contacts) | Colliders, wheels, constraints |
| `render:<phase>` | One of `prepass`, `ambient-occlusion`, `shadows`, `planet`, `raytrace`, `scene-opaque`, `particles`, `ocean`, `atmosphere`, `exhaust`, `translucency`, `bloom`, `orbit-lines`, `gizmos`, `grid`, `gauges`, `aa`, `imgui`, `post-process` | Vocabulary only: the real order is interleaved (planet and shadow work alternate; gizmos, particles and ocean each record in two places; the final composite precedes the ImGui pass). Read the order from the game-loop reference in `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`. The base game has no generic post-process chain; `post-process` means passes a mod inserts around the final composite (ShaderExtensions) |
| `editor:<phase>` | Mod code that runs inside the vehicle editor's own entry points via a patch on them: `editor:on-frame` (`VehicleEditor.OnFrame`), `editor:draw-ui` (`VehicleEditor.OnDrawUi`), `editor:render` (`Program.RenderEditor`) | Only for patches on those methods; code that merely runs while the editor is open keeps its normal `frame:*` value |
| `thread:background` | A thread or task the mod owns | State the synchronization point back to the main thread |
| `event:<name>` | Game events the mod subscribes to or patches (`event:vehicle-destroyed`, `event:key`, `event:save`) | Free-form after the colon |

## Body rules

- Start body headings at `##`. Starlight renders `title` as the page h1, so an h1 in the body
  produces a duplicate heading.
- Preferred `Mod Feature` body: intro paragraphs (what the player gets, one-line mechanism), then
  `## How it works`, `## Lifecycle and timing`, `## Key code` (table of path, role), `## Snippets`,
  `## Game APIs touched`, `## Pitfalls and version notes`, `## See also`.
- Preferred `How-To` body: intro (outcome, prerequisites, which mods demonstrate it), then
  `## Background: how the game does it`, `## Lifecycle and timing`, `## Steps` (numbered, each with
  code), `## Complete example` (points at the mod files), `## Variations and gotchas`, `## See also`.
- Preferred `Game Feature` body: what the system is and where it lives in the engine, `## Engine
  background` (decompiled types with links), `## Approaches` (table: article, mod, technique,
  trade-off), `## See also`.
- Prefer tables and lists over prose. Keep paragraphs short.

### Code references

- Mod code: a markdown link whose text is the path relative to the mod repo root and whose target
  is the pinned GitHub blob URL, with optional line anchors:
  `[KSAero/AirForcePatch.cs](https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero/AirForcePatch.cs#L55-L70)`.
  Name the mod in the same sentence or table row when more than one repo is cited in the section.
- Game code: name the type and member in backticks (`PhysicsStates.ComputeDrag`) and link the
  decompiled file with its path relative to the assemblies repo root
  (`current/decomp/KSA/PhysicsStates.cs`) using the same link form. Game XML and shaders live
  under `current/Content/`.
- Every type, member, attribute and XML element named in the body must exist in the cited
  checkout. Grep before writing. Do not describe APIs from memory or from other games.
- Every file cited in the body appears in `sources[]` with `repo` and `path`.

### Snippets

- Fenced with a language tag. The first line is a comment naming the source path and lines, for
  example `// KSAero/AirForcePatch.cs L55-L70`.
- Verbatim from the checkout, at most about 40 lines; mark elisions with `// ...`. Do not
  paraphrase code into pseudo-code and present it as a quote.
- For how-to articles, minimal adapted code is allowed when it is clearly labelled as adapted
  (`// adapted from KSAero/AirForcePatch.cs`) and compiles against the named game types.

### Refresh-safe citations

`scripts/content_refresh_plan.ts` decides which pages need re-verification by intersecting diff
hunks with the line ranges each page cites, and remaps anchors when code merely moves. It only sees
ranges written in these forms, so keep to them:

- Link anchors `#L10` or `#L10-L40` on pinned blob links.
- Snippet header first lines `<comment> <exact repo-relative path> L10-L40[, L50-L60]`.
- Prefer citing a line range over citing a whole file: a page that cites a changed file without any
  range is always sent to review, even when the change is elsewhere in the file.
- Never move a pin, anchor or snippet header by hand; use `--repin` or `--accept` (see the
  maintenance procedure in `AGENTS.md`).

### Links and footnotes

- Link concepts with file-relative paths (`../features/aero-readout.md`,
  `../../../howto/physics/replace-drag-model/overview.md`). Link only to files that exist or that
  the same task creates. Check before linking.
- Cite specific claims about engine internals with footnotes whose labels equal `sources[].id`,
  and define each footnote at the end of the file.
- Do not add a `# Citations` section. Provenance lives in `sources`.

## Validation

Run from the repository root; all three must be clean before a bundle is considered done.

```bash
python3 .claude/skills/okf/scripts/validate_bundle.py content/mods/<mod-slug>
python3 .claude/skills/okf/scripts/build_indexes.py content/mods/<mod-slug> --dir-description features="..."
node scripts/content_check_refs.ts content/mods/<mod-slug>
```

`validate_bundle.py` reports OKF errors and warnings. `build_indexes.py` regenerates every
`index.md` below the given directory (run it on your own subtree only; the orchestrator
regenerates the root). `content_check_refs.ts` checks that every `repos[]` pin matches
`data/references.yml`, every `sources[].path` exists in the checkout, every GitHub blob link
points at a pinned ref and an existing file, and that `game` matches the assemblies checkout.

## Starlight compatibility notes

- `title` and `description` are the Starlight page frontmatter; everything else is extra and can
  be stripped or mapped by a schema extension at import time.
- `index.md` and `log.md` files have no frontmatter in OKF; the site loader injects a `title` at
  build time (see [Documentation site](site.md)). Do not add frontmatter to them.
- Relative `.md` links are rewritten to site routes by a remark plugin at build time; keep them
  file-relative.
- Footnotes, tables and fenced code render as-is.

[^okf-skill]: OKF v0.2 authoring skill
[^references-yml]: Reference repository inventory
