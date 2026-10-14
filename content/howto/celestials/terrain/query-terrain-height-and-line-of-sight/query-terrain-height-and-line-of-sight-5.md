---
type: How-To
title: Intersect exhaust rays with terrain and classify dry surfaces
description: Find dry terrain plume footprints by marching body-fixed rays against radial heights,
  refining crossings and sampling tangent frames
topic: query-terrain-height-and-line-of-sight
category: celestials
group: terrain
approach: 5
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/terrain-plume-intersection
techniques:
  - harmony-postfix
  - custom-physics
game_types:
  - KSA.Celestial
lifecycle:
  - frame:apply-solvers
hooks:
  - harmony-postfix KSA.Universe.ApplyVehicleSolvers
tags:
  - celestials
  - blasto
  - harmony-postfix
  - custom-physics
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:13Z
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
  - id: ksa-game-assemblies-current-decomp-ksa-celestial-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Celestial.cs"
  - id: blasto-blasto-gamemod-simulation-blastsimulation-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: "blasto: Blasto.GameMod/Simulation/BlastSimulation.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: blasto-blasto-gamemod-simulation-surfaceprobe-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/SurfaceProbe.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProbe.cs
    title: "blasto: Blasto.GameMod/Simulation/SurfaceProbe.cs"
  - id: blasto-blasto-gamemod-core-surfaceintersection-cs
    repo: blasto
    path: Blasto.GameMod/Core/SurfaceIntersection.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/SurfaceIntersection.cs
    title: "blasto: Blasto.GameMod/Core/SurfaceIntersection.cs"
  - id: blasto-blasto-gamemod-simulation-surfaceprofiles-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/SurfaceProfiles.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProfiles.cs
    title: "blasto: Blasto.GameMod/Simulation/SurfaceProfiles.cs"
---

Use this approach for local surface effects that need a dry-ground hit without a collider raycast. Copy Blasto’s Double3, SurfaceIntersection, SurfaceHit, SurfaceProbe and SurfaceProfiles helpers together, then adapt the artistic response.

## Background: how the game does it

Celestial.GetTerrainHeightFromDirCcf accepts a body-fixed direction and returns radial height above mean radius. Its accurate path uses bicubic heights and terrain inputs; biome ids and control weights are separate samples. See [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L789-L840)[^ksa-game-assemblies-current-decomp-ksa-celestial-cs] and [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L1245-L1324)[^ksa-game-assemblies-current-decomp-ksa-celestial-cs].

## Lifecycle and timing

Run the adapter in frame:apply-solvers after worker results settle. Blasto resolves the celestial and probes completed nozzle samples in its Universe.ApplyVehicleSolvers postfix: [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L132-L158)[^blasto-blasto-gamemod-simulation-blastsimulation-cs]. The next worker dispatch is later in [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222)[^ksa-game-assemblies-current-decomp-ksa-program-cs].

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Validate the body-fixed origin and exhaust.** Create the accurate height delegate, subtract mean radius and terrain height, and preserve the default 350 m altitude and half-metre below-ground limits:

```csharp
// Blasto.GameMod/Simulation/SurfaceProbe.cs L18-L31
// ...
            !double.IsFinite(thrust) || thrust < 0 || !double.IsFinite(MaxRange) || MaxRange <= 0) return false;
        var radial = origin.Normalized();
        exhaust = exhaust.Normalized();
        result = $"{body.Id}: exhaust points away from terrain";
        if (Double3.Dot(radial, exhaust) > .12) return false;
        // DistanceReference and celestial coordinates are metres in this build.
        double Height(Double3 dir) => body.GetTerrainHeightFromDirCcf(ToNative(dir), accurate: true);
        double altitude = origin.Length - body.MeanRadius - Height(radial);
        result = $"{body.Id}: terrain height is not finite";
        if (!double.IsFinite(altitude)) return false;
        result = $"{body.Id}: {altitude:F2} m above terrain; limit {MaxRange:F0} m";
        if (altitude > MaxRange) return false;
        result = $"{body.Id}: origin is {-altitude:F2} m below terrain (tolerance 0.5 m)";
        if (altitude < -.5) return false;
// ...
```
The radial dot cutoff is 0.12, allowing slightly outward grazing directions to reach the ray/cone tests.

2. **March a bounded ray, then bisect its crossing.** Copy [Blasto.GameMod/Core/SurfaceIntersection.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/SurfaceIntersection.cs#L8-L42)[^blasto-blasto-gamemod-core-surfaceintersection-cs]. Clearance drives a 0.25–8 m step; refine the first sampled crossing to a 0.002 m interval or 22 iterations:

```csharp
// Blasto.GameMod/Core/SurfaceIntersection.cs L24-L40
// ...
        for (long i = 0; i < maxSteps && a < maxDistance; i++)
        {
            double b = Math.Min(maxDistance, a + Math.Clamp(fa * .35, .25, 8));
            double fb = Clearance(b);
            if (!double.IsFinite(fb)) return false;
            if (fb <= 0)
            {
                for (int j = 0; j < 22 && b - a > .002; j++)
                {
                    double mid = (a + b) * .5;
                    double fm = Clearance(mid);
                    if (!double.IsFinite(fm)) return false;
                    if (fm > 0) a = mid; else b = mid;
                }
                distance = (a + b) * .5; point = origin + direction * distance; return true;
            }
            a = b; fa = fb;
// ...
```
Nonfinite heights abort. If the center ray misses, try the four narrow cone directions in [Blasto.GameMod/Simulation/SurfaceProbe.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProbe.cs#L32-L45)[^blasto-blasto-gamemod-simulation-surfaceprobe-cs] and take the first successful hit.

3. **Reject submerged ground and measure its normal.** Apply the configured ocean-level test, sample four surface offsets and orient the crossed derivatives outward. Require incidence above 0.05:

```csharp
// Blasto.GameMod/Simulation/SurfaceProbe.cs L47-L63
// ...
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
// ...
```
This ocean test is Blasto’s effect policy, not a general engine water-validity predicate.

4. **Derive the artistic footprint and classify its response.** Radius depends on thrust and ray distance; shallow incidence stretches the ellipse:

```csharp
// Blasto.GameMod/Simulation/SurfaceProbe.cs L64-L71
// ...
        double baseRadius = Math.Clamp(Math.Sqrt(Math.Max(thrust, 0)) * .012, 1.5, 18);
        double radius = Math.Clamp(baseRadius + distance * .10, 1.5, 70);
        hit = new SurfaceHit(body.Id, radial * (body.MeanRadius + terrainHeight), normal, u, v, distance,
            incidence, radius, Math.Clamp(1 / Math.Sqrt(incidence), 1, 2.5), SurfaceProfiles.Classify(body, radial));
        result = $"{body.Id}: invalid sampled surface geometry";
        if (!hit.IsValid()) { hit = default; return false; }
        result = $"{body.Id}: terrain hit at {distance:F2} m; radius {radius:F2} m; incidence {incidence:F3}; {hit.Profile}";
        return true;
// ...
```
Use [Blasto.GameMod/Simulation/SurfaceProfiles.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProfiles.cs#L9-L32)[^blasto-blasto-gamemod-simulation-surfaceprofiles-cs] for known Luna/Mars ids and dominant raw-biome-weight name heuristics. Unknown airless surfaces use the lunar response, unknown atmospheric surfaces the conservative rock response.

## Complete example

Use [Blasto.GameMod/Simulation/SurfaceProbe.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/SurfaceProbe.cs#L8-L75)[^blasto-blasto-gamemod-simulation-surfaceprobe-cs] with its portable marcher and surface-profile helper. A valid near-ground plume reports body, distance, radius, incidence and profile; failures retain a reason such as submerged ground, excessive altitude or missing crossing.

## Variations and gotchas

A first sampled crossing can miss narrow relief. CPU heights can differ from shader microdisplacement. Vehicle/rock colliders, shelter, excavation and water spray are not modeled. Four cone probes do not integrate a plume volume. Finite-difference spacing and radius formulas are artistic choices; verify slopes and shorelines live. Cache only under explicit time/pose thresholds.

## See also

- [Compare approaches](overview.md)
- [Terrain plume intersection](../../../../mods/blasto/features/terrain-plume-intersection.md)
- [Approach 1: Ccf versus Cce entry points, sea clamp, and a no-claim result type; Document what accurate changes and sample non-accurate only where drift is harmless; Closed-form band below the terrain ceiling, fixed interior sample count](query-terrain-height-and-line-of-sight-1.md)
- [Approach 2: Answer as a body centre and surface radius, pick the body by depth below the mean sphere; Radar horizon mask over non-accurate height samples](query-terrain-height-and-line-of-sight-2.md)
- [Approach 3: Cache decorator that reuses a sample until near the ground or moved](query-terrain-height-and-line-of-sight-3.md)
- [Approach 4: Query terrain height under a point: Height directly below the craft with the Ccf overload for hover or touchdown](query-terrain-height-and-line-of-sight-4.md)

[^ksa-game-assemblies-current-decomp-ksa-celestial-cs]: ksa-game-assemblies: current/decomp/KSA/Celestial.cs.
[^blasto-blasto-gamemod-simulation-blastsimulation-cs]: blasto: Blasto.GameMod/Simulation/BlastSimulation.cs.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^blasto-blasto-gamemod-simulation-surfaceprobe-cs]: blasto: Blasto.GameMod/Simulation/SurfaceProbe.cs.
[^blasto-blasto-gamemod-core-surfaceintersection-cs]: blasto: Blasto.GameMod/Core/SurfaceIntersection.cs.
[^blasto-blasto-gamemod-simulation-surfaceprofiles-cs]: blasto: Blasto.GameMod/Simulation/SurfaceProfiles.cs.
