---
type: Game Feature
title: Project world and sky positions to screen pixels and point at off-screen targets
description: Turn a position in the game's frames into an ImGui screen coordinate, including behind-camera points, edge cues for off-screen targets, the viewport offset, sky directions and CPU occlusion by bodies
topic: project-world-positions-to-screen
category: rendering
group: overlays
approaches: 6
game_types: [KSA.Camera, KSA.IViewport, KSA.Program, KSA.IOrbiter, KSA.IParentBody, KSA.StellarBody, KSA.Vehicle, KSA.ViewportRegistry]
lifecycle: [frame:draw-ui]
demonstrated_by: [mods/ksarmory/features/world-anchored-screen-markers, mods/ksa-deltavmap/features/map-mode-transfer-overlay, mods/ksagolf/features/cursor-picking-and-terrain-ray, mods/ksa-advancedflightcomputer/features/guidance-panel-and-overlays, mods/ohmystars/features/sky-overlay-lines-and-labels, mods/ksa-measuretools/features/overlay-drawlist-rendering, mods/compendium/features/body-pointer-overlay, mods/ohmystars/features/star-pointer, mods/ksarmory/features/gunner-sight-overlay, mods/ohmystars/features/overlay-occlusion-by-bodies]
tags: [projection, overlay, imgui-drawlist, camera, edge-cue, occlusion]
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
  - id: ksa-advancedflightcomputer-overlaycore-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Ui/Overlays/OverlayCore.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Ui/Overlays/OverlayCore.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Ui/Overlays/OverlayCore.cs"
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
  - id: ksa-iorbiter-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IOrbiter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IOrbiter.cs
    title: "KSA.IOrbiter (decompiled, build 2026.10.10.5554)"
  - id: ksa-iparentbody-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IParentBody.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IParentBody.cs
    title: "KSA.IParentBody (decompiled, build 2026.10.10.5554)"
  - id: ksa-iradius-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/IRadius.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/IRadius.cs
    title: "KSA.IRadius (decompiled, build 2026.10.10.5554)"
  - id: ksa-measuretools-measureoverlay-cs
    repo: KSA-MeasureTools
    path: MeasureTools/Features/Measure/MeasureOverlay.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-MeasureTools/blob/aed7f874f1c925c10c733b1dee72bd04b9b1985c/MeasureTools/Features/Measure/MeasureOverlay.cs
    title: "KSA-MeasureTools/MeasureTools/Features/Measure/MeasureOverlay.cs"
  - id: ksa-mod-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: "KSA.Mod (decompiled, build 2026.10.10.5554)"
  - id: ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
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
  - id: ohmystars-skyculturesrenderer-cs
    repo: OhMyStars
    path: src/SkyCulturesRenderer.cs
    resource: https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/src/SkyCulturesRenderer.cs
    title: "OhMyStars/src/SkyCulturesRenderer.cs"
  - id: ohmystars-stellariumrenderer-cs
    repo: OhMyStars
    path: src/StellariumRenderer.cs
    resource: https://github.com/nanonestor/OhMyStars/blob/4bb602e3bfe36bcd3670b71b88bf644fe95fa407/src/StellariumRenderer.cs
    title: "OhMyStars/src/StellariumRenderer.cs"
---

An ImGui overlay needs screen pixels, and the game's frames give ecliptic (Ecl) or camera-relative (Ego) positions. `Camera` converts between them and projects, but the result is viewport-local, mirrors or NaNs for points behind the camera, and has no depth buffer to hide
points behind planets. The six approaches cover the base recipe and each of those cases.

## Engine background

- Frames and projection: `Camera.EclToEgo` / `EgoToEcl` / `GetPositionEgo` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L223-L250), `EclToScreen` / `EgoToScreen` (NaN behind the camera when `ignoreBehind`) [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L339-L355), `EgoToClip` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L283),
  `IsPointWithinFov` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L529), the camera basis `GetForwardEcl` / `GetRightEcl` / `GetUpEcl` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L176-L190).
- Pixels are relative to the camera's viewport; add `IViewport.Position`. Draw lists: `ImGuiHelper.GetOverlayDrawList(viewport)` [current/decomp/KSA/ImGuiHelper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiHelper.cs#L43-L51); the stock reference is `Universe.DrawGalacticGrid` [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L1804-L1870).
- Hook: `[StarMapAfterGui]` is a postfix on `Program.OnDrawUiViewports` (`frame:draw-ui`), after `OnFrameViewports` finalised the cameras and inside `if (DrawUI)`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).
- Sky directions are placed by the game on a camera-centred sphere of radius 19.5 [current/decomp/KSA/InstancedStarTechnique.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/InstancedStarTechnique.cs#L68-L83).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: real points through the viewport camera](project-world-positions-to-screen-1.md) | ksarmory, ksa-deltavmap, ksa-advancedflightcomputer, ksagolf | Lift orbit or body-fixed anchors to Ecl, `EclToScreen`, add viewport origin | `frame:draw-ui` | The base recipe; behind-camera and occlusion are left to you |
| [2: sky directions on the star sphere](project-world-positions-to-screen-2.md) | ohmystars | Direction times 19.5, `EgoToScreen` | `frame:draw-ui` | No parallax with star sprites; no distance, fixed J2000 |
| [3: NaN culling with polyline breaking](project-world-positions-to-screen-3.md) | ksa-measuretools | `Valid` check, break sampled curves | `frame:draw-ui` | Simple and cheap; points near the camera plane vanish |
| [4: clip-space edge clamp](project-world-positions-to-screen-4.md) | compendium, ohmystars | `IsPointWithinFov`, divide by w, flip behind, scale to rectangle | `frame:draw-ui` | Reusable pointer to anything; hint only behind the camera |
| [5: edge cue from the camera basis](project-world-positions-to-screen-5.md) | ksarmory | Right/up bearing clamped to an inset rectangle | `frame:draw-ui` | Stable near the camera plane; needs the basis and viewport size |
| [6: CPU occlusion by bodies](project-world-positions-to-screen-6.md) | ohmystars | Ego-space sphere list, ray-sphere test | `frame:draw-ui` | Hides overlays behind bodies; per-segment cost, mean-radius spheres only |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Draw full-screen click-through overlays and choose the right ImGui draw list](../../../ui/overlays/draw-a-fullscreen-click-through-overlay/overview.md), [Draw lines and labels on the sky](../draw-lines-on-the-sky/overview.md), [Choose a render frame and anchor effects to bodies, parts and terrain](../choose-a-render-frame-and-anchor-effects/overview.md), [Turn the mouse cursor into a world ray and pick points on a construction plane](../../../ui/input/cursor-to-world-ray/overview.md), [Draw markers, brackets and measurement annotations on world objects](../draw-markers-and-annotations-on-world-objects/overview.md)
- [Keep mod UI and per-frame work running when the HUD is hidden (F2)](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md), [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../../../flight-and-orbits/flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md)
