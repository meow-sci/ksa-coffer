---
type: Mod Feature
title: Add an entry to the game's main menu bar through DrawProgramMenusHook
description: A Harmony postfix on the empty public Program.DrawProgramMenusHook method appends an ImGui menu item to KSA's top menu bar that toggles the mod window
mod: unscience
submod: unscience
category: ui
tags: [menu-bar, imgui, harmony, modding-hook]
techniques: [harmony-postfix, imgui-menu]
game_types: [KSA.Program]
lifecycle: [frame:draw-ui]
hooks:
  - "harmony-postfix KSA.Program.DrawProgramMenusHook"
generated: { by: claude-code/opus-5.5, at: 2026-10-10T04:10:00Z }
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
  - id: menu-bar-patch
    repo: unscience
    path: unscience/MenuBarPatch.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/MenuBarPatch.cs
    title: unscience/MenuBarPatch.cs
  - id: unscience-patcher
    repo: unscience
    path: unscience/Patcher.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs
    title: unscience/Patcher.cs
  - id: unscience-mod
    repo: unscience
    path: unscience/Mod.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Mod.cs
    title: unscience/Mod.cs
  - id: dont-stifle-me-readme
    repo: unscience
    path: dont-stifle-me/README.md
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/dont-stifle-me/README.md
    title: dont-stifle-me/README.md
  - id: ksa-program
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: KSA.Program (decompiled, build 2026.10.10.5554)
  - id: ksa-gameviewport
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GameViewport.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GameViewport.cs
    title: KSA.GameViewport (decompiled, build 2026.10.10.5554)
---

KSA ships an intentionally empty public method, `Program.DrawProgramMenusHook()`, which the menu-bar
drawing code calls after the last built-in menu and before the version string. Patching it is the
least invasive way to put a mod's own menu or menu item on the game's top bar. unscience adds a
single "Unscience" item that toggles its window, as an alternative to F11.[^menu-bar-patch][^ksa-program]

Mechanism in one line: an attribute-declared Harmony postfix on `DrawProgramMenusHook` calls
`ImGui.MenuItem("Unscience")` and invokes a toggle callback injected by the host.

## How it works

- `MenuBarPatch` is a `[HarmonyPatch(typeof(Program), nameof(Program.DrawProgramMenusHook))]` class
  with a `[HarmonyPostfix]` method; `Apply` uses `harmony.CreateClassProcessor(typeof(MenuBarPatch)).Patch()`
  so the attribute patch runs on the caller's Harmony instance instead of `PatchAll`.
- The host sets `MenuBarPatch.ToggleWindow` (a `Action?`) to flip its `_windowVisible` field before
  applying.[^unscience-patcher][^unscience-mod]
- `Remove` unpatches postfixes on the method for the supermod's Harmony id only, leaving other mods'
  postfixes on the same hook intact.
- The Don't Stifle Me standalone host uses the same hook to add a whole top-level menu.[^dont-stifle-me-readme]

## Lifecycle and timing

`Program.DrawMenuBar(IGameViewport, int)` runs in the UI phase (`frame:draw-ui`), only while `DrawUI`
is true, and only for the viewport under the mouse: for the main window it is called from
`Program.OnDrawUiThreadSafe` when `HoveredViewport.IsMain()` (L3186-L3189), and a hovered secondary
viewport window draws its own menu bar from `GameViewport.DrawImGui` (`GameViewport.cs` L256). Inside it,
the hook call is at `Program.cs` L4005, within `ImGui.BeginMenuBar()`...`EndMenuBar()` and just before the
version string is right-aligned with `SetCursorPosY`/`SetCursorPosX` (L4008-L4009). A postfix therefore
draws in menu-bar context (`MenuItem`, `BeginMenu` are valid). For the main window this is after
StarMap's `[StarMapAfterGui]` in the same frame, so a click takes effect on the next frame's window
draw.[^ksa-program][^ksa-gameviewport]

## Key code

| Path | Role |
|---|---|
| [unscience/MenuBarPatch.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/MenuBarPatch.cs) | The postfix and apply/remove |
| [unscience/Patcher.cs](https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/unscience/Patcher.cs#L62-L66) | Injects the toggle and applies |

## Snippets

```csharp
// unscience/MenuBarPatch.cs L8-L33
[HarmonyPatch(typeof(Program), nameof(Program.DrawProgramMenusHook))]
internal static class MenuBarPatch
{
    public static Action? ToggleWindow { get; set; }

    public static void Apply(Harmony harmony)
    {
        harmony.CreateClassProcessor(typeof(MenuBarPatch)).Patch();
        Console.WriteLine("unscience: MenuBarPatch applied");
    }

    public static void Remove(Harmony harmony)
    {
        harmony.Unpatch(
            AccessTools.Method(typeof(Program), nameof(Program.DrawProgramMenusHook)),
            HarmonyPatchType.Postfix,
            harmony.Id);
    }

    [HarmonyPostfix]
    static void Postfix()
    {
        if (ImGui.MenuItem("Unscience"))
            ToggleWindow?.Invoke();
    }
}
```

```csharp
// current/decomp/KSA/Program.cs L4005-L4020
			DrawProgramMenusHook();
			if (viewport.IsMain())
			{
				ImGui.SetCursorPosY(cursorPosY);
				ImGui.SetCursorPosX((float)windowWidth - ImGui.CalcTextSize(VersionInfo.Current.VersionString).X - 10f);
				ImGui.TextColored(in Color.Gray.AsFloat4, VersionInfo.Current.VersionString);
			}
			ImGui.EndMenuBar();
		}
		ImGui.End();
		ConsoleStyle.PopWidgetStyle();
	}

	public void DrawProgramMenusHook()
	{
	}
```

## Game APIs touched

| Member | Decomp | Use |
|---|---|---|
| `Program.DrawProgramMenusHook()` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4018-L4020) | Empty public instance method intended as a mod seam |
| `Program.DrawMenuBar(IGameViewport, int)` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3455) | Caller; owns the `BeginMenuBar` scope |

## Pitfalls and version notes

- The hook is an instance method on `Program`; a postfix with no parameters works because Harmony does
  not require `__instance`.
- The hook runs once per menu bar drawn (main window or a hovered secondary viewport window); the
  version string is only drawn for the main viewport, but the hook is called regardless. Keep the postfix
  idempotent per call.
- The game only draws the menu bar while the mouse is over that viewport, so the item is not always on
  screen.
- Being empty, the method is a candidate for JIT inlining at the call site. The authors' scope notes record
  the postfix as verified through 5482, and the method is still present, public and empty in 5554; whether
  inlining ever bypasses it in a release build is not something this analysis could check (unverified).

## See also

- [jplrepo animated menu-bar text](./jplrepo-menu-bar-animation.md) (prefix on the same hook plus a transpiler)
- [Supermod host](./unscience-supermod-host.md)
- [Don't Stifle Me editor scaling](./dont-stifle-me-editor-free-scaling.md)
- [Mod overview](../overview.md)
- [Add a menu with a Harmony postfix on Program.DrawProgramMenusHook](../../../howto/ui/menus/add-items-to-the-game-menu-bar/add-items-to-the-game-menu-bar-1.md) - how-to article demonstrating this feature

[^menu-bar-patch]: unscience/MenuBarPatch.cs
[^ksa-program]: KSA.Program (decompiled, build 2026.10.10.5554)
[^unscience-patcher]: unscience/Patcher.cs
[^unscience-mod]: unscience/Mod.cs
[^dont-stifle-me-readme]: dont-stifle-me/README.md
[^ksa-gameviewport]: KSA.GameViewport (decompiled, build 2026.10.10.5554)
