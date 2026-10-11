---
type: Game Feature
title: Project decals onto vessels, terrain and clutter
description: Draw an image, a sticker or a damage mark onto arbitrary surfaces by reconstructing the scene position from the depth buffer in the post-resolve window or a compute pass, or use the terrain's own decal modifiers
topic: project-decals-onto-scene-geometry
category: rendering
group: textures-and-decals
approaches: 4
game_types: [KSA.Rendering.RenderTarget, KSA.DecalModifierReference, KSA.TerrainReference]
lifecycle: [frame:render, render:grid, render:bloom, startup:all-mods-loaded]
demonstrated_by: [mods/unscience/features/graffiti-projected-decal-pass, mods/unscience/features/graffiti-bindless-decal-textures, mods/gatos/features/sticker-projected-decals, mods/ksarmory/features/bullet-hole-decals, mods/ksastructures/features/terrain-decal-pits]
tags: [decal, projected, depth, reverse-z, terrain, damage]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
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
  - id: ksa-cursor-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Cursor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Cursor.cs
    title: "KSA.Cursor (decompiled, build 2026.10.10.5554)"
  - id: ksa-decalmodifierreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/DecalModifierReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DecalModifierReference.cs
    title: "KSA.DecalModifierReference (decompiled, build 2026.10.10.5554)"
  - id: ksa-part-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Part.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Part.cs
    title: "KSA.Part (decompiled, build 2026.10.10.5554)"
  - id: ksa-proceduralmodifiersrenderdata-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ProceduralModifiersRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ProceduralModifiersRenderData.cs
    title: "KSA.ProceduralModifiersRenderData (decompiled, build 2026.10.10.5554)"
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
  - id: ksa-terrainreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TerrainReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TerrainReference.cs
    title: "KSA.TerrainReference (decompiled, build 2026.10.10.5554)"
  - id: ksarmory-bulletholes-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/BulletHoles.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/BulletHoles.cs
    title: "KSArmory/src/KSArmory/Ksa/BulletHoles.cs"
  - id: ksarmory-cloudpass-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/CloudPass.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/CloudPass.cs
    title: "KSArmory/src/KSArmory/Ksa/CloudPass.cs"
  - id: ksarmory-ksarmoryhole-comp
    repo: KSArmory
    path: src/KSArmory/Shaders/KSArmoryHole.comp
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Shaders/KSArmoryHole.comp
    title: "KSArmory/src/KSArmory/Shaders/KSArmoryHole.comp"
  - id: ksarmory-ksaworld-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KsaWorld.cs
    title: "KSArmory/src/KSArmory/Ksa/KsaWorld.cs"
  - id: ksastructures-ksastructuresoffice-xml
    repo: KSAStructures
    path: src/KSAStructures/KSAStructuresOffice.xml
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/KSAStructuresOffice.xml
    title: "KSAStructures/src/KSAStructures/KSAStructuresOffice.xml"
  - id: ksastructures-officeterrain-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/OfficeTerrain.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/OfficeTerrain.cs
    title: "KSAStructures/src/KSAStructures/Ksa/OfficeTerrain.cs"
  - id: unscience-decalanchors-cs
    repo: unscience
    path: graffiti.lib/DecalAnchors.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/DecalAnchors.cs
    title: "unscience/graffiti.lib/DecalAnchors.cs"
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
---

A projected (deferred-style) decal is not a mesh: it rasterises a volume, reads the scene depth under each covered pixel, rebuilds the world position, and paints where that position lies inside the volume. It therefore wraps curvature and relief on hulls, canopies, terrain and ground clutter alike. The game also has its own decal system for terrain, which changes the
ground itself rather than the picture.

## Engine background

- Seam: `RenderTarget.ResolveAttachments` [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L315), called after `GizmoPass.Run` and before `GridPass.Run` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4927-L4936) (`render:grid` window): single-sample reverse-Z depth and colour are both current and not bound as attachments.
- Alternative: a compute dispatch before bloom (`render:bloom`), with the same reverse-Z depth ([modify the HDR scene with a compute pass](../../vulkan-passes/modify-the-hdr-scene-with-a-compute-pass/overview.md)).
- Terrain: `DecalModifierReference` [current/decomp/KSA/DecalModifierReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DecalModifierReference.cs#L9) on `TerrainReference.ProceduralModifiers` / `TerrainModifiers` [current/decomp/KSA/TerrainReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TerrainReference.cs#L11-L15), consumed once at startup.
- Anchors must be recomposed per frame ([approach 6](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md)). See [the render sequence](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: unit-cube volumes, reverse-Z reconstruction](project-decals-onto-scene-geometry-1.md) | unscience | `ResolveAttachments` postfix, box per decal, bindless texture | `render:grid` | Image decals on anything; main viewport only |
| [2: sticker pass, runtime GLSL with the game library](project-decals-onto-scene-geometry-2.md) | gatos | Same seam, patch only while stickers exist | `render:grid` | Same, with geodetic anchors and picking |
| [3: procedural bullet holes by compute](project-decals-onto-scene-geometry-3.md) | ksarmory | Compute from depth, sub-part-frame storage | `render:bloom` | No texture or hook of its own; every viewport; procedural look only |
| [4: engine terrain DecalModifier](project-decals-onto-scene-geometry-4.md) | ksastructures | XML deserialized into the terrain at load | `startup:all-mods-loaded` | Real terrain change incl. physics; load window only |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Insert a custom Vulkan pass into KSA's frame](../../vulkan-passes/insert-a-custom-pass-into-render-game/overview.md), [Choose a render frame and anchor effects to bodies, parts and terrain](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md), [Upload an image or procedural pixels as a GPU texture](../upload-an-image-as-a-vulkan-texture/overview.md)
- [Include KSA's own GLSL library from a mod shader](../../../shaders/glsl-workflow/include-the-game-shader-library-in-mod-glsl/overview.md), [Turn the mouse cursor into a world ray and pick points on a construction plane](../../../ui/input/cursor-to-world-ray/overview.md)
