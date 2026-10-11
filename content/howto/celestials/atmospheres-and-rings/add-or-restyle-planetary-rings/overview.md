---
type: Game Feature
title: "Add planetary rings to a body or restyle existing rings at runtime"
description: "Build a PlanetaryRingsReference tree in code and assign it to a body template, or mutate an existing ring's meshes, textures and field settings, then dispose and recreate the rings renderer so the game rebuilds its baked ring data"
topic: add-or-restyle-planetary-rings
category: celestials
group: atmospheres-and-rings
approaches: 2
game_types: [KSA.PlanetaryRingsReference, KSA.PlanetaryRingsVolumeReference, KSA.RingRaymarchingStepReference, KSA.RingObjectsReference, KSA.RingLodReference, KSA.MeshFileReference, KSA.PbrMaterialReference, KSA.AstronomicalTemplate, KSA.PlanetTransparenciesRenderer, KSA.Program, KSA.StaticCelestial, KSA.DistantSphereRenderer, KSA.MeshReference, KSA.TexturePowerReference, KSA.DistanceReference, KSA.DoubleReference, KSA.TextureReference, RenderCore.Mesh.SimpleVkMesh]
lifecycle: [frame:draw-ui, frame:prepare, render:atmosphere, render:scene-opaque]
demonstrated_by: [mods/unscience/features/bloomin-onion-runtime-planetary-rings, mods/unscience/features/bloomin-onion-painted-ring-textures, mods/unscience/features/rocky-mcrock-face-ring-asset-swap, mods/unscience/features/rocky-mcrock-face-interleaved-mesh-clone, mods/unscience/features/rocky-mcrock-face-asset-catalog]
tags: [rings, saturn, renderer-rebuild, reflection, meshes, textures]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:33Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-game-assemblies-current-decomp-ksa-rendering-rings-rendering-planetaryringsrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs
    title: "KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-meshreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/MeshReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshReference.cs
    title: "KSA/MeshReference.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-planettransparenciesrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetTransparenciesRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetTransparenciesRenderer.cs
    title: "KSA/PlanetTransparenciesRenderer.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-planetaryringsreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetaryRingsReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetaryRingsReference.cs
    title: "KSA/PlanetaryRingsReference.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA/Program.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-ringlodreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RingLodReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RingLodReference.cs
    title: "KSA/RingLodReference.cs (decompiled, build 2026.10.10.5554)"
  - id: ksa-game-assemblies-current-decomp-ksa-ringobjectsreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RingObjectsReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RingObjectsReference.cs
    title: "KSA/RingObjectsReference.cs (decompiled, build 2026.10.10.5554)"
---
KSA draws only the rings that a body's XML declares (Saturn's `<Rings>` block). The whole definition is public XML-backed data on the body template (`PlanetaryRingsReference`: geometry, band and control textures, a volumetric dust layer and an instanced rock field with up to five LOD meshes and a PBR material), but the renderer **bakes it into GPU buffers when the rings renderer is constructed**. So adding or restyling a ring means two things: change the data, then make the game build a new rings renderer.

## Engine background

- Schema: `PlanetaryRingsReference` has `Inclination`, `LongitudeOfAscendingNode`, `InnerRadius`, `OuterRadius`, `Texture`, `ControlTexture`, `DetailScale`, `Volume` and `RingObjects`; `OnDataLoad` normalises the angles with `MathEx.ToDeviationAngle` and `ToCompassAngle` ([current/decomp/KSA/PlanetaryRingsReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetaryRingsReference.cs#L5-L60)). `RingObjectsReference` holds `Name`, `Thickness`, `Size`, `RenderDistance`, `Density`, `Lods` (a `RingLodReference` with a `MeshFileReference`) and `Material` ([current/decomp/KSA/RingObjectsReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RingObjectsReference.cs#L7-L31), [current/decomp/KSA/RingLodReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RingLodReference.cs#L5-L12)).
- `PlanetTransparenciesRenderer` keeps the rings renderer in the private `_ringsRenderer`, a `_ringRendererCreated` flag and `_anyRings`; `RebuildFrameResources` only calls `_ringsRenderer.RebuildFrameResources` when the flag is true, and takes the `CreateRingsRenderer` branch when it is false and `_anyRings` is true ([current/decomp/KSA/PlanetTransparenciesRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetTransparenciesRenderer.cs#L41-L71), [current/decomp/KSA/PlanetTransparenciesRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetTransparenciesRenderer.cs#L128-L152), [current/decomp/KSA/PlanetTransparenciesRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetTransparenciesRenderer.cs#L374-L430)).
- `PlanetaryRingsRenderer.PopulatePlanets` runs from its constructor and builds a `PlanetaryRingsRenderData` per ringed body; `RebuildFrameResources` recreates pipelines and frame images but never re-reads ring data ([current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs#L161-L172), [current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Rings.Rendering/PlanetaryRingsRenderer.cs#L324-L345)).
- `Program.RebuildRenderer(bool skipSwapchain = false)` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5105)) rebuilds render targets; the game's own settings button only sets `Program.RendererRebuildNeeded`, consumed at `PrepareFrame` (L2143-L2147), in `PostRender` (L2351-L2358) and in `Render` (L2445-L2450).
- Mesh classes: `MeshReference` has `Simple`, `Interleaved`, `HostPrimitives` (private set), `DevicePrimitives` and `Bind(Renderer, StagingPool)` ([current/decomp/KSA/MeshReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshReference.cs#L32-L64), [current/decomp/KSA/MeshReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshReference.cs#L137)). The ring field draws each LOD with a `SimpleVkMesh`, which only exists for meshes loaded `Simple`.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: build the reference tree, assign to the template, dispose and recreate the rings renderer](add-or-restyle-planetary-rings-1.md) | unscience | `reflection` | `frame:draw-ui`, `frame:prepare`, `render:atmosphere` | Any body gains or loses a ring, with painted band textures; short hitch, several private fields |
| [2: mutate the public ring tree, snapshot originals, recreate the rings renderer](add-or-restyle-planetary-rings-2.md) | unscience | `reflection` | `frame:draw-ui`, `frame:prepare`, `render:scene-opaque` | Swap LOD meshes, textures and field settings of existing rings; cannot add a ring |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Change loaded game data and make the renderer notice](../../../celestials/atmospheres-and-rings/change-loaded-game-data-and-make-the-renderer-notice/overview.md), [Handle renderer rebuilds](../../../rendering/vulkan-passes/handle-renderer-rebuilds/overview.md)
- [Upload an image as a Vulkan texture](../../../rendering/textures-and-decals/upload-an-image-as-a-vulkan-texture/overview.md), [Draw mod meshes with the engine renderers](../../../rendering/meshes/draw-mod-meshes-with-the-engine-renderers/overview.md)
- [Change loaded game data at runtime and make the renderer rebuild from it](../change-loaded-game-data-and-make-the-renderer-notice/overview.md) - related topic

