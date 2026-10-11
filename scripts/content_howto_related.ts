#!/usr/bin/env node
/**
 * Link how-to topic overviews to their `related` topics from ai/catalog/howto-plan.yml.
 *
 *   node scripts/content_howto_related.ts [--dry-run]
 *
 * For every topic in the plan whose overview exists, ensures the overview's `## See also` section
 * contains a file-relative link to each related topic's overview.md (and to the game-loop reference
 * when `game-loop-and-lifecycle` is listed). Idempotent; related topics not yet written are skipped
 * and counted. Runs on Node 24; needs the `yaml` package.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(import.meta.dirname, '..');
const PLAN = join(ROOT, 'ai', 'catalog', 'howto-plan.yml');
const HOWTO = join(ROOT, 'content', 'howto');

interface Topic { slug: string; title: string; group: string; related?: string[] }
interface Plan { game_loop_reference?: string; categories: Record<string, { topics: Topic[] }> }

function titleOf(path: string): string {
  const text = readFileSync(path, 'utf8');
  const m = /^title:\s*(.+)$/m.exec(text);
  return m ? m[1]!.trim().replace(/^["']|["']$/g, '') : path;
}

function addToSeeAlso(text: string, bullet: string, link: string): string | null {
  if (text.includes(`](${link})`)) return null;
  const m = /^## See also[ \t]*$/m.exec(text);
  if (m) {
    const start = m.index + m[0].length;
    const rest = text.slice(start);
    const endRel = rest.search(/^(## |\[\^)/m);
    const sectionEnd = endRel === -1 ? text.length : start + endRel;
    const section = text.slice(start, sectionEnd).replace(/\s+$/, '');
    return `${text.slice(0, start)}${section}\n${bullet}\n\n${text.slice(sectionEnd).replace(/^\s+/, '')}`;
  }
  const fnIdx = text.search(/^\[\^[^\]]+\]:/m);
  if (fnIdx === -1) return `${text.replace(/\s+$/, '')}\n\n## See also\n\n${bullet}\n`;
  return `${text.slice(0, fnIdx).replace(/\s+$/, '')}\n\n## See also\n\n${bullet}\n\n${text.slice(fnIdx)}`;
}

function main(): number {
  const args = parseArgs({ options: { 'dry-run': { type: 'boolean' } } });
  const dry = Boolean(args.values['dry-run']);
  const plan = parseYaml(readFileSync(PLAN, 'utf8')) as Plan;
  const pathOf = new Map<string, string>();
  for (const [cat, cd] of Object.entries(plan.categories)) {
    for (const t of cd.topics ?? []) pathOf.set(t.slug, join(HOWTO, cat, t.group, t.slug, 'overview.md'));
  }
  const gl = plan.game_loop_reference ?? 'getting-started/game-loop-and-lifecycle';
  const glPath = join(HOWTO, 'getting-started', 'lifecycle', 'game-loop-and-lifecycle', 'overview.md');
  pathOf.set('game-loop-and-lifecycle', glPath);
  let added = 0, skippedMissingTarget = 0, skippedMissingSource = 0;
  for (const [cat, cd] of Object.entries(plan.categories)) {
    for (const t of cd.topics ?? []) {
      const src = pathOf.get(t.slug)!;
      if (!existsSync(src)) { skippedMissingSource++; continue; }
      let text = readFileSync(src, 'utf8');
      let changed = false;
      for (const rel of t.related ?? []) {
        const target = pathOf.get(rel);
        if (!target || !existsSync(target)) { skippedMissingTarget++; continue; }
        const link = relative(dirname(src), target).split('\\').join('/');
        const next = addToSeeAlso(text, `- [${titleOf(target)}](${link}) - related topic`, link);
        if (next) { text = next; changed = true; added++; }
      }
      if (changed && !dry) writeFileSync(src, text, 'utf8');
    }
  }
  process.stdout.write(`${added} links ${dry ? 'would be ' : ''}added, ${skippedMissingTarget} related targets not written yet, ${skippedMissingSource} topics not written yet (ref ${gl})\n`);
  return 0;
}

process.exit(main());
