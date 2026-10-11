---
type: Game Feature
title: Render ImGui UI into a Vulkan texture for use in the 3D world
description: Run a second ImGui context and a second Vulkan ImGui backend on a mod-owned render pass so a whole UI becomes an image shown in the scene or in another window, or put a live camera feed on a part
topic: render-imgui-into-a-texture
category: rendering
group: textures-and-decals
approaches: 3
game_types: [KSA.ImGuiBackendVulkanImpl, Brutal.ImGuiApi.ImGui, RenderCore.SimpleVkTexture, KSA.Part, KSA.IViewport, RenderCore.Systems.BindlessTextureLibrary, KSA.Rendering.RenderTarget]
lifecycle: [startup:all-mods-loaded, frame:draw-ui, frame:celestials, frame:after-on-frame, frame:render]
demonstrated_by: [mods/purrtty/features/offscreen-imgui-context-render-to-texture, mods/ksastructures/features/viewport-image-on-monitor, mods/purrtty/features/world-space-quad-pipeline-custom-shader, mods/purrtty/features/ray-pick-focus-for-world-quads]
tags: [imgui, render-to-texture, secondary-context, live-screen, monitor, world-ui]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-bindlesstexturelibrary-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs
    title: "RenderCore.Systems.BindlessTextureLibrary (decompiled, build 2026.10.10.5554)"
  - id: ksa-cursor-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Cursor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Cursor.cs
    title: "KSA.Cursor (decompiled, build 2026.10.10.5554)"
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
  - id: ksa-partmodelrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartModelRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelRenderer.cs
    title: "KSA.PartModelRenderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-renderimage-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/RenderImage.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderImage.cs
    title: "KSA.Rendering.RenderImage (decompiled, build 2026.10.10.5554)"
  - id: ksa-viewportregistry-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ViewportRegistry.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ViewportRegistry.cs
    title: "KSA.ViewportRegistry (decompiled, build 2026.10.10.5554)"
  - id: ksastructures-ksaworld-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/KsaWorld.cs
    title: "KSAStructures/src/KSAStructures/Ksa/KsaWorld.cs"
  - id: ksastructures-officecomputer-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/OfficeComputer.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/OfficeComputer.cs
    title: "KSAStructures/src/KSAStructures/Ksa/OfficeComputer.cs"
  - id: purrtty-inworldquad-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs"
  - id: purrtty-inworldterminalmanager-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/InWorldTerminalManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/InWorldTerminalManager.cs
    title: "purrtty/purrTTY.GameMod/InWorld/InWorldTerminalManager.cs"
  - id: purrtty-offscreenimguibackend-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs
    title: "purrtty/purrTTY.GameMod/InWorld/OffscreenImGuiBackend.cs"
  - id: purrtty-offscreenimguicontext-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/OffscreenImGuiContext.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/OffscreenImGuiContext.cs
    title: "purrtty/purrTTY.GameMod/InWorld/OffscreenImGuiContext.cs"
  - id: purrtty-offscreenrendertarget-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs
    title: "purrtty/purrTTY.GameMod/InWorld/OffscreenRenderTarget.cs"
  - id: purrtty-perframerenderer-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/PerFrameRenderer.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/PerFrameRenderer.cs
    title: "purrtty/purrTTY.GameMod/InWorld/PerFrameRenderer.cs"
  - id: purrtty-sharedquadresource-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs"
---

A screen on a part, a dashboard on a wall, a terminal in a cockpit: the UI has to exist as a texture. Two routes work. Draw your own UI into a mod-owned image with a second ImGui context and backend, or reuse an image the game already renders (a secondary viewport's colour image) and only re-point a texture slot. The image is then shown by re-pointing a bindless slot on an existing
material, by a mod-owned quad pipeline, or by a projected quad on an ImGui draw list.

## Engine background

- `ImGuiBackendVulkanImpl` [current/decomp/KSA/ImGuiBackendVulkanImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendVulkanImpl.cs) (render-pass-based, installs itself into the current context's IO; `AddTexture` / `RemoveTexture` for descriptor sets) and `ImGuiBackend.Vulkan` [current/decomp/KSA/ImGuiBackend.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackend.cs#L23).
- Secondary viewports: `ViewportRegistry.TryOpenSecondaryViewport` [current/decomp/KSA/ViewportRegistry.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ViewportRegistry.cs#L180); their colour image is recorded before the main view in `RenderGame` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4672-L4683).
- Bindless re-point: `BindlessTextureLibrary.SetTexture` [current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs#L201).
- Picking: `Cursor.GetEgoRay(IViewport)` [current/decomp/KSA/Cursor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Cursor.cs).
- Phases: the off-screen UI renders in `frame:draw-ui`; quads sample in `frame:render`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: secondary ImGui context, second backend, fence ring](render-imgui-into-a-texture-1.md) | purrtty | `imgui-window`, own render pass and submit | `frame:draw-ui` | Any UI, fully yours; extra submit per changed frame, context-switching care |
| [2: bindless re-point to a viewport's colour image](render-imgui-into-a-texture-2.md) | ksastructures | `SetTexture` plus projected `AddImageQuad` overlay | `frame:draw-ui`, `frame:celestials` | No pipeline, occluded correctly on the mesh; image is a camera, not a UI |
| [3: world-space quad with ray-pick focus](render-imgui-into-a-texture-3.md) | purrtty | Premultiplied quad pipeline, ray picking | `frame:draw-ui`, `frame:input`, `frame:render` | Interactive in the world; own pipeline and input gating |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Record and submit your own Vulkan work: offscreen renders and one-shot uploads](../../vulkan-passes/submit-your-own-vulkan-commands/overview.md), [Draw a textured quad attached to a part or the camera](../draw-a-textured-quad-in-the-world/overview.md), [Choose a render frame and anchor effects to bodies, parts and terrain](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- [Share the keyboard and mouse between ImGui, mod tools and the game](../../../ui/input/coordinate-imgui-focus-with-game-input/overview.md), [Turn the mouse cursor into a world ray and pick points on a construction plane](../../../ui/input/cursor-to-world-ray/overview.md)
