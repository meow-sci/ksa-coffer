---
type: Game Feature
title: Add dynamic spot and point lights to the world from a mod
description: How runtime light submissions and browser-authored native Light modules enter KSA lighting with appropriate timing and owner transforms
topic: add-dynamic-lights-to-the-world
category: rendering
group: lights-and-particles
approaches: 4
game_types:
  - KSA.Rendering.Lighting.Light
  - KSA.Rendering.Lighting.ILightSystem
  - KSA.Rendering.Lighting.ClusteredLightSystem
  - KSA.Rendering.Lighting.LightDebug
  - KSA.Program
  - KSA.PartTree
  - KSA.LightModule
lifecycle:
  - frame:lights
  - frame:pre-render
  - frame:render
  - render:shadows
  - tool:authoring
  - tool:build
demonstrated_by:
  - mods/ksacars/features/headlights-as-spotlights
  - mods/ksastructures/features/garage-spot-lights
  - mods/ksarmory/features/fireball-light-injection
  - mods/flexo/features/cast-light-authoring
tags:
  - lights
  - spotlight
  - point-light
  - shadows
  - per-viewport
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:50:28Z
status: stable
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: g-current-decomp-ksa-rendering-lighting-ilightsystem-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Lighting/ILightSystem.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Lighting/ILightSystem.cs
    title: KSA.Rendering.Lighting.ILightSystem (decompiled, build 2026.10.10.5554)
  - id: g-current-decomp-ksa-rendering-lighting-light-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering.Lighting/Light.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Lighting/Light.cs
    title: KSA.Rendering.Lighting.Light (decompiled, build 2026.10.10.5554)
  - id: g-current-decomp-ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksa-current-decomp-ksa-lightmodule
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LightModule.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LightModule.cs
    title: current/decomp/KSA/LightModule.cs
  - id: flexo-src-ksa-partxmlserializer
    repo: flexo
    path: src/ksa/partXmlSerializer.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts
    title: src/ksa/partXmlSerializer.ts
  - id: flexo-src-ksa-lightvalidation
    repo: flexo
    path: src/ksa/lightValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts
    title: src/ksa/lightValidation.ts
  - id: flexo-src-state-editorstore
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: flexo-src-three-coords
    repo: flexo
    path: src/three/coords.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/three/coords.ts
    title: src/three/coords.ts
---
KSA's lights are not objects a mod registers once. `LightSystem.ClearLights()` empties them at the start of each frame's light pass, the game's own light modules, exhausts and explosions re-submit while it builds render data, and the result is sorted, assigned shadow tiles and written to the GPU before any command is recorded. A mod that wants a headlamp, a ceiling lamp or a flash therefore has to submit at a precise moment, for every viewport that will draw it.

## Engine background

- **The system.** `ILightSystem` [current/decomp/KSA.Rendering.Lighting/ILightSystem.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Lighting/ILightSystem.cs#L8-L28) is implemented by `ClusteredLightSystem` (`Program.LightSystem`). `CreateLightInstance(Light, IViewport)` adds to the viewport's forward list (cap 256) and, for the main viewport only, the clustered list (cap `MaxLights`); `MaxShadowCasters` is the player's shadow-slot setting.
- **Lights.** `Light.CreateSpotLight` and `CreatePointLight` [current/decomp/KSA.Rendering.Lighting/Light.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering.Lighting/Light.cs#L38-L79) build structs; `ELightFlags.CastsShadows` and `SoftShadows` request atlas tiles, which the engine assigns by influence.
- **Timeline.** `Program.OnFrame` clears lights (L2317-L2318, `frame:lights`); `Program.Render` then `UpdateRenderingResources` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4337-L4409)) re-submits per visible viewport (vehicles' `LightModule`s inside `PartTree.UpdateRenderData`, location render data, explosion lights), then `WriteForwardLights` and `UpdateRenderResources` consume them; `RenderGame` draws the light shadow atlas (`render:shadows`). See rows 19 and 22 of [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#per-frame-sequence).
- **The one survivor.** `LightDebug.Lights` is a public list that `ClusteredLightSystem.OnFrame` copies into the system after the clear.

Native authored lights are an additional option for lamps attached to parts. Flexo emits Light modules and the game performs their recurring submission; no Flexo code enters the frame loop. The editor shows local-frame markers and validation warnings, including scaled-owner direction differences. [src/ksa/partXmlSerializer.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/partXmlSerializer.ts#L714-L753) [src/ksa/lightValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/lightValidation.ts#L80-L206)

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: postfix PartTree.UpdateRenderData per craft](add-dynamic-lights-to-the-world-1.md) | KSACars | `harmony-postfix`, `Light.CreateSpotLight`, part light switch | `frame:render` | Lamps follow a vessel exactly as drawn, per viewport; Harmony required |
| [2: postfix UpdateStaticObjectRenderData with a shadow budget](add-dynamic-lights-to-the-world-2.md) | KSAStructures | `dynamic-lights`, per-viewport camera-relative lamps, nearest-N casters | `frame:render`, `render:shadows` | Lamps for a place on a celestial and explicit control of which cast shadows; layout is yours to maintain |
| [3: LightDebug.Lights, plus a compute fill](add-dynamic-lights-to-the-world-3.md) | KSArmory | Public list the engine re-pushes, reflection, `SunbloomRenderer.Render` prefix | `frame:lights`, `render:prepass`, `render:bloom` | Works from any frame hook and needs no Harmony for the light itself; one light, main viewport only, beyond 3 km needs the extra compute pass |
| [4: Author native cast lights with validated local frames and falloff](add-dynamic-lights-to-the-world-4.md) | Flexo | `xml-asset` | `tool:authoring`, `tool:build` | Let native part modules submit recurring lights; author local data carefully and validate owner-scale effects in the game |

Choose native authored modules (4) for part lamps that can use the game’s module behavior. Use a vessel render-data patch (1), a fixed-place patch (2), or a simulation-owned transient light (3) when custom runtime submission is needed.

## See also

- [Make static objects cast sun and lamp shadows with invisible casters](../../meshes/add-invisible-shadow-casters/overview.md)
- [Control part lights from code: state, colour, intensity and beam angles](../control-part-light-color-and-state/overview.md)
- [Modify the HDR scene with a compute pass](../../vulkan-passes/modify-the-hdr-scene-with-a-compute-pass/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
