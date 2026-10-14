---
type: How-To
title: Compose static assets and export launch sites from a browser
description: Compose Core pieces with explicit collision scaling and export site-bearing body assets referenced by an alternate system
topic: place-static-objects-on-a-planet-surface
category: celestials
group: terrain
approach: 4
difficulty: advanced
prerequisites:
  - flexo-source
  - browser-catalog-assets
  - native-static-xml
demonstrated_by:
  - mods/flexo/features/static-object-composition
  - mods/flexo/features/launch-site-system-export
techniques:
  - xml-asset
  - template-composition
  - coordinate-adapter
  - reference-remapping
game_types:
  - KSA.StaticObjectTemplate
  - KSA.LocationReference
  - KSA.StaticObject
  - KSA.SystemTemplate
  - KSA.LandmarkReference
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - celestials
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
  - id: source-game-current-decomp-ksa-staticobjecttemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObjectTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs
    title: current/decomp/KSA/StaticObjectTemplate.cs
  - id: source-game-current-decomp-ksa-staticobject-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObject.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs
    title: current/decomp/KSA/StaticObject.cs
  - id: source-game-current-decomp-ksa-systemtemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: current/decomp/KSA/SystemTemplate.cs
  - id: source-flexo-apps-icrp-src-three-basis-ts
    repo: flexo
    path: apps/icrp/src/three/basis.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/three/basis.ts
    title: apps/icrp/src/three/basis.ts
  - id: source-game-current-decomp-ksa-locationreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LocationReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LocationReference.cs
    title: current/decomp/KSA/LocationReference.cs
  - id: source-flexo-apps-icrp-src-ksa-modplan-ts
    repo: flexo
    path: apps/icrp/src/ksa/modPlan.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts
    title: apps/icrp/src/ksa/modPlan.ts
  - id: source-flexo-apps-icrp-src-ksa-colliderscale-ts
    repo: flexo
    path: apps/icrp/src/ksa/colliderScale.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/colliderScale.ts
    title: apps/icrp/src/ksa/colliderScale.ts
  - id: source-flexo-src-ksa-collidersize-ts
    repo: flexo
    path: src/ksa/colliderSize.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts
    title: src/ksa/colliderSize.ts
  - id: source-flexo-apps-icrp-src-ksa-staticxmlserializer-ts
    repo: flexo
    path: apps/icrp/src/ksa/staticXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/staticXmlSerializer.ts
    title: apps/icrp/src/ksa/staticXmlSerializer.ts
  - id: source-flexo-apps-icrp-src-ksa-landmarkxml-ts
    repo: flexo
    path: apps/icrp/src/ksa/landmarkXml.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/landmarkXml.ts
    title: apps/icrp/src/ksa/landmarkXml.ts
  - id: source-flexo-apps-icrp-src-ksa-systemxml-ts
    repo: flexo
    path: apps/icrp/src/ksa/systemXml.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts
    title: apps/icrp/src/ksa/systemXml.ts
---

Use Flexo’s ICRP application when you want to author a static structure and its launch sites without writing a runtime placement plugin. Start with a catalog of Core static pieces and vessel-derived pieces, plus the stock system and astronomical XML. The output is an asset mod and, in system mode, a selectable scenario.

## Background: how the game does it

KSA.StaticObjectTemplate holds placed SubObjects, models, colliders and three distance values; ApplyGameData appends geometry and replaces distances only when set. KSA.StaticObject.ResolveAll visits the global astronomical template lookup, while SystemTemplate owns a separate body lookup. A site-bearing body therefore needs the asset registration route demonstrated below.[^source-game-current-decomp-ksa-staticobjecttemplate-cs][^source-game-current-decomp-ksa-staticobject-cs][^source-game-current-decomp-ksa-systemtemplate-cs]

## Lifecycle and timing

Composition runs in tool:authoring and serialization in tool:build. Await the catalog and scenario corpus before planning export. The browser does not run KSA location resolution or collision. The game consumes the delivered assets later during its asset and scenario loading. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Keep saved transforms in the KSA static frame

Use one root conversion in the Three.js viewport. KSA local X is up, Y east and Z north; the browser root maps these to Y, X and negative Z. Do not write the display conversion back into document transforms.

```typescript
// apps/icrp/src/three/basis.ts L25-L45
export const KSA_STATIC_TO_THREE = new THREE.Matrix4().set(
  // three.x = ksa.y (east)
  0,
  1,
  0,
  0,
  // three.y = ksa.x (up)
  1,
  0,
  0,
  0,
  // three.z = −ksa.z (north is −Z in three)
  0,
  0,
  -1,
  0,
  0,
  0,
  0,
  1,
);
```

Compare the native frame in [current/decomp/KSA/LocationReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LocationReference.cs#L148-L177). Expected result: saved values round-trip unchanged while the viewport remains conventionally Y-up.

### 2. Plan references before producing declarations

Call buildModPlan with the project and piece index. Reuse existing Core static IDs; create namespaced StaticSubObjects for vessel-derived pieces. A missing piece or material is a preflight error.

```typescript
// apps/icrp/src/ksa/modPlan.ts L113-L132
// ... enclosing context omitted
    if (piece.origin === 'core-static') {
      instanceOf.set(pieceId, pieceId); // Core owns the declaration
      continue;
    }
    // Vessel-derived: declare a namespaced StaticSubObject referencing Core ids.
    const exportId = `icrp_${modId}_${pieceId}`;
    instanceOf.set(pieceId, exportId);
    if (!piece.materialId) {
      issues.push({
        severity: 'error',
        message: `Vessel piece '${pieceId}' has no material id — cannot export.`,
      });
      continue;
    }
    vesselPieces.push({
      id: exportId,
      meshId: piece.meshNodeName,
      materialId: piece.materialId,
      colliders: piece.colliders,
    });
// ... enclosing context omitted
```

The full gather and scale-variant plan is [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L83-L163). These new declarations still depend on Core mesh/material IDs; renaming the declaration does not copy its binary assets.

### 3. Bake collider scale separately from visual scale

For scaled placements with template colliders, mint or reuse a variant keyed by piece and scale. Preserve the visual mesh reference while baking scale into collider descriptions.

```typescript
// apps/icrp/src/ksa/modPlan.ts L145-L163
// ... enclosing context omitted
  const resolveInstanceOf = (pieceId: string, scale: Vec3Like): string => {
    const base = instanceOf.get(pieceId) ?? pieceId;
    const piece = pieceIndex.get(pieceId);
    if (!piece || piece.colliders.length === 0 || isUnitScale(scale)) return base;
    const key = scaleVariantKey(pieceId, scale);
    let variantId = scaleVariants.get(key);
    if (!variantId) {
      variantCounter++;
      variantId = `icrp_${modId}_v${variantCounter}_${pieceId.replace(/^Core/, '')}`;
      scaleVariants.set(key, variantId);
      vesselPieces.push({
        id: variantId,
        meshId: piece.meshNodeName,
        materialId: piece.materialId ?? '',
        terrain: piece.terrain,
        colliders: piece.colliders.map((c) => scaleCollider(c, scale)),
      });
    }
    return variantId;
// ... enclosing context omitted
```

The native collision loop applies position and rotation without visual scale ([current/decomp/KSA/StaticObject.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs#L175-L217)). Review [apps/icrp/src/ksa/colliderScale.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/colliderScale.ts#L34-L65) before promising geometric parity: rotated nonuniform scale becomes a uniform cube-root-of-volume approximation. [src/ksa/colliderSize.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/colliderSize.ts#L61-L96) normalizes spheres to the largest axis and cylinder/capsule radial sizes to the larger radial axis. Prefer uniform scale when exact collision shape matters.

### 4. Separate asset geometry from additive GameData

Serialize SubObject identity and transforms in the asset. Emit empty GroundOffset, SurfaceHeight and FootprintRadius there, with their authored values in StaticObjectGameData.

```typescript
// apps/icrp/src/ksa/staticXmlSerializer.ts L169-L184
// ... enclosing context omitted
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
// ... enclosing context omitted
```

The serializer and GameData complement are [apps/icrp/src/ksa/staticXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/staticXmlSerializer.ts#L152-L226). Choose system-mod for new structures/sites. The alternative extend-stock-pad mode targets the shared CoreLaunchPadA_Prefab_LaunchPadA ([apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L64-L75)), so its additive geometry affects every location using that template.

### 5. Create landmarks on globally registered cloned bodies

Make each landmark reference the exported StaticObject ID and use explicit latitude/longitude in degrees.

```typescript
// apps/icrp/src/ksa/landmarkXml.ts L45-L59
function appendLatLon(doc: Document, parent: Element, site: Site): void {
  parent.appendChild(el(doc, 'Latitude', { Degrees: degrees(site.latDeg) }));
  parent.appendChild(el(doc, 'Longitude', { Degrees: degrees(site.lonDeg) }));
}

/** Builds the site's `<Landmark>` row (plan P7.05; `IsLaunchPad` always true, L11). */
export function buildLandmarkElement(doc: Document, site: Site): Element {
  const landmark = el(doc, 'Landmark', {
    Id: site.landmarkId,
    IsLaunchPad: 'true',
    StaticObject: site.staticObjectId,
  });
  appendLatLon(doc, landmark, site);
  return landmark;
}
```

Clone the modified body into a separate Assets document, suffix its ID, and replace its scenario row with LoadFromLibrary. Carry Parent and HomeBody into the replacement:

```typescript
// apps/icrp/src/ksa/systemXml.ts L308-L320
// ... enclosing context omitted
    const replacement = doc.createElement('LoadFromLibrary');
    replacement.setAttribute('Id', newId);
    for (const name of ['Parent', 'HomeBody']) {
      const value = refEl?.getAttribute(name) ?? clone.getAttribute(name);
      if (value) replacement.setAttribute(name, value);
    }
    if (refEl) {
      system.insertBefore(replacement, refEl);
      system.removeChild(refEl);
      if (inline) inlineBodies.delete(bodyId);
    } else {
      system.appendChild(replacement);
    }
// ... enclosing context omitted
```

Use the rest of [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L233-L365) to redirect parent links and starting-vehicle bindings. [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L111-L183) rewrites relative texture paths and inserts or retargets landmarks. Absolute installation paths tie output to one machine; Core-relative paths rely on the expected neighboring layout.

## Complete example

The complete composition planner is [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L83-L163); the paired system/body delivery is [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L233-L365). Inspect the exported manifest, StaticObject declarations, separate GameData, body Assets and scenario LoadFromLibrary rows. Then select the generated scenario in KSA and check location, launch-pad selection, terrain clearance and collision. This article did not execute that game check.

## Variations and gotchas

A browser preview cannot establish terrain contact or collision response. Nonuniform scale can approximate a collider even when the mesh looks exact. A body clone snapshots stock settings and requires review after game updates. Optional terrain decals are separate authored terrain modifications; inspect their coordinates and height conventions against the target build. Extending a stock template is global to its users, whereas exporting a scenario requires selecting that scenario.

## See also

- [Topic overview](overview.md)
- [IsLaunchPad landmarks added at StarMapAllModsLoaded and a render-data postfix for culled objects](place-static-objects-on-a-planet-surface-1.md)
- [GroundAnchor composed each frame into a camera-relative matrix](place-static-objects-on-a-planet-surface-2.md)
- [Course frame anchored at the kitten and saved as latitude, longitude, heading and floor height](place-static-objects-on-a-planet-surface-3.md)
- [Static-object composition](../../../../mods/flexo/features/static-object-composition.md)
- [Launch-site system export](../../../../mods/flexo/features/launch-site-system-export.md)
- [Keep grass, rocks and trees off a custom site, and replace or preserve a planet's ground clutter](../exclude-or-replace-ground-clutter/overview.md)
- [Add terrain decals from code and flatten or dig the ground under a custom site](../add-terrain-decals-and-dig-a-site/overview.md)
- [Add mod-owned static colliders that vessels and kittens collide with](../../../physics/colliders/add-static-colliders-to-physics-bubbles/overview.md)
- [Sample terrain and pad surfaces under each wheel](../../../physics/aero-and-ground/sample-the-ground-under-each-wheel/overview.md)
- [Build a moving platform or elevator kittens can ride](../../../physics/colliders/build-a-moving-platform-kittens-can-ride/overview.md)
- [Query the terrain height field and test line of sight across terrain](../query-terrain-height-and-line-of-sight/overview.md)
- [Draw your own meshes through the engine's mesh renderers](../../../rendering/meshes/draw-mod-meshes-with-the-engine-renderers/overview.md)
- [Choose a render frame and anchor effects to bodies, parts and terrain](../../../rendering/overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- [Anchor points to a rotating body and pick bodies and orbit lines under the cursor](../../../flight-and-orbits/map-view/anchor-and-pick-points-on-bodies/overview.md)
- [Ray cast against part meshes and terrain, from the cursor or any origin](../../../physics/mod-simulation/ray-cast-against-vessel-meshes-and-terrain/overview.md)

[^source-game-current-decomp-ksa-staticobjecttemplate-cs]: [current/decomp/KSA/StaticObjectTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObjectTemplate.cs#L7-L89)
[^source-game-current-decomp-ksa-staticobject-cs]: [current/decomp/KSA/StaticObject.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs#L47-L79)
[^source-game-current-decomp-ksa-systemtemplate-cs]: [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L9-L95)
