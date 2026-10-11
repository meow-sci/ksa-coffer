---
type: Game Feature
title: "Bridge a serial port and bus protocols (NDJSON, NMEA, CCSDS, SCPI) to the game"
description: "Connect a virtio-serial port to the game with NDJSON, NMEA or CCSDS telemetry frames and SCPI-style command lines answered with OK or ERR plus an errno name"
topic: bridge-a-serial-port-and-bus-protocols-to-the-game
category: external-io
group: network
approaches: 1
game_types: [KSA.Program]
lifecycle: ["thread:background", "event:unload"]
demonstrated_by: [mods/gatos/features/serial-bus-ccsds-nmea-scpi]
tags: [serial, ndjson, nmea, ccsds, scpi, qemu, telemetry]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:10:00Z }
status: stable
repos:
  - name: gatOS
    git: https://github.com/meow-sci/gatOS.git
    ref: b88c28588e013841cfec58a1b3a09fcbd2cbc47e
game:
  build: 2026.10.10.5554
  git: git@github.com:meow-sci/ksa-game-assemblies.git
  ref: 935a32b4dbc34cbcd16e87d16cf9732eb90030c0
sources:
  - id: gatos-qemucommandbuilder-cs
    repo: gatOS
    path: gatOS.Vm/QemuCommandBuilder.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/QemuCommandBuilder.cs
    title: "gatOS/gatOS.Vm/QemuCommandBuilder.cs"
  - id: gatos-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-serialbridgeconnector-cs
    repo: gatOS
    path: gatOS.Bus/SerialBridgeConnector.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/SerialBridgeConnector.cs
    title: "gatOS/gatOS.Bus/SerialBridgeConnector.cs"
  - id: gatos-serialbridge-cs
    repo: gatOS
    path: gatOS.Bus/SerialBridge.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/SerialBridge.cs
    title: "gatOS/gatOS.Bus/SerialBridge.cs"
  - id: gatos-nmea-cs
    repo: gatOS
    path: gatOS.Bus/Nmea.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/Nmea.cs
    title: "gatOS/gatOS.Bus/Nmea.cs"
  - id: gatos-serialtelemetry-cs
    repo: gatOS
    path: gatOS.Bus/SerialTelemetry.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/SerialTelemetry.cs
    title: "gatOS/gatOS.Bus/SerialTelemetry.cs"
  - id: gatos-ccsds-cs
    repo: gatOS
    path: gatOS.Bus/Ccsds.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/Ccsds.cs
    title: "gatOS/gatOS.Bus/Ccsds.cs"
  - id: gatos-scpicommandport-cs
    repo: gatOS
    path: gatOS.Bus/ScpiCommandPort.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Bus/ScpiCommandPort.cs
    title: "gatOS/gatOS.Bus/ScpiCommandPort.cs"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA decomp: KSA/Program.cs (build 2026.10.10.5554)"
---

A guest VM or an instrument-style tool that expects a serial port speaks a very different language from a JSON API: newline-delimited frames, checksummed sentences, binary packets and command lines that answer `OK`. This topic shows how gatOS exposes the game over a QEMU `virtio-serial` port so that `cat`, a terminal program or real ground-segment code can consume telemetry and issue commands. It is a transport and codec exercise: nothing here calls a KSA member except through the published snapshot.

## Engine background

| Fact | Source | Consequence |
|---|---|---|
| The active vessel is `Program.ControlledVehicle`, a plain static property backed by a field with no locking | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L502-L516) | The sampler records its id as `ActiveVesselId` in each snapshot; the bridge never reads the property itself |
| `Program.OnFrame` is the only place game objects are touched safely | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2334) | Bridge threads read the snapshot and submit commands to the queue ([lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)) |
| `[StarMapUnload]` runs on a normal exit | [Clean up on game exit](../../../getting-started/lifecycle/clean-up-on-game-exit/overview.md) | The connector is stopped first, because it follows the VM lifecycle |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [SerialBridge with a connector per boot, encoders and a SCPI port](bridge-a-serial-port-and-bus-protocols-to-the-game.md) | gatos | `protocol-server` | `thread:background`, `event:unload` | Authentic wire formats a real tool can parse; active vessel only, one cadence, and it needs a QEMU guest to host the port |

## See also

- [Host and supervise an external process or virtual machine](../../processes/host-and-supervise-an-external-process-from-a-mod/overview.md)
- [Export live game state to background threads](../../telemetry/export-game-state-to-other-threads/overview.md), [Marshal commands from background threads to the game thread](../../control/marshal-commands-to-the-game-thread/overview.md)
- [Host HTTP and MQTT servers in the game process](../host-http-and-mqtt-servers-in-the-game-process/overview.md)
