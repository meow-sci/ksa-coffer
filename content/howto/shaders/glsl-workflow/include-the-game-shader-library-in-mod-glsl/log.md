# Include KSA's own GLSL library from a mod shader history

## 2026-10-10
* **Creation**: Added [Include KSA's own GLSL library from a mod shader](overview.md) (3 approaches): [Include the game's shader library: a generated Shaders/Content/CoreAtmosphere.glsl pulling in atmosphere and texture headers](include-the-game-shader-library-in-mod-glsl-1.md), [Include the game's shader library: a generated KSAStructuresCore.glsl under a folder called Content](include-the-game-shader-library-in-mod-glsl-2.md), [Include the game's shader library: a relative include of a stock helper inside a patched copy](include-the-game-shader-library-in-mod-glsl-3.md). Written from the pinned mod checkouts and verified against the decompiled game build 2026.10.10.5554.
* **Update**: Independent review (claude-code/sonnet-5.5): article 1 now cites the KSAStructures `core-shader-library-include` feature the plan assigns to approach 1; article 3 snippet range corrected.
