---
type: Game Feature
title: Fly a boostback burn and glide a booster to its landing site
description: Fly a boostback burn and then steer an unpowered descent onto a landing site with angle of attack
topic: fly-a-boostback-and-glide-to-a-landing-site
category: flight-and-orbits
group: guidance
approaches: 2
game_types: [KSA.Vehicle, KSA.SequenceList, KSA.Decoupler, KSA.PhysicsStates, KSA.FlightComputer, KSA.PartTree, KSA.IParentBody, KSA.PhysicsEnvironment, KSA.Orbit]
lifecycle: [frame:dispatch-solvers]
demonstrated_by: [mods/ksa-advancedflightcomputer/features/boostback-impact-prediction, mods/ksa-advancedflightcomputer/features/aerodynamic-glide-impact-steering]
tags: [boostback, glide, booster-recovery, angle-of-attack, impact-point, stage-separation, landing-site]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T18:36:33Z }
status: stable
repos:
- name: KSA-AdvancedFlightComputer
  git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
  ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
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
- id: ksa-sequencelist
  repo: ksa-game-assemblies
  path: current/decomp/KSA/SequenceList.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SequenceList.cs
  title: KSA.SequenceList (decompiled, build 2026.10.10.5554)
- id: ksa-decoupler
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Decoupler.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Decoupler.cs
  title: KSA.Decoupler (decompiled, build 2026.10.10.5554)
- id: ksa-physicsstates
  repo: ksa-game-assemblies
  path: current/decomp/KSA/PhysicsStates.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs
  title: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
- id: ksa-universe
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Universe.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
  title: KSA.Universe (decompiled, build 2026.10.10.5554)
- id: afc-boostback
  repo: KSA-AdvancedFlightComputer
  path: AdvancedFlightComputer/Features/Guidance/Modes/Boostback.cs
  resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Modes/Boostback.cs
  title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Features/Guidance/Modes/Boostback.cs'
- id: afc-boostbackglide
  repo: KSA-AdvancedFlightComputer
  path: AdvancedFlightComputer/Features/Guidance/Modes/BoostbackGlide.cs
  resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Modes/BoostbackGlide.cs
  title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Features/Guidance/Modes/BoostbackGlide.cs'
---
Recovering a booster means doing three things the game does not do for you: noticing that a separation produced a new vehicle that is "the booster", flying a finite-length burn that moves the predicted impact point onto the landing site, and then steering the unpowered fall with the airframe's lift so dispersions do not grow. Both approaches here come from KSA-AdvancedFlightComputer (AFC) and are two halves of one state machine: the first covers adoption and the burn, the second the glide.

## Engine background

- **A separation makes a vehicle.** `Vehicle.Split` takes the connection a decoupler releases, disconnects it and calls `CreateVehicle` with the tree-child side as the new root. The new vehicle is a different object with a different id, so anything keyed on the old `Vehicle` is lost.[^ksa-vehicle] The detached side is the connector's part that is not in the other's `TreeChildren`.[^ksa-part]
- **What will separate.** `PartTree.SequenceList.Sequences` is the staging list; each `Sequence` has `Parts` and `Activated`, and `Part.SubtreeModules.Get<Decoupler>()` finds decouplers under a staged part.[^ksa-sequencelist] [^ksa-decoupler]
- **A vehicle that can fly itself home** has a `Control` module on the detaching side (`Parts.Controls.NumModules > 0`).
- **Air that turns with the planet.** `PhysicsStates.ComputeAirVelocityBody` subtracts `cross(parent.GetAngularVelocityCci(), position)` from the bubble velocity, so lift and drag act on air-relative velocity; see [Predict impact points](../predict-impact-point-and-build-a-ballistic-computer/overview.md).[^ksa-physicsstates]
- **Per-vehicle hook.** `Universe.PrepareVehicleWorkers` calls `PrepareWorker` on every vehicle, on the main thread, before the vehicle solvers are queued; a prefix there flies a booster even when it is not the controlled vehicle.[^ksa-universe] [^ksa-vehicle] See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Impact-prediction-driven boostback and glide](fly-a-boostback-and-glide-to-a-landing-site-1.md) | KSA-AdvancedFlightComputer | harmony prefix on `PrepareWorker` | `frame:dispatch-solvers` | Full state machine with adoption, receding-horizon burn plan and cutoff; most code and the most model assumptions |
| [Zero-effort-miss law with an inverted lift curve](fly-a-boostback-and-glide-to-a-landing-site-2.md) | KSA-AdvancedFlightComputer | closed-loop guidance | `frame:dispatch-solvers` | Glide only; steers by lift measured from the active aero model, needs a Jacobian of the coast prediction |

## See also

- [Predict impact points with drag and build a ballistic computer](../predict-impact-point-and-build-a-ballistic-computer/overview.md)
- [Steer by predicted miss](../steer-by-zero-effort-miss/overview.md)
- [Run an autopilot for every vehicle each step](../../autopilot/run-an-autopilot-for-every-vehicle-each-step/overview.md)
- [Drive the flight computer and attitude modes from a mod](../../autopilot/drive-the-flight-computer-and-attitude-modes-from-a-mod/overview.md)

[^ksa-vehicle]: KSA.Vehicle (decompiled, build 2026.10.10.5554)
[^ksa-part]: KSA.Part (decompiled, build 2026.10.10.5554)
[^ksa-sequencelist]: KSA.SequenceList (decompiled, build 2026.10.10.5554)
[^ksa-decoupler]: KSA.Decoupler (decompiled, build 2026.10.10.5554)
[^ksa-physicsstates]: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
[^ksa-universe]: KSA.Universe (decompiled, build 2026.10.10.5554)
