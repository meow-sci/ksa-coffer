---
type: Game Feature
title: Crossfade engine loops and play spin-up, loop and tail sounds
description: How a mod makes a simulated engine or weapon sound alive, either by crossfading two looping layers against RPM and load or by declaring a CompoundSound whose start, loop and stop sounds the engine sequences
topic: play-a-spin-up-loop-tail-sound-and-crossfade-engine-loops
category: audio
group: playback
approaches: 2
game_types: [KSA.IChannel, KSA.SoundBehavior, KSA.SpatialAudio, KSA.GameAudio, KSA.CompoundSound, KSA.CompoundChannelWrapper, KSA.SoundReference, KSA.SoundFileReference]
lifecycle: [startup:asset-load, frame:draw-ui, frame:after-on-frame, frame:post-render]
demonstrated_by: [mods/ksacars/features/engine-sound-crossfade, mods/ksacars/features/art-and-audio-pipeline-tooling, mods/ksarmory/features/spatial-gun-and-motor-sounds]
tags: [audio, fmod, loops, engine-sound, compound-sound, crossfade, sound-cutting]
status: stable
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T18:54:41Z }
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: "1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f"
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: "cbd63d6d84da7a48a13641a641d3557bad216435"
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: "935a32b4dbc34cbcd16e87d16cf9732eb90030c0"
sources:
  - id: ksa-soundfilereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SoundFileReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SoundFileReference.cs
    title: "KSA.SoundFileReference (decompiled, build 2026.10.10.5554)"
  - id: ksa-loopdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LoopData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LoopData.cs
    title: "KSA.LoopData (decompiled, build 2026.10.10.5554)"
  - id: ksa-compoundsound
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CompoundSound.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CompoundSound.cs
    title: "KSA.CompoundSound (decompiled, build 2026.10.10.5554)"
  - id: ksa-compoundchannelwrapper
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CompoundChannelWrapper.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CompoundChannelWrapper.cs
    title: "KSA.CompoundChannelWrapper (decompiled, build 2026.10.10.5554)"
  - id: ksa-channelwrapper
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ChannelWrapper.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ChannelWrapper.cs
    title: "KSA.ChannelWrapper (decompiled, build 2026.10.10.5554)"
  - id: ksa-gameaudio
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameAudio.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameAudio.cs
    title: "KSA.GameAudio (decompiled, build 2026.10.10.5554)"
  - id: ksa-core-sounds
    repo: ksa-game-assemblies
    path: current/Content/Core/Sounds.xml
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Sounds.xml
    title: "Core/Sounds.xml (build 2026.10.10.5554)"
---

A sample played once is a click; a sample looped is a texture; an engine or a gun is an event with a beginning, a steady
state and an end. KSA models that in two ways a mod can use. The first is data: a `<CompoundSound>` holds a start
sound, a looping sound and a stop sound, and the engine sequences them when the mod starts and stops one channel.
The second is code: the mod keeps two or more looping channels and sets their volume and pitch every frame from its own
simulation, which suits a sound whose character changes continuously (an engine going from idle to load). Both rely on
the same step before the game: cutting clean, seamless loops out of a recording.

## Engine background

| Piece | What it does |
|---|---|
| `SoundFileReference` [current/decomp/KSA/SoundFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SoundFileReference.cs#L8-L40) | `<SoundFile>`: `Path`, `Volume` (clamped 0..2), `TwoD`, `StreamFromDisk`, and an optional `<Loop>` child. Any `<Loop>` sets FMOD `LoopNormal`, none sets `LoopOff`[^ksa-soundfilereference] |
| `LoopData` [current/decomp/KSA/LoopData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LoopData.cs#L6-L24) | `<Loop>` may carry `<Start>`/`<End>` (`Value`, `Unit` of `Pcm`, `Ms` or `PcmBytes`) to loop a section of the file, and `RandomStartTime="true"` to start at a random point[^ksa-loopdata] |
| `CompoundSound.Play` [current/decomp/KSA/CompoundSound.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CompoundSound.cs#L22-L31) | Plays `<StartSound>` and `<Sound>` now, plays `<StopSound>` paused, and wraps the three channels in a `CompoundChannelWrapper`[^ksa-compoundsound] |
| `CompoundChannelWrapper.Stop` [current/decomp/KSA/CompoundChannelWrapper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CompoundChannelWrapper.cs#L79-L92) | Stops the start and loop channels (with their `FadeOut`), then un-pauses the stop channel so the tail plays; `Stop(stopImmediate: true)` also stops the tail[^ksa-compoundchannelwrapper] |
| `ChannelWrapper.UpdateVolume` / `UpdatePitch` [current/decomp/KSA/ChannelWrapper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ChannelWrapper.cs#L248-L273) | Multiply sound, mod-set (`VolumeMultiplier`, `PitchMultiplier`), fade, parameter and simulation-speed factors; mod-set values persist[^ksa-channelwrapper] |
| `ChannelWrapper.HandleSimSpeedPitch` [current/decomp/KSA/ChannelWrapper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ChannelWrapper.cs#L456-L495) | Sound-wide pitch factor from the simulation speed and the sound's `SimSpeed` rule; see the gotchas in both articles |
| `GameAudio.UpdateAudio` [current/decomp/KSA/GameAudio.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameAudio.cs#L150-L215) | The once-per-frame apply pass in `PostRender`[^ksa-gameaudio] |

Core uses the same shape for its own engines: `DefaultEngineSoundBehavior` is a `<CompoundSound>` with a start sound,
the looping `DefaultEngine` and a stop sound.[current/Content/Core/Sounds.xml](Core/Sounds.xml (build 2026.10.10.5554)#L347-L352)[^ksa-core-sounds]

Both approaches run on the main thread in the mod's per-frame step (`frame:draw-ui` from `[StarMapAfterGui]`, or
`frame:after-on-frame` as the HUD-hidden fallback) and are applied in `frame:post-render`. See the
[game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: Two mono loops with per-frame volume and pitch, cut from recordings with recorded-RPM provenance](play-a-spin-up-loop-tail-sound-and-crossfade-engine-loops-1.md) | KSACars | `fmod-audio` | `frame:draw-ui`, `frame:after-on-frame`, `frame:post-render` | Continuous control from a simulation (RPM, load); the mod owns the mix, the starter wait and the stop clip; needs a recorded-RPM number per loop |
| [2: `CompoundSound` spin, loop and tail cut from one recording, held while firing](play-a-spin-up-loop-tail-sound-and-crossfade-engine-loops-2.md) | KSArmory | `compound-sound` | `frame:draw-ui`, `frame:post-render` | Almost no code: start, hold and stop one channel; no continuous timbre change, only a pitch retune within about a quarter |

Choose article 1 when a number from your simulation should shape the sound continuously. Choose article 2 when the sound
has a begin, hold, end structure and you just need to start it and stop it. Both articles cover cutting the loops.

## See also

- [Play a sound at a world position and hold its channel](../play-a-sound-at-a-world-position-and-hold-its-channel/overview.md)
- [Drive a sound's Param curves from code and reuse stock sounds](../drive-sound-parameters-from-code/overview.md)
- [Ship custom sounds with a mod as XML sound assets](../../sound-assets/ship-custom-sounds-as-xml-assets/overview.md)
- [Understand KSA's sound, channel group and music playlist XML types](../../sound-assets/understand-the-games-sound-and-music-xml-types/overview.md)
- [Keep mod-played sounds sensible under time warp](../../channels/keep-mod-sounds-sensible-under-time-warp/overview.md)
- [Simulate wheels and suspension without a wheel module](../../../physics/aero-and-ground/simulate-wheels-and-suspension-without-a-wheel-module/overview.md) (where the RPM and load come from)

[^ksa-soundfilereference]: KSA.SoundFileReference (decompiled, build 2026.10.10.5554)
[^ksa-loopdata]: KSA.LoopData (decompiled, build 2026.10.10.5554)
[^ksa-compoundsound]: KSA.CompoundSound (decompiled, build 2026.10.10.5554)
[^ksa-compoundchannelwrapper]: KSA.CompoundChannelWrapper (decompiled, build 2026.10.10.5554)
[^ksa-channelwrapper]: KSA.ChannelWrapper (decompiled, build 2026.10.10.5554)
[^ksa-gameaudio]: KSA.GameAudio (decompiled, build 2026.10.10.5554)
[^ksa-core-sounds]: Core/Sounds.xml (build 2026.10.10.5554)
