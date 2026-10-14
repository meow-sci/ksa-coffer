---
type: Mod Feature
title: Propulsion design wizards
description: Build complete liquid, solid and RCS propulsion assemblies as validated candidate documents committed in one undo step
mod: flexo
category: vehicles-and-parts
tags:
  - engines
  - authoring
  - wizard
  - rcs
  - solid-motors
  - undo
techniques:
  - xml-asset
  - pure-model
  - transactional-editing
  - procedural-geometry
game_types:
  - KSA.PartTemplate
  - KSA.RocketThrusterControllerTemplate
  - KSA.CombustorTemplate
  - KSA.GimbalController
lifecycle:
  - tool:authoring
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T01:26:41Z
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
  - id: model
    repo: flexo
    path: src/ui/engine/wizard/wizardModel.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts
    title: Pure wizard state, validation and assembly construction
  - id: dialog
    repo: flexo
    path: src/ui/engine/wizard/EngineWizardDialog.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx
    title: Review candidate and Finish transaction
  - id: geometry
    repo: flexo
    path: src/ui/engine/wizard/wizardGeometry.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardGeometry.ts
    title: Generated primitive geometry and nozzle layout
  - id: editor-store
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: Atomic wizard application
  - id: game-part
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: KSA.PartTemplate, build 2026.10.10.5554
  - id: game-thruster
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketThrusterControllerTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketThrusterControllerTemplate.cs
    title: KSA.RocketThrusterControllerTemplate, build 2026.10.10.5554
  - id: game-combustor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CombustorTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs
    title: KSA.CombustorTemplate, build 2026.10.10.5554
  - id: game-gimbal
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GimbalController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GimbalController.cs
    title: KSA.GimbalController, build 2026.10.10.5554
---

Flexo's propulsion wizard constructs the connected data needed for an engine, rather than adding a nozzle that the author must wire by hand. Its reusable design is a pure candidate builder: gather choices, create a complete document, validate that exact candidate, then commit it as one undoable edit.

## How it works

### A family-specific walk produces a common document

The model owns typed wizard state and ordered steps for three families. Liquid engines ask about performance, feeds and gimbals; solid boosters ask about propellant, grains and nozzle; RCS asks about nozzle layout, propellant and feeds. All converge on effects, structure and Review ([src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L314-L353)).

`buildWizardPart` dispatches to a family builder that clones the current document. New object identifiers come from the injected mint function and existing identifier pools, while the current layer is passed in explicitly. The model therefore does not read live stores or mutate the editor document while constructing the candidate ([src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1-L27), [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1194-L1216)).

| Family | Authored assembly |
|---|---|
| Liquid | SubPart-hosted combustor, De Laval nozzle and rocket; part-level engine controller referencing the placed instance; parent feed plus part-level wiring to a tank/container/connector; optional gimbal |
| Solid booster | Casing-hosted motor, grain segments, solid nozzle and rocket; engine controller; direct container feeds for the grains, optionally supplemented by a case connector |
| RCS | Part- or SubPart-hosted combustor and multiple nozzles; one rocket and part-level thruster controller; service plumbing and a minimum pulse interval; parent wiring only for a SubPart host |

The implementations live in [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1205-L1386), [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1416-L1581) and [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1615-L1788).

These distinctions encode actual game contracts. `PartTemplate.ResolveConsumerFeeds` first searches instance-specific parent wiring, then unscoped wiring, and logs an error if neither exists. `RocketThrusterControllerTemplate.Create` throws when assigned a solid motor, so the solid wizard chooses an engine controller. The RCS builder floors its pulse interval to 1 ms, matching `CombustorTemplate.OnDataLoad`.[^game-part][^game-thruster][^game-combustor]

### Geometry and physics metadata remain separate

The wizard can use an existing template or generate simple box primitives. Generated liquid geometry places a bell and body along X; solid geometry places a nozzle block and casing, deriving evenly spaced grain centers; RCS produces a cube with single, quad or six-direction unit-vector layouts. These are authoring placeholders, not a detailed procedural engine mesh or a grain surface simulation ([src/ui/engine/wizard/wizardGeometry.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardGeometry.ts#L79-L184)).

For generated assemblies the model can add a collider around the prescribed dimensions, along with dry-mass data, tags, effects and attachment nodes. It rotates a cylindrical booster collider onto X; existing imported templates do not receive a guessed auto-collider because the wizard lacks their bounds ([src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1134-L1180), [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1381-L1386)).

Putting the gimbal on the nozzle's host matters: in the game `GimbalController.RecomputeStaticData` gathers nozzle modules from the gimbal's own parent, then constructs authority from its Y/Z deflections. A cosmetic neighbor is not an equivalent host.[^game-gimbal]

### Review exactly what Finish will commit

The dialog constructs its candidate in the navigation event that enters Review. It retains that result rather than minting identifiers during rendering or rebuilding at Finish. Findings remain derived from the current reaction catalog so a catalog fetch completing during Review updates validation. Finish is disabled by a build failure, a blocking engine finding or any invalid wizard step ([src/ui/engine/wizard/EngineWizardDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx#L157-L240)).

Applying the candidate pushes one undo checkpoint and sets the part once. The dialog then rebuilds generated custom meshes, enters Engine mode, selects the authored module and optionally enables the exhaust placement tool ([src/state/editorStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts#L4005-L4023), [src/ui/engine/wizard/EngineWizardDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx#L236-L262)).

## Lifecycle and timing

`tool:authoring`: fields and step navigation run in the browser dialog. Candidate construction happens on entering Review; the only durable document mutation happens on Finish. Generated GLB meshes are rebuilt after document application. This is editor transaction timing and does not correspond to any KSA frame or solver callback ([src/ui/engine/wizard/EngineWizardDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx#L193-L253)).

## Key code

| Path | Role |
|---|---|
| [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L614-L733) | Per-step validation and common input checks |
| [src/ui/engine/wizard/wizardGeometry.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardGeometry.ts#L169-L222) | RCS nozzle layouts and generated collider extents |
| [src/ui/engine/wizard/EngineWizardDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx#L176-L240) | Stable review candidate and gated Finish |

## Snippets

The liquid builder creates the rocket, places its controller on the part and connects the SubPart's parent feed to its actual source:

```typescript
// src/ui/engine/wizard/wizardModel.ts L1354-L1368
  const rocket: Rocket = createRocket(rocketId, combId, [nozId]);
  spd.rockets.push(rocket);
  summary.push({ kind: 'rocket', id: rocketId, note: `${combId} + ${nozId}` });

  const controller: RocketController = createRocketController(ctrlId, 'engine', [rocketId]);
  if (hostInstanceId !== null) controller.rocketRefs[0].subPartInstanceId = hostInstanceId;
  part.gameData.rocketControllers.push(controller);
  summary.push({ kind: 'controller', id: ctrlId, note: `engine controller driving ${rocketId}` });

  const wiring: ConsumerFeedWiring = {
    consumerId: combId,
    subPartInstanceId: hostInstanceId,
    feeds: [feed],
  };
  part.gameData.consumerFeedWiring.push(wiring);
```

## Game APIs touched

The browser authors data for these contracts; it does not invoke their methods in process.

| Type/member | Contract |
|---|---|
| `KSA.PartTemplate.ResolveConsumerFeeds` | [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L461-L527): instance wiring takes precedence over unscoped wiring |
| `KSA.RocketThrusterControllerTemplate.Create` | [current/decomp/KSA/RocketThrusterControllerTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketThrusterControllerTemplate.cs#L17-L35): thruster control map and solid-motor rejection |
| `KSA.CombustorTemplate.OnDataLoad` | [current/decomp/KSA/CombustorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs#L81-L90): minimum throttle and pulse clamps |
| `KSA.GimbalController.RecomputeStaticData` | [current/decomp/KSA/GimbalController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GimbalController.cs#L20-L52): collect host nozzles and derive vectoring authority |

## Pitfalls and version notes

- Generated boxes and colliders are editable starting points. Their shape does not prove a fitted imported mesh, accurate physical mass or correct attachment arrangement.
- Preserving the reviewed candidate is essential: rebuilding on Finish could mint different identifiers and invalidate the user's review. Derive findings again when catalogs change without recreating that candidate.
- A wizard validates choices and references; its numerical readouts remain browser previews. The resulting asset-only mod was not installed or flight-tested during this analysis.

## See also

- [Engine design and validation](engine-design-and-validation.md)
- [Solid-motor grain design](solid-motor-grain-design.md)
- [Design engine GameData with validated browser candidates](../../../howto/vehicles-and-parts/staging-and-engines/design-engine-game-data/design-engine-game-data.md) - how-to article demonstrating this feature

[^game-part]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs)
[^game-thruster]: [current/decomp/KSA/RocketThrusterControllerTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketThrusterControllerTemplate.cs)
[^game-combustor]: [current/decomp/KSA/CombustorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs)
[^game-gimbal]: [current/decomp/KSA/GimbalController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GimbalController.cs)
