# Keep a searchable decompiled copy of the game next to your mod history

## 2026-10-10
* **Creation**: Added the overview and two approaches (gitignored refresh script with a version stamp, private-repository decompile with a diff narrowed to the mod's API surface) from the Compendium, KSArmory, KSACars and KSAGolf feature pages and tools, checked against the decompiled layout and `current/version.json` of build 2026.10.10.5554. The ilspycmd version is recommended to be fixed, but the scripts print it rather than enforce it.
* **Update**: Review: the decompile script only recommends one ilspycmd version (a comment plus a printed version) and does not enforce a pin; title, overview row and step 1 now say so.
