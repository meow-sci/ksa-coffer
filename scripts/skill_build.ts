#!/usr/bin/env node
/**
 * Compile the OKF knowledge corpus under content/ into an Agent Skill (agentskills.io spec).
 *
 *   node scripts/skill_build.ts [--out dist/skill] [--tarball <base.tar.gz>]
 *
 * Wipes and regenerates <out>/ksa-modding/ : SKILL.md (from scripts/skill/SKILL.template.md),
 * references/ (slimmed copy of content/ minus log.md, plus generated catalogs and vocabulary pages),
 * assets/index.jsonl + assets/licenses/, scripts/search.py (from scripts/skill/search.py) and LICENSE.
 * Validates the result and exits non-zero on failure. With --tarball, also packs the validated skill
 * directory into a gzipped tar (top-level entry ksa-modding/) using the system `tar`; the docs site
 * build uses --tarball site/public/downloads/ksa-modding.tar.gz as a base name: a UTC timestamp
 * is inserted before .tar.gz and a sibling ksa-modding.json records download/content metadata. An
 * identical copy named ksa-modding-latest.tar.gz gives external consumers a stable URL.
 * Runs on Node 24; needs the `yaml` package.
 */

import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { parseArgs } from 'node:util';
import { Document, parse as parseYaml, visit } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT = join(ROOT, 'content');
const SKILL_NAME = 'ksa-modding';
const GITHUB_BLOB = 'https://github.com/meow-sci/ksa-coffer/blob/main/';

const FM_WHITELIST = [
  'type', 'title', 'description', 'mod', 'submod', 'category', 'group', 'topic', 'approach', 'difficulty',
  'prerequisites', 'demonstrated_by', 'techniques', 'hooks', 'lifecycle', 'game_types', 'tags', 'repo',
  'license', 'author', 'loader', 'mod_id', 'kind',
];

type Fm = Record<string, unknown>;
interface Concept {
  rel: string; // path relative to content/, e.g. mods/x/features/y.md
  fm: Fm;
}

// ---------------------------------------------------------------- helpers

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function splitFm(text: string): { fm: Fm | null; body: string } {
  if (!text.startsWith('---')) return { fm: null, body: text };
  const m = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(\r?\n|$)/.exec(text);
  if (!m) return { fm: null, body: text };
  let fm: Fm | null = null;
  try {
    fm = (parseYaml(m[1] ?? '') ?? {}) as Fm;
  } catch {
    fm = null;
  }
  return { fm, body: text.slice(m[0].length) };
}

function slimFm(fm: Fm): string {
  const out: Fm = {};
  for (const k of FM_WHITELIST) if (fm[k] !== undefined && fm[k] !== null) out[k] = fm[k];
  const doc = new Document(out);
  visit(doc, {
    Seq(_key, node) {
      const items = node.items as unknown[];
      const scalars = items.every((i) => typeof (i as { value?: unknown })?.value === 'string');
      if (scalars && items.map((i) => String((i as { value: string }).value)).join(', ').length <= 100) node.flow = true;
    },
  });
  return doc.toString({ lineWidth: 0, flowCollectionPadding: false });
}

const asStr = (v: unknown): string => (v === undefined || v === null ? '' : String(v));
const oneLine = (s: unknown): string => asStr(s).replace(/\s+/g, ' ').trim();
// keep in sync with humanize() in site/src/lib/okf.ts
const ACRONYMS: Record<string, string> = { ui: 'UI', io: 'I/O', eva: 'EVA', ksa: 'KSA', api: 'API', mcp: 'MCP', xml: 'XML', glb: 'GLB', rcs: 'RCS', hud: 'HUD', imgui: 'ImGui' };
const humanize = (slug: string): string => {
  const t = slug.split('-').map((w) => ACRONYMS[w] ?? w).join(' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const escText = (s: string): string => s.replace(/([[\]])/g, '\\$1');
const tokens = (s: string): number => Math.round(s.length / 4);
const isExternal = (t: string): boolean => /^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(t);

const LINK_RE = /\[((?:[^[\]]|\[[^\]]*\])*)\]\(([^)\s]*)((?:\s+"[^"]*")?)\)/g;

/** Rewrite links line by line (outside fenced code). `srcRel` is content-relative, e.g. mods/x/index.md. */
function rewriteLinks(body: string, srcRel: string): string {
  const isIndex = srcRel.endsWith('/index.md') || srcRel === 'index.md';
  const srcDir = dirname(join(CONTENT, srcRel));
  const lines = body.split('\n');
  const out: string[] = [];
  let fence: string | null = null;
  for (const line of lines) {
    const fm = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fm) {
      const mark = fm[1]![0]!;
      if (fence === null) fence = mark;
      else if (fence === mark) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null || !line.includes('](')) {
      out.push(line);
      continue;
    }
    let linksLog = false;
    let otherLinks = 0;
    const replaced = line.replace(LINK_RE, (whole, text: string, target: string, title: string) => {
      if (isExternal(target) || target === '') {
        otherLinks++;
        return whole;
      }
      const hashAt = target.indexOf('#');
      const path = hashAt >= 0 ? target.slice(0, hashAt) : target;
      const frag = hashAt >= 0 ? target.slice(hashAt) : '';
      if (path === 'log.md' || path.endsWith('/log.md')) {
        linksLog = true;
        return text;
      }
      const abs = resolve(srcDir, decodeURI(path));
      if (abs !== CONTENT && !abs.startsWith(CONTENT + sep)) {
        otherLinks++;
        return `[${text}](${GITHUB_BLOB}${relative(ROOT, abs).split(sep).join('/')}${frag}${title})`;
      }
      otherLinks++;
      return whole;
    });
    if (isIndex && linksLog && otherLinks === 0 && /^\s*[*-]\s/.test(line)) continue;
    out.push(replaced);
  }
  return out.join('\n');
}

function writeOut(path: string, data: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
}

function shorten(desc: string, max = 100): string {
  const d = oneLine(desc);
  if (d.length <= max) return d;
  const cut = d.slice(0, max);
  const comma = Math.max(cut.lastIndexOf(', '), cut.lastIndexOf(' - '), cut.lastIndexOf('; '));
  const base = comma > max * 0.5 ? cut.slice(0, comma) : cut.slice(0, cut.lastIndexOf(' '));
  return base.replace(/[,;:\s-]+$/, '') + '...';
}

function section(lines: string[], startRe: RegExp, stopRe: RegExp): string[] {
  const start = lines.findIndex((l) => startRe.test(l));
  if (start < 0) throw new Error(`section not found: ${startRe}`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (stopRe.test(lines[i]!)) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end);
}

// ---------------------------------------------------------------- main

function main(): number {
  const args = parseArgs({ options: { out: { type: 'string', default: 'dist/skill' }, tarball: { type: 'string' } } });
  const builtAt = new Date().toISOString();
  if (args.values.tarball && !args.values.tarball.endsWith('.tar.gz')) {
    throw new Error('--tarball must end in .tar.gz (a UTC timestamp is added to this base name)');
  }
  const outRoot = resolve(ROOT, args.values.out as string);
  const skill = join(outRoot, SKILL_NAME);
  const refs = join(skill, 'references');
  rmSync(skill, { recursive: true, force: true });
  mkdirSync(refs, { recursive: true });

  // a+b: walk and copy
  const concepts: Concept[] = [];
  let copied = 0;
  for (const p of walk(CONTENT)) {
    if (!p.endsWith('.md')) continue;
    const rel = relative(CONTENT, p).split(sep).join('/');
    const base = rel.split('/').pop()!;
    if (base === 'log.md' || rel === 'index.md') continue;
    const text = readFileSync(p, 'utf8');
    if (base === 'index.md') {
      writeOut(join(refs, rel), rewriteLinks(text, rel));
    } else {
      const { fm, body } = splitFm(text);
      if (!fm) throw new Error(`no frontmatter: ${rel}`);
      concepts.push({ rel, fm });
      writeOut(join(refs, rel), `---\n${slimFm(fm)}---\n${rewriteLinks(body, rel)}`);
    }
    copied++;
  }

  const byType = (t: string): Concept[] => concepts.filter((c) => c.fm.type === t);
  const howtos = byType('How-To');
  const topics = byType('Game Feature');
  const mods = byType('Mod');
  const features = byType('Mod Feature');
  const submods = byType('Submod');
  const gameBuilds = [...new Set(concepts.map((c) => asStr((c.fm.game as Fm | undefined)?.build)).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const gameBuild = gameBuilds.join(', ');
  if (!gameBuild) throw new Error('game build not found in frontmatter');

  // c. catalogs
  const plan = parseYaml(readFileSync(join(ROOT, 'ai/catalog/howto-plan.yml'), 'utf8')) as {
    game_loop_reference: string;
    game_loop_group: string;
    categories: Record<string, { description: string; groups: Record<string, string> }>;
  };
  const catSlugs = readdirSync(join(CONTENT, 'howto'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  const catalogSizes: Record<string, number> = {};
  const catRows: string[] = [];
  for (const cat of Object.keys(plan.categories).filter((c) => catSlugs.includes(c)).concat(catSlugs.filter((c) => !plan.categories[c]))) {
    const pc = plan.categories[cat];
    const catTopics = topics.filter((t) => t.rel.startsWith(`howto/${cat}/`));
    const groupSlugs = [...new Set(catTopics.map((t) => t.rel.split('/')[2]!))];
    const ordered = Object.keys(pc?.groups ?? {}).filter((g) => groupSlugs.includes(g)).concat(groupSlugs.filter((g) => !(pc?.groups ?? {})[g]));
    let md = `# ${humanize(cat)}\n\n${oneLine(pc?.description)}\n`;
    for (const g of ordered) {
      md += `\n## ${humanize(g)}\n\n${oneLine(pc?.groups?.[g])}\n`;
      const gTopics = catTopics.filter((t) => t.rel.split('/')[2] === g).sort((a, b) => a.rel.localeCompare(b.rel));
      for (const t of gTopics) {
        const dir = dirname(t.rel);
        md += `\n### [${escText(oneLine(t.fm.title))}](${t.rel})\n\n${oneLine(t.fm.description)}\n\n`;
        const arts = howtos
          .filter((h) => dirname(h.rel) === dir)
          .sort((a, b) => Number(a.fm.approach ?? 0) - Number(b.fm.approach ?? 0) || a.rel.localeCompare(b.rel));
        for (const h of arts) {
          md += `- [${escText(oneLine(h.fm.title))}](${h.rel}) — ${asStr(h.fm.difficulty)}\n`;
        }
      }
    }
    writeOut(join(refs, `catalog-howto-${cat}.md`), md);
    catalogSizes[`catalog-howto-${cat}.md`] = tokens(md);
    catRows.push(`| ${humanize(cat)} | ${shorten(asStr(pc?.description)).replace(/\|/g, '/')} | [catalog](references/catalog-howto-${cat}.md) |`);
  }

  {
    let md = `# Community mods and authoring tools\n\nAnalyzed community KSA mods and external authoring tools. Open a project overview for its architecture and feature list, then a feature page for pinned code references.\n`;
    const sorted = [...mods].sort((a, b) => oneLine(a.fm.title).toLowerCase().localeCompare(oneLine(b.fm.title).toLowerCase()));
    for (const m of sorted) {
      const slug = m.rel.split('/')[1]!;
      const meta = ['repo', 'license', 'author', 'loader'].map((k) => oneLine(m.fm[k]) || '-').join(' · ');
      const nFeat = features.filter((f) => f.rel.startsWith(`mods/${slug}/`)).length;
      const nSub = submods.filter((f) => f.rel.startsWith(`mods/${slug}/`)).length;
      md += `\n## [${escText(oneLine(m.fm.title))}](${m.rel})\n\n${meta}\n\n${oneLine(m.fm.description)}\n\n`;
      md += `Features: [${nFeat} features](mods/${slug}/features/index.md)`;
      if (nSub > 0) md += ` · Submods: [${nSub} submods](mods/${slug}/submods/index.md)`;
      md += '\n';
    }
    writeOut(join(refs, 'catalog-mods.md'), md);
    catalogSizes['catalog-mods.md'] = tokens(md);
  }

  {
    const conv = readFileSync(join(ROOT, 'docs/content-conventions.md'), 'utf8').split('\n');
    const clean = (ls: string[]): string =>
      ls
        .join('\n')
        .replace(/\[\^[^\]]+\]/g, '')
        .replace(LINK_RE, (whole, text: string, target: string) => (isExternal(target) ? whole : text))
        .replace(/^\n+|\n+$/g, '');
    const lc = clean(section(conv, /^## Lifecycle and timing \(required\)/, /^## /));
    const tq = clean(section(conv, /^### Techniques vocabulary/, /^##/));
    writeOut(
      join(refs, 'lifecycle.md'),
      `# Lifecycle values and timing\n\nThe \`lifecycle\` and \`hooks\` frontmatter vocabulary used by every Mod Feature and How-To, with the frame structure of build ${gameBuild}.\n\n${lc}\n`,
    );
    writeOut(
      join(refs, 'techniques.md'),
      `# Techniques vocabulary\n\nValues used in the \`techniques\` frontmatter list of Mod Feature and How-To pages.\n\n${tq}\n`,
    );
  }

  {
    const attr = parseYaml(readFileSync(join(ROOT, 'attribution.yml'), 'utf8')) as { projects: { name: string; url: string; license: string }[] };
    const licDir = join(ROOT, 'attribution');
    const licFiles = existsSync(licDir) ? readdirSync(licDir).filter((f) => f.endsWith('.txt')).sort() : [];
    mkdirSync(join(skill, 'assets/licenses'), { recursive: true });
    for (const f of licFiles) copyFileSync(join(licDir, f), join(skill, 'assets/licenses', f));
    copyFileSync(join(ROOT, 'LICENSE'), join(skill, 'LICENSE'));
    let md = `# Attribution\n\nThis skill is MIT licensed (see \`LICENSE\` in the skill root). It quotes and analyzes code from the third-party community mods and authoring tools below, which keep their own licenses. Full license texts are in \`assets/licenses/\`.\n\n| Project | URL | License | License text |\n|---|---|---|---|\n`;
    for (const p of attr.projects) {
      const files = licFiles.filter((f) => f === `LICENSE.${p.name}.txt` || new RegExp(`^LICENSE\\.${p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+\\.txt$`).test(f));
      const links = files.map((f) => `[${f}](../assets/licenses/${f})`).join(', ') || '-';
      md += `| ${p.name} | ${p.url} | ${p.license} | ${links} |\n`;
    }
    writeOut(join(refs, 'ATTRIBUTION.md'), md);
  }

  // d. index.jsonl
  {
    const lines: string[] = [];
    for (const c of [...concepts].sort((a, b) => a.rel.localeCompare(b.rel))) {
      const parts = c.rel.split('/');
      const rec: Record<string, unknown> = { path: `references/${c.rel}` };
      const f = c.fm;
      Object.assign(rec, {
        type: f.type,
        kind: f.kind,
        loader: f.loader,
        title: oneLine(f.title),
        description: oneLine(f.description),
        category: parts[0] === 'howto' ? parts[1] : f.category,
        group: parts[0] === 'howto' ? parts[2] : f.group,
        topic: parts[0] === 'howto' ? parts[3] : f.topic,
        mod: parts[0] === 'mods' ? parts[1] : undefined,
        approach: f.approach,
        difficulty: f.difficulty,
        tags: f.tags,
        techniques: f.techniques,
        hooks: f.hooks,
        lifecycle: f.lifecycle,
        game_types: f.game_types,
        demonstrated_by: f.demonstrated_by,
      });
      for (const k of Object.keys(rec)) {
        const v = rec[k];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) delete rec[k];
      }
      lines.push(JSON.stringify(rec));
    }
    writeOut(join(skill, 'assets/index.jsonl'), lines.join('\n') + '\n');
  }

  // e. search.py
  writeOut(join(skill, 'scripts/search.py'), readFileSync(join(ROOT, 'scripts/skill/search.py'), 'utf8'));

  // f. SKILL.md
  const gl = plan.game_loop_reference.split('/');
  const glDir = `howto/${gl[0]}/${plan.game_loop_group}/${gl[1]}`;
  const glOverview = `references/${glDir}/overview.md`;
  const glArticles = howtos
    .filter((h) => dirname(h.rel) === glDir)
    .sort((a, b) => Number(a.fm.approach ?? 0) - Number(b.fm.approach ?? 0))
    .map((h) => `[${escText(oneLine(h.fm.title))}](references/${h.rel})`)
    .join('; ');
  if (!existsSync(join(skill, glOverview))) throw new Error(`game loop overview missing: ${glOverview}`);
  let sha = 'unknown';
  try {
    sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    /* not a git checkout */
  }
  const description =
    `Implementation knowledge for writing Kitten Space Agency (KSA) code mods and asset-only mods: ${howtos.length} step-by-step how-to articles across ${topics.length} topics ` +
    `(getting started with StarMap mod loading and lifecycle, Harmony patching, ImGui UI, rendering, shaders, assets, physics, vehicles and parts, flight and orbits, camera, celestials, kittens and EVA, persistence, audio, external I/O, testing and tooling) ` +
    `plus ${features.length} analyzed features of ${mods.length} community mods and authoring tools with pinned code references and decompiled game API names. ` +
    `Use when creating, debugging or researching a KSA or StarMap mod, native XML/GLB assets, Flexo authoring workflows, KSA game internals, mod.toml, or Harmony patches against KSA types.`;
  const q = (s: string): string => JSON.stringify(s);
  const subs: Record<string, string> = {
    DESCRIPTION: q(description),
    LICENSE: q('MIT (see LICENSE); quoted source code under third-party licenses, see references/ATTRIBUTION.md'),
    COMPATIBILITY: q('Search script needs Python 3.8+ (stdlib only). Code links point to GitHub.'),
    GAME_BUILD: q(gameBuild),
    CORPUS_COMMIT: q(sha),
    GENERATED: q(builtAt.slice(0, 10)),
    N_HOWTO: String(howtos.length),
    N_TOPICS: String(topics.length),
    N_FEATURES: String(features.length),
    N_MODS: String(mods.length),
    N_SUBMODS: String(submods.length),
    N_CATEGORIES: String(catRows.length),
    CATEGORY_TABLE: catRows.join('\n'),
    GAMELOOP_OVERVIEW: glOverview,
    GAMELOOP_ARTICLES: glArticles,
  };
  // GAME_BUILD is used both in YAML (quoted needed) and in prose (backticks): use plain form in prose.
  let tpl = readFileSync(join(ROOT, 'scripts/skill/SKILL.template.md'), 'utf8');
  tpl = tpl.replace(/^(  game-build: )\{\{GAME_BUILD\}\}/m, `$1${subs.GAME_BUILD}`);
  tpl = tpl.replace(/\{\{([A-Z_]+)\}\}/g, (_w, k: string) => {
    if (!(k in subs)) throw new Error(`unknown placeholder {{${k}}}`);
    return k === 'GAME_BUILD' ? gameBuild : subs[k]!;
  });
  writeOut(join(skill, 'SKILL.md'), tpl);

  // g. validation
  const errors: string[] = [];
  const skillMd = readFileSync(join(skill, 'SKILL.md'), 'utf8');
  const fm = splitFm(skillMd).fm ?? {};
  const name = asStr(fm.name);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push(`invalid name: ${name}`);
  if (name !== SKILL_NAME) errors.push(`name ${name} != dir ${SKILL_NAME}`);
  const desc = asStr(fm.description);
  if (desc.length < 1 || desc.length > 1024) errors.push(`description length ${desc.length}`);
  const compat = asStr(fm.compatibility);
  if (compat.length > 500) errors.push(`compatibility length ${compat.length}`);
  const meta = (fm.metadata ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(meta)) if (typeof v !== 'string') errors.push(`metadata.${k} is not a string`);
  const skillLines = skillMd.split('\n').length;
  const skillTokens = tokens(skillMd);
  if (skillLines >= 500) errors.push(`SKILL.md has ${skillLines} lines`);
  if (skillTokens >= 5000) errors.push(`SKILL.md ~${skillTokens} tokens`);

  let files = 0;
  let bytes = 0;
  let checked = 0;
  const broken: string[] = [];
  let logRefs = 0;
  for (const p of walk(skill)) {
    files++;
    bytes += statSync(p).size;
    if (!p.endsWith('.md')) continue;
    if (p.endsWith(`${sep}log.md`)) logRefs++;
    const here = dirname(p);
    let fence: string | null = null;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const fmk = /^\s*(`{3,}|~{3,})/.exec(line);
      if (fmk) {
        const mark = fmk[1]![0]!;
        if (fence === null) fence = mark;
        else if (fence === mark) fence = null;
        continue;
      }
      if (fence !== null || !line.includes('](')) continue;
      for (const m of line.matchAll(LINK_RE)) {
        const target = m[2]!;
        if (isExternal(target) || target === '') continue;
        const path = target.split('#')[0]!;
        if (path === '') continue;
        checked++;
        if (/(^|\/)log\.md$/.test(path)) logRefs++;
        let abs: string;
        try {
          abs = resolve(here, decodeURI(path));
        } catch {
          abs = resolve(here, path);
        }
        if (!existsSync(abs) || !statSync(abs).isFile()) broken.push(`${relative(skill, p)} -> ${target}`);
      }
    }
  }
  if (broken.length) errors.push(`${broken.length} broken relative links`);
  if (logRefs) errors.push(`${logRefs} log.md references remain`);

  const biggest = Object.entries(catalogSizes).sort((a, b) => b[1] - a[1])[0]!;
  console.log(`skill: ${relative(ROOT, skill)}`);
  console.log(`concepts: ${howtos.length} how-tos, ${topics.length} topics, ${features.length} features, ${mods.length} mods, ${submods.length} submods; ${copied} md files copied`);
  console.log(`output: ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
  console.log(`SKILL.md: ${skillLines} lines, ~${skillTokens} tokens (${skillMd.length} chars); description ${desc.length} chars`);
  console.log(`catalogs (approx tokens): ${Object.entries(catalogSizes).map(([k, v]) => `${k.replace('catalog-howto-', '').replace('.md', '')}=${v}`).join(' ')}`);
  console.log(`largest catalog: ${biggest[0]} ~${biggest[1]} tokens${biggest[1] > 10000 ? ' (EXCEEDS 10k)' : ''}`);
  console.log(`links checked: ${checked}, broken: ${broken.length}`);
  for (const b of broken.slice(0, 20)) console.log(`  broken: ${b}`);
  if (errors.length) {
    console.error(`VALIDATION FAILED:\n  ${errors.join('\n  ')}`);
    return 1;
  }
  console.log('validation: OK');

  if (args.values.tarball) {
    // Content freshness must survive site-only rebuilds. CI checks out full history so this
    // finds the last content commit, even when the current commit only changes the website.
    let contentRefreshedAt = '';
    try {
      contentRefreshedAt = execFileSync('git', ['log', '-1', '--format=%cI', '--', 'content/'], {
        cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } catch {
      /* source archive without Git: use the latest recorded generation/verification time */
    }
    if (!contentRefreshedAt) {
      const dates = concepts.flatMap(({ fm }) => {
        const verified = Array.isArray(fm.verified) ? fm.verified : [fm.verified];
        return [fm.generated, ...verified].map((v) => Date.parse(asStr((v as Fm | undefined)?.at)));
      }).filter(Number.isFinite);
      if (!dates.length) throw new Error('content refresh date not found in Git history or frontmatter');
      contentRefreshedAt = new Date(Math.max(...dates)).toISOString();
    }
    contentRefreshedAt = new Date(contentRefreshedAt).toISOString();
    const base = resolve(ROOT, args.values.tarball as string).slice(0, -'.tar.gz'.length);
    const timestamp = builtAt.replace(/:/g, '').replace(/\.\d{3}Z$/, 'Z');
    const tarball = `${base}-${timestamp}.tar.gz`;
    mkdirSync(dirname(tarball), { recursive: true });
    rmSync(tarball, { force: true });
    // macOS bsdtar would otherwise add AppleDouble ._ entries and xattr headers.
    const macFlags = process.platform === 'darwin' ? ['--no-mac-metadata'] : [];
    execFileSync('tar', [...macFlags, '-czf', tarball, '-C', outRoot, SKILL_NAME], {
      stdio: 'inherit',
      env: { ...process.env, COPYFILE_DISABLE: '1' },
    });
    // Byte-identical copy under a stable name for external consumers (not recorded in the manifest).
    const latest = `${base}-latest.tar.gz`;
    copyFileSync(tarball, latest);
    // Written only after packing succeeds; both home-page download links read this manifest.
    writeOut(`${base}.json`, JSON.stringify({ filename: basename(tarball), builtAt, contentRefreshedAt, gameBuilds }, null, 2) + '\n');
    console.log(`tarball: ${relative(ROOT, tarball)} (${(statSync(tarball).size / 1048576).toFixed(1)} MB); stable copy: ${relative(ROOT, latest)}`);
    console.log(`metadata: ${relative(ROOT, `${base}.json`)}; content refreshed ${contentRefreshedAt}; KSA ${gameBuild}`);
  }
  return 0;
}

process.exit(main());
