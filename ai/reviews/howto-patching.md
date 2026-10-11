# Review: content/howto/patching (batch patching-1)

Scope: 15 topics, 71 How-To articles, 15 overviews (groups harmony, safety, transpilers, internals). Reviewer: claude-code/sonnet-5.5.

## Scores (1-5)

| Dimension | Score | Note |
|---|---|---|
| Accuracy | 4 | All 413 verbatim snippets, 213 IL lines and 749 pinned line anchors check out; one Harmony-behaviour claim was wrong and fixed |
| Coverage | 5 | Every plan approach has an article; every plan `features` id is in `demonstrated_by` and linked in the body |
| Lifecycle correctness | 5 | Matches the lifecycle reference (UnpatchAll before StarMapUnload, worker-thread rules, install points) |
| Conformance | 5 | validate_bundle 0 errors / 0 warnings, content_check_refs 0 errors, group indexes current |

## Verification performed

- Structure: all 15 topics have `overview.md` (Game Feature, `approaches` equals article count), correctly named articles, generated `index.md` and `log.md`; overview tables match article titles, numbers, topic and group.
- Snippets: a script compared every fenced block with a path comment against the pinned checkout or decomp (whitespace-normalised, `// ...` elisions respected): 448 chunks, 0 mismatches; `Source:` line anchors equal the comment ranges; 749 pinned GitHub line anchors are in range of their files.
- IL: dumped `KSA.dll` build 5554 with ilspycmd; every `IL_xxxx` line in all articles exists inside the method the listing names (213 lines, 0 bad). Re-checked specifically:
  - KSAero `ComputeDerivatives`: ocean call IL_022c, air call IL_02cf, `AtmosphericDensity` load five instructions back at IL_02c3, the buoyancy density load at IL_02db after the drag call; window 12 reaches no foreign load.
  - ShaderExtensions `RenderGame`: one `BeginRenderPass<CommandBuffer>` (IL_0f8c), one `RenderDrawData`, one `EndRenderPass`; locals [0] FrameResources, [1] CommandBuffer, [3] contents, [4] begin info; `RenderEditor` has its own copy.
  - Compendium null tests: `IsContextVisible`, `IsDisabled`, `OnReleased` use `callvirt get_Target` + `ldnull; ceq`, `UpdateNavballData` uses `call`, with a second `get_Target` feeding `NavigationTarget.Create`; `UpdateNavBallMarkers` has one.
  - RealAtmospheres `GetNearbyAstronomical`: locals 0, 1, 4, 5, `sub; ldloc.1; clt` at IL_005b-IL_005d, store pair IL_0066-IL_006b, `ldarg.3` is `nearbyDistance`.
  - AFC plan window: single `PrimaryButton` (IL_14c5) and single `Burn.Create` (IL_15e9), 98 instructions apart, below the 160 limit; `brfalse IL_1436` is the only branch to `PopWidgetStyle`; no `.try` blocks.
  - `GameSettings.OnDrawUi`: `SettingsTab.Mods` is 3, one `PopWidgetStyle`, label at IL_306a.
- Harmony behaviour: reran local experiments on Lib.Harmony 2.4.2 for finalizer outcomes (void, rethrow, null, prefix throws), `PatchAll` order and failure, transpiler throwing in `Patch`, `UnpatchAll(id)`, `UnpatchAll()`, `Unpatch(original, method)`, and the AggressiveInlining skip matrix (Release and Debug). All matched except the prefix-skip rule below. All Harmony claims in these articles are labelled as local tests or library behaviour, none as game-verified.
- Decomp: all `hooks` targets exist; game_types resolve; the ~380 `Type.Member` references found in prose exist; AggressiveInlining counts (54, 45, 38) and marked/unmarked table are correct; StarMap `DeInit` calls id-less `UnpatchAll()` before `ModLoader.Dispose` runs `StarMapUnload`.

## Defects

| File | Defect | Fixed |
|---|---|---|
| harmony/skip-the-original-method-with-a-prefix/overview.md | Said a prefix returning `false` stops all lower-priority prefixes. Local test: only later `bool` prefixes are skipped; `void` prefixes (also with `__runOriginal`) still run | yes |
| skip-the-original-method-with-a-prefix-1.md, -2.md | Repeated the same overgeneralisation | yes |
| harmony/coexist-with-other-mods-patching-the-same-method/overview.md (intro and table), -1.md step 1 | Same | yes |
| transpilers/write-a-harmony-transpiler/write-a-harmony-transpiler-1.md | "ComputeDerivatives exists three times (static body and two instance forwarders)" misattributed to one type; it is one static plus one instance on `PhysicsStates` and one instance on `ReadOnlyPhysicsStates` | yes |
| transpilers/identify-a-call-by-its-argument-il/identify-a-call-by-its-argument-il-1.md | No stated success or failure output | yes, step 5 added, `KSAero/Mod.cs` added to sources |
| transpilers/swap-one-call-inside-a-game-method-with-a-transpiler/overview.md | No pointer to the generic-call swap (`XmlLoader.Load<T>`) demonstrated by KittenExtensions | yes, link to assets/xml-patching/redirect-game-xml-loading |

## Features added

None. Mod feature `kittenextensions/xmlloader-call-site-redirect` is already used by the assets category, not this batch.

## Open concerns

- Ten articles (skip-2, skip-3, background-5, finalizer-3, reflection-4, inlining-3, identify-2, insert-4, swap-3, identify-1 before my edit) state no explicit "what you will see" line; failure modes are named but expected log output is thin. Not rewritten.
- The conventions list a KittenExtensions `XmlLoader` call-site IL check, but no article in this batch asserts that IL; the only KittenExtensions claims here (Program.Main prefix timing, `XmlHelper`, `UnsafeAccessor` on `GameSaves`/`VehicleSaves` backing fields) were verified.
- `DebuggableAttribute` 0x107 on `KSA.dll` was only confirmed by byte pattern plus the presence of `nop`s in the IL, not by metadata parsing.
- `HarmonyLib.Harmony` appears in some `game_types` lists although it is not a game type.
- `PatchAll` "declaration order" matched the experiment but is a reflection ordering detail, not a Harmony guarantee.
