---
type: Game Feature
title: Recolour vessel parts and kittens with a patched part shader
description: Tint, multiply or replace the colour of part instances, part types or whole vessels by packing colour into per-instance state bits and compiling a modified fragment shader, plus coloured emissive glow per subpart and engine heat glow overrides
topic: paint-vessel-parts-with-custom-colours
category: rendering
group: textures-and-decals
approaches: 4
game_types: [KSA.PartModelDynamic, KSA.ShaderReference, KSA.PartTreeRenderData, KSA.PartModelRenderer]
lifecycle: [startup:all-mods-loaded, frame:render, frame:draw-ui, frame:pre-render]
demonstrated_by: [mods/unscience/features/humble-arteest-vehicle-paint-shader-patch, mods/unscience/features/humble-arteest-kitten-color, mods/gatos/features/vehicle-and-eva-paint, mods/ksacars/features/coloured-emissive-lenses, mods/unscience/features/humble-arteest-engine-emissive]
tags: [paint, colour, emissive, shader-patch, statebitflag, parts]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:10:12Z }
status: stable
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
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
  - id: gatos-evapaintbridge-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/EvaPaintBridge.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/EvaPaintBridge.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/EvaPaintBridge.cs"
  - id: gatos-paintmanager-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/PaintManager.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/PaintManager.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/PaintManager.cs"
  - id: gatos-paintshadertransform-cs
    repo: gatOS
    path: gatOS.Paint/PaintShaderTransform.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Paint/PaintShaderTransform.cs
    title: "gatOS/gatOS.Paint/PaintShaderTransform.cs"
  - id: gatos-partpaintpatches-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/Paint/PartPaintPatches.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/Paint/PartPaintPatches.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/Paint/PartPaintPatches.cs"
  - id: ksa-meshindirect-frag
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Mesh/MeshIndirect.frag
    title: "current/Content/Core/Shaders/Mesh/MeshIndirect.frag (build 2026.10.10.5554)"
  - id: ksa-partmodeldynamic-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartModelDynamic.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelDynamic.cs
    title: "KSA.PartModelDynamic (decompiled, build 2026.10.10.5554)"
  - id: ksa-parttreerenderdata-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTreeRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs
    title: "KSA.PartTreeRenderData (decompiled, build 2026.10.10.5554)"
  - id: ksa-shadermoduleutils-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore/ShaderModuleUtils.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ShaderModuleUtils.cs
    title: "RenderCore.ShaderModuleUtils (decompiled, build 2026.10.10.5554)"
  - id: ksa-shaderreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ShaderReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShaderReference.cs
    title: "KSA.ShaderReference (decompiled, build 2026.10.10.5554)"
  - id: ksacars-lens-emissive-py
    repo: KSACars
    path: tools/model/lens-emissive.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/lens-emissive.py
    title: "KSACars/tools/model/lens-emissive.py"
  - id: ksacars-lenscolourhook-cs
    repo: KSACars
    path: src/KSACars/Ksa/LensColourHook.cs
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/Ksa/LensColourHook.cs
    title: "KSACars/src/KSACars/Ksa/LensColourHook.cs"
  - id: ksacars-split-lenses-py
    repo: KSACars
    path: tools/model/split-lenses.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/model/split-lenses.py
    title: "KSACars/tools/model/split-lenses.py"
  - id: unscience-engineemissivepatches-cs
    repo: unscience
    path: humble-arteest.lib/EngineEmissivePatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/EngineEmissivePatches.cs
    title: "unscience/humble-arteest.lib/EngineEmissivePatches.cs"
  - id: unscience-kittencolor-cs
    repo: unscience
    path: humble-arteest.lib/KittenColor.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/KittenColor.cs
    title: "unscience/humble-arteest.lib/KittenColor.cs"
  - id: unscience-vehiclepaint-cs
    repo: unscience
    path: humble-arteest.lib/VehiclePaint.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/VehiclePaint.cs
    title: "unscience/humble-arteest.lib/VehiclePaint.cs"
  - id: unscience-vehiclepaintpatches-cs
    repo: unscience
    path: humble-arteest.lib/VehiclePaintPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/VehiclePaintPatches.cs
    title: "unscience/humble-arteest.lib/VehiclePaintPatches.cs"
  - id: unscience-vehiclepaintshaders-cs
    repo: unscience
    path: humble-arteest.lib/VehiclePaintShaders.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/humble-arteest.lib/VehiclePaintShaders.cs
    title: "unscience/humble-arteest.lib/VehiclePaintShaders.cs"
---

Part instances are drawn from a cached `PartTreeRenderData` that holds, per slot, a state-flag word, an emissive colour and (for dynamic models) a temperature, and the part fragment shader (`MeshIndirect.frag`) reads them. There is no colour field for paint, but 21 of the 32 state bits are unused, and the game compiles part shaders from disk on every pipeline build. Combining a shader patch with a postfix on the private state writers
gives per-instance colour; the same writers carry a coloured emissive glow; and a prefix on the dynamic-model sink overrides engine heat. Kitten materials are a different, simpler path: a record in a GPU buffer.

## Engine background

- State writers: `PartTreeRenderData.WriteState` / `WriteDynamicState` (private) [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L1088), `EnsureBuilt` [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L444), `InvalidateStates` [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L323), per-batch `StateBitFlags` / `EmissiveColors` arrays [current/decomp/KSA/PartTreeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTreeRenderData.cs#L33-L35).
- Shader compile: `ShaderReference.CompileVariantWithCustomOptions` [current/decomp/KSA/ShaderReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ShaderReference.cs#L105) -> `ShaderModuleUtils.FromFile` / `FromString` [current/decomp/RenderCore/ShaderModuleUtils.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore/ShaderModuleUtils.cs#L79); `Program.RendererRebuildNeeded` triggers a rebuild.
- Dynamic models: `PartModelDynamic.AddInstance` [current/decomp/KSA/PartModelDynamic.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModelDynamic.cs#L463-L474).
- Timing: edits in `frame:draw-ui`; the writers run in `frame:render` (not `frame:pre-render`) inside `UpdateRenderingResources`. See [the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: 7:7:7 colour in state bits plus a patched shader](paint-vessel-parts-with-custom-colours-1.md) | unscience | `glsl-shader`, `FromFile` prefix, `WriteState` postfixes; kitten material write | `startup:all-mods-loaded`, `frame:render` | Per-instance, per-type or per-vessel colour with blend modes; rebuilds the renderer on enable |
| [2: shader transform at compile time with runtime masters](paint-vessel-parts-with-custom-colours-2.md) | gatos | Same technique, transactional arm/disarm, EVA material clones | `frame:prepare`, `frame:render` | Runtime control and restore; refuses to coexist with another `FromFile` prefix |
| [3: ADD_EMISSIVE_COLOR bit and instance colour](paint-vessel-parts-with-custom-colours-3.md) | ksacars | `WriteState` postfix by reflection; lens subparts | `frame:render` | Coloured glow without shader changes; static batches only |
| [4: prefix on PartModelDynamic.AddInstance](paint-vessel-parts-with-custom-colours-4.md) | unscience | Overwrite `Temperature` and `TfiThickness` | `frame:render` | Engine heat glow on demand; dynamic models only, per model not per instance |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Project decals onto vessels, terrain and clutter](../project-decals-onto-scene-geometry/overview.md)
- [Patch vehicle paint and canopy shaders in memory at compile time](../../../shaders/stock-shaders/patch-game-shaders-in-memory-at-compile-time/overview.md), [Smuggle data into stock shaders through unused uniforms, state bits and sentinel values](../../../shaders/stock-shaders/send-extra-data-to-stock-shaders-without-new-uniforms/overview.md), [Replace or text-patch the game's GLSL without editing game files](../../../shaders/stock-shaders/replace-or-patch-game-glsl-without-editing-game-files/overview.md)
