# Review: content/howto/external-io (batch external-io-1)

Reviewer: claude-code/sonnet-5.5, 2026-10-10. Scope: 16 topics, 50 concepts (16 overviews, 34 articles), groups control, telemetry, processes, network, terminals.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | All 242 code blocks are verbatim and inside their claimed line ranges; prose defects were few but real (see table) |
| Coverage | 5 | Every plan approach has an article; every plan `features` id is cited by its article; all `demonstrated_by` ids exist |
| Lifecycle correctness | 4 | Known facts hold (OSC 52 scan in `BuildFrame` on the tick, gatOS stream hook before the final `End()` in `RenderGame`, stock console from the GLFW key callback in `Glfw.PollEvents`); one systematic wrong claim fixed |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0 errors, build_indexes clean below the category level |

## Defects found

| File | Defect | Fixed |
|---|---|---|
| marshal-1, MCP-1, SDK article and overview, 9p overview, 9p-3 | "A paused game does not drain / ETIMEDOUT while paused": `App.Run` calls `OnFrame` unconditionally and gatOS has no pause gate, so a simulation pause does not stop the drain; only loading or a stalled game thread does | yes |
| export-1, schedule article | "`Universe.GetElapsedSeconds()` throws before the first sim step": the decomp reads a static `SimStep` struct and yields 0; the claim comes from a gatOS comment | yes (reworded as a defensive guard) |
| terminals 4 | Quoted mod.toml comment says purrTTY "exports" the contract via `ExportedAssemblies`; at the pinned StarMap that list is never copied into `RuntimeMod`, only the importer's `ImportedAssemblies` controls sharing | yes (note, sources and repos added) |
| terminals overview | `frame:input` in `lifecycle` was not grounded in any article | yes (key-gate gotcha added to article 1 with the `Program.OnKey` prefix) |
| terminals 3 | `ConsoleWindow.OnKey` is the extension `ConsoleWindowEx.OnKey` | yes |
| bind-3 | ioctl winsize said to be only on a pool thread; resize calls it from the caller (tick) thread | yes |
| record-3 | "game has no universe-ready callback" ignored `Program.OnGameLoaded` / `Universe.OnLoaded`; `CurrentSystem` linked to `CelestialSystem.cs` instead of `Universe.cs` L114 | yes |
| record overview | `frame:viewports` in lifecycle used by no approach | yes |
| detect overview, export overview | `CelestialSystem.cs#L66` anchor pointed at `Count`, not `All` (L64) | yes |
| 7 articles | "approach N" links pointed at `./overview.md` instead of the article | yes |
| 9p-2 | "file-model article" link pointed at overview | yes |
| marshal-2 | Solver-drain latency worded as "enqueued during frame N" | yes (sharpened) |
| catalog (batch and howto-plan) | stream lifecycle `frame:post-render`; detect, serial, record lifecycle differed from frontmatter; ETIMEDOUT note | yes |

## Features added

None; no uncovered reusable mechanism surfaced in this category. `gate-game-input-while-terminal-focused` (purrTTY) is now referenced from the terminal article.

## Open concerns

- Hidden-HUD consequences for purrTTY (inbox fills then drops) are derived from code paths and stated as "not observed in game".
- Many gatOS VM, 9p and MQTT details were spot-checked, not line-verified.
- KER's `Patch_FlightHud` declares `GameViewport inViewport` while the decomp `Vehicle.OnDrawUi` takes `IGameViewport`; this belongs to the mod feature page, not edited.
- Category-level `content/howto/external-io/index.md` is missing (orchestrator regenerates).
