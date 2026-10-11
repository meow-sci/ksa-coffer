# Review: content/mods/ksastructures

Reviewed 2026-10-10 against KSAStructures `c24759358381fb10290c61f9a6980b7d832ba3d4`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`, with the history commits for 2026.9.10.5438, 2026.9.22.5482 and
2026.10.7.5541 used where the mod's target build mattered). The review also covered
`content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` and the catalog `ai/catalog/ksastructures.yml`.

Independent checks I ran:

- **Snippets.** A script compared every fenced block with a source header against the checkout or
  the decomp, line by line and in order within the stated ranges. All 80 original snippets were
  verbatim, with elisions marked. The 5 snippets added in this review pass the same check.
- **Anchors.** A script listed the first and last line behind each of the 395 anchored links. Three
  were wrong (`KittenEva.cs` L323-L336, `GameViewport.cs` L302-L340, which runs past the end of the
  file, and `TerrainPatch.cs` L515-L525), and all three are fixed.
- **Frame order.** Checked `Program.OnFrame`, `OnFrameCelestials`, `OnDrawUi*`, `DrawMenuBar`,
  `Render`, `UpdateRenderingResources` and `RenderGame`, plus StarMap's `ProgramPatcher`,
  `ModLibraryPatches` and `StarMapCore.DeInit`, against every `## Lifecycle and timing` section.
- **The writer's unverified points**, settled from code:
  1. **Terrain-modifier render data is sized once.** `PlanetMeshLibrary.Create` (Program L1148) ->
     `Universe.SetupRenderData` -> `Astronomical.SetupModifierRenderData` builds the render data,
     guarded by a null check. The curve LUT is `NumModifiers*4` wide and there are 16 texture slots.
     `PlanetRenderer.ComputeBufferResourceCounts`, called from the constructor at Program L1158, sizes
     each body's `ModifierRenderParams` slot. Nothing resizes these later. The terrain editor's live
     re-setup keeps the old LUT and slot. The clutter generator loops up to `NumModifiers`.
     `[StarMapAllModsLoaded]` (L942) runs before all of it.
  2. **`AltitudeOffset` units.** The decal code reads the raw `Km` field, never `InMeters()`. The CPU
     `Evaluate` path works in metres (the `HeightReference` lerp, and `MeanRadius` passed as
     "radius km"). The GPU `Modifier_Decal` takes `floatParam9 = AltitudeOffset.Km` against
     `SurfaceRadius = MeanRadius` in metres. So `Km="16.97"` means 16.97 m. An `M=` attribute would
     leave `Km` NaN and still pass `IsValid`. Earth's stock modifiers use 9 of the 16 texture slots
     (4 `TilingDetail` and 5 `Decal`).
  3. **Clutter exclusion zones are built with the clutter buffers.** `BuildEcotypeData` ->
     `PopulateLaunchPadExclusionZones` is called only from the two `PopulateEcotypeDataBuffer` methods.
     Those run when the `GroundClutterRenderer` is built: in the `PlanetRenderer` constructor, when
     clutter is re-enabled through `RebuildGroundClutterResources`, or from the clutter debug UI.
     `DeserializeSave` only calls `GroundClutterRenderer.Reset`, which does not rebuild them. At the
     first build the camera is where `Universe.OnLoaded`'s `follow <home body>` put it: 2.5 radii out
     along its forward vector, set by `Camera.SetFollow`.
  4. **The menu bar.** `DrawMenuBar` is `ImGui.Begin("Menu Bar", ... MenuBar | NoBackground)` plus
     `BeginMenuBar`. No KSA code calls `BeginMainMenuBar`. That holds in all four builds in the
     history, the mod's target 2026.10.7.5541 included. KSA's own hook into the bar is the empty public
     `Program.DrawProgramMenusHook()`.
  5. **The shader reload hazard.** `ShaderModuleUtils.FromFile` throws for every non-success status
     and otherwise returns a module, and `Compile` throws for a missing file, mod, path or renderer. So
     `DoLoad` either throws before it destroys anything or swaps in the new module and destroys the
     old one. The "destroy and keep nothing" path from the mod's comment, and the bundle's "Compile
     returns no module" variant, cannot happen.
  6. **Viewport image rebuilds**, unverified in the monitor concept. `RebuildViewport` runs in
     `OnFrameViewports`, before every hook the step can run from except the frame postfix.
- **Lifecycle reference.** The bundle and the reference disagreed in one place: the reference called
  `OnPreRender` the "last chance to change what is drawn", and the bundle had followed it and labelled
  its render-data postfix `frame:pre-render`. The code puts `UpdateRenderingResources`, which reaches
  `UpdateStaticObjectRenderData`, inside `Program.Render`, after `OnPreRender`. Both sides are now
  corrected, and the reference change is logged.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Snippets were verbatim and almost every engine member checked out. Wrong or overstated: the unreachable `DoLoad` failure path, the "worker-thread" terrain height patch, and the hazard of a live decal. Six points were left "unverified" that the code settles |
| Coverage | 4 | Three reusable mechanisms had no concept of their own: clutter exclusion zones, save-load detection, and the live biome-material edit. All three are now added; 5 after fixes |
| Lifecycle correctness | 3 | Hook targets and patch kinds were all right. Four features and the overview placed the `UpdateStaticObjectRenderData` postfix in `frame:pre-render`; it runs in `frame:render`. One feature carried a spurious `frame:dispatch-solvers`. Nothing said that every step hook runs after solver dispatch, or that `StarMapUnload` follows StarMap's id-less `UnpatchAll`. 5 after fixes |
| Conformance | 4 | Validator, ref checker and index check were clean. The catalog's lifecycle and hooks had drifted from the frontmatter for 8 features, and 3 anchors were wrong. Now clean and in sync |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/office-landmarks-static-objects.md | The `UpdateStaticObjectRenderData` postfix was labelled `frame:pre-render`. It runs in `Program.Render` -> `UpdateRenderingResources`, per visible viewport, before `RenderGame` (`frame:render`) | yes |
| features/lift-moving-landmark.md | The same `frame:pre-render` label for drawing the car. The fallback was called the "pre-render hook", which is ambiguous with `OnPreRender` | yes |
| features/garage-spot-lights.md | The same label. The body called the light submission "the conventions' `frame:pre-render` window" | yes |
| features/invisible-shadow-casters.md | The same label for building the casters and the model matrix | yes |
| overview.md | The features table and the per-frame data flow put the render-data postfix in pre-render. The flow omitted that the step runs while the vehicle step is in flight, and omitted the `OnFrameCelestials` fallback | yes |
| features/terrain-decal-pits.md | `frame:dispatch-solvers` was in `lifecycle` with nothing behind it | yes |
| features/terrain-decal-pits.md | "Why only at load" covered only the LUT. It omitted the `PlanetRenderer` storage-buffer sizing, the clutter generator and the editor's non-resizing re-setup, and it misdescribed what a live decal does | yes |
| features/terrain-decal-pits.md | The `AltitudeOffset` pitfall gave no evidence for the GPU side and did not say that the raw `Km` field is read. The `M=` NaN hazard was missing. The 9-of-16 texture slot count was marked unverified | yes |
| features/office-landmarks-static-objects.md | The timing of the clutter zones was marked "(unverified)" | yes, settled, moved to the new concept |
| features/settings-menu.md | Said the "beside File and Universe" comment "describes 2026.10.7.5541 and is unverified". 5541 draws the same "Menu Bar" window. The mod's "returns false after the bar is ended" reasoning was not addressed, and `DrawProgramMenusHook` was missing | yes |
| overview.md | The menu bar compatibility note and the `[StarMapBeforeGui]` row implied the entry sits in KSA's bar | yes |
| overview.md | The `[StarMapUnload]` row said "unpatch everything". StarMap has already removed every patch by then | yes |
| features/dev-file-bridge-and-mcp.md | Claimed that `DoLoad` destroys the old module "if Compile returns no module". That path is unreachable | yes |
| features/dev-file-bridge-and-mcp.md | `lifecycle` and `hooks` lacked `startup:all-mods-loaded`, which the timing table uses | yes |
| features/viewport-image-on-monitor.md | The timing of a rebuild relative to the step was marked "(unverified)" | yes, settled |
| features/dry-volume-below-sea-level.md | See also called the terrain height override "the other worker-thread patch". It runs on the main thread | yes |
| features/dry-volume-below-sea-level.md | The fallback was named "the pre-render hook" | yes |
| features/first-person-kitten-view.md | Anchor `KittenEva.cs#L323-L336` missed `PrepareWorker` (L319-L333) | yes |
| features/first-person-kitten-view.md | Anchor `GameViewport.cs#L302-L340` ran past the end of the file (L302-L330) | yes |
| features/terrain-height-roof-override.md | Anchor `TerrainPatch.cs#L515-L525` was off the method (L517-L524) | yes |
| features/frame-step-plumbing.md | Did not say that every hook the step runs from is after `frame:dispatch-solvers`, or how the features route writes around that. Did not say that `StarMapUnload` runs after StarMap's id-less `UnpatchAll` | yes |
| ai/catalog/ksastructures.yml | `lifecycle`/`hooks` did not match the frontmatter for 8 features. The landmarks, decal and frame-plumbing summaries described mechanisms now in their own concepts | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Row 21 called `OnPreRender` "the last chance to change what is drawn". Row 22 did not mention `UpdateRenderingResources` | yes, logged |
| overview.md | The build commands are a bash block with no source header (a command list adapted from CLAUDE.md) | no, not a quoted snippet |

## Features added

- `features/ground-clutter-exclusion-zones.md` (celestials): the postfix on the private
  `PopulateLaunchPadExclusionZones`, with the settled build-time evaluation. Split out of the
  landmarks concept.
- `features/save-load-detection.md` (persistence): the `Program.OnGameLoaded` latch, with its timing
  relative to UI, console and bridge loads, and the compile-time pin. Split out of frame-step
  plumbing.
- `features/live-terrain-material-override.md` (celestials): `TameTheRim`, the write to
  `PlanetRenderer`'s mapped biome-material buffer. Split out of terrain decal pits.

All three are in the catalog, and the matching how-to topics moved with them. New generic topics:
`patch-private-method-with-field-injection` and `pin-patch-target-signature`.

## Open concerns

- `docs/content-conventions.md` describes `frame:pre-render` as the "last main-thread point before
  command recording starts". `UpdateRenderingResources` inside `Program.Render` comes later, so this is
  the same imprecision fixed in the reference. The file is outside this review's write scope.
- **Clutter zones.** Which four pads win at load depends on the camera's default forward vector and
  on Earth's rotation at the loaded time. Neither was traced, so whether the tower gets a zone in a
  normal session is stated only conditionally.
- **The mod's `BeginMainMenuBar` strip.** It is a separate Dear ImGui window at the same position as
  KSA's transparent bar. How the two overlap on screen was not observed in game.
- **External behaviour.** The ModMenu scanning rules and the Vulkan rule that a shader module may be
  destroyed after pipeline creation come from outside the corpus. The skinned fur's behaviour with the
  collapsed skeleton is still marked unverified in the body-hiding concept.
