---
type: Mod Feature
title: Author part and SubPart cast lights
description: Serialize native point and spot lights with owner-aware transforms and explicit preview diagnostics
mod: flexo
category: rendering
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
game_types:
  - KSA.LightModule
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:11Z
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
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
  - id: flexo-src-ksa-lightvalidation
    repo: flexo
    path: src/ksa/lightValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts
    title: src/ksa/lightValidation.ts
  - id: ksa-current-decomp-ksa-lightmodule
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LightModule.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs
    title: current/decomp/KSA/LightModule.cs
---

A glowing material and a cast light are separate authored mechanisms. Flexo provides point and spot Light data at part scope or shared SubPart-template scope.

## How it works

Every light receives a stable emitted ID, its type, position and rotation, range, intensity and RGB color; spotlights also carry inner and outer angles. Optional ray-tracing and IVA flags are serialized explicitly. A template-owned light appears for each placement of that template. The viewport converts offsets through the owner transform, while diagnostics explain cases where its quaternion-based direction preview differs from the game’s matrix transform. The same issue model warns about nonpositive range or intensity, swapped cone angles and unplaced owners.[^flexo-src-ksa-partxmlserializer][^flexo-src-three-coords][^flexo-src-ksa-lightvalidation]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L714-L753) | Native light XML fields and identity |
| [src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L154-L221) | Owner-relative light transforms |
| [src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L80-L206) | Range, cone, owner and switch diagnostics |

## Snippets

```typescript
// src/ksa/partXmlSerializer.ts L714-L727
function buildLightElement(doc: XmlDocument, light: PartLight): XmlElement {
  const el = doc.createElement('Light');
  el.setAttribute('Id', light.ksaId ?? light.id);
  const type = doc.createElement('Type');
  type.appendChild(doc.createTextNode(light.type));
  el.appendChild(type);

  // Only Position + Rotation are meaningful to KSA lights; never emit Scale.
  const transform = buildTransformElement(doc, {
    position: light.position,
    rotation: light.rotation,
    scale: { x: 1, y: 1, z: 1 },
  });
  if (transform) el.appendChild(transform);
```

## Game APIs touched

KSA.LightModule.TemplateData declares light type, transform, range, intensity and flags.[^ksa-current-decomp-ksa-lightmodule]

KSA.LightModule.UpdateRenderData transforms the local +X spotlight aim through the owner matrix.[^ksa-current-decomp-ksa-lightmodule]

## Pitfalls and version notes

Nonuniform or negative owner scales can skew or reverse the game’s beam relative to the browser marker. A preview cone is not a photometric validation. Template lights share edits across placements. Source comments referring to older light-switch line numbers are not authoritative for this game build; the current runtime reads IsActive and the owner transform in UpdateRenderData.

## See also

- [emissive paint and ramp baking](emissive-paint-and-ramp-baking.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [isolated subpart variants](isolated-subpart-variants.md)
- [Author native cast lights with validated local frames and falloff](../../../howto/rendering/lights-and-particles/add-dynamic-lights-to-the-world/add-dynamic-lights-to-the-world-4.md) - how-to article demonstrating this feature

[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L714-L753)
[^flexo-src-three-coords]: [src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L154-L221)
[^flexo-src-ksa-lightvalidation]: [src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L80-L206)
[^ksa-current-decomp-ksa-lightmodule]: [current/decomp/KSA/LightModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs#L101-L128)
