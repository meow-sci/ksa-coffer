---
type: How-To
title: Build an on-demand browser preview with shared commands
description: Coalesce viewport redraws, share command dispatch and isolate an embeddable viewer from persistent editor settings
topic: build-a-browser-asset-preview
category: testing-and-tooling
group: offline-tests
difficulty: intermediate
prerequisites:
  - flexo-source
  - three-js
  - browser-catalog-assets
demonstrated_by:
  - mods/flexo/features/demand-driven-preview
  - mods/flexo/features/command-registry-and-mode-routing
  - mods/flexo/features/embedded-part-preview
techniques:
  - on-demand-rendering
  - shader-adaptation
  - command-registry
  - state-machine
  - asset-pipeline
  - embedded-viewer
  - session-state
game_types: []
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - testing-and-tooling
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
  - id: source-flexo-src-three-renderloop-ts
    repo: flexo
    path: src/three/RenderLoop.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts
    title: src/three/RenderLoop.ts
  - id: source-flexo-src-three-normalmappatch-ts
    repo: flexo
    path: src/three/normalMapPatch.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/normalMapPatch.ts
    title: src/three/normalMapPatch.ts
  - id: source-flexo-src-state-commandstore-ts
    repo: flexo
    path: src/state/commandStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts
    title: src/state/commandStore.ts
  - id: source-flexo-src-state-modestore-ts
    repo: flexo
    path: src/state/modeStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/modeStore.ts
    title: src/state/modeStore.ts
  - id: source-flexo-apps-partpreview-src-app-tsx
    repo: flexo
    path: apps/partpreview/src/App.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx
    title: apps/partpreview/src/App.tsx
  - id: source-flexo-apps-partpreview-src-settings-ts
    repo: flexo
    path: apps/partpreview/src/settings.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts
    title: apps/partpreview/src/settings.ts
  - id: source-flexo-apps-partpreview-vite-config-ts
    repo: flexo
    path: apps/partpreview/vite.config.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/vite.config.ts
    title: apps/partpreview/vite.config.ts
  - id: source-flexo-vite-previewmanifest-ts
    repo: flexo
    path: vite/previewManifest.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/previewManifest.ts
    title: vite/previewManifest.ts
---

Use a browser viewport to inspect authored KSA geometry and materials before export. Flexo demonstrates an on-demand renderer, a shared command/mode layer and a small standalone part viewer. These are editor infrastructure; they do not embed the game renderer.

## Background: how the game does it

The preview consumes catalog assets and adapts their channel conventions to Three.js. It has no KSA frame callback, Vulkan command buffer or live physics access. Native material behavior still needs separate validation after export.

## Lifecycle and timing

Interactive rendering and commands run in tool:authoring, with requestAnimationFrame scheduling pixels. The embed manifest and deployment paths are produced in tool:build. Asset completion, resizing, controls and document changes all need explicit invalidation. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Create one coalescing render loop per viewport

Construct RenderLoop with the drawing function and call invalidate beside every scene mutation. Reset the pending handle before drawing so further requests can schedule the next frame; disposal must cancel pending work.

```typescript
// src/three/RenderLoop.ts L46-L65
// ... enclosing context omitted
  setContinuous(on: boolean): void {
    if (on === this.continuous) return;
    this.continuous = on;
    if (on) this.invalidate();
  }

  private readonly tick = (): void => {
    this.handle = 0;
    if (this.disposed) return;
    // Re-arm BEFORE drawing so an invalidate() raised during the draw (damping,
    // for one) coalesces into the frame already scheduled instead of being lost.
    if (this.continuous) this.invalidate();
    this.draw();
  };

  dispose(): void {
    this.disposed = true;
    if (this.handle !== 0) cancelAnimationFrame(this.handle);
    this.handle = 0;
  }
// ... enclosing context omitted
```

The single-request guard in [src/three/RenderLoop.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts#L32-L39) collapses repeated changes into one frame. Use continuous mode only for a feature that needs it, such as the FPS diagnostic, and release it afterward. Expected idle behavior is no repeated drawing.

### 2. Keep texture convention changes in one shader adapter

Bind diffuse, normal and ORM maps by usage, then apply the adapter flags. KSA-style two-channel normals need Z reconstructed; the browser patch flips normal X and adapts a scalar emissive mask.

```typescript
// src/three/normalMapPatch.ts L31-L43
// ... enclosing context omitted
  material.onBeforeCompile = (shader) => {
    if (opts.normal) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        /* glsl */ `
          vec3 mapN = vec3( texture2D( normalMap, vNormalMapUv ).rg * 2.0 - 1.0, 0.0 );
          mapN.x = - mapN.x;
          mapN.xy *= normalScale;
          mapN.z = sqrt( max( 0.0, 1.0 - dot( mapN.xy, mapN.xy ) ) );
          normal = normalize( tbn * mapN );
        `,
      );
    }
// ... enclosing context omitted
```

The remaining emissive patch and cache key are in [src/three/normalMapPatch.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/normalMapPatch.ts#L45-L60). Materials with the same flags can share a compiled program. This shader adaptation does not establish full parity with KSA lighting, tone mapping or dynamic material flags.

### 3. Route every UI surface through stable command IDs

Put command definitions in the existing UI command modules and register them once. Menus, palettes and shortcuts should dispatch the same ID, rechecking its current enabled predicate:

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

Use [src/state/commandStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts#L83-L145) for duplicate checks and dynamic providers. Providers must return stable IDs cheaply. A mutating command calls a document action that owns Undo; the registry does not create a transaction by itself.

### 4. Centralize mode exits and transient-tool cancellation

Register mode hooks once. Keep tool ownership in one slot and use the guarded transition rather than scattering mode changes across widgets:

```typescript
// src/state/modeStore.ts L222-L238
// ... enclosing context omitted
  switching = true;
  try {
    const previous = $mode.get();
    runHooks(previous, 'onExit');

    const tool = $activeTool.get();
    if (tool) {
      const def = toolDefs.get(tool);
      if (!def?.survivesModeSwitch || !toolAllowedIn(tool, next)) cancelArmedTool();
    }

    $mode.set(next);
    runHooks(next, 'onEnter', payload);
  } finally {
    switching = false;
  }
}
// ... enclosing context omitted
```

Expected behavior is outgoing cleanup, permitted tool survival or cancellation, then incoming setup. Reentrant transitions are ignored. Mode changes are not authored part edits and must not silently add Undo checkpoints.

### 5. Build the embed with session settings and shared assets

Accept a requested part_id only after catalogs resolve; return an explicit missing/unknown ID state. Keep the embed’s settings in its own in-memory atoms so sharing an origin cannot overwrite the main editor’s persisted preferences.

```typescript
// apps/partpreview/src/App.tsx L24-L39
// ... enclosing context omitted
  let content;
  if (!PART_ID) {
    content = <ErrorView message='Missing "part_id"' hint="?part_id=<id>&skybox_id=<id>" />;
  } else if (partCatalogLoading || catalogLoading) {
    // No 3D context until the catalogs resolve — just the indeterminate bar.
    content = <DownloadProgress catalogLoading />;
  } else {
    const part = partIndex.get(PART_ID);
    content = part ? (
      <>
        <PreviewCanvas part={part} />
        <DownloadProgress catalogLoading={false} />
      </>
    ) : (
      <ErrorView message={`Unknown part id "${PART_ID}"`} />
    );
// ... enclosing context omitted
```

The separate settings are in [apps/partpreview/src/settings.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts#L1-L100). Production uses the main deployment’s catalog/HDR/decoder trees via [apps/partpreview/vite.config.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/vite.config.ts#L23-L40). Generate the accepted IDs with the same part parser, not a second guess at renderability:

```typescript
// vite/previewManifest.ts L70-L81
// ... enclosing context omitted
  // Defensive de-dupe: nothing in Core repeats a `<Part Id>`, but a manifest with a
  // duplicated id would make a wiki render the same entry twice, and the cost is nil.
  const part_ids = [...new Set(parts.map((p) => p.id))].sort((a, b) => a.localeCompare(b));

  return {
    part_ids,
    // ALL nine presets, `'room'` included. `'room'` is the procedural studio — it is
    // what the viewer shows when no `skybox_id` is given, and accepting it explicitly
    // means a wiki can round-trip whichever value it read out of this manifest.
    skybox_ids: ENVIRONMENT_PRESETS.map((p) => p.id),
    ksa_build: readKsaBuild(assetsDir),
  };
// ... enclosing context omitted
```

Check the built manifest, load one listed part, exercise controls, then leave the scene idle and verify no stale pixels after an asynchronous texture completes. These checks are recommended; this article did not operate the browser.

## Complete example

The complete small viewer is [apps/partpreview/src/App.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/App.tsx#L18-L43) with URL/session inputs in [apps/partpreview/src/settings.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/partpreview/src/settings.ts#L24-L82). Reuse [src/three/RenderLoop.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts#L21-L66) and [src/state/commandStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/commandStore.ts#L42-L158) when extending the editor.

## Variations and gotchas

A missed invalidate can show stale pixels while the document is already correct. Program cache keys must describe shader modifications. The embed’s base path and shared asset deployment must agree. Importing a persistent store into the embed can leak preferences even on the same origin. Browser success establishes browser loading only, not native collision, rendering or export compatibility.

## See also

- [Topic overview](overview.md)
- [Demand-driven browser preview](../../../../mods/flexo/features/demand-driven-preview.md)
- [Command registry and mode routing](../../../../mods/flexo/features/command-registry-and-mode-routing.md)
- [Embedded part preview](../../../../mods/flexo/features/embedded-part-preview.md)
- [Validate asset XML ids and paths before launching the game (offline)](../../../assets/validation/validate-asset-xml-references/overview.md)
- [Persist user-created palettes, presets and content files](../../../persistence/user-data/persist-user-created-presets-and-content/overview.md)
