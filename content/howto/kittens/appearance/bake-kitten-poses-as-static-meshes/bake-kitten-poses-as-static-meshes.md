---
type: How-To
title: Bake a kitten bind pose into ordinary static SubParts
description: Bake character positions and socket attachments into static mesh groups while preserving material boundaries and explicit texture dependencies
topic: bake-kitten-poses-as-static-meshes
category: kittens
group: appearance
difficulty: intermediate
prerequisites:
  - flexo-source
  - browser-catalog-assets
  - three-js
demonstrated_by:
  - mods/flexo/features/kitten-pose-baking
techniques:
  - glb-model
  - cpu-pose-baking
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - kittens
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:17:50Z
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
  - id: source-flexo-src-three-kittenbake-ts
    repo: flexo
    path: src/three/kittenBake.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts
    title: src/three/kittenBake.ts
  - id: source-flexo-src-ksa-modexport-ts
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Use this approach to create a reference figure or decorative static part from the catalog’s kitten geometry. Flexo demonstrates the CPU bake and ordinary asset export. It does not create a controllable kitten, a live crew member or a general skeletal-animation converter.

## Background: how the game does it

The source loads character geometry in the browser and converts it to static mesh/material descriptors. Native output uses the normal part atlas path. There is no browser call into the game’s character runtime; the meaningful contract here is the exported geometry and material identity.

## Lifecycle and timing

Loading and baking run during tool:authoring and export runs during tool:build. Await asset loads before baking. The shared cache is keyed by kitten kind; document placement transforms remain separate from the cached root-space geometry. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Load and clone the body skeleton

Keep the cached glTF immutable. The loader in [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L30-L55) redirects the missing placeholder ORM image to a served texture and shares pending loads. Clone its skeleton, update world matrices and group only descriptor-matched visible surfaces:

```typescript
// src/three/kittenBake.ts L256-L265
// ... enclosing context omitted
  // Body: bake each (skinned) mesh in body-root space.
  const bodyGltf = await loadKittenGltf(KITTEN_BODY_GLTF_URL);
  const body = cloneSkeleton(bodyGltf.scene);
  body.updateMatrixWorld(true); // pose the bind-pose skeleton before baking
  for (const mesh of collectMeshes(body)) {
    const name = materialName(mesh.material) ?? '';
    if (HIDDEN_BODY_MATERIALS.has(name)) continue;
    const d = byMaterial.get(name);
    if (d) add(d.specKey, bakeGeometry(mesh));
  }
// ... enclosing context omitted
```

The expected intermediate result is an independent bind-pose body whose matrices are ready before reading any vertex. A missing image response that returns the app HTML is not a valid texture fallback.

### 2. Bake positions and preserve authored normals

Reuse bakeGeometry from [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L76-L120). Skinned positions come from the CPU skin evaluator; ordinary positions come from the buffer. Transform them into the glTF root frame and preserve normals instead of recomputing across split seams:

```typescript
// src/three/kittenBake.ts L98-L119
// ... enclosing context omitted
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
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (src.attributes.uv)
    geo.setAttribute('uv', (src.attributes.uv as THREE.BufferAttribute).clone());
  if (src.index) geo.setIndex(src.index.clone());
  if (nrm) geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  else geo.computeVertexNormals(); // fallback for meshes with no authored normals
// ... enclosing context omitted
```

The resulting geometry has positions, UVs, indices and normals but no live skinning requirement. This normal transform is appropriate to this bind-pose path; arbitrary animated poses need a corresponding skin-normal solution.

### 3. Apply socket transforms to attachments

Keep attachment corrections in one place. The descriptor chooses a socket bone; a missing socket logs a warning and skips that attachment. Bake attachment-local geometry, then transform it by the bone world matrix and the explicit correction:

```typescript
// src/three/kittenBake.ts L267-L284
// ... enclosing context omitted
  // Attachments: bake each at its socket bone's bind-pose world transform.
  for (const att of KITTEN_ATTACHMENTS) {
    const bone = body.getObjectByName(att.socketBone);
    if (!bone) {
      console.warn(`kittenBake: socket bone '${att.socketBone}' not found for ${att.name}`);
      continue;
    }
    const node = cloneSkeleton((await loadKittenGltf(att.gltfUrl)).scene);
    node.updateMatrixWorld(true);
    const M = bone.matrixWorld.clone().multiply(ATTACHMENT_CORRECTION);
    for (const mesh of collectMeshes(node)) {
      const d = byMaterial.get(materialName(mesh.material) ?? '');
      if (!d) continue;
      const geo = bakeGeometry(mesh); // attachment-local space
      geo.applyMatrix4(M); // → body-root space
      add(d.specKey, geo);
    }
  }
// ... enclosing context omitted
```

Inspect helmet/visor orientation in the browser. The calibrated correction is in [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L59-L73); copying body placement rotation into this matrix would apply it twice.

### 4. Merge by descriptor and choose texture delivery

Merge geometries only within the same descriptor/material grouping, dispose copied temporary buffers, and keep a separately identified piece for each output surface:

```typescript
// src/three/kittenBake.ts L286-L305
// ... enclosing context omitted
  // One merged geometry per descriptor (in descriptor order), dropping empties.
  const result: KittenSubMesh[] = [];
  for (const d of descriptors) {
    const geos = groups.get(d.specKey);
    if (!geos || geos.length === 0) continue;
    let merged: THREE.BufferGeometry | null;
    if (geos.length === 1) {
      merged = geos[0];
    } else {
      merged = mergeGeometries(geos, false);
      for (const g of geos) g.dispose(); // sources are copied into `merged`
    }
    if (!merged) {
      console.warn(`kittenBake: failed to merge geometry for '${d.specKey}'`);
      continue;
    }
    result.push({ specKey: d.specKey, label: d.label, source: d.source, geometry: merged });
  }
  return result;
}
// ... enclosing context omitted
```

In [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L681-L762), choose either configured Core texture references or bundled texture bytes. Absolute Core paths are installation-specific; bundling assets is a separate licensing decision from the MIT application source. A transparent visor follows the glass route; the special glass/glow pair is covered by the material workflow.

## Complete example

The complete bake is [src/three/kittenBake.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/kittenBake.ts#L235-L304) and the material/texture export is [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L681-L762). Verify that body and attachments share one root frame, then let the native atlas exporter create the mesh identities and view meshes. Expected output is static SubParts using those baked surfaces.

## Variations and gotchas

Changing a pose after a kind-keyed bake requires deliberate cache invalidation or a different cache key. This implementation is bind-pose/static authoring, not arbitrary animation baking. GPU texture support can make the preview use flat materials even when source geometry loaded. A browser screenshot does not verify native shading, picking or collision; author physical data separately and test the exported package in KSA.

## See also

- [Topic overview](overview.md)
- [Bake kitten geometry into static part assets](../../../../mods/flexo/features/kitten-pose-baking.md)
- [Reach a kitten's avatar, skeleton, bones and animation catalog](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md)
- [Add a part's art with its own GLB model and PBR textures](../../../assets/models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
