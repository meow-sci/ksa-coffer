---
type: Mod Feature
title: Static-object composition
description: Compose built-in static and vessel pieces into native StaticObject assets with scaled collider variants and separate GameData
mod: flexo
category: assets
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - template-composition
  - coordinate-adapter
game_types:
  - KSA.StaticObjectTemplate
  - KSA.LocationReference
  - KSA.StaticObject
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
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
  - id: flexo-apps-icrp-src-ksa-modplan
    repo: flexo
    path: apps/icrp/src/ksa/modPlan.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts
    title: apps/icrp/src/ksa/modPlan.ts
  - id: flexo-apps-icrp-src-ksa-staticxmlserializer
    repo: flexo
    path: apps/icrp/src/ksa/staticXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/staticXmlSerializer.ts
    title: apps/icrp/src/ksa/staticXmlSerializer.ts
  - id: flexo-apps-icrp-src-three-basis
    repo: flexo
    path: apps/icrp/src/three/basis.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/three/basis.ts
    title: apps/icrp/src/three/basis.ts
  - id: ksa-current-decomp-ksa-staticobjecttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObjectTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs
    title: current/decomp/KSA/StaticObjectTemplate.cs
  - id: ksa-current-decomp-ksa-locationreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LocationReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LocationReference.cs
    title: current/decomp/KSA/LocationReference.cs
  - id: flexo-static-collider-scale
    repo: flexo
    path: apps/icrp/src/ksa/colliderScale.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/colliderScale.ts
    title: apps/icrp/src/ksa/colliderScale.ts
  - id: flexo-collider-size
    repo: flexo
    path: src/ksa/colliderSize.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts
    title: src/ksa/colliderSize.ts
  - id: ksa-static-collision
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObject.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs
    title: current/decomp/KSA/StaticObject.cs
---

The ICRP mini application composes static structures from existing KSA pieces. It exports native asset XML rather than running a placement plugin in the game.

## How it works

The planner gathers the pieces used by all authored objects. Core static pieces retain their existing IDs. Vessel-derived pieces become namespaced StaticSubObject declarations whose PartModel references existing mesh and material IDs. A missing catalog piece or required material produces a preflight error.

Scaled placements with template colliders receive a deduplicated variant keyed by source piece and scale; the variant retains the source mesh/material and bakes scale into collider descriptions. StaticObject declarations contain SubObject placements, transforms and optional colliders. Ground offset, surface height and footprint radius are emitted in separate StaticObjectGameData rather than duplicating those authored values in the asset declaration.

The preview applies one root matrix mapping KSA local X to browser Y, KSA Y to browser X and KSA Z to browser negative Z. Saved transforms stay in KSA coordinates. This prevents the display convention from leaking into serialized asset data.[^flexo-apps-icrp-src-ksa-modplan][^flexo-apps-icrp-src-ksa-staticxmlserializer][^flexo-apps-icrp-src-three-basis]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L83-L163) | Reuse Core pieces and declare namespaced vessel-derived and scaled variants |
| [apps/icrp/src/ksa/staticXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/staticXmlSerializer.ts#L152-L226) | Static asset declarations and additive GameData serialization |
| [apps/icrp/src/three/basis.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/three/basis.ts#L20-L64) | Single root conversion between KSA and Three.js static frames |

## Snippets

```typescript
// apps/icrp/src/ksa/staticXmlSerializer.ts L169-L184
function buildObject(doc: XmlDocument, o: StaticObjectPlan): XmlElement {
  const obj = el(doc, 'StaticObject', { Id: o.id });
  for (const p of o.placements) {
    const sub = el(doc, 'SubObject', { Id: p.instanceId, InstanceOf: p.instanceOf });
    const transform = buildTransformElement(doc, p.transform);
    if (transform) sub.appendChild(transform);
    obj.appendChild(sub);
  }
  if (o.colliders && o.colliders.length > 0) {
    obj.appendChild(buildStaticColliderElement(doc, o.colliders));
  }
  // The bundler always emits the three distance elements EMPTY on the asset
  // (all-NaN = unset); the values live in GameData — the Core split (F10/F13).
  obj.appendChild(doc.createElement('GroundOffset'));
  obj.appendChild(doc.createElement('SurfaceHeight'));
  obj.appendChild(doc.createElement('FootprintRadius'));
```

## Game APIs touched

KSA.StaticObjectTemplate stores geometry and distances; ApplyGameData appends geometry and replaces set distances.[^ksa-current-decomp-ksa-staticobjecttemplate]

KSA.LocationReference constructs the local up/east/north assembly frame.[^ksa-current-decomp-ksa-locationreference]

## Pitfalls and version notes

The current planner principally reuses Core binary assets; namespaced declarations do not make those source meshes independent. Visual scale and collider scale need separate treatment. GameData appends placements and colliders, so reusing an existing object ID affects that shared template. A browser scene does not verify terrain contact or game collision response.

The game’s static collision builder applies placement position and rotation but does not apply its visual scale. ICRP compensates by baking collider positions and sizes, then creating template variants. A rotated collider under nonuniform scale uses the cube root of the absolute scale product as a uniform approximation; it cannot reproduce shear. Primitive normalization imposes further limits: a sphere takes the largest axis, and cylinder/capsule diameters use the larger radial axis. Consequently, nonuniform scaling is not generally an exact collision transform even for an unrotated curved shape.[^flexo-static-collider-scale][^flexo-collider-size][^ksa-static-collision]

## See also

- [launch site system export](launch-site-system-export.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [collider authoring and coverage](collider-authoring-and-coverage.md)
- [Compose static assets and export launch sites from a browser](../../../howto/celestials/terrain/place-static-objects-on-a-planet-surface/place-static-objects-on-a-planet-surface-4.md) - how-to article demonstrating this feature

[^flexo-apps-icrp-src-ksa-modplan]: [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L83-L163)
[^flexo-apps-icrp-src-ksa-staticxmlserializer]: [apps/icrp/src/ksa/staticXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/staticXmlSerializer.ts#L152-L226)
[^flexo-apps-icrp-src-three-basis]: [apps/icrp/src/three/basis.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/three/basis.ts#L20-L64)
[^ksa-current-decomp-ksa-staticobjecttemplate]: [current/decomp/KSA/StaticObjectTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs#L7-L89)
[^ksa-current-decomp-ksa-locationreference]: [current/decomp/KSA/LocationReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LocationReference.cs#L148-L177)

[^flexo-static-collider-scale]: [apps/icrp/src/ksa/colliderScale.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/colliderScale.ts#L34-L65)

[^flexo-collider-size]: [src/ksa/colliderSize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts#L61-L96)

[^ksa-static-collision]: [current/decomp/KSA/StaticObject.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs#L175-L217)
