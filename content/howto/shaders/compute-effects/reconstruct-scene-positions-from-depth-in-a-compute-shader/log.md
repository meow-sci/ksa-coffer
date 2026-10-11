# Reconstruct scene positions from the depth buffer and paint on them history

## 2026-10-10
* **Creation**: Added [Reconstruct scene positions from the depth buffer and paint on them](overview.md) (3 approaches): [Paint an exact ring on the ground: depth reconstruction, one dispatch per ring](reconstruct-scene-positions-from-depth-in-a-compute-shader-1.md), [Paint holes that stay on a moving hull: sub-part frames and a tile bitmask gather](reconstruct-scene-positions-from-depth-in-a-compute-shader-2.md), [Draw thousands of depth-tested streaks: project on the CPU, gather per tile, add before bloom](reconstruct-scene-positions-from-depth-in-a-compute-shader-3.md). Written from the pinned mod checkouts and verified against the decompiled game build 2026.10.10.5554.
* **Update**: Independent review (claude-code/sonnet-5.5): `Program.cs` anchors for the pre-bloom barrier and sunbloom calls corrected to L4911-L4917; snippet ranges corrected.
