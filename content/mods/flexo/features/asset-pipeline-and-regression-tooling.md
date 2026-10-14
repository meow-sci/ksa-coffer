---
type: Mod Feature
title: Asset pipeline and regression tooling
description: Supply a private KSA catalog to browser builds and exercise parsers and workflows with fixtures, unit tests and smoke tools
mod: flexo
category: testing-and-tooling
tags:
  - flexo
  - asset-authoring
techniques:
  - asset-pipeline
  - test-fixtures
  - browser-smoke-tests
game_types: []
lifecycle:
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:45:35Z
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
  - id: flexo-vite-ksaassets
    repo: flexo
    path: vite/ksaAssets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts
    title: vite/ksaAssets.ts
  - id: flexo-scripts-sync-test-fixtures
    repo: flexo
    path: scripts/sync-test-fixtures.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/sync-test-fixtures.ts
    title: scripts/sync-test-fixtures.ts
  - id: flexo-package
    repo: flexo
    path: package.json
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json
    title: package.json
  - id: flexo-scripts-smoke-v2
    repo: flexo
    path: scripts/smoke-v2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts
    title: scripts/smoke-v2.ts
  - id: flexo-part-thumbnails
    repo: flexo
    path: scripts/capture-part-thumbs.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/capture-part-thumbs.ts
    title: scripts/capture-part-thumbs.ts
  - id: flexo-static-thumbnails
    repo: flexo
    path: scripts/generate-icrp-thumbs.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/generate-icrp-thumbs.ts
    title: scripts/generate-icrp-thumbs.ts
---

Flexo separates application source from the catalog assets that make the editor useful. Its tests and smoke tools exercise both data transformations and browser workflows.

## How it works

The Vite asset plugin reads KSA_ASSETS_DIR from the configured environment directory. Development requests under the app-relative ksa prefix stream from that tree after path normalization and traversal checks. Production copies the tree into the output ksa directory. Missing configuration emits warnings and leaves requests unavailable instead of embedding game binaries in source.

The fixture synchronization script copies selected XML from an explicit source, the environment, or the repository environment file into parser fixtures. Package scripts expose TypeScript checking, Vitest, formatting/linting and separate browser smoke entry points for the editor and static-object app. The build produces the main editor and both mini applications. These are reusable boundaries: pure serializers and math can run under unit tests, while browser automation checks integrated routing and interaction.[^flexo-vite-ksaassets][^flexo-scripts-sync-test-fixtures][^flexo-package][^flexo-scripts-smoke-v2]

Thumbnail generation is also incremental. The part-preview capture tool combines a global render fingerprint (source, dependency packages, decoder files and capture flags) with each part’s placements, templates and referenced binary contents. A catalog update can therefore regenerate only affected parts. ICRP thumbnails separately hash catalog signatures and asset bytes, prune orphaned entries, and remember failed entries so unchanged failures do not repeatedly exhaust the render timeout. These Node 24 tools use browser rendering; they produce catalog previews, not evidence of KSA rendering correctness.[^flexo-part-thumbnails][^flexo-static-thumbnails]

## Lifecycle and timing

Asset preparation, tests and bundling occur outside KSA in tool:build. Development serving is part of the authoring tool host. These commands do not deploy a runtime plugin into a game process.

## Key code

| Source | Role |
|---|---|
| [vite/ksaAssets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts#L33-L94) | Environment-driven development serving and build-time copy |
| [scripts/sync-test-fixtures.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/sync-test-fixtures.ts#L1-L71) | Refresh vendored XML fixtures from the configured asset tree |
| [package.json](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json#L6-L27) | Build, typecheck, unit-test and browser-smoke entry points |
| [scripts/smoke-v2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts#L1-L65) | Browser smoke runner configuration and entry flow |

## Snippets

```typescript
// vite/ksaAssets.ts L51-L60
    // Emit the assets the app fetches at /ksa/* into dist/ksa/ for production.
    writeBundle(options) {
      if (!assetsDir || !existsSync(assetsDir)) {
        this.warn(
          `KSA_ASSETS_DIR is unset or missing (${assetsDir || 'unset'}); no /ksa assets emitted`,
        );
        return;
      }
      const outDir = options.dir ?? join(root, 'dist');
      cpSync(assetsDir, join(outDir, 'ksa'), { recursive: true });
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

A successful application bundle can still lack catalog assets when KSA_ASSETS_DIR is absent. Fixture copies are snapshots and must be refreshed deliberately as formats change. The upstream fixture script has a Bun entry point; follow its runtime requirements rather than assuming every script uses the same launcher. This analysis inspected source and did not execute Flexo builds, tests or browser smoke runs.

## See also

- [embedded part preview](embedded-part-preview.md)
- [schema aware gamedata roundtrip](schema-aware-gamedata-roundtrip.md)
- [native asset mod export](native-asset-mod-export.md)
- [Supply catalog assets and regression-test browser exports](../../../howto/assets/validation/validate-asset-xml-references/validate-asset-xml-references-4.md) - how-to article demonstrating this feature

[^flexo-vite-ksaassets]: [vite/ksaAssets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts#L33-L94)
[^flexo-scripts-sync-test-fixtures]: [scripts/sync-test-fixtures.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/sync-test-fixtures.ts#L1-L71)
[^flexo-package]: [package.json](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json#L6-L27)
[^flexo-scripts-smoke-v2]: [scripts/smoke-v2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts#L1-L65)

[^flexo-part-thumbnails]: [scripts/capture-part-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/capture-part-thumbs.ts#L443-L505)

[^flexo-static-thumbnails]: [scripts/generate-icrp-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/generate-icrp-thumbs.ts#L102-L165)
