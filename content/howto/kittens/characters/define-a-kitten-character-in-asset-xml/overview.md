---
type: Game Feature
title: Read and extend the character asset XML (characters, fur, expressions, attachments)
description: How CharacterAssets.xml composes a Character from shared core, textures, fur, expression, animation and attachment blocks, how the game registers, lists and renders it, and what no reference mod has tested
topic: define-a-kitten-character-in-asset-xml
category: kittens
group: characters
approaches: 1
game_types: [KSA.CharacterReference, KSA.CharacterCoreReference, KSA.CharacterAttachmentReference, KSA.CharacterTexturesReference, KSA.CharacterFurReference, KSA.CharacterExpressionsReference, KSA.CharacterGroundAnimationsReference, KSA.ModLibrary, KSA.CharacterAvatar, KSA.KittenRosterData]
lifecycle: [startup:asset-load]
demonstrated_by: [mods/unscience/features/doh-kitten-spawning, mods/unscience/features/kitten-animations-clip-catalog, mods/ksagolf/features/kitten-held-props]
tags: [kitten, character, asset-xml, xml-asset, fur, attachments, expressions]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:47:38Z }
repos:
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-ksa-assetbundle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: KSA.AssetBundle (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-characterreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterReference.cs
    title: KSA.CharacterReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-charactercorereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterCoreReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterCoreReference.cs
    title: KSA.CharacterCoreReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-characterattachmentreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAttachmentReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAttachmentReference.cs
    title: KSA.CharacterAttachmentReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-modlibrary
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs
    title: KSA.ModLibrary (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-characteravatar
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAvatar.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs
    title: KSA.CharacterAvatar (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrosterdata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRosterData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRosterData.cs
    title: KSA.KittenRosterData (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-subassetreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SubAssetReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SubAssetReference.cs
    title: KSA.SubAssetReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-serializedid
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SerializedId.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedId.cs
    title: KSA.SerializedId (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kitteneva
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenEva.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenEva.cs
    title: KSA.KittenEva (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRenderable.cs
    title: KSA.KittenRenderable (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-kittenrosterentrydata
    repo: ksa-game-assemblies
    path: current/decomp/KSA/KittenRosterEntryData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRosterEntryData.cs
    title: KSA.KittenRosterEntryData (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-gltf2reference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Gltf2Reference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Gltf2Reference.cs
    title: KSA.Gltf2Reference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-charactertexturesreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterTexturesReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterTexturesReference.cs
    title: KSA.CharacterTexturesReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-charactergroundanimationsreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterGroundAnimationsReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterGroundAnimationsReference.cs
    title: KSA.CharacterGroundAnimationsReference (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-characterattachmenttype
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CharacterAttachmentType.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAttachmentType.cs
    title: KSA.CharacterAttachmentType (decompiled, build 2026.10.10.5554)
  - id: ksa-ksa-catfurrenderable
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CatFurRenderable.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CatFurRenderable.cs
    title: KSA.CatFurRenderable (decompiled, build 2026.10.10.5554)
  - id: unscience-doh-lib-spawning-kittenspawner-catalog-cs
    repo: unscience
    path: doh.lib/Spawning/KittenSpawner.Catalog.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/doh.lib/Spawning/KittenSpawner.Catalog.cs
    title: doh.lib/Spawning/KittenSpawner.Catalog.cs
  - id: unscience-kitten-animations-lib-kittenanimationcatalog-cs
    repo: unscience
    path: kitten-animations.lib/KittenAnimationCatalog.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/kitten-animations.lib/KittenAnimationCatalog.cs
    title: kitten-animations.lib/KittenAnimationCatalog.cs
  - id: ksagolf-docs-ksa-modding-notes-md
    repo: KSAGolf
    path: docs/KSA-MODDING-NOTES.md
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/docs/KSA-MODDING-NOTES.md
    title: docs/KSA-MODDING-NOTES.md
---
Every kitten the game draws is described by a `Character` element in asset XML. The element does not hold data itself: it points, by `Id`, at a set of shared blocks (the body and skeleton, the textures, the fur, the expression clips, the ground and MMU animation sets, the ear mask, the helmet, visor and MMU attachments) and the game composes a `CharacterAvatar` from them at runtime. This topic is a reference to those elements, grounded in the stock `CharacterAssets.xml` and the loader classes. It is engine-only: **no reference mod declares a new `Character`**, so everything about extending it is read from the code and untested in a running game. The three stock characters (`HunterKitten`, `BanjoKitten`, `PolarisKitten`) differ only in personality and textures.

## Engine background

| Type | Role | Source |
|---|---|---|
| `AssetBundle.Assets` | The list that maps the element names `Character`, `CharacterCore`, `CharacterAttachment`, `CharacterFur`, `CharacterExpressions`, `CharacterMMUAnimations`, `CharacterAnimationMasks`, `CharacterGroundAnimations`, `CharacterTextures` (and `GltfFile`, `PbrMaterial`, `Texture`) to classes | [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L43-L51) |
| `CharacterReference` | The `Character` element; `OnDataLoad` loads every child block and registers the character | [current/decomp/KSA/CharacterReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterReference.cs#L7-L89) |
| `Character*Reference` blocks | One class per block, each registers itself in a `ModLibrary.AllCharacter*` collection when it is a definition rather than an `Id` reference | [current/decomp/KSA/CharacterCoreReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterCoreReference.cs), [current/decomp/KSA/CharacterAttachmentReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAttachmentReference.cs) |
| `ModLibrary.AllCharacters` | `internal static readonly SerializedCollection<CharacterReference>` that the roster and spawners pick from | [current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L100-L116) |
| `CharacterAvatar` | Built from a `CharacterReference` by `InitalizeFromCharacterRef`; gives the runtime structs | [current/decomp/KSA/CharacterAvatar.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterAvatar.cs#L344-L445) |
| `KittenRosterData` | The roster: three fixed kittens, the rest filled with a random registered character | [current/decomp/KSA/KittenRosterData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/KittenRosterData.cs#L24-L47) |

Two loader rules explain how the XML is written:

- **Definition or reference.** Each block decides what it is from its own content: `CharacterCore` is a reference when it has no `BodySource`, `CharacterFur` when it has no `FurMeshIndex`, `CharacterExpressions` when it has no `ExpressionCenterIndex`, `CharacterAttachment` when it has no `Source`, `CharacterGroundAnimations` when it has no `AnimIdle`, `CharacterTextures` when none of the three materials is set. A reference (`<CharacterCore Id="CharacterCore"/>`) is looked up in the registered collection later by `Get()`; a definition registers itself. `CharacterReference` registers only when its resolved core has a `BodySource` ([current/decomp/KSA/CharacterReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CharacterReference.cs#L65-L89)). Order therefore matters: a block must be loaded before the `Character` that references it ([mod XML load order](../../../assets/asset-xml/mod-xml-load-order/overview.md)).
- **Bones are named.** `BoneReference` (used for eyes, sockets, the expression centre, ear masks) resolves `Name` case-insensitively against the skeleton's `BoneNames` and falls back to `Index`; a name that is not on the skeleton and has no `Index` throws ([current/decomp/KSA/SubAssetReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SubAssetReference.cs)).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1. Compose a Character from the shared asset blocks](define-a-kitten-character-in-asset-xml.md) | unscience, KSAGolf (read-only evidence) | `xml-asset` | `startup:asset-load` | Engine XML plus three mods that read the loaded result back; a new `Character` is untested |

## See also

- [Asset XML element reference](../../../assets/asset-xml/asset-xml-element-reference/overview.md), [Mod XML load order](../../../assets/asset-xml/mod-xml-load-order/overview.md)
- [Reach a kitten's avatar, skeleton, bones and animation catalog](../reach-a-kittens-avatar-and-skeleton/overview.md), [Spawn an EVA kitten from code](../spawn-an-eva-kitten-from-code/overview.md)
- [Attach a prop to a kitten's hand or another bone at runtime](../../appearance/attach-a-prop-to-a-kitten-bone/overview.md), [Make a kitten pull a facial expression](../../animation/make-a-kitten-pull-a-facial-expression/overview.md)
- [Declare post-processing shader assets in XML](../../../shaders/post-processing/declare-post-processing-shader-assets-in-xml/overview.md)
- [Game loop and lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
