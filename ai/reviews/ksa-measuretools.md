# Review: content/mods/ksa-measuretools

Reviewed 2026-10-10 against KSA-MeasureTools `aed7f874f1c925c10c733b1dee72bd04b9b1985c`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and game build 2026.10.10.5554 (assemblies
`935a32b4dbc34cbcd16e87d16cf9732eb90030c0`). A previous review attempt left no output; this one
started from scratch.

## Scores (bundle as found)

| Area | Score | Notes |
|---|---|---|
| Accuracy | 4 | All 33 snippets are verbatim and every `game_types` entry exists. About a dozen engine and code claims were wrong or overstated (stale-picker "harmless", gimbal writers, bound-input "copies stock", try/catch coverage, PatchAll "all or nothing", face-angle NaN timing) |
| Coverage | 5 | 17 features for 4.7k LOC cover every hook, patch, reflection target, UI surface, the cache, the build tooling and the anchor model. No missing mechanism found |
| Lifecycle correctness | 3 | The core finding held: `StarMapAfterGui` fires before `OnDrawUiThreadSafe` fills `ViewportPartPicker`. Errors: the overview said AfterGui sees last frame's `CursorHoverEligible` (it was cleared earlier that frame); `editor:on-frame`/`editor:draw-ui` were used where no code runs; staging decouples were placed in `ApplyVehicleSolvers`; StarMap's `UnpatchAll()` before `StarMapUnload` was not mentioned; the menu hook's secondary-viewport call was missing; click-time camera and cursor state was described loosely |
| Conformance | 4 | Validators were clean. Some decomp line anchors were off, one source was missing its footnote definition, and the catalog `game_types` had drifted from the frontmatter in 14 entries |

After the fixes all three checks pass: `validate_bundle.py` (18 concepts, 0/0/0),
`content_check_refs.ts` (0 errors) and `build_indexes.py --check` (0 out of date).

## Verified as correct (selected)

- The click prefix order on `Program.OnMouseButton`, how consumed presses and releases pair up, and the latch bookkeeping. The latch is set before the original's `try` and released in its `finally`, so a skipped original skips both; the mod's reflection repair matches the `finally`. Also checked: `BurnContextMenu._rightClickValid` (armed by `OnRightClick`, cleared by `TryOpen`), `MapController.RotateMouseDragging`, and the editor's left-release grab and gizmo handling.
- Unprojection: `GameViewport.GetCamera` returns the map camera in Map mode and the base camera otherwise. `ScreenToEgoRay` starts the ray at the camera for perspective and at the near-plane point for orthographic. `EgoToEcl` is a pure translation, and `EgoToScreen` returns NaN behind the camera.
- Frame order: `CursorHoverEligible` is cleared in `OnFrameViewports` (L2664-L2674). `IOrbiter.OnDrawUi` sets it again only for the hit-test viewport. `CelestialSystem.OnDrawUi` resets the part picker and `Vehicle.UpdateHighlight` refills it. Both run inside `Universe.OnDrawUi(MainViewport)` in `OnDrawUiThreadSafe` (flight only), after StarMap's `OnDrawUiViewports` postfix.
- Part picking: `MeshReference.PositionCompare` is `PositionsCompare[0]`, the index-unrolled positions of glTF primitive 0. `RayCastEgoSubPart` normals come from `HostMesh` (also primitive 0) at the first vertex of the hit triangle. `MeshViewModule.CreateComponents` uses the shared `MeshView.Get()`, and `PartModel` and `PartInstance` are not geometry sources.
- Anchors: `Vehicle.GetMatrixAsmb2Ego` matches the mod's camera-free mirror. `VehicleEditingSpace(Vehicle)` shares the vehicle's `PartTree`, and `VehicleEditor.Dispose` hands `EditingSpace.Parts` back or calls `CreateVehicle` with the tree root. `Vehicle.Split` and `MergeFrom` move `Part` objects instead of copying them. In the editor `Part.MatrixAsmb2VehicleAsmb` is recomputed on every call; in flight it is cached, and the `Asmb2ParentAsmb` setter resets the cache.
- Menu: `DrawProgramMenusHook` is empty and is called after both the editor and flight branches of `DrawMenuBar`. The bar is its own `Begin("Menu Bar")` + `BeginMenuBar` window.
- Palettes: StarMap loads the entry assembly with `LoadFromAssemblyPath(full path)`, so `Assembly.Location` is the DLL in the mod folder.
- Stock orbit-pick quirks: on the elliptic branch the NDC test `num20 > 0.025` passes when the projected point is NaN (behind the camera). The aspect factor is the integer `Size.X / Size.Y`. Both are present at `Orbit.cs` L3174-L3186.

## Defects

| File | Defect | Fixed |
|---|---|---|
| overview.md | Said the AfterGui preview sees `CursorHoverEligible` from the previous frame; `OnFrameViewports` clears it before AfterGui, so it reads false (the part picker is the previous frame's) | yes |
| overview.md | `StarMapUnload` row said "Unpatch" without noting StarMap's id-less `UnpatchAll()` has already run | yes |
| overview.md | `DrawProgramMenusHook` row omitted the hovered secondary viewport's bar drawn inside `OnDrawUiViewports` | yes |
| overview.md | Features table lifecycle for editor-measuring and part-anchor-rehoming | yes |
| editor-measuring.md | `lifecycle` listed `editor:on-frame` and `editor:draw-ui`; no mod code runs in `Editor.OnFrame` or `Editor.OnDrawUi` | yes |
| editor-measuring.md | No mention that `Universe.OnDrawUi` is skipped while `EditorFlag` is set (no stock part hover or body hover flags in the editor) | yes |
| part-anchor-rehoming.md | `lifecycle` listed `editor:draw-ui` | yes |
| part-anchor-rehoming.md | "a decoupler firing in the vehicle step and applied in `ApplyVehicleSolvers`"; staging decouples run in `InputEvents.ApplyInputEvents` (only contact docking and part failures are applied by `ApplyVehicleSolvers`) | yes |
| part-anchor-rehoming.md | `[^ksa-program]` source had no footnote definition; Part.cs anchor off | yes |
| part-mesh-raycast-picking.md | "The fallback full scan makes this harmless": when the stale picker is null, the shortcut skips every mesh raycast for that preview pick | yes |
| part-mesh-raycast-picking.md | "only the vehicle editor writes `Part.Asmb2ParentAsmb`"; keyframe animations, solar trackers and part-tree re-rooting also write it | yes |
| click-capture-mouse-prefix.md | Bound-input test said to "copy what stock does"; stock uses `MouseBound && DispatchKeyEvent`, the mod approximates it with `Input.Contains` | yes |
| click-capture-mouse-prefix.md | "`MapController` clears that flag only in its own `OnMouseButton`"; it also clears it in `OnSwitchOff` | yes |
| click-capture-mouse-prefix.md | Camera freshness at click time imprecise (matrices last frame's, following position live); `Cursor` freshness missing | yes |
| cursor-unprojection-and-construction-plane.md | Same camera/cursor imprecision; Camera.cs anchor started mid-method | yes |
| body-and-limb-snapping.md | Hover flag also requires the hit-test viewport; secondary-viewport exception and editor case missing; Camera anchor off | yes |
| measure-menu-and-tool-window.md | Menu hook said to fire only from `OnDrawUiThreadSafe`; decomp anchor covered only the hook | yes |
| overlay-drawlist-rendering.md | "physics results for this step are applied" loose; `viewport.Position` is refreshed after AfterGui (unmentioned) | yes |
| circle-and-face-angle-tools.md | Face-angle "undefined during the frame an owner changes": `Prune` runs first in the same AfterGui call; preview NaN anchors are skipped, not labelled | yes |
| circle-and-face-angle-tools.md | Part.cs, Camera.cs and VehicleEditor.cs anchors did not cover the cited members (L3422 normal rotation) | yes |
| resilient-patching-and-diagnostics.md | Mod's `UnpatchAll(id)` in `StarMapUnload` presented as effective (no-op after StarMap's `UnpatchAll()`) | yes |
| resilient-patching-and-diagnostics.md | "`PatchAll` is all or nothing" (it applies classes up to the failing one) | yes |
| resilient-patching-and-diagnostics.md | "Every patch body has its own try/catch" (the menu postfix has none) | yes |
| resilient-patching-and-diagnostics.md | Perf scopes said to wrap "every picker" (surface, face-angle and free pickers have none) | yes |
| color-palettes-persistence.md | `Assembly.Location` validity under StarMap not verified; unload timing (process exit) unstated | yes |
| orbit-line-snapping.md | Stock use of `NearestOrbitPoint` described as left-click only (also the right-click burn menu); cached-point range clause incomplete | yes |
| ai/catalog/ksa-measuretools.yml | `game_types` out of sync with frontmatter in 14 entries; lifecycle for 2 entries after the fixes | yes |
| game-loop-and-lifecycle/overview.md (reference) | Did not record the `CursorHoverEligible` reset in row 11, the flight-only `Universe.OnDrawUi`, the hover-state freshness at AfterGui, or the `OnMouseButton` latch and click-time camera/cursor state | yes (added; logged in its log.md) |

## Features added

None. A survey of every file in the checkout (hooks, Harmony targets, reflection, ImGui, draw lists,
config IO, build files) found no reusable mechanism without a concept. Small mechanisms (save-load
reset, main-viewport hosting, short-right-click pause) are already covered inside their parent
concepts. Two generic howto topics were added to the catalog: `input-callback-frame-state` and
`starmap-unload-cleanup`.

## Open concerns

- The in-game effects of the AfterGui staleness come from the decomp order and were not run in game:
  the preview omits center snaps to dot-sized bodies, and part previews lag one 45 ms pick when the
  cursor first enters a vehicle.
- A flight part anchor on a vehicle that is then opened in the editor keeps resolving through the
  vehicle's center of mass and attitude. Whether it drifts when edits change the center of mass is
  still unverified (as the writer noted).
- Convention ambiguity: `editor:<phase>` is described as "use when the feature lives in the editor",
  but other bundles (kitten-engineer-redux) use it only for code that runs in `VehicleEditor.OnDrawUi`.
  This review applied the "where the code runs" reading. The orchestrator may want to settle this in
  `docs/content-conventions.md`.
- The lifecycle reference was being edited concurrently by other reviewers (its `generated` stamp
  changed during this session). The four additions were confirmed present after writing.
