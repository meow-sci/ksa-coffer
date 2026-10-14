# Place a static object on a planet surface at a latitude and longitude, and keep it anchored history

## 2026-10-13
* **Update**: Independently reviewed static frame conversion, collision-scale approximations, separate GameData and globally registered body clones; clarified the overview runtime scope and marked partial excerpts. Native scenario and collision checks remain unexecuted.
* **Update**: Added the Flexo approach with pinned source examples, explicit tool lifecycle and browser/native validation limits; preserved existing approaches where present.

## 2026-10-10
* **Creation**: Added the overview and 3 approach articles from the mod feature pages, checked against the decompiled game (build 2026.10.10.5554). 
* **Update**: Review: approach 3 now says which callers invoke `SuperMeshRenderSystem.ClearBuckets` (`RenderViewport`, `RenderGame`, `RenderEditor`) and that the kitten, parachute and seated-crew draws follow it.
