---
type: Mod Feature
title: Bake kitten geometry into static part assets
description: Reuse character meshes as browser reference figures or static SubParts by baking bind-pose geometry and attachment transforms
mod: flexo
category: kittens
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - cpu-pose-baking
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:34:59Z
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
  - id: flexo-src-three-kittenbake
    repo: flexo
    path: src/three/kittenBake.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts
    title: src/three/kittenBake.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Flexo reuses kitten geometry as a scale aid and can convert its surfaces into static asset geometry. The output is a collection of ordinary meshes rather than a new controllable crew member.

## How it works

The baker evaluates skinned vertex positions on the CPU and transforms them into the glTF root frame. It preserves authored normals through the normal matrix and retains UVs and indices. The body skeleton is cloned before baking. Attachments are transformed through their socket bone and an explicit correction matrix, then merged into descriptor-defined surface groups. Results are cached by kitten kind. Export plans materials and either bundled or configured Core texture references for the resulting meshes.[^flexo-src-three-kittenbake][^flexo-src-ksa-modexport]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L60-L120) | CPU pose bake and authored-normal preservation |
| [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L235-L304) | Cached descriptor groups and socket attachment transforms |
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L681-L762) | Texture delivery and material planning for kitten-derived pieces |

## Snippets

```typescript
// src/three/kittenBake.ts L98-L110
  if (skinned) (mesh as THREE.SkinnedMesh).skeleton.update();
  for (let i = 0; i < n; i++) {
    if (skinned) (mesh as THREE.SkinnedMesh).getVertexPosition(i, v);
    else v.fromBufferAttribute(posAttr, i);
    v.applyMatrix4(mesh.matrixWorld); // → gltf-root space
    pos[i * 3] = v.x;
    pos[i * 3 + 1] = v.y;
    pos[i * 3 + 2] = v.z;
    if (nrm && normAttr) {
      v.fromBufferAttribute(normAttr, i).applyMatrix3(nm).normalize();
      nrm[i * 3] = v.x;
      nrm[i * 3 + 1] = v.y;
      nrm[i * 3 + 2] = v.z;
```

## Game APIs touched

The bake uses loaded character assets in the browser; it does not instantiate a live character or call the character runtime. Static output enters the normal part mesh/material path.

## Pitfalls and version notes

This mechanism is a bind-pose/static conversion, not runtime GPU skinning or character behavior. Its normal transform is justified by the baked pose and should not be generalized into a full animated-skin normal solver. Reusing Core images retains a dependency on game assets, and absolute texture-reference delivery is installation-specific.

## See also

- [mesh atlas and picking export](mesh-atlas-and-picking-export.md)
- [material and ktx2 pipeline](material-and-ktx2-pipeline.md)
- [Bake a kitten bind pose into ordinary static SubParts](../../../howto/kittens/appearance/bake-kitten-poses-as-static-meshes/bake-kitten-poses-as-static-meshes.md) - how-to article demonstrating this feature

[^flexo-src-three-kittenbake]: [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L235-L304)
[^flexo-src-ksa-modexport]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L681-L762)
