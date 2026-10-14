---
type: How-To
title: Persist body-fixed exposure sites with save-bound sidecar transactions
description: Persist bounded body-fixed effect history as validated native-save-bound snapshots and
  reset transient owners safely at scene boundaries
topic: save-mod-state-with-the-scene
category: persistence
group: saves
approach: 4
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/persistent-exposure-site-store
  - mods/blasto/features/save-bound-sidecar-transactions
  - mods/blasto/features/scene-reset-and-native-cleanup
techniques:
  - spatial-index
  - immutable-snapshot
  - harmony-postfix
  - harmony-prefix
  - harmony-finalizer
  - save-sidecar
  - json-config
  - starmap-lifecycle
game_types:
  - KSA.Universe
  - KSA.GameSave
  - KSA.UncompressedSave
  - KSA.Program
  - KSA.JobSystems
  - KSA.PlanetRenderer
lifecycle:
  - frame:apply-solvers
  - event:save
  - event:load
  - event:game-dispose
  - event:starmap-unload
hooks:
  - harmony-postfix KSA.Universe.ApplyVehicleSolvers
  - harmony-postfix KSA.GameSave.Populate
  - harmony-postfix KSA.UncompressedSave.Write
  - harmony-prefix KSA.UncompressedSave.Load
  - harmony-finalizer KSA.UncompressedSave.Load
  - harmony-prefix KSA.Universe.DeserializeSave
  - harmony-postfix KSA.Universe.DeserializeSave
  - harmony-prefix KSA.Universe.ApplyVehicleSolvers
  - harmony-prefix KSA.Universe.LoadSystem
  - harmony-prefix KSA.Program.Dispose
  - harmony-prefix KSA.PlanetRenderer.Dispose
  - starmap StarMapUnload
tags:
  - persistence
  - blasto
  - spatial-index
  - immutable-snapshot
  - harmony-postfix
  - harmony-prefix
  - harmony-finalizer
  - save-sidecar
  - json-config
  - getting-started
  - starmap-lifecycle
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
  - id: ksa-game-assemblies-current-decomp-ksa-gamesave-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSave.cs
    title: "ksa-game-assemblies: current/decomp/KSA/GameSave.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-uncompressedsave-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/UncompressedSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UncompressedSave.cs
    title: "ksa-game-assemblies: current/decomp/KSA/UncompressedSave.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Universe.cs"
  - id: blasto-blasto-gamemod-mod-cs
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: "blasto: Blasto.GameMod/Mod.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: blasto-blasto-gamemod-core-blastsitestore-cs
    repo: blasto
    path: Blasto.GameMod/Core/BlastSiteStore.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastSiteStore.cs
    title: "blasto: Blasto.GameMod/Core/BlastSiteStore.cs"
  - id: blasto-blasto-gamemod-persistence-blastpersistence-cs
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastPersistence.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs
    title: "blasto: Blasto.GameMod/Persistence/BlastPersistence.cs"
  - id: blasto-blasto-gamemod-persistence-blastsavecodec-cs
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastSaveCodec.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveCodec.cs
    title: "blasto: Blasto.GameMod/Persistence/BlastSaveCodec.cs"
  - id: blasto-blasto-gamemod-rendering-blastrenderresources-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: "blasto: Blasto.GameMod/Rendering/BlastRenderResources.cs"
---

Choose this approach for one feature system with persistent geometric history and transient native resources. Blasto combines a portable site store with a focused JSON sidecar adapter. Keep records and validation in a game-free layer; wire save/load and cleanup from the StarMap entry class.

## Background: how the game does it

GameSave.Populate captures universe data, and UncompressedSave.Make calls Populate before Write on the same object. The write returns success only after native files and registration succeed. Deserialization joins jobs and resets native particle state before replacing the scene. See [current/decomp/KSA/GameSave.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSave.cs#L37-L42)[^ksa-game-assemblies-current-decomp-ksa-gamesave-cs], [current/decomp/KSA/UncompressedSave.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UncompressedSave.cs#L108-L149)[^ksa-game-assemblies-current-decomp-ksa-uncompressedsave-cs] and [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2430-L2478)[^ksa-game-assemblies-current-decomp-ksa-universe-cs].

## Lifecycle and timing

Deposit history at frame:apply-solvers. Capture and publish at event:save, reset and restore at event:load. Clear commands join before changing the capture generation. Program.Dispose must release Blasto resources before native particles and the Vulkan renderer are destroyed; StarMapUnload is an idempotent fallback. See [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L110-L144)[^blasto-blasto-gamemod-mod-cs] and [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1362-L1391)[^ksa-game-assemblies-current-decomp-ksa-program-cs].

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Store detached body-fixed records and merge compatible exposure.** Copy BlastMark, Double3 and BlastSiteStore. Retain body identity, double center, tangent frame, radius, exposure, seed and time rather than GPU objects. The store uses a 64 m grid, matching surface profiles, a radius ratio at most 1.35 and aligned normals; merged history retains anchor, orientation and seed:

```csharp
// Blasto.GameMod/Core/BlastSiteStore.cs L73-L84
// ...
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
// ...
```
Deposition uses pressure above a threshold times burn duration and buildup rate; saved exposure saturates at 100. Preserve validation and the default 4,096-site capacity in [Blasto.GameMod/Core/BlastSiteStore.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Core/BlastSiteStore.cs#L19-L71)[^blasto-blasto-gamemod-core-blastsitestore-cs]. Replacement validates every incoming record before clearing the old store, so malformed or duplicate input leaves it intact; this is not rollback protection against a later allocation failure. Rendering reads a Version-keyed snapshot instead of adding exposure: [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L81-L85)[^blasto-blasto-gamemod-mod-cs].

2. **Associate a capture with the native save object.** Keep the ConditionalWeakTable keyed by GameSave. The Populate postfix snapshots immutable settings and detached marks:

```csharp
// Blasto.GameMod/Persistence/BlastPersistence.cs L54-L64
    private static void Capture(GameSave __instance, bool __runOriginal)
    {
        var self = _instance;
        if (self is null || !__runOriginal) return;
        try
        {
            self._captures.Remove(__instance);
            self._captures.Add(__instance, new BlastSaveDocument { Settings = self._settings(), Marks = self._store.Snapshot() });
        }
        catch (Exception ex) { self.Report($"Could not capture blast marks: {ex.Message}"); }
    }
```
Register exact signatures, and retain the original-call guards from [Blasto.GameMod/Persistence/BlastPersistence.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs#L32-L51)[^blasto-blasto-gamemod-persistence-blastpersistence-cs]. A later Write must not silently capture a different frame.

3. **Publish only after the matching native write succeeds.** Copy the capture lookup, recovery write, sidecar write and finally-removal together:

```csharp
// Blasto.GameMod/Persistence/BlastPersistence.cs L66-L82
    private static void Written(UncompressedSave __instance, bool __result, bool __runOriginal)
    {
        var self = _instance;
        if (self is null || !__runOriginal) return;
        try
        {
            if (!__result) { self.Report("KSA save failed; blast state was not written."); return; }
            if (!self._captures.TryGetValue(__instance, out var document))
            { self.Report("Native save has no matching blast snapshot; sidecar was not written."); return; }
            if (self._recovery is { } recovery)
                BlastSaveCodec.AtomicWrite(Path.Combine(__instance.Directory.FullName, BlastSaveCodec.RecoveryFileName), recovery);
            BlastSaveCodec.Write(__instance.Directory.FullName, document);
            self.Status = $"Saved {document.Marks.Length} blast marks." + (self._recovery is null ? "" : " Unrestored data retained in blasto.recovery.json.");
        }
        catch (Exception ex) { self.Report($"KSA saved, but blast state could not be written: {ex.Message}"); }
        finally { self._captures.Remove(__instance); }
    }
```
The codec binds JSON to the current universe.xml SHA-256, enforces schema/pattern versions, rejects duplicate/unknown properties and malformed records, and caps input at 16 MiB and depth 16. See [Blasto.GameMod/Persistence/BlastSaveCodec.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveCodec.cs#L11-L66)[^blasto-blasto-gamemod-persistence-blastsavecodec-cs].

4. **Replace the sidecar through a flushed temporary file.** Use a unique sibling temporary path; write and flush before replacing the destination, with temporary cleanup in finally:

```csharp
// Blasto.GameMod/Persistence/BlastSaveCodec.cs L77-L94
// ...

    public static void AtomicWrite(string path, byte[] bytes)
    {
        if (bytes.Length > MaximumBytes) throw new InvalidDataException("Blast save exceeds 16 MiB.");
        string temporary = path + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            using (var stream = new FileStream(temporary, FileMode.CreateNew, FileAccess.Write, FileShare.None))
            {
                stream.Write(bytes);
                stream.Flush(flushToDisk: true);
            }
            File.Move(temporary, path, overwrite: true);
        }
        finally
        {
            if (File.Exists(temporary)) File.Delete(temporary);
        }
// ...
```
This protects a single sidecar replacement. It does not make native and mod files one atomic transaction.

5. **Scope load state, then join before reset and restore.** A load prefix decodes an optional document; its finalizer restores the previous load context. Preserve bounded invalid bytes for recovery. Before native deserialization, join workers and reset transient state:

```csharp
// Blasto.GameMod/Persistence/BlastPersistence.cs L116-L125
    private static void BeforeDeserialize(UniverseData universeData, bool __runOriginal, out bool __state)
    {
        __state = false;
        if (!__runOriginal || _instance is not { } self || Universe.CurrentSystem is null || universeData is null) return;
        // Only managed records and owned particles are reset; GPU resources remain alive through scene loads.
        // KSA joins the same workers immediately inside DeserializeSave.
        JobSystems.WaitAll();
        self.ResetWorld();
        __state = true;
    }
```
After successful native deserialization, replace marks and apply settings; missing sidecars mean an empty default scene, while absent-body records remain saved. Copy the restoration and valid-system replacement logic from [Blasto.GameMod/Persistence/BlastPersistence.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs#L127-L163)[^blasto-blasto-gamemod-persistence-blastpersistence-cs].

6. **Separate scene reset from renderer disposal.** Clear sample generations, hit caches and owned dust while retaining shaders through a scene load. On game shutdown, dispose simulation, persistence and rendering once:

```csharp
// Blasto.GameMod/Mod.cs L110-L123
    private void ReleaseResources()
    {
        if (_disposed) return;
        _disposed = true;
        // During normal shutdown this prefix runs before KSA destroys particles and the Vulkan device.
        // Late StarMap unload is then a managed-only no-op.
        try { if (_initialized) JobSystems.WaitAll(); }
        catch (Exception ex) { Log($"Worker shutdown: {ex.Message}"); }
        foreach (var disposable in new IDisposable?[] { _simulation, _persistence, _renderer })
            try { disposable?.Dispose(); }
            catch (Exception ex) { Log($"Cleanup: {ex.Message}"); }
        _simulation = null; _persistence = null; _renderer = null;
        while (_commands.TryDequeue(out _)) { }
    }
```
Private GPU resources wait for device idle before destruction; keep [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L162-L178)[^blasto-blasto-gamemod-rendering-blastrenderresources-cs] attached to native renderer disposal, not only late loader unload.

## Complete example

The complete reference is [Blasto.GameMod/Persistence/BlastPersistence.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs#L11-L167)[^blasto-blasto-gamemod-persistence-blastpersistence-cs] plus [Blasto.GameMod/Persistence/BlastSaveCodec.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveCodec.cs#L11-L115)[^blasto-blasto-gamemod-persistence-blastsavecodec-cs] and the portable core store. Expected status includes saved/restored mark counts, missing-body retention and explicit native-save-versus-sidecar failure messages.

## Variations and gotchas

Only uncompressed native saves are covered. Blasto does not implement the whole-scene load deferral of approach 3; it joins before resetting its own state and does not promise to repair every native UI-triggered load hazard. Oversized invalid files cannot be retained as recovery. A successful native save can coexist with a failed sidecar. Restoration is not an all-object rollback transaction. Keep physics-derived history independent of live artistic size/visibility settings, and test repeated loads, invalid versions and clear-while-burning.

## See also

- [Compare approaches](overview.md)
- [Persistent exposure site store](../../../../mods/blasto/features/persistent-exposure-site-store.md)
- [Save-bound sidecar transactions](../../../../mods/blasto/features/save-bound-sidecar-transactions.md)
- [Scene reset and native cleanup](../../../../mods/blasto/features/scene-reset-and-native-cleanup.md)
- [Approach 1: ISaveParticipant records through a game-independent coordinator](save-mod-state-with-the-scene-1.md)
- [Approach 2: Host wiring - pair each capture with its write by object identity](save-mod-state-with-the-scene-2.md)
- [Approach 3: Eight static callbacks over five patched methods, loads replayed at the frame handoff](save-mod-state-with-the-scene-3.md)

[^ksa-game-assemblies-current-decomp-ksa-gamesave-cs]: ksa-game-assemblies: current/decomp/KSA/GameSave.cs.
[^ksa-game-assemblies-current-decomp-ksa-uncompressedsave-cs]: ksa-game-assemblies: current/decomp/KSA/UncompressedSave.cs.
[^ksa-game-assemblies-current-decomp-ksa-universe-cs]: ksa-game-assemblies: current/decomp/KSA/Universe.cs.
[^blasto-blasto-gamemod-mod-cs]: blasto: Blasto.GameMod/Mod.cs.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^blasto-blasto-gamemod-core-blastsitestore-cs]: blasto: Blasto.GameMod/Core/BlastSiteStore.cs.
[^blasto-blasto-gamemod-persistence-blastpersistence-cs]: blasto: Blasto.GameMod/Persistence/BlastPersistence.cs.
[^blasto-blasto-gamemod-persistence-blastsavecodec-cs]: blasto: Blasto.GameMod/Persistence/BlastSaveCodec.cs.
[^blasto-blasto-gamemod-rendering-blastrenderresources-cs]: blasto: Blasto.GameMod/Rendering/BlastRenderResources.cs.
