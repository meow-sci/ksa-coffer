# Review: how-to category `audio` (batch audio-1)

Reviewer: claude-code/sonnet-5.5. Scope: `content/howto/audio/` (10 topics, 24 articles, 10 overviews; groups playback,
sound-assets, channels). Checked against the plan excerpt `ai/catalog/batches/audio-1.yml`, the pinned mod checkouts under
`references/`, the decomp at `ksa-game-assemblies/current/decomp/` and `current/Content/Core/` (`Sounds.xml`,
`ExplosionAssets.xml`), and the lifecycle reference `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | 107 of 107 path-headed snippets match their checkout line ranges exactly; every named game type exists and every `Type.Member` in backticks resolves. Five small factual or wording defects found and fixed. |
| Coverage | 4 | Every plan approach has an article and every plan `features` id is in that article's `demonstrated_by` and linked in its body. One reusable mechanism (declarative `<SoundEvent>` in game data) has no topic. |
| Lifecycle correctness | 5 | `Program.Dispose` -> `GameAudio.Release` (L1485) before `StarMapUnload`, `PostRender` -> `GameAudio.UpdateAudio` (L2362), same-frame versus next-frame application for `StarMapAfterGui` versus `StarMapAfterOnFrame`, and the `OnFrameViewports` (L2263) before `OnDrawUiFrame` (L2267) ordering all agree with the lifecycle reference. No wrong timing claim found. |
| Conformance | 5 | validate_bundle 0 errors / 0 warnings; content_check_refs 0 errors; build_indexes --check clean for every group and topic (only the category-level `index.md` is flagged, as instructed to ignore). |

## Mechanical checks

- Topic layout: all 10 topics have `overview.md` (`Game Feature`, `approaches` equals the article count, `category: audio`,
  correct `group`), correctly named articles (`<slug>.md` for one approach, `<slug>-N.md` otherwise), a generated `index.md` and a `log.md`.
- Snippets: scripted comparison of every fenced block with a source-path header against the checkout (both line-by-line
  membership and exact range equality). Zero mismatches. `adapted from` blocks use only members that exist
  (`GameAudio.PlaySound(... alwaysPlay)`, `ClusterChannelWrapper.IsPaused/SetPaused`, `PhysicalAtmosphereReference.GetAtmosphericPressureAtAltitude`, `Universe.SimulationSpeed`, `KeyHash.Make(ReadOnlySpan<char>)`).
- Link anchors: all `#L` ranges in the bodies are inside their files; the decomp anchors were spot-read and land on the named member.
- Overview `Approaches` tables match the articles; trade-offs are specific.

## Defects found

| # | File | Defect | Fixed |
|---|---|---|---|
| 1 | `sound-assets/ship-custom-sounds-as-xml-assets/ship-custom-sounds-as-xml-assets-3.md` | Compound-sound snippet anchored at `KSArmorySounds.xml L57-L65` began with the tail of a `<Sound>` element (verbatim but a truncated element). Re-anchored to L56-L65 so it starts at `<Sound Id="KSArmoryCannonTail" ... Priority="110">`. | yes |
| 2 | same file | "Core's ... engines 125" overstated: only the engine cluster layers and boost loops are 125; `DefaultEngine` and `DefaultEngineStart` declare no `Priority` and sit at 128. Reworded. | yes |
| 3 | `playback/drive-sound-parameters-from-code/drive-sound-parameters-from-code-2.md` | "priorities 123 and 124, below the 110 KSArmory gives its guns" reads as if guns are less important; in FMOD a lower number wins. Reworded. | yes |
| 4 | `playback/delay-a-sound-until-the-blast-front-arrives/delay-a-sound-until-the-blast-front-arrives.md` | `StarMapUnload` gotcha said a bang "runs out on KSA's own channel list" while FMOD is closed (incoherent). Now says `Program.Dispose` already closed FMOD so there is nothing left to stop. | yes |
| 5 | same file | Map-view gotcha claimed the base camera "keeps the last world pose" in map mode (not shown in the decomp). Replaced with the verified fact: `GetAudioCamera()` is `MainViewport.BaseCamera`, whereas `Program.GetMainCamera()` returns the map camera in map mode. | yes |
| 6 | `playback/play-a-sound-at-a-world-position-and-hold-its-channel/...-3.md` | "Anything that stops a channel leaves `IsPlaying()` false" is wrong for a `<Sound>` with `<FadeOut>` (`ChannelWrapper.Stop` only sets the fade state). Added the exception and the `stopImmediate` remedy. | yes |
| 7 | `channels/play-sound-files-through-the-games-fmod-system/...-2.md` | Lifecycle section did not say that `StarMapBeforeGui` does not fire with the HUD hidden. Verified: the shipped unscience host replays `UpdateSubmods` through `HiddenUiFrameHook` (prefix on `Program.OnDrawUiConsole`); the standalone `byo-music` host has no fallback, so the open-state poll stalls on F2. Added. | yes |
| 8 | Overviews of play-a-sound-at-a-world-position, drive-sound-parameters, ship-custom-sounds, keep-mod-sounds-sensible-under-time-warp, release-sound-channels | Frontmatter `lifecycle`, `game_types`, `demonstrated_by` were not the union of the articles' (e.g. `rocket-sound-without-engine` cited by an article but missing from the overview). Synced. | yes |
| 9 | `channels/keep-mod-sounds-sensible-under-time-warp/...-2.md` | `hooks` omitted `StarMapAfterOnFrame`, which the body and the KSACars code use. Added. | yes |

Changed files carry `generated.by: claude-code/sonnet-5.5` with a fresh `at`; each touched topic's `log.md` has an `**Update**` entry.

## Claims verified without change (selection)

- Known facts hold in the text: BYO Music's `Assets.xml` writes `Channel=` while `SoundReference` reads `ChannelId` (`understand-...`, `add-a-music-playlist...`); the engine's `ExplosionSoundSystem.StopAll` in `Universe.DeserializeSave` covers only its own tracked explosion sounds (`release-...-1`, `-3`, overview); the playlist topic states plainly that no shipped mod runs the path and takes behaviour from Core and `LocationMusicPlayer`.
- `SimSpeedRule` pitch table in the time-warp overview matches `HandleSimSpeedPitch` for all five rules including speed 0; `StopForSimSpeed` stops every rule except `Ignore` above 10x; default `SimSpeed` is `All`.
- `SetParameter` values persist in `_parameterValues`; only the per-frame multipliers reset (the overview says so correctly, and article 1 does not claim otherwise).
- Unset parameters: far report silent, close crack full, echo at 0.25 floor, exactly as `MapValue` computes. No Core `<Param>` reads `Intensity`.
- `LocationMusicPlayer.Initialise` last-wins on equal `LocationId`; `MusicPlayer.Update` has no caller; `SyncPoint` units other than `Ms` throw; "Show Audio Debug" exists.
- Mod-side numbers (idle/load recorded RPMs, 4700 vs 4500 rpm, 0.5 s / 1 km merge, 0.15 s / 0.6 reflected report, 1800 s follow time) match the repos.

## Open concerns (not resolved)

1. Coverage gap: the declarative `<SoundEvent SoundId=... Action=...>` route (an `Action="On"` nozzle in KSArmory's `KSArmoryGameData.xml`, an `Action="Pressed"` gauge button in AFC's `AutoStageButton.xml`) is only mentioned in passing. A short topic (stock sound on a part module or gauge button) would close it; it needs a plan entry and the engine side (`RocketNozzle` FX state, gauge `Button`) read first.
2. Cluster unpause in `drive-sound-parameters-from-code-1` (KSACars never unpauses the subscribed cluster) is a static-reading claim the article already flags as unverified.
3. `Channel=` being silently ignored by the `XmlSerializer` is inferred (no unknown-attribute handler found in the decomp), not run.
4. "A mod playlist for `Earth` overrides Core's" assumes the mod XML registers after Core's; untested.
5. What native FMOD does with calls on a released system (unload-time `StopAll`/`TryRelease`) is untested; the articles say so.
6. BYO Music's possible strict-`TrySetPaused`-before-tolerant-`TryIsPlaying` finish-path issue is static reading only.
7. `ship-custom-sounds-*` and the type-map frontmatter use `startup:all-mods-loaded` for `PopulateSounds`, which actually runs after `AttachGameData` (between `all-mods-loaded` and `game-loaded`); the bodies say "between" correctly, the vocabulary has no closer value.
8. `GameAudio.Play2DSound` / `PlaySound(SoundBehavior, out IChannel?)` (2D UI sounds, no spatial data) are listed in the time-warp overview but have no worked example.
