---
type: Mod
title: Flexo
description: External browser authoring suite for composing KSA asset-only parts, geometry, textures, animation, engines and static launch sites
mod: flexo
repo: flexo
kind: authoring-tool
license: MIT
author: Alex Sherwin
loader: none
categories:
  - assets
  - camera
  - celestials
  - kittens
  - persistence
  - physics
  - rendering
  - testing-and-tooling
  - ui
  - vehicles-and-parts
tags:
  - flexo
  - asset-authoring
  - browser
  - native-assets
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:11:55Z
status: stable
repos:
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: license
    repo: flexo
    path: LICENSE
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/LICENSE
    title: MIT license and author
  - id: architecture
    repo: flexo
    path: docs/architecture.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/architecture.md
    title: Application architecture
  - id: export
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: Part mod export plan and manifest
  - id: package
    repo: flexo
    path: package.json
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json
    title: Application scripts and dependencies
  - id: asset-plugin
    repo: flexo
    path: vite/ksaAssets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts
    title: Catalog serving and build copying
  - id: scope
    repo: flexo
    path: scope/FULL_SCOPE.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/FULL_SCOPE.md
    title: KSA integration surface catalog
  - id: animation-doc
    repo: flexo
    path: docs/animation-editor.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/animation-editor.md
    title: Animation workflow
  - id: engines-doc
    repo: flexo
    path: docs/engines.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/engines.md
    title: Engine authoring workflow
  - id: import-doc
    repo: flexo
    path: docs/importing-models.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/importing-models.md
    title: Model import workflow
  - id: static-doc
    repo: flexo
    path: scope/static-objects.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/static-objects.md
    title: Static object integration notes
  - id: site-doc
    repo: flexo
    path: scope/launch-sites.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/launch-sites.md
    title: Launch-site integration notes
  - id: projects-doc
    repo: flexo
    path: docs/projects.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/projects.md
    title: Project workflows
  - id: materials-doc
    repo: flexo
    path: docs/texturing.md
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/texturing.md
    title: Surface and texture workflows
---

Flexo is Alex Sherwin’s MIT-licensed browser authoring suite for Kitten Space Agency assets. Its main editor rearranges existing Parts and SubParts into new native XML parts, imports GLB/glTF geometry and textures, creates procedural geometry and painted materials, authors emissives and animations, and designs propulsion data. Two companion web applications provide embedded part previews and static-object/launch-site composition. The application itself is not a game mod and has no StarMap entry class.[^license][^architecture]

## Install footprint and loader model

Run Flexo as a web application. Its source is TypeScript with React UI, nanostores state and Three.js previews. Catalog XML, model binaries and textures are served from a separately supplied asset tree. There is no Flexo C# assembly or game-installed tool identity.[^package][^asset-plugin]

The main editor’s native output uses the default mod name `flexo-parts`. It writes a `mod.toml` containing `name` and `assets`, Part XML, GameData XML, optional custom Assets XML, and referenced geometry, animation and texture files. A downloadable ZIP is a fresh game-facing package; supported browsers can also write a selected folder. Output manifests and file names belong to the generated mod, not the application. See [native asset-only mod export](features/native-asset-mod-export.md) for native loader contracts and overwrite behavior.[^export]

| Phase | Work | Game hook |
|---|---|---|
| `tool:authoring` | Browser interaction, project state, preview, numerical design and validation | None |
| `tool:build` | Application build, asset preparation, export plans and generated packages | None |
| Generated content consumption | Native KSA loads the exported XML and binaries | No Flexo code executes in process |

## Architecture and data flow

The pure `src/ksa/` layer parses catalogs and XML, models authored data, validates references and serializes export plans. The `src/state/` layer owns document transactions, selection, project persistence and mode state. The `src/three/` layer adapts coordinate and material conventions to a browser viewport; `src/ui/` provides authoring controls. Reusable evaluation functions let previews and export share their data transformations.[^architecture]

Built-in composition starts with catalog templates and placements. Edited templates can be isolated into new declarations, while unchanged meshes and materials remain references to Core. Imported or generated resources enter project storage and an export plan that gives them native mesh, material and animation identities. Project archives preserve editable data and binary assets; game mod packages are a separate deliverable.

The `apps/partpreview/` and `apps/icrp/` directories are companion browser applications, not runtime submods. The former shares catalog infrastructure with the editor. The latter assembles static objects and emits a new scenario or additive stock-pad data. Their reusable mechanisms are cataloged below alongside the main editor.

## Dependencies

The browser/application stack includes React, Three.js, nanostores, XML DOM utilities, KTX parsing and Zstandard support. Vite builds the applications; TypeScript, Vitest and Playwright support checks. The exact dependency versions are pinned in the source package. No StarMap, Harmony, ModMenu, KittenExtensions or ShaderExtensions dependency is required by the application’s loader model.[^package]

The catalog asset tree is a separate input configured through `KSA_ASSETS_DIR`; the Vite plugin serves it in development and copies it for production. The MIT source license is distinct from the supplied game assets. Missing asset configuration can produce a built application whose catalog requests still fail.[^asset-plugin]

## Features

| Feature | Category | Lifecycle |
|---|---|---|
| [Import native animation rigs and bake easing into linear GLB samples](features/animation-import-and-linear-baking.md) | assets | `tool:authoring`, `tool:build` |
| [Asset pipeline and regression tooling](features/asset-pipeline-and-regression-tooling.md) | testing-and-tooling | `tool:build` |
| [Assemble parts from the built-in SubPart catalog](features/builtin-part-composition.md) | assets | `tool:authoring`, `tool:build` |
| [Author part and SubPart cast lights](features/cast-light-authoring.md) | rendering | `tool:authoring`, `tool:build` |
| [Author collision shapes and inspect sampled coverage](features/collider-authoring-and-coverage.md) | physics | `tool:authoring`, `tool:build` |
| [Command registry and mode routing](features/command-registry-and-mode-routing.md) | ui | `tool:authoring` |
| [Author connectors and scoped resource feed wiring](features/connector-and-feed-authoring.md) | vehicles-and-parts | `tool:authoring`, `tool:build` |
| [Read mesh-only collision atlases for convex hull previews](features/convex-hull-atlas-import.md) | physics | `tool:authoring`, `tool:build` |
| [Bridge KSA transforms to a three.js editor](features/coordinate-transform-bridge.md) | assets | `tool:authoring`, `tool:build` |
| [Demand-driven browser preview](features/demand-driven-preview.md) | rendering | `tool:authoring` |
| [Embedded part preview](features/embedded-part-preview.md) | rendering | `tool:authoring`, `tool:build` |
| [Paint emissive masks and bake color ramps](features/emissive-paint-and-ramp-baking.md) | assets | `tool:authoring`, `tool:build` |
| [Engine design and validation](features/engine-design-and-validation.md) | vehicles-and-parts | `tool:authoring` |
| [Normalize imported glTF into reusable KSA SubParts](features/gltf-model-import.md) | assets | `tool:authoring`, `tool:build` |
| [Isolate customized built-in SubParts with export variants](features/isolated-subpart-variants.md) | assets | `tool:authoring`, `tool:build` |
| [Author IVA seats and interior visibility](features/iva-seat-authoring.md) | camera | `tool:authoring`, `tool:build` |
| [Author hierarchical part animation with an explicit rest anchor](features/keyframe-animation-authoring.md) | vehicles-and-parts | `tool:authoring`, `tool:build` |
| [Bake kitten geometry into static part assets](features/kitten-pose-baking.md) | kittens | `tool:authoring`, `tool:build` |
| [Launch-site system export](features/launch-site-system-export.md) | celestials | `tool:authoring`, `tool:build` |
| [Author mass shapes, tanks and power GameData](features/mass-and-resource-authoring.md) | vehicles-and-parts | `tool:authoring`, `tool:build` |
| [Build KSA material channels and KTX2 textures in the browser](features/material-and-ktx2-pipeline.md) | assets | `tool:authoring`, `tool:build` |
| [Export named mesh atlases with separate picking geometry](features/mesh-atlas-and-picking-export.md) | assets | `tool:authoring`, `tool:build` |
| [Isolate multiple parts within one browser project](features/multi-part-project-isolation.md) | persistence | `tool:authoring`, `tool:build` |
| [Native asset-only mod export from a browser](features/native-asset-mod-export.md) | assets | `tool:build` |
| [Generate ground-clutter atlases and audit legacy scenario output](features/offline-ground-clutter-generation.md) | celestials | `tool:build` |
| [Create primitive meshes with per-face surfaces](features/procedural-mesh-and-surface-authoring.md) | assets | `tool:authoring`, `tool:build` |
| [Persist browser projects and archive their binary assets](features/project-persistence-and-archives.md) | persistence | `tool:authoring` |
| [Propulsion design wizards](features/propulsion-design-wizards.md) | vehicles-and-parts | `tool:authoring` |
| [Preserve unmodeled GameData through structured XML passthrough](features/schema-aware-gamedata-roundtrip.md) | assets | `tool:authoring`, `tool:build` |
| [Solid-motor grain design](features/solid-motor-grain-design.md) | vehicles-and-parts | `tool:authoring` |
| [Static-object composition](features/static-object-composition.md) | assets | `tool:authoring`, `tool:build` |
| [Undoable action chains](features/undoable-action-chains.md) | testing-and-tooling | `tool:authoring` |

## Build, test and tooling

The source package exposes `dev`, mini-app development entries, `typecheck`, `test`, lint/format checks, browser smoke suites and thumbnail capture commands. Its build runs TypeScript checking followed by the editor, part-preview and ICRP Vite builds. Parser fixtures provide selected XML inputs without requiring the entire private asset tree. See [asset pipeline and regression tooling](features/asset-pipeline-and-regression-tooling.md) for runtime and fixture details.[^package]

This corpus analysis inspected the pinned implementation and decompiled game contracts. It did not run Flexo’s build/test suites, operate the browser, install an exported mod or flight-test generated content.

## Compatibility and boundaries

The knowledge bundle is pinned to Flexo `e804879abfc1d45ca1c174a9c95c5fded58c1bf2` and checked against KSA `2026.10.10.5554`; this is a source-analysis baseline, not a claim that the application was tested in that build. The integration catalog identifies areas sensitive to game schema changes: XML ownership and units, placement transforms, material packing, mesh names, animation channels, propulsion equations and static-object resolution.[^scope]

Browser previews and numerical readouts help author data but do not establish native rendering, collision or flight behavior. Project persistence and archive formats have their own versions; game exports do not carry an editor migration layer. The feature pages distinguish implemented mechanisms from unsupported or assembly-dependent behavior. Planning-only converters are not presented as implemented features. The implemented [offline ground-clutter generator](features/offline-ground-clutter-generation.md) has older XML and object-selection assumptions that conflict with this game build; its atlas construction remains useful, but its current output is not a verified compatible package.

## Secondary sources

These upstream guides are useful workflow context; implementation claims in the feature pages are pinned to executable source and, where applicable, current decompiled game code.

- [docs/architecture.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/architecture.md) explains the application layers.[^architecture]
- [docs/importing-models.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/importing-models.md) covers DCC inputs and conversion limits.[^import-doc]
- [docs/texturing.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/texturing.md) covers surface authoring and material channels.[^materials-doc]
- [docs/animation-editor.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/animation-editor.md) explains rest anchors, keyframes and playback.[^animation-doc]
- [docs/engines.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/engines.md) covers propulsion graphs and design constraints.[^engines-doc]
- [docs/projects.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/projects.md) describes editable storage and exchange.[^projects-doc]
- [scope/static-objects.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/static-objects.md) and [scope/launch-sites.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/launch-sites.md) summarize the companion editor’s native contracts.[^static-doc][^site-doc]
- [scope/FULL_SCOPE.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/FULL_SCOPE.md) inventories game-facing break surfaces.[^scope]

[^license]: [LICENSE](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/LICENSE)
[^architecture]: [docs/architecture.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/architecture.md)
[^export]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L78-L221)
[^package]: [package.json](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json#L6-L63)
[^asset-plugin]: [vite/ksaAssets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts#L33-L94)
[^scope]: [scope/FULL_SCOPE.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/FULL_SCOPE.md)
[^animation-doc]: [docs/animation-editor.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/animation-editor.md)
[^engines-doc]: [docs/engines.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/engines.md)
[^import-doc]: [docs/importing-models.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/importing-models.md)
[^static-doc]: [scope/static-objects.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/static-objects.md)
[^site-doc]: [scope/launch-sites.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scope/launch-sites.md)
[^projects-doc]: [docs/projects.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/projects.md)
[^materials-doc]: [docs/texturing.md](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/docs/texturing.md)
