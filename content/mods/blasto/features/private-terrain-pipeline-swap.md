---
type: Mod Feature
title: Private terrain pipeline swap
description: Build guarded private terrain pipelines and substitute them only during the native
  terrain draw with exception-safe restoration
mod: blasto
category: rendering
tags:
  - blasto
  - rendering
  - harmony-postfix
  - harmony-prefix
  - harmony-transpiler
  - harmony-finalizer
  - reflection
  - vulkan-pipeline
techniques:
  - harmony-postfix
  - harmony-prefix
  - harmony-transpiler
  - harmony-finalizer
  - reflection
  - vulkan-pipeline
game_types:
  - KSA.PlanetRenderer
lifecycle:
  - startup:starmap-before-main
  - event:renderer-build
  - frame:prepare
  - frame:post-render
  - render:planet
hooks:
  - harmony-postfix KSA.PlanetRenderer.BuildRenderPipeline
  - harmony-prefix KSA.PlanetRenderer.Render
  - harmony-transpiler KSA.PlanetRenderer.Render
  - harmony-finalizer KSA.PlanetRenderer.Render
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:40:01Z
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
  - id: renderer
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    title: Build isolation, render swap and guarded bind replacement
  - id: access
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainAccess.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainAccess.cs
    title: Private-field and method access
  - id: pipeline
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs
    title: Native pipeline builder consumes shader stages and layout
  - id: draw
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs
    title: Native six-set bind and solid/wire draw
  - id: entry
    repo: blasto
    path: Blasto.GameMod/Mod.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs
    title: Install patches before native game initialization
  - id: resources
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: Wait for GPU completion before private resource release
  - id: rebuild
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Renderer rebuild inside Program.PostRender
---

Blasto keeps stock terrain pipelines available and builds separate material variants. At each terrain draw it temporarily selects private pipelines and a matching descriptor layout, then restores native fields even if drawing throws.[^renderer]

## How it works

Installation asserts the exact game assembly version, CPU buffer layout and a single expected native descriptor-bind call. Private-field access uses cached Harmony field references and the private pipeline-builder method.[^renderer][^access]

After native pipeline creation, copy the stage descriptors, compile private vertex/fragment stages and a tessellation-evaluation variant when the native stage count is four. Temporarily replace modules and layout, invoke the native builder behind a recursion guard, capture partially created pipelines, and restore all originals in `finally`. Failures dispose private resources and retain stock pipelines.[^renderer][^pipeline]

During `PlanetRenderer.Render`, prepare the view's mark set, save native fields, then swap the solid/wire pipelines and layout. A transpiler replaces exactly one generic six-parameter descriptor-bind call. Its wrapper forwards native dynamic offsets unchanged and changes only descriptor set 2. The Harmony finalizer restores fields and returns the original exception rather than hiding it.[^renderer][^draw]

## Lifecycle and timing

Patch installation runs in `startup:starmap-before-main`. Pipeline creation follows the native builder during renderer construction and rebuild; runtime rebuilds can occur in `frame:prepare` or inside `Program.PostRender` in `frame:post-render`, after frame submission and screenshot handling.[^rebuild] Field swaps are confined to `render:planet` command recording. They are not a pre-render upload hook or a general global postprocess.[^entry][^renderer] Private resource disposal waits for device idle before destruction.[^resources]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L57-L249) | Build isolation, render swap and guarded bind replacement[^renderer] |
| [Blasto.GameMod/Rendering/TerrainAccess.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainAccess.cs#L15-L32) | Private-field and method access[^access] |
| [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L1606-L1650) | Native pipeline builder consumes shader stages and layout[^pipeline] |
| [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L1960-L2034) | Native six-set bind and solid/wire draw[^draw] |
| [Blasto.GameMod/Mod.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Mod.cs#L32-L63) | Install patches before native game initialization[^entry] |
| [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L162-L178) | Wait for GPU completion before private resource release[^resources] |

| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2350-L2360) | Renderer rebuild inside Program.PostRender[^rebuild] |

## Snippets

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L205-L215
    private static Exception? AfterRender(Exception? __exception, RenderSwap? __state)
    {
        if (__state != null)
        {
            if (__exception != null) __state.Diagnostics.Status = "Terrain draw failed: " + __exception.GetBaseException().Message;
            TerrainAccess.Solid(__state.Planet) = __state.Solid;
            TerrainAccess.Wire(__state.Planet) = __state.Wire;
            TerrainAccess.Layout(__state.Planet) = __state.Layout;
            _active = null;
        }
        return __exception;
```

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L238-L248
    private static void BindForward(CommandBuffer command, VkPipelineBindPoint point, VkPipelineLayout layout,
        int firstSet, ReadOnlySpan<VkDescriptorSet> sets, Span<ByteSize32> offsets)
    {
        if (_active == null) { command.BindDescriptorSets(point, layout, firstSet, sets, offsets); return; }
        Span<VkDescriptorSet> privateSets = stackalloc VkDescriptorSet[6];
        sets.CopyTo(privateSets);
        privateSets[2] = _active.MarkSet;
        command.BindDescriptorSets(point, layout, firstSet, privateSets, offsets);
        _active.Diagnostics.DescriptorBinds++;
        if (_current != null) _current.DescriptorBinds++;
        if (_active.Diagnostics.SelectedMarkCount > 0) _active.Diagnostics.Status = "Private terrain bound with marks";
```

## Game APIs touched

`PlanetRenderer.BuildRenderPipeline` consumes `_renderShaderStages` and `_renderPipelineLayout` to create both rasterization variants. `PlanetRenderer.Render` binds six descriptor sets before choosing `_solid` or `_wire`; Blasto relies on that exact private layout and call shape.[^pipeline][^draw][^access]

## Pitfalls and version notes

The assembly-version guard deliberately rejects other builds; because registration throws back to `Mod.BeforeMain`, that failure tears down the entire Blasto initialization. A later private-pipeline build failure instead retains stock terrain for that renderer.[^entry][^renderer] Native descriptor counts and text anchors are additional checks, not a compatibility proof. Nested forward draws are unsupported. Another mod changing the same pipeline, shader stage list or bind call can require explicit integration. An upload failure disables Blasto terrain rendering; a draw exception is propagated after restoration.

## See also

- [Frame and viewport terrain buffers](frame-viewport-terrain-buffers.md)
- [Terrain material shader injection](terrain-material-shader-injection.md)
- [Scene reset and native cleanup](scene-reset-and-native-cleanup.md)
- [Blend persistent marks into native terrain materials](../../../howto/rendering/vulkan-passes/blend-persistent-marks-into-terrain/blend-persistent-marks-into-terrain.md) - how-to article demonstrating this feature

[^renderer]: Build isolation, render swap and guarded bind replacement.
[^access]: Private-field and method access.
[^pipeline]: Native pipeline builder consumes shader stages and layout.
[^draw]: Native six-set bind and solid/wire draw.
[^entry]: Install patches before native game initialization.
[^resources]: Wait for GPU completion before private resource release.


[^rebuild]: Renderer rebuild inside Program.PostRender.
