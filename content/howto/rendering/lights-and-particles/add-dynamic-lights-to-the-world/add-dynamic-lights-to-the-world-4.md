---
type: How-To
title: Author native cast lights with validated local frames and falloff
description: Author native point and spot Light modules with explicit owner frames, positive falloff values
  and valid cone angles
topic: add-dynamic-lights-to-the-world
category: rendering
group: lights-and-particles
approach: 4
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/cast-light-authoring
techniques:
  - xml-asset
game_types:
  - KSA.LightModule
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
  - id: ksa-current-decomp-ksa-lightmodule
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LightModule.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs
    title: current/decomp/KSA/LightModule.cs
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-ksa-lightvalidation
    repo: flexo
    path: src/ksa/lightValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts
    title: src/ksa/lightValidation.ts
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
  - id: ksa-current-decomp-ksa-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: current/decomp/KSA/Part.cs
---

Use native Light data when a part needs a lamp that follows its owner without custom per-frame code. Flexo authors Point and Spot modules at part scope or shared SubPart-template scope, validates their local data, and exports them with the asset-only mod.

## Background: how the game does it

KSA.LightModule.TemplateData declares type, transform, range, intensity, color and optional flags in [current/decomp/KSA/LightModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs#L11-L52). Its UpdateRenderData checks activation and IVA state, transforms the position through the owning part matrix, and derives a spotlight direction from local +X through rotation and that matrix in [current/decomp/KSA/LightModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs#L101-L141).

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Choose part scope or shared template scope

Use null ownership for one part-level light, or an explicit SubPart template owner when every placement should carry the lamp. Allocate identity in the document transaction and do not let imported seed fields overwrite it.

```typescript
// src/state/editorStore.ts L3070-L3087
export function addLight(ownerTemplateId: string | null, seed?: Partial<PartLight>): void {
  const current = $part.get();
  const newId = nextLightId(current);
  pushUndo('add light', newId);
  const part = clone(current);
  part.lights.push({
    ...createPartLight(ownerTemplateId, newId),
    ...seed,
    // Identity + layer are never seed-overridable: the id was just allocated, the owner
    // is the explicit argument, and a new light lands on the ACTIVE layer, like every
    // other ordinary layer citizen.
    id: newId,
    ownerTemplateId,
    layerId: currentLayerId(part),
  });
  $part.set(part);
  select([{ kind: 'light', id: newId }]);
}
```

[src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L3070-L3087)

### 2. Store only a local position and rotation

Aim a spot along its local +X axis and translate its source in the owner’s frame. Emit a transform with unit scale; light size belongs to Range, not Transform.Scale. Review the browser-to-owner conversion in [src/three/coords.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts#L154-L221).

```typescript
// src/ksa/partXmlSerializer.ts L721-L727
  // Only Position + Rotation are meaningful to KSA lights; never emit Scale.
  const transform = buildTransformElement(doc, {
    position: light.position,
    rotation: light.rotation,
    scale: { x: 1, y: 1, z: 1 },
  });
  if (transform) el.appendChild(transform);
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L721-L727)

### 3. Author positive range, intensity and color

Set range in meters, a positive intensity and explicit RGB channels. Keep these values distinct from a glowing material: a mask can make a surface emissive without casting this lamp. Inspect range/intensity diagnostics before exporting.

```typescript
// src/ksa/partXmlSerializer.ts L729-L736
  el.appendChild(elWithAttr(doc, 'Range', 'Value', formatG6(light.rangeM)));
  el.appendChild(elWithAttr(doc, 'Intensity', 'Value', formatG6(light.intensity)));

  const color = doc.createElement('Color');
  color.setAttribute('R', formatG6(light.color.r));
  color.setAttribute('G', formatG6(light.color.g));
  color.setAttribute('B', formatG6(light.color.b));
  el.appendChild(color);
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L729-L736)

### 4. Set spot cones and optional runtime flags explicitly

For a Spot, keep the inner angle at or below the outer angle and store radians. Emit RayTracing and DisableInIva only as intentional choices. With DisableInIva enabled, IsActive returns true regardless of the part light switch, then UpdateRenderData suppresses the light in an IVA viewport. With it disabled, the lamp follows the full part’s switch when one exists. [current/decomp/KSA/LightModule.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs#L64-L77)

```typescript
// src/ksa/partXmlSerializer.ts L738-L752
  if (light.type === 'Spot') {
    el.appendChild(elWithAttr(doc, 'InnerAngle', 'Value', formatG6(light.innerAngleRad)));
    el.appendChild(elWithAttr(doc, 'OuterAngle', 'Value', formatG6(light.outerAngleRad)));
  }

  if (light.rayTracing) {
    const rt = doc.createElement('RayTracing');
    rt.appendChild(doc.createTextNode('true'));
    el.appendChild(rt);
  }
  if (light.disableInIva) {
    const dii = doc.createElement('DisableInIva');
    dii.appendChild(doc.createTextNode('true'));
    el.appendChild(dii);
  }
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L738-L752)

To expose a player-controlled switch, author the part’s PowerConsumer with LightSwitch set to true, a deliberate LightIsActive default and Consumed in watts. Without a switch, the normal IsLightSwitchedOff check returns false, so this path does not turn the lamp off. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L296-L306) [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1461-L1471)

### 5. Review ownership and scale warnings before a native test

Run the shared validator after edits and before delivery; its light findings are advisory warnings or information, not an export gate. It checks cone ordering, empty owners, dark values and scaled-placement caveats. Nonuniform or mirrored owner scale can skew or reverse the game’s matrix-transformed beam relative to the browser quaternion marker.

```typescript
// src/ksa/lightValidation.ts L93-L101
    if (light.rangeM <= 0) {
      warn(
        light.id,
        'light-range-nonpositive',
        `Light "${light.id}" has Range ${light.rangeM} m. KSA culls Range ≤ 0 lights ` +
          `CPU-side before they reach the renderer (ClusteredLightSystem.cs:899,1083), so it ` +
          `never lights anything — give it a positive range.`,
      );
    }
```

[src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L93-L101)

Inspect the rest of the warning catalog in [src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L115-L206).

## Complete example

Use [src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L3070-L3087), [src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L80-L206) and [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L714-L753). Begin with a part-level Point light, then author one Spot at unit owner scale and compare its native beam to the authored +X marker. Add shared-template placements only after this reference case is correct.

## Variations and gotchas

This route relies on native module submission and game light switches, so it does not use the Harmony timing of sibling approaches. A cone overlay is not a photometric measurement or proof of shadows, ray tracing or brightness. The target renderer still governs light budgets and appearance. No native lighting or performance test was executed for this article.

## See also

- [Postfix PartTree.UpdateRenderData per craft with CreateSpotLight](add-dynamic-lights-to-the-world-1.md)
- [Per-viewport CreateLightInstance from an UpdateStaticObjectRenderData postfix, with a shadow-caster budget](add-dynamic-lights-to-the-world-2.md)
- [Push a point light through the public LightDebug list](add-dynamic-lights-to-the-world-3.md)
- [Author part and SubPart cast lights](../../../../mods/flexo/features/cast-light-authoring.md)
- [Make static objects cast sun and lamp shadows with invisible casters](../../meshes/add-invisible-shadow-casters/overview.md)
- [Control part lights from code: state, colour, intensity and beam angles](../control-part-light-color-and-state/overview.md)
- [Paint into or rescale the HDR scene with a compute pass shipped as a Shader asset](../../vulkan-passes/modify-the-hdr-scene-with-a-compute-pass/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
