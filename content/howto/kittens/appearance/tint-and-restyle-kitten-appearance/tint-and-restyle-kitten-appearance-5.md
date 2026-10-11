---
type: How-To
title: Hide the helmet, visor and MMU per avatar by clearing Helmet.Enabled and Mmu.Enabled
description: "Clear the public Enabled flags on CharacterAvatar.Attachments.Helmet and Mmu, remember the old values, and restore them on let-go, with no Harmony patch"
topic: tint-and-restyle-kitten-appearance
category: kittens
group: appearance
approach: 5
difficulty: beginner
prerequisites: [starmap]
demonstrated_by: [mods/ksagolf/features/putting-session, mods/ksagolf/features/kitten-pose-processor]
techniques: [reflection]
game_types: [KSA.CharacterAvatar, KSA.KittenRenderable, KSA.KittenEva]
lifecycle: [frame:draw-ui, frame:render]
hooks: 
  - "starmap StarMapAfterGui"
  - "reflection KSA.KittenRenderable._characterAvatar"
tags: [kitten, helmet, mmu, attachments, ksagolf]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:15:22Z }
status: stable
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-characteravatar-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAvatar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs
    title: KSA.CharacterAvatar (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrenderable-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksagolf-src-ksagolf-ksa-kittenposeprobe-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/KittenPoseProbe.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/KittenPoseProbe.cs
    title: src/KSAGolf/Ksa/KittenPoseProbe.cs
  - id: ksagolf-src-ksagolf-ksa-golf-cs
    repo: KSAGolf
    path: src/KSAGolf/Ksa/Golf.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/Golf.cs
    title: src/KSAGolf/Ksa/Golf.cs
---
The simplest way to hide a kitten's helmet and visor, or its MMU backpack, is to flip public flags the engine already honours: `CharacterAvatar.Attachments.Helmet.Enabled` and `Attachments.Mmu.Enabled`. The draw code skips an attachment unless `HasAttachment` (which includes `Enabled`) is true, and the engine itself sets both flags false for seated renderables. No patch is needed, the change is per avatar, and it is trivially reversible. Prerequisites: StarMap and a way to reach the avatar ([reach a kitten's avatar and skeleton](../../characters/reach-a-kittens-avatar-and-skeleton/overview.md)). Demonstrated by KSAGolf, which plays a round bareheaded: [Putting session](../../../../mods/ksagolf/features/putting-session.md) and [Kitten pose processor](../../../../mods/ksagolf/features/kitten-pose-processor.md). Compare [approach 4](tint-and-restyle-kitten-appearance-4.md), the transpiler that hides only the visor globally.

## Background: how the game does it

`Helmet`, `Mmu` and the cosmetic entries are public structs on `CharacterAvatar.Attachments`. For the helmet and the MMU `HasAttachment` requires `Enabled`; the helmet draws both shell and visor, so `Enabled = false` hides them together:

```csharp
// current/decomp/KSA/CharacterAvatar.cs L103-L117
	public struct Helmet
	{
		public bool Enabled = true;

		public StaticMeshRenderable? HelmetMesh = null;

		public StaticMeshRenderable? VisorMesh = null;

		public int SocketIndex = 0;

		public float4x4 HelmetTransform = default(float4x4);

		public float4x4 VisorTransform = default(float4x4);

		public readonly bool HasAttachment => HelmetMesh != null && VisorMesh != null && Enabled;
```

```csharp
// current/decomp/KSA/CharacterAvatar.cs L124-L136
	public struct Mmu
	{
		public bool Enabled = true;

		public AnimatedRenderable? MmuMesh = null;

		public AnimationScrubSampler? ArmScrub = null;

		public int SocketIndex = 0;

		public float4x4 Transform = default(float4x4);

		public readonly bool HasAttachment => MmuMesh != null && Enabled;
```

`KittenRenderable.UpdateRenderData` consults `HasAttachment` for the helmet and the MMU, but the cosmetic attachment loop does not check `Enabled` or `HasAttachment` (see [attach a prop to a kitten bone](../attach-a-prop-to-a-kitten-bone/overview.md)):

```csharp
// current/decomp/KSA/KittenRenderable.cs L363
		if (_characterAvatar.Attachments.Helmet.HasAttachment)
```

```csharp
// current/decomp/KSA/KittenRenderable.cs L372
		if (_characterAvatar.Attachments.Mmu.HasAttachment)
```

The engine uses the same switch for seated crew:

```csharp
// current/decomp/KSA/KittenRenderable.cs L238-L242
		if (seated)
		{
			_characterAvatar.Attachments.Mmu.Enabled = false;
			_characterAvatar.Attachments.Helmet.Enabled = false;
			_nextIdleActionTime = float.Lerp(45f, 75f, Random.Shared.NextSingle());
```

Compare the other public per-view switch, `KittenRenderable.HideHead`, which an IVA seat sets from `IsCameraInThisSeat(viewport)` and which hides only the masked head meshes and the fur ([hide a kitten's body from one viewport](../hide-a-kitten-body-from-one-viewport/overview.md)).

## Lifecycle and timing

| Step | Where | Lifecycle |
|---|---|---|
| Flip the flags | KSAGolf's per-step update (`Golf.Hold`) from `[StarMapAfterGui]`, or the hidden-HUD fallbacks | `frame:draw-ui` |
| The engine reads them | `KittenRenderable.UpdateRenderData` per view | `frame:render` |

The flags are plain fields read during the render, so a flip made in the UI phase applies to the same frame in every view that draws the kitten. Restore the previous values (not `true`) when you let go, so you do not re-enable parts the engine or another mod disabled. See the [game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Steps

1. **Get the avatar** (private `_characterAvatar` by reflection, see the sibling topic). KSAGolf wraps it in a probe:

```csharp
// src/KSAGolf/Ksa/KittenPoseProbe.cs L23
    public static CharacterAvatar? AvatarOf(KittenEva kitten) => AvatarField?.GetValue(kitten.Renderable) as CharacterAvatar;
```

2. **Remember and clear the flags** when you take over the kitten. `Attachments` is a struct field of the avatar and `Mmu`/`Helmet` are struct fields inside it, so assigning through the chain on the avatar object writes the live data:

```csharp
// src/KSAGolf/Ksa/Golf.cs L498-L503
        // The MMU's hand controllers ride the forearms and cover the paws holding the grip, and a round of
        // golf is played bareheaded.
        _mmuWas = avatar.Attachments.Mmu.Enabled;
        avatar.Attachments.Mmu.Enabled = false;
        _helmetWas = avatar.Attachments.Helmet.Enabled;
        avatar.Attachments.Helmet.Enabled = false;
```

3. **Restore them** when you let go, along with whatever else you changed:

```csharp
// src/KSAGolf/Ksa/Golf.cs L528-L529
            avatar.Attachments.Mmu.Enabled = _mmuWas;
            avatar.Attachments.Helmet.Enabled = _helmetWas;
```

4. **Check the result.** Hold the putter: the helmet and the MMU disappear together on the controlled kitten, in every view, while other kittens keep theirs; putting the club away brings them back.

## Complete example

- [src/KSAGolf/Ksa/Golf.cs](https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/Golf.cs) - `Hold` and `LetGo`.
- [src/KSAGolf/Ksa/KittenPoseProbe.cs](https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/src/KSAGolf/Ksa/KittenPoseProbe.cs) - `AvatarOf`.
- Feature pages: [Putting session](../../../../mods/ksagolf/features/putting-session.md), [Kitten pose processor](../../../../mods/ksagolf/features/kitten-pose-processor.md).

## Variations and gotchas

- **Helmet and visor go together.** There is no flag for the visor alone; use [approach 4](tint-and-restyle-kitten-appearance-4.md) for that.
- **Save the old value.** The engine already sets both flags false for seated renderables; restoring `true` blindly would re-enable them.
- **Cosmetic attachments need removal, not a flag.** The attachment loop ignores `Enabled`; remove the entry from `CosmeticAttachments` and `Dispose()` the mesh.
- **Reflection only for the avatar.** Everything after `_characterAvatar` is public typed access.
- **Version note.** KSAGolf was built against 2026.9.22.5482; the attachment structs and `UpdateRenderData` branches shown here are as in build 2026.10.10.5554.

## See also

- [Topic overview](overview.md); siblings: [approach 1](tint-and-restyle-kitten-appearance-1.md), [approach 2](tint-and-restyle-kitten-appearance-2.md), [approach 3](tint-and-restyle-kitten-appearance-3.md), [approach 4](tint-and-restyle-kitten-appearance-4.md)
- Mod features: [Putting session](../../../../mods/ksagolf/features/putting-session.md), [Kitten pose processor](../../../../mods/ksagolf/features/kitten-pose-processor.md)
- [Attach a prop to a kitten bone](../attach-a-prop-to-a-kitten-bone/overview.md), [Hide a kitten's body from one viewport](../hide-a-kitten-body-from-one-viewport/overview.md), [Animate and draw seated kitten crew](../../animation/animate-and-draw-seated-kitten-crew/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
