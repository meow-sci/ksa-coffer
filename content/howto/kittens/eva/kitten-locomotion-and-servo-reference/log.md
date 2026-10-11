# Kitten locomotion, modes and the servo, from the decompiled game history

## 2026-10-10
* **Update**: Review: locomotion and servo steps are per physics timestep (slices of at most 1/60 s inside PhysicsBubble.FullPhysicsConstrainedStep, possibly several per frame), not once per dispatched step.
* **Creation**: Added [Kitten locomotion, modes and the servo, from the decompiled game](overview.md) and 2 How-To articles ([kitten-locomotion-and-servo-reference-1](kitten-locomotion-and-servo-reference-1.md), [kitten-locomotion-and-servo-reference-2](kitten-locomotion-and-servo-reference-2.md)) against game build 2026.10.10.5554 from the kittens-1 batch plan; every game member named was grepped in the decompile and every code snippet was checked line by line against the pinned checkouts.
