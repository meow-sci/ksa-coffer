---
type: How-To
title: Author IVA seats and validate their transforms before exporting XML
description: Author part-level IVA camera seats with explicit axis vectors and preserve game-facing IDs when
  connecting a hatch
topic: add-crew-seats-and-eva-doors
category: vehicles-and-parts
group: parts
approach: 3
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/iva-seat-authoring
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
tags:
  - flexo
  - asset-authoring
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:59:00Z
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
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
---

Use the browser authoring route to position interior camera seats and emit native IVASeat data. Flexo exposes position and rotation while its serializer supplies the axis vectors the game expects. Door definitions remain a separate module; the other approaches in this topic show complete seat-and-door XML.

## Background: how the game does it

IVASeat.IVASeatTemplate declares position plus default forward +X and up −Z in [current/decomp/KSA/IVASeat.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IVASeat.cs#L7-L25). Each Vector3Reference attribute defaults to zero in [current/decomp/KSA/Vector3Reference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vector3Reference.cs#L8-L17). An omitted axis element can use the field default, but an empty present element is a zero vector.

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Create a seat with an editor identity and unit scale

Keep document identity separate from the optional exported KSA ID. Add seats through a discrete undoable action, at the authored position and rotation, with scale pinned to one. A newly created seat need not occupy the game component-ID namespace before it is referenced.

```typescript
// src/state/editorStore.ts L1416-L1433
export function addIvaSeat(transform?: PlacementTransform): void {
  const current = $part.get();
  const newId = nextIvaSeatId(current);
  pushUndo('add IVA seat', newId);
  const part = clone(current);
  part.ivaSeats.push({
    id: newId,
    // A brand-new seat has no KSA id until the user gives it one (an <EVADoor SeatId> pick
    // authors it) — flexo never auto-fills the feed-container id namespace.
    ksaId: null,
    position: transform ? { ...transform.position } : { x: 0, y: 0, z: 0 },
    rotation: transform ? { ...transform.rotation } : { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    layerId: IVA_SEAT_LAYER_ID,
  });
  $part.set(part);
  select([{ kind: 'ivaSeat', id: newId }]);
}
```

[src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L1416-L1433)

### 2. Convert between rotations and a valid seat basis

Rotate the canonical forward +X and up −Z vectors using the KSA Euler quaternion convention. On import, reject zero or parallel axis pairs before deriving a rotation; orthonormalize a usable pair. Use the same conversion for aiming and export.

```typescript
// src/ksa/ivaSeatAxes.ts L78-L82
/** The seat's `<ForwardAxis>` + `<UpAxis>` for a stored rotation. Both come out UNIT length. */
export function seatAxesFromRotation(rotation: EulerXYZ): { forward: Vec3; up: Vec3 } {
  const q = ksaQuatFromEulerXyz(rotation);
  return { forward: rotate(SEAT_LOCAL_FORWARD, q), up: rotate(SEAT_LOCAL_UP, q) };
}
```

[src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L78-L82)

Import rejection and orthonormalization are implemented in [src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L93-L108). The parser drops a degenerate seat and emits a console warning; inspect the resulting seat count and any door reference after importing. [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L323-L352)

### 3. Keep order and hatch references deliberate

Store seat order in the document and reorder by moving the entry, preserving stable selection identity. When a hatch selects a seat, author or retain its game-facing ID rather than writing the editor-only ID. Keep the hatch relationship in the authored GameData; do not infer it from proximity in the viewport.

```typescript
// src/state/editorStore.ts L1479-L1490
export function moveIvaSeat(index: number, delta: number): void {
  const current = $part.get();
  const seat = current.ivaSeats[index];
  if (!seat) return;
  const target = Math.min(current.ivaSeats.length - 1, Math.max(0, index + delta));
  if (target === index) return;
  pushUndo('reorder IVA seat', `${seat.id} → ${target + 1}`);
  const part = clone(current);
  const [moved] = part.ivaSeats.splice(index, 1);
  part.ivaSeats.splice(target, 0, moved);
  $part.set(part);
  // No selection fix-up: seat ids are stable across a reorder, so the refs already
```

[src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L1479-L1490)

Seat-reference authoring is in [src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L3596-L3618).

### 4. Emit all three components of every seat vector

Write Position, ForwardAxis and UpAxis explicitly. Emit Id only for a deliberate ksaId. This avoids a serializer that turns a default direction into an empty element and changes its meaning.

```typescript
// src/ksa/partXmlSerializer.ts L553-L561
function buildIvaSeatElement(doc: XmlDocument, seat: IvaSeat): XmlElement {
  const el = doc.createElement('IVASeat');
  if (seat.ksaId) el.setAttribute('Id', seat.ksaId);
  const { forward, up } = seatAxesFromRotation(seat.rotation);
  el.appendChild(buildVec3Attrs(doc, 'Position', seat.position));
  el.appendChild(buildVec3Attrs(doc, 'ForwardAxis', forward));
  el.appendChild(buildVec3Attrs(doc, 'UpAxis', up));
  return el;
}
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L553-L561)

### 5. Preserve the boundary between edited seats and passthrough data

The dedicated editor handles part-level seats. Keep SubPart seat nodes in preserved GameData until a complete scoped editor exists. IVA suppression should omit the relevant exported data without deleting the project’s seats or interior authoring choices. [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1013-L1038)

```typescript
// src/state/editorStore.ts L2840-L2845
export function setIvaEnabled(enabled: boolean): void {
  if ($part.get().gameData.ivaEnabled === enabled) return;
  commitGameData('IVA mode', enabled ? 'on' : 'off', (g) => {
    g.ivaEnabled = enabled;
  });
}
```

[src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L2840-L2845)

## Complete example

Follow [src/ksa/ivaSeatAxes.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/ivaSeatAxes.ts#L24-L108) and [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L530-L561). Author a forward-facing seat at a known interior point, rotate it in two axes, inspect its three complete vectors, and preserve its ID while linking an existing door. Compare native seating and IVA after loading the package.

## Variations and gotchas

The browser seat view is a framing aid. It does not reproduce KSA’s camera controller, boarding reach, seated character animation or EVA transition. Part-level authored seats and preserved SubPart seats have different editor support. Game XML is a delivery artifact; retain the project archive for future editing.

## See also

- [IVASeat in PartGameData plus EVADoor on a hidden subpart](add-crew-seats-and-eva-doors-1.md)
- [Seat and door for furniture](add-crew-seats-and-eva-doors-2.md)
- [Author IVA seats and interior visibility](../../../../mods/flexo/features/iva-seat-authoring.md)
- [Define a part with its own game data and GLB model](../define-a-part-with-game-data/overview.md)
- [Spawn an EVA kitten from code](../../../kittens/characters/spawn-an-eva-kitten-from-code/overview.md)
- [Take control of another vehicle: switch the controlled craft or autopilot it from a mod](../../vehicles/take-control-of-another-vehicle/overview.md)
- [Animate seated kittens, draw them on unflown craft and fly another craft from a chair](../../../kittens/animation/animate-and-draw-seated-kitten-crew/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
