---
type: Game Feature
title: Let AI agents drive the game through an MCP server
description: Expose a running KSA game to a coding agent as Model Context Protocol tools, either from an in-process Streamable HTTP endpoint or from a small stdio server that wraps a file bridge and returns screenshots inline
topic: let-ai-agents-control-the-game-over-mcp
category: external-io
group: control
approaches: 2
game_types: [KSA.Program, KSA.Universe, KSA.Constants]
lifecycle: [startup:all-mods-loaded, thread:background, event:unload, frame:after-on-frame]
demonstrated_by: [mods/gatos/features/mcp-server-for-agents, mods/ksacars/features/ksa-mcp-server, mods/ksagolf/features/file-command-bridge, mods/ksastructures/features/dev-file-bridge-and-mcp, mods/ksarmory/features/file-command-bridge-and-mcp]
tags: [mcp, agents, json-rpc, streamable-http, stdio, screenshots, tool-design]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:42:36Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
  - name: KSACars
    git: https://github.com/LaurensDeV/KSACars
    ref: 1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-spec-mcp-md
    repo: gatOS
    path: SPEC_MCP.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/SPEC_MCP.md
    title: "gatOS/SPEC_MCP.md"
  - id: gatos-mod-game-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Mod.Game.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Mod.Game.cs
    title: "gatOS/gatOS.GameMod/Game/Mod.Game.cs"
  - id: gatos-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-mcpcontracts-cs
    repo: gatOS
    path: gatOS.Mcp/McpContracts.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Mcp/McpContracts.cs
    title: "gatOS/gatOS.Mcp/McpContracts.cs"
  - id: gatos-mcppresenters-cs
    repo: gatOS
    path: gatOS.Mcp/McpPresenters.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Mcp/McpPresenters.cs
    title: "gatOS/gatOS.Mcp/McpPresenters.cs"
  - id: gatos-mcpregistry-cs
    repo: gatOS
    path: gatOS.Mcp/McpRegistry.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Mcp/McpRegistry.cs
    title: "gatOS/gatOS.Mcp/McpRegistry.cs"
  - id: gatos-mcptoolhandlers-cs
    repo: gatOS
    path: gatOS.Mcp/McpToolHandlers.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Mcp/McpToolHandlers.cs
    title: "gatOS/gatOS.Mcp/McpToolHandlers.cs"
  - id: gatos-simmcpserver-cs
    repo: gatOS
    path: gatOS.Mcp/SimMcpServer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Mcp/SimMcpServer.cs
    title: "gatOS/gatOS.Mcp/SimMcpServer.cs"
  - id: ksacars-mcp-json
    repo: KSACars
    path: .mcp.json
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/.mcp.json
    title: "KSACars/.mcp.json"
  - id: ksacars-bridge-cs
    repo: KSACars
    path: src/KSACars/Ksa/Bridge.cs
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/Ksa/Bridge.cs
    title: "KSACars/src/KSACars/Ksa/Bridge.cs"
  - id: ksacars-ksacarsmod-cs
    repo: KSACars
    path: src/KSACars/Ksa/KSACarsMod.cs
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/src/KSACars/Ksa/KSACarsMod.cs
    title: "KSACars/src/KSACars/Ksa/KSACarsMod.cs"
  - id: ksacars-server-py
    repo: KSACars
    path: tools/ksa-mcp/server.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/ksa-mcp/server.py
    title: "KSACars/tools/ksa-mcp/server.py"
  - id: ksacars-ksa-user-dir-sh
    repo: KSACars
    path: tools/ksa-user-dir.sh
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/ksa-user-dir.sh
    title: "KSACars/tools/ksa-user-dir.sh"
  - id: ksacars-vis-py
    repo: KSACars
    path: tools/vis/vis.py
    resource: https://github.com/LaurensDeV/KSACars/blob/1f0a84f623ef7a8edb0792d5c46c0fecfc2abd7f/tools/vis/vis.py
    title: "KSACars/tools/vis/vis.py"
  - id: ksa-constants-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Constants.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs
    title: "KSA decomp: KSA/Constants.cs (build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA decomp: KSA/Program.cs (build 2026.10.10.5554)"
---

The Model Context Protocol (MCP) lets a coding agent list and call tools on a server. KSA has no MCP support, so a mod author builds one of two things: a server inside the game process that answers MCP requests directly, or a small process outside the game that speaks MCP to the agent and talks to the mod over something simpler.

KSA's own constraint decides how much of the work each side does. Simulated state, ImGui and rendering belong to the main thread (see [the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)), so any MCP request that reads or writes the game must either read an immutable snapshot published for other threads or go through a command queue drained in a frame hook. Both approaches below do exactly that; they differ in where the MCP protocol lives.

## Engine background

| Piece | Where | Relevance |
|---|---|---|
| `Constants.LogsFolderPath` | [current/decomp/KSA/Constants.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs#L283-L283) | `<Documents>/My Games/Kitten Space Agency/logs`; the file bridges place their `bridge/<mod>/in` and `out` folders beside the mod log, found by the mod's own log-folder search |
| `Constants.DocumentsFolderPath` | [current/decomp/KSA/Constants.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Constants.cs#L281-L281) | Root of the user data a screenshot export and a bridge reuse |
| `Program.OnFrame` and the StarMap hooks | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2334) | The only place game objects may be touched; a file bridge polls from `StarMapAfterOnFrame`, which also fires with the HUD hidden and in menus |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: stateless Streamable HTTP endpoint in the game process](let-ai-agents-control-the-game-over-mcp-1.md) | gatos | `protocol-server` | `startup:all-mods-loaded`, `thread:background`, `event:unload` | No external process and a rich logical tool surface; an HTTP adapter, a dependency on the C# MCP SDK, loopback only |
| [2: stdlib Python stdio server wrapping a file bridge](let-ai-agents-control-the-game-over-mcp-2.md) | ksacars | `file-ipc` | `frame:after-on-frame` (mod side), outside the game (server) | Nothing to host in the game and screenshots come back inline; developer installs only, one command at a time |

Both articles include guidance on shaping tools for a language-model client: logical grouped reads, batch and scheduled actions, stable action keys and errors an agent can act on.

## See also

- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
- [Marshal commands from background threads to the game thread](../marshal-commands-to-the-game-thread/overview.md), [Schedule timed command sequences](../schedule-timed-commands/overview.md)
- [Host HTTP and MQTT servers in the game process](../../network/host-http-and-mqtt-servers-in-the-game-process/overview.md)
- [Reload a mod shader in a running game](../../../shaders/glsl-workflow/reload-a-mod-shader-in-a-running-game/overview.md)
- Driving a running game through a file bridge, taking screenshots from code and visual regression for mods are covered in the testing-and-tooling category.
- [Drive a running game from scripts through a file-drop command bridge](../../../testing-and-tooling/in-game-testing/drive-a-running-game-through-a-file-bridge/overview.md) - related topic
- [Take clean screenshots from code, with a composed camera shot held for the capture](../../../testing-and-tooling/in-game-testing/take-screenshots-from-code/overview.md) - related topic
- [Visual regression testing for a KSA mod](../../../testing-and-tooling/in-game-testing/visual-regression-for-mods/overview.md) - related topic

