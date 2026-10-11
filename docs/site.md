---
type: Guide
title: Documentation site
description: How the Astro Starlight site under site/ renders the content/ bundle in place, how it is built and checked, and how it deploys to GitHub Pages
tags: [site, starlight, astro, github-pages]
generated: { by: claude-code/opus-5.5, at: 2026-10-11T15:10:00Z }
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
links to it, and a production build fails if it is missing (the dev server shows a hint instead).

| Command | Purpose |
|---|---|
| `node scripts/skill_build.ts --tarball site/public/downloads/ksa-modding.tar.gz` | Prerequisite: build the [Agent Skill](skill.md) and pack it into `site/public/` (git-ignored), which Astro copies to `site/dist/downloads/` |
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
| Page badges | `site/src/components/PageTitle.astro` | Shows `type`, `difficulty` and non-stable `status` under the title |
| Skill download | `site/src/components/SkillDownload.astro`, `MarkdownContent.astro`, hero action in `content.config.ts` | Home page only: "Download agent skill" hero button and an Agent skill section with the tarball size and install commands; throws in production builds when the tarball is missing |
| Source mods table | `site/src/components/ModAttribution.astro`, `MarkdownContent.astro` | Home page only: one row per mod (author, pinned source commit, license file, feature count, how-to articles and topics citing the mod in `demonstrated_by`), computed from collection frontmatter joined with `data/references.yml` and `attribution/` |

The base sidebar is rendered on every one of the ~2,750 pages, so it is kept small on purpose. Do not
autogenerate the full tree into it.

Routes follow the file paths: `content/mods/gatos/overview.md` is served at
`/ksa-coffer/mods/gatos/overview/` and `content/mods/gatos/index.md` at `/ksa-coffer/mods/gatos/`.

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
lockfile, the workspace file or the workflow itself, and on manual dispatch. The skill is published at
https://meow.science.fail/ksa-coffer/downloads/ksa-modding.tar.gz. `site` and `base` in
`site/astro.config.ts` must match the published URL.

[^conventions]: Content bundle conventions
