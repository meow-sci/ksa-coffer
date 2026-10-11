---
type: Game Feature
title: Compose a reduced star system from library bodies
description: Register a native system XML that selects a star and chosen library bodies, assigns their parents and home body, and optionally adds a local body asset
topic: compose-reduced-star-systems
category: celestials
group: systems-and-stars
approaches: 1
game_types: [KSA.Mod, KSA.SystemInfo, KSA.SystemTemplate, KSA.AstronomicalReference, KSA.AssetBundle, KSA.CelestialSystem]
lifecycle: [startup:asset-load, startup:game-loaded]
demonstrated_by: [mods/lonelyplanets/features/single-planet-system-presets, mods/lonelyplanets/features/dummy-companion-body]
tags: [system-xml, celestial-bodies, library-reference, native-content]
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
  - id: lp-manifest
    repo: LonelyPlanets
    path: mod.toml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/mod.toml
    title: LonelyPlanets mod.toml
  - id: lp-mars
    repo: LonelyPlanets
    path: MarsOnly.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/MarsOnly.xml
    title: LonelyPlanets MarsOnly.xml
  - id: lp-dummy
    repo: LonelyPlanets
    path: Dummy.xml
    resource: https://github.com/Jared-Melchers/LonelyPlanets/blob/a5dd50de5ffad938d9737f86526a2fae00aa4c98/Dummy.xml
    title: LonelyPlanets Dummy.xml
  - id: ksa-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: KSA.Mod (decompiled, build 2026.10.10.5554)
  - id: ksa-systeminfo
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemInfo.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemInfo.cs
    title: KSA.SystemInfo (decompiled, build 2026.10.10.5554)
  - id: ksa-systemtemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: KSA.SystemTemplate (decompiled, build 2026.10.10.5554)
  - id: ksa-astronomicalreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AstronomicalReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AstronomicalReference.cs
    title: KSA.AstronomicalReference (decompiled, build 2026.10.10.5554)
  - id: ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: KSA.CelestialSystem (decompiled, build 2026.10.10.5554)
---

A system file chooses which library bodies to instantiate. Lonely Planets uses separate XML files for Sol plus Mars, Jupiter or Saturn, and marks the selected planet as the home body. Its three registered presets also reference a locally defined `Dummy` body; the repository does not say why that body is present.[^lp-mars][^lp-dummy]

## Engine background

`Mod.PrepareSystems` reads each `systems` path as a light `SystemInfo`. During preload, `Mod.LoadSystems` reads system templates; after selection it loads the chosen full `SystemTemplate`. Both system and asset paths are relative to that mod's directory. `SystemTemplate.Bodies` accepts `<LoadFromLibrary>`, and `AstronomicalReference.Resolve` finds the named body in the shared library.[^ksa-mod][^ksa-systeminfo][^ksa-systemtemplate][^ksa-astronomicalreference]

`SystemTemplate.OnDataLoad` joins each body's `Parent` ID within the selected system. `CelestialSystem.CreateTreeFromRoot` then builds that tree; a child with `HomeBody="true"` becomes the home body.[^ksa-systemtemplate][^ksa-celestialsystem]

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Native system XML with library references and an optional local body](compose-reduced-star-systems.md) | Lonely Planets | `xml-asset` | `startup:asset-load`, `startup:game-loaded` | Small body list and no C# hook; requires exact library IDs, local files and testing of any custom body |

## See also

- [Place starting vessels in a custom system](../place-starting-vessels-in-custom-systems/overview.md)
- [Enumerate star systems and bodies](../enumerate-star-systems-and-bodies/overview.md)
- [Mod XML load order](../../../assets/asset-xml/mod-xml-load-order/overview.md)
- [Resolve asset IDs and mod-relative paths](../../../assets/asset-xml/resolve-asset-ids-and-mod-relative-paths/overview.md)
- [Game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)

[^lp-mars]: LonelyPlanets MarsOnly.xml
[^lp-dummy]: LonelyPlanets Dummy.xml
[^ksa-mod]: KSA.Mod, build 2026.10.10.5554
[^ksa-systeminfo]: KSA.SystemInfo, build 2026.10.10.5554
[^ksa-systemtemplate]: KSA.SystemTemplate, build 2026.10.10.5554
[^ksa-astronomicalreference]: KSA.AstronomicalReference, build 2026.10.10.5554
[^ksa-celestialsystem]: KSA.CelestialSystem, build 2026.10.10.5554
