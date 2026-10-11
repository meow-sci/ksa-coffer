#!/usr/bin/env node
/**
 * Add "See also" links from mod feature pages to the how-to articles that demonstrate them.
 *
 *   node scripts/content_crosslink.ts [--dry-run]
 *
 * Reads every How-To concept under content/howto/ and its `demonstrated_by` frontmatter list of
 * feature concept ids (mods/<mod>/features/<slug>). For each feature page it appends a bullet to the
 * `## See also` section (creating the section when missing) linking the article with a file-relative
 * path. Idempotent: a link already present is left alone. Prints the number of links added per mod so
 * the caller can add a log.md entry. Runs on Node 24; needs the `yaml` package.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const CONTENT = join(ROOT, 'content');
const RESERVED = new Set(['index.md', 'log.md']);

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.md') && !RESERVED.has(e.name)) yield p;
  }
}

function split(text: string): { fm: Record<string, unknown> | null; fmText: string; body: string } {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { fm: null, fmText: '', body: text };
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trim() === '---') {
      const fmText = lines.slice(1, i).join('\n');
      let fm: Record<string, unknown> | null = null;
      try {
        fm = (parseYaml(fmText) ?? {}) as Record<string, unknown>;
      } catch {
        fm = null;
      }
      return { fm, fmText, body: lines.slice(i + 1).join('\n') };
    }
  }
  return { fm: null, fmText: '', body: text };
}

function main(): number {
  const args = parseArgs({ options: { 'dry-run': { type: 'boolean' } } });
  const dry = Boolean(args.values['dry-run']);
  const perMod = new Map<string, number>();
  let skippedMissing = 0;
  for (const howto of walk(join(CONTENT, 'howto'))) {
    const { fm } = split(readFileSync(howto, 'utf8'));
    if (!fm || fm.type !== 'How-To') continue;
    const title = String(fm.title ?? '');
    const ids = Array.isArray(fm.demonstrated_by) ? (fm.demonstrated_by as unknown[]).map(String) : [];
    for (const id of ids) {
      const featurePath = join(CONTENT, `${id}.md`);
      if (!existsSync(featurePath)) {
        skippedMissing++;
        process.stderr.write(`warning: ${relative(ROOT, howto)} cites missing feature ${id}\n`);
        continue;
      }
      const text = readFileSync(featurePath, 'utf8');
      const link = relative(dirname(featurePath), howto).split('\\').join('/');
      const bullet = `- [${title}](${link}) - how-to article demonstrating this feature`;
      if (text.includes(`](${link})`)) continue;
      let next: string;
      const m = /^## See also[ \t]*$/m.exec(text);
      if (m) {
        // append after the last non-empty line of the See also section (section runs to next heading or footnotes)
        const start = m.index + m[0].length;
        const rest = text.slice(start);
        const endRel = rest.search(/^(## |\[\^)/m);
        const sectionEnd = endRel === -1 ? text.length : start + endRel;
        const section = text.slice(start, sectionEnd).replace(/\s+$/, '');
        next = `${text.slice(0, start)}${section}\n${bullet}\n\n${text.slice(sectionEnd).replace(/^\s+/, '')}`;
      } else {
        const fnIdx = text.search(/^\[\^[^\]]+\]:/m);
        if (fnIdx === -1) next = `${text.replace(/\s+$/, '')}\n\n## See also\n\n${bullet}\n`;
        else next = `${text.slice(0, fnIdx).replace(/\s+$/, '')}\n\n## See also\n\n${bullet}\n\n${text.slice(fnIdx)}`;
      }
      if (!dry) writeFileSync(featurePath, next, 'utf8');
      const mod = id.split('/')[1] ?? '?';
      perMod.set(mod, (perMod.get(mod) ?? 0) + 1);
    }
  }
  for (const [mod, n] of [...perMod.entries()].sort()) process.stdout.write(`${mod}: ${n} link(s) ${dry ? 'would be ' : ''}added\n`);
  process.stdout.write(`${[...perMod.values()].reduce((a, b) => a + b, 0)} links, ${skippedMissing} missing targets\n`);
  return skippedMissing > 0 ? 1 : 0;
}

process.exit(main());
