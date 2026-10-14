---
type: Mod Feature
title: Command registry and mode routing
description: Share browser commands across menus, palettes and shortcuts while keeping editor mode transitions outside document undo
mod: flexo
category: ui
tags:
  - flexo
  - asset-authoring
techniques:
  - command-registry
  - state-machine
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
  - id: flexo-src-state-commandstore
    repo: flexo
    path: src/state/commandStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts
    title: src/state/commandStore.ts
  - id: flexo-src-state-modestore
    repo: flexo
    path: src/state/modeStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/modeStore.ts
    title: src/state/modeStore.ts
---

Flexo centralizes command identity and mode switching so different interface surfaces invoke the same operation. Document mutations remain owned by feature actions.

## How it works

A command carries its stable identifier, display metadata, optional enabled/disabled state and callback. Static registration rejects duplicate identifiers; dynamic providers derive cheap, stable commands from current state. runCommand resolves the command and checks its current enabled predicate before calling it. Menus, palettes and shortcut routing can therefore reuse behavior while rendering their own presentation.

The mode store owns Build, Animation, Data, Engine and Surface modes plus a single armed transient tool. A guarded transition runs outgoing hooks, cancels a tool unless its definition permits survival in the target mode, switches the mode and invokes incoming hooks with optional context. Hook failures are isolated. Mode state is ephemeral and the choreography does not itself mutate the authored part or push undo.[^flexo-src-state-commandstore][^flexo-src-state-modestore]

## Lifecycle and timing

Commands and mode transitions run on browser interaction. Register hooks once for the application session. A command that edits a document must call an action that handles undo; the registry and mode machine do not supply an implicit undo transaction.

## Key code

| Source | Role |
|---|---|
| [src/state/commandStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts#L42-L157) | Typed commands, duplicate checks, providers and dispatch |
| [src/state/modeStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/modeStore.ts#L96-L244) | Mode hooks, single transient tool slot and guarded transitions |

## Snippets

```typescript
// src/state/commandStore.ts L152-L158
export function runCommand(id: CommandId, params?: unknown): boolean {
  const command = getCommand(id);
  if (!command) return false;
  if (command.enabled?.() === false) return false;
  command.run(params);
  return true;
}
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

Dynamic providers need stable prefixed identifiers so saved palette recents can resolve later. Reentrant mode switches are rejected to prevent interleaved transitions. Tool cancellation must be idempotent, and mode-specific state belongs in its feature store to avoid cyclic dependencies.

## See also

- [undoable action chains](undoable-action-chains.md)
- [multi part project isolation](multi-part-project-isolation.md)
- [Build an on-demand browser preview with shared commands](../../../howto/testing-and-tooling/offline-tests/build-a-browser-asset-preview/build-a-browser-asset-preview.md) - how-to article demonstrating this feature

[^flexo-src-state-commandstore]: [src/state/commandStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts#L42-L157)
[^flexo-src-state-modestore]: [src/state/modeStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/modeStore.ts#L96-L244)
