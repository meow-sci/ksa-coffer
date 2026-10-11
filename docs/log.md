# Project documentation history

## 2026-10-10
* **Creation**: Added [Knowledge extraction pipeline](knowledge-pipeline.md) describing the two-phase agent pipeline, the briefs and catalogs under ai/, and the refresh workflow.
* **Update**: Corrected the lifecycle table in [Content bundle conventions](content-conventions.md) after the game-loop reference was verified against the decomp: `UpdateRenderingResources` runs in `Program.Render`, `OnFrameController` only syncs cursor mode, render phases are interleaved, and `StarMapAllModsLoaded` precedes `ModLibrary.AttachGameData`.
* **Creation**: Added [Content bundle conventions](content-conventions.md) defining the mods/howto bundle layout, custom `repos`/`game` pins, lifecycle vocabulary and code-reference rules.
