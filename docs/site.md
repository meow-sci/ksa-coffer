---
type: Guide
title: Documentation site
description: How the Astro Starlight site under site/ renders the content/ bundle in place, how it is built and checked, and how it deploys to GitHub Pages
tags: [site, starlight, astro, github-pages]
generated: { by: claude-code/opus-5.5, at: 2026-10-10T23:30:00Z }
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

Run from the repository root after `pnpm install`.

| Command | Purpose |
|---|---|
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

`.github/workflows/site-deploy.yml` builds and publishes with the GitHub Pages artifact flow (repo
Pages source: GitHub Actions). It runs on pushes to `main` that touch `site/`, `content/`, `ai/catalog/howto-plan.yml`, the
lockfile, the workspace file or the workflow itself, and on manual dispatch. `site` and `base` in
`site/astro.config.ts` must match the published URL.

[^conventions]: Content bundle conventions
