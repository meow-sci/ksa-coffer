---
type: Game Feature
title: Reading live part module state
description: How KSA stores per-part module data in typed module lists and struct-of-arrays state lists on the PartTree, and two recipes for reading engines, tanks, propellant and solid motors
topic: read-live-part-module-state
category: vehicles-and-parts
group: modules-and-resources
approaches: 2
game_types: [KSA.PartTree, KSA.ModuleList, KSA.ModuleStateful, KSA.EngineController, KSA.SequenceList, KSA.Tank, KSA.Battery, KSA.Mole, KSA.MoleState, KSA.SolidMotor]
lifecycle: [frame:viewports, frame:draw-ui, frame:after-on-frame]
demonstrated_by: [mods/gatos/features/part-module-state-reads, mods/ksarmory/features/holed-tank-leaks]
tags: [modules, state, tanks, engines, solid-motor, read, cache]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:26:22Z }
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-parttree
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTree.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs
    title: "current/decomp/KSA/PartTree.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-modulelist
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModuleList.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModuleList.cs
    title: "current/decomp/KSA/ModuleList.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-modulestateful
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModuleStateful.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModuleStateful.cs
    title: "current/decomp/KSA/ModuleStateful.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-tank
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Tank.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Tank.cs
    title: "current/decomp/KSA/Tank.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-mole
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mole.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mole.cs
    title: "current/decomp/KSA/Mole.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-enginecontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EngineController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineController.cs
    title: "current/decomp/KSA/EngineController.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-enginecontrollerstate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EngineControllerState.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineControllerState.cs
    title: "current/decomp/KSA/EngineControllerState.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-solidmotor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs
    title: "current/decomp/KSA/SolidMotor.cs (decompiled, build 2026.10.10.5554)"
---
Per-part data in KSA is not stored on `Part` objects. A vehicle's `PartTree` (`vehicle.Parts`) keeps a typed list of
module instances per module class and, for stateful modules, a struct-of-arrays list of states. Reading an engine's
throttle, a tank's mass or a battery's charge is therefore two lookups: the modules, then their state.

## Engine background

- **Modules.** `PartTree.Modules` is a `ModuleList`; `Modules.Get<TModule>()` returns a `Span<TModule>` of every
  module of that type across the whole vehicle [current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs#L62)[^ksa-parttree] [current/decomp/KSA/ModuleList.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModuleList.cs#L180-L187)[^ksa-modulelist]. The index in
  that span is a stable ordinal until the part tree changes.
- **State.** Stateful modules derive from `ModuleStateful<TModule, TState, TGlobal, TFx>`. Their runtime state
  lives in `vehicle.Parts.States`; `ModuleStateful<...>.TryGetFrom(states, out StateList list)` yields the typed
  list and `list.GetState(module)` returns a `ref readonly TState` [current/decomp/KSA/ModuleStateful.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModuleStateful.cs#L434-L444)[^ksa-modulestateful]
  [current/decomp/KSA/ModuleStateful.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModuleStateful.cs#L839-L843). Some lists are pre-resolved fields on `PartTree`: `Moles`, `RocketCores`,
  `Batteries` [current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs#L70-L78).
- **Tanks and propellant.** A `Tank` holds `Moles` (`List<Mole>`); each `Mole` is a substance container whose
  amount is a `MoleState.Mass` in the `PartTree.Moles` list. `Mole.GetStoredMass(volume)` and
  `Mole.FilledFraction(in state)` convert [current/decomp/KSA/Tank.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Tank.cs#L78-L81)[^ksa-tank] [current/decomp/KSA/Mole.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mole.cs#L53-L60)[^ksa-mole] [current/decomp/KSA/Mole.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mole.cs#L124-L127).
  Solid propellant lives on `SolidGrainSegment`, not a `Tank`.
- **Engines.** `EngineController` has `IsActive`, `MinimumThrottle` and `VacuumData`
  (`RocketControllerData`); its `EngineControllerState` has `CommandThrottle` and `IsPropellantAvailable`
  [current/decomp/KSA/EngineController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineController.cs#L38-L44)[^ksa-enginecontroller] [current/decomp/KSA/EngineControllerState.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EngineControllerState.cs#L5-L10)[^ksa-enginecontrollerstate].
- **Solid motors.** `SolidMotor` is a `RocketCore` whose `Stack` (`SolidMotorStack`) lists
  `SolidGrainSegment`s [current/decomp/KSA/SolidMotor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs#L182)[^ksa-solidmotor].

## Approaches

| Article | Mod | Technique | Subject |
|---|---|---|---|
| [1: `Modules.Get<T>()` plus `TryGetFrom`, cached per vehicle](read-live-part-module-state-1.md) | gatOS | `conditional-weak-table-cache` | engines, tanks, SRBs, parts; rebuild structural facts on count change |
| [2: tank shape and liquid level](read-live-part-module-state-2.md) | KSArmory | `reflection` | the private `Tank._template` and a fill surface |

## See also

- [game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/game-loop-and-lifecycle-3.md) for when module state is settled
- `get-part-points-in-vehicle-and-world-frames`, [Switch engines on and off, set throttle and RCS commands, and choose which RCS jets fire](../command-engines-throttle-and-rcs-from-code/overview.md), [Refill, drain or top up a vehicle's propellant and batteries](../refill-or-drain-resources/overview.md)
- Mod features: [gatos/part-module-state-reads](../../../../mods/gatos/features/part-module-state-reads.md), [ksarmory/holed-tank-leaks](../../../../mods/ksarmory/features/holed-tank-leaks.md)
- [Part meshes, attach nodes and part-local points in vehicle, world and screen space](../../part-geometry/get-part-points-in-vehicle-and-world-frames/overview.md) - related topic

[^ksa-tank]: current/decomp/KSA/Tank.cs (decompiled, build 2026.10.10.5554)
[^ksa-enginecontrollerstate]: current/decomp/KSA/EngineControllerState.cs (decompiled, build 2026.10.10.5554)
[^ksa-solidmotor]: current/decomp/KSA/SolidMotor.cs (decompiled, build 2026.10.10.5554)
[^ksa-enginecontroller]: current/decomp/KSA/EngineController.cs (decompiled, build 2026.10.10.5554)
[^ksa-modulelist]: current/decomp/KSA/ModuleList.cs (decompiled, build 2026.10.10.5554)
[^ksa-parttree]: current/decomp/KSA/PartTree.cs (decompiled, build 2026.10.10.5554)
[^ksa-mole]: current/decomp/KSA/Mole.cs (decompiled, build 2026.10.10.5554)
[^ksa-modulestateful]: current/decomp/KSA/ModuleStateful.cs (decompiled, build 2026.10.10.5554)
