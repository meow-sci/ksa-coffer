---
type: Game Feature
title: Make a walking kitten move and face along the look direction, and drive it with the mouse
description: How the stock grounded walk takes its heading from the main camera, how two first-person mods patch KittenLocomotion.StepGrounded to supply their own heading across threads, and how a captured mouse drives a kitten action such as a putter swing
topic: steer-a-walking-kitten
category: kittens
group: eva
approaches: 2
game_types: [KSA.KittenLocomotion, KSA.CharacterControlInputs, KSA.LocomotionCommand, KSA.LocomotionState, KSA.LocomotionFacts, KSA.PhysicsBubble, KSA.KittenEva, KSA.FixedController, KSA.Program, Brutal.ImGuiApi.ImGui, Brutal.GlfwApi.GlfwWindowAttribute]
lifecycle: [startup:all-mods-loaded, physics:vehicle-solver, frame:input, frame:viewports, frame:draw-ui, frame:render, frame:after-on-frame]
demonstrated_by: [mods/ksastructures/features/first-person-kitten-view, mods/ksagolf/features/first-person-kitten-view, mods/ksagolf/features/putting-session, mods/ksagolf/features/level-horizon-camera-controller]
tags: [kitten, locomotion, steering, heading, mouse, first-person, harmony]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:30:21Z }
repos:
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-physicsbubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: KSA.PhysicsBubble (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenlocomotion
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenLocomotion.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotion.cs
    title: KSA.KittenLocomotion (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-fixedcontroller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FixedController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs
    title: KSA.FixedController (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksastructures-src-ksastructures-ksa-firstpersonhook-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/FirstPersonHook.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/FirstPersonHook.cs
    title: src/KSAStructures/Ksa/FirstPersonHook.cs
  - id: ksagolf-src-ksagolf-ksa-firstpersonhook-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/FirstPersonHook.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/FirstPersonHook.cs
    title: src/KSAGolf/Ksa/FirstPersonHook.cs
  - id: ksastructures-src-ksastructures-ksa-firstperson-cs
    repo: KSAStructures
    path: src/KSAStructures/Ksa/FirstPerson.cs
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/src/KSAStructures/Ksa/FirstPerson.cs
    title: src/KSAStructures/Ksa/FirstPerson.cs
  - id: ksagolf-src-ksagolf-ksa-golf-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/Golf.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/Golf.cs
    title: src/KSAGolf/Ksa/Golf.cs
  - id: ksagolf-src-ksagolf-ksa-levelhorizoncontroller-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/LevelHorizonController.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/LevelHorizonController.cs
    title: src/KSAGolf/Ksa/LevelHorizonController.cs
  - id: ksagolf-src-ksagolf-sim-puttingstroke-cs
    repo: KSAGolf
    path: src/KSAGolf/Sim/PuttingStroke.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Sim/PuttingStroke.cs
    title: src/KSAGolf/Sim/PuttingStroke.cs
---
A KSA kitten walks relative to the camera and turns to face wherever it walks. That is fine in third person and wrong in first person: pressing left turns the kitten away from the view, and looking straight down sends it walking backwards. Two reference mods fix it the same way, by patching `KittenLocomotion.StepGrounded` on the vehicle worker so the walk uses a heading the mod supplies and the facing stays on the look. The same mods also take the mouse over in a borrowed view, which KSAGolf uses to swing a putter. This topic covers both: the heading patch and the captured mouse.

## Engine background

| Piece | Behaviour | Source |
|---|---|---|
| `KittenEva.PrepareWorker` | Copies the **main camera's** forward, right and up (CCE) into `CharacterControlInputs` once per frame (per dispatched step), on the main thread | [current/decomp/KSA/KittenEva.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs#L319-L333) |
| `PhysicsBubble.AdvanceKittenLocomotion` | Calls `KittenLocomotion.Advance` on the vehicle worker after each physics timestep (slices of at most 1/60 s of simulated time) | [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L1969-L1976) |
| `KittenLocomotion.StepGrounded` | Builds the move from `ResolveTangentBasis` (camera forward flattened onto the ground; falls back to the camera's up within about 3 degrees of straight down, which points behind the view), sets `FacingDirPhys` to the move direction | [current/decomp/KSA/KittenLocomotion.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenLocomotion.cs#L320-L369) |
| `FixedController`, `Program.OnKey/OnCursorPos/OnMouseButton` | The borrowed main-view controller receives the mouse through the active controller in the input phase | [current/decomp/KSA/FixedController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FixedController.cs) |
| `Program.IsWindowOpen` | Set true by KSA windows while they draw in the UI pass, reset at the end of the UI | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L318) |

Everything the walk reads is in the inputs the main thread copies; a patch that replaces `CameraForwardCce` replaces the walk's notion of "forward" without touching the camera.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Prefix replaces `CameraForwardCce`, postfix writes `FacingDirPhys` to command and state](steer-a-walking-kitten-1.md) | KSAStructures, KSAGolf | `harmony-postfix` | `physics:vehicle-solver`, `frame:draw-ui` | The walk follows the look and side-steps; the heading crosses threads as an immutable volatile array; KSAGolf makes the walk patch optional and draws the turn on the skeleton |
| [2. Capture the cursor and drive a kitten action (swing, strike) with raw mouse deltas](steer-a-walking-kitten-2.md) | KSAGolf | `mouse-capture` | `frame:input`, `frame:draw-ui`, `frame:viewports` | Controller owns the mouse while a swing is possible; pixel deltas to an angle with a clamp; the "window open" release never fires |

## See also

- [Put the camera in an EVA kitten's eyes, with mouse look and look-driven walking](../../../camera/special-views/first-person-camera-for-a-kitten/overview.md)
- [Kitten locomotion, modes and the servo, from the decompiled game](../kitten-locomotion-and-servo-reference/overview.md), [Write worker-thread-safe patches inside the vehicle solver](../../../physics/solver/write-worker-thread-safe-solver-patches/overview.md)
- [Isolate patch failures and fault-proof patch bodies](../../../patching/safety/isolate-patch-failures-and-fault-proof-patch-bodies/overview.md), [Pose a kitten's bones and aim its limbs with an IAnimProcessor](../../animation/pose-kitten-bones-with-an-anim-processor/overview.md), [Attach a prop to a kitten's hand or another bone](../../appearance/attach-a-prop-to-a-kitten-bone/overview.md)
- [Share the keyboard and mouse between ImGui, mod tools and the game](../../../ui/input/coordinate-imgui-focus-with-game-input/overview.md), [Rebindable hotkeys](../../../ui/input/rebindable-hotkeys/overview.md), [Compute mission elapsed time and detect liftoff](../../../flight-and-orbits/flight-state/compute-mission-elapsed-time-and-detect-liftoff/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Drive a running game from scripts through a file-drop command bridge](../../../testing-and-tooling/in-game-testing/drive-a-running-game-through-a-file-bridge/overview.md) - related topic

