---
type: Game Feature
title: Composite an image over a stock texture
description: Two ways to put a user image on top of a game texture, a CPU blend at run time over a re-transcoded stock source and an offline script that writes a modified copy to ship
topic: composite-png-over-stock-texture
category: assets
group: models-and-textures
approaches: 2
demonstrated_by: [mods/unscience/features/free-fallin-canopy-texture-compositing, mods/realatmospheres/features/texture-and-phase-asset-scripts]
game_types: [KSA.TextureReference, KSA.GpuTextureSystem, KSA.GpuTextureAssetRef, KSA.AssetManager, Brutal.TextureApi.TextureLoader, Brutal.TextureApi.Abstractions.GenericTexture, RenderCore.TextureAsset]
lifecycle: ['frame:draw-ui', 'event:load', 'startup:asset-load']
tags: [texture, composite, decal, ktx2, offline]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:16:11Z'}
status: stable
repos:
- {name: unscience, git: 'https://github.com/meow-sci/unscience.git', ref: 1829b3b298dd0fa5a67342cafff29074c8c29286}
- {name: RealAtmospheres, git: 'https://github.com/Brimfyr/RealAtmospheres.git', ref: 19dc37a55b2e359bd8eec2f5b41722ab11ae0c46}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-texturereference, repo: ksa-game-assemblies, path: current/decomp/KSA/TextureReference.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs', title: 'current/decomp/KSA/TextureReference.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-texturemanifest, repo: ksa-game-assemblies, path: current/decomp/KSA/TextureManifest.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureManifest.cs', title: 'current/decomp/KSA/TextureManifest.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-textureasset, repo: ksa-game-assemblies, path: current/decomp/RenderCore/TextureAsset.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/TextureAsset.cs', title: 'current/decomp/RenderCore/TextureAsset.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-textureloader, repo: ksa-game-assemblies, path: current/decomp/Brutal.TextureApi/TextureLoader.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.TextureApi/TextureLoader.cs', title: 'current/decomp/Brutal.TextureApi/TextureLoader.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-gputexturesystem, repo: ksa-game-assemblies, path: current/decomp/KSA/GpuTextureSystem.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuTextureSystem.cs', title: 'current/decomp/KSA/GpuTextureSystem.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-assetmanager, repo: ksa-game-assemblies, path: current/decomp/KSA/AssetManager.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetManager.cs', title: 'current/decomp/KSA/AssetManager.cs (decompiled, build 2026.10.10.5554)'}
- {id: unscience-canopymaterialcontroller, repo: unscience, path: free-fallin.lib/CanopyMaterialController.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin.lib/CanopyMaterialController.cs', title: 'unscience: free-fallin.lib/CanopyMaterialController.cs'}
- {id: unscience-canopygpuassets, repo: unscience, path: free-fallin.lib/CanopyGpuAssets.cs, resource: 'https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin.lib/CanopyGpuAssets.cs', title: 'unscience: free-fallin.lib/CanopyGpuAssets.cs'}
- {id: ksa-earth-normal, repo: ksa-game-assemblies, path: current/Content/Core/Textures/Earth_Normal.toml, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Textures/Earth_Normal.toml', title: current/Content/Core/Textures/Earth_Normal.toml (build 2026.10.10.5554)}
- {id: ksa-gputextureassetref, repo: ksa-game-assemblies, path: current/decomp/KSA/GpuTextureAssetRef.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuTextureAssetRef.cs', title: 'current/decomp/KSA/GpuTextureAssetRef.cs (decompiled, build 2026.10.10.5554)'}
- {id: realatmospheres-make-venus-detail, repo: RealAtmospheres, path: make_venus_detail.py, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/make_venus_detail.py', title: 'RealAtmospheres: make_venus_detail.py'}
- {id: realatmospheres-release-files, repo: RealAtmospheres, path: release-files.txt, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/release-files.txt', title: 'RealAtmospheres: release-files.txt'}
- {id: realatmospheres-credits, repo: RealAtmospheres, path: CREDITS.md, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/CREDITS.md', title: 'RealAtmospheres: CREDITS.md'}
- {id: realatmospheres-make-jupiter-mask, repo: RealAtmospheres, path: make_jupiter_mask.py, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/make_jupiter_mask.py', title: 'RealAtmospheres: make_jupiter_mask.py'}
- {id: realatmospheres-make-giant-flowmaps, repo: RealAtmospheres, path: make_giant_flowmaps.py, resource: 'https://github.com/Brimfyr/RealAtmospheres/blob/19dc37a55b2e359bd8eec2f5b41722ab11ae0c46/make_giant_flowmaps.py', title: 'RealAtmospheres: make_giant_flowmaps.py'}
---

A livery, decal or tweaked mask has to be applied to a stock texture, but at run time the stock texture may not be a bitmap. Free Fallin's comment records that stock vessel textures are KTX2 files kept GPU-ready as BC7 on the build it targeted, and the loader (the sidecar `.toml` and the transcode format) decides what the CPU sees. To blend pixels you
re-open the source file and ask for an uncompressed (RGBA32) transcode; to change the texture for everyone, write the modified copy offline and ship it.

## Engine background

- `TextureReference.DoLoad` loads a `TextureAsset` with `TextureAsset.LoadOptions(format, transcode)`, defaults `R8G8B8A8UNorm` and `Rgba32`, overridable by a sidecar `.toml` (`max`, `mipMaps`, `format`, `scblockformatfamily`); `Bind` creates a `SimpleVkTexture` and a bindless handle
  ([current/decomp/KSA/TextureReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs#L84-L156), [current/decomp/KSA/TextureManifest.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureManifest.cs), [current/decomp/RenderCore/TextureAsset.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/TextureAsset.cs#L109-L121)).
- `TextureLoader.LoadFromFile` / `LoadFromMemory` return an `ITexture` (`ImageData`, `RowPitch`, `Extent`) ([current/decomp/Brutal.TextureApi/TextureLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.TextureApi/TextureLoader.cs#L111-L141)).
- `GpuTextureSystem.TryAddTexture` builds a GPU texture, binds it and registers a `GpuTextureAssetRef`; its registry is the protected `AssetManager<T>.AssetMap` ([current/decomp/KSA/GpuTextureSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GpuTextureSystem.cs#L100-L116), [current/decomp/KSA/AssetManager.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetManager.cs#L9-L20)).
- Phases: `frame:draw-ui` / `event:load` for the runtime route; `startup:asset-load` for the offline route. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Blend a PNG decal over a transcoded stock texture on the CPU and register it with GpuTextureSystem](composite-png-over-stock-texture-1.md) | unscience (Free Fallin) | CPU decal blended over a transcoded stock albedo, registered with `GpuTextureSystem`, ownership tracked | `frame:draw-ui`, `event:load` | Per-player images at run time; hitch per Apply, reflection into `AssetMap` |
| [Write a modified copy of a stock texture with an offline script](composite-png-over-stock-texture-2.md) | RealAtmospheres | Offline script writes a modified copy of a stock texture from the install | `startup:asset-load` | Zero run-time cost; redistribution caveat, one fixed result |

## See also

- [Upload an image or procedural pixels as a GPU texture](../../../rendering/textures-and-decals/upload-an-image-as-a-vulkan-texture/overview.md), [Replace a game texture or model texture with a user PNG at runtime](../../../rendering/textures-and-decals/replace-a-game-texture-at-runtime/overview.md), [Build searchable lists, two-pane browsers and file pickers in ImGui](../../../ui/windows/build-searchable-lists-and-browsers/overview.md),
  [Customise parachutes: swap canopy materials and lift the diameter limits](../../../vehicles-and-parts/modules-and-resources/customize-parachute-materials-and-limits/overview.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](../declare-gltf-and-pbr-material-assets/overview.md), [Define atmospheres, scattering and cloud layers for a body in system XML](../../../celestials/atmospheres-and-rings/define-atmospheres-and-cloud-layers-in-system-xml/overview.md)
- [Runtime canopy textures from PNGs, CPU compositing over a BC7 stock texture, and owned GPU assets](../../../../mods/unscience/features/free-fallin-canopy-texture-compositing.md), [Texture and phase asset scripts](../../../../mods/realatmospheres/features/texture-and-phase-asset-scripts.md)
