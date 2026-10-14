---
type: How-To
title: Keep browser projects isolated and carry custom assets in archives
description: Separate active documents, per-part undo and browser storage while exporting archives that retain custom asset bytes
topic: persist-user-created-presets-and-content
category: persistence
group: user-data
approach: 7
difficulty: advanced
prerequisites:
  - flexo-source
  - indexeddb
  - document-model
demonstrated_by:
  - mods/flexo/features/project-persistence-and-archives
  - mods/flexo/features/multi-part-project-isolation
  - mods/flexo/features/undoable-action-chains
techniques:
  - indexeddb
  - json-config
  - archive-packaging
  - document-registry
  - id-remapping
  - xml-asset
  - pure-model
  - transactional-editing
  - state-machine
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - persistence
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:17:50Z
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
  - id: source-flexo-src-state-projectdb-ts
    repo: flexo
    path: src/state/projectDb.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectDb.ts
    title: src/state/projectDb.ts
  - id: source-flexo-src-state-partsstore-ts
    repo: flexo
    path: src/state/partsStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts
    title: src/state/partsStore.ts
  - id: source-flexo-src-state-editorstore-ts
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: source-flexo-src-three-chaineval-ts
    repo: flexo
    path: src/three/chainEval.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainEval.ts
    title: src/three/chainEval.ts
  - id: source-flexo-src-ui-chain-applychainsession-ts
    repo: flexo
    path: src/ui/chain/applyChainSession.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/chain/applyChainSession.ts
    title: src/ui/chain/applyChainSession.ts
  - id: source-flexo-src-state-projectstore-ts
    repo: flexo
    path: src/state/projectStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts
    title: src/state/projectStore.ts
  - id: source-flexo-src-state-projectarchive-ts
    repo: flexo
    path: src/state/projectArchive.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts
    title: src/state/projectArchive.ts
  - id: source-flexo-src-state-projecttransfer-ts
    repo: flexo
    path: src/state/projectTransfer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectTransfer.ts
    title: src/state/projectTransfer.ts
  - id: source-flexo-src-state-projectsharelink-ts
    repo: flexo
    path: src/state/projectShareLink.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectShareLink.ts
    title: src/state/projectShareLink.ts
  - id: source-flexo-src-ksa-modexport-ts
    repo: flexo
    path: src/ksa/modExport.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts
    title: src/ksa/modExport.ts
---

Use this approach for an external asset editor with several parts per project, imported binary assets and undoable editing. Flexo separates browser persistence from native mod export. The editable archive is the portable project; the generated mod folder serves the game.

## Background: how the game does it

No live game save API is involved. Browser records hold the editor document and assets; a later exporter translates included parts into native XML and binaries. This keeps inactive documents and transient preview state out of a game scene save.

## Lifecycle and timing

Project and part actions run in tool:authoring. Synchronous document changes settle before the debounced IndexedDB writers run. A chain preview is ephemeral until Apply commits it. Export reads a snapshot in tool:build; it does not reach into the running game. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Give projects stable keys and split expensive records

Use a minted project identity rather than its editable display name. Keep metadata, snapshots, history and thumbnails separate so listing projects does not parse every undo stack. [src/state/projectDb.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectDb.ts#L8-L53) defines the separation:

```typescript
// src/state/projectDb.ts L35-L53
// ... enclosing context omitted
const DB_NAME = 'flexo-projects';
const DB_VERSION = 1;

const STORES = ['meta', 'snapshots', 'history', 'thumbs'] as const;
type StoreName = (typeof STORES)[number];

export type ProjectId = string;

/**
 * Mints a project id: `p_` + 12 random base36 characters (~62 bits). Ids are minted ONCE at
 * create and never derived from the name — that is what makes rename-clobber structurally
 * impossible (design D1).
 */
export function newProjectId(): ProjectId {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let out = 'p_';
  for (const byte of bytes) out += (byte % 36).toString(36);
  return out;
// ... enclosing context omitted
```

Expected behavior: renaming changes display metadata without changing which stored document or assets belong to the project. Custom binary keys also include the project namespace.

### 2. Park each inactive part with its own history

Keep one active document in ordinary editing stores. On switching parts, park the outgoing document/history, restore the destination and clear outgoing selection and transient tools. IDs may repeat across parts, so a project-wide lookup must use both part ID and entity ID.

```typescript
// src/state/partsStore.ts L390-L412
// ... enclosing context omitted
export function switchPart(id: string): boolean {
  if (id === $activePartId.get()) return false;
  if (!$partEntries.get().some((entry) => entry.id === id)) return false;
  parkActive();
  const doc = inactiveDocs.get(id)!;
  inactiveDocs.delete(id);
  const history = inactiveHistories.get(id) ?? { undo: [], redo: [] };
  inactiveHistories.delete(id);
  $activePartId.set(id);
  importHistory(history);
  // The cascade: this one write reconciles the scene and re-clamps every mode sub-store,
  // exactly as opening a project does.
  $part.set(doc.part);
  $activeLayerId.set(
    doc.part.layers.some((l) => l.id === doc.activeLayerId) ? doc.activeLayerId : DEFAULT_LAYER_ID,
  );
  $layerView.set(doc.layerView);
  clearSelection();
  // An open action chain is seeded by instanceIds of the OUTGOING document, so it is
  // meaningless here — same contract as a project load.
  closeChain();
  clearPartScopedIntents();
  bumpInactiveRevision();
// ... enclosing context omitted
```

The switch deliberately does not create a document undo entry. Registry visibility, ghost offsets and export inclusion are workspace metadata; [src/state/partsStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/partsStore.ts#L25-L75) documents that boundary. Ghost offsets are not assembly transforms to serialize.

### 3. Make previews pure and commits atomic at the document level

For a transform or array chain, freeze seed identities and evaluate against the current document; use that same evaluation for ghosts and Apply. Validate every seed and layer lock before pushing Undo:

```typescript
// src/state/editorStore.ts L2189-L2206
// ... enclosing context omitted
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
// ... enclosing context omitted
```

The evaluator and routing are [src/three/chainEval.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/chainEval.ts#L8-L76) and [src/ui/chain/applyChainSession.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/chain/applyChainSession.ts#L22-L51). An original seed keeps its identity; duplicate placements get new IDs. Copies do not automatically inherit animation/feed/gimbal wiring. Expected result: cancel changes nothing, while one Undo reverses a committed chain.

### 4. Debounce snapshots separately from history

Subscribe the writer once and use independent 300 ms and 1500 ms timers. Suspend writes during deliberate hydration so intermediate state is not mistaken for a user edit. The scheduler is:

```typescript
// src/state/projectStore.ts L480-L503
const SAVE_DEBOUNCE_MS = 300;
const HISTORY_DEBOUNCE_MS = 1500;

let suspended = false;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let historyTimer: ReturnType<typeof setTimeout> | null = null;
let autosaveStarted = false;
/** Set by the scheduler, cleared by a thumbnail capture — drives the D15 cadence. */
let dirtySinceCapture = false;

function scheduleSave(): void {
  if (suspended) return;
  dirtySinceCapture = true;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    void runWrite(writeSnapshotAndMeta);
  }, SAVE_DEBOUNCE_MS);
  if (historyTimer) clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    historyTimer = null;
    void runWrite(writeHistory);
  }, HISTORY_DEBOUNCE_MS);
}
```

Keep schema checks at the hydration boundary ([src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L103-L148)). At boot this implementation attempts to delete incompatible or malformed saved project records and their asset blobs, then reports the removed projects; it does not migrate them ([src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L663-L703)). Browser storage can be cleared; it is not a cross-device backup. Preserve an archive before changing a stored schema, and use a compatible application version to reopen that archive.

### 5. Parse and plan archive adoption before editing

Export the envelope plus its source blobs in the full archive. On import, validate format versions and required entries, then choose new project, add-parts or merge-into-active. The merge destination accepts exactly one source part:

```typescript
// src/state/projectArchive.ts L685-L694
// ... enclosing context omitted
  // 'merge-into-active' — the additive paste, unchanged. Defined ONLY for a single-part
  // payload, because "merge N parts into one document" has no meaning. The dialog disables the
  // destination (with the part count as the reason) and this is the AUTHORITATIVE guard — the
  // same split `partsStore.deletePart` uses: a command or a test calling in here directly must
  // be refused rather than silently dropping parts 2..N.
  if (parsed.envelope.parts.length !== 1) {
    throw new Error(
      `“Merge into active part” takes a single-part source; this one has ${parsed.envelope.parts.length} parts. Import it as new parts instead.`,
    );
  }
// ... enclosing context omitted
```

Plan texture reuse by channel/byte length/hash; mint fresh geometry and batch identities, copy adopted blobs, remap document references and hydrate URLs. [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L427-L559) and [src/state/projectTransfer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectTransfer.ts#L569-L644) keep adoption separate from document mutation. Binary writes plus the document commit are not one database transaction.

### 6. Offer compact links only for payloads that do not require binaries

The share encoder retains all parts, including ones excluded from game export, and compresses the compact project JSON before URL-safe Base64:

```typescript
// src/state/projectShareLink.ts L37-L49
const SHARE_ZSTD_LEVEL = 19;

/** Encodes an export envelope's worth of project state into a `?load=` payload string. */
export async function encodeSharePayload(
  parts: readonly ProjectPartSource[],
  projectName: string,
  activePartIndex = 0,
): Promise<string> {
  const json = serializeProjectJson(buildProjectExport(parts, projectName, { activePartIndex }));
  const bytes = new TextEncoder().encode(json);
  const compressed = await compressZstd(bytes, SHARE_ZSTD_LEVEL);
  return bytesToBase64Url(compressed);
}
```

Use a full archive for imported GLBs, source textures and painted bitmaps. A descriptor-only JSON/link cannot reproduce missing binary content. The portable envelope does not carry Undo/Redo history: opening it as a new project resets the stacks, while reopening the same compatible IndexedDB project can restore its separately stored histories ([src/state/projectTransfer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectTransfer.ts#L82-L163), [src/state/projectStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectStore.ts#L912-L958)). After reopening an archive, check geometry, materials and export inclusion, then make a fresh edit in each part and check that Undo remains isolated.

## Complete example

Trace [src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L614-L711) for archive destinations and [src/ksa/modExport.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.ts#L181-L221) for the distinct native export plan. That plan rejects duplicate sanitized part namespaces. Expected verification is an archive reopened into a fresh project with empty histories and preserved custom assets, followed by new edits whose Undo stacks remain independent; it was not executed for this article.

## Variations and gotchas

The archive parser trusts the incoming manifest’s SHA-256 and does not recompute it or validate its declared size against bytes ([src/state/projectArchive.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/projectArchive.ts#L326-L365)). Deduplication therefore does not prove integrity. Full project backup, local autosave and game export have different contents and version boundaries. Keep selection/mode/cache state out of authored data and release obsolete blob URLs when replacing assets.

## See also

- [Topic overview](overview.md)
- [Keep named, editable color palettes in a sectioned file with a ColorEdit4 round trip](persist-user-created-presets-and-content-1.md)
- [Load bundled and user color themes from TOML files and let the user's theme win a name clash](persist-user-created-presets-and-content-2.md)
- [Store only the colors a player changed, keyed by field name, in the main config](persist-user-created-presets-and-content-3.md)
- [Export effect presets as trimmed XML and load them back as a mod's own asset type](persist-user-created-presets-and-content-4.md)
- [Save a user-built layout as a versioned snake_case JSON file anchored to a body by latitude and longitude](persist-user-created-presets-and-content-5.md)
- [Import user files into a catalog folder and refer to them by name](persist-user-created-presets-and-content-6.md)
- [Persist browser projects and archive their binary assets](../../../../mods/flexo/features/project-persistence-and-archives.md)
- [Isolate multiple parts within one browser project](../../../../mods/flexo/features/multi-part-project-isolation.md)
- [Undoable action chains](../../../../mods/flexo/features/undoable-action-chains.md)
- [Build a mod settings window (and developer panel)](../../../ui/windows/build-a-settings-window/overview.md)
- [Persist mod settings as JSON with System.Text.Json](../../settings-formats/persist-mod-settings-as-json/overview.md)
- [Persist mod settings as TOML](../../settings-formats/persist-mod-settings-toml/overview.md)
- [Weld or anchor one vessel to another](../../../physics/kinematics/weld-one-vessel-to-another/overview.md)
- [Build searchable lists, two-pane browsers and file pickers in ImGui](../../../ui/windows/build-searchable-lists-and-browsers/overview.md)
- [Save a whole mod's scene state as versioned sidecar records, with reset and replay on load](../../saves/save-mod-state-with-the-scene/overview.md)
- [Find where KSA keeps user data and choose where a mod stores its config and data files](../choose-where-a-mod-stores-its-files/overview.md)
- [Write config files atomically and load hand-edited ones without losing them](../../settings-formats/write-and-load-config-files-safely/overview.md)
- [Place a static object on a planet surface at a latitude and longitude, and keep it anchored](../../../celestials/terrain/place-static-objects-on-a-planet-surface/overview.md)
