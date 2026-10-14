---
type: Mod Feature
title: Offline rendering validation
description: Test portable production logic and exact shader transforms without the game while
  packaging only the mod's required output files
mod: blasto
category: testing-and-tooling
tags:
  - blasto
  - testing-and-tooling
  - headless-tests
  - shader-validation
  - build-packaging
techniques:
  - headless-tests
  - shader-validation
  - build-packaging
game_types: []
lifecycle:
  - tool:build
hooks: []
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
  - id: project
    repo: blasto
    path: Blasto.Tests/Blasto.Tests.csproj
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Blasto.Tests.csproj
    title: Link portable production files without game/native references
  - id: tests
    repo: blasto
    path: Blasto.Tests/Program.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs
    title: Check inventory and exact production shader export
  - id: shader-validation
    repo: blasto
    path: scripts/validate-shaders.sh
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh
    title: Stage compilation, SPIR-V validation and guarded link baseline
  - id: package
    repo: blasto
    path: scripts/package.sh
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh
    title: Staging and allow-listed shipping outputs
  - id: build
    repo: blasto
    path: Directory.Build.props
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props
    title: Framework, external reference paths and missing-DLL error
  - id: mod-project
    repo: blasto
    path: Blasto.GameMod/Blasto.GameMod.csproj
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Blasto.GameMod.csproj
    title: Local loader references or pinned NuGet fallback
  - id: report
    repo: blasto
    path: VALIDATION.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md
    title: Upstream reported checks and live-validation boundary
---

Blasto makes its geometry, store, codec, tuning math, GPU-limit decoder and shader transformation portable, then links those production files into a console harness. This permits useful validation even when the host cannot run the native game.[^project][^tests]

## How it works

The harness declares 33 checks covering geometry, exposure invariants, merging/capacity, malformed state, unsigned limits, settings compatibility and source-anchor drift. Its export mode calls the same `TerrainShaderSource.Transform` used in game and writes the three transformed shader stages.[^tests]

The shader script requires .NET, `glslc` and `spirv-val`, compiles vertex/tessellation-evaluation/fragment stages for standard and ray-query variants, then validates all six outputs. If `glslangValidator` is installed, it also links the four-stage pipeline, including the native tessellation-control stage.[^shader-validation]

Link validation first tests stock sources. It permits normalization only for one exactly recognized stock sampler-type mismatch, and only when the vertex declaration is demonstrably unused. The change affects a temporary link copy; compilation of production transforms remains unmodified. Unexpected stock/link failures stop validation, while a missing optional linker is explicitly reported as skipped.[^shader-validation]

Packaging builds the game-mod project, checks three required files, stages only `Blasto.dll`, `Blasto.deps.json` and `mod.toml`, rejects game/loader DLLs, then replaces the distribution directory. External DLL paths are configurable, and loader/Harmony references fall back to pinned packages.[^package][^build][^mod-project]

## Lifecycle and timing

`tool:build` runs entirely outside the KSA frame loop. Tests consume portable production source, shader validation consumes the pinned game's shader directory, and packaging consumes compiled outputs. No runtime Harmony patch or live Vulkan device is exercised by these checks.[^project][^shader-validation][^report]

## Key code

| Path | Role |
|---|---|
| [Blasto.Tests/Blasto.Tests.csproj](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Blasto.Tests.csproj#L1-L18) | Link portable production files without game/native references[^project] |
| [Blasto.Tests/Program.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs#L12-L101) | Check inventory and exact production shader export[^tests] |
| [scripts/validate-shaders.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh#L4-L139) | Stage compilation, SPIR-V validation and guarded link baseline[^shader-validation] |
| [scripts/package.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh#L12-L45) | Staging and allow-listed shipping outputs[^package] |
| [Directory.Build.props](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props#L3-L31) | Framework, external reference paths and missing-DLL error[^build] |
| [Blasto.GameMod/Blasto.GameMod.csproj](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Blasto.GameMod.csproj#L23-L48) | Local loader references or pinned NuGet fallback[^mod-project] |
| [VALIDATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md#L5-L18) | Upstream reported checks and live-validation boundary[^report] |

## Snippets

```xml
<!-- Blasto.Tests/Blasto.Tests.csproj L9-L17 -->
  <!-- Link only portable production source. This project deliberately has no KSA,
       StarMap, Harmony, or native runtime references so it runs on a host machine. -->
  <ItemGroup>
    <Compile Include="../Blasto.GameMod/Core/**/*.cs" Link="Core/%(RecursiveDir)%(Filename)%(Extension)" />
    <Compile Include="../Blasto.GameMod/Persistence/BlastSave*.cs" Link="Persistence/%(Filename)%(Extension)" />
    <Compile Include="../Blasto.GameMod/Rendering/TerrainShaderSource.cs" Link="Rendering/TerrainShaderSource.cs" />
    <Compile Include="../Blasto.GameMod/Rendering/TerrainGpuCapabilities.cs" Link="Rendering/TerrainGpuCapabilities.cs" />
    <Compile Include="../Blasto.GameMod/Rendering/BlastVisualMath.cs" Link="Rendering/BlastVisualMath.cs" />
  </ItemGroup>
```

```bash
# scripts/validate-shaders.sh L74-L80
  for shader in Planet.vert PlanetTessEvaluation.tese Planet.frag; do
    output="$variant_dir/$shader.spv"
    "$glslc_bin" "${compiler_args[@]}" \
      "$temporary_root/export/Planet/$shader" -o "$output"
    "$spirv_val_bin" --target-env vulkan1.2 "$output"
    printf 'Validated %s (%s)\n' "$shader" "$variant"
  done
```

## Game APIs touched

The portable test project intentionally references no game, StarMap, Harmony or native runtime assemblies. Native integration still requires the real KSA reference DLLs and live validation; source compilation and shader validation cover different layers.[^project][^build][^report]

## Pitfalls and version notes

The recorded upstream validation reports 33/33 managed checks, six successful shader validations and a clean release build. Those are upstream results, not fresh execution in this documentation task. The report attributes visible 0.1.2 marks to user diagnostics, while 0.1.3 appearance, particles and performance remain unverified in game. In this corpus checkout, set `KSA_DLL_DIR` explicitly because the default sibling path is relative to the reference repository.

## See also

- [Terrain material shader injection](terrain-material-shader-injection.md)
- [Unsigned Vulkan limit validation](unsigned-vulkan-limit-validation.md)
- [Private terrain pipeline swap](private-terrain-pipeline-swap.md)
- [Validate production terrain math and shader transformations offline](../../../howto/testing-and-tooling/offline-tests/unit-test-mod-logic-without-game/unit-test-mod-logic-without-game-6.md) - how-to article demonstrating this feature

[^project]: Link portable production files without game/native references.
[^tests]: Check inventory and exact production shader export.
[^shader-validation]: Stage compilation, SPIR-V validation and guarded link baseline.
[^package]: Staging and allow-listed shipping outputs.
[^build]: Framework, external reference paths and missing-DLL error.
[^mod-project]: Local loader references or pinned NuGet fallback.
[^report]: Upstream reported checks and live-validation boundary.
