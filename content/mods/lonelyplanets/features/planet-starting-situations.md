---
type: Mod Feature
title: Planet starting situations
description: Custom Situation assets place the stock Gemini7 vessel in a chosen orbit around each planet
mod: lonelyplanets
category: flight-and-orbits
tags: [situation-xml, starting-vessel, orbital-elements, testing-mode]
techniques: [xml-asset]
game_types: [KSA.AssetBundle, KSA.SystemTemplate, KSA.VehicleTemplate, KSA.SituationTemplate, KSA.OrbitTemplate, KSA.Vehicle]
lifecycle: [startup:asset-load, startup:game-loaded]
hooks: ["native KSA.Mod.LoadAssetBundles", "native KSA.Mod.LoadSystems", "native KSA.Universe.LoadSystem"]
generated: { by: codex/gpt-6-sol, at: 2026-10-11T12:59:30Z }
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
  - id: lp-manifest
    repo: LonelyPlanets
    path: mod.toml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/mod.toml
    title: LonelyPlanets mod.toml
  - id: lp-situations
    repo: LonelyPlanets
    path: LonelySituations.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/LonelySituations.xml
    title: LonelySituations.xml
  - id: lp-mars
    repo: LonelyPlanets
    path: MarsOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/MarsOnly.xml
    title: MarsOnly.xml
  - id: lp-jupiter
    repo: LonelyPlanets
    path: JupiterOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/JupiterOnly.xml
    title: JupiterOnly.xml
  - id: lp-saturn
    repo: LonelyPlanets
    path: SaturnOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/SaturnOnly.xml
    title: SaturnOnly.xml
  - id: lp-venus
    repo: LonelyPlanets
    path: VenusOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/VenusOnly.xml
    title: VenusOnly.xml
  - id: lp-readme
    repo: LonelyPlanets
    path: README.md
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/README.md
    title: LonelyPlanets README.md
  - id: ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: KSA.AssetBundle (decompiled, build 2026.10.10.5554)
  - id: ksa-system
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
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: KSA.Vehicle (decompiled, build 2026.10.10.5554)
  - id: ksa-orbittemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/OrbitTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitTemplate.cs
    title: KSA.OrbitTemplate (decompiled, build 2026.10.10.5554)
---

Each Lonely Planets system can place the stock `Gemini7` vehicle in orbit around its sole featured planet. The system XML names the vessel's parent and references an orbit situation defined in `LonelySituations.xml`; no saved vessel is bundled with the mod.[^lp-situations][^lp-mars]

## How it works

`LonelySituations.xml` defines four `<Situation>` assets, each with a six-element `<Orbit>`: semimajor axis, inclination, eccentricity, longitude of ascending node, argument of periapsis and time at periapsis. `OrbitTemplate` deserializes these elements ([current/decomp/KSA/OrbitTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitTemplate.cs#L9-L31)). The registered systems reference the Mars, Jupiter and Saturn situation IDs; the Venus situation belongs to the unregistered Venus file.[^lp-situations][^lp-venus][^ksa-orbittemplate]

| Preset | Vessel parent | Situation ID | Semimajor axis | Time at periapsis |
|---|---|---|---|---|
| [MarsOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/MarsOnly.xml#L30-L37) | Mars | `MarsStartingSituation` | 5,000 km | 90 min |
| [JupiterOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/JupiterOnly.xml#L30-L37) | Jupiter | `JupiterStartingSituation` | 80,000 km | 15 min |
| [SaturnOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/SaturnOnly.xml#L30-L38) | Saturn | `SaturnStartingSituation` | 80,000 km | -90 min |
| [VenusOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/VenusOnly.xml#L29-L37) | Venus | `VenusStartingSituation` | 5,000 km | 90 min; preset disabled |

`VehicleTemplate.Situation` consumes `<SituationRef InstanceOf="…">`; `SituationTemplate.GetTemplate` looks up the named asset. `Vehicle.GetSituationState` turns its `Orbit` into a runtime orbit around the vehicle's parent. Thus the same `Gemini7` stock default save can be placed around different bodies by changing the XML parent and situation reference.[^ksa-vehicletemplate][^ksa-situation][^ksa-vehicle]

## Lifecycle and timing

During preload and asset load, `AssetBundle.OnDataLoad` registers the named situation templates. During full system load, `SystemTemplate.OnDataLoad` removes its vehicle template unless the game type is Testing, then lets the remaining `VehicleTemplate` resolve its situation and default save. At `Universe.LoadSystem`, KSA instantiates the vessel and evaluates its starting orbit. This is one-time system construction, with no per-frame mod code.[^ksa-assetbundle][^ksa-system][^ksa-vehicletemplate][^ksa-vehicle]

The README directs players to Testing mode because the vehicle creator fails in these systems. The engine's explicit removal of `<LoadVehicleFromLibrary>` templates outside Testing confirms at least why the bundled `Gemini7` starting vessel cannot appear in Sandbox; the reported creator failure was not runtime-tested.[^lp-readme][^ksa-system]

## Key code

| Path | Role |
|---|---|
| [mod.toml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/mod.toml#L63) | Adds `LonelySituations.xml` to native assets. |
| [LonelySituations.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/LonelySituations.xml#L3-L23) | Defines Jupiter and Saturn situations; [LonelySituations.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/LonelySituations.xml#L25-L45) defines Mars and Venus. |
| [MarsOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/MarsOnly.xml#L30-L37) / [JupiterOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/JupiterOnly.xml#L30-L37) / [SaturnOnly.xml](https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/SaturnOnly.xml#L30-L38) | Bind `Gemini7` and one situation to each featured planet. |

## Snippets

```xml
<!-- LonelySituations.xml L25-L34 -->
    <Situation Id="MarsStartingSituation">
        <Orbit>
            <SemiMajorAxis Km="5000" />
            <Inclination Degrees="-60" />
            <Eccentricity Value="0" />
            <LongitudeOfAscendingNode Degrees="0" />
            <ArgumentOfPeriapsis Degrees="0" />
            <TimeAtPeriapsis Minutes="90" />
        </Orbit>
    </Situation>
```

```xml
<!-- MarsOnly.xml L30-L37 -->
    <LoadFromLibrary Id="Mars" Parent="Sol" HomeBody="true"/>
    
    <LoadVehicleFromLibrary Id="Gemini7" Parent="Mars">
        <SituationRef InstanceOf="MarsStartingSituation"/>
        <Body2Cce X="0" Y="0" Z="0" />
        <BodyRates X="0" Y="0" Z="0" />
        <Color R="0.33" G="0.95" B="0" />
    </LoadVehicleFromLibrary>
```

## Game APIs touched

| API | Purpose |
|---|---|
| [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L97-L108) | `AssetBundle.OnDataLoad` registers `SituationTemplate` assets from the XML bundle. |
| [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L54-L91) | `SystemTemplate.OnDataLoad` includes `<LoadVehicleFromLibrary>` in Testing and strips it otherwise. |
| [current/decomp/KSA/VehicleTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleTemplate.cs#L56-L93) | `VehicleTemplate.OnDataLoad` reads the situation reference and looks up the stock default vehicle save. |
| [current/decomp/KSA/SituationTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SituationTemplate.cs#L73-L81) | `SituationTemplate.GetTemplate` resolves `InstanceOf` to the named orbit template. |
| [current/decomp/KSA/OrbitTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/OrbitTemplate.cs#L9-L31) | `OrbitTemplate` maps the six XML orbit fields to its data references. |
| [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L1835-L1845) | `Vehicle.GetSituationState` creates a runtime orbit from the template and the chosen parent. |

## Pitfalls and version notes

- The situation asset ID and `<SituationRef InstanceOf>` must match exactly. The parent's ID must be present in the system. `Gemini7` also needs its stock default save.[^ksa-situation][^ksa-vehicletemplate]
- KSA's `SystemTemplate.OnDataLoad` removes vehicle templates outside Testing. The author's separate claim that the vehicle creator fails in these presets remains unverified in this build.[^ksa-system][^lp-readme]
- `VenusStartingSituation` is shipped and registered, but the Venus system XML is not in the manifest's `systems` list.[^lp-manifest][^lp-venus]

## See also

- [Single-planet system presets](single-planet-system-presets.md)
- [Dummy companion body](dummy-companion-body.md)
- [Situation assets referenced by a library-loaded starter vessel](../../../howto/celestials/systems-and-stars/place-starting-vessels-in-custom-systems/place-starting-vessels-in-custom-systems.md) - how-to article demonstrating this feature

[^lp-manifest]: LonelyPlanets mod.toml
[^lp-situations]: LonelyPlanets LonelySituations.xml
[^lp-mars]: LonelyPlanets MarsOnly.xml
[^lp-venus]: LonelyPlanets VenusOnly.xml
[^lp-readme]: LonelyPlanets README.md
[^ksa-assetbundle]: KSA.AssetBundle, build 2026.10.10.5554
[^ksa-system]: KSA.SystemTemplate, build 2026.10.10.5554
[^ksa-vehicletemplate]: KSA.VehicleTemplate, build 2026.10.10.5554
[^ksa-situation]: KSA.SituationTemplate, build 2026.10.10.5554
[^ksa-vehicle]: KSA.Vehicle, build 2026.10.10.5554
[^ksa-orbittemplate]: KSA.OrbitTemplate, build 2026.10.10.5554
