---
type: Submod
title: "Dent Wizard"
description: "Fires an existing vessel, EVA kitten or debris fragment from the camera at a clicked vessel or terrain point with target-relative speed, launching at the shared physics handoff"
mod: unscience
submod: dent-wizard
mod_id: dent-wizard
tags: [physics, teleport, picking, launch]
categories: [physics]
features: [mods/unscience/features/dent-wizard-vessel-launcher]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T04:26:03Z }
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
  - id: dent-wizard-readme-md
    repo: unscience
    path: dent-wizard/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/README.md
    title: dent-wizard/README.md
  - id: dent-wizard-lib-readme-md
    repo: unscience
    path: dent-wizard.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard.lib/README.md
    title: dent-wizard.lib/README.md
  - id: dent-wizard-tests-readme-md
    repo: unscience
    path: dent-wizard.tests/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard.tests/README.md
    title: dent-wizard.tests/README.md
  - id: scope-vehicle-physics-md
    repo: unscience
    path: scope/vehicle-physics.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md
    title: scope/vehicle-physics.md
  - id: plans-dent-wizard-upstream-integration-md
    repo: unscience
    path: plans/DENT_WIZARD_UPSTREAM_INTEGRATION.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/plans/DENT_WIZARD_UPSTREAM_INTEGRATION.md
    title: plans/DENT_WIZARD_UPSTREAM_INTEGRATION.md
  - id: dent-wizard-mod-toml
    repo: unscience
    path: dent-wizard/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/mod.toml
    title: dent-wizard/mod.toml
  - id: dent-wizard-mod-cs
    repo: unscience
    path: dent-wizard/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/Mod.cs
    title: dent-wizard/Mod.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
---

Dent Wizard fires an existing vessel, EVA kitten or debris fragment from the main camera at a
clicked vessel or terrain point (within 10 km) at a speed relative to the target, including the
target's orbital velocity and the hit point's rotational velocity. The click is captured in the GUI
phase as a target-relative snapshot; the launch itself (`Orbit.CreateFromStateCci` plus
`Vehicle.Teleport`) runs at the shared PrepareFrame physics handoff after joining the nearest-orbit
job. Added against KSA 5438; ballistic only, no intercept solver.

## Hosting

- Manifest id `dent-wizard`, entry assembly `MeowSci.DentWizard` (development host only).
- Standalone host `dent-wizard/Mod.cs`: F11 toggles the "Dent Wizard" window; its Patcher applies
  `HotkeyGuard` and `PhysicsFrameHook`.
- In unscience the supermod applies `PhysicsFrameHook` itself ("dent-wizard physics handoff",
  `unscience/Patcher.cs`); `DentWizardSubmod` subscribes `FirePending` to `PhysicsFrameHook.BeforePhysics`.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Camera-origin vessel launcher with target-relative velocity](../features/dent-wizard-vessel-launcher.md) | physics | `frame:draw-ui`, `frame:prepare` | Dent Wizard teleports a chosen vessel, EVA kitten or debris to the camera and fires it at a clicked hull or terrain point by building a new orbit and calling Vehicle.Teleport at the PrepareFrame physics handoff |

## Library classes

`DentWizardSubmod` (ISubmod and save participant; pending shot, one-shot and automatic arming),
`DentWizardSubmod.Ui` (form, source combo with live total mass, floating click gesture),
`DentWizardPicker` (part-mesh `RayCastEgo`, EVA sphere proxy, CPU heightfield terrain march),
`LaunchRequest` (click snapshot and launch), `LaunchMath` (target-relative velocity).

## Scene saves and persistence

Participant `dent-wizard`, version 1, empty payload. Source, speed, armed/automatic state and any
pending shot are transient and reset on load, so loading never fires an old shot; the launched
vessel's state is ordinary native save data.

## Further reading

- [dent-wizard/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/README.md)
- [dent-wizard.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard.lib/README.md)
- [dent-wizard.tests/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard.tests/README.md)
- [scope/vehicle-physics.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/vehicle-physics.md)
- [plans/DENT_WIZARD_UPSTREAM_INTEGRATION.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/plans/DENT_WIZARD_UPSTREAM_INTEGRATION.md)

## Entry points

- [dent-wizard/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/mod.toml)
- [dent-wizard/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dent-wizard/Mod.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs)

## See also

- [unscience overview](../overview.md)
- [PrepareFrame physics handoff](../features/lib-physics-frame-hook.md)
- [Garry's Torch](./garrys-torch.md) (the other teleporting feature)
