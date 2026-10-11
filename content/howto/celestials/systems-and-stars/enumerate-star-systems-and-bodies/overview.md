---
type: Game Feature
title: "Enumerate every star system, star, planet and moon of the loaded universe"
description: "Walk the loaded universe's roots and body tree, a flat CelestialSystem.All scan or a player-selected root, and avoid the type traps that stars are not Celestials and Children also lists vehicles"
topic: enumerate-star-systems-and-bodies
category: celestials
group: systems-and-stars
approaches: 3
game_types: [KSA.Universe, KSA.CelestialSystem, KSA.IIndependentRoot, KSA.IParentBody, KSA.IOrbiter, KSA.Astronomical, KSA.Celestial, KSA.StellarBody, KSA.FixedStar, KSA.OrbitingStar, KSA.Barycenter, KSA.MinorBody]
lifecycle: [startup:game-loaded, frame:draw-ui, frame:viewports]
demonstrated_by: [mods/ksa-deltavmap/features/live-celestial-system-graph, mods/compendium/features/star-systems-and-body-tree, mods/gatos/features/celestial-body-catalog-reads]
tags: [universe, star-systems, barycenter, body-tree, children, roots]
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
  - id: ksa-game-assemblies-current-decomp-ksa-barycenter-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Barycenter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Barycenter.cs
    title: "KSA/Barycenter.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-celestialsystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA/CelestialSystem.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-fixedstar-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FixedStar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedStar.cs
    title: "KSA/FixedStar.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-iindependentroot-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IIndependentRoot.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IIndependentRoot.cs
    title: "KSA/IIndependentRoot.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-iparentbody-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IParentBody.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs
    title: "KSA/IParentBody.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-orbitingstar-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/OrbitingStar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitingStar.cs
    title: "KSA/OrbitingStar.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA/Program.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA/Universe.cs (decompiled, build 2026.10.10.5554)"
---
One loaded universe can hold several star systems. Each is rooted at a `FixedStar` (a single star) or a `Barycenter` (an empty root of a multi-star system whose `OrbitingStar`s orbit it), and below the root hang stars, planets, moons, minor bodies and even vehicles in the same tree. A mod that wants "every body" has three walks to choose from, and a handful of type traps in each.

## Engine background

- `Universe.LoadSystem` creates one `CelestialSystem` as `Universe.CurrentSystem`, then caches `Universe.Stars` (all `StellarBody` in `All`) and `Universe.Roots` (all `IIndependentRoot` in `All`) and sets `Universe.WorldSun` ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L232-L257)). Until it runs (`startup:game-loaded`) they are empty or null.
- `CelestialSystem.All` is a `LookupCollection<Astronomical>` holding every body; `HomeBody` is the body the template marks as home ([current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L64-L66)). `CreateTreeFromRoot` adds each template's bodies to the root's `Children` ([current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L197-L213)).
- Types: `FixedStar : StellarBody, IIndependentRoot` ([current/decomp/KSA/FixedStar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedStar.cs#L7)); `Barycenter : Astronomical, IIndependentRoot` with `IsStar()` returning false ([current/decomp/KSA/Barycenter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Barycenter.cs#L7), [current/decomp/KSA/Barycenter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Barycenter.cs#L161-L164)); `OrbitingStar : StellarBody, IOrbiter` ([current/decomp/KSA/OrbitingStar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitingStar.cs#L9)); `Celestial : Astronomical, IOrbiter, IParentBody` for planets and moons. The star is a `StellarBody` and is **not** a `Celestial`.
- `IParentBody.Children` is a `List<IOrbiter>` and also lists vehicles ([current/decomp/KSA/IParentBody.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs#L27)). `IIndependentRoot.RootOf(IParentBody)` walks `IOrbiter.Parent` upward until it reaches a non-orbiter ([current/decomp/KSA/IIndependentRoot.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IIndependentRoot.cs#L9-L16)).
- `Universe.WorldSun` is not stable: `Program.Render` moves it to the star nearest the main camera every frame ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2460), [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L134-L140)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: roots then Children into an immutable forest with game-type-free role rules](enumerate-star-systems-and-bodies-1.md) | ksa-deltavmap | `system-graph` | `frame:draw-ui` | Whole structure with correct roles; built once per loaded system |
| [2: Universe.Roots, RootOf and a selected root](enumerate-star-systems-and-bodies-2.md) | compendium | `game-object-graph` | `frame:draw-ui` | Direct and cheap; keep your own selected root |
| [3: flat scan of CurrentSystem.All plus an explicit WorldSun](enumerate-star-systems-and-bodies-3.md) | gatos | `immutable-snapshot` | `frame:viewports`, `frame:draw-ui` | Cheapest walk when parent and child structure is not needed |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Cache and key per-body data per loaded system](../../../celestials/systems-and-stars/cache-and-key-body-data-per-loaded-system/overview.md), [Read a body's properties and orbit elements](../../../celestials/systems-and-stars/read-body-properties-and-orbit-elements/overview.md), [Move or reparent a celestial body](../../../celestials/systems-and-stars/move-or-reparent-a-celestial-body/overview.md)
- Lay out a tree or graph diagram, [Plan multi-leg and interstellar delta-v routes](../../../flight-and-orbits/transfers/plan-multi-leg-and-interstellar-delta-v-routes/overview.md)
- [Cache and key per-body data so it survives system reloads, repeated ids and extra star systems](../cache-and-key-body-data-per-loaded-system/overview.md) - related topic
- [Read a body's atmosphere, ocean, ring, rotation, tilt, tidal-lock and orbit-element data](../read-body-properties-and-orbit-elements/overview.md) - related topic
- [Move a planet or moon at runtime by swapping its orbit or changing its parent](../move-or-reparent-a-celestial-body/overview.md) - related topic
- [Lay out a tree or graph diagram and keep it usable at scale](../../../ui/draw-lists/lay-out-a-tree-or-graph-diagram/overview.md) - related topic

