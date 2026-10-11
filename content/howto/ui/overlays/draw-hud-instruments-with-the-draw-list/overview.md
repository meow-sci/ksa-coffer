---
type: Game Feature
title: 'Draw HUD instruments: arc gauges, gradients, scrolling tapes and animated intros'
description: Building broadcast-style and fighter-style instruments from ImGui draw-list primitives, and the draw-list limits that shape the techniques
topic: draw-hud-instruments-with-the-draw-list
category: ui
group: overlays
approaches: 3
game_types: [Brutal.ImGuiApi.ImDrawListPtr, Brutal.ImGuiApi.Internal.ImGuiWindowPtr, KSA.Program, Brutal.ImGuiApi.ImDrawListExtensions, KSA.CameraMode, KSA.Vehicle, Brutal.ImGuiApi.ImDrawVert]
lifecycle: ['frame:draw-ui', 'frame:viewports']
demonstrated_by: [mods/ksa-public-telemetry/features/foreground-drawlist-broadcast-overlay, mods/ksa-public-telemetry/features/intro-outro-animation, mods/ksa-aircrafthud/features/fullscreen-drawlist-hud]
tags: [hud, instruments, gauge, tape, animation, draw-list, imgui]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:06:12Z }
status: stable
repos:
- name: KSA-Public-Telemetry
  git: https://github.com/elevatorctln/KSA-Public-Telemetry/
  ref: "90608fb465f87d6008208798cc4d20ed8182c9a0"
- name: KSA_AircraftHUD
  git: https://github.com/uriahgnu/KSA_AircraftHUD.git
  ref: "4e4c71719a8355afb1fc608f54d531676bec4ef3"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: brutal-imguiapi-imdrawlistextensions
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs
  title: Brutal.ImGuiApi.ImDrawListExtensions (decompiled, build 2026.10.10.5554)
- id: brutal-imguiapi-imdrawlistptr
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImDrawListPtr.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListPtr.cs
  title: Brutal.ImGuiApi.ImDrawListPtr (decompiled, build 2026.10.10.5554)
- id: brutal-imguiapi-imdrawvert
  repo: ksa-game-assemblies
  path: current/decomp/Brutal.ImGuiApi/ImDrawVert.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawVert.cs
  title: Brutal.ImGuiApi.ImDrawVert (decompiled, build 2026.10.10.5554)
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
---
KSA has no instrument toolkit for mods: no gauge widget, no tape, no gradient polygon. Mods that want a HUD draw it from ImGui's draw-list primitives (lines, rectangles, circles, paths, text) and add the missing pieces themselves. Two mods show
the two extremes: KSA-Public-Telemetry's SpaceX-webcast-style bar (round arc gauges, gradient plates, staged animation) and KSA_AircraftHUD's fighter HUD (scrolling tapes, rolling pitch ladder). Where the overlay lives and how it
stays up with the HUD hidden is covered separately, in [full-screen overlays](../draw-a-fullscreen-click-through-overlay/overview.md) and
[the hidden-HUD topic](../draw-ui-while-the-hud-is-hidden/overview.md).

## Engine background

| Piece | File | What it gives you |
|---|---|---|
| `ImDrawListPtr`, `ImDrawListExtensions` | [current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListExtensions.cs#L1-L60) | `AddLine`, `AddCircle(Filled)`, `AddRect(Filled)`, `AddRectFilledMultiColor`, `AddConvexPolyFilled`, `PathArcTo`/`PathStroke`, `PushClipRect`/`PopClipRect`, `AddText` |
| `ImDrawListPtr.VtxBuffer`, `ImDrawVert` | [current/decomp/Brutal.ImGuiApi/ImDrawListPtr.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawListPtr.cs#L17), [current/decomp/Brutal.ImGuiApi/ImDrawVert.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImDrawVert.cs#L7-L17) | Read and edit emitted vertices (position, uv, packed colour) |
| `Program.OnFrame` UI section | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2260-L2290) | Where the list is built (`frame:draw-ui` or earlier at `frame:viewports`); `ImGui.Render` finalises it |
| `Program.DrawFps` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3248-L3268) | The stock example of a window-less draw into the main overlay list |

**Draw-list limits that shape the techniques.** No transform stack (rotate endpoints yourself); no gradient polygon (edit vertex colours, or stack strips); path angles start at 3 o'clock (wrap an arc helper); a clip rect is an axis-aligned rectangle (use it to keep ticks
out of a readout box); text is positioned, not rotated. The animation clock is the frame delta `dtPlayer` passed to the UI calls: player time, not simulation time. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [PathArcTo plus PathStroke, vertex-alpha rewrite for gradients](draw-hud-instruments-with-the-draw-list-1.md) | KSA-Public-Telemetry | Arc helper with a 12 o'clock origin, stacked strips, `VtxBuffer` rewrite | `frame:draw-ui` | Smooth looks; order-sensitive vertex editing |
| 2 | [Overlapping stages with 1-(1-t)^n easing and edge-in stagger](draw-hud-instruments-with-the-draw-list-2.md) | KSA-Public-Telemetry | Pure function of elapsed seconds, reversible outro | `frame:draw-ui` | No tween library; consumers must multiply phases |
| 3 | [PushClipRect per region and endpoint rotation before AddLine](draw-hud-instruments-with-the-draw-list-3.md) | KSA_AircraftHUD | Tapes drawn twice around a box, rotated ladder, shadow pass | `frame:viewports` | No world projection; layout fixed at load |

## Choosing

- Round gauges and soft shapes: approach 1. Make them appear and disappear gracefully: approach 2. Scales and attitude symbology: approach 3.
- The techniques combine freely; approach 1's `Arc` helper and approach 3's shadowed `DrawLine` are the most reusable pieces.

## See also

- [Draw full-screen click-through overlays and choose the right ImGui draw list](../draw-a-fullscreen-click-through-overlay/overview.md)
- [Keep mod UI and per-frame work running when the HUD is hidden](../draw-ui-while-the-hud-is-hidden/overview.md)
- [Read a vehicle's position, velocity, attitude, orbit and flight instruments](../../../flight-and-orbits/flight-state/read-vehicle-flight-state/overview.md)

