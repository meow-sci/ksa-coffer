---
type: How-To
title: Supply catalog assets and regression-test browser exports
description: Configure a prepared KSA asset tree, refresh XML fixtures and check browser export regressions
  with unit tests, smoke runs and incremental thumbnails
topic: validate-asset-xml-references
category: assets
group: validation
approach: 4
difficulty: intermediate
prerequisites:
  - flexo-checkout
  - node-24
  - pnpm
  - prepared-ksa-asset-tree
  - bun-for-fixture-sync
demonstrated_by:
  - mods/flexo/features/asset-pipeline-and-regression-tooling
techniques:
  - asset-pipeline
  - test-fixtures
  - browser-smoke-tests
game_types:
  - KSA.Mod
  - KSA.XmlLoader
  - KSA.AssetBundle
lifecycle:
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - validation
  - fixtures
  - browser-tests
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:09:26Z
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
  - id: flexo-export-tests
    repo: flexo
    path: src/ksa/modExport.test.ts
    title: Export regression assertions
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.test.ts
  - id: native-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    title: Native asset bundle loading
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
  - id: native-xml
    repo: ksa-game-assemblies
    path: current/decomp/KSA/XmlLoader.cs
    title: Native deserialization and OnDataLoad
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs
---

Use Flexo’s tooling to keep a browser authoring pipeline aligned with its supplied KSA catalog and to catch changes in generated XML before delivering a mod. You need the pinned Flexo checkout, Node 24, pnpm and a prepared catalog tree containing the XML and referenced model/texture files. Browser checks additionally require Playwright Chromium; refreshing fixtures uses Bun. The application has no StarMap or Harmony requirement.[^flexo-package][^flexo-scripts-smoke-v2][^flexo-scripts-sync-test-fixtures]

## Background: how the game does it

KSA’s native `Mod.LoadAssetBundles` reads the manifest’s asset paths and calls `XmlLoader.Load<AssetBundle>`; that loader deserializes XML and then invokes `OnDataLoad` ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L157-L169), [current/decomp/KSA/XmlLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs#L10-L33)). A browser parser test cannot substitute for that registration path or the later native rendering/physics behavior. These checks establish narrower contracts: supplied files are available, parsers preserve fields, serializers emit expected identities and browser commands remain usable.[^native-mod][^native-xml]

## Lifecycle and timing

`tool:build` covers catalog serving/copying, fixture refresh, tests and thumbnail generation outside the game. No KSA callback runs. Exported content is consumed later during native asset loading; see [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md). Keep browser evidence separate from native load or gameplay acceptance.

## Steps

### 1. Supply the catalog tree explicitly

From the Flexo checkout, install its pinned dependencies with `pnpm install --frozen-lockfile`. Set `KSA_ASSETS_DIR` to an absolute directory in the root `.env.local` or shell environment. The plugin loads this setting from Vite’s environment directory and serves the tree below the application base’s `ksa/` prefix. Absolute paths avoid differing relative resolution between the main editor and mini-app roots. The comment names an extraction script that is absent from this pinned checkout: treat the already prepared tree as an input, not a command this repository provides ([vite/ksaAssets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts#L5-L60)).[^flexo-vite-ksaassets]

```dotenv
# Example .env.local; replace this with your prepared catalog directory.
KSA_ASSETS_DIR=/absolute/path/to/prepared-assets
```

```typescript
// vite/ksaAssets.ts L48-L49
// ... enclosing context omitted
      const dir = loadEnv(config.mode, config.envDir, '').KSA_ASSETS_DIR;
      if (dir) assetsDir = resolve(config.root, dir);
// ... enclosing context omitted
```

Run `pnpm dev` to inspect the catalog in the editor. Missing configuration produces a warning and catalog requests fail. For a production build, `pnpm build` first type-checks and then builds the editor, part-preview and static-object applications; the plugin copies the supplied asset tree into each output. The copy does not validate XML or prove that the tree is complete. Keep the supplied game assets separate from the MIT application source.[^flexo-vite-ksaassets][^flexo-package]

### 2. Refresh deliberately selected XML fixtures

Run `bun scripts/sync-test-fixtures.ts --src /absolute/path/to/prepared-assets` from the checkout when the relevant game XML changes. The command copies only the XML names already present under `src/ksa/__fixtures__/`; add a chosen fixture once before expecting later refreshes to maintain it. It reports missing source files, skips those copies and exits nonzero, so review the entire output rather than accepting a partly refreshed set. Commit intentional fixture changes together with the affected parser tests ([scripts/sync-test-fixtures.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/sync-test-fixtures.ts#L1-L71)).[^flexo-scripts-sync-test-fixtures]

```typescript
// scripts/sync-test-fixtures.ts L58-L71
let missing = 0
for (const name of fixtures) {
  const from = join(src, name)
  if (!existsSync(from)) {
    console.error(`  MISSING in source (skipped): ${name} — not found under ${src}`)
    missing++
    continue
  }
  await Bun.write(join(fixturesDir, name), Bun.file(from))
  console.log(`  synced ${name}`)
}

console.log(`\n${fixtures.length - missing}/${fixtures.length} fixture(s) re-synced from ${src}`)
if (missing > 0) process.exit(1)
```

### 3. Assert round-trip export behavior

Run `pnpm typecheck` and `pnpm test`. For a focused export check, use `pnpm exec vitest run src/ksa/modExport.test.ts`. When changing a field, extend that test with an imported fixture and inspect the parsed exported XML. The existing propulsion regression builds each complete bundle, checks variant identities, reparses Part and GameData XML and compares preserved data ([src/ksa/modExport.test.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.test.ts#L180-L272)). This catches a serializer that still emits valid XML while silently dropping feeds or engine fields.[^flexo-export-tests][^flexo-package]

```typescript
// src/ksa/modExport.test.ts L242-L255
// ... enclosing context omitted
        const result = exported[0];
        expect(result.gimbals, engine.id).toEqual(imported.gameData.gimbals);
        for (const key of [
          'rockets',
          'combustors',
          'nozzles',
          'solidMotors',
          'solidNozzles',
          'solidGrainSegments',
          'rocketControllers',
          'consumerFeedWiring',
        ] as const) {
          expect(result[key], `${engine.id}/${key}`).toEqual(imported.gameData[key]);
        }
// ... enclosing context omitted
```

### 4. Exercise browser commands with smoke checks

Install the project-local browser with `pnpm exec playwright install chromium`, then run `pnpm smoke`. The runner starts a development server unless `SMOKE_BASE` points at one already running. Its DOM assertions cover catalog insertion, undo, mode changes, opening the export/project dialogs and selected engine workflows. Opening an export dialog is not a full generated-package or native-load test. Use `pnpm smoke:icrp` and `pnpm smoke:icrp-journey` for the separate static-object workflows. Named steps record failures and the main runner exits nonzero when any failed ([scripts/smoke-v2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts#L1-L62), [scripts/smoke-v2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts#L474-L476)).[^flexo-scripts-smoke-v2][^flexo-package]

```typescript
// scripts/smoke-v2.ts L53-L62
async function step(name: string, body: () => Promise<void>): Promise<void> {
  try {
    await body();
    console.log(`  ok    ${name}`);
  } catch (err) {
    failures++;
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err instanceof Error ? err.message : String(err)}`);
  }
}
```

### 5. Regenerate only affected previews

After `pnpm build`, use `pnpm thumbs:partpreview:check` for the configured representative part or `node scripts/capture-part-thumbs.ts --reconcile --no-turntable` for static catalog captures with input fingerprints. The capture runs against built files. Its global render tag includes source, render-package versions, decoders and flags, while each part additionally hashes placements, templates and referenced asset bytes. Full animated turntables require `img2webp`; `--no-turntable` avoids that dependency ([scripts/capture-part-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/capture-part-thumbs.ts#L1-L46), [scripts/capture-part-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/capture-part-thumbs.ts#L443-L505)).[^flexo-part-thumbnails]

```typescript
// scripts/capture-part-thumbs.ts L498-L505
/** One part's pixels, as a hash: the render tag, its placements, its templates, their files. */
async function partFingerprint(renderTag: string, inputs: PartRenderInputs): Promise<string> {
  const assets: string[] = []
  for (const url of inputs.assetUrls) {
    const path = assetPathForUrl(url)
    assets.push(url, path === null ? 'unresolved' : await fileHash(path))
  }
  return sha256(renderTag, inputs.placements, ...inputs.templates, ...assets)
// ... enclosing context omitted
```

For static-object thumbnails, run `pnpm thumbs:icrp` with the prepared asset directory still configured. It writes `public/thumbs-icrp/`, hashes catalog signatures and asset contents, removes orphaned entries and remembers unchanged failures so they do not repeat timeouts. A remembered failure is still missing output; inspect the result and correct the underlying input before expecting a retry. Unlike the part renderer’s global tag, this ICRP input hash does not include renderer source changes ([scripts/generate-icrp-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/generate-icrp-thumbs.ts#L1-L20), [scripts/generate-icrp-thumbs.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/generate-icrp-thumbs.ts#L102-L165)).[^flexo-static-thumbnails]

## Complete example

For a serializer change, configure the prepared assets, deliberately synchronize any changed fixture, add a failing assertion to the [src/ksa/modExport.test.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.test.ts#L180-L272), make the implementation change, then run the focused test, full unit suite and relevant browser smoke suite. Build before checking part-preview output. Finally inspect the exported package and load it in the pinned game to establish native acceptance. The commands above are reproducible instructions; none of the Flexo suites or game steps was executed for this documentation.

## Variations and gotchas

- Unit tests use vendored fixtures and can exercise transformations without the full private catalog; catalog browser smoke and rendering require the supplied files.

- A successful Vite build can still omit every catalog asset. Treat its missing-directory warning as an incomplete deliverable.

- Fixture synchronization is a Bun script. The browser smoke and thumbnail commands use Node 24 directly; do not assume a common runtime for all upstream scripts.

- Preview fingerprints avoid repeated work but do not establish visual correctness. A browser image does not prove the KSA material, collider or engine works.

- XML schema, IDs and binary conventions can change with the game. Recheck fixtures and native loading against the declared build when advancing pins.

## See also

- [Offline XML and path validation](validate-asset-xml-references-1.md)

- [Generated-geometry checks](validate-asset-xml-references-2.md)

- [Validation through the game serializer](validate-asset-xml-references-3.md)

- [Asset pipeline and regression tooling](../../../../mods/flexo/features/asset-pipeline-and-regression-tooling.md)

- [Native browser asset authoring](../../asset-xml/author-native-asset-mods-in-a-browser/overview.md)

[^flexo-vite-ksaassets]: vite/ksaAssets.ts.

[^flexo-scripts-sync-test-fixtures]: scripts/sync-test-fixtures.ts.

[^flexo-package]: package.json.

[^flexo-scripts-smoke-v2]: scripts/smoke-v2.ts.

[^flexo-part-thumbnails]: scripts/capture-part-thumbs.ts.

[^flexo-static-thumbnails]: scripts/generate-icrp-thumbs.ts.

[^flexo-export-tests]: Export regression assertions.

[^native-mod]: Native asset bundle loading.

[^native-xml]: Native deserialization and OnDataLoad.
