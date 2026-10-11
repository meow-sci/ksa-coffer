// Node-only helpers that scan the OKF bundle in ../content (never copied).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parse as parseYaml } from "yaml";

/** Site base path; must match the GitHub Pages project URL. */
export const BASE = "/ksa-coffer/";

export const SITE_ROOT = fileURLToPath(new URL("../..", import.meta.url));
export const REPO_ROOT = path.resolve(SITE_ROOT, "..");
export const CONTENT_ROOT = path.join(REPO_ROOT, "content");

export function humanize(slug: string): string {
  const s = slug.replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function readFrontmatter(file: string): Record<string, any> {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try {
    return (parseYaml(m[1]) as Record<string, any>) ?? {};
  } catch {
    return {};
  }
}

function dirs(p: string): string[] {
  return readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

export interface Scan {
  mods: Map<string, string>; // slug -> title
  topics: Map<string, string>; // "cat/group/topic" -> title
  categories: Map<string, string[]>; // cat -> groups
  groupsDesc: Map<string, string>; // "cat" or "cat/group" -> description
}

let scan: Scan | undefined;

export function getScan(): Scan {
  if (scan) return scan;
  const mods = new Map<string, string>();
  const topics = new Map<string, string>();
  const categories = new Map<string, string[]>();
  const groupsDesc = new Map<string, string>();

  const modsDir = path.join(CONTENT_ROOT, "mods");
  for (const mod of dirs(modsDir)) {
    const ov = path.join(modsDir, mod, "overview.md");
    mods.set(mod, existsSync(ov) ? String(readFrontmatter(ov).title ?? humanize(mod)) : humanize(mod));
  }

  const howtoDir = path.join(CONTENT_ROOT, "howto");
  for (const cat of dirs(howtoDir)) {
    const groups = dirs(path.join(howtoDir, cat));
    categories.set(cat, groups);
    for (const group of groups) {
      for (const topic of dirs(path.join(howtoDir, cat, group))) {
        const ov = path.join(howtoDir, cat, group, topic, "overview.md");
        topics.set(
          `${cat}/${group}/${topic}`,
          existsSync(ov) ? String(readFrontmatter(ov).title ?? humanize(topic)) : humanize(topic),
        );
      }
    }
  }

  const planFile = path.join(REPO_ROOT, "ai/catalog/howto-plan.yml");
  if (existsSync(planFile)) {
    try {
      const plan = parseYaml(readFileSync(planFile, "utf8")) as any;
      for (const [cat, c] of Object.entries<any>(plan?.categories ?? {})) {
        if (typeof c?.description === "string") groupsDesc.set(cat, c.description.trim());
        for (const [g, desc] of Object.entries<any>(c?.groups ?? {})) {
          if (typeof desc === "string") groupsDesc.set(`${cat}/${g}`, desc.trim());
        }
      }
    } catch {
      // descriptions are optional
    }
  }

  scan = { mods, topics, categories, groupsDesc };
  return scan;
}

/** Title for any directory under content/ (relDir is posix, "" for the root). */
export function dirTitle(relDir: string): string {
  const rel = relDir.replace(/^\/+|\/+$/g, "");
  if (rel === "") return "KSA Coffer";
  const { mods, topics } = getScan();
  const parts = rel.split("/");
  if (parts[0] === "mods") {
    if (parts.length === 1) return "Mods";
    const modTitle = mods.get(parts[1]) ?? humanize(parts[1]);
    if (parts.length === 2) return modTitle;
    if (parts[2] === "features") return `${modTitle} features`;
    if (parts[2] === "submods") return `${modTitle} submods`;
    return humanize(parts[parts.length - 1]);
  }
  if (parts[0] === "howto") {
    if (parts.length === 1) return "How-to";
    if (parts.length === 4) return topics.get(parts.slice(1).join("/")) ?? humanize(parts[3]);
    return humanize(parts[parts.length - 1]);
  }
  return humanize(parts[parts.length - 1]);
}

/** Description for category / group index pages, if the plan has one. */
export function dirDescription(relDir: string): string | undefined {
  const parts = relDir.split("/");
  if (parts[0] !== "howto" || parts.length < 2 || parts.length > 3) return undefined;
  return getScan().groupsDesc.get(parts.slice(1).join("/"));
}

const byLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label);

/** Lean sidebar: rendered on every page, so only top-level navigation is listed. */
export function buildSidebar() {
  const { mods, categories } = getScan();
  const howto = [...categories.entries()]
    .map(([cat, groups]) => ({
      label: humanize(cat),
      collapsed: true,
      items: groups
        .map((g) => ({ label: humanize(g), link: `/howto/${cat}/${g}/` }))
        .sort(byLabel),
    }))
    .sort(byLabel);
  const modItems = [...mods.entries()]
    .map(([slug, title]) => ({ label: title, link: `/mods/${slug}/overview/` }))
    .sort(byLabel);
  return [
    { label: "How-to", items: howto },
    { label: "Mods", collapsed: false, items: modItems },
  ];
}
