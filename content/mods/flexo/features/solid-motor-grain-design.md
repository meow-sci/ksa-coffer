---
type: Mod Feature
title: Solid-motor grain design
description: Resolve authored grain stacks and preview vacuum thrust curves by combining grain regression, pressure balance and automatic nozzle sizing
mod: flexo
category: vehicles-and-parts
tags:
  - solid-motors
  - grain
  - propulsion
  - authoring
  - numerical-preview
techniques:
  - xml-asset
  - lookup-table
  - numerical-integration
  - pure-model
game_types:
  - KSA.SolidMotor
  - KSA.SolidMotorTemplate
  - KSA.SolidGrainSegment
  - KSA.SolidMotorNozzle
  - KSA.PartTree
  - KSA.GrainGeometryTemplate
lifecycle:
  - tool:authoring
hooks: []
generated:
  by: codex/gpt-6
  at: 2026-10-14T02:16:21Z
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
    path: src/ksa/solidMotorPhysics.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts
    title: Browser grain regression and motor solver
  - id: catalog
    repo: flexo
    path: src/ksa/grainGeometryCatalog.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/grainGeometryCatalog.ts
    title: Grain lookup tables and solid storage densities
  - id: resolution
    repo: flexo
    path: src/ui/engine/solidCurveResolution.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts
    title: Scoped grain and nozzle resolution
  - id: validation
    repo: flexo
    path: src/ksa/engineValidation.ts
    resource: https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts
    title: Solid reaction and casing validation
  - id: game-motor
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotor.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs
    title: KSA.SolidMotor, build 2026.10.10.5554
  - id: game-motor-template
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotorTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorTemplate.cs
    title: KSA.SolidMotorTemplate, build 2026.10.10.5554
  - id: game-grain
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidGrainSegment.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidGrainSegment.cs
    title: KSA.SolidGrainSegment, build 2026.10.10.5554
  - id: game-profile
    repo: ksa-game-assemblies
    path: current/decomp/KSA/GrainGeometryTemplate.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GrainGeometryTemplate.cs
    title: KSA.GrainGeometryTemplate, build 2026.10.10.5554
  - id: game-nozzle
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SolidMotorNozzle.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorNozzle.cs
    title: KSA.SolidMotorNozzle, build 2026.10.10.5554
  - id: game-tree
    repo: ksa-game-assemblies
    path: current/decomp/KSA/PartTree.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs
    title: KSA.PartTree, build 2026.10.10.5554
---

Flexo previews a solid motor as a time-varying burn, using a grain geometry lookup table, propellant density, a pressure-dependent burn law and the nozzles referenced by the motor's rocket. This is useful when designing asset-only boosters: changing casing dimensions or grain profile changes the burning area, which changes chamber pressure, throat sizing and the thrust curve.

## How it works

### Load profiles and resolve actual authored feeds

Grain profiles are dimensionless parallel arrays of regression depth, burning perimeter and port area. The catalog parser discards rows containing non-finite values, sorts the remaining depth rows, requires at least two usable rows beginning at zero, and rejects negative perimeter or non-increasing depth/port area. It separately reads positive solid storage densities from the propellant library ([src/ksa/grainGeometryCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/grainGeometryCatalog.ts#L33-L134)). `GrainGeometryTemplate.Create` throws if any original row is non-finite, so a table accepted by the browser after filtering can still fail native loading. The remaining game-side shape checks also throw rather than silently omitting the profile.[^game-profile]

The UI resolver follows a selected rocket to its motor, resolves grain container references in their owner scope and deduplicates them by instance plus identifier. Parent feed wiring uses instance-specific entries first, then unscoped entries. Nozzles come from the rocket's bindings, including each binding's area-ratio multiplier. An unresolved or connector-based feed returns an explanatory unavailable state instead of sampling an incomplete stack ([src/ui/engine/solidCurveResolution.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts#L62-L124)).

That connector boundary matters: `PartTree.ResolveSolidMotorStack` can traverse connected neighboring parts and gather their grain modules. Flexo is editing an individual part and cannot infer the eventual vehicle assembly.[^game-tree]

### Convert a profile into burning area and remaining mass

For each segment, the inner radius is the outer radius minus wall thickness, with millimeters converted to meters. Initial grain volume is normalized initial grain area times radius squared times segment length. At a regression depth, the lookup table supplies perimeter and port area: burning area scales as perimeter × radius × length; consumed propellant volume follows the growth in port area ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L123-L201)). These two depth-dependent operations correspond to `SolidGrainSegment.ComputeBurningAreaAtDepth` and `ComputeGrainMassAtDepth`.[^game-grain]

The curve needs the solid propellant's storage density. Casing material/density/mass fields are a separate structural concern; a casing density cannot stand in for the propellant density required by the solver. Missing grain catalog, reaction, burn-rate data, density or referenced geometry leaves the curve unavailable ([src/ui/engine/solidCurveResolution.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts#L126-L205), [src/ksa/engineValidation.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/engineValidation.ts#L725-L751)).

### Resize the throat before sampling the burn

The browser solver seeds throat area using a ratio of 12, but does not retain that seed as the final design. It samples the stack's peak and valley burning area, derives ignition and quench constraints, floors the permissible ratio at 1.2 and solves a design ratio within the resulting bounds. Each nozzle receives a share proportional to exit area divided by its authored area-ratio multiplier ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L228-L269), [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L512-L583)). The game uses the same throat-sizing concept in `SolidMotor.ResizeNozzles` and `SolidMotorNozzle.ThroatSizingArea`.[^game-motor][^game-nozzle]

At each depth, an eight-iteration fixed-point solve balances generated propellant flow against nozzle mass flow, clamps pressure to the reaction table's range and warm-starts from the previous pressure. The burn law uses pressure converted from Pa to MPa before exponentiation. A separate condensed-exhaust efficiency reduces exhaust velocity, rather than mass flow ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L208-L224), [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L272-L301), [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L386-L429)). Current game code confirms the eight-iteration balance and velocity correction.[^game-motor][^game-nozzle]

### Integrate depth into time

The sampler walks 256 equal depth steps. Time is the trapezoidal integral of reciprocal burn rate; after ignition, the quench threshold drops to half the minimum ignition pressure. On quench, it interpolates the last depth interval. The result is sampled onto an evenly spaced time axis, defaulting to 128 points, and returns vacuum thrust, Isp, chamber pressure, burn duration, unburnable grain mass and the first nozzle's resulting ratio ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L649-L708), [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L804-L847)). The game likewise computes a burn grid and resamples vacuum performance for its preview.[^game-motor]

## Lifecycle and timing

`tool:authoring`: the engine UI resolves its document and catalogs into pure sampler inputs, then derives the curve. No browser code runs inside a game physics step. The curve describes the authored part's resolvable grain stack; actual gameplay stack discovery belongs to the later game assembly process ([src/ui/engine/solidCurveResolution.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts#L173-L205)).[^game-tree]

## Key code

| Path | Role |
|---|---|
| [src/ksa/grainGeometryCatalog.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/grainGeometryCatalog.ts#L80-L134) | Parse normalized profiles and storage densities |
| [src/ui/engine/solidCurveResolution.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ui/engine/solidCurveResolution.ts#L62-L124) | Resolve scoped feeds and reject assembly-dependent previews |
| [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L759-L847) | Validate solver inputs, resize nozzles and sample the burn |

## Snippets

The browser samples only after building a valid motor and resizing its nozzles:

```typescript
// src/ksa/solidMotorPhysics.ts L804-L817
export function sampleThrustCurve(
  input: SolidMotorInput,
  sampleCount = 128,
): ThrustCurveSample | null {
  if (sampleCount < 2) return null;
  const motor = buildMotor(input);
  if (!motor || motor.segments.length === 0 || motor.nozzles.length === 0) return null;
  if (resizeNozzles(motor) !== null) return null;

  const unburnableMasses = unburnableGrainMasses(motor);
  const grid = computeBurnGrid(motor);
  if (!grid) return null;
  const profile = evaluateThrustProfile(motor, grid.conditions, 0);
  if (!profile) return null;
```

## Game APIs touched

These are source models and exported asset contracts, not in-process browser API calls.

| Type/member | Contract |
|---|---|
| `KSA.SolidMotorTemplate.Create` | [current/decomp/KSA/SolidMotorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorTemplate.cs#L21-L63): require a fixed solid reaction, one solid reactant, burn law and valid default pressure |
| `KSA.GrainGeometryTemplate.Create` | [current/decomp/KSA/GrainGeometryTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GrainGeometryTemplate.cs#L36-L82): validate normalized profile rows |
| `KSA.SolidGrainSegment.ComputeBurningAreaAtDepth` / `ComputeGrainMassAtDepth` | [current/decomp/KSA/SolidGrainSegment.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidGrainSegment.cs#L223-L247): dimensional grain regression |
| `KSA.SolidMotor.ResizeNozzles` / `SolveConditionsForArea` | [current/decomp/KSA/SolidMotor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs#L574-L687): throat bounds and pressure balance |
| `KSA.SolidMotor.TrySampleThrustCurve` | [current/decomp/KSA/SolidMotor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs#L413-L448): sample a vacuum performance curve |
| `KSA.SolidMotorNozzle.ThroatSizingArea` / `RefreshTwoPhaseEfficiency` | [current/decomp/KSA/SolidMotorNozzle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorNozzle.cs#L19-L107): nozzle share and condensed-exhaust correction |
| `KSA.PartTree.ResolveSolidMotorStack` | [current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs#L709-L774): traverse the assembled vehicle's case connections |

## Pitfalls and version notes

- Do not equate a missing curve with an invalid mod. Connector-fed stacks and unavailable licensed catalogs can be legitimate authoring states with insufficient information for this preview.
- The solver's internal pressure clamp does not legalize invalid XML. `SolidMotorTemplate.Create` requires default pressure strictly above the minimum and at or below the maximum stable pressure; Flexo checks that separately.[^game-motor-template]
- This is a numerical browser preview, not an empirically verified flight simulation. JavaScript arithmetic, sampled geometry and single-part inputs limit equivalence. Current game nozzle sizing additionally accepts a `ManualAreaRatio` override; Flexo's sampler input does not carry that saved/runtime override ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L304-L324)).[^game-motor]
- The reported headline `vacuumIspS` uses mass flow at peak thrust, not a burn-integrated average. The returned curve arrays allow viewing how Isp and pressure change over time ([src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L719-L755), [src/ksa/solidMotorPhysics.ts](https://github.com/meow-sci/flexo/blob/e804879abfc1d45ca1c174a9c95c5fded58c1bf2/src/ksa/solidMotorPhysics.ts#L835-L846)).

## See also

- [Engine design and validation](engine-design-and-validation.md)
- [Propulsion design wizards](propulsion-design-wizards.md)
- [Design engine GameData with validated browser candidates](../../../howto/vehicles-and-parts/staging-and-engines/design-engine-game-data/design-engine-game-data.md) - how-to article demonstrating this feature

[^game-motor]: [current/decomp/KSA/SolidMotor.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotor.cs)
[^game-motor-template]: [current/decomp/KSA/SolidMotorTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorTemplate.cs)
[^game-grain]: [current/decomp/KSA/SolidGrainSegment.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidGrainSegment.cs)
[^game-profile]: [current/decomp/KSA/GrainGeometryTemplate.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/GrainGeometryTemplate.cs)
[^game-nozzle]: [current/decomp/KSA/SolidMotorNozzle.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SolidMotorNozzle.cs)
[^game-tree]: [current/decomp/KSA/PartTree.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/PartTree.cs)
