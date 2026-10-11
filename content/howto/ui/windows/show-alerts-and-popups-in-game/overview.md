---
type: Game Feature
title: Show transient alerts and game-styled popups in game
description: How KSA draws its centred timed alerts and its console-styled Popup modals, and two ways mods use them - TimedAlert from main-thread hooks and a Popup subclass that registers itself
topic: show-alerts-and-popups-in-game
category: ui
group: windows
approaches: 2
game_types: [KSA.TimedAlert, KSA.Alert, KSA.LStrings, KSA.Popup, KSA.PopupButton, KSA.PopupButtonKind, KSA.ConfirmActionPopup, KSA.ConsoleStyle, KSA.Program, KSA.FlightComputer]
lifecycle: ['frame:apply-solvers', 'frame:prepare', 'frame:draw-ui']
demonstrated_by: [mods/ksa-advancedflightcomputer/features/stock-timed-alerts, mods/ohmystars/features/game-styled-popups-and-toasts, mods/ohmystars/features/star-binary-switcher]
tags: [alert, toast, popup, modal, confirm, console-style]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:30:33Z }
status: stable
repos:
- name: KSA-AdvancedFlightComputer
  git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
  ref: "77c0ccf5608e49c459eec72c3a56d0b30d62da63"
- name: OhMyStars
  git: https://github.com/nanonestor/OhMyStars.git
  ref: "4bb602e3bfe36bcd3670b71b88bf644fe95fa407"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
- id: ksa-timedalert
  repo: ksa-game-assemblies
  path: current/decomp/KSA/TimedAlert.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TimedAlert.cs
  title: KSA.TimedAlert (decompiled, build 2026.10.10.5554)
- id: ksa-alert
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Alert.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Alert.cs
  title: KSA.Alert (decompiled, build 2026.10.10.5554)
- id: ksa-popup
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Popup.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Popup.cs
  title: KSA.Popup (decompiled, build 2026.10.10.5554)
- id: ksa-confirmactionpopup
  repo: ksa-game-assemblies
  path: current/decomp/KSA/ConfirmActionPopup.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConfirmActionPopup.cs
  title: KSA.ConfirmActionPopup (decompiled, build 2026.10.10.5554)
- id: ksa-program
  repo: ksa-game-assemblies
  path: current/decomp/KSA/Program.cs
  resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
  title: KSA.Program (decompiled, build 2026.10.10.5554)
---
KSA has two built-in ways to talk to the player from code: a fading centred message list (`TimedAlert`, drawn by `Alert.DrawAll`) and console-styled modal dialogs (`Popup` subclasses, drawn by `Popup.DrawAll`). Both are drawn at the very start of `Program.OnDrawUiFrame`, so anything a mod creates earlier in the frame (or during that frame's ImGui pass) appears in the same frame, and both go away or stop drawing when the HUD is hidden.

## Engine background

| Piece | File | Role |
|---|---|---|
| `TimedAlert.Create` / `CreateWarning` / `ClearAll` | [current/decomp/KSA/TimedAlert.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TimedAlert.cs#L57-L83) | Register a fading alert (player time); clear them all |
| `Alert.DrawAll` | [current/decomp/KSA/Alert.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Alert.cs#L16-L24) | Draws load, fixed and timed alerts on the foreground list from y = 150 |
| `Popup` (constructor, `DrawAll`, `BeginConsoleModal`, `CreateButton`) | [current/decomp/KSA/Popup.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Popup.cs#L46-L117) | Static popup list and console-modal helpers |
| `ConfirmActionPopup.Create` | [current/decomp/KSA/ConfirmActionPopup.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConfirmActionPopup.cs#L24-L40) | Stock confirm/cancel factory, the model to copy |
| `Program.OnDrawUiFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3131-L3134) | Calls `Alert.DrawAll` then `Popup.DrawAll` |
| `Program.DrawUI` setter | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L528-L539) | Clears timed alerts when the HUD is hidden |

**Frame order.** `frame:apply-solvers` and `frame:prepare` hooks may create alerts; `frame:draw-ui` draws them. See
[Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [TimedAlert.Create / CreateWarning](show-alerts-and-popups-in-game-1.md) | KSA-AdvancedFlightComputer | Static API from main-thread hooks | `frame:apply-solvers`, `frame:prepare`, `frame:draw-ui` | Tiny; unsynchronised list, cleared when the HUD hides |
| 2 | [Popup subclass drawn by Popup.DrawAll](show-alerts-and-popups-in-game-2.md) | Oh My Stars | Subclass, construct to show, console modal helpers | `frame:draw-ui` | Stock look and buttons; inheritance surface may change |

## Choosing

- A short message that fades: approach 1. A question the player must answer: approach 2.
- Neither works before the game loop runs; for questions during loading see [show a dialog during loading](../show-a-dialog-during-loading/overview.md).

## See also

- [Show a dialog during loading](../show-a-dialog-during-loading/overview.md)
- [Keep UI running when the HUD is hidden](../../overlays/draw-ui-while-the-hud-is-hidden/overview.md)
- [Match the stock console UI style](../match-the-stock-console-ui-style/overview.md)

