---
type: Game Feature
title: Draw volumetric exhaust plumes and smoke trails without a real engine
description: Reuse the game's volumetric exhaust renderer for flames from a mod-owned thrust source by building VolumetricExhaustInstances and plume data yourself, edit the shared templates live and lay volumetric smoke trails behind projectiles and flares
topic: draw-exhaust-plumes-without-an-engine
category: rendering
group: lights-and-particles
approaches: 5
game_types: [KSA.VolumetricExhaustInstance, KSA.VolumetricExhaustRenderer, KSA.PlumeData, KSA.RocketNozzle, KSA.Vehicle, KSA.VolumetricExhaustTemplate, KSA.VolumetricTrailRenderer, KSA.PlumeTrailEmitterState]
lifecycle: [frame:pre-render, render:exhaust, frame:draw-ui, frame:celestials, render:atmosphere]
demonstrated_by: [mods/ksacars/features/exhaust-plumes-without-engine, mods/unscience/features/pyro-volumetric-exhaust-plumes, mods/unscience/features/pyro-isentropic-nozzle-model, mods/unscience/features/pyro-exhaust-template-editor, mods/gatos/features/fx-editor-reflection, mods/ksarmory/features/trail-renderer-smoke]
tags: [exhaust, plume, volumetric, smoke, trail, nozzle]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:39:02Z }
status: stable
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: g-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-volumetricexhaustrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VolumetricExhaustRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VolumetricExhaustRenderer.cs
    title: "KSA.VolumetricExhaustRenderer (decompiled, build 2026.10.10.5554)"
  - id: g-current-decomp-ksa-plumedata-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PlumeData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlumeData.cs
    title: "KSA.PlumeData (decompiled, build 2026.10.10.5554)"
---
KSA draws rocket flames with a raymarched volumetric renderer fed by `VolumetricExhaustInstance`s, and long smoke trails with a second volumetric renderer fed by `PlumeTrailEmitterState` cursors. Both are driven from real `RocketNozzle` modules inside `Program.OnPreRender`. A mod with no engine part (a car, a prop, a firework, a missile it simulates itself) cannot use a real nozzle: with no propellant it has no plume, any flow pushes the craft, and a nozzle with no rocket crashes the stock code. But both renderers expose public submission methods, so the mod builds the instances itself and submits them at the right moment.

## Engine background

- **Flames.** `Program.OnPreRender` [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2372-L2391) calls `_volumetricExhaustRenderer.UpdateFrameData()` (empties the instance list), `BeginPlumeGrouping()`, `vehicle.AddVolumetricExhaustInstances(camera, renderer, dtPlayer)` per vessel, `EndPlumeGrouping()`; `RenderGame` draws them in the exhaust pass (`render:exhaust`, main view only). `AddInstance(VolumetricExhaustInstance, bendTarget, axialFade, diamondFade)` submits one flame directly ([current/decomp/KSA/VolumetricExhaustRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VolumetricExhaustRenderer.cs#L842-L845)).
- **Shape.** `PlumeData` [current/decomp/KSA/PlumeData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PlumeData.cs#L80-L121) is derived by `PlumeData.Compute` from the gas state and ambient pressure; engines get it from `RocketNozzle.ComputePlumeData`. The caller owns `VolumetricExhaustInstance.LastPlumeData` and calls `UpdateState` each frame.
- **Templates.** `VolumetricExhaustTemplate` objects (registry `References`, lookup `Get(id)`) are shared by every plume that uses them; `OnSettingsChanged()` and `RecomputeVolumetricExhaustLimits` refresh per-instance copies.
- **Trails.** `OnPreRender` then prepares, collects and finalizes plume-trail segments ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2392-L2403)); `VolumetricTrailRenderer.SubmitEmitter` is public, the renderer field on `Program` is private.
- See rows 21 and 22 of [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#per-frame-sequence) and RenderGame rows 12 and 13.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: template-based instances with ComputePlumeData](draw-exhaust-plumes-without-an-engine-1.md) | KSACars | `harmony-postfix` on `Vehicle.AddVolumetricExhaustInstances`, mod-made gas numbers | `frame:pre-render`, `render:exhaust` | Simple, matches KSA's own debug path; the shape does not depend on altitude except through the gas you invent |
| [2: isentropic nozzle model](draw-exhaust-plumes-without-an-engine-2.md) | unscience (Pyro) | same hook, exit Mach from area ratio, `PlumeData.Compute` | `frame:pre-render`, `render:exhaust` | Plume reacts to ambient pressure and throttle; ideal-gas model without flow separation |
| [3: shared template editor](draw-exhaust-plumes-without-an-engine-3.md) | unscience (Pyro) | `reflection` on `References`, propagate to instances and nozzles | `frame:draw-ui`, `render:exhaust` | Live look tuning for every plume; global per template, save hygiene needed |
| [4: reflect into private editor fields](draw-exhaust-plumes-without-an-engine-4.md) | gatOS | `reflection`, replay the editors' apply sequence, pristine reset | `frame:viewports`, `frame:draw-ui` | Scriptable exhaust, trail and cloud settings; most churn-prone bindings |
| [5: PlumeTrailEmitterState per source](draw-exhaust-plumes-without-an-engine-5.md) | KSArmory | `volumetric-trail-emitter`, one reflected field | `frame:draw-ui`, `frame:pre-render`, `render:atmosphere` | Minutes-long volumetric smoke; global look tuning, camera's nearby body only |

## See also

- [Spawn particle effects and explosions from a mod](../spawn-particle-effects/overview.md)
- [Add dynamic spot and point lights to the world from a mod](../add-dynamic-lights-to-the-world/overview.md)
- [Choose a render frame and anchor effects to bodies, parts and terrain](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
