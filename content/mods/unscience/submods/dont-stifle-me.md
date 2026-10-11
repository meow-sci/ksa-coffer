---
type: Submod
title: "Don't Stifle Me"
description: "Vehicle-editor un-limiter: lifts the 0.5x-2x part scale clamp, restores per-axis gizmo scaling with optional unsnapped values, and can widen parachute diameter to 2-1000 m with exact restore of authored bounds"
mod: unscience
submod: dont-stifle-me
mod_id: dont-stifle-me
tags: [vehicle-editor, part-scaling, parachute, limits, harmony]
categories: [vehicles-and-parts]
features: [mods/unscience/features/dont-stifle-me-editor-free-scaling, mods/unscience/features/dont-stifle-me-parachute-diameter-unclamp]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T12:32:18Z }
status: stable
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: dont-stifle-me-readme-md
    repo: unscience
    path: dont-stifle-me/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/README.md
    title: dont-stifle-me/README.md
  - id: dont-stifle-me-lib-readme-md
    repo: unscience
    path: dont-stifle-me.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me.lib/README.md
    title: dont-stifle-me.lib/README.md
  - id: scope-part-editor-and-robotics-md
    repo: unscience
    path: scope/part-editor-and-robotics.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/part-editor-and-robotics.md
    title: scope/part-editor-and-robotics.md
  - id: repository-index-md
    repo: unscience
    path: REPOSITORY_INDEX.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/REPOSITORY_INDEX.md
    title: REPOSITORY_INDEX.md
  - id: dont-stifle-me-mod-toml
    repo: unscience
    path: dont-stifle-me/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/mod.toml
    title: dont-stifle-me/mod.toml
  - id: dont-stifle-me-mod-cs
    repo: unscience
    path: dont-stifle-me/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/Mod.cs
    title: dont-stifle-me/Mod.cs
  - id: dont-stifle-me-patcher-cs
    repo: unscience
    path: dont-stifle-me/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/Patcher.cs
    title: dont-stifle-me/Patcher.cs
  - id: dont-stifle-me-menubarpatch-cs
    repo: unscience
    path: dont-stifle-me/MenuBarPatch.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/MenuBarPatch.cs
    title: dont-stifle-me/MenuBarPatch.cs
  - id: dont-stifle-me-saves-cs
    repo: unscience
    path: dont-stifle-me.lib/DontStifleMeSubmod.Saves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me.lib/DontStifleMeSubmod.Saves.cs
    title: dont-stifle-me.lib/DontStifleMeSubmod.Saves.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
  - id: unscience-mod-cs
    repo: unscience
    path: unscience/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs
    title: unscience/Mod.cs
---

Don't Stifle Me removes restrictions the vehicle editor gained in rev 5348. With **Enabled** (default
on) any positive part scale is accepted instead of 0.5x-2.0x and each scale-gizmo arrow stretches only
its own axis, like the pre-5348 editor; **Snap scaling** (default on, the game's behavior) can be
switched off for continuous values. A separate **jpl said no clamps** switch (default off) widens
configurable editor value ranges, currently the parachute diameter, from the part-authored range to
2-1000 m and restores each chute's own bounds when it is turned off. All switches are static fields read
on every call, so the patches are installed once and never re-applied.

## Hosting

- Manifest id `dont-stifle-me`, entry assembly `MeowSci.DontStifleMe` (development host only; only the
  unscience supermod ships).
- Standalone host: no window and no hotkey. `[StarMapAllModsLoaded]` runs `Patcher.Patch`, which applies
  `HotkeyGuard`, `EditorScalePatches`, `EditorValueLimitPatches` and `MenuBarPatch`; the last is a
  postfix on `Program.DrawProgramMenusHook` that draws a top-level "Don't Stifle Me" menu with the three
  checkboxes (the hook is described in [the menu-bar entry feature](../features/unscience-menu-bar-entry.md)).
- In unscience, `unscience/Patcher.cs` applies `EditorScalePatches` and `EditorValueLimitPatches` in
  separate `TryApply` calls and removes them in reverse; the controls are the "Don't Stifle Me - Editor
  Limits" section of the toolbox, with a red notice when either patch group failed to apply. No menu is
  added there.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Don't Stifle Me editor free scaling (unclamped, per-axis, unsnapped)](../features/dont-stifle-me-editor-free-scaling.md) | vehicles-and-parts | `editor:on-frame`, `editor:pre-render`, `frame:input`, `frame:draw-ui` | Don't Stifle Me widens VehicleEditor.ScaleBoundsFor with a postfix, replaces the uniform UpdateSelectedScale drag with a per-axis one that reuses the game's private QuantizeScale and ForEachPartWithSymmetry through delegates, and can bypass the 0.25 m snapping |
| [Parachute diameter unclamp ("jpl said no clamps")](../features/dont-stifle-me-parachute-diameter-unclamp.md) | vehicles-and-parts | `editor:draw-ui`, `frame:draw-ui`, `event:save`, `event:load`, `event:unload` | Don't Stifle Me widens each parachute's runtime Tuning.MinDiameterM and MaxDiameterM to 2-1000 m from prefixes on VehicleEditor.DrawParachuteSection and Parachute.SetDiameter, tracking every touched instance so disabling or unloading restores the authored bounds |

## Library classes

`EditorScaleSettings` (`Enabled`, `Snap`), `EditorLimitSettings` (`JplSaidNoClamps`),
`EditorScalePatches` (four `VehicleEditor` patches plus `QuantizeScale`, `ScaleBoundsFor` and
`ForEachPartWithSymmetry` delegates), `PerAxisScaleDrag` (per-axis drag session),
`EditorValueLimitPatches` (parachute bound expansion and restore), `DontStifleMeMenu` (standalone menu
body), `DontStifleMeSubmod` (`ISubmod` section and `ISaveParticipantSource`).

## Scene saves and persistence

Participant `dont-stifle-me`, version 1, restore order 10: a `SavedLimits(Enabled, Snap,
ExtendedValues)` record. Reset restores the defaults (`true`, `true`, `false`) before native
reconstruction; replay copies the saved switches. Resized parts are ordinary native vehicle data; a
gizmo drag in progress is not resumed. The tracked original parachute bounds are not saved (they are
re-read from each live chute on first touch).

## Further reading

- [dont-stifle-me/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/README.md)
- [dont-stifle-me.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me.lib/README.md)
- [scope/part-editor-and-robotics.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/part-editor-and-robotics.md) (the `dont-stifle-me` section: per-target table and upgrade notes)
- [REPOSITORY_INDEX.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/REPOSITORY_INDEX.md)

## Entry points

- [dont-stifle-me/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/mod.toml)
- [dont-stifle-me/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/Mod.cs)
- [dont-stifle-me/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/Patcher.cs)
- [dont-stifle-me/MenuBarPatch.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/MenuBarPatch.cs)
- [dont-stifle-me.lib/DontStifleMeSubmod.Saves.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me.lib/DontStifleMeSubmod.Saves.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs#L92-L93)
- [unscience/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs#L81)

## See also

- [unscience overview](../overview.md)
- [Garry's Torch](./garrys-torch.md) (per-axis scaling of live vessels)
- [Godzilla](./godzilla.md) (whole-vessel scaling)
- [Free Fallin](./free-fallin.md) (parachute canopy rendering)
