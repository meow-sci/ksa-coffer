# Add a menu to the game's top menu bar history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 3 how-to articles: [Add a menu with a Harmony postfix on Program.DrawProgramMenusHook](add-items-to-the-game-menu-bar-1.md); [Add a menu with BeginMainMenuBar from StarMapBeforeGui, and why it is not KSA's bar](add-items-to-the-game-menu-bar-2.md); [Decorate the menu bar itself with a transpiler snapshot and a hook prefix](add-items-to-the-game-menu-bar-3.md). Written from the pinned mod sources and checked against the decompiled game build 2026.10.10.5554.
* **Update**: Reviewed against build 2026.10.10.5554 and the lifecycle reference: article 1 hooks gain `starmap StarMapAllModsLoaded`; other mods using `DrawProgramMenusHook` (gatOS, Kitten Engineer Redux, AFC) acknowledged; overview `repos`, `lifecycle` and `game_types` widened to the union of the articles.
