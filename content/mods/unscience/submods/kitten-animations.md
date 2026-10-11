---
type: Submod
title: "Kitten Animations"
description: "Plays any loaded animation clip on a selected EVA kitten against the game's per-frame clip choice, triggers facial expressions through a mod-owned processor, and tunes animation strength and locomotion animation settings"
mod: unscience
submod: kitten-animations
mod_id: kitten-animations
tags: [kittens, animation, expressions, harmony, reflection, tuning, scene-saves]
categories: [kittens]
features: [mods/unscience/features/kitten-animations-clip-catalog, mods/unscience/features/kitten-animations-facial-expressions, mods/unscience/features/kitten-animations-forced-clip-playback, mods/unscience/features/kitten-animations-locomotion-tuning]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T11:54:52Z }
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
  - id: ka-readme
    repo: unscience
    path: kitten-animations/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/README.md
    title: kitten-animations/README.md
  - id: ka-lib-readme
    repo: unscience
    path: kitten-animations.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/README.md
    title: kitten-animations.lib/README.md
  - id: scope-character
    repo: unscience
    path: scope/character-and-materials.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/character-and-materials.md
    title: scope/character-and-materials.md
  - id: ka-mod-toml
    repo: unscience
    path: kitten-animations/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/mod.toml
    title: kitten-animations/mod.toml
  - id: ka-mod-cs
    repo: unscience
    path: kitten-animations/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/Mod.cs
    title: kitten-animations/Mod.cs
  - id: ka-patcher
    repo: unscience
    path: kitten-animations/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/Patcher.cs
    title: kitten-animations/Patcher.cs
  - id: ka-patches
    repo: unscience
    path: kitten-animations.lib/KittenAnimationPatches.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationPatches.cs
    title: kitten-animations.lib/KittenAnimationPatches.cs
  - id: ka-persistence
    repo: unscience
    path: kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
    title: kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
  - id: unscience-mod-cs
    repo: unscience
    path: unscience/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs
    title: unscience/Mod.cs
  - id: unscience-patcher-cs
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
---

Kitten Animations drives the avatar of one live EVA kitten: the controlled kitten by default, or any
other one pinned by vehicle id without taking control of it. It lists every animation the game loaded
for that kitten (ground and EVA locomotion, MMU, blend samplers, overlay poses) and can hold any of
them against the game's own per-frame clip choice, with blend time, playback-rate multiplier, freeze
and restart. It triggers the five authored facial expressions with an eased or latched envelope,
takes individual anim-processor values (ears, eye look angle and pitch, mood face, reactive face cap)
off the game, and edits the animation-facing part of the global kitten locomotion tuning. One
Harmony prefix on `AnimatedRenderable.UpdateAnimation` carries all overrides.[^ka-readme][^ka-patches]

## Hosting

- Manifest id `kitten-animations`, entry assembly `MeowSci.KittenAnimations` (development host only).[^ka-mod-toml]
- Standalone host: F11 toggles a "Kitten Animations" window; its Patcher applies `HotkeyGuard` and
  `KittenAnimationPatches.Apply` (the `UpdateAnimation` prefix) on a `Harmony("kitten-animations")`
  instance and removes both on unload.[^ka-mod-cs][^ka-patcher]
- In unscience, `KittenAnimationsSubmod` is created in `Mod.OnFullyLoaded`; its `Initialize` sets the
  static `KittenAnimationPatches.Driver` before `unscience/Patcher.cs` runs
  `TryApply("kitten-animations", () => KittenAnimationPatches.Apply(_harmony!))` on the shared
  `MeowSci.Unscience` instance.[^unscience-mod-cs][^unscience-patcher-cs]

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Catalog every animation clip, blend sampler and anim processor a live kitten has loaded](../features/kitten-animations-clip-catalog.md) | kittens | `frame:draw-ui` | Kitten Animations catalogs every playable clip of a live kitten: ground clips and blend samplers from private KittenRenderable fields, MMU and overlay clips from CharacterAvatar, and the four anim processors by name |
| [Facial expressions through a mod-owned CatExpressionAnim, plus anim-processor strength overrides](../features/kitten-animations-facial-expressions.md) | kittens | `frame:draw-ui`, `frame:render` | Kitten Animations plays facial expressions through its own CatExpressionAnim appended to AnimProcessors with an eased or latched envelope, and re-applies ear, eye and mood-face knobs from the pose prefix |
| [Force any animation clip on an EVA kitten from a prefix on AnimatedRenderable.UpdateAnimation](../features/kitten-animations-forced-clip-playback.md) | kittens | `frame:draw-ui`, `frame:render` | Kitten Animations holds a chosen clip on an EVA kitten against the game's per-frame clip choice from a Harmony prefix on AnimatedRenderable.UpdateAnimation, with blend, rate, freeze, restart and saved phase |
| [Live animation tuning on KittenLocomotionTuning.Current with a scoped reset and a scene-save record](../features/kitten-animations-locomotion-tuning.md) | kittens | `frame:draw-ui`, `frame:render`, `frame:dispatch-solvers`, `event:save`, `event:load`, `frame:prepare` | Kitten Animations edits the 20 animation-facing fields of the global KittenLocomotionTuning.Current in place, resets only those, shows live blend weights, and saves them with clip and expression state |

## Library classes

`KittenAnimationsSubmod` (target resolution and binding; `.Persistence.cs` save participant),
`KittenAvatarAccessor` (live kittens, stable-id lookup, `_characterAvatar` access),
`KittenAnimationCatalog` / `AnimationGroup` / `AnimationEntry`, `KittenAnimProcessors`,
`KittenAnimationDriver` (clip and knob overrides applied from the prefix), `KittenAnimationPatches`,
`KittenExpressionController`, `KittenPlaybackPhase`, `SavedAnimationTuning`, and the UI sections
`TargetSection`, `PlaybackSection`, `AnimationLibrarySection`, `ExpressionSection`,
`StrengthSection`, `TuningSection` with the shared `AnimationUiContext`. Shared from
`ksa-abstractions.lib`: `VehicleProvider`, `ReflectionHelpers`, `SubmodUI`, `HotkeyGuard`.[^ka-readme]

## Scene saves and persistence

Participant `kitten-animations`, default order. The record holds the pinned target id (or "follow
controlled"), the selected clip by source and label with its active, paused and phase state, the
expression variant and latched expression, the reusable playback, envelope and strength settings,
and the 20 animation-tuning values. Reset unbinds and restores the tuning captured at
initialisation; restore applies the values, binds the natively rebuilt kitten at once, and resumes
forced clips and latched faces; missing targets or clips are warnings and never retarget. Nothing
else is written to disk (the README's "nothing is persisted" refers to files).[^ka-persistence][^ka-lib-readme]

## Further reading

- [kitten-animations/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/README.md)
- [kitten-animations.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/README.md)
- [scope/character-and-materials.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/character-and-materials.md) (integration points and the "always the same expression" root cause)[^scope-character]

## Entry points

- [kitten-animations/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/mod.toml)
- [kitten-animations/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/Mod.cs)
- [kitten-animations/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations/Patcher.cs)
- [unscience/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs#L94)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs#L94)

## See also

- [unscience overview](../overview.md)
- [DOH](./doh.md) (spawns kittens to animate)
- [Iron Man](./iron-man.md) (its kitten editor still runs this prefix)
- [Humble Arteest](./humble-arteest.md) (kitten colour and visor)

[^ka-readme]: kitten-animations/README.md
[^ka-lib-readme]: kitten-animations.lib/README.md
[^scope-character]: scope/character-and-materials.md
[^ka-mod-toml]: kitten-animations/mod.toml
[^ka-mod-cs]: kitten-animations/Mod.cs
[^ka-patcher]: kitten-animations/Patcher.cs
[^ka-patches]: kitten-animations.lib/KittenAnimationPatches.cs
[^ka-persistence]: kitten-animations.lib/KittenAnimationsSubmod.Persistence.cs
[^unscience-mod-cs]: unscience/Mod.cs
[^unscience-patcher-cs]: unscience/Patcher.cs
