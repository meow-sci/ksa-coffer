---
type: Game Feature
title: Recreate mod render targets when KSA rebuilds its renderer
description: KSA recreates swapchain-sized targets on resize, MSAA changes and high-resolution screenshots, so mod pipelines and images tied to those extents must be rebuilt at the same point
topic: handle-renderer-rebuilds
category: rendering
group: vulkan-passes
approaches: 3
game_types: [KSA.Program, Core.Renderer, KSA.Rendering.RenderTarget]
lifecycle: [frame:prepare, frame:render, frame:post-render]
demonstrated_by: [mods/shaderextensions/features/renderer-rebuild-hook, mods/purrtty/features/vulkan-resource-teardown-discipline, mods/unscience/features/pebbles-private-clutter-materials]
tags: [vulkan, rebuild, resize, swapchain, msaa, screenshot]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: ShaderExtensions
    git: https://github.com/AMPW-german/ShaderExtensions.git
    ref: 6a2eb66ea85bcaa2d4657e502a4f75e92693ea77
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
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
  - id: purrtty-inworldquad-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs"
  - id: purrtty-inworldterminalinstance-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs
    title: "purrtty/purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs"
  - id: purrtty-offscreenrendertarget-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs
    title: "purrtty/purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs"
  - id: shaderextensions-globalpostshaderhandler-cs
    repo: ShaderExtensions
    path: ShaderExtensions/PostProcessing/PostImgui/GlobalPostShaderHandler.cs
    resource: https://github.com/AMPW-german/ShaderExtensions/blob/6a2eb66ea85bcaa2d4657e502a4f75e92693ea77/ShaderExtensions/PostProcessing/PostImgui/GlobalPostShaderHandler.cs
    title: "ShaderExtensions/ShaderExtensions/PostProcessing/PostImgui/GlobalPostShaderHandler.cs"
  - id: shaderextensions-patches-cs
    repo: ShaderExtensions
    path: ShaderExtensions/Patches.cs
    resource: https://github.com/AMPW-german/ShaderExtensions/blob/6a2eb66ea85bcaa2d4657e502a4f75e92693ea77/ShaderExtensions/Patches.cs
    title: "ShaderExtensions/ShaderExtensions/Patches.cs"
  - id: shaderextensions-postprocessinghandler-cs
    repo: ShaderExtensions
    path: ShaderExtensions/PostProcessing/PreImgui/PostProcessingHandler.cs
    resource: https://github.com/AMPW-german/ShaderExtensions/blob/6a2eb66ea85bcaa2d4657e502a4f75e92693ea77/ShaderExtensions/PostProcessing/PreImgui/PostProcessingHandler.cs
    title: "ShaderExtensions/ShaderExtensions/PostProcessing/PreImgui/PostProcessingHandler.cs"
  - id: unscience-clutterhooks-cs
    repo: unscience
    path: pebbles.lib/Runtime/ClutterHooks.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Runtime/ClutterHooks.cs
    title: "unscience/pebbles.lib/Runtime/ClutterHooks.cs"
  - id: unscience-clutterresources-cs
    repo: unscience
    path: pebbles.lib/Runtime/ClutterResources.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Runtime/ClutterResources.cs
    title: "unscience/pebbles.lib/Runtime/ClutterResources.cs"
  - id: unscience-clutterretirement-cs
    repo: unscience
    path: pebbles.lib/Runtime/ClutterRetirement.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Runtime/ClutterRetirement.cs
    title: "unscience/pebbles.lib/Runtime/ClutterRetirement.cs"
---

The game rebuilds its render targets whenever the window size, present mode or MSAA setting changes, and for high-resolution screenshots. Every view, descriptor and pipeline a mod created against those
targets becomes stale. The mod can follow the game (hook the rebuild), or avoid the problem by owning targets the game never rebuilds.

## Engine background

- `Program.RebuildRenderer(bool skipSwapchain = false)` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5105-L5145): rebuild the swapchain, `Device.WaitIdle()`, resize the main viewport, rebuild `_offscreenTarget`, rebuild every renderer that holds
  views onto it, re-create the composite descriptor.
- Callers: `PrepareFrame` (`frame:prepare`), `Render` on a failed acquire (`frame:render`), `PostRender` on resize (`frame:post-render`), `ScreenshotCapture` for scaled captures; `Program.ScheduleRendererRebuild()` requests one.
- `Renderer.ExtentOverride` [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L42) replaces `Renderer.Extent` during a high-resolution capture [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L96).
- `MaxFramesInFlight` is 2 [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L28), which bounds how long an old image may still be read after a mod stops recording it.
- The full phase list is in [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: postfix RebuildRenderer](handle-renderer-rebuilds-1.md) | shaderextensions | `harmony-postfix` plus forced first rebuild and extent check | `frame:prepare`, `frame:render`, `frame:post-render` | Follows every game rebuild; stalls on `WaitIdle` and has no shutdown path |
| [2: rebuild in place on a live size change](handle-renderer-rebuilds-2.md) | purrtty | Pending resize, countdown, `WaitIdle`, rewrite descriptor | `frame:draw-ui`, `frame:render` | Safe for mod-owned sizes; does not follow game rebuilds |
| [3: re-create the private material pipeline](handle-renderer-rebuilds-3.md) | unscience | Prefix and finalizer re-enter a thread-static construction scope | `frame:dispatch-solvers`, rebuild phases | Keeps mod redirection through game rebuilds; fragile to game code changes |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Free mod-owned Vulkan resources without device loss](../free-vulkan-resources-safely/overview.md), [Build a Vulkan pipeline compatible with KSA's scene render target](../build-a-vulkan-pipeline-for-the-scene-target/overview.md), [Capture rendered frames from KSA](../capture-rendered-frames/overview.md)
