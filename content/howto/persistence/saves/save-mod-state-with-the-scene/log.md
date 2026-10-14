# Save a whole mod's scene state as versioned sidecar records, with reset and replay on load history

## 2026-10-13
* **Update**: Independently reviewed [the Blasto approach](save-mod-state-with-the-scene-4.md); qualified store replacement atomicity, retained the native-save/sidecar distinction and marked excerpt boundaries.

* **Update**: Integrated Blasto [Persist body-fixed exposure sites with save-bound sidecar transactions](save-mod-state-with-the-scene-4.md), linked all 3 source features and preserved existing approaches.


## 2026-10-10
* **Creation**: Added [Save a whole mod's scene state as versioned sidecar records, with reset and replay on load](overview.md) (engine background, approach comparison) and 3 how-to articles: [Persist feature state as ISaveParticipant records through a coordinator that retains what it cannot restore](save-mod-state-with-the-scene-1.md), [Pair each scene capture with its native write by object identity](save-mod-state-with-the-scene-2.md), [Hook native save and load with five patches, eight callbacks and a deferred world change](save-mod-state-with-the-scene-3.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned reference repositories.
* **Update**: Review pass against build 2026.10.10.5554. Timing claims (console and popup load origins, `PrepareFrame` handoff between `Apply*Solvers` and `GetJobSimStep`) re-checked against `Program.PrepareFrame`, `Program.OnKey` and `ConsoleWindow`; backticked topic names turned into links.
