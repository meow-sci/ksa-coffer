# Persist mod settings in a hand-rolled ini file history

## 2026-10-10
* **Creation**: Added [Persist mod settings in a hand-rolled ini file](overview.md) (engine background, approach comparison) and 4 how-to articles: [Rewrite a flat settings.ini on every widget change](persist-mod-settings-ini-1.md), [Load settings first at StarMapImmediateLoad and rewrite on change](persist-mod-settings-ini-2.md), [Save an eleven-key hud.ini only when the player presses a button](persist-mod-settings-ini-3.md), [Write a sectioned palette file when a dirty flag is set, on window close and at unload](persist-mod-settings-ini-4.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned reference repositories.
* **Update**: Review pass. Engine and timing claims (`StarMapImmediateLoad` after `ImGui.CreateContext`, `StarMapUnload` after unpatching) re-checked; backticked topic names turned into links.
