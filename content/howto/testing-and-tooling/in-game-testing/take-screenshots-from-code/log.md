# Take clean screenshots from code, with a composed camera shot held for the capture history

## 2026-10-10
* **Creation**: Added the overview and five approaches (reflected ScreenshotCapture with a warm-up and manifest, composed SceneCamera shot, the lean building-relative variant, a view-pose claimant that can orbit, and the capture-button flag with player bundles) from the KSAGolf, KSAStructures, KSArmory and KSACars feature pages, checked against `ScreenshotCapture`, `Program` and `FixedController` in build 2026.10.10.5554.
* **Update**: Review: rewrote the article 5 background. `ScreenshotCapture.Request` only arms the state machine and `PrepareFrame` clears `DrawUI` on the next frame, so the reason to defer to the frame postfix is that UI hooks stop ticking, not that the pass vanishes mid-click.
