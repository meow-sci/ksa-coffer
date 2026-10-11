---
type: Game Feature
title: Unit-test mod logic without launching the game
description: Choose where the game boundary sits so maths, models, parsers and state machines compile with no KSA assembly, then run them as tests on any machine and in CI
topic: unit-test-mod-logic-without-game
category: testing-and-tooling
group: offline-tests
approaches: 5
demonstrated_by: [mods/ksagolf/features/headless-sim-tests, mods/ksacars/features/headless-sim-tests, mods/ksarmory/features/sim-boundary-headless-tests, mods/ksastructures/features/headless-tests-and-ci, mods/ksaero/features/headless-model-tests, mods/ksa-deltavmap/features/offline-layout-and-math-tests, mods/ksa-advancedflightcomputer/features/game-free-guidance-checks, mods/ksa-advancedflightcomputer/features/solver-problem-json-replay, mods/purrtty/features/headless-test-suites, mods/gatos/features/compile-gated-game-seam, mods/gatos/features/build-deploy-and-ci]
game_types: [Brutal.Numerics.double3, KSA.Vehicle, KSA.Universe, Brutal.ImGuiApi.Abstractions.ConsoleWindow]
lifecycle: [thread:background, event:headless-test-run, startup:all-mods-loaded]
tags: [testing, headless, unit-tests, sim-boundary, msbuild, ci, determinism]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:05:29Z }
repos:
  - name: KSAGolf
    git: https://github.com/LaurensDeV/KSAGolf.git
    ref: f3e6ab72b5b963f615cb4ed41f7765a7bce42688
  - name: KSAero
    git: https://github.com/cairn5/KSAero.git
    ref: 3e7e26c9c694a563048261bd6e426e817377d404
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSA-DeltaVMap
    git: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap
    ref: 0441981a4c59b90e462fd81fc20d3924b356841a
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-github-workflows-build-yml
    repo: gatOS
    path: .github/workflows/build.yml
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/.github/workflows/build.yml
    title: "gatOS/.github/workflows/build.yml"
  - id: gatos-directory-build-props
    repo: gatOS
    path: Directory.Build.props
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/Directory.Build.props
    title: "gatOS/Directory.Build.props"
  - id: gatos-gatos-gamemod-game-mod-game-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Mod.Game.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Mod.Game.cs
    title: "gatOS/gatOS.GameMod/Game/Mod.Game.cs"
  - id: gatos-gatos-gamemod-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-gatos-gamemod-gatos-gamemod-csproj
    repo: gatOS
    path: gatOS.GameMod/gatOS.GameMod.csproj
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/gatOS.GameMod.csproj
    title: "gatOS/gatOS.GameMod/gatOS.GameMod.csproj"
  - id: gatos-gatos-vm-tests-testenv-cs
    repo: gatOS
    path: gatOS.Vm.Tests/TestEnv.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm.Tests/TestEnv.cs
    title: "gatOS/gatOS.Vm.Tests/TestEnv.cs"
  - id: ksa-advancedflightcomputer-advancedflightcomputer-advancedflightcomputer-csproj
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/AdvancedFlightComputer.csproj
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/AdvancedFlightComputer.csproj
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/AdvancedFlightComputer.csproj"
  - id: ksa-advancedflightcomputer-build-ci-test-guidance-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/ci/test-guidance.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ci/test-guidance.ps1
    title: "KSA-AdvancedFlightComputer/build/ci/test-guidance.ps1"
  - id: ksa-advancedflightcomputer-tests-advancedflightcomputer-guidance-tests-gfold-python-ref-gfold-ref-py
    repo: KSA-AdvancedFlightComputer
    path: tests/AdvancedFlightComputer.Guidance.Tests/Gfold/python_ref/gfold_ref.py
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Gfold/python_ref/gfold_ref.py
    title: "KSA-AdvancedFlightComputer/tests/AdvancedFlightComputer.Guidance.Tests/Gfold/python_ref/gfold_ref.py"
  - id: ksa-advancedflightcomputer-tests-advancedflightcomputer-guidance-tests-scvx-program-cs
    repo: KSA-AdvancedFlightComputer
    path: tests/AdvancedFlightComputer.Guidance.Tests/Scvx/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Scvx/Program.cs
    title: "KSA-AdvancedFlightComputer/tests/AdvancedFlightComputer.Guidance.Tests/Scvx/Program.cs"
  - id: ksa-advancedflightcomputer-tests-advancedflightcomputer-guidance-tests-scvx-python-ref-dyn-ref-py
    repo: KSA-AdvancedFlightComputer
    path: tests/AdvancedFlightComputer.Guidance.Tests/Scvx/python_ref/dyn_ref.py
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Scvx/python_ref/dyn_ref.py
    title: "KSA-AdvancedFlightComputer/tests/AdvancedFlightComputer.Guidance.Tests/Scvx/python_ref/dyn_ref.py"
  - id: ksa-advancedflightcomputer-tests-advancedflightcomputer-guidance-tests-worker-tests-program-cs
    repo: KSA-AdvancedFlightComputer
    path: tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Program.cs
    title: "KSA-AdvancedFlightComputer/tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Program.cs"
  - id: ksa-advancedflightcomputer-tests-advancedflightcomputer-guidance-tests-worker-tests-worker-tests-csproj
    repo: KSA-AdvancedFlightComputer
    path: tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Worker.Tests.csproj
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Worker.Tests.csproj
    title: "KSA-AdvancedFlightComputer/tests/AdvancedFlightComputer.Guidance.Tests/Worker.Tests/Worker.Tests.csproj"
  - id: ksa-deltavmap-deltavmap-tests-deltavmap-tests-csproj
    repo: KSA-DeltaVMap
    path: DeltaVMap.Tests/DeltaVMap.Tests.csproj
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap.Tests/DeltaVMap.Tests.csproj
    title: "KSA-DeltaVMap/DeltaVMap.Tests/DeltaVMap.Tests.csproj"
  - id: ksa-deltavmap-deltavmap-tests-program-cs
    repo: KSA-DeltaVMap
    path: DeltaVMap.Tests/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-DeltaVMap/blob/0441981a4c59b90e462fd81fc20d3924b356841a/DeltaVMap.Tests/Program.cs
    title: "KSA-DeltaVMap/DeltaVMap.Tests/Program.cs"
  - id: ksaero-ksaero-tests-ksaero-tests-csproj
    repo: KSAero
    path: KSAero.Tests/KSAero.Tests.csproj
    resource: https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero.Tests/KSAero.Tests.csproj
    title: "KSAero/KSAero.Tests/KSAero.Tests.csproj"
  - id: ksaero-ksaero-tests-program-cs
    repo: KSAero
    path: KSAero.Tests/Program.cs
    resource: https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero.Tests/Program.cs
    title: "KSAero/KSAero.Tests/Program.cs"
  - id: ksaero-ksaero-aeromodel-cs
    repo: KSAero
    path: KSAero/AeroModel.cs
    resource: https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero/AeroModel.cs
    title: "KSAero/KSAero/AeroModel.cs"
  - id: ksagolf-tests-ksagolf-tests-ksagolf-tests-csproj
    repo: KSAGolf
    path: tests/KSAGolf.Tests/KSAGolf.Tests.csproj
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tests/KSAGolf.Tests/KSAGolf.Tests.csproj
    title: "KSAGolf/tests/KSAGolf.Tests/KSAGolf.Tests.csproj"
  - id: ksagolf-tests-ksagolf-tests-skippedframetests-cs
    repo: KSAGolf
    path: tests/KSAGolf.Tests/SkippedFrameTests.cs
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tests/KSAGolf.Tests/SkippedFrameTests.cs
    title: "KSAGolf/tests/KSAGolf.Tests/SkippedFrameTests.cs"
  - id: ksagolf-tools-check-boundary-sh
    repo: KSAGolf
    path: tools/check-boundary.sh
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/check-boundary.sh
    title: "KSAGolf/tools/check-boundary.sh"
  - id: ksagolf-tools-test-sh
    repo: KSAGolf
    path: tools/test.sh
    resource: https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tools/test.sh
    title: "KSAGolf/tools/test.sh"
  - id: ksarmory-tests-ksarmory-tests-ksarmory-tests-csproj
    repo: KSArmory
    path: tests/KSArmory.Tests/KSArmory.Tests.csproj
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tests/KSArmory.Tests/KSArmory.Tests.csproj
    title: "KSArmory/tests/KSArmory.Tests/KSArmory.Tests.csproj"
  - id: ksastructures-directory-build-props
    repo: KSAStructures
    path: Directory.Build.props
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/Directory.Build.props
    title: "KSAStructures/Directory.Build.props"
  - id: purrtty-github-workflows-release-yml
    repo: purrtty
    path: .github/workflows/release.yml
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/.github/workflows/release.yml
    title: "purrtty/.github/workflows/release.yml"
  - id: purrtty-docs-build-and-test-md
    repo: purrtty
    path: docs/build-and-test.md
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/docs/build-and-test.md
    title: "purrtty/docs/build-and-test.md"
  - id: purrtty-purrtty-customshellcontract-tests-property-customshellregistryproperties-cs
    repo: purrtty
    path: purrTTY.CustomShellContract.Tests/Property/CustomShellRegistryProperties.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract.Tests/Property/CustomShellRegistryProperties.cs
    title: "purrtty/purrTTY.CustomShellContract.Tests/Property/CustomShellRegistryProperties.cs"
  - id: purrtty-purrtty-customshellcontract-tests-unit-baselinebufferedshelltests-cs
    repo: purrtty
    path: purrTTY.CustomShellContract.Tests/Unit/BaseLineBufferedShellTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract.Tests/Unit/BaseLineBufferedShellTests.cs
    title: "purrtty/purrTTY.CustomShellContract.Tests/Unit/BaseLineBufferedShellTests.cs"
  - id: purrtty-purrtty-customshells-tests-unit-gameconsoleshelltests-cs
    repo: purrtty
    path: purrTTY.CustomShells.Tests/Unit/GameConsoleShellTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShells.Tests/Unit/GameConsoleShellTests.cs
    title: "purrtty/purrTTY.CustomShells.Tests/Unit/GameConsoleShellTests.cs"
  - id: purrtty-purrtty-customshells-tests-purrtty-customshells-tests-csproj
    repo: purrtty
    path: purrTTY.CustomShells.Tests/purrTTY.CustomShells.Tests.csproj
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShells.Tests/purrTTY.CustomShells.Tests.csproj
    title: "purrtty/purrTTY.CustomShells.Tests/purrTTY.CustomShells.Tests.csproj"
  - id: purrtty-purrtty-terminal-tests-unixprocessmanagertests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/UnixProcessManagerTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/UnixProcessManagerTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/UnixProcessManagerTests.cs"
  - id: ksa-brutal-imguiapi-abstractions-consolewindow-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs
    title: "Brutal.ImGuiApi.Abstractions.ConsoleWindow (decompiled, build 2026.10.10.5554)"
  - id: ksa-brutal-numerics-double3-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.Numerics/double3.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.Numerics/double3.cs
    title: "Brutal.Numerics.double3 (decompiled, build 2026.10.10.5554)"
  - id: ksa-ksa-simstep-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/SimStep.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SimStep.cs
    title: "KSA.SimStep (decompiled, build 2026.10.10.5554)"
  - id: ksa-ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA.Universe (decompiled, build 2026.10.10.5554)"
  - id: ksa-ksa-vehicleproperties-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VehicleProperties.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VehicleProperties.cs
    title: "KSA.VehicleProperties (decompiled, build 2026.10.10.5554)"
---

A running KSA session is the slowest, least repeatable test environment a mod has: the assemblies are not redistributable, the code you care about often runs on worker threads or per frame, and a bug that needs a particular frame order cannot be re-run on demand. The mods analysed here avoid it by drawing a boundary so that most of the mod's logic (physics, drag, contact maths, grid models, camera maths, frame bookkeeping, command parsing, numerics) names no KSA type and compiles into an ordinary test project.
What is left on the game side is thin adapter code that converts engine values into plain data.

Five variations on that idea differ in where the boundary is drawn and how the tests are run. Pick by size: a console executable for a small model, a linked `Sim/` folder for a large mod, separate assemblies for heavy numerics, a layered NUnit suite for a mod with a clean backend and a compile-gated `Game/` folder when even the entry project must build without the game.

## Engine background

Nothing in the engine is under test; these are the points where the pure side meets it.

| Piece | Where | Use |
|---|---|---|
| `Brutal.Numerics.double3` | [current/decomp/Brutal.Numerics/double3.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.Numerics/double3.cs) | The one game type pure code usually needs; ships in `Brutal.Core.Numerics.dll`, so the test project can reference it without KSA |
| `Universe.GetLastSimStep()`, `GetElapsedSeconds()` | [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2381-L2395) | The typical adapter-side seam: the adapter reads the last applied step and hands plain seconds to the pure side |
| `SimStep` | [current/decomp/KSA/SimStep.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/SimStep.cs) | `PreviousTime`, `NextTime`, `DeltaTime`: what a frame-stepping latch consumes |
| Frame order | [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) | What the adapters wrap, and which frames an adapter can miss |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: xUnit project linking a game-free Sim folder](unit-test-mod-logic-without-game-1.md) | ksagolf ([tests/KSAGolf.Tests/KSAGolf.Tests.csproj](https://github.com/LaurensDeV/KSAGolf/blob/f3e6ab72b5b963f615cb4ed41f7765a7bce42688/tests/KSAGolf.Tests/KSAGolf.Tests.csproj#L28-L36)) | `msbuild-linked-sources` | `event:headless-test-run` | Boundary enforced by the compiler; needs two Brutal maths DLLs, so forks without them rely on a textual check |
| [2: console executable with invariants and an exit code](unit-test-mod-logic-without-game-2.md) | ksaero ([KSAero.Tests/KSAero.Tests.csproj](https://github.com/cairn5/KSAero/blob/3e7e26c9c694a563048261bd6e426e817377d404/KSAero.Tests/KSAero.Tests.csproj)) | `console-checks` | `event:headless-test-run` | Cheapest for a small mod; no discovery, filtering or isolation |
| [3: console checks against Python reference fixtures](unit-test-mod-logic-without-game-3.md) | ksa-advancedflightcomputer ([tests/AdvancedFlightComputer.Guidance.Tests/Scvx/Program.cs](https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/tests/AdvancedFlightComputer.Guidance.Tests/Scvx/Program.cs)) | `console-checks` | `event:headless-test-run`, `thread:background` | Numerics checked against an independent implementation; fixtures must be regenerated by hand |
| [4: NUnit suites, property tests and silent success](unit-test-mod-logic-without-game-4.md) | purrtty ([purrTTY.CustomShellContract.Tests/Unit/BaseLineBufferedShellTests.cs](https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract.Tests/Unit/BaseLineBufferedShellTests.cs#L77-L108)) | `nunit` | `event:headless-test-run`, `thread:background` | Full framework features and a three-OS matrix; discipline needed for sleeps and output |
| [5: compile-gated Game folder with partial methods](unit-test-mod-logic-without-game-5.md) | gatos ([gatOS.GameMod/gatOS.GameMod.csproj](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/gatOS.GameMod.csproj#L19-L28)) | `msbuild` | `startup:all-mods-loaded`, `event:headless-test-run` | Even the entry project builds without the game; partial-method seams are restrictive |

Where the boundary sits, in practice:

- **A folder** (`Sim/` against `Ksa/`): everything that names a KSA type lives in one folder; everything else is linked wholesale into the test project (approach 1).
- **A file**: individual pure files are shared between the mod and a test exe with `Compile Include`, and the mod removes them from its own build when a harness compiles them (approach 2).
- **An assembly**: separate csprojs with no game references, joined to the mod by `ProjectReference` (approach 3).
- **A compile-gated half**: the game-facing folder disappears from compilation when the DLLs are missing (approach 5).

Whatever the shape, make time and threads deterministic (a sentinel flush instead of a sleep, an injected clock instead of wall time) and gate slow or platform-specific tests behind an opt-in switch or an OS check.

## See also

- Offline neighbours: [Run the mod's whole simulation in a headless rig](../run-mod-simulation-in-a-headless-rig/overview.md), [Test a mod against the real game with HeadlessHarness](../headless-test-harness-for-game-mods/overview.md), [Run one check script from the pre-push hook and from CI](../run-repo-checks-from-a-pre-push-hook-and-ci/overview.md)
- [Build a mod without game references](../../../getting-started/build/build-a-mod-without-game-references/overview.md), [Build in CI without the game installed](../../../getting-started/build/build-in-ci-without-the-game-installed/overview.md), [Simulate bodies outside the vehicle system](../../../physics/mod-simulation/simulate-bodies-outside-the-vehicle-system/overview.md), [Compute mission elapsed time and detect liftoff](../../../flight-and-orbits/flight-state/compute-mission-elapsed-time-and-detect-liftoff/overview.md)
- Mod features: [KSAGolf](../../../../mods/ksagolf/features/headless-sim-tests.md), [KSACars](../../../../mods/ksacars/features/headless-sim-tests.md), [KSArmory](../../../../mods/ksarmory/features/sim-boundary-headless-tests.md), [KSAStructures](../../../../mods/ksastructures/features/headless-tests-and-ci.md), [KSAero](../../../../mods/ksaero/features/headless-model-tests.md), [KSA-DeltaVMap](../../../../mods/ksa-deltavmap/features/offline-layout-and-math-tests.md), [AFC game-free checks](../../../../mods/ksa-advancedflightcomputer/features/game-free-guidance-checks.md), [purrTTY](../../../../mods/purrtty/features/headless-test-suites.md), [gatOS](../../../../mods/gatos/features/compile-gated-game-seam.md)
