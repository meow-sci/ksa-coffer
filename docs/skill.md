---
type: Guide
title: Agent Skill build
description: How scripts/skill_build.ts compiles the content/ bundle into the ksa-modding Agent Skill under dist/skill/, what the skill contains and how it is validated
tags: [skill, agent-skills, build, dist]
generated: { by: codex/gpt-6, at: 2026-10-14T02:16:21Z }
status: stable
sources:
  - id: spec
    resource: https://agentskills.io/specification
    title: Agent Skills specification
  - id: best-practices
    resource: https://agentskills.io/skill-creation/best-practices
    title: Agent Skills best practices
---

`node scripts/skill_build.ts [--out dist/skill] [--tarball <base.tar.gz>]` compiles `content/` into
an Agent Skill at `dist/skill/ksa-modding/` (git-ignored). The skill directory name must equal the `name` in
`SKILL.md`, which is why the output sits one level below `dist/skill/`.[^spec] The build takes
about two seconds and never needs to read the corpus into an agent's context.

## Layout

| Path | Contents |
|---|---|
| `SKILL.md` | Rendered from `scripts/skill/SKILL.template.md`: workflow, category table, gotchas, live counts and the game build pin |
| `references/howto/`, `references/mods/` | The corpus tree with frontmatter slimmed to a whitelist and `log.md` files dropped, so file-relative links keep working |
| `references/catalog-howto-<category>.md` | Per category: groups, topics (overview link and description) and articles (title and difficulty) |
| `references/catalog-mods.md` | One entry per mod or authoring tool: repo, license, author, loader, description, features index |
| `references/lifecycle.md`, `references/techniques.md` | Vocabulary sections extracted from [Content bundle conventions](content-conventions.md) |
| `references/ATTRIBUTION.md`, `assets/licenses/`, `LICENSE` | Licensing of this repo and of the quoted mod code |
| `assets/index.jsonl` | One metadata record per concept page (title, description, tags, techniques, hooks, lifecycle, game types, ...) |
| `scripts/search.py` | Stdlib-only keyword search over the index, copied from `scripts/skill/search.py` |

The frontmatter whitelist and search index preserve `kind: authoring-tool` and `loader: none` for external tools.
Their `tool:authoring` and `tool:build` lifecycle phases remain distinct from KSA runtime phases.

## Progressive disclosure

`SKILL.md` stays near 2k tokens, well under the 500-line and 5k-token guidance, and tells the
agent when to open each catalog or vocabulary file.[^best-practices] Category catalogs are kept
under about 10k tokens by listing article titles only; the topic `overview.md` carries the
approach comparison.

## Validation

The build fails on: invalid `name`, `description` or `compatibility`; non-string `metadata`;
`SKILL.md` over 500 lines or 5k approximate tokens; any unresolved relative link in the output;
leftover `log.md` references. The official validator also passes:

```bash
uvx --from skills-ref agentskills validate dist/skill/ksa-modding
```

## Distribution

`--tarball <base.tar.gz>` packs the validated skill directory with the system `tar`. The argument
must end in `.tar.gz`; the build inserts its UTC timestamp before that suffix. For example,
`--tarball site/public/downloads/ksa-modding.tar.gz` produces
`ksa-modding-2026-10-11T133044Z.tar.gz`. The archive's single top-level entry stays `ksa-modding/`,
so it extracts straight into a skills directory. On macOS the build passes `--no-mac-metadata` and
`COPYFILE_DISABLE=1` to keep `._` files out.

After successfully packing, it writes a sibling `<base>.json` manifest (`ksa-modding.json` for the
site) with `filename`, `builtAt`, `contentRefreshedAt` and `gameBuilds`. The refresh timestamp comes
from the last Git commit changing `content/`, with the latest OKF generation/verification timestamp
as a fallback when history is unavailable. `gameBuilds` contains all distinct game pins in the
concepts. The home page uses this manifest for both download links, the install command and its
visible dates/version; see [Documentation site](site.md). Rebuild the skill before building the site
after changing the corpus.

## When to change things

- Edit `scripts/skill/SKILL.template.md` for workflow or gotcha changes; add gotchas when an
  agent using the skill makes a repeatable mistake.
- Category and group labels come from slugs via `humanize()`, which is duplicated in
  `scripts/skill_build.ts` and `site/src/lib/okf.ts`; keep the acronym maps in sync.

[^spec]: Agent Skills specification
[^best-practices]: Agent Skills best practices
