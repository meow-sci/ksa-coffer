---
type: Game Feature
title: Pin the KSA build with a hashed assemblies lock and notice new builds
description: Commit SHA-256 digests of the referenced game DLLs plus the build number so local builds, a private CI mirror and the running game agree on one KSA build, stamp that build into the mod and poll the version endpoint from a scheduled job
topic: pin-the-game-build-with-a-hashed-lock
category: testing-and-tooling
group: game-updates
approaches: 1
demonstrated_by: [mods/ksarmory/features/ksa-assemblies-lock, mods/ksagolf/features/api-surface-and-assembly-lock, mods/ksacars/features/api-surface-pinning-and-diff, mods/ksastructures/features/headless-tests-and-ci]
game_types: [KSA.Vehicle, KSA.VersionInfo]
lifecycle: [startup:immediate-load]
tags: [game-update, lock-file, sha256, version-check, ci, assemblies]
status: stable
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:22:03Z }
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksarmory-github-workflows-ci-yml
    repo: KSArmory
    path: .github/workflows/ci.yml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/.github/workflows/ci.yml
    title: "KSArmory/.github/workflows/ci.yml"
  - id: ksarmory-github-workflows-ksa-version-yml
    repo: KSArmory
    path: .github/workflows/ksa-version.yml
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/.github/workflows/ksa-version.yml
    title: "KSArmory/.github/workflows/ksa-version.yml"
  - id: ksarmory-directory-build-props
    repo: KSArmory
    path: Directory.Build.props
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/Directory.Build.props
    title: "KSArmory/Directory.Build.props"
  - id: ksarmory-ksa-assemblies-lock
    repo: KSArmory
    path: ksa-assemblies.lock
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/ksa-assemblies.lock
    title: "KSArmory/ksa-assemblies.lock"
  - id: ksarmory-src-ksarmory-ksarmory-csproj
    repo: KSArmory
    path: src/KSArmory/KSArmory.csproj
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/KSArmory.csproj
    title: "KSArmory/src/KSArmory/KSArmory.csproj"
  - id: ksarmory-src-ksarmory-ksa-build-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Build.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Build.cs
    title: "KSArmory/src/KSArmory/Ksa/Build.cs"
  - id: ksarmory-src-ksarmory-ksa-ksarmorymod-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KSArmoryMod.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KSArmoryMod.cs
    title: "KSArmory/src/KSArmory/Ksa/KSArmoryMod.cs"
  - id: ksarmory-src-ksarmory-sim-reportdraft-cs
    repo: KSArmory
    path: src/KSArmory/Sim/ReportDraft.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/ReportDraft.cs
    title: "KSArmory/src/KSArmory/Sim/ReportDraft.cs"
  - id: ksarmory-tools-check-assemblies-sh
    repo: KSArmory
    path: tools/check-assemblies.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-assemblies.sh
    title: "KSArmory/tools/check-assemblies.sh"
  - id: ksarmory-tools-check-ksa-version-sh
    repo: KSArmory
    path: tools/check-ksa-version.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-ksa-version.sh
    title: "KSArmory/tools/check-ksa-version.sh"
  - id: ksa-ksa-versioninfo-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VersionInfo.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionInfo.cs
    title: "KSA.VersionInfo (decompiled, build 2026.10.10.5554)"
  - id: ksa-ksa-versionmetainfo-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/VersionMetaInfo.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionMetaInfo.cs
    title: "KSA.VersionMetaInfo (decompiled, build 2026.10.10.5554)"
---

A KSA mod is built against assemblies that are not redistributable and that change between pre-release builds. Three copies of the game exist for any mod at once: the developer's, the private mirror CI compiles against, and the player's. A lock file makes the first two agree and lets the mod notice the third.
The analysed mods commit a text file of the build number and per-DLL SHA-256 digests (safe in a public repository: only names and hashes), compare it in scripts and in CI, stamp the build into the compiled assembly, and poll the game's own version endpoint on a schedule.

## Engine background

| Piece | Where | Use |
|---|---|---|
| `VersionInfo.MASTER_URL`, `VERSION_URI` | [current/decomp/KSA/VersionInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionInfo.cs#L25-L27) | The master-server endpoint the game itself asks for the published version |
| `VersionMetaInfo` | [current/decomp/KSA/VersionMetaInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionMetaInfo.cs) | The response shape: `Version` and `Url` |
| Update comparison | [current/decomp/KSA/VersionInfo.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/VersionInfo.cs#L58-L80) | The game compares the master's version with its own and shows an update popup |
| Running build | `typeof(KSA.Vehicle).Assembly.GetName().Version` | The loaded game's own assembly version, readable at mod load |
| Mod startup | [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) | `StarMapImmediateLoad` is a safe place to log and compare the two builds |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [ksa-assemblies.lock, check-assemblies.sh and AssemblyMetadata from the lock](pin-the-game-build-with-a-hashed-lock.md) | ksarmory ([ksa-assemblies.lock](https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/ksa-assemblies.lock#L1-L5)) | `msbuild` | `startup:immediate-load` | Catches drift between developer, CI and player; the version endpoint is an undocumented public URL that may change, so the watch must not fail the build |

## See also

- [Upgrade a mod to a new KSA build](../upgrade-a-mod-to-a-new-ksa-build/overview.md), [Track the game API your mod uses](../track-the-game-api-your-mod-uses/overview.md), [Keep a searchable decompiled copy of the game next to your mod](../decompile-the-game-for-reference/overview.md)
- [Reference the game assemblies from a mod project](../../../getting-started/build/reference-game-assemblies-from-a-mod-project/overview.md), [Build in CI without the game installed](../../../getting-started/build/build-in-ci-without-the-game-installed/overview.md), [Check the game version](../../../getting-started/lifecycle/check-the-game-version/overview.md), [Validate patch targets and detect game-update breakage](../../../patching/safety/validate-patch-targets-and-detect-game-update-breakage/overview.md)
- Mod features: [KSArmory KSA assemblies lock](../../../../mods/ksarmory/features/ksa-assemblies-lock.md), [KSAGolf API surface and assembly lock](../../../../mods/ksagolf/features/api-surface-and-assembly-lock.md), [KSACars API surface pinning and diff](../../../../mods/ksacars/features/api-surface-pinning-and-diff.md)
