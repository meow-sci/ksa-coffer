---
type: Mod Feature
title: Persistent exposure site store
description: Accumulate pressure-time exposure in bounded body-fixed sites while preserving stable
  pattern seeds and tangent frames
mod: blasto
category: persistence
tags:
  - blasto
  - persistence
  - spatial-index
  - immutable-snapshot
techniques:
  - spatial-index
  - immutable-snapshot
game_types:
  - KSA.Universe
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
  - id: store
    repo: blasto
    path: Blasto.GameMod/Core/BlastSiteStore.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastSiteStore.cs
    title: Deposition, compatible merging, snapshots and replacement
  - id: mark
    repo: blasto
    path: Blasto.GameMod/Core/BlastMark.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastMark.cs
    title: Detached records and geometry validation
  - id: vector
    repo: blasto
    path: Blasto.GameMod/Core/Double3.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/Double3.cs
    title: Double-precision vector and stable tangent helper
  - id: simulation
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Main-thread deposition consumer
  - id: snapshot
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Versioned render snapshot cache
  - id: visual
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastVisualMath.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastVisualMath.cs
    title: Live visual radius, strength and selection score
  - id: program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Main-thread write window
---

A stored mark is persistent physical history: body identity, double-precision center, tangent axes, radius, exposure, anisotropy, seed and times. Blasto changes rendering appearance through separate settings, so live size and visibility controls do not rewrite old deposits.[^mark][^visual]

## How it works

The dose is `response × max(thrust × incidence / (π × radius²) − threshold, 0) × burnSeconds / 1800 × buildupRate`. Surface response varies by profile; negligible doses are rejected, saved exposure is saturated at 100, and invalid geometry is rejected. The store's method defaults are buildup 1 and threshold 15, but the simulation explicitly passes its live settings, whose release defaults differ.[^store][^simulation]

A body-keyed 64 m spatial grid searches neighboring cells for a nearby site with the same profile, compatible radius ratio (at most 1.35) and aligned normal. Merging preserves center, tangent frame and seed, expands the radius conservatively, and saturates exposure at 100. A new site hashes body identity and rounded coordinates for a repeatable pattern seed. Default capacity is 4,096; new locations are rejected instead of evicting history.[^store]

`Replace` validates the whole candidate array, capacity and unique identities before clearing the existing store. `Version` changes invalidate the sorted render snapshot, so rendering does not rebuild it merely because another viewport draws.[^store][^snapshot]

## Lifecycle and timing

Deposition happens only in the `frame:apply-solvers` consumer, with vehicle workers joined before this window. GPU upload reads the detached cached snapshot later; neither shaders nor viewport rendering accumulate exposure.[^simulation][^program][^snapshot]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Core/BlastSiteStore.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastSiteStore.cs#L19-L104) | Deposition, compatible merging, snapshots and replacement[^store] |
| [Blasto.GameMod/Core/BlastMark.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastMark.cs#L8-L35) | Detached records and geometry validation[^mark] |
| [Blasto.GameMod/Core/Double3.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/Double3.cs#L8-L26) | Double-precision vector and stable tangent helper[^vector] |
| [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L123-L178) | Main-thread deposition consumer[^simulation] |
| [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L81-L85) | Versioned render snapshot cache[^snapshot] |
| [Blasto.GameMod/Rendering/BlastVisualMath.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastVisualMath.cs#L10-L34) | Live visual radius, strength and selection score[^visual] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222) | Main-thread write window[^program] |

## Snippets

```csharp
// Blasto.GameMod/Core/BlastSiteStore.cs L73-L84
        if (nearest is not null)
        {
            // Fixed orientation and seed keep streaks still across repeated burns and save/load.
            double radius = Math.Max(nearest.Radius, Math.Min(120, hit.Radius + Math.Sqrt(best)));
            var updated = nearest with { Radius = radius, Exposure = Math.Min(100, nearest.Exposure + dose), UpdatedSeconds = Math.Max(epoch, nearest.UpdatedSeconds) };
            _marks[nearest.Id] = updated; Version++; return updated;
        }
        if (Count >= Capacity) { CapacityRejected++; return null; }
        var created = new BlastMark(Guid.NewGuid(), hit.BodyId, hit.CenterCcf, hit.TangentU, hit.TangentV,
            hit.Radius, Math.Min(100, dose), Math.Clamp(hit.Anisotropy, 1, 3), StableSeed(hit.BodyId, hit.CenterCcf), hit.Profile, epoch, epoch);
        if (!created.IsValid()) return null;
        Add(created); Version++; return created;
```

## Game APIs touched

The core records and index deliberately have no game assembly dependency. Their native entry point is the `Universe.ApplyVehicleSolvers` postfix consumer, whose ordering is established by `Program.PrepareFrame`.[^simulation][^program]

## Pitfalls and version notes

Repeated merge geometry is an approximation, not a spatial texture atlas. Broad and narrow burns intentionally remain separate. The store uses circular area for pressure even though the displayed footprint may be anisotropic. Capacity and merge thresholds are model choices, not engine limits. Stable history does not guarantee stable visibility when the 64-record render budget changes.

## See also

- [Save-bound sidecar transactions](save-bound-sidecar-transactions.md)
- [Frame and viewport terrain buffers](frame-viewport-terrain-buffers.md)
- [Live effect tuning and input](live-effect-tuning-and-input.md)
- [Persist body-fixed exposure sites with save-bound sidecar transactions](../../../howto/persistence/saves/save-mod-state-with-the-scene/save-mod-state-with-the-scene-4.md) - how-to article demonstrating this feature

[^store]: Deposition, compatible merging, snapshots and replacement.
[^mark]: Detached records and geometry validation.
[^vector]: Double-precision vector and stable tangent helper.
[^simulation]: Main-thread deposition consumer.
[^snapshot]: Versioned render snapshot cache.
[^visual]: Live visual radius, strength and selection score.
[^program]: Main-thread write window.
