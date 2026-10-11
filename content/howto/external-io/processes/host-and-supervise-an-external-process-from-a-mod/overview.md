---
type: Game Feature
title: Host and supervise an external process or virtual machine from a KSA mod
description: Start a child process from the game without blocking the frame or leaking it, with output pumps, a queued writer, readiness probing and bounded shutdown at unload, shown for a QEMU microVM, a Windows pseudoconsole shell, a Unix pty shell and background shell detection
topic: host-and-supervise-an-external-process-from-a-mod
category: external-io
group: processes
approaches: 4
game_types: [KSA.Program]
lifecycle: [startup:all-mods-loaded, frame:draw-ui, thread:background, event:unload]
demonstrated_by: [mods/gatos/features/qemu-microvm-host-process, mods/gatos/features/qcow2-overlay-guest-disks, mods/gatos/features/alpine-guest-image, mods/purrtty/features/conpty-shell-hosting, mods/purrtty/features/posix-pty-spawn-without-fork, mods/purrtty/features/shell-detection-and-command-resolution]
tags: [process, qemu, vm, conpty, pty, supervision, shutdown, threading, qcow2]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:52:52Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
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
  - id: gatos-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-accelfailureclassifier-cs
    repo: gatOS
    path: gatOS.Vm/AccelFailureClassifier.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/AccelFailureClassifier.cs
    title: "gatOS/gatOS.Vm/AccelFailureClassifier.cs"
  - id: gatos-disklock-cs
    repo: gatOS
    path: gatOS.Vm/DiskLock.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/DiskLock.cs
    title: "gatOS/gatOS.Vm/DiskLock.cs"
  - id: gatos-diskmanager-cs
    repo: gatOS
    path: gatOS.Vm/DiskManager.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/DiskManager.cs
    title: "gatOS/gatOS.Vm/DiskManager.cs"
  - id: gatos-gatospaths-cs
    repo: gatOS
    path: gatOS.Vm/GatOsPaths.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/GatOsPaths.cs
    title: "gatOS/gatOS.Vm/GatOsPaths.cs"
  - id: gatos-guestmanifest-cs
    repo: gatOS
    path: gatOS.Vm/GuestManifest.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/GuestManifest.cs
    title: "gatOS/gatOS.Vm/GuestManifest.cs"
  - id: gatos-qemucommandbuilder-cs
    repo: gatOS
    path: gatOS.Vm/QemuCommandBuilder.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/QemuCommandBuilder.cs
    title: "gatOS/gatOS.Vm/QemuCommandBuilder.cs"
  - id: gatos-qemulocator-cs
    repo: gatOS
    path: gatOS.Vm/QemuLocator.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/QemuLocator.cs
    title: "gatOS/gatOS.Vm/QemuLocator.cs"
  - id: gatos-qemuprocess-cs
    repo: gatOS
    path: gatOS.Vm/QemuProcess.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/QemuProcess.cs
    title: "gatOS/gatOS.Vm/QemuProcess.cs"
  - id: gatos-readinessprobe-cs
    repo: gatOS
    path: gatOS.Vm/ReadinessProbe.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/ReadinessProbe.cs
    title: "gatOS/gatOS.Vm/ReadinessProbe.cs"
  - id: gatos-vmhost-cs
    repo: gatOS
    path: gatOS.Vm/VmHost.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/VmHost.cs
    title: "gatOS/gatOS.Vm/VmHost.cs"
  - id: gatos-readme-md
    repo: gatOS
    path: guest/README.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/README.md
    title: "gatOS/guest/README.md"
  - id: gatos-build-image-sh
    repo: gatOS
    path: guest/build-image.sh
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/build-image.sh
    title: "gatOS/guest/build-image.sh"
  - id: gatos-fetch-guest-sh
    repo: gatOS
    path: guest/fetch-guest.sh
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/fetch-guest.sh
    title: "gatOS/guest/fetch-guest.sh"
  - id: gatos-inittab
    repo: gatOS
    path: guest/rootfs-overlay/etc/inittab
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/etc/inittab
    title: "gatOS/guest/rootfs-overlay/etc/inittab"
  - id: purrtty-ghosttyterminalcontroller-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/GhosttyTerminalController.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/GhosttyTerminalController.cs
    title: "purrtty/purrTTY.Display/Ghostty/GhosttyTerminalController.cs"
  - id: purrtty-shellmenucache-cs
    repo: purrtty
    path: purrTTY.GameMod/ShellMenuCache.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/ShellMenuCache.cs
    title: "purrtty/purrTTY.GameMod/ShellMenuCache.cs"
  - id: purrtty-conptyprocessmanagertests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/ConPtyProcessManagerTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/ConPtyProcessManagerTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/ConPtyProcessManagerTests.cs"
  - id: purrtty-ptyinputcontracttests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/PtyInputContractTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/PtyInputContractTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/PtyInputContractTests.cs"
  - id: purrtty-unixprocessmanagertests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/UnixProcessManagerTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/UnixProcessManagerTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/UnixProcessManagerTests.cs"
  - id: purrtty-attributelistbuilder-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/AttributeListBuilder.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/AttributeListBuilder.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/AttributeListBuilder.cs"
  - id: purrtty-conptyoutputpump-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/ConPtyOutputPump.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/ConPtyOutputPump.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/ConPtyOutputPump.cs"
  - id: purrtty-conptypipemanager-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/ConPtyPipeManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/ConPtyPipeManager.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/ConPtyPipeManager.cs"
  - id: purrtty-ptyinputqueue-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/PtyInputQueue.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/PtyInputQueue.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/PtyInputQueue.cs"
  - id: purrtty-ptyteardown-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/PtyTeardown.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/PtyTeardown.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/PtyTeardown.cs"
  - id: purrtty-shellcommandresolver-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/ShellCommandResolver.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/ShellCommandResolver.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/ShellCommandResolver.cs"
  - id: purrtty-startupinfobuilder-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/StartupInfoBuilder.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/StartupInfoBuilder.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/StartupInfoBuilder.cs"
  - id: purrtty-unixptynative-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/UnixPtyNative.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/UnixPtyNative.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/UnixPtyNative.cs"
  - id: purrtty-unixptyoutputpump-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/UnixPtyOutputPump.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/UnixPtyOutputPump.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/UnixPtyOutputPump.cs"
  - id: purrtty-unixptyspawner-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/UnixPtySpawner.cs"
  - id: purrtty-processlaunchoptions-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/ProcessLaunchOptions.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/ProcessLaunchOptions.cs
    title: "purrtty/purrTTY.Terminal/Pty/ProcessLaunchOptions.cs"
  - id: purrtty-processmanager-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/ProcessManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/ProcessManager.cs
    title: "purrtty/purrTTY.Terminal/Pty/ProcessManager.cs"
  - id: purrtty-shellavailabilitychecker-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/ShellAvailabilityChecker.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/ShellAvailabilityChecker.cs
    title: "purrtty/purrTTY.Terminal/Pty/ShellAvailabilityChecker.cs"
  - id: purrtty-unixprocessmanager-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/UnixProcessManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/UnixProcessManager.cs
    title: "purrtty/purrTTY.Terminal/Pty/UnixProcessManager.cs"
  - id: purrtty-unixshelldetector-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/UnixShellDetector.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/UnixShellDetector.cs
    title: "purrtty/purrTTY.Terminal/Pty/UnixShellDetector.cs"
  - id: purrtty-wsldistributiondetector-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/WslDistributionDetector.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/WslDistributionDetector.cs
    title: "purrtty/purrTTY.Terminal/Pty/WslDistributionDetector.cs"
  - id: purrtty-terminalsessionfactory-cs
    repo: purrtty
    path: purrTTY.Terminal/Sessions/TerminalSessionFactory.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Sessions/TerminalSessionFactory.cs
    title: "purrtty/purrTTY.Terminal/Sessions/TerminalSessionFactory.cs"
  - id: starmap-modloader-cs
    repo: StarMap
    path: StarMap.Core/ModRepository/ModLoader.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModLoader.cs
    title: "StarMap/StarMap.Core/ModRepository/ModLoader.cs"
  - id: starmap-modlibrarypatches-cs
    repo: StarMap
    path: StarMap.Core/Patches/ModLibraryPatches.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ModLibraryPatches.cs
    title: "StarMap/StarMap.Core/Patches/ModLibraryPatches.cs"
  - id: starmap-starmapcore-cs
    repo: StarMap
    path: StarMap.Core/StarMapCore.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMapCore.cs
    title: "StarMap/StarMap.Core/StarMapCore.cs"
  - id: starmap-program-cs
    repo: StarMap
    path: StarMap/Program.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/Program.cs
    title: "StarMap/StarMap/Program.cs"
---

Some mods need code that is not managed C# loaded into the game: a shell, a Linux guest, a compiler, a native tool. The reliable way to run it is as a child process, supervised from the mod. KSA gives no help here. The game is a large, heavily threaded process with a frame loop that must never wait on I/O, and the host (StarMap) decides when the mod is unloaded. This topic is about the supervision around the child:

- starting it off the frame, with a bounded readiness check;
- pumping its output on a thread that never sleeps, and writing its input from a queue so a stalled child cannot block the caller;
- tearing it down in a defined order, with timeouts at every wait, and refusing to close a handle another thread is blocked on;
- making sure the game exit is never held by a child that will not stop.

Four shapes are covered. A long-lived QEMU virtual machine (with its accelerator selection, copy-on-write disks and pinned guest image), a Windows ConPTY shell, a Unix pty shell started without `fork()`, and the detection of installed shells and launch command lines that feeds a menu.

## Engine background

KSA has no process-hosting API; the relevant facts are about when mod code may run and what the host does on exit.

| Fact | Where | Consequence |
|---|---|---|
| Mod initialisation runs in `StarMapAllModsLoaded` on the main thread | [the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) (`startup:all-mods-loaded`) | Create hosts and probes there, but start nothing that waits |
| The frame must not wait on I/O | `Program.OnFrame` is one main-thread call per frame | Spawn, probe, resize and teardown run on pool tasks; the UI reads a volatile status |
| `StarMapUnload` runs from `ModLoader.Dispose`, after the game's entry point returns | [StarMap/Program.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap/Program.cs#L21-L28), [StarMap.Core/ModRepository/ModLoader.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModLoader.cs#L143-L150) | A normal exit runs unload; `Environment.Exit` does not |
| StarMap's own restart paths call `Environment.Exit(0)` | [StarMap.Core/Patches/ModLibraryPatches.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ModLibraryPatches.cs#L60-L73) | On those exits unload is skipped; a child that must die with the game needs its own safeguard |
| `StarMapCore.DeInit` unpatches every Harmony patch before the unload methods run | [StarMap.Core/StarMapCore.cs](https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/StarMapCore.cs#L31-L35) | Per-mod `UnpatchAll(id)` calls in unload are no-ops with this StarMap |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: QEMU microVM with async boot, accelerator ladder, qcow2 overlays](host-and-supervise-an-external-process-from-a-mod-1.md) | gatos | `process-hosting` | `thread:background`, `event:unload` | A whole Linux guest, portable across OSes; QEMU must be installed on Linux and macOS and boot takes seconds |
| [2: Windows ConPTY with a never-sleeping pump](host-and-supervise-an-external-process-from-a-mod-2.md) | purrtty | `native-interop` | `thread:background`, `frame:draw-ui` | Real shells on Windows with full-screen TUI support; Win32 handle discipline is subtle |
| [3: POSIX pty via posix_openpt and posix_spawnp](host-and-supervise-an-external-process-from-a-mod-3.md) | purrtty | `native-interop` | `thread:background`, `frame:draw-ui` | No fork in a large process; libc P/Invoke with per-OS constants and an Apple arm64 ABI trap |
| [4: Shell and WSL detection, command resolution, menu cache](host-and-supervise-an-external-process-from-a-mod-4.md) | purrtty | `background-thread` | `startup:all-mods-loaded`, `thread:background`, `frame:draw-ui` | Menus only offer shells that will start; detection is cached and may be stale |

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Clean up on game exit](../../../getting-started/lifecycle/clean-up-on-game-exit/overview.md): the unload path in general
- [Bind and vendor native C libraries with layout-exact P/Invoke](../bind-and-vendor-native-c-libraries/overview.md): the Apple arm64 variadic pitfall and per-assembly native resolution
- [Host a terminal emulator in the game](../../terminals/host-a-terminal-with-pty-sessions-and-frame-handoff/overview.md): how the pty output reaches the frame
- [Connect a VM guest to the game](../host-guest-transports-tcp-9p-and-ssh/overview.md), [Bridge a serial port and bus protocols to the game](../../network/bridge-a-serial-port-and-bus-protocols-to-the-game/overview.md)
- Choosing where a mod stores its files is covered in a separate topic.
- [Find where KSA keeps user data and choose where a mod stores its config and data files](../../../persistence/user-data/choose-where-a-mod-stores-its-files/overview.md) - related topic

