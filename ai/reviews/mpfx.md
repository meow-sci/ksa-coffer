# Review: content/mods/mpfx

Reviewed 2026-10-10 against MPFX `fbdeeebca9bd2e0f0001348b6903af3a652cecd0`, ShaderExtensions
`6a2eb66ea85bcaa2d4657e502a4f75e92693ea77` (read only, its bundle was being edited by another reviewer),
StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`, KittenExtensions `b524675` (attribute matching only)
and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). The cross-check covered every
MPFX C# file, the asset XML, all 30 shaders, the csproj, targets, props and workflow, and on the
ShaderExtensions side `AssetEx.cs`, `Attributes.cs`, `UniformBufferEx.cs`, `PushConstantEx.cs`,
`ShaderBinding.cs`, `ShaderEx.cs`, `SharedTimeBuffer.cs`, `Patches.cs` and every file under
`PostProcessing/`. On the game side it covered `Program.cs` (`OnFrame`, `Render`, `OnPreRender`,
`RenderGame`, `RenderFinalComposite`, constructor), `Core/Renderer.cs`, `Cmaa2Renderer.cs`,
`ScreenshotCapture.cs`, `GlobalShaderBindings.cs`, `ModLibrary.cs`, `SerializedId.cs`, `float4x4.cs`,
`Content/Core/DefaultAssets.xml`, `screenspace_quad.vert` and `composite.frag`. It also covered the
lifecycle reference in `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

Independent checks I ran:

- **Snippets.** A script compared all 31 fenced snippets with the checkouts line by line. All were
  verbatim and in range. Two ended mid-block without `// ...`.
- **IL.** I disassembled `KSA.Program::RenderGame` with ilspycmd 11.0. Local 0 is `FrameResources` and
  local 1 is `CommandBuffer`, so ShaderExtensions' hard-coded `ldloc.1`/`ldloc.0` are right in this
  build. The swapchain pass is `BeginRenderPass` at IL_0f8c, `RenderFinalComposite`, `RenderDrawData`,
  then `EndRenderPass` at IL_0fac. `OnRenderGameSwapchainGrab` follows the inserted post chain.
- **Asset declarations.** Each of the 32 elements matches a `[KxAsset]` type
  (`PostProcessingShader`, `GlobalPostShader`). `Path` is `FileReference.LocalPath`, resolved per mod,
  and `RenderPassId` runs from 128 to 143. Neither `SubpassId` nor `RequiresUniqueRenderpass` is
  declared. `FilterSupported` rejects `SubpassId >= 0` or `RequiresUniqueRenderpass=true` with a logged
  error at chain build.
- **Buffer sharing.** References with `Size <= 0` resolve through the type-agnostic
  `IShaderBinding.Bindings` by `KeyHash`. That is why the post color-balance element
  (`MPFXDefaultBufferAsset`) binds the `mat4` buffer.
- **Duck-typed coupling.** `AssetEx.Init` runs in a `Program.Main` prefix after StarMap has loaded
  every mod and run every `StarMapBeforeMain`. It scans only assemblies where
  `ShaderExtensions.SxUniformBufferAttribute` resolves, compares attributes by `FullName`, and fills
  the delegates by return type. KittenExtensions' `KxAssetAttribute` is `internal`, which is why MPFX
  carries its own copy.
- **std140.** The struct and GLSL sizes match: default buffer 8 bytes, vec4 buffer 32, mat4 buffer
  128, blur 112 (`int` + 3 pad + `float[24]` against `int` + `vec4[6]`), push constant 4. `float4x4`
  stores rows X..W contiguously, so C# row r becomes GLSL column r.
- **Binding contract.** Set 1 holds binding 0 (`CombinedImageSampler`, `LinearClampedSampler`),
  binding 1 (plain `UniformBuffer`, the shared time buffer) and binding 2 and up (`i + 2` over
  `Bindings`, which excludes push constants). The uniform buffers are `UniformBufferDynamic` at
  offset 0. Set 0 is `GlobalShaderBindings.DescriptorSet(0)`.
- **Upload lifecycle.** `StarMapAfterGui` is the `OnDrawUiViewports` postfix inside `if (DrawUI)`, after
  `PrepareFrame` has dispatched the next physics step. `RenderGame` is recorded later in the same
  `OnFrame` (`Render` L2443-L2480), except on rebuild, editor and early-exit frames. Push constants are
  copied at record time. The uniform buffers are single host-coherent allocations. The frame-slot fence
  wait (`Renderer.TryAcquireNextFrame` L350, `MaxFramesInFlight = 2`) comes after `AfterGui`, inside
  `OnPreRender`.
- **Pre-ImGui HDR clamp.** `FilmGrainPre.frag` L250 clamps before its `data.x == 0` early return.
  Every pass always runs, so the HDR image is capped at 1 from pass 136 on. `composite.frag` applies
  exposure and tonemapping afterwards.
- **CMAA2.** `RenderAaPreparePasses` (L4947, before the hook) tonemaps the offscreen image into
  `_sceneLdrTarget`, and `RenderFinalBlit` draws that target. With CMAA2 the pre chain is therefore
  computed but never displayed.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets, anchors, asset types, the binding contract and std140 claims held. Wrong claims: set 0 "bound with the current frame's dynamic offset", blur weights recomputed "only when the radius changes", the "first member pre, second member post" rule stated for every effect, and the README credited with listing film grain and blur. The most user-visible engine consequence (pre-ImGui effects invisible under CMAA2) was missing |
| Coverage | 5 | An independent survey of all 1.8k C# lines, the XML, the 30 shaders and the tooling found no reusable mechanism without a concept and nothing to merge. Ten concepts fit a mod this size |
| Lifecycle correctness | 4 | Every hook target, patch kind and frame position was right. Missing: the CMAA2 ordering consequence of where the pre chain is inserted, GPU reads of the shared buffers racing the next `AfterGui` (the fence wait happens later, in `OnPreRender`), frames on which `RenderGame` is not recorded, and the `RebuildRenderer` postfix as a hook. 5 after fixes |
| Conformance | 4 | Validator, ref checker and index check were clean before and after. Two snippets were truncated mid-block without `// ...`, and two body-cited files (`FilmGrainPre.frag` in effect-chain-assets, `Serializer.cs` in overview) were missing from `sources` |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/effect-shader-contract.md | The set 0 row said set 0 is bound "with the current frame's dynamic offset". ShaderExtensions reflects a `currentFrame` field that this build names `_currentFrame`, so the offset is always 0. Set 0 also has only plain `UniformBuffer` bindings, so the extra offset does not apply to anything. MPFX never reads set 0 | yes |
| features/effect-shader-contract.md | The binding 2 row did not say that the descriptor is `UniformBufferDynamic` (offset 0), or that `i + 2` counts only non-push-constant children | yes |
| features/effect-shader-contract.md | "One block serves both sides" was stated for every effect. Vignette and blur have one buffer per side (data/color, radius/weights), and film grain packs both sides into `data.xy`/`data.zw` | yes |
| features/effect-shader-contract.md | Neutral hue shift was called identity. The rounded YIQ constants give about 0.1 percent error. The HDR rule also left out that film grain clamps unconditionally | yes |
| features/effect-chain-assets.md | The pre-chain description assumed the composite always tonemaps the modified offscreen image. With CMAA2, `RenderAaPreparePasses` tonemaps it into CMAA2's own target before the hook and the final blit reads that target, so the pre chain is never shown | yes |
| features/effect-chain-assets.md | The HDR clamp finding did not say that passes 137-143 and the composite see the clipped image, or that it is only visible without CMAA2. It also lacked the composite-screenshot ordering | yes |
| features/effect-chain-assets.md | `hooks` omitted the `Program.RebuildRenderer` postfix that builds the chains. The lifecycle text did not say the first recorded frame schedules a rebuild, or when `SubpassId` rejection happens | yes (catalog too) |
| features/effect-chain-assets.md | Repeated the README's "no guaranteed order" for equal `RenderPassId`s without noting that the stable `OrderBy` keeps load order | yes |
| features/effect-chain-assets.md | "Every pass runs every frame" did not mention frames without `RenderGame` (renderer rebuild, editor) | yes |
| features/effect-chain-assets.md | `FilmGrainPre.frag` was cited in the body but missing from `sources`. A `L4947-L4951` anchor included `RenderAaPreparePasses`; it now covers L4946-L4952 | yes |
| features/per-frame-parameter-upload.md | Did not explain GPU read timing. The fence wait for the reused frame slot happens in `OnPreRender`, after `AfterGui`, and buffers are single allocations, so a write can reach the previous frame still executing. It also left out the frames on which `RenderGame` is not recorded, and that the hook runs after the physics step dispatch | yes |
| features/per-frame-parameter-upload.md | The L120-L160 snippet ended mid-block without `// ...` | yes |
| features/duck-typed-buffer-structs.md | Said buffers are created "when the game calls the binder's `Bind`" without saying when. It is `ModLibrary.Bind` in the `Program` constructor, run in parallel over all binders. Also missing: the `UniformBufferDynamic` descriptor type | yes |
| features/separable-gaussian-blur.md | The intro said weights are recomputed "only when the radius changes". They are recomputed whenever the shared dirty flag is raised. The heading "Two passes, one file" was misleading (one file per axis, shared by both chains), and "21 exponentials" is per side | yes |
| features/color-grading-math.md | The lifecycle said pre-side values above 1 stay HDR, ignoring the film grain clamp at 136 and the CMAA2 case. The anchor included `RenderAaPreparePasses` | yes |
| features/film-grain-and-experimental-effects.md | The clamp pitfall was not qualified for CMAA2 or downstream passes. Missing pitfall: the grain clocks live on the profile and are not copied by the copy constructor | yes |
| features/effect-settings-window.md | The L319-L356 snippet ended mid-block without `// ...` | yes |
| features/xml-effect-profiles.md | The `float4x4` link pointed only at the `[XmlIgnore]` row fields, not at the `[XmlAttribute] M11` properties it describes | yes |
| overview.md | The intro credited the README with listing film grain and blur. The README lists neither; they exist only in the asset file | yes |
| overview.md | The ShaderExtensions dependency row omitted `ImportedAssemblies = ShaderExtensions` | yes |
| overview.md | The compatibility notes lacked the CMAA2 consequence and the unchecked hard-coded locals. An anchor included `RenderAaPreparePasses`. `Serializer.cs` was linked but not in `sources` | yes |
| howto/.../game-loop-and-lifecycle/game-loop-and-lifecycle-2.md (reference) | Said ShaderExtensions' "hard-coded local indices" throw and leave the game unpatched on a shape change. ShaderExtensions throws only when its anchor calls are missing. Its `ldloc.1`/`ldloc.0` are never checked, so a local reordering would be patched silently | yes, logged |

The `StarMapAfterGui` row and render steps 22-26 in the lifecycle reference, which MPFX relies on, were
checked against the decomp and IL and needed no change.

## Features added

None. The survey found nothing worth its own concept. Candidates were the debug "Rebuild renderers"
button (a one-line `Program.ScheduleRendererRebuild` call, covered in the overview and the settings
window), the window placement (routine) and the vignette aspect correction (covered in color grading).
The catalog gained the `RebuildRenderer` hook and two how-to topics:
`cmaa2-and-custom-post-processing` and `persistently-mapped-uniform-buffer`, both reused from the
ShaderExtensions catalog.

## Open concerns

- ModMenu is not in the reference set, so how `[ModMenuEntry]` is discovered remains unverified. The
  page marks this.
- Three findings come from reading the decomp, with no runtime test: CMAA2 hiding the pre chain, the
  film-grain HDR clamp, and the one-frame-early buffer visibility. The pages say so.
- MPFX inherits two ShaderExtensions defects documented in that bundle. The pass binds one dynamic
  offset more than the bound sets declare, which is a Vulkan validation error. The offscreen image is
  also left in `TRANSFER_DST` before the composite samples it. Both rely on driver tolerance.
- The lifecycle reference's render-sequence step 2 says only that `Renderer.TryAcquireNextFrame`
  "acquires the swapchain image". It also waits on the fence of the frame slot it reuses, which is the
  timing fact behind the buffer race. Other reviewers were editing that file concurrently and the
  statement is incomplete rather than wrong, so I did not change it. It is worth adding with a
  `Core/Renderer.cs` source.
- The links to `../../shaderextensions/features/pre-imgui-post-processing.md` assume the
  ShaderExtensions reviewer keeps that slug. Its title is quoted as "Pre-ImGui post-processing on the HDR
  scene image".
