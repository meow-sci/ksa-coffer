# Review: content/mods/ksa-public-telemetry

Reviewed 2026-10-10 against these sources:

- KSA-Public-Telemetry `90608fb465f87d6008208798cc4d20ed8182c9a0`: all 33 C# files, the csproj, `mod.toml` and the README.
- StarMap `4dc60f8`: `ProgramPatcher`, `ModLibraryPatches`, `ModPatches`, `DocumentsPathPatches`, `StarMapCore`, `ModLoader`, `RuntimeMod`, `ModAssemblyLoadContext`, the API attributes and `StarMap/Program.cs`.
- The decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`).
- The lifecycle reference in `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

Independent checks:

- **Mechanics.** The validator, the ref checker and the index check were clean before the review and are clean after it.
- **Snippets.** A script compared all 20 fenced snippets with the checkout, honouring `// ...` elisions. All are verbatim; that includes the two new ones.
- **Anchors.** About 230 unique line anchors were listed with the source lines they point at, and the decomp and StarMap anchors were checked one by one. All of them land on the cited code, including the anchors added in this review.
- **Frame position of `DrawFps`.** `Program.OnFrame` L2264-L2276 runs, in order:
  1. `if (DrawUI) { OnDrawUiFrame; OnDrawUiViewports }`
  2. `if (DrawUI) OnDrawUiThreadSafe`
  3. `DrawFps()`
  4. `OnDrawUiConsole(dtPlayer)`

  `ImGui.Render` follows at L2286. Both `DrawFps` and `OnDrawUiConsole` run with `DrawUI` false, so `DrawFps` is not the only one; `OnFrameEditor` and `OnFrameViewports` also run regardless of `DrawUI`. None of them run on the frames where `PrepareFrame` returns `Exit`.
- **Other verified claims:**
  - **Launch time:** `LaunchGameTime` is set in the `Vehicle` constructor (L1436) and copied by `Split` (L1666-L1667).
  - **Nozzle positions:** `RocketNozzle.ResetState` uses the same `LocationAsmb.Transform(float4x4.Pack(Parent.MatrixAsmb2VehicleAsmb))`.
  - **Layout window name:** `LAYOUTS###KSA.LayoutSaves+LayoutSavesWindow_` is built in `ImGuiWindow.GetDebugName`, where `_debugName` is still null at that point.
  - **Menu bar:** it is `ImGui.Begin("Menu Bar")` plus `BeginMenuBar`.
  - **Atlas reset:** `FontManager.RegenerateFonts` calls `Fonts.Clear()`.
  - **Text arena:** `ImString.SharedStorage` is reset in `ImGuiBackend.NewFrame`.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 3 | Snippets, anchors and most engine members were right. However, about a dozen claims were wrong: the "one UI-phase call" claim, the FPS counter on the foreground list, windows "one frame behind", EVA freezing, "breaking parts", the config "never written", "frame-rate dependent", the hotkeys always working on F2, the startup `Succeeded()` call, and a ModMenu motive. Four items were left as "not investigated" although the decomp answers them |
| Coverage | 4 | 17 good concepts. One reusable mechanism had no concept (span formatting into Brutal's per-frame `ImString` arena); it was added. Nothing needed merging |
| Lifecycle correctness | 3 | Hook targets and kinds were right. Errors and gaps: the `DrawFps` exclusivity claim, the timing of the standalone windows, the documents-path loss at `StarMapUnload`, the `Exit` frames, the menu-bar lookup preceding `OnDrawUiThreadSafe`, and the `DrawFps` hook missing from 11 concepts drawn through the overlay. 5 after fixes |
| Conformance | 5 | Clean before and after. The only warnings came from this review's own edits (a long description, a missing footnote) and were fixed |

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/draw-while-ui-hidden-drawfps-postfix.md, ai/catalog | The description and summary called `DrawFps` "the one UI-phase call" that runs with `DrawUI` false. `OnDrawUiConsole` follows it outside the guard, and `OnFrameEditor`/`OnFrameViewports` also run | yes |
| features/draw-while-ui-hidden-drawfps-postfix.md | Missing facts, now added: the postfix fires while `DrawUI` is true and returns at once; it does not run on `PrepareFrame` `Exit` frames; hi-res screenshot capture forces `DrawUI` false (`ScreenshotCapture.OnPrepareFrame`). The `DrawFps` anchor now covers the whole body | yes |
| features/foreground-drawlist-broadcast-overlay.md | Said the game's FPS counter uses "the same idea". `ImGuiHelper.GetMainOverlayDrawList` returns the main viewport's background draw list, so game windows cover the FPS text | yes |
| features/foreground-drawlist-broadcast-overlay.md | Said the draw "reads no game state". It does not mention that the HUD toggle reads `Program.ControlledVehicle` and writes `GaugeCanvas` flags. It also omitted that `MenuBarInset` reads last frame's bar, because `StarMapAfterGui` precedes `OnDrawUiThreadSafe`, and how the bar is gated (hover, auto-hide, F2) | yes |
| features/panels-as-static-imgui-windows.md | Said the windows draw "one frame behind" the bar. `WindowHost` holds a reference to the single `TelemetrySnapshot`, which `StarMapAfterOnFrame` refills, so the windows show the same values as the bar. Only `dt` is stale | yes |
| features/freeze-on-signal-loss.md | "0.95 freezes just before the game starts breaking parts". In the code, a fraction of 1.0 or more creates a `VehicleDestructionEvent` for the whole vehicle in `PhysicsBubble.DetectStructuralFailure`. The g limit is `VehicleStructuralLimits.EffectiveMaxGLoad` (x2.5 for kittens), and the g-load check is waived for debris and for contact with a part failure | yes |
| features/freeze-on-signal-loss.md | The "why 0.95" rationale was presented as an inference. Traced: `ApplyResultsToMainThread` applies the load, then `ApplyRenderEventsToVehicles` leads to `DestroyVehicle`, which clears `ControlledVehicle` and deregisters the vehicle, all in the same `ApplyVehicleSolvers` call. Added that peaks are reset per step (`PrepareFromWorker`). The "tooltip" was really help text | yes |
| features/freeze-on-signal-loss.md | "A kitten on EVA ... will also freeze". `KittenEva.IsControllable` always returns true | yes |
| features/json-config-in-documents.md | Missed that the final `SaveNow` in `StarMapUnload` runs after StarMap's id-less `UnpatchAll()`, which removes its own `DocumentsFolderPath` instance-path prefix. Under `-InstancePath`, that save goes to the default folder | yes |
| features/json-config-in-documents.md | "Nothing is written until something changes". The unconditional `SaveNow` at unload always writes the file | yes |
| features/montserrat-fonts-in-imgui-atlas.md | The `RegenerateFonts` hazard was vague (pointers that dangle after `Fonts.Clear()`, with no reload because of `_attempted`), and the rationale for loading on the first draw was speculative. Added the trigger (`GameSettings.SaveChanges`), the `Exit` frame, a detection idea, and that the manifest `fonts` key only feeds the font-setting combo | yes |
| features/live-flight-telemetry-sampling.md | The g-load semantics were "not investigated". Resolved: it is the felt acceleration (`ForceBody/mass`, contact delta-v minus gravity, `GM/r^2` on rails), the same measurement the game uses for structural g-load. Also added that `StarMapAfterOnFrame` fires on `Exit` frames | yes |
| features/mission-timeline-with-planned-burns.md | `Burn.Time` vs ignition was "not investigated". It is the impulsive instant; `FlightComputer.TimeBurn` ignites half the burn duration earlier | yes |
| features/engine-diagram-from-nozzle-positions.md | The axis convention was "not verified". Stock engines exhaust along -X (`ExhaustDirection X="-1"`), and the projection ignores gimbal deflection (`UpdateState`). The "all engines collapse" pitfall was overstated | yes |
| features/mission-clock-and-liftoff-detection.md | Launch keys were described as "unique per nanosecond, in practice only splits". Vehicles spawned while the simulation is paused share a key, because the step length is `dtPlayer x speed`. Clarified what "now" means in the after-frame hook (`_lastSimStep` advanced in `ApplyVehicleSolvers`) | yes |
| features/intro-outro-animation.md | Said the clamp protects against "a paused game" (a pause does not stretch `dtPlayer`), and called the animation "frame-rate dependent" (it is dt-driven). Also, the sequence keeps "no per-element state" although the engine dots do | yes |
| features/hide-and-restore-stock-flight-hud.md | Several gaps, now filled: which canvases are hidden (only `Burn` is `AlwaysEnabled` among the 14 in `Gauges.xml`); render-side skipping in `CanvasesRender`; the claim that the toggle is "moot" under F2; persistence was "not checked" (flags are only captured by `LayoutSave` create and overwrite); the unload restore has no lasting effect | yes |
| features/rebindable-numpad-hotkeys.md | "Hotkeys work with the UI hidden too". They only do when `ShowWhenGameUiHidden` is on. Added the GLFW-to-ImGui key path and the fact that the overlay is disabled by default | yes |
| features/modmenu-entry-with-standalone-fallback.md | Gave an unsupported motive ("which is why the mod also keeps the window variant") | yes |
| features/error-budget-self-disable.md | Said startup calls `Succeeded()`; it does not. Added the inert-after-startup-failure path and the `Exit`-frame behaviour | yes |
| 11 feature concepts, ai/catalog | `hooks` omitted `harmony-postfix KSA.Program.DrawFps` although their draw code runs from that postfix on F2 frames | yes |
| overview.md | Data flow said "settled state". The `DrawFps` row said "every frame". The `StarMapUnload` row did not say all patches are already gone. The `OnFrame` order omitted `OnDrawUiConsole`. Missing compatibility notes: dangling fonts, instance path, shared `###` id | yes |
| features/flight-event-detection-and-callouts.md | Said "settled" for state read after the next step was dispatched | yes |
| howto/.../game-loop-and-lifecycle/overview.md (reference) | Row 15 linked only the `OnDrawUiConsole` body and said "the only UI method that always runs". The hidden-HUD paragraph and the vocabulary map did not mention `DrawFps` | yes, logged |
| howto/.../game-loop-and-lifecycle/game-loop-and-lifecycle-1.md (reference) | The `StarMapUnload` "flush files" guidance did not warn that StarMap's `DocumentsFolderPath` instance-path prefix is already removed | yes, logged |

## Features added

- `features/allocation-free-readout-text.md` (ui, `frame:draw-ui`). Readouts are formatted with `TryFormat` into `stackalloc` spans and passed to `AddText`/`CalcTextSize`. Brutal's `ImString` encodes those spans into `SharedStorage`, which `ImGuiBackend.NewFrame` resets every frame. The concept covers `u8` literals, arena lifetime and buffer sizing. It is added to the catalog with the topic `allocation-free-imgui-text`. The catalog also gained the topic `survive-imgui-font-atlas-rebuild`.

## Open concerns

- `docs/content-conventions.md`, which is outside my write scope, says `frame:draw-ui` is skipped with the HUD hidden "except `OnDrawUiConsole`". It should also name `DrawFps`.
- ModMenu is not in the corpus. Attribute discovery by type name and the meaning of `IsModMenuActivePropertyName` rest on KSACars' comment.
- Several conclusions follow from the code but were not run in game:
  - the dangling font pointers after `RegenerateFonts`;
  - two open windows merging under the shared `###` id;
  - the overlay appearing in screenshots taken with the HUD hidden;
  - the unload save going to the default folder;
  - the g readout on the pad.
- The instance-path redirect itself assumes Harmony keeps `Constants.DocumentsFolderPath` from being inlined into callers; this was not verified.
- Other reviewers were editing `game-loop-and-lifecycle/overview.md` and `log.md` at the same time. My edits were exact single-match replacements, so the orchestrator should confirm that none were lost.
