# Unit-test mod logic without launching the game history

## 2026-10-13
* **Update**: Independently reviewed [the Blasto approach](unit-test-mod-logic-without-game-6.md); added executable invocation examples and marked excerpt boundaries while retaining offline-versus-live validation limits.

* **Update**: Integrated Blasto [Validate production terrain math and shader transformations offline](unit-test-mod-logic-without-game-6.md), linked all 1 source feature and preserved existing approaches.


## 2026-10-10
* **Creation**: Added the overview and five approaches (linked Sim folder, console executable, Python reference fixtures, NUnit suites, compile-gated Game folder) from the KSAGolf, KSACars, KSArmory, KSAStructures, KSAero, KSA-DeltaVMap, KSA-AdvancedFlightComputer, purrTTY and gatOS feature pages, checked against `Universe.GetLastSimStep`, `SimStep` and `Brutal.Numerics.double3` in build 2026.10.10.5554.
* **Update**: Review: attributed the `0.1 * surfaceArea` drag term to `PhysicsStates.ComputeDrag` (with link) instead of implying it lives in `VehicleProperties`; overview frontmatter now carries the union of game types and lifecycle values.
