---
type: Game Feature
title: Ship data files with a mod and let other mods contribute more
description: How a code mod packages and finds its own data files, scans other mods for contributions, reads a convention folder inside every installed mod, and writes a new mod folder from the game
topic: ship-and-share-data-files-between-mods
category: assets
group: asset-xml
approaches: 4
demonstrated_by: [mods/ohmystars/features/mod-root-and-packaging, mods/compendium/features/cross-mod-json-catalog, mods/ksarmory/features/weapon-packs-from-mod-folders, mods/unscience/features/parts-now-paste-xml-mod-writer]
game_types: [KSA.Mod, KSA.ModLibrary, KSA.ModManifest, KSA.ModEntry, KSA.Universe, KSA.CelestialSystem, KSA.PartTemplate]
lifecycle: ['startup:all-mods-loaded', 'startup:immediate-load', 'frame:draw-ui']
tags: [data-files, packaging, cross-mod, manifest, convention-folder]
generated: {by: claude-code/sonnet-5.5, at: '2026-10-10T22:31:08Z'}
status: stable
repos:
- {name: StarMap, git: 'https://github.com/StarMapLoader/StarMap.git', ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa}
- {name: OhMyStars, git: 'https://github.com/nanonestor/OhMyStars.git', ref: 4bb602e3bfe36bcd3670b71b88bf644fe95fa407}
- {name: Compendium, git: 'https://github.com/meow-sci/Compendium.git', ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c}
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
- {name: unscience, git: 'https://github.com/meow-sci/unscience.git', ref: 1829b3b298dd0fa5a67342cafff29074c8c29286}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-mod, repo: ksa-game-assemblies, path: current/decomp/KSA/Mod.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs', title: 'current/decomp/KSA/Mod.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modmanifest, repo: ksa-game-assemblies, path: current/decomp/KSA/ModManifest.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModManifest.cs', title: 'current/decomp/KSA/ModManifest.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modentry, repo: ksa-game-assemblies, path: current/decomp/KSA/ModEntry.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModEntry.cs', title: 'current/decomp/KSA/ModEntry.cs (decompiled, build 2026.10.10.5554)'}
- {id: starmap-runtimemod, repo: StarMap, path: StarMap.Core/ModRepository/RuntimeMod.cs, resource: 'https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/RuntimeMod.cs', title: 'StarMap: StarMap.Core/ModRepository/RuntimeMod.cs'}
- {id: ohmystars-mod, repo: OhMyStars, path: packaging/mod.toml, resource: 'https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/packaging/mod.toml', title: 'OhMyStars: packaging/mod.toml'}
- {id: ohmystars-ohmystars, repo: OhMyStars, path: src/OhMyStars.csproj, resource: 'https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/src/OhMyStars.csproj', title: 'OhMyStars: src/OhMyStars.csproj'}
- {id: ohmystars-modpaths, repo: OhMyStars, path: src/ModPaths.cs, resource: 'https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/src/ModPaths.cs', title: 'OhMyStars: src/ModPaths.cs'}
- {id: ohmystars-notice, repo: OhMyStars, path: NOTICE.txt, resource: 'https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/NOTICE.txt', title: 'OhMyStars: NOTICE.txt'}
- {id: compendium-alphacentauri, repo: Compendium, path: src/Compendium/AlphaCentauri.json, resource: 'https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/Compendium/AlphaCentauri.json', title: 'Compendium: src/Compendium/AlphaCentauri.json'}
- {id: compendium-compendiummain, repo: Compendium, path: src/CompendiumMain.cs, resource: 'https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CompendiumMain.cs', title: 'Compendium: src/CompendiumMain.cs'}
- {id: compendium-cdmloadjsoninfo, repo: Compendium, path: src/CdmLoadJsonInfo.cs, resource: 'https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmLoadJsonInfo.cs', title: 'Compendium: src/CdmLoadJsonInfo.cs'}
- {id: compendium-cdmhelpers, repo: Compendium, path: src/CdmHelpers.cs, resource: 'https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmHelpers.cs', title: 'Compendium: src/CdmHelpers.cs'}
- {id: compendium-copilot-instructions, repo: Compendium, path: .github/copilot-instructions.md, resource: 'https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/.github/copilot-instructions.md', title: 'Compendium: .github/copilot-instructions.md'}
- {id: ksarmory-packscan, repo: KSArmory, path: src/KSArmory/Sim/PackScan.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/PackScan.cs', title: 'KSArmory: src/KSArmory/Sim/PackScan.cs'}
- {id: ksarmory-installedpacks, repo: KSArmory, path: src/KSArmory/Ksa/InstalledPacks.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/InstalledPacks.cs', title: 'KSArmory: src/KSArmory/Ksa/InstalledPacks.cs'}
- {id: ksarmory-packreader, repo: KSArmory, path: src/KSArmory/Sim/PackReader.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/PackReader.cs', title: 'KSArmory: src/KSArmory/Sim/PackReader.cs'}
- {id: ksarmory-ksarmorymod, repo: KSArmory, path: src/KSArmory/Ksa/KSArmoryMod.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KSArmoryMod.cs', title: 'KSArmory: src/KSArmory/Ksa/KSArmoryMod.cs'}
- {id: ksarmory-declaredparts, repo: KSArmory, path: src/KSArmory/Ksa/DeclaredParts.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/DeclaredParts.cs', title: 'KSArmory: src/KSArmory/Ksa/DeclaredParts.cs'}
- {id: ksarmory-packaudit, repo: KSArmory, path: src/KSArmory/Sim/PackAudit.cs, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/PackAudit.cs', title: 'KSArmory: src/KSArmory/Sim/PackAudit.cs'}
- {id: unscience-modidvalidator, repo: unscience, path: parts-now.lib/Io/ModIdValidator.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Io/ModIdValidator.cs', title: 'unscience: parts-now.lib/Io/ModIdValidator.cs'}
- {id: unscience-modfolderwriter, repo: unscience, path: parts-now.lib/Io/ModFolderWriter.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Io/ModFolderWriter.cs', title: 'unscience: parts-now.lib/Io/ModFolderWriter.cs'}
- {id: unscience-modfolderscanner, repo: unscience, path: parts-now.lib/Io/ModFolderScanner.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Io/ModFolderScanner.cs', title: 'unscience: parts-now.lib/Io/ModFolderScanner.cs'}
- {id: unscience-runtimemodloadergpustates, repo: unscience, path: parts-now.lib/Runtime/RuntimeModLoaderGpuStates.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/RuntimeModLoaderGpuStates.cs', title: 'unscience: parts-now.lib/Runtime/RuntimeModLoaderGpuStates.cs'}
---

A mod folder is the unit KSA and StarMap understand: `mod.toml`, the files it lists, and whatever else sits beside them. A code mod
with a lot of data (sky cultures, catalogs, JSON, presets, weapon definitions) has to decide how its files get there, how the running
assembly finds them, and whether other mods may add to them. The game's only mechanisms are the mod folders and the manifest; the rest is
convention.

## Engine background

- Folder lookup: `Content/<id>` then `<Documents>/My Games/Kitten Space Agency/mods/<id>`; `LocalModsFolderPath`,
  `LocalManifestPath`, `Find`, `PrepareManifest`, `AddMods` ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L176-L190), [current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L234-L371)).
- `Mod.DirectoryPath` and `GetPath` ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L100-L110), [current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L389-L392)); `ModManifest.Mods` and the `Save()` that
  writes only `id` and `enabled` ([current/decomp/KSA/ModManifest.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModManifest.cs#L8-L48)); `ModEntry` and its constructors ([current/decomp/KSA/ModEntry.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModEntry.cs#L8-L40)).
- Phases: `startup:immediate-load` (per-mod, before systems), `startup:all-mods-loaded` (every mod's assets loaded), `frame:draw-ui` for
  in-game writes. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Ship data beside the DLL with an explicit copy list and resolve the mod root from the assembly](ship-and-share-data-files-between-mods-1.md) | Oh My Stars | Explicit `ModContent` copy list, `mod.toml` without a StarMap table, mod root from `Assembly.Location` | build time, `startup:all-mods-loaded` | Simple and robust; only your own data |
| [Let other mods add data with a marker key in JSON files scanned across mod folders](ship-and-share-data-files-between-mods-2.md) | Compendium | Marker key in JSON files found by scanning every mod folder; own files first, others override | `startup:immediate-load`, `frame:draw-ui` | Zero coupling; scans everything, disabled mods contribute |
| [Read a convention folder inside every installed mod with a strict reader](ship-and-share-data-files-between-mods-3.md) | KSArmory | A `KSArmory/` convention folder in any manifest mod, strict reader, namespaced keys, post-load audit | `startup:all-mods-loaded` | Respects enabled state and refuses typos; needs a versioned schema |
| [Write a new content mod folder and manifest entry from inside the game](ship-and-share-data-files-between-mods-4.md) | unscience (parts-now) | ModFolderWriter with ModIdValidator, atomic writes and an enabled manifest stamp | `frame:draw-ui` | Creates mods from inside the game; the game's own manifest save drops extra keys |

## See also

- [Ship assets and code in one mod folder and find it at runtime](../../../getting-started/loader/ship-content-and-code-in-one-mod/overview.md), [Deploy a mod on every build and debug it from an IDE](../../../getting-started/build/deploy-a-mod-on-every-build/overview.md), [Package and publish a mod release (zip, CI publishing, installer)](../../../getting-started/build/package-and-publish-a-mod-release/overview.md),
  [Declare a dependency on another StarMap mod, required or optional](../../../getting-started/dependencies/declare-a-mod-dependency/overview.md), [Cache and key per-body data so it survives system reloads, repeated ids and extra star systems](../../../celestials/systems-and-stars/cache-and-key-body-data-per-loaded-system/overview.md), [Load, validate and unload part mods in a running game](../../../vehicles-and-parts/parts/load-and-unload-part-mods-at-runtime/overview.md),
  [How StarMap launches KSA and loads your mod](../../../getting-started/loader/how-starmap-launches-ksa/overview.md), [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md), [Validate asset XML ids and paths before launching the game (offline)](../../validation/validate-asset-xml-references/overview.md)
- [Mod root and packaging](../../../../mods/ohmystars/features/mod-root-and-packaging.md), [Cross-mod JSON catalog](../../../../mods/compendium/features/cross-mod-json-catalog.md), [Asset-only weapon packs read from a KSArmory folder in every installed mod](../../../../mods/ksarmory/features/weapon-packs-from-mod-folders.md),
  [Turn pasted Part XML into a real, enabled KSA mod folder from inside the game](../../../../mods/unscience/features/parts-now-paste-xml-mod-writer.md)
