---
type: Game Feature
title: Read a vehicle's position, velocity, attitude, orbit and flight instruments
description: Which Vehicle members hold kinematics, orbit, navball, environment and encounter data, which frame and unit each uses, when a read is valid, and how to derive altitude, speed, g-load, dynamic pressure and Mach
topic: read-vehicle-flight-state
category: flight-and-orbits
group: flight-state
approaches: 4
game_types: [KSA.Vehicle, KSA.Orbit, KSA.NavBallData, KSA.PatchedConic, KSA.Encounter, KSA.UniverseTime, KSA.PhysicsEnvironment, KSA.PhysicalAtmosphereReference, KSA.ReadOnlyPhysicsStates, KSA.SituationEx]
lifecycle: [frame:viewports, frame:draw-ui, frame:after-on-frame]
demonstrated_by: [mods/gatos/features/vessel-flight-state-reads, mods/ksa-public-telemetry/features/live-flight-telemetry-sampling, mods/ksa-aircrafthud/features/flight-data-from-vehicle, mods/ksaero/features/mach-from-game-atmosphere]
tags: [vehicle, flight-state, telemetry, altitude, speed, g-load, mach, snapshot]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:08:43Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSA_AircraftHUD
    git: https://github.com/uriahgnu/KSA_AircraftHUD.git
    ref: 4e4c71719a8355afb1fc608f54d531676bec4ef3
  - name: KSA-Public-Telemetry
    git: https://github.com/elevatorctln/KSA-Public-Telemetry/
    ref: 90608fb465f87d6008208798cc4d20ed8182c9a0
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksa-navballdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/NavBallData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/NavBallData.cs
    title: "KSA.NavBallData (decompiled, build 2026.10.10.5554)"
  - id: ksa-encounter
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Encounter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Encounter.cs
    title: "KSA.Encounter (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsenvironment
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsEnvironment.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsEnvironment.cs
    title: "KSA.PhysicsEnvironment (decompiled, build 2026.10.10.5554)"
---

A flight-state read has to answer three questions: which member holds the quantity, in what frame
and unit, and at which point of the frame it is valid. This topic collects the answers from four mods
that read the same `Vehicle` in different ways, and shows how to derive the instrument values
(altitude, speed, g-load, dynamic pressure, Mach) the game does not store.

## Engine background

`Vehicle` keeps one authoritative state and derives everything else.[^ksa-vehicle]

| Quantity | Member | Notes |
|---|---|---|
| Position and velocity | `GetPositionCci()`, `GetVelocityCci()`, `GetPositionEcl()`, `GetVelocityEcl()` | CCI is parent-centred inertial; see [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../understand-ksa-coordinate-frames-and-epochs/overview.md) |
| Attitude | `Body2Cce`, `GetBody2Cci()` | quaternion, body to CCE or CCI |
| Surface-relative velocity | `GetSurfaceVelocityCci()`, `GetSurfaceSpeed()` | `VelocityCci - (parent angular velocity x PositionCci)` |
| Speed | `GetInertialSpeed()`, `OrbitalSpeed` | length of the CCI velocity |
| Altitude | `GetBarometricAltitude()`, `GetRadarAltitude()` | radius minus `MeanRadius`; radar subtracts terrain (and ocean) height |
| Acceleration | `AccelerationBody`, `AngularAccelerationBody` | proper (non-gravitational) acceleration in body axes |
| Mass | `TotalMass`, `PropellantMass` | kg |
| Orbit | `Orbit` (`Patch.Orbit`), `Apoapsis`, `Periapsis`, `NextApoapsisTime` | radii from the body centre, see [Read orbit elements, apsides and event countdowns safely](../read-orbit-elements-and-timing/overview.md) |
| Navball | `ref readonly NavBallData` | `AttitudeAngles` (int degrees), `Speed`, `DeltaV`, `ThrustWeightRatio`, `Frame` |
| Environment | `ref readonly PhysicsEnvironment`, `GetPhysicsStates().Environment` | `AtmosphericPressure`, `AtmosphericDensity`, `OceanDensity`, `TerrainRadius`, `GravitationBub` |
| SOI encounters | `Patch.Encounters` of `PatchedConic` | `Encounter.Body`, `GameTime`, `ClosestDistance` |
| Contact | `Situation` with `SituationEx.HasAnyContact()` / `IsOnRails()` | extension methods |

Sources: [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L2949-L2963), [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3060-L3088), [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L543-L591),
[current/decomp/KSA/NavBallData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/NavBallData.cs#L5-L24), [current/decomp/KSA/Encounter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Encounter.cs#L6-L20), [current/decomp/KSA/PhysicsEnvironment.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsEnvironment.cs#L18-L28).

**Validity.** `Universe.ApplyVehicleSolvers` copies the finished physics step into the main-thread
`Vehicle` during `PrepareFrame` (`frame:apply-solvers`), then `ExecuteNextVehicleSolvers` dispatches the
next step on worker copies. So any main-thread hook after `PrepareFrame` (viewport `OnFrame`, GUI hooks,
`StarMapAfterOnFrame`) reads a consistent, step-old state with no lock. Do not write there; see the
[lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).
`NavBallData` and `PhysicsEnvironment` are `ref readonly` fields: copy the values out, never keep the reference.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Immutable snapshot in a viewport prefix](read-vehicle-flight-state-1.md) | gatOS | immutable snapshot | `frame:viewports` | Everything, scrubbed, readable from any thread; most code |
| [Plain snapshot after the frame](read-vehicle-flight-state-2.md) | KSA-Public-Telemetry | snapshot copy | `frame:after-on-frame` | One read per frame, no locks, one frame of latency; adds thrust, T/W and downrange |
| [Postfix read for an instrument panel](read-vehicle-flight-state-3.md) | KSA_AircraftHUD | harmony postfix | `frame:viewports` | Not stale; instrument formulas (altitude, speed, g-load, Mach) and pitfalls |
| [Speed of sound from pressure and density](read-vehicle-flight-state-4.md) | KSAero | flight math | `physics:vehicle-solver`, `frame:draw-ui` | Mach without a temperature; one speed of sound per body |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../understand-ksa-coordinate-frames-and-epochs/overview.md)
- [Read orbit elements, apsides and event countdowns safely](../read-orbit-elements-and-timing/overview.md)
- [Read roll, pitch, heading, angle of attack and sideslip in the local horizon frame](../read-flight-state-in-a-local-horizon-frame/overview.md)
- Related topics: [Compute a suicide-burn start altitude and the thrust it needs](../../guidance/compute-a-suicide-burn/overview.md); also [Drive the flight computer and attitude modes from a mod](../../autopilot/drive-the-flight-computer-and-attitude-modes-from-a-mod/overview.md) for the write side

[^ksa-vehicle]: KSA.Vehicle (decompiled, build 2026.10.10.5554)
