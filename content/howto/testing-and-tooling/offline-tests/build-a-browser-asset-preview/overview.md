---
type: Game Feature
title: Build a browser asset preview with shared commands and embedded views
description: Coalesce viewport redraws, share command dispatch and isolate an embeddable viewer from persistent editor settings
topic: build-a-browser-asset-preview
category: testing-and-tooling
group: offline-tests
approaches: 1
demonstrated_by:
  - mods/flexo/features/demand-driven-preview
  - mods/flexo/features/command-registry-and-mode-routing
  - mods/flexo/features/embedded-part-preview
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
tags:
  - flexo
  - asset-authoring
  - testing-and-tooling
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:12:22Z
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
  - id: source-flexo-src-three-renderloop-ts
    repo: flexo
    path: src/three/RenderLoop.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts
    title: src/three/RenderLoop.ts
  - id: source-flexo-apps-partpreview-src-app-tsx
    repo: flexo
    path: apps/partpreview/src/App.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx
    title: apps/partpreview/src/App.tsx
---

Build a responsive asset viewer and shared editing controls around the authoring document, with an optional embeddable view that does not change editor preferences.

## Engine background

The external loop is [src/three/RenderLoop.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts#L21-L66); its callbacks are browser frames, not phases of the KSA game loop. The embed resolves its part from loaded catalog data in [apps/partpreview/src/App.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx#L18-L43).

See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Build an on-demand browser preview with shared commands](build-a-browser-asset-preview.md) | Flexo | `on-demand-rendering`, `shader-adaptation`, `command-registry`, `state-machine`, `asset-pipeline`, `embedded-viewer`, `session-state` | `tool:authoring`, `tool:build` | Idle-friendly preview and reusable controls; explicit invalidation and material approximation remain the editor’s responsibility |

## See also

- [Demand-driven browser preview](../../../../mods/flexo/features/demand-driven-preview.md)
- [Command registry and mode routing](../../../../mods/flexo/features/command-registry-and-mode-routing.md)
- [Embedded part preview](../../../../mods/flexo/features/embedded-part-preview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../../../assets/validation/validate-asset-xml-references/overview.md)
- [Persist user-created palettes, presets and content files](../../../persistence/user-data/persist-user-created-presets-and-content/overview.md)
