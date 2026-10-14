---
type: Game Feature
title: Adding crew seats and EVA doors to a part
description: How native seat and door modules are paired, and how a browser editor can author seat transforms
  and stable hatch references
topic: add-crew-seats-and-eva-doors
category: vehicles-and-parts
group: parts
approaches: 3
game_types:
  - KSA.IVASeat
  - KSA.EVADoor
  - KSA.EVADoorTemplate
  - KSA.KittenEva
  - KSA.Vehicle
  - KSA.PartTemplate
  - KSA.Vector3Reference
lifecycle:
  - startup:asset-load
  - frame:render
  - tool:authoring
  - tool:build
demonstrated_by:
  - mods/ksacars/features/seats-and-eva-doors
  - mods/ksastructures/features/office-furniture-craft
  - mods/flexo/features/iva-seat-authoring
tags:
  - seat
  - eva-door
  - iva
  - crew
  - kitten
  - boarding
status: stable
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:00:07Z
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ivaseat
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IVASeat.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs
    title: current/decomp/KSA/IVASeat.cs
  - id: ksa-kittenlocomotiontuning
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenLocomotionTuning.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotionTuning.cs
    title: current/decomp/KSA/KittenLocomotionTuning.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-evadoor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EVADoor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoor.cs
    title: current/decomp/KSA/EVADoor.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-evadoortemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/EVADoorTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoorTemplate.cs
    title: current/decomp/KSA/EVADoorTemplate.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: current/decomp/KSA/KittenEva.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-inputevents
    repo: ksa-game-assemblies
    path: current/decomp/KSA/InputEvents.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InputEvents.cs
    title: current/decomp/KSA/InputEvents.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-current-decomp-ksa-vector3reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vector3Reference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs
    title: current/decomp/KSA/Vector3Reference.cs
  - id: flexo-src-ksa-ivaseataxes
    repo: flexo
    path: src/ksa/ivaSeatAxes.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts
    title: src/ksa/ivaSeatAxes.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
---
Kittens sit only in a seat that belongs to a part, and leave a craft only through an EVA door. Both are plain
XML module templates, so a part mod can carry crew with no code. The two pieces are a seat (an `IVASeat` in the
part's game data) and a door (an `EVADoor` on a mesh-less hidden subpart), paired by the door's `SeatId`.

## Engine background

- **`IVASeat`** is a module whose template is `<IVASeat Id=...>` with `<Position>` (the kitten's **eye**
  point in part space), `<ForwardAxis>` (default `X=1`) and `<UpAxis>` (default `Z=-1`)
  [current/decomp/KSA/IVASeat.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs#L9-L27)[^ksa-ivaseat]. It is registered under `PartTemplate.Components` by its XML type name (see
  [Define a part with its own game data and GLB model](../define-a-part-with-game-data/overview.md)).
- **Seated placement.** The seated kitten is drawn at `GetSeatedModelPointAsmb(SeatedOffset)`; the default
  `KittenLocomotionTuning.SeatedOffset` is `(0, 0, -0.63)`, so the model origin sits 0.63 m below the eye along
  the seat's up [current/decomp/KSA/IVASeat.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs#L50-L56) [current/decomp/KSA/KittenLocomotionTuning.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotionTuning.cs#L220)[^ksa-kittenlocomotiontuning].
- **`EVADoor`** carries `SeatId`, creates its module from the template, and `ResolveAlignedSeats` pairs each
  door with the `IVASeat` whose `TemplateId` equals `SeatId` [current/decomp/KSA/EVADoor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoor.cs#L33-L61)[^ksa-evadoor] (template: [current/decomp/KSA/EVADoorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/EVADoorTemplate.cs#L5-L12)[^ksa-evadoortemplate].
- **Boarding.** A kitten on EVA can board only when the door subpart's origin is within 1 m:
  `KittenEva.CanBoardDoor` = `DoorHasSeat && DoorOffsetCce(host, door).Length() < 1.0`
  [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L888-L891)[^ksa-kitteneva]. The stock UI queues `InputEvents.EvaSpawnBuffer` / `KittenBoardBuffer`, drained in
  `ApplyInputEvents` [current/decomp/KSA/InputEvents.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InputEvents.cs#L1113-L1140)[^ksa-inputevents].
- **Drawing.** Seated crew are drawn by `Vehicle.UpdateSeatedCrewRenderData`, and only when the vehicle is
  `Program.ControlledVehicle` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3728-L3741)[^ksa-vehicle].

The browser approach authors part-level seats without a runtime hook. It converts stored Euler rotations to explicit forward/up vectors and separates internal editor identity from an intentional game-facing seat ID. [src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L24-L108) [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L539-L560)

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: seats in PartGameData, doors on hidden subparts](add-crew-seats-and-eva-doors-1.md) | KSACars | `xml-asset` | `startup:asset-load`, `frame:render` | multi-seat cars, eye offsets, door placement, one door per front seat |
| [2: the minimum viable seat and door](add-crew-seats-and-eva-doors-2.md) | KSAStructures | `xml-asset` | `startup:asset-load` | one seat and one door on a chair, one-part craft |
| [3: Author IVA seats and validate their transforms before exporting XML](add-crew-seats-and-eva-doors-3.md) | Flexo | `xml-asset`, `coordinate-conversion` | `tool:authoring`, `tool:build` | Position and aim seats visually, then export axis vectors; the preview does not simulate KSA crew, boarding or IVA camera control |

## See also

- [Define a part with its own game data and GLB model](../define-a-part-with-game-data/overview.md), `spawn-an-eva-kitten-from-code`, [Take control of another vehicle: switch the controlled craft or autopilot it from a mod](../../vehicles/take-control-of-another-vehicle/overview.md), `animate-and-draw-seated-kitten-crew` (drawing seated crew on craft that are not being flown)
- Mod features: [ksacars/seats-and-eva-doors](../../../../mods/ksacars/features/seats-and-eva-doors.md), [ksastructures/office-furniture-craft](../../../../mods/ksastructures/features/office-furniture-craft.md)
- [Spawn an EVA kitten from code](../../../kittens/characters/spawn-an-eva-kitten-from-code/overview.md) - related topic
- [Animate seated kittens, draw them on unflown craft and fly another craft from a chair](../../../kittens/animation/animate-and-draw-seated-kitten-crew/overview.md) - related topic

[^ksa-inputevents]: current/decomp/KSA/InputEvents.cs (decompiled, build 2026.10.10.5554)
[^ksa-kitteneva]: current/decomp/KSA/KittenEva.cs (decompiled, build 2026.10.10.5554)
[^ksa-evadoor]: current/decomp/KSA/EVADoor.cs (decompiled, build 2026.10.10.5554)
[^ksa-evadoortemplate]: current/decomp/KSA/EVADoorTemplate.cs (decompiled, build 2026.10.10.5554)
[^ksa-ivaseat]: current/decomp/KSA/IVASeat.cs (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)
[^ksa-kittenlocomotiontuning]: current/decomp/KSA/KittenLocomotionTuning.cs (decompiled, build 2026.10.10.5554)
