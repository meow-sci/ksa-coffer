---
type: Game Feature
title: Place starting vessels in a custom system with reusable situations
description: Register orbital Situation assets and reference them from library-loaded starter vessels in a native system XML
topic: place-starting-vessels-in-custom-systems
category: celestials
group: systems-and-stars
approaches: 1
game_types: [KSA.AssetBundle, KSA.SystemTemplate, KSA.VehicleTemplate, KSA.SituationTemplate, KSA.OrbitTemplate, KSA.Vehicle]
lifecycle: [startup:asset-load, startup:game-loaded]
demonstrated_by: [mods/lonelyplanets/features/planet-starting-situations]
tags: [starting-vessel, situation-xml, orbit, testing-mode]
generated: { by: codex/gpt-6-sol, at: 2026-10-11T13:02:03Z }
status: stable
repos:
  - name: LonelyPlanets
    git: https://github.com/Jared-Melchers/LonelyPlanets.git
    ref: a5dd50de5ffad938d9737f86526a2fae00aa4c98
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: lp-situations
    repo: LonelyPlanets
    path: LonelySituations.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/LonelySituations.xml
    title: LonelyPlanets LonelySituations.xml
  - id: lp-mars
    repo: LonelyPlanets
    path: MarsOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/MarsOnly.xml
    title: LonelyPlanets MarsOnly.xml
  - id: ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: KSA.AssetBundle (decompiled, build 2026.10.10.5554)
  - id: ksa-systemtemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: KSA.SystemTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-vehicletemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleTemplate.cs
    title: KSA.VehicleTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-situation
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SituationTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SituationTemplate.cs
    title: KSA.SituationTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-orbittemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/OrbitTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitTemplate.cs
    title: KSA.OrbitTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
---

A native system can specify a starting vehicle and a reusable orbit situation. Lonely Planets defines one situation per featured planet, then places Core's `Gemini7` around the selected planet with `<LoadVehicleFromLibrary>`.[^lp-situations][^lp-mars]

## Engine background

`AssetBundle.OnDataLoad` registers `<Situation>` assets. `SystemTemplate.Bodies` recognizes `<LoadVehicleFromLibrary>` and `VehicleTemplate.Situation` reads its `<SituationRef>`. `SituationTemplate.GetTemplate` resolves `InstanceOf`; `Vehicle.GetSituationState` creates the runtime orbit around the vehicle's parent from `OrbitTemplate` values.[^ksa-assetbundle][^ksa-systemtemplate][^ksa-vehicletemplate][^ksa-situation][^ksa-orbittemplate][^ksa-vehicle]

`SystemTemplate.OnDataLoad` removes all vehicle templates outside Testing mode. For the configured start vehicle, nonempty `StartSituation` and `StartParent` settings can replace the XML's situation and parent.[^ksa-systemtemplate]

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Situation assets referenced by a library-loaded vessel](place-starting-vessels-in-custom-systems.md) | Lonely Planets | `xml-asset` | `startup:asset-load`, `startup:game-loaded` | Reuses a stock default vessel and orbit data; starter is Testing-only and start settings can override it |

## See also

- [Compose a reduced star system](../compose-reduced-star-systems/overview.md)
- [Read orbit elements and timing](../../../flight-and-orbits/flight-state/read-orbit-elements-and-timing/overview.md)
- [Spawn a vehicle at runtime](../../../vehicles-and-parts/vehicles/spawn-a-vehicle-at-runtime/overview.md)
- [Game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)

[^lp-situations]: LonelyPlanets LonelySituations.xml
[^lp-mars]: LonelyPlanets MarsOnly.xml
[^ksa-assetbundle]: KSA.AssetBundle, build 2026.10.10.5554
[^ksa-systemtemplate]: KSA.SystemTemplate, build 2026.10.10.5554
[^ksa-vehicletemplate]: KSA.VehicleTemplate, build 2026.10.10.5554
[^ksa-situation]: KSA.SituationTemplate, build 2026.10.10.5554
[^ksa-orbittemplate]: KSA.OrbitTemplate, build 2026.10.10.5554
[^ksa-vehicle]: KSA.Vehicle, build 2026.10.10.5554
