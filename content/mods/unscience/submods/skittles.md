---
type: Submod
title: "Skittles"
description: "Global ImGui theme manager that re-themes every game and mod window through ImGui.GetStyle(), with built-in schemes, a live style editor, TOML theme files and scene-saved styles"
mod: unscience
submod: skittles
mod_id: skittles
tags: [imgui, theme, style, toml, ui-customization, scene-saves]
categories: [ui]
features: [mods/unscience/features/skittles-imgui-theme-manager]
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
  - id: skittles-readme
    repo: unscience
    path: skittles/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/README.md
    title: skittles/README.md
  - id: skittles-lib-readme
    repo: unscience
    path: skittles.lib/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles.lib/README.md
    title: skittles.lib/README.md
  - id: scope-ui
    repo: unscience
    path: scope/ui-customization.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/ui-customization.md
    title: scope/ui-customization.md
  - id: skittles-mod-toml
    repo: unscience
    path: skittles/mod.toml
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/mod.toml
    title: skittles/mod.toml
  - id: skittles-mod-cs
    repo: unscience
    path: skittles/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/Mod.cs
    title: skittles/Mod.cs
  - id: skittles-patcher
    repo: unscience
    path: skittles/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/Patcher.cs
    title: skittles/Patcher.cs
  - id: skittles-saves
    repo: unscience
    path: skittles.lib/SkittlesSubmod.Saves.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles.lib/SkittlesSubmod.Saves.cs
    title: skittles.lib/SkittlesSubmod.Saves.cs
  - id: theme-manager
    repo: unscience
    path: skittles.lib/ThemeManager.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles.lib/ThemeManager.cs
    title: skittles.lib/ThemeManager.cs
  - id: unscience-mod-cs
    repo: unscience
    path: unscience/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs
    title: unscience/Mod.cs
---

Skittles themes the entire KSA user interface at once. A filterable picker applies the captured game
style, Dear ImGui's Dark, Light or Classic colour schemes, the bundled "Inanimate Carbon Rod" preset
or any saved custom theme; a separate editor window wraps Dear ImGui's full style editor and saves
the live style under a name as a TOML file. The last theme comes back at the next start, each KSA
save remembers the exact style in use, and unloading restores the original look. It needs no Harmony
patch: everything goes through the shared `ImGuiStyle` returned by `ImGui.GetStyle()`.[^skittles-readme][^skittles-lib-readme]

## Hosting

- Manifest id `skittles`, entry assembly `MeowSci.Skittles` (development host only).[^skittles-mod-toml]
- Standalone host: F11 toggles "Skittles — Theme Manager"; its Patcher only applies `HotkeyGuard`.
  It never calls `RenderFloatingWindows`, so the theme editor window cannot open there.[^skittles-mod-cs][^skittles-patcher]
- In unscience, `SkittlesSubmod` is constructed early in `Mod.OnFullyLoaded` and added to the section
  list later; `Initialize` captures the default style and applies the configured theme at
  `[StarMapAllModsLoaded]`, and the host calls `RenderFloatingWindows` every frame so the editor works.
  `unscience/Patcher.cs` has no skittles entry.[^unscience-mod-cs]

## Features

| Feature | Category | Lifecycle | Summary |
|---|---|---|---|
| [Global ImGui themes by rewriting ImGui.GetStyle(), with TOML theme files and scene-saved styles](../features/skittles-imgui-theme-manager.md) | ui | `startup:all-mods-loaded`, `frame:draw-ui`, `event:save`, `event:load`, `frame:prepare` | Skittles re-themes every KSA and mod window by writing the shared ImGuiStyle through ImGui.GetStyle(), keeps themes as Tomlyn TOML files, wraps ImGui.ShowStyleEditor and needs no Harmony patch |

## Library classes

`SkittlesSubmod` (picker, delete modal, editor window, restore on dispose; `.Saves.cs` participant),
`ThemeManager` / `ThemeEntry` (paths, apply, save, delete, list), `ThemeDefinition` (60 colours and
the style vars), `ThemeSerializer` (Tomlyn TOML), `ModConfig` / `ModConfigSerializer`
(`active_theme`), `BuiltInThemes` (`CarbonRod()`). Shared from `ksa-abstractions.lib`: `SubmodUI`,
`HotkeyGuard`.[^skittles-lib-readme]

## Scene saves and persistence

Participant `skittles`, order 5: the full live style as a `ThemeDefinition`, validated (60 finite
colours, finite style values, visible alpha, positive tessellation) before it is applied. A load
without a skittles record restores the style captured when the host started. Globally, theme files
live in `<My Documents>/My Games/Kitten Space Agency/skittles/themes/*.toml` and the last applied
theme name in `skittles/config.toml`; these are written on every apply or save.[^skittles-saves][^theme-manager]

## Further reading

- [skittles/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/README.md) (partly outdated, see the feature's pitfalls)
- [skittles.lib/README.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles.lib/README.md)
- [scope/ui-customization.md](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/scope/ui-customization.md) (Brutal ImGui integration points)[^scope-ui]

## Entry points

- [skittles/mod.toml](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/mod.toml)
- [skittles/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/Mod.cs)
- [skittles/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/skittles/Patcher.cs)
- [unscience/Mod.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs#L72)

## See also

- [unscience overview](../overview.md)
- [Supermod host](../features/unscience-supermod-host.md) (renders floating windows for every sub-mod)
- [Kitchen Sink](./kitchen-sink.md) (the other UI and customisation sub-mod in the same scope document)

[^skittles-readme]: skittles/README.md
[^skittles-lib-readme]: skittles.lib/README.md
[^scope-ui]: scope/ui-customization.md
[^skittles-mod-toml]: skittles/mod.toml
[^skittles-mod-cs]: skittles/Mod.cs
[^skittles-patcher]: skittles/Patcher.cs
[^skittles-saves]: skittles.lib/SkittlesSubmod.Saves.cs
[^theme-manager]: skittles.lib/ThemeManager.cs
[^unscience-mod-cs]: unscience/Mod.cs
