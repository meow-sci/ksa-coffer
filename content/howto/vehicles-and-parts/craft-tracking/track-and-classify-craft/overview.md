---
type: Game Feature
title: "Tracking which craft carry your part, classifying them and detecting staging and loss"
description: "Per-frame rosters keyed by Vehicle reference, reference-keyed team tables and state-diffing detection of staging, disposal and structural loss"
topic: track-and-classify-craft
category: vehicles-and-parts
group: craft-tracking
approaches: 4
game_types: [KSA.Vehicle, KSA.Universe, KSA.CelestialSystem, KSA.StructuralLoad, KSA.PhysicsBubble, KSA.Part, KSA.Program]
lifecycle: [frame:draw-ui, frame:after-on-frame]
demonstrated_by: [mods/ksacars/features/frame-step-latch-and-car-registry, mods/ksarmory/features/iff-teams-and-allegiance, mods/ksa-public-telemetry/features/flight-event-detection-and-callouts, mods/ksa-public-telemetry/features/freeze-on-signal-loss]
tags: [roster, vehicles, teams, iff, staging, disposal, structural-load]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:41:55Z }
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSA-Public-Telemetry
    git: https://github.com/elevatorctln/KSA-Public-Telemetry/
    ref: 90608fb465f87d6008208798cc4d20ed8182c9a0
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "current/decomp/KSA/CelestialSystem.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "current/decomp/KSA/Universe.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-structuralload
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StructuralLoad.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StructuralLoad.cs
    title: "current/decomp/KSA/StructuralLoad.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsbubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: "current/decomp/KSA/PhysicsBubble.cs (decompiled, build 2026.10.10.5554)"
---
A mod that adds a part, a weapon or an overlay needs to know "which craft is mine right now". KSA has no event for "a vehicle appeared", "a part left a craft" or "a craft was destroyed", so the mod builds a roster itself, every frame, and
diffs it. This topic collects four recipes that sit on top of one another: a roster of the craft that carry the mod's part keyed by the `Vehicle` object, a team table keyed the same way (never by name), event detection by diffing counters,
and loss detection from `IsDisposed`, `IsControllable` and the `StructuralLoad` fractions.

## Engine background

- **Where every vehicle lives.** `Universe.CurrentSystem.All` is a `LookupCollection<Astronomical>` containing celestials and vehicles alike [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L66)[^ksa-celestialsystem] [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L114)[^ksa-universe]. It is valid from any hook.
  `Program.VehiclesInFrame` is a per-frame scratch buffer that `PrepareFrame` refills from the same collection (`RefreshVehiclesInFrame`) and that is cleared again later in the frame [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L582-L588)[^ksa-program], so a mod hook that runs after the render sees it empty.
- **Disposal.** `Vehicle.IsDisposed` becomes true in `Vehicle.Dispose`, which also deregisters the vehicle from the system [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3775-L3790)[^ksa-vehicle]; `Vehicle.MergeFrom` disposes the absorbed vehicle and `Split` creates a new one.
- **Control.** `Vehicle.IsControllable` is `_overrideIsControllable || Parts.Controls.NumModules > 0` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L589).
- **Structural load.** `Vehicle.StructuralLoad` is a `ref readonly StructuralLoad` with `GLoadFraction` and `DynamicPressureFraction` (peak over max) [current/decomp/KSA/StructuralLoad.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StructuralLoad.cs#L3-L17)[^ksa-structuralload]; the main-thread copy is set when the solver result is applied (`_structuralLoad = updateData.NewStructuralLoad`)
  [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2529). The worker fills it in `PhysicsBubble.DetectStructuralFailure`, which creates a `VehicleDestructionEvent` when either fraction reaches 1.0 (the g-load check is waived for debris, and in contact with a part-failure event) [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L999-L1036)[^ksa-physicsbubble].
- **Moves keep parts whole.** A split hands existing `Part` objects to a new vehicle; so a per-part entry keyed by the `Part` reference survives, while a per-craft entry keyed by name does not ([Keep an anchor on a part](../../part-geometry/anchor-to-parts-across-vehicle-changes/overview.md)).

## Approaches

| Article | Mod | Technique | Subject |
|---|---|---|---|
| [1: per-frame sync into a Vehicle-keyed dictionary](track-and-classify-craft-1.md) | KSACars | `starmap-lifecycle` | a once-per-frame latch across two hooks; entries added, dropped when the craft is disposed or the part leaves |
| [2: teams and a reference-keyed roster](track-and-classify-craft-2.md) | KSArmory | `reference-keyed-dictionary` | allegiance declared per craft each simulated step, never parsed from names |
| [3: state diffing for staging and callouts](track-and-classify-craft-3.md) | KSA-Public-Telemetry | `state-diffing` | part-count drop, new vehicle sharing `LaunchGameTime`, attached radial decouplers |
| [4: `IsDisposed`, `IsControllable`, `StructuralLoad`](track-and-classify-craft-4.md) | KSA-Public-Telemetry | `state-machine` | hold the last values on loss; freeze at a fraction of the structural limit |

## See also

- [Game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Give inert parts behaviour by recognising their part Id](../give-inert-parts-behaviour-by-part-id/overview.md) (what makes a craft "carry your part"), [Pick and gate targets for automated weapons](../target-and-gate-automated-weapons/overview.md)
- [Draw UI while the HUD is hidden](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md), [Stage a vehicle from code](../../staging-and-engines/stage-a-vehicle-from-code/overview.md), [Make a vehicle indestructible](../../vehicles/make-a-vehicle-indestructible/overview.md)
- Mod features: [frame-step-latch-and-car-registry](../../../../mods/ksacars/features/frame-step-latch-and-car-registry.md), [iff-teams-and-allegiance](../../../../mods/ksarmory/features/iff-teams-and-allegiance.md), [flight-event-detection-and-callouts](../../../../mods/ksa-public-telemetry/features/flight-event-detection-and-callouts.md), [freeze-on-signal-loss](../../../../mods/ksa-public-telemetry/features/freeze-on-signal-loss.md)

[^ksa-celestialsystem]: current/decomp/KSA/CelestialSystem.cs (decompiled, build 2026.10.10.5554)
[^ksa-universe]: current/decomp/KSA/Universe.cs (decompiled, build 2026.10.10.5554)
[^ksa-program]: current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)
[^ksa-structuralload]: current/decomp/KSA/StructuralLoad.cs (decompiled, build 2026.10.10.5554)
[^ksa-physicsbubble]: current/decomp/KSA/PhysicsBubble.cs (decompiled, build 2026.10.10.5554)
