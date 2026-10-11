---
type: Game Feature
title: Choose a render frame and anchor effects to bodies, parts and terrain
description: Ecl positions keep the 29.8 km/s orbital carrier while ego positions are camera-relative translations, so picking the right frame and sample instant keeps overlays, effects and decals on the craft, planet or part they belong to
topic: choose-a-render-frame-and-anchor-effects
category: rendering
group: overlays
approaches: 6
game_types: [KSA.Camera, KSA.Vehicle, KSA.GizmosRenderer, KSA.PartModel, KSA.Celestial, KSA.ExplosionSystem, KSA.ParticleEmitter, KSA.StaticMeshRenderable, KSA.Part, KSA.PartTree]
lifecycle: [frame:draw-ui, frame:apply-solvers, frame:render, frame:celestials, frame:pre-render]
demonstrated_by: [mods/ksagolf/features/frame-epoch-draw-anchor, mods/ksarmory/features/gizmo-world-overlays, mods/ksarmory/features/rounds-as-hidden-launcher-subparts, mods/ksarmory/features/ksa-explosions-from-a-point, mods/ksarmory/features/pooled-particle-emitters, mods/ksagolf/features/mod-mesh-draw-hook, mods/unscience/features/graffiti-decal-anchoring]
tags: [ecl, ego, ccf, anchor, reference-frames, epoch, overlays, particles]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-bubbleframe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BubbleFrame.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BubbleFrame.cs
    title: "KSA.BubbleFrame (decompiled, build 2026.10.10.5554)"
  - id: ksa-bubbleorigin-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/BubbleOrigin.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/BubbleOrigin.cs
    title: "KSA.BubbleOrigin (decompiled, build 2026.10.10.5554)"
  - id: ksa-camera-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Camera.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs
    title: "KSA.Camera (decompiled, build 2026.10.10.5554)"
  - id: ksa-celestial-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Celestial.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs
    title: "KSA.Celestial (decompiled, build 2026.10.10.5554)"
  - id: ksa-explosioncontext-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ExplosionContext.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ExplosionContext.cs
    title: "KSA.ExplosionContext (decompiled, build 2026.10.10.5554)"
  - id: ksa-explosionsystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ExplosionSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ExplosionSystem.cs
    title: "KSA.ExplosionSystem (decompiled, build 2026.10.10.5554)"
  - id: ksa-gizmosrenderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GizmosRenderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GizmosRenderer.cs
    title: "KSA.GizmosRenderer (decompiled, build 2026.10.10.5554)"
  - id: ksa-particleemitter-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs
    title: "KSA.Rendering.Particles.ParticleEmitter (decompiled, build 2026.10.10.5554)"
  - id: ksa-particlesystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleSystem.cs
    title: "KSA.Rendering.Particles.ParticleSystem (decompiled, build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA.Program (decompiled, build 2026.10.10.5554)"
  - id: ksa-staticmeshrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticMeshRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticMeshRenderable.cs
    title: "KSA.StaticMeshRenderable (decompiled, build 2026.10.10.5554)"
  - id: ksa-supermeshrendersystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SuperMeshRenderSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs
    title: "KSA.SuperMeshRenderSystem (decompiled, build 2026.10.10.5554)"
  - id: ksa-vehicle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Vehicle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs
    title: "KSA.Vehicle (decompiled, build 2026.10.10.5554)"
  - id: ksagolf-drawanchor-cs
    repo: KSAGolf
    path: src/KSAGolf/Sim/DrawAnchor.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Sim/DrawAnchor.cs
    title: "KSAGolf/src/KSAGolf/Sim/DrawAnchor.cs"
  - id: ksagolf-golf-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/Golf.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/Golf.cs
    title: "KSAGolf/src/KSAGolf/Ksa/Golf.cs"
  - id: ksagolf-ksaworld-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/KsaWorld.cs
    title: "KSAGolf/src/KSAGolf/Ksa/KsaWorld.cs"
  - id: ksagolf-viewdrawhook-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/ViewDrawHook.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/ViewDrawHook.cs
    title: "KSAGolf/src/KSAGolf/Ksa/ViewDrawHook.cs"
  - id: ksarmory-detonation-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Detonation.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Detonation.cs
    title: "KSArmory/src/KSArmory/Ksa/Detonation.cs"
  - id: ksarmory-emitterpool-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/EmitterPool.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/EmitterPool.cs
    title: "KSArmory/src/KSArmory/Ksa/EmitterPool.cs"
  - id: ksarmory-ksarmoryassets-xml
    repo: KSArmory
    path: src/KSArmory/KSArmoryAssets.xml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryAssets.xml
    title: "KSArmory/src/KSArmory/KSArmoryAssets.xml"
  - id: ksarmory-ksarmoryparticles-xml
    repo: KSArmory
    path: src/KSArmory/KSArmoryParticles.xml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmoryParticles.xml
    title: "KSArmory/src/KSArmory/KSArmoryParticles.xml"
  - id: ksarmory-ksaworld-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KsaWorld.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KsaWorld.cs
    title: "KSArmory/src/KSArmory/Ksa/KsaWorld.cs"
  - id: ksarmory-launcherpart-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/LauncherPart.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/LauncherPart.cs
    title: "KSArmory/src/KSArmory/Ksa/LauncherPart.cs"
  - id: ksarmory-visuals-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Visuals.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Visuals.cs
    title: "KSArmory/src/KSArmory/Ksa/Visuals.cs"
  - id: ksarmory-warheadexplosion-cs
    repo: KSArmory
    path: src/KSArmory/Sim/WarheadExplosion.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/WarheadExplosion.cs
    title: "KSArmory/src/KSArmory/Sim/WarheadExplosion.cs"
  - id: unscience-decalanchors-cs
    repo: unscience
    path: graffiti.lib/DecalAnchors.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/DecalAnchors.cs
    title: "unscience/graffiti.lib/DecalAnchors.cs"
  - id: unscience-graffitisubmod-cs
    repo: unscience
    path: graffiti.lib/GraffitiSubmod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/graffiti.lib/GraffitiSubmod.cs
    title: "unscience/graffiti.lib/GraffitiSubmod.cs"
---

Every KSA position near Earth includes about 29.8 km/s of ecliptic (`Ecl`) motion, about 500 m per frame at 60 fps. `Ego` positions are camera-relative translations of `Ecl`. An overlay, effect or decal that mixes samples from different instants, or anchors in the wrong frame, lags,
jitters or drifts away from the craft, planet or part it should hug. The approaches differ in what the anchor is: the craft's rendered position, a body-fixed frame, a part-local frame.

## Engine background

- Frames: `Camera.EclToEgo` / `EgoToEcl` and `GetPositionEgo(IPosition)` [current/decomp/KSA/Camera.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Camera.cs#L223-L250); `GetPositionEgo` is how vehicle meshes are placed (followed object: `-PositionCce`; same physics bubble: physics positions; otherwise `Ecl - camera.PositionEcl`).
- `Vehicle.GetMatrixAsmb2Ego(camera)` [current/decomp/KSA/Vehicle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Vehicle.cs#L1270); body-fixed frame `Celestial.GetCce2Ccf()` / `GetCcf2Cce()` [current/decomp/KSA/Celestial.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Celestial.cs#L532-L538).
- Gizmos: `GizmosRenderer.DrawSphere` / `DrawLine` take Ego and are cleared by `ResetInstances` at the top of each frame [current/decomp/KSA/GizmosRenderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GizmosRenderer.cs#L471), [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2260).
- Effects: `ExplosionSystem.SpawnPreset` with a `BubbleOrigin` [current/decomp/KSA/ExplosionSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ExplosionSystem.cs#L217); pooled `ParticleEmitter.Origin` [current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Particles/ParticleEmitter.cs#L113); `StaticMeshRenderable.Draw` after `ClearBuckets` [current/decomp/KSA/SuperMeshRenderSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SuperMeshRenderSystem.cs#L546).
- Timing: positions are applied in `PrepareFrame` (`frame:apply-solvers`), cameras posed in `frame:viewports`, overlays drawn in `frame:draw-ui`, particles spawned in `frame:pre-render` and recorded in `frame:render`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: two-instant draw anchor](choose-a-render-frame-and-anchor-effects-1.md) | ksagolf | `Ego` from `GetPositionEgo` paired with same-instant `Ecl` | `frame:draw-ui` | Exact overlays beside a craft; every caller must follow the sampling rules |
| [2: anchor to the engine's render position, add travel](choose-a-render-frame-and-anchor-effects-2.md) | ksarmory | Ego anchor for gizmos; subpart placement from platform-relative travel | `frame:draw-ui`, `frame:render` | Matches how the craft is drawn; fixed body count, culling with the launcher |
| [3: explosion presets with a body-frame origin](choose-a-render-frame-and-anchor-effects-3.md) | ksarmory | `BubbleOrigin` in `Ccf` | `frame:draw-ui` | Stock effects anywhere; main thread only |
| [4: pooled emitters re-anchored per frame](choose-a-render-frame-and-anchor-effects-4.md) | ksarmory | Origin rewritten every frame, `Kill` before return | `frame:draw-ui`, `frame:pre-render` | Follows mod-simulated objects; shared pool, one-frame dt glitch |
| [5: body-fixed mesh at draw time](choose-a-render-frame-and-anchor-effects-5.md) | ksagolf | `ClearBuckets` postfix, `Ccf2Cce` rotation | `frame:render` | Lit and shadowed mesh on a rotating planet; per-viewport ego |
| [6: part, cloth or geodetic anchors in double](choose-a-render-frame-and-anchor-effects-6.md) | unscience | Stable ids re-resolved, double composition | `frame:draw-ui` | Survives staging, docking and floating origin; recomposed every frame |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Draw world-space lines and gizmos with the game's own renderers](../draw-world-space-lines-and-gizmos/overview.md), [Spawn particle effects and explosions from a mod](../../lights-and-particles/spawn-particle-effects/overview.md), [Draw your own meshes through the engine's mesh renderers](../../meshes/draw-mod-meshes-with-the-engine-renderers/overview.md), [Project decals onto vessels, terrain and clutter](../../textures-and-decals/project-decals-onto-scene-geometry/overview.md), [Draw a textured quad attached to a part or the camera](../../textures-and-decals/draw-a-textured-quad-in-the-world/overview.md), [Pick the vessel, part, world quad or terrain point under the cursor](../../../ui/input/pick-objects-under-the-cursor/overview.md), [Ray cast against part meshes and terrain, from the cursor or any origin](../../../physics/mod-simulation/ray-cast-against-vessel-meshes-and-terrain/overview.md)
- [Understand KSA coordinate frames and epochs (ECL, CCE, CCI, CCF, ego, body)](../../../flight-and-orbits/flight-state/understand-ksa-coordinate-frames-and-epochs/overview.md)
