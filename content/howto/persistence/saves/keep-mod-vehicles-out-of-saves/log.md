# Keep mod-only vehicles out of save files history

## 2026-10-10
* **Creation**: Added [Keep mod-only vehicles out of save files](overview.md) (engine background, approach comparison) and 1 how-to article: [Filter your own craft out of Universe.SerializeSystems](keep-mod-vehicles-out-of-saves.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned reference repositories.
* **Update**: Review pass against build 2026.10.10.5554. `UniverseData.Create`, `Universe.SerializeSystems` (single caller) and `CelestialSystem.SerializeSave` re-checked; no content changes.
