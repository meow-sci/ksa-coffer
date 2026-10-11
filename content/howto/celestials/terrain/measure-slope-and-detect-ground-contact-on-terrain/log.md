# Measure ground slope and surface normal, and detect when a mod-simulated point hits the ground history

## 2026-10-10
* **Creation**: Added the overview and 3 approach articles from the mod feature pages, checked against the decompiled game (build 2026.10.10.5554). 
* **Update**: Review: approach 2 lifecycle corrected (the anchor and normal are computed in the panel's ImGui pass via `BesideControlled` and `TryCursor`; only entry creation is queued to the `Update` hook); approach 3 snippet gained a closing `// ...`.
