---
type: Game Feature
title: Let a terminal program set the system clipboard with OSC 52
description: Detect OSC 52 sequences in the terminal byte stream with a small scanner and set the system clipboard through ImGui from the main thread
topic: let-a-terminal-program-set-the-system-clipboard
category: external-io
group: terminals
approaches: 1
game_types: [KSA.ImGuiBackendGlfwImpl, Brutal.ImGuiApi.ImGui]
lifecycle: ["frame:draw-ui", "thread:background"]
demonstrated_by: [mods/purrtty/features/osc52-clipboard-sidecar]
tags: [terminal, osc52, clipboard, imgui]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:10:00Z }
status: stable
repos:
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: ksa-imguibackendglfwimpl-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/ImGuiBackendGlfwImpl.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendGlfwImpl.cs
    title: "KSA decomp: KSA/ImGuiBackendGlfwImpl.cs (build 2026.10.10.5554)"
  - id: purrtty-oscsidecar-cs
    repo: purrtty
    path: purrTTY.Terminal/Ghostty/OscSidecar.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Ghostty/OscSidecar.cs
    title: "purrtty/purrTTY.Terminal/Ghostty/OscSidecar.cs"
  - id: purrtty-ghosttyterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs"
  - id: purrtty-terminalwindow-cs
    repo: purrtty
    path: purrTTY.Display/Ghostty/TerminalWindow.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Display/Ghostty/TerminalWindow.cs
    title: "purrtty/purrTTY.Display/Ghostty/TerminalWindow.cs"
  - id: ksa-cameracontroller-cs
    repo: ksa-game-assemblies
    path: current/decomp/RenderCore.Input.Controllers/CameraController.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/RenderCore.Input.Controllers/CameraController.cs
    title: "KSA decomp: RenderCore.Input.Controllers/CameraController.cs (build 2026.10.10.5554)"
  - id: purrtty-iterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/ITerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/ITerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/ITerminalSurface.cs"
  - id: ksa-imgui-cs
    repo: ksa-game-assemblies
    path: current/decomp/Brutal.ImGuiApi/ImGui.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs
    title: "KSA decomp: Brutal.ImGuiApi/ImGui.cs (build 2026.10.10.5554)"
---

A terminal program that wants to copy something on a remote machine has no clipboard to talk to; the standard answer is the OSC 52 escape sequence, which asks the terminal to set its host's clipboard. A terminal embedded in a game must do two things: notice the sequence in the byte stream, and write the system clipboard from the thread that owns ImGui. This topic shows the small scanner and the one-line apply, and where each runs.

## Engine background

| Type or member | File | Why it matters |
|---|---|---|
| `ImGui.SetClipboardText(ImString)` | [current/decomp/Brutal.ImGuiApi/ImGui.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Brutal.ImGuiApi/ImGui.cs#L8299-L8305) | The mod-facing write |
| `ImGuiBackendGlfwImpl.SetClipboardText` | [current/decomp/KSA/ImGuiBackendGlfwImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendGlfwImpl.cs#L410-L414) | KSA's callback forwards the text to `Glfw.SetClipboard`, the operating system clipboard |
| Callback registration | [current/decomp/KSA/ImGuiBackendGlfwImpl.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/ImGuiBackendGlfwImpl.cs#L279-L283) | Installed on `ImGuiPlatformIOPtr` at backend start-up |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [OscSidecar tee, clipboard write on the tick](let-a-terminal-program-set-the-system-clipboard.md) | purrtty | `imgui-window` | `frame:draw-ui`, `thread:background` | Cheap and thread-safe by construction; applies requests without a prompt and answers no queries |

## See also

- [Host a terminal with pty sessions and frame handoff](../host-a-terminal-with-pty-sessions-and-frame-handoff/overview.md)
- [Read typed text and key chords from ImGui](../../../ui/input/read-typed-text-and-key-chords-from-imgui/overview.md)
