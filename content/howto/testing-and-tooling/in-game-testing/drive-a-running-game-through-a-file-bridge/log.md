# Drive a running game from scripts through a file-drop command bridge history

## 2026-10-10
* **Creation**: Added the overview and five approaches (reference file bridge, reflection get/set and composed commands, lean visual bridge, manifest key gate, DEBUG flag gate) from the KSAGolf, KSACars, KSAStructures, KSArmory, KittenExtensions and KSA-DeltaVMap feature pages, checked against `Program.OnFrame`, `Universe`, `GameSaves` and `ModManifest` in build 2026.10.10.5554.
* **Update**: Review: cited the three plan features missing from article 1 (KSArmory bridge and MCP, KSAStructures dev bridge, KSAGolf putting session), dropped an unused `startup:game-loaded` lifecycle value, and reworded the claim that a button "cannot" start a capture in article 3 (a capture only clears `DrawUI` on the next `PrepareFrame`, so the real hazard is losing UI-hook ticks).
