# Review: content/howto/kittens (batch kittens-1)

Reviewer: claude-code/sonnet-5.5, 2026-10-10. Scope: 15 topics (15 overviews, 41 articles) in the groups characters,
animation, eva and appearance, checked against the decomp (build 2026.10.10.5554), the pinned mod checkouts under
`references/`, `current/Content/Core/CharacterAssets.xml` and the lifecycle reference
`getting-started/lifecycle/game-loop-and-lifecycle/` (treated as the authority on timing).

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | Engine claims, defaults and numbers (70 tuning floats, mode table, servo formulas, material record layout, shader branches) all traced; a handful of wording and metadata defects fixed |
| Coverage | 5 | 15/15 topics, every planned approach has an article, every plan `features` id is in `demonstrated_by` and linked from its article; one dropped plan item restored |
| Lifecycle correctness | 4 | Frame placement of render-data updates, the settled window and the PrepareWorker prefix are right everywhere; two timing statements were imprecise and are fixed (physics timestep granularity, gauge button state) |
| Conformance | 5 | validate_bundle 0/0, content_check_refs 0 errors, build_indexes --check clean apart from the category-level index (ignored as instructed) |

## What was checked

- Structure script over `ai/catalog/batches/kittens-1.yml`: topic dir, overview type `Game Feature`, `approaches` equals article
  count, article naming (`<slug>.md` vs `<slug>-N.md`), `approach` field, `log.md`, generated `index.md`, `demonstrated_by` ids exist on
  disk, every plan feature id present in the article for that approach. 15/15 topics, no gaps. Plan and batch topic sets are identical.
- Snippets: 304 fenced blocks compared with the checkouts restricted to the cited line ranges: all match verbatim; two were
  not verbatim-checkable by design (labelled `adapted`). One multi-range XML excerpt lacked elision markers (fixed). All `#Lx-Ly`
  anchors were bounds-checked (3 were past end of file, fixed) and the first line of every anchored range was inspected.
- Engine claims: every backticked `Type.Member` that maps to a decomp type was grepped; frontmatter `game_types` resolved against
  the decomp (one non-game type removed). Read in full: `KittenEva`, `KittenRenderable`, `AnimatedRenderable`, `CharacterAvatar`,
  `CharacterReference` (+ Core/Ground reference loaders), `IVASeat`, `Vehicle.Teleport/UpdateSeatedCrewRenderData`,
  `KittenLocomotion`, `KittenServoPrecomp`, `KittenLocomotionTuning`, `PhysicsBubble` (wake rule, constrained step loop,
  `AdvanceKittenLocomotion`), `GpuObjectSystem`, `MaterialData`, shaders, `Program` (render loops, `OnFrameEditor`, editor
  dispose order in `PrepareFrame`, `OnFrameController`, `IsWindowOpen` lifetime), `VehicleEditor`, `VehicleSaveData`,
  `GaugeCanvas`, `CanvasRenderer`, `GaugeBundle`, `ShadowRenderable`/shadow pool, `StaticMeshRenderable`, `ConstraintSim`.
- Known facts: `GpuObjectSystem.CreateObject` is public and doh reflects only because `AssetName` is in an unreferenced
  assembly: stated correctly in tint approach 2 and 3 (and the editor topic). `define-a-kitten-character-in-asset-xml` says in its
  intro, overview, trade-off table and example banner that no reference mod declares a `Character` and that the example is
  untested.

## Defects found

| File | Defect | Fixed |
|---|---|---|
| `eva/kitten-locomotion-and-servo-reference/overview.md`, `-1.md`; `eva/steer-a-walking-kitten/overview.md`, `-1.md` | Locomotion advance, servo gains and the `StepGrounded` prefix/postfix were described as once per step. `PhysicsBubble.FullPhysicsConstrainedStep` slices a step into timesteps of at most 1/60 s and runs `KittenServoPrecomp.Compute` and `AdvanceKittenLocomotion` per slice (several per frame under timewarp); the camera inputs are copied once per frame in `KittenEva.PrepareWorker` | yes |
| `eva/treat-an-eva-kitten-as-a-rocket/overview.md`, `-1.md`, `-3.md` | Gauge button policy placed wholly in `frame:draw-ui`. `IsContextVisible` and click eligibility run in `GaugeCanvas.OnDrawUi`, but `GaugeButtonFlightComputer.PackData` (which also calls `IsFlightComputerDisabled`) runs every frame from `CanvasRenderer.Render` -> `GaugeBundle.UpdateInstanceBuffer` during command recording (lifecycle reference, render row 21). Table split, `render:gauges` added to frontmatter | yes |
| `characters/spawn-an-eva-kitten-from-code/spawn-an-eva-kitten-from-code-1.md` | Repeated doh's "X right, Y up, Z forward, default 10 m ahead" for an offset that is rotated by `Vehicle.GetAsmb2Cci()` (assembly frame, where stock part XML uses +X as forward); presented as fact. Reworded with the stock-XML evidence | yes |
| same file, and `overview.md` | `KSA.VehicleProvider` listed in `game_types`; it is an unscience abstraction, not a game type | yes |
| same file | Plan item "spawned-but-untinted problems are warnings" (`SpawnResult.Warning`) was dropped | yes |
| `characters/define-a-kitten-character-in-asset-xml/define-a-kitten-character-in-asset-xml.md` | "quoted below" pointed at a quotation that does not exist; the three-range ground-animation XML excerpt had no elision markers between ranges | yes |
| `animation/pose-kitten-bones-with-an-anim-processor/-2.md`, `overview.md` | Frontmatter and overview row listed only `frame:render` although the body says the processor is attached from the UI pass or after-on-frame (KSACars `StepOnce`) | yes |
| `animation/play-a-specific-kitten-animation-clip/play-a-specific-kitten-animation-clip.md` | List of game-written `FreezeAnimation` cases omitted the stationary ladder climb (KittenRenderable L506); `StarMapAfterGui` hook missing from frontmatter; plan note about sampling a restored phase on a frozen model missing | yes |
| `animation/animate-and-draw-seated-kitten-crew/-3.md` | Two mod link anchors ran past end of file (`OfficeFurniture.cs#L1-L120`, `CraftSpawner.cs#L1-L80`) | yes (L1-L105, L1-L73) |
| `eva/treat-an-eva-kitten-as-a-rocket/-3.md` | `IronManRenderPatches.cs#L9-L100` past end of file | yes (L9-L92) |
| `appearance/attach-a-prop-to-a-kitten-bone/-1.md` | Asset XML excerpt headed with a C# style `//` comment | yes (`<!-- ... -->`) |

Files changed materially carry `generated.by: claude-code/sonnet-5.5`; topic `log.md` files carry an **Update** entry.

## Features added

None. No reusable mechanism in the batch's scope lacked a mod feature page; this is a how-to bundle.

## Open concerns (not changed)

- Out-of-scope files still say `GpuObjectSystem.CreateObject` is private: `content/mods/unscience/features/doh-runtime-gpu-materials.md`
  L183, `ai/catalog/howto-plan.yml` L16585 and `ai/catalog/batches/kittens-1.yml` L960 (the how-to articles are correct).
- `ResolveTangentBasis` fallback "the camera's up, which points behind the view" (steer topic, locomotion overview) is the mod
  authors' observation; the decomp shows the fallback (`Cross(right, forward)` when the flattened forward is under about 3
  degrees) but not which way that vector points.
- Build-history remarks that come only from mod notes (5348/5474/5482 signature changes, "unchanged across builds 5402 to
  5554", KSAGolf's second-load prop bug, pending in-game acceptance) could not be checked and are attributed to the mods.
- Replacement shadow entries in the first-person hide topic leave `ShadowRenderable.Center` at (0, 0, 0); the article
  discloses this and that it is unverified in game. Cascade culling does use `Center` (`AddPoolToShadowBucket`).
- Category index `content/howto/kittens/index.md` is out of date (ignored per instructions; the orchestrator regenerates it).
