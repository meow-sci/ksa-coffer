# Review: content/howto/shaders (batch shaders-1)

Reviewed 2026-10-10 against `ai/catalog/batches/shaders-1.yml`, the ShaderExtensions bundle (`content/mods/shaderextensions`,
reviewed) and the lifecycle reference (`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`). Sources
re-read: ShaderExtensions `6a2eb66` (`ShaderEx`, `Patches`, `PostProcessing*`, `ImGuiShader/*`, `SharedTimeBuffer`,
`UniformBufferEx`, `PushConstantEx`), MPFX, KSA_AircraftHUD (XML, GLSL, `DrawHud`), RealAtmospheres, KSArmory, KSAStructures,
purrTTY, gatOS, unscience excerpts, and the decomp of build 2026.10.10.5554 (`Program` `PrepareFrame`/`Render`/`PostRender`/
`RenderGame`, `ModLibrary`, `GlobalShaderBindings`, `ShaderReference`, `FileReference`, `MappedMemory`, `ScreenspaceRenderer`
shader, `Universe`, `AtmosphereRenderer`, `SuperMeshRenderSystem`, game GLSL under `Content/Core/Shaders`).
All 301 fenced blocks were diffed mechanically against their sources (292 carry a `path Lx-Ly` header); the 9 others are
labelled `adapted` and were read by hand.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Engine and mod claims held up almost everywhere (descriptor bindings, pass insertion, time buffer, subpass filter, include resolution, rebuild flag consumption, bit/uniform carriers). Known facts are enforced: `ScreenspaceVert` is a 4-vertex strip (`Draw(4,...)`), the time buffer is created once and never rebuilt, AircraftHUD's three chain passes are skipped by the pinned build. Defects were mostly mislabelled lines and a few secondary claims |
| Coverage | 4 | 22 of 22 topics, every plan approach has an article, article counts equal `approaches`. Four plan features were not cited by their approach article and were added |
| Lifecycle correctness | 4 | Articles agree with the reference and the ShaderExtensions pages; wrong values were limited to two overview/frontmatter cells in compile-glsl and one contradictory HUD-hidden claim |
| Conformance | 4 | The three validators were clean before and after. Snippet range labels were off in 30 blocks, one citation was a broken placeholder, six cross-references were plain italic text |

## Defects

| File | Defect | Fixed |
|---|---|---|
| glsl-workflow/compile-glsl-at-runtime/overview.md | Approach 1 row and frontmatter claimed `startup:all-mods-loaded`; the article (correctly) compiles on first terminal creation from `StarMapAfterGui` and draws in `render:translucency`; `Program.OffscreenTarget` does not exist at AllModsLoaded. Approach 2 row said `frame:render` only | yes |
| glsl-workflow/compile-glsl-at-runtime/compile-glsl-at-runtime-2.md | Frontmatter `lifecycle` listed `startup:all-mods-loaded` (no such hook; patches are applied dynamically) and `hooks` omitted the `StarMapBeforeGui` anchor update the body describes | yes |
| glsl-workflow/reload-a-mod-shader-in-a-running-game/reload-a-mod-shader-in-a-running-game-2.md | Source citation was an unresolved `[[ARM:tools/ksa-mcp/server.py#L269-L296]]` placeholder; replaced by the pinned KSArmory blob link (range L269-L295) | yes |
| reload overview/-1/-2, check-mod-shaders-offline-with-glslang overview/-1/-2/-3 | Cross-references to the file-bridge, MCP and pre-push/CI topics were italic plain text although the targets exist; now links | yes |
| stock-shaders/extend-stock-sky-and-cloud-shaders/extend-stock-sky-and-cloud-shaders-2.md | Snippet labelled `ShadowBuilder.cs L814-L835` stopped at L822 without `// ...`; now shows the whole `PatchFaceLight` | yes |
| screen-effects/add-film-grain-and-blue-noise-dithering/add-film-grain-and-blue-noise-dithering-2.md | Said the mod's `OnFrameEditor` postfix does not run with the HUD hidden and, in the same file, advised an `OnFrameEditor` postfix as the cure. The postfix runs every frame; it is `DrawHud`'s early returns (mod HUD off, map or free camera, no vehicle) that freeze the accumulated time | yes |
| post-processing/feed-uniform-buffers-to-a-shaderextensions-shader/overview.md | Approaches table lifecycle cells for articles 2 and 3 disagreed with their frontmatter (`frame:prepare`; `frame:viewports`, `startup:asset-load`) | yes |
| compute-effects/reconstruct-scene-positions-from-depth-in-a-compute-shader/{overview,-1,-3}.md | `Program.cs L4910-L4916` anchors and snippet header were one line early; `PartSelectedRenderer.Run` (L4917) was outside the stated range | yes |
| 24 files (list in the topic logs) | 30 snippet headers named a line range that was not the range shown (closing brace outside, excerpt longer than shown, one excerpt of HudAssests.xml L7-L19 showing L7-L13). Headers and matching link anchors corrected | yes |
| include-the-game-shader-library-in-mod-glsl-1.md | Plan assigns `ksastructures/core-shader-library-include` to approach 1; not in `demonstrated_by` or the page | yes |
| compile-glsl-at-runtime-1.md | Plan assigns the unscience pebbles preview feature to approach 1; not cited | yes |
| send-push-constants-to-a-shaderextensions-shader-2.md | `effect-shader-contract` in `demonstrated_by` but never linked | yes |
| bend-the-picture-with-crt-curvature-and-chromatic-aberration-3.md | Plan feature `imgui-window-hud-shader` in `demonstrated_by` but not linked | yes |
| blur/refract/bend/film-grain overviews | Approach rows built on KSA_AircraftHUD's glass chain did not say the pinned ShaderExtensions skips all three passes (`RequiresUniqueRenderpass`, `SubpassId`) | yes |
| write-a-post-processing-fragment-shader-3.md | Lifecycle table omitted that the first call of the transpiled replacement schedules a renderer rebuild (`Patches.ImGuiPreRender`, `rebuilt` flag) | yes |
| send-extra-data-to-stock-shaders-without-new-uniforms-3.md | Adapted block labelled L200-L213, actual inserted block L203-L210 | yes |

Files with material changes carry `generated.by: claude-code/sonnet-5.5` (15 files); every touched topic has an `**Update**` entry in its `log.md`.

## Checked and confirmed (no change)

- `ScreenspaceVert` (`screenspace_quad.vert`): four vertices from `gl_VertexIndex`, pipeline `TriangleStrip`, `Draw(4,1,0,0)`; no text says "triangle" or "3 vertices".
- Shared time buffer: `SharedTimeBuffer.Initialize` runs once (`RenderGame` prefix or `RebuildRenderer` postfix, first wins), never disposed; `push-constants-3` states this.
- Dynamic-offset count (`1 + N` for a set 0 with none), `currentFrame` vs `_currentFrame` miss, `TransferDst` layout after the pre-ImGui copy, swapchain without `TRANSFER_DST`, CMAA2 bypass, ImGui push-constant overlap: all stated with the "read from code, not reproduced" caveat.
- Render phases (`BeginRenderPass` L4948, composite L4949, `RenderDrawData` L4950, `EndRenderPass` L4951), `OnFrameEditor` outside the `DrawUI` guard, `StarMapAfterGui` inside it, `PrepareAll` before `LoadAll` (immediate-load include trick), `RendererRebuildNeeded` consumed in `PrepareFrame`/`Render`/`PostRender`.
- Plan coverage: all 22 topics, all approach counts, file naming, per-group and per-topic `index.md`, per-topic `log.md`, all `demonstrated_by` ids exist, all relative links resolve.

## Features added

None. The batch is a how-to batch; no uncovered reusable mechanism turned up in the shader mods surveyed.

## Open concerns

- The Vulkan defects in the ShaderExtensions pages (offset count, layout, swapchain usage, CMAA2) are reading-based. No validation-layer or in-game run backs them.
- `ImGuiVertexPost` is referenced by the README and AircraftHUD but defined nowhere in the corpus; the articles say so, but whether the HUD's `ImGuiShader` renders at all on the pinned stack is unknown.
- `send-extra-data...-2` still mentions the pre-5482 seam `PartModelModule.UpdateRenderData` (historical; the method does not exist in 5554).
- `SunbloomRenderer.Render` is also called from the editor path (`Program.cs` L5061); the compute-effect articles note the hook fires per viewport but none says the mods' prefixes can run in the vehicle editor.
- The lifecycle reference row for `PostRender` says it contains `FrameNumber++`; in 5554 `FrameNumber++` follows the `PostRender` call inside `OnFrame` (the how-to articles state it correctly). Not edited (outside this bundle).
- Author-measured costs and visual results in the KSArmory and RealAtmospheres articles are taken from the mods' own comments and were not re-measured.
