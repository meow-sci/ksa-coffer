---
type: Game Feature
title: Writing a Harmony transpiler for a KSA method
description: "How to read the real IL of a KSA method, build the instruction rewrite, prove the match count and survive Harmony re-running transpilers, with four worked shapes: retarget a call, insert at an anchor, replace an instruction run and filter a read"
topic: write-a-harmony-transpiler
category: patching
group: transpilers
approaches: 4
game_types: [KSA.PhysicsStates, KSA.TransferPlanner, KSA.CelestialSystem, KSA.PhysicsBubble, KSA.StructuralLoad, KSA.Program]
lifecycle: [startup:all-mods-loaded, startup:starmap-before-main, frame:celestials, physics:vehicle-solver]
demonstrated_by: [mods/ksaero/features/computedrag-call-site-transpiler, mods/ksa-advancedflightcomputer/features/plan-window-transpiler-injection, mods/realatmospheres/features/nearby-body-transpiler, mods/unscience/features/kitchen-sink-g-load-protection]
tags: [harmony, transpiler, il, ilspy, patching, recipe]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:37:38Z }
repos:
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: RealAtmospheres
    git: https://github.com/Brimfyr/RealAtmospheres.git
    ref: 19dc37a55b2e359bd8eec2f5b41722ab11ae0c46
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-physicsstates
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsStates.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs
    title: "KSA.PhysicsStates (decompiled, build 2026.10.10.5554)"
  - id: ksa-transferplanner
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TransferPlanner.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransferPlanner.cs
    title: "KSA.TransferPlanner (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestialsystem
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CelestialSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs
    title: "KSA.CelestialSystem (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsbubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: "KSA.PhysicsBubble (decompiled, build 2026.10.10.5554)"
---

A prefix or postfix works at method boundaries. A transpiler changes what happens *inside* a method: which call it makes, what it passes, or what
decision it takes. Use one when the behaviour you need to change has no method boundary (an inlined comparison, one call among several in a big
method, a value read in the middle of a calculation), or when a prefix would have to re-run the whole method. KSA mods use four shapes, each with
a worked article in this topic.

## The recipe

1. **Read the real IL.** `ilspycmd -il current/dll/KSA.dll` (the shipped assembly is debug-compiled, `DebuggableAttribute` modes `0x107` read from
   the assembly's custom attribute blob, so its IL contains `nop`s and tracks the C# closely). Look for the instruction sequence around the
   behaviour, including the loads that feed each call's arguments.
2. **Pick exact overloads.** Resolve the target, the call you will swap and the replacement with explicit parameter arrays and `MakeByRefType()`
   for `in`/`ref`/`out`.
3. **Build the instruction list and mutate it.** Copy to a `List<CodeInstruction>`, locate by *what an instruction does* (`Calls`, `LoadsField`,
   argument loads), not by index.
4. **Prove the match count.** Throw unless the shape is exactly what was expected, or return the original IL and record that, depending on whether
   the feature is optional.
5. **Expect to be re-run.** Harmony rebuilds the method from the original IL whenever any patch on it is added or removed, running every
   transpiler again and handing later transpilers the earlier ones' output (a local test against Lib.Harmony 2.4.2, the version StarMap references,
   printed the first transpiler's output line again when a second patch was added and again when it was removed).
6. **Test over the original IL** with `PatchProcessor.GetOriginalInstructions(method)`.

## Engine background

| Type | Member | Used by |
|---|---|---|
| `PhysicsStates` | `ComputeDerivatives` (static, 10 parameters), private static `ComputeDrag` | Shape 1 ([current/decomp/KSA/PhysicsStates.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs#L1002-L1017)[^ksa-physicsstates]) |
| `TransferPlanner` | `DrawPlanWindow`, private `DrawCorrectionTransfer`, `Burn.Create` | Shape 2 ([current/decomp/KSA/TransferPlanner.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransferPlanner.cs#L616-L626)[^ksa-transferplanner]) |
| `CelestialSystem` | `GetNearbyAstronomical` | Shape 3 ([current/decomp/KSA/CelestialSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CelestialSystem.cs#L565-L584)[^ksa-celestialsystem]) |
| `PhysicsBubble`, `StructuralLoad` | private static `DetectStructuralFailure`, `GLoadFraction` | Shape 4 ([current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L999-L1017)[^ksa-physicsbubble]) |

Phases from [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md): transpilers run at patch time (`startup:all-mods-loaded` or `startup:starmap-before-main`); the rewritten code runs in
`physics:vehicle-solver`, `frame:draw-ui` or `frame:celestials`.

## Approaches

| # | Article | Mod | Shape | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Retarget the operand of one call (same signature)](write-a-harmony-transpiler-1.md) | KSAero | Retarget the operand of one call (same signature) | `startup:all-mods-loaded`, `physics:vehicle-solver` | Smallest change; needs a same-signature replacement |
| 2 | [Insert a call before a validated anchor](write-a-harmony-transpiler-2.md) | KSA-AdvancedFlightComputer | Insert a call before a validated anchor, as a pipeline of fail-soft passes | `startup:all-mods-loaded`, `frame:draw-ui` | Easy to add, harder to be sure about labels and regions |
| 3 | [Replace an instruction run with a helper that takes a local by reference](write-a-harmony-transpiler-3.md) | Real Atmospheres | Replace an instruction run (compare and branch) with a helper that takes a local by reference | `startup:starmap-before-main`, `frame:celestials` | Most powerful; depends on exact local slots and sequence |
| 4 | [Filter one value read through a registry check](write-a-harmony-transpiler-4.md) | unscience | Filter one value read through a registry check | `startup:all-mods-loaded`, `physics:vehicle-solver` | Minimal change to a decision; the filter runs on workers |

## See also

- [Swapping one call inside a game method with a transpiler](../swap-one-call-inside-a-game-method-with-a-transpiler/overview.md) for replacements that differ from the original in signature or purpose
- [Identifying the right call in a method that makes several similar calls](../identify-a-call-by-its-argument-il/overview.md) for picking the right call among several
- [Inserting calls into a game method at an IL anchor](../insert-calls-into-a-game-method-at-an-il-anchor/overview.md) for labels and exception regions
- [Refusing a patch and rolling back when the game changes](../../safety/refuse-a-patch-and-roll-back-when-the-game-changes/overview.md) and [Coexisting with other mods that patch the same method](../../harmony/coexist-with-other-mods-patching-the-same-method/overview.md)
- [Changing behaviour of a game method marked AggressiveInlining](../../internals/patch-around-aggressive-inlining/overview.md)
- Related tasks: choose-which-body-the-game-renders-in-detail, make-a-vehicle-indestructible, write-worker-thread-safe-solver-patches
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Test Harmony patches without running the game](../../../testing-and-tooling/offline-tests/test-harmony-patches-without-the-game/overview.md) - related topic
- [Control which body the game picks as the camera's nearby celestial](../../../celestials/atmospheres-and-rings/choose-which-body-the-game-renders-in-detail/overview.md) - related topic
- [Making a vehicle survive crashes and g-loads, and damaging parts against crash tolerance](../../../vehicles-and-parts/vehicles/make-a-vehicle-indestructible/overview.md) - related topic
- [Write worker-thread-safe patches inside the vehicle solver](../../../physics/solver/write-worker-thread-safe-solver-patches/overview.md) - related topic

[^ksa-physicsstates]: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
[^ksa-transferplanner]: KSA.TransferPlanner (decompiled, build 2026.10.10.5554)
[^ksa-celestialsystem]: KSA.CelestialSystem (decompiled, build 2026.10.10.5554)
[^ksa-physicsbubble]: KSA.PhysicsBubble (decompiled, build 2026.10.10.5554)
