---
type: Game Feature
title: Connect a VM guest to the game with slirp TCP, a 9P filesystem and pinned SSH
description: The channels between a QEMU guest and the game process that work on Windows, Linux and macOS - slirp TCP with pre-allocated host ports, a from-scratch 9P2000.L server with synthetic and confined host files, and SSH sessions pinned to the guest manifest's host key
topic: host-guest-transports-tcp-9p-and-ssh
category: external-io
group: processes
approaches: 4
game_types: []
lifecycle: [startup:all-mods-loaded, thread:background]
demonstrated_by: [mods/gatos/features/slirp-tcp-host-guest-transport, mods/gatos/features/ninep-server-in-csharp, mods/gatos/features/sim-filesystem-file-models, mods/gatos/features/snapshot-diff-flight-events, mods/gatos/features/ssh-shell-session-into-guest, mods/gatos/features/alpine-guest-image]
tags: [qemu, slirp, 9p, ssh, virtual-filesystem, host-key, transport, vm]
generated: { by: claude-code/sonnet-5.5, at: 2026-10-10T22:30:38Z }
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
  - id: gatos-ksa-game-integration-plan-md
    repo: gatOS
    path: KSA_GAME_INTEGRATION_PLAN.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/KSA_GAME_INTEGRATION_PLAN.md
    title: "gatOS/KSA_GAME_INTEGRATION_PLAN.md"
  - id: gatos-os-analysis-md
    repo: gatOS
    path: OS_ANALYSIS.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/OS_ANALYSIS.md
    title: "gatOS/OS_ANALYSIS.md"
  - id: gatos-os-plan-md
    repo: gatOS
    path: OS_PLAN.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/OS_PLAN.md
    title: "gatOS/OS_PLAN.md"
  - id: gatos-spec-9p-filesystem-md
    repo: gatOS
    path: SPEC_9P_FILESYSTEM.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/SPEC_9P_FILESYSTEM.md
    title: "gatOS/SPEC_9P_FILESYSTEM.md"
  - id: gatos-mod-cs
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS/gatOS.GameMod/Mod.cs"
  - id: gatos-linuxerrno-cs
    repo: gatOS
    path: gatOS.NineP/Protocol/LinuxErrno.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/LinuxErrno.cs
    title: "gatOS/gatOS.NineP/Protocol/LinuxErrno.cs"
  - id: gatos-messagetype-cs
    repo: gatOS
    path: gatOS.NineP/Protocol/MessageType.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/MessageType.cs
    title: "gatOS/gatOS.NineP/Protocol/MessageType.cs"
  - id: gatos-ninepserver-cs
    repo: gatOS
    path: gatOS.NineP/Server/NinePServer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/NinePServer.cs
    title: "gatOS/gatOS.NineP/Server/NinePServer.cs"
  - id: gatos-session-cs
    repo: gatOS
    path: gatOS.NineP/Server/Session.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/Session.cs
    title: "gatOS/gatOS.NineP/Server/Session.cs"
  - id: gatos-hostdirectory-cs
    repo: gatOS
    path: gatOS.NineP/Vfs/HostDirectory.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostDirectory.cs
    title: "gatOS/gatOS.NineP/Vfs/HostDirectory.cs"
  - id: gatos-hostmount-cs
    repo: gatOS
    path: gatOS.NineP/Vfs/HostMount.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostMount.cs
    title: "gatOS/gatOS.NineP/Vfs/HostMount.cs"
  - id: gatos-ivfsfilehandle-cs
    repo: gatOS
    path: gatOS.NineP/Vfs/IVfsFileHandle.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/IVfsFileHandle.cs
    title: "gatOS/gatOS.NineP/Vfs/IVfsFileHandle.cs"
  - id: gatos-vfsnode-cs
    repo: gatOS
    path: gatOS.NineP/Vfs/VfsNode.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsNode.cs
    title: "gatOS/gatOS.NineP/Vfs/VfsNode.cs"
  - id: gatos-vfsscan-cs
    repo: gatOS
    path: gatOS.NineP/Vfs/VfsScan.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsScan.cs
    title: "gatOS/gatOS.NineP/Vfs/VfsScan.cs"
  - id: gatos-alarmfile-cs
    repo: gatOS
    path: gatOS.SimFs/AlarmFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/AlarmFile.cs
    title: "gatOS/gatOS.SimFs/AlarmFile.cs"
  - id: gatos-commandfile-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/CommandFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/CommandFile.cs
    title: "gatOS/gatOS.SimFs/Commands/CommandFile.cs"
  - id: gatos-eventsfile-cs
    repo: gatOS
    path: gatOS.SimFs/EventsFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/EventsFile.cs
    title: "gatOS/gatOS.SimFs/EventsFile.cs"
  - id: gatos-formats-cs
    repo: gatOS
    path: gatOS.SimFs/Formats.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Formats.cs
    title: "gatOS/gatOS.SimFs/Formats.cs"
  - id: gatos-simfstree-cs
    repo: gatOS
    path: gatOS.SimFs/SimFsTree.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/SimFsTree.cs
    title: "gatOS/gatOS.SimFs/SimFsTree.cs"
  - id: gatos-snapshottextfile-cs
    repo: gatOS
    path: gatOS.SimFs/SnapshotTextFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/SnapshotTextFile.cs
    title: "gatOS/gatOS.SimFs/SnapshotTextFile.cs"
  - id: gatos-streamfile-cs
    repo: gatOS
    path: gatOS.SimFs/StreamFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/StreamFile.cs
    title: "gatOS/gatOS.SimFs/StreamFile.cs"
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
  - id: gatos-sshshellsession-cs
    repo: gatOS
    path: gatOS.Ssh/SshShellSession.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/SshShellSession.cs
    title: "gatOS/gatOS.Ssh/SshShellSession.cs"
  - id: gatos-vmconnectionbroker-cs
    repo: gatOS
    path: gatOS.Ssh/VmConnectionBroker.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Ssh/VmConnectionBroker.cs
    title: "gatOS/gatOS.Ssh/VmConnectionBroker.cs"
  - id: gatos-guestmanifest-cs
    repo: gatOS
    path: gatOS.Vm/GuestManifest.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/GuestManifest.cs
    title: "gatOS/gatOS.Vm/GuestManifest.cs"
  - id: gatos-portallocator-cs
    repo: gatOS
    path: gatOS.Vm/PortAllocator.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/PortAllocator.cs
    title: "gatOS/gatOS.Vm/PortAllocator.cs"
  - id: gatos-qemucommandbuilder-cs
    repo: gatOS
    path: gatOS.Vm/QemuCommandBuilder.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.Vm/QemuCommandBuilder.cs
    title: "gatOS/gatOS.Vm/QemuCommandBuilder.cs"
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
  - id: gatos-init-gatos
    repo: gatOS
    path: guest/rootfs-overlay/sbin/init-gatos
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/sbin/init-gatos
    title: "gatOS/guest/rootfs-overlay/sbin/init-gatos"
  - id: gatos-mnt-mount
    repo: gatOS
    path: guest/rootfs-overlay/sbin/mnt-mount
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/sbin/mnt-mount
    title: "gatOS/guest/rootfs-overlay/sbin/mnt-mount"
  - id: gatos-sim-mount
    repo: gatOS
    path: guest/rootfs-overlay/sbin/sim-mount
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/sbin/sim-mount
    title: "gatOS/guest/rootfs-overlay/sbin/sim-mount"
  - id: gatos-tail
    repo: gatOS
    path: guest/rootfs-overlay/usr/local/bin/tail
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/guest/rootfs-overlay/usr/local/bin/tail
    title: "gatOS/guest/rootfs-overlay/usr/local/bin/tail"
  - id: gatos-notes-md
    repo: gatOS
    path: spike/NOTES.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/spike/NOTES.md
    title: "gatOS/spike/NOTES.md"
---

A VM next to the game is only useful if data crosses the boundary. A mod that embeds a guest has to answer how, on all three desktop OSes, without a driver or a kernel module in the host. gatOS answers with TCP over QEMU's user-mode network (slirp) for everything: the guest mounts a 9P2000.L filesystem served from inside the game process, reaches HTTP and MQTT at the slirp gateway address, and the host reaches the guest's SSH server through one loopback port forward.

Nothing here touches KSA objects. Every channel is a thread-pool socket server or client; game state reaches it through the immutable snapshot of [Export live game state to background threads](../../telemetry/export-game-state-to-other-threads/overview.md) and the command queue of [Marshal commands from background threads to the game thread](../../control/marshal-commands-to-the-game-thread/overview.md). The child process that hosts the guest is the subject of [Host and supervise an external process from a KSA mod](../host-and-supervise-an-external-process-from-a-mod/overview.md).

## Engine background

There is no game type to hook; the relevant facts are about threading and the host servers' start order.

| Fact | Consequence |
|---|---|
| Mod initialisation runs at `startup:all-mods-loaded` ([lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)) | The host servers (9p, HTTP, MQTT, mounts) start there, before any VM exists, so a VM booted later finds valid ports |
| All sockets are served on thread-pool tasks | The game thread is never involved in transport |
| Reads come from the published snapshot; writes enqueue a command and await it | A game thread that is not reaching its drain (loading, a stalled frame, a suspended process) turns writes into `ETIMEDOUT` rather than a hang; a simulation pause alone does not, because `Program.OnFrame` keeps running |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [1: slirp TCP with a PortAllocator and guest-side supervisors](host-guest-transports-tcp-9p-and-ssh-1.md) | gatos | `process-hosting` | `startup:all-mods-loaded`, `thread:background` | One transport that behaves the same on every OS; TCP-only and the slirp gateway address is part of the contract |
| [2: from-scratch 9P2000.L server with a VfsNode tree](host-guest-transports-tcp-9p-and-ssh-2.md) | gatos | `protocol-server` | `thread:background` | Lets `cat`, `watch` and `jq` be the API without a guest binary; a protocol to implement and test |
| [3: sensor, stream, events and command file models](host-guest-transports-tcp-9p-and-ssh-3.md) | gatos | `virtual-filesystem` | `thread:background` | Files that behave under the Linux 6.11+ page cache; a file must choose one read model |
| [4: pin the guest SSH host key to a manifest value](host-guest-transports-tcp-9p-and-ssh-4.md) | gatos | `background-thread` | `thread:background` | Protects against a mismatched guest image; relies on a static key and loopback-only access |

## See also

- [Host and supervise an external process or virtual machine from a KSA mod](../host-and-supervise-an-external-process-from-a-mod/overview.md)
- [Bridge a serial port and bus protocols to the game](../../network/bridge-a-serial-port-and-bus-protocols-to-the-game/overview.md)
- [Export live game state to background threads](../../telemetry/export-game-state-to-other-threads/overview.md), [Marshal commands from background threads to the game thread](../../control/marshal-commands-to-the-game-thread/overview.md)
- [Detect flight events when the game has no event bus](../../telemetry/detect-flight-events-from-snapshots/overview.md)
- [Host a terminal emulator in the game](../../terminals/host-a-terminal-with-pty-sessions-and-frame-handoff/overview.md)
- [Build an external SDK client or autopilot](../../control/build-external-clients-and-autopilots-with-a-typed-sdk/overview.md)
