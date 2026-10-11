---
type: Game Feature
title: Borrow the main camera, hand it back and arbitrate between camera users
description: How a mod takes the player's main view, records what it changes, returns each half only if the player did not change it meanwhile, and shares the view with other features or mods
topic: borrow-the-main-camera-and-hand-it-back
category: camera
group: main-view
approaches: 5
game_types: [KSA.Program, KSA.Camera, KSA.CameraMode, KSA.GameViewport, KSA.IFollowable, KSA.Vehicle, KSA.FixedController]
lifecycle: [frame:draw-ui, frame:celestials, frame:viewports, event:save]
demonstrated_by: [mods/ksarmory/features/borrow-main-view-camera, mods/ksagolf/features/borrowed-chase-camera, mods/ksastructures/features/computer-flies-nearest-craft, mods/ksastructures/features/first-person-kitten-view, mods/gatos/features/programmable-camera-director, mods/ksarmory/features/file-command-bridge-and-mcp]
tags: [camera, borrow, restore, arbitration, stand-down, main-view]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:20:07Z }
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-camera
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: KSA.Camera (decompiled, build 2026.10.10.5554)
  - id: ksa-gameviewport
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameViewport.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs
    title: KSA.GameViewport (decompiled, build 2026.10.10.5554)
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
---
The main view is the player's, and nothing in the engine arbitrates it: there is one mode and one follow target per viewport and the last writer wins.
A mod that borrows the view has to record what it changes, restore only what is still its own, and give way when the player (or another mod) takes it.
The three things a borrower changes are the **camera mode**, the **follow target** and the **field of view**, and the player can take the first two separately.

## Engine background

| Type | Role | Source |
|---|---|---|
| `Camera.SetFollow`, `Unfollow`, `Following` | Follow target; `SetFollow` teleports to 2.5 mean radii and swaps `Program.ControlledVehicle` unless `changeControl` is false | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L602-L631), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L158) |
| `GameViewport.SetCameraMode`, `NextCameraMode` | Immediate mode field; the mode key cannot leave Fixed | [current/decomp/KSA/GameViewport.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs#L302-L330) |
| `Camera.SetFieldOfView`, `ChangeFieldOfView` | FOV unclamped from code, 15-120 degrees from the zoom keys | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L417-L421), [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L455-L462) |
| `Camera.DeserializeSave` | A save load sets the follow and mode from the save | [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L832-L849) |
| `Program.OnFrameCelestials`, `OnDrawUiViewports` | Hooks for stepping with and without the HUD | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2260-L2321) |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Record, stand down on a player change, restore halves separately](borrow-the-main-camera-and-hand-it-back-1.md) | KSArmory | `state-record-and-restore` | `frame:draw-ui`, `frame:celestials`, `event:save` | Complete (HUD hidden, save load, retries); needs three hooks |
| [2. FOV first, follow only if still ours; decision table](borrow-the-main-camera-and-hand-it-back-2.md) | KSAGolf | `state-record-and-restore`, `camera-arbitration` | `frame:draw-ui`, `frame:viewports` | KSA-free rules, headless-tested; the claim rules are not wired at the pinned ref |
| [3. Record before the first write for another craft or a first-person kitten](borrow-the-main-camera-and-hand-it-back-3.md) | KSAStructures | `state-record-and-restore` | `frame:draw-ui` | Shortest; no stand-down ladder |
| [4. Capture everything, blend back, detect a second writer](borrow-the-main-camera-and-hand-it-back-4.md) | gatOS | `controller-subclass` | `frame:viewports` | Handles faults and other mods; restores a lot of state |
| [5. Pure `ViewClaim` ladder, drivers in claim order](borrow-the-main-camera-and-hand-it-back-5.md) | KSArmory | `view-claim-ladder` | `frame:draw-ui`, `frame:celestials` | Several features share the view cleanly; one mod's design, not an engine feature |

## See also

- [Make the camera follow a point or mod-simulated object, and change the follow target without a jump](../follow-a-point-that-is-not-a-vehicle/overview.md), [Drive the main camera through Fixed mode without crashing it, with a stable up vector](../../controllers/drive-the-main-camera-in-fixed-mode/overview.md), [Taking control of another vehicle](../../../vehicles-and-parts/vehicles/take-control-of-another-vehicle/overview.md)
- [Keep mod UI and per-frame work running when the HUD is hidden (F2)](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md), [Replace a viewport's camera controller and take input through it](../../controllers/replace-a-viewport-camera-controller/overview.md)
- [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
