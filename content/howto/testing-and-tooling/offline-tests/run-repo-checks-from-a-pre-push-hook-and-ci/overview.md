---
type: Game Feature
title: Run one check script from the pre-push hook and from CI
description: Gather boundary checks and other textual guards, tests, API-surface and lock checks, shader compiles, asset validators and CI smoke checks of bundled native libraries and guest images into one check-all script that a git hook and the CI workflow both call
topic: run-repo-checks-from-a-pre-push-hook-and-ci
category: testing-and-tooling
group: offline-tests
approaches: 4
demonstrated_by: [mods/ksarmory/features/repo-static-checks, mods/ksarmory/features/sim-boundary-headless-tests, mods/ksastructures/features/headless-tests-and-ci, mods/ksacars/features/headless-sim-tests, mods/ksagolf/features/headless-sim-tests, mods/ksa-advancedflightcomputer/features/native-solver-build-and-abi-check, mods/gatos/features/alpine-guest-image]
game_types: []
lifecycle: [thread:background]
tags: [testing, ci, git-hooks, pre-push, check-all, textual-guards, github-actions]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:16:32Z }
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
  - name: KSAStructures
    git: https://github.com/LaurensDeV/KSAStructures
    ref: c24759358381fb10290c61f9a6980b7d832ba3d4
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-github-workflows-guest-image-yml
    repo: gatOS
    path: .github/workflows/guest-image.yml
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/.github/workflows/guest-image.yml
    title: "gatOS/.github/workflows/guest-image.yml"
  - id: gatos-guest-guest-version
    repo: gatOS
    path: guest/GUEST_VERSION
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/GUEST_VERSION
    title: "gatOS/guest/GUEST_VERSION"
  - id: gatos-guest-build-image-sh
    repo: gatOS
    path: guest/build-image.sh
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/build-image.sh
    title: "gatOS/guest/build-image.sh"
  - id: gatos-guest-fetch-guest-sh
    repo: gatOS
    path: guest/fetch-guest.sh
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/fetch-guest.sh
    title: "gatOS/guest/fetch-guest.sh"
  - id: gatos-guest-rootfs-overlay-etc-inittab
    repo: gatOS
    path: guest/rootfs-overlay/etc/inittab
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/etc/inittab
    title: "gatOS/guest/rootfs-overlay/etc/inittab"
  - id: gatos-guest-rootfs-overlay-sbin-qga-gatos
    repo: gatOS
    path: guest/rootfs-overlay/sbin/qga-gatos
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/sbin/qga-gatos
    title: "gatOS/guest/rootfs-overlay/sbin/qga-gatos"
  - id: ksa-advancedflightcomputer-github-workflows-ci-yml
    repo: KSA-AdvancedFlightComputer
    path: .github/workflows/ci.yml
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/.github/workflows/ci.yml
    title: "KSA-AdvancedFlightComputer/.github/workflows/ci.yml"
  - id: ksa-advancedflightcomputer-build-nativechecks-program-cs
    repo: KSA-AdvancedFlightComputer
    path: build/NativeChecks/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/NativeChecks/Program.cs
    title: "KSA-AdvancedFlightComputer/build/NativeChecks/Program.cs"
  - id: ksa-advancedflightcomputer-build-nativechecks-native-layout-c
    repo: KSA-AdvancedFlightComputer
    path: build/NativeChecks/native-layout.c
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/NativeChecks/native-layout.c
    title: "KSA-AdvancedFlightComputer/build/NativeChecks/native-layout.c"
  - id: ksa-advancedflightcomputer-build-build-clarabel-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/build-clarabel.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/build-clarabel.ps1
    title: "KSA-AdvancedFlightComputer/build/build-clarabel.ps1"
  - id: ksa-advancedflightcomputer-build-build-scs-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/build-scs.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/build-scs.ps1
    title: "KSA-AdvancedFlightComputer/build/build-scs.ps1"
  - id: ksa-advancedflightcomputer-build-ci-install-native-tools-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/ci/install-native-tools.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ci/install-native-tools.ps1
    title: "KSA-AdvancedFlightComputer/build/ci/install-native-tools.ps1"
  - id: ksa-advancedflightcomputer-build-ci-test-guidance-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/ci/test-guidance.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ci/test-guidance.ps1
    title: "KSA-AdvancedFlightComputer/build/ci/test-guidance.ps1"
  - id: ksarmory-githooks-pre-push
    repo: KSArmory
    path: .githooks/pre-push
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/.githooks/pre-push
    title: "KSArmory/.githooks/pre-push"
  - id: ksarmory-github-workflows-ci-yml
    repo: KSArmory
    path: .github/workflows/ci.yml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/.github/workflows/ci.yml
    title: "KSArmory/.github/workflows/ci.yml"
  - id: ksarmory-tools-check-all-sh
    repo: KSArmory
    path: tools/check-all.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-all.sh
    title: "KSArmory/tools/check-all.sh"
  - id: ksarmory-tools-check-bodies-sh
    repo: KSArmory
    path: tools/check-bodies.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-bodies.sh
    title: "KSArmory/tools/check-bodies.sh"
  - id: ksarmory-tools-check-boundary-sh
    repo: KSArmory
    path: tools/check-boundary.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-boundary.sh
    title: "KSArmory/tools/check-boundary.sh"
  - id: ksarmory-tools-check-commit-msg-sh
    repo: KSArmory
    path: tools/check-commit-msg.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-commit-msg.sh
    title: "KSArmory/tools/check-commit-msg.sh"
  - id: ksarmory-tools-check-docs-sh
    repo: KSArmory
    path: tools/check-docs.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-docs.sh
    title: "KSArmory/tools/check-docs.sh"
  - id: ksarmory-tools-check-network-sh
    repo: KSArmory
    path: tools/check-network.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-network.sh
    title: "KSArmory/tools/check-network.sh"
  - id: ksarmory-tools-check-tunables-py
    repo: KSArmory
    path: tools/check-tunables.py
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-tunables.py
    title: "KSArmory/tools/check-tunables.py"
  - id: ksarmory-tools-install-hooks-sh
    repo: KSArmory
    path: tools/install-hooks.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/install-hooks.sh
    title: "KSArmory/tools/install-hooks.sh"
  - id: ksastructures-githooks-pre-push
    repo: KSAStructures
    path: .githooks/pre-push
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/.githooks/pre-push
    title: "KSAStructures/.githooks/pre-push"
  - id: ksastructures-github-workflows-ci-yml
    repo: KSAStructures
    path: .github/workflows/ci.yml
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/.github/workflows/ci.yml
    title: "KSAStructures/.github/workflows/ci.yml"
  - id: ksastructures-tools-check-all-sh
    repo: KSAStructures
    path: tools/check-all.sh
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/check-all.sh
    title: "KSAStructures/tools/check-all.sh"
  - id: ksastructures-tools-check-assemblies-sh
    repo: KSAStructures
    path: tools/check-assemblies.sh
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/check-assemblies.sh
    title: "KSAStructures/tools/check-assemblies.sh"
  - id: ksastructures-tools-check-boundary-sh
    repo: KSAStructures
    path: tools/check-boundary.sh
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/check-boundary.sh
    title: "KSAStructures/tools/check-boundary.sh"
  - id: ksastructures-tools-test-sh
    repo: KSAStructures
    path: tools/test.sh
    resource: https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/tools/test.sh
    title: "KSAStructures/tools/test.sh"
---

A mod repository accumulates rules that no compiler enforces: the pure folder must not name KSA types, only one file may touch the network, no planet may be named in code, asset ids must resolve, shaders must compile, documented numbers must match reality, no game DLL may be committed. Each rule is a small script. The practice these mods share is to list them all in one `check-all` script and to make both the git `pre-push` hook and the CI workflow call that script, so a contributor finds out before pushing what CI would say.

Game assemblies are not redistributable, so any step that needs them skips with a printed notice when they are absent. A fork or a hosted runner without the private mirror still gets a meaningful run, and the summary says which checks were skipped.

## Engine background

The game is not involved at run time; two engine-adjacent facts explain why these checks exist.

| Fact | Consequence |
|---|---|
| KSA reports a malformed or unresolvable asset as "the part does not exist", and compiles mod shaders only at load | Offline validators for XML, asset ids and GLSL turn a launch-time failure into a script failure |
| The game assemblies cannot be published | CI needs a private mirror (or skips), and a lock file of digests keeps local and CI builds on the same KSA build |
| Frame and lifecycle behaviour | Not applicable to these scripts; see [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for what the code under test does at run time |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: about twenty textual and offline checks with skip-with-notice](run-repo-checks-from-a-pre-push-hook-and-ci-1.md) | ksarmory ([tools/check-all.sh](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-all.sh#L93-L106)) | `git-hooks` | none (repo and CI time) | Catches easy mistakes cheaply; textual checks are heuristics |
| [2: check-all plus a test script and a CI that builds against a private assemblies repo](run-repo-checks-from-a-pre-push-hook-and-ci-2.md) | ksastructures ([.github/workflows/ci.yml](https://github.com/LaurensDeV/KSAStructures/blob/c24759358381fb10290c61f9a6980b7d832ba3d4/.github/workflows/ci.yml#L3-L69)) | `git-hooks`, `ci-pipeline` | none (repo and CI time) | Real build and tests in CI; needs a private mirror and a deploy key, and forks skip the build |
| [3: cargo and zig cc builds plus a C layout probe in CI](run-repo-checks-from-a-pre-push-hook-and-ci-3.md) | ksa-advancedflightcomputer ([build/ci/test-guidance.ps1](https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ci/test-guidance.ps1#L127-L142)) | `github-actions` | `thread:background` | Proves native ABI per platform with pinned compilers; one job per runtime and a heavier pipeline |
| [4: guest image build with a smoke boot, release and fetch by pin](run-repo-checks-from-a-pre-push-hook-and-ci-4.md) | gatos ([guest/build-image.sh](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/build-image.sh#L323-L362)) | `ci-pipeline` | none (repo and CI time) | A large artefact is proven bootable before publishing; needs QEMU and KVM or slow TCG |

Design rules the four share: one script with two callers; cheap, game-free checks first; skip with a reason instead of failing when a prerequisite is absent; fixed expected counts where a removed check would otherwise pass unnoticed; and keep the slow checks (drive sweeps, studies) out of the push loop but in CI.

## See also

- [Unit-test mod logic without launching the game](../unit-test-mod-logic-without-game/overview.md), [Build a mod without game references](../../../getting-started/build/build-a-mod-without-game-references/overview.md), [Build in CI without the game installed](../../../getting-started/build/build-in-ci-without-the-game-installed/overview.md)
- [Check mod shaders offline with glslang](../../../shaders/glsl-workflow/check-mod-shaders-offline-with-glslang/overview.md), [Validate asset XML references](../../../assets/validation/validate-asset-xml-references/overview.md), [Ship native libraries with a mod](../../../getting-started/dependencies/ship-native-libraries-with-a-mod/overview.md), [Package and publish a mod release](../../../getting-started/build/package-and-publish-a-mod-release/overview.md)
- [Pin the KSA build with a hashed lock](../../game-updates/pin-the-game-build-with-a-hashed-lock/overview.md)
- Mod features: [KSArmory repo static checks](../../../../mods/ksarmory/features/repo-static-checks.md), [KSAStructures headless tests and CI](../../../../mods/ksastructures/features/headless-tests-and-ci.md), [AFC native solver build and ABI check](../../../../mods/ksa-advancedflightcomputer/features/native-solver-build-and-abi-check.md), [gatOS Alpine guest image](../../../../mods/gatos/features/alpine-guest-image.md)
