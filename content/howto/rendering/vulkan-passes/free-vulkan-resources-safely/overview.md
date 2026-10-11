---
type: Game Feature
title: Free mod-owned Vulkan resources without device loss
description: The GPU may still read an image or buffer for several frames after the mod stops referencing it, so stop recording first, free after frames in flight or WaitIdle, and never touch the destroyed device at game exit
topic: free-vulkan-resources-safely
category: rendering
group: vulkan-passes
approaches: 3
game_types: [RenderCore.SimpleVkTexture, KSA.ImGuiBackendVulkanImpl, KSA.Program, Core.Renderer]
lifecycle: [frame:draw-ui, frame:render, frame:prepare]
demonstrated_by: [mods/purrtty/features/vulkan-resource-teardown-discipline, mods/purrtty/features/kitty-graphics-as-imgui-vulkan-textures, mods/gatos/features/clutter-texture-override, mods/unscience/features/pebbles-asset-upload-submission, mods/unscience/features/sphinx-uv-texture-overrides, mods/unscience/features/pebbles-workshop-offscreen-preview]
tags: [vulkan, teardown, frames-in-flight, wait-idle, shutdown]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
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
  - id: gatos-cluttertexturebridge-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/ClutterTextureBridge.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/ClutterTextureBridge.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/ClutterTextureBridge.cs"
  - id: gatos-usertexturegpu-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/UserTextureGpu.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/UserTextureGpu.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/UserTextureGpu.cs"
  - id: ksa-bindlesstexturelibrary-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs
    title: "RenderCore.Systems.BindlessTextureLibrary (decompiled, build 2026.10.10.5554)"
  - id: ksa-imageex-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi.Abstractions/ImageEx.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/ImageEx.cs
    title: "Brutal.VulkanApi.Abstractions.ImageEx (decompiled, build 2026.10.10.5554)"
  - id: ksa-imguibackendvulkanimpl-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    title: "KSA.ImGuiBackendVulkanImpl (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
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
  - id: ksa-retiredresourcequeue-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/RetiredResourceQueue.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RetiredResourceQueue.cs
    title: "KSA.Rendering.RetiredResourceQueue (decompiled, build 2026.10.10.5554)"
  - id: ksa-stagingpool-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs
    title: "Brutal.VulkanApi.Abstractions.StagingPool (decompiled, build 2026.10.10.5554)"
  - id: purrtty-imagetexturecache-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/ImageTextureCache.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/ImageTextureCache.cs
    title: "purrtty/purrTTY.Display/Ghostty/ImageTextureCache.cs"
  - id: purrtty-inworldterminalinstance-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs
    title: "purrtty/purrTTY.GameMod/InWorld/InWorldTerminalInstance.cs"
  - id: purrtty-inworldterminalmanager-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/InWorldTerminalManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/InWorldTerminalManager.cs
    title: "purrtty/purrTTY.GameMod/InWorld/InWorldTerminalManager.cs"
  - id: purrtty-terminalmod-cs
    repo: purrtty
    path: purrTTY.GameMod/TerminalMod.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/TerminalMod.cs
    title: "purrtty/purrTTY.GameMod/TerminalMod.cs"
  - id: unscience-assetuploadsubmission-cs
    repo: unscience
    path: pebbles.lib/Assets/AssetUploadSubmission.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Assets/AssetUploadSubmission.cs
    title: "unscience/pebbles.lib/Assets/AssetUploadSubmission.cs"
  - id: unscience-pebblessubmod-cs
    repo: unscience
    path: pebbles.lib/PebblesSubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/PebblesSubmod.cs
    title: "unscience/pebbles.lib/PebblesSubmod.cs"
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
  - id: unscience-workshoppreview-cs
    repo: unscience
    path: pebbles.lib/Preview/WorkshopPreview.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/WorkshopPreview.cs
    title: "unscience/pebbles.lib/Preview/WorkshopPreview.cs"
---

Destroying a Vulkan object while a submitted or recorded command buffer still uses it produces `VK_ERROR_DEVICE_LOST` or an access violation. KSA submits each frame in `PostRender` and keeps two frames in flight, so an
object that was referenced in frame N may be read by the GPU during frame N+1. Mods have three working disciplines, plus one rule for the end of the process.

## Engine background

- `Renderer.MaxFramesInFlight` is 2 [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L28); the frame is recorded in `Render` and submitted in `PostRender` on `Renderer.Graphics`.
- `ImGuiBackendVulkanImpl.AddTexture` / `RemoveTexture` [current/decomp/KSA/ImGuiBackendVulkanImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs#L1119-L1131) register an image for ImGui; the descriptor pool is shared by the whole game.
- `StagingPool.Dispose` always submits and waits [current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs#L214-L218).
- `Program.Dispose` destroys the device at exit [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1470-L1484); `[StarMapUnload]` runs afterwards, so no device call is legal there.
- `RetiredResourceQueue.Retire(IDisposable)` [current/decomp/KSA.Rendering/RetiredResourceQueue.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RetiredResourceQueue.cs#L26) is the game's own public frame-stamped deferred-destroy queue, drained by `CheckQueued()` in `Program.OnFrame` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2314).
- The phases: stop in `frame:draw-ui`, the GPU reads in `frame:render` and `render:imgui`; see [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: stop recording, free later after WaitIdle](free-vulkan-resources-safely-1.md) | purrtty | Detach now, two-frame countdown, `WaitIdle`, nullable images, no device work at unload | `frame:draw-ui` | Simple and robust for runtime create/destroy; one drain per destroy |
| [2: retire by MaxFramesInFlight + 1](free-vulkan-resources-safely-2.md) | gatos | Counter-based retire queue, no idle | `frame:draw-ui`, `frame:after-on-frame` | No stall; images linger for a few frames |
| [3: publish after fence, retire after WaitIdle](free-vulkan-resources-safely-3.md) | unscience | Fenced upload, idle, swap, dispose in pre-GUI phase | `frame:draw-ui` (BeforeGui) | Atomic swaps and ImGui-safe; blocks on every change |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Recreate mod render targets when KSA rebuilds its renderer](../handle-renderer-rebuilds/overview.md), [Show a PNG or runtime-generated image in an ImGui window](../../textures-and-decals/show-an-image-in-imgui/overview.md), [Record and submit your own Vulkan work: offscreen renders and one-shot uploads](../submit-your-own-vulkan-commands/overview.md)
- [Clean up on game exit and relaunch the game from a mod](../../../getting-started/lifecycle/clean-up-on-game-exit/overview.md), [Removing Harmony patches safely at runtime and at exit](../../../patching/safety/remove-your-patches-safely-at-runtime-and-at-exit/overview.md)
