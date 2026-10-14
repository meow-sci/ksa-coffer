---
type: How-To
title: Design engine GameData with validated browser candidates
description: Build scoped liquid, RCS and solid-motor definitions with pure candidate construction, numerical previews and one undoable commit
topic: design-engine-game-data
category: vehicles-and-parts
group: staging-and-engines
difficulty: advanced
prerequisites:
  - flexo-source
  - browser-catalog-assets
  - native-part-xml
demonstrated_by:
  - mods/flexo/features/engine-design-and-validation
  - mods/flexo/features/propulsion-design-wizards
  - mods/flexo/features/solid-motor-grain-design
techniques:
  - xml-asset
  - pure-model
  - numerical-preview
  - scoped-references
  - transactional-editing
  - procedural-geometry
  - lookup-table
  - numerical-integration
game_types:
  - KSA.RocketTemplate
  - KSA.CombustorTemplate
  - KSA.DeLavalNozzleConfig
  - KSA.PartTemplate
  - KSA.RocketThrusterControllerTemplate
  - KSA.GimbalController
  - KSA.SolidMotor
  - KSA.SolidMotorTemplate
  - KSA.SolidGrainSegment
  - KSA.SolidMotorNozzle
  - KSA.PartTree
  - KSA.GrainGeometryTemplate
lifecycle:
  - tool:authoring
hooks: []
tags:
  - flexo
  - asset-authoring
  - vehicles-and-parts
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
  - id: source-game-current-decomp-ksa-rockettemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs
    title: current/decomp/KSA/RocketTemplate.cs
  - id: source-game-current-decomp-ksa-rocketthrustercontrollertemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketThrusterControllerTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketThrusterControllerTemplate.cs
    title: current/decomp/KSA/RocketThrusterControllerTemplate.cs
  - id: source-game-current-decomp-ksa-parttemplate-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs
    title: current/decomp/KSA/PartTemplate.cs
  - id: source-game-current-decomp-ksa-gimbalcontroller-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GimbalController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GimbalController.cs
    title: current/decomp/KSA/GimbalController.cs
  - id: source-flexo-src-ui-engine-wizard-wizardmodel-ts
    repo: flexo
    path: src/ui/engine/wizard/wizardModel.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts
    title: src/ui/engine/wizard/wizardModel.ts
  - id: source-flexo-src-ksa-enginevalidation-ts
    repo: flexo
    path: src/ksa/engineValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts
    title: src/ksa/engineValidation.ts
  - id: source-flexo-src-ui-engine-performanceaggregation-ts
    repo: flexo
    path: src/ui/engine/performanceAggregation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/performanceAggregation.ts
    title: src/ui/engine/performanceAggregation.ts
  - id: source-flexo-src-ksa-enginephysics-ts
    repo: flexo
    path: src/ksa/enginePhysics.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts
    title: src/ksa/enginePhysics.ts
  - id: source-flexo-src-ksa-reactioncatalog-ts
    repo: flexo
    path: src/ksa/reactionCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts
    title: src/ksa/reactionCatalog.ts
  - id: source-flexo-src-ksa-solidmotorphysics-ts
    repo: flexo
    path: src/ksa/solidMotorPhysics.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts
    title: src/ksa/solidMotorPhysics.ts
  - id: source-flexo-src-ui-engine-wizard-enginewizarddialog-tsx
    repo: flexo
    path: src/ui/engine/wizard/EngineWizardDialog.tsx
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx
    title: src/ui/engine/wizard/EngineWizardDialog.tsx
  - id: source-flexo-src-state-editorstore-ts
    repo: flexo
    path: src/state/editorStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/editorStore.ts
    title: src/state/editorStore.ts
  - id: source-flexo-src-ui-engine-wizard-wizardgeometry-ts
    repo: flexo
    path: src/ui/engine/wizard/wizardGeometry.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardGeometry.ts
    title: src/ui/engine/wizard/wizardGeometry.ts
  - id: source-game-current-decomp-ksa-delavalnozzleconfig-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/DeLavalNozzleConfig.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs
    title: current/decomp/KSA/DeLavalNozzleConfig.cs
  - id: flexo-grain-catalog
    repo: flexo
    path: src/ksa/grainGeometryCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/grainGeometryCatalog.ts
    title: Grain table and storage-density parsing
  - id: flexo-solid-resolution
    repo: flexo
    path: src/ui/engine/solidCurveResolution.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts
    title: Scoped solid-motor hardware resolution
  - id: native-grain-geometry
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GrainGeometryTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GrainGeometryTemplate.cs
    title: Native grain-table validation
  - id: native-solid-motor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotorTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorTemplate.cs
    title: Native solid reaction constraints
---

Use Flexo’s Engine model when you want to author a native propulsion graph before launching KSA. Start from a part document and a served reaction/grain catalog. The implementation is TypeScript in an external editor; you are producing XML data, not replacing the game’s C# solver.

## Background: how the game does it

A rocket resolves a core and nozzles in its owner’s scope. KSA rejects mixed solid/liquid components and reusing hardware already owned by another rocket. A thruster controller cannot drive a solid motor. Parent feeds resolve through part-level consumer wiring, with instance-specific entries taking precedence over unscoped entries; gimbal authority comes from nozzles on the gimbal’s own host. These are authoring constraints, not cosmetic choices.[^source-game-current-decomp-ksa-rockettemplate-cs][^source-game-current-decomp-ksa-rocketthrustercontrollertemplate-cs][^source-game-current-decomp-ksa-parttemplate-cs][^source-game-current-decomp-ksa-gimbalcontroller-cs]

## Lifecycle and timing

All steps run in tool:authoring. Build the candidate when navigation enters Review; derive findings from the current catalog; mutate the document only when Finish succeeds. Export and later native loading are separate operations. No live vehicle, StarMap callback or worker-thread solver state is read. See [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the distinction between tool phases and native runtime phases.

## Steps

### 1. Choose the family and build a connected candidate

Use the existing wizard model in [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1194-L1216) as the boundary for a new authoring flow. Supply the current document, typed choices, a fresh-ID function and the active layer. For a liquid engine, create the combustor/nozzle/rocket on the chosen SubPart, but put its engine controller on the part and make the references identify that placed instance. The liquid builder shows the required identity transfer:

```typescript
// src/ui/engine/wizard/wizardModel.ts L1354-L1368
// ... enclosing context omitted
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
// ... enclosing context omitted
```

For RCS select a thruster controller and nozzle directions; for solid motors select an engine controller and direct grain-container feeds. A geometric bell without those relationships will not produce thrust.

### 2. Validate the exact candidate and preserve severity

Call validateEngines on the candidate before allowing Finish. Resolve modules per instance before checking exclusive ownership, chemistry and feed wiring. Keep warnings distinct from blocking failures: an empty controller is a useful authoring warning, while assigning a solid motor to a thruster controller is rejected. [src/ksa/engineValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts#L321-L512) contains the scope expansion.

```typescript
// src/ksa/engineValidation.ts L495-L510
// ... enclosing context omitted
      if (!located) {
        block(
          'controller-rocket-unresolvable',
          `KSA throws: controller ${controller.id} references unknown Rocket ${ref.id} in its declared scope.`,
          source,
        );
        continue;
      }
      drivenRockets.add(located);
      if (controller.kind === 'thruster' && resolveCore(located, consumers)?.isSolid) {
        block(
          'solid-motor-on-thruster-controller',
          `KSA throws: Solid motor ${located.rocket.core.id} cannot be driven by thruster controller ${controller.id}.`,
          source,
        );
      }
// ... enclosing context omitted
```

The expected result is a list with stable codes and editor locations, allowing an issue click to select the responsible scope/module. Do not convert every warning into a claim that the XML parser will throw.

### 3. Calculate liquid and thermal previews from reaction tables

Load actual reaction data, resolve fixed/mixture/thermal chemistry and evaluate the nozzle at the desired ambient pressure. The performance panel uses full throttle for its sea-level and vacuum headlines. Sum thrust and mass flow before calculating total specific impulse:

```typescript
// src/ui/engine/performanceAggregation.ts L173-L189
// ... enclosing context omitted
  // Isp is a ratio, never a sum: ΣF / (g0·Σṁ). Summing the per-pair Isps would report a
  // two-chamber engine as twice as efficient as one chamber.
  const denominator = G0 * massFlowRate;
  return {
    kind: 'ok',
    reactionName,
    pairs,
    thrustVacN,
    thrustSLN,
    massFlowRate,
    ispVac: denominator > 0 ? thrustVacN / denominator : 0,
    ispSL: denominator > 0 ? thrustSLN / denominator : 0,
    throatDiameterM: pairs[0].performance.throatDiameterM,
    flowSeparationSeveritySL,
    optimumExpansionPa: pairs[0].performance.optimumExpansionPa,
  };
}
// ... enclosing context omitted
```

Use [src/ksa/enginePhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts#L336-L438) for inlet, expansion, separation and thrust calculations, and [src/ksa/reactionCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts#L310-L459) for catalog resolution. Missing chemistry should make a preview unavailable; do not fill it with guessed constants. Magnetic design readouts exclude vehicle scoop input.

Preserve scope when aggregating: an explicit SubPart reference from the part targets that one placement; a selected SubPart-owned rocket is multiplied by its template's placement count, with a minimum count of one for an unplaced design. The legacy first-core/first-nozzle view remains a single pair without that multiplier ([src/ui/engine/performanceAggregation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/performanceAggregation.ts#L100-L222)). Label the selected view so its design total is not mistaken for a measured assembled vehicle.

### 4. Resolve grain feeds and sample solid-motor burn

For a solid motor, resolve its own feed segments and grain geometry before sampling. Instance-specific parent wiring takes precedence over an unscoped fallback; deduplicate feeds by both placement identity and segment ID so two placed copies remain distinct ([src/ui/engine/solidCurveResolution.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts#L62-L124)). Use positive storage density for the propellant, not casing density. Select a fixed solid reaction with one solid reactant and a burn law; its default pressure must be above the minimum burn pressure and no greater than the maximum stable pressure ([current/decomp/KSA/SolidMotorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorTemplate.cs#L21-L62)).

Author at least two finite grain conditions, starting at zero depth, with nonnegative perimeter and strictly increasing depth and port area. These values are normalized to casing inner radius; the sampler converts wall thickness from millimetres before deriving that radius. Reject malformed source rows explicitly: the browser parser filters non-finite rows before checking the remaining profile, whereas native creation throws on any non-finite condition ([src/ksa/grainGeometryCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/grainGeometryCatalog.ts#L33-L134), [current/decomp/KSA/GrainGeometryTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GrainGeometryTemplate.cs#L36-L68)). The dimensional conversion is in [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L139-L201).

Derive throat sizing from peak burning area instead of leaving the initial area-ratio seed at 12. The pressure solve balances generation against nozzle flow, converting the pressure-dependent burn law consistently:

```typescript
// src/ksa/solidMotorPhysics.ts L397-L428
// ... enclosing context omitted
  if (burnAreaM2 <= 0) return null;
  const { lutMinPressurePa: min, lutMaxPressurePa: max } = motor;
  const exponent = motor.input.burnRate.exponent;
  let pressure = Math.min(
    Math.max(warmStartPressurePa > 0 ? warmStartPressurePa : motor.defaultChamberPressurePa, min),
    max,
  );
  const generation =
    motor.input.storageDensityKgPerM3 *
    burnAreaM2 *
    motor.input.burnRate.coefficientMPerS *
    Math.pow(1e-6, exponent);

  let combustion = conditionsAtPressure(motor, pressure);
  for (let i = 0; i < 8; i++) {
    if (!combustion) return null;
    let massFlow = 0;
    for (const nozzle of motor.nozzles) {
      massFlow += solidNozzlePerformance(nozzle, combustion, 0).massFlowRate;
    }
    if (massFlow <= 0) return null;
    const perPressure = massFlow / pressure;
    const next = Math.min(
      Math.max(Math.pow(generation / perPressure, 1 / (1 - exponent)), min),
      max,
    );
    const converged = Math.abs(next - pressure) <= 1e-4 * pressure;
    pressure = next;
    combustion = conditionsAtPressure(motor, pressure);
    if (converged) break;
  }
  return combustion;
// ... enclosing context omitted
```

Use the 256-depth-step integration and quench rule in [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L646-L718); the curve is a preview for this part’s resolved segments. A connector-grown stack across other assembled parts is not available to this single-part editor. Manual nozzle area ratio supported by the game is outside this sampler’s input model.

### 5. Commit once, then export and inspect

Retain the candidate built on entering Review. Do not regenerate identifiers in a render function or rebuild a different document at Finish. [src/ui/engine/wizard/EngineWizardDialog.tsx](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/EngineWizardDialog.tsx#L176-L262) gates the commit on build errors, blocking findings and step validation. Apply that document with one checkpoint:

```typescript
// src/state/editorStore.ts L4020-L4023
export function applyEngineWizard(part: EditingPart, detail: string): void {
  pushUndo('engine wizard', detail);
  $part.set(part);
}
```

Afterward rebuild generated custom meshes, select the authored module and inspect its physics direction, plumbing, gimbal host and exported GameData. One Undo should remove the wizard’s complete addition. Native loading and a controlled in-game thrust test are the next validation stages; neither was run for this article.

## Complete example

Follow [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1205-L1386), [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1416-L1581) and [src/ui/engine/wizard/wizardModel.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardModel.ts#L1615-L1788) for complete liquid, solid and RCS builders. Generated geometry is deliberately simple in [src/ui/engine/wizard/wizardGeometry.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/wizard/wizardGeometry.ts#L79-L222). Reuse the data validator rather than embedding physics checks inside UI widgets.

## Variations and gotchas

JavaScript arithmetic and protective clamps can differ from the decompiled solver, so preview values are not a measured accuracy guarantee. Aggregate Isp is not the sum of nozzle Isps. Solid headline vacuum Isp is tied to the peak-thrust sample rather than a burn average. Generated visual geometry, dry mass and colliders are independent definitions. Existing templates do not receive guessed automatic colliders. A valid graph still needs real resource supply, correct directions and native flight testing.

## See also

- [Topic overview](overview.md)
- [Engine design and validation](../../../../mods/flexo/features/engine-design-and-validation.md)
- [Propulsion design wizards](../../../../mods/flexo/features/propulsion-design-wizards.md)
- [Solid-motor grain design](../../../../mods/flexo/features/solid-motor-grain-design.md)
- [Computing engine thrust, Isp and mass flow at ambient pressure, and inverting for throttle](../compute-engine-thrust-at-ambient-pressure/overview.md)
- [Defining a part with its own game data and GLB model](../../parts/define-a-part-with-game-data/overview.md)
- [Compose and export native asset-only mods in a browser](../../../assets/asset-xml/author-native-asset-mods-in-a-browser/overview.md)

[^source-game-current-decomp-ksa-rockettemplate-cs]: [current/decomp/KSA/RocketTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs#L18-L83)
[^source-game-current-decomp-ksa-rocketthrustercontrollertemplate-cs]: [current/decomp/KSA/RocketThrusterControllerTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketThrusterControllerTemplate.cs#L17-L36)
[^source-game-current-decomp-ksa-parttemplate-cs]: [current/decomp/KSA/PartTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTemplate.cs#L461-L520)
[^source-game-current-decomp-ksa-gimbalcontroller-cs]: [current/decomp/KSA/GimbalController.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GimbalController.cs#L20-L52)
