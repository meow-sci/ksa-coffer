#!/usr/bin/env node
/**
 * Work out, deterministically and cheaply, what (if anything) in content/ must be re-analyzed after
 * the reference checkouts under references/ or the game assemblies checkout moved, and do every
 * mechanical part of the refresh itself.
 *
 *   node scripts/content_refresh_plan.ts [--out FILE] [--json FILE] [--check] [--coverage]
 *   node scripts/content_refresh_plan.ts --benign <id>[,<id>...]
 *   node scripts/content_refresh_plan.ts --repin
 *   node scripts/content_refresh_plan.ts --accept content/<page>.md[,...]
 *   node scripts/content_refresh_plan.ts --ack <repo>[,<repo>...]|game|all
 *
 * How it decides (no LLM involved):
 *
 * 1. Every concept pins the commits it was checked against (`repos[].ref`, `game.ref`/`game.build`)
 *    and cites code as `sources[]` (`repo` + `path`), pinned GitHub blob links with `#Lx-Ly`
 *    anchors, and snippet header comments (`// path L10-L20, L30-L40`). For each pin that differs
 *    from the checkout HEAD the script reads `git diff -U0 <pin> HEAD` for the cited files only.
 * 2. Hunks that change nothing but decompiler noise (embedded `"...cs", <line>)` literals,
 *    renumbered `AnonymousDelegateN` / `<>c__DisplayClassN` names) are ignored.
 * 3. Per page and per stale repo:
 *      - every cited range lies outside every real hunk -> REPIN: still correct. `--repin` moves
 *        the pin to HEAD and remaps every line anchor and snippet header through the hunks.
 *      - a real hunk overlaps a cited range, a cited file changed with no range cited, or a cited
 *        file was deleted -> REVIEW, listing exactly those ranges.
 *      - the pinned commit is not in the local clone -> UNKNOWN (fetch full history, rerun).
 *    How-to pages whose `demonstrated_by` names a REVIEW feature page are listed as DEPENDENT.
 * 4. Review work is grouped by change (diff hunk `h-...`, or `f-...` for a changed file a page cites
 *    without line ranges), so each change is judged once however many pages cite it. Changes that
 *    cannot affect any citing page are recorded with `--benign` (ai/refresh/triage.yml); their pages
 *    then count as REPIN. A reviewer handles each remaining REVIEW page with `--accept <page>`: it
 *    remaps every anchor (best effort for the overlapping ranges, which it prints), moves the pins
 *    to HEAD, and the reviewer then fixes only the printed ranges by hand.
 * 5. Upstream code no page cites yet (possible new features) is reported per mod repo as the diff
 *    between its triage baseline (`ref:` in ai/catalog/<slug>.yml) and HEAD minus every cited path;
 *    game changes are reported as the version.json changelog of each build between the game
 *    baseline (ai/catalog/game.yml) and HEAD. Baselines move only with `--ack`, after triage.
 * 6. Inventory drift: checkouts missing from data/references.yml, entries without a checkout,
 *    repos without a content/mods bundle or catalog, bundles without an entry, lagging data refs.
 *
 * Options:
 *   --out FILE     write the markdown report to FILE instead of stdout
 *   --json FILE    also write the machine-readable plan to FILE
 *   --check        exit 1 when anything needs action
 *   --coverage     also list mod feature pages that no how-to cites in `demonstrated_by`
 *   --benign LIST  record change ids (h-.../f-...) as irrelevant to every page citing them
 *   --repin        apply every REPIN (pins, links, anchors, snippet headers, game.build)
 *   --accept LIST  comma-separated content/ paths of REVIEW pages to bump after (or while) reviewing
 *   --ack LIST     move triage baselines to HEAD: repo names from data/references.yml, `game`, `all`
 *
 * Exit codes: 0 ok, 1 action needed (only with --check), 2 usage or input error.
 * Runs on Node 24 with native type stripping; needs the `yaml` package (scripts/package.json).
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT = join(ROOT, 'content');
const REFERENCES = join(ROOT, 'references');
const DATA_FILE = join(ROOT, 'data', 'references.yml');
const CATALOG = join(ROOT, 'ai', 'catalog');
const GAME_NAME = 'ksa-game-assemblies';
const GAME_DIR = resolve(process.env.KSA_GAME_ASSEMBLIES ?? join(ROOT, '..', GAME_NAME));
const GAME_BASELINE = join(CATALOG, 'game.yml');
const RESERVED = new Set(['index.md', 'log.md']);
const LIST_CAP = 80;
const TRIAGE_FILE = join(ROOT, 'ai', 'refresh', 'triage.yml');
const HUNK_LINES = 24;

/* ---------------------------------------------------------------------------------------------- */
/* git and text helpers                                                                           */

interface RepoRecord { name: string; git: string; ref: string; license: string }
interface Repo { name: string; dir: string; web: string; head: string | null; isGame: boolean }
interface Hunk { id: string; oldStart: number; oldCount: number; newStart: number; newCount: number; noise: boolean; minus: string[]; plus: string[] }
interface FileDiff { status: string; added: number; deleted: number; hunks: Hunk[] | null }

function git(dir: string, args: string[]): string {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 512 * 1024 * 1024 }).trim();
}
function tryGit(dir: string, args: string[]): string | null {
  try {
    return git(dir, args);
  } catch {
    return null;
  }
}
function slugOf(name: string): string {
  return name.toLowerCase().replace(/_/g, '-');
}
function webUrl(gitUrl: string): string {
  let u = gitUrl.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.*)$/i.exec(u);
  const scpLike = /^(?:[^@/]+@)?([^/:]+):(?!\/\/)(.*)$/.exec(u);
  if (withScheme) u = `${withScheme[1]}/${withScheme[2]}`;
  else if (scpLike) u = `${scpLike[1]}/${scpLike[2]}`;
  return `https://${u.replace(/\/+$/, '').replace(/\.git$/i, '').replace(/\/+$/, '')}`.toLowerCase();
}
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function splitFrontmatter(text: string): { fm: Record<string, unknown> | null; body: string } {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { fm: null, body: text };
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      try {
        return { fm: (parseYaml(lines.slice(1, i).join('\n')) ?? {}) as Record<string, unknown>, body: lines.slice(i + 1).join('\n') };
      } catch {
        return { fm: null, body: text };
      }
    }
  }
  return { fm: null, body: text };
}
function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.md') && !RESERVED.has(e.name)) yield p;
  }
}
function readBaseline(file: string): string | null {
  if (!existsSync(file)) return null;
  const m = /^ref:\s*["']?([0-9a-f]{40,64})/m.exec(readFileSync(file, 'utf8'));
  return m ? m[1]! : null;
}
function gameBuildAt(dir: string, ref: string): string | null {
  const v = tryGit(dir, ['show', `${ref}:current/version.json`]);
  try {
    return v ? ((JSON.parse(v) as { build?: string }).build ?? null) : null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------------------------------- */
/* diffs, noise and line mapping                                                                  */

/** Normalise lines so decompiler churn compares equal. */
function denoise(line: string): string {
  return line
    .replace(/("[^"\n]*\.cs", )\d+\)/g, '$1N)')
    .replace(/AnonymousDelegate\d+/g, 'AnonymousDelegateN')
    .replace(/c__DisplayClass\d+_\d+/g, 'c__DisplayClassN')
    .replace(/<>\d+__/g, '<>N__')
    .trimEnd();
}

const fileListCache = new Map<string, Map<string, FileDiff> | null>();
/** Changed files between `from` and HEAD (status and counts), hunks filled lazily. */
function changedFiles(repo: Repo, from: string): Map<string, FileDiff> | null {
  const key = `${repo.name}@${from}`;
  if (fileListCache.has(key)) return fileListCache.get(key)!;
  let result: Map<string, FileDiff> | null = null;
  if (repo.head && tryGit(repo.dir, ['cat-file', '-e', `${from}^{commit}`]) !== null) {
    result = new Map();
    for (const line of git(repo.dir, ['diff', '--name-status', '--no-renames', from, repo.head]).split('\n').filter(Boolean)) {
      const [st, ...rest] = line.split('\t');
      result.set(rest.join('\t'), { status: st!, added: 0, deleted: 0, hunks: null });
    }
    for (const line of git(repo.dir, ['diff', '--numstat', '--no-renames', from, repo.head]).split('\n').filter(Boolean)) {
      const [a, d, ...rest] = line.split('\t');
      const c = result.get(rest.join('\t'));
      if (c) {
        c.added = a === '-' ? 0 : Number(a);
        c.deleted = d === '-' ? 0 : Number(d);
      }
    }
  }
  fileListCache.set(key, result);
  return result;
}

function shortId(parts: string[]): string {
  return createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 10);
}
/** Stable id of a whole-file change (used when a page cites the file without line ranges). */
function fileId(repo: string, from: string, to: string, path: string): string {
  return `f-${shortId([repo, from, to, path, 'file'])}`;
}

function hunksFor(repo: Repo, from: string, path: string, fd: FileDiff): Hunk[] {
  if (fd.hunks) return fd.hunks;
  const text = tryGit(repo.dir, ['diff', '-U0', '--no-renames', from, repo.head!, '--', path]) ?? '';
  const hunks: Hunk[] = [];
  let cur: Hunk | null = null;
  const flush = (): void => {
    if (!cur) return;
    cur.noise = cur.minus.length === cur.plus.length && cur.minus.every((l, i) => denoise(l) === denoise(cur!.plus[i]!));
    hunks.push(cur);
  };
  for (const line of text.split('\n')) {
    const m = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (m) {
      flush();
      const oldStart = Number(m[1]);
      const oldCount = m[2] === undefined ? 1 : Number(m[2]);
      const newStart = Number(m[3]);
      const newCount = m[4] === undefined ? 1 : Number(m[4]);
      cur = { id: `h-${shortId([repo.name, from, repo.head!, path, `${oldStart},${oldCount}`, `${newStart},${newCount}`])}`, oldStart, oldCount, newStart, newCount, noise: false, minus: [], plus: [] };
    } else if (cur && line.startsWith('-') && !line.startsWith('---')) cur.minus.push(line.slice(1));
    else if (cur && line.startsWith('+') && !line.startsWith('+++')) cur.plus.push(line.slice(1));
  }
  flush();
  fd.hunks = hunks;
  return hunks;
}

/** Old range [a,b] touched by a non-noise hunk? Pure insertions count when strictly inside the range. */
function overlaps(h: Hunk, a: number, b: number): boolean {
  if (h.noise) return false;
  if (h.oldCount === 0) return h.oldStart >= a && h.oldStart < b; // inserted after old line oldStart
  const s = h.oldStart;
  const e = h.oldStart + h.oldCount - 1;
  return s <= b && e >= a;
}
/** Map an old line number to the new file. Lines inside a replaced hunk map to the hunk start. */
function mapLine(hunks: Hunk[], line: number): number {
  let delta = 0;
  for (const h of hunks) {
    const oldEnd = h.oldCount === 0 ? h.oldStart : h.oldStart + h.oldCount - 1;
    if (h.oldCount === 0 ? h.oldStart < line : oldEnd < line) delta += h.newCount - h.oldCount;
    else if (h.oldCount > 0 && h.oldStart <= line && line <= oldEnd) return h.newStart + Math.min(line - h.oldStart, Math.max(h.newCount - 1, 0));
  }
  return line + delta;
}

/* ---------------------------------------------------------------------------------------------- */
/* pages and their citations                                                                      */

const LINK_RE = /\(https:\/\/github\.com\/([^/\s)]+)\/([^/\s)]+)\/blob\/([0-9a-f]{7,64})\/([^)\s#]+)(?:#L(\d+)(?:-L(\d+))?)?\)/g;
const FENCE_RE = /^(\s*)(```|~~~)[^\n]*\n([^\n]*)/gm;
const RANGE_RE = /\bL(\d+)(?:\s*[-–]\s*L?(\d+))?/g;

interface Page {
  rel: string;
  file: string;
  type: string;
  pins: Map<string, string>;
  gameBuild: string | null;
  cited: Map<string, Set<string>>; // repo -> paths
  ranges: Map<string, [number, number][]>; // `${repo}\t${path}` -> ranges in pinned coordinates
  demonstratedBy: string[];
}

function loadRepos(): { repos: Map<string, Repo>; byWeb: Map<string, string>; records: RepoRecord[] } {
  const data = parseYaml(readFileSync(DATA_FILE, 'utf8')) as { repos: RepoRecord[] };
  const repos = new Map<string, Repo>();
  const byWeb = new Map<string, string>();
  for (const r of data.repos) {
    const dir = join(REFERENCES, r.name);
    repos.set(r.name, { name: r.name, dir, web: webUrl(r.git), head: existsSync(dir) ? tryGit(dir, ['rev-parse', 'HEAD']) : null, isGame: false });
    byWeb.set(webUrl(r.git), r.name);
  }
  if (existsSync(GAME_DIR)) {
    const remote = tryGit(GAME_DIR, ['remote', 'get-url', 'origin']) ?? '';
    repos.set(GAME_NAME, { name: GAME_NAME, dir: GAME_DIR, web: remote ? webUrl(remote) : '', head: tryGit(GAME_DIR, ['rev-parse', 'HEAD']), isGame: true });
    if (remote) byWeb.set(webUrl(remote), GAME_NAME);
  }
  return { repos, byWeb, records: data.repos };
}

function loadPage(file: string, byWeb: Map<string, string>): Page | null {
  const text = readFileSync(file, 'utf8');
  const { fm, body } = splitFrontmatter(text);
  if (!fm) return null;
  const pins = new Map<string, string>();
  for (const r of (Array.isArray(fm.repos) ? fm.repos : []) as Record<string, unknown>[]) if (r && r.name && r.ref) pins.set(String(r.name), String(r.ref));
  let gameBuild: string | null = null;
  const g = fm.game as Record<string, unknown> | undefined;
  if (g && g.ref) {
    pins.set(GAME_NAME, String(g.ref));
    gameBuild = g.build ? String(g.build) : null;
  }
  const cited = new Map<string, Set<string>>();
  const ranges = new Map<string, [number, number][]>();
  const add = (repo: string, path: string): void => {
    if (!cited.has(repo)) cited.set(repo, new Set());
    cited.get(repo)!.add(path);
  };
  const addRange = (repo: string, path: string, a: number, b: number): void => {
    const k = `${repo}\t${path}`;
    if (!ranges.has(k)) ranges.set(k, []);
    ranges.get(k)!.push([Math.min(a, b), Math.max(a, b)]);
  };
  for (const s of (Array.isArray(fm.sources) ? fm.sources : []) as Record<string, unknown>[]) if (s && s.repo && s.path) add(String(s.repo), String(s.path));
  for (const m of body.matchAll(LINK_RE)) {
    const repo = byWeb.get(`https://github.com/${m[1]}/${m[2]}`.toLowerCase());
    if (!repo) continue;
    const path = decodeURIComponent(m[4]!);
    add(repo, path);
    if (m[5]) addRange(repo, path, Number(m[5]), Number(m[6] ?? m[5]));
  }
  // snippet headers: first line of a fence naming a cited path, followed by L-ranges
  for (const m of body.matchAll(FENCE_RE)) {
    const header = m[3] ?? '';
    const hit = headerTarget(header, cited);
    if (!hit) continue;
    const after = header.slice(header.indexOf(hit.path) + hit.path.length);
    for (const r of after.matchAll(RANGE_RE)) addRange(hit.repo, hit.path, Number(r[1]), Number(r[2] ?? r[1]));
  }
  const db = Array.isArray(fm.demonstrated_by) ? (fm.demonstrated_by as unknown[]).map(String) : [];
  return { rel: relative(CONTENT, file).split('\\').join('/'), file, type: String(fm.type ?? ''), pins, gameBuild, cited, ranges, demonstratedBy: db };
}

/** The longest cited path that appears in a snippet header line, with its repo. */
function headerTarget(header: string, cited: Map<string, Set<string>>): { repo: string; path: string } | null {
  let best: { repo: string; path: string } | null = null;
  for (const [repo, paths] of cited) for (const p of paths) {
    if (header.includes(p) && (!best || p.length > best.path.length)) best = { repo, path: p };
  }
  return best;
}

function loadPages(byWeb: Map<string, string>): Page[] {
  const pages: Page[] = [];
  for (const file of walk(CONTENT)) {
    const p = loadPage(file, byWeb);
    if (p) pages.push(p);
  }
  return pages;
}

/* ---------------------------------------------------------------------------------------------- */
/* triage: hunks and whole-file changes an agent has judged irrelevant to every citing page        */

function loadBenign(): Set<string> {
  if (!existsSync(TRIAGE_FILE)) return new Set();
  const d = (parseYaml(readFileSync(TRIAGE_FILE, 'utf8')) ?? {}) as { benign?: unknown };
  return new Set((Array.isArray(d.benign) ? d.benign : []).map((x) => String(x).split(/\s/)[0]!));
}
function addBenign(ids: string[], notes: Map<string, string>): void {
  mkdirSync(dirname(TRIAGE_FILE), { recursive: true });
  const existing = existsSync(TRIAGE_FILE) ? readFileSync(TRIAGE_FILE, 'utf8') : '# Diff hunks (h-...) and whole-file changes (f-...) judged irrelevant to every page that cites them.\n# Ids embed the from/to commits, so entries from earlier refresh cycles are inert and may be pruned.\n# Maintained by scripts/content_refresh_plan.ts --benign; add a short reason after each id.\nbenign:\n';
  const have = loadBenign();
  const lines = ids.filter((id) => !have.has(id)).map((id) => `  - "${id}${notes.get(id) ? ` ${notes.get(id)!.replace(/"/g, "'")}` : ''}"`);
  writeFileSync(TRIAGE_FILE, `${existing.replace(/\s*$/, '\n')}${lines.join('\n')}${lines.length ? '\n' : ''}`, 'utf8');
}

/* ---------------------------------------------------------------------------------------------- */
/* classification                                                                                 */

type PageStatus = 'current' | 'repin' | 'review' | 'unknown';
interface Touched { path: string; reason: 'deleted' | 'unanchored' | 'overlap'; ranges: [number, number][]; added: number; deleted: number; ids: string[] }
interface RepoVerdict { repo: string; from: string; to: string; touched: Touched[] }
interface PagePlan { page: string; type: string; status: PageStatus; repin: RepoVerdict[]; review: RepoVerdict[]; unknown: { repo: string; from: string }[] }

function classify(p: Page, repos: Map<string, Repo>, benign: Set<string>): PagePlan {
  const plan: PagePlan = { page: p.rel, type: p.type, status: 'current', repin: [], review: [], unknown: [] };
  for (const [name, pinned] of p.pins) {
    const repo = repos.get(name);
    if (!repo || !repo.head || pinned === repo.head) continue;
    const files = changedFiles(repo, pinned);
    if (!files) {
      plan.unknown.push({ repo: name, from: pinned });
      continue;
    }
    const touched: Touched[] = [];
    for (const path of p.cited.get(name) ?? []) {
      const fd = files.get(path);
      if (!fd) continue;
      if (fd.status.startsWith('D')) {
        touched.push({ path, reason: 'deleted', ranges: [], added: fd.added, deleted: fd.deleted, ids: [fileId(name, pinned, repo.head, path)] });
        continue;
      }
      const hunks = hunksFor(repo, pinned, path, fd).filter((h) => !h.noise && !benign.has(h.id));
      if (!hunks.length) continue;
      const rs = p.ranges.get(`${name}\t${path}`) ?? [];
      if (!rs.length) {
        const fid = fileId(name, pinned, repo.head, path);
        if (!benign.has(fid)) touched.push({ path, reason: 'unanchored', ranges: [], added: fd.added, deleted: fd.deleted, ids: [fid] });
        continue;
      }
      const hit = rs.filter(([a, b]) => hunks.some((h) => overlaps(h, a, b)));
      const ids = [...new Set(hunks.filter((h) => rs.some(([a, b]) => overlaps(h, a, b))).map((h) => h.id))];
      if (hit.length) touched.push({ path, reason: 'overlap', ranges: dedupe(hit), added: fd.added, deleted: fd.deleted, ids });
    }
    (touched.length ? plan.review : plan.repin).push({ repo: name, from: pinned, to: repo.head, touched });
  }
  plan.status = plan.review.length ? 'review' : plan.unknown.length ? 'unknown' : plan.repin.length ? 'repin' : 'current';
  return plan;
}
function dedupe(rs: [number, number][]): [number, number][] {
  const seen = new Set<string>();
  return rs.filter(([a, b]) => (seen.has(`${a}-${b}`) ? false : (seen.add(`${a}-${b}`), true)));
}

/* ---------------------------------------------------------------------------------------------- */
/* rewriting: pins, anchors, snippet headers                                                      */

interface Rewrite { repo: Repo; from: string; to: string }

function rewritePage(p: Page, rewrites: Rewrite[], repos: Map<string, Repo>): string[] {
  let text = readFileSync(p.file, 'utf8');
  const notes: string[] = [];
  for (const rw of rewrites) {
    const files = changedFiles(rw.repo, rw.from)!;
    const mapper = (path: string): ((n: number) => number) => {
      const fd = files.get(path);
      if (!fd || fd.status.startsWith('D')) return (n) => n;
      const hunks = hunksFor(rw.repo, rw.from, path, fd);
      return (n) => mapLine(hunks, n);
    };
    // 1. link anchors for this repo and pinned ref
    const linkRe = new RegExp(`(${escapeRe(rw.repo.web.replace('https://', ''))}/blob/)${rw.from}/([^)\\s#]+)(?:#L(\\d+)(?:-L(\\d+))?)?`, 'gi');
    text = text.replace(linkRe, (_m, prefix: string, path: string, a?: string, b?: string) => {
      const map = mapper(decodeURIComponent(path));
      let anchor = '';
      if (a) {
        const na = map(Number(a));
        const nb = b ? map(Number(b)) : null;
        anchor = nb !== null ? `#L${na}-L${Math.max(nb, na)}` : `#L${na}`;
      }
      return `${prefix}${rw.to}/${path}${anchor}`;
    });
    // 2. snippet headers naming a path cited from this repo
    const paths = [...(p.cited.get(rw.repo.name) ?? [])].sort((x, y) => y.length - x.length);
    text = text.replace(FENCE_RE, (whole: string, indent: string, fence: string, header: string) => {
      const target = paths.find((path) => header.includes(path));
      if (!target) return whole;
      const best = headerTarget(header, p.cited);
      if (!best || best.repo !== rw.repo.name) return whole;
      const map = mapper(target);
      const cut = header.indexOf(target) + target.length;
      const tail = header.slice(cut).replace(RANGE_RE, (_r: string, a: string, b?: string) => {
        const na = map(Number(a));
        return b ? `L${na}-L${Math.max(map(Number(b)), na)}` : `L${na}`;
      });
      return whole.replace(header, header.slice(0, cut) + tail);
    });
    // 3. every other occurrence of the pinned ref (frontmatter repos/game, sources[].resource)
    text = text.split(rw.from).join(rw.to);
    // 4. game build
    if (rw.repo.isGame && p.gameBuild) {
      const build = gameBuildAt(rw.repo.dir, rw.to);
      if (build && build !== p.gameBuild) text = text.replace(/^(game:[ \t]*\r?\n(?:[ \t]+.*\r?\n)*?[ \t]+build:[ \t]*)["']?[^\r\n"']+["']?/m, `$1${build}`);
    }
    notes.push(`${rw.repo.name} ${rw.from.slice(0, 12)}->${rw.to.slice(0, 12)}`);
  }
  writeFileSync(p.file, text, 'utf8');
  return notes;
}

/* ---------------------------------------------------------------------------------------------- */
/* uncovered upstream changes, game changelog, drift, coverage                                     */

interface Uncovered { repo: string; baseline: string; head: string; total: number; files: { path: string; status: string; added: number; deleted: number }[]; missingBaseline?: boolean }

function planUncovered(pages: Page[], repos: Map<string, Repo>): Uncovered[] {
  const citedAll = new Map<string, Set<string>>();
  for (const p of pages) for (const [r, set] of p.cited) {
    if (!citedAll.has(r)) citedAll.set(r, new Set());
    for (const x of set) citedAll.get(r)!.add(x);
  }
  const out: Uncovered[] = [];
  for (const repo of repos.values()) {
    if (repo.isGame || !repo.head) continue;
    const baseline = readBaseline(join(CATALOG, `${slugOf(repo.name)}.yml`));
    if (!baseline || baseline === repo.head) continue;
    const files = changedFiles(repo, baseline);
    if (!files) {
      out.push({ repo: repo.name, baseline, head: repo.head, total: 0, files: [], missingBaseline: true });
      continue;
    }
    const cited = citedAll.get(repo.name) ?? new Set();
    const list = [...files].filter(([path]) => !cited.has(path)).map(([path, c]) => ({ path, status: c.status, added: c.added, deleted: c.deleted }));
    list.sort((a, b) => b.added + b.deleted - (a.added + a.deleted));
    out.push({ repo: repo.name, baseline, head: repo.head, total: list.length, files: list });
  }
  return out;
}

interface GameChanges { baseline: string | null; head: string | null; builds: { ref: string; build: string; lines: string[] }[]; missingBaseline?: boolean }

function planGame(repos: Map<string, Repo>, pages: Page[]): GameChanges {
  const g = repos.get(GAME_NAME);
  let baseline = readBaseline(GAME_BASELINE);
  if (!baseline) {
    const pins = new Set(pages.map((p) => p.pins.get(GAME_NAME)).filter(Boolean) as string[]);
    baseline = pins.size === 1 ? [...pins][0]! : null;
  }
  const res: GameChanges = { baseline, head: g?.head ?? null, builds: [] };
  if (!g?.head || !baseline || baseline === g.head) return res;
  if (tryGit(g.dir, ['cat-file', '-e', `${baseline}^{commit}`]) === null) {
    res.missingBaseline = true;
    return res;
  }
  const commits = git(g.dir, ['log', '--format=%H', `${baseline}..${g.head}`, '--', 'current/version.json']).split('\n').filter(Boolean).reverse();
  for (const c of commits) {
    const text = tryGit(g.dir, ['show', `${c}:current/version.json`]);
    if (!text) continue;
    try {
      const v = JSON.parse(text) as { build?: string; commits?: { lines?: string[] }[] };
      res.builds.push({ ref: c, build: v.build ?? '?', lines: (v.commits ?? []).flatMap((x) => x.lines ?? []) });
    } catch {
      /* ignore malformed version.json */
    }
  }
  return res;
}

interface Drift { notInData: string[]; noCheckout: string[]; dataLagsCheckout: string[]; noBundle: string[]; noCatalog: string[]; bundleWithoutRepo: string[]; noGameBaseline: string[] }

function planDrift(records: RepoRecord[], repos: Map<string, Repo>): Drift {
  const dataNames = new Set(records.map((r) => r.name));
  const folders = existsSync(REFERENCES) ? readdirSync(REFERENCES).filter((n) => !n.startsWith('.') && statSync(join(REFERENCES, n)).isDirectory()) : [];
  const modsDir = join(CONTENT, 'mods');
  const bundles = existsSync(modsDir) ? readdirSync(modsDir).filter((n) => existsSync(join(modsDir, n, 'overview.md'))) : [];
  const slugs = new Set(records.map((r) => slugOf(r.name)));
  return {
    notInData: folders.filter((f) => !dataNames.has(f)),
    noCheckout: records.filter((r) => !existsSync(join(REFERENCES, r.name))).map((r) => r.name),
    dataLagsCheckout: records.filter((r) => {
      const h = repos.get(r.name)?.head;
      return h && h !== r.ref;
    }).map((r) => `${r.name} (data ${r.ref.slice(0, 12)}, checkout ${repos.get(r.name)!.head!.slice(0, 12)})`),
    noBundle: records.filter((r) => !bundles.includes(slugOf(r.name))).map((r) => r.name),
    noCatalog: records.filter((r) => !existsSync(join(CATALOG, `${slugOf(r.name)}.yml`))).map((r) => r.name),
    bundleWithoutRepo: bundles.filter((b) => !slugs.has(b)),
    noGameBaseline: existsSync(GAME_BASELINE) ? [] : [relative(ROOT, GAME_BASELINE)],
  };
}

function planCoverage(pages: Page[]): string[] {
  const cited = new Set(pages.flatMap((p) => p.demonstratedBy));
  return pages.filter((p) => p.type === 'Mod Feature').map((p) => p.rel.replace(/\.md$/, '')).filter((id) => !cited.has(id));
}

/* ---------------------------------------------------------------------------------------------- */
/* ack                                                                                            */

function applyAck(list: string, repos: Map<string, Repo>, plans: PagePlan[]): string[] {
  const names = list === 'all' ? [...repos.keys()] : list.split(',').map((s) => s.trim()).filter(Boolean);
  const done: string[] = [];
  for (const raw of names) {
    const name = raw === 'game' ? GAME_NAME : raw;
    const repo = repos.get(name);
    if (!repo?.head) {
      process.stderr.write(`ack: unknown repo or no checkout: ${raw}\n`);
      continue;
    }
    const pending = plans.filter((p) => p.review.some((r) => r.repo === name)).length;
    if (pending) process.stderr.write(`ack: note, ${name} still has ${pending} page(s) in REVIEW (ack only covers uncited changes)\n`);
    if (repo.isGame) {
      const build = gameBuildAt(repo.dir, repo.head) ?? '';
      writeFileSync(GAME_BASELINE, `# Game build whose changelog has been triaged for new how-to topics or lifecycle-reference edits.\n# Maintained by scripts/content_refresh_plan.ts --ack game; do not edit by hand.\nref: ${repo.head}\nbuild: ${build}\n`, 'utf8');
    } else {
      const file = join(CATALOG, `${slugOf(name)}.yml`);
      if (!existsSync(file)) {
        process.stderr.write(`ack: no ${relative(ROOT, file)} (new mod: write its bundle and catalog first)\n`);
        continue;
      }
      const text = readFileSync(file, 'utf8');
      writeFileSync(file, /^ref:/m.test(text) ? text.replace(/^ref:.*$/m, `ref: ${repo.head}`) : `ref: ${repo.head}\n${text}`, 'utf8');
    }
    done.push(raw);
  }
  return done;
}

/* ---------------------------------------------------------------------------------------------- */
/* report                                                                                         */

function fmtRanges(t: Touched): string {
  if (t.reason === 'deleted') return 'file deleted';
  if (t.reason === 'unanchored') return `changed (+${t.added}/-${t.deleted}), page cites no line range`;
  return `cited ${t.ranges.map(([a, b]) => (a === b ? `L${a}` : `L${a}-L${b}`)).join(', ')} overlap changes`;
}

interface TriageItem { id: string; kind: 'hunk' | 'file' | 'deleted'; repo: string; dirRel: string; from: string; to: string; path: string; hunk: Hunk | null; preview: string[]; added: number; deleted: number; pages: string[] }

function buildTriage(plans: PagePlan[], repos: Map<string, Repo>): TriageItem[] {
  const items = new Map<string, TriageItem>();
  for (const p of plans) for (const v of p.review) for (const t of v.touched) for (const id of t.ids) {
    let it = items.get(id);
    if (!it) {
      const repo = repos.get(v.repo)!;
      const fd = changedFiles(repo, v.from)?.get(t.path);
      const hunks = fd && !fd.status.startsWith('D') ? hunksFor(repo, v.from, t.path, fd) : [];
      const hunk = hunks.find((h) => h.id === id) ?? null;
      const preview = hunk ? [] : hunks.filter((h) => !h.noise).flatMap((h) => [`@@ -${h.oldStart},${h.oldCount} +${h.newStart},${h.newCount}`, ...h.minus.map((l) => `-${l}`), ...h.plus.map((l) => `+${l}`)]);
      it = { id, kind: hunk ? 'hunk' : t.reason === 'deleted' ? 'deleted' : 'file', repo: v.repo, dirRel: relative(ROOT, repo.dir).startsWith('../..') ? repo.dir : relative(ROOT, repo.dir) || repo.dir, from: v.from, to: v.to, path: t.path, hunk, preview, added: t.added, deleted: t.deleted, pages: [] };
      items.set(id, it);
    }
    if (!it.pages.includes(p.page)) it.pages.push(p.page);
  }
  return [...items.values()].sort((a, b) => b.pages.length - a.pages.length || a.path.localeCompare(b.path));
}

function report(plans: PagePlan[], triage: TriageItem[], dependents: string[], uncovered: Uncovered[], game: GameChanges, drift: Drift, coverage: string[] | null): string {
  const out: string[] = [];
  const count = (s: PageStatus): number => plans.filter((p) => p.status === s).length;
  out.push('# Content refresh plan', '', `Generated ${new Date().toISOString()} by \`scripts/content_refresh_plan.ts\`.`, '');
  out.push('| Status | Pages | Action |', '|---|---|---|');
  out.push(`| current | ${count('current')} | none |`);
  out.push(`| repin | ${count('repin')} | mechanical: \`node scripts/content_refresh_plan.ts --repin\` |`);
  out.push(`| review | ${count('review')} | re-check only the listed ranges (ai/briefs/REFRESH_BRIEF.md), then \`--accept\` |`);
  out.push(`| unknown | ${count('unknown')} | pinned commit missing locally: fetch full history, rerun |`, '');

  out.push('## Inventory drift', '');
  const labels: [keyof Drift, string][] = [
    ['notInData', 'Checkouts without a data/references.yml entry (run `references_check_refs.ts`)'],
    ['noCheckout', 'Entries without a checkout (run `references_pull.ts`)'],
    ['dataLagsCheckout', 'Recorded refs behind the checkout (run `references_check_refs.ts --update`)'],
    ['noBundle', 'NEW MOD, no content/mods bundle (run MOD_BUNDLE_BRIEF then REVIEW_BRIEF)'],
    ['noCatalog', 'No ai/catalog/<slug>.yml'],
    ['bundleWithoutRepo', 'Bundles without a data/references.yml entry (repo removed? deprecate the bundle)'],
    ['noGameBaseline', 'Missing game triage baseline (run `--ack game` once the current build is triaged)'],
  ];
  const driftLines = labels.filter(([k]) => drift[k].length).map(([k, label]) => `- ${label}: ${drift[k].join(', ')}`);
  out.push(...(driftLines.length ? driftLines : ['- none']), '');

  out.push('## Review work, grouped by change', '');
  if (!triage.length) out.push('- none', '');
  else {
    out.push(
      'Triage each change once, not each page. If a change cannot alter anything the listed pages claim (logging, profiling, an unrelated branch, comments, a version string), mark it benign with `--benign <id>[,<id>...]`; those pages then move with `--repin`. Otherwise review each listed page per ai/briefs/REFRESH_BRIEF.md and finish it with `--accept`.',
      '',
    );
  }
  for (const t of triage) {
    const where = t.hunk ? ` old L${t.hunk.oldStart}${t.hunk.oldCount > 1 ? `-L${t.hunk.oldStart + t.hunk.oldCount - 1}` : ''}` : '';
    const what = t.kind === 'deleted' ? 'file deleted' : t.kind === 'file' ? `file changed +${t.added}/-${t.deleted}, cited without line ranges` : `hunk -${t.hunk!.oldCount}/+${t.hunk!.newCount}`;
    out.push(`### \`${t.id}\` ${t.repo}: \`${t.path}\`${where} (${what}; ${t.pages.length} page${t.pages.length === 1 ? '' : 's'})`, '');
    const lines = t.hunk ? [...t.hunk.minus.map((l) => `-${l}`), ...t.hunk.plus.map((l) => `+${l}`)] : t.preview;
    if (lines.length) {
      out.push('```diff', ...lines.slice(0, HUNK_LINES), ...(lines.length > HUNK_LINES ? [`... ${lines.length - HUNK_LINES} more lines`] : []), '```');
    }
    if (t.kind !== 'hunk') out.push(`Diff: \`git -C ${t.dirRel} diff ${t.from.slice(0, 12)} ${t.to.slice(0, 12)} -- '${t.path}'\``);
    out.push('');
    for (const pg of t.pages.slice(0, 15)) out.push(`- \`content/${pg}\``);
    if (t.pages.length > 15) out.push(`- ... and ${t.pages.length - 15} more (see --json)`);
    out.push('');
  }

  out.push('## How-to pages depending on reviewed features', '', 'Re-read after their features are updated (they cite them in `demonstrated_by`).', '');
  out.push(...(dependents.length ? dependents : ['- none']), '');

  out.push('## Untriaged upstream changes not cited by any page', '');
  out.push('Changed since the triage baseline (`ref:` in ai/catalog/<slug>.yml). Decide whether any is a new reusable feature, then `--ack <repo>`.', '');
  if (!uncovered.length) out.push('- none', '');
  for (const u of uncovered) {
    if (u.missingBaseline) {
      out.push(`### ${u.repo}: baseline ${u.baseline.slice(0, 12)} not in the local clone (fetch full history)`, '');
      continue;
    }
    out.push(`### ${u.repo} (${u.baseline.slice(0, 12)}..${u.head.slice(0, 12)}, ${u.total} uncited path${u.total === 1 ? '' : 's'})`, '');
    if (!u.total) out.push('- only cited files changed; nothing new to triage (still `--ack` it)');
    for (const f of u.files.slice(0, LIST_CAP)) out.push(`- \`${f.path}\` ${f.status} +${f.added}/-${f.deleted}`);
    if (u.total > LIST_CAP) out.push(`- ... and ${u.total - LIST_CAP} more (see --json)`);
    out.push('');
  }

  out.push('## Game builds since the game baseline', '');
  if (game.missingBaseline) out.push(`- baseline ${game.baseline?.slice(0, 12)} not in the assemblies clone (fetch full history)`, '');
  else if (!game.builds.length) out.push('- none', '');
  else {
    out.push('Read for engine changes that warrant new or updated how-to topics or lifecycle-reference edits, then `--ack game`.', '');
    for (const b of game.builds) {
      out.push(`### ${b.build} (${b.ref.slice(0, 12)})`, '');
      for (const l of b.lines) out.push(`- ${l}`);
      out.push('');
    }
  }

  if (coverage) {
    out.push('## Feature pages no how-to cites', '', `${coverage.length} feature pages are in no \`demonstrated_by\`.`, '');
    for (const c of coverage) out.push(`- ${c}`);
    out.push('');
  }
  return out.join('\n');
}

/* ---------------------------------------------------------------------------------------------- */

function main(): number {
  let args;
  try {
    args = parseArgs({
      options: {
        out: { type: 'string' }, json: { type: 'string' }, check: { type: 'boolean' }, coverage: { type: 'boolean' },
        repin: { type: 'boolean' }, accept: { type: 'string' }, ack: { type: 'string' }, benign: { type: 'string' }, help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n`);
    return 2;
  }
  if (args.values.help) {
    const src = readFileSync(new URL(import.meta.url), 'utf8');
    process.stdout.write(`${/\/\*\*([\s\S]*?)\*\//.exec(src)![1]!.replace(/^ \* ?/gm, '')}\n`);
    return 0;
  }
  if (!existsSync(GAME_DIR)) process.stderr.write(`note: game assemblies checkout not found at ${GAME_DIR} (set KSA_GAME_ASSEMBLIES); game pins are not checked\n`);

  const { repos, byWeb, records } = loadRepos();
  let pages = loadPages(byWeb);
  let benign = loadBenign();
  let plans = pages.map((p) => classify(p, repos, benign));
  const pageOf = (rel: string): Page | undefined => pages.find((p) => p.rel === rel);

  if (args.values.benign) {
    const known = new Map(buildTriage(plans, repos).map((t) => [t.id, `${t.repo}:${t.path}`]));
    const ids = args.values.benign.split(',').map((x) => x.trim()).filter(Boolean);
    for (const id of ids) if (!known.has(id)) process.stderr.write(`benign: ${id} is not a current review change (typo, or already resolved)\n`);
    addBenign(ids.filter((id) => known.has(id)), known);
    benign = loadBenign();
    plans = pages.map((p) => classify(p, repos, benign));
    process.stderr.write(`benign: recorded ${ids.filter((id) => known.has(id)).length} change(s) in ${relative(ROOT, TRIAGE_FILE)}\n`);
  }
  if (args.values.repin) {
    let n = 0;
    for (const plan of plans) {
      if (!plan.repin.length) continue;
      const page = pageOf(plan.page)!;
      rewritePage(page, plan.repin.map((v) => ({ repo: repos.get(v.repo)!, from: v.from, to: v.to })), repos);
      n++;
    }
    process.stderr.write(`repin: moved pins in ${n} file(s); run content_check_refs.ts, then add one log.md **Update** line per touched bundle\n`);
  }
  if (args.values.accept) {
    for (const raw of args.values.accept.split(',').map((s) => s.trim()).filter(Boolean)) {
      const rel = relative(CONTENT, resolve(ROOT, raw)).split('\\').join('/');
      const page = pageOf(rel);
      const plan = plans.find((p) => p.page === rel);
      if (!page || !plan) {
        process.stderr.write(`accept: not a concept under content/: ${raw}\n`);
        continue;
      }
      const verdicts = [...plan.review, ...plan.repin];
      if (!verdicts.length) {
        process.stderr.write(`accept: ${raw} is already current\n`);
        continue;
      }
      rewritePage(page, verdicts.map((v) => ({ repo: repos.get(v.repo)!, from: v.from, to: v.to })), repos);
      process.stdout.write(`accepted content/${rel}: pins moved to HEAD, anchors remapped. Verify by hand against HEAD:\n`);
      for (const v of plan.review) for (const t of v.touched) {
        const fd = changedFiles(repos.get(v.repo)!, v.from)!.get(t.path)!;
        const hunks = t.reason === 'deleted' ? [] : hunksFor(repos.get(v.repo)!, v.from, t.path, fd);
        const mapped = t.ranges.map(([a, b]) => `L${a}-L${b} -> ~L${mapLine(hunks, a)}-L${mapLine(hunks, b)}`).join(', ');
        process.stdout.write(`  ${v.repo}:${t.path}: ${fmtRanges(t)}${mapped ? ` (${mapped})` : ''}\n`);
        process.stdout.write(`    diff: git -C ${repos.get(v.repo)!.dir} diff ${v.from.slice(0, 12)} ${v.to.slice(0, 12)} -- '${t.path}'\n`);
      }
    }
  }
  if (args.values.repin || args.values.accept) {
    fileListCache.clear();
    pages = loadPages(byWeb);
    plans = pages.map((p) => classify(p, repos, benign));
  }
  if (args.values.ack) {
    const done = applyAck(args.values.ack, repos, plans);
    process.stderr.write(`ack: triage baseline moved to HEAD for ${done.join(', ') || 'nothing'}\n`);
  }

  const uncovered = planUncovered(pages, repos);
  const game = planGame(repos, pages);
  const drift = planDrift(records, repos);
  const coverage = args.values.coverage ? planCoverage(pages) : null;
  const reviewIds = new Set(plans.filter((p) => p.status === 'review').map((p) => p.page.replace(/\.md$/, '')));
  const dependents = pages
    .filter((p) => p.rel.startsWith('howto/') && !reviewIds.has(p.rel.replace(/\.md$/, '')) && p.demonstratedBy.some((id) => reviewIds.has(id)))
    .map((p) => `- \`content/${p.rel}\` cites ${p.demonstratedBy.filter((id) => reviewIds.has(id)).join(', ')}`);

  const quiet = (args.values.repin || args.values.accept || args.values.ack || args.values.benign) && !args.values.out && !args.values.json;
  const md = report(plans, buildTriage(plans, repos), dependents, uncovered, game, drift, coverage);
  const writeOut = (file: string, text: string): void => {
    mkdirSync(dirname(resolve(file)), { recursive: true });
    writeFileSync(resolve(file), text, 'utf8');
  };
  if (args.values.out) writeOut(args.values.out, md);
  else if (!quiet) process.stdout.write(`${md}\n`);
  if (args.values.json) {
    writeOut(args.values.json, JSON.stringify({ pages: plans.filter((p) => p.status !== 'current'), triage: buildTriage(plans, repos).map((t) => ({ ...t, hunk: t.hunk ? { oldStart: t.hunk.oldStart, oldCount: t.hunk.oldCount, newStart: t.hunk.newStart, newCount: t.hunk.newCount } : null })), dependents, uncovered, game, drift, coverage }, null, 2));
  }
  const summary = (['current', 'repin', 'review', 'unknown'] as PageStatus[]).map((s) => `${plans.filter((p) => p.status === s).length} ${s}`).join(', ');
  const untriaged = uncovered.reduce((a, u) => a + u.total, 0);
  process.stderr.write(`${pages.length} concepts: ${summary}; ${untriaged} untriaged upstream path(s) in ${uncovered.length} repo(s); ${game.builds.length} untriaged game build(s)\n`);

  const actionNeeded = plans.some((p) => p.status !== 'current') || uncovered.length > 0 || game.builds.length > 0 || Object.values(drift).some((v) => v.length);
  return args.values.check && actionNeeded ? 1 : 0;
}

process.exit(main());
