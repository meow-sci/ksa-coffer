# Add mod-owned static colliders that vessels and kittens collide with history

## 2026-10-10
* **Creation**: Added [overview](overview.md) and 3 article(s): [Per-bubble static handles from a BeginStaticObjectPass postfix](add-static-colliders-to-physics-bubbles-1.md); [Worker prefixes on DetectCollisions and Simulate with statics registered as ground clutter](add-static-colliders-to-physics-bubbles-2.md); [Declare XML static objects and let the engine collide the nearest pad](add-static-colliders-to-physics-bubbles-3.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned mod repositories.
* **Update**: Review: `BeginStaticObjectPass` is called from `FullPhysicsConstrainedStep` once per contact pass, not from `FullPhysicsStepUntil`; overview lifecycle union; added `group` to frontmatter. Reviewed against decompiled build 2026.10.10.5554 and the pinned mod repositories.
