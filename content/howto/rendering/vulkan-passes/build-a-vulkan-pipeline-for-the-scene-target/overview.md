---
type: Game Feature
title: Build a Vulkan pipeline compatible with KSA's scene render target
description: A pipeline recorded inside KSA's scene pass must match its colour and depth formats, sample count and dynamic-rendering setup, and offscreen work of the mod's own needs a standalone render-pass-less pipeline
topic: build-a-vulkan-pipeline-for-the-scene-target
category: rendering
group: vulkan-passes
approaches: 3
game_types: [KSA.Program, KSA.Rendering.RenderTarget, RenderCore.ShaderModuleUtils, KSA.ShaderReference]
lifecycle: [frame:draw-ui, frame:render, render:scene-opaque, render:translucency]
demonstrated_by: [mods/unscience/features/thug-life-textured-quad-render-pass, mods/gatos/features/thug-life-world-space-quad, mods/purrtty/features/world-space-quad-pipeline-custom-shader, mods/unscience/features/pebbles-workshop-offscreen-preview]
tags: [vulkan, pipeline, dynamic-rendering, scene-target, glsl]
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
  - id: ksa-shadermoduleutils-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/ShaderModuleUtils.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ShaderModuleUtils.cs
    title: "RenderCore.ShaderModuleUtils (decompiled, build 2026.10.10.5554)"
  - id: purrtty-inworldquad-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/InWorldQuad.cs"
  - id: purrtty-sharedquadresource-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs"
  - id: unscience-previewpipeline-cs
    repo: unscience
    path: pebbles.lib/Preview/PreviewPipeline.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/PreviewPipeline.cs
    title: "unscience/pebbles.lib/Preview/PreviewPipeline.cs"
  - id: unscience-previewtarget-cs
    repo: unscience
    path: pebbles.lib/Preview/PreviewTarget.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/PreviewTarget.cs
    title: "unscience/pebbles.lib/Preview/PreviewTarget.cs"
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
  - id: unscience-workshop-frag-glsl
    repo: unscience
    path: pebbles.lib/Preview/Workshop.frag.glsl
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Preview/Workshop.frag.glsl
    title: "unscience/pebbles.lib/Preview/Workshop.frag.glsl"
---

Since KSA moved the scene to Vulkan dynamic rendering there is no `VkRenderPass` to be compatible with: a pipeline is
compatible with a scope when the formats of its `VkPipelineRenderingCreateInfo` and its sample count match the attachments
that scope renders into. Pipelines for the scene must be built against the scene target; pipelines for the mod's own images
are free-standing.

## Engine background

- `Program.OffscreenTarget` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L456) is a `RenderTarget` with `ColorAttachment`, `DepthAttachment` and `Samples`
  [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L40-L57).
- `RenderTarget.SetupGraphicsPipeline(ref VkGraphicsPipelineCreateInfo)` [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L356-L392) stamps the
  rendering create-info, the sample count and a null render pass.
- `ShaderModuleUtils.FromString` / `FromFile` [current/decomp/RenderCore/ShaderModuleUtils.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ShaderModuleUtils.cs#L79) compile GLSL with the bundled shaderc, with default
  include callbacks.
- The target exists only after `ModLibrary.LoadAll`; at `startup:all-mods-loaded` it is null. Scene draws happen in the phases listed in
  [the render sequence of the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence): opaque (step 9, MSAA scope) and translucency (step 14).
- GLSL compile helpers for shaders and includes: [compile GLSL at runtime](../../../shaders/glsl-workflow/compile-glsl-at-runtime/overview.md) and [include the game shader library in mod GLSL](../../../shaders/glsl-workflow/include-the-game-shader-library-in-mod-glsl/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: SetupGraphicsPipeline, created lazily](build-a-vulkan-pipeline-for-the-scene-target-1.md) | unscience, gatOS | Game helper stamps formats, stock unlit shaders | `render:scene-opaque` | Least code; blend and fragment behaviour limited to presets and stock shaders |
| [2: hand-built dynamic-rendering pipeline](build-a-vulkan-pipeline-for-the-scene-target-2.md) | purrtty | Chained rendering info, custom premultiplied fragment shader | `render:translucency` | Full control of blend; you own the shader module and must track the target |
| [3: standalone targets and pipeline](build-a-vulkan-pipeline-for-the-scene-target-3.md) | unscience | Own images, embedded GLSL | none (private command buffer) | No coupling to the scene; no scene depth or lighting |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Insert a custom Vulkan pass into KSA's frame](../insert-a-custom-pass-into-render-game/overview.md), [Draw a textured quad attached to a part or the camera](../../textures-and-decals/draw-a-textured-quad-in-the-world/overview.md), [Recreate mod render targets when KSA rebuilds its renderer](../handle-renderer-rebuilds/overview.md), [Paint into or rescale the HDR scene with a compute pass shipped as a Shader asset](../modify-the-hdr-scene-with-a-compute-pass/overview.md)
- [Compile and write GLSL at runtime for a mod's own pipeline](../../../shaders/glsl-workflow/compile-glsl-at-runtime/overview.md), [Include KSA's own GLSL library from a mod shader](../../../shaders/glsl-workflow/include-the-game-shader-library-in-mod-glsl/overview.md)
