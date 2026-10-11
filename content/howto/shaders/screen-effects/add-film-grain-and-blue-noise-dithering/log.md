# Add film grain and dither away banding history

## 2026-10-10
* **Creation**: Added [Add film grain and dither away banding](overview.md) (2 approaches): [Film grain: Ashima/Gustavson noise with soft-light blending on a push-constant clock](add-film-grain-and-blue-noise-dithering-1.md), [Dither with blue noise: a 128x128x64 STBN texture stacked in a 128x8192 PNG, slice picked from time](add-film-grain-and-blue-noise-dithering-2.md). Written from the pinned mod checkouts and verified against the decompiled game build 2026.10.10.5554.
* **Update**: Independent review (claude-code/sonnet-5.5): article 2 no longer says the OnFrameEditor postfix stops with the HUD hidden: it is `DrawHud`'s early returns that freeze the clock; overview row 2 notes the skipped XML; article 1 snippet range corrected.
