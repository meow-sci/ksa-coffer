---
type: Mod Feature
title: Export named mesh atlases with separate picking geometry
description: Emit indexed named GLB meshes and optional simplified view meshes that remain selectable in the game editor
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - mesh-simplification
game_types:
  - KSA.MeshAtlasFileReference
  - KSA.Part
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:35Z
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
  - id: flexo-src-ksa-exportglb
    repo: flexo
    path: src/ksa/exportGlb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts
    title: src/ksa/exportGlb.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
  - id: ksa-current-decomp-ksa-meshatlasfilereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/MeshAtlasFileReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs
    title: current/decomp/KSA/MeshAtlasFileReference.cs
  - id: ksa-current-decomp-ksa-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: current/decomp/KSA/Part.cs
---

A renderable custom mesh also needs discoverable identity and picking geometry. Flexo’s exporter handles these as separate contracts and keeps the render mesh intact when simplifying selection geometry.

## How it works

The exporter clones the source geometry, keeps position, normal and UV attributes, and generates indices if needed. Each atlas node gets a render mesh and a distinct _VM copy. A post-pass writes names onto glTF mesh definitions because node names alone do not satisfy the game’s atlas registry. The XML declares a unique model, material reference and MeshView reference. Optional meshopt simplification changes only the view copy’s index buffer and falls back to the full copy if simplification is unavailable.[^flexo-src-ksa-exportglb][^flexo-src-ksa-assetsxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L70-L218) | Indexed geometry normalization and paired view meshes |
| [src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L224-L272) | Copy node names into mesh definitions and repack GLB |
| [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L225-L258) | Wire each generated SubPart to its material and MeshView |

## Snippets

```typescript
// src/ksa/exportGlb.ts L81-L94
function toKsaGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const out = geometry.clone();
  for (const name of Object.keys(out.attributes)) {
    if (!KSA_READ_ATTRIBUTES.has(name)) out.deleteAttribute(name);
  }
  if (!out.getIndex()) {
    // De-indexed input (MikkTSpace tangents, geometry.toNonIndexed(), some DCC exports):
    // rebuild the trivial 0..count-1 index so GLTFExporter emits an `indices` accessor.
    const count = out.getAttribute('position')?.count ?? 0;
    const index = count > 65536 ? new Uint32Array(count) : new Uint16Array(count);
    for (let i = 0; i < count; i++) index[i] = i;
    out.setIndex(new THREE.BufferAttribute(index, 1));
  }
  return out;
```

## Game APIs touched

KSA.MeshAtlasFileReference.DoLoad registers meshes by the glTF mesh name.[^ksa-current-decomp-ksa-meshatlasfilereference]

KSA.Part.RayCastEgoSubPart requires a MeshViewModule for selection.[^ksa-current-decomp-ksa-part]

## Pitfalls and version notes

The simplification budget is best effort, not a guarantee. A distinct geometry object prevents exporter deduplication from collapsing the render and view names. View meshes affect picking accuracy and CPU cost; they are not physics colliders. This review verifies the file contracts from source and does not claim an in-game import test.

## See also

- [gltf model import](gltf-model-import.md)
- [collider authoring and coverage](collider-authoring-and-coverage.md)
- [native asset mod export](native-asset-mod-export.md)
- [Import models and author procedural meshes in a browser asset pipeline](../../../howto/assets/models-and-textures/add-a-part-model-with-glb-and-pbr-textures/add-a-part-model-with-glb-and-pbr-textures-3.md) - how-to article demonstrating this feature

[^flexo-src-ksa-exportglb]: [src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L224-L272)
[^flexo-src-ksa-assetsxmlserializer]: [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L225-L258)
[^ksa-current-decomp-ksa-meshatlasfilereference]: [current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L44)
[^ksa-current-decomp-ksa-part]: [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L2574-L2610)
