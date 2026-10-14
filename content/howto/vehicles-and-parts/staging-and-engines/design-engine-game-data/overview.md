---
type: Game Feature
title: Design engine GameData and solid-motor grains
description: Build scoped liquid, RCS and solid-motor definitions with pure candidate construction, numerical previews and one undoable commit
topic: design-engine-game-data
category: vehicles-and-parts
group: staging-and-engines
approaches: 1
demonstrated_by:
  - mods/flexo/features/engine-design-and-validation
  - mods/flexo/features/propulsion-design-wizards
  - mods/flexo/features/solid-motor-grain-design
game_types:
  - KSA.RocketTemplate
  - KSA.CombustorTemplate
  - KSA.DeLavalNozzleConfig
  - KSA.PartTemplate
  - KSA.RocketThrusterControllerTemplate
  - KSA.GimbalController
  - KSA.SolidMotor
  - KSA.SolidMotorTemplate
  - KSA.SolidGrainSegment
  - KSA.SolidMotorNozzle
  - KSA.PartTree
  - KSA.GrainGeometryTemplate
lifecycle:
  - tool:authoring
tags:
  - flexo
  - asset-authoring
  - vehicles-and-parts
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:12:22Z
status: stable
repos:
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: source-game-current-decomp-ksa-rockettemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs
    title: current/decomp/KSA/RocketTemplate.cs
  - id: source-game-current-decomp-ksa-delavalnozzleconfig-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/DeLavalNozzleConfig.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs
    title: current/decomp/KSA/DeLavalNozzleConfig.cs
---

Author engine module graphs, check their references and preview performance in an external editor before producing native GameData. Keep authoring diagnostics separate from the game’s template construction and vehicle simulation.

## Engine background

The native template graph is resolved by [current/decomp/KSA/RocketTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs#L18-L83); nozzle calculations are in [current/decomp/KSA/DeLavalNozzleConfig.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs#L16-L118). This approach runs outside the game and feeds those contracts through exported XML.

See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Design engine GameData with validated browser candidates](design-engine-game-data.md) | Flexo | `xml-asset`, `pure-model`, `numerical-preview`, `scoped-references`, `transactional-editing`, `procedural-geometry`, `lookup-table`, `numerical-integration` | `tool:authoring` | Connected candidate with one Undo and early diagnostics; numerical and single-part previews require native validation |

## See also

- [Engine design and validation](../../../../mods/flexo/features/engine-design-and-validation.md)
- [Propulsion design wizards](../../../../mods/flexo/features/propulsion-design-wizards.md)
- [Solid-motor grain design](../../../../mods/flexo/features/solid-motor-grain-design.md)
- [Computing engine thrust, Isp and mass flow at ambient pressure, and inverting for throttle](../compute-engine-thrust-at-ambient-pressure/overview.md)
- [Defining a part with its own game data and GLB model](../../parts/define-a-part-with-game-data/overview.md)
- [Compose and export native asset-only mods in a browser](../../../assets/asset-xml/author-native-asset-mods-in-a-browser/overview.md)
