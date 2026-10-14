---
type: Mod Feature
title: Isolate multiple parts within one browser project
description: Park inactive documents with their own history and merge selected parts into one collision-checked export namespace
mod: flexo
category: persistence
tags:
  - flexo
  - asset-authoring
techniques:
  - document-registry
  - id-remapping
  - xml-asset
game_types: []
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
  - id: flexo-src-state-partsstore
    repo: flexo
    path: src/state/partsStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts
    title: src/state/partsStore.ts
  - id: flexo-src-ksa-modexport
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

A Flexo project can hold several native parts while the existing editor continues to operate on one active part. This avoids making every selection or gizmo subsystem understand a second document dimension.

## How it works

The registry owns ordered part metadata and parks inactive document, layer-view and history data. Only the active part occupies the normal editing stores. Entity IDs remain unique within a part, so project-wide operations must key by part ID and entity ID together. Visibility, ghost offset and inclusion in export live in registry metadata rather than undoable document edits. The export plan gathers included parts, assigns a sanitized namespace to each and rejects duplicate namespace tokens before generating shared XML documents.[^flexo-src-state-partsstore][^flexo-src-ksa-modexport]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [src/state/partsStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts#L25-L75) | One active document and per-part state invariants |
| [src/state/partsStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts#L99-L149) | Parked documents, histories and injected asset operations |
| [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L96-L221) | Per-part export namespaces and shared documents |

## Snippets

```typescript
// src/state/partsStore.ts L70-L75
/** What an inactive part parks. Layers are per-part, so view state travels with it. */
export interface InactivePartDoc {
  part: EditingPart;
  layerView: Record<string, LayerViewState>;
  activeLayerId: string;
}
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

A display name, registry ID and exported KSA Part ID are different identities. Ghost offsets are workspace layout aids, not exported assembly transforms. A bare light or connector ID is unsafe as a project-wide map key. Part lifecycle operations do not share the same undo semantics as edits inside a part.

## See also

- [project persistence and archives](project-persistence-and-archives.md)
- [isolated subpart variants](isolated-subpart-variants.md)
- [native asset mod export](native-asset-mod-export.md)
- [Keep browser projects isolated and carry custom assets in archives](../../../howto/persistence/user-data/persist-user-created-presets-and-content/persist-user-created-presets-and-content-7.md) - how-to article demonstrating this feature

[^flexo-src-state-partsstore]: [src/state/partsStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts#L99-L149)
[^flexo-src-ksa-modexport]: [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L96-L221)
