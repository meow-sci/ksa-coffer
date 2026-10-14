---
type: Mod Feature
title: Scene reset and native cleanup
description: Separate scene state from GPU lifetime and join workers before resets or disposal so
  queued exposure cannot leak across scenes
mod: blasto
category: getting-started
tags:
  - blasto
  - getting-started
  - starmap-lifecycle
  - harmony-prefix
  - harmony-postfix
  - harmony-finalizer
techniques:
  - starmap-lifecycle
  - harmony-prefix
  - harmony-postfix
  - harmony-finalizer
game_types:
  - KSA.Program
  - KSA.Universe
  - KSA.JobSystems
  - KSA.PlanetRenderer
lifecycle:
  - frame:apply-solvers
  - event:load
  - event:game-dispose
  - event:starmap-unload
hooks:
  - harmony-prefix KSA.Universe.ApplyVehicleSolvers
  - harmony-prefix KSA.Universe.DeserializeSave
  - harmony-prefix KSA.Universe.LoadSystem
  - harmony-prefix KSA.Program.Dispose
  - harmony-prefix KSA.PlanetRenderer.Dispose
  - starmap StarMapUnload
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:05Z
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
  - id: entry
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Idempotent shutdown and command queue join barrier
  - id: generation
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Invalidate capture generation and transient simulation state
  - id: reset
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastPersistence.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs
    title: Clear scene state around native replacement
  - id: resource
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: Device-idle destruction of owned GPU resources
  - id: planet
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    title: Per-renderer disposal and owner unpatching
  - id: native-dispose
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Native particle and renderer teardown follows prefix
  - id: native-scene
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: Native deserialization joins workers and resets emitters
  - id: native-apply
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Queued controls run before next dispatch
---

Persistent marks and settings belong to a scene, but private terrain pipelines belong to the renderer. Blasto resets only the appropriate layer at each boundary and releases native resources before KSA destroys their owners.[^reset][^resource][^entry]

## How it works

Destructive UI work enters a command queue. A priority-first prefix on solver apply waits for workers when commands exist, then drains them. Reset increments a capture generation, removes queued samples, clears hit caches and owned dust, and discards pending diagnostics. Waiting before incrementing prevents an old worker interval from receiving a fresh generation after a clear.[^entry][^generation]

Native save deserialization and valid system replacement join workers before clearing the scene store and restoring default settings. The load postfix may then install saved records and settings. These transitions keep shader resources alive while removing stale particles, samples and body lookups.[^reset]

A `Program.Dispose` prefix runs idempotent cleanup: join workers, dispose simulation/persistence/rendering, and empty pending commands. A `PlanetRenderer.Dispose` prefix releases that renderer's private resources; GPU destruction waits for device idle. Later StarMap unload can unpatch and clear managed references without touching already-freed game resources.[^entry][^planet][^resource]

## Lifecycle and timing

Clear commands execute in `frame:apply-solvers`, before the next worker dispatch. Scene changes run at explicit `event:load` boundaries, with an explicit join even though native deserialization also joins. `event:game-dispose` must precede native particle-system and terrain-renderer destruction; the later `event:starmap-unload` hook is an idempotent fallback.[^native-apply][^native-scene][^native-dispose]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L72-L144) | Idempotent shutdown and command queue join barrier[^entry] |
| [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L208-L215) | Invalidate capture generation and transient simulation state[^generation] |
| [Blasto.GameMod/Persistence/BlastPersistence.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs#L116-L167) | Clear scene state around native replacement[^reset] |
| [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L162-L178) | Device-idle destruction of owned GPU resources[^resource] |
| [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L251-L267) | Per-renderer disposal and owner unpatching[^planet] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1362-L1391) | Native particle and renderer teardown follows prefix[^native-dispose] |
| [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2430-L2478) | Native deserialization joins workers and resets emitters[^native-scene] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222) | Queued controls run before next dispatch[^native-apply] |

## Snippets

```csharp
// Blasto.GameMod/Mod.cs L132-L139
    private static void DrainCommands()
    {
        if (_instance is not { _disposed: false } self) return;
        // Commands can reset the capture generation. Join workers first so an old
        // physics interval cannot enqueue a fresh-generation sample after a clear.
        if (!self._commands.IsEmpty) JobSystems.WaitAll();
        while (self._commands.TryDequeue(out var command))
            try { command(); } catch (Exception ex) { self._message = ex.Message; Log(ex.ToString()); }
```

```csharp
// Blasto.GameMod/Simulation/BlastSimulation.cs L208-L215
    public void Reset()
    {
        Interlocked.Increment(ref _generation);
        while (_samples.TryDequeue(out _)) Interlocked.Decrement(ref _queued);
        _probeCache.Clear(); _dust.Clear(); _debugPending = 0; _faultLogged = false; _lastCapacityRejected = 0;
        DebugPlacementStatus = "No test placement requested";
    }
    public void Dispose() { _enabled = false; if (_active == this) _active = null; Reset(); }
```

## Game APIs touched

`JobSystems.WaitAll` provides the boundary used by reset/shutdown code. Native `Universe.DeserializeSave` resets the particle pool after its join, and `Program.Dispose` destroys particles and terrain before the device. Those ownership boundaries determine where mod cleanup belongs.[^native-scene][^native-dispose][^entry]

## Pitfalls and version notes

A generation number alone is insufficient if old workers can enqueue after reset; retain the join-before-reset ordering. StarMap unload alone is too late for native destruction in the ordinary shutdown path. Device-idle cleanup is deliberately conservative and can stall. Scene-load failures are reported, but restoration is not a multi-object rollback transaction.

## See also

- [Worker nozzle exposure handoff](worker-nozzle-exposure-handoff.md)
- [Save-bound sidecar transactions](save-bound-sidecar-transactions.md)
- [Owned surface dust emitters](owned-surface-dust-emitters.md)
- [Persist body-fixed exposure sites with save-bound sidecar transactions](../../../howto/persistence/saves/save-mod-state-with-the-scene/save-mod-state-with-the-scene-4.md) - how-to article demonstrating this feature

[^entry]: Idempotent shutdown and command queue join barrier.
[^generation]: Invalidate capture generation and transient simulation state.
[^reset]: Clear scene state around native replacement.
[^resource]: Device-idle destruction of owned GPU resources.
[^planet]: Per-renderer disposal and owner unpatching.
[^native-dispose]: Native particle and renderer teardown follows prefix.
[^native-scene]: Native deserialization joins workers and resets emitters.
[^native-apply]: Queued controls run before next dispatch.
