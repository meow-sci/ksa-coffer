# Change loaded game data at runtime and make the renderer rebuild from it history

## 2026-10-10
* **Creation**: Added the overview and 4 approach articles from the mod feature pages, checked against the decompiled game (build 2026.10.10.5554). 
* **Update**: Review: approach 4 corrected: a renderer rebuild does not rewrite the mapped biome-material buffer (written only in the `PlanetRenderer` constructor), so the mod must restore its own values.
