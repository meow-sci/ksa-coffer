---
type: Mod Feature
title: Undoable action chains
description: Evaluate transform and array operations once for both ghost previews and atomic document commits
mod: flexo
category: testing-and-tooling
tags:
  - flexo
  - asset-authoring
techniques:
  - pure-model
  - transactional-editing
  - state-machine
game_types: []
lifecycle:
  - tool:authoring
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:39:16Z
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
  - id: flexo-src-state-chainstore
    repo: flexo
    path: src/state/chainStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/chainStore.ts
    title: src/state/chainStore.ts
  - id: flexo-src-three-chaineval
    repo: flexo
    path: src/three/chainEval.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainEval.ts
    title: src/three/chainEval.ts
  - id: flexo-src-three-chainmath
    repo: flexo
    path: src/three/chainMath.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainMath.ts
    title: src/three/chainMath.ts
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-ui-chain-applychainsession
    repo: flexo
    path: src/ui/chain/applyChainSession.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/chain/applyChainSession.ts
    title: src/ui/chain/applyChainSession.ts
---

Flexo treats a chain of transforms and repeated arrays as a temporary computation over selected SubParts or colliders. Users see the result before one document edit records the entire operation.

## How it works

Opening a session freezes seed identifiers, not the seed transforms. The computed evaluation resolves those identifiers against the current document each time, so gizmo edits or undo reflow the preview. Missing seeds, locked layers and colliders with different owners stop evaluation. Operators compose translation, rotation, scaling and linear, radial, circular or grid arrays; the math evaluator bounds the resulting instance count.

Apply reads the same evaluation used for ghosts. The editor validates every seed again before pushing one undo entry. Original seeds retain identity and receive their evaluated transforms; duplicates receive collision-free instance or collider identifiers. Copies preserve template/layer ownership. SubPart copies do not clone animation, gimbal, feed or coupling references. The commit selects seeds and new copies together.[^flexo-src-state-chainstore][^flexo-src-three-chaineval][^flexo-src-three-chainmath][^flexo-src-state-editorstore][^flexo-src-ui-chain-applychainsession]

## Lifecycle and timing

A chain session is browser-only, ephemeral authoring state. Its evaluation reacts to document and layer changes; Apply performs one synchronous document mutation and one undo checkpoint. No per-frame KSA callback is involved.

## Key code

| Source | Role |
|---|---|
| [src/state/chainStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/chainStore.ts#L6-L108) | Frozen seed selection, operator types and session defaults |
| [src/three/chainEval.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainEval.ts#L8-L76) | One evaluation for the preview and commit |
| [src/three/chainMath.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainMath.ts#L487-L538) | Bounded sequential transform and array evaluation |
| [src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L2168-L2285) | Fresh identifiers and atomic undo commits |
| [src/ui/chain/applyChainSession.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/chain/applyChainSession.ts#L22-L51) | Commit routing and missing-seed feedback |

## Snippets

```typescript
// src/state/editorStore.ts L2189-L2206
export function applyActionChain(entries: readonly ChainCommitEntry[], detail: string): number {
  if (entries.length === 0) return -1;
  const current = $part.get();
  // Resolve every distinct seed FIRST: a partial commit would be worse than none.
  const seedIndexById = new Map<string, number>();
  for (const entry of entries) {
    if (seedIndexById.has(entry.seedInstanceId)) continue;
    const index = current.placements.findIndex((p) => p.instanceId === entry.seedInstanceId);
    if (index < 0 || isLayerLocked(current.placements[index].layerId)) return -1;
    seedIndexById.set(entry.seedInstanceId, index);
  }

  pushUndo('action chain', detail);
  const part = clone(current);
  const seedRefs: SelectionRef[] = [];
  for (const entry of entries) {
    if (!entry.isSeed) continue;
    const index = seedIndexById.get(entry.seedInstanceId)!;
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

Array counts include the original seed. Treat duplicated placements as new instances that may need explicit behavior wiring. Keeping preview math and commit math separate would risk a result different from the one reviewed; Flexo deliberately shares the evaluation. Canceling a session must discard the session without creating document undo entries.

## See also

- [builtin part composition](builtin-part-composition.md)
- [collider authoring and coverage](collider-authoring-and-coverage.md)
- [multi part project isolation](multi-part-project-isolation.md)
- [Keep browser projects isolated and carry custom assets in archives](../../../howto/persistence/user-data/persist-user-created-presets-and-content/persist-user-created-presets-and-content-7.md) - how-to article demonstrating this feature

[^flexo-src-state-chainstore]: [src/state/chainStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/chainStore.ts#L6-L108)
[^flexo-src-three-chaineval]: [src/three/chainEval.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainEval.ts#L8-L76)
[^flexo-src-three-chainmath]: [src/three/chainMath.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainMath.ts#L487-L538)
[^flexo-src-state-editorstore]: [src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L2168-L2285)
[^flexo-src-ui-chain-applychainsession]: [src/ui/chain/applyChainSession.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/chain/applyChainSession.ts#L22-L51)
