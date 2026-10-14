---
type: Mod Feature
title: Launch-site system export
description: Export static launch sites through cloned celestial Assets and a selectable System that references the cloned bodies
mod: flexo
category: celestials
tags:
  - flexo
  - asset-authoring
techniques:
  - xml-asset
  - template-composition
  - reference-remapping
game_types:
  - KSA.StaticObject
  - KSA.SystemTemplate
  - KSA.LandmarkReference
lifecycle:
  - tool:authoring
  - tool:build
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:39:16Z
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
  - id: flexo-apps-icrp-src-ksa-systemxml
    repo: flexo
    path: apps/icrp/src/ksa/systemXml.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts
    title: apps/icrp/src/ksa/systemXml.ts
  - id: flexo-apps-icrp-src-ksa-landmarkxml
    repo: flexo
    path: apps/icrp/src/ksa/landmarkXml.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/landmarkXml.ts
    title: apps/icrp/src/ksa/landmarkXml.ts
  - id: flexo-apps-icrp-src-ksa-modplan
    repo: flexo
    path: apps/icrp/src/ksa/modPlan.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts
    title: apps/icrp/src/ksa/modPlan.ts
  - id: ksa-current-decomp-ksa-staticobject
    repo: ksa-game-assemblies
    path: current/decomp/KSA/StaticObject.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs
    title: current/decomp/KSA/StaticObject.cs
  - id: ksa-current-decomp-ksa-systemtemplate
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SystemTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs
    title: current/decomp/KSA/SystemTemplate.cs
  - id: ksa-current-decomp-ksa-landmarkreference
    repo: ksa-game-assemblies
    path: current/decomp/KSA/LandmarkReference.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LandmarkReference.cs
    title: current/decomp/KSA/LandmarkReference.cs
---

ICRP can place composed structures at authored celestial locations by producing an alternate system scenario. It distinguishes new site-bearing body assets from bodies that only exist inline in a system.

## How it works

The serializer deep-clones the stock System, assigns its new identity and display name, and groups sites by their host body. A modified body is cloned into a separate Assets document under a mod-suffixed ID. The scenario then uses LoadFromLibrary to reference it, carrying parent and home-body metadata forward. Parent references and starting-vehicle bindings are rewritten to follow renamed bodies.

Landmarks contain the static object ID, launch-pad flag and authored latitude/longitude. A matching landmark ID is retargeted; a new one is appended. Optional terrain decals are added for new sites. Relative texture paths in cloned bodies are rewritten either against a supplied installation path or relative to Core.

This separate body-asset route matches the current game’s resolution boundary: StaticObject.ResolveAll visits the global astronomical template lookup, whereas SystemTemplate owns a separate local body lookup. The alternative extend-stock-pad mode emits additive GameData for the shared stock pad instead of creating a scenario.[^flexo-apps-icrp-src-ksa-systemxml][^flexo-apps-icrp-src-ksa-landmarkxml][^flexo-apps-icrp-src-ksa-modplan]

## Lifecycle and timing

Authoring runs in the browser on user actions and asynchronous asset completion. Export runs when the user requests delivery or an XML preview. It reads a project snapshot and produces files; it does not hook the KSA frame or physics loop.

## Key code

| Source | Role |
|---|---|
| [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L111-L183) | Texture path rewriting and landmark insert-or-retarget behavior |
| [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L233-L365) | Clone the stock scenario, move modified bodies into Assets and redirect references |
| [apps/icrp/src/ksa/landmarkXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/landmarkXml.ts#L45-L98) | Launch-pad landmarks and optional terrain decal data |
| [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L64-L75) | Select new scenario output or shared stock-pad extension |

## Snippets

```typescript
// apps/icrp/src/ksa/systemXml.ts L269-L280
  const bodiesDoc = doc.implementation.createDocument(null, null, null);
  const bodiesRoot = bodiesDoc.createElement('Assets');
  bodiesDoc.appendChild(bodiesRoot);
  const renamedBodies = new Map<string, string>();
  let addedLandmarks = 0;
  let retargetedLandmarks = 0;
  const counts = { texturesRewritten: 0 };

  for (const [bodyId, bodySites] of sitesByBody) {
    const source = corpus.bodies.get(bodyId) ?? inlineBodies.get(bodyId);
    if (!source) {
      throw new Error(
```

## Game APIs touched

KSA.StaticObject.ResolveAll resolves celestial locations from ModLibrary.TemplateLookup.[^ksa-current-decomp-ksa-staticobject]

KSA.SystemTemplate keeps its own body lookup and loads the scenario body list.[^ksa-current-decomp-ksa-systemtemplate]

KSA.LandmarkReference declares launch-pad and ground-marker flags.[^ksa-current-decomp-ksa-landmarkreference]

## Pitfalls and version notes

An absolute installation texture path is machine-specific. Core-relative paths rely on the expected neighboring Core layout. A cloned body snapshots its upstream configuration and may need refreshing when KSA changes. Extending the stock pad affects every location using that template. The generated scenario must be selected and tested in KSA; this analysis did not launch it.

## See also

- [static object composition](static-object-composition.md)
- [native asset mod export](native-asset-mod-export.md)
- [Compose static assets and export launch sites from a browser](../../../howto/celestials/terrain/place-static-objects-on-a-planet-surface/place-static-objects-on-a-planet-surface-4.md) - how-to article demonstrating this feature

[^flexo-apps-icrp-src-ksa-systemxml]: [apps/icrp/src/ksa/systemXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/systemXml.ts#L233-L365)
[^flexo-apps-icrp-src-ksa-landmarkxml]: [apps/icrp/src/ksa/landmarkXml.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/landmarkXml.ts#L45-L98)
[^flexo-apps-icrp-src-ksa-modplan]: [apps/icrp/src/ksa/modPlan.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/apps/icrp/src/ksa/modPlan.ts#L64-L75)
[^ksa-current-decomp-ksa-staticobject]: [current/decomp/KSA/StaticObject.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/StaticObject.cs#L47-L79)
[^ksa-current-decomp-ksa-systemtemplate]: [current/decomp/KSA/SystemTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SystemTemplate.cs#L9-L95)
[^ksa-current-decomp-ksa-landmarkreference]: [current/decomp/KSA/LandmarkReference.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/LandmarkReference.cs#L1-L15)
