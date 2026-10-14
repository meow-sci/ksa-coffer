---
type: Game Feature
title: Validate asset XML ids and paths before launching the game (offline)
description: Compare offline XML and reference checks, generated-geometry checks, game-serializer rules and
  browser export regression workflows
topic: validate-asset-xml-references
category: assets
group: validation
approaches: 4
demonstrated_by:
  - mods/ksacars/features/art-and-audio-pipeline-tooling
  - mods/ksagolf/features/glb-authoring-and-mesh-checks
  - mods/ksarmory/features/blender-model-pipeline-and-checks
  - mods/ksastructures/features/asset-and-mesh-validation-tools
  - mods/unscience/features/parts-now-bundle-validation
  - mods/flexo/features/asset-pipeline-and-regression-tooling
game_types:
  - KSA.AssetBundle
  - KSA.MeshAtlasFileReference
  - KSA.ModLibrary
  - KSA.XmlHelper
  - KSA.XmlLoader
  - KSA.SerializedId
  - KSA.PartTemplate
  - KSA.Mod
lifecycle:
  - startup:asset-load
  - frame:draw-ui
  - tool:build
tags:
  - validation
  - xml
  - ids
  - paths
  - offline
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:09:26Z
status: stable
repos:
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: unscience
    git: https://github.com/meow-sci/unscience.git
    ref: 1829b3b298dd0fa5a67342cafff29074c8c29286
  - name: flexo
    git: git@github.com:meow-sci/flexo.git
    ref: e804879abfc1d45ca1c174a9c95c5fded58c1bf2
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-xmlloader
    repo: ksa-game-assemblies
    path: current/decomp/KSA/XmlLoader.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs
    title: current/decomp/KSA/XmlLoader.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-mod
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Mod.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs
    title: current/decomp/KSA/Mod.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-filereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/FileReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs
    title: current/decomp/KSA/FileReference.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-serializedcollection
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SerializedCollection.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs
    title: current/decomp/KSA/SerializedCollection.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-modlibrary
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ModLibrary.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs
    title: current/decomp/KSA/ModLibrary.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-xmlhelper
    repo: ksa-game-assemblies
    path: current/decomp/KSA/XmlHelper.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlHelper.cs
    title: current/decomp/KSA/XmlHelper.cs (decompiled, build 2026.10.10.5554)
  - id: ksacars-check-xml
    repo: KSACars
    path: tools/check-xml.sh
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/check-xml.sh
    title: "KSACars: tools/check-xml.sh"
  - id: ksacars-validate-parts
    repo: KSACars
    path: tools/validate-parts.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/validate-parts.py
    title: "KSACars: tools/validate-parts.py"
  - id: ksacars-meshinfo
    repo: KSACars
    path: tools/meshinfo.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/meshinfo.py
    title: "KSACars: tools/meshinfo.py"
  - id: ksagolf-validate-parts
    repo: KSAGolf
    path: tools/validate-parts.py
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/validate-parts.py
    title: "KSAGolf: tools/validate-parts.py"
  - id: ksastructures-validate-parts
    repo: KSAStructures
    path: tools/validate-parts.py
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/validate-parts.py
    title: "KSAStructures: tools/validate-parts.py"
  - id: ksarmory-validate-parts
    repo: KSArmory
    path: tools/validate-parts.py
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/validate-parts.py
    title: "KSArmory: tools/validate-parts.py"
  - id: ksa-texturereference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/TextureReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/TextureReference.cs
    title: current/decomp/KSA/TextureReference.cs (decompiled, build 2026.10.10.5554)
  - id: ksa-partmodel
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartModel.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartModel.cs
    title: current/decomp/KSA/PartModel.cs (decompiled, build 2026.10.10.5554)
  - id: ksastructures-check-xml
    repo: KSAStructures
    path: tools/check-xml.sh
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/check-xml.sh
    title: "KSAStructures: tools/check-xml.sh"
  - id: ksastructures-meshinfo
    repo: KSAStructures
    path: tools/meshinfo.py
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/meshinfo.py
    title: "KSAStructures: tools/meshinfo.py"
  - id: unscience-bundleparser
    repo: unscience
    path: parts-now.lib/Runtime/BundleParser.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/BundleParser.cs
    title: "unscience: parts-now.lib/Runtime/BundleParser.cs"
  - id: unscience-bundlevalidator
    repo: unscience
    path: parts-now.lib/Runtime/BundleValidator.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/BundleValidator.cs
    title: "unscience: parts-now.lib/Runtime/BundleValidator.cs"
  - id: ksa-serializedid
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SerializedId.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedId.cs
    title: current/decomp/KSA/SerializedId.cs (decompiled, build 2026.10.10.5554)
  - id: unscience-bundlevalidatorrulesschema
    repo: unscience
    path: parts-now.lib/Runtime/BundleValidatorRulesSchema.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/BundleValidatorRulesSchema.cs
    title: "unscience: parts-now.lib/Runtime/BundleValidatorRulesSchema.cs"
  - id: unscience-bundlevalidatorcontext
    repo: unscience
    path: parts-now.lib/Runtime/BundleValidatorContext.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/BundleValidatorContext.cs
    title: "unscience: parts-now.lib/Runtime/BundleValidatorContext.cs"
  - id: unscience-glbmeshnames
    repo: unscience
    path: parts-now.lib/Runtime/GlbMeshNames.cs
    resource: https://github.com/meow-sci/unscience/blob/1829b3b298dd0fa5a67342cafff29074c8c29286/parts-now.lib/Runtime/GlbMeshNames.cs
    title: "unscience: parts-now.lib/Runtime/GlbMeshNames.cs"
  - id: ksa-pbrmaterialreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PbrMaterialReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PbrMaterialReference.cs
    title: current/decomp/KSA/PbrMaterialReference.cs (decompiled, build 2026.10.10.5554)
  - id: flexo-vite-ksaassets
    repo: flexo
    path: vite/ksaAssets.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/vite/ksaAssets.ts
    title: vite/ksaAssets.ts
  - id: flexo-scripts-sync-test-fixtures
    repo: flexo
    path: scripts/sync-test-fixtures.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/sync-test-fixtures.ts
    title: scripts/sync-test-fixtures.ts
  - id: flexo-package
    repo: flexo
    path: package.json
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/package.json
    title: package.json
  - id: flexo-scripts-smoke-v2
    repo: flexo
    path: scripts/smoke-v2.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/smoke-v2.ts
    title: scripts/smoke-v2.ts
  - id: flexo-part-thumbnails
    repo: flexo
    path: scripts/capture-part-thumbs.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/capture-part-thumbs.ts
    title: scripts/capture-part-thumbs.ts
  - id: flexo-static-thumbnails
    repo: flexo
    path: scripts/generate-icrp-thumbs.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/scripts/generate-icrp-thumbs.ts
    title: scripts/generate-icrp-thumbs.ts
  - id: flexo-export-tests
    repo: flexo
    path: src/ksa/modExport.test.ts
    title: Export regression assertions
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/modExport.test.ts
---

KSA reads asset XML quietly. A missing file returns null without a log, a malformed file logs the exception and the assets simply do not exist, a mistyped path logs one line, a duplicate id is dropped, an unknown mesh or part id throws the first time the part is built, and a part or static-object material missing one of its Diffuse, Normal or AoRoughMetal channels takes the game down (those render paths read the handles without a null check; code-side material lookups fall back to default textures). None of it needs to be found in game: the XML can be
cross-checked against the mod's own files and Core's ids with a script.

## Engine background

- `XmlLoader.Load<T>` (deserialize, then `OnDataLoad`), `TryDeserialize` (logs and returns null), `Deserialize<T>` (null for a missing file; plain `XmlSerializer` when none is cached) ([current/decomp/KSA/XmlLoader.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlLoader.cs#L1-L52)).
- `Mod.LoadAssetBundles` reads only the files in `mod.toml` `assets` ([current/decomp/KSA/Mod.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Mod.cs#L157-L169)).
- `FileReference.Load`: registration, error logs for missing files ([current/decomp/KSA/FileReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/FileReference.cs#L67-L146)); `SerializedCollection.Register` first-wins ([current/decomp/KSA/SerializedCollection.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SerializedCollection.cs#L20-L33)); `ModLibrary.Get<T>` throws, `TryGet<T>` does not ([current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L776-L800), [current/decomp/KSA/ModLibrary.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ModLibrary.cs#L1059-L1085)).
- `XmlHelper.Serializers` / `AttributeOverrides` for the real `AssetBundle` serializer ([current/decomp/KSA/XmlHelper.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/XmlHelper.cs#L17-L47)).
- Phase: `startup:asset-load` is where the failures start; validation runs at development time or before a runtime load. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

Flexo adds a browser-authoring layer: a supplied catalog tree, vendored XML fixtures, round-trip export tests, DOM smoke checks and incremental preview rendering. These checks run outside the game and do not establish native load or gameplay acceptance.[^flexo-vite-ksaassets][^flexo-export-tests]

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Check asset XML ids and paths offline with check-xml.sh and validate-parts.py](validate-asset-xml-references-1.md) | KSACars (and KSAGolf) | `check-xml.sh` and `validate-parts.py` with an `--offline` mode, in deploy and CI | `startup:asset-load` | Cheap and portable; references and paths only |
| [Extend the validator for generated geometry, ids named in C# and shared planes](validate-asset-xml-references-2.md) | KSArmory, KSAStructures | Extra checks: manifest, duplicate ids, shared textures, ids in C#, generated geometry, planes, connectors | `startup:asset-load` | Encodes real incidents; more code to maintain |
| [Parse an AssetBundle with the game serializer, without OnDataLoad, and apply pure rules](validate-asset-xml-references-3.md) | unscience (Parts Now) | `XmlHelper.Serializers` parse without `OnDataLoad`, fifteen pure rules over the object tree | `frame:draw-ui`, `startup:asset-load` | Safe runtime loading of untrusted XML; depends on game internals |
| [Supply catalog assets and regression-test browser exports](validate-asset-xml-references-4.md) | Flexo authoring tool | Catalog fixtures, export tests, browser smoke and thumbnail fingerprints | `tool:build` | Catches browser/export regressions; prepared game assets and native acceptance remain separate |

## See also

- [Check GLB meshes offline: z-fighting, degenerate UVs, names and bounds](../find-z-fighting-and-degenerate-uvs-in-glb/overview.md), [Resolve asset ids and file paths correctly across mods](../../asset-xml/resolve-asset-ids-and-mod-relative-paths/overview.md), [Register a custom XML asset type or inject new child elements into game XML](../../asset-xml/register-custom-xml-asset-type/overview.md), [Know which asset XML elements the game accepts and what they load](../../asset-xml/asset-xml-element-reference/overview.md),
  [Add a part's art with its own GLB model and PBR textures](../../models-and-textures/add-a-part-model-with-glb-and-pbr-textures/overview.md), [Define a part with its own game data and GLB model](../../../vehicles-and-parts/parts/define-a-part-with-game-data/overview.md), [Load, validate and unload part mods in a running game](../../../vehicles-and-parts/parts/load-and-unload-part-mods-at-runtime/overview.md), [Run one check script from the pre-push hook and from CI](../../../testing-and-tooling/offline-tests/run-repo-checks-from-a-pre-push-hook-and-ci/overview.md),
  [Generate measured atmosphere tables from reference profiles](../../../celestials/atmospheres-and-rings/generate-measured-atmosphere-tables-offline/overview.md), [Branch per body inside shared game shaders](../../../shaders/stock-shaders/branch-per-body-inside-shared-game-shaders/overview.md), [Compile-check a mod's GLSL without launching the game](../../../shaders/glsl-workflow/check-mod-shaders-offline-with-glslang/overview.md),
  [Define atmospheres, scattering and cloud layers for a body in system XML](../../../celestials/atmospheres-and-rings/define-atmospheres-and-cloud-layers-in-system-xml/overview.md), [Take clean screenshots from code, with a composed camera shot held for the capture](../../../testing-and-tooling/in-game-testing/take-screenshots-from-code/overview.md), [Extend KSA's sky and cloud shaders: per-pixel haze and cloud lighting fixes](../../../shaders/stock-shaders/extend-stock-sky-and-cloud-shaders/overview.md)
- [Art and audio pipeline tooling](../../../../mods/ksacars/features/art-and-audio-pipeline-tooling.md), [Headless Blender model generation and offline GLB checks](../../../../mods/ksarmory/features/blender-model-pipeline-and-checks.md), [Asset XML, mesh and shader checks that run without the game](../../../../mods/ksastructures/features/asset-and-mesh-validation-tools.md),
  [Validate Part asset bundles with fifteen rules before anything is written or registered](../../../../mods/unscience/features/parts-now-bundle-validation.md)

[^flexo-vite-ksaassets]: vite/ksaAssets.ts.
[^flexo-export-tests]: Export regression assertions.
