# Fly scripted scenarios unattended, report PASS or FAIL and A/B test variants history

## 2026-10-10
* **Creation**: Added the overview and three approaches (request-file scenario runner with tagged SCENARIO lines and budgets, bridge commands that load a save and step exact simulated seconds, seeded interleaved batch with rank-sum verdicts) from the KSArmory, KSACars, KSAGolf and KSAStructures feature pages and their tools/ scripts, checked against `GameSaves`, `Popup` and `Universe` in build 2026.10.10.5554.
* **Update**: Review: replaced "KSA cannot run headless" with the HeadlessHarness context, and corrected the auto-warp gotcha (the `simspeed` terminal action path `SetSimulationSpeedDirect` refuses during auto warp and above `SimSpeed.MaxSpeed`; the bare `SetSimulationSpeed` the bridge calls checks neither).
