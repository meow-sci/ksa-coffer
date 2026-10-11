---
type: Game Feature
title: Replace a game texture or model texture with a user PNG at runtime
description: Swap what an existing material samples by re-pointing the bindless slot the game already uses or by rebuilding a mod-owned mesh resource with a PNG override and live UV remap, and give mod-built render objects a private material buffer
topic: replace-a-game-texture-at-runtime
category: rendering
group: textures-and-decals
approaches: 3
game_types: [RenderCore.Systems.BindlessTextureLibrary, KSA.TextureReference, RenderCore.SimpleVkTexture, KSA.ClutterRenderer, KSA.Program]
lifecycle: [frame:viewports, frame:draw-ui, frame:render, frame:dispatch-solvers]
demonstrated_by: [mods/gatos/features/clutter-texture-override, mods/unscience/features/sphinx-uv-texture-overrides, mods/unscience/features/pebbles-private-clutter-materials]
tags: [texture, replace, bindless, material, uv, clutter]
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
  - id: ksa-groundclutterrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GroundClutterRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterRenderer.cs
    title: "KSA.GroundClutterRenderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-texturereference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TextureReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs
    title: "KSA.TextureReference (decompiled, build 2026.10.10.5554)"
  - id: unscience-cluttergraph-cs
    repo: unscience
    path: pebbles.lib/Runtime/ClutterGraph.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/pebbles.lib/Runtime/ClutterGraph.cs
    title: "unscience/pebbles.lib/Runtime/ClutterGraph.cs"
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
  - id: unscience-sphinxsubmod-editing-cs
    repo: unscience
    path: sphinx.lib/SphinxSubmod.Editing.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/sphinx.lib/SphinxSubmod.Editing.cs
    title: "unscience/sphinx.lib/SphinxSubmod.Editing.cs"
  - id: unscience-staticgeometry-cs
    repo: unscience
    path: sphinx.lib/StaticGeometry.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/sphinx.lib/StaticGeometry.cs
    title: "unscience/sphinx.lib/StaticGeometry.cs"
  - id: unscience-staticmodelresources-textures-cs
    repo: unscience
    path: sphinx.lib/StaticModelResources.Textures.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/sphinx.lib/StaticModelResources.Textures.cs
    title: "unscience/sphinx.lib/StaticModelResources.Textures.cs"
  - id: unscience-texturemapping-cs
    repo: unscience
    path: sphinx.lib/TextureMapping.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/sphinx.lib/TextureMapping.cs
    title: "unscience/sphinx.lib/TextureMapping.cs"
---

Game textures are reached through bindless slots stored in material data. To change what an existing material shows, either write a different image view into the slot it already uses (cheap, but it changes every material using that slot), or, for objects the mod builds itself, own the resource and replace it. Where a mod must create new materials next to stock ones, it can redirect the
game's own lookups while it constructs its objects.

## Engine background

- `TextureReference` [current/decomp/KSA/TextureReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs#L20) claims a slot in `DoLoad` (`AddTexture`, L149) and exposes `BindlessHandle` and `ImageView`; `BindlessTextureLibrary.SetTexture(handle, imageView, layout)` [current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs#L201) rewrites a slot (update-after-bind, partially bound [current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Systems/BindlessTextureLibrary.cs#L22)).
- Ground clutter materials: `GroundClutterRenderer.MaterialBuffer` [current/decomp/KSA/GroundClutterRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterRenderer.cs#L320) and `GetMaterialIndex`, bound into pipelines when `ClutterEcotypeRenderData` creates its renderers.
- Timing: slot writes in `frame:draw-ui` before the scene records; sampling in `frame:render`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: SetTexture on the stock slot, deferred destruction](replace-a-game-texture-at-runtime-1.md) | gatos | `bindless-slot-swap` | `frame:viewports`, `frame:draw-ui` | Instant and reversible, no patches; affects every material using the slot |
| [2: PNG override rebuilds the private resource; UV remap re-uploads vertices](replace-a-game-texture-at-runtime-2.md) | unscience | Private resource, original vertices kept | `frame:draw-ui` | Per-object control; blocking uploads and `WaitIdle` |
| [3: thread-static construction context](replace-a-game-texture-at-runtime-3.md) | unscience | Transpiler and prefix redirection, shader variant | `frame:dispatch-solvers` | Private materials beside stock; fragile to game code changes |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Upload an image or procedural pixels as a GPU texture](../upload-an-image-as-a-vulkan-texture/overview.md), [Free mod-owned Vulkan resources without device loss](../../vulkan-passes/free-vulkan-resources-safely/overview.md), [Recreate mod render targets when KSA rebuilds its renderer](../../vulkan-passes/handle-renderer-rebuilds/overview.md)
- [Patch vehicle paint and canopy shaders in memory at compile time](../../../shaders/stock-shaders/patch-game-shaders-in-memory-at-compile-time/overview.md)
