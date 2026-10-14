---
type: How-To
title: Blend persistent marks into native terrain materials
description: Add persistent surface marks to native terrain shading through guarded private
  pipelines, per-view storage buffers and source-validated material injection
topic: blend-persistent-marks-into-terrain
category: rendering
group: vulkan-passes
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/private-terrain-pipeline-swap
  - mods/blasto/features/frame-viewport-terrain-buffers
  - mods/blasto/features/terrain-material-shader-injection
  - mods/blasto/features/unsigned-vulkan-limit-validation
techniques:
  - harmony-postfix
  - harmony-prefix
  - harmony-transpiler
  - harmony-finalizer
  - reflection
  - vulkan-pipeline
  - vulkan-buffer
  - native-interop
  - glsl-shader
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
hooks:
  - harmony-postfix KSA.PlanetRenderer.BuildRenderPipeline
  - harmony-prefix KSA.PlanetRenderer.Render
  - harmony-transpiler KSA.PlanetRenderer.Render
  - harmony-finalizer KSA.PlanetRenderer.Render
tags:
  - rendering
  - blasto
  - harmony-postfix
  - harmony-prefix
  - harmony-transpiler
  - harmony-finalizer
  - reflection
  - vulkan-pipeline
  - vulkan-buffer
  - native-interop
  - shaders
  - glsl-shader
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:13Z
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
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: ksa-game-assemblies-current-decomp-core-renderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/Core/Renderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs
    title: "ksa-game-assemblies: current/decomp/Core/Renderer.cs"
  - id: blasto-blasto-gamemod-rendering-terrainaccess-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainAccess.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainAccess.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainAccess.cs"
  - id: blasto-blasto-gamemod-rendering-terrainblastrenderer-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs"
  - id: blasto-blasto-gamemod-rendering-terraingpucapabilities-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs"
  - id: blasto-blasto-gamemod-rendering-blastdescriptorlayout-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastDescriptorLayout.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastDescriptorLayout.cs
    title: "blasto: Blasto.GameMod/Rendering/BlastDescriptorLayout.cs"
  - id: ksa-game-assemblies-current-decomp-brutal-vulkanapi-vkphysicaldevicelimits-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs
    title: "ksa-game-assemblies: current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs"
  - id: blasto-blasto-gamemod-rendering-blastrenderresources-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastRenderResources.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs
    title: "blasto: Blasto.GameMod/Rendering/BlastRenderResources.cs"
  - id: blasto-blasto-gamemod-rendering-blastgpumark-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/BlastGpuMark.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastGpuMark.cs
    title: "blasto: Blasto.GameMod/Rendering/BlastGpuMark.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-camera-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Camera.cs"
  - id: blasto-blasto-gamemod-rendering-terrainshadersource-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainShaderSource.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainShaderSource.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainShaderSource.cs"
  - id: blasto-blasto-gamemod-rendering-terrainblastshaders-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainBlastShaders.cs"
---

Use this advanced approach when stored terrain marks must follow native material lighting without separate floating geometry. Begin with a StarMap/Harmony mod, validated body-fixed records and familiarity with Vulkan descriptors. Port Blasto’s rendering subsystem as a unit: individual snippets below illustrate contracts and are not independent drop-in programs.

## Background: how the game does it

PlanetRenderer defines a six-set layout and binds the body texture set at set 2 before its solid/wire draw. Bindings 0–12 and native dynamic offsets must remain compatible. See [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L510-L625)[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs] and [current/decomp/KSA/PlanetRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlanetRenderer.cs#L1960-L2034)[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs]. The fragment shader computes material values before lighting, while tessellation uses displaced positions for clip output but leaves its ordinary world-position varying undisplaced: [current/Content/Core/Shaders/Planet/Planet.frag](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/Planet.frag#L248-L280)[^ksa-game-assemblies-current-content-core-shaders-planet-planet-frag] and [current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese#L151-L166)[^ksa-game-assemblies-current-content-core-shaders-planet-planettessevaluation-tese].

## Lifecycle and timing

Install guards and patches at startup:starmap-before-main, before renderer construction. Private pipelines follow event:renderer-build. Rebuilds can happen in frame:prepare or inside Program.PostRender after submission/screenshots (frame:post-render): [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2141-L2150)[^ksa-game-assemblies-current-decomp-ksa-program-cs] and [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2336-L2360)[^ksa-game-assemblies-current-decomp-ksa-program-cs]. Upload and temporary field substitution occur only at the PlanetRenderer.Render prefix during render:planet. Native frame acquisition waits its reuse fence before these host writes: [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L336-L358)[^ksa-game-assemblies-current-decomp-core-renderer-cs].

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Fail registration on incompatible private contracts.** Cache typed private-field references and the private builder method from [Blasto.GameMod/Rendering/TerrainAccess.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainAccess.cs#L15-L32)[^blasto-blasto-gamemod-rendering-terrainaccess-cs]. Check the exact game assembly and CPU buffer layout before installing the build postfix and render prefix/transpiler/finalizer:

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L64-L76
// ...
        try
        {
            BlastGpuMark.AssertLayout();
            // Descriptor binding numbers/stage flags are audited for this build, not inferred from spare fields.
            if (typeof(PlanetRenderer).Assembly.GetName().Version?.ToString() != "2026.10.10.5554")
                throw new NotSupportedException("The terrain integration targets KSA 2026.10.10.5554; stock terrain retained.");
            Patch(TerrainAccess.Build, postfix: nameof(AfterBuild));
            Patch(AccessTools.DeclaredMethod(typeof(PlanetRenderer), nameof(PlanetRenderer.Render)),
                prefix: nameof(BeforeRender), transpiler: nameof(ReplaceForwardBinding), finalizer: nameof(AfterRender));
            Patch(AccessTools.DeclaredMethod(typeof(PlanetRenderer), nameof(PlanetRenderer.Dispose)), prefix: nameof(BeforeNativeDispose));
            Console.WriteLine("[Blasto] Terrain hooks installed: private set2 binding13, six sets, 128-byte push constants.");
        }
        catch (Exception ex)
// ...
```
Version rejection throws back to the entry owner and tears down Blasto initialization. A later private build failure instead retains stock terrain. Preserve the guarded single descriptor-bind replacement in [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L218-L235)[^blasto-blasto-gamemod-rendering-terrainblastrenderer-cs].

2. **Validate unsigned limits and clone the descriptor contract.** Decode signed C# interop fields without changing their 32-bit pattern:

```csharp
// Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs L15-L19
    public uint MaxBoundDescriptorSets => unchecked((uint)MaxBoundDescriptorSetsRaw);
    public uint MaxPushConstantsSize => unchecked((uint)MaxPushConstantsSizeRaw);
    public uint MaxDescriptorSetStorageBuffers => unchecked((uint)MaxDescriptorSetStorageBuffersRaw);
    public uint MaxPerStageDescriptorStorageBuffers => unchecked((uint)MaxPerStageDescriptorStorageBuffersRaw);
    public uint MaxStorageBufferRange => unchecked((uint)MaxStorageBufferRangeRaw);
```
Require six descriptor sets, 128 push-constant bytes, three storage buffers in each checked limit and the actual storage range. Copy all native bindings, append fragment storage binding 13, and keep the native push range and six layouts; see [Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs#L28-L45)[^blasto-blasto-gamemod-rendering-terraingpucapabilities-cs] and [Blasto.GameMod/Rendering/BlastDescriptorLayout.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastDescriptorLayout.cs#L10-L49)[^blasto-blasto-gamemod-rendering-blastdescriptorlayout-cs]. Native fields are declared in [current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs#L25-L85)[^ksa-game-assemblies-current-decomp-brutal-vulkanapi-vkphysicaldevicelimits-cs].

3. **Allocate one descriptor set and aligned range per frame/view slot.** Use host-visible coherent memory, a 48-byte header and 64 records of 80 bytes (5,168 bytes). Assert CPU sizes/offsets and align the slot stride. Copy bindings 0–12 from the current body, leaving binding 13 on the owned buffer:

```csharp
// Blasto.GameMod/Rendering/BlastRenderResources.cs L82-L98
// ...
    }

    public VkDescriptorSet Prepare(IViewport viewport, int frame, Celestial body, IReadOnlyList<BlastMark> marks,
        TerrainViewDiagnostics diagnostics, bool diagnosticHighlight, BlastSettings settings)
    {
        if (_disposed || frame < 0 || frame >= _frames || viewport.ShaderSlot < 0 || viewport.ShaderSlot >= ViewportRegistry.MAX_VIEWPORTS)
            throw new InvalidOperationException("Blasto viewport/frame allocation no longer matches the game.");
        int slot = viewport.ShaderSlot * _frames + frame;
        // Each slot is written only after the native frame fence retires its prior use.
        Span<VkCopyDescriptorSet> copies = stackalloc VkCopyDescriptorSet[13];
        for (int i = 0; i < copies.Length; i++) copies[i] = new VkCopyDescriptorSet {
            SrcSet = body.TextureSet, SrcBinding = i, DstSet = _sets[slot], DstBinding = i, DescriptorCount = 1 };
        _owner.Device.UpdateDescriptorSets(default, copies);
        Span<byte> bytes = _map!.Value.AsSpan().Slice(slot * _stride, BlastGpuMark.Range);
        bytes.Clear();
        var camera = viewport.GetCamera();
        var rotation = body.GetCce2Ccf();
// ...
```
Carry allocation and disposal together from [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L33-L73)[^blasto-blasto-gamemod-rendering-blastrenderresources-cs] and [Blasto.GameMod/Rendering/BlastGpuMark.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastGpuMark.cs#L7-L43)[^blasto-blasto-gamemod-rendering-blastgpumark-cs]. Coherence removes flushing, not reuse synchronization.

4. **Select marks and pack precise camera-relative geometry.** Admit footprints that reach the 5 km view range, including centers farther away by up to effective radius times anisotropy. Rank them by contribution, then distance and stable identity; retain only 64. Compute camera CCF from the negative ego-relative body position. Subtract saved double centers before rotating and converting to floats:

```csharp
// Blasto.GameMod/Rendering/BlastRenderResources.cs L127-L141
// ...
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
// ...
```
The selection loop is [Blasto.GameMod/Rendering/BlastRenderResources.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/BlastRenderResources.cs#L98-L126)[^blasto-blasto-gamemod-rendering-blastrenderresources-cs], and the native precise camera helper is [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L231-L252)[^ksa-game-assemblies-current-decomp-ksa-camera-cs]. Never subtract planet-scale floats.

5. **Transform shader source at unique anchors.** Add a location-7 varying carrying displaced tessellation positions or ordinary vertex positions. Insert the material call before native lighting, preserving the existing world-position varying. The production transform refuses missing/duplicate anchors:

```csharp
// Blasto.GameMod/Rendering/TerrainShaderSource.cs L8-L29
// ...
    internal static string Transform(string source, string id) => id switch
    {
        "PlanetFrag" => ReplaceOnce(ReplaceOnce(ReplaceOnce(source, "void main()", FragmentDeclarations + "\nvoid main()"),
            "    // Lighting calculations", "    BlastoMaterial(blendedDiffuse, roughness, worldNormal);\n\n    // Lighting calculations"),
            "    outColor = finalColor;", "    BlastoHighlight(finalColor);\n    outColor = finalColor;"),
        "PlanetVert" => ReplaceOnce(ReplaceOnce(source, "void main()", "layout(location = 7) out vec3 blastoSurfacePosition;\n\nvoid main()"),
            "    outWorldPosition = worldPos;", "    outWorldPosition = worldPos;\n    blastoSurfacePosition = worldPos.xyz;"),
        "PlanetTessEvaluation" => ReplaceOnce(ReplaceOnce(ReplaceOnce(source, "void main(void)",
            "layout(location = 7) out vec3 blastoSurfacePosition;\n\nvoid main(void)"),
            "\n        outWorldPosition = vec4(worldPos.xyz, 1.0f);",
            "\n        outWorldPosition = vec4(worldPos.xyz, 1.0f);\n        blastoSurfacePosition = worldPos.xyz;"),
            "\n    outWorldPosition = vec4(worldPos.xyz, 1.0f);",
            "\n    outWorldPosition = vec4(worldPos.xyz, 1.0f);\n    blastoSurfacePosition = displacedPosition;"),
        _ => throw new ArgumentOutOfRangeException(nameof(id))
    };

    private static string ReplaceOnce(string source, string anchor, string replacement)
    {
        int index = source.IndexOf(anchor, StringComparison.Ordinal);
        if (index < 0 || source.IndexOf(anchor, index + anchor.Length, StringComparison.Ordinal) >= 0)
            throw new InvalidOperationException($"Terrain shader integration anchor changed: {anchor}");
        return source[..index] + replacement + source[(index + anchor.Length)..];
// ...
```
Within the fragment function, evaluate derivatives of tangent coordinates before footprint branches, then filter angular spokes. Apply saved-seed noise, optical albedo attenuation, roughness and a small normal perturbation; see [Blasto.GameMod/Rendering/TerrainShaderSource.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainShaderSource.cs#L60-L118)[^blasto-blasto-gamemod-rendering-terrainshadersource-cs]. Keep the original absolute source path and include callback when compiling [Blasto.GameMod/Rendering/TerrainBlastShaders.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs#L16-L24)[^blasto-blasto-gamemod-rendering-terrainblastshaders-cs].

6. **Build private variants and restore temporary fields on every exit.** Copy stage descriptors, replace selected modules and layout, call the native builder behind the recursion guard, and capture partially created pipelines:

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L111-L134
// ...
            if (stages.Count is not (2 or 4)) throw new InvalidOperationException("Terrain stage count changed.");
            resources = new BlastRenderResources(planet, summary => GpuCapabilitiesSummary = summary);
            var modules = new Dictionary<VkShaderStageFlags, VkShaderModule> {
                [VkShaderStageFlags.VertexBit] = resources.Compile("PlanetVert"),
                [VkShaderStageFlags.FragmentBit] = resources.Compile("PlanetFrag") };
            if (stages.Count == 4) modules[VkShaderStageFlags.TessellationEvaluationBit] = resources.Compile("PlanetTessEvaluation");
            Span<VkPipelineShaderStageCreateInfo> nativeStages = stages.Slice(0);
            for (int i = 0; i < nativeStages.Length; i++)
                if (modules.TryGetValue(nativeStages[i].Stage, out var module)) nativeStages[i].Module = module;
            TerrainAccess.Layout(planet) = resources.Layout;
            _buildingPrivate = true;
            try { TerrainAccess.Build.Invoke(planet, null); }
            finally
            {
                // Capture partial creation too, so a wire-pipeline failure cannot leak the solid pipeline.
                if (!TerrainAccess.Solid(planet).Equals(solid)) resources.Solid = TerrainAccess.Solid(planet);
                if (!TerrainAccess.Wire(planet).Equals(wire)) resources.Wire = TerrainAccess.Wire(planet);
            }
            if (resources.Solid.IsNull() || resources.Wire.IsNull())
                throw new InvalidOperationException("Private terrain pipeline creation returned an empty handle.");
            _resources.Add(planet, resources);
            Status = "Terrain material renderer ready (64 marks per view)";
            Console.WriteLine("[Blasto] " + Status + "; independent frame/view SSBO slots; displaced tessellation lookup.");
            resources = null;
// ...
```
The finally block restores stages and native fields, disposing failed private resources. For drawing, prepare the view and swap only the native forward fields; see [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L142-L203)[^blasto-blasto-gamemod-rendering-terrainblastrenderer-cs].

7. **Forward dynamic offsets and restore after draw exceptions.** Replace only descriptor set 2 while forwarding native offsets unchanged:

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L238-L248
// ...
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
// ...
```
The Harmony finalizer restores solid/wire/layout fields and returns the original exception:

```csharp
// Blasto.GameMod/Rendering/TerrainBlastRenderer.cs L205-L216
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
    }
```
Count actual private binds as well as build successes so diagnostics distinguish pipeline creation from real use.

## Complete example

Use [Blasto.GameMod/Rendering/TerrainBlastRenderer.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastRenderer.cs#L57-L267)[^blasto-blasto-gamemod-rendering-terrainblastrenderer-cs] with the descriptor, resource, shader, GPU-limit and visual-math helpers linked above. Expected success reports a private material renderer with 64 marks per view; a placed diagnostic mark enables magenta projected coverage before testing ordinary lit appearance.

## Variations and gotchas

The integration targets KSA 2026.10.10.5554. Descriptor-type totals, hard-coded binding stages, varying 7 and a single native bind call are audited contracts, not a compatibility proof. Nested forward draws are unsupported. Another mod touching the same pipeline may need explicit integration. View selection can visibly change at the 64-record budget. Private disposal waits device idle. Source/managed/shader validation does not establish live multi-view synchronization, GPU cost or visual quality; test tessellation on/off, multiple views, rebuilds and shutdown in game.

## See also

- [Compare approaches](overview.md)
- [Private terrain pipeline swap](../../../../mods/blasto/features/private-terrain-pipeline-swap.md)
- [Frame and viewport terrain buffers](../../../../mods/blasto/features/frame-viewport-terrain-buffers.md)
- [Terrain material shader injection](../../../../mods/blasto/features/terrain-material-shader-injection.md)
- [Unsigned Vulkan limit validation](../../../../mods/blasto/features/unsigned-vulkan-limit-validation.md)


[^ksa-game-assemblies-current-decomp-ksa-planetrenderer-cs]: ksa-game-assemblies: current/decomp/KSA/PlanetRenderer.cs.
[^ksa-game-assemblies-current-content-core-shaders-planet-planet-frag]: ksa-game-assemblies: current/Content/Core/Shaders/Planet/Planet.frag.
[^ksa-game-assemblies-current-content-core-shaders-planet-planettessevaluation-tese]: ksa-game-assemblies: current/Content/Core/Shaders/Planet/PlanetTessEvaluation.tese.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^ksa-game-assemblies-current-decomp-core-renderer-cs]: ksa-game-assemblies: current/decomp/Core/Renderer.cs.
[^blasto-blasto-gamemod-rendering-terrainaccess-cs]: blasto: Blasto.GameMod/Rendering/TerrainAccess.cs.
[^blasto-blasto-gamemod-rendering-terrainblastrenderer-cs]: blasto: Blasto.GameMod/Rendering/TerrainBlastRenderer.cs.
[^blasto-blasto-gamemod-rendering-terraingpucapabilities-cs]: blasto: Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs.
[^blasto-blasto-gamemod-rendering-blastdescriptorlayout-cs]: blasto: Blasto.GameMod/Rendering/BlastDescriptorLayout.cs.
[^ksa-game-assemblies-current-decomp-brutal-vulkanapi-vkphysicaldevicelimits-cs]: ksa-game-assemblies: current/decomp/Brutal.VulkanApi/VkPhysicalDeviceLimits.cs.
[^blasto-blasto-gamemod-rendering-blastrenderresources-cs]: blasto: Blasto.GameMod/Rendering/BlastRenderResources.cs.
[^blasto-blasto-gamemod-rendering-blastgpumark-cs]: blasto: Blasto.GameMod/Rendering/BlastGpuMark.cs.
[^ksa-game-assemblies-current-decomp-ksa-camera-cs]: ksa-game-assemblies: current/decomp/KSA/Camera.cs.
[^blasto-blasto-gamemod-rendering-terrainshadersource-cs]: blasto: Blasto.GameMod/Rendering/TerrainShaderSource.cs.
[^blasto-blasto-gamemod-rendering-terrainblastshaders-cs]: blasto: Blasto.GameMod/Rendering/TerrainBlastShaders.cs.
