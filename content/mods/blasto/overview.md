---
type: Mod
title: Blasto
description: Standalone StarMap mod with persistent rocket-exhaust terrain marks, owned native dust,
  live tuning and save-bound sidecar history
tags:
  - blasto
  - starmap
  - terrain
  - particles
  - persistence
  - vulkan
mod: blasto
repo: blasto
license: MIT
author: meow sci
loader: starmap
mod_id: Blasto
tested_against: 2026.10.10.5554
categories:
  - physics
  - celestials
  - persistence
  - rendering
  - shaders
  - getting-started
  - ui
  - testing-and-tooling
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:36Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: readme
    repo: blasto
    path: README.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/README.md
    title: Release scope, installation, controls and documented limits
  - id: manifest
    repo: blasto
    path: Blasto.GameMod/mod.toml
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/mod.toml
    title: Blasto metadata and StarMap entry assembly
  - id: entry
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Entry lifecycle, subsystem ownership and cleanup
  - id: project
    repo: blasto
    path: Blasto.GameMod/Blasto.GameMod.csproj
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Blasto.GameMod.csproj
    title: Assembly metadata and pinned loader dependencies
  - id: build
    repo: blasto
    path: Directory.Build.props
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props
    title: Framework and external game-reference paths
  - id: package
    repo: blasto
    path: scripts/package.sh
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh
    title: Allow-listed distribution footprint
  - id: simulation
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Worker-to-main-thread effect flow
  - id: renderer
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    title: Strict version guard and terrain patch installation
  - id: report
    repo: blasto
    path: VALIDATION.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md
    title: Recorded upstream verification and pending live acceptance
  - id: integration
    repo: blasto
    path: INTEGRATION.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/INTEGRATION.md
    title: Subsystem contracts and implementation notes
  - id: plan
    repo: blasto
    path: IMPLEMENTATION_PLAN.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/IMPLEMENTATION_PLAN.md
    title: Historical research and explicitly future fidelity work
  - id: license
    repo: blasto
    path: LICENSE
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/LICENSE
    title: MIT license and copyright attribution
  - id: starmap-entry
    repo: StarMap
    path: StarMap.Core/ModRepository/RuntimeMod.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/RuntimeMod.cs
    title: Create entry class and invoke BeforeMain
  - id: starmap-gui
    repo: StarMap
    path: StarMap.Core/Patches/ProgramPatcher.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs
    title: AfterGui viewport UI callback
  - id: starmap-run
    repo: StarMap
    path: StarMap/GameSurveyer.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/GameSurveyer.cs
    title: Initialize loader before game entry and deinitialize afterward
  - id: game-loop
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Worker joins, next dispatch and HUD-dependent UI
---

Blasto is a standalone StarMap mod by meow sci that records persistent exhaust marks during launches, hovering and landings. It blends procedural scour patterns into the terrain material and creates short native dust bursts. The pinned release is 0.1.3, targeting KSA 2026.10.10.5554 and StarMap API 0.3.6.[^readme][^manifest]

The repository is MIT licensed, with copyright attributed to Alex Sherwin.[^license] Source review establishes the mechanisms below, while live 0.1.3 appearance and performance remain unverified in this documentation task.

## Install footprint

| Item | Value |
|---|---|
| Mod folder and manifest id | `Blasto` |
| Shipped files | `Blasto.dll`, `Blasto.deps.json`, `mod.toml` |
| Entry manifest | `[StarMap] EntryAssembly = "Blasto"` |
| Version and author | `0.1.3`, `meow sci` |
| Assets | No separate custom asset bundle; private shaders are generated from native source and dust reuses a stock mesh |
| Installation | Place the packaged folder in the active game's mods directory and enable it before launching through StarMap |
| Saved state | `blasto.json` beside native `universe.xml`; optional bounded `blasto.recovery.json` |

The manifest supplies the entry assembly and metadata; packaging copies only the three named outputs. The README documents the active-instance mods installation and restarting after replacing the DLL.[^manifest][^package][^readme]

## Loader model and lifecycle

The entry class `Blasto.Mod` is marked `StarMapMod`. StarMap creates that class and invokes its registered BeforeMain callback during mod initialization, before running the game's entry point. Blasto installs Harmony patches and constructs subsystem owners there, without querying live scene objects.[^entry][^starmap-entry][^starmap-run]

| Hook | Timing | Role |
|---|---|---|
| `StarMapBeforeMain` | Before game entry | Install version-guarded rendering, simulation, persistence and UI patches |
| `VehicleUpdateState.UpdateModules` postfix | Vehicle-worker module steps | Copy actual gimballed nozzle geometry and burn output |
| `Universe.ApplyVehicleSolvers` prefix/postfix | Settled main-thread apply window | Drain queued destructive commands; consume exposure and create dust |
| `PlanetRenderer.BuildRenderPipeline` postfix | Native pipeline creation/rebuild | Build private terrain variants |
| `PlanetRenderer.Render` prefix/transpiler/finalizer | Planet command recording | Upload view records, replace one descriptor set and restore stock fields |
| `GameSave.Populate` and `UncompressedSave.Write` postfixes | Native save capture/completion | Bind a detached state snapshot to its successful native save |
| Native load/deserialization/system hooks | Scene replacement | Join workers, remove old scene state and restore an optional sidecar |
| `StarMapAfterGui` and console-UI fallback | ImGui draw phase | Draw the control window, including when HUD is hidden |
| `Program.Dispose` / `PlanetRenderer.Dispose` prefixes | Before native ownership ends | Release owned particles and GPU resources |
| `StarMapUnload` | Loader teardown | Idempotent cleanup and unpatch |

The worker/apply distinction matters: the next vehicle solver has already started by ordinary UI drawing. Blasto therefore queues scene clearing and keeps deposition at the earlier apply boundary. StarMap's AfterGui callback follows viewport UI and is skipped when native HUD drawing is skipped.[^simulation][^game-loop][^starmap-gui] Exact patch sites and ownership details are linked from the feature pages.

## Dependencies and architecture

The game project targets .NET 10 with C# 13, nullable analysis and warnings as errors. It compiles against external game DLLs. Local StarMap/Harmony reference directories take precedence; otherwise the project restores StarMap.API 0.3.6 and Lib.Harmony 2.4.2. The package excludes the game and loader assemblies. There is no dependency on Unscience, gatOS, purrTTY, ModMenu, KittenExtensions or ShaderExtensions.[^build][^project][^package][^readme]

| Subsystem | Responsibility |
|---|---|
| Simulation | Bounded immutable worker samples → main-thread radial terrain probes |
| Core store | Validated body-fixed records, stable seeds, compatible spatial merging and bounded history |
| Rendering | Private forward terrain pipelines, per-frame/view descriptors, camera-relative GPU records and procedural material blending |
| Dust | Owned body-anchored native emitters with separate density and opacity controls |
| Persistence | Captured save snapshots, strict sidecar validation, native-file hash binding and bounded recovery |
| UI | Live appearance/future-exposure tuning, guarded input, copyable diagnostics and queued scene commands |

Rendering consumes snapshots and never adds exposure. Body-fixed doubles hold persistent placement; camera-relative float conversion happens only at upload. Scene resets preserve renderer resources while clearing samples, caches, particles and prior scene records.[^integration][^simulation][^entry]

## Features

| Feature | Category | Lifecycle |
|---|---|---|
| [Worker nozzle exposure handoff](features/worker-nozzle-exposure-handoff.md) | physics | physics:vehicle-solver, frame:apply-solvers |
| [Terrain plume intersection](features/terrain-plume-intersection.md) | celestials | frame:apply-solvers |
| [Persistent exposure site store](features/persistent-exposure-site-store.md) | persistence | frame:apply-solvers |
| [Private terrain pipeline swap](features/private-terrain-pipeline-swap.md) | rendering | startup:starmap-before-main, event:renderer-build, frame:prepare, frame:post-render, render:planet |
| [Frame and viewport terrain buffers](features/frame-viewport-terrain-buffers.md) | rendering | render:planet |
| [Terrain material shader injection](features/terrain-material-shader-injection.md) | shaders | event:renderer-build, render:planet |
| [Unsigned Vulkan limit validation](features/unsigned-vulkan-limit-validation.md) | rendering | event:renderer-build, frame:prepare, frame:post-render |
| [Owned surface dust emitters](features/owned-surface-dust-emitters.md) | rendering | frame:apply-solvers, frame:pre-render, frame:render, render:particles |
| [Save-bound sidecar transactions](features/save-bound-sidecar-transactions.md) | persistence | event:save, event:load |
| [Scene reset and native cleanup](features/scene-reset-and-native-cleanup.md) | getting-started | frame:apply-solvers, event:load, event:game-dispose, event:starmap-unload |
| [Live effect tuning and input](features/live-effect-tuning-and-input.md) | ui | frame:draw-ui, frame:input, frame:apply-solvers |
| [Offline rendering validation](features/offline-rendering-validation.md) | testing-and-tooling | tool:build |

## Build, test and tooling

Use .NET SDK 10 and set `KSA_DLL_DIR` or `KSAFolder` to the pinned game's DLL directory. In this corpus the checkout is under `references/`, so its default sibling lookup does not point at the separately mounted assemblies repository. Set `STARMAP_DLL_DIR` when using locally installed loader DLLs.[^build][^project]

The repository includes a portable production-source console harness, exact shader-transform export, two shader compilation variants, optional stage-interface linking and allow-listed packaging. See [Offline rendering validation](features/offline-rendering-validation.md) for required tools and the distinction between shader compilation and live pipeline execution.

## Compatibility and validation limits

The terrain hook requires the exact KSA assembly version `2026.10.10.5554`; other versions fail initialization rather than guessing private layouts. Pipeline build, descriptor schema, bind-call shape and unique shader anchors provide additional fail-open checks. Mods replacing the same terrain shader or pipeline may require a compatibility patch.[^renderer][^readme]

The upstream validation report records 33/33 portable checks, six successful shader compilations/validations and a clean release build. It attributes working 0.1.2 Lunar marks to user diagnostics and screenshots. Those observations do not validate 0.1.3's new appearance, manual tuning behavior, dust or performance; none was run live for this bundle.[^report]

Saved history is limited to 4,096 sites and upload to 64 selected marks per view. Default surface probes start within 350 m, and new exposure skips physics steps over one second. Dust has a 12-emitter × 32-particle budget. These are implementation limits rather than performance guarantees.[^readme] The model does not excavate terrain, weather old marks, shelter effects behind rocks or simulate water spray.

## Secondary sources

| Source | Use |
|---|---|
| [README.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/README.md#L3-L81) | Release scope, installation, controls and documented limits |
| [VALIDATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md#L5-L18) | Recorded upstream verification and pending live acceptance |
| [INTEGRATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/INTEGRATION.md#L1-L33) | Subsystem contracts and implementation notes |
| [IMPLEMENTATION_PLAN.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/IMPLEMENTATION_PLAN.md#L1-L19) | Historical research and explicitly future fidelity work |
| [LICENSE](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/LICENSE#L1-L21) | MIT license and copyright attribution |

The implementation plan preserves research and future ambitions; delivered behavior is taken from the pinned implementation and release documentation.[^plan]

[^readme]: [README.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/README.md#L3-L81) — Release scope, installation, controls and documented limits.
[^manifest]: [Blasto.GameMod/mod.toml](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/mod.toml#L1-L7) — Blasto metadata and StarMap entry assembly.
[^entry]: [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L14-L144) — Entry lifecycle, subsystem ownership and cleanup.
[^project]: [Blasto.GameMod/Blasto.GameMod.csproj](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Blasto.GameMod.csproj#L1-L48) — Assembly metadata and pinned loader dependencies.
[^build]: [Directory.Build.props](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props#L1-L31) — Framework and external game-reference paths.
[^package]: [scripts/package.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh#L12-L45) — Allow-listed distribution footprint.
[^simulation]: [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L62-L178) — Worker-to-main-thread effect flow.
[^renderer]: [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L57-L83) — Strict version guard and terrain patch installation.
[^report]: [VALIDATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md#L5-L18) — Recorded upstream verification and pending live acceptance.
[^integration]: [INTEGRATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/INTEGRATION.md#L1-L33) — Subsystem contracts and implementation notes.
[^plan]: [IMPLEMENTATION_PLAN.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/IMPLEMENTATION_PLAN.md#L1-L19) — Historical research and explicitly future fidelity work.
[^license]: [LICENSE](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/LICENSE#L1-L21) — MIT license and copyright attribution.
[^starmap-entry]: [StarMap.Core/ModRepository/RuntimeMod.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/RuntimeMod.cs#L129-L163) — Create entry class and invoke BeforeMain.
[^starmap-gui]: [StarMap.Core/Patches/ProgramPatcher.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs#L26-L36) — AfterGui viewport UI callback.
[^starmap-run]: [StarMap/GameSurveyer.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/GameSurveyer.cs#L25-L60) — Initialize loader before game entry and deinitialize afterward.
[^game-loop]: [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2288) — Worker joins, next dispatch and HUD-dependent UI.
