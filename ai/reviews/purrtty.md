# Review: content/mods/purrtty

Reviewed 2026-10-10 against:

- purrtty `71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5`
- StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`
- gatOS `b88c28588e013841cfec58a1b3a09fcbd2cbc47e` (consumer side of the shell contract)
- decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`)

The review also covered `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` and `ai/catalog/purrtty.yml`.

## Checks run

- **Validators.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean before
  and after the review. They also pass on the lifecycle reference after its edit.
- **Snippets.** A script compared all 79 fenced blocks line by line, in order, with the cited range in the checkout
  or the decomp. All were verbatim. One range was loose (`ModAssemblyLoadContext.cs` L24-L35 ends on a blank line)
  and is now L24-L34.
- **Anchors.** A script listed the first and last line behind each of the 228 line-anchored links.
  - None was out of range.
  - One link was mislabelled: a "RenderGame, RenderViewport, RenderEditor call sites" link covered only
    `RenderGame`. It is now three links, L4595-L4606, L4893-L4935 and L5052-L5055.
  - A few ranges stop mid-method (`DispatchKeyEvent`, `OnMouseButton`). They still cover the cited behavior.
- **Game types.** All 52 distinct `game_types` entries exist as decompiled files.
- **Rendering path, traced in code:**
  - `RenderTranslucencyPassPatch` is a Harmony postfix on `KSA.SuperMeshRenderSystem.RenderTranslucencyPass(IViewport,
    CommandBuffer, bool)`. Its parameter order differs from the target, and Harmony binds parameters by name.
  - There are three call sites:
    - `Program.RenderViewport` L4597: each visible secondary viewport, recorded before the main view.
    - `Program.RenderGame` L4901: the main view, after `PartModelGlass` and before translucent particles, resolve,
      underwater, bloom, orbit lines, gizmos, composite and ImGui.
    - `Program.RenderEditor` L5053.

    All three pass `useCustomRenderPass: true`, so the postfix draws in every one of them. The phase is
    `render:translucency` inside `frame:render`. `RenderTranslucencyPass` closes its own dynamic-rendering scope;
    the postfix opens a second one with `LoadOp.Load`.
  - The quad pipeline uses `VkPipelineRenderingCreateInfo` with formats and samples taken from
    `Program.OffscreenTarget`. Its fragment shader is compiled at runtime by `ShaderModuleUtils.FromString`, and it
    uses KSA's `UnlitMeshVert` (`DefaultAssets.xml` L53). The stock `UnlitMesh.frag` forces alpha to 1 and the
    presets compare with `GreaterOrEqual`, both as the bundle says.
  - Each in-world terminal has its own `ImGuiContext` sharing the main atlas, a second `ImGuiBackendVulkanImpl`
    (which asserts no renderer backend is installed), a classic `VkRenderPass`, a two-slot fence and command-buffer
    ring, and its own `Graphics.Submit`.
  - All of that runs in `StarMapAfterGui`, between the main `ImGui.NewFrame` and `ImGui.Render`, and only in
    frames where the HUD is drawn and the content changed.
  - Kitty images use `SimpleVkTexture` plus `ImGuiBackend.Vulkan.AddTexture`. The pool has 1000 sets, and the
    image is sampled in `RenderGame`'s ImGui pass.
- **Input path, traced in code:**
  - GLFW callbacks fire inside `Glfw.PollEvents` in `PrepareFrame`. That is `frame:input`: solvers settled, before
    dispatch, before this frame's UI.
  - `Patch01` prefixes `Program.OnKey`, `Patch03` prefixes `GameSettings.OnKeyAll`, and `Patch04` prefixes the
    private `Program.DispatchKeyEvent`, which `OnMouseButton` reaches directly for mouse-bound actions (L2020).
  - The focus flag those prefixes read is written in the previous frame's `StarMapAfterGui`.
- **Threading.** PTY pumps hand bytes to a locked inbox: 24 MiB cap, 500 ms backpressure wait, then a drop
  followed by a CAN/ST reset. `BuildFrame` drains it on the main thread inside `StarMapAfterGui`. Input goes to a
  `PtyInputQueue` writer thread with a 1 MiB cap.
- **Native libraries.** Resolution uses a `[ModuleInitializer]` `SetDllImportResolver` in `Ghostty.Vt` and in
  `purrTTY.Terminal` (for `libc`). StarMap's `ModAssemblyLoadContext` overrides `Load` only.
- **StarMap facts, re-derived from `RuntimeMod.cs`, `ModLoader.cs`, `ModAssemblyLoadContext.cs`, `StarMapCore.cs`
  and `ModLibraryPatches.cs`:**
  - `RuntimeMod.ExportedAssemblies` is never populated.
  - The import set is the importer's `ImportedAssemblies` in both registration orders. When the dependency
    registered first, `CalculateUseableAssemblies` falls back to the dependency's `EntryAssembly` if
    `ImportedAssemblies` is empty. When the dependent registered first, `CheckForDependentMods` copies
    `ImportedAssemblies` exactly.
  - `DeInit` calls `UnpatchAll()` before `ModLoader.Dispose` raises `StarMapUnload`.
  - There is no in-process reload; the "new mods" restart starts a new process and exits.
  - The parameterless `OnImmediateLoad()` is never called.
- **Lifecycle reference.** Both sides agreed on every hook the bundle uses. The reference lacked three facts, and
  the bundle had made one error that traces to that gap. Both sides are fixed and the reference change is logged.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | The rendering and input mechanics, all 79 snippets and the engine members were right. Wrong or overstated: the `ExportedAssemblies` framing in the contract concept (and its slug), logging first use "during `StarMapImmediateLoad`", "renderer live only from `StarMapAllModsLoaded`", the hot-zone z-order rationale, and the ALC wording in the resolver concept |
| Coverage | 5 | 35 concepts for about 38k LOC. An independent survey found every reusable mechanism already covered; nothing needed merging (see below) |
| Lifecycle correctness | 4 | Every hook target and patch kind was right, as was `render:translucency` and `frame:input`. Errors: the Game Console was said to run commands in the same phase as the stock console (it runs them in `frame:draw-ui` after dispatch; the stock console runs them in `frame:input`). Omissions: the global unpatch before `StarMapUnload`; the per-call-site firing of the render postfix; the secondary-viewport menu-bar path; the HUD-hidden gating of `StarMapAfterGui` work |
| Conformance | 4 | Validators were clean. The overview feature table had drifted from frontmatter (8 lifecycle lists, 6 titles). The catalog had a mod-specific how-to slug. The contract slug named a mechanism that has no effect |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/custom-shell-contract-via-exported-assemblies.md (now `custom-shell-contract-via-assembly-imports.md`) | Description, hooks and step 2 presented `ExportedAssemblies` as part of the sharing mechanism, and the slug named it. The lifecycle row covered only one registration order. The Game APIs line listed `StarMapConfig.ExportedAssemblies` as part of the mechanism | yes: renamed and links updated. The text now says only the importer's `ImportedAssemblies` takes effect, covers both orders (`CalculateUseableAssemblies`, `CheckForDependentMods`), and notes that gatOS's comment credits the wrong list |
| features/per-platform-native-library-resolver.md | Said `ModAssemblyLoadContext.Load` resolves "dependency mods' exported assemblies"; snippet range L24-L35 was loose | yes |
| features/brutal-logging-category.md | First use placed "during `StarMapImmediateLoad`", which StarMap never calls for this parameterless method; `ExportedAssemblies` given as the reason other mods share the category | yes |
| overview.md | `StarMapUnload` row omitted that `StarMapCore.DeInit` has already removed every Harmony patch, so `UnpatchAll("purrTTY")` is a no-op | yes |
| overview.md | `StarMapAfterGui` row said "every frame, also while hidden" without the `DrawUI` skip or the post-dispatch position | yes |
| overview.md | `mod.toml` snippet showed `ExportedAssemblies` with no note that it is inert; the compatibility notes did not mention that StarMap has no in-process reload | yes |
| overview.md | Feature table lifecycles and titles out of sync with frontmatter | yes (regenerated from frontmatter) |
| overview.md | The Rendering summary did not say the translucency postfix fires per call site | yes |
| features/failure-isolated-harmony-patching.md | Treated StarMap's "reload model" as real (StarMap 4dc60f8 never reloads in-process). `StarMapUnload` row said "unpatch" when the patches are already gone. Claimed every patched method is first called after `StarMapAllModsLoaded`, but `ConsoleWindow.Print` runs during loading as a log provider | yes |
| features/game-console-shell.md | Said `TerminalInterface.Execute` via purrTTY runs in "the same phase in which KSA runs its own console (`Program.OnDrawUiConsole`)". The stock console executes on Enter from `ConsoleWindowEx.OnKey` -> `HandleInputAction(Submit)` inside `Program.OnKey` (`frame:input`, solvers settled). purrTTY's path runs after dispatch | yes (lifecycle bullet, pitfall and Game APIs row added) |
| features/game-menu-with-modmenu-fallback.md | Lifecycle covered only the main bar from `OnDrawUiThreadSafe`. A hovered secondary game viewport also calls `DrawMenuBar` -> `DrawProgramMenusHook` from `GameViewport.DrawImGui` inside `OnDrawUiViewports`, before `StarMapAfterGui`. The reload rationale for the cached probe was overstated | yes (also notes `BeginMenuBar`, not `BeginMainMenuBar`, and that `SetMenuBarInUse` always targets `MainViewport`) |
| features/draw-after-translucency-pass-postfix.md | Call-site link covered only `RenderGame`. The lifecycle section did not state that the postfix fires per call (secondary viewports first, then main, or editor). "Kitten and portrait cameras" was imprecise. Did not say that textures freeze while the HUD is hidden | yes |
| features/world-space-quad-pipeline-custom-shader.md | Said the postfix samples the texture "this frame's `OnAfterGui` rendered" (only when the content changed and the HUD is drawn). Hooks omitted `StarMapAfterGui`, where the pipeline is built. No note that the pipeline is never rebuilt when MSAA changes | yes (the MSAA pitfall is marked as inferred) |
| features/offscreen-imgui-context-render-to-texture.md | Creation justified by "the live renderer". The real constraint is the ImGui frame plus `Program.OffscreenTarget`, which exists only after `ModLibrary.LoadAll`. The per-frame row omitted the dirty and HUD gating | yes |
| features/ksa-upgrade-coupling-review-skill.md | Repeated the skill's "renderer is live only from `AllModsLoaded`" as fact. `Program.GetRenderer()` is set in the constructor before any mod hook; the main viewport and `OffscreenTarget` come after `LoadAll` | yes (quote kept, corrected from the decomp) |
| features/click-through-lock-mode-hot-zone.md | Said the hot zone sits above the terminal because it is submitted later. ImGui z-order follows focus. It works because the locked window has `NoMouseInputs` and the fill is on the foreground draw list | yes |
| features/gate-game-input-while-terminal-focused.md | "Every frame" flag refresh not qualified by `DrawUI`; the mouse-binding gate's position in `PollEvents` was not stated | yes |
| ai/catalog/purrtty.yml | Contract id, summary, hooks and how-to note relied on `ExportedAssemblies`. Quad-pipeline hooks lacked `StarMapAfterGui`. How-to slug `add-shell-to-purrtty` was mod-specific. Summaries lacked the call-site and console-timing facts | yes (`register-with-another-mods-plugin-registry`; ids, categories, lifecycle and hooks match frontmatter, re-checked by script) |
| howto/getting-started/lifecycle/game-loop-and-lifecycle/overview.md | Lacked: (1) a sub-renderer postfix runs once per call (`RenderViewport` per secondary viewport, `RenderGame`, `RenderEditor`); (2) the stock console executes commands in `frame:input` via `ConsoleWindowEx.OnKey`; (3) `DispatchKeyEvent` also requires the console closed; (4) mouse bindings reach `DispatchKeyEvent` from `OnMouseButton`. Gap (2) led to the game-console error above | yes, logged in that topic's `log.md` (`ConsoleWindowEx` source added) |

Checked and correct, no change needed:

- **Translucency postfix.** The Harmony target, kind and parameter binding are as stated, as are the barrier
  presets, `LoadOp.Load` re-scope and dynamic-rendering pipeline.
- **Shader pieces.** `UnlitMeshVert` and `UnlitMesh.frag` behave as stated, as do the reverse-Z presets,
  `ShaderModuleUtils.FromString` and `Program.OffscreenTarget`.
- **Secondary ImGui context and backend.** The shared atlas, the `With` save and restore, nulling `drawData.Textures`,
  the `ImException` skip, `Queue.Submit` taking a lock, and the two-frame deferred teardown with a `WaitIdle` are
  all as stated. Shutdown never touches the device, which `Program.Dispose` has already destroyed by then.
- **Kitty textures.** `AddTexture` and `RemoveTexture`, the 3-frame delayed dispose, the LRU of 32 (4-256) and the
  1000-set pool are as stated.
- **Input gate.** The `OnKey` gate chain (L1745-L1754), the `ShouldForwardKeyboardToGame` secondary-window rule,
  `GameViewport.DrawImGui` `SetNextFrameWantCaptureKeyboard(false)` and the release-arm toggles are as stated.
- **Threading and native code.** The PTY thread map, the inbox and queue caps, `NativeLibraryResolver` and `libc`
  mapping, and the font and atlas timing (`FontManager.Initialize` before mods; `RegenerateFonts` clears the atlas)
  are as stated.
- **StarMap.** The `OnImmediateLoad` signature finding was already correct in the overview.

## Features added

None. The survey covered:

- every C# file, plus `docs/`, `plans/`, `.claude/skills/`, the csproj files and the native vendor tree
- Harmony and reflection sites, Vulkan and ImGui usage, threads, and persistence

Candidates turned out to be covered inside existing concepts:

| Candidate | Covered in |
|---|---|
| Perf HUD | grid renderer |
| `AtomicFile` | settings, tests |
| Startup-command history | layouts |
| DEC 2026 synchronized output, DA replies | headless surface |
| Tracked-grid-ref selection | input, binding |
| Vehicle and part pickers | anchor |
| Dirty-gated off-screen re-render | render-to-texture |

No concepts were merged; overlapping pairs (surface vs PTY handoff, themes vs theme dialog) describe distinct
mechanisms.

## Open concerns

- **Not verified in game:**
  - quads drawn into secondary viewports and the editor with the main camera's matrices
  - the stale quad pipeline after an MSAA sample-count change (inferred from `RebuildRenderer` versus the
    build-once `SharedQuadResource`)
  - the off-screen pass relying on queue submission order without an explicit color-write to fragment-read
    dependency (the bundle already flags this)
- **Simulation-state commands from the Game Console.** Typed into purrTTY's Game Console, these run after physics
  dispatch. The race is inferred from the frame order, not reproduced.
- **Decouple and dock part identity.** "KSA moves the same `Part` instance into the new vehicle" comes from
  purrTTY's gotcha 31; I did not trace it in the decomp.
- **`ImGuiHotkeyHelpers`.** It reads the `ref bool` `KeySuper` property through `PropertyInfo.GetValue`. I assumed
  this works on .NET 10 (reflection supports ref-returning getters) but did not test it.
- **ModMenu.** Discovery of `[ModMenuEntry]` cannot be checked: ModMenu is not in the corpus.
- **Concurrent edits.** Other review agents were editing the shared lifecycle reference and the shared scratchpad
  during this review. My reference edits were applied as exact-match replacements on freshly read content, and the
  validators pass, but a later concurrent write could still interleave.
