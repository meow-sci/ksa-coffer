---
type: How-To
title: 'Declare post-processing assets: a small file with a chain, an input reference and an ImGuiShader'
description: One asset file with three chained PostProcessingShader passes, a PostProcessingInputReference that lets the composite see the unblurred scene, and an ImGuiShader for one window
topic: declare-post-processing-shader-assets-in-xml
category: shaders
group: post-processing
approach: 2
difficulty: intermediate
prerequisites: [starmap, shaderextensions, kittenextensions]
demonstrated_by: [mods/ksa-aircrafthud/features/glass-post-process-chain, mods/ksa-aircrafthud/features/imgui-window-hud-shader]
techniques: [xml-asset, post-processing]
game_types: [KSA.ShaderReference, KSA.SerializedId, KSA.Rendering.RenderImage]
lifecycle: ['startup:asset-load', 'render:post-process']
hooks: [xml-asset PostProcessingShader, xml-asset PostProcessingInputReference, xml-asset ImGuiShader]
tags: [xml-asset, input-reference, push-constant, imguishader, aircrafthud, blur-chain]
generated: {by: claude-code/opus-5.5, at: '2026-10-10T17:39:22Z'}
status: stable
repos:
- {name: KSA_AircraftHUD, git: 'https://github.com/uriahgnu/KSA_AircraftHUD.git', ref: 4e4c71719a8355afb1fc608f54d531676bec4ef3}
- {name: ShaderExtensions, git: 'https://github.com/AMPW-german/ShaderExtensions.git', ref: 6a2eb66ea85bcaa2d4657e502a4f75e92693ea77}
game: {build: 2026.10.10.5554, git: 'git@github.com:meow-sci/ksa-game-assemblies.git', ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0}
sources:
- {id: ksa-aircrafthud-mod, repo: KSA_AircraftHUD, path: mod.toml, resource: 'https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/mod.toml', title: KSA_AircraftHUD/mod.toml}
- {id: ksa-aircrafthud-hudassests, repo: KSA_AircraftHUD, path: HudAssests.xml, resource: 'https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/HudAssests.xml', title: KSA_AircraftHUD/HudAssests.xml}
- {id: ksa-aircrafthud-postprocess, repo: KSA_AircraftHUD, path: Shaders/PostProcess.frag, resource: 'https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/Shaders/PostProcess.frag', title: KSA_AircraftHUD/Shaders/PostProcess.frag}
- {id: ksa-aircrafthud-shaderextensionshelpers, repo: KSA_AircraftHUD, path: ShaderExtensionsHelpers.cs, resource: 'https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/ShaderExtensionsHelpers.cs', title: KSA_AircraftHUD/ShaderExtensionsHelpers.cs}
- {id: shaderextensions-postprocessinginputreference, repo: ShaderExtensions, path: ShaderExtensions/PostProcessing/PostProcessingInputReference.cs, resource: 'https://github.com/AMPW-german/ShaderExtensions/blob/6a2eb66ea85bcaa2d4657e502a4f75e92693ea77/ShaderExtensions/PostProcessing/PostProcessingInputReference.cs', title: ShaderExtensions/ShaderExtensions/PostProcessing/PostProcessingInputReference.cs}
- {id: shaderextensions-readme, repo: ShaderExtensions, path: README.md, resource: 'https://github.com/AMPW-german/ShaderExtensions/blob/6a2eb66ea85bcaa2d4657e502a4f75e92693ea77/README.md', title: ShaderExtensions/README.md}
---
KSA_AircraftHUD keeps its whole shader setup in one 27-line asset file: three post-processing passes
that make a canopy-glass look, and an `ImGuiShader` that shades the HUD window. This article reads
that file as a template for a small chain with a back-reference: pass 64 needs both the blurred image
(the previous pass) and the original scene, which only an input reference can provide. The file was
written for an older ShaderExtensions that had subpasses; the changes needed for the pinned
ShaderExtensions are listed below and the adapted XML is labelled.

## Background: how the game does it

By default pass *n* samples pass *n-1*, and pass 0 samples the game's offscreen image. A blur
followed by a composite that must still see the sharp scene breaks that rule: the composite is
pass 64, its implicit input is the blur output, and the sharp image is what pass 62 read. ShaderExtensions
adds the child element `<PostProcessingInputReference RenderPassId="N" />`, which becomes one more
`sampler2D` of set 1 bound to "the image pass N sampled" (details in
[how references resolve](declare-post-processing-shader-assets-in-xml-3.md)).

## Lifecycle and timing

| Moment | Event | Value |
|---|---|---|
| Game start | XML parsed; `Initialize(this)` runs on each input reference and demands a `RenderPassId` | `startup:asset-load` |
| Chain (re)build | References are resolved against already built passes | `frame:prepare` / `frame:render` |
| Each frame | Passes record in `RenderPassId` order inside `RenderGame` | `render:post-process` |

See the [render sequence of the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence) for where the pre-ImGui chain sits; the `ImGuiShader` is recorded by the same
ShaderExtensions entry point right before it.

## Steps

1. **List the file in `mod.toml`:** `assets = [ "HudAssests.xml" ]` ([mod.toml](https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/mod.toml)).

2. **Write the chain, in `RenderPassId` order.** The original file:

   ```xml
   <!-- HudAssests.xml L7-L26 (KSA_AircraftHUD) -->
   	<PostProcessingShader Id="GlassBlurH" Path="Shaders/GaussianBlurH.frag" RenderPassId="62" RequiresUniqueRenderpass="true" >
   		<PPPushConstantsBufferAsset Id="PPPushConstantsBuffer0" Size="1" />
   		<TextureBinding Path="Textures/DirtMask.png" />
   	</PostProcessingShader>
   	<PostProcessingShader Id="GlassBlurV" Path="Shaders/GaussianBlurV.frag" RenderPassId="63" RequiresUniqueRenderpass="true" >
   		<PPPushConstantsBufferAsset Id="PPPushConstantsBuffer1" Size="1" />
   	</PostProcessingShader>
   	<PostProcessingShader Id="PostProcess" Path="Shaders/PostProcess.frag" RenderPassId="64" SubpassId="0" >
   		<PPPushConstantsBufferAsset Id="PPPushConstantsBuffer2" Size="1" />
   		<PostProcessingInputReference RenderPassId="62" SubpassId="0" />
   		<TextureBinding Path="Textures/stbn_vec3_128x128x64.png" />
   		<TextureBinding Path="Textures/DirtMask.png" />
   	</PostProcessingShader>

   	<ImGuiShader Id="HudShader">
   	    <Vertex Id="ImGuiVertexPost" />
   		<Fragment Path="Shaders/UI_PP_HUD.frag" >
   			<AircraftHUDBufferAsset Id="HudTestBuffer" Size="1" />
   		</Fragment>
   	</ImGuiShader>
   ```

   Source: [HudAssests.xml](https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/HudAssests.xml#L7-L26). One push-constant element per pass (each has its own `Id`) lets the C# side
   write enabled/time values per pass; see [Send per-frame values and time to a shader with push constants, written at the right point in the frame](../send-push-constants-to-a-shaderextensions-shader/overview.md).

3. **Use the input reference for the "also give me the sharp image" case.** Pass 64 samples the blur output
   (binding 0, implicit), the original scene through `<PostProcessingInputReference RenderPassId="62" />`
   (the image pass 62 read, which is the unprocessed scene), the noise texture and the dirt mask. Binding
   numbers follow document order after the fixed bindings, so the reference comes before the textures.

4. **Make it load on the pinned ShaderExtensions.** The published file declares `RequiresUniqueRenderpass="true"`
   and `SubpassId`, which the current chain rejects (log line `[ShaderExtensions] Skipping post processing shader ...`).
   Remove the attributes, keep the ids, and renumber the GLSL bindings (reference becomes binding 2,
   textures 3 and 4):

   ```xml
   <!-- adapted from HudAssests.xml L7-L19: attributes removed -->
   <PostProcessingShader Id="PostProcess" Path="Shaders/PostProcess.frag" RenderPassId="64">
   	<PPPushConstantsBufferAsset Id="PPPushConstantsBuffer2" Size="1" />
   	<PostProcessingInputReference RenderPassId="62" />
   	<TextureBinding Path="Textures/stbn_vec3_128x128x64.png" />
   	<TextureBinding Path="Textures/DirtMask.png" />
   </PostProcessingShader>
   ```

   The ordering of the other two passes is unchanged. The GLSL side is in
   [the port article](../write-a-post-processing-fragment-shader/write-a-post-processing-fragment-shader-2.md) of [Write a fullscreen post-processing fragment shader for KSA](../write-a-post-processing-fragment-shader/overview.md).

5. **Declare an `ImGuiShader` for one window.** It has a `<Vertex Id>` and a `<Fragment Path>` child;
   the fragment is a `ShaderEx`, so it takes the same binding children (here a uniform buffer, whose C#
   struct is `AircraftHUDBuffer`). It does nothing until the HUD tags its window with a marker callback;
   the whole recipe is in [Bend the picture with CRT curvature and chromatic aberration](../../screen-effects/bend-the-picture-with-crt-curvature-and-chromatic-aberration/overview.md).

## Complete example

| File | Role |
|---|---|
| [HudAssests.xml](https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/HudAssests.xml) | Chain, reference and `ImGuiShader` |
| [Shaders/PostProcess.frag](https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/Shaders/PostProcess.frag) | Composite that consumes the reference |
| [ShaderExtensionsHelpers.cs](https://github.com/uriahgnu/KSA_AircraftHUD/blob/4e4c71719a8355afb1fc608f54d531676bec4ef3/ShaderExtensionsHelpers.cs) | Copied attribute declarations that create the `PPPushConstantsBufferAsset` and `AircraftHUDBufferAsset` elements |

## Variations and gotchas

- **Reference ids must be earlier.** `RenderPassId="62"` works for pass 64 because 62 is built first. A
  reference to a later id throws while the chain is built.
- **Push constants take no binding number.** In pass 64 the push-constant child comes first, yet the
  reference is binding 2 (after 0 = previous image and 1 = time).
- **Case sensitivity.** The XML asks for `DirtMask.png`; the file is `DirtMask.PNG`.
- **A commented-out single-pass variant** (`GlassBlur`, `RadialBlur.frag`) stays in the file; it would not
  compile as is because it calls a function only defined as `ScreenNoise_DEPRECATED`.
- **`ImGuiVertexPost` is referenced but not shipped** by the HUD mod; check the ShaderExtensions notes in
  the CRT article before relying on it.

## See also

- Siblings: [paired pre/post assets](declare-post-processing-shader-assets-in-xml-1.md), [how references resolve](declare-post-processing-shader-assets-in-xml-3.md), [overview](overview.md)
- [Canopy-glass post-process chain](../../../../mods/ksa-aircrafthud/features/glass-post-process-chain.md), [Curved, chromatic HUD window via an ImGuiShader](../../../../mods/ksa-aircrafthud/features/imgui-window-hud-shader.md)
- [Blur the screen with a two-pass separable Gaussian](../../screen-effects/blur-the-screen-with-a-separable-gaussian/overview.md), [Refract and distort the rendered scene, and flash or shake it](../../screen-effects/refract-and-distort-the-scene/overview.md)
