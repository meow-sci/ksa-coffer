---
type: Game Feature
title: Mount a camera on a vessel part and look through it
description: Posing a secondary or main camera from a sub-part's transform so it rides a nose, mast or turret, including scaled and articulated parts and mounts that survive staging
topic: mount-a-camera-on-a-part
category: camera
group: secondary-viewports
approaches: 3
game_types: [KSA.Part, KSA.Vehicle, KSA.Camera, KSA.IGameViewport, KSA.FixedController]
lifecycle: [frame:viewports, frame:draw-ui, frame:render]
demonstrated_by: [mods/unscience/features/hot-pursuit-part-mounted-cameras, mods/unscience/features/hot-pursuit-mesh-ray-placement, mods/ksarmory/features/optical-director-heads, mods/ksarmory/features/director-camera-window]
tags: [camera, part, mount, matrix, picking]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:20:07Z }
repos:
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
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
  - id: ksa-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: KSA.Part (decompiled, build 2026.10.10.5554)
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: KSA.Camera (decompiled, build 2026.10.10.5554)
---
A part-mounted camera needs three things: where on the part (a point and a direction in the part's own frame), the part's current transform (vehicle matrix times the sub-part chain, in the right space) and a way to find the part again when the vessel changes. The engine supplies the
matrices and the raycast; the mod supplies the mount, the pose and the identity.

## Engine background

| Type | Role | Source |
|---|---|---|
| `Vehicle.GetMatrixAsmb2Ego(camera)` | Vessel assembly to camera-relative ego space | [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L1270-L1273) |
| `Part.MatrixAsmb2Ego`, `RayCastEgo`, `InstanceId`, `SubParts` | Sub-part chain with scale; mesh raycast; a runtime id | [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1213-L1224), [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L2534-L2572) |
| `Camera.EgoToEcl`, `LookAtRotation` | Ego to ecliptic; orientation | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L222-L226), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L203-L209) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Part-relative pose from `Asmb2Ego` matrices in a `FixedController.OnFrame` prefix](mount-a-camera-on-a-part-1.md) | unscience (Hot Pursuit) | `harmony-prefix` | `frame:viewports` | Exact on scaled and articulated parts; a Harmony patch |
| [2. Optical head sub-part for the main view or a camera window](mount-a-camera-on-a-part-2.md) | KSArmory | `direct-camera-write` | `frame:viewports`, `frame:draw-ui` | Mount on a part the mod drives; needs caller-supplied platform positions |
| [3. Click a hull point and store it in the hit sub-part's local frame](mount-a-camera-on-a-part-3.md) | unscience (Hot Pursuit) | `imgui-drawlist` | `frame:draw-ui`, `frame:viewports` | Mesh-precise placement; vessel parts only, ids not stable across loads |

## See also

- [Lease a secondary viewport for a mod camera and show it in a window](../borrow-a-secondary-viewport/overview.md), [Aim a secondary viewport camera, rebuild its matrices and give it its nearby body](../aim-a-secondary-viewport-camera/overview.md), [Keeping an anchor on a part across staging, docking, editor changes and saves](../../../vehicles-and-parts/part-geometry/anchor-to-parts-across-vehicle-changes/overview.md)
- [Ray cast against part meshes and terrain, from the cursor or any origin](../../../physics/mod-simulation/ray-cast-against-vessel-meshes-and-terrain/overview.md), [Pick the vessel, part, world quad or terrain point under the cursor](../../../ui/input/pick-objects-under-the-cursor/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
