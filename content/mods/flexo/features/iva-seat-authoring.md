---
type: Mod Feature
title: Author IVA seats and interior visibility
description: Convert editable seat rotations into explicit camera axes and preserve reversible interior-export choices
mod: flexo
category: camera
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - coordinate-conversion
game_types:
  - KSA.IVASeat
  - KSA.Vector3Reference
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
  - id: flexo-src-ksa-ivaseataxes
    repo: flexo
    path: src/ksa/ivaSeatAxes.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts
    title: src/ksa/ivaSeatAxes.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
  - id: ksa-current-decomp-ksa-ivaseat
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IVASeat.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs
    title: current/decomp/KSA/IVASeat.cs
  - id: ksa-current-decomp-ksa-vector3reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vector3Reference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs
    title: current/decomp/KSA/Vector3Reference.cs
---

Flexo makes part-level interior camera seats editable as positions and rotations. Export converts each seat into the axis vectors KSA expects, while keeping editor-only identity separate from an authored seat ID.

## How it works

The canonical seat basis is forward +X and up −Z. Quaternion conversion maps this basis to and from the editor rotation; degenerate imported axis pairs can be rejected rather than becoming invalid camera frames. Serialization writes all three axes of Position, ForwardAxis and UpAxis, and emits an ID only when the user supplied one. Dedicated editing covers part-level seats; SubPart-level seat XML remains preserved through the unknown-child route.[^flexo-src-ksa-ivaseataxes][^flexo-src-ksa-partxmlserializer][^flexo-src-ksa-partxmlparser]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L24-L108) | Seat basis and quaternion conversion |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L530-L560) | Explicit seat axes and user-authored identity |
| [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1013-L1038) | SubPart-seat passthrough boundary |

## Snippets

```typescript
// src/ksa/partXmlSerializer.ts L553-L560
function buildIvaSeatElement(doc: XmlDocument, seat: IvaSeat): XmlElement {
  const el = doc.createElement('IVASeat');
  if (seat.ksaId) el.setAttribute('Id', seat.ksaId);
  const { forward, up } = seatAxesFromRotation(seat.rotation);
  el.appendChild(buildVec3Attrs(doc, 'Position', seat.position));
  el.appendChild(buildVec3Attrs(doc, 'ForwardAxis', forward));
  el.appendChild(buildVec3Attrs(doc, 'UpAxis', up));
  return el;
```

## Game APIs touched

KSA.IVASeat.IVASeatTemplate defaults forward to +X and up to -Z.[^ksa-current-decomp-ksa-ivaseat]

KSA.Vector3Reference gives missing attributes zero values.[^ksa-current-decomp-ksa-vector3reference]

## Pitfalls and version notes

The browser seat view is a framing aid, not KSA’s IVA controller or a seated-character simulation. Omitted vector elements and omitted attributes have different defaults: an empty ForwardAxis is a zero direction. Preserve authored seat IDs when linking hatches. Interior visibility and IVA suppression are export choices; game XML is not an editable project backup.

## See also

- [isolated subpart variants](isolated-subpart-variants.md)
- [schema aware gamedata roundtrip](schema-aware-gamedata-roundtrip.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [Author IVA seats and validate their transforms before exporting XML](../../../howto/vehicles-and-parts/parts/add-crew-seats-and-eva-doors/add-crew-seats-and-eva-doors-3.md) - how-to article demonstrating this feature

[^flexo-src-ksa-ivaseataxes]: [src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L24-L108)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L530-L560)
[^flexo-src-ksa-partxmlparser]: [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1013-L1038)
[^ksa-current-decomp-ksa-ivaseat]: [current/decomp/KSA/IVASeat.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs#L7-L25)
[^ksa-current-decomp-ksa-vector3reference]: [current/decomp/KSA/Vector3Reference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs#L8-L17)
