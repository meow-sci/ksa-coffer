# Review: content/mods/ksagolf

Reviewed 2026-10-10 against KSAGolf `f3e6ab72b5b963f615cb4ed41f7765a7bce42688`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`).
The mod targets 2026.9.22.5482, so the review also diffed the two decompiled builds (`a2f724f` against `935a32b`)
for every file the mod patches, reflects into or binds to. The cross-check covered every file under `src/KSAGolf/Ksa/`,
the `Sim/` types the features describe, `CLAUDE.md`, `docs/BLOCKED-ON-KSA.md`, `docs/KSA-API-SURFACE.md`,
`docs/KSA-FRAME-ORDER.md`, and in the decomp `Program.cs` (`PrepareFrame`, `OnFrame`, `OnFrameCelestials`,
`DrawMenuBar`, `OnDrawUiConsole`, `UpdateRenderingResources`, `RenderViewport`, `RenderGame`, input handlers),
`Universe.cs`, `ConstraintSim.cs`, `ConstraintSimPool.cs`, `BubbleClutterStatics.cs`, `PhysicsBubble.cs`,
`VehicleUpdateTask.cs`, `KittenEva.cs`, `KittenRenderable.cs`, `KittenLocomotion.cs`, `AnimatedRenderable.cs`,
`StaticMeshRenderable.cs`, `SuperMeshRenderSystem.cs`, `ShadowRenderable.cs`, `GizmosRenderer.cs`, `GameViewport.cs`,
`FixedController.cs`, `Vehicle.cs`, `InputEvents.cs`, `UncompressedSave.cs`, `GameSaves.cs`, `ModLibrary.cs`,
`GameAudio.cs`, and StarMap `ProgramPatcher.cs`, `StarMapCore.cs`, `ModLoader.cs`, `GameSurveyer.cs`.

## Scores

Scored as found; after the fixes below all four would be one point higher.

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Most engine claims held up, including the hard ones (clutter narrow phase, shapes-registry window, per-view skeleton, `ClearBuckets` timing, `TeleportToLocation` queuing). There were about ten false or overstated statements: buoyancy "implemented", the ridge mask as entirely uncalled, the menu-bar bar presented as 5554 drift, `ClearBuckets` as the only unpinned target, and `orbit_place` racing the solver left "unverified" |
| Coverage | 4 | 32 concepts for an 18k LOC repo, with every Ksa/ file and nearly every tool cited. The cross-cutting degrade-and-pin patch pattern (six patch classes, fault limit) had no concept of its own; it is now added |
| Lifecycle correctness | 4 | Every hook target, patch kind and frame position checked out, and `KittenEva.UpdateRenderData`/`ClearBuckets`/`IAnimProcessor` were all correctly `frame:render`, not `frame:pre-render`. The defects: `StarMapUnload` described as an unload that unpatches and restores the controller (it runs only at process exit, after StarMap's id-less `UnpatchAll`), `frame:apply-solvers` listed where no mod code runs, a lifecycle on code that has no caller, and the menu-bar timing rationale |
| Conformance | 4 | All three validators were clean before and after. Four snippets had wrong or unsplit line ranges, one snippet had no source header, and one link anchor missed the `[StarMapMod]` line |

## Writer claims checked against code

| Claim | Verdict | Evidence |
|---|---|---|
| README is stale; code implements putting | Confirmed | `Golf.Step`/`Hold`/`TryAddress`/`Swinging` are reached from `KSAGolfMod.StepOnce` and `OnAfterGui`; README still says "Nothing to play yet" |
| Ball flight with drag and buoyancy | **Partly wrong** | `GolfBall.SubStep` applies gravity minus `Medium.Drag` only. `Medium.Buoyancy` and `Medium.Coasting` have no caller outside tests. The water-density branch of `KsaWorld.MediumDensityRatioAt` is not reached in play: `Golf.BodyGround` clamps the ground to the waterline (`GroundSurface.Height`), so the ball's altitude stays above `OceanReference.Level` |
| Minigolf builder with save/load | Confirmed | `CourseBuilder` (B key in `OnAfterGui`), `Save`/`Load` to `<user dir>/KSAGolf/Courses/<name>.json` via `CourseFile` |
| Kitten pose processor, held props | Confirmed | `GolfPose` added to `AnimProcessors` in `Golf.Hold`; putter added to `CosmeticAttachments` on `Wrist_R`; `KittenPoseProbe`/`KittenPropProbe` from the bridge |
| First-person view | Confirmed | `FirstPersonHook.Body`/`Heading` set in `Golf.DriveView`; four patch targets exist |
| Level-horizon controller | Confirmed | Installed lazily by `KsaWorld.LevelTheHorizon` from `TryLookFromMainViewport`, which `Golf`, `CourseBuilder` and `SceneCamera` call |
| Chase camera uncalled | Confirmed | `ChaseView`, `ViewClaim`, `SmoothedStep` have no reference outside `Sim/` and tests; `ChaseOrbit` only lends constants to `HeadLook` |
| Hull contact uncalled | Confirmed | `ContactSweep` is used only by `HullTest`, and nothing constructs or calls `HullTest` |
| In-flight ground test uncalled | Confirmed | `GroundTest` and `CoarseGroundTest` have no caller (the `TerrainHeights` mention is a doc comment) |
| Ridge mask uncalled | **Partly wrong** | `TerrainMask.Blocked` has no caller, but `TerrainMask.TryBandBelow` is live: `TerrainRay.TryFirstHit` calls it from `KsaWorld.TryGroundAlong` (craft mover's cursor ground point) |
| Slope reading uncalled | Confirmed | `GroundSlope` has no reference; nor do `TerrainMap`, `Orient`, `KsaWorld.IsOccluded`, `KsaWorld.Remove`/`Destroy`/`WaitForVehicleSolvers` |

## API drift, 2026.9.22.5482 to 2026.10.10.5554

- Every KSA, Brutal and StarMap type and member in the mod's `docs/KSA-API-SURFACE.md` exists in 5554, and so does
  every private member it reaches by name (`Program.OnFrameCelestials`, `_screenshotCapture`,
  `KittenRenderable._characterAvatar`, `StaticObject._models`, `BubbleClutterStatics._statics` and the two-argument
  `ClutterStaticInfo` constructor, `AnimatedRenderable.MaterialIndices`). The `Program.OnFrame` phase order is identical.
- `ShadowRenderable` gained `Center` and lost the computed `Position`. `SuperMeshRenderSystem.AddPoolToShadowBucket(int)`
  became `(int, in float4x4, float)` and now culls entries per cascade by `Center`/`Radius`; in 5482 it drew every
  entry into every cascade. `FirstPersonHook.AfterDraw` leaves `Center` at zero (the bundle already flagged this).
- `FixedController.OnFrame` skips `CharacterPortrait` viewports (no effect on the mod's main-viewport subclass).
- `Universe.IsWorldSun` removed, `UpdateWorldSun`/`NearestStar` added (unused by the mod).
- Not drift: KSA's menu bar was already a separate "Menu Bar" window with `BeginMenuBar` in 5482, with the empty public
  `DrawProgramMenusHook()` inside it. `Core/Sounds.xml` had no `<SoundBehavior>` element in 5482 either.

## Defects

| File | Defect | Fixed |
|---|---|---|
| overview.md | `StarMapBeforeGui` row: "Add the KSAGolf menu to the top bar"; it opens ImGui's separate main menu bar | yes |
| overview.md | `StarMapUnload` row: "loader disposal ... unpatch, restore controller"; it runs at process exit after StarMap's id-less `UnpatchAll` | yes |
| overview.md | `StarMapAfterOnFrame` row omitted the early-exit frames | yes |
| overview.md | "Ball flight through air or water with drag and buoyancy: Implemented" | yes |
| overview.md | Uncalled-code row: "ridge mask" vague (band solver is live); buoyancy and `IsOccluded` missing | yes |
| overview.md | Compatibility notes presented the menu bar and `<SoundBehavior>` as 5554 differences; real drift (`ShadowRenderable.Center`, cascade culling) missing | yes |
| overview.md | `mod.toml` snippet without source path header or elision markers | yes |
| features/developer-panel-and-menu-bar.md | Description, intro, how-it-works and lifecycle said the entry joins KSA's bar / opens it "before KSA fills it"; pitfall hedged it as unverified 5554 drift; `DrawProgramMenusHook` not mentioned; `BLOCKED-ON-KSA.md`'s "no extension point" not challenged | yes |
| features/developer-panel-and-menu-bar.md | `Ui.cs L93-L126` snippet has an elision but one range | yes |
| features/dual-hook-frame-stepping.md | `frame:apply-solvers` in `lifecycle` (no mod code runs there) | yes |
| features/dual-hook-frame-stepping.md | `PreRenderHook.cs L61-L83` snippet ends at L84 | yes |
| features/dual-hook-frame-stepping.md | Fallback row missed the early-exit frames (window close, font rebuild) where only the postfix runs | yes |
| features/frame-epoch-draw-anchor.md | `frame:apply-solvers` in `lifecycle` | yes |
| features/swept-hull-contact.md | `lifecycle: [frame:draw-ui]` for code with no caller | yes |
| features/level-horizon-camera-controller.md | `RestoreStockController` in `Unload` said to stop the subclass outliving the mod; `StarMapUnload` is exit-only | yes |
| features/mod-mesh-draw-hook.md | "removed in `[StarMapUnload]`"; clear location described only as `RenderViewport` | yes |
| features/first-person-kitten-view.md | "`Remove` on unload" | yes |
| features/launch-site-surface-raycast.md | "`Remove()` on unload" | yes |
| features/borrowed-chase-camera.md | Bridge hand-back "on unload" without exit-only timing | yes |
| features/mod-log-file-with-rotation.md | Said all writes are main-thread (a `CourseCollider` worker prefix logs); unload timing | yes |
| features/golf-ball-physics.md | Water-density branch unreachable not stated; `Medium.cs` row listed buoyancy outside its range | yes |
| features/terrain-height-queries.md | "`TerrainMask` ... no callers"; `TryBandBelow` is live through the cursor ray | yes |
| features/file-command-bridge.md | `Bridge.cs L81-L121` snippet runs to L123 | yes |
| features/file-command-bridge.md | `orbit_place` race left "not verified"; `Vehicle.Teleport` -> `RemoveFromCurrentBubble` -> `PhysicsBubble.RemoveVehicle` mutates the list the in-flight step walks | yes |
| features/putting-session.md | "Released ... while a KSA window is open": `Program.IsWindowOpen` is reset at the end of every UI pass, and the controller reads it outside the UI pass, so it never fires | yes |
| features/putting-session.md | No statement that the step runs after the next physics step is dispatched and why that is safe | yes |
| features/world-positioned-sounds.md | "settled for the frame" without the dispatch caveat | yes |
| features/api-surface-and-assembly-lock.md | "`ClearBuckets` is the one patch target missing from the record"; `OnFrameCelestials` and the controller backing field are missing too | yes |
| features/minigolf-course-builder.md | `ClearBuckets` "called at the start of `Program.RenderViewport`"; main view is inline in `RenderGame` | yes |
| features/content-and-code-mod-layout.md | `KSAGolf.csproj L75-L76` should be L75-L77; `KSAGolfMod.cs#L32-L65` anchor misses `[StarMapMod]` at L14 | yes |
| ai/catalog/ksagolf.yml | `add-menu-to-ksa-top-bar` note recommended `BeginMainMenuBar` from `StarMapBeforeGui`; lifecycle values as above; developer-panel summary | yes |
| howto .../game-loop-and-lifecycle-1.md | `StarMapBeforeGui` table row, step 5 and the KSArmory example presented `BeforeGui` as the way to add menu-bar entries | yes |
| howto .../game-loop-and-lifecycle-2.md | `OnFrameCelestials` row "Every frame"; skipped on early-exit frames | yes |

Both reference changes are logged in `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/log.md`. Concurrent
reviews edited the same reference files during this review; their changes and these are both present.

## Features added

- `features/degrading-harmony-patches.md` (`patching`). This covers the six patch classes, each with its own
  Harmony id, defensive lookup, log-once degrade, never-throwing body and `PinThe*` signature pin, plus the ten-fault
  limit that is the only path where `Remove()` takes patches out of a running game. It was added to the overview,
  the feature index and the catalog with three generic how-to topics.

Nothing was removed or merged. Every concept is a distinct mechanism, and the uncalled-code concepts
(`borrowed-chase-camera`, `swept-hull-contact`) state plainly that they have no caller.

## Open concerns

- First-person shadow under 5554: the effect of `Center = 0` on the per-cascade culling needs an in-game check.
- Whether `BeginMainMenuBar` really returns false from `StarMapAfterGui`, as the mod claims, cannot be checked in the
  decomp (Dear ImGui is native). It is labelled unverified.
- The fault-limit `Remove()` unpatches `ConstraintSim` prefixes while vehicle workers may be inside them. Harmony's
  behaviour in that case was not checked.
- ModMenu's "match by attribute type name" contract comes from the mod's own comments; ModMenu is not in the
  reference set.
- The repo says most gameplay (swing, strike, ball physics, builder, first person) is unverified in game. The
  bundle repeats that and does not claim more.
