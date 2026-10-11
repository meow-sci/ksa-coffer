---
type: Game Feature
title: Keep mod-only vehicles out of save files
description: Why a save that names a part template from a missing mod cannot be opened without it, and the postfix on Universe.SerializeSystems that filters a mod's own craft out of the serialised universe
topic: keep-mod-vehicles-out-of-saves
category: persistence
group: saves
approaches: 1
game_types: [KSA.Universe, KSA.CelestialSystemData, KSA.UniverseData, KSA.CelestialSystem]
lifecycle: [event:save]
demonstrated_by: [mods/ksastructures/features/office-furniture-craft]
tags: [saves, serialization, harmony, vehicles, uninstall-safe]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T18:45:45Z }
status: stable
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: uni
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ud
    repo: ksa-game-assemblies
    path: current/decomp/KSA/UniverseData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UniverseData.cs
    title: "KSA.UniverseData (decompiled, build 2026.10.10.5554)"
  - id: cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA.CelestialSystem (decompiled, build 2026.10.10.5554)"
  - id: csd
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystemData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystemData.cs
    title: "KSA.CelestialSystemData (decompiled, build 2026.10.10.5554)"
---

A mod that spawns craft of its own (furniture, scenery, helpers) puts those craft into every save, and a save naming a part template that is not installed cannot be loaded without the mod. If the craft can be recreated whenever they are missing, the cleanest fix is to leave them out of the save.

## Engine background

| Fact | Where |
|---|---|
| A save is built by `UniverseData.Create()`, which calls `Universe.SerializeSystems()` | [current/decomp/KSA/UniverseData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UniverseData.cs#L40-L53) |
| `Universe.SerializeSystems()` returns a one-element `List<CelestialSystemData>` from `CurrentSystem.SerializeSave()` and is called only from `UniverseData.Create` in this build | [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2480-L2491) |
| `CelestialSystem.SerializeSave()` adds a `VehicleData` for every `Vehicle` in the system, then `SerializeLocalIdData` per vehicle, then the ground clutter | [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L632-L661) |
| `CelestialSystemData.Vehicles` is a plain `List<VehicleData>` serialised as `<Vehicle>` elements | [current/decomp/KSA/CelestialSystemData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystemData.cs#L6-L15) |
| A vehicle's `VehicleData` names each part's template (`PartInstance.InstanceOf`) | `PartInstance.cs` |

Because the postfix works on the returned list, it sees the data after `CelestialSystem.SerializeSave` has run and before `GameSave.Populate` stores it; the live vehicles are untouched. The save is `event:save`; timing relative to the frame depends on who saves (see [Create and load native KSA saves from mod code](../save-and-load-the-game-from-code/overview.md) and the [game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Postfix Universe.SerializeSystems and filter CelestialSystemData.Vehicles](./keep-mod-vehicles-out-of-saves.md) | KSAStructures | `save-filter` | `event:save` | Saves open without the mod; the craft must be re-creatable; the flown craft is the exception |

## See also

- [Tracking which craft carry your part, classifying them and detecting staging and loss](../../../vehicles-and-parts/craft-tracking/track-and-classify-craft/overview.md), [Spawning a vehicle at runtime](../../../vehicles-and-parts/vehicles/spawn-a-vehicle-at-runtime/overview.md)
- [Store per-save mod data next to a KSA save and notice when the player saves](../save-mod-state-with-the-game-save/overview.md), [Identify vessels and parts stably across saves](../identify-vessels-and-parts-across-saves/overview.md)
