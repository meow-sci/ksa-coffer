---
type: Game Feature
title: Defining articulated subparts and animating or hiding them from code
description: How articulated SubParts use either runtime transform writes or authored native keyframe rigs
  with explicit instance identity and rest poses
topic: define-and-animate-subparts
category: vehicles-and-parts
group: parts
approaches: 5
game_types:
  - KSA.Part
  - KSA.SubPartTemplate
  - KSA.PartTree
  - KSA.PartTreeRenderData
  - KSA.PartInstance
  - KSA.Vehicle
  - KSA.KeyframeAnimationData
lifecycle:
  - startup:asset-load
  - frame:draw-ui
  - frame:after-on-frame
  - frame:celestials
  - frame:viewports
  - frame:render
  - tool:authoring
  - tool:build
demonstrated_by:
  - mods/ksacars/features/pose-subparts-at-runtime
  - mods/ksacars/features/car-part-assets-glb-pbr
  - mods/ksarmory/features/articulated-mount-subparts
  - mods/ksarmory/features/optical-director-heads
  - mods/ksarmory/features/rounds-as-hidden-launcher-subparts
  - mods/flexo/features/keyframe-animation-authoring
  - mods/flexo/features/animation-import-and-linear-baking
tags:
  - subpart
  - animation
  - transform
  - gimbal
  - hide
  - projectile
  - render
status: stable
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:00:07Z
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-parttemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: current/decomp/KSA/Part.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-parttreerenderdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTreeRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs
    title: current/decomp/KSA/PartTreeRenderData.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-vehicle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-current-decomp-ksa-keyframeanimationdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KeyframeAnimationData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs
    title: current/decomp/KSA/KeyframeAnimationData.cs
  - id: flexo-src-ksa-animationrig
    repo: flexo
    path: src/ksa/animationRig.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts
    title: src/ksa/animationRig.ts
  - id: flexo-src-ksa-easingfit
    repo: flexo
    path: src/ksa/easingFit.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts
    title: src/ksa/easingFit.ts
  - id: flexo-src-ksa-clipissues
    repo: flexo
    path: src/ksa/clipIssues.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/clipIssues.ts
    title: src/ksa/clipIssues.ts
  - id: flexo-src-state-partimport
    repo: flexo
    path: src/state/partImport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partImport.ts
    title: src/state/partImport.ts
  - id: flexo-src-ksa-animationimport
    repo: flexo
    path: src/ksa/animationImport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts
    title: src/ksa/animationImport.ts
  - id: flexo-src-ksa-exportanimationglb
    repo: flexo
    path: src/ksa/exportAnimationGlb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts
    title: src/ksa/exportAnimationGlb.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
---

KSA supports both code-driven SubPart transforms and native keyframe animation data. Use runtime writes for interactive wheels, turrets and projectiles; use an authored keyframe rig when the desired motion can be represented by the native animation module. Each moving member still needs a stable SubPart instance identity and a correctly authored pivot.

## Engine background

- **Subparts are Parts.** A `<SubPart Id InstanceOf>` under a `<Part>` is deserialised into
  `PartTemplate.SubPartInstances` (`[XmlElement("SubPart")]`), and the `Part` constructor builds one child `Part`
  per instance, applying its `<Transform>` [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L19-L20)[^ksa-parttemplate] [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1517-L1525)[^ksa-part].
  `Part.SubParts` lists them [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1127).
- **The transform.** `PositionParentAsmb`, `Asmb2ParentAsmb` (rotation) and `Scale` are public properties; each
  setter calls `ResetCachedPosMatrixValues()` [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L756-L781) [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L819-L830). That method clears
  the part's cached matrices and calls `Tree?.RenderData.InvalidateTransforms()`
  [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1241-L1249), which sets `_transformsDirty` [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L318-L321)[^ksa-parttreerenderdata]; the next
  render-data build repacks every batch slot from the matrices (`RewriteTransforms`)
  [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L755). The explicit reset after a write is redundant on this build for the three
  setters, but it is needed for **descendants**: a sub-part's cached matrices derive from its parent's, and the
  parent's setter does not invalidate theirs.
- **The matrix.** A subpart's transform to its parent is `Scale * rotation * translation`, composed up the
  `PartParent` chain [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1231-L1239). Rotation is about the subpart's own origin, so meshes are
  exported recentred on their pivot.
- **`Id` at runtime.** `Part.Id` is the instance Id from the `<Part>`, falling back to the template Id only if
  the instance has none (`ResolveRuntimeId`) [current/decomp/KSA/Part.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs#L1485-L1488). Look bodies up by instance Id.
- **Hide.** There is no draw switch for a subpart; scaling to 0.001 (or parking it in the hull) hides it.
  `Vehicle.UpdateRenderData` builds only when the craft is large enough on screen
  [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L3713-L3726)[^ksa-vehicle].

The native route uses instance-named leaves beneath animated joint nodes. Flexo exports a KeyframeAnimationModule and GLB channels, translating its editor rest-anchor and easing metadata into native geometry and samples. Import can approximate or lose unsupported motion, including the current scale-only dense-track fitter limitation. [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L266-L348) [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L101-L126)

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: wheels, arms and blades from `StarMapAfterGui`](define-and-animate-subparts-1.md) | KSACars | `starmap-lifecycle`, `xml-asset` | `startup:asset-load`, `frame:draw-ui`, `frame:after-on-frame`, `frame:render` | author the subparts, pose them each frame, dual-hook with a frame latch |
| [2: articulated turret mounts](define-and-animate-subparts-2.md) | KSArmory | `subpart-transform-write`, `xml-asset` | `startup:asset-load`, `frame:draw-ui`, `frame:celestials`, `frame:render` | rate-limited drives, sibling chains composed in code, per-channel refusal latch |
| [3: roll-nod optical gimbals](define-and-animate-subparts-3.md) | KSArmory | `gimbal-geometry`, `subpart-transform-write` | `startup:asset-load`, `frame:draw-ui`, `frame:celestials`, `frame:viewports`, `frame:render` | pointing drive without a look-up singularity, two bodies on one pivot |
| [4: scale-to-hide and parent-frame placement](define-and-animate-subparts-4.md) | KSArmory | `scale-to-hide`, `subpart-transform-write` | `startup:asset-load`, `frame:draw-ui`, `frame:celestials`, `frame:render` | hidden launcher subparts flown as projectiles |
| [5: Author and import keyframe clips and bake native GLB animations](define-and-animate-subparts-5.md) | Flexo | `glb-model`, `keyframe-animation`, `matrix-composition`, `animation-baking`, `curve-fitting` | `tool:authoring`, `tool:build` | Ship authored motion as assets without a runtime controller; preserve rest anchors and inspect import/baking approximations |

## See also

- [game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for where `StarMapAfterGui` and the fallbacks sit in the frame
- [Define a part with its own game data and GLB model](../define-a-part-with-game-data/overview.md), [Change a shipped part without breaking saves](../evolve-a-shipped-part-without-breaking-saves/overview.md), [hide-parts-or-subparts-from-rendering](../../../rendering/meshes/hide-parts-or-subparts-from-rendering/overview.md), [ray-cast-against-vessel-meshes-and-terrain](../../../physics/mod-simulation/ray-cast-against-vessel-meshes-and-terrain/overview.md), [choose-a-render-frame-and-anchor-effects](../../../rendering/overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- Mod features: [ksacars/pose-subparts-at-runtime](../../../../mods/ksacars/features/pose-subparts-at-runtime.md), [ksarmory/articulated-mount-subparts](../../../../mods/ksarmory/features/articulated-mount-subparts.md), [ksarmory/optical-director-heads](../../../../mods/ksarmory/features/optical-director-heads.md), [ksarmory/rounds-as-hidden-launcher-subparts](../../../../mods/ksarmory/features/rounds-as-hidden-launcher-subparts.md)

[^ksa-part]: current/decomp/KSA/Part.cs (decompiled, build 2026.10.10.5554)
[^ksa-parttreerenderdata]: current/decomp/KSA/PartTreeRenderData.cs (decompiled, build 2026.10.10.5554)
[^ksa-parttemplate]: current/decomp/KSA/PartTemplate.cs (decompiled, build 2026.10.10.5554)
[^ksa-vehicle]: current/decomp/KSA/Vehicle.cs (decompiled, build 2026.10.10.5554)
