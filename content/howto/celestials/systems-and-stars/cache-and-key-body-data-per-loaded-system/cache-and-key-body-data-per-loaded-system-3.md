---
type: How-To
title: "One-shot attach on the first UI frame with a universe"
description: "Match data loaded before any celestial exists to live bodies on the first UI frame where the universe is ready, compute derived numbers once and read only the live values per frame"
topic: cache-and-key-body-data-per-loaded-system
category: celestials
group: systems-and-stars
approach: 3
difficulty: beginner
prerequisites: [starmap]
demonstrated_by: [mods/compendium/features/derived-body-properties]
techniques: [starmap-lifecycle]
game_types: [KSA.Universe, KSA.Celestial]
lifecycle: [frame:draw-ui, startup:immediate-load]
hooks:
  - "starmap StarMapImmediateLoad"
  - "starmap StarMapAfterGui"
tags: [cache, one-shot, lifecycle, attach, universe-ready]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:33Z }
repos:
  - name: Compendium
    git: https://github.com/meow-sci/Compendium.git
    ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-game-assemblies-current-decomp-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA/Universe.cs (decompiled, build 2026.10.10.5554)"
  - id: compendium-src-cdmattachinfobodyjsondata-cs
    repo: Compendium
    path: src/CdmAttachInfoBodyJsonData.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmAttachInfoBodyJsonData.cs
    title: "Compendium/src/CdmAttachInfoBodyJsonData.cs"
  - id: compendium-src-compendiummain-cs
    repo: Compendium
    path: src/CompendiumMain.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CompendiumMain.cs
    title: "Compendium/src/CompendiumMain.cs"
---
Outcome: JSON loaded at `startup:immediate-load`, when no celestial exists, is matched to bodies the first frame the universe is ready, and derived numbers are computed once. Demonstrated by Compendium ([Derived body properties](../../../../mods/compendium/features/derived-body-properties.md)).

## Background: how the game does it

At `startup:immediate-load` StarMap calls `[StarMapImmediateLoad]` per mod from a prefix on `Mod.PrepareSystems`; no universe, system or body exists. `Universe.WorldSun` is set by `Universe.LoadSystem` (`startup:game-loaded`), so a non-null `WorldSun` is the cheapest "the universe exists" signal available to a UI hook ([current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L106), [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L256)).

## Lifecycle and timing

The attach runs inside `[StarMapAfterGui]` (`frame:draw-ui`), on the main thread, before the window draws. The data was loaded earlier; this is the first point where data and bodies both exist. Templates are load-time data and orbit elements are fixed for celestials, so only the orbital speed is read live. See the [game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

1. **Wait for the universe,** showing a placeholder until `Universe.WorldSun` is set, then run the attach once behind a static flag:

```csharp
// src/CompendiumMain.cs L73-L85
// Wait for universe to be fully loaded
if (Universe.WorldSun == null)
{
    if (ImGui.Begin("Compendium", ref CompendiumWindow))
    {
        ImGui.Text("Waiting for universe to load...");
        ImGui.End();
    }
    return;
} else if (!processedBodyJsonDict)
{
    AttachInfoBodyJsonDict();
    processedBodyJsonDict = true;
```

2. **Match entries to bodies** by key, resolving the body under the root named by the key prefix or under any root, and skip keys that match no loaded celestial ([src/CdmAttachInfoBodyJsonData.cs](https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmAttachInfoBodyJsonData.cs#L81-L105)).

3. **Compute derived numbers once** on the shared data object (see [read body properties](../read-body-properties-and-orbit-elements/read-body-properties-and-orbit-elements-4.md)).

4. **Read live values live:** `celestial.OrbitalSpeed` every frame, not cached.

## Complete example

| File | Role |
|---|---|
| [src/CompendiumMain.cs](https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CompendiumMain.cs#L73-L91) | Once-per-universe attach guard |
| [src/CdmAttachInfoBodyJsonData.cs](https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmAttachInfoBodyJsonData.cs#L81-L138) | Key-to-body matching and derived fields |

## Variations and gotchas

- **A static flag is not reload-safe.** If the player loads another save, the flag stays true and the data points at old bodies; reset it from a save-load signal (see [detect save and load](../../../persistence/saves/detect-save-load/overview.md)) or use approach 1 or 2 instead.
- **Rebuild category lists** when they were built without celestials or for another root.
- **Do not hook `LoadSystem`.** There is no StarMap hook for it; polling a null `WorldSun` costs nothing.

## See also

- [Overview](overview.md); [approach 2](cache-and-key-body-data-per-loaded-system-2.md); [approach 4](cache-and-key-body-data-per-loaded-system-4.md)
- [Derived body properties](../../../../mods/compendium/features/derived-body-properties.md)
- [Choose a StarMap startup hook](../../../getting-started/lifecycle/choose-a-starmap-startup-hook/overview.md), [Detect save and load](../../../persistence/saves/detect-save-load/overview.md)
