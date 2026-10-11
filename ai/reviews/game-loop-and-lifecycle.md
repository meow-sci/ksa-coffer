# Review: content/howto/getting-started/lifecycle/game-loop-and-lifecycle

Final consistency review, 2026-10-10, of the corpus's most-cited reference after 21 earlier edits
(creation plus 20 bundle-review updates). Checked against decompiled KSA build 2026.10.10.5554
(`ksa-game-assemblies` `935a32b`: `Program.cs`, `Universe.cs`, `PhysicsBubble.cs`, `ModLibrary.cs`,
`Mod.cs`, `App.cs`, `VehicleEditor.cs`, `VehicleUpdateState.cs`, `VehicleUpdateData.cs`,
`GaugeCanvas.cs`, `ResourceGroups.cs`) and StarMap `4dc60f8` (`StarMap.Core/Patches/*`,
`StarMapCore.cs`, `ModLoader.cs`, `RuntimeMod.cs`, `DocumentsPathPatches.cs`, `GameSurveyer.cs`,
`StarMap/Program.cs`).

What I checked:

- **Anchors.** I re-resolved every line-anchored link in the five concepts (262 in the overview and 145
  in the approaches) against the checkouts and read the cited lines next to the sentence that cites
  them. I also ran all 28 fenced snippets against their files: each one is verbatim, in order, with
  `// ...` elisions.
- **Internal coherence.** I compared the startup table, the 24-row frame table, the physics step, the
  26-step `RenderGame` table, the threading model, the vocabulary map and the four approaches with each
  other and with `docs/content-conventions.md`.
- **Clobbering.** Every change listed in the 20 log `Update` entries is still in the text. No
  concurrent edit was lost.
- **Bundle consistency.** I grepped all 631 mod feature pages for the facts that recur:
  - the hidden-HUD hooks;
  - the `PrepareWorker` window;
  - the `CopyFrom` copy channels;
  - render data being `frame:render`;
  - `UnpatchAll` running before `StarMapUnload`, and the instance path being gone by then;
  - a zero-argument `ImmediateLoad` never running;
  - `ExportedAssemblies` never being populated;
  - KittenExtensions patching in a `PrepareAll` prefix, and the thread-pool loader pass;
  - the staging recompute gate.

## Scores (state as found)

| Area | Score | Note |
|---|---|---|
| Accuracy | 4 | Small errors: a wrong `AggressiveInlining` claim, a misattributed snapshot copy, a frame-latch link to the wrong mod's file and an over-strong GUI-hook row |
| Coverage | 4 | The `ModLibrary.Bind` thread-pool pass and StarMap's `-InstancePath` patch were missing from the startup sequence |
| Lifecycle correctness | 4 | Per-frame row 10 labelled `Program.OnFrameEditor` `editor:on-frame`, which contradicts the conventions and every bundle |
| Conformance | 4 | Validators clean, but all five `demonstrated_by` lists were empty |

## Defects

| File | Defect | Fixed |
|---|---|---|
| overview.md | Row 10: `OnFrameEditor` labelled `editor:on-frame`. The conventions and the AircraftHUD, KER, MeasureTools and unscience bundles use `frame:viewports`; `editor:on-frame` is for `VehicleEditor.OnFrame` inside it | yes (row + `editor:<phase>` vocab row) |
| overview.md | Intro, row 11 and threading table: `ModLibrary.Bind` runs every `IBinder.Bind` in `Parallel.ForEachAsync` on thread-pool threads (`ModLibrary.cs` L1849-L1861), but the page said everything except the loader pass runs on the main thread | yes |
| overview.md | Row 3 omitted `DocumentsPathPatches` (applied by `ModLoader.Init` before any mod). Row 16 did not say the id-less `UnpatchAll` removes it before `StarMapUnload` | yes (source added) |
| overview.md | Row 14: "`StarMapBeforeGui`, `StarMapAfterGui` ... every frame"; the GUI hooks fire only with `DrawUI` | yes |
| overview.md | Dispatch table: credited `VehicleUpdateData.Prepare` with copying the manual inputs; `VehicleUpdateState.PrepareFromVehicle` does. The flight-computer copy-out was not named | yes |
| overview.md | Vocabulary rows: `startup:immediate-load` lacked the signature rule; `physics:orbit-solver` lacked the evidence that vehicle flight-plan prediction is vehicle-solver post-work | yes |
| game-loop-and-lifecycle-1.md | The step 6 latch link pointed to KSArmory's `FrameLatch.cs`, but the text describes KSACars' latch | yes (`src/KSACars/Sim/FrameLatch.cs`, source replaced) |
| game-loop-and-lifecycle-1.md | `StarMapBeforeMain` "before StarMap's own patches exist"; the `-InstancePath` prefix may already exist. `StarMapAllModsLoaded` did not note that game data is unattached. `StarMapAfterGui` called vehicle state "settled" | yes |
| game-loop-and-lifecycle-2.md | The hidden-HUD row did not name the `OnFrameEditor` postfix that the overview recommends; the unload gotcha hedged with "usually" | yes (hook added) |
| game-loop-and-lifecycle-4.md | Listed `UpdateActiveChutes` as `AggressiveInlining`; it has only `[SkipLocalsInit]` (`VehicleUpdateState.cs` L440-L441) | yes |
| all five concepts | `demonstrated_by: []` | yes (34 feature ids, all exist) |
| docs/content-conventions.md | `physics:orbit-solver` claimed "trajectory and patch prediction" (vehicle flight plans are vehicle-solver post-work). `startup:asset-load` lacked the thread-pool loader pass and the KittenExtensions `PrepareAll` prefix. `frame:gauges` lacked `UpdateCanvasesOnFrame`. `frame:draw-ui` said mods "postfix" both hidden-HUD calls | yes (also immediate-load signature, dispatch window, apply copy-back, after-on-frame on `Exit` frames; `generated` updated) |
| mods/ksarmory/features/round-body-draw-hooks.md | `Vehicle.UpdateRenderData` postfix and `PartModelRenderer.UpdateRenderData` prefix labelled `frame:pre-render` (and attributed that to the conventions) | yes (`frame:render`; overview row, catalog, log) |
| mods/ksarmory/features/prepareworker-prefix-command-window.md | Staging recompute "while the staging canvas or the engine-control gauge is open", with no default-on | yes |
| mods/ksa-deltavmap/features/vehicle-staged-dv-readout.md | "Stock refreshes ... only while ... open, so reading it would freeze the readout"; both canvases start enabled, so by default the worker rewrites it every step | yes (`GaugeCanvas.cs` source added) |
| mods/ksa-advancedflightcomputer/features/stage-model-from-staging-simulator.md | "only while the Staging window (`ResourceGroups.IsOpen`) or the engine-control gauge is open" | yes (two sources added) |
| mods/ksa-advancedflightcomputer/features/warn-once-logging-and-diagnostics.md | Implied the mod's own `UnpatchAll` in `[StarMapUnload]` still removes patches | yes |
| mods/gatos/features/purrtty-custom-shell-contract.md | "Usable assemblies are the intersection of ... `ExportedAssemblies` and ... `ImportedAssemblies`"; `RuntimeMod.ExportedAssemblies` is never populated | yes |
| mods/starmap/features/instance-path-override.md, unload-and-shutdown.md | "Active for the life of the process"; the redirect is gone before `StarMapUnload` | yes |
| mods/mpfx/features/per-frame-parameter-upload.md | Description: `StarMapAfterGui` writes "every frame" | yes (description, catalog summary, index) |

Facts confirmed consistent with no change needed:

- The hidden-HUD hooks across unscience, KSA-Public-Telemetry, AircraftHUD and StarMap.
- The `PrepareWorker` window across AFC, KSAStructures, KSACars and OhMyStars.
- The `CopyFrom` channels across AFC, gatOS, KSArmory, OhMyStars and Compendium.
- The zero-argument `ImmediateLoad` in gatOS, purrtty and unscience.
- The KittenExtensions timing across KittenExtensions, AFC, ShaderExtensions and RealAtmospheres.
- KER's staging-recompute wording.

## Features added

None (reference topic). The `demonstrated_by` lists were filled in.

## Open concerns

- **`content/` is not clean**, because other agents are writing how-to topics under `content/howto/`
  at the same time. These are outside this task and were not touched:
  - Validators report 2 `repos must be a list` errors, in `howto/physics/solver/*/overview.md`.
  - Validators report broken sibling links, in `mutate-vehicles-at-a-physics-safe-point` and
    `pick-objects-under-the-cursor`.
  - New directories have no `index.md` yet.
  - 30 parent indexes are out of date.

  Every bundle this review edited, and `content/mods` as a whole, pass all three validators.
- **Missing vocabulary.** The vocabulary has no value for the constructor work between
  `startup:all-mods-loaded` and `startup:game-loaded` (`Bind`, `AttachGameData`, renderer setup), and
  none for `Program.Main` prefixes, which bundles label `startup:starmap-before-main`.
- **Unverified Harmony behaviour.** The claim that Harmony's `UnpatchAll(null)` removes every owner's
  patches rests on Harmony's documented behaviour; I did not check it against the shipped
  `0Harmony.dll`.
- **Bundle line numbers.** Line numbers that bundle pages quote outside the reference were re-verified
  only on the pages edited here (for example, the KSArmory round-body table rows L4339-L4374 hold).
