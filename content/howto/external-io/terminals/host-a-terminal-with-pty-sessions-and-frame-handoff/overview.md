---
type: Game Feature
title: "Host a terminal emulator in the game with pty sessions, custom shells and thread-to-frame handoff"
description: "Run a terminal tab in the game with blocking pty I/O on background threads and every main-thread API on one StarMapAfterGui tick, with bounded queues, custom shells and SSH sessions"
topic: host-a-terminal-with-pty-sessions-and-frame-handoff
category: external-io
group: terminals
approaches: 4
game_types: [KSA.Program, Brutal.ImGuiApi.Abstractions.TerminalInterface, Brutal.ImGuiApi.Abstractions.ConsoleWindow, Brutal.ImGuiApi.ImColor8]
lifecycle: ["frame:draw-ui", "thread:background", "startup:all-mods-loaded", "frame:input"]
demonstrated_by: [mods/purrtty/features/pty-threads-to-frame-tick-handoff, mods/purrtty/features/headless-terminal-surface-and-frame-snapshot, mods/purrtty/features/custom-shell-registry-and-lifecycle, mods/purrtty/features/game-console-shell, mods/gatos/features/ssh-shell-session-into-guest, mods/gatos/features/purrtty-custom-shell-contract]
tags: [terminal, pty, threading, custom-shell, ssh, imgui, starmap]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:30:38Z }
status: stable
repos:
  - name: StarMap
    git: https://github.com/StarMapLoader/StarMap.git
    ref: 4dc60f8dfeb1d9b035d44af2601d09115c16d2aa
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA decomp: KSA/Program.cs (build 2026.10.10.5554)"
  - id: starmap-programpatcher-cs
    repo: StarMap
    path: StarMap.Core/Patches/ProgramPatcher.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/Patches/ProgramPatcher.cs
    title: "StarMap/StarMap.Core/Patches/ProgramPatcher.cs"
  - id: purrtty-terminalmod-cs
    repo: purrtty
    path: purrTTY.GameMod/TerminalMod.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/TerminalMod.cs
    title: "purrtty/purrTTY.GameMod/TerminalMod.cs"
  - id: purrtty-ghosttyterminalcontroller-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/GhosttyTerminalController.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/GhosttyTerminalController.cs
    title: "purrtty/purrTTY.Display/Ghostty/GhosttyTerminalController.cs"
  - id: purrtty-sessionmanager-cs
    repo: purrtty
    path: purrTTY.Terminal/Sessions/SessionManager.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Sessions/SessionManager.cs
    title: "purrtty/purrTTY.Terminal/Sessions/SessionManager.cs"
  - id: purrtty-terminalsession-cs
    repo: purrtty
    path: purrTTY.Terminal/Sessions/TerminalSession.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Sessions/TerminalSession.cs
    title: "purrtty/purrTTY.Terminal/Sessions/TerminalSession.cs"
  - id: purrtty-ptyinputqueue-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/Process/PtyInputQueue.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/Process/PtyInputQueue.cs
    title: "purrtty/purrTTY.Terminal/Pty/Process/PtyInputQueue.cs"
  - id: purrtty-terminalwindow-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/TerminalWindow.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/TerminalWindow.cs
    title: "purrtty/purrTTY.Display/Ghostty/TerminalWindow.cs"
  - id: purrtty-terminalsessionwiringtests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/TerminalSessionWiringTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/TerminalSessionWiringTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/TerminalSessionWiringTests.cs"
  - id: purrtty-iterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/ITerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/ITerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/ITerminalSurface.cs"
  - id: purrtty-ghosttyterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs"
  - id: purrtty-terminalframe-cs
    repo: purrtty
    path: purrTTY.Terminal/Rendering/TerminalFrame.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Rendering/TerminalFrame.cs
    title: "purrtty/purrTTY.Terminal/Rendering/TerminalFrame.cs"
  - id: purrtty-inboxbackpressuretests-cs
    repo: purrtty
    path: purrTTY.Terminal.Tests/InboxBackpressureTests.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal.Tests/InboxBackpressureTests.cs
    title: "purrtty/purrTTY.Terminal.Tests/InboxBackpressureTests.cs"
  - id: ksa-terminalinterface-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi.Abstractions/TerminalInterface.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi.Abstractions/TerminalInterface.cs
    title: "KSA decomp: Brutal.ImGuiApi.Abstractions/TerminalInterface.cs (build 2026.10.10.5554)"
  - id: ksa-consolewindow-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs
    title: "KSA decomp: Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs (build 2026.10.10.5554)"
  - id: ksa-consolewindowex-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ConsoleWindowEx.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ConsoleWindowEx.cs
    title: "KSA decomp: KSA/ConsoleWindowEx.cs (build 2026.10.10.5554)"
  - id: purrtty-icustomshell-cs
    repo: purrtty
    path: purrTTY.CustomShellContract/ICustomShell.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract/ICustomShell.cs
    title: "purrtty/purrTTY.CustomShellContract/ICustomShell.cs"
  - id: purrtty-baselinebufferedshell-cs
    repo: purrtty
    path: purrTTY.CustomShellContract/Base/BaseLineBufferedShell.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract/Base/BaseLineBufferedShell.cs
    title: "purrtty/purrTTY.CustomShellContract/Base/BaseLineBufferedShell.cs"
  - id: purrtty-customshellregistry-cs
    repo: purrtty
    path: purrTTY.CustomShellContract/CustomShellRegistry.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShellContract/CustomShellRegistry.cs
    title: "purrtty/purrTTY.CustomShellContract/CustomShellRegistry.cs"
  - id: purrtty-gameconsoleshell-cs
    repo: purrtty
    path: purrTTY.CustomShells/GameConsoleShell.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.CustomShells/GameConsoleShell.cs
    title: "purrtty/purrTTY.CustomShells/GameConsoleShell.cs"
  - id: purrtty-consolewindowprintpatch-cs
    repo: purrtty
    path: purrTTY.GameMod/Patches/ConsoleWindowPrintPatch.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.GameMod/Patches/ConsoleWindowPrintPatch.cs
    title: "purrtty/purrTTY.GameMod/Patches/ConsoleWindowPrintPatch.cs"
  - id: purrtty-customshellptybridge-cs
    repo: purrtty
    path: purrTTY.Terminal/Pty/CustomShellPtyBridge.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Pty/CustomShellPtyBridge.cs
    title: "purrtty/purrTTY.Terminal/Pty/CustomShellPtyBridge.cs"
  - id: gatos-sshshellsession-cs
    repo: gatOS
    path: gatOS.Ssh/SshShellSession.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/SshShellSession.cs
    title: "gatOS/gatOS.Ssh/SshShellSession.cs"
  - id: gatos-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-mod-toml
    repo: gatOS
    path: gatOS.GameMod/mod.toml
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/mod.toml
    title: "gatOS/gatOS.GameMod/mod.toml"
  - id: gatos-vmconnectionbroker-cs
    repo: gatOS
    path: gatOS.Ssh/VmConnectionBroker.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/VmConnectionBroker.cs
    title: "gatOS/gatOS.Ssh/VmConnectionBroker.cs"
  - id: gatos-shellinputqueue-cs
    repo: gatOS
    path: gatOS.Ssh/ShellInputQueue.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/ShellInputQueue.cs
    title: "gatOS/gatOS.Ssh/ShellInputQueue.cs"
  - id: gatos-sshshellchannel-cs
    repo: gatOS
    path: gatOS.Ssh/SshShellChannel.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/SshShellChannel.cs
    title: "gatOS/gatOS.Ssh/SshShellChannel.cs"
  - id: starmap-runtimemod-cs
    repo: StarMap
    path: StarMap.Core/ModRepository/RuntimeMod.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/RuntimeMod.cs
    title: "StarMap/StarMap.Core/ModRepository/RuntimeMod.cs"
  - id: starmap-modassemblyloadcontext-cs
    repo: StarMap
    path: StarMap.Core/ModRepository/ModAssemblyLoadContext.cs
    resource: https://github.com/StarMapLoader/StarMap/blob/4dc60f8dfeb1d9b035d44af2601d09115c16d2aa/StarMap.Core/ModRepository/ModAssemblyLoadContext.cs
    title: "StarMap/StarMap.Core/ModRepository/ModAssemblyLoadContext.cs"
---

A terminal inside the game is a threading problem first. The things it needs are blocking by nature (a pty read, a process wait, an SSH write, a slow shell spawn) and the things that draw it (the native terminal engine, ImGui, the system clipboard) may be touched from one thread only. This topic is the reference design from purrTTY and gatOS: all blocking work lives on background threads, a single `StarMapAfterGui` tick owns the engine and the UI, and two bounded queues, one per direction, are the only seams between them.

## Engine background

| Type or member | File | Why it matters |
|---|---|---|
| `Program.OnFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2334) | The UI block runs only `if (DrawUI)`; `OnDrawUiViewports` sits in it, between `ImGui.NewFrame` and `ImGui.Render` |
| `Program.OnDrawUiViewports` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3162-L3176) | StarMap postfixes it to make `[StarMapAfterGui]`, so a hidden HUD means no tick |
| `Program.TerminalInterface` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L500) | `=> ConsoleWindow.Terminal`; the entry point for the game-console shell |
| `TerminalInterface.Execute` | [current/decomp/Brutal.ImGuiApi.Abstractions/TerminalInterface.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi.Abstractions/TerminalInterface.cs#L41-L56) | Runs a command line and prints errors rather than throwing |
| `ConsoleWindow.Print` | [current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi.Abstractions/ConsoleWindow.cs#L600-L603) | The sink the output-capture postfix targets |

Frame structure and hook timing are in the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: map every thread to one tick](host-a-terminal-with-pty-sessions-and-frame-handoff-1.md) | purrtty | `background-thread` | `frame:draw-ui`, `thread:background` | The rule set for everything else; nothing ticks while the HUD is hidden |
| [2: bounded inbox, dirty-aware snapshots](host-a-terminal-with-pty-sessions-and-frame-handoff-2.md) | purrtty | `background-thread` | `frame:draw-ui`, `thread:background` | Lossless backpressure and cheap quiet frames; a renderer-neutral backend to maintain |
| [3: custom shell over the game console](host-a-terminal-with-pty-sessions-and-frame-handoff-3.md) | purrtty | `inter-mod-api`, `harmony-postfix` | `frame:draw-ui`, `startup:all-mods-loaded` | Simplest shell; commands run at the draw point, not where the stock console runs them |
| [4: SSH session with lazy VM boot](host-a-terminal-with-pty-sessions-and-frame-handoff-4.md) | gatos | `background-thread`, `inter-mod-api` | `thread:background`, `startup:all-mods-loaded` | A real Linux shell; needs a hosted guest and SSH.NET |

Read article 1 first. Articles 3 and 4 are alternatives for the shell behind a tab; article 2 is what receives their bytes.

## See also

- [Host and supervise an external process or virtual machine](../../processes/host-and-supervise-an-external-process-from-a-mod/overview.md), [Connect a VM guest with slirp TCP, a 9P filesystem and pinned SSH](../../processes/host-guest-transports-tcp-9p-and-ssh/overview.md)
- [Let a terminal program set the system clipboard](../let-a-terminal-program-set-the-system-clipboard/overview.md), [Stream the game screen to a terminal](../stream-the-game-screen-to-a-terminal/overview.md)
- [Marshal commands from background threads to the game thread](../../control/marshal-commands-to-the-game-thread/overview.md), [Export live game state to background threads](../../telemetry/export-game-state-to-other-threads/overview.md)
- [Draw UI while the HUD is hidden](../../../ui/overlays/draw-ui-while-the-hud-is-hidden/overview.md), [Share types between mods](../../../getting-started/dependencies/share-types-between-mods/overview.md), [Write a per-mod log file](../../../getting-started/lifecycle/write-a-per-mod-log-file/overview.md)
- [Make an HTTP request from a mod](../../network/make-an-http-request-from-a-mod-without-blocking-the-frame/overview.md)
- [Unit-test mod logic without launching the game](../../../testing-and-tooling/offline-tests/unit-test-mod-logic-without-game/overview.md) - related topic
- [Take clean screenshots from code, with a composed camera shot held for the capture](../../../testing-and-tooling/in-game-testing/take-screenshots-from-code/overview.md) - related topic

