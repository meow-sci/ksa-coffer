---
type: Mod Feature
title: Author hierarchical part animation with an explicit rest anchor
description: Represent hinges, member SubParts and keyframe poses without conflating the modeled assembly with the start of a clip
mod: flexo
category: vehicles-and-parts
tags:
  - flexo
  - asset-authoring
techniques:
  - glb-model
  - keyframe-animation
  - matrix-composition
game_types:
  - KSA.KeyframeAnimationData
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:34:59Z
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
  - id: flexo-src-ksa-animationrig
    repo: flexo
    path: src/ksa/animationRig.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts
    title: src/ksa/animationRig.ts
  - id: flexo-src-ksa-clipissues
    repo: flexo
    path: src/ksa/clipIssues.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/clipIssues.ts
    title: src/ksa/clipIssues.ts
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: ksa-current-decomp-ksa-keyframeanimationdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KeyframeAnimationData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs
    title: current/decomp/KSA/KeyframeAnimationData.cs
---

Flexo’s animation editor organizes a clip into joints, SubPart members and pose columns. The modeled geometry can correspond to a deployed pose rather than time zero.

## How it works

Joint parents form a hierarchy. A member’s preview matrix is the joint world matrix at the playhead multiplied by the inverse rest-anchor matrix and then its static placement. Export uses the same anchor when deriving the leaf offset. The rig root represents the part; animated joints receive separate nodes, and member leaves carry placement instance IDs. Shared diagnostics distinguish clips that cannot export from warnings such as duplicate membership across clips, empty joints and missing solar-tracking targets. GameData declares the animation module and optional solar-tracking member/exclusions.[^flexo-src-ksa-animationrig][^flexo-src-ksa-clipissues][^flexo-src-ksa-partxmlserializer]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L188-L237) | Joint world transforms and modeled-rest correction |
| [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L266-L307) | Hierarchical rig nodes and instance-named leaves |
| [src/ksa/clipIssues.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/clipIssues.ts#L46-L121) | Shared export blockers and warnings |
| [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1211-L1239) | Animation module and solar tracking XML |

## Snippets

```typescript
// src/ksa/animationRig.ts L227-L237
export function previewOverrideMatrix(
  anim: PartAnimation,
  instanceId: string,
  t: number,
  placement: Transform,
): THREE.Matrix4 | null {
  const joint = findOwningJoint(anim, instanceId);
  if (!joint) return null;
  const Wt = jointWorld(anim, joint.id, t);
  const Wrestinv = jointWorld(anim, joint.id, restAnchorTime(anim)).invert();
  return Wt.multiply(Wrestinv).multiply(matrixFromTransform(placement));
```

## Game APIs touched

KSA.KeyframeAnimationData.Template identifies named leaves under animated ancestors.[^ksa-current-decomp-ksa-keyframeanimationdata]

## Pitfalls and version notes

Keep the leaf name equal to the placement instance ID, not the reusable template ID. A member driven by multiple clips is warned about but remains exportable. Rest-anchor state is editor metadata; it is translated into rig geometry rather than serialized as a custom game field. Preview scrubbing is not a live game animation evaluation.

## See also

- [animation import and linear baking](animation-import-and-linear-baking.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [native asset mod export](native-asset-mod-export.md)
- [Author and import keyframe clips and bake native GLB animations](../../../howto/vehicles-and-parts/parts/define-and-animate-subparts/define-and-animate-subparts-5.md) - how-to article demonstrating this feature

[^flexo-src-ksa-animationrig]: [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L266-L307)
[^flexo-src-ksa-clipissues]: [src/ksa/clipIssues.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/clipIssues.ts#L46-L121)
[^flexo-src-ksa-partxmlserializer]: [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1211-L1239)
[^ksa-current-decomp-ksa-keyframeanimationdata]: [current/decomp/KSA/KeyframeAnimationData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs#L174-L211)
