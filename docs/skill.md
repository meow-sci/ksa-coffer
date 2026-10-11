---
type: Guide
title: Agent Skill build
description: How scripts/skill_build.ts compiles the content/ bundle into the ksa-modding Agent Skill under dist/skill/, what the skill contains and how it is validated
tags: [skill, agent-skills, build, dist]
generated: { by: claude-code/opus-5.5, at: 2026-10-11T15:10:00Z }
status: stable
sources:
  - id: spec
    resource: https://agentskills.io/specification
    title: Agent Skills specification
  - id: best-practices
    resource: https://agentskills.io/skill-creation/best-practices
    title: Agent Skills best practices
---

`node scripts/skill_build.ts [--out dist/skill] [--tarball <file.tar.gz>]` compiles `content/` into
an Agent Skill at `dist/skill/ksa-modding/` (git-ignored). The skill directory name must equal the `name` in
`SKILL.md`, which is why the output sits one level below `dist/skill/`.[^spec] The build takes
about two seconds and never needs to read the corpus into an agent's context.

## Layout

| Path | Contents |
|---|---|
| `SKILL.md` | Rendered from `scripts/skill/SKILL.template.md`: workflow, category table, gotchas, live counts and the game build pin |
| `references/howto/`, `references/mods/` | The corpus tree with frontmatter slimmed to a whitelist and `log.md` files dropped, so file-relative links keep working |
| `references/catalog-howto-<category>.md` | Per category: groups, topics (overview link and description) and articles (title and difficulty) |
| `references/catalog-mods.md` | One entry per mod: repo, license, author, loader, description, features index |
| `references/lifecycle.md`, `references/techniques.md` | Vocabulary sections extracted from [Content bundle conventions](content-conventions.md) |
| `references/ATTRIBUTION.md`, `assets/licenses/`, `LICENSE` | Licensing of this repo and of the quoted mod code |
| `assets/index.jsonl` | One metadata record per concept page (title, description, tags, techniques, hooks, lifecycle, game types, ...) |
| `scripts/search.py` | Stdlib-only keyword search over the index, copied from `scripts/skill/search.py` |

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

`--tarball <file>` packs the validated skill directory with the system `tar` into a gzipped archive
whose single top-level entry is `ksa-modding/`, so it extracts straight into a skills directory
(on macOS it passes `--no-mac-metadata` and `COPYFILE_DISABLE=1` to keep `._` files out). The site
deploy runs it with `site/public/downloads/ksa-modding.tar.gz` and the home page links the result;
see [Documentation site](site.md).

## When to change things

- Edit `scripts/skill/SKILL.template.md` for workflow or gotcha changes; add gotchas when an
  agent using the skill makes a repeatable mistake.
- Category and group labels come from slugs via `humanize()`, which is duplicated in
  `scripts/skill_build.ts` and `site/src/lib/okf.ts`; keep the acronym maps in sync.

[^spec]: Agent Skills specification
[^best-practices]: Agent Skills best practices
