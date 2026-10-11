# Show a modal ImGui dialog during loading, before the game loop runs history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 2 how-to articles: [Loading dialog: a modal question modelled on ConfirmMods, with its own frame pump](show-a-dialog-during-loading-1.md); [Loading dialog: a PopupTask loop with ErrorAndExit](show-a-dialog-during-loading-2.md). Written from the pinned mod sources and checked against the decompiled game build 2026.10.10.5554.
* **Update**: Reviewed against build 2026.10.10.5554 and the lifecycle reference: article 2 corrected: `SelectSystem` pumps after `PrepareAll` and the asset preloads, not before `PrepareAll` returns; "Related topics, not yet written" lines replaced with links to the topics that now exist; overview `repos`, `lifecycle` and `game_types` widened to the union of the articles.
