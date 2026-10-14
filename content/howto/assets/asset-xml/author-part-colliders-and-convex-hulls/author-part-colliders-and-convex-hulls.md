---
type: How-To
title: Author part colliders and convex-hull assets
description: Author primitive and existing convex-hull collider references with explicit owner frames,
  dimensions and sampled coverage diagnostics
topic: author-part-colliders-and-convex-hulls
category: assets
group: asset-xml
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/collider-authoring-and-coverage
  - mods/flexo/features/convex-hull-atlas-import
techniques:
  - xml-asset
  - geometry-validation
  - glb-model
  - binary-accessor
game_types:
  - KSA.ColliderTemplate
  - KSA.ConvexHullColliderTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:11:55Z
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
  - id: ksa-current-decomp-ksa-collidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs
    title: current/decomp/KSA/ColliderTemplate.cs
  - id: ksa-current-decomp-ksa-convexhullcollidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConvexHullColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs
    title: current/decomp/KSA/ConvexHullColliderTemplate.cs
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-ksa-collidersize
    repo: flexo
    path: src/ksa/colliderSize.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts
    title: src/ksa/colliderSize.ts
  - id: flexo-src-ksa-collisionatlas
    repo: flexo
    path: src/ksa/collisionAtlas.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts
    title: src/ksa/collisionAtlas.ts
  - id: flexo-src-three-collisionmeshcache
    repo: flexo
    path: src/three/CollisionMeshCache.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts
    title: src/three/CollisionMeshCache.ts
  - id: flexo-src-ksa-collidervalidation
    repo: flexo
    path: src/ksa/colliderValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts
    title: src/ksa/colliderValidation.ts
  - id: flexo-src-measure-collidercoverage
    repo: flexo
    path: src/measure/colliderCoverage.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts
    title: src/measure/colliderCoverage.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-ui-exportksadialog
    repo: flexo
    path: src/ui/ExportKsaDialog.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/ExportKsaDialog.tsx
    title: src/ui/ExportKsaDialog.tsx
---

Use Flexo’s collider model to build an external collision authoring workflow for parts. Keep render geometry, picking geometry and physical collision separate. This approach edits analytic shapes and references existing collision-atlas hulls; it is not a general concave-mesh collider generator.

## Background: how the game does it

KSA’s ColliderTemplate stores an authored location and rotation, then adds any shape-center offset when constructing its module: [current/decomp/KSA/ColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs#L68-L79). ConvexHullColliderTemplate scales source points, builds a nondegenerate hull and retains its center offset in [current/decomp/KSA/ConvexHullColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConvexHullColliderTemplate.cs#L38-L68). The browser must not assume its display triangulation is the runtime Bepu shape.

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Choose the collider owner and its local frame

Store null ownership for a part collider or the owning SubPart template ID for template-wide collision. Insert a shape through one undoable document action; place its location and rotation in that owner’s frame. Multiple placements of a template share its authored shape.

```typescript
// src/state/editorStore.ts L1290-L1308
export function addCollider(
  shape: ColliderShape,
  transform?: PlacementTransform,
  ownerTemplateId: string | null = null,
): void {
  const current = $part.get();
  const newId = nextColliderId(current);
  pushUndo('add collider', `${shape.toLowerCase()} ${newId}`);
  const part = clone(current);
  part.colliders.push({
    id: newId,
    shape,
    ownerTemplateId,
    position: transform ? { ...transform.position } : { x: 0, y: 0, z: 0 },
    rotation: transform ? { ...transform.rotation } : { x: 0, y: 0, z: 0 },
    scale: normalizeColliderSize(shape, transform?.scale ?? { x: 1, y: 1, z: 1 }),
    layerId: currentLayerId(part),
  });
  $part.set(part);
```

[src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L1290-L1308)

### 2. Convert outer dimensions into the correct native shape fields

Treat Box sizes as lengths, Sphere size as diameter, Cylinder X/Z as diameter and Y as height, and Capsule Y as total tip-to-tip height. Emit the capsule cylindrical segment as height minus diameter. A ConvexHull scale is a multiplier on source points, not the analytic shape’s meter dimensions.

```typescript
// src/ksa/colliderSize.ts L92-L107
export function colliderDimensions(shape: ColliderShape, size: Vec3): ColliderDimensions {
  const s = normalizeColliderSize(shape, size);
  switch (shape) {
    case 'ConvexHull':
      return { lengthXM: null, lengthYM: null, lengthZM: null, radiusM: null };
    case 'Box':
      return { lengthXM: s.x, lengthYM: s.y, lengthZM: s.z, radiusM: null };
    case 'Sphere':
      return { lengthXM: null, lengthYM: null, lengthZM: null, radiusM: s.x / 2 };
    case 'Cylinder':
      return { lengthXM: null, lengthYM: s.y, lengthZM: null, radiusM: s.x / 2 };
    case 'Capsule':
      // <LengthY> is the cylindrical segment only; the caps add one radius per end.
      return { lengthXM: null, lengthYM: s.y - s.x, lengthZM: null, radiusM: s.x / 2 };
  }
}
```

[src/ksa/colliderSize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts#L92-L107)

### 3. Decode existing collision atlases without requiring a scene

Resolve the collision mesh name to its atlas, read the first primitive’s POSITION accessor and require FLOAT VEC3 data. Add both buffer-view and accessor byte offsets; honor byte stride and little-endian float decoding. Build a browser convex hull for display; this decoder rejects an empty generated position buffer, without independently measuring the hull’s volume. [src/ksa/collisionAtlas.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/collisionAtlas.ts#L1-L17)

```typescript
// src/three/CollisionMeshCache.ts L31-L47
    const accessor = gltf.accessors[definition.primitives[0].attributes.POSITION];
    if (accessor.componentType !== 5126 || accessor.type.toUpperCase() !== 'VEC3') {
      throw new Error(`Collision mesh "${definition.name}" must carry FLOAT VEC3 positions.`);
    }
    const view = gltf.bufferViews[accessor.bufferView];
    const base = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
    const stride = view.byteStride ?? 12;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < accessor.count; i++) {
      const offset = base + i * stride;
      points.push(
        new THREE.Vector3(
          bin.getFloat32(offset, true),
          bin.getFloat32(offset + 4, true),
          bin.getFloat32(offset + 8, true),
        ),
      );
```

[src/three/CollisionMeshCache.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts#L31-L47)

### 4. Validate the raw document before normalization can hide errors

Report missing hull mesh IDs and raw dimensions that are nonfinite or below 0.0001 before converting them to emitted shape dimensions. Also check collider component IDs against tanks in the same owner scope. Warn about unplaced owners and scaled owning placements; inspect each warning rather than treating valid XML as valid collision.

```typescript
// src/ksa/colliderValidation.ts L53-L67
    // clamps, so reading through it would mask exactly the corruption this catches (a
    // hand-edited payload, or a decode that produced NaN). KSA feeds the value straight
    // into a Bepu shape constructor, and shipping a degenerate collidable is worse than
    // refusing to export.
    const bad = (['x', 'y', 'z'] as const).filter(
      (axis) => !Number.isFinite(c.scale[axis]) || c.scale[axis] < MIN_COLLIDER_SIZE_M,
    );
    if (bad.length > 0) {
      block(
        'collider-degenerate',
        `Collider "${c.id}" has a non-positive or non-finite size on ${bad.join(', ')} — ` +
          `KSA would build a degenerate ${c.shape} collidable from it.`,
      );
    }

```

[src/ksa/colliderValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts#L53-L67)

The complete scope and identity checks are in [src/ksa/colliderValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts#L37-L154). These diagnostics carry `block` or `warn` severity, but the current export dialog still permits both ZIP and folder delivery with blockers; its folder action becomes “Export anyway”. Resolve the findings yourself, or explicitly add a hard gate when adapting this pipeline. [src/ui/ExportKsaDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/ExportKsaDialog.tsx#L543-L561)

### 5. Run coverage as an explicit diagnostic

Transform sample points into each collider’s frame and test containment. Examine uncovered points and summed volume versus mesh bounds. Hull tests use plane half-spaces; primitives use their analytic containment rule. Request this work when evaluating the design rather than repeating it each render frame.

```typescript
// src/measure/colliderCoverage.ts L100-L121
  switch (collider.shape) {
    case 'ConvexHull':
      return (
        placed.hull?.planes.every(
          ({ normal, constant }) =>
            normal.x * d.x + normal.y * d.y + normal.z * d.z + constant <= EPS,
        ) ?? false
      );
    case 'Box':
      return Math.abs(d.x) <= hx + EPS && Math.abs(d.y) <= hy + EPS && Math.abs(d.z) <= hz + EPS;
    case 'Sphere':
      return Math.hypot(d.x, d.y, d.z) <= hx + EPS;
    case 'Cylinder':
      return Math.abs(d.y) <= hy + EPS && Math.hypot(d.x, d.z) <= hx + EPS;
    case 'Capsule': {
      // Distance to the segment: clamp onto it along Y, then measure radially.
      const halfSegment = Math.max(0, (collider.scale.y - collider.scale.x) / 2);
      const dy = Math.max(-halfSegment, Math.min(halfSegment, d.y));
      return Math.hypot(d.x, d.y - dy, d.z) <= hx + EPS;
    }
  }
}
```

[src/measure/colliderCoverage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts#L100-L121)

The aggregation is in [src/measure/colliderCoverage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts#L148-L181).

### 6. Serialize frames and preserve the original hull identity

Group collider shapes beneath their owner’s Collider component. Write every axis of LocationAsmb and Collider2Asmb. Hulls retain their collision Mesh ID and axis Scale; analytic shapes receive explicit native dimensions. Do not export the browser hull triangulation as if it were the original collision atlas.

```typescript
// src/ksa/partXmlSerializer.ts L500-L516
  for (const c of colliders) {
    const el = doc.createElement(c.shape);
    el.setAttribute('Id', c.id);
    el.appendChild(buildVec3Attrs(doc, 'LocationAsmb', c.position));
    el.appendChild(buildVec3Attrs(doc, 'Collider2Asmb', c.rotation));
    if (c.shape === 'ConvexHull') {
      const mesh = doc.createElement('Mesh');
      mesh.setAttribute('Id', c.meshId ?? '');
      el.appendChild(mesh);
      el.appendChild(buildVec3Attrs(doc, 'Scale', c.scale));
    }
    const dims = colliderDimensions(c.shape, c.scale);
    if (dims.lengthXM != null) el.appendChild(buildDistanceElement(doc, 'LengthX', dims.lengthXM));
    if (dims.lengthYM != null) el.appendChild(buildDistanceElement(doc, 'LengthY', dims.lengthYM));
    if (dims.lengthZM != null) el.appendChild(buildDistanceElement(doc, 'LengthZ', dims.lengthZM));
    if (dims.radiusM != null) el.appendChild(buildDistanceElement(doc, 'Radius', dims.radiusM));
    component.appendChild(el);
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L500-L516)

## Complete example

The complete path combines [src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L1290-L1309), [src/ksa/colliderValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts#L37-L154), [src/three/CollisionMeshCache.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/CollisionMeshCache.ts#L12-L110) and [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L493-L518). Start with a unit box collider around a known box mesh, then add a rotated cylinder and an existing named convex hull. Confirm each exported size and owner frame before testing native contact.

## Variations and gotchas

Coverage only evaluates its sample set, and summed volumes count overlaps repeatedly. Scaled owning placements are a known mismatch boundary; do not assume visible scale automatically rescales collision. The atlas decoder is scoped to checked binary position accessors, not arbitrary sparse/compressed/multi-primitive collision files. This article verifies the source contracts and does not claim Bepu or in-game execution.

## See also

- [Author collision shapes and inspect sampled coverage](../../../../mods/flexo/features/collider-authoring-and-coverage.md)
- [Read mesh-only collision atlases for convex hull previews](../../../../mods/flexo/features/convex-hull-atlas-import.md)
- [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../../validation/validate-asset-xml-references/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
