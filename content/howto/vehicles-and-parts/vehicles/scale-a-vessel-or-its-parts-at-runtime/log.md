# Scaling a vessel or its parts at runtime history

## 2026-10-10
* **Update**: Review: replaced the lifecycle value editor:pre-render with frame:pre-render (Editor.OnPreRender runs inside Program.OnPreRender) and the non-type game_types entry KSA.ScaleGizmo with KSA.GenericGizmo.
* **Creation**: Added [Scaling a vessel or its parts at runtime](overview.md) and 4 approaches: [Scale a whole vessel with separate render, physics and collider channels](scale-a-vessel-or-its-parts-at-runtime-1.md); [Scale a vessel with a recursive Part.Scale write and an avatar scalar](scale-a-vessel-or-its-parts-at-runtime-2.md); [Scale parts per axis with captured baselines](scale-a-vessel-or-its-parts-at-runtime-3.md); [Lift the vehicle editor's part-scale limits with skipping prefixes and a bounds postfix](scale-a-vessel-or-its-parts-at-runtime-4.md). Written against game build 2026.10.10.5554 from the mod features cited in each article.
