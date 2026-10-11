---
type: Game Feature
title: "Cache and key per-body data so it survives system reloads, repeated ids and extra star systems"
description: "Derived body data is constant for a loaded system but a cache must die when the system is reloaded or a body object is replaced; five invalidation and key designs from reference latches to prefix-keyed JSON catalogs"
topic: cache-and-key-body-data-per-loaded-system
category: celestials
group: systems-and-stars
approaches: 5
game_types: [KSA.Universe, KSA.CelestialSystem, KSA.Celestial, KSA.IParentBody, KSA.Orbit, KSA.IIndependentRoot]
lifecycle: [frame:draw-ui, frame:viewports, startup:game-loaded, startup:immediate-load]
demonstrated_by: [mods/ksa-deltavmap/features/live-celestial-system-graph, mods/gatos/features/celestial-body-catalog-reads, mods/compendium/features/derived-body-properties, mods/compendium/features/star-systems-and-body-tree, mods/compendium/features/cross-mod-json-catalog]
tags: [cache, invalidation, conditional-weak-table, key, star-systems, json-catalog]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:33Z }
repos:
  - name: Compendium
    git: https://github.com/meow-sci/Compendium.git
    ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-game-assemblies-current-decomp-ksa-celestial-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA/Celestial.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-iindependentroot-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IIndependentRoot.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IIndependentRoot.cs
    title: "KSA/IIndependentRoot.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA/Universe.cs (decompiled, build 2026.10.10.5554)"
---
Derived body data (mass, radius, orbit elements, templates) is constant for a loaded system, so recomputing it each frame is waste. But a cache must die when the system is reloaded or a body object is replaced, and mod data about bodies (descriptions, categories, overrides) needs a key that stays unique when ids repeat across systems and moons share names.

## Engine background

- `Universe.LoadSystem` creates a new `CelestialSystem` and **new body objects** every time, even for the same system id; `Universe.CurrentSystem` is the reference to compare ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L232-L257)). Roots, stars and `WorldSun` are cached at that point and are empty or null before it (`startup:game-loaded`).
- Ids repeat: a body id is unique only within a `CelestialSystem`; moons of different planets can share names, and several star systems are loaded at once.
- `Celestial.Id` and `Celestial.Parent` identify a body and its place in the tree ([current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L69)); `IIndependentRoot.RootOf(body)` walks `Parent` up to the root ([current/decomp/KSA/IIndependentRoot.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IIndependentRoot.cs#L9-L16)).
- Everything except position and velocity is constant for a session because bodies are on rails: orbit elements, templates, mass and radius.
- Mod data that exists before any body does (JSON loaded at `startup:immediate-load`) has to be matched to live bodies when a universe exists.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: latch on the Universe.CurrentSystem reference, not its Id](cache-and-key-body-data-per-loaded-system-1.md) | ksa-deltavmap | `per-system-cache` | `frame:draw-ui` | Everything per system resets together; manual reset list |
| [2: ConditionalWeakTable of immutable statics per Celestial](cache-and-key-body-data-per-loaded-system-2.md) | gatos | `conditional-weak-table-cache` | `frame:viewports`, `frame:draw-ui` | Self-invalidating by object identity; no reset code |
| [3: one-shot attach on the first UI frame with a universe](cache-and-key-body-data-per-loaded-system-3.md) | compendium | `starmap-lifecycle` | `frame:draw-ui`, `startup:immediate-load` | Matches early-loaded data to bodies; a static flag, not reload-safe |
| [4: dotted path of Celestial ids from the top-level body down](cache-and-key-body-data-per-loaded-system-4.md) | compendium | `game-object-graph` | `frame:draw-ui` | Unique keys that resolve back to live bodies; tree walks per lookup |
| [5: prefix-keyed JSON files discovered in every installed mod folder](cache-and-key-body-data-per-loaded-system-5.md) | compendium | `json-config` | `startup:immediate-load`, `frame:draw-ui` | Other mods can add or override data; precedence rules to document |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Enumerate star systems and bodies](../../../celestials/systems-and-stars/enumerate-star-systems-and-bodies/overview.md), Measure and budget mod performance
- Lay out a tree or graph diagram, [Detect save and load](../../../persistence/saves/detect-save-load/overview.md), [Ship content and code in one mod](../../../getting-started/loader/ship-content-and-code-in-one-mod/overview.md)
- [Enumerate every star system, star, planet and moon of the loaded universe](../enumerate-star-systems-and-bodies/overview.md) - related topic
- [Measure what a mod costs per frame, throttle expensive work and warm up hot code](../../../testing-and-tooling/in-game-testing/measure-and-budget-mod-performance/overview.md) - related topic
- [Lay out a tree or graph diagram and keep it usable at scale](../../../ui/draw-lists/lay-out-a-tree-or-graph-diagram/overview.md) - related topic

