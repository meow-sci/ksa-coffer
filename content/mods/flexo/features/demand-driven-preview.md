---
type: Mod Feature
title: Demand-driven browser preview
description: Coalesce scene invalidations into requested frames while adapting KSA material channels for a Three.js preview
mod: flexo
category: rendering
tags:
  - flexo
  - asset-authoring
techniques:
  - on-demand-rendering
  - shader-adaptation
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
  - id: flexo-src-three-renderloop
    repo: flexo
    path: src/three/RenderLoop.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts
    title: src/three/RenderLoop.ts
  - id: flexo-src-three-materialfactory
    repo: flexo
    path: src/three/MaterialFactory.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts
    title: src/three/MaterialFactory.ts
  - id: flexo-src-three-normalmappatch
    repo: flexo
    path: src/three/normalMapPatch.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/normalMapPatch.ts
    title: src/three/normalMapPatch.ts
---

Flexo renders an editor viewport when a change requires new pixels. Its browser material adapter helps inspect authored assets without embedding the game renderer.

## How it works

RenderLoop.invalidate schedules a requestAnimationFrame only when none is pending. The tick clears the handle before drawing; continuous mode rearms before draw, allowing invalidations during draw to coalesce. Dispose cancels the pending frame and rejects subsequent requests. Every scene mutation, control change, resize and asynchronous asset completion must arrange invalidation.

The material factory binds KSA channel roles to Three.js material inputs. Its shader adapter reconstructs the missing normal Z component from two channels, negates the normal X component and adds a grayscale emissive contribution using the authored red channel. Patch flags form the program cache key. This is a browser approximation for inspecting geometry and materials, not a replacement for KSA lighting and rendering validation.[^flexo-src-three-renderloop][^flexo-src-three-materialfactory][^flexo-src-three-normalmappatch]

## Lifecycle and timing

All rendering occurs in browser requestAnimationFrame callbacks during tool:authoring. Idle scenes need no repeated drawing. No StarMap hook, Vulkan command buffer or live game renderer is used.

## Key code

| Source | Role |
|---|---|
| [src/three/RenderLoop.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts#L1-L66) | Coalesced frame requests and disposal |
| [src/three/MaterialFactory.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts#L73-L103) | Assign diffuse, ORM, normal and emissive channels |
| [src/three/normalMapPatch.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/normalMapPatch.ts#L27-L60) | Two-channel normal reconstruction and emissive-mask shader adaptation |

## Snippets

```typescript
// src/three/RenderLoop.ts L36-L59
  invalidate(): void {
    if (this.disposed || this.handle !== 0) return;
    this.handle = requestAnimationFrame(this.tick);
  }

  /**
   * Holds the loop open at display refresh rate. Only for the cases that genuinely
   * need a frame per vsync regardless of change — today just the FPS overlay, whose
   * reading would be meaningless (and alarming) against an on-demand loop.
   */
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
```

## Game APIs touched

This mechanism operates on browser-owned project data and has no direct game API calls. The generated content is handled by the native asset exporter.

## Pitfalls and version notes

A missed invalidation leaves a stale viewport even though the data changed. Texture channel adaptation does not establish full visual equivalence: scene lighting, tone mapping, renderer paths and game material behavior can differ. The continuous flag must be released when its diagnostic use ends, and the loop disposed when the viewport is destroyed.

## See also

- [material and ktx2 pipeline](material-and-ktx2-pipeline.md)
- [coordinate transform bridge](coordinate-transform-bridge.md)
- [embedded part preview](embedded-part-preview.md)
- [Build an on-demand browser preview with shared commands](../../../howto/testing-and-tooling/offline-tests/build-a-browser-asset-preview/build-a-browser-asset-preview.md) - how-to article demonstrating this feature

[^flexo-src-three-renderloop]: [src/three/RenderLoop.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/RenderLoop.ts#L1-L66)
[^flexo-src-three-materialfactory]: [src/three/MaterialFactory.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/MaterialFactory.ts#L73-L103)
[^flexo-src-three-normalmappatch]: [src/three/normalMapPatch.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/normalMapPatch.ts#L27-L60)
