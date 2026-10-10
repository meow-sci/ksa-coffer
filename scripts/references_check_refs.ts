#!/usr/bin/env node
/**
 * Check the git checkouts under references/ against data/references.yml.
 *
 *   node scripts/references_check_refs.ts [--update]
 *
 * - Every folder under references/ must be the root of a git repository.
 * - Folders missing from data/references.yml have their name, remote URI,
 *   HEAD commit and license derived and are merged into the data file.
 * - For folders already recorded, any difference between the recorded data and
 *   the checkout is reported on stderr and the process exits non-zero once all
 *   folders have been processed.
 * - With --update, an out-of-date `ref` is rewritten to the checkout's HEAD
 *   when it is the only difference for that folder.
 * - attribution.yml in the project root (name, web link and license of every
 *   recorded repo) is regenerated from the data file whenever it is stale.
 * - attribution/ holds a copy of every license file at the root of each
 *   recorded repo, named LICENSE.<folder name>.txt, or LICENSE.<folder name>-1.txt,
 *   -2.txt, ... when a repo has several. Copies are refreshed when the
 *   checkout's files change and removed when they are no longer needed.
 *
 * Runs on Node 24 with native type stripping and uses only built-in modules,
 * so it carries its own minimal YAML reader/writer and JSON Schema validator.
 *
 * Exit codes: 0 everything matches (after additions/updates), 1 mismatches or
 * problems were found, 2 usage error or unreadable/invalid input files.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs, styleText } from 'node:util';

const ROOT = resolve(import.meta.dirname, '..');
const REFERENCES_DIR = join(ROOT, 'references');
const DATA_FILE = join(ROOT, 'data', 'references.yml');
const SCHEMA_FILE = join(ROOT, 'data', 'references.schema.json');
const ATTRIBUTION_FILE = join(ROOT, 'attribution.yml');
const ATTRIBUTION_DIR = join(ROOT, 'attribution');

const REL_REFERENCES = 'references/';
const REL_DATA = 'data/references.yml';
const REL_SCHEMA = 'data/references.schema.json';
const REL_ATTRIBUTION = 'attribution.yml';
const REL_ATTRIBUTION_DIR = 'attribution/';

const USAGE = `Usage: node scripts/references_check_refs.ts [--update]

Checks every git checkout under ${REL_REFERENCES} against ${REL_DATA}.
Folders missing from the data file are derived and added automatically.
${REL_ATTRIBUTION} is regenerated from ${REL_DATA} whenever it is out of date, and
each repo's license files are copied to ${REL_ATTRIBUTION_DIR}LICENSE.<folder name>.txt
(LICENSE.<folder name>-1.txt, -2.txt, ... when a repo has several).

Options:
  --update    Record the checkout's current commit for repos whose only
              difference is an out-of-date ref.
  -h, --help  Show this help.

Exit codes: 0 all good, 1 mismatches/problems found, 2 usage or input error.`;

interface RepoEntry {
  name: string;
  git: string;
  ref: string;
  license: string;
}

interface ReferencesData {
  repos: RepoEntry[];
}

/* ------------------------------------------------------------------------ */
/* Output                                                                   */
/* ------------------------------------------------------------------------ */

type Style = Parameters<typeof styleText>[0];

const paint = (style: Style, text: string): string => styleText(style, text, { stream: process.stderr });
const say = (text = ''): void => {
  process.stderr.write(`${text}\n`);
};
const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
const short = (ref: string): string => ref.slice(0, 12);

/* ------------------------------------------------------------------------ */
/* Git helpers                                                              */
/* ------------------------------------------------------------------------ */

function git(dir: string, args: string[]): string {
  return execFileSync('git', ['-C', dir, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tryGit(dir: string, args: string[]): string | undefined {
  try {
    return git(dir, args);
  } catch {
    return undefined;
  }
}

/**
 * Reduce a git remote URI to a comparable form so that ssh/https variants,
 * a trailing ".git" or a trailing slash are not reported as differences.
 */
function normalizeGitUrl(url: string): string {
  let u = url.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.*)$/i.exec(u);
  const scpLike = /^(?:[^@/]+@)?([^/:]+):(?!\/\/)(.*)$/.exec(u);
  if (withScheme) u = `${withScheme[1]}/${withScheme[2]}`;
  else if (scpLike) u = `${scpLike[1]}/${scpLike[2]}`;
  return u.replace(/\/+$/, '').replace(/\.git$/i, '').replace(/\/+$/, '').toLowerCase();
}

/**
 * Turn a git remote URI into a browsable https link, e.g.
 * git@github.com:owner/repo.git -> https://github.com/owner/repo.
 * URIs that are not recognisably remote (local paths) are returned unchanged.
 */
function gitUrlToWebUrl(url: string): string {
  const u = url.trim();
  const withScheme = /^(?:https?|ssh|git|git\+ssh):\/\/(?:[^@/]+@)?([^/:]+)(?::\d+)?\/(.+)$/i.exec(u);
  const scpLike = /^(?:[^@/]+@)?([^/:]+):(?!\/\/)(.+)$/.exec(u);
  const match = withScheme ?? scpLike;
  if (!match) return u;
  const path = (match[2] ?? '').replace(/\/+$/, '').replace(/\.git$/i, '').replace(/^\/+/, '');
  return `https://${(match[1] ?? '').toLowerCase()}/${path}`;
}

/** Human description of how the checkout's HEAD relates to the recorded commit. */
function describeRefDrift(dir: string, recorded: string, current: string): string {
  if (tryGit(dir, ['cat-file', '-e', `${recorded}^{commit}`]) === undefined) {
    return 'the recorded commit does not exist in the local clone (history rewritten, or a different clone?)';
  }
  const counts = tryGit(dir, ['rev-list', '--left-right', '--count', `${recorded}...${current}`]);
  const [behind, ahead] = (counts ?? '').split(/\s+/).map(Number);
  if (behind === undefined || ahead === undefined || Number.isNaN(behind) || Number.isNaN(ahead)) {
    return 'the checkout is at a different commit';
  }
  if (behind === 0) return `the checkout is ${plural(ahead, 'commit')} ahead of the recorded ref`;
  if (ahead === 0) return `the checkout is ${plural(behind, 'commit')} behind the recorded ref`;
  return `the checkout and the recorded ref have diverged (${ahead} ahead, ${behind} behind)`;
}

/* ------------------------------------------------------------------------ */
/* License detection                                                        */
/* ------------------------------------------------------------------------ */

const LICENSE_FILE = /^(?:un)?licen[cs]e(?:[-._].*)?$|^copying(?:[-._].*)?$/i;

const has = (text: string, ...phrases: string[]): boolean => phrases.every((p) => text.includes(p));

/** Ordered rules; the first match wins, so more specific texts come first. */
const LICENSE_RULES: Array<[spdx: string, test: (text: string) => boolean]> = [
  ['AGPL-3.0', (t) => has(t, 'gnu affero general public license version 3')],
  ['LGPL-3.0', (t) => has(t, 'gnu lesser general public license version 3')],
  ['LGPL-2.1', (t) => has(t, 'gnu lesser general public license version 2.1')],
  ['GPL-3.0', (t) => has(t, 'gnu general public license version 3, 29 june 2007')],
  ['GPL-2.0', (t) => has(t, 'gnu general public license version 2, june 1991')],
  ['MPL-2.0', (t) => has(t, 'mozilla public license version 2.0') || has(t, 'mozilla public license, v. 2.0')],
  ['Apache-2.0', (t) => has(t, 'apache license', 'version 2.0')],
  ['BSL-1.0', (t) => has(t, 'boost software license - version 1.0')],
  ['Unlicense', (t) => has(t, 'this is free and unencumbered software released into the public domain')],
  ['CC0-1.0', (t) => has(t, 'cc0 1.0 universal')],
  ['CC-BY-SA-4.0', (t) => has(t, 'attribution-sharealike 4.0 international')],
  ['CC-BY-4.0', (t) => has(t, 'creative commons attribution 4.0 international')],
  ['WTFPL', (t) => has(t, 'do what the fuck you want to public license')],
  [
    'Zlib',
    (t) => has(t, "this software is provided 'as-is', without any express or implied warranty", 'altered source versions must be plainly marked'),
  ],
  ['ISC', (t) => /permission to use, copy, modify, and(?:\/or)? distribute this software for any purpose with or without fee is hereby granted/.test(t)],
  ['MIT', (t) => has(t, 'permission is hereby granted, free of charge, to any person obtaining a copy', 'the above copyright notice and this permission notice shall be included')],
  ['MIT-0', (t) => has(t, 'permission is hereby granted, free of charge, to any person obtaining a copy')],
  ['BSD-4-Clause', (t) => has(t, 'redistribution and use in source and binary forms', 'all advertising materials')],
  ['BSD-3-Clause', (t) => has(t, 'redistribution and use in source and binary forms') && (has(t, 'neither the name') || has(t, 'endorse or promote'))],
  ['BSD-2-Clause', (t) => has(t, 'redistribution and use in source and binary forms')],
];

function identifyLicenseText(raw: string): string | undefined {
  const text = raw.replace(/[*_#>`]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  return LICENSE_RULES.find(([, test]) => test(text))?.[0];
}

/** Names of the license files at the repository root, sorted. */
function licenseFileNames(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => LICENSE_FILE.test(f))
    .filter((f) => statSync(join(dir, f)).isFile())
    .sort();
}

/** License files at the repository root, with the license each one was identified as. */
function listLicenseFiles(dir: string): Array<{ file: string; id: string | undefined }> {
  return licenseFileNames(dir).map((file) => ({ file, id: identifyLicenseText(readFileSync(join(dir, file), 'utf8')) }));
}

function detectLicense(dir: string): { license?: string; note?: string } {
  const files = listLicenseFiles(dir);
  if (files.length === 0) return { note: 'no LICENSE/COPYING file found at the repository root' };

  const found = new Map<string, string[]>();
  const unknown: string[] = [];
  for (const { file, id } of files) {
    if (id === undefined) unknown.push(file);
    else found.set(id, [...(found.get(id) ?? []), file]);
  }

  // GNU projects ship the GPL as COPYING next to the LGPL as COPYING.LESSER.
  if (found.size === 2 && found.has('GPL-3.0') && found.has('LGPL-3.0')) found.delete('GPL-3.0');
  if (found.size === 2 && found.has('GPL-2.0') && found.has('LGPL-2.1')) found.delete('GPL-2.0');

  if (found.size === 1) return { license: [...found.keys()][0] };
  if (found.size > 1) {
    const list = [...found].map(([id, f]) => `${id} (${f.join(', ')})`).join(', ');
    return { note: `found several licenses, cannot pick one automatically: ${list}` };
  }
  return { note: `could not recognise the license text in ${unknown.join(', ')}` };
}

/* ------------------------------------------------------------------------ */
/* Inspecting a checkout                                                    */
/* ------------------------------------------------------------------------ */

interface Checkout {
  git?: string;
  ref?: string;
  license?: string;
  /** Problems that make the checkout unusable or underivable. */
  errors: string[];
  /** Informational remarks that do not fail the run on their own. */
  notes: string[];
}

function inspectCheckout(dir: string): Checkout {
  const out: Checkout = { errors: [], notes: [] };

  // references/ itself lives inside this repo, so a non-repo subfolder would
  // otherwise silently report the parent repository's HEAD.
  const top = tryGit(dir, ['rev-parse', '--show-toplevel']);
  if (top === undefined || realpathSync(top) !== realpathSync(dir)) {
    out.errors.push('folder is not the root of a git repository');
    return out;
  }

  out.ref = tryGit(dir, ['rev-parse', '--verify', '--quiet', 'HEAD^{commit}']);
  if (!out.ref) out.errors.push('could not resolve HEAD to a commit (empty repository?)');

  const remotes = (tryGit(dir, ['remote']) ?? '').split('\n').filter(Boolean);
  const remote = remotes.includes('origin') ? 'origin' : remotes[0];
  if (remote === undefined) {
    out.errors.push('no git remote is configured');
  } else {
    out.git = tryGit(dir, ['remote', 'get-url', remote]);
    if (!out.git) out.errors.push(`could not read the URL of remote "${remote}"`);
    if (remote !== 'origin') out.notes.push(`no "origin" remote, using "${remote}"`);
  }

  const { license, note } = detectLicense(dir);
  out.license = license;
  if (note) out.notes.push(note);
  return out;
}

/* ------------------------------------------------------------------------ */
/* Minimal YAML (block mappings/sequences of scalars, the subset we write)  */
/* ------------------------------------------------------------------------ */

interface YamlLine {
  indent: number;
  text: string;
  lineNo: number;
}

interface YamlState {
  lines: YamlLine[];
  i: number;
}

const yamlError = (lineNo: number, message: string): Error => new Error(`line ${lineNo}: ${message}`);

/** Strip a trailing `# comment`, ignoring `#` inside quoted scalars. */
function stripYamlComment(line: string): string {
  let quote: '"' | "'" | undefined;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote === '"') {
      if (ch === '\\') i++;
      else if (ch === '"') quote = undefined;
    } else if (quote === "'") {
      if (ch === "'") quote = undefined;
    } else if (ch === '#' && (i === 0 || /\s/.test(line[i - 1] ?? ''))) {
      return line.slice(0, i);
    } else if ((ch === '"' || ch === "'") && /(?:^|[\s:\-,[{])$/.test(line.slice(0, i).trimEnd().slice(-1) || '')) {
      quote = ch;
    }
  }
  return line;
}

const isSeqItem = (text: string): boolean => text === '-' || text.startsWith('- ');

/** Index of the `:` that separates a mapping key from its value, or -1. */
function findMapColon(text: string): number {
  if (text.startsWith('"') || text.startsWith("'")) {
    const q = text[0];
    for (let i = 1; i < text.length; i++) {
      if (q === '"' && text[i] === '\\') i++;
      else if (text[i] === q) {
        if (q === "'" && text[i + 1] === "'") i++;
        else return /^\s*:(?:\s|$)/.test(text.slice(i + 1)) ? text.indexOf(':', i + 1) : -1;
      }
    }
    return -1;
  }
  if (text.startsWith('[') || text.startsWith('{')) return -1;
  const m = /:(?:\s|$)/.exec(text);
  return m ? m.index : -1;
}

function resolvePlainScalar(s: string): unknown {
  if (/^(?:null|Null|NULL|~)$/.test(s)) return null;
  if (/^(?:true|True|TRUE)$/.test(s)) return true;
  if (/^(?:false|False|FALSE)$/.test(s)) return false;
  if (/^[-+]?[0-9]+$/.test(s)) return Number.parseInt(s, 10);
  if (/^0x[0-9a-fA-F]+$/.test(s)) return Number.parseInt(s.slice(2), 16);
  if (/^0o[0-7]+$/.test(s)) return Number.parseInt(s.slice(2), 8);
  if (/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)(?:[eE][-+]?[0-9]+)?$/.test(s)) return Number.parseFloat(s);
  if (/^[-+]?\.(?:inf|Inf|INF)$/.test(s)) return s.startsWith('-') ? -Infinity : Infinity;
  if (/^\.(?:nan|NaN|NAN)$/.test(s)) return Number.NaN;
  return s;
}

function parseScalar(raw: string, lineNo: number): unknown {
  const s = raw.trim();
  if (s.startsWith('"')) {
    try {
      return JSON.parse(s) as unknown;
    } catch {
      throw yamlError(lineNo, `unsupported or unterminated double-quoted string: ${s}`);
    }
  }
  if (s.startsWith("'")) {
    const m = /^'((?:[^']|'')*)'$/.exec(s);
    if (!m) throw yamlError(lineNo, `unterminated single-quoted string: ${s}`);
    return (m[1] ?? '').replaceAll("''", "'");
  }
  if (s === '[]') return [];
  if (s === '{}') return {};
  if (s.startsWith('[') || s.startsWith('{')) {
    try {
      return JSON.parse(s) as unknown;
    } catch {
      throw yamlError(lineNo, 'flow collections are only supported as [] / {} or JSON');
    }
  }
  if (/^[&*!|>%@`]/.test(s)) throw yamlError(lineNo, `unsupported YAML feature (anchor, alias, tag or block scalar): ${s}`);
  return resolvePlainScalar(s);
}

function parseKey(raw: string, lineNo: number): string {
  const key = raw.trim();
  if (key.startsWith('"') || key.startsWith("'")) {
    const value = parseScalar(key, lineNo);
    if (typeof value !== 'string') throw yamlError(lineNo, `invalid key ${key}`);
    return value;
  }
  if (key === '') throw yamlError(lineNo, 'empty mapping key');
  return key;
}

function parseBlock(state: YamlState, indent: number): unknown {
  const line = state.lines[state.i];
  if (line === undefined) return null;
  return isSeqItem(line.text) ? parseSeq(state, indent) : parseMap(state, indent);
}

function parseSeq(state: YamlState, indent: number): unknown[] {
  const out: unknown[] = [];
  while (state.i < state.lines.length) {
    const line = state.lines[state.i]!;
    if (line.indent < indent) break;
    if (line.indent > indent) throw yamlError(line.lineNo, 'unexpected indentation');
    if (!isSeqItem(line.text)) break;

    const rest = line.text.slice(1);
    const restTrim = rest.replace(/^ +/, '');
    if (restTrim === '') {
      state.i++;
      const next = state.lines[state.i];
      out.push(next !== undefined && next.indent > indent ? parseBlock(state, next.indent) : null);
    } else if (isSeqItem(restTrim) || findMapColon(restTrim) !== -1) {
      // "- key: value": re-read the remainder as a block starting at its own column.
      const col = indent + 1 + (rest.length - restTrim.length);
      state.lines[state.i] = { indent: col, text: restTrim, lineNo: line.lineNo };
      out.push(parseBlock(state, col));
    } else {
      out.push(parseScalar(restTrim, line.lineNo));
      state.i++;
    }
  }
  return out;
}

function parseMap(state: YamlState, indent: number): Record<string, unknown> {
  const out = Object.create(null) as Record<string, unknown>;
  while (state.i < state.lines.length) {
    const line = state.lines[state.i]!;
    if (line.indent < indent) break;
    if (line.indent > indent) throw yamlError(line.lineNo, 'unexpected indentation');
    if (isSeqItem(line.text)) throw yamlError(line.lineNo, 'unexpected sequence item inside a mapping');

    const colon = findMapColon(line.text);
    if (colon === -1) throw yamlError(line.lineNo, `expected "key: value", got: ${line.text}`);
    const key = parseKey(line.text.slice(0, colon), line.lineNo);
    if (Object.hasOwn(out, key)) throw yamlError(line.lineNo, `duplicate key "${key}"`);
    const rest = line.text.slice(colon + 1).trim();
    state.i++;

    if (rest !== '') {
      out[key] = parseScalar(rest, line.lineNo);
      continue;
    }
    const next = state.lines[state.i];
    if (next !== undefined && next.indent > indent) out[key] = parseBlock(state, next.indent);
    else if (next !== undefined && next.indent === indent && isSeqItem(next.text)) out[key] = parseSeq(state, indent);
    else out[key] = null;
  }
  return out;
}

function parseYaml(source: string): unknown {
  const trimmed = source.replace(/^\uFEFF/, '').trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed) as unknown; // JSON is valid YAML

  const lines: YamlLine[] = [];
  source
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .forEach((raw, idx) => {
      const lineNo = idx + 1;
      const stripped = stripYamlComment(raw).trimEnd();
      if (stripped.trim() === '') return;
      const indent = stripped.length - stripped.trimStart().length;
      if (/^ *\t/.test(stripped)) throw yamlError(lineNo, 'tabs are not allowed for indentation');
      const text = stripped.slice(indent);
      if (indent === 0 && (text === '---' || text === '...')) {
        if (lines.length > 0) throw yamlError(lineNo, 'multiple YAML documents are not supported');
        return;
      }
      lines.push({ indent, text, lineNo });
    });

  const first = lines[0];
  if (first === undefined) return null;
  const state: YamlState = { lines, i: 0 };
  const value = parseBlock(state, first.indent);
  const leftover = state.lines[state.i];
  if (leftover !== undefined) throw yamlError(leftover.lineNo, `unexpected content: ${leftover.text}`);
  return value;
}

function yamlScalar(value: string): string {
  const needsQuotes =
    value === '' ||
    resolvePlainScalar(value) !== value ||
    /^\s|\s$/.test(value) ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(value) ||
    /:\s|\s#|:$/.test(value) ||
    /[\u0000-\u001f\u007f]/.test(value);
  return needsQuotes ? JSON.stringify(value) : value;
}

const DATA_HEADER = `# yaml-language-server: $schema=./references.schema.json
#
# Git repositories checked out under references/, one entry per folder.
# Must conform to ${REL_SCHEMA}.
# Maintained by scripts/references_check_refs.ts (run with --update to record new refs).
# Comments other than this header are not preserved when the script rewrites this file.
`;

function stringifyData(data: ReferencesData): string {
  if (data.repos.length === 0) return `${DATA_HEADER}\nrepos: []\n`;
  const body = data.repos
    .map((r) =>
      [
        `  - name: ${yamlScalar(r.name)}`,
        `    git: ${yamlScalar(r.git)}`,
        `    ref: ${yamlScalar(r.ref)}`,
        `    license: ${yamlScalar(r.license)}`,
      ].join('\n'),
    )
    .join('\n\n');
  return `${DATA_HEADER}\nrepos:\n${body}\n`;
}

const ATTRIBUTION_HEADER = `# Third-party projects used as reference material,
# with a link to each project and the license it is distributed under.
# The full license text of each project is in attribution/LICENSE.<name>.txt, or in
# attribution/LICENSE.<name>-1.txt, -2.txt, ... when a project has several license files.
#
# GENERATED FILE, do not edit by hand. It is rebuilt from ${REL_DATA}
# by scripts/references_check_refs.ts.
`;

function stringifyAttribution(repos: readonly RepoEntry[]): string {
  if (repos.length === 0) return `${ATTRIBUTION_HEADER}\nprojects: []\n`;
  const body = repos
    .map((r) =>
      [`  - name: ${yamlScalar(r.name)}`, `    url: ${yamlScalar(gitUrlToWebUrl(r.git))}`, `    license: ${yamlScalar(r.license)}`].join('\n'),
    )
    .join('\n\n');
  return `${ATTRIBUTION_HEADER}\nprojects:\n${body}\n`;
}

/** Atomically replace `file` with `content`. */
function writeFileAtomic(file: string, content: string | Buffer): void {
  const tmp = `${file}.tmp-${process.pid}`;
  writeFileSync(tmp, content);
  renameSync(tmp, file);
}

/** Write `content` to `file` unless it already holds exactly that; returns whether it wrote. */
function writeIfChanged(file: string, content: string | Buffer): boolean {
  if (existsSync(file) && readFileSync(file).equals(typeof content === 'string' ? Buffer.from(content) : content)) return false;
  writeFileAtomic(file, content);
  return true;
}

const LICENSE_COPY = /^LICENSE\..+\.txt$/;

/** Attribution file names for a repo with `count` license files. */
const licenseCopyNames = (name: string, count: number): string[] =>
  count === 1 ? [`LICENSE.${name}.txt`] : Array.from({ length: count }, (_, i) => `LICENSE.${name}-${i + 1}.txt`);

/** Whether `file` is (or could be) one of the attribution copies for repo `name`. */
const isLicenseCopyOf = (file: string, name: string): boolean =>
  file === `LICENSE.${name}.txt` || (file.startsWith(`LICENSE.${name}-`) && /^-\d+\.txt$/.test(file.slice(`LICENSE.${name}`.length)));

interface LicenseSync {
  written: string[];
  removed: string[];
  warnings: string[];
}

/**
 * Mirror every license file at the root of each recorded repo into attribution/
 * as LICENSE.<name>.txt, or LICENSE.<name>-1.txt, -2.txt, ... (in file name
 * order) when there are several, and delete copies that are no longer needed.
 * Copies for repos whose checkout is missing are left as they are.
 */
function syncLicenseCopies(repos: readonly RepoEntry[]): LicenseSync {
  const result: LicenseSync = { written: [], removed: [], warnings: [] };
  mkdirSync(ATTRIBUTION_DIR, { recursive: true });

  const existing = readdirSync(ATTRIBUTION_DIR);
  const expected = new Set<string>();

  for (const repo of repos) {
    const dir = join(REFERENCES_DIR, repo.name);
    if (!existsSync(dir)) {
      // Reported elsewhere as a missing checkout; keep whatever copies it had.
      for (const f of existing) if (isLicenseCopyOf(f, repo.name)) expected.add(f);
      continue;
    }
    const files = licenseFileNames(dir);
    if (files.length === 0) {
      result.warnings.push(`${repo.name}: no license file copied, no LICENSE/COPYING file found at the repository root`);
      continue;
    }
    const copies = licenseCopyNames(repo.name, files.length);
    files.forEach((file, i) => {
      const copy = copies[i]!;
      expected.add(copy);
      if (writeIfChanged(join(ATTRIBUTION_DIR, copy), readFileSync(join(dir, file)))) {
        result.written.push(`${copy} (from ${REL_REFERENCES}${repo.name}/${file})`);
      }
    });
  }

  for (const f of readdirSync(ATTRIBUTION_DIR).sort()) {
    if (LICENSE_COPY.test(f) && !expected.has(f)) {
      rmSync(join(ATTRIBUTION_DIR, f));
      result.removed.push(f);
    }
  }
  return result;
}

/* ------------------------------------------------------------------------ */
/* Minimal JSON Schema validation (the keywords our schema uses)            */
/* ------------------------------------------------------------------------ */

const ANNOTATION_KEYWORDS = new Set(['$schema', '$id', '$comment', '$defs', 'definitions', 'title', 'description', 'examples', 'default', 'format', 'deprecated', 'readOnly', 'writeOnly']);
const ASSERTION_KEYWORDS = new Set(['$ref', 'type', 'enum', 'const', 'required', 'properties', 'additionalProperties', 'items', 'minItems', 'maxItems', 'minLength', 'maxLength', 'pattern']);

type JsonSchema = boolean | Record<string, unknown>;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function resolvePointer(root: JsonSchema, ref: string): JsonSchema {
  if (!ref.startsWith('#')) throw new Error(`only local $ref values are supported, got "${ref}"`);
  let node: unknown = root;
  for (const part of ref.slice(1).split('/').filter(Boolean)) {
    const key = decodeURIComponent(part).replaceAll('~1', '/').replaceAll('~0', '~');
    node = isObject(node) ? node[key] : undefined;
  }
  if (typeof node !== 'boolean' && !isObject(node)) throw new Error(`$ref "${ref}" does not resolve to a schema`);
  return node;
}

function matchesType(value: unknown, type: string): boolean {
  switch (type) {
    case 'object':
      return isObject(value);
    case 'array':
      return Array.isArray(value);
    case 'string':
      return typeof value === 'string';
    case 'boolean':
      return typeof value === 'boolean';
    case 'null':
      return value === null;
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'integer':
      return Number.isInteger(value);
    default:
      throw new Error(`unsupported schema type "${type}"`);
  }
}

const describe = (value: unknown): string => (value === undefined ? 'nothing' : JSON.stringify(value));

function validateSchema(value: unknown, schema: JsonSchema, root: JsonSchema, path: string, errors: string[]): void {
  const at = path || 'top level';
  if (schema === true) return;
  if (schema === false) {
    errors.push(`${at}: is not allowed`);
    return;
  }
  for (const keyword of Object.keys(schema)) {
    if (!ANNOTATION_KEYWORDS.has(keyword) && !ASSERTION_KEYWORDS.has(keyword)) {
      throw new Error(`schema keyword "${keyword}" is not supported by scripts/references_check_refs.ts`);
    }
  }

  if (typeof schema.$ref === 'string') validateSchema(value, resolvePointer(root, schema.$ref), root, path, errors);

  if (schema.type !== undefined) {
    const types = (Array.isArray(schema.type) ? schema.type : [schema.type]) as string[];
    if (!types.some((t) => matchesType(value, t))) {
      errors.push(`${at}: expected ${types.join(' or ')}, got ${describe(value)}`);
      return;
    }
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))) {
    errors.push(`${at}: must be one of ${schema.enum.map(describe).join(', ')}, got ${describe(value)}`);
  }
  if ('const' in schema && JSON.stringify(schema.const) !== JSON.stringify(value)) {
    errors.push(`${at}: must be ${describe(schema.const)}, got ${describe(value)}`);
  }

  if (typeof value === 'string') {
    const length = [...value].length;
    if (typeof schema.minLength === 'number' && length < schema.minLength) errors.push(`${at}: must not be shorter than ${schema.minLength} characters`);
    if (typeof schema.maxLength === 'number' && length > schema.maxLength) errors.push(`${at}: must not be longer than ${schema.maxLength} characters`);
    if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern, 'u').test(value)) {
      errors.push(`${at}: ${describe(value)} does not match the pattern ${schema.pattern}`);
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) errors.push(`${at}: needs at least ${schema.minItems} items`);
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) errors.push(`${at}: allows at most ${schema.maxItems} items`);
    if (schema.items !== undefined) {
      value.forEach((item, i) => validateSchema(item, schema.items as JsonSchema, root, `${path}[${i}]`, errors));
    }
  }

  if (isObject(value)) {
    const properties = isObject(schema.properties) ? schema.properties : {};
    if (Array.isArray(schema.required)) {
      for (const key of schema.required as string[]) {
        if (!Object.hasOwn(value, key)) errors.push(`${at}: missing required field "${key}"`);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      const childPath = path ? `${path}.${key}` : key;
      if (Object.hasOwn(properties, key)) validateSchema(child, properties[key] as JsonSchema, root, childPath, errors);
      else if (schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) errors.push(`${childPath}: unknown field`);
        else validateSchema(child, schema.additionalProperties as JsonSchema, root, childPath, errors);
      }
    }
  }
}

function validate(value: unknown, schema: JsonSchema): string[] {
  const errors: string[] = [];
  validateSchema(value, schema, schema, '', errors);
  return errors;
}

/* ------------------------------------------------------------------------ */
/* Main                                                                     */
/* ------------------------------------------------------------------------ */

function loadInputs(): { schema: JsonSchema; data: ReferencesData; existed: boolean } {
  const schema = JSON.parse(readFileSync(SCHEMA_FILE, 'utf8')) as JsonSchema;

  const source = existsSync(DATA_FILE) ? readFileSync(DATA_FILE, 'utf8') : '';
  let parsed: unknown;
  try {
    parsed = parseYaml(source);
  } catch (error) {
    throw new Error(`could not parse ${REL_DATA}: ${(error as Error).message}`);
  }
  const existed = parsed !== null;
  if (parsed === null) parsed = { repos: [] };

  const errors = validate(parsed, schema);
  if (errors.length > 0) {
    throw new Error(`${REL_DATA} does not conform to ${REL_SCHEMA}:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  }
  const data = parsed as ReferencesData;

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const { name } of data.repos) (seen.has(name) ? duplicates : seen).add(name);
  if (duplicates.size > 0) throw new Error(`${REL_DATA} lists these repos more than once: ${[...duplicates].join(', ')}`);

  // Copy into plain objects with a fixed key order for writing back.
  data.repos = data.repos.map(({ name, git: uri, ref, license }) => ({ name, git: uri, ref, license }));
  return { schema, data, existed };
}

function listCheckouts(): string[] {
  if (!existsSync(REFERENCES_DIR)) return [];
  return readdirSync(REFERENCES_DIR)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => statSync(join(REFERENCES_DIR, name)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'en'));
}

let printedBlocks = 0;

function printBlock(marker: string, name: string, lines: string[]): void {
  printedBlocks++;
  say(`${marker} ${paint('bold', name)}`);
  for (const line of lines) say(`    ${line}`);
}

function main(): number {
  let update: boolean;
  try {
    const { values } = parseArgs({
      options: {
        update: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      strict: true,
      allowPositionals: false,
    });
    if (values.help) {
      say(USAGE);
      return 0;
    }
    update = values.update;
  } catch (error) {
    say(paint('red', `error: ${(error as Error).message}`));
    say();
    say(USAGE);
    return 2;
  }

  if (tryGit(ROOT, ['--version']) === undefined) {
    say(paint('red', 'error: could not run git; is it installed and on PATH?'));
    return 2;
  }

  let schema: JsonSchema;
  let data: ReferencesData;
  let existed: boolean;
  try {
    ({ schema, data, existed } = loadInputs());
  } catch (error) {
    say(paint('red', `error: ${(error as Error).message}`));
    return 2;
  }

  const folders = listCheckouts();
  if (!existsSync(REFERENCES_DIR)) say(paint('yellow', `warning: ${REL_REFERENCES} does not exist; treating it as empty`));
  say(`Checking ${plural(folders.length, 'checkout')} in ${REL_REFERENCES} against ${REL_DATA}${update ? ' (--update)' : ''}`);
  if (!existed) say(paint('dim', `${REL_DATA} is empty or missing; it will be created`));
  say();

  const recorded = new Map(data.repos.map((r) => [r.name, r]));
  let upToDate = 0;
  const added: string[] = [];
  const updated: string[] = [];
  const failed: string[] = [];

  for (const name of folders) {
    const dir = join(REFERENCES_DIR, name);
    const checkout = inspectCheckout(dir);
    const entry = recorded.get(name);
    const notes = checkout.notes.map((n) => paint('dim', `note: ${n}`));

    if (entry === undefined) {
      const { git: uri, ref, license } = checkout;
      if (checkout.errors.length > 0 || uri === undefined || ref === undefined || license === undefined) {
        const reasons = [...checkout.errors];
        if (checkout.errors.length === 0 && license === undefined) {
          reasons.push(`could not determine the license; add an entry for "${name}" to ${REL_DATA} by hand`);
        }
        printBlock(paint('red', '✗'), name, [`not in ${REL_DATA} and could not be added:`, ...reasons.map((r) => `  - ${r}`), ...notes]);
        failed.push(name);
        continue;
      }
      data.repos.push({ name, git: uri, ref, license });
      added.push(name);
      printBlock(paint('green', '+'), name, [`added to ${REL_DATA}: ${license}, ${short(ref)}, ${uri}`, ...notes]);
      continue;
    }

    if (checkout.errors.length > 0) {
      printBlock(paint('red', '✗'), name, [...checkout.errors.map((e) => `- ${e}`), ...notes]);
      failed.push(name);
      continue;
    }

    const mismatches: string[] = [];
    if (checkout.git !== undefined && normalizeGitUrl(entry.git) !== normalizeGitUrl(checkout.git)) {
      mismatches.push('- git remote differs', `    recorded: ${entry.git}`, `    checkout: ${checkout.git}`);
    }
    if (checkout.license !== undefined && entry.license !== checkout.license) {
      mismatches.push('- license differs', `    recorded: ${entry.license}`, `    checkout: ${checkout.license}`);
    } else if (checkout.license === undefined) {
      notes.push(paint('dim', `note: license could not be detected, keeping the recorded "${entry.license}"`));
    }
    const refStale = checkout.ref !== undefined && entry.ref !== checkout.ref;
    const refLines =
      refStale && checkout.ref !== undefined
        ? [`- ref is out of date: ${describeRefDrift(dir, entry.ref, checkout.ref)}`, `    recorded: ${entry.ref}`, `    checkout: ${checkout.ref}`]
        : [];

    if (mismatches.length === 0 && !refStale) {
      upToDate++;
      if (checkout.notes.length > 0 || notes.length > 0) printBlock(paint('green', '✓'), name, notes);
      continue;
    }

    if (mismatches.length === 0 && refStale && update && checkout.ref !== undefined) {
      printBlock(paint('cyan', '↻'), name, [`ref updated ${short(entry.ref)} -> ${short(checkout.ref)} (${describeRefDrift(dir, entry.ref, checkout.ref).replace(/^the /, '')})`, ...notes]);
      entry.ref = checkout.ref;
      updated.push(name);
      continue;
    }

    const hints: string[] = [];
    if (refStale && mismatches.length === 0) hints.push(paint('dim', 'run with --update to record the checkout\'s ref'));
    if (refStale && mismatches.length > 0 && update) hints.push(paint('yellow', 'ref was not updated because other fields also differ; fix those first'));
    if (mismatches.length > 0) hints.push(paint('dim', `edit ${REL_DATA} by hand if the checkout is correct`));
    printBlock(paint('yellow', '!'), name, [...mismatches, ...refLines, ...hints, ...notes]);
    failed.push(name);
  }

  const folderSet = new Set(folders);
  for (const entry of data.repos) {
    if (added.includes(entry.name) || folderSet.has(entry.name)) continue;
    printBlock(paint('red', '✗'), entry.name, [
      `- recorded in ${REL_DATA} but ${REL_REFERENCES}${entry.name} does not exist`,
      paint('dim', `clone ${entry.git} there, or remove the entry`),
    ]);
    failed.push(entry.name);
  }

  data.repos.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  if (added.length > 0 || updated.length > 0) {
    const errors = validate(data, schema);
    if (errors.length > 0) {
      say(paint('red', `error: refusing to write ${REL_DATA}, the result would not conform to ${REL_SCHEMA}:`));
      for (const e of errors) say(`  - ${e}`);
      return 2;
    }
    writeFileAtomic(DATA_FILE, stringifyData(data));
  }
  // Built from the recorded data (not the checkouts), so it always matches the data file.
  const wroteAttribution = writeIfChanged(ATTRIBUTION_FILE, stringifyAttribution(data.repos));
  const licenses = syncLicenseCopies(data.repos);
  for (const warning of licenses.warnings) {
    printBlock(paint('yellow', '!'), warning.slice(0, warning.indexOf(':')), [`- ${warning.slice(warning.indexOf(':') + 2)}`]);
  }

  if (printedBlocks > 0) say();
  const parts = [`${upToDate} up to date`];
  if (added.length > 0) parts.push(`${added.length} added`);
  if (updated.length > 0) parts.push(`${updated.length} ref${updated.length === 1 ? '' : 's'} updated`);
  if (failed.length > 0) parts.push(paint('red', `${failed.length} with problems`));
  say(`Summary: ${parts.join(', ')}`);
  if (added.length > 0 || updated.length > 0) say(`Wrote ${REL_DATA}`);
  if (wroteAttribution) say(`Wrote ${REL_ATTRIBUTION}`);
  for (const w of licenses.written) say(`Wrote ${REL_ATTRIBUTION_DIR}${w}`);
  for (const r of licenses.removed) say(`Removed ${REL_ATTRIBUTION_DIR}${r} (no longer needed)`);
  if (failed.length > 0) {
    say(paint('red', `Exiting with status 1 because of: ${failed.join(', ')}`));
    return 1;
  }
  return 0;
}

process.exitCode = main();
