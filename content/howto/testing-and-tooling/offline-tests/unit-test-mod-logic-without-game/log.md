# Unit-test mod logic without launching the game history

## 2026-10-10
* **Creation**: Added the overview and five approaches (linked Sim folder, console executable, Python reference fixtures, NUnit suites, compile-gated Game folder) from the KSAGolf, KSACars, KSArmory, KSAStructures, KSAero, KSA-DeltaVMap, KSA-AdvancedFlightComputer, purrTTY and gatOS feature pages, checked against `Universe.GetLastSimStep`, `SimStep` and `Brutal.Numerics.double3` in build 2026.10.10.5554.
* **Update**: Review: attributed the `0.1 * surfaceArea` drag term to `PhysicsStates.ComputeDrag` (with link) instead of implying it lives in `VehicleProperties`; overview frontmatter now carries the union of game types and lifecycle values.
