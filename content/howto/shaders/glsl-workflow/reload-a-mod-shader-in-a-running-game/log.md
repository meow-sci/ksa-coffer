# Recompile a mod's shader while the game runs history

## 2026-10-10
* **Creation**: Added [Recompile a mod's shader while the game runs](overview.md) (2 approaches): [Reload a mod shader: a bridge command that invokes FileReference.DoLoad by reflection and drops cached pipelines](reload-a-mod-shader-in-a-running-game-1.md), [Reload a mod shader: a reload command in a developer file bridge that an agent can drive](reload-a-mod-shader-in-a-running-game-2.md). Written from the pinned mod checkouts and verified against the decompiled game build 2026.10.10.5554.
* **Update**: Independent review (claude-code/sonnet-5.5): article 2 had an unresolved `[[ARM:...]]` source citation, now a pinned KSArmory link; plain-text cross-references now link to the file-bridge and MCP topics; snippet ranges corrected.
