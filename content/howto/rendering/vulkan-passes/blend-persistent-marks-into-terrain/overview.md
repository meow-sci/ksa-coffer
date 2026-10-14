---
type: Game Feature
title: Blend persistent marks into native terrain materials
description: Blend persistent body-fixed effects into native terrain material shading with private
  pipelines, isolated storage buffers and explicit version guards
topic: blend-persistent-marks-into-terrain
category: rendering
group: vulkan-passes
approaches: 1
game_types:
  - KSA.PlanetRenderer
  - KSA.Celestial
  - KSA.Camera
  - Core.Renderer
  - KSA.ShaderReference
  - RenderCore.Shaders.ShaderCompilerResolve
  - Brutal.VulkanApi.VkPhysicalDeviceLimits
lifecycle:
  - startup:starmap-before-main
  - event:renderer-build
  - frame:prepare
  - frame:post-render
  - render:planet
demonstrated_by:
  - mods/blasto/features/private-terrain-pipeline-swap
  - mods/blasto/features/frame-viewport-terrain-buffers
  - mods/blasto/features/terrain-material-shader-injection
  - mods/blasto/features/unsigned-vulkan-limit-validation
tags:
  - rendering
  - terrain
  - vulkan
  - blasto
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
  - id: blasto-integration-blend-persistent-marks-into-terrain
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    title: Blasto Blend persistent marks into native terrain materials
  - id: ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs
    title: "ksa-game-assemblies: current/decomp/KSA/PlanetRenderer.cs"
  - id: ksa-game-assemblies-current-content-core-shaders-planet-planet-frag
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/Planet.frag
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.frag
    title: "ksa-game-assemblies: current/Content/Core/Shaders/Planet/Planet.frag"
  - id: ksa-game-assemblies-current-content-core-shaders-planet-planettessevaluation-tese
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese
    title: "ksa-game-assemblies: current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese"
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:45:10Z
---

Use native terrain material integration when a persistent surface effect should receive the existing lighting and shadow response. Blasto keeps stored history separate, projects a bounded set of marks in a private fragment shader, and retains stock pipelines for failures. This is a build-specific Vulkan integration rather than a public decal API.

## Engine background

PlanetRenderer defines a six-set layout and binds the body texture set at set 2 before its solid/wire draw. Bindings 0–12 and native dynamic offsets must remain compatible. See [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L510-L625)[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs] and [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L1960-L2034)[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs]. The fragment shader computes material values before lighting, while tessellation uses displaced positions for clip output but leaves its ordinary world-position varying undisplaced: [current/Content/Core/Shaders/Planet/Planet.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.frag#L248-L280)[^ksa-game-assemblies-current-content-core-shaders-planet-planet-frag] and [current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese#L151-L166)[^ksa-game-assemblies-current-content-core-shaders-planet-planettessevaluation-tese].

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Blend persistent marks into native terrain materials](blend-persistent-marks-into-terrain.md) | Blasto | harmony-postfix, harmony-prefix, harmony-transpiler, harmony-finalizer, reflection, vulkan-pipeline, vulkan-buffer, native-interop, glsl-shader | startup:starmap-before-main, event:renderer-build, frame:prepare, frame:post-render, render:planet | Native material lighting and persistent projection without mesh overlays; tightly coupled to private Vulkan and shader contracts |


The implementation keeps native shadow/height/mesh data intact, modifies material inputs before lighting, and confines temporary field changes to the forward terrain draw. Stored history is independent of viewport count and live appearance controls. See [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs).[^blasto-integration-blend-persistent-marks-into-terrain]

## See also

- [Game loop and lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Private terrain pipeline swap](../../../../mods/blasto/features/private-terrain-pipeline-swap.md)
- [Frame and viewport terrain buffers](../../../../mods/blasto/features/frame-viewport-terrain-buffers.md)
- [Terrain material shader injection](../../../../mods/blasto/features/terrain-material-shader-injection.md)
- [Unsigned Vulkan limit validation](../../../../mods/blasto/features/unsigned-vulkan-limit-validation.md)
- [Insert a custom Vulkan pass into KSA's frame](../insert-a-custom-pass-into-render-game/overview.md) - related topic
- [Query the terrain height field and test line of sight across terrain](../../../celestials/terrain/query-terrain-height-and-line-of-sight/overview.md) - related topic
- [Save a whole mod's scene state as versioned sidecar records, with reset and replay on load](../../../persistence/saves/save-mod-state-with-the-scene/overview.md) - related topic

[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs]: ksa-game-assemblies: current/decomp/KSA/PlanetRenderer.cs.
[^ksa-game-assemblies-current-content-core-shaders-planet-planet-frag]: ksa-game-assemblies: current/Content/Core/Shaders/Planet/Planet.frag.
[^ksa-game-assemblies-current-content-core-shaders-planet-planettessevaluation-tese]: ksa-game-assemblies: current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese.

[^blasto-integration-blend-persistent-marks-into-terrain]: Blasto integration source.
