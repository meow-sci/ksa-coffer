# Build an external SDK client or autopilot for the game over files and HTTP history

## 2026-10-10
* **Creation**: Added the overview and articles from the mod feature pages, checked against the decompiled game in build 2026.10.10.5554.
* **Update**: Review: corrected the claim that a paused game does not drain commands (Program.OnFrame keeps running during a simulation pause; only a game thread that does not reach the drain times out).
