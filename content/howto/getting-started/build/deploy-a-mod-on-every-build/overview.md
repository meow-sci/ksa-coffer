---
type: Game Feature
title: Deploy a mod on every build and debug it from an IDE
description: How a build leaves a runnable mod in the KSA mods folder, five deploy designs from OutputPath to a shared payload list, and the launch profile that starts StarMap.exe under a debugger
topic: deploy-a-mod-on-every-build
category: getting-started
group: build
approaches: 5
game_types: [KSA.Constants]
lifecycle: [startup:starmap-before-main]
demonstrated_by: [mods/ksaero/features/mod-deploy-targets, mods/ksa-deltavmap/features/mod-deploy-targets-and-release, mods/ksa-measuretools/features/mod-deploy-targets-and-release, mods/ksa-aircrafthud/features/props-based-build, mods/ksa-advancedflightcomputer/features/mod-deploy-msbuild-targets, mods/ksarmory/features/build-deploy-package-release, mods/ohmystars/features/mod-root-and-packaging, mods/kitten-engineer-redux/features/dist-zip-and-post-build-deploy, mods/gatos/features/build-deploy-and-ci, mods/starmap/features/host-process-launch]
tags: [msbuild, deploy, mods-folder, launchsettings, debugging, build]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T18:27:53Z }
status: stable
repos:
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-constants
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Constants.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs
    title: "KSA.Constants (decompiled, build 2026.10.10.5554)"
  - id: ksa-modlibrary
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs
    title: "KSA.ModLibrary (decompiled, build 2026.10.10.5554)"
  - id: sm-gamesurveyer
    repo: StarMap
    path: StarMap/GameSurveyer.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/GameSurveyer.cs
    title: "StarMap: StarMap/GameSurveyer.cs"

---

The inner development loop of a KSA mod is: edit, build, the build puts the DLL where StarMap reads it, restart the
game. Everything that makes this smooth lives in MSBuild: where the copy goes, what it copies, what it says when the
game holds the DLL open, and how the IDE starts `StarMap.exe` with a debugger attached.

## Engine background

| Fact | Source |
|---|---|
| The per-user mods folder is `ModLibrary.LocalModsFolderPath` = `<Documents>/mods`, with `Constants.DocumentsFolderPath` = `<Personal>/My Games/Kitten Space Agency` | [current/decomp/KSA/Constants.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs#L281-L287), [current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L178-L180) |
| The mod id is the folder name; StarMap loads `<folder>/<EntryAssembly>.dll` and `mod.toml` | [Folder and manifest rules as StarMap consumes them](../../loader/how-starmap-launches-ksa/how-starmap-launches-ksa-2.md) |
| StarMap resolves `./StarMapConfig.json` and its own DLLs against the **current directory**, then sets the working directory to the game folder | [StarMap/GameSurveyer.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/GameSurveyer.cs#L25-L56) |
| Windows keeps the loaded DLL open, so a running game blocks the copy | build-time failure, approach 1 |

All of this is build time; the result is read at `startup:starmap-before-main` on the next launch
([Game loop and mod lifecycle](../../lifecycle/game-loop-and-lifecycle/overview.md)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Imported ModDeploy.targets with locked-DLL diagnosis](./deploy-a-mod-on-every-build-1.md) | KSAero, KSA-DeltaVMap, KSA-MeasureTools | `msbuild` | build | Best developer experience: names the running game, stamps the slot; Windows-only plumbing |
| [OutputPath straight into the mods folder](./deploy-a-mod-on-every-build-2.md) | KSA_AircraftHUD | `msbuild` | build | No target at all; no cleanup, no guard, copy-local surprises |
| [Explicit payload list shared by deploy and packaging](./deploy-a-mod-on-every-build-3.md) | KSA-AdvancedFlightComputer, KSArmory | `msbuild` | build | Deploy and release cannot drift; per-RID natives; more files |
| [Post-build copy with an overridable game directory](./deploy-a-mod-on-every-build-4.md) | OhMyStars, Kitten-Engineer-Redux, gatOS | `msbuild` | build | Lowest ceremony; override via env or user props; no running-game diagnosis |
| [Generated launchSettings profile](./deploy-a-mod-on-every-build-5.md) | KSAero, KSA-DeltaVMap | `msbuild` | build and run | F5 builds, deploys and starts StarMap under the debugger in any worktree; profile is generated and gitignored |

Approaches 1 and 5 are the same `ModDeploy.targets` file seen from two sides.

## Rules

- Copy only what you ship; never `0Harmony.dll`, `StarMap.API.dll` or game DLLs ([Ship third-party DLLs next to your mod](../../dependencies/ship-third-party-dlls-with-a-mod/overview.md)).
- Copy `mod.toml` too; register the mod in `manifest.toml` once.
- Close the game before building into the live mods folder.
- Releasing is related but separate: [Package and publish a mod release (zip, CI publishing, installer)](../package-and-publish-a-mod-release/overview.md).

## See also

- [Reference the game's assemblies from a mod project without shipping them](../reference-game-assemblies-from-a-mod-project/overview.md), [How StarMap launches KSA and loads your mod](../../loader/how-starmap-launches-ksa/overview.md), [Generate mod.toml and StarMap dependencies from the project file](../generate-mod-toml-from-msbuild/overview.md),
  [Create a minimal StarMap mod](../../loader/create-a-minimal-starmap-mod/overview.md)
- [Build and deploy targets](../../../../mods/ksaero/features/mod-deploy-targets.md), [Shared MSBuild deploy targets, release zip and SpaceDock publishing](../../../../mods/ksa-deltavmap/features/mod-deploy-targets-and-release.md),
  [Shared MSBuild deploy targets, release zip and SpaceDock publishing](../../../../mods/ksa-measuretools/features/mod-deploy-targets-and-release.md), [Props-based build straight into the mods folder](../../../../mods/ksa-aircrafthud/features/props-based-build.md),
  [MSBuild deploy and packaging for a StarMap mod with native payload](../../../../mods/ksa-advancedflightcomputer/features/mod-deploy-msbuild-targets.md), [Deploy into the KSA mods folder, package a clean archive and cut releases from commits](../../../../mods/ksarmory/features/build-deploy-package-release.md),
  [Mod root and packaging](../../../../mods/ohmystars/features/mod-root-and-packaging.md), [Minimal mod.toml, post-build deploy and release zip](../../../../mods/kitten-engineer-redux/features/dist-zip-and-post-build-deploy.md),
  [Build, deploy and CI](../../../../mods/gatos/features/build-deploy-and-ci.md), [Host KSA in-process from a launcher executable](../../../../mods/starmap/features/host-process-launch.md)
