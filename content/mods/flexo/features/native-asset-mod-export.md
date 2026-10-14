---
type: Mod Feature
title: Native asset-only mod export from a browser
description: Package part XML, GameData, custom assets and animations into a native mod folder or downloadable ZIP
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - toml-config
  - browser-file-system
game_types:
  - KSA.Mod
  - KSA.AssetBundle
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
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: current/decomp/KSA/AssetBundle.cs
  - id: ksa-current-decomp-ksa-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: current/decomp/KSA/Mod.cs
---

Flexo turns an editor project into files consumed by KSA’s native content loader. The browser app itself is never installed as a StarMap assembly. Its default output identity is `flexo-parts`.

## How it works

The export plan expands layered glow, isolates modified built-in templates, and then generates one Part XML and one GameData XML containing every included part. An optional Assets XML declares generated geometry and materials; binary files travel beside those documents. Both XML preview and delivery use this plan. The manifest contains only a name and an assets list. ZIP export makes a fresh folder; direct folder export chooses unused XML filenames, writes binary paths, and regenerates the manifest from all XML files present. Duplicate sanitized part namespaces throw before serialization.[^flexo-src-ksa-modexport][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

The tool builds files on an explicit export or preview request. The resulting XML is consumed during native startup asset loading; no Flexo code runs in the game and there are no StarMap lifecycle hooks.

## Key code

| Source | Role |
|---|---|
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L78-L221) | Manifest and shared multi-part content plan |
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L1314-L1438) | ZIP and folder delivery |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L121-L221) | Geometry and GameData documents |

## Snippets

```typescript
// src/ksa/modExport.ts L115-L119
/** Serializes mod.toml with the given asset filenames (matches KSA's format). */
export function serializeModToml(assets: string[]): string {
  const list = assets.length === 0 ? '[]' : `[ ${assets.map((a) => `"${a}"`).join(', ')}]`;
  return `name = "${MOD_NAME}"\nassets = ${list}\n`;
}
```

## Game APIs touched

KSA.AssetBundle accepts multiple Part, SubPart and GameData assets in one document.[^ksa-current-decomp-ksa-assetbundle]

KSA.Mod.LoadAssetBundles consumes the manifest asset paths.[^ksa-current-decomp-ksa-mod]

## Pitfalls and version notes

A second folder export preserves old XML by adding numeric suffixes but overwrites matching binary paths. It is not an atomic versioned backup, and accumulating XML with repeated asset IDs deserves inspection. The project archive is the editable backup; a game mod ZIP is the game-facing deliverable. This source review did not launch KSA with a generated package.

## See also

- [isolated subpart variants](isolated-subpart-variants.md)
- [multi part project isolation](multi-part-project-isolation.md)
- [mesh atlas and picking export](mesh-atlas-and-picking-export.md)
- [Compose and export native asset-only mods in a browser](../../../howto/assets/asset-xml/author-native-asset-mods-in-a-browser/author-native-asset-mods-in-a-browser.md) - how-to article demonstrating this feature

[^flexo-src-ksa-modexport]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L1314-L1438)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L121-L221)
[^ksa-current-decomp-ksa-assetbundle]: [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L9-L77)
[^ksa-current-decomp-ksa-mod]: [current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L157-L191)
