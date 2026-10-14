---
type: Mod Feature
title: Author collision shapes and inspect sampled coverage
description: Normalize collision data by owner and measure where analytic or convex hull shapes leave visual geometry uncovered
mod: flexo
category: physics
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - geometry-validation
game_types:
  - KSA.ColliderTemplate
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:31:29Z
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
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
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
  - id: ksa-current-decomp-ksa-collidertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ColliderTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs
    title: current/decomp/KSA/ColliderTemplate.cs
---

Flexo treats collision as authored data rather than assuming the visible mesh is the collision shape. Shapes can belong to the full part or a SubPart template, and a separate coverage pass helps inspect the approximation.

## How it works

The serializer groups shapes by owner and emits Box, Sphere, Cylinder, Capsule or ConvexHull children under a Collider component. Frame vectors always contain all three axes; every applicable physical dimension is emitted. Validation catches non-finite or degenerate sizes, missing hull mesh IDs and conflicts between collider component IDs and tank IDs. The coverage evaluator transforms sample points into each shape frame, tests containment, reports uncovered points, and compares summed collider volume with the mesh bounds volume.[^flexo-src-ksa-partxmlserializer][^flexo-src-ksa-collidervalidation][^flexo-src-measure-collidercoverage]

## Lifecycle and timing

Editing and diagnostics run in the browser. Coverage is explicitly requested instead of recalculated on every render frame. Export serializes the current shapes; KSA later constructs its own collision objects from the generated asset data.

## Key code

| Source | Role |
|---|---|
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L493-L535) | Collider frame and dimension emission |
| [src/ksa/colliderValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts#L37-L154) | Degenerate dimensions, scope and identity diagnostics |
| [src/measure/colliderCoverage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts#L23-L165) | Point containment and volume-based coverage measures |

## Snippets

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

## Game APIs touched

KSA.ColliderTemplate declares assembly location and rotation.[^ksa-current-decomp-ksa-collidertemplate]

KSA.ColliderTemplate.ComputeAuthoredLocationPartAsmb includes a shape offset.[^ksa-current-decomp-ksa-collidertemplate]

## Pitfalls and version notes

Coverage depends on the sample set and is not proof of continuous collision coverage. Summed volumes count overlaps more than once, so the bloat ratio is a diagnostic clue rather than a strict pass/fail rule. Preview geometry does not execute Bepu physics. The editor warns about scaled owning placements; visual scaling must not be assumed to rescale all collider semantics.

## See also

- [convex hull atlas import](convex-hull-atlas-import.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [static object composition](static-object-composition.md)
- [Author part colliders and convex-hull assets](../../../howto/assets/asset-xml/author-part-colliders-and-convex-hulls/author-part-colliders-and-convex-hulls.md) - how-to article demonstrating this feature

[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L493-L535)
[^flexo-src-ksa-collidervalidation]: [src/ksa/colliderValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderValidation.ts#L37-L154)
[^flexo-src-measure-collidercoverage]: [src/measure/colliderCoverage.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/measure/colliderCoverage.ts#L23-L165)
[^ksa-current-decomp-ksa-collidertemplate]: [current/decomp/KSA/ColliderTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ColliderTemplate.cs#L68-L79)
