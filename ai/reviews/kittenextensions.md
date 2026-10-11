# Review: content/mods/kittenextensions

Reviewed 2026-10-10 against KittenExtensions `b52467541a4fda3c3771eb2c157ed7574f9e2d7c`, StarMap
`4dc60f8dfeb1d9b035d44af2601d09115c16d2aa` and decompiled KSA build 2026.10.10.5554 (`ksa-game-assemblies` `935a32b`).
The cross-check covered all ten C# files of the mod, its README and build files, `KSA/Program.cs` (`Main`, constructor
L689-L985), `KSA/ModLibrary.cs` (`PrepareManifest`, `PrepareAll`, `PreloadAssetBundles`, `LoadEditorTags`, `LoadAll`,
`AttachGameData`), `KSA/Mod.cs` (all six `XmlLoader.Load<T>` callers), `KSA/XmlLoader.cs`, `KSA/XmlHelper.cs`,
`KSA/AssetBundle.cs`, `KSA/SerializedCollection.cs`, `KSA/EditorTagDefinition.cs`, `KSA/ModManifest.cs`,
`KSA/GameSettings.cs`, `KSA/SelectSystem.cs`, StarMap `StarMapCore.cs`, `ModLoader.cs`, `RuntimeMod.cs`,
`GameSurveyer.cs` and `Patches/*.cs`, and `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`.

The XPathPatch submodule (`2d91cd2d575fd2362645127a4f3b1b03169bffa9`) is not checked out (`git submodule status` shows
`-2d91cd2...`, the folder is empty). Everything about patch operations, the document model, import errors and executor
state can only come from the README or from the names KittenExtensions uses. The bundle now labels those claims that way.

## Scores

| Dimension | Score (1-5) | Note |
|---|---|---|
| Accuracy | 3 | Snippets, anchors and most engine claims were right. But several XPathPatch behaviours were stated as code facts, the redirect table had the wrong `LoadSystems` scope for preload, and some README and original-KX claims were not hedged |
| Coverage | 5 | Ten concepts for ~2.5k LOC. The independent survey (hooks, reflection, ImGui, build, CI) found no reusable mechanism without a concept and nothing to merge |
| Lifecycle correctness | 3 | Frontmatter `lifecycle`/`hooks` were correct. The overview's startup table said the two `PrepareAll` prefixes had no fixed order (KXC's runs first), left out when StarMap's patches are applied, and missed the editor-tag first-wins effect and the debug-flag erasure timing |
| Conformance | 5 | All three validators were clean before and after. All 31 snippets are verbatim, and every line anchor is inside its file |

## Writer findings checked against code

- **Disabled mods still get patched: confirmed for import, inferred for execution.** `XmlPatcher.LoadData`
  loops over `ModLibrary.Manifest.Mods` with no `Enabled` check (`Patch/Patcher.cs` L104-L110). `LoadModData` imports
  `planetMeshes`, `systems`, `assets` and `patches` files for every entry. The `<Mod>` node gets only `Id`, `Name` and
  `Path` (L151-L162), so the executor has no data that could tell a disabled mod from an enabled one. That every
  imported `<Patch>` runs is the README's statement; the executor source is in the submodule.
- **`LoadEditorTagDefinitions` and `LoadPlanetRandomHeightmaps` bypass the redirect: confirmed.** `[HarmonyTargetMethods]`
  returns only `LoadAssetBundles`, `LoadPlanetMeshes`, `LoadSystems` and `PrepareSystems` (`Patches.cs` L35-L42). The
  other two methods call `XmlLoader.Load<T>` (`Mod.cs` L177, L370), and `ModToml` has no
  `planetRandomHeightmapCollections` key. The editor-tag effect is worse than the writer said. The preload pass never
  calls `EditorTagDefinition.OnDataLoad` (`AssetBundle.cs` L84-L108), so the unpatched `LoadEditorTags` pass is the first
  to register each `EditorTagDef`. `SerializedCollection.Register` keeps the first entry per id (`TryAdd`, L20-L35), and
  `VehicleEditor.MarkEditorTagDefinitionsLoaded` reads the flags right after. As a result, patched `<EditorTagDef>`
  entries never take effect.
- **`ModManifest.Save` drops `debug = true`: confirmed.** `ModManifest.Save` writes only `id` and `enabled`
  (`ModManifest.cs` L27-L48). It is called by the `Program` constructor after the new-mod dialog (L897), by
  `PrepareManifest` (L293, L321, which StarMap calls before `Main`), and by both settings-apply paths
  (`GameSettings.cs` L1410, L2367). `DebugEnabled` reads `manifest.toml` from disk lazily inside the `PrepareAll`
  prefix, after the constructor's save. So in a session that finds a new mod, the flag is already gone.
- **The README's `<Remove>` op does not exist in the pinned code: not decidable from code.** The pinned KittenExtensions
  code has no operation parser at all, because parsing is in XPathPatch. The evidence that remains: the README's own
  operation reference lists `<Delete>` but no `<Remove>`, and `PatchLogger.IsPatchOperation` lists `OpCopy`...`OpSetVar`
  with `OpDelete` and no remove operation (`Remove` exists only as a mutation `ActionType`). The bundle now calls
  `<Remove>` "undocumented" and says the parser could not be checked.

## Startup table (overview) verified

The old nine-step table is now ten steps. These items were wrong or missing:

| Old step | Problem | Correction (code) |
|---|---|---|
| 1-2 | No step for StarMap's own patches | New step 2: `StarMapCore.Init` calls `_loader.Init()` before `_harmony.PatchAll` (`StarMapCore.cs` L25-L29), so every mod's `BeforeMain` patches are registered before StarMap's |
| 4 | "order not fixed by priority" | Neither prefix sets a priority. Harmony orders equal-priority patches by registration, so KXC's patch run executes before StarMap's restart prompt |
| 3 | Manifest save listed without consequence | That save erases `debug = true` before KXC reads it |
| 6 | Preload `LoadSystems` scope missing | `SystemLibrary.Default` is null until the picker runs, so preload reads every system file (`Mod.cs` L133, `Program.cs` L905-L938) |
| 7 | "none: still reads unpatched files" | Adds `Preload` still true, the rebuilt `AssetBundle` serializer, and the first-wins editor-tag effect |
| 8 | `LoadAll` contents incomplete | `Preload = false`, bundle and `SystemLibrary.Lookup` reset, selected system only, `ILoader`s, `OnDataLoaded` |

New note under the table: a mod that writes one of its `mod.toml`-listed XML files in `StarMapImmediateLoad` or later is
not seen. The redirected loaders read the copy imported in the `PrepareAll` prefix.

## Lifecycle reference changes (logged in its log.md)

- `overview.md` row 10 described only `LoadAll`, although its link covers `Program.cs` L941-L943. It now covers
  `LoadEditorTags` (unredirected second pass, `Preload` still true, editor-tag registration) and `AssignDefaults`.
- Row 9: preload `LoadSystems` reads every system file. Row 8: a mod's `PrepareAll` prefix registered in `BeforeMain`
  runs before StarMap's.
- Vocabulary row `startup:asset-load` put "KittenExtensions patches" under `PreloadAssetBundles`/`LoadAll`. It now says
  the patch run is a `PrepareAll` prefix that finishes before the first `startup:immediate-load` call, and names
  `LoadEditorTags`.
- `game-loop-and-lifecycle-1.md`: the `StarMapImmediateLoad` row said "write files the asset load will read". It now
  has a caveat that this does not hold for KittenExtensions-redirected XML.
- Both files list KittenExtensions in `repos` and `sources`; `generated` is updated. A concurrent KSAStructures review
  edited rows 21-22 of the same file; both sets of changes are present.

## Defects

| File | Defect | Fixed |
|---|---|---|
| overview.md | Startup step 4: prefix order "not fixed"; KXC's runs first (registration order) | yes |
| overview.md | No step for `StarMapCore.Init` applying StarMap patches after all `BeforeMain` | yes |
| overview.md | Constructor's `ModManifest.Save` listed without the debug-flag consequence | yes |
| overview.md | Preload `LoadSystems` reads all system files; not stated | yes |
| overview.md | `LoadEditorTags` row and Compatibility missed that patched `EditorTagDef`s never take effect | yes |
| overview.md | `LoadAll` row incomplete; "fully deserialized, patched templates" without exceptions | yes |
| overview.md | `<Remove>` "non-existent" and malformed-XML failure stated as fact (XPathPatch-dependent) | yes |
| overview.md | KSA_AircraftHUD row: README links original KX v0.4.0, conflicting with pinned ShaderExtensions | yes |
| overview.md | Data-flow paragraph asserted executor semantics without README attribution | yes |
| features/gamedata-document.md | "Disabled mods ... its patches run" stated as code fact | yes |
| features/gamedata-document.md | "Neither patch sets a Harmony priority" without the resulting order | yes |
| features/gamedata-document.md | Missing pitfall: XML written in `StarMapImmediateLoad` or later is not seen | yes |
| features/xmlloader-call-site-redirect.md | Table: `LoadSystems` "only the selected system file" also for preload (wrong) | yes |
| features/xmlloader-call-site-redirect.md | "Every mod XML file in KSA" goes through `XmlLoader`: overbroad | yes |
| features/xmlloader-call-site-redirect.md | Editor-tag pitfall implied the `LoadAll` copy could win; first-wins rejection missing | yes |
| features/xpath-patch-operations.md | "`<Remove>` is not an operation" asserted; parser not in checkout | yes |
| features/xpath-patch-operations.md | "register types before `Program.Main` returns control" (registration is a `Main` prefix) | yes |
| features/xpath-patch-operations.md | "complete operation vocabulary" without caveat that the enum and parser are in XPathPatch | yes |
| features/custom-xml-asset-types.md | Dependents "not loaded" when KXC's `BeforeMain` runs (assemblies may be loaded; not initialized) | yes |
| features/custom-xml-asset-types.md | Missing pitfall: assemblies of never-initialized mods are scanned too | yes |
| features/patch-debug-stepper.md | Flag-erasure pitfall missed the settings-apply manifest saves | yes |
| features/patch-session-log.md | Disabled-mod execution and mutation semantics not attributed to README/XPathPatch | yes |
| features/patch-session-log.md | Backslash log path: consequence on non-Windows not stated | yes |
| features/continued-fork-identity.md | Coexistence mechanics assume original KX code (not in reference set) | yes |
| features/imgui-tree-view.md | Default expand state described inverted ("open above `defaultExpandDepth`") | yes |
| howto .../overview.md | Row 10 omitted `LoadEditorTags` and `AssignDefaults` | yes |
| howto .../overview.md | Row 9 omitted preload `LoadSystems` scope | yes |
| howto .../overview.md | Row 8 omitted same-method prefix order | yes |
| howto .../overview.md | `startup:asset-load` vocabulary row put KXC patches under Preload/LoadAll | yes |
| howto .../game-loop-and-lifecycle-1.md | `StarMapImmediateLoad` "write files the asset load will read" without the KXC caveat | yes |
| ai/catalog/kittenextensions.yml | Summary asserted executor semantics; missing generic topics (Harmony order on shared methods, first-wins duplicate ids) | yes |

## Features added

None. The survey (all `[StarMap*]` attributes, Harmony patches, `UnsafeAccessor`, ImGui and Vulkan use, build and CI
files) found every reusable mechanism already covered. The smaller helpers (`LineBuilder`, `ImGuiEx.Space`) are described
inside the debugger and popup concepts; they are not distinct features.

## Open concerns

- XPathPatch is not checked out. Still unverified: operation semantics, `<Remove>` handling, what `ImportFile` does on
  missing or malformed files, whether `Executor.Done` becomes true after an error (so whether "Start Game" can appear),
  and `PatchMod.File` lookup behaviour.
- The Harmony order claim (equal priority, registration order) follows Harmony 2.x's patch sorter and agrees with the
  ShaderExtensions bundle, but nobody observed it at run time. StarMap ships its own `0Harmony.dll`, whose version is not
  pinned in the StarMap repo.
- `PopupTask` has drifted from build 5554's `SelectSystem.OnFrame`: it lacks `WaitForPreviousPresent`,
  `InputSampleTicks` and `ImGuiBackend.Vulkan.UpdateMainRenderPass` on rebuild. The run-time impact is untested.
- KSA_AircraftHUD's README links the original KittenExtensions. Whether it works with KXC plus the pinned
  ShaderExtensions was not tested.
