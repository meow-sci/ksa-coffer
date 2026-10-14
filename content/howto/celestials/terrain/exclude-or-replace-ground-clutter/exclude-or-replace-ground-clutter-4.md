---
type: How-To
title: Audit and update an offline ground-clutter generator for current asset contracts
description: Retain a legacy atlas and GLB pipeline while adapting its obsolete clutter declarations and random-selection assumptions to the pinned game
topic: exclude-or-replace-ground-clutter
category: celestials
group: terrain
approach: 4
difficulty: advanced
prerequisites:
  - flexo-source
  - bun
  - png-source-assets
  - native-clutter-xml
demonstrated_by:
  - mods/flexo/features/offline-ground-clutter-generation
techniques:
  - xml-asset
  - glb-model
  - texture-atlas
  - offline-generation
game_types:
  - KSA.ClutterEcotypeReference
  - KSA.ClutterObjectTemplate
  - KSA.GroundClutterLodReference
  - KSA.ClutterEcotypeRenderData
  - KSA.AssetBundle
  - KSA.SerializedReference
  - KSA.SystemTemplate
lifecycle:
  - tool:build
hooks: []
tags:
  - flexo
  - asset-authoring
  - celestials
  - compatibility
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:17:50Z
status: stable
repos:
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: source-game-current-decomp-ksa-assetbundle-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/AssetBundle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs
    title: current/decomp/KSA/AssetBundle.cs
  - id: source-game-current-decomp-ksa-clutterobjecttemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterObjectTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterObjectTemplate.cs
    title: current/decomp/KSA/ClutterObjectTemplate.cs
  - id: source-game-current-decomp-ksa-groundclutterlodreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GroundClutterLodReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs
    title: current/decomp/KSA/GroundClutterLodReference.cs
  - id: source-game-current-decomp-ksa-clutterecotypereference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterEcotypeReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeReference.cs
    title: current/decomp/KSA/ClutterEcotypeReference.cs
  - id: source-flexo-scripts-build-cartoon-moon-ts
    repo: flexo
    path: scripts/build-cartoon-moon.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts
    title: scripts/build-cartoon-moon.ts
  - id: source-flexo-src-ktx-encodektx2-ts
    repo: flexo
    path: src/ktx/encodeKtx2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts
    title: src/ktx/encodeKtx2.ts
  - id: source-game-current-decomp-ksa-serializedreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SerializedReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedReference.cs
    title: current/decomp/KSA/SerializedReference.cs
  - id: source-game-current-decomp-ksa-meshatlasfilereference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/MeshAtlasFileReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs
    title: current/decomp/KSA/MeshAtlasFileReference.cs
  - id: source-game-current-decomp-ksa-pbrmaterialreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PbrMaterialReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs
    title: current/decomp/KSA/PbrMaterialReference.cs
  - id: source-game-current-decomp-ksa-groundcluttermaterialreference-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GroundClutterMaterialReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterMaterialReference.cs
    title: current/decomp/KSA/GroundClutterMaterialReference.cs
  - id: source-game-current-content-core-shaders-planet-groundclutter-generate-comp
    repo: ksa-game-assemblies
    path: current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp
    title: current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp
  - id: source-game-current-decomp-ksa-clutterecotyperenderdata-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ClutterEcotypeRenderData.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeRenderData.cs
    title: current/decomp/KSA/ClutterEcotypeRenderData.cs
  - id: source-game-current-decomp-ksa-systemtemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: current/decomp/KSA/SystemTemplate.cs
---

Flexo includes a Bun script that turns PNG images into a shared texture atlas and quad, crossed-card or cylinder GLBs, then clones a moon and writes a scenario. Use its image/geometry pipeline as an offline authoring example. Its unmodified XML output is incompatible with the pinned KSA build; complete the contract changes below before treating the result as an installable asset mod.

## Background: how the game does it

The current AssetBundle accepts MeshAtlas, GroundClutterMaterial and ClutterObject assets. A full ClutterObject definition needs an Atlas ID and exactly five LODs; each LOD names existing meshes and ID-references already declared materials. The ecotype’s material list is not serialized XML.[^source-game-current-decomp-ksa-assetbundle-cs][^source-game-current-decomp-ksa-clutterobjecttemplate-cs][^source-game-current-decomp-ksa-groundclutterlodreference-cs][^source-game-current-decomp-ksa-clutterecotypereference-cs]

## Lifecycle and timing

This is tool:build work. The generator reads files and writes a mod directory; it has no game callback. Registration, texture loading and terrain rendering happen only when KSA later consumes the generated package. No adapted output was loaded into KSA for this article. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Isolate generated output and preserve the binary pipeline

Work on a local copy of scripts/build-cartoon-moon.ts. Supply PNG inputs and the pinned Astronomicals.xml through its parsed options ([scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L61-L120)), using a disposable output directory: the script removes the generated texture and mesh subdirectories before writing. Decode, resize with alpha-weighted color, key the background, pack tiles and generate UVs against the shared atlas.

```typescript
// scripts/build-cartoon-moon.ts L742-L754
// ... enclosing context omitted
  for (let i = 0; i < files.length; i++) {
    let name = args.names?.[i] ?? nameFromPath(files[i])
    while (usedNames.has(name)) name += '_'
    usedNames.add(name)
    let img = decodePng(await Bun.file(files[i]).arrayBuffer())
    img = applyBackgroundKey(fitToMaxSize(img, args.maxSize), args.bg)
    faces.push(img)
    chars.push({ name })
  }

  const cylinder = args.shape === 'cylinder'
  const tile = Math.min(512, Math.floor(2048 / Math.ceil(Math.sqrt(faces.length))))
  const { atlas, rects } = buildAtlas(faces, tile)
// ... enclosing context omitted
```

Follow [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L153-L300) for image operations and [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L301-L504) for mesh generation. Generated glTF mesh names must be globally unique, not merely unique filenames. The current encoder accepts Zstd but no sRGB option and emits RGBA8 UNORM ([src/ktx/encodeKtx2.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ktx/encodeKtx2.ts#L47-L84)); remove the stale srgb options rather than assuming they select an sRGB format.

### 2. Replace the obsolete declaration boundary

The old helper emits Name and no Atlas:

```typescript
// scripts/build-cartoon-moon.ts L519-L525
function clutterObjectXml(id: string, mesh: string): string {
  return `                <ClutterObject Name="${id}">
                    <LODs>
${lodsXml(mesh)}
                    </LODs>
                </ClutterObject>`
}
```

Change it to emit an Id plus Atlas, declare each GLB through MeshAtlas, and remove Path from LOD Mesh references. [current/decomp/KSA/SerializedReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedReference.cs#L6-L32) exposes only Id for those references. [current/decomp/KSA/MeshAtlasFileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/MeshAtlasFileReference.cs#L26-L48) loads the file and registers its actual glTF mesh names. Move the nested ecotype Material declaration into a top-level GroundClutterMaterial asset; keep only Material Id references in LODs. Expected output has no inline file-loading assumption inside a LOD.

### 3. Emit a minimal current-contract asset block

The following is an adapted schema example, not output produced by the unchanged script. It assumes a GLB containing one mesh named CofferCard with one effective material index, and four existing texture files at the shown mod-relative paths. Replace all IDs and paths together with your generated names. [current/decomp/KSA/PbrMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs#L12-L19) and [current/decomp/KSA/GroundClutterMaterialReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterMaterialReference.cs#L28-L41) define the texture and flag children.

```xml
<!-- adapted from scripts/build-cartoon-moon.ts; current contract in
     current/decomp/KSA/ClutterObjectTemplate.cs and GroundClutterLodReference.cs -->
<Assets>
  <MeshAtlas Id="CofferAtlas" Path="Meshes/Clutter/CofferCard.glb" />
  <GroundClutterMaterial Id="CofferMaterial">
    <Diffuse Id="CofferDiffuse" Path="Textures/Clutter/diffuse.ktx2" />
    <Normal Id="CofferNormal" Path="Textures/Clutter/normal.ktx2" />
    <AoRoughMetal Id="CofferOrm" Path="Textures/Clutter/orm.ktx2" />
    <Opacity Id="CofferOpacity" Path="Textures/Clutter/opacity.ktx2" />
    <UseTerrainMask Value="false" />
    <DoubleSided Value="true" />
  </GroundClutterMaterial>
  <ClutterObject Id="CofferObject" Atlas="CofferAtlas">
    <LODs>
      <LOD MinScreenSize="100"><Mesh Id="CofferCard" /><Material Id="CofferMaterial" /></LOD>
      <LOD MinScreenSize="50"><Mesh Id="CofferCard" /><Material Id="CofferMaterial" /></LOD>
      <LOD MinScreenSize="20"><Mesh Id="CofferCard" /><Material Id="CofferMaterial" /></LOD>
      <LOD MinScreenSize="5"><Mesh Id="CofferCard" /><Material Id="CofferMaterial" /></LOD>
      <LOD MinScreenSize="0"><Mesh Id="CofferCard" /><Material Id="CofferMaterial" /></LOD>
    </LODs>
  </ClutterObject>
</Assets>
```

These five levels deliberately reuse the mesh to demonstrate the required shape, not optimized LOD geometry. A LOD’s material-reference count must equal the number of distinct atlas material indices its meshes use ([current/decomp/KSA/GroundClutterLodReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs#L102-L121)). Add this XML to the manifest before the body asset, or emit these declarations before the body in its existing Assets document.

### 4. Reference those assets from the ecotype and remove the spare

Retain the body’s valid Placement fields, including a resolvable distribution texture, and replace its full legacy object blocks with ID references such as the adapted fragment below. The current ecotype loads and replaces references through Get:

```csharp
// current/decomp/KSA/ClutterEcotypeReference.cs L192-L205
// ... enclosing context omitted
	public void OnDataLoad(Mod mod)
	{
		if (!mod.Preload)
		{
			for (int i = 0; i < ClutterObjects.Count; i++)
			{
				ClutterObjects[i].OnDataLoad(mod);
				ClutterObjects[i] = ClutterObjects[i].Get();
			}
			PopulateMaterialReferences();
			Placement.OnDataLoad(mod);
			CollisionType.OnDataLoad(mod);
		}
	}
// ... enclosing context omitted
```

```xml
<!-- adapted from scripts/build-cartoon-moon.ts groundClutterXml:
     child of the existing Ecotype, alongside its Placement element -->
<ClutterObject Id="CofferObject" />
```

Delete the extra _spare object. The shader selects min(uint(random * NumObjects), NumObjects - 1), so its final object is selectable ([current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/Content/Core/Shaders/Planet/GroundClutter/Generate.comp#L492-L503)); keeping a duplicate biases that image. The renderer rejects more than 256 total object-LOD entries ([current/decomp/KSA/ClutterEcotypeRenderData.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeRenderData.cs#L149-L175)). With five levels per object, cap a single ecotype at 51 objects; the unchanged script’s extra spare would limit real inputs to 50.

### 5. Reconcile the cloned body, scenario and preserved files

The legacy body builder uses line/indentation matching to clone Luna into Looney and change its semi-major axis. Inspect the resulting body instead of trusting a successful write. Its scenario uses LoadFromLibrary, which resolves globally registered bodies.

```typescript
// scripts/build-cartoon-moon.ts L781-L788
// ... enclosing context omitted
  const groundClutter = groundClutterXml(chars, args)
  await Bun.write(`${args.out}/assets/cartoon_moon.xml`, buildBodyXml(astroXml, groundClutter))

  // Write mod.toml + scenario only if absent, so user edits are preserved.
  if (!(await Bun.file(`${args.out}/mod.toml`).exists())) await Bun.write(`${args.out}/mod.toml`, MOD_TOML)
  if (!(await Bun.file(`${args.out}/systems/cartoon_sol.xml`).exists())) await Bun.write(`${args.out}/systems/cartoon_sol.xml`, SCENARIO_XML)
  // README is generated docs (the folder is git-ignored + regenerated), so always refresh it.
  await Bun.write(`${args.out}/README.md`, README_MD)
// ... enclosing context omitted
```

Review [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L586-L659) and [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L20-L32). Existing mod.toml and scenario files are intentionally preserved, so regenerate or edit them deliberately when filenames or body IDs change. Run XML/reference checks, inspect KTX metadata and GLB names, then perform a separate native load/render check before sharing the package.

## Complete example

The full legacy construction sequence is [scripts/build-cartoon-moon.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/build-cartoon-moon.ts#L711-L802). The snippets above define the minimum asset/reference adaptation for one generated object; they do not replace the body, Placement, manifest or scenario. Expected offline evidence is five LODs, a registered atlas, exact mesh IDs, referenced top-level materials and a current selection count. Native rendering remains unverified.

## Variations and gotchas

The generator’s comments describe an older inline mesh/material schema and an older random-selection bug. Treat the pinned game declarations and shader as the contract. Its historical srgb argument does not change the current KTX2 format. Reusing Core texture IDs and a cloned body leaves dependencies on the target build. Keep source PNGs outside the generated directories, and check preserved delivery files after every naming change. No upstream source was modified as part of this documentation.

## See also

- [Topic overview](overview.md)
- [Harmony postfix on the private PopulateLaunchPadExclusionZones with the celestial injected](exclude-or-replace-ground-clutter-1.md)
- [Prefix on ExecuteNextClothSolvers builds private clutter bundles with originals kept for exact restore](exclude-or-replace-ground-clutter-2.md)
- [Per-grid memory with AND-merge, public-API snapshot and replay, native plus sidecar saves](exclude-or-replace-ground-clutter-3.md)
- [Generate ground-clutter atlases and audit legacy scenario output](../../../../mods/flexo/features/offline-ground-clutter-generation.md)
- [Place a static object on a planet surface at a latitude and longitude, and keep it anchored](../place-static-objects-on-a-planet-surface/overview.md)
- [Add terrain decals from code and flatten or dig the ground under a custom site](../add-terrain-decals-and-dig-a-site/overview.md)
- [Patching private and overloaded game methods by name](../../../patching/internals/patch-a-private-game-method-by-name/overview.md)
- [Use ground clutter as colliders: custom shapes and vehicle interaction](../../../physics/colliders/give-ground-clutter-custom-colliders/overview.md)
- [Change loaded game data at runtime and make the renderer rebuild from it](../../atmospheres-and-rings/change-loaded-game-data-and-make-the-renderer-notice/overview.md)
- [Recreate mod render targets when KSA rebuilds its renderer](../../../rendering/vulkan-passes/handle-renderer-rebuilds/overview.md)
- [Mutate vehicles at a physics-safe point](../../../physics/solver/mutate-vehicles-at-a-physics-safe-point/overview.md)
- [Detect a save load or quickload and reset mod state safely](../../../persistence/saves/detect-save-load/overview.md)
- [Save a whole mod's scene state as versioned sidecar records, with reset and replay on load](../../../persistence/saves/save-mod-state-with-the-scene/overview.md)

[^source-game-current-decomp-ksa-assetbundle-cs]: [current/decomp/KSA/AssetBundle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/AssetBundle.cs#L25-L35)
[^source-game-current-decomp-ksa-clutterobjecttemplate-cs]: [current/decomp/KSA/ClutterObjectTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterObjectTemplate.cs#L91-L124)
[^source-game-current-decomp-ksa-groundclutterlodreference-cs]: [current/decomp/KSA/GroundClutterLodReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GroundClutterLodReference.cs#L59-L80)
[^source-game-current-decomp-ksa-clutterecotypereference-cs]: [current/decomp/KSA/ClutterEcotypeReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ClutterEcotypeReference.cs#L10-L25)
