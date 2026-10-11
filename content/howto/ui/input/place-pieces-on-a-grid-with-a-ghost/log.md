# Place pieces on a grid with a snapping ghost, top-down camera and world gizmos history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 2 how-to articles: [Place pieces on a grid: ray-plane cell pick, port-snapping ghost, top-down camera and per-viewport meshes](place-pieces-on-a-grid-with-a-ghost-1.md); [Place pieces with a ghost: gizmo rings anchored with GetPositionEgo](place-pieces-on-a-grid-with-a-ghost-2.md). Written from the pinned mod sources and checked against the decompiled game build 2026.10.10.5554.
* **Update**: Reviewed against build 2026.10.10.5554 and the lifecycle reference: article 1 input chain corrected: `ImGuiBackendGlfwImpl` forwards to `Program.OnKey` only for secondary platform windows under `InputFallthrough`; `Program` subscribes the main window itself; "Related topics, not yet written" lines replaced with links to the topics that now exist; overview `repos`, `lifecycle` and `game_types` widened to the union of the articles.
