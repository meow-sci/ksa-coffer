---
type: Game Feature
title: Patching private and overloaded game methods by name
description: "How a Harmony patch attaches to a private, protected or overloaded KSA method that cannot be written with typeof or nameof, with string names, manual lookups, explicit parameter arrays, TargetMethods and injected fields, and how each fails when the target moves"
topic: patch-a-private-game-method-by-name
category: patching
group: internals
approaches: 7
game_types: [KSA.Program, KSA.PhysicsStates, KSA.PatchedConic, KSA.Astronomical, KSA.IViewport, KSA.IGameViewport, KSA.PhysicsBubble, KSA.KittenEva, KSA.GroundClutterPlacementData, KSA.Controller, KSA.OrbitController, KSA.FlyController]
lifecycle: [startup:immediate-load, startup:all-mods-loaded, frame:viewports, frame:celestials, frame:pre-render, physics:vehicle-solver]
demonstrated_by: [mods/ksa-aircrafthud/features/always-on-onframeeditor-hook, mods/ksarmory/features/dual-hook-simulation-step, mods/ksagolf/features/dual-hook-frame-stepping, mods/ksagolf/features/degrading-harmony-patches, mods/ksaero/features/computedrag-call-site-transpiler, mods/ksa-advancedflightcomputer/features/validated-reflection-handles, mods/compendium/features/orbit-line-visibility-and-color, mods/ohmystars/features/attitude-mode-handoff-patches, mods/ksastructures/features/ground-clutter-exclusion-zones, mods/unscience/features/camera-controller-override-camera-animations]
tags: [harmony, private-method, accesstools, targetmethods, field-injection, overload, byref]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:37:56Z }
repos:
  - name: KSA_AircraftHUD
    git: https://github.com/uriahgnu/KSA_AircraftHUD.git
    ref: 4e4c71719a8355afb1fc608f54d531676bec4ef3
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: Compendium
    git: https://github.com/meow-sci/Compendium.git
    ref: 62cfbe7aafabc58cf71f7c6d618d0c5ece7c504c
  - name: OhMyStars
    git: https://github.com/nanonestor/OhMyStars.git
    ref: 4bb602e3bfe36bcd3670b71b88bf644fe95fa407
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsstates
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsStates.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs
    title: "KSA.PhysicsStates (decompiled, build 2026.10.10.5554)"
  - id: ksa-astronomical
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Astronomical.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Astronomical.cs
    title: "KSA.Astronomical (decompiled, build 2026.10.10.5554)"
  - id: ksa-physicsbubble
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PhysicsBubble.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs
    title: "KSA.PhysicsBubble (decompiled, build 2026.10.10.5554)"
  - id: ksa-groundclutterplacementdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GroundClutterPlacementData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterPlacementData.cs
    title: "KSA.GroundClutterPlacementData (decompiled, build 2026.10.10.5554)"
  - id: ksa-controller
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Controller.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Controller.cs
    title: "KSA.Controller (decompiled, build 2026.10.10.5554)"
---

A Harmony patch names its target with a type and a method. For public members the compiler checks `typeof(Vehicle)` and `nameof(Vehicle.PrepareWorker)`. KSA keeps much of its frame loop private
(`Program.OnFrameEditor`, `OnFrameCelestials`, `PhysicsBubble.ApplyMmuAttitudeTarget`), and some public names are overloaded (`Astronomical.ShouldDrawLines`, `PhysicsStates.ComputeDerivatives`), so a mod has to reach
them by string, by lookup or by parameter list. This topic shows the seven forms the pinned mods use and what each costs when a game update moves the target.

## Choosing a form

| Situation | Form | If the target moves |
|---|---|---|
| One private method, the patch is the feature | `[HarmonyPatch("Name")]` on a class with `[HarmonyPatch(typeof(T))]`, applied by `PatchAll` ([HarmonyPatch attribute with a string method name, applied by PatchAll](patch-a-private-game-method-by-name-1.md)) | Harmony throws at patch time; `PatchAll` stops at that class |
| An optional hook with a fallback | `AccessTools.Method` yourself, null means log and degrade ([Manual AccessTools lookup with a degrade path when the method is gone](patch-a-private-game-method-by-name-2.md)) | One logged line, the mod keeps working |
| Several overloads, or `in`/`ref`/`out` parameters | Explicit parameter array with `MakeByRefType()` ([Explicit parameter arrays with MakeByRefType for overloaded and by-reference targets](patch-a-private-game-method-by-name-3.md)) | A changed signature gives null; a new overload cannot hijack the lookup |
| Public overloaded method, attribute form | List the parameter types; they bind by assignability ([Attribute argument types that bind by assignability](patch-a-private-game-method-by-name-4.md)) | A new, more specific overload silently changes the target |
| Several private static methods, one prefix | `TargetMethods()` and `object[] __args` ([TargetMethods with per-name AccessTools lookups and the __args array](patch-a-private-game-method-by-name-5.md)) | Missing names are skipped; all missing throws |
| You need a private field of the instance | `___field` parameter (underscores plus the field's own name) ([Reading a private instance field with a triple-underscore parameter](patch-a-private-game-method-by-name-6.md)) | Throws at patch time naming the missing field |
| You need a value the instance already exposes | `__instance` and a public member ([Prefer __instance and a public member over a field injector that matches nothing](patch-a-private-game-method-by-name-7.md)) | No private-name coupling |

## Engine background

Harmony resolves every attribute-based target to a `MethodBase` when the patch is applied. For private members the lookup is `AccessTools`, which ignores visibility, and it returns null for a missing
member or throws `AmbiguousMatchException` for a name-only lookup over several overloads (a local test with Lib.Harmony 2.4.2, [Explicit parameter arrays with MakeByRefType for overloaded and by-reference targets](patch-a-private-game-method-by-name-3.md)). The relevant game types:

| Type | Member | Why it matters |
|---|---|---|
| `Program` | private `OnFrameEditor(double)`, `OnFrameCelestials(double)` | Per-frame phases outside the `if (DrawUI)` guards ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2260-L2273)[^ksa-program], [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2567-L2578), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2701)) |
| `PhysicsStates` | static `ComputeDerivatives` with `in` parameters, plus an instance forwarder | Overloads and by-ref parameters ([current/decomp/KSA/PhysicsStates.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsStates.cs#L951-L956)[^ksa-physicsstates]) |
| `Astronomical` | three `ShouldDrawLines` overloads | Assignability binding ([current/decomp/KSA/Astronomical.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Astronomical.cs#L603)[^ksa-astronomical], [current/decomp/KSA/Astronomical.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Astronomical.cs#L612), [current/decomp/KSA/Astronomical.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Astronomical.cs#L658)) |
| `PhysicsBubble` | private static `ApplyMmuAttitudeTarget`, `ResetMmuAttitudeTarget` | Worker-thread targets ([current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L1891)[^ksa-physicsbubble], [current/decomp/KSA/PhysicsBubble.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PhysicsBubble.cs#L1950)) |
| `GroundClutterPlacementData` | private `PopulateLaunchPadExclusionZones`, private field `_celestial` | Field injection ([current/decomp/KSA/GroundClutterPlacementData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterPlacementData.cs#L44)[^ksa-groundclutterplacementdata], [current/decomp/KSA/GroundClutterPlacementData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterPlacementData.cs#L348)) |
| `Controller`, `OrbitController`, `FlyController` | public `Camera` field, virtual `OnFrame` | `__instance` instead of a field injector ([current/decomp/KSA/Controller.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Controller.cs#L12)[^ksa-controller], [current/decomp/KSA/Controller.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Controller.cs#L62)) |

Phases from [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md): installs run at `startup:immediate-load` or `startup:all-mods-loaded`; the frame hooks run in `frame:viewports` and `frame:celestials` on the main thread; the Oh My Stars targets run in
`physics:vehicle-solver` on workers.

## Approaches

| # | Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|---|
| 1 | [HarmonyPatch attribute with a string method name, applied by PatchAll](patch-a-private-game-method-by-name-1.md) | KSA_AircraftHUD | `[HarmonyPatch("OnFrameEditor")]` postfix, `PatchAll` | `startup:immediate-load`, `frame:viewports` | Shortest; a rename fails at startup |
| 2 | [Manual AccessTools lookup with a degrade path when the method is gone](patch-a-private-game-method-by-name-2.md) | KSArmory, KSAGolf | `AccessTools.Method` with null check and degrade | `startup:all-mods-loaded`, `frame:celestials` | Needs a real fallback hook and a logged `Trouble` |
| 3 | [Explicit parameter arrays with MakeByRefType for overloaded and by-reference targets](patch-a-private-game-method-by-name-3.md) | KSAero, KSA-AdvancedFlightComputer | Explicit parameter array, `MakeByRefType()` | `startup:all-mods-loaded`, `physics:vehicle-solver` | Verbose; immune to new overloads |
| 4 | [Attribute argument types that bind by assignability](patch-a-private-game-method-by-name-4.md) | Compendium | Attribute with parameter types bound by assignability | `startup:all-mods-loaded`, `frame:pre-render` | Works by accident of the binder; list the exact type |
| 5 | [TargetMethods with per-name AccessTools lookups and the __args array](patch-a-private-game-method-by-name-5.md) | Oh My Stars | `TargetMethods()` with `__args` | `startup:all-mods-loaded`, `physics:vehicle-solver` | One prefix, many methods; all missing still throws |
| 6 | [Reading a private instance field with a triple-underscore parameter](patch-a-private-game-method-by-name-6.md) | KSAStructures | `ref` array plus `____celestial` field injector | `startup:all-mods-loaded`, `startup:game-loaded` | No reflection in the patch; couples to a private field name |
| 7 | [Prefer __instance and a public member over a field injector that matches nothing](patch-a-private-game-method-by-name-7.md) | unscience | `__instance` and a public member | `startup:all-mods-loaded`, `frame:viewports` | Avoids the private name; shows the failure it replaced |

## See also

- [HarmonyPatch attribute with a string method name, applied by PatchAll](patch-a-private-game-method-by-name-1.md) for the simplest form, and [Manual AccessTools lookup with a degrade path when the method is gone](patch-a-private-game-method-by-name-2.md) for the version that survives a rename
- [Reading, writing and calling private game members](../call-private-game-members-through-reflection-and-delegates/overview.md) for reading and calling private members from code that is not a patch
- [Writing a Harmony transpiler for a KSA method](../../transpilers/write-a-harmony-transpiler/overview.md) and [Skipping Harmony prefixes](../../harmony/skip-the-original-method-with-a-prefix/overview.md) for what to do once the target is attached
- [Harmony finalizers, cleanup and scoped overrides](../../harmony/run-cleanup-or-recover-from-exceptions-with-a-finalizer/overview.md) and [Removing Harmony patches safely at runtime and at exit](../../safety/remove-your-patches-safely-at-runtime-and-at-exit/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the frame phases named above
- Related topics: draw-ui-while-the-hud-is-hidden, draw-a-predicted-trajectory-and-map-markers, exclude-or-replace-ground-clutter
- [Keep mod UI and per-frame work running when the HUD is hidden (F2)](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md) - related topic
- [Draw a predicted trajectory and markers in the map view, and control orbit lines](../../../flight-and-orbits/map-view/draw-a-predicted-trajectory-and-map-markers/overview.md) - related topic
- [Keep grass, rocks and trees off a custom site, and replace or preserve a planet's ground clutter](../../../celestials/terrain/exclude-or-replace-ground-clutter/overview.md) - related topic

[^ksa-program]: KSA.Program (decompiled, build 2026.10.10.5554)
[^ksa-physicsstates]: KSA.PhysicsStates (decompiled, build 2026.10.10.5554)
[^ksa-astronomical]: KSA.Astronomical (decompiled, build 2026.10.10.5554)
[^ksa-physicsbubble]: KSA.PhysicsBubble (decompiled, build 2026.10.10.5554)
[^ksa-groundclutterplacementdata]: KSA.GroundClutterPlacementData (decompiled, build 2026.10.10.5554)
[^ksa-controller]: KSA.Controller (decompiled, build 2026.10.10.5554)
