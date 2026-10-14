---
type: How-To
title: Author and import keyframe clips and bake native GLB animations
description: Author or import native keyframe rigs using instance-named leaves, a modeled rest anchor and
  dense linear samples for per-channel easing
topic: define-and-animate-subparts
category: vehicles-and-parts
group: parts
approach: 5
difficulty: intermediate
prerequisites:
  - native-asset-xml
  - browser-authoring
demonstrated_by:
  - mods/flexo/features/keyframe-animation-authoring
  - mods/flexo/features/animation-import-and-linear-baking
techniques:
  - glb-model
  - keyframe-animation
  - matrix-composition
  - animation-baking
  - curve-fitting
game_types:
  - KSA.KeyframeAnimationData
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

Use the native animation route for an asset-only deploy/retract clip or another authored SubPart motion. Flexo provides joints, member placements and keyframe columns, imports existing native rigs, and exports ordinary animation GLBs. It is separate from a runtime C# controller and from general skeletal-model import.

## Background: how the game does it

KeyframeAnimationData.Template reads the first animation and builds a mapping from named member leaves under animated ancestors in [current/decomp/KSA/KeyframeAnimationData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs#L63-L100) and [current/decomp/KSA/KeyframeAnimationData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KeyframeAnimationData.cs#L174-L211). The leaf name must match a placed SubPart instance ID; reusing its template ID is ambiguous when that template is placed more than once.

## Lifecycle and timing

Authoring and preview run in the external browser (`tool:authoring`). XML and binary packaging run on an explicit export request (`tool:build`). The exported files are later consumed by native KSA asset loading; the browser code does not run in the KSA frame or solver loop. See the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

### 1. Create joints and attach placement instance IDs

Give each moving group a joint, set its parent joint, and attach the exact placement instance IDs. The exported rig has a part root, joint nodes and static member leaves. Keep joints acyclic and compare member IDs against the current placement set before export.

```typescript
// src/ksa/animationRig.ts L280-L295
  // Root = the Part (identity). KSA finds the root as the node with no parent.
  const rootIdx = push(partId, new THREE.Matrix4());

  // One node per joint, base TRS = its rest LOCAL pose (keyframe 0, relative to parent).
  const jointNodeIdx = new Map<string, number>();
  for (const j of anim.joints) {
    jointNodeIdx.set(j.id, push(`jt_${j.id}`, sampleJointLocal(anim, j.id, 0)));
  }
  // Wire joint parenting (root joints hang off the Part node).
  for (const j of anim.joints) {
    const parent =
      j.parentJointId && jointNodeIdx.has(j.parentJointId)
        ? jointNodeIdx.get(j.parentJointId)!
        : rootIdx;
    nodes[parent].children.push(jointNodeIdx.get(j.id)!);
  }
```

[src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L280-L295)

### 2. Anchor motion to the pose in which the geometry was modeled

Choose the modeled rest keyframe; imported deploy clips can use the final deployed key instead of time zero. Preview each member with current joint world × inverse rest joint world × static placement. Use the same rest anchor when computing the exported leaf offset, so changing the playhead does not change the model’s reference pose.

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

[src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L227-L237)

Export applies this correction in [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L296-L307).

### 3. Create usable keyframes and per-channel easing

Provide at least one joint with members, two keys and a positive duration. Edit position, rotation and scale easing independently; an absent channel remains linear. Interpolate position/scale and slerp rotation, then run shared clip diagnostics for joints without members, membership shared across clips and solar-tracking references. Compare ordinary member IDs with placements separately: these diagnostics do not detect every dangling member ID, and the exporter skips a missing member’s leaf. [src/ksa/clipIssues.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/clipIssues.ts#L46-L121)

```typescript
// src/ksa/animationRig.ts L138-L144
  return {
    pos: pa.pos.lerp(pb.pos, evalEasing(seg?.position, linear)),
    // three.js slerp takes the shortest path
    quat: pa.quat.slerp(pb.quat, evalEasing(seg?.rotation, linear)),
    scale: pa.scale.lerp(pb.scale, evalEasing(seg?.scale, linear)),
  };
}
```

[src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L138-L144)

### 4. Import native clips with an explicit approximation report

Read the first GLB animation and use the union of translation, rotation and scale times. Keep cubic-spline value rows but flag the discarded tangents. Whole-part import remaps instance IDs and applies the captured rest placements before fitting dense clips. Inspect this path instead of assuming arbitrary DCC skeletal clips are supported. [src/state/partImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partImport.ts#L49-L90)

```typescript
// src/ksa/animationImport.ts L237-L249
    // input count). flexo has no tangent model, so keep the VALUES and treat the segments
    // as LINEAR — the keyframes are exact, the in-between motion is approximated. The
    // clip is flagged so the import report + clip diagnostics can say so (design §11.3).
    const cubic = s.interpolation === 'CUBICSPLINE';
    if (cubic) sawCubicSpline = true;
    const channel: Channel = {
      times: readAccessor(json, bin, s.input).map((r) => r[0]),
      values: cubic ? rows.filter((_, i) => i % 3 === 1) : rows,
      step: s.interpolation === 'STEP',
    };
    const entry = nodeChannels.get(ch.target.node) ?? {};
    entry[ch.target.path as 'translation' | 'rotation' | 'scale'] = channel;
    nodeChannels.set(ch.target.node, entry);
```

[src/ksa/animationImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts#L237-L249)

### 5. Gate dense-key compaction by sampled error

The reverse fitter tries Bézier segments, splits difficult spans and checks reconstructed local poses at the original samples. Accepted fits use 4 mm position, 2.5 degree rotation and 0.003 scale-vector tolerances; failed joints keep dense keys. These are sampled local bounds, not tip-motion or between-sample guarantees. [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L39-L60)

```typescript
// src/ksa/easingFit.ts L361-L372
    // each resulting span is then fitted PER CHANNEL, and the gate below judges the
    // per-channel reconstruction against the same tolerances (design §3 "Import fitter").
    const segments: Segment[] = buildSegments(times, w, traj, ta, tb, lo, hi).map((s) => ({
      t0: s.t0,
      t1: s.t1,
      channels: fitChannels(times, traj, s.t0, s.t1),
    }));
    const r = easedResidual(times, traj, ta, tb, segments);
    const ok = r.pos <= POS_TOL && r.rot * RAD2DEG <= ROT_TOL_DEG && r.scale <= SCALE_TOL;
    if (ok) return { kind: 'eased', jointId, traj, ta, tb, segments };
    return null;
  };
```

[src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L361-L372)

At this pin, constancy is initially tested using only translation and rotation. A scale-only clip with more than two keys can be classified constant and collapse to its first scale. Inspect such imports and retain the original clip; when adapting the fitter, include scale in that decision before promising preservation. [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L101-L126) [src/ksa/easingFit.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/easingFit.ts#L636-L749)

### 6. Bake easing into native linear samplers

Keep linear segments at their endpoints and subdivide eased segments at the configured sampling rate, default 30 Hz. Keep adjacent quaternions in the same hemisphere, emit scale channels when scale varies, and share time accessors when possible. The output uses LINEAR samplers even if the editor’s curve was nonlinear. [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L153-L180) [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L309-L348)

```typescript
// src/ksa/exportAnimationGlb.ts L80-L87
  const samplers: { input: number; output: number; interpolation: 'LINEAR' }[] = [];
  const channels: { sampler: number; target: { node: number; path: string } }[] = [];
  for (const ch of rig.channels) {
    const input = inputAccessor(ch.times);
    const output = addAccessor(ch.values, ch.path === 'rotation' ? 'VEC4' : 'VEC3', false);
    samplers.push({ input, output, interpolation: 'LINEAR' });
    channels.push({ sampler: samplers.length - 1, target: { node: ch.node, path: ch.path } });
  }
```

[src/ksa/exportAnimationGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts#L80-L87)

### 7. Declare the animation module and test endpoints

Emit the KeyframeAnimationModule with a matching animation path and identity, enabling deploy/retract controls for that mode. Add optional solar-tracking references only when their members exist. Inspect time zero, the final key, intermediate poses and the modeled rest anchor after re-import and in the target game.

```typescript
// src/ksa/partXmlSerializer.ts L1211-L1224
function buildAnimationModuleElement(
  doc: XmlDocument,
  anim: PartAnimation,
  base: string,
): XmlElement {
  const moduleId = animModuleId(base, anim);
  const mod = doc.createElement('KeyframeAnimationModule');
  mod.setAttribute('Id', moduleId);
  if (anim.mode === 'deployRetract') mod.setAttribute('ShowDeployRetract', 'true');

  const ref = doc.createElement('KeyframeAnimation');
  ref.setAttribute('Path', animGlbPath(base, anim));
  ref.setAttribute('Id', moduleId);
  mod.appendChild(ref);
```

[src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1211-L1224)

## Complete example

The complete implementation is [src/ksa/animationRig.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationRig.ts#L188-L348), [src/ksa/exportAnimationGlb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportAnimationGlb.ts#L68-L118), [src/ksa/animationImport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/animationImport.ts#L203-L271) and [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L1211-L1239). Begin with one hinge joint and two keys, add an eased rotation, then test a clip modeled at its final deployed pose.

## Variations and gotchas

Cubic tangents are discarded; STEP input and emitted LINEAR channels do not establish a lossless round trip. Dense scale-only imports have the specific fitter defect described above, even though authored scale easing exports. Browser playback does not invoke the game evaluator. A successful native load still needs visual testing for endpoint placement, parent hierarchy and conflicts between clips; none was executed for this article.

## See also

- [Pose wheels, arms and blades from StarMapAfterGui with a hidden-UI fallback](define-and-animate-subparts-1.md)
- [Articulated turret mounts, rate-limited, with sibling chains](define-and-animate-subparts-2.md)
- [Optical director heads with roll-nod gimbals](define-and-animate-subparts-3.md)
- [Scale-to-hide and parent-frame transform writes](define-and-animate-subparts-4.md)
- [Author hierarchical part animation with an explicit rest anchor](../../../../mods/flexo/features/keyframe-animation-authoring.md)
- [Import native animation rigs and bake easing into linear GLB samples](../../../../mods/flexo/features/animation-import-and-linear-baking.md)
- [Ray cast against part meshes and terrain, from the cursor or any origin](../../../physics/mod-simulation/ray-cast-against-vessel-meshes-and-terrain/overview.md)
- [Change a shipped part without breaking saves](../evolve-a-shipped-part-without-breaking-saves/overview.md)
- [Hide part meshes or subparts without removing them](../../../rendering/meshes/hide-parts-or-subparts-from-rendering/overview.md)
- [Choose a render frame and anchor effects to bodies, parts and terrain](../../../rendering/overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
