# Creating and attaching parts to a live vessel and feeding runtime engines history

## 2026-10-10
* **Update**: Review: articles 2 and 3 now state that forced resource-manager rebuilds on the UI thread race the in-flight step, with the PrepareFrame flush as the safe baseline.
* **Creation**: Added [Creating and attaching parts to a live vessel and feeding runtime engines](overview.md) and 3 approaches: [Build an N x M grid of engines on a live vessel with a single part-tree rebuild](add-parts-to-a-live-vessel-1.md); [Wire FeedConnectors so runtime-created engines find propellant](add-parts-to-a-live-vessel-2.md); [Find the tanks an engine can draw from by walking ConsumptionOrder levels](add-parts-to-a-live-vessel-3.md). Written against game build 2026.10.10.5554 from the mod features cited in each article.
