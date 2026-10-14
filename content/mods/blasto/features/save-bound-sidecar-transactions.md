---
type: Mod Feature
title: Save-bound sidecar transactions
description: Capture detached mod state alongside native saves and write an integrity-bound
  validated sidecar with bounded recovery data
mod: blasto
category: persistence
tags:
  - blasto
  - persistence
  - harmony-postfix
  - harmony-prefix
  - harmony-finalizer
  - save-sidecar
  - json-config
techniques:
  - harmony-postfix
  - harmony-prefix
  - harmony-finalizer
  - save-sidecar
  - json-config
game_types:
  - KSA.GameSave
  - KSA.UncompressedSave
  - KSA.Universe
lifecycle:
  - event:save
  - event:load
hooks:
  - harmony-postfix KSA.GameSave.Populate
  - harmony-postfix KSA.UncompressedSave.Write
  - harmony-prefix KSA.UncompressedSave.Load
  - harmony-finalizer KSA.UncompressedSave.Load
  - harmony-prefix KSA.Universe.DeserializeSave
  - harmony-postfix KSA.Universe.DeserializeSave
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
  - id: persistence
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastPersistence.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs
    title: Native-save capture association and scoped load context
  - id: codec
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastSaveCodec.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveCodec.cs
    title: Strict decoding, integrity binding and atomic sidecar write
  - id: document
    repo: blasto
    path: Blasto.GameMod/Persistence/BlastSaveDocument.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs
    title: Versioned detached state and legacy settings defaults
  - id: capture
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSave.cs
    title: Native save capture contract
  - id: native-save
    repo: ksa-game-assemblies
    path: current/decomp/KSA/UncompressedSave.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UncompressedSave.cs
    title: Load, successful write and capture-before-write sequence
  - id: deserialize
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: Native scene replacement and worker join
---

Blasto stores `blasto.json` beside the native `universe.xml`. It captures state when the native save object is populated, then writes only after that same uncompressed save reports success, preventing a later frame's mark history from being attached to an earlier native snapshot.[^persistence][^native-save]

## How it works

Associate each `GameSave` object with an immutable settings record and detached mark array in a `ConditionalWeakTable`. The successful `UncompressedSave.Write` postfix requires both the original native call and its matching capture; failures report an error without throwing into the native save path.[^persistence][^capture]

Bind serialized data to the native file's SHA-256. Decode under a 16 MiB size limit and depth 16; reject duplicate properties, unknown fields, unsupported schema/pattern versions, invalid settings, duplicate mark identities and more than 4,096 marks. Write a unique temporary file, flush it to disk and replace the destination.[^codec]

A load prefix prepares an optional sidecar context; a finalizer restores the previous context. Around native deserialization, reset old scene state and restore valid data after the native scene exists. Missing sidecars produce an empty scene. Invalid bounded source bytes are retained for a recovery sidecar on the next successful save. Marks referencing absent bodies remain in saved history.[^persistence][^deserialize]

Schema 1 keeps original constructor settings and adds optional initialized properties, so older settings retain explicit intensity and receive new appearance defaults.[^document]

## Lifecycle and timing

`event:save` separates capture from file completion; native `UncompressedSave.Make` calls `Populate` before `Write`. `event:load` scopes the sidecar to the native load stack, restoring records only after native deserialization. Worker joining occurs before the mod clears scene state.[^native-save][^persistence][^deserialize]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Persistence/BlastPersistence.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastPersistence.cs#L32-L148) | Native-save capture association and scoped load context[^persistence] |
| [Blasto.GameMod/Persistence/BlastSaveCodec.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveCodec.cs#L11-L115) | Strict decoding, integrity binding and atomic sidecar write[^codec] |
| [Blasto.GameMod/Persistence/BlastSaveDocument.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Persistence/BlastSaveDocument.cs#L7-L45) | Versioned detached state and legacy settings defaults[^document] |
| [current/decomp/KSA/GameSave.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameSave.cs#L37-L42) | Native save capture contract[^capture] |
| [current/decomp/KSA/UncompressedSave.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/UncompressedSave.cs#L45-L149) | Load, successful write and capture-before-write sequence[^native-save] |
| [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2430-L2478) | Native scene replacement and worker join[^deserialize] |

## Snippets

```csharp
// Blasto.GameMod/Persistence/BlastPersistence.cs L66-L81
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
```

## Game APIs touched

`GameSave.Populate` captures native universe data. `UncompressedSave.Write` returns success after writing/registering the native save. `Universe.DeserializeSave` joins workers and rebuilds scene state; Blasto patches these boundaries without replacing another mod's callbacks.[^capture][^native-save][^deserialize]

## Pitfalls and version notes

Only native uncompressed saves are handled. Atomic sidecar replacement is not a transaction spanning both native and sidecar files: native saving can succeed while the sidecar fails. Hash binding detects mismatches but requires moving the complete save directory. Data larger than the bounded read limit cannot be retained as recovery. `GameBuild` is recorded, while schema/pattern versions are the codec's compatibility gate.

## See also

- [Persistent exposure site store](persistent-exposure-site-store.md)
- [Scene reset and native cleanup](scene-reset-and-native-cleanup.md)
- [Live effect tuning and input](live-effect-tuning-and-input.md)
- [Persist body-fixed exposure sites with save-bound sidecar transactions](../../../howto/persistence/saves/save-mod-state-with-the-scene/save-mod-state-with-the-scene-4.md) - how-to article demonstrating this feature

[^persistence]: Native-save capture association and scoped load context.
[^codec]: Strict decoding, integrity binding and atomic sidecar write.
[^document]: Versioned detached state and legacy settings defaults.
[^capture]: Native save capture contract.
[^native-save]: Load, successful write and capture-before-write sequence.
[^deserialize]: Native scene replacement and worker join.
