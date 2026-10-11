# Test a mod against the real game with HeadlessHarness history

## 2026-10-10
* **Creation**: Added the overview and two approaches (consumer mod with a test base class, small oracle suite) from the KSA-AdvancedFlightComputer and KSA-DeltaVMap feature pages and test sources, checked against `Universe.GetElapsedSeconds`, `Program.PrepareFrame`, `Vehicle.CreateVehicle` and `TransferPlanner.PlanInterstellarFuel` in build 2026.10.10.5554. HeadlessHarness itself is external and its API is described only as the consumers use it.
* **Update**: Review: removed claims about harness threading that the consumer mods do not document, and corrected the `PartTree.FlushDirtyDerived` position (just before `ExecuteNextVehicleSolvers` in `PrepareFrame`).
