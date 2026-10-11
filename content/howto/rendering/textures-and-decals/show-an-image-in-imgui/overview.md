---
type: Game Feature
title: Show a PNG or runtime-generated image in an ImGui window
description: Decode or build pixels, upload them as a Vulkan texture, register with the ImGui Vulkan backend and draw with ImGui.Image or a draw list, then update, evict and release the texture without crashing a frame in flight
topic: show-an-image-in-imgui
category: rendering
group: textures-and-decals
approaches: 2
game_types: [RenderCore.SimpleVkTexture, Brutal.TextureApi.TextureLoader, KSA.ImGuiBackendVulkanImpl, RenderCore.TextureAsset]
lifecycle: [startup:immediate-load, frame:draw-ui, render:imgui]
demonstrated_by: [mods/compendium/features/logo-image-as-imgui-texture, mods/purrtty/features/kitty-graphics-as-imgui-vulkan-textures]
tags: [imgui, image, texture, descriptor-pool, upload]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: Compendium
    git: https://github.com/meow-sci/Compendium.git
    ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: compendium-cdmloadphotos-cs
    repo: Compendium
    path: src/CdmLoadPhotos.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmLoadPhotos.cs
    title: "Compendium/src/CdmLoadPhotos.cs"
  - id: compendium-compendiummain-cs
    repo: Compendium
    path: src/CompendiumMain.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CompendiumMain.cs
    title: "Compendium/src/CompendiumMain.cs"
  - id: ksa-imdrawlistextensions-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
    title: "Brutal.ImGuiApi.ImDrawListExtensions (decompiled, build 2026.10.10.5554)"
  - id: ksa-imgui-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi/ImGui.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs
    title: "Brutal.ImGuiApi.ImGui (decompiled, build 2026.10.10.5554)"
  - id: ksa-imguibackend-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiBackend.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackend.cs
    title: "KSA.ImGuiBackend (decompiled, build 2026.10.10.5554)"
  - id: ksa-imguibackendvulkanimpl-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs
    title: "KSA.ImGuiBackendVulkanImpl (decompiled, build 2026.10.10.5554)"
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
  - id: ksa-textureasset-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/TextureAsset.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/TextureAsset.cs
    title: "RenderCore.TextureAsset (decompiled, build 2026.10.10.5554)"
  - id: purrtty-imagetexturecache-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/ImageTextureCache.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/ImageTextureCache.cs
    title: "purrtty/purrTTY.Display/Ghostty/ImageTextureCache.cs"
---

ImGui draws images by `ImTextureRef`, which in KSA's Vulkan backend is a raw descriptor-set handle. A mod gets an image into a window by producing a `SimpleVkTexture`, asking the backend for a descriptor set (`AddTexture`) and passing the returned reference to `ImGui.Image` or `ImDrawListPtr.AddImage`. The cost is lifetime management: the descriptor pool is shared by the whole game,
and the GPU may sample an image for several frames after the mod stops drawing it.

## Engine background

- `ImGuiBackendVulkanImpl.AddTexture` / `RemoveTexture` [current/decomp/KSA/ImGuiBackendVulkanImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs#L1119-L1131); the backend is `ImGuiBackend.Vulkan` with a 1000-set pool [current/decomp/KSA/ImGuiBackend.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackend.cs#L15).
- `ImGui.Image` [current/decomp/Brutal.ImGuiApi/ImGui.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs#L6359) and `ImDrawListExtensions.AddImage` [current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs#L611) record the texture reference into draw data; the ImGui render pass samples it at step 25 of `RenderGame` (`render:imgui`).
- Upload: `TextureAsset` and `SimpleVkTexture` [current/decomp/RenderCore/SimpleVkTexture.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/SimpleVkTexture.cs#L131), `StagingPool` [current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi.Abstractions/StagingPool.cs#L214-L218). See [the render sequence](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: one static PNG, uploaded once](show-an-image-in-imgui-1.md) | compendium | `TextureAsset` -> `SimpleVkTexture` -> `AddTexture` -> `ImGui.Image` | `startup:immediate-load`, `frame:draw-ui` | Twenty lines; never released |
| [2: many changing images, in-place refresh and LRU eviction](show-an-image-in-imgui-2.md) | purrtty | Texture cache, content versions, deferred delete | `frame:draw-ui`, `render:imgui` | Safe for video-like use; more bookkeeping |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Upload an image or procedural pixels as a GPU texture](../upload-an-image-as-a-vulkan-texture/overview.md), [Free mod-owned Vulkan resources without device loss](../../vulkan-passes/free-vulkan-resources-safely/overview.md), [Record and submit your own Vulkan work: offscreen renders and one-shot uploads](../../vulkan-passes/submit-your-own-vulkan-commands/overview.md)
