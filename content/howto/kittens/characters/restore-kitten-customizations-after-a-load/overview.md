---
type: Game Feature
title: Restore kitten colours, clips and tuning after a save load
description: Why every mod-held reference to a kitten is dead after a native load and three ways unscience captures per-kitten state against vehicle ids and rebinds it to the restored KittenEva objects
topic: restore-kitten-customizations-after-a-load
category: kittens
group: characters
approaches: 3
game_types: [KSA.KittenEva, KSA.GpuObjectAssetRef, KSA.KittenLocomotionTuning, KSA.BoneAnimRuntime, KSA.VehicleSave, KSA.Universe, KSA.CelestialSystem]
lifecycle: [event:save, event:load, frame:prepare]
demonstrated_by: [mods/unscience/features/doh-runtime-gpu-materials, mods/unscience/features/humble-arteest-kitten-color, mods/unscience/features/kitten-animations-locomotion-tuning, mods/unscience/features/kitten-animations-forced-clip-playback]
tags: [kitten, save, load, persistence, materials, animation, rebind]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:38Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: KSA.Universe (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: KSA.CelestialSystem (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenlocomotiontuning
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenLocomotionTuning.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotionTuning.cs
    title: KSA.KittenLocomotionTuning (decompiled, build 2026.10.10.5554)
  - id: unscience-doh-lib-dohsubmod-persistence-cs
    repo: unscience
    path: doh.lib/DohSubmod.Persistence.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/DohSubmod.Persistence.cs
    title: doh.lib/DohSubmod.Persistence.cs
  - id: unscience-doh-lib-spawning-kittenspawner-materials-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.Materials.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.Materials.cs
    title: doh.lib/Spawning/KittenSpawner.Materials.cs
  - id: ksa-ksa-materialdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/MaterialData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MaterialData.cs
    title: KSA.MaterialData (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-gpuobjectsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GpuObjectSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuObjectSystem.cs
    title: KSA.GpuObjectSystem (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-assetmanager
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetManager.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetManager.cs
    title: KSA.AssetManager (decompiled, build 2026.10.10.5554)
  - id: unscience-humble-arteest-lib-kittencolor-persistence-cs
    repo: unscience
    path: humble-arteest.lib/KittenColor.Persistence.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/KittenColor.Persistence.cs
    title: humble-arteest.lib/KittenColor.Persistence.cs
  - id: unscience-humble-arteest-lib-kittencolor-cs
    repo: unscience
    path: humble-arteest.lib/KittenColor.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/KittenColor.cs
    title: humble-arteest.lib/KittenColor.cs
  - id: unscience-ksa-abstractions-lib-persistence-materialcolorstate-cs
    repo: unscience
    path: ksa-abstractions.lib/Persistence/MaterialColorState.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/Persistence/MaterialColorState.cs
    title: ksa-abstractions.lib/Persistence/MaterialColorState.cs
  - id: ksa-ksa-boneanimruntime
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BoneAnimRuntime.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BoneAnimRuntime.cs
    title: KSA.BoneAnimRuntime (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-animatedrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AnimatedRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AnimatedRenderable.cs
    title: KSA.AnimatedRenderable (decompiled, build 2026.10.10.5554)
  - id: unscience-kitten-animations-lib-kittenanimationssubmod-persistence-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
    title: kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
  - id: unscience-kitten-animations-lib-kittenplaybackphase-cs
    repo: unscience
    path: kitten-animations.lib/KittenPlaybackPhase.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenPlaybackPhase.cs
    title: kitten-animations.lib/KittenPlaybackPhase.cs
  - id: unscience-kitten-animations-lib-savedanimationtuning-cs
    repo: unscience
    path: kitten-animations.lib/SavedAnimationTuning.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/SavedAnimationTuning.cs
    title: kitten-animations.lib/SavedAnimationTuning.cs
  - id: unscience-kitten-animations-lib-kittenanimationdriver-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationDriver.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationDriver.cs
    title: kitten-animations.lib/KittenAnimationDriver.cs
---
KSA's own saves own the kittens. A mod that tints a kitten, forces a clip on it or tunes how it walks has changed objects that a load destroys: `Universe.DeserializeSave` destroys every vehicle and rebuilds each kitten from the save data with `KittenEva.CreateKittenFromSaveData`, so the `KittenEva`, its `KittenRenderable`, its `CharacterAvatar` and every array reached through it are brand new objects. The mod must therefore save its own state next to the native save, keyed by something the native save preserves (the vehicle id), and bind it back to the new objects after the world is rebuilt. It must never respawn replacement kittens or trust GPU handles or process-local names. This topic compares three such records in unscience.

## Engine background

- **What a load does.** `Universe.DeserializeSave(UniverseData)` zeroes the simulation speed, waits for all jobs, calls `CurrentSystem.DestroyAllVehicles()`, then `CurrentSystem.DeserializeSave`, which creates vehicles from the save and, for a vehicle with a non-empty `Character`, calls `KittenEva.CreateKittenFromSaveData`. The roster (`KittenRoster`) is replaced from the save too ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2430-L2480), [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L696-L709), [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L101-L108)).
- **What survives.** Process-global state is not touched: the GPU material system and its asset map (renderer-owned materials, a fixed-size pool), `KittenLocomotionTuning.Current` (a public static struct field) and any static in the mod. The `KittenEva` ids are saved with the vehicle, so they are the stable identity ([current/decomp/KSA/KittenLocomotionTuning.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotionTuning.cs#L147-L149)).
- **What does not.** Every `KittenEva`, renderable, avatar, `AnimProcessors` entry, forced-clip binding, `MaterialIndices` array and `BoneAnimRuntime` clock.
- **Timing.** A mod that wants a safe reset-and-restore cannot run inside the native load. The three features use unscience's scene-save coordinator: a save-participant records state when the native save is populated (`event:save`), the host defers a load to the `PrepareFrame` handoff, publishes `Resetting` before the old world is destroyed and `Restoring` after the new one is built (`event:load`, `frame:prepare`), and each participant validates its saved state before anything is destroyed ([the coordinator feature](../../../../mods/unscience/features/lib-scene-save-coordinator.md), [the native hooks feature](../../../../mods/unscience/features/lib-native-save-hooks.md)). The three articles below are the participants; the shared pattern is `Capture`, `Validate`, `Reset`, `Restore`.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Rebind cloned material sets to restored kittens by vehicle id](restore-kitten-customizations-after-a-load-1.md) | unscience (doh) | `save-sidecar` | `event:save`, `event:load`, `frame:prepare` | Keeps live GPU sets in a cache across the reset; claims one set per kitten; releases the rest |
| [2. Identity-checked colour restore by material name](restore-kitten-customizations-after-a-load-2.md) | unscience (Humble Arteest) | `save-sidecar` | `event:save`, `event:load` | Names, not handles; restores only colours whose asset object is still the one written |
| [3. Scene-save record with clip label, source and phase](restore-kitten-customizations-after-a-load-3.md) | unscience (Kitten Animations) | `save-sidecar` | `event:save`, `event:load`, `frame:prepare` | Twenty tuning fields, forced clip matched by exact source and label, clip clock and latched expression restored |

## See also

- [Tint kitten fur, body and eyes, and hide the visor, helmet or MMU](../../appearance/tint-and-restyle-kitten-appearance/overview.md)
- [Force a kitten to play a chosen clip](../../animation/play-a-specific-kitten-animation-clip/overview.md)
- [Kitten locomotion, modes and the servo, from the decompiled game](../../eva/kitten-locomotion-and-servo-reference/overview.md)
- [Reach a kitten's avatar, skeleton, bones and animation catalog](../reach-a-kittens-avatar-and-skeleton/overview.md), [Spawn an EVA kitten from code](../spawn-an-eva-kitten-from-code/overview.md)
- [Make a vehicle indestructible](../../../vehicles-and-parts/vehicles/make-a-vehicle-indestructible/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Store per-save mod data next to a KSA save and notice when the player saves](../../../persistence/saves/save-mod-state-with-the-game-save/overview.md) - related topic

