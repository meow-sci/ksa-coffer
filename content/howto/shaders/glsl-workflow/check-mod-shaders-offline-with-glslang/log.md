# Compile-check a mod's GLSL without launching the game history

## 2026-10-10
* **Creation**: Added [Compile-check a mod's GLSL without launching the game](overview.md) (3 approaches): [Check shaders offline: check-shaders.sh in a pre-push hook and CI, skipped without an install](check-mod-shaders-offline-with-glslang-1.md), [Check shaders offline: a per-folder check beside asset and mesh validation](check-mod-shaders-offline-with-glslang-2.md), [Check shaders offline: keep GLSL constants in step with C# using a regex text test](check-mod-shaders-offline-with-glslang-3.md). Written from the pinned mod checkouts and verified against the decompiled game build 2026.10.10.5554.
* **Update**: Independent review (claude-code/sonnet-5.5): the plain-text cross-reference to the pre-push hook and CI topic is now a link.
