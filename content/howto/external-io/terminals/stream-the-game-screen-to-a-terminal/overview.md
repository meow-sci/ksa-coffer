---
type: Game Feature
title: Stream the game screen to a terminal with the Kitty graphics protocol
description: "Deliver captured game frames to a terminal session as Kitty graphics images that replace one image id, encoded on a worker task and paced to the terminal"
topic: stream-the-game-screen-to-a-terminal
category: external-io
group: terminals
approaches: 1
game_types: [KSA.Program, Core.Renderer]
lifecycle: ["frame:render", "thread:background"]
demonstrated_by: [mods/gatos/features/screen-stream-frame-capture]
tags: [kitty-graphics, screen-stream, terminal, encoder]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:10:00Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: purrtty
    git: https://github.com/meow-sci/purrtty.git
    ref: 71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5
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
  - id: ksa-renderer-cs
    repo: ksa-game-assemblies
    path: current/decomp/Core/Renderer.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs
    title: "KSA decomp: Core/Renderer.cs (build 2026.10.10.5554)"
  - id: gatos-displayrenderpatch-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/DisplayRenderPatch.cs"
  - id: gatos-displaysettings-cs
    repo: gatOS
    path: gatOS.SimFs/Display/DisplaySettings.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Display/DisplaySettings.cs
    title: "gatOS/gatOS.SimFs/Display/DisplaySettings.cs"
  - id: gatos-framecapture-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Ksa/FrameCapture.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Ksa/FrameCapture.cs
    title: "gatOS/gatOS.GameMod/Game/Ksa/FrameCapture.cs"
  - id: gatos-displaysurface-cs
    repo: gatOS
    path: gatOS.SimFs/Display/DisplaySurface.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Display/DisplaySurface.cs
    title: "gatOS/gatOS.SimFs/Display/DisplaySurface.cs"
  - id: gatos-kittyencoder-cs
    repo: gatOS
    path: gatOS.SimFs/Display/KittyEncoder.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Display/KittyEncoder.cs
    title: "gatOS/gatOS.SimFs/Display/KittyEncoder.cs"
  - id: gatos-displaystreamfile-cs
    repo: gatOS
    path: gatOS.SimFs/Display/DisplayStreamFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Display/DisplayStreamFile.cs
    title: "gatOS/gatOS.SimFs/Display/DisplayStreamFile.cs"
  - id: purrtty-ghosttyterminalsurface-cs
    repo: purrtty
    path: purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    resource: https://github.com/meow-sci/purrtty/blob/71da9efe9ed7b8ec533cad7a0bb15bea9f59a9a5/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs
    title: "purrtty/purrTTY.Terminal/Ghostty/GhosttyTerminalSurface.cs"
  - id: gatos-sshshellchannel-cs
    repo: gatOS
    path: gatOS.Ssh/SshShellChannel.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/SshShellChannel.cs
    title: "gatOS/gatOS.Ssh/SshShellChannel.cs"
  - id: ksa-rendertarget-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA.Rendering/RenderTarget.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs
    title: "KSA decomp: KSA.Rendering/RenderTarget.cs (build 2026.10.10.5554)"
---

Streaming the game's picture into a terminal turns one frame into a few megabytes of escape sequences, up to sixty times a second, through an SSH session and a terminal parser that may be running inside the game. Two halves make that work: a capture that never stalls the GPU, and an encoder and delivery path that never stalls the frame and that slows itself down when the terminal falls behind. This topic is the second half; the capture half lives in [Capture rendered frames from KSA](../../../rendering/vulkan-passes/capture-rendered-frames/overview.md).

## Engine background

| Type or member | File | Why it matters |
|---|---|---|
| `Program.RenderGame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L4646-L4955) | The hook sits before its final `commandBuffer2.End()`; the offscreen colour image is sampled-readable and outside any render pass there |
| `Program.ResourceFrameIndex` and `PostRender` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2336-L2370) | `PostRender` submits the frame and advances the slot index modulo `MaxFramesInFlight` |
| `Renderer.MaxFramesInFlight` | [current/decomp/Core/Renderer.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/Core/Renderer.cs#L28) | Two slots: the readback of slot N happens when N comes round again |
| `RenderTarget.ColorImage`, `Extent` | [current/decomp/KSA.Rendering/RenderTarget.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA.Rendering/RenderTarget.cs#L36) | The capture source; the colour image is nullable |

Frame structure and phase order are in the [lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#render-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Staging-buffer readback on slot reuse, background Kitty encoder, fixed image id](stream-the-game-screen-to-a-terminal.md) | gatos | `harmony-transpiler` | `frame:render`, `thread:background` | Never blocks the render thread and self-paces; needs a Kitty-capable terminal and a few frames of latency, and depends on the shape of `RenderGame` |

## See also

- [Capture rendered frames from KSA](../../../rendering/vulkan-passes/capture-rendered-frames/overview.md)
- [Host a terminal with pty sessions and frame handoff](../host-a-terminal-with-pty-sessions-and-frame-handoff/overview.md)
- [Show an image in ImGui](../../../rendering/textures-and-decals/show-an-image-in-imgui/overview.md)
- [Take clean screenshots from code, with a composed camera shot held for the capture](../../../testing-and-tooling/in-game-testing/take-screenshots-from-code/overview.md) - related topic

