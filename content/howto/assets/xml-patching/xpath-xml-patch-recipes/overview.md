---
type: Game Feature
title: Write XPath patch operations for game XML
description: The ModuleManager-style patch operations KittenExtensions runs over XPath 1.0 paths, with worked recipes for appending a gauge button, adding missing elements to bodies and rewriting values with conditionals
topic: xpath-xml-patch-recipes
category: assets
group: xml-patching
approaches: 3
demonstrated_by: [mods/ksa-advancedflightcomputer/features/autostage-gauge-button, mods/ksa-advancedflightcomputer/features/hyperbolic-transfer-targets, mods/kittenextensions/features/xpath-patch-operations]
game_types: [KSA.AssetBundle, KSA.GaugeCanvas, KSA.SystemTemplate, KSA.PlanetMeshCollection, KSA.GaugeComponent, KSA.GaugeButtonReference, KSA.InterstellarCometTemplate]
lifecycle: ['startup:asset-load']
tags: [xml-patch, xpath, kittenextensions, recipes]
generated: {by: claude-code/sonnet-5.5, at: '2026-10-10T22:31:08Z'}
status: stable
repos:
- {name: KittenExtensions, git: 'https://github.com/AMPW-german/KittenExtensions.git', ref: b52467541a4fda3c3771eb2c157ed7574f9e2d7c}
- {name: KSA-AdvancedFlightComputer, git: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git', ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-gaugecanvas, repo: ksa-game-assemblies, path: current/decomp/KSA/GaugeCanvas.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GaugeCanvas.cs', title: 'current/decomp/KSA/GaugeCanvas.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-gaugecomponent, repo: ksa-game-assemblies, path: current/decomp/KSA/GaugeComponent.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GaugeComponent.cs', title: 'current/decomp/KSA/GaugeComponent.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-assetbundle, repo: ksa-game-assemblies, path: current/decomp/KSA/AssetBundle.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs', title: 'current/decomp/KSA/AssetBundle.cs (decompiled, build 2026.10.10.5554)'}
- {id: kittenextensions-readme, repo: KittenExtensions, path: README.md, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/README.md', title: 'KittenExtensions: README.md'}
- {id: ksa-gauges, repo: ksa-game-assemblies, path: current/Content/Core/Gauges.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Gauges.xml', title: current/Content/Core/Gauges.xml (build 2026.10.10.5554)}
- {id: ksa-advancedflightcomputer-autostagebutton, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Patches/AutoStageButton.xml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Patches/AutoStageButton.xml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Patches/AutoStageButton.xml'}
- {id: ksa-advancedflightcomputer-mod, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/mod.toml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/mod.toml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/mod.toml'}
- {id: ksa-astronomicals, repo: ksa-game-assemblies, path: current/Content/Core/Astronomicals.xml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Astronomicals.xml', title: current/Content/Core/Astronomicals.xml (build 2026.10.10.5554)}
- {id: ksa-advancedflightcomputer-hyperbolicbodies, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Patches/HyperbolicBodies.xml, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Patches/HyperbolicBodies.xml', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Patches/HyperbolicBodies.xml'}
- {id: ksa-advancedflightcomputer-hyperbolictargets, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Features/HyperbolicTargets/HyperbolicTargets.cs, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/HyperbolicTargets/HyperbolicTargets.cs', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Features/HyperbolicTargets/HyperbolicTargets.cs'}
- {id: ksa-advancedflightcomputer-transferplannerpatches, repo: KSA-AdvancedFlightComputer, path: AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs, resource: 'https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs', title: 'KSA-AdvancedFlightComputer: AdvancedFlightComputer/Features/HyperbolicTargets/TransferPlannerPatches.cs'}
- {id: kittenextensions-patchlogger, repo: KittenExtensions, path: KittenExtensions/Patch/PatchLogger.cs, resource: 'https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/KittenExtensions/Patch/PatchLogger.cs', title: 'KittenExtensions: KittenExtensions/Patch/PatchLogger.cs'}
---

A KittenExtensions patch file is a `<Patch>` element whose children are operations. Each selects nodes of
the combined GameData document with an XPath 1.0 expression evaluated from `<Root>` and then changes,
copies, merges, deletes, branches or stores. The vocabulary is Copy (with `Pos` of Replace, Append,
Prepend, Before or After), Merge (with `_MergeId` and `_MergePos`), Delete, If, IfAny, IfNone, With and SetVar.
This topic is the cookbook; how the patch files are found and run is [Patch Core or another mod's XML data without copying files](../patch-game-xml-data/overview.md).

## Engine background

- The operations do not exist in the game. They run on an in-memory document before deserialization; the game's
  own serializers then read the result, so patched XML must still map to element names the templates accept.
- Gauge panels: `GaugeCanvas` (`Component` children, `VisibleInContext`) and `GaugeComponent` (Digit, Label,
  Button, Box, Rect children) ([current/decomp/KSA/GaugeCanvas.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GaugeCanvas.cs#L103-L107), [current/decomp/KSA/GaugeComponent.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GaugeComponent.cs#L43-L48)).
- Body templates: `AssetBundle` maps element names such as `InterstellarComet` to template classes
  ([current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L14-L14)); the stock data is in `Astronomicals.xml`.
- Semantics source: the KittenExtensions README ([README.md](https://github.com/AMPW-german/KittenExtensions/blob/b52467541a4fda3c3771eb2c157ed7574f9e2d7c/README.md#L90-L216)). The XPathPatch
  library is a submodule not present in the pinned checkout; test adapted patches with the debug stepper.
- Phase: `startup:asset-load`, see [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Append a button to a stock gauge canvas with Copy and inline XML](xpath-xml-patch-recipes-1.md) | KSA-AdvancedFlightComputer | `Copy Pos="Append"` with inline XML into a gauge canvas component | `startup:asset-load` | Simplest; a mistyped `Id` fails silently; layout must be kept in sync with stock |
| [Add missing mass and sphere-of-influence elements to a kind of body](xpath-xml-patch-recipes-2.md) | KSA-AdvancedFlightComputer | Select bodies by element name and `Id`, append missing `Mass` and `SphereOfInfluence` | `startup:asset-load` | Explicit and readable; one `Copy` per body unless you use `With` |
| [Rewrite many nodes with With, If and SetVar, and combine trees with Merge](xpath-xml-patch-recipes-3.md) | KittenExtensions | `With`, `If`, `SetVar` for per-node rewrites; `Merge` with `_MergeId` and `_MergePos` | `startup:asset-load` | Powerful; semantics come from the README only, some README examples are stale |

## See also

- [Patch Core or another mod's XML data without copying files](../patch-game-xml-data/overview.md), [Debug XML patches with the step debugger and the session log](../../validation/debug-xml-patches/overview.md), [Redirect the game to patched copies of its XML and coordinate edits between mods](../redirect-game-xml-loading/overview.md),
  [Add to, drive and hide the stock cockpit gauges and navball](../../../ui/menus/work-with-stock-cockpit-gauges/overview.md), [Add to, drive and hide the stock cockpit gauges and navball](../../../ui/menus/work-with-stock-cockpit-gauges/overview.md)
- [XML patch files and XPathPatch operations](../../../../mods/kittenextensions/features/xpath-patch-operations.md), [A custom gauge button action backed by a mod enum](../../../../mods/ksa-advancedflightcomputer/features/autostage-gauge-button.md),
  [Transfer Planner targets on hyperbolic orbits](../../../../mods/ksa-advancedflightcomputer/features/hyperbolic-transfer-targets.md)
