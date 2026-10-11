---
type: Submod
title: Kitchen Sink
description: "A grab bag of small KSA fixes: per-vessel G-load invincibility, a free-flying IVA camera, a see-into-the-capsule rendering experiment, forced IVA interior rendering and an editor refresh for invisible sub-parts"
mod: unscience
submod: kitchen-sink
mod_id: kitchen-sink
tags: [g-load, structural-failure, iva, camera, glass, rendering, editor, scene-saves]
categories: [camera, physics, rendering]
features: [mods/unscience/features/kitchen-sink-capsule-glass, mods/unscience/features/kitchen-sink-g-load-protection, mods/unscience/features/kitchen-sink-iva-camera-unlock]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T12:24:57Z }
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
  - id: kitchen-sink-readme-md
    repo: unscience
    path: kitchen-sink/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/README.md
    title: kitchen-sink/README.md
  - id: kitchen-sink-lib-readme-md
    repo: unscience
    path: kitchen-sink.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/README.md
    title: kitchen-sink.lib/README.md
  - id: kitchen-sink-tests-readme-md
    repo: unscience
    path: kitchen-sink.tests/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.tests/README.md
    title: kitchen-sink.tests/README.md
  - id: scope-ui-customization-md
    repo: unscience
    path: scope/ui-customization.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/ui-customization.md
    title: scope/ui-customization.md
  - id: scope-saves-md
    repo: unscience
    path: scope/saves.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/saves.md
    title: scope/saves.md
  - id: scope-vehicle-physics-md
    repo: unscience
    path: scope/vehicle-physics.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md
    title: scope/vehicle-physics.md
  - id: kitchen-sink-mod-toml
    repo: unscience
    path: kitchen-sink/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/mod.toml
    title: kitchen-sink/mod.toml
  - id: kitchen-sink-mod-cs
    repo: unscience
    path: kitchen-sink/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/Mod.cs
    title: kitchen-sink/Mod.cs
  - id: kitchen-sink-patcher-cs
    repo: unscience
    path: kitchen-sink/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/Patcher.cs
    title: kitchen-sink/Patcher.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
  - id: kitchen-sink-lib-cs
    repo: unscience
    path: kitchen-sink.lib/KitchenSinkLib.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/KitchenSinkLib.cs
    title: kitchen-sink.lib/KitchenSinkLib.cs
  - id: kitchen-sink-saves-cs
    repo: unscience
    path: kitchen-sink.lib/KitchenSinkSubmod.Saves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/KitchenSinkSubmod.Saves.cs
    title: kitchen-sink.lib/KitchenSinkSubmod.Saves.cs
  - id: ksa-part-tree
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTree.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs
    title: KSA.PartTree (decompiled, build 2026.10.10.5554)
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
---

Kitchen Sink is the monorepo's drawer of one-off fixes, each an independent section of one panel. The
documented mechanisms are a per-vessel exemption from KSA's whole-vehicle G-load destruction, a
free-flying IVA camera that keeps the stock IVA mode, and an experiment that hides the medium
capsule's opaque window models so the cabin shows through its glass. Two smaller switches have no
feature file of their own: **Always Render IVA Interiors**, a toggle over the shared
[IVA force-render helper](../features/lib-iva-force-render.md), and **Fix Invisible Subparts**,
described under Library classes below.

## Hosting

- Manifest id `kitchen-sink`, entry assembly `MeowSci.KitchenSink` (development host only; only the
  unscience supermod ships).
- Standalone host: F11 toggles a 540x440 "Kitchen Sink" window that draws
  `KitchenSinkSubmod.RenderContent`; `[StarMapBeforeGui]` calls `Update`. Its Patcher applies
  `HotkeyGuard`, `IvaForceRender`, `CapsuleGlassExperiment`, `GLoadProtectionPatches` and
  `IvaCameraUnlock`, and removes them in reverse on unload.
- In unscience, `KitchenSinkSubmod` is one entry in the supermod's sub-mod list, and
  `unscience/Patcher.cs` applies the same four feature patch sets (L87-L90), each in its own
  `TryApply` so one failing install does not block the others.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [See into the stock capsule by hiding its two opaque window models](../features/kitchen-sink-capsule-glass.md) | rendering | `frame:draw-ui`, `frame:render`, `event:save`, `event:load` | Kitchen Sink's See Inside Capsule experiment hides exactly the medium capsule's two window models through the shared part render filter and takes an IvaForceRender requirement so the cabin shows behind the existing IVA window glass |
| [Kitchen Sink G-load protection for exact vessel instances](../features/kitchen-sink-g-load-protection.md) | physics | `physics:vehicle-solver`, `frame:draw-ui`, `event:save`, `event:load` | Kitchen Sink exempts selected vessels from KSA's whole-vehicle G-load destruction only, with a guarded transpiler that filters the one StructuralLoad.GLoadFraction read in PhysicsBubble.DetectStructuralFailure via a concurrent registry |
| [Free-flying IVA camera by swapping the main viewport's IVA controller](../features/kitchen-sink-iva-camera-unlock.md) | camera | `frame:viewports`, `frame:input`, `frame:controller`, `frame:draw-ui`, `frame:render`, `event:save`, `event:load` | Kitchen Sink swaps the main viewport's IVAController for a subclass that delegates movement to a private FlyController in the vessel body frame, keeping IVA mode, audio, ray tracing and interiors while the camera leaves the seat |

## Library classes

`KitchenSinkSubmod` is a partial class split by feature: `KitchenSinkLib.cs` (lifecycle, Force IVA
Rendering and Fix Invisible Subparts sections), `KitchenSinkSubmod.GLoadProtection.cs`,
`KitchenSinkSubmod.IvaCamera.cs` and `KitchenSinkSubmod.Saves.cs`. Feature classes:
`GLoadProtection` and `GLoadProtectionPatches`; `IvaCameraUnlock` (with `IvaCameraUnlock.Persistence.cs`)
and `UnlockedIvaController`; `CapsuleGlassExperiment`. Shared helpers come from `ksa-abstractions.lib`:
`IvaForceRender`, `PartRenderFilter`, `VehicleProvider`, `HotkeyGuard` and the persistence types.

`Update` prunes the G-load registry and advances the IVA camera state every frame. The **Fix Invisible
Subparts** button ([kitchen-sink.lib/KitchenSinkLib.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/KitchenSinkLib.cs#L38-L58))
works around sub-parts that turn invisible in the vehicle editor. It takes
`Program.Editor?.EditingSpace?.Parts` and calls `PartTree.ReinitializeDerivedValues(oldStates)` with
the tree's own `States`. In build 5554 that clears modules and module states, re-adds modules and
static parts, re-adds the old states, and calls `RecomputeAllDerivedData`, which only does
`MarkDerivedDirty(DerivedData.All)`
([current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs#L425-L478)).
The rebuild itself happens at the next `PartTree.FlushDirtyDerived()` in `Program.PrepareFrame`
([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2218)),
so, as the README notes, the result appears one frame after the click.

## Scene saves and persistence

One `ISaveParticipantSource` exposes four records:

| Record | Payload | Order | Notes |
|---|---|---|---|
| `kitchen-sink` | `bool` | 20 | Legacy record kept for the Force IVA Rendering switch so older saves still restore it |
| `kitchen-sink-capsule-glass` | `bool` | 20 | Capsule experiment; replay requires the render patches |
| `kitchen-sink-g-load` | `string[]` of vehicle ids | 20 | Protected vessels; capture refuses ambiguous ids, replay rebinds through `VehicleProvider.FindVehicle` |
| `kitchen-sink-iva-camera` | camera DTO | 190 | Unlock state, base speed, seat part reference and module index, body-relative pose |

All four are version 1. Vanilla and older saves without a record reset that feature. The picker
filter, held input and controller objects are transient. There is no global settings file.

## Further reading

- [kitchen-sink/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/README.md)
- [kitchen-sink.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/README.md)
- [kitchen-sink.tests/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.tests/README.md)
- [scope/ui-customization.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/ui-customization.md) (Kitchen Sink section, G-load and editor integration points)
- [scope/saves.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/saves.md) (the four Kitchen Sink records)
- [scope/vehicle-physics.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md) (selective G-load protection)

## Entry points

- [kitchen-sink/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/mod.toml)
- [kitchen-sink/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/Mod.cs)
- [kitchen-sink/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink/Patcher.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs#L87-L90)
- [kitchen-sink.lib/KitchenSinkSubmod.Saves.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitchen-sink.lib/KitchenSinkSubmod.Saves.cs)

## See also

- [unscience overview](../overview.md)
- [The Tick](./the-tick.md) (full indestructibility on the same structural-failure detector)
- [IVA force-render helper](../features/lib-iva-force-render.md) and [part render filter](../features/lib-part-render-filter.md)
- [Scene save sidecar](../features/unscience-scene-save-sidecar.md)
