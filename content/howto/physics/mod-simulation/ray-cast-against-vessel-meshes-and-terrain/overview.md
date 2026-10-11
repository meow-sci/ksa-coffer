---
type: Game Feature
title: Ray cast against part meshes and terrain, from the cursor or any origin
description: How a mod casts a ray or path segment against KSA's part meshes, kittens, cloth and the terrain height field, from the mouse cursor or from an arbitrary origin, to hit-test, place, launch or measure
topic: ray-cast-against-vessel-meshes-and-terrain
approaches: 6
game_types: [KSA.Part, KSA.Vehicle, KSA.Camera, KSA.Cursor, KSA.Celestial, KSA.ViewportPartPicker, KSA.Ray]
lifecycle: [frame:celestials, frame:after-on-frame, frame:draw-ui, frame:input]
demonstrated_by: [mods/ksarmory/features/hull-triangle-hit-test, mods/ksagolf/features/swept-hull-contact, mods/ksa-measuretools/features/part-mesh-raycast-picking, mods/unscience/features/hot-pursuit-mesh-ray-placement, mods/ksacars/features/craft-mover-mouse-pick-place, mods/unscience/features/graffiti-decal-placement-picking, mods/ksarmory/features/self-collision-travel-map]
tags: [physics, ray-cast, picking, cursor, mesh, terrain, height-field, hit-test]
category: physics
group: mod-simulation
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:26:55Z }
status: stable
repos:
  - name: KSA-MeasureTools
    git: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools.git
    ref: aed7f874f1c925c10c733b1dee72bd04b9b1985c
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: "KSA.Part (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksa-cursor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Cursor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Cursor.cs
    title: "KSA.Cursor (decompiled, build 2026.10.10.5554)"
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "KSA.Camera (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestial
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA.Celestial (decompiled, build 2026.10.10.5554)"
---

Several jobs reduce to "what does this ray hit first": a shell's path against a craft's hull, the mouse against a
vessel to place a camera, the mouse against the ground to put a craft down, a gun barrel against its own
superstructure. KSA has one engine-grade answer for part meshes, `Part.RayCastEgo`, and no general scene query for
terrain, so mods combine the part cast with a march over the terrain height field. This topic collects the six
solutions; the cursor-picking variants and the origin-chosen variants differ only in where the ray comes from.

## Engine background

| Piece | Role |
|---|---|
| `Part.RayCastEgo(ref readonly double4x4, Ray, out ...)` [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L2534-L2545) | Part bounding sphere, then each subpart's mesh bounding sphere, then a watertight per-triangle test over `MeshViewModule.MeshView.PositionCompare` (primitive 0 only). Returns near/far distance and, for the nearest, the hit and the stored vertex normal in assembly space plus the closest subpart |
| `Vehicle.GetMatrixAsmb2Ego(Camera)` / `(double3 bodyPositionEgo)` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L1270-L1281) | The matrix passed to `RayCastEgo`; the second overload takes a caller-chosen frame origin, so no camera is needed |
| `Cursor.GetEgoRay(IViewport)` [current/decomp/KSA/Cursor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Cursor.cs#L27-L30) | The cursor ray in the viewport camera's ego space, built on demand from this frame's camera |
| `Camera.ScreenToEgoRay` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L704-L713) | Screen pixels (camera framebuffer pixels) to a normalised ego ray |
| `Vehicle.UpdateHighlight` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2903-L2927) | The stock hover picker: the same `RayCastEgo` loop feeding `ViewportPartPicker.TryOffer` |
| `Celestial.GetTerrainHeightFromDirCce/Ccf` [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L777-L781) | The terrain height field; there is no engine terrain ray cast in this build, so mods walk it |

All six run on the main thread after `PrepareFrame`: part transforms are settled by `Universe.ApplyVehicleSolvers`
and the worker is stepping its own copy, so casts only read. Pick up mouse state from a `frame:draw-ui` hook
(`StarMapAfterGui`) or `frame:input`. See the
[lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Trade-off |
|---|---|---|---|
| [1: Round-centred ego origin and sphere broad phase](ray-cast-against-vessel-meshes-and-terrain-1.md) | KSArmory | engine-raycast | Path segments with no camera, at metre scale; engine behaviour and cost are the limit |
| [2: Cursor ray against every vehicle, plus the stock hover picker](ray-cast-against-vessel-meshes-and-terrain-2.md) | KSA-MeasureTools, unscience | mesh-raycast | Exact hit with subpart and local point; linear in triangles, so gate by projected size |
| [3: Per-triangle cast in a mover-centred frame with no camera](ray-cast-against-vessel-meshes-and-terrain-3.md) | KSAGolf | ray-cast | The narrow phase for a small mover hitting a craft; not called by the shipping mod |
| [4: Walk the ray over the height field in bounded steps](ray-cast-against-vessel-meshes-and-terrain-4.md) | KSACars | ray-cast | Terrain pick under the cursor; walks the field rather than intersecting a sphere |
| [5: Layered cast over cloth, part meshes, kitten sphere and a terrain march](ray-cast-against-vessel-meshes-and-terrain-5.md) | unscience | ray-cast | Ordered fallback for anchoring decals; each layer is its own code |
| [6: Frame-budgeted sweeps of the craft's own geometry](ray-cast-against-vessel-meshes-and-terrain-6.md) | KSArmory | coarse-to-fine-sampling | Measures actuator travel limits without hand-authoring; cost is budgeted across frames |

## See also

- [Detect hits for fast bodies without tunnelling](../prevent-tunnelling-of-fast-bodies/overview.md)
- [Simulate bodies outside the vehicle system](../simulate-bodies-outside-the-vehicle-system/overview.md)
- [Place a vessel on a surface at a latitude and longitude](../../kinematics/place-a-vessel-on-a-surface-at-latitude-and-longitude/overview.md)
- [Teleport a vessel by building a new orbit](../../kinematics/teleport-a-vessel-by-building-a-new-orbit/overview.md), which uses these casts to pick a launch target
- The topics query-terrain-height-and-line-of-sight, get-part-points-in-vehicle-and-world-frames, define-and-animate-subparts, choose-a-render-frame-and-anchor-effects and pick-objects-under-the-cursor (other batches) cover the surrounding material
- [Query the terrain height field and test line of sight across terrain](../../../celestials/terrain/query-terrain-height-and-line-of-sight/overview.md) - related topic
- [Part meshes, attach nodes and part-local points in vehicle, world and screen space](../../../vehicles-and-parts/part-geometry/get-part-points-in-vehicle-and-world-frames/overview.md) - related topic
- [Defining articulated subparts and animating or hiding them from code](../../../vehicles-and-parts/parts/define-and-animate-subparts/overview.md) - related topic
- [Choose a render frame and anchor effects to bodies, parts and terrain](../../../rendering/overlays/choose-a-render-frame-and-anchor-effects/overview.md) - related topic
- [Pick the vessel, part, world quad or terrain point under the cursor](../../../ui/input/pick-objects-under-the-cursor/overview.md) - related topic

