---
type: Game Feature
title: Place pieces on a grid with a snapping ghost, top-down camera and world gizmos
description: The parts of a world placement tool - cursor ray into a local frame, ray-plane cell pick, a ghost that snaps to ports, a borrowed top-down camera, and gizmos and meshes drawn into the world
topic: place-pieces-on-a-grid-with-a-ghost
category: ui
group: input
approaches: 2
game_types: [KSA.Controller, KSA.FixedController, KSA.GameViewport, KSA.GizmosRenderer, KSA.Vehicle, KSA.Celestial, KSA.SuperMeshRenderSystem, KSA.StaticMeshRenderable, KSA.Camera, KSA.Program]
lifecycle: ['frame:input', 'frame:viewports', 'frame:draw-ui', 'frame:render']
demonstrated_by: [mods/ksagolf/features/minigolf-course-builder, mods/ksacars/features/craft-mover-mouse-pick-place]
tags: [placement, grid, ghost, snapping, gizmos, camera, builder, tool]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T17:45:46Z }
status: stable
repos:
- name: KSAGolf
  git: https://github.com/LaurensDeV/KSAGolf.git
  ref: "f3e6ab72b5b963f615cb4ed41f7765a7bce42688"
- name: KSACars
  git: https://github.com/LaurensDeV/KSACars
  ref: "1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: ksa-fixedcontroller
  repo: ksa-game-assemblies
  path: current/decomp/KSA/FixedController.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs
  title: KSA.FixedController (decompiled, build 2026.10.10.5554)
- id: ksa-gameviewport
  repo: ksa-game-assemblies
  path: current/decomp/KSA/GameViewport.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs
  title: KSA.GameViewport (decompiled, build 2026.10.10.5554)
- id: ksa-gizmosrenderer
  repo: ksa-game-assemblies
  path: current/decomp/KSA/GizmosRenderer.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GizmosRenderer.cs
  title: KSA.GizmosRenderer (decompiled, build 2026.10.10.5554)
- id: ksa-supermeshrendersystem
  repo: ksa-game-assemblies
  path: current/decomp/KSA/SuperMeshRenderSystem.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
  title: KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)
- id: ksa-staticmeshrenderable
  repo: ksa-game-assemblies
  path: current/decomp/KSA/StaticMeshRenderable.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs
  title: KSA.StaticMeshRenderable (decompiled, build 2026.10.10.5554)
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
---
Interactive placement in the 3D world (a course piece, a structure, a craft) is a small pipeline: a cursor ray, a place to
intersect it with, a preview of the result, and drawing that preview where the player can see it. KSA gives you the camera, gizmo
and static-mesh primitives but no placement framework. KSAGolf's course builder is the complete example (grid, snapping ghost,
borrowed top-down view, undo and save); KSACars' craft mover is the minimal one (a ring and a line).

## Engine background

| Type | File | Role |
|---|---|---|
| `FixedController` | [current/decomp/KSA/FixedController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs) | Camera mode `Fixed`: camera at `following.GetPositionEcl() + CameraOffset` looking along `CameraRotation`; public, unsealed, virtual `OnFrame`; `Controller.OnKey`/`OnMouseButton`/`OnScroll`/`IsMouseDrag` are virtual and swallow input when they return true |
| `GameViewport` | [current/decomp/KSA/GameViewport.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs) | `FixedController { get; protected set; }`; `NextCameraMode` returns false for `Fixed` |
| `GizmosRenderer` | [current/decomp/KSA/GizmosRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GizmosRenderer.cs) | `DrawLine`, `DrawSphere` in ego space; reset each frame, rendered in the main view only |
| `SuperMeshRenderSystem` | [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L546-L554) | `ClearBuckets(viewport)` before the fill for every rendered viewport; `ViewForViewport` |
| `StaticMeshRenderable` | [current/decomp/KSA/StaticMeshRenderable.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs) | `Transform` (ego), `Draw(view)`, `CastShadows` |
| `Program.OnFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2255-L2275) | `ResetInstances`, `PrepareImGui`, `OnFrameViewports`, then the GUI hooks |

See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the frame order. In short: input and
placement run in the GUI hook (`frame:draw-ui`) while ImGui's frame is open; a borrowed camera has to be re-posed in `frame:viewports`;
gizmos submitted from the GUI hook are drawn this frame in the main view; real meshes must be submitted from a hook after `ClearBuckets`
(`frame:render`) for every viewport you want them in.

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Ray-plane cell pick, port-snapping ghost, top-down camera, gizmos and per-viewport meshes](place-pieces-on-a-grid-with-a-ghost-1.md) | KSAGolf | Local frame, ray-plane, `Ghost.At`, borrowed Fixed camera, input swallowing, `ClearBuckets` postfix | `frame:draw-ui`, `frame:viewports`, `frame:render` | Complete and testable, but touches a private backing field and four hooks |
| 2 | [Gizmo rings anchored with GetPositionEgo](place-pieces-on-a-grid-with-a-ghost-2.md) | KSACars | Rings of gizmo spheres and lines anchored with a two-instant `DrawAnchor` | `frame:draw-ui`, `frame:render` | Minimal; solid spheres and lines only, main view only |

## Choosing

- A real grid editor with real art, undo and a top-down view: approach 1.
- A "you are about to move this here" marker: approach 2.
- The cursor-to-plane maths and the stock hit queries are in [cursor to world ray](../cursor-to-world-ray/overview.md) and
  [pick objects under the cursor](../pick-objects-under-the-cursor/overview.md).

## See also

- [Share the keyboard and mouse between ImGui, mod tools and the game](../coordinate-imgui-focus-with-game-input/overview.md)
- [Build pannable, zoomable and 3D canvases inside an ImGui window](../../draw-lists/build-a-pan-zoom-canvas-in-imgui/overview.md)
- [Project world and sky positions to screen pixels and point at off-screen targets](../../../rendering/overlays/project-world-positions-to-screen/overview.md)
- [Replace a viewport's camera controller and take input through it](../../../camera/controllers/replace-a-viewport-camera-controller/overview.md)
- [Draw world-space lines and gizmos with the game's own renderers](../../../rendering/overlays/draw-world-space-lines-and-gizmos/overview.md)

