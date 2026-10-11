# Load a custom TTF font into KSA's ImGui atlas and keep it across font rebuilds history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 4 how-to articles: [Add a bundled TTF to the ImGui atlas at StarMapImmediateLoad and draw it at any size](load-a-custom-font-into-imgui-1.md); [Add fonts lazily on the first UI frame with the game's own ImFontConfig fields](load-a-custom-font-into-imgui-2.md); [Add a font family at StarMapAllModsLoaded under a renamed extension so KSA does not auto-load it](load-a-custom-font-into-imgui-3.md); [Keep mod fonts alive when the game rebuilds its font atlas](load-a-custom-font-into-imgui-4.md). Written from the pinned mod sources and checked against the decompiled game build 2026.10.10.5554.
* **Update**: Reviewed against build 2026.10.10.5554 and the lifecycle reference: article 1 frontmatter hooks gain `starmap StarMapAfterGui` (Compendium variation); overview `repos`, `lifecycle` and `game_types` widened to the union of the articles.
