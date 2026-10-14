---
type: Mod Feature
title: Terrain plume intersection
description: Intersect exhaust rays with radial terrain heights and construct a dry-surface
  footprint from slope and biome metadata
mod: blasto
category: celestials
tags:
  - blasto
  - celestials
  - harmony-postfix
  - custom-physics
techniques:
  - harmony-postfix
  - custom-physics
game_types:
  - KSA.Celestial
lifecycle:
  - frame:apply-solvers
hooks:
  - harmony-postfix KSA.Universe.ApplyVehicleSolvers
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:37:06Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: probe
    repo: blasto
    path: Blasto.GameMod/Simulation/SurfaceProbe.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProbe.cs
    title: Bounded rays, ocean rejection and footprint geometry
  - id: intersection
    repo: blasto
    path: Blasto.GameMod/Core/SurfaceIntersection.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/SurfaceIntersection.cs
    title: Adaptive marching and bisection
  - id: profiles
    repo: blasto
    path: Blasto.GameMod/Simulation/SurfaceProfiles.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProfiles.cs
    title: Body and dominant-biome response classification
  - id: capture
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Probe after solver apply
  - id: height
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: Accurate radial height and terrain inputs
  - id: biomes
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: Biome identity and control sampling
  - id: program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Settled terrain sampling window
---

Blasto finds terrain beneath a rocket plume without casting against a vehicle or rock collider. The reusable mechanism is a bounded ray against the body's radial height function, followed by local finite differences that establish a tangent frame.[^probe][^intersection]

## How it works

1. Query `Celestial.GetTerrainHeightFromDirCcf` with `accurate: true`. Reject origins more than 350 m above the surface by default, more than 0.5 m below it, or exhaust with an outward radial dot product above 0.12; slightly outward grazing directions still reach the ray/cone tests.[^probe][^height]
2. March the center ray up to twice the altitude limit, with steps clamped between 0.25 m and 8 m. On the first sampled crossing, bisect up to 22 times or a 0.002 m interval. Reject nonfinite samples. If the center ray misses, try four narrow cone rays.[^intersection][^probe]
3. Exclude terrain at or below the configured ocean level with a 0.1 m tolerance. Sample offsets of 1.5 m along both radial tangents, cross the resulting derivatives and orient the normal outward. Require incidence greater than 0.05.[^probe]
4. Derive an artistic radius from thrust and ray distance, stretch at shallow incidence, and classify Luna/Mars directly. Other bodies use the largest raw biome control weight and name heuristics; unknown atmospheric terrain receives the conservative rock response.[^profiles]

## Lifecycle and timing

The consumer calls the probe from the `Universe.ApplyVehicleSolvers` postfix, before next-step dispatch. Cached worker samples already contain the body-fixed nozzle pose, while terrain and celestial lookup remain on the main thread.[^capture][^program]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Simulation/SurfaceProbe.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProbe.cs#L13-L71) | Bounded rays, ocean rejection and footprint geometry[^probe] |
| [Blasto.GameMod/Core/SurfaceIntersection.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/SurfaceIntersection.cs#L8-L42) | Adaptive marching and bisection[^intersection] |
| [Blasto.GameMod/Simulation/SurfaceProfiles.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProfiles.cs#L9-L32) | Body and dominant-biome response classification[^profiles] |
| [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L123-L169) | Probe after solver apply[^capture] |
| [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L789-L840) | Accurate radial height and terrain inputs[^height] |
| [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L1245-L1324) | Biome identity and control sampling[^biomes] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222) | Settled terrain sampling window[^program] |

## Snippets

```csharp
// Blasto.GameMod/Simulation/SurfaceProbe.cs L47-L67
        radial = point.Normalized();
        double terrainHeight = Height(radial);
        var ocean = body.BodyTemplate.OceanReference;
        result = $"{body.Id}: surface is submerged (terrain {terrainHeight:F2} m; ocean {(ocean is null ? 0 : (double)ocean.Level):F2} m)";
        if (ocean is not null && (double)ocean.Level >= terrainHeight - .1) return false;
        var tangent = Double3.Tangents(radial);
        Double3 Surface(Double3 p) { var dir = p.Normalized(); return dir * (body.MeanRadius + Height(dir)); }
        var du = Surface(point + tangent.U * 1.5) - Surface(point - tangent.U * 1.5);
        var dv = Surface(point + tangent.V * 1.5) - Surface(point - tangent.V * 1.5);
        var normal = Double3.Cross(du, dv).Normalized();
        if (Double3.Dot(normal, radial) < 0) normal = -normal;
        double incidence = Math.Clamp(-Double3.Dot(normal, exhaust), 0, 1);
        result = $"{body.Id}: grazing incidence {incidence:F4}; requires more than 0.05";
        if (!double.IsFinite(incidence) || incidence <= .05) return false;
        var lateral = exhaust + normal * incidence;
        var u = lateral.Length > .08 ? lateral.Normalized() : Double3.Tangents(normal).U;
        var v = Double3.Cross(normal, u).Normalized();
        double baseRadius = Math.Clamp(Math.Sqrt(Math.Max(thrust, 0)) * .012, 1.5, 18);
        double radius = Math.Clamp(baseRadius + distance * .10, 1.5, 70);
        hit = new SurfaceHit(body.Id, radial * (body.MeanRadius + terrainHeight), normal, u, v, distance,
            incidence, radius, Math.Clamp(1 / Math.Sqrt(incidence), 1, 2.5), SurfaceProfiles.Classify(body, radial));
```

## Game APIs touched

`Celestial.GetTerrainHeightFromDirCcf` returns a radial height above the mean radius; its accurate path uses bicubic height sampling and terrain inputs. `SampleBiomeIdMap` and `SampleBiomeControlMap` provide the material identifiers and weights used by Blasto's heuristic classifier.[^height][^biomes]

## Pitfalls and version notes

This is sampled radial terrain, not collision geometry or a fluid simulation. A finite march can miss unsampled narrow relief; CPU heights can differ from shader microdisplacement. No rock sheltering, terrain excavation or water spray is modeled. Biome names describe appearance and are not a physical soil database. Four cone probes choose the first successful ray, not a combined plume solution.

## See also

- [Worker nozzle exposure handoff](worker-nozzle-exposure-handoff.md)
- [Owned surface dust emitters](owned-surface-dust-emitters.md)
- [Terrain material shader injection](terrain-material-shader-injection.md)
- [Intersect exhaust rays with terrain and classify dry surfaces](../../../howto/celestials/terrain/query-terrain-height-and-line-of-sight/query-terrain-height-and-line-of-sight-5.md) - how-to article demonstrating this feature

[^probe]: Bounded rays, ocean rejection and footprint geometry.
[^intersection]: Adaptive marching and bisection.
[^profiles]: Body and dominant-biome response classification.
[^capture]: Probe after solver apply.
[^height]: Accurate radial height and terrain inputs.
[^biomes]: Biome identity and control sampling.
[^program]: Settled terrain sampling window.
