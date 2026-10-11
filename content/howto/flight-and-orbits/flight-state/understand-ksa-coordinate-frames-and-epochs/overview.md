---
type: Game Feature
title: Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)
description: Which frame and epoch each Vehicle, Orbit, Celestial and Camera member lives in, how to sample positions at one consistent instant and how to convert a position to latitude, longitude and altitude
topic: understand-ksa-coordinate-frames-and-epochs
category: flight-and-orbits
group: flight-state
approaches: 5
game_types: [KSA.Vehicle, KSA.IParentBody, KSA.Orbit, KSA.Camera, KSA.CelestialFrameMath, KSA.Universe, KSA.PhysicsBubble, KSA.Celestial]
lifecycle: [frame:apply-solvers, frame:draw-ui, frame:dispatch-solvers, frame:celestials, frame:after-on-frame, frame:viewports]
demonstrated_by: [mods/gatos/features/vessel-flight-state-reads, mods/kitten-engineer-redux/features/orbit-readouts-and-hohmann-estimate, mods/ksarmory/features/ecliptic-frames-and-epochs, mods/ksarmory/features/cpa-threat-classification, mods/ksa-measuretools/features/live-body-relative-anchors, mods/ksa-advancedflightcomputer/features/apse-and-inclination-quick-tools, mods/ksagolf/features/frame-epoch-draw-anchor]
tags: [reference, frames, epochs, ecl, cce, cci, ccf, ego, latitude-longitude]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:08:43Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: Kitten-Engineer-Redux
    git: https://github.com/BarneyCompiler/Kitten-Engineer-Redux.git
    ref: d5786a0e75203a18a96936fb3537220d44b7a18b
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: KSA-MeasureTools
    git: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools.git
    ref: aed7f874f1c925c10c733b1dee72bd04b9b1985c
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-ksa-celestial-coordinate-frames
    repo: gatOS
    path: docs/KSA_CELESTIAL_COORDINATE_FRAMES.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/docs/KSA_CELESTIAL_COORDINATE_FRAMES.md
    title: "gatOS: docs/KSA_CELESTIAL_COORDINATE_FRAMES.md"
  - id: ksa-celestial
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA.Celestial (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestialframemath
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialFrameMath.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialFrameMath.cs
    title: "KSA.CelestialFrameMath (decompiled, build 2026.10.10.5554)"
  - id: ksa-universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA.CelestialSystem (decompiled, build 2026.10.10.5554)"
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
---

Almost every flight, orbit and overlay bug in a KSA mod is a frame or epoch bug: a vector read in one
frame and used in another, or two positions sampled at different instants and subtracted. This topic
is the reference the rest of the flight-and-orbits category leans on. It answers three questions:
which frame is this member in, which instant does this sample belong to, and how do I get from a
position to latitude, longitude and altitude (and back).

## Engine background

KSA's frames are defined in the developer article that gatOS keeps in its repo.[^gatos-ksa-celestial-coordinate-frames]
All are right-handed. The ones a mod meets:

| Frame | Centre and axes | Inertial | Where it shows up |
|---|---|---|---|
| ECL | Star-centred root; Z is the ecliptic normal, X the zero-longitude point | yes | `Astronomical.GetPositionEcl()`, `Vehicle.GetVelocityEcl()`, `Camera.PositionEcl` |
| CCE | ECL axes re-centred on a body (the UI calls it STAR) | yes | `Vehicle.Body2Cce` (attitude is stored here), `GetPositionEclFromCce` |
| CCI | Body-centred, Z along the body's rotation axis, X at the vernal point | yes | `Orbit.StateVectors.PositionCci`/`VelocityCci`, every orbital element |
| CCF | Body-fixed: Z north pole, X at the prime meridian | no (rotates) | surface coordinates, `IParentBody.GetLlaFromCcf` |
| ORB | Perifocal frame of one orbit | yes | `Orbit.Orb2ParentCci`, `GetOrbitNormalCci` |
| Ego | Camera-relative render frame: a pure translation of ECL | n/a | `Camera.EclToEgo`, `GetPositionEgo`, everything drawn |

The conversions are plain quaternions on `Celestial` and `IParentBody`: `GetCci2Cce`/`GetCce2Cci`,
`GetCcf2Cce`/`GetCce2Ccf`, `GetCcf2Cci`/`GetCci2Ccf`, each with a `UniverseTime` overload that
evaluates the body's spin at another instant.[^ksa-celestial] [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L526-L575)
The spin itself is one rotation about Z: `CelestialFrameMath.ComputeCcf2Cci` rotates by
`timeSeconds * angularVelocity + initialRotation`.[^ksa-celestialframemath] [current/decomp/KSA/CelestialFrameMath.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialFrameMath.cs#L7-L10)
`Celestial.UpdatePerFrameData` rebuilds the cached CCI-to-CCE and CCF-to-CCE rotations from the body's
orbit `StateVectors.StateTime`, and writes its ECL position as its parent's ECL position plus its CCE
offset.[current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L591-L606)

**Epochs.** Every cached ECL/CCE position is rebuilt in one parent-first walk inside
`Universe.ApplyVehicleSolvers`: the finished vehicle step is applied, `_lastSimStep = _nextSimStep`
makes `Universe.GetElapsedTime()` return that step's `NextTime`, then
`CurrentSystem.UpdatePerFrameData()` recomputes the caches (`IParentBody.UpdatePerFrameDataTree`
visits the parent before its children; `Vehicle.UpdatePerFrameData` fills `_positionCce`, `_positionEcl`,
`_velocityEcl`).[^ksa-universe] [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1922-L1952) [current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L274-L285)
[current/decomp/KSA/IParentBody.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs#L110-L124) [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2645-L2680) So after `PrepareFrame` every vehicle and
body is at one instant, `GetElapsedTime()`, and nothing moves until the next frame's apply. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
for where that sits in the frame (`frame:apply-solvers`).

**Why mixing epochs fails.** Near Earth every ECL position carries the planet's 29.8 km/s orbital
motion, about 500 m per frame at 60 fps. Subtract two ECL positions sampled one step apart and the
carrier leaks straight into the result.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Vessel state in CCI/CCF/ECL](understand-ksa-coordinate-frames-and-epochs-1.md) | gatOS, Kitten-Engineer-Redux | immutable snapshot | `frame:viewports`, `frame:draw-ui` | The member-to-frame table, lat/lon both ways; read-only, one frame |
| [Ecl as the working frame, ego for anything drawn](understand-ksa-coordinate-frames-and-epochs-2.md) | KSArmory | frame-invariant signatures | `frame:draw-ui`, `frame:celestials` | One consistent epoch and explicit carries; needs discipline everywhere |
| [Anchors stored in the owner's frame](understand-ksa-coordinate-frames-and-epochs-3.md) | KSA-MeasureTools | frame-relative anchors | `frame:input`, `frame:draw-ui` | Never goes stale; must be pruned on save loads |
| [Equatorial versus ecliptic reference planes](understand-ksa-coordinate-frames-and-epochs-4.md) | KSA-AdvancedFlightComputer | custom physics | `frame:draw-ui` | Right plane for each question; labels in the mod are the reverse of the frames |
| [Pair rendered Ego with Ecl offsets](understand-ksa-coordinate-frames-and-epochs-5.md) | KSAGolf | frame-epoch | `frame:draw-ui` | Overlay sticks to the craft; two samples must stay separate |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Read a vehicle's position, velocity, attitude, orbit and flight instruments](../read-vehicle-flight-state/overview.md)
- [Read orbit elements, apsides and event countdowns safely](../read-orbit-elements-and-timing/overview.md)
- [Read roll, pitch, heading, angle of attack and sideslip in the local horizon frame](../read-flight-state-in-a-local-horizon-frame/overview.md)
- [Build a local site frame and compute a launch window into a target plane](../../transfers/build-a-site-frame-and-compute-a-launch-window/overview.md)
- Related topics: [Anchor points to a rotating body and pick bodies and orbit lines under the cursor](../../map-view/anchor-and-pick-points-on-bodies/overview.md), [Find the closest approach to a target along a trajectory](../../map-view/find-closest-approach-along-the-flight-plan/overview.md)
- [Vessel flight-state reads](../../../../mods/gatos/features/vessel-flight-state-reads.md), [One ecliptic frame and one epoch for everything simulated and drawn](../../../../mods/ksarmory/features/ecliptic-frames-and-epochs.md), [Live anchors in body, orbit, surface and part frames](../../../../mods/ksa-measuretools/features/live-body-relative-anchors.md)
- [Show mission elapsed time from actual liftoff and pick the right clock under time warp](../compute-mission-elapsed-time-and-detect-liftoff/overview.md) - related topic

[^gatos-ksa-celestial-coordinate-frames]: gatOS: docs/KSA_CELESTIAL_COORDINATE_FRAMES.md
[^ksa-celestial]: KSA.Celestial (decompiled, build 2026.10.10.5554)
[^ksa-celestialframemath]: KSA.CelestialFrameMath (decompiled, build 2026.10.10.5554)
[^ksa-universe]: KSA.Universe (decompiled, build 2026.10.10.5554)
