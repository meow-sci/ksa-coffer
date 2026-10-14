---
type: How-To
title: Import models and author procedural meshes in a browser asset pipeline
description: Normalize imported or procedural browser geometry into named mesh atlases, material-bearing SubParts and separate picking twins
topic: add-a-part-model-with-glb-and-pbr-textures
category: assets
group: models-and-textures
approach: 3
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/gltf-model-import
  - mods/flexo/features/mesh-atlas-and-picking-export
  - mods/flexo/features/procedural-mesh-and-surface-authoring
techniques:
  - glb-model
  - geometry-normalization
  - mesh-simplification
  - procedural-geometry
game_types:
  - KSA.MeshAtlasFileReference
  - KSA.Part
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:48:15Z
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
  - id: flexo-src-ksa-exportglb
    repo: flexo
    path: src/ksa/exportGlb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts
    title: src/ksa/exportGlb.ts
  - id: flexo-src-three-loadmodelfile
    repo: flexo
    path: src/three/loadModelFile.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts
    title: src/three/loadModelFile.ts
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
  - id: flexo-src-three-primitives
    repo: flexo
    path: src/three/primitives.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts
    title: src/three/primitives.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
---

Use Flexo’s browser pipeline when authors need to import a GLB/glTF or create primitives and package the result as native part assets. The pipeline converts a scene into reusable geometry groups and placements; it does not send an arbitrary glTF scene straight to KSA.

## Background: how the game does it

KSA registers atlas meshes by the glTF mesh definition’s Name in [current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L44). A node name alone is insufficient. A visible SubPart also needs a MeshViewModule to participate in the part selection ray cast; see [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L2574-L2610). These selection meshes are separate from physics colliders.

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Analyze surfaces and instances before committing the import

Load the model, then group compatible mesh/material surfaces and collect each instance’s transform. Present the analysis warnings before inserting data into the document. Plan materials separately so texture factors and channel choices become KSA material inputs. [src/three/loadModelFile.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/loadModelFile.ts#L1-L140) [src/ksa/importPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importPlan.ts#L296-L485)

```typescript
// src/ksa/importNormalize.ts L122-L128
 */
function bakeMatrixFor(group: ImportGroup, opts: ImportOptions): THREE.Matrix4 {
  const first = group.instances[0]?.matrix ?? IDENTITY;
  if (opts.bakeTransforms) return first.clone();
  const mirrored = group.instances.some((i) => i.matrix.determinant() < 0);
  if (opts.bakeScale || mirrored) return scaleMatrixOf(first);
  return new THREE.Matrix4();
```

[src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L122-L128)

### 2. Bake mirrored transforms and normalize vertex data

Choose whether to bake the first instance’s full transform or scale. Force a scale bake for mirrored groups, then repair triangle winding. Keep position, normal and UV attributes, supply indices and missing normals, promote UV1 only when UV0 is absent, and remove morph attributes. Inspect no-UV warnings rather than inventing an automatic UV unwrap.

```typescript
// src/ksa/importNormalize.ts L139-L171

  // TEXCOORD_1 → TEXCOORD_0, but only when there is no UV0 to lose: KSA samples every map from
  // UV0 (all five PbrMaterial slots), so a UV1-only mesh is otherwise untexturable. Never
  // invent UVs when there are none at all — the 'noUv' warning already tells the user.
  if (!geometry.hasAttribute('uv') && geometry.hasAttribute('uv1')) {
    geometry.setAttribute('uv', geometry.getAttribute('uv1'));
  }
  for (const name of Object.keys(geometry.attributes)) {
    if (!KSA_READ_ATTRIBUTES.has(name)) geometry.deleteAttribute(name);
  }
  geometry.morphAttributes = {};
  geometry.clearGroups();

  // Indices are MANDATORY: GltfUtils.cs:484-488 only builds an index buffer
  // `if (prim.Indices.HasValue)`, so a non-indexed primitive draws zero triangles and its CPU
  // picking span is empty (MeshReference.cs:90-96) — invisible and unpickable, with no error.
  if (!geometry.getIndex()) {
    const count = geometry.getAttribute('position')?.count ?? 0;
    const index = count > 65536 ? new Uint32Array(count) : new Uint16Array(count);
    for (let i = 0; i < count; i++) index[i] = i;
    geometry.setIndex(new THREE.BufferAttribute(index, 1));
  }

  if (!bake.equals(IDENTITY)) {
    // applyMatrix4 transforms normals by the inverse-transpose, which is already the correct
    // mirrored normal; only the WINDING needs repairing, because a negative determinant flips
    // the triangle order relative to those normals.
    geometry.applyMatrix4(bake);
    if (bake.determinant() < 0) reverseWinding(geometry);
  }

  // Missing normals are computed AFTER the bake so the result is right for a mirrored geometry.
  if (!geometry.hasAttribute('normal')) geometry.computeVertexNormals();
```

[src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L139-L171)

### 3. Use doubled geometry only when both sides are needed

A material flag alone is not the implemented double-sided route. If the import requests both sides, append a reversed-winding, negated-normal copy and account for the increased triangle count. Keep skeletal and unsupported animation behavior outside this static geometry contract.

```typescript
// src/ksa/importNormalize.ts L173-L184
  if (opts.doubleSided) {
    // KSA culls back faces unconditionally, so "double-sided" has to be geometry: a second,
    // wound-reversed and normal-negated copy of the surface facing the other way.
    const back = geometry.clone();
    reverseWinding(back);
    negateNormals(back);
    const merged = mergeGeometries([geometry, back], false);
    geometry.dispose();
    back.dispose();
    if (!merged) throw new Error('normalizeImport: failed to build the double-sided geometry');
    geometry = merged;
  }
```

[src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L173-L184)

### 4. Offer procedural primitives through the same asset path

Store primitive dimensions instead of only a baked mesh. Rebuild boxes, cylinders, spheres or planes from those parameters and preserve stable face groups for material assignment and per-face UV transforms. A plane still has no physical thickness and needs separately authored collision.

```typescript
// src/three/primitives.ts L56-L74
export function buildPrimitiveGeometry(spec: PrimitiveSpec): THREE.BufferGeometry {
  switch (spec.kind) {
    case 'box': {
      const { width, height, depth } = spec.params;
      return new THREE.BoxGeometry(width, height, depth);
    }
    case 'cylinder': {
      const { radius, height, radialSegments } = spec.params;
      return new THREE.CylinderGeometry(radius, radius, height, Math.max(3, radialSegments));
    }
    case 'sphere': {
      const { radius, segments } = spec.params;
      const s = Math.max(3, segments);
      return new THREE.SphereGeometry(radius, s * 2, s);
    }
    case 'plane': {
      const { width, height } = spec.params;
      return new THREE.PlaneGeometry(width, height);
    }
```

[src/three/primitives.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts#L56-L74)

Face group and UV handling is in [src/three/primitives.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/primitives.ts#L26-L154), with per-face export resolution in [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L902-L1120).

### 5. Export a distinct render mesh and picking twin

Clone geometry for the _VM picking mesh so exporter deduplication cannot collapse its identity into the render mesh. Apply optional simplification only to the view copy. Treat the budget as best effort and preserve the full view geometry if simplification cannot improve it.

```typescript
// src/ksa/exportGlb.ts L200-L213
    if (viewMeshes) {
      const viewGeometry = toKsaGeometry(node.geometry);
      temporaries.push(viewGeometry);
      // Heavy (imported) geometry gets a decimated picking hull — see VIEW-MESH COST above.
      if (viewMeshBudget != null) await decimateViewGeometry(viewGeometry, viewMeshBudget);
      const viewMesh = new THREE.Mesh(viewGeometry, placeholder);
      viewMesh.name = node.name + VIEW_MESH_SUFFIX;
      scene.add(viewMesh);
    }
  }

  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true, onlyVisible: false });
  placeholder.dispose();
```

[src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L200-L213)

### 6. Write mesh-definition names and native SubPart references

After GLB export, copy each node’s name to its mesh definition and repack the container. Emit a unique PartModel ID for each SubPart, a material reference and a MeshView referencing its _VM mesh. Inspect both naming layers before attempting a native load.

```typescript
// src/ksa/assetsXmlSerializer.ts L240-L256
    if (sp.internal && !sp.glass) model.appendChild(internalElement(doc));
    const mesh = doc.createElement('Mesh');
    mesh.setAttribute('Id', sp.subPartId);
    model.appendChild(mesh);
    // Unconditional: a <PartModel> without <Material> crashes KSA at startup (see the field doc).
    const material = doc.createElement('Material');
    material.setAttribute('Id', sp.materialId);
    model.appendChild(material);
    sub.appendChild(model);
    // View mesh wires the SubPart to its picking geometry. KSA's vehicle editor
    // only raycasts SubParts that carry a MeshViewModule (built from <MeshView>);
    // without it the placed part renders but can't be hovered/selected/right-clicked.
    // The "<id>_VM" mesh is emitted into the atlas by buildMeshAtlasGlb.
    const meshView = doc.createElement('MeshView');
    const viewMesh = doc.createElement('Mesh');
    viewMesh.setAttribute('Id', sp.subPartId + VIEW_MESH_SUFFIX);
    meshView.appendChild(viewMesh);
```

[src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L240-L256)

The name repair and GLB repack are implemented in [src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L224-L272).

## Complete example

Follow [src/ksa/importPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importPlan.ts#L296-L485), [src/ksa/importNormalize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/importNormalize.ts#L105-L188), [src/ksa/exportGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportGlb.ts#L163-L272) and [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L225-L258). A useful first case is one imported indexed box with one material and one _VM twin; then test multiple material surfaces, repeated instances and a mirrored instance.

## Variations and gotchas

The loader supports Draco and meshopt geometry; textual glTF also needs its sidecars. Its KTX2/Basis texture decode is not wired, so use supported PNG/JPEG source images. The general model importer is distinct from the specialized native keyframe importer. Source skinning, morphs or animation do not become game behavior merely because Three.js can display them. Full project archives must carry imported binary resources. Native checks should include rendering, selection, normals and collision separately; this article does not claim browser or game execution.

## See also

- [One atlas per vehicle, one SubPart per moving body, glass and hidden subparts](add-a-part-model-with-glb-and-pbr-textures-1.md)
- [Shared palette atlas, _VM preview twins and namespaced subpart ids](add-a-part-model-with-glb-and-pbr-textures-2.md)
- [Normalize imported glTF into reusable KSA SubParts](../../../../mods/flexo/features/gltf-model-import.md)
- [Export named mesh atlases with separate picking geometry](../../../../mods/flexo/features/mesh-atlas-and-picking-export.md)
- [Create primitive meshes with per-face surfaces](../../../../mods/flexo/features/procedural-mesh-and-surface-authoring.md)
- [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md)
- [Define articulated subparts and mounts, animate and hide them from code](../../../vehicles-and-parts/parts/define-and-animate-subparts/overview.md)
- [Change a shipped part without breaking saves](../../../vehicles-and-parts/parts/evolve-a-shipped-part-without-breaking-saves/overview.md)
- [Export or generate a GLB that KSA loads correctly](../export-glb-from-blender-for-ksa/overview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../../validation/validate-asset-xml-references/overview.md)
- [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../declare-gltf-and-pbr-material-assets/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
