---
type: Game Feature
title: Schedule timed command sequences on render, wall or sim time
description: Play back a script of commands at millisecond offsets against a chosen clock, ticked on the game thread just before the command drain
topic: schedule-timed-commands
category: external-io
group: control
approaches: 1
game_types: [KSA.Universe, KSA.App, KSA.Program]
lifecycle: [frame:viewports, frame:draw-ui, thread:background]
demonstrated_by: [mods/gatos/features/timed-command-scheduler]
tags: [scheduler, playback-clock, command-queue, cinematics, time]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T18:40:13Z }
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
  - id: gatos-spec-9p-filesystem-md
    repo: gatOS
    path: SPEC_9P_FILESYSTEM.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/SPEC_9P_FILESYSTEM.md
    title: "gatOS/SPEC_9P_FILESYSTEM.md"
  - id: gatos-mod-game-cs
    repo: gatOS
    path: gatOS.GameMod/Game/Mod.Game.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Game/Mod.Game.cs
    title: "gatOS/gatOS.GameMod/Game/Mod.Game.cs"
  - id: gatos-playbackclock-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/PlaybackClock.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/PlaybackClock.cs
    title: "gatOS/gatOS.SimFs/Commands/PlaybackClock.cs"
  - id: gatos-schedule-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/Schedule.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/Schedule.cs
    title: "gatOS/gatOS.SimFs/Commands/Schedule.cs"
  - id: gatos-schedulestore-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/ScheduleStore.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/ScheduleStore.cs
    title: "gatOS/gatOS.SimFs/Commands/ScheduleStore.cs"
  - id: gatos-scheduler-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/Scheduler.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/Scheduler.cs
    title: "gatOS/gatOS.SimFs/Commands/Scheduler.cs"
  - id: gatos-timedbatchfile-cs
    repo: gatOS
    path: gatOS.SimFs/Commands/TimedBatchFile.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.SimFs/Commands/TimedBatchFile.cs
    title: "gatOS/gatOS.SimFs/Commands/TimedBatchFile.cs"
  - id: ksa-app-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/App.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/App.cs
    title: "KSA decomp: KSA/App.cs (build 2026.10.10.5554)"
  - id: ksa-program-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Program.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs
    title: "KSA decomp: KSA/Program.cs (build 2026.10.10.5554)"
  - id: ksa-universe-cs
    repo: ksa-game-assemblies
    path: current/decomp/KSA/Universe.cs
    resource: https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs
    title: "KSA decomp: KSA/Universe.cs (build 2026.10.10.5554)"
---

Cinematics, staging sequences and light shows need commands at exact offsets (stage at T+0, lights at T+250 ms, a camera cue at T+1.2 s). A script on another thread, process or VM that sleeps between writes drifts with its own scheduler. The alternative is to hand the whole timeline to the mod and let the game thread play it back against a clock the mod controls.

KSA has no scheduler for mods. The mod needs three things: a clock choice, a place on the game thread to advance it, and a queue to post due commands into (see [Marshal commands from background threads to the game thread](../marshal-commands-to-the-game-thread/overview.md)).

## Engine background

Three notions of "now" are available to a mod on the main thread, and they genuinely differ:

| Clock | Source in the game | Behaviour |
|---|---|---|
| render | `dtPlayer` computed in `App.Run`, [current/decomp/KSA/App.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/App.cs#L39-L74) | Clamped to `1 / GameSettings.Current.Simulation.MinTargetFrameRate`, so after a hitch it lags real time and never catches up |
| wall | a `Stopwatch` the mod owns; the game's `Program.GetPlayerTime()` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L5263-L5266)) returns the unclamped `App.Run` stopwatch total of the last frame | Real elapsed time; a stall is followed by a burst |
| ut | `Universe.GetElapsedSeconds()`, [current/decomp/KSA/Universe.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Universe.cs#L2392-L2396) | Simulation time; follows time warp |

`Program.OnFrameViewports` passes `dtPlayer` into every viewport's `OnFrame` ([current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2608-L2625)), which is why a prefix on the main `GameViewport.OnFrame` receives the same delta that `App.Run` computed. See [the per-frame sequence in the lifecycle reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md#per-frame-sequence).

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Scheduler posting commands before the drain](schedule-timed-commands.md) | gatos | `command-queue` | `frame:viewports`, `thread:background` | Host-owned timing independent of the script's process; needs a game-free queue and a per-frame tick |

## See also

- [Marshal commands from background threads to the game thread](../marshal-commands-to-the-game-thread/overview.md)
- [Compute mission elapsed time and detect liftoff](../../../flight-and-orbits/flight-state/compute-mission-elapsed-time-and-detect-liftoff/overview.md)
- [Play cinematic camera tracks](../../../camera/special-views/play-cinematic-camera-tracks/overview.md)
- [Export live game state to background threads](../../telemetry/export-game-state-to-other-threads/overview.md)
- [Game loop and mod lifecycle](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md)
