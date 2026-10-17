---
type: Guide
title: Documentation site
description: How the Astro Starlight site under site/ renders the content/ bundle in place, how it is built and checked, and how it deploys to GitHub Pages
tags: [site, starlight, astro, github-pages]
generated: { by: codex/gpt-6, at: 2026-10-14T02:16:21Z }
status: stable
sources:
  - id: conventions
    resource: content-conventions.md
    title: Content bundle conventions
---

The `site/` pnpm workspace package is an Astro Starlight site that publishes the whole `content/`
bundle to https://meow.science.fail/ksa-coffer/. It reads `../content` in place; nothing is copied
into `site/`, so the same bundle can feed other consumers (for example an agent skill).

## Commands

Run from the repository root after `pnpm install`. Build the skill tarball first: the home page
links to it, and a production build fails if its manifest or archive is missing or invalid (the dev
server shows a hint instead).

| Command | Purpose |
|---|---|
| `node scripts/skill_build.ts --tarball site/public/downloads/ksa-modding.tar.gz` | Prerequisite: build the [Agent Skill](skill.md), add its UTC build timestamp to the archive filename and write `ksa-modding.json` in `site/public/downloads/` (git-ignored); Astro copies these to `site/dist/downloads/` |
| `pnpm --filter site dev` | Local dev server at `http://localhost:4321/ksa-coffer/` |
| `pnpm --filter site build` | Static build to `site/dist` (includes the Pagefind search index) |
| `pnpm --filter site check-links` | Walk `site/dist` and report internal hrefs that do not resolve |

## How content becomes pages

| Piece | File | Role |
|---|---|---|
| OKF helpers | `site/src/lib/okf.ts` | Scans directory names and `overview.md` frontmatter; provides directory titles and the lean base sidebar |
| Loader | `site/src/content.config.ts` | Wraps Astro's `glob` loader over `../content`; injects `title` (and hero/splash for the root) into the frontmatter-less `index.md` and `log.md` files; extends `docsSchema` with the custom keys used for display |
| Link rewrite | `site/src/plugins/remark-okf-links.ts` | Rewrites file-relative `.md` links to site routes (`index.md` maps to its directory); links leaving `content/` become GitHub blob URLs; demotes body h1 to h2 on pages without a frontmatter title |
| Contextual sidebar | `site/src/routeMiddleware.ts` | The base sidebar lists how-to categories and groups plus the mods; the middleware expands only the current group, topic or mod |
| Page badges | `site/src/components/PageTitle.astro` | Shows `type`, `difficulty` and non-stable `status` under the title; `kind: authoring-tool` displays as Authoring tool |
| Content freshness | `site/src/components/ContentStatus.astro`, `MarkdownContent.astro`, `site/src/lib/skill-download.ts` | Home page only: last content refresh date/time in UTC and the KSA builds pinned by the content, read from the skill manifest |
| Skill download | `site/src/components/SkillDownload.astro`, `site/src/lib/skill-download.ts`, hero action in `content.config.ts` and `routeMiddleware.ts` | Home page only: dated archive link, size, UTC skill build date/time and install commands; the middleware resolves the hero link at render time so cached content cannot retain an older filename |
| Source mods and authoring tools table | `site/src/components/ModAttribution.astro`, `MarkdownContent.astro` | Home page only: one row per reference project (author, pinned source commit, license file, feature count, how-to articles and topics citing it in `demonstrated_by`), computed from collection frontmatter joined with `data/references.yml` and `attribution/` |

The base sidebar is rendered on every one of the ~2,750 pages, so it is kept small on purpose. Do not
autogenerate the full tree into it.

Routes follow the file paths: `content/mods/gatos/overview.md` is served at
`/ksa-coffer/mods/gatos/overview/` and `content/mods/gatos/index.md` at `/ksa-coffer/mods/gatos/`.

## Dates and game versions

`Content last refreshed` is the timestamp of the latest Git commit that changed `content/`, so a
site-only rebuild does not make the corpus appear newer. Uncommitted local content changes are not
included in that date. Builds without Git history fall back to the latest `generated.at` or
`verified[].at` recorded in the concept frontmatter. Use a full Git checkout when publishing.

`Checked against KSA` lists every distinct `game.build` pinned in the concept frontmatter. During
a partial refresh this can show more than one version. The skill build time is recorded separately;
its UTC value supplies both the archive filename and the date/time below the download link. All
three values and the download filename come from `downloads/ksa-modding.json`, generated alongside
the archive by `skill_build.ts`.

## Authoring implications

- Nothing site-specific is needed in content. Keep following the
  [content conventions](content-conventions.md): file-relative `.md` links, body headings from `##`,
  and fenced code with a language tag.[^conventions]
- After a content change, `pnpm --filter site build && pnpm --filter site check-links` catches links
  that resolve in OKF but not on the site.

## Deployment

`.github/workflows/site-deploy.yml` builds the skill tarball, then the site, and publishes with the
GitHub Pages artifact flow (repo Pages source: GitHub Actions). It runs on pushes to `main` that touch
`site/`, `content/`, `ai/catalog/howto-plan.yml`, the skill build inputs (`scripts/skill_build.ts`,
`scripts/skill/`, `docs/content-conventions.md`, `attribution/`, `attribution.yml`, `LICENSE`), the
lockfile, the workspace file or the workflow itself, and on manual dispatch. Checkout uses
`fetch-depth: 0` so content history remains available on site-only deployments. The skill is published
under `https://meow.science.fail/ksa-coffer/downloads/` as
`ksa-modding-YYYY-MM-DDTHHmmssZ.tar.gz`; the home page links to the manifest's exact filename. An identical
copy is published as `https://meow.science.fail/ksa-coffer/downloads/ksa-modding-latest.tar.gz`, a stable URL
for external consumers. `site`
and `base` in `site/astro.config.ts` must match the published URL.

[^conventions]: Content bundle conventions
