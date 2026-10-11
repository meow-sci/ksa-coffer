#!/usr/bin/env node
/**
 * Bring the reference checkouts under references/ and the game assemblies checkout up to date with
 * their upstreams, as the first step of a corpus refresh.
 *
 *   node scripts/references_pull.ts [--dry-run] [--only NAME[,NAME...]] [--no-game]
 *
 * For every repo in data/references.yml (and the game assemblies checkout at KSA_GAME_ASSEMBLIES,
 * default ../ksa-game-assemblies):
 *   - missing checkout: `git clone <git> references/<name>` (full history)
 *   - shallow clone: `git fetch --unshallow` (old pins must stay reachable for diffs)
 *   - otherwise `git fetch`, then fast-forward the current branch to its upstream
 *     (`git merge --ff-only @{u}`). Dirty trees, detached HEADs and diverged branches are reported
 *     and left alone.
 * It never edits data/references.yml or content/; run `references_check_refs.ts --update` and
 * `content_refresh_plan.ts` next. Folders under references/ with no data entry are listed (new mods
 * cloned by hand: `references_check_refs.ts` adds them).
 *
 * Options:
 *   --dry-run   fetch and report incoming commits, but do not clone, unshallow or fast-forward
 *   --only      limit to these repo names (data/references.yml names; `ksa-game-assemblies` for the game)
 *   --no-game   skip the game assemblies checkout
 *
 * Exit codes: 0 every repo is at its upstream (or would be), 1 something needs manual attention,
 * 2 usage error. Runs on Node 24 with native type stripping; needs the `yaml` package.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const REFERENCES = join(ROOT, 'references');
const DATA_FILE = join(ROOT, 'data', 'references.yml');
const GAME_NAME = 'ksa-game-assemblies';
const GAME_DIR = resolve(process.env.KSA_GAME_ASSEMBLIES ?? join(ROOT, '..', GAME_NAME));

function git(dir: string | null, args: string[]): string {
  return execFileSync('git', dir ? ['-C', dir, ...args] : args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function tryGit(dir: string | null, args: string[]): string | null {
  try {
    return git(dir, args);
  } catch {
    return null;
  }
}

interface Result { name: string; state: string; detail: string; attention: boolean }

function pull(name: string, dir: string, gitUrl: string | null, dryRun: boolean): Result {
  if (!existsSync(dir)) {
    if (!gitUrl) return { name, state: 'missing', detail: `no checkout at ${dir}`, attention: true };
    if (dryRun) return { name, state: 'would clone', detail: gitUrl, attention: false };
    const r = tryGit(null, ['clone', '--quiet', gitUrl, dir]);
    return r === null ? { name, state: 'clone failed', detail: gitUrl, attention: true } : { name, state: 'cloned', detail: git(dir, ['rev-parse', '--short=12', 'HEAD']), attention: false };
  }
  const before = tryGit(dir, ['rev-parse', 'HEAD']);
  if (!before) return { name, state: 'not a git repo', detail: dir, attention: true };
  if (tryGit(dir, ['rev-parse', '--is-shallow-repository']) === 'true') {
    if (dryRun) return { name, state: 'shallow', detail: 'would unshallow (old pins may be unreachable)', attention: false };
    if (tryGit(dir, ['fetch', '--quiet', '--unshallow']) === null) return { name, state: 'unshallow failed', detail: '', attention: true };
  }
  if (tryGit(dir, ['fetch', '--quiet', '--prune']) === null) return { name, state: 'fetch failed', detail: tryGit(dir, ['remote', 'get-url', 'origin']) ?? '', attention: true };
  const upstream = tryGit(dir, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
  if (!upstream) return { name, state: 'no upstream', detail: 'detached HEAD or branch without upstream; left as is', attention: true };
  const incoming = Number(tryGit(dir, ['rev-list', '--count', `HEAD..${upstream}`]) ?? '0');
  const outgoing = Number(tryGit(dir, ['rev-list', '--count', `${upstream}..HEAD`]) ?? '0');
  if (incoming === 0) return { name, state: outgoing ? 'ahead' : 'up to date', detail: before.slice(0, 12), attention: outgoing > 0 };
  if (outgoing > 0) return { name, state: 'diverged', detail: `${incoming} incoming, ${outgoing} local commit(s); left as is`, attention: true };
  if ((tryGit(dir, ['status', '--porcelain']) ?? '').length) return { name, state: 'dirty', detail: `${incoming} incoming but the working tree has changes; left as is`, attention: true };
  if (dryRun) return { name, state: 'behind', detail: `${incoming} incoming commit(s) on ${upstream}`, attention: false };
  if (tryGit(dir, ['merge', '--ff-only', '--quiet', upstream]) === null) return { name, state: 'ff failed', detail: upstream, attention: true };
  return { name, state: 'updated', detail: `${before.slice(0, 12)} -> ${git(dir, ['rev-parse', '--short=12', 'HEAD'])} (${incoming} commit(s))`, attention: false };
}

function main(): number {
  let args;
  try {
    args = parseArgs({ options: { 'dry-run': { type: 'boolean' }, only: { type: 'string' }, 'no-game': { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } });
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n`);
    return 2;
  }
  if (args.values.help) {
    const src = readFileSync(new URL(import.meta.url), 'utf8');
    process.stdout.write(`${/\/\*\*([\s\S]*?)\*\//.exec(src)![1]!.replace(/^ \* ?/gm, '')}\n`);
    return 0;
  }
  const dryRun = Boolean(args.values['dry-run']);
  const only = args.values.only ? new Set(args.values.only.split(',').map((s) => s.trim())) : null;
  const data = parseYaml(readFileSync(DATA_FILE, 'utf8')) as { repos: { name: string; git: string }[] };
  const results: Result[] = [];
  for (const r of data.repos) {
    if (only && !only.has(r.name)) continue;
    results.push(pull(r.name, join(REFERENCES, r.name), r.git, dryRun));
  }
  if (!args.values['no-game'] && (!only || only.has(GAME_NAME))) results.push(pull(GAME_NAME, GAME_DIR, null, dryRun));

  const known = new Set(data.repos.map((r) => r.name));
  const extra = existsSync(REFERENCES) ? readdirSync(REFERENCES).filter((n) => !n.startsWith('.') && statSync(join(REFERENCES, n)).isDirectory() && !known.has(n)) : [];

  const width = Math.max(...results.map((r) => r.name.length), 4);
  for (const r of results) process.stdout.write(`${r.attention ? '!' : ' '} ${r.name.padEnd(width)}  ${r.state.padEnd(12)}  ${r.detail}\n`);
  if (extra.length) process.stdout.write(`\nCheckouts with no data/references.yml entry (new mods; run references_check_refs.ts to record them): ${extra.join(', ')}\n`);
  const changed = results.filter((r) => ['updated', 'cloned'].includes(r.state)).length;
  process.stdout.write(`\n${results.length} repo(s): ${changed} updated or cloned, ${results.filter((r) => r.attention).length} need attention.${dryRun ? ' (dry run)' : ''}\n`);
  if (!dryRun) process.stdout.write('Next: node scripts/references_check_refs.ts --update && node scripts/content_refresh_plan.ts --out ai/refresh/plan.md\n');
  return results.some((r) => r.attention) ? 1 : 0;
}

process.exit(main());
