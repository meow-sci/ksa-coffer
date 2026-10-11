---
type: How-To
title: "Dispose all streams on save reset before the vehicles are replaced"
description: "Stop and release every FMOD stream in a save participant's reset step, which runs in a Harmony prefix on Universe.DeserializeSave before the world is destroyed, stop an entry when its target vehicle is lost, and restore sounds paused"
topic: release-sound-channels-at-scene-change-and-exit
category: audio
group: channels
approach: 3
difficulty: advanced
prerequisites: [starmap, harmony]
demonstrated_by: [mods/unscience/features/byo-music-vessel-3d-audio]
techniques: [save-sidecar, harmony-prefix, fmod-audio]
game_types: [KSA.Universe, KSA.Vehicle, KSA.GameAudio, Brutal.FmodApi.Channel, Brutal.FmodApi.Sound]
lifecycle: [event:load, event:save, frame:draw-ui]
hooks:
  - "harmony-prefix KSA.Universe.DeserializeSave"
  - "harmony-postfix KSA.Universe.DeserializeSave"
  - "starmap StarMapBeforeGui"
tags: [audio, lifecycle, cleanup, save-load, streams, save-participant]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:10:00Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: "1829b3b298dd0fa5a67342cafff29074c8c29286"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
  - id: ksa-universe
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksa-uncompressedsave
    repo: ksa-game-assemblies
    path: current/decomp/KSA/UncompressedSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UncompressedSave.cs
    title: "KSA.UncompressedSave (decompiled, build 2026.10.10.5554)"
  - id: unscience-vesselsound
    repo: unscience
    path: byo-music.lib/VesselSound.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/byo-music.lib/VesselSound.cs
    title: "unscience: byo-music.lib/VesselSound.cs"
  - id: unscience-byomusicsubmod
    repo: unscience
    path: byo-music.lib/ByoMusicSubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/byo-music.lib/ByoMusicSubmod.cs
    title: "unscience: byo-music.lib/ByoMusicSubmod.cs"
  - id: unscience-byomusicsubmod-saves
    repo: unscience
    path: byo-music.lib/ByoMusicSubmod.Saves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/byo-music.lib/ByoMusicSubmod.Saves.cs
    title: "unscience: byo-music.lib/ByoMusicSubmod.Saves.cs"
  - id: unscience-nativesavehooks
    repo: unscience
    path: ksa-abstractions.lib/Persistence/NativeSaveHooks.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/Persistence/NativeSaveHooks.cs
    title: "unscience: ksa-abstractions.lib/Persistence/NativeSaveHooks.cs"
---

Outcome: when the player loads a save, every imported sound is stopped and its FMOD stream released before KSA
destroys the vehicles the sounds were attached to, and sounds saved with the scene come back paused. Prerequisites:
the stream in [article 3 of the FMOD-files topic](../play-sound-files-through-the-games-fmod-system/play-sound-files-through-the-games-fmod-system-3.md)
and a way to run code at the start of a load (here, the unscience scene-save coordinator). Demonstrated by BYO Music
in the unscience mod.

## Background: how the game does it

`Universe.DeserializeSave` stops the simulation, waits for jobs, destroys every vehicle and replaces the world; it stops
only the engine's own explosion sounds, never mod channels (see the [overview](overview.md)).[^ksa-universe] A sound
attached to a vessel by an object reference (`Vehicle`) is dangling the moment the vehicle is destroyed. The mod's
answer is to release its streams **before** that point, from a prefix on `DeserializeSave`.

## Lifecycle and timing

| Step | Where | Vocabulary |
|---|---|---|
| Prefix on `Universe.DeserializeSave` | Waits for the orbit, vehicle and cloth solvers, then calls the registered `Resetting` callbacks while the old world still exists | `event:load`, before vehicle destruction |
| Postfix on `DeserializeSave` | Runs the prepared restore closures in ascending order after KSA rebuilt the world | `event:load` |
| Capture | After KSA's save data is populated | `event:save` |
| Per-frame target check | At the top of each entry's `Update` | `frame:draw-ui` |

The load arrives through `UncompressedSave.Load`, which calls `DeserializeSave` and then `Program.OnGameLoaded`.[^ksa-uncompressedsave]
Details of the coordinator: [scene save coordinator](../../../../mods/unscience/features/lib-scene-save-coordinator.md)
and [scene save sidecar](../../../../mods/unscience/features/unscience-scene-save-sidecar.md).

## Steps

1. **Patch the load.** The shared native hooks patch `Universe.DeserializeSave` with a prefix (reset), a postfix
   (restore) and a finalizer; the prefix joins the worker threads first, then runs the reset callbacks:

   ```csharp
   // ksa-abstractions.lib/Persistence/NativeSaveHooks.cs L42-L43
   Patch(harmony, typeof(Universe), nameof(Universe.DeserializeSave), new[] { typeof(UniverseData) },
       prefix: nameof(ResetBeforeLoad), postfix: nameof(RestoreAfterLoad), finalizer: nameof(FinishedDirectLoad));
   ```

   ```csharp
   // ksa-abstractions.lib/Persistence/NativeSaveHooks.cs L181-L203
   private static bool ResetAtJoinedBoundary()
   {
       try
       {
           JobSystems.OrbitSolvers.Wait();
           JobSystems.VehicleSolver.Wait();
           JobSystems.ClothSolvers.Wait();
           // PrepareFrame queues nearest-orbit work before this handoff; it traverses
           // the current universe and must finish before vehicle destruction as well.
           JobSystems.NearestOrbitAndPerformanceWorker.Wait();
           PhysicsFrameHook.ClearPending();
           Invoke(Resetting, "reset");
           // Cleanup callbacks can themselves enqueue old-world edits. They cannot survive
           // the replacement, even when a participant throws halfway through cleanup.
           PhysicsFrameHook.ClearPending();
           return true;
       }
       catch (Exception ex)
       {
           Console.WriteLine($"unscience saves: cannot join reset boundary: {ex}");
           throw; // Never destroy a world while a worker could still own it.
       }
   }
   ```

2. **Make "reset" mean "release".** BYO Music's save participant uses the submod's `Dispose` as its reset, which stops and
   releases every stream and clears the list; it also captures only unfinished sounds whose vessel is still alive, and
   its restore re-creates sounds **paused**:

   ```csharp
   // byo-music.lib/ByoMusicSubmod.Saves.cs L11-L16, L24-L24, L29-L29
   public sealed record SavedSound(string VehicleId, string File, bool Repeat, float Gap, float Volume, float Range);
   public IEnumerable<ISaveParticipant> SaveParticipants => new[]
   {
       new SaveParticipant<SavedSound[]>("byo-music", () => _sounds.Where(s => !s.Finished && !s.Target.IsDisposed)
           .Select(s => new SavedSound(s.Target.Id, s.FileName, s.Repeat, s.GapSeconds, s.Volume, s.RangeMetres)).ToArray(),
           Dispose, (state, context) =>
   // ...
                       _sounds.Add(new(target, item.File, item.Repeat, item.Gap, item.Volume, item.Range, paused: true));
   // ...
           }, order: 220, validate: state =>
   ```

   ```csharp
   // byo-music.lib/ByoMusicSubmod.cs L115-L119
   public void Dispose()
   {
       foreach (var sound in _sounds) sound.Dispose();
       _sounds.Clear();
   }
   ```

3. **Stop and release per entry.** Each entry's `Stop` stops the channel, releases the FMOD sound and marks the entry
   finished; `Dispose` is just `Stop`:

   ```csharp
   // byo-music.lib/VesselSound.cs L134-L141
   public void Stop(string status = "Stopped")
   {
       if (_hasChannel) { _channel.TryStop(); _hasChannel = false; }
       if (!_sound.IsNull()) { _sound.TryRelease(); _sound = default; }
       Finished = true;
       Status = status;
   }
   public void Dispose() => Stop();
   ```

4. **Also stop when the target vanishes mid-session.** At the top of `Update`, before anything touches the channel,
   an entry whose vehicle is disposed, or is no longer the object `VehicleProvider.FindVehicle(id)` returns, stops
   itself:

   ```csharp
   // byo-music.lib/VesselSound.cs L54-L55
   if (Target.IsDisposed || VehicleProvider.FindVehicle(Target.Id) != Target)
   { Stop("Target no longer available"); return; }
   ```

5. **Restore paused.** A restored sound starts paused and plays from the beginning on Resume; the cursor and the
   remaining repeat gap are not saved. Missing vessels or files become warnings, not failures.

## Complete example

| File | Role |
|---|---|
| [byo-music.lib/ByoMusicSubmod.Saves.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/byo-music.lib/ByoMusicSubmod.Saves.cs) | Capture, reset (`Dispose`) and restore |
| [byo-music.lib/VesselSound.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/byo-music.lib/VesselSound.cs#L134-L141) | Per-entry stop and release |
| [ksa-abstractions.lib/Persistence/NativeSaveHooks.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-abstractions.lib/Persistence/NativeSaveHooks.cs#L36-L49) | The `DeserializeSave` patch |

## Variations and gotchas

- **Do it before the world is destroyed, not after.** A postfix cleanup can find the vehicle already disposed;
  KSArmory's [post-load flag](release-sound-channels-at-scene-change-and-exit-1.md) is the lighter option when the
  mod only needs to forget, not to restore.
- **Harmony target risk.** `DeserializeSave` is a public static method the unscience hooks patch with a reflection
  lookup; a signature change in a game update turns into a failed patch (the coordinator logs it).
- **Reset must not throw.** In the coordinator a participant whose reset throws is excluded from the restore.
- **Unload also disposes, and is moot.** The submod's `Dispose` runs at unload too, after FMOD has been closed; see
  [article 2](release-sound-channels-at-scene-change-and-exit-2.md).
- **Static-reading note.** The possible strict-versus-tolerant finish-path issue described in
  [the FMOD-files article](../play-sound-files-through-the-games-fmod-system/play-sound-files-through-the-games-fmod-system-3.md)
  applies to the entries this reset releases; it was not verified in game.

## See also

- [Overview of this topic](overview.md)
- [Approach 1: StopAll at StarMapUnload, plus Stop(stopImmediate) on world reload](release-sound-channels-at-scene-change-and-exit-1.md)
- [Approach 4: release sounds only after no channel plays them](release-sound-channels-at-scene-change-and-exit-4.md)
- Mod feature: [BYO Music](../../../../mods/unscience/features/byo-music-vessel-3d-audio.md)

[^ksa-universe]: KSA.Universe (decompiled, build 2026.10.10.5554)
[^ksa-uncompressedsave]: KSA.UncompressedSave (decompiled, build 2026.10.10.5554)
