// Walks dist/**/*.html and verifies that every internal href exists in dist.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BASE } from "../src/lib/okf.ts";
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

function* walk(dir: string): Generator<string> {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else if (d.name.endsWith(".html")) yield p;
  }
}

const hrefRe = /href="(\/(?!\/)[^"]*)"/g;
const seen = new Map<string, boolean>();
const broken: string[] = [];
let total = 0;
let pages = 0;
for (const file of walk(dist)) {
  pages++;
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(hrefRe)) {
    total++;
    if (!m[1].startsWith(BASE)) {
      broken.push(`${path.relative(dist, file)} -> ${m[1]} (missing base)`);
      continue;
    }
    const clean = m[1].split(/[#?]/)[0].slice(BASE.length);
    let ok = seen.get(clean);
    if (ok === undefined) {
      const p = path.join(dist, decodeURIComponent(clean));
      ok = existsSync(p) && (statSync(p).isFile() || existsSync(path.join(p, "index.html")));
      seen.set(clean, ok);
    }
    if (!ok) broken.push(`${path.relative(dist, file)} -> ${m[1]}`);
  }
}
console.log(`pages: ${pages}, internal hrefs: ${total}, unique targets: ${seen.size}, broken: ${broken.length}`);
for (const b of broken.slice(0, 20)) console.log("  " + b);
process.exit(broken.length ? 1 : 0);
