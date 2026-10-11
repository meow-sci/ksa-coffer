---
type: Mod Feature
title: 9P2000.L server in C#
description: A from-scratch 9P2000.L codec, TCP server and pluggable virtual filesystem running inside the game process, which the Linux guest mounts as /sim for telemetry and as /mnt for opt-in host folders
mod: gatos
category: external-io
tags: [9p, filesystem, vfs, tcp, linux, protocol, host-mounts]
techniques: [background-thread, protocol-server, virtual-filesystem]
game_types: []
lifecycle: [startup:all-mods-loaded, thread:background]
hooks:
  - "starmap StarMapAllModsLoaded"
  - "thread:background NinePServer.AcceptLoopAsync"
generated: { by: claude-code/opus-5.5, at: 2026-10-10T04:10:43Z }
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
  - id: gatos-session
    repo: gatOS
    path: gatOS.NineP/Server/Session.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/Session.cs
    title: "gatOS.NineP/Server/Session.cs"
  - id: gatos-ninepserver
    repo: gatOS
    path: gatOS.NineP/Server/NinePServer.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/NinePServer.cs
    title: "gatOS.NineP/Server/NinePServer.cs"
  - id: gatos-vfsnode
    repo: gatOS
    path: gatOS.NineP/Vfs/VfsNode.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsNode.cs
    title: "gatOS.NineP/Vfs/VfsNode.cs"
  - id: gatos-hostdirectory
    repo: gatOS
    path: gatOS.NineP/Vfs/HostDirectory.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostDirectory.cs
    title: "gatOS.NineP/Vfs/HostDirectory.cs"
  - id: gatos-mod
    repo: gatOS
    path: gatOS.GameMod/Mod.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs
    title: "gatOS.GameMod/Mod.cs"
  - id: gatos-messagetype
    repo: gatOS
    path: gatOS.NineP/Protocol/MessageType.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/MessageType.cs
    title: "gatOS.NineP/Protocol/MessageType.cs"
  - id: gatos-linuxerrno
    repo: gatOS
    path: gatOS.NineP/Protocol/LinuxErrno.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/LinuxErrno.cs
    title: "gatOS.NineP/Protocol/LinuxErrno.cs"
  - id: gatos-ivfsfilehandle
    repo: gatOS
    path: gatOS.NineP/Vfs/IVfsFileHandle.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/IVfsFileHandle.cs
    title: "gatOS.NineP/Vfs/IVfsFileHandle.cs"
  - id: gatos-vfsscan
    repo: gatOS
    path: gatOS.NineP/Vfs/VfsScan.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsScan.cs
    title: "gatOS.NineP/Vfs/VfsScan.cs"
  - id: gatos-hostmount
    repo: gatOS
    path: gatOS.NineP/Vfs/HostMount.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostMount.cs
    title: "gatOS.NineP/Vfs/HostMount.cs"
---

`/sim` is not a directory on disk. It is a tree of C# objects served over the Linux kernel's own
9p client, so `cat`, `watch`, `tail -f` and `jq` become the game API without any custom guest
binary. `gatOS.NineP` implements the 9P2000.L wire protocol, a session per TCP connection, and a
small VFS abstraction whose nodes decide their own read/write semantics. The library has no
game dependency and is tested with a managed 9p client and against a real guest.

## How it works

**Server** ([gatOS.NineP/Server/NinePServer.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/NinePServer.cs#L51-L113)): a `TcpListener` on
`IPAddress.Loopback` (slirp delivers guest connections to `10.0.2.2` as host connections to
`127.0.0.1`, so loopback suffices and never triggers the Windows Firewall prompt), an accept loop on
the thread pool, and one `Session` per connection tracked in a `ConcurrentDictionary`.
`ActiveSessions` feeds the sampler's "is anybody listening" gate.

**Session** ([gatOS.NineP/Server/Session.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/Session.cs#L84-L120)):

- Frames are read into `ArrayPool<byte>` buffers (a video-rate mount moves hundreds of messages per second).
- Metadata messages (walk, getattr, open, readdir, clunk) cannot block and run inline on the read
  loop; `Tread`, `Twrite` and `Tflush` are dispatched as their own tasks because a read may park
  waiting for the next snapshot and a control write awaits the game thread.
- Replies are serialized by a `SemaphoreSlim` write lock; a flushed tag is never answered after
  `Rflush`, which is what makes Ctrl-C on a blocked `cat` return instantly.
- `msize` is negotiated down from the server ceiling of 512 KiB (`NinePServerOptions.MaxMsize`).
- Modes: directories 0755, sensors 0444, control files 0644; readdir includes `.` and `..` and
  uses the next entry's ordinal as the dirent offset cookie.

**VFS** ([gatOS.NineP/Vfs/VfsNode.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsNode.cs)): `VfsDirectory` (`List`, `Lookup`, optional
create/unlink/rename) and `VfsFile` (`Size`, `Open() -> IVfsFileHandle`, optional
`OpenWrite() -> IVfsWritableFileHandle`, `IsStreaming`). `IVfsFileHandle.ReadAsync(offset, count, ct)`
returns `ValueTask<ReadOnlyMemory<byte>>`, so a handle can return cached bytes synchronously or park
asynchronously. `VfsScan` walks the same tree so HTTP and MQTT can mirror every leaf.

**Host folder mounts** ([gatOS.NineP/Vfs/HostDirectory.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostDirectory.cs)): a second `NinePServer` serves
`HostMountTree` built from `[[mounts]]` in `gatos.toml`; the guest's `mnt-mount` supervisor mounts
it at `/mnt`. `HostDirectory`/`HostFile` map nodes to real files, read-only mounts reject mutations
with `EROFS`, and every child path is resolved with `Path.GetFullPath` and checked to stay under the
mount root so a guest cannot escape with `..` ([gatOS.NineP/Vfs/HostDirectory.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostDirectory.cs#L205-L225)).
The server is created only when at least one mount is configured
([gatOS.GameMod/Mod.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Mod.cs#L772-L796)).

## Lifecycle and timing

- `[StarMapAllModsLoaded]`: `StartSimServer(port: 0)` binds an ephemeral port synchronously
  before the VM exists, so the port can go on the guest kernel command line; the menu's "Restart
  SimFs" rebuilds it on a background task and swaps a volatile reference.
- All protocol work runs on thread-pool tasks (`thread:background`). Reads come from the
  volatile `SnapshotStore.Current`; writes only enqueue a command and await it (see
  [Game-thread command queue](game-thread-command-queue.md)).
- At `[StarMapUnload]` the server is disposed after the VM with a 5 s bounded wait.

## Key code

| Path | Role |
|---|---|
| [gatOS.NineP/Server/NinePServer.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/NinePServer.cs) | listener, accept loop, session registry |
| [gatOS.NineP/Server/Session.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Server/Session.cs) | framing, inline vs dispatched handlers, flush, msize |
| [gatOS.NineP/Protocol/MessageType.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/MessageType.cs) | 9P2000.L message ids |
| [gatOS.NineP/Protocol/LinuxErrno.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Protocol/LinuxErrno.cs) | errno values returned in `Rlerror` |
| [gatOS.NineP/Vfs/VfsNode.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsNode.cs) | VFS node base types |
| [gatOS.NineP/Vfs/IVfsFileHandle.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/IVfsFileHandle.cs) | async read/write handle contracts |
| [gatOS.NineP/Vfs/VfsScan.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/VfsScan.cs) | tree walk reused by the HTTP and MQTT field mirrors |
| [gatOS.NineP/Vfs/HostMount.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.NineP/Vfs/HostMount.cs) | host folder mount tree |

## Snippets

```csharp
// gatOS.NineP/Server/Session.cs L88-L111
                var frame = ArrayPool<byte>.Shared.Rent(frameLength);
                try
                {
                    await _stream.ReadExactlyAsync(frame.AsMemory(0, frameLength), ct).ConfigureAwait(false);
                    var type = (MessageType)frame[0];
                    var tag = BinaryPrimitives.ReadUInt16LittleEndian(frame.AsSpan(1, 2));
                    if (CanRunInline(type))
                    {
                        // Fast path (GP4): metadata ops (walk/getattr/open/readdir/clunk/…) cannot
                        // park, so they run inline on the read loop — no Task.Run hop, no linked
                        // CTS, no in-flight registry entry (they are atomic wrt this loop, so a
                        // Tflush can only ever arrive after they finished — flush of a completed
                        // tag correctly answers a bare Rflush). Tread/Twrite/Tflush can block
                        // (parked stream reads, control writes awaiting the game thread, flush
                        // awaiting its victim) and keep the concurrent dispatch path.
                        await HandleAsync(type, tag, frame.AsMemory(3, frameLength - 3), inFlight: null,
                            _cts.Token).ConfigureAwait(false);
                        ArrayPool<byte>.Shared.Return(frame);
                    }
                    else
                    {
                        Dispatch(type, tag, frame, frameLength);
                    }
                }
```

## Game APIs touched

None. The server is game-free; KSA data reaches it only through immutable snapshots and the command queue.

## Pitfalls and version notes

- Linux v9fs on kernels 6.11 and later uses netfslib read semantics: the reported file size must be
  truthful, and a `read()` is only completed by a full buffer or two consecutive zero-byte replies.
  This dictates the file models in [The /sim file models](sim-filesystem-file-models.md) (repo
  `spike/NOTES.md`).
- There is no kernel-side reconnect: a dropped connection gives `EIO` until remount, which is why
  the guest supervisor loops on `mountpoint -q`.
- v9fs delivers no inotify events for host-side changes; GNU `tail -f` needs the guest's poll-mode
  shim.
- Keep metadata handlers non-blocking or the inline fast path stalls the whole session.

## See also

- [The /sim file models](sim-filesystem-file-models.md)
- [Host-guest transport over slirp TCP](slirp-tcp-host-guest-transport.md)
- [HTTP /v1 API server](http-v1-api-server.md)
- [TOML config seeded from a shipped template](toml-config-seeded-template.md)
- [gatOS overview](../overview.md)
- [From-scratch 9P2000.L server with a VfsNode tree and HostDirectory confinement](../../../howto/external-io/processes/host-guest-transports-tcp-9p-and-ssh/host-guest-transports-tcp-9p-and-ssh-2.md) - how-to article demonstrating this feature

