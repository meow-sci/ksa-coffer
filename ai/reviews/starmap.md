# Review: content/mods/starmap

Reviewed 2026-10-10 against StarMap `4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build
2026.10.10.5554 (`ksa-game-assemblies` `935a32b`). The cross-check covered `StarMap.Core/Patches/*.cs`, `KSA/Program.cs`
(`OnFrame`, `PrepareFrame`, `OnDrawUiFrame`, `OnDrawUiViewports`, `Render`, `Dispose`, constructor),
`KSA/ModLibrary.cs` (`PrepareManifest`, `PrepareAll`, `LoadAll`, `AttachGameData`), `KSA/Mod.cs`
(`PrepareSystems`) and `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 4 | Hook targets, snippets and anchors were all correct. A handful of claims were imprecise: unload teardown, `ImportedAssemblies` edge case, `ExportedAssemblies` in the key table, init order in one intro, `GameSettings`, ImGui z-order |
| Coverage | 5 | All 13 reusable mechanisms of the ~1.6k LOC loader have a concept; the independent survey found nothing missing and nothing to merge |
| Lifecycle correctness | 4 | All seven attach points and patch kinds match the code. Early-return frames for `StarMapAfterOnFrame`, the global unpatch before `StarMapUnload` and the crash path were understated or unresolved |
| Conformance | 4 | All three validators were clean before and after. `startup-lifecycle-hooks.md` was missing the required `## Lifecycle and timing` section |

## Writer findings checked against code

- **(a) Confirmed.** `RuntimeMod.ExportedAssemblies` is never populated. It is declared once with an empty
  initializer (`StarMap.Core/ModRepository/RuntimeMod.cs` L28), and nothing in the repo writes to it. It is only read
  at L113, L124 and L126. `StarMapConfig.ExportedAssemblies` (`Config/StarMapConfig.cs` L16) is parsed from
  `mod.toml` but never read. The import set that actually takes effect:
  - **Dependency registered before the dependent** (`CalculateUseableAssemblies`): the importer's
    `ImportedAssemblies`, or the dependency's `EntryAssembly` when that list is empty.
  - **Dependency registered after the dependent** (`CheckForDependentMods` L172): `ImportedAssemblies` exactly, so an
    empty list shares nothing.
- **(b) Confirmed.** `StarMapImmediateLoadAttribute.IsValidSignature` requires exactly one parameter of type
  `KSA.Mod` (`StarMap.API/BaseAttributes.cs` L74-L79). `RuntimeMod.InitializeMod` then skips the method with
  `continue` and logs nothing (L150). Parameterless `[StarMapImmediateLoad]` methods exist in:
  - gatOS `gatOS.GameMod/Mod.cs` L202-L205 (empty body)
  - purrTTY `purrTTY.GameMod/TerminalMod.cs` L210-L215 (log only)
  - several unscience submods (`free-fallin`, `zippo`, `byo-music`, ...; empty bodies)

  None of these is ever called.

## Defects

| File | Defect | Fixed |
|---|---|---|
| features/startup-lifecycle-hooks.md | No `## Lifecycle and timing` section; the per-hook state lived under `### State at each hook` | yes |
| features/startup-lifecycle-hooks.md, features/host-process-launch.md, overview.md | Said `GameSettings` does not exist at `StarMapBeforeMain`; `GameSettings.Current` exists with built-in defaults until `LoadFromFile` runs in the constructor | yes |
| features/startup-lifecycle-hooks.md, overview.md | Did not state that a parameterless `StarMapImmediateLoad` is never called (finding b) | yes |
| features/frame-lifecycle-hooks.md | Said windows created in `StarMapBeforeGui` sit under game windows "in submission order"; ImGui z-order follows focus | yes |
| features/frame-lifecycle-hooks.md, overview.md | `StarMapAfterOnFrame` described as "after render and present"; the postfix also fires when `PrepareFrame` returns `Exit` (window close, font rebuild; no UI or render) and when `Render` returns `Exit` (failed acquire; no present) | yes |
| features/frame-lifecycle-hooks.md | Called `StarMapAfterGui` "the most used hook"; it is the most used frame hook (`StarMapUnload` and `StarMapAllModsLoaded` are more common overall) | yes |
| overview.md | Checklist required a "public" `[StarMapMod]` class; `GetTypes()` also returns non-public types, and only a public parameterless constructor is needed | yes |
| features/unload-and-shutdown.md | Said no job system or ImGui context exists at `StarMapUnload`. `Program.Dispose` only drains jobs (`JobSystems.WaitAll`) and shuts down the ImGui backend and ImPlot context | yes |
| features/unload-and-shutdown.md | Crash path was left "not verified". From code: StarMap's `Main` is `async Task`, so a main-thread exception unwinds through `using var gameSurveyer`, and `DeInit` plus `StarMapUnload` run before termination (marked as derived, not tested) | yes |
| features/shared-contract-assemblies.md | Pitfall said an empty `ImportedAssemblies` shares the dependency's entry assembly; that is only true when the dependency registered first, otherwise nothing is shared | yes |
| features/manifest-mod-discovery.md | `[StarMap]` key table presented `ExportedAssemblies` as effective | yes |
| features/host-process-launch.md | Intro put "applies its Harmony patches" before "discovers mods"; the real order is mods (including `BeforeMain`) first, then `PatchAll` | yes |
| howto/.../game-loop-and-lifecycle/overview.md (row 16), game-loop-and-lifecycle-1.md (hook table, safe-use table, step 7) | Said `StarMapUnload` runs after StarMap's own patches are removed and recommended unpatching there. `DeInit` calls `UnpatchAll()` with no id, which removes every owner's patches. This contradicted approach 2 of the same topic | yes, logged in that topic's log.md |
| howto/.../game-loop-and-lifecycle/overview.md (per-frame row 7) | Only the font rebuild was said to return `OnFrameResult.Exit`; window close returns it too | yes, logged |
| ai/catalog/starmap.yml | Missing generic how-to topics; unload summary lacked the crash path | yes (4 topics added) |
| ai/catalog/starmap.yml | Several how-to slugs contain "starmap" (`how-starmap-launches-ksa`, `starmap-hook-signatures`, ...) | no: kept on purpose, because StarMap is the platform every code mod targets and other catalogs use the same naming |

Checked and correct, no change needed:
- All 40 fenced snippets are verbatim, with no silent elisions or truncation.
- About 95 line-anchored links point at the right lines.
- Every hook target exists in build 5554 with the same parameter names (`dt`, `currentPlayerTime`, `dtPlayer`):
  - prefix on `Program.OnDrawUiFrame`, postfix on `OnDrawUiViewports`, postfix on `OnFrame`
  - prefix on `Mod.PrepareSystems`
  - postfix on `ModLibrary.LoadAll`, prefix on `ModLibrary.PrepareAll`
  - the manual prefix on the `Constants.DocumentsFolderPath` getter
- Game-side changes between 5438 (StarMap's reference build) and 5554 to the APIs `ConfirmRestart` uses are additive
  only. This confirms the "copied from an older `ConfirmMods`" note.
- The catalog's ids, titles, categories, lifecycle, hooks, techniques and game_types match the frontmatter exactly.

## Features added

None. The survey covered every source file, every attribute, Harmony and reflection site, and the CI and installer
files. It found no reusable mechanism without a concept. The commented-out `Legacy/ModManagerScreen.cs` is
documented in the overview.

## Open concerns

- Behaviours traced from code but not run in game:
  - the dependency-graph edge cases (registered-but-parked dependency, chains deeper than one level)
  - the async-`Main` crash path that reaches `StarMapUnload`
  - seeding the manifest into a not-yet-existing Documents or instance folder
- `ModLoader.TryLoadWaitingMods` removes items from `WaitingMods` while it enumerates that `HashSet` (L113-L118). This
  only works if `HashSet<T>.Remove` does not invalidate the enumerator, as on modern .NET. Not verified against the
  runtime.
- Not verified: how Tomlet deserializes `RootConfig` when `mod.toml` has no `[StarMap]` table and the `required`
  property is missing. StarMap assumes the result is null.
