---
type: Game Feature
title: Spawn an EVA kitten from code
description: How a mod creates a real KittenEva with a backpack part, a chosen character and an orbit beside another vessel, registers it with its parent body and avoids racing the vehicle solver
topic: spawn-an-eva-kitten-from-code
category: kittens
group: characters
approaches: 2
game_types: [KSA.KittenEva, KSA.EVADoor, KSA.Part, KSA.PartTree, KSA.Tank, KSA.CharacterReference, KSA.ModLibrary, KSA.Orbit, KSA.CelestialSystem, KSA.JobSystems, KSA.InputEvents, KSA.Vehicle, KSA.StateVectors, KSA.IParentBody, KSA.Universe, KSA.LookupCollection]
lifecycle: [frame:draw-ui, frame:input]
demonstrated_by: [mods/unscience/features/doh-kitten-spawning, mods/ksarmory/features/spawn-and-teleport-test-craft]
tags: [kitten, spawn, eva, orbit, vehicle, solver, registry]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:38Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-evadoor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EVADoor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoor.cs
    title: KSA.EVADoor (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-orbit
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Orbit.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs
    title: KSA.Orbit (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-inputevents
    repo: ksa-game-assemblies
    path: current/decomp/KSA/InputEvents.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InputEvents.cs
    title: KSA.InputEvents (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-constraintsim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConstraintSim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConstraintSim.cs
    title: KSA.ConstraintSim (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-jobsystems
    repo: ksa-game-assemblies
    path: current/decomp/KSA/JobSystems.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/JobSystems.cs
    title: KSA.JobSystems (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: KSA.CelestialSystem (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-lookupcollection
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LookupCollection.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LookupCollection.cs
    title: KSA.LookupCollection (decompiled, build 2026.10.10.5554)
  - id: unscience-doh-lib-spawning-kittenspawner-catalog-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.Catalog.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.Catalog.cs
    title: doh.lib/Spawning/KittenSpawner.Catalog.cs
  - id: unscience-doh-lib-spawning-kittenspawner-positioning-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.Positioning.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.Positioning.cs
    title: doh.lib/Spawning/KittenSpawner.Positioning.cs
  - id: unscience-doh-lib-spawning-kittenspawner-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.cs
    title: doh.lib/Spawning/KittenSpawner.cs
  - id: unscience-doh-lib-spawning-spawnedkittenregistry-cs
    repo: unscience
    path: doh.lib/Spawning/SpawnedKittenRegistry.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/SpawnedKittenRegistry.cs
    title: doh.lib/Spawning/SpawnedKittenRegistry.cs
  - id: unscience-ksa-abstractions-lib-vehicleprovider-cs
    repo: unscience
    path: ksa-abstractions.lib/VehicleProvider.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/VehicleProvider.cs
    title: ksa-abstractions.lib/VehicleProvider.cs
  - id: ksa-ksa-vehiclesavedata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleSaveData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleSaveData.cs
    title: KSA.VehicleSaveData (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-vehicletemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleTemplate.cs
    title: KSA.VehicleTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-vehiclesave
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleSave.cs
    title: KSA.VehicleSave (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-defaultvehiclesaves
    repo: ksa-game-assemblies
    path: current/decomp/KSA/DefaultVehicleSaves.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DefaultVehicleSaves.cs
    title: KSA.DefaultVehicleSaves (decompiled, build 2026.10.10.5554)
  - id: ksarmory-src-ksarmory-ksa-testtarget-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/TestTarget.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/TestTarget.cs
    title: src/KSArmory/Ksa/TestTarget.cs
  - id: ksarmory-src-ksarmory-ksa-ksaworld-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KsaWorld.cs
    title: src/KSArmory/Ksa/KsaWorld.cs
---
The game creates an EVA kitten in exactly one place: the private `EVADoor.CreateKittenEva`, called when the player presses an EVA door button. There is no public "spawn a kitten" API. A mod that wants kittens on demand (for a test range, a crowd, a rescue scenario) therefore replicates that method with the public eight-argument `KittenEva` constructor, or builds one from a saved craft that names a `Character`. The two reference mods differ in what they start from, and in how they keep the vehicle solver thread from corrupting the shape registry during construction. This topic also covers placing the kitten relative to another vessel, picking a character, and tracking and despawning spawned kittens safely.

## Engine background

| Type or member | Role | Source |
|---|---|---|
| `EVADoor.CreateKittenEva(vehicle, seat, rosterEntry)` (private) | Backpack part, `new KittenEva(...)`, orbit from the host's state vectors, `Teleport`, `Parent.Children.Add`, `UpdatePerFrameData` | [current/decomp/KSA/EVADoor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoor.cs#L196-L229) |
| `EVADoor.GetBackPackPart` (private) | `KittenBackPackPart` template, `new Part`, `CreateOwnTree`, tank setup, `RefillConsumables` | [current/decomp/KSA/EVADoor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoor.cs#L295-L312) |
| `KittenEva(CelestialSystem, string characterId, doubleQuat body2Cce, double3 bodyRates, IParentBody, string id, Part root, Orbit)` | Public constructor; creates the `KittenRenderable` after the base `Vehicle` constructor has registered the vehicle | [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L78-L83) |
| `KittenEva.CreateKittenEva(system, VehicleTemplate, parent, id)` | Public static factory used for a saved craft that names a `Character` | [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L85-L98) |
| `Orbit.CreateFromStateCci` | Builds the spawn orbit from a parent, a state time, a CCI position and velocity | [current/decomp/KSA/Orbit.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs#L1611) |
| `EVADoor` spawn buffering | The stock door queues an `EvaSpawnData` in `InputEvents.EvaSpawnBuffer`, drained by `ApplyInputEvents` in the input phase | [current/decomp/KSA/InputEvents.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InputEvents.cs#L35-L51), [current/decomp/KSA/InputEvents.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InputEvents.cs#L1114-L1122) |
| `ConstraintSim.UnlockShapesBlocking`, `JobSystems.VehicleSolver.Wait` | Two ways a mod can wait out the vehicle worker, which holds the Bepu shape registry for its whole step | [current/decomp/KSA/ConstraintSim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConstraintSim.cs#L135-L153), [current/decomp/KSA/JobSystems.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/JobSystems.cs#L14-L40) |
| `Vehicle.Dispose`, `CelestialSystem.Deregister` | Removal; `Deregister` moves the last list element into the freed slot | [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3770-L3798), [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L93-L100) |

Three engine facts shape every approach:

- **Construction touches physics.** `new Vehicle(...)` (and so `new KittenEva(...)`) mutates the shared Bepu shape registry, which the vehicle worker locks for the whole of its step. A spawn from the UI pass or a post-frame hook can land inside that step, so it must either wait for the worker or stage the spawn to the frame sync point ([change vehicles without racing the solver](../../../vehicles-and-parts/vehicles/change-vehicles-without-racing-the-solver/overview.md)).
- **Registration happens early.** The `Astronomical` base constructor registers the vehicle in the system before `KittenEva` finishes building its renderable; if the renderable then throws, a half-built kitten stays registered and must be removed again.
- **A kitten is only simulated once it has an orbit and a parent.** The orbit comes from a CCI state vector at a state time, and `parent.Children.Add` puts it in the parent's child list so the system walks it each frame.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Replicate `EVADoor.CreateKittenEva` with the public constructor, place it beside a vehicle, track and despawn it](spawn-an-eva-kitten-from-code-1.md) | unscience (doh) | `reflection` | `frame:draw-ui` | Reflects `ModLibrary.AllParts` and `AllCharacters`; waits on `JobSystems.VehicleSolver`; full registry and cleanup |
| [2. Build a `KittenEva` from a saved craft that names a `Character`](spawn-an-eva-kitten-from-code-2.md) | KSArmory | `vehicle-spawn` | `frame:draw-ui` | Backpack and tanks come from the save; holds `ConstraintSim.UnlockShapesBlocking` around construction |

## See also

- [Read and extend the character asset XML](../define-a-kitten-character-in-asset-xml/overview.md), [Reach a kitten's avatar, skeleton, bones and animation catalog](../reach-a-kittens-avatar-and-skeleton/overview.md)
- [Change vehicles without racing the solver](../../../vehicles-and-parts/vehicles/change-vehicles-without-racing-the-solver/overview.md), [Spawn a vehicle at runtime](../../../vehicles-and-parts/vehicles/spawn-a-vehicle-at-runtime/overview.md), [Add crew seats and EVA doors](../../../vehicles-and-parts/parts/add-crew-seats-and-eva-doors/overview.md)
- [Teleport a vessel by building a new orbit](../../../physics/kinematics/teleport-a-vessel-by-building-a-new-orbit/overview.md), [Understand KSA coordinate frames and epochs](../../../flight-and-orbits/flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md), [Make a vehicle indestructible](../../../vehicles-and-parts/vehicles/make-a-vehicle-indestructible/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Tracking which craft carry your part, classifying them and detecting staging and loss](../../../vehicles-and-parts/craft-tracking/track-and-classify-craft/overview.md) - related topic

