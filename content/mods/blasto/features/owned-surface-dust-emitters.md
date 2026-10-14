---
type: Mod Feature
title: Owned surface dust emitters
description: Create bounded native volumetric particle bursts anchored to a celestial surface with
  explicit handle ownership and separate optical tuning
mod: blasto
category: rendering
tags:
  - blasto
  - rendering
  - harmony-postfix
  - native-particles
techniques:
  - harmony-postfix
  - native-particles
game_types:
  - KSA.Rendering.Particles.ParticleEmitterReference
  - KSA.Rendering.Particles.ParticleSystem
  - KSA.Celestial
  - KSA.BubbleOrigin
lifecycle:
  - frame:apply-solvers
  - frame:pre-render
  - frame:render
  - render:particles
hooks:
  - harmony-postfix KSA.Universe.ApplyVehicleSolvers
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:37:06Z
status: stable
repos:
  - name: blasto
    git: git@github.com:meow-sci/blasto.git
    ref: 21f7657c42534774001acabcf93289e9412c5242
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: dust
    repo: blasto
    path: Blasto.GameMod/Effects/LandingDust.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs
    title: Private emitter definition, CCF anchoring, budgets and cleanup
  - id: simulation
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: Emission independent from persistent deposition
  - id: native-emitter
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: Body-fixed origin and density-dependent gravity
  - id: params
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    title: Native GPU opacity parameter upload
  - id: ownership
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: Celestial emitter registration
  - id: kill
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: Kill marks spawning complete and ends decay
  - id: program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Main-thread creation before next worker dispatch
  - id: native-spawn
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: Main-thread emitter updates before frame acquisition
  - id: spawn-callback
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: Synchronous spawn callback invocation
  - id: reclaim
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: Deferred emitter reset counted in frames in flight
  - id: particle-update
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    title: Native emitter iteration and GPU particle update scheduling
---

Dust uses KSA's native volumetric particle renderer, but the emitter configuration and handles belong to Blasto. Only the stock impact effect's sphere mesh is reused; the stock particle definition is not edited or fired.[^dust]

## How it works

Gate emission on the game's particle setting, dry non-rock response, pressure threshold, a short per-cell cooldown and a 12-emitter ownership budget. Create a private burst reference capped at 32 particles with movement, growth, model-matrix and age updaters.[^dust]

Acquire and initialize a native emitter, attach its context to the celestial, clear vehicle/part context and set a zero-velocity `BubbleOrigin` in `BubbleFrame.Ccf`. Spawn offsets and velocities are already expressed in the surface tangent frame; keep the local offset identity. Snapshot size/speed tuning before the native spawn callback uses it.[^dust][^native-emitter]

Mineral density 2,700 controls buoyancy and gravity response, while `Opacity` controls optical thickness through native GPU emitter parameters. Active opacity can change; existing particles retain their original size and velocity. Emit dust before attempting mark deposition, allowing dust when persistent buildup is zero.[^dust][^params][^simulation]

Register the handle on the body and retain ownership after `Kill` until the native handle becomes invalid; then remove the registration. Scene reset explicitly kills and unregisters every owned handle.[^dust][^ownership][^kill]

## Lifecycle and timing

Creation and ownership maintenance run in `frame:apply-solvers`, before the next vehicle-worker dispatch. Later, `Program.OnPreRender` calls `ParticleSystem.UpdateEmitters` on the main thread, before frame acquisition. That loop calls `ParticleEmitter.Update`, which invokes the burst spawn callback synchronously; the upstream comment describing a particle worker does not match this pinned engine path. Captured per-burst values still keep subsequent UI changes from changing a pending burst.[^program][^native-spawn][^spawn-callback][^particle-update]

Native render work uploads emitter parameters and dispatches GPU particle updates, then draws the volumetric particles; Blasto does not record a separate Vulkan particle pass.[^params][^particle-update]

## Key code

| Path | Role |
|---|---|
| [Blasto.GameMod/Effects/LandingDust.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs#L28-L149) | Private emitter definition, CCF anchoring, budgets and cleanup[^dust] |
| [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L132-L158) | Emission independent from persistent deposition[^simulation] |
| [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L439-L476) | Body-fixed origin and density-dependent gravity[^native-emitter] |
| [current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L353-L378) | Native GPU opacity parameter upload[^params] |
| [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L252-L260) | Celestial emitter registration[^ownership] |
| [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L647-L664) | Kill marks spawning complete and ends decay[^kill] |
| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2153-L2222) | Main-thread creation before next worker dispatch[^program] |

| [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2408-L2420) | Main-thread emitter updates before frame acquisition[^native-spawn] |

| [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L525-L621) | Synchronous spawn callback invocation[^spawn-callback] |

| [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L370-L403) | Deferred emitter reset counted in frames in flight[^reclaim] |

| [current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L291-L350) | Native emitter iteration and GPU particle update scheduling[^particle-update] |

## Snippets

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L51-L66
            system.InitializeEmitter(emitter, _reference);
            emitter.Context.Astronomical = body;
            emitter.Context.Vehicle = null;
            emitter.Context.Part = null;
            emitter.Origin = new BubbleOrigin
            {
                Parent = body, Time = Universe.GetElapsedTime(), BubFrame = BubbleFrame.Ccf,
                PositionBub = SurfaceProbe.ToNative(hit.CenterCcf), VelocityBub = double3.Zero
            };
            emitter.LocalOffset = float4x4.Identity;
            emitter.SpawnRate = (float)Math.Clamp(4 + erosionRate * .006, 4, 32);
            emitter.Drag = hit.Profile == SurfaceKind.Martian ? 1.6f : .3f;
            // Native screenspace volumetrics read GpuEmitterParams.Opacity, multiplied by particle
            // color alpha and a lifetime fade. Extra.z is not an opacity channel in this build.
            float baseOpacity = hit.Profile == SurfaceKind.Martian ? .42f : .24f;
            emitter.Opacity = (float)(baseOpacity * OpacityMultiplier);
```

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L126-L137
    public void Tick(double epoch)
    {
        for (int i = _owned.Count - 1; i >= 0; i--)
        {
            var owned = _owned[i];
            var emitter = owned.Handle.TryGet();
            if (emitter is null)
            { owned.Body.RemoveEmitter(owned.Handle); _owned.RemoveAt(i); continue; }
            emitter.Opacity = (float)(owned.BaseOpacity * OpacityMultiplier);
            if (!Enabled || epoch > owned.Expires) emitter.Kill();
            // Keep ownership until native fenced cleanup invalidates the handle; do not reacquire early.
        }
```

## Game APIs touched

`ParticleSystem.InitializeEmitter` installs the private reference; `Celestial.AddEmitter`/`RemoveEmitter` maintain body registration. `ParticleEmitter` interprets CCF origins and computes gravity scaling from density, while the GPU parameter writer copies emitter opacity.[^dust][^ownership][^native-emitter][^params]

## Pitfalls and version notes

Twelve emitters and 32 particles each are budgets, not measured frame-time guarantees. `Kill` is not synchronous pool reclamation. Native `TryUnregisterEmitter` waits a countdown based on `MaxFramesInFlight` before resetting the emitter and invalidating its handle; it does not wait on an emitter-specific fence.[^reclaim] Turning off the overall effect stops new sampling; the separate dust switch controls existing owned emitters. Dust is transient and never serialized. Native 0.1.3 particle tuning still needs live validation.

## See also

- [Terrain plume intersection](terrain-plume-intersection.md)
- [Scene reset and native cleanup](scene-reset-and-native-cleanup.md)
- [Live effect tuning and input](live-effect-tuning-and-input.md)
- [Own and budget surface dust emitters](../../../howto/rendering/lights-and-particles/spawn-particle-effects/spawn-particle-effects-4.md) - how-to article demonstrating this feature

[^dust]: Private emitter definition, CCF anchoring, budgets and cleanup.
[^simulation]: Emission independent from persistent deposition.
[^native-emitter]: Body-fixed origin and density-dependent gravity.
[^params]: Native GPU opacity parameter upload.
[^ownership]: Celestial emitter registration.
[^kill]: Kill marks spawning complete and ends decay.
[^program]: Main-thread creation before next worker dispatch.


[^native-spawn]: Main-thread emitter updates before frame acquisition.

[^spawn-callback]: Synchronous spawn callback invocation.

[^reclaim]: Deferred emitter reset counted in frames in flight.

[^particle-update]: Native emitter iteration and GPU particle update scheduling.
