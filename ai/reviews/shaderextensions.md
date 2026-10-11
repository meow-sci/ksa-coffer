# Review: content/mods/shaderextensions

Reviewed 2026-10-10 against ShaderExtensions `6a2eb66ea85bcaa2d4657e502a4f75e92693ea77`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, KittenExtensions `b52467541a4fda3c3771eb2c157ed7574f9e2d7c`, MPFX and
KSA_AircraftHUD at their pinned refs, and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`).
The review read all 25 C# files of the mod (the gauge code is fully commented out), its README, `Deprecated.md`,
compatibility plan, csproj, targets and CI workflow, and its git history. On the game side it covered
`KSA/Program.cs` (`OnFrame`, `PrepareFrame`, `Render`, `PostRender`, `RenderGame` L4646-L4955, `RenderFinalComposite`,
`RenderEditor`, `RebuildRenderer`, `BuildRenderTargets`), `KSA/ImGuiBackendVulkanImpl.cs`, `KSA/GlobalShaderBindings.cs`,
`KSA/ScreenspaceRenderer.cs`, `KSA/CommandBufferEx.cs`, `KSA/ScreenshotCapture.cs`, `KSA/LookupCollection.cs`,
`KSA/ModLibrary.cs` (`Bind`), `KSA/AssetBundle.cs`, `KSA.Rendering/RenderTarget.cs`,
`KSA.Rendering.PostProcessing/Cmaa2Renderer.cs`, `Core/Renderer.cs` (swapchain usage, main render pass),
`Brutal.VulkanApi/VkDeviceExtensions.cs`, `Brutal.VulkanApi.Abstractions/MappedMemory.cs`, `Brutal.ImGuiApi/*`,
`RenderCore/RenderTechnique.cs` and `RenderCore.Pipelines/*`. It also checked StarMap `GameSurveyer.cs`,
`StarMapCore.cs`, `ModLoader.cs`, `RuntimeMod.cs`, `Program.cs` and `Patches/*.cs`, and
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

The IL of `Program.RenderGame` was disassembled with `ilspycmd -il` from `current/dll/KSA.dll`. The C# `unmanaged`
constraint question was settled with a small .NET 10 test program.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | The Vulkan and IL analysis held up in full: all four reported Vulkan defects, the `_currentFrame` reflection bug and the hard-coded locals are correct. One runtime claim was wrong (`MakeGenericMethod` enforcing `unmanaged`). The overview said ImGui platform windows are never processed, which is wrong for ImGui window shaders. The transpiler-failure consequence was understated |
| Coverage | 5 | 16 concepts for about 3.2k LOC. The independent survey (patches, reflection, ImGui, Vulkan, XML, build, CI, deprecated code) found no uncovered reusable mechanism and nothing to merge |
| Lifecycle correctness | 4 | Every frontmatter `lifecycle`/`hooks` target exists with the right patch kind and phase. Minor faults: the transpiler page listed companion patches from other features as its own hooks; two overview table cells disagreed with the frontmatter; the `Program.Main` prefix was not marked as a closest-fit value; the consumer-write timing missed that `StarMapAfterGui` runs after the next physics step is dispatched |
| Conformance | 4 | All three validators were clean before and after. Every snippet was verbatim except one invented "illustrative" XML block. The catalog disagreed with the frontmatter on 15 fields and had two mod-specific how-to titles |

## Writer findings checked against code

- **RenderGame IL shape: confirmed.** Locals are `[0] FrameResources`, `[1] CommandBuffer`, `[3] VkSubpassContents`,
  `[4] VkRenderPassBeginInfo`. The method holds one `RenderDrawData` (`callvirt`, IL_0fa4), one
  `VkDeviceExtensions::BeginRenderPass<CommandBuffer>` (`call`, IL_0f8c, preceded by `ldloc.1`, `ldloca.s 4`, `ldloc.3`)
  and one `EndRenderPass<CommandBuffer>` (IL_0fac). All other passes use `BeginRendering`. So `ImGuiPreRender`'s
  `(CommandBuffer, in VkRenderPassBeginInfo, VkSubpassContents)` signature consumes the original stack exactly, and the
  inserted `ldloc.1`/`ldloc.0` load the right values.
- **Where the passes record: confirmed.** The pre-ImGui slot sits after the `SampledReadVfc` barrier (L4945),
  `OnRenderGameCapture` (L4946) and `RenderAaPreparePasses` (L4947), in place of `BeginRenderPass` (L4948). The
  post-ImGui slot sits after `EndRenderPass` (L4951) and before `OnRenderGameSwapchainGrab` (L4952). `RenderEditor`
  (L5071-L5075) is not patched.
- **ImGuiShader reflection: confirmed.** `_pipelineLayout` (L600), `_shaderModuleVert` (L606) and `_shaderModuleFrag`
  (L608) are private readonly fields. `UpdateTexture(ImTextureDataPtr)` (L920) is private. `ShaderReference.Shader` has
  a private setter (L34). The public `ProcessTextureUpdates` (L905) would replace the `UpdateTexture` reflection.
- **Dynamic-offset count: confirmed one too many.** The post pass sends `1 + N` offsets. `GlobalShaderBindings` set 0
  has two plain `UniformBuffer` bindings (L104-L118) and per-frame sets, and mod buffers are `UniformBufferDynamic`.
- **`_currentFrame` reflection: confirmed broken.** The field is `_currentFrame` (L33), but the helper asks for
  `currentFrame`, so it returns 0. Commit 873b6af's message shows the intent. The zero lands on set 1's first dynamic
  buffer, which needs 0.
- **Image layout after the pre-ImGui copy-back: confirmed.** `CopyTo` leaves the tracked state at `TransferDst`.
  `ScreenspaceRenderer.Render` (L204-L211) issues no barrier, while the composite descriptor expects
  `ShaderReadOnlyOptimal` (`RebuildRenderer` L5140).
- **Swapchain usage: confirmed.** `ImageUsage = TransferSrcBit | ColorAttachmentBit` (`Renderer.cs` L715), so
  `vkCmdCopyImage` into the swapchain is outside valid usage. The main pass ends in `PresentSrcKHR` (L798, L817), as
  `RenderNow` assumes.
- **CMAA2: confirmed.** `RenderPreparePasses` composites the offscreen image into `_sceneLdrTarget` before the hook, and
  `RenderFinalBlit` samples `_sceneLdrTarget`.
- **High-resolution screenshot copy overflow: logic confirmed** (`Renderer.Extent => ExtentOverride ?? _extent`, and
  `ScreenshotCapture` L234-L240 rebuilds with `skipSwapchain: true`). Not reproduced in game.
- **ImGui push-constant overlap: confirmed.** The vertex range is at offset 0 (32 bytes), and `CreatePushConstantRanges`
  also starts at 0.
- **Duck typing: confirmed with one correction.** Matching uses `AttributeType.FullName`, and the scan gate is
  `asm.GetType("ShaderExtensions.SxUniformBufferAttribute")` only. MPFX (`Buffers.cs`) and KSA_AircraftHUD
  (`ShaderExtensionsHelpers.cs`) both declare all four classes in the `ShaderExtensions` namespace. The `unmanaged`
  claim was wrong (see defects).

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/duck-typed-attribute-api.md | Pitfall said `MakeGenericMethod` enforces `where T : unmanaged` and throws in the `Program.Main` prefix. The runtime enforces only `struct` (verified with a .NET 10 test); the failure comes later from `MemoryMarshal` casts in `MappedMemory.AsSpan` / `GetData` | yes |
| features/duck-typed-attribute-api.md | `Program.Main` prefix labelled `startup:starmap-before-main` without saying it is the closest value | yes |
| features/cross-pass-image-references.md | Invented "illustrative" XML presented as a fenced snippet; replaced with the verbatim KSA_AircraftHUD sample (HudAssests.xml L14-L19) and a prose description of a current declaration | yes |
| features/cross-pass-image-references.md | "Only backwards" omitted that an input reference may name the shader's own `RenderPassId` (input registered before resolve) | yes |
| features/rendergame-render-pass-transpiler.md | "Failures surface at startup" understated: the anchor exception propagates out of `StarMapBeforeMain` uncaught (RuntimeMod L156-L159 to StarMap `Main`), so the launch aborts | yes |
| features/rendergame-render-pass-transpiler.md | Second-mod pitfall said a later transpiler "would find `ImGuiPreRender` instead"; it finds no `BeginRenderPass` at all and throws | yes |
| features/rendergame-render-pass-transpiler.md | `hooks`/`techniques` listed the `Program.Main` prefix, `RenderGame` prefix and `RebuildRenderer` postfix that belong to other features; trimmed to the transpiler and `StarMapBeforeMain`. The unused `MatcherFindReplace` helper was not mentioned | yes |
| features/rendergame-render-pass-transpiler.md | Installation bullet did not cite where StarMap invokes `BeforeMain` | yes |
| overview.md | Scope bullet said ImGui platform windows are not processed; `ImGuiRenderers.Render` walks every `PlatformIO.Viewports` entry, so only the post chains skip them | yes |
| overview.md | Vulkan notes omitted the `currentFrame` reflection bug and the ImGui push-constant overlap | yes |
| overview.md | Feature-table lifecycle cells for the transpiler and marker-callback pages disagreed with their frontmatter | yes |
| overview.md | `StarMapBeforeMain` row cited only `GameSurveyer`; `Program.Main` row lacked its closest lifecycle value; exit-time id-less `UnpatchAll` not mentioned | yes |
| features/imgui-window-post-shader.md | No note that tagged windows in ImGui platform windows are rewritten too | yes |
| features/imgui-window-post-shader.md | `ImGuiVertexPost` pitfall left "release zip not checked"; KSA_AircraftHUD also references it without shipping it, and the project has no shader files to copy | yes |
| features/custom-uniform-buffers.md | Consumer-write timing missed that `StarMapAfterGui` runs after the next physics step is dispatched (`Program.cs` L2216-L2221) | yes |
| features/renderer-rebuild-hook.md | Shutdown note missed that StarMap's id-less `UnpatchAll` runs before any `StarMapUnload` | yes |
| features/post-processing-pass-chain.md | `game_types` listed `RenderCore.Pipelines.SimplePipeline`, which the mod never touches (it is only named as an alternative) | yes |
| features/shared-time-uniform-buffer.md | `Universe.GetElapsedSeconds` linked to the `SimulationSpeed` lines (L122-L131); now also L2393-L2396 | yes |
| features/xml-asset-types-and-element-injection.md | `techniques` omitted `unsafe-accessor`, which the catalog had | yes |
| ai/catalog/shaderextensions.yml | 15 `techniques`/`hooks`/`game_types` fields out of sync with the frontmatter; two how-to titles tied to ShaderExtensions or KittenExtensions; added a generic transpiler-failure topic | yes |
| howto .../overview.md | Render note gave only the pre-ImGui chain at step 23; the ImGui window shaders and draw-list rewrite also happen there | yes |
| howto .../overview.md | Startup row 6 did not mention the `Program.Main` prefixes (KittenExtensions, ShaderExtensions) or how bundles label them | yes |
| howto .../game-loop-and-lifecycle-2.md | IL-shape gotcha (already partly fixed by the MPFX review) did not say a ShaderExtensions anchor miss aborts the launch; added with a `RuntimeMod.cs` source | yes |

## Lifecycle reference changes (logged in its log.md)

- `overview.md` render-sequence note: step 23's replacement method records the per-window ImGui shaders and rewrites
  the tagged draw lists that step 25 draws, then the pre-ImGui chain, then begins the pass. The post-ImGui chain sits
  after `EndRenderPass` and before the swapchain screenshot grab. The link was widened to L151-L225.
- `overview.md` startup row 6: `Program.Main` prefixes run after every `StarMapBeforeMain` and StarMap's own patches
  and before the constructor. Bundles label them `startup:starmap-before-main`, the closest value.
- `game-loop-and-lifecycle-2.md`: the IL-shape gotcha now states the abort-on-anchor-miss consequence. A concurrent MPFX
  review had already rewritten the local-index half of that bullet, and both edits are present.
- Checked and unchanged: `RenderGame` steps 22-26, the vocabulary rows, and the `RebuildRenderer` callers.

## Features added

None. The survey found every active mechanism covered. `GaugeShader/*` and the gauge transpilers are entirely
commented out (documented in the overview and `Deprecated.md`). `MatcherFindReplace` is an unused helper, now noted on
the transpiler page. `.github/agents` and the Copilot instructions are contributor tooling, not mod features.

## Open concerns

- All Vulkan defects come from reading code, including the extra dynamic offset, the `TransferDst` layout at composite
  time, the copy into a swapchain without `TRANSFER_DST`, the push-constant overlap and the screenshot copy overflow.
  None was reproduced with validation layers or in game.
- Where `ImGuiVertexPost` comes from is unknown. No reference repo or game `Content` defines it, yet the README and
  KSA_AircraftHUD both use it.
- Rewriting ImGui platform windows was derived from `ImGuiRenderers.Render` iterating `PlatformIO.Viewports`. It was
  not tested with multi-viewports enabled.
- "Harmony rethrows a transpiler exception out of `PatchAll`" follows Harmony 2.x's patch processor. StarMap ships its
  own `0Harmony.dll`, whose version is not pinned in the reference set.
- The shared time buffer and every mod uniform buffer are single host-coherent copies written while the previous frame
  may still be in flight (`MaxFramesInFlight = 2`). The pages state this as a design caveat; the visual impact is
  unmeasured.
