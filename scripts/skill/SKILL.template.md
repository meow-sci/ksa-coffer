---
name: ksa-modding
description: {{DESCRIPTION}}
license: {{LICENSE}}
compatibility: {{COMPATIBILITY}}
metadata:
  game-build: {{GAME_BUILD}}
  corpus-commit: {{CORPUS_COMMIT}}
  generated: {{GENERATED}}
  source: https://github.com/meow-sci/ksa-coffer
---

# KSA modding knowledge base

Curated, source-pinned knowledge for writing Kitten Space Agency (KSA) mods with the StarMap loader: {{N_HOWTO}} how-to articles in {{N_TOPICS}} topics ({{N_CATEGORIES}} categories) and {{N_FEATURES}} analyzed features of {{N_MODS}} community mods ({{N_SUBMODS}} submods). Everything is pinned to game build `{{GAME_BUILD}}`. All content lives under `references/`; open only what you need.

## Workflow

1. Find the topic: run `python3 scripts/search.py <terms>` (paths below are relative to this skill's directory), or open the matching category catalog from the table below.
2. Read the topic `overview.md` first. It explains the engine system and has an Approaches table comparing the numbered How-To articles. Pick one approach.
3. Read the chosen How-To article (`<topic>-N.md` next to the overview).
4. For real working code, open the pages listed in its `demonstrated_by` frontmatter (ids relative to `references/`, append `.md`).
5. Verify every game type and member against the user's game build before relying on it.

Search options: `--type how-to|feature|mod|topic|submod`, `--category <slug>`, `--mod <slug>`, `--lifecycle <token>`, `--limit N`. Example: `python3 scripts/search.py harmony transpiler drag --type how-to`.

## Find by category

Each catalog lists every topic and its articles (title and difficulty); the topic overview compares the articles.

| Category | Open when | Catalog |
|---|---|---|
{{CATEGORY_TABLE}}

## Community mods

{{N_MODS}} community mods were analyzed feature by feature, each with pinned code references. Open [references/catalog-mods.md](references/catalog-mods.md) when you want a working reference implementation, a mod's architecture, or to see how an existing mod solved a problem. Feature pages are under `references/mods/<mod>/features/`.

## Read first for any code mod

Open [the game loop and lifecycle overview]({{GAMELOOP_OVERVIEW}}) before writing code that touches game state: it explains the per-frame order, threads and where each hook runs. Its articles: {{GAMELOOP_ARTICLES}}. Use them to choose when your code must run.

## Vocabulary

- [references/lifecycle.md](references/lifecycle.md): open when a page's `lifecycle` token (for example `frame:draw-ui`, `startup:all-mods-loaded`, `physics:vehicle-solver`) is unclear, or for any question about when code may run and what state is safe to touch.
- [references/techniques.md](references/techniques.md): open to decode `techniques` tokens (`harmony-transpiler`, `imgui-window`, `glb-model`, ...) or to filter by technique.

## Gotchas

- Content is pinned to game build `{{GAME_BUILD}}`. KSA changes often: re-check type and member names against the current game assemblies.
- Code links are GitHub blob URLs pinned to specific commits; line anchors apply to that commit only.
- Links to decompiled game files (`current/decomp/...` in the meow-sci/ksa-game-assemblies repo) may not be accessible. Treat the backticked type and member names as the reference.
- Numbered articles in one topic (`foo-1.md`, `foo-2.md`) are alternative approaches, not sequential steps. Choose one via the overview's Approaches table.
- `demonstrated_by` ids are relative to `references/` and omit `.md`.
- Each directory has an `index.md` listing its pages.
- The search index covers titles, descriptions and tags only. For body-only terms use `grep -rli <term> references/howto references/mods`.

## Licensing

Skill content is MIT; quoted mod code keeps its original license. See [references/ATTRIBUTION.md](references/ATTRIBUTION.md).
