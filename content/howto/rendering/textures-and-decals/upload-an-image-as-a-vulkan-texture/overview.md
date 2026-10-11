---
type: Game Feature
title: Upload an image or procedural pixels as a GPU texture
description: Load PNG or KTX bytes or generate pixels in code into a SimpleVkTexture with mip levels and a sampler and expose it to shaders through a bindless slot
topic: upload-an-image-as-a-vulkan-texture
category: rendering
group: textures-and-decals
approaches: 3
game_types: [RenderCore.SimpleVkTexture, Brutal.TextureApi.TextureLoader, KSA.BindlessTextures, RenderCore.Systems.BindlessTextureLibrary]
lifecycle: [frame:draw-ui, frame:viewports]
demonstrated_by: [mods/gatos/features/clutter-texture-override, mods/unscience/features/graffiti-bindless-decal-textures, mods/unscience/features/thug-life-procedural-texture]
tags: [texture, upload, bindless, mips, staging, sampler]
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
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-retiredresourcequeue-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/RetiredResourceQueue.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RetiredResourceQueue.cs
    title: "KSA.Rendering.RetiredResourceQueue (decompiled, build 2026.10.10.5554)"
  - id: ksa-simplevktexture-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/SimpleVkTexture.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/SimpleVkTexture.cs
    title: "RenderCore.SimpleVkTexture (decompiled, build 2026.10.10.5554)"
  - id: ksa-textureasset-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/TextureAsset.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/TextureAsset.cs
    title: "RenderCore.TextureAsset (decompiled, build 2026.10.10.5554)"
  - id: ksa-textureloader-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.TextureApi/TextureLoader.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.TextureApi/TextureLoader.cs
    title: "Brutal.TextureApi.TextureLoader (decompiled, build 2026.10.10.5554)"
  - id: unscience-decaltextures-cs
    repo: unscience
    path: graffiti.lib/DecalTextures.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/DecalTextures.cs
    title: "unscience/graffiti.lib/DecalTextures.cs"
  - id: unscience-graffitisubmod-cs
    repo: unscience
    path: graffiti.lib/GraffitiSubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/GraffitiSubmod.cs
    title: "unscience/graffiti.lib/GraffitiSubmod.cs"
  - id: unscience-thuglifetexturefactory-cs
    repo: unscience
    path: thug-life.lib/ThugLifeTextureFactory.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeTextureFactory.cs
    title: "unscience/thug-life.lib/ThugLifeTextureFactory.cs"
  - id: unscience-thuglifetexturepattern-cs
    repo: unscience
    path: thug-life.lib/ThugLifeTexturePattern.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeTexturePattern.cs
    title: "unscience/thug-life.lib/ThugLifeTexturePattern.cs"
---

Every texture the game samples is a `SimpleVkTexture` (image, view, allocation) reached either through a bindless slot, a descriptor set of the pipeline, or an ImGui descriptor. A mod gets bytes onto the GPU with the game's own loaders and helpers: decode with `TextureLoader`, wrap in a `TextureAsset`, build a
`SimpleVkTexture` through a staging pool, or fill an empty `SimpleVkTexture` with raw pixels.

## Engine background

- Decode: `TextureLoader.LoadFromMemory` [current/decomp/Brutal.TextureApi/TextureLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.TextureApi/TextureLoader.cs#L135), `TextureAsset` and `TextureAsset.LoadOptions` [current/decomp/RenderCore/TextureAsset.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/TextureAsset.cs#L61-L109).
- Image: `SimpleVkTexture` constructors for assets (mips, `CreateOptions`) and for raw pixels (`UploadData`) [current/decomp/RenderCore/SimpleVkTexture.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/SimpleVkTexture.cs#L131-L383).
- Bindless: `BindlessTextureLibrary.AddTexture` / `SetTexture` / `FreeTexture` [current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs#L186-L212); `Program.Instance.BindlessTextures` has 1024 slots [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L830). Shared samplers: `Program.LinearClampedSampler` and `Program.PointClampedSampler` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L468-L472).
- Timing: uploads on the main thread in `frame:draw-ui` (or `frame:viewports` for command drains); sampling in `frame:render`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: decode and re-point an existing bindless slot](upload-an-image-as-a-vulkan-texture-1.md) | gatos | `TextureLoader` + `SimpleVkTexture` + `SetTexture` | `frame:draw-ui` | Replace stock content with no shader change; one slot affects all materials |
| [2: library textures claimed into the bindless table](upload-an-image-as-a-vulkan-texture-2.md) | unscience | `AddTexture`, write-time cache, retire queue | `frame:draw-ui`, `event:load` | Shader needs only a `uint`; uses scarce slots |
| [3: procedural pixel art](upload-an-image-as-a-vulkan-texture-3.md) | unscience | Raw pixels, staging upload, nearest sampler | `frame:draw-ui` | No decoder needed; blocking submit |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Replace a game texture or model texture with a user PNG at runtime](../replace-a-game-texture-at-runtime/overview.md), [Show a PNG or runtime-generated image in an ImGui window](../show-an-image-in-imgui/overview.md), [Free mod-owned Vulkan resources without device loss](../../vulkan-passes/free-vulkan-resources-safely/overview.md), [Draw a textured quad attached to a part or the camera](../draw-a-textured-quad-in-the-world/overview.md)
