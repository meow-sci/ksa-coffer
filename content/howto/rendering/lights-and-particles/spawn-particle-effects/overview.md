---
type: Game Feature
title: Spawn particle effects and explosions from a mod
description: Take emitters from the engine's fixed pool, either from XML-declared ParticleEmitter
  assets or built in C#, anchor them, return them correctly, and fire the game's own explosion
  presets where no vehicle hosts the burst
topic: spawn-particle-effects
category: rendering
group: lights-and-particles
approaches: 4
game_types:
  - KSA.Rendering.Particles.ParticleEmitter
  - KSA.Rendering.Particles.ParticleEmitterReference
  - KSA.Rendering.Particles.ParticleSystem
  - KSA.ExplosionSystem
  - KSA.BubbleOrigin
  - KSA.Celestial
lifecycle:
  - startup:asset-load
  - frame:viewports
  - frame:pre-render
  - render:particles
  - frame:apply-solvers
  - frame:render
demonstrated_by:
  - mods/ksarmory/features/pooled-particle-emitters
  - mods/gatos/features/face-particle-bursts
  - mods/ksarmory/features/ksa-explosions-from-a-point
  - mods/blasto/features/owned-surface-dust-emitters
tags:
  - particles
  - emitters
  - explosions
  - pool
  - bubble-origin
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:46:49Z
status: stable
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: g-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: g-current-decomp-ksa-rendering-particles-particleemitterreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitterReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitterReference.cs
    title: KSA.Rendering.Particles.ParticleEmitterReference (decompiled, build 2026.10.10.5554)
  - id: g-current-decomp-ksa-rendering-particles-particlesystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    title: KSA.Rendering.Particles.ParticleSystem (decompiled, build 2026.10.10.5554)
  - id: blasto-integration-spawn-particle-effects
    repo: blasto
    path: Blasto.GameMod/Effects/LandingDust.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs
    title: Blasto Own and budget surface dust emitters
---
KSA's particle system is a single `ParticleSystem<ParticleUpdateData, ParticleRenderData>` constructed with 1024 emitters of 512 particles ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L1169)). Everything that spawns particles in the game, from vehicle exhaust to explosions to ice debris, takes emitters from that one pool, so a mod's responsibilities are small but strict: acquire all-or-nothing, anchor correctly, tune, and return what you hold.

## Engine background

- **Emitter references.** `ParticleEmitterReference` [current/decomp/KSA.Rendering.Particles/ParticleEmitterReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitterReference.cs#L8-L120) is both an XML asset (`<ParticleEmitter Id=...>`, registered in `ModLibrary`) and a plain object you can build in C#. Trees of nested emitters cost one pool slot per node.
- **Acquire and initialize.** `ParticleSystem.GetAndInitializeEmitters(id, out handles)` and `EmitterPool.Get(n, out emitters)` plus `InitializeEmitter(emitter, reference)` ([current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L24-L54)). `EmitterSpawnMode` is `None`, `Burst`, `OverTime` or `Endless`; only `Endless` needs a `Kill()` before it is returned.
- **Anchoring.** `emitter.Origin` is a `BubbleOrigin`: a time, a parent, a frame (`Ccf` body-fixed) and a position and velocity. Vehicle-hosted effects take `vehicle.BubbleOrigin` and a `LocalOffset` in the assembly frame.
- **Timeline.** `Program.OnPreRender` spawns (`vehicle.SpawnParticles`, `ExplosionSystem.Update`, `ParticleSystem.UpdateEmitters`) with `dt = Universe.GetNextSimStep().DeltaTime` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2408-L2418)); the GPU update and draw are recorded in `RenderGame` (`render:particles`, rows 10 and 14 of the [RenderGame table](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence)). All of it is skipped if the player's particles graphics setting is off.
- **Explosions.** `ExplosionSystem.SpawnPreset(id, in ExplosionContext)` fires an `<Explosion>` preset (flash, sound, emitter and volume stages) at an anchor; main thread only.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: XML emitter assets by id](spawn-particle-effects-1.md) | KSArmory | `pooled-resource`: acquire, re-anchor each frame on a celestial, `Kill()` then give back | `startup:asset-load`, `frame:draw-ui`, `frame:pre-render` | Designer-friendly assets and held effects that follow a mod-simulated object; strict give-back discipline |
| [2: ParticleEmitterReference built in C#](spawn-particle-effects-2.md) | gatOS | `particle-emitter`: pool `Get(1)`, `InitializeEmitter`, vehicle `BubbleOrigin`, `Burst` | `frame:viewports`, `frame:pre-render` | No assets and self-returning bursts; vehicle-anchored only and look is hand-authored in code |
| [3: ExplosionSystem presets with a body-fixed origin](spawn-particle-effects-3.md) | KSArmory | `engine-explosion-preset`: `ExplosionContext` with `BubbleFrame.Ccf` anchor and real ambient pressure | `frame:draw-ui` | Full stock explosion with sound and volumes at any point; main thread only, preset chosen by size |
| [Own and budget surface dust emitters](spawn-particle-effects-4.md) | Blasto | harmony-postfix, native-particles | frame:apply-solvers, frame:pre-render, frame:render, render:particles | Private volumetric dust using native rendering; bounded ownership and explicit retirement handling add lifecycle work |


Blasto adds dry-surface bursts with separate physical density and optical opacity, a per-cell cooldown, fixed budgets and owned handles retained through native retirement. Its spawn callback runs on the main thread during native pre-render updates. See [Blasto.GameMod/Effects/LandingDust.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs).[^blasto-integration-spawn-particle-effects]

## See also

- [Draw volumetric exhaust plumes and smoke trails without a real engine](../draw-exhaust-plumes-without-an-engine/overview.md)
- [Choose a render frame and anchor effects to bodies, parts and terrain](../../overlays/choose-a-render-frame-and-anchor-effects/overview.md)
- [Add dynamic spot and point lights to the world from a mod](../add-dynamic-lights-to-the-world/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)

[^blasto-integration-spawn-particle-effects]: Blasto integration source.
