# Project documentation history

## 2026-10-17
* **Update**: The skill build now also writes `ksa-modding-latest.tar.gz`, an identical copy of the timestamped tarball, so the deployed site exposes a stable download URL; documented in [Agent Skill build](skill.md) and [Documentation site](site.md).

## 2026-10-13
* **Update**: Preserved external-tool classification in the [site](site.md) page badge and [skill](skill.md) search index; normalized SSH repository remotes into browser source links in the site attribution table.
* **Update**: Extended [Content bundle conventions](content-conventions.md) for external authoring tools, their authoring/build lifecycle phases and truthful producer metadata; kept the shared mods bundle structure.
* **Update**: Kept authoring-tool metadata in the [Agent Skill build](skill.md) and included authoring tools in the [Documentation site](site.md) attribution table and generated reference descriptions.

## 2026-10-11
* **Update**: Added home-page content refresh time and pinned KSA versions in [Documentation site](site.md); documented UTC-stamped tarball filenames, the unchanged internal directory and the shared download metadata in [Agent Skill build](skill.md).
* **Update**: Added repo skills `add-mod` and `refresh-data` (`.claude/skills/`, mirrored in `.agents/skills/`) that point agents at the refresh procedure and briefs; listed them in AGENTS.md and README.md.
* **Update**: Added the refresh workflow: [Knowledge extraction pipeline](knowledge-pipeline.md) now explains line-level refresh planning, hunk triage and triage baselines; [Content bundle conventions](content-conventions.md) gained refresh-safe citation rules. New scripts `scripts/content_refresh_plan.ts` and `scripts/references_pull.ts`, brief `ai/briefs/REFRESH_BRIEF.md`, baseline `ai/catalog/game.yml`.
* **Update**: Documented the `--tarball` option in [Agent Skill build](skill.md) and the home-page skill download, its build prerequisite and the extra deploy triggers in [Documentation site](site.md).
* **Update**: Documented the home-page source mods attribution table in [Documentation site](site.md).
* **Creation**: Added [Agent Skill build](skill.md) describing scripts/skill_build.ts, the ksa-modding skill layout under dist/skill/ and its validation.

## 2026-10-10
* **Creation**: Added [Documentation site](site.md) describing the Astro Starlight site under site/, its loader, link rewriting, contextual sidebar and GitHub Pages deployment.
* **Update**: Updated the Starlight compatibility notes in [Content bundle conventions](content-conventions.md) to match the implemented loader and remark link plugin.
* **Creation**: Added [Knowledge extraction pipeline](knowledge-pipeline.md) describing the two-phase agent pipeline, the briefs and catalogs under ai/, and the refresh workflow.
* **Update**: Corrected the lifecycle table in [Content bundle conventions](content-conventions.md) after the game-loop reference was verified against the decomp: `UpdateRenderingResources` runs in `Program.Render`, `OnFrameController` only syncs cursor mode, render phases are interleaved, and `StarMapAllModsLoaded` precedes `ModLibrary.AttachGameData`.
* **Creation**: Added [Content bundle conventions](content-conventions.md) defining the mods/howto bundle layout, custom `repos`/`game` pins, lifecycle vocabulary and code-reference rules.
