---
type: Game Feature
title: Draw markers, brackets and measurement annotations on world objects
description: Put a bracket on a craft, a lock cue on a contact, a measurement line with a plated label on a hull, a transfer-window gizmo in the map view or a pointer to a selected body using projected points on an ImGui draw list rather than Vulkan
topic: draw-markers-and-annotations-on-world-objects
category: rendering
group: overlays
approaches: 5
game_types: [KSA.Camera, KSA.IViewport, KSA.ImGuiHelper, KSA.Vehicle, KSA.Program]
lifecycle: [frame:draw-ui]
demonstrated_by: [mods/ksarmory/features/world-anchored-screen-markers, mods/ksa-measuretools/features/overlay-drawlist-rendering, mods/ksa-measuretools/features/circle-and-face-angle-tools, mods/ksa-deltavmap/features/map-mode-transfer-overlay, mods/ksa-advancedflightcomputer/features/multi-pass-preview-rendering, mods/compendium/features/body-pointer-overlay, mods/ohmystars/features/star-pointer]
tags: [markers, annotations, overlay, imgui-drawlist, projection]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: Compendium
    git: https://github.com/meow-sci/Compendium.git
    ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
  - name: KSA-MeasureTools
    git: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools.git
    ref: aed7f874f1c925c10c733b1dee72bd04b9b1985c
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: OhMyStars
    git: https://github.com/nanonestor/OhMyStars.git
    ref: 4bb602e3bfe36bcd3670b71b88bf644fe95fa407
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: compendium-cdmbodypointer-cs
    repo: Compendium
    path: src/CdmBodyPointer.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CdmBodyPointer.cs
    title: "Compendium/src/CdmBodyPointer.cs"
  - id: compendium-compendiummain-cs
    repo: Compendium
    path: src/CompendiumMain.cs
    resource: https://github.com/meow-sci/Compendium/blob/62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c/src/CompendiumMain.cs
    title: "Compendium/src/CompendiumMain.cs"
  - id: ksa-advancedflightcomputer-multipassrenderer-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/MultiPass/MultiPassRenderer.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/MultiPass/MultiPassRenderer.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/MultiPass/MultiPassRenderer.cs"
  - id: ksa-astronomical-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Astronomical.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Astronomical.cs
    title: "KSA.Astronomical (decompiled, build 2026.10.10.5554)"
  - id: ksa-camera-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "KSA.Camera (decompiled, build 2026.10.10.5554)"
  - id: ksa-deltavmap-transferwindowmapoverlay-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap/Render/TransferWindowMapOverlay.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap/Render/TransferWindowMapOverlay.cs
    title: "KSA-DeltaVMap/DeltaVMap/Render/TransferWindowMapOverlay.cs"
  - id: ksa-imguihelper-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiHelper.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiHelper.cs
    title: "KSA.ImGuiHelper (decompiled, build 2026.10.10.5554)"
  - id: ksa-instancedstartechnique-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/InstancedStarTechnique.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InstancedStarTechnique.cs
    title: "KSA.InstancedStarTechnique (decompiled, build 2026.10.10.5554)"
  - id: ksa-measuretools-mappicker-cs
    repo: KSA-MeasureTools
    path: MeasureTools/Features/Measure/MapPicker.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools/blob/aed7f874f1c925c10c733b1dee72bd04b9b1985c/MeasureTools/Features/Measure/MapPicker.cs
    title: "KSA-MeasureTools/MeasureTools/Features/Measure/MapPicker.cs"
  - id: ksa-measuretools-measureoverlay-cs
    repo: KSA-MeasureTools
    path: MeasureTools/Features/Measure/MeasureOverlay.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools/blob/aed7f874f1c925c10c733b1dee72bd04b9b1985c/MeasureTools/Features/Measure/MeasureOverlay.cs
    title: "KSA-MeasureTools/MeasureTools/Features/Measure/MeasureOverlay.cs"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksarmory-edgecue-cs
    repo: KSArmory
    path: src/KSArmory/Sim/EdgeCue.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/EdgeCue.cs
    title: "KSArmory/src/KSArmory/Sim/EdgeCue.cs"
  - id: ksarmory-ksaworld-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KsaWorld.cs
    title: "KSArmory/src/KSArmory/Ksa/KsaWorld.cs"
  - id: ksarmory-markers-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Markers.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Markers.cs
    title: "KSArmory/src/KSArmory/Ksa/Markers.cs"
  - id: ohmystars-stellariumrenderer-cs
    repo: OhMyStars
    path: src/StellariumRenderer.cs
    resource: https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/src/StellariumRenderer.cs
    title: "OhMyStars/src/StellariumRenderer.cs"
---

Annotations that live in screen space but belong to world objects need no Vulkan: project the object's position every frame and draw primitives on an ImGui draw list. The game's own overlays (body labels, the Transfer Planner alignment marker, the FPS counter) do the same. The choices are which draw list, which window flags, which glyph, and how to
handle off-screen and occluded targets.

## Engine background

- Projection: `Camera.EclToScreen` / `EgoToScreen` / `EgoToClip` / `IsPointWithinFov` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L283-L355); add `IViewport.Position`.
- Draw lists: `ImGuiHelper.GetOverlayDrawList(viewport)` (main viewport: `GetBackgroundDrawList`; otherwise the current window's list) [current/decomp/KSA/ImGuiHelper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiHelper.cs#L43-L51); the stock reference is the Transfer Planner alignment marker and `Universe.DrawGalacticGrid` [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1804-L1870).
- Hook: `[StarMapAfterGui]` (`frame:draw-ui`), skipped when `Program.DrawUI` is false. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: constant-pixel-size brackets, cues and bars](draw-markers-and-annotations-on-world-objects-1.md) | ksarmory | Full-screen `NoInputs` window, edge arrows, occlusion marks | `frame:draw-ui` | Readable at any distance; labels need their own windows |
| [2: lines, curves, rings and plated labels](draw-markers-and-annotations-on-world-objects-2.md) | ksa-measuretools | Background list, NaN-broken polylines, throttled picks | `frame:draw-ui`, `frame:input` | Sits under panels; shared list order |
| [3: map-mode markers and gizmos](draw-markers-and-annotations-on-world-objects-3.md) | ksa-deltavmap | Orbit positions lifted to Ecl, probe-projected gizmo | `frame:draw-ui`, `frame:pre-render` | Future positions; only valid in Map mode |
| [4: window-rect pointer to a body](draw-markers-and-annotations-on-world-objects-4.md) | compendium | Previous-frame rectangle, clip-space edge clamp | `frame:draw-ui` | Finds a body anywhere; window draw list, not foreground |
| [5: same technique for a catalog star](draw-markers-and-annotations-on-world-objects-5.md) | ohmystars | Star direction times 19.5, behind-camera flip | `frame:draw-ui` | Pointer to sky objects; hint only when behind |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Draw full-screen click-through overlays and choose the right ImGui draw list](../../../ui/overlays/draw-a-fullscreen-click-through-overlay/overview.md), [Project world and sky positions to screen pixels and point at off-screen targets](../project-world-positions-to-screen/overview.md), [Draw world-space lines and gizmos with the game's own renderers](../draw-world-space-lines-and-gizmos/overview.md)
- [Keep mod UI and per-frame work running when the HUD is hidden (F2)](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md)
