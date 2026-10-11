# Review: content/mods/realatmospheres

Reviewed 2026-10-10. The baselines were:

- RealAtmospheres `19dc37a55b2e359bd8eec2f5b41722ab11ae0c46`
- StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`
- KittenExtensions `b52467541a4fda3c3771eb2c157ed7574f9e2d7c`
- decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`)

The cross-check covered:

- **Mod code.** All ten C# files of the mod (`ModMain.cs`, `ShadowBuilder.cs`, `Shared/SharedShadow.cs`,
  `FlightAtmospheres.cs`, `AtmosphereTables*.cs`, `NearbyBody.cs`, `Menu.cs`, `Settings.cs`, and
  `Payloads.cs` where cited), plus `mod.toml`, the `.csproj` and `release-files.txt`.
- **Game C#.** `Program.cs` (constructor, `OnFrame`, `OnPreRender`, `PostRender`, `UpdateShaderData`),
  `ModLibrary.cs`, `Mod.cs`, `FileReference.cs`, `ShaderReference.cs`, `ShaderModuleUtils.cs`,
  `ShaderC.cs`, `ShaderCompilerResolve.cs` and `ShaderReloader.cs`.
- **Atmosphere and physics.** `AtmosphereRenderer.cs`, `PlanetTransparenciesRenderer.cs`,
  `PhysicalAtmosphereReference.cs`, `PhysicsEnvironment.cs`, `PhysicsStates.cs`, `PhysicsBubble.cs`,
  `AtmosphericBody.cs` and `CelestialSystem.cs`.
- **Game shaders.** `AtmosphereData.glsl`, `AtmosphereDataUbo.glsl`, `AtmosphereFunctions.glsl`,
  `Atmosphere.comp`, `CloudFunctions.glsl`, `CloudData.glsl`, `CloudShadows.glsl`, `RaymarchCloud.comp`
  and `RingShadows.glsl`.
- **Other repos.** StarMap's loader and patchers, KittenExtensions' `Patches.cs` and `Patch/Patcher.cs`,
  and `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

Independent checks:

- **Patch engine run.** `ShadowBuilder.Build`, `Payloads.cs`, the generated tables and `SharedShadow.cs`
  were compiled into a scratch .NET 10 console program. The program ran against
  `current/Content/Core`, with empty placeholder files for the 22 shipped textures. Every XML and
  shader patch applied and not one `WARN` line was logged. Eleven shader files changed, and the
  shared shadow received three Sol templates plus `Astronomicals.xml`.
- **Shader compile.** Every `.comp`, `.frag` and `.vert` in the stock tree and in the patched tree was
  compiled with `glslc --target-env=vulkan1.3`. The same four files fail in both trees (gauge and blur
  shaders that need game defines), and none of them is patched. All patched top-level shaders compile.
- **IL.** `CelestialSystem.GetNearbyAstronomical` was disassembled from `current/dll/KSA.dll` with
  ilspycmd 11.0. Its sequence matches what the transpiler expects:
  `ldloc.s 5; ldloc.s 4; callvirt get_MeanRadius; sub; ldloc.1; clt`, then
  `ldloc.s 4; stloc.0; ldloc.s 5; stloc.1`, with `nearbyDistance` as `ldarg.3`. No label falls in the
  replaced range.
- **Snippets and anchors.** All 50 fenced snippets are verbatim, as a script that compares them line
  by line with the checkout confirmed. All 494 line-anchored links were listed and spot-read, and the
  anchors added in this review were checked individually. Every `game_types` entry (53 types) exists
  in the decomp.
- **Timing.** Shader compilation was traced: `ShaderReference.DoLoad` runs from the `ILoader` pass of
  `ModLibrary.LoadAll`, on thread-pool threads. The physical-atmosphere readers were traced: drag,
  buoyancy, chutes and engines run on the vehicle workers; audio, exhaust and plume code runs on the
  main thread. `FillPlanetAtmosphereData` was traced through `BeginFrame` and `PrepareAtmosphereData`
  inside `RenderTransparencies`. There the LUT-validity check comes after the prefix, so a cleared
  flag regenerates the LUTs in the same frame.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets, anchors, IL, anchor counts and engine members were all correct. Seven claims were wrong: the compile-failure path, the "worst case is stock" claim, two-prefix chaining, the name order of mods, the platform note on asset paths, "each case degrades one feature", and the KittenExtensions interaction (left as "unverified" although the code decides it) |
| Coverage | 5 | 21 concepts cover every mechanism in about 6k lines of C# and all Python and PowerShell tooling. Nothing was missing or redundant. LUT invalidation stays inside the side-channel concept, where it belongs |
| Lifecycle correctness | 4 | Hook targets, patch kinds and frame positions were right: shader redirect in `startup:asset-load`, side channel in `render:atmosphere`, transpiler in `frame:celestials` and `frame:render`. The flight concept wrongly used `frame:draw-ui` for its main-thread readers, which are `frame:viewports`, `frame:pre-render` and `frame:post-render`. The thread-pool context of the `FromFile` prefix was right in the bundle but wrong in the reference. 5 after fixes |
| Conformance | 4 | The validator, ref checker and index check were clean before and after the review. The catalog's hooks, techniques and game types had drifted from the frontmatter, and the flight lifecycle in the catalog was stale |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/core-xml-entry-redirect.md, overview.md | The KittenExtensions interaction was left "unverified". The code decides it. The KittenExtensions `PrepareAll` prefix builds its document from on-disk `mod.toml` paths, its transpiled loaders look files up by `Path.GetFullPath(filePath)`, and Real Atmospheres' prefixes have already swapped Core's entries to shadow paths. The lookups miss and return `null`, so the Sol headers, the Sol template and the Core library bodies are not loaded. The bundle now marks this as read from the code, not run in game | yes |
| features/core-xml-entry-redirect.md | It was "not checked" whether the saved last system is affected. It is not: `ConfigOnStartPopup` stores the template `Id`, and `XmlName` is read only by `Mod.LoadSystems` | yes |
| features/core-xml-entry-redirect.md | Patch order was missing. The Real Atmospheres `PrepareSystems` prefix runs before StarMap's `StarMapImmediateLoad` prefix (StarMap patches after every `BeforeMain`), and the KittenExtensions `PrepareAll` prefix finishes first | yes |
| features/core-xml-entry-redirect.md, overview.md | The bundle said the `{ASSETS}\...` texture paths assume Windows. `Mod.GetPath` runs `Filepath.CorrectSeparators`, which turns backslashes into `/`, so the paths are portable | yes |
| features/shader-file-redirect.md | "Whichever prefix runs last wins" is wrong for chained `ref string` prefixes. The first rewrite decides, unless a later marker matches the rewritten path | yes |
| features/shader-file-redirect.md | The bundle stated as fact that `Planet.Render.Core.dll` is not loaded at `BeforeMain`. This comes from the mod's comment, and the code only loads the assembly when `TypeByName` fails | yes |
| features/shader-file-redirect.md | Main-thread `SimpleShaderStages.SetShaderFromFile` compiles were omitted (CACAO and raytracing passes use hard-coded `Content/Core/Shaders` paths). So were the hot-reload consequence and the `Mod.GetPath` step in the Linux reasoning | yes |
| features/shadow-tree-anchor-patching.md | The bundle said a bad payload "throws `ShaderCompilationException` from `FromFile` during loading". `FileReference.Load` catches and logs that exception. The `ShaderReference` keeps no module, and the implicit `VkShaderModule` conversion throws `NullReferenceException` later | yes |
| features/shadow-tree-anchor-patching.md, features/cloud-face-lighting.md | The face-lighting patch was described as three edits; `PatchFaceLight` checks and applies four anchors | yes |
| features/cross-mod-shared-shadow.md | The bundle relied on "name order" for the two mods. StarMap runs `BeforeMain` in `manifest.toml` order, and KSA appends new folders in `Directory.GetDirectories` order | yes |
| features/cross-mod-shared-shadow.md | It was "not checked" whether `_RealSharedShadow` is listed as a mod. `ModLibrary.AddMods` requires a `mod.toml`, so it never is | yes |
| features/measured-flight-atmospheres.md, overview.md, catalog | Lifecycle `frame:draw-ui` was wrong. The main-thread callers of the two functions are audio (`GameViewport.OnFrame`, `GameAudio.UpdateAudio` in `PostRender`) and exhaust and plume submission (`OnPreRender`). The value is now `frame:viewports`, `frame:pre-render` and `frame:post-render` | yes |
| features/measured-flight-atmospheres.md | The reader table omitted the drag, buoyancy and chute path (`PhysicsStates.ComputeDerivatives`) and `UpdateRockets` via `VehicleUpdateState.UpdateModules`. It also omitted that the moved boundary sets `AtmosphereRadius` and `PhysicsRadius`, which force full-physics freefall from the new height (`FreefallNeedsFullPhysics`, `AtmosphericBody.GetNearSurfaceRadius`) | yes |
| features/measured-flight-atmospheres.md | "Templates loaded during preload are discarded; the weak table lets them go" was misleading: in preload the postfix never runs for celestial templates | yes |
| features/reflection-only-mod-build.md | "The worst case is a stock game" is wrong. The lookups that throw (`Mod.LoadSystems` and `PrepareSystems`, `FromFile`) come after earlier `Patch` calls, so a throw leaves a partly patched game | yes |
| features/modmenu-page-and-toml-settings.md | The bundle omitted StarMap's `DocumentsFolderPath` getter prefix (`-InstancePath`, `STARMAP_INSTANCE_PATH`), which moves `settings.toml` | yes |
| overview.md | The hook table said "UI and effects", the intro omitted the load-time postfix, the shutdown note omitted StarMap's id-less `UnpatchAll`, and "each case degrades one feature" ignored the aborting lookups | yes |
| ai/catalog/realatmospheres.yml | Hooks, techniques and `game_types` were out of sync with the frontmatter in 17 of 21 entries, and the flight lifecycle was stale. Three generic how-to topics were added | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The startup section said "everything below runs on the main thread", but the `ILoader.Load` pass in row 10 runs in `Parallel.ForEachAsync` on thread-pool threads. That pass loads every file asset and compiles every `<Shader>` through `ShaderModuleUtils.FromFile`. Fixed in the intro, row 10, the threading table and the `startup:asset-load` vocabulary row; `FileReference.cs` and `ShaderReference.cs` were added to `sources` | yes, logged |

The bundle and the reference otherwise agreed. Points checked and unchanged:

- `StarMapBeforeMain` runs before `Program.Main`.
- The XML prefixes fire in `PrepareAll`, `PreloadAssetBundles`, `LoadEditorTags` and `LoadAll`.
- `GetNearbyAstronomical` runs in `OnFrameCelestials` and in `UpdateShaderData` inside `Render`.
- `FillPlanetAtmosphereData` runs during `RenderGame` command recording.
- The known pitfalls (render-data postfixes are `frame:render`, StarMap frame hooks run after
  dispatch, zero-argument `StarMapImmediateLoad`) do not apply to this mod. It uses only
  `StarMapBeforeMain` and has no unload hook.

## Features added

None. The independent survey covered every C# file, `mod.toml`, the `.csproj`, `release-files.txt`,
the two PowerShell scripts and all 14 Python scripts. It found no reusable mechanism without a concept.
The smaller mechanisms are already sections of existing concepts:

- Titan's Rayleigh colour by altitude
- the Venus cloud-turn computation
- the `ref object __result` struct edit
- the renderer capture prefix
- the asset-gated insertions
- ring-shadow self-detection

Catalog topics added:

- `file-redirects-and-xml-patch-loaders`
- `atmosphere-boundary-and-physics-regions`
- `test-shader-text-patches-offline`

## Open concerns

- **KittenExtensions miss path.** The `XPathPatch` submodule of KittenExtensions is not checked out.
  Whether its `File()` returns an invalid node or throws for an unknown path is unverified. Both paths
  end in `null` from `XmlPatcher.Load<T>`. The resulting failure (missing Sol bodies) is derived from
  the code and was not run in game.
- **ModMenu timing.** ModMenu's discovery and call timing remain unverified, because its source is not
  among the reference repositories.
- **Real Surfaces.** Real Surfaces is not in the repository, so the Triton ordering consequence rests
  on the `SharedShadow.cs` comment.
- **Linux.** The Linux behaviour of the shader redirect (marker never matches, shaders stay stock) is
  inferred from `Path.GetFullPath` semantics and not tested.
- **Planet.Render.Core load state.** Whether `Planet.Render.Core.dll` is already loaded at
  `StarMapBeforeMain` cannot be decided statically. The mod handles both cases.
- **JIT inlining.** The prefixes on the two small `PhysicalAtmosphereReference` functions assume that
  the JIT does not inline them into callers. The KSAero review found `KSA.dll` built with
  `DisableOptimizations`; this review did not re-check that attribute.
- **Shader compile check.** The `glslc` check used default include resolution and no
  `RAY_QUERIES_SUPPORTED` define. The game's shaderc options were not reproduced exactly. The
  placeholder assets prove only that the asset-gated XML edits apply, not that the textures load.
