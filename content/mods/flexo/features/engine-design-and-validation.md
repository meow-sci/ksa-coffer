---
type: Mod Feature
title: Engine design and validation
description: Preview propulsion performance and diagnose scoped module, reaction and feed references before exporting an asset-only mod
mod: flexo
category: vehicles-and-parts
tags:
  - engines
  - authoring
  - propulsion
  - validation
  - reactions
techniques:
  - xml-asset
  - pure-model
  - numerical-preview
  - scoped-references
game_types:
  - KSA.RocketTemplate
  - KSA.CombustorTemplate
  - KSA.DeLavalNozzleConfig
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
  - id: physics
    repo: flexo
    path: src/ksa/enginePhysics.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts
    title: Browser propulsion calculations
  - id: validation
    repo: flexo
    path: src/ksa/engineValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts
    title: Scoped engine checks
  - id: aggregation
    repo: flexo
    path: src/ui/engine/performanceAggregation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/performanceAggregation.ts
    title: Per-rocket performance aggregation
  - id: reactions
    repo: flexo
    path: src/ksa/reactionCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts
    title: Reaction parsing and editable reaction conversion
  - id: store
    repo: flexo
    path: src/state/engineStore.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/engineStore.ts
    title: Engine selection and findings navigation
  - id: export-issues
    repo: flexo
    path: src/ksa/exportIssues.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportIssues.ts
    title: Shared export findings
  - id: game-rocket
    repo: ksa-game-assemblies
    path: current/decomp/KSA/RocketTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs
    title: KSA.RocketTemplate, build 2026.10.10.5554
  - id: game-combustor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/CombustorTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs
    title: KSA.CombustorTemplate, build 2026.10.10.5554
  - id: game-nozzle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/DeLavalNozzleConfig.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs
    title: KSA.DeLavalNozzleConfig, build 2026.10.10.5554
---

Flexo's engine editor combines an editable propulsion graph, numerical design readouts and reusable pre-export checks. It operates on browser data describing the future asset-only mod. It neither attaches a flight controller to the running game nor patches propulsion calculations.

## How it works

The editor selects either the part or a reusable SubPart template. Selection and gizmo state are ephemeral; authored combustors, nozzles, rockets and related data live in the undoable part document. This distinction prevents changing the selected module from becoming an asset edit ([src/state/engineStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/engineStore.ts#L30-L50)).

### Resolve the module graph before calculating performance

Validation expands SubPart templates into their placed instance scopes, then resolves a rocket's core and nozzles relative to that owner. Controllers are also expanded per placement, including supported controller elements retained as otherwise unknown XML. A repeated module identifier in two different instances is therefore different from reusing one physical core in two rockets ([src/ksa/engineValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts#L321-L512)).

The game independently resolves these references in `RocketTemplate.Create`, rejects mixing solid and liquid components, and rejects a core or nozzle already assigned to another rocket. Flexo mirrors these concrete failure modes instead of treating all missing links as a generic form error.[^game-rocket]

| Check family | Flexo's result |
|---|---|
| Unresolved core/nozzle/controller references, reused hardware, mixed solid/liquid rocket | Blocking finding |
| Controller driving no rockets, unreferenced hardware, rocket without usable nozzles | Warning directing the author to the module graph |
| Missing feed container/connector, missing parent wiring, unsuitable connector capability | Warning directing the author to plumbing |
| Thermal reaction assigned to a combustor, mixture reaction without a ratio, invalid solid-motor requirements | Blocking finding |
| Non-unit physics exhaust direction, ineffective gimbal placement, unknown stock plume identifier | Warning; these checks describe likely misbehavior rather than universal XML syntax rejection |

These groups are implemented in [src/ksa/engineValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts#L514-L979). Each finding includes a stable code, severity and optional editor location. The Engine surface maps that location back to a scope/module and can flash specific fields; the export model reuses the validator and converts its location to an Engine jump target ([src/state/engineStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/engineStore.ts#L599-L672), [src/ksa/exportIssues.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/exportIssues.ts#L174-L183)).

### Resolve chemistry, then evaluate the nozzle

The reaction catalog loads fixed, mixture and thermal reaction data. A fixed reaction supplies its pressure table directly; a mixture is sliced at its selected ratio; a thermal reaction is sliced on its temperature axis. Custom reactions become fixed tables. Cloning a mixture bakes its default ratio into both the gas table and reactant shares, so the clone is no longer an adjustable two-dimensional mixture reaction ([src/ksa/reactionCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts#L310-L459)). The required mixture ratio and rejection of thermal chemistry by a combustor are confirmed by `CombustorTemplate.ResolveReaction`.[^game-combustor]

For liquid/thermal design readouts, the numerical path derives exit and throat areas, evaluates full-throttle core conditions, applies flow and expansion efficiencies, then evaluates at 101325 Pa and vacuum. The nozzle model includes an over-expansion separation correction, followed by momentum-plus-pressure thrust and effective exhaust velocity ([src/ksa/enginePhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts#L336-L438), [src/ksa/enginePhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts#L580-L633)). The corresponding separation and mass-flow calculations exist in `DeLavalNozzleConfig`.[^game-nozzle]

Per-rocket aggregation sums thrust and mass flow across referenced nozzles, multiplies by the owning rocket template's placement count, and calculates aggregate Isp as total thrust divided by standard gravity times total flow. It does not sum Isp values. Explicit part-level references still name individual SubPart instances. A legacy first-pair display remains available for scopes without a rocket; a solid core redirects to the curve workflow, while the magnetic readout explicitly uses carried propellant without vehicle scoop input ([src/ui/engine/performanceAggregation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/performanceAggregation.ts#L95-L250)).

## Lifecycle and timing

`tool:authoring`: browser form changes update the part document; derived findings and performance inspect the current document and loaded reaction catalog. Issue navigation only changes editor selection. This code has no game lifecycle hook or access to a live vehicle solver. The exported module graph is later consumed by the game's template creation path; browser validation is an earlier authoring check, not a replacement for that path ([src/state/engineStore.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/state/engineStore.ts#L599-L672)).[^game-rocket]

## Key code

| Path | Role |
|---|---|
| [src/ksa/enginePhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts#L130-L203) | Log-pressure lookup and mixture-table slicing |
| [src/ksa/engineValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts#L321-L512) | Resolve scoped rocket/controller graph and diagnose structural failures |
| [src/ui/engine/performanceAggregation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/performanceAggregation.ts#L157-L189) | Mass-flow-weighted aggregate Isp |
| [src/ksa/reactionCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts#L285-L324) | Optional reaction catalog and lookup resolution |

## Snippets

```typescript
// src/ui/engine/performanceAggregation.ts L173-L189
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
```

## Game APIs touched

These are mirrored asset contracts and calculation references, not calls from the browser into KSA.

| Type/member | Contract |
|---|---|
| `KSA.RocketTemplate.Create` | [current/decomp/KSA/RocketTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs#L18-L83): resolve core/nozzle references and enforce exclusive ownership |
| `KSA.CombustorTemplate.ResolveReaction` | [current/decomp/KSA/CombustorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs#L31-L78): fixed or ratio-sliced mixture chemistry |
| `KSA.DeLavalNozzleConfig.ComputePerformance` | [current/decomp/KSA/DeLavalNozzleConfig.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs#L16-L118): expansion, separation, mass flow and exhaust velocity |

## Pitfalls and version notes

- The source describes its math as a verbatim port, but browser numbers use JavaScript arithmetic and guards. For example, Flexo clamps the exhaust-velocity square-root input to zero whereas this game's implementation directly takes its square root. Treat readouts as numerical previews of a model, not an experimentally established accuracy guarantee ([src/ksa/enginePhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/enginePhysics.ts#L306-L317)).[^game-nozzle]
- Missing licensed reaction data returns an empty catalog and disables the live preview; it does not prohibit authoring an engine. Missing chemistry must not be replaced by fabricated physical constants ([src/ksa/reactionCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/reactionCatalog.ts#L285-L302)).
- Structural validity and plausible thrust are separate checks. A clean graph does not establish vehicle-level resource supply, handling or plume appearance. Browser and in-game smoke testing were not performed for this analysis.

## See also

- [Propulsion design wizards](propulsion-design-wizards.md)
- [Solid-motor grain design](solid-motor-grain-design.md)
- [Design engine GameData with validated browser candidates](../../../howto/vehicles-and-parts/staging-and-engines/design-engine-game-data/design-engine-game-data.md) - how-to article demonstrating this feature

[^game-rocket]: [current/decomp/KSA/RocketTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/RocketTemplate.cs)
[^game-combustor]: [current/decomp/KSA/CombustorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/CombustorTemplate.cs)
[^game-nozzle]: [current/decomp/KSA/DeLavalNozzleConfig.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/DeLavalNozzleConfig.cs)
