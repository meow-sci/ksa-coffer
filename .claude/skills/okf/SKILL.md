---
name: okf
description: >-
  Author, edit, validate, and consume Open Knowledge Format (OKF v0.2) knowledge
  bundles: directory trees of markdown concept documents with YAML frontmatter,
  plus index.md listings and log.md histories. Use whenever creating or editing
  .md files inside an OKF bundle (including this repository's documentation
  corpus), writing or fixing frontmatter (type, title, description, tags,
  sources, generated, verified, status, stale_after), cross-linking concepts,
  citing sources with footnotes, regenerating index.md files, recording changes
  in log.md, checking a bundle for conformance, or navigating a bundle to answer
  a question, even when the user does not say "OKF".
license: Apache-2.0
metadata:
  okf-version: "0.2"
  spec-source: https://github.com/GoogleCloudPlatform/open-knowledge-format
---

# Open Knowledge Format (OKF v0.2)

OKF is a vendor-neutral format for knowledge corpora that are written and
maintained by both people and agents. A **bundle** is a directory of markdown
files. Each non-reserved `.md` file is one **concept**: a YAML frontmatter
block followed by a markdown body. Provenance, trust, and freshness live in
frontmatter so a consumer can judge a concept without reading its prose.

This file is enough to produce conformant OKF. Load a file from
`references/` only when its trigger (listed at the end) applies.

## Bundle layout

```
bundle/
  index.md            # reserved: directory listing (no frontmatter)
  log.md              # reserved: change history, newest first
  <concept>.md        # a concept at the root
  <group>/            # any directory structure the domain needs
    index.md
    <concept>.md
    <subgroup>/...
```

- `index.md` and `log.md` are **reserved** at every level. Never use them for
  a concept. Every other `.md` file is a concept and MUST have frontmatter.
- A concept's **id** is its bundle-relative path without `.md`
  (`tables/orders`). Path segments match `[A-Za-z0-9_][A-Za-z0-9_.-]*`; use
  lowercase kebab-case or snake_case and keep names stable, because links
  and ids depend on them.
- Group concepts in directories by kind (`tables/`, `metrics/`,
  `references/`, ...). The directory tree is a navigation aid, not a schema.

## Conformance in three rules

A bundle is conformant when:

1. Every non-reserved `.md` file starts with a parseable YAML frontmatter
   block delimited by `---` lines.
2. Every frontmatter block has a non-empty `type`.
3. Every `index.md` and `log.md` follows the formats below.

`type` is the only required key. Everything else is optional, but missing
optional fields carry meaning (no `verified` means unverified, no `status`
means stable), so set them deliberately.

## Writing a concept

Start from `assets/concept-template.md`. The frontmatter:

```yaml
---
type: Reference                      # REQUIRED. Free-form kind, e.g. "BigQuery Table", "Metric", "Playbook", "API Endpoint"
title: Part Config Schema            # recommended display name
description: One sentence; reused verbatim in index.md and search snippets.
resource: https://example.com/asset  # canonical URI of the underlying asset; omit for abstract concepts
tags: [modding, config]              # short strings for cross-cutting search
generated: { by: claude-code/fable-5.1, at: 2026-10-09T18:00:00Z }
status: stable                       # draft | stable | deprecated (absent = stable)
sources:
  - id: ksa-wiki-parts               # stable key; body footnotes reference it
    resource: https://example.com/wiki/parts
    title: KSA wiki, Parts page
---
```

Field rules that matter most:

- `type`: short, descriptive, Title Case. Reuse the exact string other
  concepts of the same kind use. Consumers group and route by it.
- `description`: exactly one sentence, no trailing period required, no
  markdown. Quote it in YAML if it contains a colon.
- `generated`: `{ by: <actor>, at: <ISO 8601 with offset> }`. Set `at` to
  now (UTC) on every meaningful content change. Actor convention:
  `<producer>/<version>` for tools and agents, `human:<id>` for people,
  `process:<id>` for automation.
- `verified`: list of `{ by, at }`. Add an entry only when someone actually
  confirmed the content against its sources. Writing a concept does not
  verify it. Never write `verified` with your own agent actor unless you
  checked the claims against the cited sources in this session.
- `status`: set `draft` for incomplete work and `deprecated` when retiring a
  concept (keep the file; add a link to the replacement in the body).
- `stale_after`: absolute ISO 8601 instant (`2027-01-01T00:00:00Z`) after
  which the content must be re-checked. Use it for anything tied to a
  release, policy cycle, or API version. Date-only values are ignored by
  consumers; always include the time and offset.
- `sources`: every material the content was derived from. Each entry needs
  `resource` (URL, bundle-relative path, or a scope description). Give an
  `id` to anything you cite in the body. Never invent sources or URLs.
- Timestamps everywhere: ISO 8601 with explicit UTC offset, like
  `2026-10-09T18:00:00Z`.
- Extra keys are allowed. Consumers preserve unknown keys and never reject
  them. Put only queryable, short values in frontmatter; prose goes in the
  body.

Full field reference, including Attested Computation keys:
[references/frontmatter.md](references/frontmatter.md).

### Body

Standard markdown. Prefer structure (headings, tables, lists, fenced code)
over prose. Conventional headings, used when applicable:

| Heading         | Use for                                                     |
|-----------------|-------------------------------------------------------------|
| `# Schema`      | Structured fields/columns/keys of an asset.                 |
| `# Examples`    | Concrete usage, usually fenced code blocks.                 |
| `# Computation` | The sanctioned computation of an `Attested Computation`.    |

A good concept body, in order: one to three paragraphs of what it is and
how it is used (state the grain or scope, caveats, and version
applicability); then `# Schema` or equivalent structured section; then
`# Examples`; then any relationship sections (`# Joins`, `# See also`); then
footnote definitions. Do not add a `# Citations` list; that is OKF v0.1.
Provenance belongs in `sources`.

## Linking and citing

- Link concepts with normal markdown links to the `.md` file. Default to a
  **file-relative** path (`../tables/orders.md`, `./other.md`) so links render
  on GitHub and in plain file viewers. Bundle-absolute paths starting with
  `/` are also valid OKF and are stabler under moves; use them only if the
  bundle already does.
- Link only to targets that exist or that you are creating now. Broken links
  are tolerated by consumers but are a defect in authored content.
- Link once per concept per section. Never link inside headings, fenced
  code, or table field-name cells. Never link a concept to itself.
- Attribute a specific claim with a footnote whose label equals a
  `sources[].id`:

  ```markdown
  Parts are loaded from `GameData/*.cfg` at startup.[^ksa-wiki-parts]

  [^ksa-wiki-parts]: KSA wiki, Parts page
  ```

  The label is the join key into `sources`; keep footnote text short. Do
  not use positional labels like `[^1]`.

Details and edge cases: [references/body-and-linking.md](references/body-and-linking.md).

## index.md

One per directory, including the root. No frontmatter (the root `index.md`
may carry only `okf_version: "0.2"`). One `# <Heading>` per group of entries;
group concepts by their `type` and list subdirectories under
`# Subdirectories`. Each entry is a bullet: `* [Title](relative-link) - description`.

```markdown
# Reference

* [Part Config Schema](part-config-schema.md) - One sentence from the concept's description.

# Subdirectories

* [examples](examples/index.md) - What the subdirectory contains.
```

Regenerate with `scripts/build_indexes.py` after adding, renaming, moving, or
re-describing concepts (see Scripts). Keep entries alphabetical by title.

## log.md

Optional, at any level, newest first. Date headings are `## YYYY-MM-DD`.
Entries are bullets that start with a bold verb (`**Creation**`,
`**Update**`, `**Deprecation**`, `**Verified**`) and link to the concepts
touched.

```markdown
# Bundle history

## 2026-10-09
* **Creation**: Added [Part Config Schema](references/part-config-schema.md) from the KSA wiki.
* **Update**: Refreshed `stale_after` on [Modding API](api/modding-api.md) for the 0.4 release.
```

Record a log entry whenever you add, deprecate, verify, or materially change
a concept. Log entries may have an optional frontmatter block with
`type: Log` (the sample bundles do this); plain is fine too.

## Trust signals at a glance

| Question             | Field                  | Reading                                                  |
|----------------------|------------------------|----------------------------------------------------------|
| Where is it from?    | `sources[]`            | `author`, `usage_count`, `last_modified` are signals, not a score |
| Who wrote it?        | `generated.by/.at`     | last meaningful content change                           |
| Who confirmed it?    | `verified[]`           | none = unverified; non-human = machine-confirmed; any `human:` = human-reviewed |
| Is it current?       | `status`               | `draft` / `stable` (default) / `deprecated`              |
| Is it stale?         | `stale_after`          | stale when `now >= stale_after`                          |

When consuming: prefer human-reviewed over machine-confirmed over
unverified; skip `deprecated` unless asked for history; flag anything past
`stale_after`. Full semantics: [references/trust-and-lifecycle.md](references/trust-and-lifecycle.md).

## Workflows

### Create a concept

1. Pick the directory and filename (id). Check `index.md` and sibling files
   so you reuse the existing `type` string and naming pattern.
2. Copy `assets/concept-template.md`; fill frontmatter. Set `generated`
   with your actor and the current UTC time. Set `status: draft` if the
   content is incomplete.
3. Write the body. Cite claims with footnotes keyed to `sources[].id`.
   Cross-link related concepts with relative paths.
4. Run `scripts/validate_bundle.py <bundle-root>` and fix every error.
5. Run `scripts/build_indexes.py <bundle-root>` and add a `log.md` entry.

### Edit a concept

1. Read the existing file; refine rather than rewrite. Preserve unknown
   frontmatter keys and existing `verified` entries you did not produce.
2. Update `generated.at` (and `generated.by` to your actor) on any
   meaningful content change. Do not touch `verified` unless you verified.
3. If the `description` or `title` changed, regenerate indexes.
4. If the concept is being replaced, set `status: deprecated`, keep the
   file, link the replacement in the body, and log a `**Deprecation**`.
5. Validate, then log the change.

### Consume a bundle to answer a question

1. Read the root `index.md`, then descend one `index.md` at a time. Do not
   bulk-load the tree.
2. Open candidate concepts. Read frontmatter first: check `type`,
   `status`, `stale_after`, and the trust tier before trusting the body.
3. Follow links for related concepts; treat footnotes as pointers into
   `sources` when you need the original material.
4. Cite the concept id and, when it matters, its trust tier and freshness
   in your answer. Guide: [references/consuming.md](references/consuming.md).

### Validate a bundle

Run the validator and treat errors as blocking. Warnings cover recommended
fields, timestamp format, dangling footnotes, actor convention, and
broken links. Manual checklist:
[references/conformance-checklist.md](references/conformance-checklist.md).

## Gotchas

- A `.md` file with no frontmatter anywhere in the bundle (except
  `index.md`/`log.md`) makes the whole bundle non-conformant. Notes, drafts,
  and READMEs inside a bundle need `type` too, or must live outside it.
- `index.md` must not have frontmatter. The only exception is
  `okf_version` in the bundle root.
- `timestamp:` is a v0.1 key. Use `generated: { by, at }`.
- Date-only `stale_after` (`2026-12-31`) is silently ignored by consumers.
- Hand-written or human-confirmed content must use the `human:` actor
  prefix or the trust tier is computed wrong.
- A bare `verified: { by, at }` mapping is legal and means a one-element
  list. Do not "fix" it when editing.
- YAML: quote `description` or `title` values containing `: ` or starting
  with `[`, `*`, `&`, `!`, `@`, or a quote.
- The `description` in `index.md` entries must match the concept's
  frontmatter; regenerate rather than hand-edit indexes.
- Never link to a concept you are guessing exists. Check the index first.
- In an `Attested Computation`, an agent may only supply parameter values.
  Never edit the computation or write SQL that replaces it. See
  [references/attested-computation.md](references/attested-computation.md).

## Scripts

Both are self-contained Python (PEP 723 header, needs `pyyaml`). Run with
`uv run scripts/<name>.py ...` or `python3 scripts/<name>.py ...` when pyyaml
is installed. Paths are relative to this skill directory.

- `scripts/validate_bundle.py <bundle-root> [--format json] [--strict]`
  checks conformance and reports errors/warnings per file. Exit code 1 on
  errors (or on warnings with `--strict`).
- `scripts/build_indexes.py <bundle-root> [--check] [--dry-run]`
  regenerates every `index.md` from frontmatter, preserving existing
  subdirectory descriptions and the root `okf_version`. `--check` exits 1 if
  any index is out of date without writing.

## References

Load on demand:

- [references/frontmatter.md](references/frontmatter.md): every field, its
  shape, and when to use it. Load when writing unusual frontmatter
  (`sources` credibility signals, `usage_window`, computation keys) or
  migrating v0.1 documents.
- [references/body-and-linking.md](references/body-and-linking.md): body
  structure, link resolution rules, footnote rules, path-valued fields.
  Load when links or citations are non-trivial.
- [references/index-and-log.md](references/index-and-log.md): exact
  grammar for `index.md` and `log.md`, and generation rules. Load when
  hand-writing either file or writing tooling for them.
- [references/trust-and-lifecycle.md](references/trust-and-lifecycle.md):
  provenance, trust tiers, status, staleness, actor convention, and
  consumer gating. Load when verifying, deprecating, or judging trust.
- [references/attested-computation.md](references/attested-computation.md):
  the `Attested Computation` type, executor/attester contract, and the run
  lifecycle. Load only when a concept carries `runtime:` or the task
  involves sanctioned computations.
- [references/consuming.md](references/consuming.md): reading a bundle
  efficiently as an agent, building the link graph, and gating on trust.
- [references/examples.md](references/examples.md): complete worked
  concepts (resource-bound, abstract, reference/lookup, deprecated, log)
  taken from the reference bundles. Load when you want a pattern to copy.
- [references/conformance-checklist.md](references/conformance-checklist.md):
  manual review checklist and the consumer tolerance rules.
