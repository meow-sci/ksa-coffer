---
type: Mod Feature
title: Frame and viewport terrain buffers
description: Extend native terrain descriptors with isolated frame-view storage buffers and
  camera-relative double-to-float packing
mod: blasto
category: rendering
tags:
  - blasto
  - rendering
  - vulkan-buffer
  - vulkan-pipeline
  - native-interop
techniques:
  - vulkan-buffer
  - vulkan-pipeline
  - native-interop
game_types:
  - KSA.PlanetRenderer
  - KSA.Celestial
  - KSA.Camera
  - Core.Renderer
lifecycle:
  - render:planet
hooks:
  - harmony-prefix KSA.PlanetRenderer.Render
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:33:05Z
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
  - id: buffers
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: Private layouts, per-slot sets, selection and precise packing
  - id: layout
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastDescriptorLayout.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastDescriptorLayout.cs
    title: Native descriptor schema clone plus binding 13
  - id: gpu
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastGpuMark.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastGpuMark.cs
    title: CPU layout assertions
  - id: visual
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastVisualMath.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastVisualMath.cs
    title: Buffer constants and contribution ranking
  - id: native-layout
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlanetRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs
    title: Native terrain descriptor bindings and pipeline sets
  - id: fence
    repo: ksa-game-assemblies
    path: current/decomp/Core/Renderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs
    title: Frame acquisition waits for its reuse fence
  - id: acquire
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Acquire before subsequent rendering
  - id: camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: Precise ego-relative astronomical position
---

Blasto adds one fragment storage buffer to the terrain's native descriptor set 2. Each frame index and viewport slot owns a distinct descriptor set and aligned buffer region, preventing one view's upload from replacing another's data.[^buffers][^layout]

## How it works

Clone native bindings 0–12 after checking their descriptor-type totals; append fragment storage binding 13. Keep the native six-set pipeline arrangement and push-constant contract. Allocate host-visible, coherent storage and align each slot stride to the renderer's minimum storage-buffer alignment.[^buffers][^layout][^native-layout]

Each draw copies the body's native descriptors into that slot and writes a 48-byte header followed by up to 64 records of 80 bytes: a 5,168-byte descriptor range. Assertions check sizes and field offsets against the shader contract.[^gpu][^visual]

Select valid marks on the nearby body whose footprints reach within 5 km. Rank by estimated apparent contribution, then distance and stable identity, retaining the best 64. Transform the negative camera-relative body position into CCF; subtract it from stored double centers before transforming back and packing floats. Transform tangent axes as directions, without translation.[^buffers][^camera]

## Lifecycle and timing

The upload runs in the `PlanetRenderer.Render` prefix during `render:planet`. Native `Program.OnPreRender` first acquires a frame; `Core.Renderer.TryAcquireNextFrame` waits and resets the selected frame fence. The per-frame/view allocation is what makes coherent host writes compatible with earlier GPU use of other slots.[^acquire][^fence][^buffers]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L33-L155) | Private layouts, per-slot sets, selection and precise packing[^buffers] |
| [Blasto.GameMod/Rendering/BlastDescriptorLayout.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastDescriptorLayout.cs#L10-L49) | Native descriptor schema clone plus binding 13[^layout] |
| [Blasto.GameMod/Rendering/BlastGpuMark.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastGpuMark.cs#L7-L43) | CPU layout assertions[^gpu] |
| [Blasto.GameMod/Rendering/BlastVisualMath.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastVisualMath.cs#L10-L34) | Buffer constants and contribution ranking[^visual] |
| [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L510-L625) | Native terrain descriptor bindings and pipeline sets[^native-layout] |
| [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L336-L358) | Frame acquisition waits for its reuse fence[^fence] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2420-L2437) | Acquire before subsequent rendering[^acquire] |
| [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L231-L252) | Precise ego-relative astronomical position[^camera] |

## Snippets

```csharp
// Blasto.GameMod/Rendering/BlastRenderResources.cs L127-L146
        var inverse = rotation.Inverse();
        for (int i = 0; i < count; i++)
        {
            BlastMark mark = _selected[i].Mark;
            // Subtract in doubles before packing: no planet-scale float subtraction.
            double3 center = (Vector(mark.CenterCcf) - cameraCcf).Transform(inverse);
            double3 u = Vector(mark.TangentU).Transform(inverse), v = Vector(mark.TangentV).Transform(inverse);
            float radius = BlastVisualMath.CheckedGpuFloat(BlastVisualMath.EffectiveRadius(mark, settings), "Effective mark radius", positive: true);
            float strength = BlastVisualMath.CheckedGpuFloat(BlastVisualMath.EffectiveStrength(mark, settings), "Effective mark exposure");
            diagnostics.LargestSelectedRadiusMeters = Math.Max(diagnostics.LargestSelectedRadiusMeters, radius);
            var gpu = new BlastGpuMark { CenterRadius = new float4(float3.Pack(center), radius),
                TangentUStrength = new float4(float3.Pack(u), strength),
                TangentVAnisotropy = new float4(float3.Pack(v), (float)mark.Anisotropy),
                TintRoughness = Tint(mark.Profile), Seed = unchecked((uint)mark.Seed), Profile = (uint)mark.Profile };
            MemoryMarshal.Write(bytes.Slice(BlastGpuMark.HeaderSize + i * BlastGpuMark.Size, BlastGpuMark.Size), in gpu);
        }
        var header = new BlastGpuHeader { Count = (uint)count, Flags = diagnosticHighlight ? 1u : 0u,
            Tuning0 = new float4((float)settings.SizeMultiplier, (float)settings.Visibility, (float)settings.Darkness, (float)settings.StreakStrength),
            Tuning1 = new float4((float)settings.CenterStrength, (float)settings.EdgeSoftness, 0, 0) };
        MemoryMarshal.Write(bytes, in header);
```

## Game APIs touched

`PlanetRenderer` defines the native descriptor schema; `Core.Renderer` owns frame synchronization. `Camera.GetPositionEgo` provides the relative astronomical position, and the body rotation converts it to the same CCF coordinates as stored marks.[^native-layout][^fence][^camera][^buffers]

## Pitfalls and version notes

Do not replace precise relative subtraction with planet-scale float subtraction. A coherent allocation removes the explicit flush requirement, not synchronization obligations. The native layout check compares type counts, while binding order and stage masks remain audited constants. Selection can visibly change as views move or dense overlaps exceed the budget; profiling at 64 marks is still needed.

## See also

- [Private terrain pipeline swap](private-terrain-pipeline-swap.md)
- [Unsigned Vulkan limit validation](unsigned-vulkan-limit-validation.md)
- [Persistent exposure site store](persistent-exposure-site-store.md)
- [Blend persistent marks into native terrain materials](../../../howto/rendering/vulkan-passes/blend-persistent-marks-into-terrain/blend-persistent-marks-into-terrain.md) - how-to article demonstrating this feature

[^buffers]: Private layouts, per-slot sets, selection and precise packing.
[^layout]: Native descriptor schema clone plus binding 13.
[^gpu]: CPU layout assertions.
[^visual]: Buffer constants and contribution ranking.
[^native-layout]: Native terrain descriptor bindings and pipeline sets.
[^fence]: Frame acquisition waits for its reuse fence.
[^acquire]: Acquire before subsequent rendering.
[^camera]: Precise ego-relative astronomical position.
