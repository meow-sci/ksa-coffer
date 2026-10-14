---
type: Mod Feature
title: Normalize imported glTF into reusable KSA SubParts
description: Analyze GLB or glTF scenes and normalize mesh instances, materials and handedness for native part export
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - geometry-normalization
game_types: []
lifecycle:
  - tool:authoring
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
  - id: flexo-src-ksa-importplan
    repo: flexo
    path: src/ksa/importPlan.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importPlan.ts
    title: src/ksa/importPlan.ts
  - id: flexo-src-ksa-importnormalize
    repo: flexo
    path: src/ksa/importNormalize.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts
    title: src/ksa/importNormalize.ts
  - id: flexo-src-ksa-importmaterials
    repo: flexo
    path: src/ksa/importMaterials.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts
    title: src/ksa/importMaterials.ts
  - id: flexo-src-three-loadmodelfile
    repo: flexo
    path: src/three/loadModelFile.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts
    title: src/three/loadModelFile.ts
---

Flexo imports external models into its asset model instead of shipping an arbitrary glTF scene unchanged. Each resulting surface becomes a reusable SubPart with one or more placements.

## How it works

Analysis separates mesh/material groups and gathers instance transforms, warnings and geometry estimates. Normalization clones geometry, optionally bakes transforms or scale, and forces scale baking when a group is mirrored. It repairs triangle winding after a negative-determinant bake, fills missing indices and normals, promotes UV1 only when UV0 is absent, and strips unsupported attributes and morph data. Optional double-sided import creates a reversed, normal-negated copy of the surface. Materials are planned separately so texture factors and channels can be converted to the exported KSA material representation.[^flexo-src-ksa-importplan][^flexo-src-ksa-importnormalize][^flexo-src-ksa-importmaterials][^flexo-src-three-loadmodelfile]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/importPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importPlan.ts#L296-L485) | Analyze mesh/material groups and import warnings |
| [src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L105-L188) | Bake transforms, repair mirrors and normalize attributes |
| [src/ksa/importMaterials.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts#L327-L455) | Material-factor and texture import planning |
| [src/three/loadModelFile.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts#L1-L140) | Model file loading and decoder setup |

## Snippets

```typescript
// src/ksa/importNormalize.ts L152-L159
  // Indices are MANDATORY: GltfUtils.cs:484-488 only builds an index buffer
  // `if (prim.Indices.HasValue)`, so a non-indexed primitive draws zero triangles and its CPU
  // picking span is empty (MeshReference.cs:90-96) — invisible and unpickable, with no error.
  if (!geometry.getIndex()) {
    const count = geometry.getAttribute('position')?.count ?? 0;
    const index = count > 65536 ? new Uint32Array(count) : new Uint16Array(count);
    for (let i = 0; i < count; i++) index[i] = i;
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
```

## Game APIs touched

The importer runs entirely in the browser. It emits normalized geometry and descriptors consumed by Flexo’s native mesh-atlas exporter; it does not invoke a game import API.

## Pitfalls and version notes

The current source supports explicit doubled geometry, despite older prose listing single-sided-only import. This is geometry duplication with a triangle cost. Unsupported source features are not recovered merely because the GLB loads in three.js; inspect warnings for animation, skinning, UVs and materials. Imported geometry must be kept in a full project archive because descriptors alone do not contain its binary data.

The loader accepts binary GLB or textual glTF with supplied sidecar files and enables Draco and meshopt decoding. It deliberately does not wire a KTX2/BasisU texture decoder into this import path; PNG/JPEG source images are the supported alternative. General model import bakes supported skin geometry at its bind pose and does not turn arbitrary skeletal animation into a KSA runtime rig ([src/three/loadModelFile.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts#L1-L140), [src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L136-L150)).

## See also

- [mesh atlas and picking export](mesh-atlas-and-picking-export.md)
- [material and ktx2 pipeline](material-and-ktx2-pipeline.md)
- [project persistence and archives](project-persistence-and-archives.md)
- [Import models and author procedural meshes in a browser asset pipeline](../../../howto/assets/models-and-textures/add-a-part-model-with-glb-and-pbr-textures/add-a-part-model-with-glb-and-pbr-textures-3.md) - how-to article demonstrating this feature

[^flexo-src-ksa-importplan]: [src/ksa/importPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importPlan.ts#L296-L485)
[^flexo-src-ksa-importnormalize]: [src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L105-L188)
[^flexo-src-ksa-importmaterials]: [src/ksa/importMaterials.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importMaterials.ts#L327-L455)
[^flexo-src-three-loadmodelfile]: [src/three/loadModelFile.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts#L1-L140)
