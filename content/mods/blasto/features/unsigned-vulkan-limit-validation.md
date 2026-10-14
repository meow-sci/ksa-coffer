---
type: Mod Feature
title: Unsigned Vulkan limit validation
description: Decode signed interop representations of Vulkan limits as unsigned values before
  validating private terrain buffer requirements
mod: blasto
category: rendering
tags:
  - blasto
  - rendering
  - native-interop
  - vulkan-buffer
techniques:
  - native-interop
  - vulkan-buffer
game_types:
  - Brutal.VulkanApi.VkPhysicalDeviceLimits
lifecycle:
  - event:renderer-build
  - frame:prepare
  - frame:post-render
hooks:
  - harmony-postfix KSA.PlanetRenderer.BuildRenderPipeline
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
  - id: limits
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs
    title: Bit-preserving conversion and actual/required diagnostics
  - id: construction
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: Read and validate limits before allocation
  - id: native
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs
    title: Signed C# declarations for the native limit fields
  - id: tests
    repo: blasto
    path: Blasto.Tests/Program.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs
    title: High-bit, ordinary and insufficient boundary checks
  - id: rebuild
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Renderer rebuild inside Program.PostRender
---

A GPU can support Blasto's storage buffer while the binding exposes its limit as a negative C# integer. Blasto preserves the underlying 32-bit pattern by converting with `unchecked((uint)raw)` before comparing requirements.[^limits][^native]

## How it works

The pinned binding declares all five inspected limits as `int`. The wrapper decodes descriptor-set count, push-constant bytes, descriptor storage-buffer counts and maximum storage-buffer range as unsigned values. Thus a raw value of `-1` represents `0xffffffff`, which the tests expect as 4,294,967,295 rather than an invalid capacity.[^limits][^native][^tests]

Checks require six bound descriptor sets, 128 push-constant bytes, at least three storage buffers in each checked descriptor limit, and the actual mark-buffer range. Gather every failed comparison into one exception. Publish the complete capability summary before enforcing support, including actual, required, hexadecimal and signed values.[^limits][^construction]

The helper is independent of native libraries, so a portable harness exercises high-bit values for every field, exact thresholds and genuinely insufficient devices without needing a Vulkan device.[^tests]

## Lifecycle and timing

The `PlanetRenderer.BuildRenderPipeline` postfix reaches this check while constructing private resources, before allocating descriptors or storage. That occurs with a live renderer during initial pipeline construction and runtime rebuilds; it is not executed in the early StarMap registration callback itself.[^construction] The lifecycle labels describe initial construction and rebuilds during `frame:prepare` or inside `Program.PostRender`, rather than a per-frame capability poll.[^rebuild]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs#L7-L46) | Bit-preserving conversion and actual/required diagnostics[^limits] |
| [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L33-L45) | Read and validate limits before allocation[^construction] |
| [current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs#L25-L85) | Signed C# declarations for the native limit fields[^native] |
| [Blasto.Tests/Program.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs#L357-L437) | High-bit, ordinary and insufficient boundary checks[^tests] |

| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2350-L2360) | Renderer rebuild inside Program.PostRender[^rebuild] |

## Snippets

```csharp
// Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs L15-L19
    public uint MaxBoundDescriptorSets => unchecked((uint)MaxBoundDescriptorSetsRaw);
    public uint MaxPushConstantsSize => unchecked((uint)MaxPushConstantsSizeRaw);
    public uint MaxDescriptorSetStorageBuffers => unchecked((uint)MaxDescriptorSetStorageBuffersRaw);
    public uint MaxPerStageDescriptorStorageBuffers => unchecked((uint)MaxPerStageDescriptorStorageBuffersRaw);
    public uint MaxStorageBufferRange => unchecked((uint)MaxStorageBufferRangeRaw);
```

```csharp
// Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs L28-L41
    public void EnsureSupported()
    {
        var failed = new List<string>();
        Check(nameof(MaxBoundDescriptorSets), MaxBoundDescriptorSets, 6u, MaxBoundDescriptorSetsRaw);
        Check(nameof(MaxPushConstantsSize), MaxPushConstantsSize, 128u, MaxPushConstantsSizeRaw);
        Check(nameof(MaxDescriptorSetStorageBuffers), MaxDescriptorSetStorageBuffers, 3u, MaxDescriptorSetStorageBuffersRaw);
        Check(nameof(MaxPerStageDescriptorStorageBuffers), MaxPerStageDescriptorStorageBuffers, 3u, MaxPerStageDescriptorStorageBuffersRaw);
        Check(nameof(MaxStorageBufferRange), MaxStorageBufferRange, RequiredStorageBufferRange, MaxStorageBufferRangeRaw);
        if (failed.Count != 0)
            throw new InvalidOperationException("Device limits below the private terrain storage-buffer requirements: " + string.Join("; ", failed));

        void Check(string name, uint actual, uint required, int raw)
        {
            if (actual < required) failed.Add(Describe(name, actual, required, raw));
```

## Game APIs touched

`VkPhysicalDeviceLimits` is the binding surface being interpreted; its C# declarations alone do not preserve the semantic unsigned type. `BlastRenderResources` reads the native renderer's limits by reference and passes their raw values to the portable validator.[^native][^construction]

## Pitfalls and version notes

This is bit reinterpretation for audited native unsigned fields, not a general way to treat negative application settings as large capacities. Passing these five checks does not prove every Vulkan allocation or pipeline requirement is supported. Continue handling creation failures and stock fallback; keep buffer-range requirements derived from the real record layout.

## See also

- [Frame and viewport terrain buffers](frame-viewport-terrain-buffers.md)
- [Private terrain pipeline swap](private-terrain-pipeline-swap.md)
- [Offline rendering validation](offline-rendering-validation.md)
- [Blend persistent marks into native terrain materials](../../../howto/rendering/vulkan-passes/blend-persistent-marks-into-terrain/blend-persistent-marks-into-terrain.md) - how-to article demonstrating this feature

[^limits]: Bit-preserving conversion and actual/required diagnostics.
[^construction]: Read and validate limits before allocation.
[^native]: Signed C# declarations for the native limit fields.
[^tests]: High-bit, ordinary and insufficient boundary checks.


[^rebuild]: Renderer rebuild inside Program.PostRender.
