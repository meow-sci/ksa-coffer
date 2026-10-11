---
type: Game Feature
title: Redirect the game to patched copies of its XML and coordinate edits between mods
description: Two ways to substitute the XML the game reads without editing the install, how to edit the copies safely, and how two mods share one patched copy
topic: redirect-game-xml-loading
category: assets
group: xml-patching
approaches: 4
demonstrated_by: [mods/realatmospheres/features/core-xml-entry-redirect, mods/realatmospheres/features/atmosphere-optics-in-system-xml, mods/kittenextensions/features/xmlloader-call-site-redirect, mods/realatmospheres/features/shadow-tree-anchor-patching, mods/ksastructures/features/generated-deep-ramp, mods/realatmospheres/features/cross-mod-shared-shadow]
game_types: [KSA.Mod, KSA.ModLibrary, KSA.XmlLoader, KSA.SystemInfo, KSA.AssetBundle, KSA.SystemTemplate, KSA.AtmosphericBodyTemplate, KSA.SerializedCollection, KSA.AstronomicalTemplate, KSA.PlanetaryBodyTemplate]
lifecycle: ['startup:starmap-before-main', 'startup:immediate-load', 'startup:asset-load']
tags: [xml, redirect, harmony, shadow-copy, core, transpiler]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:16:43Z'}
status: stable
repos:
- {name: RealAtmospheres, git: 'https://github.com/Brimfyr/RealAtmospheres.git', ref: 19dc37a55b2e359bd8eec2f5b41722ab11ae0c46}
- {name: KittenExtensions, git: 'https://github.com/AMPW-german/KittenExtensions.git', ref: b52467541a4fda3c3771eb2c157ed7574f9e2d7c}
- {name: KSAStructures, git: 'https://github.com/LaurensDeV/KSAStructures', ref: c24759358381fb10290c61f9a6980b7d832ba3d4}
- {name: StarMap, git: 'https://github.com/StarMapLoader/StarMap.git', ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-mod, repo: ksa-game-assemblies, path: current/decomp/KSA/Mod.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs', title: 'current/decomp/KSA/Mod.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-xmlloader, repo: ksa-game-assemblies, path: current/decomp/KSA/XmlLoader.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs', title: 'current/decomp/KSA/XmlLoader.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-systeminfo, repo: ksa-game-assemblies, path: current/decomp/KSA/SystemInfo.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemInfo.cs', title: 'current/decomp/KSA/SystemInfo.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-serializedcollection, repo: ksa-game-assemblies, path: current/decomp/KSA/SerializedCollection.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs', title: 'current/decomp/KSA/SerializedCollection.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-mod-2, repo: ksa-game-assemblies, path: current/Content/Core/mod.toml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/mod.toml', title: current/Content/Core/mod.toml (build 2026.10.10.5554)}
- {id: realatmospheres-modmain, repo: RealAtmospheres, path: ModMain.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/ModMain.cs', title: 'RealAtmospheres: ModMain.cs'}
- {id: ksa-program, repo: ksa-game-assemblies, path: current/decomp/KSA/Program.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs', title: 'current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-modlibrary, repo: ksa-game-assemblies, path: current/decomp/KSA/ModLibrary.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs', title: 'current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)'}
- {id: realatmospheres-shadowbuilder, repo: RealAtmospheres, path: ShadowBuilder.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/ShadowBuilder.cs', title: 'RealAtmospheres: ShadowBuilder.cs'}
- {id: realatmospheres-sharedshadow, repo: RealAtmospheres, path: Shared/SharedShadow.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/Shared/SharedShadow.cs', title: 'RealAtmospheres: Shared/SharedShadow.cs'}
- {id: ksa-astronomicals, repo: ksa-game-assemblies, path: current/Content/Core/Astronomicals.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Astronomicals.xml', title: current/Content/Core/Astronomicals.xml (build 2026.10.10.5554)}
- {id: ksa-solsystem, repo: ksa-game-assemblies, path: current/Content/Core/SolSystem.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/SolSystem.xml', title: current/Content/Core/SolSystem.xml (build 2026.10.10.5554)}
- {id: kittenextensions-mod, repo: KittenExtensions, path: KittenExtensions/Mod.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Mod.cs', title: 'KittenExtensions: KittenExtensions/Mod.cs'}
- {id: kittenextensions-patches, repo: KittenExtensions, path: KittenExtensions/Patches.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patches.cs', title: 'KittenExtensions: KittenExtensions/Patches.cs'}
- {id: kittenextensions-patcher, repo: KittenExtensions, path: KittenExtensions/Patch/Patcher.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/Patcher.cs', title: 'KittenExtensions: KittenExtensions/Patch/Patcher.cs'}
- {id: kittenextensions-assetex, repo: KittenExtensions, path: KittenExtensions/AssetEx.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/AssetEx.cs', title: 'KittenExtensions: KittenExtensions/AssetEx.cs'}
- {id: realatmospheres-payloads, repo: RealAtmospheres, path: Payloads.cs, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/Payloads.cs', title: 'RealAtmospheres: Payloads.cs'}
- {id: ksastructures-office-deep, repo: KSAStructures, path: tools/model/office-deep.py, resource: 'https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/model/office-deep.py', title: 'KSAStructures: tools/model/office-deep.py'}
- {id: ksastructures-ksastructuresoffice, repo: KSAStructures, path: src/KSAStructures/KSAStructuresOffice.xml, resource: 'https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/KSAStructuresOffice.xml', title: 'KSAStructures: src/KSAStructures/KSAStructuresOffice.xml'}
- {id: ksa-atmosphericbodytemplate, repo: ksa-game-assemblies, path: current/decomp/KSA/AtmosphericBodyTemplate.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AtmosphericBodyTemplate.cs', title: 'current/decomp/KSA/AtmosphericBodyTemplate.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-assetbundle, repo: ksa-game-assemblies, path: current/decomp/KSA/AssetBundle.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs', title: 'current/decomp/KSA/AssetBundle.cs (decompiled, build 2026.10.10.5554)'}
- {id: realatmospheres-changelog, repo: RealAtmospheres, path: CHANGELOG.md, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/CHANGELOG.md', title: 'RealAtmospheres: CHANGELOG.md'}
- {id: realatmospheres-realatmospheres, repo: RealAtmospheres, path: RealAtmospheres.csproj, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/RealAtmospheres.csproj', title: 'RealAtmospheres: RealAtmospheres.csproj'}
- {id: starmap-modloader, repo: StarMap, path: StarMap.Core/ModRepository/ModLoader.cs, resource: 'https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModLoader.cs', title: 'StarMap: StarMap.Core/ModRepository/ModLoader.cs'}
---

Core's bodies, systems and assets are plain XML files named in Core's `mod.toml`. A mod that must change them in
ways declarative patches cannot express (promoting a body type, rewriting hundreds of values, deriving values
from a table) can make the game read a different file. This topic covers the two ways to do that, the editing
techniques that keep a copy robust against game updates, and the coordination needed when two mods want the same
file. Declarative patches ([Patch Core or another mod's XML data without copying files](../patch-game-xml-data/overview.md)) are simpler when they are enough.

## Engine background

- `KSA.Mod` holds the file lists: a private `string[] Assets` and a public `string[] SystemTemplates`
  ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L56-L72)). Each loader (`LoadAssetBundles`, `LoadEditorTagDefinitions`, `LoadSystems`,
  `PrepareSystems`, `LoadPlanetMeshes`, `LoadPlanetRandomHeightmaps`) builds `Path.Combine(DirectoryPath, entry)` and
  passes it to the generic `XmlLoader.Load<T>` ([current/decomp/KSA/XmlLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs#L1-L52)).
- `Path.Combine` returns a rooted second argument unchanged, so an absolute path in the list escapes the mod
  folder. `Mod.GetPath` does the same for asset paths ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L389-L392)).
- `PrepareSystems` stores the entry string as `SystemInfo.XmlName`; `LoadSystems` loads only the entry equal to
  the selected system's `XmlName` ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L128-L137), [current/decomp/KSA/SystemInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemInfo.cs#L32-L32)).
- Registration is first-wins: `SerializedCollection.Register` ignores a second item with the same hash
  ([current/decomp/KSA/SerializedCollection.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs#L20-L33)).
- Phases: the swap or transpiler must exist at `startup:starmap-before-main`; the loaders run at
  `startup:immediate-load` (`PrepareSystems`) and `startup:asset-load` ([Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md), [Understand when and in which order KSA loads mod XML](../../asset-xml/mod-xml-load-order/overview.md)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Swap Core's XML entries for patched copies with prefixes on the Mod loaders](redirect-game-xml-loading-1.md) | Real Atmospheres | Harmony prefixes on the non-generic `Mod` loaders; swap list entries for absolute shadow paths | `startup:starmap-before-main`, `startup:immediate-load`, `startup:asset-load` | No IL, no generic matching; only helps when the mod owns the whole file; one redirect per file |
| [Transpile the Mod loaders so XmlLoader.Load calls read from an in-memory document](redirect-game-xml-loading-2.md) | KittenExtensions | Transpile four `Mod` loaders so `XmlLoader.Load<T>` becomes a loader reading an in-memory document | same | Redirects everything and supports patches; fragile call-shape match; two callers stay stock |
| [Edit shadow copies with anchor-verified text patches and generated XML between markers](redirect-game-xml-loading-3.md) | Real Atmospheres, KSAStructures | Anchor-verified, marker-guarded text edits of copies; generated XML spliced between markers | `startup:starmap-before-main`, `startup:asset-load` | Survives game updates when anchors fail soft; no schema check on payloads |
| [Let two mods edit the same Core file with a shared shadow folder and a named mutex](redirect-game-xml-loading-4.md) | Real Atmospheres | Shared shadow folder, `Global` named mutex and a process-start launch token | `startup:starmap-before-main` | Two mods can edit one file; load order is manifest order, edits must tolerate either order |

The first and second approaches are alternatives and must not be combined: the prefixes swap entries for paths
KittenExtensions never imported (see the gotchas in approach 1).

## See also

- [Patch Core or another mod's XML data without copying files](../patch-game-xml-data/overview.md), [Write XPath patch operations for game XML](../xpath-xml-patch-recipes/overview.md), [Understand when and in which order KSA loads mod XML](../../asset-xml/mod-xml-load-order/overview.md),
  [Resolve asset ids and file paths correctly across mods](../../asset-xml/resolve-asset-ids-and-mod-relative-paths/overview.md)
- [Replace or text-patch the game's GLSL without editing game files](../../../shaders/stock-shaders/replace-or-patch-game-glsl-without-editing-game-files/overview.md), [Define atmospheres, scattering and cloud layers for a body in system XML](../../../celestials/atmospheres-and-rings/define-atmospheres-and-cloud-layers-in-system-xml/overview.md)
- [Core XML entry redirect](../../../../mods/realatmospheres/features/core-xml-entry-redirect.md), [XmlLoader call-site redirect](../../../../mods/kittenextensions/features/xmlloader-call-site-redirect.md),
  [Shared shadow for two cooperating mods](../../../../mods/realatmospheres/features/cross-mod-shared-shadow.md)
- [Share types and design an inter-mod API between StarMap mods](../../../getting-started/dependencies/share-types-between-mods/overview.md) - related topic
- [Declare a dependency on another StarMap mod, required or optional](../../../getting-started/dependencies/declare-a-mod-dependency/overview.md) - related topic
- [Writing a Harmony transpiler for a KSA method](../../../patching/transpilers/write-a-harmony-transpiler/overview.md) - related topic
- [Swapping one call inside a game method with a transpiler](../../../patching/transpilers/swap-one-call-inside-a-game-method-with-a-transpiler/overview.md) - related topic
- [Reading, writing and calling private game members](../../../patching/internals/call-private-game-members-through-reflection-and-delegates/overview.md) - related topic
- [How StarMap launches KSA and loads your mod](../../../getting-started/loader/how-starmap-launches-ksa/overview.md) - related topic

