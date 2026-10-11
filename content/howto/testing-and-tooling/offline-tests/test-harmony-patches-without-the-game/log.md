# Test Harmony patches without running the game history

## 2026-10-10
* **Creation**: Added the overview and three approaches (stand-in KSA types with production patches, offline patch-apply check, IL-level transpiler tests and test-scoped Harmony owners) from the unscience, purrTTY and KSA-AdvancedFlightComputer feature pages and sources, checked against `Program.PrepareFrame`, `Program.DrawProgramMenusHook`, `TransferPlanner.DrawPlanWindow` and `SimStep` in build 2026.10.10.5554. purrTTY's throwaway patch-apply app is described in a skill and not checked in, so the sample is labelled adapted.
* **Update**: Review: fixed the purrTTY menu hook, which is a postfix (not a prefix) on `Program.DrawProgramMenusHook`; removed `HarmonyLib.PatchProcessor` from `game_types`; dropped an unverified thread claim about harness test runs.
