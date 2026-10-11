---
type: Game Feature
title: Reconstruct scene positions from the depth buffer and paint on them
description: How a compute pass rebuilds each pixel's camera-relative world point from reverse-Z depth to draw exact rings, hull holes and depth-tested streaks in the HDR scene without any geometry
topic: reconstruct-scene-positions-from-depth-in-a-compute-shader
category: shaders
group: compute-effects
approaches: 3
demonstrated_by: [mods/ksarmory/features/depth-painted-ground-rings, mods/ksarmory/features/bullet-hole-decals, mods/ksarmory/features/compute-shell-tracers]
game_types: [KSA.SunbloomRenderer, KSA.ViewProjection, KSA.Camera, RenderCore.ReverseDepthBufferUtils, KSA.Part, Brutal.VulkanApi.Abstractions.BufferEx, KSA.GizmosRenderer, KSA.ImageBarrierInfo]
lifecycle: ['frame:draw-ui', 'frame:celestials', 'render:bloom']
tags: [depth, reverse-z, world-position, decal, compute, ring, bullet-hole, tracer, tile-gather, ksarmory]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T18:25:27Z'}
status: stable
repos:
- {name: KSArmory, git: 'https://github.com/LaurensDeV/KSArmory.git', ref: cbd63d6d84da7a48a13641a641d3557bad216435}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-sunbloomrenderer, repo: ksa-game-assemblies, path: current/decomp/KSA/SunbloomRenderer.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SunbloomRenderer.cs', title: 'current/decomp/KSA/SunbloomRenderer.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-reversedepthbufferutils, repo: ksa-game-assemblies, path: current/decomp/RenderCore/ReverseDepthBufferUtils.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ReverseDepthBufferUtils.cs', title: 'current/decomp/RenderCore/ReverseDepthBufferUtils.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-program, repo: ksa-game-assemblies, path: current/decomp/KSA/Program.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs', title: 'current/decomp/KSA/Program.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-camera, repo: ksa-game-assemblies, path: current/decomp/KSA/Camera.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs', title: 'current/decomp/KSA/Camera.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksa-imagebarrierinfo, repo: ksa-game-assemblies, path: current/decomp/KSA.Rendering/ImageBarrierInfo.cs, resource: 'https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/ImageBarrierInfo.cs', title: 'current/decomp/KSA.Rendering/ImageBarrierInfo.cs (decompiled, build 2026.10.10.5554)'}
- {id: ksarmory-ksarmoryring, repo: KSArmory, path: src/KSArmory/Shaders/KSArmoryRing.comp, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Shaders/KSArmoryRing.comp', title: KSArmory/src/KSArmory/Shaders/KSArmoryRing.comp}
- {id: ksarmory-ksarmoryhole, repo: KSArmory, path: src/KSArmory/Shaders/KSArmoryHole.comp, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Shaders/KSArmoryHole.comp', title: KSArmory/src/KSArmory/Shaders/KSArmoryHole.comp}
- {id: ksarmory-ksarmorytracer, repo: KSArmory, path: src/KSArmory/Shaders/KSArmoryTracer.comp, resource: 'https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Shaders/KSArmoryTracer.comp', title: KSArmory/src/KSArmory/Shaders/KSArmoryTracer.comp}
---
The depth buffer is a free description of the scene: with the inverse view-projection and a pixel coordinate it gives the point in space that pixel shows, whether that is terrain, a pad, a hull or nothing (sky). A compute pass that reads it can draw things that lie on, or cling to, whatever is there, with no mesh and no terrain query. KSArmory does three different things with this: ground rings measured from the scene point, bullet holes carried on a moving sub-part, and tracer streaks depth-tested in screen space.

## Engine background

- **Where the depth is available.** `Program.RenderGame` leaves the viewport's colour image in a storage layout and its depth image in a sampled layout (`ImageBarrierInfo.Presets.StorageReadFc` and `DepthSampledReadVfc`) and then calls `SunbloomRenderer.Render` (Program.cs L4911-L4917 for the main viewport; L4584 for camera windows, L5061 for the editor view). A Harmony prefix on that method is the last place before bloom where a mod can write the HDR scene and read the depth ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4905-L4917)). The images come from `viewport.OffscreenTarget`.
- **Reverse-Z.** KSA's projection is built by `ReverseDepthBufferUtils.CreatePerspectiveFieldOfViewReverseZ`: device depth is 1 at the near plane and 0 at the far plane, so untouched sky reads 0 ([current/decomp/RenderCore/ReverseDepthBufferUtils.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ReverseDepthBufferUtils.cs#L8)).
- **The inverse matrix.** `Camera.VPInv` holds the inverse view-projection ([current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L63-L65)). Multiply `(uv * 2 - 1, deviceZ, 1)` by it and divide by `w` to get the point relative to the camera, in metres; see [Pack parameters and camera data for a compute effect](../pack-parameters-for-a-compute-effect/overview.md) for why the shader works camera-relative.
- **Image decals are a different route.** Rasterising a projected box with a texture is the decal route used by other mods; see [Project decals onto vessels, terrain and clutter](../../../rendering/textures-and-decals/project-decals-onto-scene-geometry/overview.md). The compute route here is procedural and needs no texture or mesh.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Per-ring dispatch over the ring's screen patch, anchored to the body](reconstruct-scene-positions-from-depth-in-a-compute-shader-1.md) | KSArmory | `glsl-shader` | `frame:draw-ui`, `render:bloom` | Exact at any size and angle, fixed pixel width, no terrain lookups; one dispatch per ring |
| [Tile-gathered procedural holes held in the struck sub-part's frame](reconstruct-scene-positions-from-depth-in-a-compute-shader-2.md) | KSArmory | `glsl-shader`, `vulkan-buffer` | `frame:draw-ui`, `render:bloom` | Up to 400 marks in one dispatch that follow articulated parts; needs the draw matrix and a bitmask gather |
| [Tile gather and depth-tested additive streaks](reconstruct-scene-positions-from-depth-in-a-compute-shader-3.md) | KSArmory | `glsl-shader`, `vulkan-buffer` | `frame:celestials`, `render:bloom` | Thousands of streaks that bloom; projects forward and tests depth in NDC rather than reconstructing, with gizmo lines as a fallback |

## See also

- [Depth-painted ground rings](../../../../mods/ksarmory/features/depth-painted-ground-rings.md), [Bullet-hole decals](../../../../mods/ksarmory/features/bullet-hole-decals.md), [Compute shell tracers](../../../../mods/ksarmory/features/compute-shell-tracers.md), [Compute pass before bloom](../../../../mods/ksarmory/features/compute-pass-before-bloom.md)
- [Pack parameters and camera data for a compute effect](../pack-parameters-for-a-compute-effect/overview.md), [Raymarch a local volume or analytic sky effect into the HDR scene](../raymarch-a-local-volume-into-the-hdr-scene/overview.md), [Refract and distort the rendered scene, and flash or shake it](../../screen-effects/refract-and-distort-the-scene/overview.md), [Paint into or rescale the HDR scene with a compute pass shipped as a Shader asset](../../../rendering/vulkan-passes/modify-the-hdr-scene-with-a-compute-pass/overview.md), [Project decals onto vessels, terrain and clutter](../../../rendering/textures-and-decals/project-decals-onto-scene-geometry/overview.md)
