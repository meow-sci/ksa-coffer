# Game loop and mod lifecycle history

## 2026-10-11
* **Update**: Frame table row 23 now says `FrameNumber++` runs in `OnFrame` after the `PostRender` call (L2332), not inside `PostRender`.

## 2026-10-10
* **Creation**: Added [Game loop and mod lifecycle](overview.md) (engine background, approach comparison) and 4 how-to articles: [Hook the frame with StarMap lifecycle attributes](game-loop-and-lifecycle-1.md), [Hook any frame point with Harmony patches on Program and Universe](game-loop-and-lifecycle-2.md), [Mutate simulation state safely relative to the physics step](game-loop-and-lifecycle-3.md), [Run code inside the physics step on worker threads](game-loop-and-lifecycle-4.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned reference repositories.
