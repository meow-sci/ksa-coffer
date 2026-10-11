#!/usr/bin/env node
/**
 * Check the code references inside the OKF content bundle against the pinned reference checkouts.
 *
 *   node scripts/content_check_refs.ts [path ...] [--stale] [--quiet]
 *
 * Paths are files or directories under content/ (default: content/). For every concept (.md with
 * frontmatter, excluding index.md and log.md) the script checks:
 *
 * - `repos[]`: each entry names a folder recorded in data/references.yml, its `git` matches that
 *   record (ssh/https/.git/trailing-slash differences ignored) and its `ref` equals the recorded
 *   commit. A differing ref is reported as STALE: the bundle was written against an older checkout
 *   and should be re-analyzed.
 * - `game`: `build`, `git` and `ref` are present; when the game assemblies checkout is reachable
 *   (KSA_GAME_ASSEMBLIES env var, default ../ksa-game-assemblies) they are compared with its HEAD and
 *   current/version.json, and a difference is reported as STALE.
 * - `sources[]` entries that carry `repo` + `path`: the file exists in the checkout, the repo is pinned
 *   in `repos[]` (or is the game), and `resource` equals <web>/blob/<ref>/<path>.
 * - Markdown links to GitHub blob URLs of a known repo: the ref matches the pin, the path exists in the
 *   checkout, and the link text is the repo-relative path (convention; a warning otherwise).
 *
 * Exit codes: 0 no errors, 1 errors found, 2 usage error. --stale prints only stale pins (exit 0/1 on
 * errors as usual). Runs on Node 24 with native type stripping; needs the `yaml` package.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const REFERENCES_DIR = join(ROOT, 'references');
const DATA_FILE = join(ROOT, 'data', 'references.yml');
const GAME_NAME = 'ksa-game-assemblies';
const GAME_DIR = resolve(process.env.KSA_GAME_ASSEMBLIES ?? join(ROOT, '..', GAME_NAME));
const RESERVED = new Set(['index.md', 'log.md']);

type Severity = 'error' | 'warning' | 'stale' | 'info';
interface Finding { severity: Severity; file: string; message: string }
interface RepoRecord { name: string; git: string; ref: string; license: string }

const USAGE = `Usage: node scripts/content_check_refs.ts [path ...] [--stale] [--quiet]

Checks repos/game pins, sources[] paths and GitHub blob links in the content bundle against the
checkouts under references/ and the game assemblies checkout.

Options:
  --stale     Print only stale pins (repos[].ref or game.ref differing from the checkouts).
  --quiet     Print only errors and the summary.
  -h, --help  Show this help.`;

/* ---------------------------------------------------------------------------------------------- */

function normalizeGitUrl(url: string): string {
  let u = url.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.*)$/i.exec(u);
  const scpLike = /^(?:[^@/]+@)?([^/:]+):(?!\/\/)(.*)$/.exec(u);
  if (withScheme) u = `${withScheme[1]}/${withScheme[2]}`;
  else if (scpLike) u = `${scpLike[1]}/${scpLike[2]}`;
  return u.replace(/\/+$/, '').replace(/\.git$/i, '').replace(/\/+$/, '').toLowerCase();
}

/** Browsable https base for a git remote, preserving the case of owner and repository. */
function webUrl(git: string): string {
  let u = git.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.*)$/i.exec(u);
  const scpLike = /^(?:[^@/]+@)?([^/:]+):(?!\/\/)(.*)$/.exec(u);
  if (withScheme) u = `${withScheme[1]}/${withScheme[2]}`;
  else if (scpLike) u = `${scpLike[1]}/${scpLike[2]}`;
  return `https://${u.replace(/\/+$/, '').replace(/\.git$/i, '').replace(/\/+$/, '')}`;
}

const HASH_RE = /^[0-9a-f]{40}([0-9a-f]{24})?$/;

function tryGit(dir: string, args: string[]): string | undefined {
  try {
    return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

function splitFrontmatter(text: string): { fm: string | null; body: string } {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { fm: null, body: text };
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') return { fm: lines.slice(1, i).join('\n'), body: lines.slice(i + 1).join('\n') };
  }
  return { fm: null, body: text };
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.md') && !RESERVED.has(entry.name)) yield full;
  }
}

function stripFences(body: string): string {
  return body.replace(/^(```|~~~)[\s\S]*?^\1[ \t]*$/gm, '');
}

/* ---------------------------------------------------------------------------------------------- */

interface Known { name: string; web: string; ref: string; dir: string; git: string }

function loadKnownRepos(): Map<string, Known> {
  const data = parseYaml(readFileSync(DATA_FILE, 'utf8')) as { repos: RepoRecord[] };
  const map = new Map<string, Known>();
  for (const r of data.repos) {
    map.set(r.name, { name: r.name, web: webUrl(r.git), ref: r.ref, dir: join(REFERENCES_DIR, r.name), git: r.git });
  }
  return map;
}

function loadGame(): Known & { build?: string; reachable: boolean } {
  const reachable = existsSync(GAME_DIR);
  const git = reachable ? (tryGit(GAME_DIR, ['remote', 'get-url', 'origin']) ?? '') : '';
  const ref = reachable ? (tryGit(GAME_DIR, ['rev-parse', 'HEAD']) ?? '') : '';
  let build: string | undefined;
  const versionFile = join(GAME_DIR, 'current', 'version.json');
  if (existsSync(versionFile)) {
    try {
      build = (JSON.parse(readFileSync(versionFile, 'utf8')) as { build?: string }).build;
    } catch {
      /* ignore */
    }
  }
  return { name: GAME_NAME, web: git ? webUrl(git) : '', ref, dir: GAME_DIR, git, build, reachable };
}

/* ---------------------------------------------------------------------------------------------- */

const LINK_RE = /(?<!!)\[([^\]]*)\]\((https?:\/\/github\.com\/([^/\s)]+)\/([^/\s)]+)\/blob\/([0-9a-f]{7,64})\/([^)\s#]+)(?:#[^)\s]*)?)\)/g;

function checkFile(file: string, known: Map<string, Known>, game: ReturnType<typeof loadGame>, out: Finding[]): void {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, 'utf8');
  const { fm, body } = splitFrontmatter(text);
  if (fm === null) {
    out.push({ severity: 'error', file: rel, message: 'missing frontmatter' });
    return;
  }
  let data: Record<string, unknown>;
  try {
    data = (parseYaml(fm) ?? {}) as Record<string, unknown>;
  } catch (e) {
    out.push({ severity: 'error', file: rel, message: `frontmatter YAML: ${(e as Error).message.split('\n')[0]}` });
    return;
  }

  // repos[]
  const pinned = new Map<string, string>(); // name -> ref pinned in this file
  const repos = data.repos;
  if (repos !== undefined) {
    if (!Array.isArray(repos)) out.push({ severity: 'error', file: rel, message: '`repos` must be a list' });
    else {
      for (const [i, entry] of repos.entries()) {
        const raw = entry as Partial<Record<keyof RepoRecord, unknown>>;
        if (!raw || typeof raw !== 'object' || !raw.name || !raw.git || raw.ref === undefined || raw.ref === null) {
          out.push({ severity: 'error', file: rel, message: `repos[${i}] needs name, git and ref` });
          continue;
        }
        const r = { name: String(raw.name), git: String(raw.git), ref: String(raw.ref) };
        if (!HASH_RE.test(r.ref)) out.push({ severity: 'error', file: rel, message: `repos[${i}].ref '${r.ref}' is not a full commit hash (quote it in YAML)` });
        const k = known.get(r.name);
        if (!k) {
          out.push({ severity: 'error', file: rel, message: `repos[${i}].name '${r.name}' is not in data/references.yml` });
          continue;
        }
        if (normalizeGitUrl(r.git) !== normalizeGitUrl(k.git)) out.push({ severity: 'error', file: rel, message: `repos[${i}].git '${r.git}' differs from data/references.yml ('${k.git}')` });
        if (r.ref !== k.ref) out.push({ severity: 'stale', file: rel, message: `repos[${i}] '${r.name}' pinned at ${r.ref} but checkout is ${k.ref}` });
        pinned.set(r.name, r.ref);
      }
    }
  }

  // game
  const gRaw = data.game as Partial<Record<'build' | 'git' | 'ref', unknown>> | undefined;
  if (gRaw !== undefined) {
    if (!gRaw || typeof gRaw !== 'object' || !gRaw.build || !gRaw.git || gRaw.ref === undefined || gRaw.ref === null) out.push({ severity: 'error', file: rel, message: '`game` needs build, git and ref' });
    else {
      const g = { build: String(gRaw.build), git: String(gRaw.git), ref: String(gRaw.ref) };
      if (!HASH_RE.test(g.ref)) out.push({ severity: 'error', file: rel, message: `game.ref '${g.ref}' is not a full commit hash (quote it in YAML)` });
      if (game.reachable) {
        if (game.git && normalizeGitUrl(g.git) !== normalizeGitUrl(game.git)) out.push({ severity: 'error', file: rel, message: `game.git '${g.git}' differs from the assemblies checkout ('${game.git}')` });
        if (game.ref && g.ref !== game.ref) out.push({ severity: 'stale', file: rel, message: `game pinned at ${g.ref} (build ${g.build}) but checkout is ${game.ref}${game.build ? ` (build ${game.build})` : ''}` });
        else if (game.build && g.build !== game.build) out.push({ severity: 'stale', file: rel, message: `game.build '${g.build}' differs from checkout build '${game.build}'` });
      }
      pinned.set(GAME_NAME, String(g.ref));
    }
  }

  const resolveRepo = (name: string): { k: Known; ref: string | undefined } | undefined => {
    if (name === GAME_NAME) return { k: game, ref: pinned.get(GAME_NAME) };
    const k = known.get(name);
    return k ? { k, ref: pinned.get(name) } : undefined;
  };

  // sources[]
  const sources = data.sources;
  if (Array.isArray(sources)) {
    for (const [i, entry] of sources.entries()) {
      const s = entry as Partial<{ id: string; repo: string; path: string; resource: string }>;
      if (!s || typeof s !== 'object') continue;
      if (!s.repo && !s.path) continue;
      if (!s.repo || !s.path) {
        out.push({ severity: 'error', file: rel, message: `sources[${i}] has only one of repo/path` });
        continue;
      }
      const r = resolveRepo(s.repo);
      if (!r) {
        out.push({ severity: 'error', file: rel, message: `sources[${i}].repo '${s.repo}' is not a known repo` });
        continue;
      }
      if (!r.ref) out.push({ severity: 'error', file: rel, message: `sources[${i}] cites repo '${s.repo}' which is not pinned in repos[]/game` });
      const full = join(r.k.dir, s.path);
      if (s.repo === GAME_NAME && !game.reachable) out.push({ severity: 'info', file: rel, message: `sources[${i}] path not checked (game assemblies checkout not found at ${GAME_DIR})` });
      else if (!existsSync(full)) out.push({ severity: 'error', file: rel, message: `sources[${i}].path '${s.repo}:${s.path}' does not exist in the checkout` });
      if (r.ref && r.k.web) {
        const expected = `${r.k.web}/blob/${r.ref}/${s.path}`;
        if (String(s.resource ?? '').toLowerCase() !== expected.toLowerCase()) out.push({ severity: 'error', file: rel, message: `sources[${i}].resource should be ${expected}` });
      }
    }
  }

  // body links to github blobs
  const byWeb = new Map<string, Known>();
  for (const k of known.values()) byWeb.set(k.web.toLowerCase(), k);
  if (game.web) byWeb.set(game.web.toLowerCase(), game);
  const prose = stripFences(body);
  for (const m of prose.matchAll(LINK_RE)) {
    const [, textLabel, , owner, repoName, ref, path] = m;
    const web = `https://github.com/${owner}/${repoName}`.toLowerCase();
    const k = byWeb.get(web);
    if (!k) {
      out.push({ severity: 'info', file: rel, message: `link to unknown repo ${owner}/${repoName} not checked` });
      continue;
    }
    const pin = pinned.get(k.name);
    if (!pin) out.push({ severity: 'error', file: rel, message: `link cites ${k.name} which is not pinned in repos[]/game: ${path}` });
    else if (pin !== ref) out.push({ severity: 'error', file: rel, message: `link ref ${ref.slice(0, 12)} differs from the pinned ${pin.slice(0, 12)} for ${k.name}: ${path}` });
    const decodedPath = decodeURIComponent(path!);
    if (k.name === GAME_NAME && !game.reachable) {
      /* cannot check */
    } else if (!existsSync(join(k.dir, decodedPath))) {
      out.push({ severity: 'error', file: rel, message: `link path '${k.name}:${decodedPath}' does not exist in the checkout` });
    }
    if (textLabel !== decodedPath && textLabel !== `\`${decodedPath}\``) {
      out.push({ severity: 'warning', file: rel, message: `link text '${textLabel}' should be the repo-relative path '${decodedPath}'` });
    }
  }
}

/* ---------------------------------------------------------------------------------------------- */

function main(): number {
  let args;
  try {
    args = parseArgs({ options: { stale: { type: 'boolean' }, quiet: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } }, allowPositionals: true });
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n${USAGE}\n`);
    return 2;
  }
  if (args.values.help) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  const targets = args.positionals.length > 0 ? args.positionals.map((p) => resolve(p)) : [CONTENT_DIR];
  const files: string[] = [];
  for (const t of targets) {
    if (!existsSync(t)) {
      process.stderr.write(`error: ${t} does not exist\n`);
      return 2;
    }
    if (statSync(t).isDirectory()) files.push(...walk(t));
    else files.push(t);
  }
  const known = loadKnownRepos();
  const game = loadGame();
  if (!game.reachable) process.stderr.write(`note: game assemblies checkout not found at ${GAME_DIR}; game pins and paths are not checked\n`);

  const findings: Finding[] = [];
  for (const f of files) checkFile(f, known, game, findings);

  const counts = { error: 0, warning: 0, stale: 0, info: 0 };
  for (const f of findings) counts[f.severity]++;
  const shown = findings.filter((f) => (args.values.stale ? f.severity === 'stale' : args.values.quiet ? f.severity === 'error' : true));
  let last = '';
  for (const f of shown.sort((a, b) => a.file.localeCompare(b.file))) {
    if (f.file !== last) {
      process.stdout.write(`${f.file}\n`);
      last = f.file;
    }
    process.stdout.write(`  ${f.severity.padEnd(7)} ${f.message}\n`);
  }
  process.stdout.write(`${files.length} concepts, ${counts.error} errors, ${counts.warning} warnings, ${counts.stale} stale, ${counts.info} info\n`);
  return counts.error > 0 ? 1 : 0;
}

process.exit(main());
