---
type: Game Feature
title: Build a local site frame and compute a launch window into a target plane
description: Build a local east-north-up frame at a surface site on a rotating body, get surface-relative velocity and terrain height in it, and find when a launch site passes under a target orbit plane and which azimuth to fly
topic: build-a-site-frame-and-compute-a-launch-window
category: flight-and-orbits
group: transfers
approaches: 4
game_types: [KSA.Orbit, KSA.StateVectors, KSA.IParentBody, KSA.InputEvents, KSA.Universe, KSA.Vehicle, KSA.Double3Ex, KSA.FlightComputerNavigation]
lifecycle: [frame:dispatch-solvers, frame:draw-ui, frame:input]
demonstrated_by: [mods/ksa-advancedflightcomputer/features/launch-window-to-target-plane, mods/ksa-advancedflightcomputer/features/vehicle-state-to-site-frame, mods/ksagolf/features/terrain-height-queries, mods/kitten-engineer-redux/features/orbit-readouts-and-hohmann-estimate]
tags: [site-frame, launch-window, enu, surface-velocity, plane, right-ascension, terrain-height, azimuth]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:08:45Z }
status: stable
repos:
  - name: Kitten-Engineer-Redux
    git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
    ref: d5786a0e75203a18a96936fb3537220d44b7a18b
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-iparentbody
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IParentBody.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs
    title: "KSA.IParentBody (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksa-orbit
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Orbit.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs
    title: "KSA.Orbit (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestial
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA.Celestial (decompiled, build 2026.10.10.5554)"
---

A launch site rotates with its body. To launch into a given orbit plane you need to know when the site passes under that plane; to guide the ascent you want position and velocity in a flat local frame at the site; and to fly low or place things on the ground you need terrain height in the same frame. This topic collects four building blocks that share one idea: the body's spin axis is CCI +Z, and the site is a CCF position that
rotates with `GetCci2Ccf`.

## Engine background

- **Spin axis.** In CCI the body rotates about +Z: `IParentBody.GetAngularVelocityCci()` is `(0, 0, GetAngularVelocity())`. Surface-relative velocity is `v - omega x r`, which is what `Vehicle.GetSurfaceVelocityCci()` computes from `Orbit.StateVectors`.[^ksa-iparentbody] [current/decomp/KSA/IParentBody.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs#L78-L90) [^ksa-vehicle] [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2954-L2958)
- **Orbit plane.** `Orbit.Inclination` is measured against CCI +Z, so an orbit's plane is `n = normalize(r x v)` with `i = acos(n.z)` and `LAN = atan2(n.x, -n.y)` in the same frame (see [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../../flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md)).[^ksa-orbit] [current/decomp/KSA/Orbit.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Orbit.cs#L1611-L1623)
- **Terrain.** `Celestial.GetTerrainHeightFromDirCcf(direction, accurate = true)` returns the height above the mean sphere along a direction from the body's centre; the `Cce` and `Cci` variants rotate the direction into the body-fixed frame first.[^ksa-celestial] [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L772-L795)
- **Warp.** A warp to the window goes through `InputEvents.AutoWarpBuffer` (see [Set, limit and request simulation speed from a mod](../../flight-state/set-simulation-speed-from-a-mod/overview.md)).

See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Site latitude versus inclination, crossing time with lead, warp request](build-a-site-frame-and-compute-a-launch-window-1.md) | KSA-AdvancedFlightComputer | orbital geometry | `frame:dispatch-solvers`, `frame:draw-ui`, `frame:input` | Closed-form window and chase orbit; needs a lead for the pad's eastward motion |
| [Site frame from CCI, with v minus omega cross r](build-a-site-frame-and-compute-a-launch-window-2.md) | KSA-AdvancedFlightComputer | coordinate bridge | `frame:dispatch-solvers` | Flat-ground guidance frame; convention-agnostic quaternion handling |
| [North from the spin axis, terrain height in the same frame](build-a-site-frame-and-compute-a-launch-window-3.md) | KSAGolf | frame conversion | `frame:draw-ui` | Proper east/north frame and ground height; poles undefined |
| [Orbit-relative surface velocity readouts](build-a-site-frame-and-compute-a-launch-window-4.md) | Kitten-Engineer-Redux | flight math | `frame:draw-ui` | Radial and tangential speed split; minimal |

## See also

- [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../../flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md)
- [Read roll, pitch, heading, angle of attack and sideslip in the local horizon frame](../../flight-state/read-flight-state-in-a-local-horizon-frame/overview.md)
- [Set, limit and request simulation speed from a mod](../../flight-state/set-simulation-speed-from-a-mod/overview.md)
- Related topics: [Fly a closed-loop ascent to a target orbit](../../guidance/fly-closed-loop-ascent-guidance/overview.md), [Plan and fly a powered landing](../../guidance/plan-and-fly-a-powered-landing/overview.md)

[^ksa-iparentbody]: KSA.IParentBody (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: KSA.Vehicle (decompiled, build 2026.10.10.5554)
[^ksa-orbit]: KSA.Orbit (decompiled, build 2026.10.10.5554)
[^ksa-celestial]: KSA.Celestial (decompiled, build 2026.10.10.5554)
