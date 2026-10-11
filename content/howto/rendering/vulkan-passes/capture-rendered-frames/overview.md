---
type: Game Feature
title: Capture rendered frames from KSA
description: Grab the finished scene for streaming or automated visual testing without stalling the GPU by recording a copy in the frame command buffer and reading it back when the staging slot is reused, and render part thumbnails at runtime with the game thumbnail pipeline
topic: capture-rendered-frames
category: rendering
group: vulkan-passes
approaches: 2
game_types: [KSA.Program, KSA.ScreenshotCapture, Core.Renderer, KSA.Rendering.ThumbnailCreator, KSA.Rendering.Thumbnails.ThumbnailDynamic, KSA.PartThumbnailViewport]
lifecycle: [frame:render, frame:post-render, thread:background, frame:draw-ui, frame:pre-render]
demonstrated_by: [mods/gatos/features/screen-stream-frame-capture, mods/unscience/features/parts-now-thumbnail-generation]
tags: [capture, readback, thumbnails, staging, screenshot]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-displayrenderpatch-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs"
  - id: gatos-framecapture-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/FrameCapture.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/FrameCapture.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/FrameCapture.cs"
  - id: gatos-kittyencoder-cs
    repo: gatOS
    path: gatOS.SimFs/Display/KittyEncoder.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Display/KittyEncoder.cs
    title: "gatOS/gatOS.SimFs/Display/KittyEncoder.cs"
  - id: ksa-camera-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "KSA.Camera (decompiled, build 2026.10.10.5554)"
  - id: ksa-partthumbnailviewport-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartThumbnailViewport.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartThumbnailViewport.cs
    title: "KSA.PartThumbnailViewport (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-renderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/Core/Renderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs
    title: "Core.Renderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-screenshotcapture-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ScreenshotCapture.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ScreenshotCapture.cs
    title: "KSA.ScreenshotCapture (decompiled, build 2026.10.10.5554)"
  - id: ksa-thumbnailcreator-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/ThumbnailCreator.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/ThumbnailCreator.cs
    title: "KSA.Rendering.ThumbnailCreator (decompiled, build 2026.10.10.5554)"
  - id: ksa-thumbnaildynamic-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Thumbnails/ThumbnailDynamic.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Thumbnails/ThumbnailDynamic.cs
    title: "KSA.Rendering.Thumbnails.ThumbnailDynamic (decompiled, build 2026.10.10.5554)"
  - id: unscience-partthumbnailgenerator-cs
    repo: unscience
    path: parts-now.lib/Runtime/PartThumbnailGenerator.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/PartThumbnailGenerator.cs
    title: "unscience/parts-now.lib/Runtime/PartThumbnailGenerator.cs"
  - id: unscience-thumbnailreadback-cs
    repo: unscience
    path: parts-now.lib/Runtime/ThumbnailReadback.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/ThumbnailReadback.cs
    title: "unscience/parts-now.lib/Runtime/ThumbnailReadback.cs"
---

Reading pixels back from the GPU safely means recording a copy into a command buffer and not reading the destination before the GPU is done. KSA offers its own `ScreenshotCapture` for scripted screenshots; for a live stream or
for images the game has no API for (a runtime part thumbnail) mods record their own copies. Two techniques are demonstrated: appending the copy to the engine's frame command buffer and reading each slot back when the engine reuses it, and rendering a
thumbnail on a private command buffer with a fence wait.

## Engine background

- The end of `RenderGame` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4945-L4955): offscreen colour to `SampledReadVfc`, `_screenshotCapture.OnRenderGameCapture`, AA passes, swapchain pass with composite and ImGui, swapchain grab, `End()`.
- `ScreenshotCapture` [current/decomp/KSA/ScreenshotCapture.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ScreenshotCapture.cs#L272) sets `Renderer.ExtentOverride` [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L42) for scaled captures and triggers renderer rebuilds.
- `ThumbnailCreator` [current/decomp/KSA.Rendering/ThumbnailCreator.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/ThumbnailCreator.cs#L12) and `ThumbnailDynamic` [current/decomp/KSA.Rendering.Thumbnails/ThumbnailDynamic.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Thumbnails/ThumbnailDynamic.cs#L12) render part thumbnails with a `PartThumbnailViewport` [current/decomp/KSA/PartThumbnailViewport.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartThumbnailViewport.cs#L6).
- Slots: `MaxFramesInFlight` is 2 [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L28), `Program.ResourceFrameIndex` indexes the slot.
- Phases: see [the render sequence of the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence). Driving `ScreenshotCapture` itself is covered in take-screenshots-from-code (other category).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: transpiler before the final End](capture-rendered-frames-1.md) | gatos | Blit and copy recorded in the frame buffer, per-slot staging ring, background encode | `frame:render`, `thread:background` | No stall, no second submit; fragile IL anchor, latency of a couple of frames |
| [2: ThumbnailCreator framing and per-frame submit](capture-rendered-frames-2.md) | unscience | Game thumbnail helpers, private pool, fence wait, optional readback | `frame:draw-ui` before `frame:pre-render` | Reuses game framing; blocks the main thread per part |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Insert a custom Vulkan pass into KSA's frame](../insert-a-custom-pass-into-render-game/overview.md), [Recreate mod render targets when KSA rebuilds its renderer](../handle-renderer-rebuilds/overview.md), [Record and submit your own Vulkan work: offscreen renders and one-shot uploads](../submit-your-own-vulkan-commands/overview.md), [Reserve or grow game GPU buffers for content added at runtime](../../meshes/grow-game-gpu-buffers-for-runtime-content/overview.md), [Take clean screenshots from code, with a composed camera shot held for the capture](../../../testing-and-tooling/in-game-testing/take-screenshots-from-code/overview.md)
