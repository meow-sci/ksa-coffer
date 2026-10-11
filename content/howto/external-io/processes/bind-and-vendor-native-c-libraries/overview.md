---
type: Game Feature
title: Bind and vendor native C libraries with layout-exact P/Invoke
description: Call a C or Rust library from a KSA mod safely with layout-exact structs checked against the headers, a startup layout self-check, thread ownership rules, per-RID builds, a vendored and patched upstream binding and the Apple arm64 variadic-call pitfall
topic: bind-and-vendor-native-c-libraries
category: external-io
group: processes
approaches: 3
game_types: []
lifecycle: [startup:all-mods-loaded, frame:dispatch-solvers, thread:background]
demonstrated_by: [mods/purrtty/features/vendored-libghostty-vt-binding, mods/ksa-advancedflightcomputer/features/native-conic-solver-interop, mods/ksa-advancedflightcomputer/features/native-solver-build-and-abi-check, mods/purrtty/features/posix-pty-spawn-without-fork]
tags: [pinvoke, native, interop, abi, vendoring, libraryimport, structs, variadic, rid]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:56:43Z }
status: stable
repos:
  - name: KSA-AdvancedFlightComputer
    git: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer.git
    ref: 77c0ccf5608e49c459eec72c3a56d0b30d62da63
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-advancedflightcomputer-ccsassembler-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/CcsAssembler.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/CcsAssembler.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/CcsAssembler.cs"
  - id: ksa-advancedflightcomputer-clarabelnative-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/ClarabelNative.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/ClarabelNative.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/ClarabelNative.cs"
  - id: ksa-advancedflightcomputer-clarabelsolver-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/ClarabelSolver.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/ClarabelSolver.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/ClarabelSolver.cs"
  - id: ksa-advancedflightcomputer-nativelibraries-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/NativeLibraries.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/NativeLibraries.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/NativeLibraries.cs"
  - id: ksa-advancedflightcomputer-scsnative-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/ScsNative.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/ScsNative.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/ScsNative.cs"
  - id: ksa-advancedflightcomputer-scsworkspace-cs
    repo: KSA-AdvancedFlightComputer
    path: AdvancedFlightComputer/Features/Guidance/Conic/ScsWorkspace.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/AdvancedFlightComputer/Features/Guidance/Conic/ScsWorkspace.cs
    title: "KSA-AdvancedFlightComputer/AdvancedFlightComputer/Features/Guidance/Conic/ScsWorkspace.cs"
  - id: ksa-advancedflightcomputer-program-cs
    repo: KSA-AdvancedFlightComputer
    path: build/NativeChecks/Program.cs
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/NativeChecks/Program.cs
    title: "KSA-AdvancedFlightComputer/build/NativeChecks/Program.cs"
  - id: ksa-advancedflightcomputer-native-layout-c
    repo: KSA-AdvancedFlightComputer
    path: build/NativeChecks/native-layout.c
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/NativeChecks/native-layout.c
    title: "KSA-AdvancedFlightComputer/build/NativeChecks/native-layout.c"
  - id: ksa-advancedflightcomputer-build-clarabel-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/build-clarabel.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/build-clarabel.ps1
    title: "KSA-AdvancedFlightComputer/build/build-clarabel.ps1"
  - id: ksa-advancedflightcomputer-build-scs-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/build-scs.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/build-scs.ps1
    title: "KSA-AdvancedFlightComputer/build/build-scs.ps1"
  - id: ksa-advancedflightcomputer-install-native-tools-ps1
    repo: KSA-AdvancedFlightComputer
    path: build/ci/install-native-tools.ps1
    resource: https://github.com/Maximilian-Nesslauer/KSA-AdvancedFlightComputer/blob/77c0ccf5608e49c459eec72c3a56d0b30d62da63/build/ci/install-native-tools.ps1
    title: "KSA-AdvancedFlightComputer/build/ci/install-native-tools.ps1"
  - id: purrtty-gotchas-md
    repo: purrtty
    path: docs/gotchas.md
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/docs/gotchas.md
    title: "purrtty/docs/gotchas.md"
  - id: purrtty-ghosttyterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs"
  - id: purrtty-unixptynative-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/UnixPtyNative.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/UnixPtyNative.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/UnixPtyNative.cs"
  - id: purrtty-unixptyspawner-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs"
  - id: purrtty-unixprocessmanager-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/UnixProcessManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/UnixProcessManager.cs
    title: "purrtty/purrTTY.Terminal/Pty/UnixProcessManager.cs"
  - id: purrtty-ghostty-vt-csproj
    repo: purrtty
    path: vendor/Ghostty.Vt/Ghostty.Vt.csproj
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/Ghostty.Vt.csproj
    title: "purrtty/vendor/Ghostty.Vt/Ghostty.Vt.csproj"
  - id: purrtty-readme-md
    repo: purrtty
    path: vendor/Ghostty.Vt/README.md
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/README.md
    title: "purrtty/vendor/Ghostty.Vt/README.md"
  - id: purrtty-vendor-ghostty-vt-native-patches-readme-md
    repo: purrtty
    path: vendor/Ghostty.Vt/native-patches/README.md
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/native-patches/README.md
    title: "purrtty/vendor/Ghostty.Vt/native-patches/README.md"
  - id: purrtty-keyencoder-cs
    repo: purrtty
    path: vendor/Ghostty.Vt/src/KeyEncoder.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/src/KeyEncoder.cs
    title: "purrtty/vendor/Ghostty.Vt/src/KeyEncoder.cs"
  - id: purrtty-nativelibraryresolver-cs
    repo: purrtty
    path: vendor/Ghostty.Vt/src/Native/NativeLibraryResolver.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/src/Native/NativeLibraryResolver.cs
    title: "purrtty/vendor/Ghostty.Vt/src/Native/NativeLibraryResolver.cs"
  - id: purrtty-nativemethods-cs
    repo: purrtty
    path: vendor/Ghostty.Vt/src/Native/NativeMethods.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/src/Native/NativeMethods.cs
    title: "purrtty/vendor/Ghostty.Vt/src/Native/NativeMethods.cs"
  - id: purrtty-renderstate-framereader-cs
    repo: purrtty
    path: vendor/Ghostty.Vt/src/RenderState.FrameReader.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/vendor/Ghostty.Vt/src/RenderState.FrameReader.cs
    title: "purrtty/vendor/Ghostty.Vt/src/RenderState.FrameReader.cs"
  - id: starmap-modassemblyloadcontext-cs
    repo: StarMap
    path: StarMap.Core/ModRepository/ModAssemblyLoadContext.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModAssemblyLoadContext.cs
    title: "StarMap/StarMap.Core/ModRepository/ModAssemblyLoadContext.cs"
  - id: starmap-gamesurveyer-cs
    repo: StarMap
    path: StarMap/GameSurveyer.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/GameSurveyer.cs
    title: "StarMap/StarMap/GameSurveyer.cs"
---

Some jobs are better done by an existing native library than by a C# port: a terminal emulation engine, a convex solver, a compression codec. KSA mods can bind them with P/Invoke, but the managed/native boundary has failure modes that look like nothing at the call site: structs read at the wrong offset, a `bool` marshalled as four bytes, a span that points at a freed stack buffer, a variadic call whose last argument lands in the wrong place on one CPU. The three approaches here are the defences the reference mods use:

- **Vendor the binding, mark local changes, and fail loudly on drift.** A copied upstream binding is pruned, patched where it has lifetime bugs, and guarded by a startup self-check that compares the managed decode with the native accessors.
- **Make layouts exact and prove them.** Structs are copied from the headers, `bool` fields are one byte, index arrays are the width the C API wants, and a probe compiled from the same headers compares `sizeof` and `offsetof` with what .NET computes.
- **Know the ABI traps that no header shows.** For example, variadic functions on Apple arm64.

Loading the library from the mod folder (StarMap gives each mod its own `AssemblyLoadContext` and does not resolve natives for you) is covered in [Ship native libraries with a mod](../../../getting-started/dependencies/ship-native-libraries-with-a-mod/overview.md).

## Engine background

KSA has no native-interop facility; the facts that matter are about loading and threading.

| Fact | Consequence |
|---|---|
| Each mod loads in its own `ModAssemblyLoadContext`, which does not override `LoadUnmanagedDll` | Register a `DllImportResolver` for the binding's assembly (from a `[ModuleInitializer]`) and load from the assembly directory |
| One `SetDllImportResolver` per assembly | Every native library of that assembly goes through one switch |
| `Vehicle.PrepareWorker` and the ImGui draw run on the main thread; solver workers run elsewhere | A native handle must have one owning thread; do not share it between the main thread and a background solve |
| Lazy P/Invoke resolution | A missing library surfaces as `DllNotFoundException` at the first call, not at load |

See [the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) and [Run an expensive solve without stalling the frame](../../../flight-and-orbits/guidance/run-an-expensive-solve-without-stalling-the-frame/overview.md) for the thread side.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: vendored libghostty-vt binding with managed packed-cell decoding and a startup self-check](bind-and-vendor-native-c-libraries-1.md) | purrtty | `native-interop` | `startup:all-mods-loaded`, `frame:draw-ui` | A whole engine you do not have to write; you now own a fork of the binding and three native builds |
| [2: Clarabel and SCS solvers with layout-exact structs, reused sparse patterns and single-thread ownership](bind-and-vendor-native-c-libraries-2.md) | ksa-advancedflightcomputer | `native-interop` | `frame:dispatch-solvers`, `thread:background` | Fast convex solves; hand-written layouts that must be checked per platform |
| [3: pad register arguments for variadic C calls on Apple arm64](bind-and-vendor-native-c-libraries-3.md) | purrtty | `native-interop` | `thread:background` | A small, searchable fix for one platform; easy to miss because Linux and Windows work |

## See also

- [Ship native libraries with a mod](../../../getting-started/dependencies/ship-native-libraries-with-a-mod/overview.md), [Ship third-party DLLs with a mod](../../../getting-started/dependencies/ship-third-party-dlls-with-a-mod/overview.md)
- [Run an expensive solve without stalling the frame](../../../flight-and-orbits/guidance/run-an-expensive-solve-without-stalling-the-frame/overview.md)
- [Host and supervise an external process or virtual machine from a KSA mod](../host-and-supervise-an-external-process-from-a-mod/overview.md)
