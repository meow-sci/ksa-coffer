---
type: How-To
title: Compose and export native asset-only mods in a browser
description: Build a browser pipeline that composes built-in SubParts, preserves GameData, validates ownership
  and exports a native KSA mod
topic: author-native-asset-mods-in-a-browser
category: assets
group: asset-xml
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/native-asset-mod-export
  - mods/flexo/features/builtin-part-composition
  - mods/flexo/features/schema-aware-gamedata-roundtrip
  - mods/flexo/features/isolated-subpart-variants
  - mods/flexo/features/coordinate-transform-bridge
  - mods/flexo/features/connector-and-feed-authoring
  - mods/flexo/features/mass-and-resource-authoring
techniques:
  - xml-asset
  - toml-config
  - browser-file-system
  - asset-catalog
  - schema-passthrough
  - id-remapping
  - coordinate-conversion
game_types:
  - KSA.Mod
  - KSA.AssetBundle
  - KSA.PartTemplate
  - KSA.TransformReference
  - KSA.QuaternionEx
  - KSA.Vector3Reference
  - KSA.FeedsFromReference
  - KSA.ConsumerFeedWiring
  - KSA.AsmbVolumetricMassTemplate
  - KSA.Tank
  - KSA.BatteryTemplate
  - KSA.PowerConsumerTemplate
lifecycle:
  - tool:build
  - tool:authoring
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
  - id: ksa-current-decomp-ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: current/decomp/KSA/AssetBundle.cs
  - id: ksa-current-decomp-ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
  - id: ksa-current-decomp-ksa-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: current/decomp/KSA/Mod.cs
  - id: flexo-src-ksa-catalog
    repo: flexo
    path: src/ksa/catalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/catalog.ts
    title: src/ksa/catalog.ts
  - id: flexo-src-ksa-partcatalog
    repo: flexo
    path: src/ksa/partCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts
    title: src/ksa/partCatalog.ts
  - id: ksa-current-decomp-ksa-quaternionex
    repo: ksa-game-assemblies
    path: current/decomp/KSA/QuaternionEx.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/QuaternionEx.cs
    title: current/decomp/KSA/QuaternionEx.cs
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-transformreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TransformReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs
    title: current/decomp/KSA/TransformReference.cs
  - id: flexo-src-ksa-partxmlparser
    repo: flexo
    path: src/ksa/partXmlParser.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts
    title: src/ksa/partXmlParser.ts
  - id: flexo-src-ksa-assetsxmlserializer
    repo: flexo
    path: src/ksa/assetsXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts
    title: src/ksa/assetsXmlSerializer.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
  - id: flexo-src-state-feedtargets
    repo: flexo
    path: src/state/feedTargets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts
    title: src/state/feedTargets.ts
  - id: ksa-current-decomp-ksa-asmbvolumetricmasstemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AsmbVolumetricMassTemplate.cs
    title: current/decomp/KSA/AsmbVolumetricMassTemplate.cs
  - id: flexo-src-ksa-massdefinitions
    repo: flexo
    path: src/ksa/massDefinitions.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts
    title: src/ksa/massDefinitions.ts
  - id: ksa-current-decomp-ksa-tank
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Tank.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Tank.cs
    title: current/decomp/KSA/Tank.cs
  - id: ksa-current-decomp-ksa-batterytemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BatteryTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BatteryTemplate.cs
    title: current/decomp/KSA/BatteryTemplate.cs
  - id: ksa-current-decomp-ksa-powerconsumertemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PowerConsumerTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PowerConsumerTemplate.cs
    title: current/decomp/KSA/PowerConsumerTemplate.cs
---

Use this approach to build or extend an external part authoring tool without a runtime plugin. Flexo demonstrates the full path from existing Core pieces to Part XML, GameData and a downloadable native mod. You need a supported KSA catalog and familiarity with XML identifiers; custom geometry is optional.

## Background: how the game does it

KSA registers Part, SubPart, PartGameData and SubPartGameData through [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L38-L42). GameData is merged into its target template: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L265-L350) appends many module collections, so duplicating a component in geometry and GameData can change behavior. Native mod asset paths are loaded by [current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L157-L191).

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Resolve catalog templates before creating placements

Use the SubPart catalog to resolve mesh and material references, then create placements with separate instance IDs. Import a whole Part through the part catalog when its GameData, connectors and authored metadata must come along. Preserve new GameData-added placements; the current merge deliberately does not reapply arbitrary same-ID placement overlays. [src/ksa/catalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/catalog.ts#L183-L304)

```typescript
// src/ksa/partCatalog.ts L518-L527
      // GameData-ADDED placements (`ApplyOrAddSubPartInstance`: an Id matching no geometry
      // instance is appended). Normalised into the one placement list exactly like colliders —
      // flexo re-emits every placement in the geometry `<Part>`, which the game treats
      // identically. A matching Id is NOT re-applied: KSA would only overlay its Transform /
      // Gimbal / SolarTracker, and Core authors no such overlay with an InstanceOf.
      const placed = new Set(part.placements.map((p) => p.instanceId));
      for (const p of gd.subPartPlacements) {
        if (placed.has(p.instanceId)) continue;
        part.placements.push(p);
        placed.add(p.instanceId);
```

[src/ksa/partCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partCatalog.ts#L518-L527)

### 2. Keep transforms in the game coordinate convention

Store positions, Euler radians and scale in the document. Convert only at the Three.js boundary using the same order for gizmo read-back and display. Test a compound rotation, because single-axis examples cannot reveal a composition-order error. [current/decomp/KSA/QuaternionEx.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/QuaternionEx.cs#L178-L192)

```typescript
// src/three/coords.ts L27-L34
// KSA's Euler "XYZ" equals three.js 'ZYX' (opposite compose order) — see above.
const EULER_ORDER = 'ZYX' as const;

export function applyPlacement(obj: THREE.Object3D, p: Transform): void {
  obj.position.set(p.position.x, p.position.y, p.position.z);
  obj.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z, EULER_ORDER);
  obj.scale.set(p.scale.x, p.scale.y, p.scale.z);
}
```

[src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L27-L34)

When serializing scale, emit all three attributes or omit the entire unit-scale element. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1345-L1354) matches the absent-element versus zero-attribute distinction in [current/decomp/KSA/TransformReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransformReference.cs#L8-L53).

### 3. Keep unmodeled GameData beside typed fields

Separate known children from preserved recursive nodes. Add a child to the known set only after both its parser and serializer exist. Rebuild preserved elements at export and remap connector references when imported IDs change; do not describe this as byte-preserving XML storage. [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L971-L1062) [src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1178-L1203)

```typescript
// src/ksa/partXmlParser.ts L1045-L1054
function elementToRawNode(el: Element): RawXmlNode {
  const attrs: Record<string, string> = {};
  for (const attr of Array.from(el.attributes)) attrs[attr.name] = attr.value;
  const kids = childElements(el);
  const node: RawXmlNode = { tag: el.tagName, attrs, children: kids.map(elementToRawNode) };
  if (kids.length === 0) {
    const text = el.textContent?.trim();
    if (text) node.text = text;
  }
  return node;
```

[src/ksa/partXmlParser.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlParser.ts#L1045-L1054)

### 4. Isolate edited built-in templates

Before writing Part and GameData XML, derive a variant map for built-in templates with modified data, colliders, lights or interior visibility. Remap every affected reference through that same map. A fresh PartModel ID and inherited collider/mass information are required alongside the reused mesh/material. The variant is shared by all placements of that template within this part. [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L261-L323)

```typescript
// src/ksa/modExport.ts L382-L400
    out.set(templateId, {
      originalId: templateId,
      variantId: `flexo_${base}_${ns}_${templateId}`,
      meshId: entry.meshNodeName,
      materialId: entry.materialId,
      colliders: entry.colliders ?? [],
      massDefinitions: part.subPartGameData.some(
        (data) =>
          data.subPartTemplateId === templateId &&
          (data.massDefinitionsOverride ||
            data.unknownChildren.some((node) =>
              (MASS_SHAPES as readonly string[]).includes(node.tag),
            )),
      )
        ? []
        : (entry.data?.gameData?.massDefinitions ?? []),
      internal: wantInternal,
      rayTracing: entry.rayTracing ?? null,
      shadowCaster: entry.shadowCaster ?? null,
```

[src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L382-L400)

### 5. Address feeds through their actual owner instances

Author attachment transforms and connector flags separately from feed capability and consumer wiring. Give tanks and grain containers nonblank IDs. For a container on a SubPart, store its placement instance ID, not just its reusable template ID. Parent-fed consumers need matching ConsumerFeedWiring, with instance-specific wiring taking precedence over the unscoped fallback. [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L461-L527)

```typescript
// src/state/feedTargets.ts L47-L64
  };
  for (const t of part.gameData.tanks) push(t.id, null, 'part');
  for (const s of part.gameData.solidGrainSegments) push(s.id, null, 'part');
  // A SubPart's containers are addressed THROUGH the placement that carries them
  // (`<FeedsFrom SubPart=… Container=…>`), so one template placed twice yields two
  // distinct feed targets.
  for (const placement of part.placements) {
    const spd = part.subPartGameData.find(
      (s) => s.subPartTemplateId === placement.subPartTemplateId,
    );
    if (!spd) continue;
    for (const t of spd.tanks) push(t.id, placement.instanceId, placement.instanceId);
    for (const s of spd.solidGrainSegments) push(s.id, placement.instanceId, placement.instanceId);
  }
  return { connectorIds: part.connectors.map((c) => c.id), containers };
}

/** Every consumer this Part carries, part-level and on each placed SubPart. */
```

[src/state/feedTargets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts#L47-L64)

Use [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1275-L1292) for connector geometry and [src/state/feedTargets.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/feedTargets.ts#L118-L130) to surface unwired consumers before export.

### 6. Author physical mass and resource metadata explicitly

Choose CustomMass or an analytic solid/hollow mass definition and retain its dimensions, frame and mass source. Resolve material density first, explicit density second and direct mass last; leave missing material density unresolved. Keep tank geometry and power-module data in their owning GameData scope, rather than guessing them from the visual mesh. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L603-L713) [current/decomp/KSA/AsmbVolumetricMassTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AsmbVolumetricMassTemplate.cs#L6-L59)

```typescript
// src/ksa/massDefinitions.ts L292-L306
  const volume = massDefinitionVolumeM3(definition);
  if (!Number.isFinite(volume)) return null;
  let mass: number;
  if (definition.materialId) {
    const density = materialDensities.get(definition.materialId);
    if (density == null) return null;
    mass = density * volume;
  } else if (definition.densityKgM3 != null && definition.densityKgM3 > 0) {
    mass = definition.densityKgM3 * volume;
  } else if (definition.massKg != null && definition.massKg > 0) {
    mass = definition.massKg;
  } else {
    return null;
  }
  return Number.isFinite(mass) ? mass : null;
```

[src/ksa/massDefinitions.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/massDefinitions.ts#L292-L306)

For a tank, set its wrapper Id, shape, wall material, outer dimensions, wall thickness and assembly offset. Lengths and radii use meters; wall thickness uses millimeters. Set RoleAffinity for the intended consumer role and MagneticTrap only for that storage mode. The current authoring model does not serialize a chosen substance fill: native tank contents are separate runtime/save data. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L663-L700) [current/decomp/KSA/Tank.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Tank.cs#L30-L63)

Preserve battery capacity in Wh in the editor, then convert it to joules at export. Generators and solar panels emit Produced in watts; a power consumer emits Consumed in watts and can own the player’s light switch. Inspect those units in the XML before testing the resource network. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L283-L306) [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L649-L655)

```typescript
// src/ksa/partXmlSerializer.ts L283-L294
  for (const b of game.batteries) {
    const el = doc.createElement('Battery');
    // Model holds Wh; KSA's MaximumCapacity is an EnergyReference in joules (1 Wh = 3600 J).
    el.appendChild(elWithAttr(doc, 'MaximumCapacity', 'J', formatG6(b.capacityWh * 3600)));
    gd.appendChild(el);
  }
  for (const g of game.generators) {
    const el = doc.createElement('Generator');
    el.appendChild(elWithAttr(doc, 'Produced', 'W', formatG6(g.outputWatts)));
    gd.appendChild(el);
  }
  for (const sp of game.solarPanels) gd.appendChild(buildSolarPanelElement(doc, sp));
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L283-L294)

The native fields are defined by [current/decomp/KSA/BatteryTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BatteryTemplate.cs#L5-L16) and [current/decomp/KSA/PowerConsumerTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PowerConsumerTemplate.cs#L7-L24).

### 7. Create one export plan for preview and delivery

Build the augmented part and variant map once, then feed identical objects to XML preview, custom-asset generation and delivery. Reject two included parts whose sanitized namespaces collide. Emit one Part XML and one GameData XML containing all included parts, with an Assets XML only when declarations are needed.

```typescript
// src/ksa/modExport.ts L197-L220
    }
    seenNs.add(ns);
    // Layered 'glassGlow' visors expand into glass + inset-glow SubPart pairs; the augmented
    // part is what BOTH the serializers below and the bundle builder consume.
    const { part: expanded, insetIds } = expandGlassGlow(part);
    const variants = buildExportVariantMap(expanded, catalog, base, ns);
    perPart.push({
      entryId,
      name,
      ns,
      part: expanded,
      variants,
      remap: variantRemap(variants),
      insetIds,
    });
  }
  const entries = perPart.map(({ part, remap }) => ({ part, remap }));
  return {
    base,
    partFile: `${base}Part.xml`,
    partXml: serializePartsXml(entries),
    gameDataFile: `${base}GameData.xml`,
    gameDataXml: serializeGameDataXml(entries, base),
    perPart,
```

[src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L197-L220)

### 8. Package the manifest and inspect a clean output

List the emitted XML paths in mod.toml. Prefer a fresh ZIP when reviewing a package: folder delivery preserves old XML with numeric suffixes but can overwrite binary paths and list accumulated XML. Inspect the manifest, variant IDs, transforms and feed references before loading it in the target game.

```typescript
// src/ksa/modExport.ts L115-L119
/** Serializes mod.toml with the given asset filenames (matches KSA's format). */
export function serializeModToml(assets: string[]): string {
  const list = assets.length === 0 ? '[]' : `[ ${assets.map((a) => `"${a}"`).join(', ')}]`;
  return `name = "${MOD_NAME}"\nassets = ${list}\n`;
}
```

[src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L115-L119)

The two delivery paths are implemented in [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L1314-L1438).

## Complete example

The complete composition/export path is [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L181-L221), [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L121-L221) and [src/ksa/assetsXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/assetsXmlSerializer.ts#L174-L323). Start with one built-in SubPart, add one connector and explicit mass, then export and inspect the generated XML. Add custom geometry only after this minimal native package works in your target build.

## Variations and gotchas

The default emitted mod identity is flexo-parts; it is unrelated to the browser application’s identity. Core-only projects still depend on Core assets. Unknown XML preservation excludes original formatting, comments and mixed text. Partial Scale attributes, duplicated IDs and duplicated additive modules can survive a visual preview yet fail or change behavior in KSA. Source review verifies these implementation contracts; no generated package was installed or flight-tested for this article.

## See also

- [Native asset-only mod export from a browser](../../../../mods/flexo/features/native-asset-mod-export.md)
- [Assemble parts from the built-in SubPart catalog](../../../../mods/flexo/features/builtin-part-composition.md)
- [Preserve unmodeled GameData through structured XML passthrough](../../../../mods/flexo/features/schema-aware-gamedata-roundtrip.md)
- [Isolate customized built-in SubParts with export variants](../../../../mods/flexo/features/isolated-subpart-variants.md)
- [Bridge KSA transforms to a three.js editor](../../../../mods/flexo/features/coordinate-transform-bridge.md)
- [Author connectors and scoped resource feed wiring](../../../../mods/flexo/features/connector-and-feed-authoring.md)
- [Author mass shapes, tanks and power GameData](../../../../mods/flexo/features/mass-and-resource-authoring.md)
- [Understand when and in which order KSA loads mod XML](../mod-xml-load-order/overview.md)
- [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md)
- [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
