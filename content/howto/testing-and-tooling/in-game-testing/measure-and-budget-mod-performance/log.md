# Measure what a mod costs per frame, throttle expensive work and warm up hot code history

## 2026-10-10
* **Creation**: Added the overview and six approaches (DEBUG-only scope with a periodic report, always-on single-writer counters, nested budget spans, GPU cost from the game profiler with a pinned view, wall-clock throttle with a state-version check, Task.Run PrepareMethod sweep) from the KSA-DeltaVMap, gatOS, KSArmory, KSA-MeasureTools and KSA-AdvancedFlightComputer feature pages, checked against `GpuProfiler`, `Profiler`, `ProfilerFrame` and `Program.OnFrame` in build 2026.10.10.5554.
* **Update**: Review: grounded the one-thirtieth-of-a-second claim in `App.Run` (player delta clamped to `1 / Simulation.MinTargetFrameRate`, default 30) and `Universe.GetJobSimStep`; fixed the overview count of instruments and fixes.
