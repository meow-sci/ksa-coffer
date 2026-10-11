# Review: content/mods/gatos

Reviewed 2026-10-10 against:

- gatOS `b88c28588e013841cfec58a1b3a09fcbd2cbc47e`
- StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa`
- decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`)

The review also covered `ai/catalog/gatos.yml` and the lifecycle reference in
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`, where two gatOS-related claims were corrected.

## Scores

| Dimension | As found | After fixes | Basis |
|---|---|---|---|
| Accuracy | 3 | 4 | All snippets were verbatim and most engine facts held. Several statements were wrong: the `DrawMenuBar` caller, the auto-warp refusal of `SetSimulationSpeed`, the camera's `SetFollow` target, two namespaces, the "settled values" rationale for `VehicleSolver.Wait()`, and the unpatch-at-unload advice. |
| Coverage | 4 | 5 | 44 features covered almost every file under `gatOS.GameMod`. One distinct mechanism was missing: the synthetic `IFollowable` camera anchor. |
| Lifecycle correctness | 3 | 4 | The `DrivePerFrame` ticks were placed in the main-viewport prefix in six features. Render-data hooks were labelled `frame:pre-render` instead of `frame:render` in three. The solver prefix was spread across three lifecycle values. StarMap's unpatch-before-unload ordering was missing, and the gatOS comment on solver workers was repeated as fact. |
| Conformance | 5 | 5 | The validators, ref checks and index check were clean before and after. Frontmatter, footnotes and catalog sync were correct. |

## Checks run

- **Validators.** `validate_bundle.py`, `content_check_refs.ts` and `build_indexes.py --check` were clean before
  and after the review: 46 concepts, 0 errors, 0 warnings. They are also clean on the lifecycle reference.
- **Snippets.** A script compared every fenced block, line by line and in order, with its cited range: 69 blocks
  in gatOS, purrTTY and StarMap. It also flagged unmarked elisions and first and last lines that did not match the
  range. All were verbatim. The new feature's two snippets also pass.
- **Anchors.** A script listed the first source line behind each of the 163 line-anchored decomp links. Ranges that
  started on a blank line or a brace, or pointed at the wrong member, were fixed. See the table below.
- **Game types and hook targets.** Every `game_types` entry was grepped in the decomp, and two had the wrong
  namespace. Every Harmony target and reflection member exists in 5554: `GameViewport.OnFrame(double)`,
  `Universe.ExecuteNextVehicleSolvers`, `Program.DrawProgramMenusHook`, `Program.RenderGame`,
  `GameSettings.UiPixelCulling`, `SuperMeshRenderSystem.RenderMainPass`, `RenderTarget.ResolveAttachments`,
  `Vehicle.GetWorldMatrix` / `UpdateRenderData`, `PartModel` ctor, `ShaderModuleUtils.FromFile`,
  `PartTreeRenderData.WriteState` / `WriteDynamicState`, `Vehicle._manualControlInputs`,
  `Program._volumetricTrailRenderer` / `_planetTransparenciesRenderer`, `PlumeTrailSegmentsManager._settings`,
  `KittenEva._renderable` and `KittenRenderable._characterAvatar`.
- **Lifecycle, traced in code.**
  - `Mod.cs` / `Mod.Game.cs`: with `[camera] camera_enabled = true` (the default), the main-viewport
    `GameViewport.OnFrame` prefix runs `SampleTelemetry`, `TickSchedules`, `DrainCommands` and `DriveCamera`. It is
    `frame:viewports`, runs every frame and is outside `if (DrawUI)`. `DrivePerFrame` (audio, paint, clutter,
    stickers, thug-life) runs only from `StarMapBeforeGui`, or from `StarMapAfterOnFrame` on hidden-HUD frames,
    which is after `Render` and `PostRender`.
  - `DrivePostSolver` (welds, IVA) calls `JobSystems.VehicleSolver.Wait()`. The step is not joined before the
    next `PrepareFrame`, so this is a real stall.
  - `Vehicle.UpdateFromTaskResultsUnsynchronized` is the only writer of `BodyRates` and `_kinematicMeasurements`.
  - `PhysicsBubble.RemoveVehicle` and `ApplyResultsToVehicles` show why weld teleports survive the next apply.
  - `StarMapCore.DeInit` calls `UnpatchAll()` before `ModLoader.Dispose`.
  - `BaseAttributes.cs` rejects the zero-argument `[StarMapImmediateLoad]` method.
- **Catalog.** Ids, titles, categories, lifecycle, hooks, techniques and game types match the frontmatter for all
  45 features, checked by script after the edits. The 118 `howto_topics` are generic. One names purrTTY, which is
  another mod's contract.

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/modmenu-entry-with-fallback-menu.md | Said `Program.DrawMenuBar` is called from `OnDrawUiViewports`. It is called from `OnDrawUiThreadSafe` (Program.cs L3186-L3189), after the `StarMapAfterGui` postfix, and the menu bar is a separate "Menu Bar" window using `BeginMenuBar`. The auto-hide early return was also undocumented. | yes |
| features/modmenu-entry-with-fallback-menu.md, features/solver-phase-command-drain.md | Advised unpatching in `StarMapUnload`. StarMap's `DeInit` has already run `Harmony.UnpatchAll()` for every mod by then, so it is a no-op. | yes |
| features/thug-life-world-space-quad.md, sticker-projected-decals.md, clutter-texture-override.md, vehicle-and-eva-paint.md, fmod-audio-playback.md | Placed `DrivePerFrame` / `DrivePaint` / `DriveAudio` in the main-viewport prefix. They run in `StarMapBeforeGui`, or in `StarMapAfterOnFrame` after render on hidden-HUD frames. The resulting one-frame lag for render-affecting ticks is now documented, as is sticker decal matrices trailing the camera. `frame:after-on-frame` was added to lifecycle and hooks. | yes |
| features/vehicle-and-eva-paint.md | Said the `WriteState` / `WriteDynamicState` postfixes run in `frame:pre-render`. They run in `Program.Render` -> `UpdateRenderingResources` -> `Vehicle.UpdateRenderData`, which is `frame:render`. | yes |
| features/scale-and-force-render-cheats.md | Labelled the `Vehicle.UpdateRenderData` / `GetWorldMatrix` prefixes `frame:pre-render`, and implied `GetWorldMatrix` has general callers. Its only caller is `KittenEva.UpdateRenderData`. | yes |
| features/light-cone-control.md | Said `LightModule.UpdateRenderData` runs in `frame:pre-render` and that edits apply next frame. It runs in `frame:render` (via `PartTree.UpdateRenderData`), so writes drained in the viewport prefix light the same frame. | yes |
| features/solver-phase-command-drain.md, debug-cheats-teleport-refuel-warp.md, game-thread-command-queue.md | Gave the solver prefix's lifecycle as `frame:prepare` / `frame:apply-solvers`. It is `frame:dispatch-solvers`. The exact position (after cloth dispatch, the `PartTree` flushes and the `NearestOrbitPointJob` queue) is now stated. | yes |
| features/solver-phase-command-drain.md, debug-cheats-teleport-refuel-warp.md, welds-vessel-anchoring.md | `Vehicle.Teleport` is called after the frame's `NearestOrbitPointJob` was queued, without waiting on `NearestOrbitAndPerformanceWorker`. KSA's own teleport goes through `InputEvents.TeleportInputBuffer`. This race was undocumented and is now a pitfall. | yes |
| features/frame-hooks-and-f2-fallback.md, welds-vessel-anchoring.md, iva-cabin-physics-bepu.md | Repeated gatOS's comment that solver workers have finished by `StarMapAfterGui`, and said `VehicleSolver.Wait()` makes `AccelerationBody` / `BodyRates` "settled for the step". The wait stalls the main thread and does not change those reads. For welds it is what makes `Teleport` legal, and the bubble detach is why the teleport survives the apply. | yes |
| features/welds-vessel-anchoring.md | Showed the orbit epoch as `GetJobSimStep(dt)`. The code uses `GetJobSimStep(Program.GetPlayerDeltaTime())`. | yes |
| features/debug-cheats-teleport-refuel-warp.md | Said `Universe.SetSimulationSpeed` refuses while auto-warp is active. Only the console command `SetSimulationSpeedDirect` refuses, and `ProcessAutoWarp` overrides the write each frame. | yes |
| features/programmable-camera-director.md | Said the director calls `SetFollow(target, ...)`. It follows its own `CameraFollowable` anchor. The Take anchor range now points at `Take()`. | yes |
| features/fx-editor-reflection.md | `game_types` had `KSA.CloudRenderer`; the type is `KSA.Atmosphere.Rendering.CloudRenderer`. | yes |
| features/thug-life-world-space-quad.md | `game_types` had `KSA.RenderTechnique`; the type is `RenderCore.RenderTechnique`. Anchor L4836 changed to L4837. | yes |
| overview.md | The hook table said `StarMapImmediateLoad` does "nothing". It is never invoked, because its zero-argument signature is rejected. The `StarMapUnload` row claimed patch teardown. The `StarMapAfterGui` row omitted the solver wait. The features-table lifecycles are synced with the fixes. | yes |
| features/telemetry-sampler-snapshot.md | Called the main-thread state a "consistent post-step state" without the parachute and derived-data caveats, or the fact that it is one step behind the computing step. | yes |
| features/celestial-body-catalog-reads.md | Gave no reason for race-free body reads while orbit solvers are in flight. `ApplyOrbitSolvers` staging is now cited. | yes |
| features/qemu-microvm-host-process.md | Did not mention that patches are already removed when `Unload` runs. | yes |
| features/sticker-projected-decals.md, manual-throttle-and-rcs-inputs.md, solver-phase-command-drain.md, vehicle-and-eva-paint.md, frame-hooks-and-f2-fallback.md | Imprecise or wrong line anchors: `ResolveAttachments` pointed at `ColorImage`, `GetManualThrottle` pointed at `GetThrusterFlags`, and several ranges started on a blank line. | yes |
| features/clutter-texture-override.md | Said a slot write affects command buffers "recorded afterwards" without grounding. It now cites the `UpdateAfterBind` binding flags. | yes |
| game-loop-and-lifecycle-3.md (reference) | The write-path table and the `Wait()` gotcha said a write after `VehicleSolver.Wait()` is never effective. `Vehicle.Teleport` is the exception (gatOS welds). The "StarMap hook or UI write" row ignored fields the apply never writes back (`_manualControlInputs`, used by gatOS throttle and RCS). | yes (logged in its log.md) |
| overview.md (reference) | The gatOS correction implied the frame drain runs in `StarMapBeforeGui`, and did not separate the welds and IVA effects of the wait. | yes (logged) |

## Features added

- `features/synthetic-camera-follow-anchor.md` (camera, `frame:viewports`). It implements `IFollowable` on a
  mod-owned object that resolves its anchor on every call. It covers the `SetFollow` teleport and
  `changeControl` pitfalls and the stable `OrbitView` / non-zero `MeanRadius` requirements. Catalog entry added
  with three how-to topics.

## Open concerns

- **Inferred, not verified in game.** The `NearestOrbitPointJob` race on teleports and the sticker lag on
  hidden-HUD frames follow from the decomp and gatOS code, but the repo does not report either.
- **Picking.** `StickerPicker` (cursor ray, part raycast, terrain march) is a reusable picking mechanism that is
  documented only inside the sticker feature. It could become its own concept.
- **Depth of review.** The non-KSA features (9P, HTTP, MQTT, MCP, SSH, QEMU, serial, guest image, CI) were checked
  for snippets, links and validator conformance, not prose line by line.
- **gatOS's own docs.** `AGENTS.md` threading rule 1 still says the camera director runs at the end of
  `OnAfterFrame`, and that sampling and drains run in `StarMapBeforeGui`. The code no longer does either, and the
  bundle follows the code.
