---
type: Game Feature
title: Make an HTTP request from a mod and add an in-game bug report form
description: "Send an HTTP request from a visible click on a background task, poll plain status fields from the draw each frame and handle load-context quirks of the game runtime"
topic: make-an-http-request-from-a-mod-without-blocking-the-frame
category: external-io
group: network
approaches: 1
game_types: [KSA.Program, KSA.Vehicle]
lifecycle: ["frame:draw-ui", "thread:background"]
demonstrated_by: [mods/ksarmory/features/in-game-bug-reports]
tags: [http, httpclient, bug-report, imgui, task-run]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T22:10:00Z }
status: stable
repos:
  - name: KSArmory
    git: https://github.com/LaurensDeV/KSArmory.git
    ref: cbd63d6d84da7a48a13641a641d3557bad216435
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
  - id: ksarmory-check-network-sh
    repo: KSArmory
    path: tools/check-network.sh
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/tools/check-network.sh
    title: "KSArmory/tools/check-network.sh"
  - id: ksarmory-feedbackclient-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/FeedbackClient.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/FeedbackClient.cs
    title: "KSArmory/src/KSArmory/Ksa/FeedbackClient.cs"
  - id: ksarmory-reportdraft-cs
    repo: KSArmory
    path: src/KSArmory/Sim/ReportDraft.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Sim/ReportDraft.cs
    title: "KSArmory/src/KSArmory/Sim/ReportDraft.cs"
  - id: ksarmory-uireport-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Ui/UiReport.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Ui/UiReport.cs
    title: "KSArmory/src/KSArmory/Ksa/Ui/UiReport.cs"
  - id: ksarmory-program-cs
    repo: KSArmory
    path: services/feedback/Program.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/services/feedback/Program.cs
    title: "KSArmory/services/feedback/Program.cs"
  - id: ksarmory-build-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/Build.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/Build.cs
    title: "KSArmory/src/KSArmory/Ksa/Build.cs"
  - id: ksarmory-ksarmorymod-cs
    repo: KSArmory
    path: src/KSArmory/Ksa/KSArmoryMod.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/src/KSArmory/Ksa/KSArmoryMod.cs
    title: "KSArmory/src/KSArmory/Ksa/KSArmoryMod.cs"
  - id: ksarmory-guard-cs
    repo: KSArmory
    path: services/feedback/Guard.cs
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/services/feedback/Guard.cs
    title: "KSArmory/services/feedback/Guard.cs"
  - id: ksarmory-ksa-modding-notes-md
    repo: KSArmory
    path: docs/KSA-MODDING-NOTES.md
    resource: https://github.com/LaurensDeV/KSArmory/blob/cbd63d6d84da7a48a13641a641d3557bad216435/docs/KSA-MODDING-NOTES.md
    title: "KSArmory/docs/KSA-MODDING-NOTES.md"
---

Sometimes a mod must reach out: a bug report, a version check the player asked for, a lookup on a service. The game provides no HTTP helper and no async bridge to the frame loop, so the pattern is the same as for any blocking work: start the request from a visible click on a thread-pool task, write the outcome into plain fields, and let the next draw pass read them. This topic covers that pattern, a game-specific runtime quirk that makes the obvious status check throw, and the policy side (the network is only touched when the player clicks).

## Engine background

| Type | File | Why it matters |
|---|---|---|
| `Program.OnFrame` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L2238-L2334) | One main-thread frame; the draw code must return quickly |
| `Program.OnDrawUiViewports` | [current/decomp/KSA/Program.cs](https://github.com/meow-sci/ksa-game-assemblies/blob/935a32b4dbc34cbcd16e87d16cf9732eb90030c0/current/decomp/KSA/Program.cs#L3162-L3176) | The StarMap `StarMapAfterGui` postfix target; skipped when `DrawUI` is false |
| `Vehicle` assembly version | the loaded `KSA.Vehicle` assembly | KSArmory reads the running game build from its assembly version |

## Approaches

| Article | Mod | Technique | Lifecycle | Trade-off |
|---|---|---|---|---|
| [FeedbackClient with polled status fields and reflection for StatusCode](make-an-http-request-from-a-mod-without-blocking-the-frame.md) | ksarmory | `background-thread` | `frame:draw-ui`, `thread:background` | Simple and race-free for one in-flight request; needs a service to hold credentials, and the reflection workaround is a hypothesis-driven patch |

## See also

- [Host HTTP and MQTT servers in the game process](../host-http-and-mqtt-servers-in-the-game-process/overview.md): the opposite direction
- [Check the game version](../../../getting-started/lifecycle/check-the-game-version/overview.md), [Build a settings window](../../../ui/windows/build-a-settings-window/overview.md)
- [Host a terminal with pty sessions and frame handoff](../../terminals/host-a-terminal-with-pty-sessions-and-frame-handoff/overview.md)
- [Drive a running game from scripts through a file-drop command bridge](../../../testing-and-tooling/in-game-testing/drive-a-running-game-through-a-file-bridge/overview.md) - related topic

