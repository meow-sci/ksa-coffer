# Review: how-to category persistence (batch persistence-1)

Scope: `content/howto/persistence` (13 topics, 3 groups, 60 concepts), plan excerpt `ai/catalog/batches/persistence-1.yml`.
Checked against the mod checkouts under `references/`, the decomp at build 2026.10.10.5554 (GameSave, GameSaves, UncompressedSave, SaveName, SaveDirectory, Constants, Universe.DeserializeSave, Camera, Program.PrepareFrame/Dispose, FontManager, ImGui ini bindings, NetworkClient) and the lifecycle reference.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | 296 snippets verbatim; 417 line anchors in range; every `Type.Member` in prose exists. Two real engine/hook errors fixed |
| Coverage | 5 | Every topic, approach and plan feature id present and cited; `related` slugs all referenced |
| Lifecycle correctness | 4 | Save/load points, `PrepareFrame` handoff, unload ordering all match; one wrong hook mechanism (KER) fixed |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0/0, build_indexes --check clean for topics/groups (category index ignored) |

## Defects

| File | Defect | Fixed |
|---|---|---|
| save-and-load-the-game-from-code/overview.md, -2.md | Claimed `DestroyAllVehicles` leaves `Program.ControlledVehicle` pointing at a disposed vehicle after a load. `DeserializeSave` calls `Camera.Unfollow()` (default `changeControl: true`) on every game viewport, nulling it, then `Camera.DeserializeSave` assigns the saved target. Also misattributed that claim to a KSAGolf doc comment | yes |
| persist-mod-settings-as-json-1.md, write-and-load-config-files-safely-2.md | Frontmatter hooks/body said `StarMapAfterGui`; Kitten Engineer Redux draws via Harmony postfixes on `Vehicle.OnDrawUi` (main viewport, controlled vehicle) and `VehicleEditor.OnDrawUi`. Hooks, lifecycle (+`editor:draw-ui`), timing text and sources corrected | yes |
| persist-mod-settings-as-json-2.md, write-and-load-config-files-safely-1.md | Telemetry's hidden-HUD flush via `Program.DrawFps` postfix missing from hooks | yes |
| detect-save-load-3/-4, save-mod-state-with-the-game-save-3 | `StarMapAllModsLoaded` missing from hooks though lifecycle and body use it | yes |
| choose-where-a-mod-stores-its-files/overview.md | Said `profilerdumps` is created in the `Program` constructor (only `logs`, `crashdumps` are) | yes |
| choose-where-a-mod-stores-its-files-1.md | Plan feature `ohmystars/ini-settings-persistence` not cited in body | yes |
| persist-imgui-window-state-2.md | Unload-save caveat lacked the concrete `Program.Dispose` facts (backends shut down, ImPlot context destroyed, no `ImGui.DestroyContext`) | yes |
| 40 files | Backticked topic names (e.g. `identify-vessels-and-parts-across-saves` approach 3) left as plain text; converted to file-relative links | yes |
| presets-6 | Names topic `build-a-filesystem-file-picker`, not yet written (tracked in howto-status.yml) | no (not in scope) |

`generated` set to claude-code/sonnet-5.5 with a fresh timestamp on the 12 materially changed files; `log.md` gained an **Update** entry in all 13 topics.

## Features added
None; the category's mechanisms are covered by the 13 topics.

## Open concerns
- `ImGuiIO.IniFilename` is never assigned in the decomp, so the imgui.ini location is the native default and still described as "not located"; unverifiable without the native library.
- persist-imgui-window-state-2: whether `SaveIniSettingsToMemory` is safe at `StarMapUnload` is unproven (context is not destroyed, backends are); article keeps it as best effort.
- Scratchpad snippet checker was overwritten by a concurrent reviewer; re-run from `persist_snipchk.py` is clean (296/296).
