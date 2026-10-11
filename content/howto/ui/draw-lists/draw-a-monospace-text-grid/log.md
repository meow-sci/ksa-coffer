# Draw per-frame text efficiently: monospace grids and allocation-free labels history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 3 how-to articles: [Draw a monospace cell grid with merged background rects, batched glyph runs and shape-drawn blocks](draw-a-monospace-text-grid-1.md); [Cache a display string until the shown value changes](draw-a-monospace-text-grid-2.md); [Format per-frame labels on the stack with stackalloc, SpanBuilder and the game unit formatters](draw-a-monospace-text-grid-3.md). Written from the pinned mod sources and checked against the decompiled game build 2026.10.10.5554.
* **Update**: Reviewed against build 2026.10.10.5554 and the lifecycle reference: overview `repos`, `lifecycle` and `game_types` widened to the union of the articles.
