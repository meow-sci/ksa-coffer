---
type: How-To
title: Validate production terrain math and shader transformations offline
description: Test portable production terrain logic and exact shader transformations with a console
  harness, then validate compiler outputs and package only owned files
topic: unit-test-mod-logic-without-game
category: testing-and-tooling
group: offline-tests
approach: 6
difficulty: intermediate
prerequisites:
  - .NET SDK 10
  - Pinned game shader sources for shader checks
  - glslc and spirv-val; optional glslangValidator
  - Game and loader reference DLLs only for the mod build
demonstrated_by:
  - mods/blasto/features/offline-rendering-validation
techniques:
  - headless-tests
  - shader-validation
  - build-packaging
game_types: []
lifecycle:
  - tool:build
hooks: []
tags:
  - testing-and-tooling
  - blasto
  - headless-tests
  - shader-validation
  - build-packaging
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
  - id: blasto-blasto-tests-blasto-tests-csproj
    repo: blasto
    path: Blasto.Tests/Blasto.Tests.csproj
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Blasto.Tests.csproj
    title: "blasto: Blasto.Tests/Blasto.Tests.csproj"
  - id: blasto-blasto-gamemod-rendering-terrainblastshaders-cs
    repo: blasto
    path: Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs
    title: "blasto: Blasto.GameMod/Rendering/TerrainBlastShaders.cs"
  - id: blasto-blasto-tests-program-cs
    repo: blasto
    path: Blasto.Tests/Program.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs
    title: "blasto: Blasto.Tests/Program.cs"
  - id: blasto-scripts-validate-shaders-sh
    repo: blasto
    path: scripts/validate-shaders.sh
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh
    title: "blasto: scripts/validate-shaders.sh"
  - id: blasto-scripts-package-sh
    repo: blasto
    path: scripts/package.sh
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh
    title: "blasto: scripts/package.sh"
  - id: blasto-directory-build-props
    repo: blasto
    path: Directory.Build.props
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props
    title: "blasto: Directory.Build.props"
  - id: blasto-validation-md
    repo: blasto
    path: VALIDATION.md
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md
    title: "blasto: VALIDATION.md"
---

Use this approach when production geometry, persistence and shader rewriting should be testable on a host that cannot run KSA. Blasto links the real portable source into a console executable, exports the exact runtime shader transforms and separates those checks from native integration acceptance.

## Background: how the game does it

The test project imports no KSA, StarMap, Harmony or native runtime assembly. Its linked core math, store, codec, limit decoder and shader transformer form the game boundary. Native runtime compilation still calls ShaderCompilerResolve with the original source path and include callback; the offline script validates transformed text separately. See [Blasto.Tests/Blasto.Tests.csproj](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Blasto.Tests.csproj#L1-L18)[^blasto-blasto-tests-blasto-tests-csproj] and [Blasto.GameMod/Rendering/TerrainBlastShaders.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Rendering/TerrainBlastShaders.cs#L16-L24)[^blasto-blasto-gamemod-rendering-terrainblastshaders-cs].

## Lifecycle and timing

Everything here is tool:build, outside the game frame loop. Tests do not install Harmony patches or create a live Vulkan pipeline. Shader validation consumes a caller-supplied shader directory; choose the same pinned build that the runtime integration targets. Portable results cannot establish live renderer synchronization or visual quality.

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Create a portable console project that links production files.** Copy the project shape and keep game-facing adapters out. Include the exact core, save, shader-transform, GPU-limit and visual-math files:

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
A stray game API in that linked layer becomes a build dependency problem instead of being hidden by a test reimplementation.

2. **Make invariants and exit status the verdict.** Follow the 33-check registration list in [Blasto.Tests/Program.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs#L12-L47)[^blasto-blasto-tests-program-cs]. Include subdivision invariance, malformed geometry, stable merges, capacity preservation, sidecar integrity/version rejection, unsigned limit boundaries and settings compatibility. The runner catches each failure and exits nonzero if any check fails:

```csharp
// Blasto.Tests/Program.cs L61-L78
// ...
        foreach (var (name, run) in Checks)
        {
            try
            {
                run();
                Console.WriteLine($"PASS {name}");
            }
            catch (Exception exception)
            {
                failures++;
                Console.Error.WriteLine($"FAIL {name}: {exception.Message}");
            }
        }

        Console.WriteLine($"{Checks.Length - failures}/{Checks.Length} checks passed.");
        return failures == 0 ? 0 : 1;
    }

// ...
```
From the reference root, run `dotnet run --project Blasto.Tests/Blasto.Tests.csproj --configuration Release`; use the final count and exit code as evidence.

3. **Export the same transformation used at runtime.** Add an export command instead of maintaining duplicate shader strings in tests. It calls production TerrainShaderSource.Transform on the three stage files:

```csharp
// Blasto.Tests/Program.cs L80-L101
// ...
    {
        string planetSource = Path.Combine(Path.GetFullPath(sourceRoot), "Planet");
        string planetOutput = Path.Combine(Path.GetFullPath(outputDirectory), "Planet");
        Directory.CreateDirectory(planetOutput);

        (string File, string Id)[] shaders =
        [
            ("Planet.frag", "PlanetFrag"),
            ("Planet.vert", "PlanetVert"),
            ("PlanetTessEvaluation.tese", "PlanetTessEvaluation"),
        ];

        foreach (var (file, id) in shaders)
        {
            string sourcePath = Path.Combine(planetSource, file);
            string source = File.ReadAllText(sourcePath);
            string transformed = TerrainShaderSource.Transform(source, id);
            File.WriteAllText(Path.Combine(planetOutput, file), transformed, new UTF8Encoding(false));
        }

        return 0;
    }
// ...
```
The script invokes this mode from [scripts/validate-shaders.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh#L29-L31)[^blasto-scripts-validate-shaders-sh]. Restore/build the project before the script’s no-restore invocation.

4. **Compile and validate both shader configurations.** Require glslc and spirv-val, then compile standard and RAY_QUERIES_SUPPORTED variants for Vulkan 1.2:

```bash
# scripts/validate-shaders.sh L65-L80
# ...
  mkdir -p "$variant_dir"

  compiler_args=(--target-env=vulkan1.2 -I"$planet_source")
  linker_args=(-V -l -I"$planet_source")
  if [[ "$variant" == ray_queries ]]; then
    compiler_args+=(-DRAY_QUERIES_SUPPORTED=1)
    linker_args+=(-DRAY_QUERIES_SUPPORTED=1)
  fi

  for shader in Planet.vert PlanetTessEvaluation.tese Planet.frag; do
    output="$variant_dir/$shader.spv"
    "$glslc_bin" "${compiler_args[@]}" \
      "$temporary_root/export/Planet/$shader" -o "$output"
    "$spirv_val_bin" --target-env vulkan1.2 "$output"
    printf 'Validated %s (%s)\n' "$shader" "$variant"
  done
# ...
```
Use [scripts/validate-shaders.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh#L4-L24)[^blasto-scripts-validate-shaders-sh] for tool/source preflight. From the reference root, invoke `bash scripts/validate-shaders.sh /path/to/Content/Core/Shaders`, replacing the argument with the pinned game shader directory. Six successful stage validations cover syntax and SPIR-V validity, not a live pipeline.

5. **Compare linker failures with the stock baseline.** If glslangValidator exists, link four stages including native tessellation control. Recognize only the exact known stock sampler mismatch:

```bash
# scripts/validate-shaders.sh L54-L61
# ...
  local log="$1"
  local error_count
  error_count="$(grep -Ec '^ERROR:' "$log" || true)"
  [[ "$error_count" == 1 ]] \
    && grep -Fq 'ERROR: Linking tessellation evaluation stage: Types must match:' "$log" \
    && grep -Fq 'vertex stage: " unexpected planetNormalTexture"' "$log" \
    && grep -Fq 'tessellation evaluation stage: " unexpected planetNormalTexture"' "$log"
}
# ...
```
Before normalizing a temporary vertex copy, prove its planetNormalTexture declaration is the only reference. Preserve [scripts/validate-shaders.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh#L83-L139)[^blasto-scripts-validate-shaders-sh] so unrelated baseline failures stop the run and a missing optional linker is reported as skipped. Production transforms remain unmodified.

6. **Package an explicit allow-list and keep runtime acceptance separate.** Require all three outputs and copy only them to staging:

```bash
# scripts/package.sh L20-L32
for artifact in Blasto.dll Blasto.deps.json mod.toml; do
  if [[ ! -f "$build_output/$artifact" ]]; then
    printf 'Blasto package is missing required build output: %s\n' "$build_output/$artifact" >&2
    exit 1
  fi
done

mkdir -p "$repo_root/dist"
staging="$(mktemp -d "$repo_root/dist/.Blasto-stage.XXXXXX")"
trap 'rm -rf "$staging"' EXIT

cp "$build_output/Blasto.dll" "$build_output/Blasto.deps.json" "$build_output/mod.toml" "$staging/"

```
The remaining script rejects game/loader DLLs and replaces the distribution directory; see [scripts/package.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh#L33-L45)[^blasto-scripts-package-sh]. Configure KSA_DLL_DIR explicitly under this corpus layout and use [Directory.Build.props](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Directory.Build.props#L14-L31)[^blasto-directory-build-props] for override behavior.

## Complete example

Use [Blasto.Tests/Program.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.Tests/Program.cs#L12-L101)[^blasto-blasto-tests-program-cs] with [scripts/validate-shaders.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/validate-shaders.sh#L4-L139)[^blasto-scripts-validate-shaders-sh] and [scripts/package.sh](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/scripts/package.sh#L12-L45)[^blasto-scripts-package-sh]. The expected portable result is 33/33 checks and a zero exit; shader validation should report six stage outputs plus linked interfaces or an explicit linker skip. Those are expectations from the pinned source, not new execution in this documentation task.

## Variations and gotchas

The upstream [VALIDATION.md](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/VALIDATION.md#L5-L18)[^blasto-validation-md] records 33/33 managed checks, six shader validations and a clean release build. Keep that attribution: this article did not rerun them. The ARM macOS host cannot run the supplied x64 Linux game, and source compilation does not exercise Harmony installation or native Vulkan allocation. Test visual placement, manual UI entry, particles, multi-view rendering, rebuilds and performance separately in game. Do not distribute copied game/loader DLLs.

## See also

- [Compare approaches](overview.md)
- [Offline rendering validation](../../../../mods/blasto/features/offline-rendering-validation.md)
- [Approach 1: xUnit project linking a game-free Sim folder wholesale](unit-test-mod-logic-without-game-1.md)
- [Approach 2: Console test executable with invariant checks and non-zero exit](unit-test-mod-logic-without-game-2.md)
- [Approach 3: Console checks against Python reference fixtures](unit-test-mod-logic-without-game-3.md)
- [Approach 4: NUnit suites with property tests and silent-on-success rules](unit-test-mod-logic-without-game-4.md)
- [Approach 5: Compile-gated Game/ half joined by partial methods](unit-test-mod-logic-without-game-5.md)

[^blasto-blasto-tests-blasto-tests-csproj]: blasto: Blasto.Tests/Blasto.Tests.csproj.
[^blasto-blasto-gamemod-rendering-terrainblastshaders-cs]: blasto: Blasto.GameMod/Rendering/TerrainBlastShaders.cs.
[^blasto-blasto-tests-program-cs]: blasto: Blasto.Tests/Program.cs.
[^blasto-scripts-validate-shaders-sh]: blasto: scripts/validate-shaders.sh.
[^blasto-scripts-package-sh]: blasto: scripts/package.sh.
[^blasto-directory-build-props]: blasto: Directory.Build.props.
[^blasto-validation-md]: blasto: VALIDATION.md.
