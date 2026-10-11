---
type: Game Feature
title: Debug XML patches with the step debugger and the session log
description: How to find out why a KittenExtensions XML patch did nothing, using the pre-game ImGui stepper and the per-session patch log
topic: debug-xml-patches
category: assets
group: validation
approaches: 2
demonstrated_by: [mods/kittenextensions/features/patch-debug-stepper, mods/kittenextensions/features/patch-session-log]
game_types: [KSA.ModLibrary, KSA.ModEntry, KSA.Constants, KSA.Popup, KSA.Program, KSA.ModManifest]
lifecycle: ['startup:asset-load', 'startup:starmap-before-main']
tags: [xml-patch, debugging, logging, kittenextensions]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:16:27Z'}
status: stable
repos:
- {name: KittenExtensions, git: 'https://github.com/AMPW-german/KittenExtensions.git', ref: b52467541a4fda3c3771eb2c157ed7574f9e2d7c}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-program, repo: ksa-game-assemblies, path: current/decomp/KSA/Program.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs', title: 'current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modmanifest, repo: ksa-game-assemblies, path: current/decomp/KSA/ModManifest.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModManifest.cs', title: 'current/decomp/KSA/ModManifest.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-constants, repo: ksa-game-assemblies, path: current/decomp/KSA/Constants.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs', title: 'current/decomp/KSA/Constants.cs (decompiled, build 2026.10.10.5554)'}
- {id: kittenextensions-readme, repo: KittenExtensions, path: README.md, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/README.md', title: 'KittenExtensions: README.md'}
- {id: kittenextensions-patcher, repo: KittenExtensions, path: KittenExtensions/Patch/Patcher.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/Patcher.cs', title: 'KittenExtensions: KittenExtensions/Patch/Patcher.cs'}
- {id: kittenextensions-patcher-debug, repo: KittenExtensions, path: KittenExtensions/Patch/Patcher.Debug.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/Patcher.Debug.cs', title: 'KittenExtensions: KittenExtensions/Patch/Patcher.Debug.cs'}
- {id: kittenextensions-mod, repo: KittenExtensions, path: KittenExtensions/Mod.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Mod.cs', title: 'KittenExtensions: KittenExtensions/Mod.cs'}
- {id: kittenextensions-patchlogger, repo: KittenExtensions, path: KittenExtensions/Patch/PatchLogger.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/PatchLogger.cs', title: 'KittenExtensions: KittenExtensions/Patch/PatchLogger.cs'}
---

A wrong XPath, an operation that matches nothing or a patch that ran in the wrong order fails quietly: the game
starts with unpatched data. Two tools in KittenExtensions (KX) tell you what happened. A `debug` key on the manifest
entry opens a pre-game ImGui stepper (Run All, Step, Step Over, Step Out, an XPath tester and a live document tree),
and every run writes `KittenExtensions.log` with one line per mutation and the old and new values. The patch system
itself is in [Patch Core or another mod's XML data without copying files](../../xml-patching/patch-game-xml-data/overview.md).

## Engine background

- KX runs in a prefix on `ModLibrary.PrepareAll`, so these tools exist only at `startup:asset-load`, before any `Mod`,
  asset or universe exists. The renderer and ImGui context already exist, which is why an interactive popup is
  possible ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L373-L380), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L880-L900)).
- `ModLibrary.LocalManifestPath` is `manifest.toml` in `Constants.DocumentsFolderPath`; the game's own
  `ModManifest.Save()` writes only `id` and `enabled`, which can drop KX's `debug` key
  ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L176-L180), [current/decomp/KSA/ModManifest.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModManifest.cs#L27-L48)).
- Game logs live in `Constants.LogsFolderPath` (`.../logs`); KX writes `.../Logs/KittenExtensions.log`
  ([current/decomp/KSA/Constants.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs#L281-L283)).
- Phases: `startup:starmap-before-main` (the log is deleted) and `startup:asset-load` (the run). See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Debug a failing XML patch with the KittenExtensions step debugger](debug-xml-patches-1.md) | KittenExtensions | `debug = true` on the manifest entry opens the stepper; `root.xml` holds the unpatched document | `startup:asset-load` | Interactive and shows target and source XPath results; blocks startup; flag can be dropped when the game rewrites the manifest |
| [Audit what patches changed from KittenExtensions.log](debug-xml-patches-2.md) | KittenExtensions | Per-session `KittenExtensions.log` with old and new values and per-file summaries | `startup:starmap-before-main`, `startup:asset-load` | Always on and searchable; only mutations are lines, so a no-match shows as absence |

## See also

- [Patch Core or another mod's XML data without copying files](../../xml-patching/patch-game-xml-data/overview.md), [Write XPath patch operations for game XML](../../xml-patching/xpath-xml-patch-recipes/overview.md), [Understand when and in which order KSA loads mod XML](../../asset-xml/mod-xml-load-order/overview.md),
  [Redirect the game to patched copies of its XML and coordinate edits between mods](../../xml-patching/redirect-game-xml-loading/overview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../validate-asset-xml-references/overview.md), [Log from a mod: per-mod log file, game log category and log-once](../../../getting-started/lifecycle/write-a-per-mod-log-file/overview.md), [Drive a running game from scripts through a file-drop command bridge](../../../testing-and-tooling/in-game-testing/drive-a-running-game-through-a-file-bridge/overview.md)
- [Patch debug stepper](../../../../mods/kittenextensions/features/patch-debug-stepper.md), [Patch session log](../../../../mods/kittenextensions/features/patch-session-log.md)
