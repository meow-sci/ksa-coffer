# Review: how-to category ui (batches ui-1 and ui-2)

Scope: `content/howto/ui/` (5 groups, 29 topics, 108 articles, 29 overviews, 137 concepts). Reviewer: claude-code/sonnet-5.5, 2026-10-10. Checked against the build 2026.10.10.5554 decomp, the pinned `references/` checkouts, StarMap and `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/` (timing authority).

## Scores (1-5)

| Axis | Score | Note |
|---|---|---|
| Accuracy | 4.5 | All 654 path-labelled snippets are verbatim at their stated lines (one file only differs by a BOM). Engine members, anchors and numeric claims held up except the defects below |
| Coverage | 5 | All 29 topics exist; every plan approach has an article; every plan `features` id is in that article's `demonstrated_by`; nothing silently dropped |
| Lifecycle correctness | 4.5 | Menu bar, hidden-HUD, StarMapAfterGui-before-OnDrawUiThreadSafe, font-rebuild and input timing all agree with the lifecycle reference; one vocabulary misuse (`PackData` as `frame:gauges`) and five incomplete `hooks` lists fixed |
| Conformance | 4.5 | validate_bundle 0/0, content_check_refs 0 errors, build_indexes `--check` clean for all five groups (category-level `ui/index.md` ignored as instructed). Before review 18 of 29 overviews had `repos: []` and 58 files carried stale "not yet written" lines |

## Method

- Scripts (scratchpad): plan vs disk (slugs, article names, `approaches`, `approach`, plan features in `demonstrated_by`, dangling ids, `log.md`, `index.md`); every fenced block with a `path Lx-y` header compared line by line (multi-range headers, `// ...` elisions) with the checkout; `game_types` looked up in the decomp; every backticked `Type.Member` looked up in the decomp; frontmatter `hooks` vs the lifecycle section; overview union of `repos`/`lifecycle`/`game_types`; plan lifecycle vs overview.
- Read end to end or by lifecycle, background and gotcha sections: all five menus topics, all overlays topics, draw-lists (fonts in full), input (all 7), windows (subclass, settings, alerts, loading dialog, live data, console style, tabbed and searchable lifecycle sections plus overviews). Step prose of some tabbed, searchable and console-style articles was covered by the automated checks and the lifecycle read only.
- Known facts re-derived from the decomp, all already correct in the text: KSA's bar is the "Menu Bar" window (`Program.cs` L3486) and `BeginMainMenuBar` is never called; `DrawProgramMenusHook` (L4005) fires for the main bar when the main viewport is hovered and for a hovered secondary viewport (`GameViewport.cs` L256), and not when auto-hidden; `RegenerateFonts` starts with `ImGui.GetIO().Fonts.Clear()` and clears the `FontManager.Fonts` dictionary, and `PrepareFrame` then returns `Exit`, and no reference mod re-adds fonts; ModMenu behaviour is attributed and marked unverified throughout; `##` hashes the whole label, `###` is the stable form (`ImGuiWindow` builds `name + "###" + _debugName`).

## Defects found

| File | Defect | Fixed |
|---|---|---|
| 58 files across input, overlays, windows | "Related topic(s), not yet written: ..." lines although every named topic exists on disk | yes, replaced with links (one bullet per topic) |
| 27 overviews (18 with `repos: []`) | `repos`, `lifecycle` and `game_types` were not the union of the subtree as the conventions require (cheap-refresh pins missing) | yes |
| input/place-pieces-on-a-grid-with-a-ghost-1.md | Said `ImGuiBackendGlfwImpl.OnKey` forwards to `Program.OnKey`; it does so only for secondary platform windows under `InputFallthrough` (`Program` subscribes the main window itself) | yes |
| overlays/draw-ui-while-the-hud-is-hidden-3.md | Claimed the menu bar can flip `DrawUI`; only the ToggleUi key handler and `ScreenshotCapture` assign it | yes |
| menus/add-a-menu-with-modmenu-fallback-3.md | Said the settings hotkey is only handled when the AfterGui hook runs; telemetry's `HandleHotkeys` also runs on the `DrawFps` path, only the window is skipped | yes |
| windows/show-a-dialog-during-loading-2.md | Said `ConfirmMods` and `SelectSystem` pumps both run before `PrepareAll` returns; `SelectSystem` runs after `PrepareAll`, `PreloadAssetBundles` and `PreloadLanguages` | yes |
| menus/work-with-stock-cockpit-gauges-1.md, -2.md, overview.md | `PackData` (gauge pass in `RenderGame`) labelled `frame:gauges`; vocabulary and the lifecycle reference say `frame:render` | yes |
| input/cursor-to-world-ray/overview.md | Missing: `MainViewport.Position` is assigned at the start of `OnDrawUiThreadSafe`, so a `StarMapAfterGui` ray subtracts last frame's value | yes (added) |
| input/coordinate-imgui-focus-with-game-input-2.md | "With the UI hidden no window can want the mouse"; the console and any mod window on the DrawFps/OnDrawUiConsole path can | yes |
| menus/add-items-to-the-game-menu-bar-1.md, overlays/draw-hud-instruments-3, draw-lists/load-a-custom-font-1, input/pick-objects-5, windows/match-the-stock-console-ui-style-3 | Frontmatter `hooks` omitted hooks the body relies on (`StarMapAllModsLoaded`, `StarMapImmediateLoad`, `StarMapAfterGui`, `GameViewport.OnFrame` prefix with `StarMapAfterOnFrame`, `Burn.DrawBurnEditorWindowContent` postfix and `GameSettings.OnDrawUi` transpiler) | yes |
| windows/show-alerts-and-popups-in-game-1.md | Non-cyan alert tone called "primary"; code uses `Tone.Neutral` | yes |
| draw-lists/build-custom-drawn-imgui-widgets-1.md, build-a-pan-zoom-canvas-in-imgui-1.md | Gotcha headed "frame-late hover" while describing same-frame behaviour | yes |
| menus/add-a-menu-with-modmenu-fallback overview and -1 | "`PrepareAll` registers every enabled manifest entry"; it also needs the folder and a valid `mod.toml` | yes |
| menus/add-items-to-the-game-menu-bar-1.md | "Four reference mods use it"; gatOS, Kitten Engineer Redux, AFC and dont-stifle-me also patch the hook | yes (reworded) |

Files with content corrections have `generated` set to claude-code/sonnet-5.5 (19 files); metadata-only and link-only edits keep the original block. Each affected topic's `log.md` has an `**Update**` entry.

## Features added

None (how-to review). Six draw-lists topics added to `ai/catalog/howto-status.yml` as done (310 topics, one per overview).

## Open concerns

- ModMenu discovery, call site and the active-flag property are attributed to mod comments and marked unverified in the articles (source not in the corpus); left as is.
- Font rebuild effect on cached `ImFontPtr`s (upstream `ImFontAtlas::Clear`) and the adapted guard in load-a-custom-font-into-imgui-4 are untested; the articles say so.
- `imgui.ini` placement behaviour for plain `Begin` windows is Dear ImGui default behaviour; KSA never sets `IniFilename` in the decomp, so it is not confirmed in game.
- Not read line by line: step prose of tabbed 1-4, searchable 1-6, console-style 1-4 and inject 2-4 (lifecycle, background and gotcha sections were).
- Category-level `content/howto/ui/index.md` is out of date (ignored per instructions).
