# Review: content/mods/ksa-aircrafthud

Reviewed 2026-10-10 against KSA_AircraftHUD `4e4c71719a8355afb1fc608f54d531676bec4ef3`, ShaderExtensions
`6a2eb66ea85bcaa2d4657e502a4f75e92693ea77` (plus its `v0.4.0` tag, merge `94f8081` of `5317c7a`, for the
version notes), StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`). The shaderextensions bundle was read, not modified.

Independent checks I ran:

- **Frame position of the hook.** `Program.OnFrame` (L2238-L2334) calls `PrepareFrame`, then
  `GizmosRenderer.ResetInstances`, `PrepareImGui`, `OnFrameEditor`, `OnFrameViewports` and only then
  the two `if (DrawUI)` blocks. The `OnFrameEditor` postfix therefore runs with the UI hidden (F2,
  `InputAction.ToggleUi`) and inside the ImGui frame. It runs after `ExecuteNextVehicleSolvers` has
  dispatched the next step, and not at all on `PrepareFrame`'s `Exit` frames (font rebuild, window
  close). The postfix parameter name `dtPlayer` matches the target. `Init(Mod)` and
  `DrawHudMenu(double)` match StarMap's `IsValidSignature` rules.
- **Window shader.** `SxImGui.CustomShader` writes `uint2(KeyHash("SxImGuiShader"), key)` as callback
  data. In ShaderExtensions, `ImGuiRenderers.FindCustomRenderer` matches the marker, and
  `ImGuiPostRenderer` renders the list offscreen and swaps it for an `AddImage`. The quad bounds are
  clip-clamped vertex extents (`ImGuiBaseRenderer` L203-L248). `Patches.ImGuiPreRender` replaces the
  `BeginRenderPass` before `RenderFinalComposite`/`RenderDrawData` in `RenderGame` (L4948-L4950).
- **Rejection on the pinned ShaderExtensions (writer's claim confirmed).** `GlassBlurH` and
  `GlassBlurV` declare `RequiresUniqueRenderpass="true"`, and `PostProcess` declares `SubpassId="0"`
  (`>= 0`). `PostProcessingChain.FilterSupported` skips all three with a logged error when the chain
  is built. They still load as assets, so their push constants register. The `ImGuiShader` is not
  filtered. Bindings: the pinned version uses a time UBO at binding 1 with extras from 2, while
  `v0.4.0` (`git show v0.4.0:ShaderExtensions/ShaderEx.cs`) put extras at `i + 1`. `v0.4.0`'s
  non-unique passes bound binding 0 as an `InputAttachment`.
- **CMAA2.** `RenderAaPreparePasses` (step 22) composites `_offscreenTarget` into CMAA2's LDR target
  before the replaced `BeginRenderPass`, and `RenderFinalComposite` then only blits that target
  (`Cmaa2Renderer` L166-L176). A pre-ImGui chain is therefore invisible under CMAA2. The default
  setting is MSAA x2 (`GameSettings` L1303).
- **Font wipe.** `GameSettings.SaveChanges` and the apply button call
  `Program.ScheduleFontRebuild`. The next `PrepareFrame` runs `FontManager.RegenerateFonts`, which
  starts with `ImGui.GetIO().Fonts.Clear()`, and then returns `Exit`.
- **Flight data.**
  - `Vehicle.GetSurfaceSpeed`, `GetBarometricAltitude`, `GetRadarAltitude`, `GetBody2Cci`,
    `VehicleReferenceFrameEx.GetEnuBody2Cci`, `QuaternionEx` and the `PhysicalAtmosphereReference`
    exponentials are as described.
  - `Orbit.Inclination` is radians (`Inclination < Math.PI`).
  - `ApoapsisAltitude`/`PeriapsisAltitude` exist.
  - The speed factors are exactly 7x the usual ones (25.2/3.6, 15.6586/2.23694, 13.6/1.94384).
  - Alpha/beta use `Orbit.StateVectors.VelocityCci` (inertial), and `GetSurfaceVelocityCci` exists.
  - `AccelerationBody` is `ForceBody / mass` with gravity carried separately in `AccelPhys`
    (`PhysicsStates` L1130-L1141, L976; `ConstraintSim` L923-L935). The game's own `G-FORCE` readout
    is `AccelerationBody.Length() / 9.80665` (`Vehicle` L5591).
  - `StellarBody`/`FixedStar`/`OrbitingStar` implement `IParentBody` without deriving from
    `Celestial`, and `App.Run`, `Program.Main` and StarMap's `GameSurveyer.RunGame` have no catch.
- **Snippets and anchors.** All 22 snippets are verbatim (20 original, plus one new mod snippet and
  one decomp snippet). Every GitHub anchor in the bundle was printed and checked against the
  checkouts, including all anchors added in this review.
- **Tools.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean
  before and after. They are also clean for the game-loop reference.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 3 | Snippets and most engine members were correct, and the rejection claim and the `v0.4.0` notes held. Six statements were wrong: the NRE on skipped passes, the `MenuBar` reasoning, off-screen elements extending the quad, 8-bit banding, the ten-key INI, and "does not load" for the whole XML. Two serious data bugs were missed: the g-load counts gravity twice, and the parent cast crashes in solar orbit. The parent cast was listed only as hypothetical |
| Coverage | 4 | The always-on `OnFrameEditor` hook, which is the mod's key timing technique, had no concept of its own. It was added. Nothing needed merging |
| Lifecycle correctness | 4 | The hook target, the patch kind and the frame position (after `NewFrame`, before `OnFrameViewports`, outside `DrawUI`) were right. Three points were wrong or missing: the vehicle state was called "settled for this frame" without saying the next step is in flight, "every frame" ignored `Exit` frames, and CMAA2 was missing from the render-side timing |
| Conformance | 4 | The validator and ref checks were clean. The catalog had drifted from the frontmatter (font hooks and game types, flight-data game types), and the overview table was missing a lifecycle value |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/flight-data-from-vehicle.md | The g-load bug was not reported. `AccelerationBody` already excludes gravity, so `(len - g)/g0` reads about 0 G in level flight or at rest and about -g/g0 in orbit | yes |
| features/flight-data-from-vehicle.md | The `(Celestial)` cast was described as "if the parent is ever not a Celestial". In fact, every vehicle orbiting a star (`StellarBody`) makes it throw on every frame, uncaught up to `App.Run` | yes |
| features/flight-data-from-vehicle.md | Missing: a `Console.WriteLine` on every frame near airless bodies (`AtmosphereReference` is nullable) | yes |
| features/flight-data-from-vehicle.md | The alpha/beta row omitted the 90-degree shift from `AngleRadToDegHalf`. Mach was said to be "hidden when density is 0", but the exponential model never reaches 0 | yes |
| features/flight-data-from-vehicle.md, features/fullscreen-drawlist-hud.md | The lifecycle said the vehicle state is "this frame's settled state" without stating that the next step is already dispatched (reads are consistent, writes would race) | yes |
| features/fullscreen-drawlist-hud.md, overview.md | The postfix was said to run "every frame". It is skipped on `PrepareFrame` `Exit` frames | yes |
| features/fullscreen-drawlist-hud.md | The "stays behind every other window" z-order was presented without noting it is Dear ImGui behaviour. The imperial-unit cut-off of the attitude block (`altitude < 999999` after conversion) was missing | yes |
| features/custom-hud-font.md | The rebuild pitfall did not say that the rebuild frame skips the HUD and that the next `PushFont` gets a dangling pointer | yes |
| features/imgui-window-hud-shader.md | Said off-screen HUD elements would extend the shader quad, but vertices are clamped to clip rects and the framebuffer. The claim that the 1/255-alpha rectangle is "slightly visible" was unverified | yes (replaced, removed) |
| features/glass-post-process-chain.md | Missing: the chain's output is invisible under CMAA2. The chain runs on the HDR `R16G16B16A16SFloat` image. `CurvedUV` ignores its `strength`/`scale` arguments | yes |
| features/blue-noise-dithering.md | "Breaks up the 8-bit banding" was wrong because the pass runs before tonemapping. The time base was given as "real time" instead of player time | yes |
| features/sx-push-constants-and-buffers.md | Claimed a pass skipped by ShaderExtensions causes a `NullReferenceException` every frame. Its push constant is registered at asset load, so the lookups succeed | yes |
| features/ini-settings-and-settings-window.md | "Ten-key" INI; the file has eleven keys | yes |
| features/ini-settings-and-settings-window.md | "Menus work because the window has `MenuBar`" was wrong. `BeginMenuBar` is never called, so the flag only adds an empty strip, and the game's menu bar is a separate `Menu Bar` window | yes |
| features/ini-settings-and-settings-window.md | The consequence of a parse exception was unstated. It escapes `Init`, which StarMap invokes without a `try`/`catch`, so the game stops at mod loading | yes |
| features/modmenu-entry-vendored-attributes.md | The menu-bar placement and next-frame opening were stated as fact. They are now tied to `Program.DrawMenuBar` and marked as conditional on ModMenu's unverified hook | yes |
| overview.md | Said "The asset XML does not load". Only the three post-process passes are skipped; the `ImGuiShader` loads | yes |
| overview.md | Missing: the pinned ShaderExtensions requires KittenExtensions Continued, which cannot coexist with the KX build the README links. The feature table also lacked `frame:viewports` for the glass chain | yes |
| ai/catalog/ksa-aircrafthud.yml | The `custom-hud-font` hooks and game_types and the `flight-data-from-vehicle` game_types did not match the frontmatter | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The hidden-HUD paragraph named only `OnDrawUiConsole`. It now covers the `OnFrameEditor`/`OnFrameViewports` postfixes and `Exit` frames | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Row 10 gave `editor:on-frame` only, while the conventions map `OnFrameEditor` to `frame:viewports`. Clarified for flight use, and the vocabulary-map row was updated | yes, logged |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | The render notes lacked the CMAA2 caveat for edits between steps 22 and 24 | yes, logged |

## Features added

- [Always-on ImGui hook from a Program.OnFrameEditor postfix](../../content/mods/ksa-aircrafthud/features/always-on-onframeeditor-hook.md)
  (patching). It covers the frame-position table, what is safe at that point, the skipped `Exit`
  frames, the one-frame camera lag, editor and main-menu behaviour, and shutdown. It also compares the
  hook with `OnFrameViewports`, the StarMap GUI hooks, `OnDrawUiConsole` and `StarMapAfterOnFrame`.
- Catalog entry added, with the how-to topics `choose-imgui-hook-point` and
  `patch-private-game-method-by-name`. Two more topics were added elsewhere: `handle-star-parent-bodies`
  and `post-processing-and-anti-aliasing`.

## Open concerns

- ModMenu's source is not in the corpus. How it discovers and calls `[ModMenuEntry]`, and from which
  hook, remains unverified.
- The following are derived from the code and were not observed in game:
  - the solar-orbit crash
  - the dangling font pointer after a font rebuild
  - the invisibility under CMAA2
- Several statements rest on library behaviour that no checkout contains:
  - Dear ImGui: `NoBringToFrontOnFocus` z-order, `BeginMenu` outside a menu bar, `ImFontAtlas::Clear`
    freeing fonts, `PopFont` underflow
  - Harmony: binding by parameter name, throwing on a missing target
- The intent of the 0.07 speed scaling is unknown. The +90-degree heading offset in `RadToDeg` was not
  checked against the ENU axis convention, so whether the heading tape matches compass heading is
  unverified.
- Whether the unused `set = 1` `HudTestBuffer` block in `UI_PP_HUD.frag` passes Vulkan validation
  with the set-0-only ImGui shader layout was not tested.
- The game-loop reference was being edited concurrently by another reviewer: the ShaderExtensions
  entry at 13:09Z touched the same render-notes bullet. My reference changes were additive (a new
  bullet, an extended paragraph, row 10 and vocabulary-map cells, and one new source), but the
  orchestrator should re-run the reference checks after all reviews land.
