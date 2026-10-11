# Reading staged delta-v, thrust and Isp from the game or from your own stage model history

## 2026-10-10
* **Update**: Review: article 4 now warns that a PlumbedCore.ResourceManager read in flight can rebuild managers on the UI thread if a post-dispatch edit dirtied the tree.
* **Creation**: Added [Reading staged delta-v, thrust and Isp from the game or from your own stage model](overview.md) and 4 approaches: [Read PartTree.PerformanceSequences paired by index with SequenceList.Sequences](read-staged-delta-v-from-the-game-1.md); [Keep a private SequencePerformanceList with a change-gated recompute](read-staged-delta-v-from-the-game-2.md); [Turn staging phases into constant-thrust stages for guidance](read-staged-delta-v-from-the-game-3.md); [Estimate stage delta-v yourself from tanks and engine cores](read-staged-delta-v-from-the-game-4.md). Written against game build 2026.10.10.5554 from the mod features cited in each article.
