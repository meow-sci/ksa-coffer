---
type: Mod Feature
title: Persist browser projects and archive their binary assets
description: Separate project metadata, snapshots, undo history and blobs while exporting complete portable project archives
mod: flexo
category: persistence
tags:
  - flexo
  - asset-authoring
techniques:
  - indexeddb
  - json-config
  - archive-packaging
game_types: []
lifecycle:
  - tool:authoring
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:45:35Z
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
  - id: flexo-src-state-projectdb
    repo: flexo
    path: src/state/projectDb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectDb.ts
    title: src/state/projectDb.ts
  - id: flexo-src-state-projectstore
    repo: flexo
    path: src/state/projectStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts
    title: src/state/projectStore.ts
  - id: flexo-src-state-projectarchive
    repo: flexo
    path: src/state/projectArchive.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts
    title: src/state/projectArchive.ts
  - id: flexo-archive-adoption
    repo: flexo
    path: src/state/projectArchive.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts
    title: src/state/projectArchive.ts
  - id: flexo-project-merge
    repo: flexo
    path: src/state/projectTransfer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectTransfer.ts
    title: src/state/projectTransfer.ts
  - id: flexo-share-links
    repo: flexo
    path: src/state/projectShareLink.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectShareLink.ts
    title: src/state/projectShareLink.ts
---

Flexo stores editable projects locally and exports a full archive that carries custom geometry and image bytes. Game-mod export and project backup serve different purposes.

## How it works

Stable project IDs key separate metadata, snapshot, history and thumbnail records. This lets the manager list lightweight metadata without reading every undo stack. Snapshot changes are saved after 300 ms, while history uses a 1500 ms debounce. The archive packages a first-entry manifest, the normal project JSON envelope, an optional thumbnail and asset blobs under kind/ID paths. Each asset entry records its size, MIME type and SHA-256; a pure JavaScript fallback keeps the hash format usable when Web Crypto is absent.[^flexo-src-state-projectdb][^flexo-src-state-projectstore][^flexo-src-state-projectarchive]

Archive import separates parsing from mutation. It checks exact container/project versions and required entries before exposing three destinations: a new project, new parts, or an additive merge into the active part. The last mode rejects multi-part payloads. Adoption can reuse a destination texture with the same channel, byte length and hash; geometry identities are freshened instead. Blobs are copied before the document merge, which remaps placement, connector, feed, animation and related references and then rehydrates browser asset URLs.[^flexo-archive-adoption][^flexo-project-merge]

Stateless share links encode all parts, including parts excluded from game export, as compact JSON compressed with Zstd level 19 and URL-safe Base64 in the load parameter. They still lack binary asset payloads. The archive is the format that carries those bytes.[^flexo-share-links]

## Lifecycle and timing

Browser stores react to document and project changes; asynchronous IndexedDB saves are debounced. Initial hydration completes before the editor renders. Archive creation reads stored descriptors and blobs on an explicit user request.

Import dispatch and its single-part merge guard are in [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L614-L711).

## Key code

| Source | Role |
|---|---|
| [src/state/projectDb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectDb.ts#L8-L53) | Stable project identity and four IndexedDB stores |
| [src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L103-L148) | Persistence scope and exact schema version |
| [src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L480-L520) | Independent snapshot and history save debounces |
| [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L42-L98) | Manifest, project JSON, thumbnail and binary asset archive |
| [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L169-L174) | Digest fallback across browser contexts |

## Snippets

```typescript
// src/state/projectArchive.ts L169-L174
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return sha256HexSync(bytes);
  const digest = await crypto.subtle.digest('SHA-256', bytes.slice().buffer as ArrayBuffer);
  let out = '';
  for (const byte of new Uint8Array(digest)) out += HEX[byte >> 4] + HEX[byte & 15];
  return out;
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

This checkout enforces exact schema compatibility and discards incompatible stored snapshots instead of migrating them. Local browser storage is not a durable cross-device backup. The complete archive solves the binary-data gap of descriptor-only JSON or links, but still requires compatible archive and project format versions.

The archive reader copies the manifest’s declared SHA-256 into the adoption table; it does not recompute incoming digests or compare declared sizes with extracted bytes. Hash-based reuse is therefore an import deduplication mechanism, not an integrity-verification guarantee ([src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L326-L365)). Blob writes and the document edit also are not one database transaction.

## See also

- [multi part project isolation](multi-part-project-isolation.md)
- [gltf model import](gltf-model-import.md)
- [native asset mod export](native-asset-mod-export.md)
- [Keep browser projects isolated and carry custom assets in archives](../../../howto/persistence/user-data/persist-user-created-presets-and-content/persist-user-created-presets-and-content-7.md) - how-to article demonstrating this feature

[^flexo-src-state-projectdb]: [src/state/projectDb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectDb.ts#L8-L53)
[^flexo-src-state-projectstore]: [src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L480-L520)
[^flexo-src-state-projectarchive]: [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L169-L174)

[^flexo-archive-adoption]: [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L427-L559)

[^flexo-project-merge]: [src/state/projectTransfer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectTransfer.ts#L569-L644)

[^flexo-share-links]: [src/state/projectShareLink.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectShareLink.ts#L11-L64)
