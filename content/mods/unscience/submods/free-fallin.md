---
type: Submod
title: "Free Fallin"
description: "Applies one global look to every parachute canopy by swapping a runtime material into each canopy renderable as it draws, with tints, PBR controls, composited or projected PNG images and exact stock restore"
mod: unscience
submod: free-fallin
mod_id: free-fallin
tags: [parachutes, materials, shaders, textures]
categories: [assets, shaders, vehicles-and-parts]
features: [mods/unscience/features/free-fallin-canopy-material-substitution, mods/unscience/features/free-fallin-canopy-projection-shader, mods/unscience/features/free-fallin-canopy-texture-compositing]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T13:17:12Z }
status: stable
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: free-fallin-readme-md
    repo: unscience
    path: free-fallin/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/README.md
    title: free-fallin/README.md
  - id: free-fallin-lib-readme-md
    repo: unscience
    path: free-fallin.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin.lib/README.md
    title: free-fallin.lib/README.md
  - id: scope-parachutes-md
    repo: unscience
    path: scope/parachutes.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/parachutes.md
    title: scope/parachutes.md
  - id: ksa-upgrade-tests-freefallinchecks-cs
    repo: unscience
    path: ksa-upgrade.tests/FreeFallinChecks.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-upgrade.tests/FreeFallinChecks.cs
    title: ksa-upgrade.tests/FreeFallinChecks.cs
  - id: free-fallin-mod-toml
    repo: unscience
    path: free-fallin/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/mod.toml
    title: free-fallin/mod.toml
  - id: free-fallin-mod-cs
    repo: unscience
    path: free-fallin/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/Mod.cs
    title: free-fallin/Mod.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
---

Free Fallin gives every deployed parachute canopy one global appearance: the stock pattern with tint
and brightness, a PNG mapped through the panel UVs, one PNG projected over the whole canopy through
patched model shaders, or a PNG composited into the centre of the stock albedo, plus AO, roughness and
metallic multipliers or uniform values. It builds a runtime `MaterialData` in `GpuMaterialSystem` and
swaps it into slot 0 of each canopy renderable's `MaterialIndices` in a prefix on `ChuteRenderable.Draw`,
restoring each canopy's native material on Restore Stock or unload. No raycast is needed because the
material follows KSA's animated cloth.

## Hosting

- Manifest id `free-fallin`, entry assembly `MeowSci.FreeFallin` (development host only).
- Standalone host: F11 window; its Patcher applies `HotkeyGuard` and `FreeFallinPatches`, which also
  installs `CanopyProjectionShaders` (prefixes on `Utils.SetShaderFromMod` and `ShaderModuleUtils.FromFile`
  plus a renderer rebuild request).
- In unscience `FreeFallinPatches` is applied by `unscience/Patcher.cs`; the PNG browser is drawn from
  `RenderFloatingWindows`.

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Swap every parachute canopy's material at draw time](../features/free-fallin-canopy-material-substitution.md) | vehicles-and-parts | `startup:all-mods-loaded`, `frame:draw-ui`, `event:load`, `frame:render` | A Harmony prefix on ChuteRenderable.Draw reflects the private AnimatedRenderable and overwrites slot 0 of its protected MaterialIndices with one runtime MaterialData (tint, PBR multipliers or uniform PBR, custom albedo), capturing and later restoring each canopy's native material handle |
| [Material-gated full-canopy projection by patching KSA's model shaders in memory](../features/free-fallin-canopy-projection-shader.md) | shaders | `startup:all-mods-loaded`, `frame:prepare`, `frame:render` | Prefixes on Utils.SetShaderFromMod and ShaderModuleUtils.FromFile recompile Model.vert, Model_Skinned.vert and ModelPbr.frag from patched source, adding a bind-pose projection UV that ModelPbr.frag uses for albedo only on materials whose ExtraData carries Free Fallin's marker |
| [Runtime canopy textures from PNGs, CPU compositing over a BC7 stock texture, and owned GPU assets](../features/free-fallin-canopy-texture-compositing.md) | assets | `frame:draw-ui`, `event:load` | Free Fallin builds canopy textures on the CPU (PNG decode, a centred decal over the stock BC7 albedo re-opened from KTX2 with an RGBA32 transcode, a 1x1 PBR map), registers them with GpuTextureSystem.TryAddTexture and releases its own entries through the protected AssetMap |

## Library classes

`FreeFallinSubmod`, `FreeFallinPatches`, `CanopyMaterialController`, `CanopyProjectionShaders`,
`CanopyGpuAssets`, `CanopyMaterialSettings`, `CanopyTextureMode`; shared `PngLibrary`,
`PngFileBrowser` and `MaterialColorState`.

## Scene saves and persistence

Participant `free-fallin` (restore order 20): the last successfully applied canopy settings (mode, PNG
name, tint, brightness, decal scale and rotation, PBR controls) and the effective albedo, so a Humble
Arteest recolour survives. Reset restores stock. The README calls the setting session-only; that is
only true for the standalone host.

## Notes

Likely 5541+ breakage (found by static analysis, not seen in game): the Full canopy shader patch
hard-codes `SET_TEXTURE 1` / `SET_MATERIAL 2` in `Model_Skinned.vert`, which matched KSA 5482. Since
5541 `ModelPbr.frag` uses `SET_TEXTURE 5`, `SET_MATERIAL 1` and `SET_CSM 2`, so the patched skinned
vertex shader would read material data from the wrong descriptor set in every pipeline using it
(canopies and kitten bodies), and the patch is armed at startup. See
[the projection shader page](../features/free-fallin-canopy-projection-shader.md).

## Further reading

- [free-fallin/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/README.md)
- [free-fallin.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin.lib/README.md)
- [scope/parachutes.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/parachutes.md)
- [ksa-upgrade.tests/FreeFallinChecks.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/ksa-upgrade.tests/FreeFallinChecks.cs)

## Entry points

- [free-fallin/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/mod.toml)
- [free-fallin/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/free-fallin/Mod.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs)

## See also

- [unscience overview](../overview.md)
- [Graffiti](./graffiti.md) (decals that can sit on canopies)
- [Humble Arteest](./humble-arteest.md)
