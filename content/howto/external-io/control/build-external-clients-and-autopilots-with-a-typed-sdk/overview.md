---
type: Game Feature
title: Build an external SDK client or autopilot for the game over files and HTTP
description: Wrap a mod's external API in a typed client with one Transport interface over files and HTTP, then fly a vessel from a separate process with sim-time pacing, telemetry freshness gates and atomic batch writes
topic: build-external-clients-and-autopilots-with-a-typed-sdk
category: external-io
group: control
approaches: 1
game_types: []
lifecycle: [thread:background]
demonstrated_by: [mods/gatos/features/external-api-clients]
tags: [sdk, client, transport, autopilot, pacing, telemetry, typescript, rust]
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
  - id: gatos-tutorial-data-reference-md
    repo: gatOS
    path: docs/TUTORIAL_DATA_REFERENCE.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/docs/TUTORIAL_DATA_REFERENCE.md
    title: "gatOS/docs/TUTORIAL_DATA_REFERENCE.md"
  - id: gatos-examples-agc-readme-md
    repo: gatOS
    path: examples/agc/README.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/agc/README.md
    title: "gatOS/examples/agc/README.md"
  - id: gatos-clockpolicy-rs
    repo: gatOS
    path: examples/agc/src/clockpolicy.rs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/agc/src/clockpolicy.rs
    title: "gatOS/examples/agc/src/clockpolicy.rs"
  - id: gatos-rcs-rs
    repo: gatOS
    path: examples/agc/src/rcs.rs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/agc/src/rcs.rs
    title: "gatOS/examples/agc/src/rcs.rs"
  - id: gatos-mod-rs
    repo: gatOS
    path: examples/agc/src/sim/mod.rs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/agc/src/sim/mod.rs
    title: "gatOS/examples/agc/src/sim/mod.rs"
  - id: gatos-readme-md
    repo: gatOS
    path: examples/land-o-matic/README.md
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/land-o-matic/README.md
    title: "gatOS/examples/land-o-matic/README.md"
  - id: gatos-main-rs
    repo: gatOS
    path: examples/land-o-matic/src/main.rs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/land-o-matic/src/main.rs
    title: "gatOS/examples/land-o-matic/src/main.rs"
  - id: gatos-launch-monitor-ts
    repo: gatOS
    path: examples/sdk-ts/examples/launch-monitor.ts
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/sdk-ts/examples/launch-monitor.ts
    title: "gatOS/examples/sdk-ts/examples/launch-monitor.ts"
  - id: gatos-solar-keeper-ts
    repo: gatOS
    path: examples/sdk-ts/examples/solar-keeper.ts
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/sdk-ts/examples/solar-keeper.ts
    title: "gatOS/examples/sdk-ts/examples/solar-keeper.ts"
  - id: gatos-client-ts
    repo: gatOS
    path: examples/sdk-ts/src/client.ts
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/sdk-ts/src/client.ts
    title: "gatOS/examples/sdk-ts/src/client.ts"
  - id: gatos-errors-ts
    repo: gatOS
    path: examples/sdk-ts/src/errors.ts
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/sdk-ts/src/errors.ts
    title: "gatOS/examples/sdk-ts/src/errors.ts"
  - id: gatos-transport-ts
    repo: gatOS
    path: examples/sdk-ts/src/transport.ts
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/examples/sdk-ts/src/transport.ts
    title: "gatOS/examples/sdk-ts/src/transport.ts"
  - id: gatos-gatosconfig-cs
    repo: gatOS
    path: gatOS.GameMod/Configuration/GatOsConfig.cs
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Configuration/GatOsConfig.cs
    title: "gatOS/gatOS.GameMod/Configuration/GatOsConfig.cs"
  - id: gatos-sim-openapi-yml
    repo: gatOS
    path: sim_openapi.yml
    resource: https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/sim_openapi.yml
    title: "gatOS/sim_openapi.yml"
---

Once a mod publishes its game interface outside the process (files in a guest, HTTP, MQTT), the consumers are ordinary programs: a script, a dashboard, a landing autopilot. This topic is about writing those consumers well. Nothing here runs inside KSA; from the game's side these programs are transport traffic whose reads come from an immutable snapshot and whose writes pass through the command queue described in [Marshal commands from background threads to the game thread](../marshal-commands-to-the-game-thread/overview.md).

Two practices make the difference between a demo and a flight program, and both come from the game's own timing: a closed loop must pace by simulation time, because time warp and pause decouple it from the wall clock, and it must refuse to act on stale telemetry, because the host publishes snapshots at a configured rate (10 Hz by default) rather than every frame.

## Engine background

There is no game type to hook. The relevant facts are about what the client sees:

| Fact | Consequence for the client |
|---|---|
| Simulated state is published as one immutable snapshot, default 10 Hz ([gatOS.GameMod/Configuration/GatOsConfig.cs](https://github.com/meow-sci/gatOS/blob/b88c28588e013841cfec58a1b3a09fcbd2cbc47e/gatOS.GameMod/Configuration/GatOsConfig.cs#L235-L235)) | Loop faster than the sample rate and the same `seq` repeats; key integration off the change in `ut` |
| The sim pauses and warps; the wall clock does not | `sleep(dt)` is wrong; wait for a sim time instead |
| Writes execute on the game thread at a frame drain, and solver-phase writes one dispatch later | Attitude and burn writes show up in telemetry after a step, so read back before assuming |
| A game thread that is not reaching its drain (loading, a stalled frame) | Writes time out (`ETIMEDOUT`); a simulation pause alone does not stop the drain |

See [the game loop reference](../../../getting-started/lifecycle/game-loop-and-lifecycle/overview.md) for the frame and physics ordering behind those rows.

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [Typed SDK with a Transport interface, plus example autopilot programs](build-external-clients-and-autopilots-with-a-typed-sdk.md) | gatos | `external-client` | `thread:background` | Scripts are transport-agnostic and errors are uniform; the SDK mirrors the mod's action vocabulary and must be kept in step |

## See also

- [Host HTTP and MQTT servers in the game process](../../network/host-http-and-mqtt-servers-in-the-game-process/overview.md)
- [Connect a VM guest to the game with slirp TCP, a 9P filesystem and pinned SSH](../../processes/host-guest-transports-tcp-9p-and-ssh/overview.md)
- [Marshal commands from background threads to the game thread](../marshal-commands-to-the-game-thread/overview.md)
- [Compute mission elapsed time and detect liftoff](../../../flight-and-orbits/flight-state/compute-mission-elapsed-time-and-detect-liftoff/overview.md)
- [Schedule timed command sequences](../schedule-timed-commands/overview.md)
