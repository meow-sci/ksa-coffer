---
type: Game Feature
title: "Move a planet or moon at runtime by swapping its orbit or changing its parent"
description: "Bodies are on rails, so moving one means giving it a new Orbit at a moment the orbit solver will pick it up, then repairing the Children lists, cached transforms and subtree by hand; and restoring the original orbit afterwards"
topic: move-or-reparent-a-celestial-body
category: celestials
group: systems-and-stars
approaches: 2
game_types: [KSA.Celestial, KSA.IParentBody, KSA.IOrbiter, KSA.Orbit, KSA.CelestialSystem, KSA.Vehicle, KSA.PatchedConic, KSA.FlightPlan, KSA.StateVectors, KSA.Universe, KSA.CelestialUpdateTask, KSA.UniverseTime, KSA.GameSave]
lifecycle: [frame:dispatch-solvers, event:load, frame:draw-ui, event:save]
demonstrated_by: [mods/unscience/features/kiwis-marbles-cross-parent-reparenting, mods/unscience/features/kiwis-marbles-celestial-welding]
tags: [celestial, orbit, reparent, children, setorbit, solver, weld]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:33Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-game-assemblies-current-decomp-ksa-celestial-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA/Celestial.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-celestialupdatetask-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialUpdateTask.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialUpdateTask.cs
    title: "KSA/CelestialUpdateTask.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-iparentbody-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IParentBody.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs
    title: "KSA/IParentBody.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-orbit-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Orbit.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs
    title: "KSA/Orbit.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA/Program.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA/Universe.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)"
---
Celestial bodies are on rails: each frame an orbit worker propagates the body's `Orbit` and `Universe.ApplyOrbitSolvers` copies the result back. Moving a body therefore means giving it a new `Orbit` at a moment the worker will pick up. `Celestial.SetOrbit` alone is a bare property assignment: it leaves the old and new parents' `Children` lists, cached transforms, sphere of influence and rank stale. KSA re-parents only vessels automatically.

## Engine background

- `Celestial.SetOrbit(Orbit newOrbit)` is `Orbit = newOrbit` and nothing else ([current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L149-L152)); `Parent` follows `Orbit.Parent`. `SphereOfInfluence` and `Rank` are set once in the constructor ([current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L208-L218)).
- Cached frames are refreshed by `Celestial.UpdatePerFrameData` ([current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L591-L606)) through `IParentBody.UpdatePerFrameDataTree`, which walks `Children` ([current/decomp/KSA/IParentBody.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs#L110-L121)); `CelestialSystem.UpdatePerFrameData` is called at the end of `Universe.ApplyVehicleSolvers` ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1950)).
- Vessels do get the list fix-up: `Vehicle.SetFlightPlan` calls `ApplyPendingParentChildrenFix`, which removes the vessel from the previous parent's `Children` and adds it to the new one ([current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L632-L647)). There is no equivalent for celestials.
- The orbit worker does not copy the orbit when queued: `CelestialUpdateTask.DoWorkAndStageResults` reads the celestial's `Orbit` when the worker runs, and the next frame `Celestial.UpdateFromTaskResults` writes the result into whatever `Orbit` the body has then ([current/decomp/KSA/CelestialUpdateTask.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialUpdateTask.cs#L52-L80), [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L1529)).
- `Orbit.CreateFromStateCci(parent, stateTime, positionCci, velocityCci, orbitLineColor)` builds an orbit from state vectors around a parent ([current/decomp/KSA/Orbit.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs#L1611)).
- Order in `Program.PrepareFrame`: waits, `ApplyOrbitSolvers`, `ApplyVehicleSolvers`, `ApplyClothSolvers`, then `GetJobSimStep`, `ExecuteNextClothSolvers`, `ExecuteNextVehicleSolvers`, `ExecuteNextOrbitSolvers` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2150-L2225)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: SetOrbit plus manual Children surgery and subtree refresh, with cycle guards on replay](move-or-reparent-a-celestial-body-1.md) | unscience | `celestial-reparenting` | `frame:dispatch-solvers`, `event:load` | Documents exactly which state `SetOrbit` does and does not update |
| [2: first-priority prefix builds a fresh orbit from the target's state vectors](move-or-reparent-a-celestial-body-2.md) | unscience | `harmony-prefix` | `frame:dispatch-solvers`, `frame:draw-ui`, `event:save`, `event:load` | The only window where a swap is not overwritten; chains need ordering |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Enumerate star systems and bodies](../../../celestials/systems-and-stars/enumerate-star-systems-and-bodies/overview.md), [Mutate vehicles at a physics-safe point](../../../physics/solver/mutate-vehicles-at-a-physics-safe-point/overview.md)
- [Teleport a vessel by building a new orbit](../../../physics/kinematics/teleport-a-vessel-by-building-a-new-orbit/overview.md), [Save mod state with the scene](../../../persistence/saves/save-mod-state-with-the-scene/overview.md)
- [Enumerate every star system, star, planet and moon of the loaded universe](../enumerate-star-systems-and-bodies/overview.md) - related topic

