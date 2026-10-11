# Review: content/mods/ksacars

Reviewed 2026-10-10 against KSACars `1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`). The review also covered `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`
and the catalog `ai/catalog/ksacars.yml`.

Checks I ran:

- **Snippets.** A script compared every fenced block that has a source header with the checkout or
  the decomp. It checked that lines appear in order within the stated ranges, that no gap is left
  without an elision marker, and that no range is truncated. All 90 original snippets were verbatim.
  Three headers had wrong ranges. The 5 snippets added in this review pass the same check.
- **Anchors.** A script printed the first and last line behind each of the 291 anchored links and
  flagged ranges that start on a blank or brace-only line or run past the end of the file. Eight
  were off by one or two lines, and all eight are fixed.
- **Names.** Every `game_types` entry (243) was resolved to a decomp type. Every backticked
  `Type.Member` in the bodies was grepped in that type's file. One namespace was wrong. The other
  misses were inherited members or extension methods, and none needed a change.
- **Frame order.** I checked `Program.PrepareFrame`, `OnFrame`, `OnPreRender`, `Render`,
  `UpdateRenderingResources`, `RenderGame` / `RenderViewport`, `PostRender` and `Dispose`. I also
  checked `Universe.ExecuteNextVehicleSolvers` / `PrepareVehicleWorkers` / `SyncGroundClutter`,
  `Vehicle.PrepareWorker`, `VehicleUpdateData.Prepare`, and StarMap's `ProgramPatcher`,
  `ModLibraryPatches`, `StarMapCore.DeInit` and `ModLoader.Dispose`. Every `## Lifecycle and timing`
  section was compared against them.

## Points settled from code

- **The `Vehicle.PrepareWorker` prefix as the impulse window.** In `PrepareFrame`
  (Program.cs L2141-L2236) the order is:
  1. The scheduler waits (L2151-L2162).
  2. `ApplyOrbitSolvers`, `ApplyVehicleSolvers` and `ApplyClothSolvers` (L2164, L2167, L2170).
  3. `Glfw.PollEvents` and `ApplyInputEvents` (L2179, L2181).
  4. The nearest-orbit job is queued (L2196-L2201).
  5. `ProcessAutoWarp` and `GetJobSimStep` (L2215-L2216).
  6. `ExecuteNextClothSolvers`, then the `PartTree` flushes (L2217-L2219).
  7. `ExecuteNextVehicleSolvers` (L2220).

  When `CurrentSystem` is set, step 7 calls `PrepareVehicleWorkers` (Universe.cs L2130), which calls
  `PrepareWorker` on every vehicle in `CurrentSystem.All` (L2148). Each body ends in
  `PrepareFromVehicle` (Vehicle.cs L2422), which copies origin, kinematics and the flight computer.
  `NewVehicleProperties` is left null, so the worker reads live props and `TakeOffRails` reaches the
  step. Only after that come `SyncGroundClutter`, the vehicle job queue (L2131-L2137) and
  `ExecuteNextOrbitSolvers` (L2221). So the prefix runs:
  - after apply and input
  - after the cloth step has started
  - before the vehicle job, per vehicle, ahead of that vehicle's snapshot

  It also runs while paused, with a `DeltaTime` of 0. The bundle's core claim was right; the window is
  now spelled out line by line.
- **Terrain `accurate`.** The flag changes two things in `GetTerrainHeightFromDirCcf` (Celestial.cs
  L789-L882): bicubic versus bilinear sampling of the base height, and whether
  `modifierReference.Evaluate` is called. The normal, biome and LUT sampling run either way. Every
  overload defaults to `true`. The physics terrain uses that default
  (`TerrainPatch.GetTerrainRadiusCcf`, `BubbleTerrainGrid.SampleRadius`). Only `TerrainImpactFinder`,
  a camera helper and `LocationReference` pass `false`. The mod's `TerrainHeights` comment ("the
  engine's own terrain solver's choice, and the default") is wrong on both counts. The mod passes
  `true` everywhere, so its behaviour is right.
- **Asset paths via `Mod.GetPath`.** `FileReference.ModPath` is `Mod.GetPath(LocalPath)`, which is
  `Path.Combine(DirectoryPath, localPath)`. `DirectoryPath` is set by `Mod.MakeUsing` to the folder
  of `<modDir>/mod.toml` (ModLibrary.cs L409-L429). `LoadAssetBundles` combines the same way. Paths
  are relative to the mod folder, as the bundle says.
- **`StarMapAllModsLoaded` precedes `ModLibrary.AttachGameData`.** It does. The postfix runs at the
  end of `LoadAll` (Program.cs L942), and the constructor then runs these in order:
  - `AssignDefaults` (L943)
  - `JobSystems.Initialize` (L974)
  - `ModLibrary.Bind` (L978)
  - `AttachGameData` (L985)
  - `PopulateSounds` (L989)
  - `LoadDefaultSystem` (L1069)

  The bundle was right. It now also notes the `PopulateSounds` ordering.
- **Known pitfalls.**
  - **Render-data postfixes.** The lens and headlamp postfixes were mislabelled `frame:pre-render`
    and are now `frame:render`. The exhaust postfix really is `frame:pre-render`
    (`AddVolumetricExhaustInstances` in `OnPreRender` L2382). The seated-crew postfix was already
    `frame:render`.
  - **Dispatch before StarMap hooks.** The fact that every StarMap frame hook runs after dispatch is
    now stated in the overview, the bridge and the new frame-step concept.
  - **Unpatching before `StarMapUnload`.** StarMap removes every patch before `StarMapUnload`, and
    `Program.Dispose` has already called `GameAudio.Release` by then. The unload claims are fixed
    accordingly.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets were verbatim and nearly every engine member checked out. Several claims were wrong or overstated: KSA's logger "unreachable" by mods, stopping sounds at unload, the `accurate` comment left unexamined, the car panel's "next physics step", and an understated collider-write race. One namespace was wrong. 5 after fixes |
| Coverage | 4 | 32 well-grained concepts. Two reusable mechanisms had no concept of their own: the once-per-frame latch with its vehicle registry, and spawning a library craft at lat/lon under the shape lock. Both are now added. 5 after fixes |
| Lifecycle correctness | 3 | The core `PrepareWorker` claim and most hook targets were right. Two render-data postfixes were labelled `frame:pre-render` (one also `frame:lights`), and so was the overview table. The unload row said patches are removed there. Two hook/lifecycle mismatches. The impulse window lacked the cloth dispatch, the flushes, the per-vehicle ordering and the full input-clear conditions. 5 after fixes |
| Conformance | 4 | All three validators were clean. Three snippet headers had wrong ranges, eight anchors were off, the catalog had drifted on hooks, game_types and techniques for 14 features, the overview lifecycle column did not match frontmatter, and `inter-mod-api` was misused on two tooling features. Now clean and in sync |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/coloured-emissive-lenses.md | `lifecycle` had `frame:pre-render`. The `WriteState` postfix runs in `Program.Render` -> `UpdateRenderingResources` -> `PartTree.UpdateRenderData` -> `EnsureBuilt` (`frame:render`). The body was right; the label was not | yes |
| features/headlights-as-spotlights.md | `lifecycle` had `frame:lights` and `frame:pre-render`. The `PartTree.UpdateRenderData` postfix is `frame:render`. `ClearLights` only empties the list before it | yes |
| overview.md | The features table carried those labels. Its lifecycle column was also abbreviated and out of sync with frontmatter (mod log, crash veto, scoop and others) | yes, regenerated from frontmatter |
| overview.md | The `[StarMapUnload]` row said "removes patches". `StarMapCore.DeInit` calls the id-less `UnpatchAll()` before `ModLoader.Dispose` invokes the hook, and `Program.Dispose` has already released audio | yes |
| overview.md | The overview did not say that every StarMap frame hook runs after `ExecuteNextVehicleSolvers`, and the patch table gave no frame position for each patch | yes |
| features/mod-folder-content-and-code-mod.md | "`[StarMapUnload]` removes everything" | yes |
| features/engine-sound-crossfade.md | The "Stop on unload" pitfall said `StopAll` at unload hands channels back. FMOD is already closed by `GameAudio.Release` in `Program.Dispose`. `PopulateSounds` timing was missing | yes |
| features/prepareworker-impulse-injection.md | The window omitted the cloth dispatch, the `PartTree` flushes, the in-flight nearest-orbit job, `SyncGroundClutter` after `PrepareWorker`, the per-vehicle ordering and the paused runs. The `ClearHeldPlayerInput` pitfall named only the ImGui condition | yes |
| features/prepareworker-impulse-injection.md | Snippet header `Universe.cs L2141-L2154` ended before the closing brace (L2155). The API-table anchor had the same problem | yes |
| features/terrain-contact-under-wheels.md | `accurate` said "every modifier is evaluated". It did not show what the engine's colliders use, and did not address the mod comment's "engine solver's choice". Anchor `Celestial.cs#L777-L880` stopped short of the method end | yes |
| features/mod-log-file.md | Presented "KSA's logger mods cannot reach" as fact. `DefaultCategory.Log` and `LogCategory.Make` are public, and gatOS uses them | yes |
| features/scoop-colliders-and-loose-clutter.md | "Each write is a single field, picked up by the next step" understates the race. `PositionPartAsmb` is a 24-byte struct, and the worker clears `NeedsColliderUpdate` per collider | yes (marked as derived from code) |
| features/scoop-colliders-and-loose-clutter.md | Hook `StarMapAfterOnFrame` had no `frame:after-on-frame`. Anchors `ColliderModule.cs#L28` and `Vehicle.cs#L2040` started on brace or blank lines | yes |
| features/car-panel-and-modmenu.md | Said every control is read by "the next physics step". The beam is read in the same frame's render, the scoop by the next car step, and only righting by the next `PrepareWorker` | yes |
| features/file-drop-command-bridge.md | Hook `StarMapAllModsLoaded` had no `startup:all-mods-loaded`. `inter-mod-api` was wrong (file IPC). The feature did not say commands run with the step in flight, or that `spawn` stalls on it | yes |
| features/ksa-mcp-server.md | `inter-mod-api` technique wrong | yes (`file-ipc`) |
| features/drive-with-flight-keys.md | `game_types` had `Brutal.GlfwApi.GlfwKeyEvent`; the type is `RenderCore.Input.GlfwKeyEvent` | yes |
| features/crash-veto.md | Snippet header `CrashHook.cs L31-L46`; the snippet ends at L45 | yes |
| features/launch-pad-surface-contact.md | Decomp snippet header `ConstraintSim.cs L611-L628`; the lines are L609-L623 | yes |
| features/driver-hands-steering-ik.md, engine-hud-for-engineless-craft.md, headlights-as-spotlights.md, mod-folder-content-and-code-mod.md | Anchors `IVASeat.cs#L39`, `FixedAlert.cs#L20`, `PowerConsumer.cs#L160-L171`, `Mod.cs#L101` were off by one or two lines | yes |
| features/driver-hands-steering-ik.md, features/ksa-mcp-server.md | Techniques differed from the catalog (`two-bone-ik`, `mcp-server`) | yes |
| ai/catalog/ksacars.yml | hooks, game_types and techniques drifted from frontmatter for 14 features. The lens, headlamp and scoop lifecycles were wrong. The two new concepts were missing | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Per-frame row 6 named a prefix on `ExecuteNextVehicleSolvers` as the last settled point. A `PrepareWorker` prefix runs later, inside that call, and the cloth step is already running. The dispatch table omitted `SyncGroundClutter` and the `CurrentSystem` guard | yes, logged |
| howto/.../game-loop-and-lifecycle-3.md (reference) | Said the rest of `PrepareWorker` clears held input "above 30x warp"; there are three conditions, plus the throttle ramp and the ocean-physics pick | yes, logged |
| features/keep-thrusting-craft-off-rails.md | The decomp snippet is dedented by one tab | no: uniform dedent, content verbatim |
| features/engine-hud-for-engineless-craft.md | `frame:dispatch-solvers` and `frame:gauges` are engine read and clamp points, not mod code | no: the feature depends on exactly those points, and the body explains them |

## Features added

- `features/frame-step-latch-and-car-registry.md` (getting-started) covers three things:
  - `StepOnce` from `StarMapAfterGui`, with the `StarMapAfterOnFrame` fallback
  - the `FrameLatch` released in a `finally`
  - the per-frame census from `CurrentSystem.All` and the `Vehicle`-keyed registry the patches read

  It settles from code why `Program.VehiclesInFrame` is empty in the frame postfix (`PostRender`
  clears it at L2368) and full in the GUI hook.
- `features/spawn-parked-craft.md` (vehicles-and-parts): `CraftSpawner`. It covers the library lookup,
  the placeholder orbit, and building inside `ConstraintSim.UnlockShapesBlocking`, which spins until
  `VehicleUpdateTask.Run` calls `EndVehicleUpdate`. It explains the `parent.Children.Add`
  requirement from `IParentBody.UpdatePerFrameDataTree`. It compares the mod's route with KSA's own
  `InputEvents.CreateVehicleData`.

Both are in the catalog with generic how-to topics:
- `enumerate-vehicles-from-a-hook`
- `track-craft-carrying-a-part`
- `shape-registry-lock`
- `load-craft-from-vehicle-library`

They also reuse `per-frame-work-with-hidden-ui` and `spawn-vehicle-at-runtime`. The bridge,
pose-subparts and vehicle-library concepts link to them. Righting and programmatic screenshots were
considered and left inside the impulse and bridge concepts, which already document them with code.

## Open concerns

- **Scoop collider race.** Read from the code (worker `UpdateShape` and `UpdateColliderCompoundLeaves`
  against a main-thread write after dispatch), not observed in game.
- **Spawn stall.** The length of the stall a bridge `spawn` causes was not measured.
- **Carried over from the original author, still unverified:**
  - what the engine panel's other buttons do on an engineless craft
  - whether the mod's write to `GroundClutterCollisions` reaches the saved settings file
  - ModMenu's name-matching of the attribute copy (ModMenu's source is not in the corpus)
- **Tooling features.** Snippets and paths were checked for API surface, headless tests, packaging,
  MCP and the art pipeline, but their scripts were not executed.
- **Concurrent edits to the lifecycle reference.** Other reviews are editing it in the same session.
  My edits were small read-modify-write replacements, logged in its `log.md`. A final pass by the
  orchestrator should confirm no edit was lost.
