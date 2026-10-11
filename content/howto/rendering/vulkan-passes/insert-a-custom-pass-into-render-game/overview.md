---
type: Game Feature
title: Insert a custom Vulkan pass into KSA's frame
description: KSA records one frame as scene, resolve, bloom and composite stages, and a mod can hook a stage boundary with a Harmony postfix or prefix, or rewrite RenderGame, to record its own work where depth, colour and light are in the state it needs
topic: insert-a-custom-pass-into-render-game
category: rendering
group: vulkan-passes
approaches: 5
game_types: [KSA.Program, KSA.SuperMeshRenderSystem, KSA.Rendering.RenderTarget, KSA.SunbloomRenderer]
lifecycle: [frame:render, render:scene-opaque, render:translucency, render:grid, render:bloom, render:post-process]
demonstrated_by: [mods/unscience/features/graffiti-projected-decal-pass, mods/gatos/features/sticker-projected-decals, mods/unscience/features/thug-life-textured-quad-render-pass, mods/gatos/features/thug-life-world-space-quad, mods/purrtty/features/draw-after-translucency-pass-postfix, mods/ksarmory/features/compute-pass-before-bloom, mods/ksastructures/features/underground-dark-compute-pass, mods/shaderextensions/features/rendergame-render-pass-transpiler, mods/shaderextensions/features/pre-imgui-post-processing, mods/shaderextensions/features/post-imgui-global-post-shaders]
tags: [vulkan, render-pass, harmony, render-game, scene, translucency, bloom]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: ShaderExtensions
    git: https://github.com/AMPW-german/ShaderExtensions.git
    ref: 6a2eb66ea85bcaa2d4657e502a4f75e92693ea77
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
  - id: gatos-stickerdecalrenderer-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerDecalRenderer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerDecalRenderer.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerDecalRenderer.cs"
  - id: gatos-stickerrenderpatches-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerRenderPatches.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerRenderPatches.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/Stickers/StickerRenderPatches.cs"
  - id: gatos-thuglifequadrenderer-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-rendertarget-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/RenderTarget.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs
    title: "KSA.Rendering.RenderTarget (decompiled, build 2026.10.10.5554)"
  - id: ksa-sunbloomrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SunbloomRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SunbloomRenderer.cs
    title: "KSA.SunbloomRenderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-supermeshrendersystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: "KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)"
  - id: ksarmory-cloudpass-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/CloudPass.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/CloudPass.cs
    title: "KSArmory/src/KSArmory/Ksa/CloudPass.cs"
  - id: ksarmory-cloudpasshook-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/CloudPassHook.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/CloudPassHook.cs
    title: "KSArmory/src/KSArmory/Ksa/CloudPassHook.cs"
  - id: ksastructures-darkpass-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/DarkPass.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/DarkPass.cs
    title: "KSAStructures/src/KSAStructures/Ksa/DarkPass.cs"
  - id: ksastructures-ksastructuresdark-comp
    repo: KSAStructures
    path: src/KSAStructures/Shaders/KSAStructuresDark.comp
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Shaders/KSAStructuresDark.comp
    title: "KSAStructures/src/KSAStructures/Shaders/KSAStructuresDark.comp"
  - id: purrtty-inworldquad-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs"
  - id: purrtty-rendertranslucencypasspatch-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Patches/RenderTranslucencyPassPatch.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Patches/RenderTranslucencyPassPatch.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Patches/RenderTranslucencyPassPatch.cs"
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
  - id: unscience-decalrenderer-cs
    repo: unscience
    path: graffiti.lib/DecalRenderer.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/DecalRenderer.cs
    title: "unscience/graffiti.lib/DecalRenderer.cs"
  - id: unscience-decalshaders-cs
    repo: unscience
    path: graffiti.lib/DecalShaders.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/DecalShaders.cs
    title: "unscience/graffiti.lib/DecalShaders.cs"
  - id: unscience-graffitipatches-cs
    repo: unscience
    path: graffiti.lib/GraffitiPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/GraffitiPatches.cs
    title: "unscience/graffiti.lib/GraffitiPatches.cs"
  - id: unscience-thuglifequadrenderer-cs
    repo: unscience
    path: thug-life.lib/ThugLifeQuadRenderer.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeQuadRenderer.cs
    title: "unscience/thug-life.lib/ThugLifeQuadRenderer.cs"
  - id: unscience-thugliferendermanager-cs
    repo: unscience
    path: thug-life.lib/ThugLifeRenderManager.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeRenderManager.cs
    title: "unscience/thug-life.lib/ThugLifeRenderManager.cs"
  - id: unscience-thugliferenderpatches-cs
    repo: unscience
    path: thug-life.lib/ThugLifeRenderPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeRenderPatches.cs
    title: "unscience/thug-life.lib/ThugLifeRenderPatches.cs"
---

`Program.RenderGame` records the whole frame into one primary command buffer on the main thread. There is no renderer
registry, event or delegate list inside it: a mod that wants its own draws or dispatches in the frame patches a
specific call that already exists. Which call decides what the mod can read (single-sample depth, HDR colour, light
images), whether a rendering scope is open, and whether its content is depth-tested, anti-aliased, bloomed or tonemapped.

## Engine background

`RenderGame` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4646-L4955) runs, in order: prepass, ambient occlusion, shadows, planet generation, an
opaque offscreen scope (sky, planets, part models, `SuperMeshRenderSystem.RenderMainPass` at L4839, gizmo meshes), particles,
ocean, atmosphere, exhaust, translucency (`RenderTranslucencyPass` at L4901, then the colour-only resolve), `SunbloomRenderer.Render`
(L4915), overall bloom, orbit lines, gizmos, a full resolve (`RenderTarget.ResolveAttachments` L4932), grid, gauges, AA, and then the
swapchain render pass with the composite and ImGui. The authoritative step table is the
[render sequence of the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

- Target and pass types: `RenderTarget.ResolveAttachments` [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L315),
  `SuperMeshRenderSystem.RenderMainPass` [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L388) and `RenderTranslucencyPass`
  [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L459), `SunbloomRenderer.Render` [current/decomp/KSA/SunbloomRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SunbloomRenderer.cs#L326).
- Steps 1 to 22 use dynamic rendering or compute on offscreen targets; only the composite and ImGui are inside the single
  swapchain render pass, where scopes and copies are illegal.
- Hooks run once per call, not once per frame: secondary viewports and the editor reach the same sub-renderers.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: postfix ResolveAttachments](insert-a-custom-pass-into-render-game-1.md) | unscience, gatOS | `harmony-postfix` | `render:grid` window | Single-sample depth is sampleable (decals); no depth test, must filter viewports |
| [2: postfix RenderMainPass](insert-a-custom-pass-into-render-game-2.md) | unscience, gatOS | `harmony-postfix` | `render:scene-opaque` | Draws in the open MSAA scope, depth-tested; pipeline must match the target |
| [3: postfix RenderTranslucencyPass](insert-a-custom-pass-into-render-game-3.md) | purrtty | `harmony-postfix` | `render:translucency` | Composites after atmosphere and plumes; needs own scope and barriers |
| [4: prefix SunbloomRenderer.Render](insert-a-custom-pass-into-render-game-4.md) | ksarmory, ksastructures | `harmony-prefix` | `render:bloom` | Compute on HDR colour before bloom; public method, no IL matching |
| [5: transpile RenderGame](insert-a-custom-pass-into-render-game-5.md) | shaderextensions | `harmony-transpiler` | `render:post-process`, `render:imgui` | Only way around the swapchain pass; fragile, one mod per anchor |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Draw a textured quad attached to a part or the camera](../../textures-and-decals/draw-a-textured-quad-in-the-world/overview.md), [Project decals onto vessels, terrain and clutter](../../textures-and-decals/project-decals-onto-scene-geometry/overview.md), [Paint into or rescale the HDR scene with a compute pass shipped as a Shader asset](../modify-the-hdr-scene-with-a-compute-pass/overview.md), [Build a Vulkan pipeline compatible with KSA's scene render target](../build-a-vulkan-pipeline-for-the-scene-target/overview.md), [Capture rendered frames from KSA](../capture-rendered-frames/overview.md)
- [Choose between pre-ImGui (HDR scene) and post-ImGui (final frame) post-processing](../../../shaders/post-processing/choose-pre-or-post-imgui-post-processing/overview.md)
