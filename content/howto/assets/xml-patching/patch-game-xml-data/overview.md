---
type: Game Feature
title: Patch Core or another mod's XML data without copying files
description: How a mod changes stock or other mods' XML through KittenExtensions patch files listed under a patches key in mod.toml, and how to depend on KittenExtensions optionally
topic: patch-game-xml-data
category: assets
group: xml-patching
approaches: 2
demonstrated_by: [mods/kittenextensions/features/gamedata-document, mods/kittenextensions/features/xpath-patch-operations, mods/ksa-advancedflightcomputer/features/optional-kittenextensions-patches]
game_types: [KSA.ModLibrary, KSA.Mod, KSA.ModEntry, KSA.ModManifest, KSA.XmlLoader, KSA.AssetBundle]
lifecycle: ['startup:asset-load', 'startup:immediate-load', 'startup:all-mods-loaded']
tags: [xml-patch, mod-toml, kittenextensions, gamedata, patches]
generated: {by: claude-code/sonnet-5.5, at: '2026-10-10T22:31:08Z'}
status: stable
repos:
- {name: KittenExtensions, git: 'https://github.com/AMPW-german/KittenExtensions.git', ref: b52467541a4fda3c3771eb2c157ed7574f9e2d7c}
- {name: KSA-AdvancedFlightComputer, git: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git', ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63}
- {name: StarMap, git: 'https://github.com/StarMapLoader/StarMap.git', ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-program, repo: ksa-game-assemblies, path: current/decomp/KSA/Program.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs', title: 'current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-mod, repo: ksa-game-assemblies, path: current/decomp/KSA/Mod.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs', title: 'current/decomp/KSA/Mod.cs (decompiled, build 2026.10.10.5554)'}
- {id: kittenextensions-patches, repo: KittenExtensions, path: KittenExtensions/Patches.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patches.cs', title: 'KittenExtensions: KittenExtensions/Patches.cs'}
- {id: kittenextensions-readme, repo: KittenExtensions, path: README.md, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/README.md', title: 'KittenExtensions: README.md'}
- {id: ksa-advancedflightcomputer-mod, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/mod.toml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/mod.toml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/mod.toml'}
- {id: kittenextensions-patcher, repo: KittenExtensions, path: KittenExtensions/Patch/Patcher.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/Patcher.cs', title: 'KittenExtensions: KittenExtensions/Patch/Patcher.cs'}
- {id: ksa-advancedflightcomputer-hyperbolicbodies, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Patches/HyperbolicBodies.xml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Patches/HyperbolicBodies.xml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Patches/HyperbolicBodies.xml'}
- {id: ksa-advancedflightcomputer-autostagebutton, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Patches/AutoStageButton.xml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Patches/AutoStageButton.xml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Patches/AutoStageButton.xml'}
- {id: ksa-xmlloader, repo: ksa-game-assemblies, path: current/decomp/KSA/XmlLoader.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs', title: 'current/decomp/KSA/XmlLoader.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-advancedflightcomputer-transferplannerpatches, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs'}
- {id: ksa-advancedflightcomputer-mod-2, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Mod.cs, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Mod.cs', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Mod.cs'}
- {id: ksa-advancedflightcomputer-advancedflightcomputer, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/AdvancedFlightComputer.csproj, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/AdvancedFlightComputer.csproj', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/AdvancedFlightComputer.csproj'}
- {id: ksa-advancedflightcomputer-moddeploy, repo: KSA-AdvancedFlightComputer, path: build/ModDeploy.targets, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ModDeploy.targets', title: 'KSA-AdvancedFlightComputer: build/ModDeploy.targets'}
- {id: starmap-starmapconfig, repo: StarMap, path: StarMap.Core/Config/StarMapConfig.cs, resource: 'https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Config/StarMapConfig.cs', title: 'StarMap: StarMap.Core/Config/StarMapConfig.cs'}
- {id: starmap-modloader, repo: StarMap, path: StarMap.Core/ModRepository/ModLoader.cs, resource: 'https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModLoader.cs', title: 'StarMap: StarMap.Core/ModRepository/ModLoader.cs'}
---

KSA loads its content from XML files named in each mod's `mod.toml`: `assets`, `systems` and
`planetMeshes`. The game itself has no way to modify another file's contents. If a mod needs to add a
button to a stock gauge, give a body a missing element or retune a stock part, it must either ship a
full replacement copy of the file (and keep it in sync with every game update; see
[Redirect the game to patched copies of its XML and coordinate edits between mods](../redirect-game-xml-loading/overview.md)) or use a patching layer. KittenExtensions (KX) is that layer: a
`patches` key in `mod.toml` lists patch files, and KX runs them against an in-memory document built from
every manifest mod's XML before the game deserializes anything.

## Engine background

- `ModLibrary.PrepareAll` finds each enabled manifest mod's folder, makes a `Mod` and calls
  `PrepareSystems`; `PreloadAssetBundles`, `LoadEditorTags` and `LoadAll` follow. All of it is called
  from `Program`'s constructor ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L373-L447), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L899-L942)).
- `Mod` reads its keys from `mod.toml` with `[TomlField]` attributes and has no `patches` field, so
  the key is invisible to the game ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L56-L72)).
- `Mod.LoadAssetBundles`, `LoadSystems`, `PrepareSystems` and `LoadPlanetMeshes` call
  `XmlLoader.Load<T>` on `Path.Combine(DirectoryPath, entry)`; KX rewrites those calls so they read
  from the patched document ([Redirect the game to patched copies of its XML and coordinate edits between mods](../redirect-game-xml-loading/overview.md) approach 2).
- Phase: `startup:asset-load`. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for where this sits in the startup sequence.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Patch Core or another mod's XML with a patches array in mod.toml](patch-game-xml-data-1.md) | KittenExtensions | `patches` array in `mod.toml`, one combined `<Root>/<Mod>` document, patches run in manifest then file order | `startup:asset-load` | The mechanism itself; hard dependency on KX; restart to change; disabled mods still patch |
| [Ship XML patches that apply only when KittenExtensions is installed](patch-game-xml-data-2.md) | KSA-AdvancedFlightComputer | Optional StarMap dependency, `Patches/*.xml` deployed beside the DLL, code that degrades when the data is absent | `startup:asset-load` plus `startup:immediate-load` for the code half | Mod stays useful without KX; needs a clear story for the missing-patch case |

## See also

- [Write XPath patch operations for game XML](../xpath-xml-patch-recipes/overview.md) (the operations), [Debug XML patches with the step debugger and the session log](../../validation/debug-xml-patches/overview.md) (stepper and log),
  [Understand when and in which order KSA loads mod XML](../../asset-xml/mod-xml-load-order/overview.md) (the load sequence), [Redirect the game to patched copies of its XML and coordinate edits between mods](../redirect-game-xml-loading/overview.md) (substituting whole files)
- [Declare a dependency on another StarMap mod, required or optional](../../../getting-started/dependencies/declare-a-mod-dependency/overview.md), [Add to, drive and hide the stock cockpit gauges and navball](../../../ui/menus/work-with-stock-cockpit-gauges/overview.md)
- [Combined GameData XML document](../../../../mods/kittenextensions/features/gamedata-document.md), [XML patch files and XPathPatch operations](../../../../mods/kittenextensions/features/xpath-patch-operations.md),
  [Optional KittenExtensions XML patches from mod.toml](../../../../mods/ksa-advancedflightcomputer/features/optional-kittenextensions-patches.md)
