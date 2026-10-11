---
type: Game Feature
title: Refusing a patch and rolling back when the game changes
description: How KSA mods treat a changed game method as a normal outcome by validating targets, throwing from transpilers, rolling back by Harmony id and publishing success flags, and when an anchor failure should stop the launch instead
topic: refuse-a-patch-and-roll-back-when-the-game-changes
category: patching
group: safety
approaches: 3
game_types: [KSA.PhysicsStates, KSA.TransferPlanner, KSA.Program, HarmonyLib.Harmony]
lifecycle: [startup:all-mods-loaded, startup:starmap-before-main, event:starmap-unload]
demonstrated_by: [mods/ksaero/features/patch-refusal-and-rollback, mods/ksaero/features/computedrag-call-site-transpiler, mods/ksa-advancedflightcomputer/features/feature-gated-patch-sets, mods/shaderextensions/features/rendergame-render-pass-transpiler]
tags: [harmony, rollback, refusal, safety, game-update, unpatch, transpiler]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:37:33Z }
repos:
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: ShaderExtensions
    git: https://github.com/AMPW-german/ShaderExtensions.git
    ref: 6a2eb66ea85bcaa2d4657e502a4f75e92693ea77
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
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: starmap-starmapcore
    repo: StarMap
    path: StarMap.Core/StarMapCore.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMapCore.cs
    title: "StarMap/StarMap.Core/StarMapCore.cs"
---

KSA changes every few days. A patch that depends on the exact shape of a game method will eventually meet a build
where that shape is gone. The cheap and safe response is to make that a normal outcome: validate the lookups, make
transpilers throw unless the shape is exactly what was expected, catch around `Patch`, remove only your own patches by
Harmony id, log once, and publish the instance or feature flag only on success so dependent UI and code stay honest.
The exception is a patch the whole mod depends on, where aborting the launch is better than running half-patched.

## Engine background

| Type | Member | Why it matters here |
|---|---|---|
| `PhysicsStates` | `ComputeDerivatives`, `ComputeDrag` | Two drag calls; exactly one is retargeted ([current/decomp/KSA/PhysicsStates.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs#L1002-L1017)[^ksa-physicsstates]) |
| `TransferPlanner` | private static fields and `SetTransferInfo` | Handles validated per feature ([current/decomp/KSA/TransferPlanner.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TransferPlanner.cs#L1573-L1603)[^ksa-transferplanner]) |
| `Program` | `RenderGame` | One `RenderDrawData` call between `BeginRenderPass` and `EndRenderPass` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4947-L4952)[^ksa-program]) |
| `HarmonyLib.Harmony` | `Patch`, `UnpatchAll(id)` | Surfaces a transpiler exception and removes patches by owner |

Phases from [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md): patches are applied either in `[StarMapBeforeMain]` (`startup:starmap-before-main`, before the game's
entry point, no `try`/`catch` in StarMap) or in `[StarMapAllModsLoaded]` (`startup:all-mods-loaded`, after
`ModLibrary.LoadAll`, before any universe exists). `[StarMapUnload]` (`event:starmap-unload`) runs after StarMap's id-less
`UnpatchAll()` has already removed every patch ([StarMap.Core/StarMapCore.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMapCore.cs#L31-L35)[^starmap-starmapcore]).

## Facts checked against Lib.Harmony 2.4.2

| Question | Observed |
|---|---|
| A transpiler throws in `harmony.Patch` | `Patch` throws (`TargetInvocationException`; the transpiler's exception is the base exception); the original keeps running; no owner remains registered |
| A transpiler throws in `PatchAll` | `PatchAll` throws `HarmonyException`; classes apply in declaration order and stop at the first failure, earlier ones stay applied |
| `UnpatchAll("mod.a")` | removes only `mod.a`'s patches |
| `UnpatchAll()` with no id | removes every owner's patches |
| A patch class targets a method that does not exist | `CreateClassProcessor(type).Patch()` throws `HarmonyException` "Undefined target method" |

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [Throw on a bad match, UnpatchAll(own id), publish the instance on success](refuse-a-patch-and-roll-back-when-the-game-changes-1.md) | KSAero | Throw on a bad match, unpatch own id, publish instance on success | `startup:all-mods-loaded` | Simple; one all-or-nothing patch |
| 2 | [One Harmony owner per feature with TryApply, validated handles and runtime flags](refuse-a-patch-and-roll-back-when-the-game-changes-2.md) | KSA-AdvancedFlightComputer | One owner per feature, `TryApply`, validated handles, runtime flags | `startup:all-mods-loaded` | More structure; costs one feature, not the mod |
| 3 | [Let an anchor failure stop the launch (and why that can be right)](refuse-a-patch-and-roll-back-when-the-game-changes-3.md) | ShaderExtensions | Let an anchor failure stop the launch | `startup:starmap-before-main` | Loud and correct for a mod that cannot run half-patched; blocks the game |

## See also

- [Isolating patch failures and keeping patch bodies from throwing](../isolate-patch-failures-and-fault-proof-patch-bodies/overview.md) for localising damage after patching succeeded
- [Validating patch targets and detecting game-update breakage](../validate-patch-targets-and-detect-game-update-breakage/overview.md) for detecting breakage before a player does
- [Removing Harmony patches safely at runtime and at exit](../remove-your-patches-safely-at-runtime-and-at-exit/overview.md) for id-scoped removal and the shutdown fact
- Related topic: check-the-game-version
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Warn when the running game build differs from the one a mod was tested on](../../../getting-started/lifecycle/check-the-game-version/overview.md) - related topic

[^ksa-physicsstates]: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
[^ksa-transferplanner]: KSA.TransferPlanner (decompiled, build 2026.10.10.5554)
[^ksa-program]: KSA.Program (decompiled, build 2026.10.10.5554)
[^starmap-starmapcore]: StarMap/StarMap.Core/StarMapCore.cs
