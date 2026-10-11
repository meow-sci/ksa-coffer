# create-and-read-maneuver-nodes history

## 2026-10-10
* **Update**: Review against build 2026.10.10.5554: [CalculateBurnPatch pass by pass](create-and-read-maneuver-nodes-4.md) now uses the real parameter names of `FlightPlan.CalculateBurnPatch`, `ComputeCompleteTrajectory` (`polynomialOrderN`) and `CreateUninitialized(KeyHash)`, and no longer says the stock `SequencePerformanceList` is filled by `NearestOrbitAndPerformanceWorker`; the controlled vehicle's list is recomputed by `PhysicsBubble` on the vehicle worker while the Sequence or EngineControl canvas is enabled (`PhysicsBubble.cs` L793-L796). Related-topic lines now link instead of naming slugs.
* **Creation**: Wrote the overview and approach articles against game build 2026.10.10.5554.
