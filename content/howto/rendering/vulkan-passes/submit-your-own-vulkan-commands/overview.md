---
type: Game Feature
title: "Record and submit your own Vulkan work: offscreen renders and one-shot uploads"
description: One-shot uploads, offscreen renders and ImGui-to-texture need command buffers the game does not own, so pick the pool, fence and queue lock that neither stall nor auto-submit half-recorded work
topic: submit-your-own-vulkan-commands
category: rendering
group: vulkan-passes
approaches: 4
game_types: [RenderCore.StagingPool, Brutal.VulkanApi.Queue, KSA.Program, RenderCore.SimpleVkTexture, KSA.ImGuiBackendVulkanImpl, Core.Renderer]
lifecycle: [frame:draw-ui, frame:dispatch-solvers, frame:pre-render, render:imgui]
demonstrated_by: [mods/unscience/features/pebbles-asset-upload-submission, mods/purrtty/features/offscreen-imgui-context-render-to-texture, mods/unscience/features/parts-now-thumbnail-generation, mods/unscience/features/pebbles-workshop-offscreen-preview]
tags: [vulkan, command-buffer, fence, staging, offscreen, upload]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
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
  - id: ksa-camera-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "KSA.Camera (decompiled, build 2026.10.10.5554)"
  - id: ksa-imguibackendvulkanimpl-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    title: "KSA.ImGuiBackendVulkanImpl (decompiled, build 2026.10.10.5554)"
  - id: ksa-partselectedrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartSelectedRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartSelectedRenderer.cs
    title: "KSA.PartSelectedRenderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-partthumbnailviewport-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartThumbnailViewport.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartThumbnailViewport.cs
    title: "KSA.PartThumbnailViewport (decompiled, build 2026.10.10.5554)"
  - id: ksa-queue-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi/Queue.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/Queue.cs
    title: "Brutal.VulkanApi.Queue (decompiled, build 2026.10.10.5554)"
  - id: ksa-renderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/Core/Renderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs
    title: "Core.Renderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-simplevktexture-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/SimpleVkTexture.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/SimpleVkTexture.cs
    title: "RenderCore.SimpleVkTexture (decompiled, build 2026.10.10.5554)"
  - id: ksa-stagingpool-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs
    title: "Brutal.VulkanApi.Abstractions.StagingPool (decompiled, build 2026.10.10.5554)"
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
  - id: ksa-vkutils-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/VkUtils.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/VkUtils.cs
    title: "RenderCore.VkUtils (decompiled, build 2026.10.10.5554)"
  - id: purrtty-offscreenimguibackend-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs
    title: "purrtty/purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs"
  - id: purrtty-perframerenderer-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/PerFrameRenderer.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/PerFrameRenderer.cs
    title: "purrtty/purrTTY.GameMod/InWorld/PerFrameRenderer.cs"
  - id: unscience-assetuploadsubmission-cs
    repo: unscience
    path: pebbles.lib/Assets/AssetUploadSubmission.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Assets/AssetUploadSubmission.cs
    title: "unscience/pebbles.lib/Assets/AssetUploadSubmission.cs"
  - id: unscience-glbtextures-cs
    repo: unscience
    path: pebbles.lib/Assets/GlbTextures.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Assets/GlbTextures.cs
    title: "unscience/pebbles.lib/Assets/GlbTextures.cs"
  - id: unscience-partthumbnailgenerator-cs
    repo: unscience
    path: parts-now.lib/Runtime/PartThumbnailGenerator.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/PartThumbnailGenerator.cs
    title: "unscience/parts-now.lib/Runtime/PartThumbnailGenerator.cs"
  - id: unscience-previewpipeline-cs
    repo: unscience
    path: pebbles.lib/Preview/PreviewPipeline.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/PreviewPipeline.cs
    title: "unscience/pebbles.lib/Preview/PreviewPipeline.cs"
  - id: unscience-previewscene-cs
    repo: unscience
    path: pebbles.lib/Preview/PreviewScene.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/PreviewScene.cs
    title: "unscience/pebbles.lib/Preview/PreviewScene.cs"
  - id: unscience-previewtarget-cs
    repo: unscience
    path: pebbles.lib/Preview/PreviewTarget.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/PreviewTarget.cs
    title: "unscience/pebbles.lib/Preview/PreviewTarget.cs"
  - id: unscience-staticmodelresources-textures-cs
    repo: unscience
    path: sphinx.lib/StaticModelResources.Textures.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/sphinx.lib/StaticModelResources.Textures.cs
    title: "unscience/sphinx.lib/StaticModelResources.Textures.cs"
  - id: unscience-thumbnailreadback-cs
    repo: unscience
    path: parts-now.lib/Runtime/ThumbnailReadback.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/ThumbnailReadback.cs
    title: "unscience/parts-now.lib/Runtime/ThumbnailReadback.cs"
  - id: unscience-workshop-frag-glsl
    repo: unscience
    path: pebbles.lib/Preview/Workshop.frag.glsl
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/Workshop.frag.glsl
    title: "unscience/pebbles.lib/Preview/Workshop.frag.glsl"
  - id: unscience-workshoppreview-cs
    repo: unscience
    path: pebbles.lib/Preview/WorkshopPreview.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/WorkshopPreview.cs
    title: "unscience/pebbles.lib/Preview/WorkshopPreview.cs"
---

Everything the game draws is recorded into one primary command buffer per frame in flight and submitted in
`PostRender`. A mod that needs the GPU to do something outside that command buffer (upload a texture, render
a preview, draw a UI into an image, read a thumbnail back) must record and submit a command buffer of its
own. The decisions are which pool owns the buffer, how completion is observed, and when it is safe to publish
or destroy the result.

## Engine background

- `StagingPool` [current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs#L7-L238) allocates staging buffers and
  command buffers; `Dispose` always calls `Submit()` and `Wait()`, so a pool whose command buffer was
  half-recorded would submit it. Use it as a memory allocator only.
- `VkUtils.StageAndUploadToBuffer` [current/decomp/RenderCore/VkUtils.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/VkUtils.cs#L82-L106) and `SimpleVkTexture.UploadData`
  [current/decomp/RenderCore/SimpleVkTexture.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/SimpleVkTexture.cs#L374-L383) record into a command buffer you pass in.
- `Queue.Submit` takes the queue lock [current/decomp/Brutal.VulkanApi/Queue.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/Queue.cs#L77-L83); the frame is submitted to
  the same `Renderer.Graphics` queue in `PostRender`. `MaxFramesInFlight` is 2 [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L28).
- `ImGuiBackendVulkanImpl.AddTexture` / `RemoveTexture` [current/decomp/KSA/ImGuiBackendVulkanImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs#L1119-L1131)
  register an image view as an ImGui texture.
- Frame phases involved: the pre-GUI prefix of `OnDrawUiFrame` (`frame:draw-ui`), `OnPreRender`
  (`frame:pre-render`), and the ImGui pass at step 25 of `RenderGame` (`render:imgui`). See
  [the render sequence of the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: private command buffer and fence](submit-your-own-vulkan-commands-1.md) | unscience | `StagingPool` for memory only, blocking fence wait | `frame:draw-ui` (BeforeGui) | Simple and cancellable; blocks the main thread per submission |
| [2: command pool, fence ring, locked submit](submit-your-own-vulkan-commands-2.md) | purrtty | Re-recorded slot ring, no steady-state wait | `frame:draw-ui` (AfterGui) | Per-frame work without stalls; needs correct sync with the consumer |
| [3: transient pool for readback and thumbnails](submit-your-own-vulkan-commands-3.md) | unscience | Game thumbnail pipeline, fence wait, optional readback | `frame:draw-ui` before `frame:pre-render` | Reuses game framing; shares a camera slice with the hover preview |
| [4: private images, runtime GLSL](submit-your-own-vulkan-commands-4.md) | unscience | Free-standing pipeline, `WaitIdle` before publishing | `frame:draw-ui` + `render:imgui` | Full control of an offscreen scene; drains the GPU on change frames |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Free mod-owned Vulkan resources without device loss](../free-vulkan-resources-safely/overview.md), [Capture rendered frames from KSA](../capture-rendered-frames/overview.md), [Render ImGui UI into a Vulkan texture for use in the 3D world](../../textures-and-decals/render-imgui-into-a-texture/overview.md), [Build a Vulkan pipeline compatible with KSA's scene render target](../build-a-vulkan-pipeline-for-the-scene-target/overview.md)
