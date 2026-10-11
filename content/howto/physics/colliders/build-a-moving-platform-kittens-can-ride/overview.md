---
type: Game Feature
title: Build a moving platform or elevator kittens can ride
description: How a mod moves a collider-only static object by rewriting its template GroundOffset each simulated step under the contact recovery speed, and wakes sleeping riders so they follow
topic: build-a-moving-platform-kittens-can-ride
approaches: 1
game_types: [KSA.StaticObject, KSA.ConstraintSim, KSA.KittenEva]
lifecycle: [frame:dispatch-solvers, frame:draw-ui, physics:bepu]
demonstrated_by: [mods/ksastructures/features/lift-moving-landmark]
tags: [physics, bepu, platform, elevator, static-object, ground-offset, kittens, rails, wake]
category: physics
group: colliders
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T18:11:45Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-constraintsim
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConstraintSim.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConstraintSim.cs
    title: "KSA.ConstraintSim (decompiled, build 2026.10.10.5554)"
  - id: ksa-staticobject
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObject.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs
    title: "KSA.StaticObject (decompiled, build 2026.10.10.5554)"
  - id: ksa-narrowphasecallbacks
    repo: ksa-game-assemblies
    path: current/decomp/KSA/NarrowPhaseCallbacks.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/NarrowPhaseCallbacks.cs
    title: "KSA.NarrowPhaseCallbacks (decompiled, build 2026.10.10.5554)"
---

Bepu statics do not move, but a static object's collider pose is recomputed every time a body updates its
launch-pad collider, from the template's `GroundOffset`. Rewriting that one number every step is therefore a way to
move a floor: no rigid body, no joints. The rider is carried by contact alone, which sets two rules (stay under the
contact recovery speed, and keep the rider awake) and one trap (writes to a rider's state only survive from a
`Vehicle.PrepareWorker` prefix).

## Engine background

| Piece | Role |
|---|---|
| `ConstraintSim.UpdateStaticObjectCollider` [current/decomp/KSA/ConstraintSim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConstraintSim.cs#L584-L633) | Places a body's launch-pad collider at `positionCcf + upCcf * staticObject.GroundOffset`, reading `GroundOffset` each time it updates the static's description |
| `StaticObject.GroundOffset` [current/decomp/KSA/StaticObject.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs#L29-L29) | `Template.GroundOffsetMeters`; the template is shared by every user of that static object |
| `ConstraintSim.UpdateSimFromVehicle` [current/decomp/KSA/ConstraintSim.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConstraintSim.cs#L386-L392) | Calls `UpdateStaticObjectCollider` only for a body that is not on rails |
| `NarrowPhaseCallbacks.ConfigureContactManifold` [current/decomp/KSA/NarrowPhaseCallbacks.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/NarrowPhaseCallbacks.cs#L174-L179) | `MaximumRecoveryVelocity = 1.5f` for every pair: a floor moving faster than that does not push a rider up by contact, it passes through |

The pad rule matters too: each body collides with only the nearest launch pad within 300 m
([static objects](../add-static-colliders-to-physics-bubbles/add-static-colliders-to-physics-bubbles-3.md)), so a moving
floor is its own landmark a few metres from the building. A kitten standing still goes to sleep (on rails) and its
copy of the collider stops following `GroundOffset`, so the platform must wake riders. See the
[lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Trade-off |
|---|---|---|---|
| [Rewrite `GroundOffset` of a dedicated launch-pad object](build-a-moving-platform-kittens-can-ride.md) | KSAStructures | harmony-prefix | No physics objects and no joints; speed capped at 1.5 m/s, one static object per platform, and a rider-carry prefix on `PrepareWorker` |

## See also

- [Add mod-owned static colliders](../add-static-colliders-to-physics-bubbles/overview.md)
- [Mutate vehicles at a physics-safe point](../../solver/mutate-vehicles-at-a-physics-safe-point/overview.md)
