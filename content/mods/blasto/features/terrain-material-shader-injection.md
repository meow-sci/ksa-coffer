---
type: Mod Feature
title: Terrain material shader injection
description: Inject persistent surface marks before native terrain lighting while carrying displaced
  positions and filtering procedural radial streaks
mod: blasto
category: shaders
tags:
  - blasto
  - shaders
  - glsl-shader
  - vulkan-pipeline
techniques:
  - glsl-shader
  - vulkan-pipeline
game_types:
  - KSA.ShaderReference
  - RenderCore.Shaders.ShaderCompilerResolve
lifecycle:
  - event:renderer-build
  - render:planet
hooks:
  - harmony-postfix KSA.PlanetRenderer.BuildRenderPipeline
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:37:06Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: transform
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainShaderSource.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainShaderSource.cs
    title: Unique text anchors and procedural material shader
  - id: compile
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    title: Compile transformed source with original include context
  - id: frag
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/Planet.frag
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.frag
    title: Material values precede native lighting
  - id: tess
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese
    title: Displacement differs from native world-position varying
  - id: vert
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/Planet.vert
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.vert
    title: Non-tessellated world-position output
  - id: resolver
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore.Shaders/ShaderCompilerResolve.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Shaders/ShaderCompilerResolve.cs
    title: Native compile options and include callback
---

Blasto shades the terrain material itself, so the game still applies native terrain lighting afterward. It transforms source loaded through native shader references and creates private modules; installed shader files and cached stock modules are not rewritten.[^transform][^compile]

## How it works

Require every integration anchor to occur exactly once. Add a location-7 surface-position varying in the vertex and tessellation-evaluation outputs. On displaced tessellation paths, assign `displacedPosition` to that varying while leaving the original world-position output intact.[^transform][^tess][^vert]

Insert `BlastoMaterial` before the native lighting block. Each bounded record projects the fragment into saved tangent coordinates and rejects pixels outside its ellipse or height tolerance. Saved seeds drive coarse/fine angular spokes and broken noise. Differentiate tangent coordinates before footprint-dependent branches, then derive angular filtering without differentiating the discontinuous `atan` angle directly.[^transform][^frag]

Multiply existing albedo with optical attenuation, adjust roughness and perturb the normal slightly. Normalize artistic weights and evaluate optical products in log space to tolerate large representable controls. A separate final-color highlight path shows projected coverage in magenta, ignoring lighting and the normal height test.[^transform]

Compile the transformed string with the original absolute source path and native include callback, preserving relative include resolution.[^compile][^resolver]

## Lifecycle and timing

The pipeline-builder postfix performs transformation and compilation when private pipelines are built. The resulting shader evaluates in `render:planet`; it does not modify stored exposure, heightmaps, shadows or terrain meshes. Material injection precedes lighting, while the diagnostic highlight runs at the final-color assignment.[^transform][^frag]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Rendering/TerrainShaderSource.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainShaderSource.cs#L8-L120) | Unique text anchors and procedural material shader[^transform] |
| [Blasto.GameMod/Rendering/TerrainBlastShaders.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs#L16-L24) | Compile transformed source with original include context[^compile] |
| [current/Content/Core/Shaders/Planet/Planet.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.frag#L248-L280) | Material values precede native lighting[^frag] |
| [current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese#L151-L166) | Displacement differs from native world-position varying[^tess] |
| [current/Content/Core/Shaders/Planet/Planet.vert](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.vert#L52-L65) | Non-tessellated world-position output[^vert] |
| [current/decomp/RenderCore.Shaders/ShaderCompilerResolve.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Shaders/ShaderCompilerResolve.cs#L16-L35) | Native compile options and include callback[^resolver] |

## Snippets

```glsl
// Blasto.GameMod/Rendering/TerrainShaderSource.cs L64-L82
        vec3 delta = blastoSurfacePosition - mark.centerRadius.xyz;
        float radius = mark.centerRadius.w;
        vec3 U = mark.tangentUStrength.xyz, V = mark.tangentVAnisotropy.xyz;
        vec3 N = normalize(cross(U,V));
        vec2 meters = vec2(dot(delta,U), dot(delta,V));
        vec2 p = (meters / radius) / vec2(mark.tangentVAnisotropy.w, 1.0);
        // All fragment lanes evaluate these before the footprint-dependent branch.
        // Differentiating atan itself would also introduce a false spike at its +/-pi seam.
        vec2 dpdx = dFdx(p), dpdy = dFdy(p);
        float radiusSquared = dot(p,p);
        float r = sqrt(radiusSquared);
        vec2 angularGradient = vec2(-p.y,p.x) / max(radiusSquared,1e-8);
        vec2 angularDerivatives = vec2(dot(angularGradient,dpdx),dot(angularGradient,dpdy));
        if (r >= 1.0) continue;
        if ((blasto.header.y & 1u) != 0u) {
            blastoProjectedMark = true;
            continue;
        }
        if (abs(dot(delta,N)) > max(6.0, radius*0.2)) continue;
```

## Game APIs touched

`ModLibrary.Get<ShaderReference>` supplies the native asset and its stage/path. `ShaderCompilerResolve.GetCompileOptionsWithIncludeCallback` clones the renderer's default compilation options and installs its include resolver.[^compile][^resolver]

## Pitfalls and version notes

Text anchors and varying location 7 are version-specific contracts. Native tessellation deliberately leaves its ordinary world-position varying undisplaced, so using that varying alone would misplace marks on detailed ground. Derivative placement helps avoid divergence and seam artifacts but does not prove visual quality. No live 0.1.3 appearance or performance validation is claimed.

## See also

- [Private terrain pipeline swap](private-terrain-pipeline-swap.md)
- [Frame and viewport terrain buffers](frame-viewport-terrain-buffers.md)
- [Offline rendering validation](offline-rendering-validation.md)
- [Blend persistent marks into native terrain materials](../../../howto/rendering/vulkan-passes/blend-persistent-marks-into-terrain/blend-persistent-marks-into-terrain.md) - how-to article demonstrating this feature

[^transform]: Unique text anchors and procedural material shader.
[^compile]: Compile transformed source with original include context.
[^frag]: Material values precede native lighting.
[^tess]: Displacement differs from native world-position varying.
[^vert]: Non-tessellated world-position output.
[^resolver]: Native compile options and include callback.
