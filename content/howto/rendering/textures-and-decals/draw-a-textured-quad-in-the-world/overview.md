---
type: Game Feature
title: Draw a textured quad attached to a part or the camera
description: Put an image, sticker, screen or pixel sprite into the 3D scene as a world-space quad with depth testing, tied to a part transform or a view-space billboard
topic: draw-a-textured-quad-in-the-world
category: rendering
group: textures-and-decals
approaches: 3
game_types: [KSA.SuperMeshRenderSystem, KSA.Program, KSA.Part, RenderCore.SimpleVkTexture]
lifecycle: [frame:render, render:scene-opaque, render:translucency, frame:draw-ui]
demonstrated_by: [mods/unscience/features/thug-life-textured-quad-render-pass, mods/unscience/features/thug-life-procedural-texture, mods/gatos/features/thug-life-world-space-quad, mods/purrtty/features/world-space-quad-pipeline-custom-shader, mods/purrtty/features/draw-after-translucency-pass-postfix, mods/purrtty/features/anchor-quad-to-part-or-camera]
tags: [quad, billboard, texture, world-space, part-anchor, pipeline]
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
  - id: gatos-thuglifemanager-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeManager.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeManager.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeManager.cs"
  - id: gatos-thuglifequadrenderer-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeQuadRenderer.cs"
  - id: gatos-thugliferenderpatches-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeRenderPatches.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeRenderPatches.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/ThugLife/ThugLifeRenderPatches.cs"
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
  - id: ksa-supermeshrendersystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: "KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
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
  - id: purrtty-sharedquadresource-cs
    repo: purrtty
    path: purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs
    title: "purrtty/purrTTY.GameMod/InWorld/Display/SharedQuadResource.cs"
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
  - id: unscience-thuglifetexturefactory-cs
    repo: unscience
    path: thug-life.lib/ThugLifeTextureFactory.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeTextureFactory.cs
    title: "unscience/thug-life.lib/ThugLifeTextureFactory.cs"
---

A quad in the world needs three decisions: **when** it is recorded (inside the opaque pass, depth-tested and anti-aliased with the scene, or after the translucency pass so atmosphere cannot overwrite it), **what pipeline** draws it (the stock unlit shaders, or your own for premultiplied alpha), and **what it is attached to** (a part's ego matrix, composed
every frame, or the camera's view space). All three approaches reuse the stock `UnlitMesh.vert` and a push-constant MVP.

## Engine background

- Hooks: `SuperMeshRenderSystem.RenderMainPass` [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L388) (inside the opaque scope, step 9) and `RenderTranslucencyPass` [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L459) (step 14); both fire once per rendered viewport. See [the render sequence of the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).
- Pipeline: `RenderTarget.SetupGraphicsPipeline` [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L356-L392) or a hand-chained rendering create-info.
- Anchors: `Vehicle.GetMatrixAsmb2Ego(camera)` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L1270), `Part.PositionEgo`, `Part.Asmb2Ego`; `Camera.MVP.viewProjection` / `.projection` for billboards.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: opaque pixel quads with stock shaders](draw-a-textured-quad-in-the-world-1.md) | unscience | `RenderMainPass` postfix, geometry as transparency | `render:scene-opaque` | Simple and depth-correct; no real alpha, capped texel count |
| [2: single textured quad, own plumbing](draw-a-textured-quad-in-the-world-2.md) | gatos | Same hook, patch installed on demand, camera mask | `render:scene-opaque` | Minimal; same alpha limits |
| [3: premultiplied translucent quad after translucency](draw-a-textured-quad-in-the-world-3.md) | purrtty | Custom shader, reopened scope, part or camera anchor, ray picking | `render:translucency` | True translucency and interaction; more pipeline and barrier code |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Insert a custom Vulkan pass into KSA's frame](../../vulkan-passes/insert-a-custom-pass-into-render-game/overview.md), [Build a Vulkan pipeline compatible with KSA's scene render target](../../vulkan-passes/build-a-vulkan-pipeline-for-the-scene-target/overview.md), [Choose a render frame and anchor effects to bodies, parts and terrain](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md), [Upload an image or procedural pixels as a GPU texture](../upload-an-image-as-a-vulkan-texture/overview.md), [Render ImGui UI into a Vulkan texture for use in the 3D world](../render-imgui-into-a-texture/overview.md), [Turn the mouse cursor into a world ray and pick points on a construction plane](../../../ui/input/cursor-to-world-ray/overview.md)
