---
type: Submod
title: "unscience (supermod host)"
description: "The only shipped mod: one StarMap entry class that constructs all 31 bundled feature sub-mods, applies their patches through one Harmony instance, renders them in one toolbox window and adds a per-save scene sidecar"
mod: unscience
submod: unscience
mod_id: unscience
tags: [supermod, host, starmap, harmony, imgui, saves, build]
categories: [getting-started, patching, persistence, testing-and-tooling, ui]
features: [mods/unscience/features/unscience-build-and-release, mods/unscience/features/unscience-consolidated-patcher, mods/unscience/features/unscience-managed-test-harnesses, mods/unscience/features/unscience-menu-bar-entry, mods/unscience/features/unscience-scene-save-sidecar, mods/unscience/features/unscience-supermod-host]
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
  - id: unscience-readme-md
    repo: unscience
    path: unscience/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/README.md
    title: unscience/README.md
  - id: readme-md
    repo: unscience
    path: README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/README.md
    title: README.md
  - id: repository-index-md
    repo: unscience
    path: REPOSITORY_INDEX.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/REPOSITORY_INDEX.md
    title: REPOSITORY_INDEX.md
  - id: scope-00-architecture-and-abstractions-md
    repo: unscience
    path: scope/00-architecture-and-abstractions.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/00-architecture-and-abstractions.md
    title: scope/00-architecture-and-abstractions.md
  - id: scope-saves-md
    repo: unscience
    path: scope/saves.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/saves.md
    title: scope/saves.md
  - id: unscience-mod-toml
    repo: unscience
    path: unscience/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/mod.toml
    title: unscience/mod.toml
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
  - id: unscience-menubarpatch-cs
    repo: unscience
    path: unscience/MenuBarPatch.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/MenuBarPatch.cs
    title: unscience/MenuBarPatch.cs
  - id: unscience-unsciencesaves-cs
    repo: unscience
    path: unscience/UnscienceSaves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/UnscienceSaves.cs
    title: unscience/UnscienceSaves.cs
  - id: unscience-unsciencestate-cs
    repo: unscience
    path: unscience/UnscienceState.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/UnscienceState.cs
    title: unscience/UnscienceState.cs
  - id: unscience-unscience-csproj
    repo: unscience
    path: unscience/unscience.csproj
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/unscience.csproj
    title: unscience/unscience.csproj
---

`unscience/` is the host project and the only mod the repository publishes. It contains no feature
logic: its `[StarMapMod]` class constructs every feature library's `ISubmod`, ticks them each frame (also
while the HUD is hidden), renders them as collapsible sections of the "Unscience Toolbox" window, applies all
feature Harmony patches through one consolidated `Patcher`, adds a top-menu-bar entry, and wires the shared
persistence library so scene setups are stored beside native saves. Its build target assembles the single
distributable folder.

## Hosting

- Manifest: `name = "unscience"`, `[StarMap] EntryAssembly = "MeowSci.Unscience"`, no `assets` and no mod
  dependencies; version stamped by CI.
- Lifecycle methods on `MeowSci.Unscience.Mod`: `[StarMapImmediateLoad]` (empty and zero-argument, so StarMap never dispatches it), `[StarMapAllModsLoaded]`
  (construct and initialize submods, restore window state, wire save adapters, `Patcher.Patch()`),
  `[StarMapBeforeGui]` (`Update(dt)` for every submod), `[StarMapAfterGui]` (F11 toggle, toolbox window,
  floating windows, layout autosave timer), `[StarMapUnload]` (dispose submods, saves wiring, unpatch).
- While the HUD is hidden the same per-frame update is replayed from the shared
  [hidden-UI frame hook](../features/lib-hidden-ui-frame-hook.md).

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [One shipped mod folder from thirty-plus projects, with dist validation and rolling GitHub releases](../features/unscience-build-and-release.md) | testing-and-tooling | `startup:starmap-before-main` | MSBuild resolves the game DLLs once for every project, only the unscience project deploys, copying exactly the MeowSci assemblies of its reference closure plus Tomlyn, and CI stamps the version, validates the folder and publishes rolling releases |
| [One Harmony instance applying 30-plus feature patch classes in isolation](../features/unscience-consolidated-patcher.md) | patching | `startup:all-mods-loaded` | The supermod's Patcher creates a single Harmony instance and applies every feature library's static patch class through a TryApply wrapper, so one stale game target disables only its own feature, then removes them all on unload |
| [Native-free managed test executables that run production patches against stand-in KSA types](../features/unscience-managed-test-harnesses.md) | testing-and-tooling | `frame:prepare`, `event:save`, `event:load` | Eighteen console projects compile production sub-mod files by link, declare small namespace-KSA stand-ins with the game's member names and apply the real Harmony patches to them, so timing, save and patch logic is checked without starting the game |
| [Add an entry to the game's main menu bar through DrawProgramMenusHook](../features/unscience-menu-bar-entry.md) | ui | `frame:draw-ui` | A Harmony postfix on the empty public Program.DrawProgramMenusHook method appends an ImGui menu item to KSA's top menu bar that toggles the mod window |
| [Per-save scene sidecar wiring and the participant inventory](../features/unscience-scene-save-sidecar.md) | persistence | `startup:all-mods-loaded`, `event:save`, `event:load`, `frame:prepare`, `frame:draw-ui` | The unscience host collects every sub-mod's save records, pairs each native save's capture with its write by object identity, writes unscience.json beside universe.xml and reports save and load results in the toolbox |
| [Supermod host that aggregates 31 feature panels into one window](../features/unscience-supermod-host.md) | getting-started | `startup:all-mods-loaded`, `frame:draw-ui` | The unscience StarMap entry class builds every ISubmod at StarMapAllModsLoaded, ticks them all each frame, renders them as collapsible sections of one ImGui window and persists only its own window layout and header state |

## Library classes

Host files: `Mod.cs` (entry class and toolbox), `Patcher.cs` (consolidated Harmony instance and per-feature
`TryApply`), `MenuBarPatch.cs` (postfix on `Program.DrawProgramMenusHook`), `UnscienceSaves.cs` (scene-save
wiring and status UI), `UnscienceState.cs` (`window.ini` and `state.toml` under `.unscience/`). Shared
infrastructure lives in `ksa-abstractions.lib`: `ISubmod`, `HotkeyGuard`, `HiddenUiFrameHook`,
`PhysicsFrameHook`, `PartRenderFilter`, `IvaForceRender`, providers, file libraries and `Persistence/`.

## Scene saves and persistence

The host owns no scene record itself; it aggregates 35 records from 30 submods into `unscience.json` beside each
native save (see the [scene save sidecar](../features/unscience-scene-save-sidecar.md)). Its own UI state
(window layout, open headers, visible submods, tooltip and autosave preferences) is global, in
`.unscience/window.ini` and `.unscience/state.toml`, written on a 1-30 s timer while the window is open and on
unload.

## Further reading

- [unscience/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/README.md)
- [README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/README.md)
- [REPOSITORY_INDEX.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/REPOSITORY_INDEX.md)
- [scope/00-architecture-and-abstractions.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/00-architecture-and-abstractions.md)
- [scope/saves.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/saves.md)

## Entry points

- [unscience/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/mod.toml)
- [unscience/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs)
- [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs)
- [unscience/MenuBarPatch.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/MenuBarPatch.cs)
- [unscience/UnscienceSaves.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/UnscienceSaves.cs)
- [unscience/UnscienceState.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/UnscienceState.cs)
- [unscience/unscience.csproj](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/unscience.csproj)

## See also

- [unscience overview](../overview.md)
- [Standalone mod template](./fixme-mod-name.md) (the per-feature host shape)
- [jplrepo](./jplrepo.md) (menu-bar animation experiment)
