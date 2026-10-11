---
type: Game Feature
title: "Control which body the game picks as the camera's nearby celestial"
description: "The game draws one body per camera in full detail and every other as a distant sphere, chosen by CelestialSystem.GetNearbyAstronomical; a small moon can steal the slot and make its planet flicker, fixed here by a guarded transpiler"
topic: choose-which-body-the-game-renders-in-detail
category: celestials
group: atmospheres-and-rings
approaches: 1
game_types: [KSA.CelestialSystem, KSA.Astronomical, KSA.Program, KSA.Camera]
lifecycle: [startup:starmap-before-main, frame:celestials, frame:render]
demonstrated_by: [mods/realatmospheres/features/nearby-body-transpiler]
tags: [nearby-celestial, transpiler, flicker, moon, harmony]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:33Z }
repos:
  - name: RealAtmospheres
    git: https://github.com/Brimfyr/RealAtmospheres.git
    ref: 19dc37a55b2e359bd8eec2f5b41722ab11ae0c46
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-game-assemblies-current-decomp-ksa-celestialsystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA/CelestialSystem.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA/Program.cs (decompiled, build 2026.10.10.5554)"
---
The game draws one body per camera in full detail (terrain, volumetric clouds, full atmosphere) and every other body as a distant sphere. The choice is `CelestialSystem.GetNearbyAstronomical`, which walks every body and keeps one. A small moon passing close to its planet can take the slot and make the planet drop to a distant render for part of each orbit, which under time warp is a visible flicker.

## Engine background

- `CelestialSystem.GetNearbyAstronomical(Transform3D origin, Func<Astronomical, bool> validCheck, double nearbyDistance = 80000000.0)` walks `_all` and, for each valid body, takes it when `centreDistance - MeanRadius < best`, then sets `best = centreDistance`. The test compares one body's **surface** distance with the previous pick's **centre** distance ([current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L565-L584)).
- Callers: `Program.OnFrameCelestials` sets the camera's nearby celestial with the `IsBillboarded` filter ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2701-L2715)); `Program.UpdateShaderData` picks the celestial parent for shader data with `IsSphericalParent` and a larger range ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2927-L2931)); `Program.FindNearbyCelestial` is a fallback used by the camera ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5228-L5231)).
- Example: from 8,400 km of Mars's centre, Phobos comes nearer than Mars's centre once an orbit, and Mars drops to a distant render for that stretch; at x14400 warp that is a flicker every two seconds. Deimos, Pan, Miranda and Charon do the same to their planets.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Transpile the distance comparison into a ranking call that favours a body within 25 radii](choose-which-body-the-game-renders-in-detail.md) | realatmospheres | `harmony-transpiler` | `startup:starmap-before-main`, `frame:celestials`, `frame:render` | One static call per body per frame, no prefix re-running the loop; a guarded IL rewrite breaks quietly when the method changes |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Write a Harmony transpiler](../../../patching/transpilers/write-a-harmony-transpiler/overview.md), [Swap one call inside a game method with a transpiler](../../../patching/transpilers/swap-one-call-inside-a-game-method-with-a-transpiler/overview.md)
- [Branch per body inside shared game shaders](../../../shaders/stock-shaders/branch-per-body-inside-shared-game-shaders/overview.md), [Keep vessels rendered at any distance](../../../rendering/meshes/keep-vessels-rendered-at-any-distance/overview.md)
