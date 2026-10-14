---
type: How-To
title: Own and budget surface dust emitters
description: Emit bounded body-fixed dust bursts with a private native particle definition,
  immutable spawn tuning and explicit ownership through delayed reclamation
topic: spawn-particle-effects
category: rendering
group: lights-and-particles
approach: 4
difficulty: advanced
prerequisites:
  - C# and .NET 10
  - StarMap 0.3.6 and Harmony 2.4.2
  - KSA 2026.10.10.5554 reference assemblies
demonstrated_by:
  - mods/blasto/features/owned-surface-dust-emitters
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
tags:
  - rendering
  - blasto
  - harmony-postfix
  - native-particles
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:54:13Z
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
  - id: ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    title: "ksa-game-assemblies: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: "ksa-game-assemblies: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs"
  - id: ksa-game-assemblies-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "ksa-game-assemblies: current/decomp/KSA/Program.cs"
  - id: blasto-blasto-gamemod-effects-landingdust-cs
    repo: blasto
    path: Blasto.GameMod/Effects/LandingDust.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs
    title: "blasto: Blasto.GameMod/Effects/LandingDust.cs"
  - id: blasto-blasto-gamemod-simulation-blastsimulation-cs
    repo: blasto
    path: Blasto.GameMod/Simulation/BlastSimulation.cs
    resource: https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs
    title: "blasto: Blasto.GameMod/Simulation/BlastSimulation.cs"
---

Use this approach for short surface dust bursts that should use the game’s volumetric renderer without editing its stock impact effect. Start with a StarMap/Harmony mod and a validated dry-surface hit containing center, tangent axes, normal and radius. Port LandingDust as one owner rather than borrowing an emitter without tracking it.

## Background: how the game does it

Native ParticleSystem.InitializeEmitter registers the selected renderer and updater pipelines. ParticleEmitter interprets a BubbleFrame.Ccf origin as a body-fixed anchor and computes atmosphere response from emitter density. Opacity is a separate GPU parameter. See [current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L171-L256)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs], [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L439-L476)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs] and [current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L353-L378)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs].

## Lifecycle and timing

Create and maintain owned handles in frame:apply-solvers, before next vehicle dispatch. Native Program.OnPreRender calls ParticleSystem.UpdateEmitters on the main thread (frame:pre-render), which invokes the burst callback synchronously. This differs from the upstream comment describing a particle worker. Native render work uploads parameters and executes GPU updates before particle drawing. See [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2408-L2420)[^ksa-game-assemblies-current-decomp-ksa-program-cs], [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L525-L621)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs] and [current/decomp/KSA.Rendering.Particles/ParticleSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs#L291-L350)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs].

See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the complete phase order.

## Steps

1. **Create a private bounded particle definition.** Reuse only the stock PlanetImpact child sphere mesh, then build a fresh ParticleEmitterReference. Choose volumetric rendering, burst mode, a 32-particle limit and movement/growth/model-matrix/age updaters:

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L97-L125
// ...
        }
    }
    private static ParticleEmitterReference CreateReference()
    {
        // Reuse only the native sphere mesh; do not fire or mutate the impact/debris effect.
        var native = ModLibrary.Get<ParticleEmitterReference>("PlanetImpact").Get();
        var mesh = native.ParticleEmitters.Count > 0 ? native.ParticleEmitters[0]?.Get().Mesh : null;
        if (mesh is null) throw new InvalidOperationException("Native dust sphere mesh missing.");
        return new ParticleEmitterReference
        {
            Mesh = mesh, MaxParticles = new IntegerReference(32), SpawnMode = EmitterSpawnMode.Burst,
            Renderer = ParticleEmitterReference.ParticleRenderer.Volumetric,
            Updaters = new List<ParticleEmitterReference.ParticleUpdater?>
            {
                ParticleEmitterReference.ParticleUpdater.SimpleMovement,
                ParticleEmitterReference.ParticleUpdater.GrowOverLifetime,
                ParticleEmitterReference.ParticleUpdater.ModelMatrix,
                ParticleEmitterReference.ParticleUpdater.Age
            },
            // Density drives native buoyancy, not optical thickness. Mineral grains should retain
            // nearly full gravity in an atmosphere rather than behave like low-density smoke.
            Density = 2700f, Drag = .3f, InheritVelocity = new BoolReference(false),
            VehicleIsParent = new BoolReference(false), EmitterRelative = new BoolReference(false),
            ParticleLifespan = new Vector2Reference(new float2(1.6f, 3.1f)),
            ParticleSize = new Vector2Reference(new float2(.2f, .65f)),
            EmitterExtra = new Vector4Reference(new float4(.1f, 0, 0, 4)),
            ParticleColor = new Vector4Reference(new float4(.52f, .51f, .49f, 1))
        };
    }
// ...
```
The mineral density controls buoyancy/gravity, not optical thickness. Do not mutate the referenced stock effect.

2. **Gate and budget acquisition before touching the pool.** Keep a 12-emitter ownership cap, particle-setting check, per-8 m-cell cooldown and pressure threshold. Rock response skips dust. Acquire only when the native system exists:

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L36-L50
// ...
    public void Emit(Celestial body, SurfaceHit hit, double thrust, double dt, double epoch)
    {
        if (!Enabled || _failed || !GameSettings.Current.Graphics.Particles || _owned.Count >= 12 || dt <= 0) return;
        var key = (body.Id, (long)Math.Floor(hit.CenterCcf.X / 8), (long)Math.Floor(hit.CenterCcf.Y / 8), (long)Math.Floor(hit.CenterCcf.Z / 8));
        if (_lastEmission.TryGetValue(key, out double last) && epoch - last < .12) return;
        double erosionRate = Math.Max(thrust * hit.Incidence / (Math.PI * hit.Radius * hit.Radius) - ErosionThreshold, 0);
        if (erosionRate < 5 || hit.Profile == SurfaceKind.Rock) return;
        ParticleEmitter<ParticleUpdateData, ParticleRenderData>? emitter = null;
        try
        {
            var system = Program.Instance?.ParticleSystem;
            if (system is null) return;
            _reference ??= CreateReference();
            if (!system.EmitterPool.Get(1, out var acquired)) return;
            emitter = acquired[0];
// ...
```
This is a resource budget, not a measured frame-time bound.

3. **Initialize a celestial anchor and separate optical tuning.** Set astronomical context, clear vehicle/part context, use zero body-fixed velocity and identity LocalOffset. Density and opacity must remain independent:

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L51-L66
// ...
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
// ...
```
Spawn position and velocity are already expressed in tangent/normal directions. Copy the immutable speed/size snapshots and native callback from [Blasto.GameMod/Effects/LandingDust.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs#L67-L85)[^blasto-blasto-gamemod-effects-landingdust-cs]. This preserves a pending burst’s settings even if the UI changes later.

4. **Register and retain the handle until native reclamation.** Add the handle to the celestial and your ownership list, then update opacity and kill expired/disabled emitters without immediately reacquiring them:

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L126-L139
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
        if (_lastEmission.Count > 256) _lastEmission.Clear();
    }
```
Registration is performed in [Blasto.GameMod/Effects/LandingDust.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs#L86-L96)[^blasto-blasto-gamemod-effects-landingdust-cs]. Native Kill marks spawning complete and shortens decay; TryUnregisterEmitter waits a MaxFramesInFlight countdown before reset invalidates the handle. See [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L370-L403)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs] and [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L647-L664)[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs].

5. **Clear ownership before the native scene is destroyed.** Kill and unregister every owned handle; clear cooldowns and the private reference:

```csharp
// Blasto.GameMod/Effects/LandingDust.cs L140-L149
    public void Clear()
    {
        foreach (var owned in _owned)
        {
            owned.Handle.TryGet()?.Kill();
            owned.Body.RemoveEmitter(owned.Handle);
        }
        _owned.Clear(); _lastEmission.Clear(); _reference = null; _failed = false;
    }
    public void Dispose() => Clear();
```
Call this from the joined scene-reset or game-dispose path. Emit dust independently before persistent mark deposition, so zero buildup need not disable dust: [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L152-L158)[^blasto-blasto-gamemod-simulation-blastsimulation-cs].

## Complete example

The complete implementation is [Blasto.GameMod/Effects/LandingDust.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Effects/LandingDust.cs#L12-L151)[^blasto-blasto-gamemod-effects-landingdust-cs], called by the apply consumer in [Blasto.GameMod/Simulation/BlastSimulation.cs](https://github.com/meow-sci/blasto/blob/21f7657c42534774001acabcf93289e9412c5242/Blasto.GameMod/Simulation/BlastSimulation.cs#L123-L178)[^blasto-blasto-gamemod-simulation-blastsimulation-cs]. A qualifying dry non-rock hit should create short native bursts; initialization failure logs once and disables this dust owner until reset.

## Variations and gotchas

Kill is not immediate pool reclamation and does not wait on an emitter-specific fence. Keep handles owned while native retirement is pending. The overall effect switch stops new samples; the separate dust switch governs already-owned emitters. Existing particles keep their original size/velocity, while active opacity changes on the next owner tick. Dust is transient and excluded from saves. This source-derived recipe still needs live appearance and performance validation.

When the global particles graphics setting is off, native `ParticleSystem.UpdateEmitters` returns before ticking emitters. Retirement countdowns therefore pause too, even if the owner calls `Kill`; do not treat a still-valid handle as evidence that a burst remains visible or reuse it early.[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs]

## See also

- [Compare approaches](overview.md)
- [Owned surface dust emitters](../../../../mods/blasto/features/owned-surface-dust-emitters.md)
- [Approach 1: XML ParticleEmitter assets taken by id from the engine pool](spawn-particle-effects-1.md)
- [Approach 2: ParticleEmitterReference built in C# with SpawnMode.Burst](spawn-particle-effects-2.md)
- [Approach 3: ExplosionSystem presets with a body-fixed origin](spawn-particle-effects-3.md)

[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particlesystem-cs]: ksa-game-assemblies: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs.
[^ksa-game-assemblies-current-decomp-ksa-rendering-particles-particleemitter-cs]: ksa-game-assemblies: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs.
[^ksa-game-assemblies-current-decomp-ksa-program-cs]: ksa-game-assemblies: current/decomp/KSA/Program.cs.
[^blasto-blasto-gamemod-effects-landingdust-cs]: blasto: Blasto.GameMod/Effects/LandingDust.cs.
[^blasto-blasto-gamemod-simulation-blastsimulation-cs]: blasto: Blasto.GameMod/Simulation/BlastSimulation.cs.
