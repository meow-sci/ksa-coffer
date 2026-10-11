---
type: Submod
title: "Garry's Torch"
description: "Welds one vessel to a part of another by re-teleporting it every physics handoff, with per-axis part scaling, scoped collision suppression, eased animations, presets and a public API"
mod: unscience
submod: garrys-torch
mod_id: garrys-torch
tags: [welding, teleport, scaling, collisions, bepu, animation]
categories: [physics, vehicles-and-parts]
features: [mods/unscience/features/garrys-torch-per-axis-part-scaling, mods/unscience/features/garrys-torch-scoped-collision-suppression, mods/unscience/features/garrys-torch-vehicle-welding, mods/unscience/features/garrys-torch-weld-animation-and-presets]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T04:26:03Z }
status: stable
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: garrys-torch-readme-md
    repo: unscience
    path: garrys-torch/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/README.md
    title: garrys-torch/README.md
  - id: garrys-torch-mod-overview-md
    repo: unscience
    path: garrys-torch/MOD_OVERVIEW.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/MOD_OVERVIEW.md
    title: garrys-torch/MOD_OVERVIEW.md
  - id: garrys-torch-lib-readme-md
    repo: unscience
    path: garrys-torch.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch.lib/README.md
    title: garrys-torch.lib/README.md
  - id: garrys-torch-tests-readme-md
    repo: unscience
    path: garrys-torch.tests/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch.tests/README.md
    title: garrys-torch.tests/README.md
  - id: scope-vehicle-physics-md
    repo: unscience
    path: scope/vehicle-physics.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md
    title: scope/vehicle-physics.md
  - id: garrys-torch-mod-toml
    repo: unscience
    path: garrys-torch/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/mod.toml
    title: garrys-torch/mod.toml
  - id: garrys-torch-mod-cs
    repo: unscience
    path: garrys-torch/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/Mod.cs
    title: garrys-torch/Mod.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
  - id: ksa-abstractions-lib-vehiclescaleownership-cs
    repo: unscience
    path: ksa-abstractions.lib/VehicleScaleOwnership.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/VehicleScaleOwnership.cs
    title: ksa-abstractions.lib/VehicleScaleOwnership.cs
---

Garry's Torch welds a source vessel to a target vessel, anchored to a chosen target part, by
teleporting the source every frame onto an orbit that places it at a position and rotation offset
from the anchor. The update runs as a `PhysicsFrameHook.BeforePhysics` callback in
`Program.PrepareFrame`, stamped with `SimStep.PreviousTime`; this replaced an older UI-time update that
lost actuator results. Sources can be scaled per axis with exact restoration (kitten avatars
included), and welded sources are collision-free by default through scoped Bepu shape removal around
`ConstraintSim` passes. Other mods can drive it through `GarrysTorchSubmod.Instance`
(`CreateWeld`, `ModifyWeld`, `RemoveWeld`, `FindWeld`, `AnimateWeld`, preset methods).

## Hosting

- Manifest id `garrys-torch`, entry assembly `MeowSci.GarrysTorch` (development host only).
- Standalone host: F11 toggles "Garry's Torch"; its Patcher applies `HotkeyGuard`, `GarrysTorchPatches`
  (which installs `WeldCollisionPatches` and the shared `PhysicsFrameHook` and subscribes the weld
  update) and `KittenScalePatches`.
- In unscience the same two patch classes are applied by `unscience/Patcher.cs`.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Non-cumulative per-axis part scaling with captured baselines](../features/garrys-torch-per-axis-part-scaling.md) | vehicles-and-parts | `frame:draw-ui`, `frame:prepare`, `frame:render` | Garry's Torch multiplies each full part's captured Part.Scale by independent XYZ factors, lets sub-parts inherit, restores the originals on unweld, extends kitten avatars to XYZ with a Harmony postfix and excludes Godzilla through VehicleScaleOwnership |
| [Per-vessel collision suppression by bracketing ConstraintSim passes](../features/garrys-torch-scoped-collision-suppression.md) | physics | `frame:prepare`, `physics:vehicle-solver`, `physics:bepu` | Garry's Torch removes welded sources from Bepu broad-phase collision for the duration of each ConstraintSim.DetectCollisions and Simulate call with a prefix that calls BodyReference.SetShape(default) and a finalizer that restores the exact shape |
| [Part-anchored vehicle welding by per-frame teleport at the physics handoff](../features/garrys-torch-vehicle-welding.md) | physics | `frame:prepare`, `frame:draw-ui` | Garry's Torch holds a source vessel at a fixed offset from a part on a target vessel by teleporting it every frame from a PhysicsFrameHook.BeforePhysics callback stamped with SimStep.PreviousTime |
| [Eased weld animation queues and TOML weld presets](../features/garrys-torch-weld-animation-and-presets.md) | physics | `frame:prepare`, `frame:draw-ui` | Garry's Torch interpolates weld offset, rotation and XYZ scale with eased per-weld animation queues advanced at the physics handoff in player time, and stores reusable weld settings as named presets in a Tomlyn TOML file with legacy-key migration |

## Library classes

`GarrysTorchSubmod` (weld list, UI, public API), `GarrysTorchPatches`, `WeldEngine` (pose, teleport,
topological sort, per-vessel scale snapshots), `WeldEntry`, `WeldScale`, `WeldScaleSnapshot`,
`KittenScalePatches` (shared with Godzilla), `WeldCollisionPatches`, `WeldAnimation`,
`WeldAnimationManager`, `PresetManager`, `WeldPreset`; shared `ksa-abstractions.lib/VehicleScaleOwnership.cs`.

## Scene saves and persistence

Participant `garrys-torch`, version 1: per weld the source and target ids, the target part as a
structural saved part reference, position, rotation, XYZ scale, lock, collisions, enabled flag, active
and queued animations with elapsed time, and the original full-part scale baseline (plus kitten avatar
scalar) so reloads do not compound scale. Validation rejects duplicate sources and cyclic weld graphs.
Presets are a separate global file, `.unscience/garrys-torch-presets.toml`.

## Further reading

- [garrys-torch/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/README.md)
- [garrys-torch/MOD_OVERVIEW.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/MOD_OVERVIEW.md)
- [garrys-torch.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch.lib/README.md)
- [garrys-torch.tests/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch.tests/README.md)
- [scope/vehicle-physics.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md)

## Entry points

- [garrys-torch/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/mod.toml)
- [garrys-torch/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/garrys-torch/Mod.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs)
- [ksa-abstractions.lib/VehicleScaleOwnership.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/VehicleScaleOwnership.cs)

## See also

- [unscience overview](../overview.md)
- [Godzilla](./godzilla.md) (shares scale ownership and kitten scale patches)
- [Kiwi's Marbles](./kiwis-marbles.md) (the same idea for celestial bodies)
