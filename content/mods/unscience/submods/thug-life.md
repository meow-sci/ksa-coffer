---
type: Submod
title: "Thug Life"
description: "Draws the pixel-art sunglasses meme as a textured quad anchored to any vessel part or kitten face, recorded with stock unlit shaders inside the scene's opaque pass from a postfix on SuperMeshRenderSystem.RenderMainPass"
mod: unscience
submod: thug-life
mod_id: thug-life
tags: [rendering, vulkan, textured-quad, procedural-texture, part-anchor, harmony]
categories: [rendering]
features: [mods/unscience/features/thug-life-procedural-texture, mods/unscience/features/thug-life-textured-quad-render-pass]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T11:56:31Z }
status: stable
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: thug-life-readme-md
    repo: unscience
    path: thug-life/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/README.md
    title: thug-life/README.md
  - id: thug-life-lib-readme-md
    repo: unscience
    path: thug-life.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/README.md
    title: thug-life.lib/README.md
  - id: scope-pixel-grids-and-render-md
    repo: unscience
    path: scope/pixel-grids-and-render.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/pixel-grids-and-render.md
    title: scope/pixel-grids-and-render.md
  - id: thug-life-mod-toml
    repo: unscience
    path: thug-life/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/mod.toml
    title: thug-life/mod.toml
  - id: thug-life-mod-cs
    repo: unscience
    path: thug-life/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/Mod.cs
    title: thug-life/Mod.cs
  - id: thug-life-patcher-cs
    repo: unscience
    path: thug-life/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/Patcher.cs
    title: thug-life/Patcher.cs
  - id: thug-life-lib-thugliferenderpatches-cs
    repo: unscience
    path: thug-life.lib/ThugLifeRenderPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeRenderPatches.cs
    title: thug-life.lib/ThugLifeRenderPatches.cs
  - id: thug-life-lib-thuglifesubmod-persistence-cs
    repo: unscience
    path: thug-life.lib/ThugLifeSubmod.Persistence.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeSubmod.Persistence.cs
    title: thug-life.lib/ThugLifeSubmod.Persistence.cs
---

Thug Life ("Thug Life - Sunglasses Anchor") is the repository's minimal worked example of custom Vulkan
drawing inside KSA's own render pass. A 15x4 sunglasses texture is generated from an ASCII pattern (no image
file ships), uploaded as a `SimpleVkTexture`, and drawn as a quad anchored to a part or sub-part in its local
frame, using the game's stock `UnlitMesh` shaders. GPU resources are created lazily on first use because the
offscreen target does not exist at load time. An "animate thug" button slides a pre-tuned pair onto an EVA
kitten's face.

## Hosting

- Manifest id `thug-life`, entry assembly `MeowSci.ThugLife` (development host only).
- Standalone host: F12 toggles the window; its Patcher applies `HotkeyGuard` and `ThugLifeRenderPatches`.
- In unscience: `ThugLifeSubmod` is constructed in `Mod.cs` and `Patcher.cs` applies
  `ThugLifeRenderPatches` (the same shared `Apply`/`Remove` pair).

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Upload a procedural pixel-art texture and cut it out with geometry](../features/thug-life-procedural-texture.md) | rendering | `frame:draw-ui` | Thug Life builds its sunglasses image from an ASCII grid into an R8G8B8A8 SimpleVkTexture with a staging upload and a nearest-neighbour sampler, and emits one small quad per opaque texel because the stock unlit shader always writes alpha 1 |
| [Draw a part-anchored textured quad inside the scene's opaque pass](../features/thug-life-textured-quad-render-pass.md) | rendering | `render:scene-opaque`, `frame:draw-ui`, `startup:all-mods-loaded` | Thug Life postfixes SuperMeshRenderSystem.RenderMainPass to record its own Vulkan draws with the stock UnlitMesh shaders into the offscreen MSAA pass, builds its pipeline lazily against Program.OffscreenTarget, and computes an ego-space MVP per entry from the camera of the viewport being rendered |

## Library classes

`ThugLifeSubmod` (+ `.Persistence`), `ThugLifeRenderManager` (static active instance for the render
postfix; entry list and lazily created GPU resources), `ThugLifeQuadRenderer` (pipeline, descriptor, vertex
and index buffers, per-frame MVP), `ThugLifeTextureFactory`, `ThugLifeTexturePattern`, `ThugLifeRenderPatches`,
`ThugLifeEntry`, `ThugLifeSlide`, `KittenGlassesPreset`.

## Scene saves and persistence

Record `thug-life` (default order 100): per quad, its anchor as a
[stable part reference](../features/lib-save-part-identity.md), position, rotation, size and visibility.
Reset removes entries but keeps the shared renderer resources; a missing anchor keeps the record retained
with a warning. No render resources are serialized.

## Further reading

- [thug-life/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/README.md)
- [thug-life.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/README.md)
- [scope/pixel-grids-and-render.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/pixel-grids-and-render.md)

## Entry points

- [thug-life/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/mod.toml)
- [thug-life/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/Mod.cs)
- [thug-life/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life/Patcher.cs)
- [thug-life.lib/ThugLifeRenderPatches.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeRenderPatches.cs)
- [thug-life.lib/ThugLifeSubmod.Persistence.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/thug-life.lib/ThugLifeSubmod.Persistence.cs)

## See also

- [unscience overview](../overview.md)
- [Graffiti](./graffiti.md) (projected decals, another custom render pass)
- [Humble Arteest](./humble-arteest.md)
