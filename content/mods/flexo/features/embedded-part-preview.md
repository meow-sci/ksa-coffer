---
type: Mod Feature
title: Embedded part preview
description: Build a standalone catalog viewer and matching manifest while sharing static assets with the main authoring application
mod: flexo
category: rendering
tags:
  - flexo
  - asset-authoring
techniques:
  - asset-pipeline
  - embedded-viewer
  - session-state
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:39:16Z
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
  - id: flexo-apps-partpreview-src-app
    repo: flexo
    path: apps/partpreview/src/App.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx
    title: apps/partpreview/src/App.tsx
  - id: flexo-apps-partpreview-src-settings
    repo: flexo
    path: apps/partpreview/src/settings.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts
    title: apps/partpreview/src/settings.ts
  - id: flexo-apps-partpreview-vite-config
    repo: flexo
    path: apps/partpreview/vite.config.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/vite.config.ts
    title: apps/partpreview/vite.config.ts
  - id: flexo-vite-previewmanifest
    repo: flexo
    path: vite/previewManifest.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/previewManifest.ts
    title: vite/previewManifest.ts
---

Flexo ships a small part viewer intended for embedding alongside reference material. It has its own application bundle and session state, while reusing the catalog and geometry infrastructure.

## How it works

The mini app parses a requested part_id and supported viewing options from the URL. It loads the catalogs before resolving the requested part and creating the viewport, returning an explicit error for missing or unknown identifiers. Viewer settings are session-only so embedding on the editor origin does not change the editor’s persisted preferences.

The build points asset requests at the main application’s catalog, HDR environments and texture transcoder instead of copying those trees again. A Vite plugin creates manifest.json using the same asset-file list and part parser as the browser. That manifest enumerates acceptable part IDs, environment presets and the catalog build, giving a host site a data-driven way to choose embeds.[^flexo-apps-partpreview-src-app][^flexo-apps-partpreview-src-settings][^flexo-apps-partpreview-vite-config][^flexo-vite-previewmanifest]

## Lifecycle and timing

The manifest is produced in tool:build. Catalog loading and interactive viewing run in tool:authoring browser callbacks, with no game installation or runtime mod hooks involved.

## Key code

| Source | Role |
|---|---|
| [apps/partpreview/src/App.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx#L18-L43) | Wait for catalogs and resolve the requested part before viewport creation |
| [apps/partpreview/src/settings.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts#L1-L100) | URL parameters and session-only preview settings |
| [apps/partpreview/vite.config.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/vite.config.ts#L20-L65) | Standalone bundle and shared production asset base |
| [vite/previewManifest.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/previewManifest.ts#L57-L95) | Catalog-derived accepted part and environment manifest |

## Snippets

```typescript
// apps/partpreview/vite.config.ts L28-L40
  publicDir: command === 'serve' ? resolve(repoRoot, 'public') : false,
  define: {
    // At build time the page fetches `ksa/`, `hdr/` and `basis/` from the MAIN
    // app's copy under /flexo/; in dev this app serves them itself under its own
    // base (ksaAssets below + publicDir above). See `assetBase()` in src/assetBase.ts.
    'import.meta.env.VITE_ASSET_BASE':
      command === 'build' ? JSON.stringify('/flexo/') : JSON.stringify('/flexo/apps/partpreview/'),
  },
  build: {
    outDir: resolve(repoRoot, 'dist/apps/partpreview'),
    // Explicit because outDir is outside this app's root: it only empties that
    // subfolder, never dist/ itself.
    emptyOutDir: true,
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

An embed depends on the shared asset deployment and correct base paths. Part membership derives from the parser’s renderable-part rule; do not independently guess which XML identifiers the viewer accepts. Rendering a part confirms only browser loading, not native game compatibility or physics.

## See also

- [demand driven preview](demand-driven-preview.md)
- [asset pipeline and regression tooling](asset-pipeline-and-regression-tooling.md)
- [builtin part composition](builtin-part-composition.md)
- [Build an on-demand browser preview with shared commands](../../../howto/testing-and-tooling/offline-tests/build-a-browser-asset-preview/build-a-browser-asset-preview.md) - how-to article demonstrating this feature

[^flexo-apps-partpreview-src-app]: [apps/partpreview/src/App.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx#L18-L43)
[^flexo-apps-partpreview-src-settings]: [apps/partpreview/src/settings.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts#L1-L100)
[^flexo-apps-partpreview-vite-config]: [apps/partpreview/vite.config.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/vite.config.ts#L20-L65)
[^flexo-vite-previewmanifest]: [vite/previewManifest.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/previewManifest.ts#L57-L95)
