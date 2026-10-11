# Refilling, draining and topping up a vehicle's propellant and batteries history

## 2026-10-10
* **Update**: Review: clarified in article 3 that PerformanceSequences.SetDirty matters to IsDirty and RecomputeIfDirty readers and that the default flight recompute runs on the vehicle-solver worker every step; clamped over-long line anchors.
* **Creation**: Added [Refilling, draining and topping up a vehicle's propellant and batteries](overview.md) and 3 approaches: [Keep a vehicle's fuel and batteries full with a refill before the solver snapshot](refill-or-drain-resources-1.md); [Refuel on demand from a command queue drained in the solver window](refill-or-drain-resources-2.md); [Drain a tank through its mole states and recompute mass](refill-or-drain-resources-3.md). Written against game build 2026.10.10.5554 from the mod features cited in each article.
