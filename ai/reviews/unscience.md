# Review: content/mods/unscience

Reviewed 2026-10-10 against:

- unscience `1829b3b298dd0fa5a67342cafff29074c8c29286`
- StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`
- decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`)

The review covered the 141 concepts in the bundle (overview, 106 features, 34 Submods), `ai/catalog/unscience.yml`,
and the lifecycle reference in `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`, which gained one row.

## Scores

| Dimension | As found | After fixes | Basis |
|---|---|---|---|
| Accuracy | 4 | 5 | Every snippet was verbatim and almost every engine claim held. The wrong statements were about loader behaviour: the zero-argument `[StarMapImmediateLoad]` methods (never dispatched), the unused `ImmediateUnload` property, how `StarMapUnload` is dispatched, and the claim that the patcher unpatches method by method everywhere. One pitfall about `KittenEva` was also wrong, and the overview's summary of where state changes and render work happen was too broad. |
| Coverage | 5 | 5 | Every patch class in `unscience/Patcher.cs`, every shared-library class and every sub-mod project maps to a feature. No concept needed to be added or merged. |
| Lifecycle correctness | 4 | 5 | The PrepareFrame handoff, hidden-HUD hook, hotkey guard, part render filter, IVA force render, save hooks and coordinator all match the decomp line by line. Two features labelled a bucket submission at the start of `RenderGame` as `render:prepass`. The canopy shader patch missed its first run in the `Program` constructor. Every page that mentions unload missed the ordering at game exit: `[StarMapUnload]` runs after `Program.Dispose` has destroyed the Vulkan device. About 45 lifecycle sections were read in full; the rest were checked by script and grep only (see Open concerns). |
| Conformance | 5 | 5 | The validators, ref checks and index check were clean before and after. Frontmatter, footnotes, Submod `features` lists and the catalog were all in sync. |

## Checks run

- **Validators.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean before and
  after: 141 concepts, 0 errors, 0 warnings. They are also clean on the lifecycle reference.
- **Snippets.** A script compared all 391 fenced blocks that name a source path, line by line and in order, with
  their cited ranges in unscience, StarMap and the decomp. It also flagged lines outside the range, skipped lines
  with no `// ...` marker, and ranges that ran past the last line shown. All 391 were verbatim. Two ranges ran past
  their last line and were tightened. Three other hits were false positives (a repeated line, and closing braces
  after `// ...`).
- **Anchors.** All 1350 line-anchored GitHub links point at existing files with in-range lines, and their link text
  matches the path. Decomp anchors in the lib-* features were checked by hand against `Program.cs`, `Universe.cs`,
  `PartTree.cs`, `PartTreeRenderData.cs`, `Vehicle.cs`, `GameSettings.cs` and `ScreenshotCapture.cs`.
- **Engine members.** A script resolved every backticked `Type.Member` in the bodies against the decomp and the
  checkout. It flagged 60 hits, all of them historical names (for example `Program.OffScreenPass`,
  `GlobalShaderBindings.DynamicOffset`, `Cursor.InputRay`), inherited members, or nested and ambiguous names. Every
  `game_types` entry exists. One had the wrong namespace: `KSA.ConsoleWindow`, which is really
  `Brutal.ImGuiApi.Abstractions.ConsoleWindow`.
- **Hook targets.** All 96 distinct Harmony targets exist in 5554. Two are `AggressiveInlining`:
  `ConstraintSim.IsGroundSurfaceFor` and `NarrowPhaseCallbacks.AllowContactGeneration`. The Sphinx collider
  feature already documents that risk.
- **Lifecycle, traced in the decomp and StarMap:**
  - The `PhysicsFrameHook` transpiler swaps the single `Universe.GetJobSimStep` call at `Program.cs` L2216. That is
    after `Apply*Solvers` (L2164-L2170), input (L2179-L2181) and the nearest-orbit job queue (L2198), and before
    `ExecuteNext*Solvers` (L2217-L2221).
  - The `HiddenUiFrameHook` prefix on `OnDrawUiConsole` runs at L2275, after the `DrawUI`-gated
    `OnDrawUiFrame` / `OnDrawUiViewports` / `OnDrawUiThreadSafe`. `DrawUI` is written only by key dispatch
    (L1802) and `ScreenshotCapture` (L231, L425, L450), so the hook never double-fires.
  - The `HotkeyGuard` target is `GameSettings.OnKeyAll`, the first test in `Program.OnKey`. GLFW fires `OnKey`
    directly from `Glfw.PollEvents`, which is `frame:input`.
  - The `PartRenderFilter` and `IvaForceRender` patches sit on `PartTreeRenderData.Compose*`, reached from
    `UpdateRenderingResources` (L4355) before `PartModelRenderer.UpdateRenderData` uploads at L4374
    (`frame:render`). `Template.Internal` is read only at `PartModel.cs` L486 and `PartTreeRenderData.cs` L1300.
  - The native save hooks patch `GameSave.Populate` (virtual, not overridden), `UncompressedSave.Write`
    (returns bool), `Load`, `Universe.DeserializeSave` and `Universe.LoadSystem`. A console `save` or `load` runs
    in `Glfw.PollEvents` through `ConsoleWindowEx.OnKey` -> `HandleInputAction` -> `Submit`.
  - Render positions:
    - Graffiti: postfix on the final `ResolveAttachments` (L4932), after `GizmoPass` (L4931) and before `GridPass`
      (L4935).
    - Thug Life: postfix on `RenderMainPass`, at L4568 (secondary views), L4839 (main) and L5047 (editor).
    - Pyro: postfix on `AddVolumetricExhaustInstances` in `OnPreRender` (L2382).
    - Bloomin' Onion: rebuild via `RebuildRenderer` with `WaitIdle` at L5112 and L5210, and draws at L4771, L4831
      and L4875.
    - Sphinx: `WriteCommandsPrePass`, called from `PrePassRenderer.cs` L278.
    - Pebbles preview: drained by `RenderDrawData` at L4950 and L5074, with `MaxFramesInFlight = 2`.
  - StarMap 4dc60f8 dispatch:
    - `IsValidSignature` is enforced in `RuntimeMod.cs` L150. An `ImmediateLoad` method must take one `KSA.Mod`
      parameter (`BaseAttributes.cs` L72-L80).
    - `ImmediateUnload` is never read.
    - `DeInit` calls `UnpatchAll()` with no id, then runs `[StarMapUnload]`. `GameSurveyer.Dispose` calls it after
      `Program.Main` returns. By then `Program.Dispose` (L1362-L1487) has called `_renderer.Dispose()`, which
      destroys the device, then `Glfw.Terminate()` and `GameAudio.Release()`.
- **Consistency.** A script compared title, category and lifecycle in every overview and Submod table row with
  the feature frontmatter. It also checked each Submod's `features` and `categories` lists against the files that
  declare `submod: <slug>`, and compared the catalog's ids, titles, categories, submods, lifecycle, hooks,
  techniques, game_types and key_paths with the frontmatter. It found 0 mismatches before and after the fixes;
  catalog edits were made in step with the concept edits. All `howto_topics` are generic. Every Submod's `mod_id`
  matches its `mod.toml` `name` (Pebbles has no host and correctly has `null`).

## Defects

| File | Defect | Fixed |
|---|---|---|
| `overview.md` | The hook table listed `[StarMapImmediateLoad]` as `startup:immediate-load`. The method takes no arguments, so StarMap's signature check skips it and it never runs. | yes |
| `overview.md` | The `[StarMapUnload]` row omitted that it runs after `Program.Dispose` has destroyed the Vulkan device and released GLFW and FMOD. | yes |
| `overview.md` | The architecture paragraph had two problems. It said all simulated-state changes run at `frame:prepare` or in an `ExecuteNextVehicleSolvers` prefix, but Blinky and It's So Shiny rebuild part trees from the UI, DOH and Sphinx wait on the solvers from the UI phase, and Pebbles uses `ExecuteNextClothSolvers`. It also listed "exhaust" and "IVA compose" as render phases, although Pyro submits in `OnPreRender` and compose is a `UpdateRenderingResources` step. | yes |
| `features/unscience-supermod-host.md` | The `[StarMapImmediateLoad]` hook and table row implied the method is dispatched. The `[StarMapUnload]` row lacked the exit ordering. Catalog hooks were synced. | yes |
| `features/fixme-mod-name-standalone-mod-template.md` | Presented `[StarMapImmediateLoad]` as running "before systems and asset bundles load". Listed `ImmediateUnload` as meaningful (StarMap never reads it). The pitfall claimed the supermod unpatches method by method. A copy of the template would silently not run any `OnImmediateLoad` code. | yes |
| `submods/unscience.md`, `submods/fixme-mod-name.md` | Did not say that `[StarMapImmediateLoad]` is never dispatched. | yes |
| `submods/parts-now.md` | Described `ImmediateUnload => false` as having an effect. | yes |
| `features/lib-isubmod-contract.md` | Said `StarMapUnload` (and, by implication, `StarMapAllModsLoaded`) are dispatched from Harmony patches on `KSA.Program`. `Dispose` timing at exit was missing. | yes |
| `features/unscience-consolidated-patcher.md` | Claimed "`Unpatch(original, method)` is used throughout rather than `UnpatchAll(id)`". `CameraControllerOverridePatches.Remove` calls `UnpatchAll(harmony.Id)` on the shared instance, which turns every later `TryRemove` into a no-op. StarMap's id-less `UnpatchAll` before unload was also not mentioned. | yes |
| `features/lib-part-render-filter.md` | The pitfall said `KittenEva` part trees are not composed through this path. They are composed later in `RenderViewport` / `RenderGame` (L4698), after the part-model upload, so they are not drawn in stock. | yes |
| `features/free-fallin-canopy-material-substitution.md` | `render:prepass` for a `ChuteRenderable.Draw` bucket submission before `PrePassRenderer.Render`. Now `frame:render`, with the overview, Submod table and catalog synced. | yes |
| `features/humble-arteest-kitten-visor-toggle.md` | `render:prepass` for the `KittenRenderable.UpdateRenderData` submission. Now `frame:render`, with the overview, Submod table and catalog synced. | yes |
| `features/free-fallin-canopy-projection-shader.md` | Missed that the prefixes first run in the `Program` constructor, where `SuperMeshRenderSystem` is created at L1034 after `LoadAll` and calls `Rebuild` -> `SetShaders`. The `PrepareFrame` anchor read L2140 instead of L2141. | yes |
| `features/thug-life-textured-quad-render-pass.md` | `Dispose` destroys the pipeline, buffers and descriptor pool with no device wait, and at game exit it runs after the device was destroyed. This was not mentioned. | yes |
| `features/graffiti-projected-decal-pass.md` | The unload teardown (`WaitIdle` plus destroys) runs after `Program.Dispose` at game exit. This was not mentioned. | yes |
| `features/doh-runtime-gpu-materials.md` | "Release everything on `[StarMapUnload]`" was presented as an ordinary release. | yes |
| `features/lib-hotkey-guard.md` | `game_types` had `KSA.ConsoleWindow` instead of `Brutal.ImGuiApi.Abstractions.ConsoleWindow`. The catalog was synced. | yes |
| `features/lib-physics-frame-hook.md` | The `Program.PrepareFrame` anchor read L2140 instead of L2141. | yes |
| `features/parts-now-mesh-headroom-reservation.md` | The snippet range L169-L235 extended 8 lines past the last line shown, with no elision marker. Now L169-L227. | yes |
| `features/parts-now-runtime-part-loading.md` | The snippet range L275-L315 extended past the last line shown. Now L275-L309. | yes |
| `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/overview.md` | The `RenderGame` table skipped L4684-L4711: `PlanetRenderer.OnPreRender`, bucket clear, `KittenEva.UpdateRenderData`, `UpdateParachuteRenderData`, seated crew and PBR spheres. `RenderViewport` repeats these per secondary view. Per-frame row 22 did not say that `KittenEva` is skipped in `UpdateRenderingResources`. Row 1a was added, and the change is logged in the reference's `log.md`. | yes |

21 defects, all fixed. Changed concepts have a new `generated` timestamp, except the four with only an anchor,
namespace or snippet-range fix. The bundle `log.md` has an `**Update**` entry.

## Features added

None. Every reusable mechanism found in the survey already had a concept:

- Every `TryApply` in `unscience/Patcher.cs`.
- Every `ksa-abstractions.lib` class, including `VehicleScaleOwnership`, `SaveStorage`, `NativeSavePreflight` and
  `PartIdentitySnapshot`.
- Every sub-mod project, the 18 test projects and the release scripts.

`NAVBALL_INFO.md`, `docs/harmony` and `humble-arteest.lib/Experiments` are research notes and experiments, not
mechanisms. No concepts were merged.

## Open concerns

- **Lifecycle sections not read in full.** About 60 feature lifecycle sections were checked only by script and by
  grep for risky phrasing (`pre-render`, `AfterOnFrame`, `settled`, inlining, menu-bar claims). Their hook targets,
  snippets, anchors and table consistency were verified, but the prose was not.
- **Exit-time native releases.** The behaviour of Vulkan and FMOD releases after `Program.Dispose` (Thug Life,
  Graffiti, DOH, BYO Music, Pebbles) is undefined, and whether it crashes at exit cannot be settled statically. The
  pages now state the ordering; they do not claim an outcome.
- **Thug Life in the editor.** The postfix also fires in `RenderEditor` (L5047) with unfiltered entries. What it
  draws there is unverified.
- **JIT inlining.** Two concerns cannot be settled statically. Harmony patches on the empty
  `Program.DrawProgramMenusHook` and on the `AggressiveInlining` Sphinx targets depend on JIT inlining behaviour
  (the Sphinx page discloses its risk). `Part.CrashTolerancePascals`, an expression-bodied getter that The Tick
  prefixes, is a small inlining candidate; its page does not mention this.
- **Authors' pending acceptance.** Many 5482/5541 changes are marked "pending in-game acceptance" by the authors,
  and the pages carry those caveats. Nothing here was run in game.
