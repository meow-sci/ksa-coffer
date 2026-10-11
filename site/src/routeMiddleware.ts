import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { getCollection } from "astro:content";
import { readSkillDownload } from "./lib/skill-download.ts";

type Entry = Awaited<ReturnType<typeof getCollection<"docs">>>[number];

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Page {
  id: string;
  file: string; // path relative to content/
  name: string; // basename
  title: string;
  type?: string;
}

let byDir: Map<string, Page[]> | undefined;

async function getByDir() {
  if (byDir) return byDir;
  const map = new Map<string, Page[]>();
  for (const e of (await getCollection("docs")) as Entry[]) {
    const fp = ((e as any).filePath as string).replace(/\\/g, "/");
    const file = fp.slice(fp.lastIndexOf("content/") + "content/".length);
    const slash = file.lastIndexOf("/");
    const dir = slash === -1 ? "" : file.slice(0, slash);
    const name = file.slice(slash + 1);
    const arr = map.get(dir) ?? [];
    arr.push({ id: e.id, file, name, title: String(e.data.title), type: (e.data as any).type });
    map.set(dir, arr);
  }
  byDir = map;
  return map;
}

const href = (id: string) => `${BASE}/${id === "index" ? "" : id + "/"}`;
const link = (label: string, h: string, current: string): any => ({
  type: "link",
  label,
  href: h,
  isCurrent: h === current,
  badge: undefined,
  attrs: {},
});
const group = (label: string, entries: any[], collapsed: boolean): any => ({
  type: "group",
  label,
  entries,
  collapsed,
  badge: undefined,
});
const hasCurrent = (entries: any[]): boolean =>
  entries.some((e) => (e.type === "link" ? e.isCurrent : hasCurrent(e.entries)));
const byTitle = (a: Page, b: Page) => a.title.localeCompare(b.title);
const byName = (a: Page, b: Page) => a.name.localeCompare(b.name);

/** Replace the sidebar link with the given href by `make()`; uncollapse ancestors. */
function replaceLink(entries: any[], target: string, make: () => any): boolean {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.type === "link") {
      if (e.href === target) {
        entries[i] = make();
        return true;
      }
    } else if (replaceLink(e.entries, target, make)) {
      e.collapsed = false;
      return true;
    }
  }
  return false;
}

export const onRequest = defineRouteMiddleware(async (context) => {
  const route = context.locals.starlightRoute;
  if (route.id === "" || route.id === "index") {
    const skill = readSkillDownload(import.meta.env.PROD);
    const hero = route.entry.data.hero;
    if (hero) {
      // Resolve on every render: Astro can reuse cached content data after a skill-only rebuild.
      hero.actions = hero.actions.map((action) => action.icon?.type === "icon" && action.icon.name === "download"
        ? { ...action, link: skill?.href ?? "#agent-skill" }
        : action);
    }
  }
  if (!route.hasSidebar) return;
  const entry = route.entry as any;
  const fp = String(entry.filePath).replace(/\\/g, "/");
  const file = fp.slice(fp.lastIndexOf("content/") + "content/".length);
  const parts = file.split("/");
  const current = href(route.id);
  const dirs = await getByDir();
  const pages = (dir: string) => dirs.get(dir) ?? [];
  const find = (dir: string, name: string) => pages(dir).find((p) => p.name === name);
  const sidebar = route.sidebar as any[];

  if (parts[0] === "mods" && parts.length >= 3) {
    const modDir = `mods/${parts[1]}`;
    const overview = find(modDir, "overview.md");
    if (!overview) return;
    replaceLink(sidebar, href(overview.id), () => {
      const entries: any[] = [link("Overview", href(overview.id), current)];
      const fIndex = find(`${modDir}/features`, "index.md");
      if (fIndex) entries.push(link("Features index", href(fIndex.id), current));
      for (const p of pages(`${modDir}/features`).filter((p) => p.name !== "index.md" && p.name !== "log.md").sort(byTitle))
        entries.push(link(p.title, href(p.id), current));
      const subs = pages(`${modDir}/submods`).filter((p) => p.name !== "index.md" && p.name !== "log.md").sort(byTitle);
      if (subs.length) {
        const sIndex = find(`${modDir}/submods`, "index.md");
        const subEntries = [
          ...(sIndex ? [link("Submods index", href(sIndex.id), current)] : []),
          ...subs.map((p) => link(p.title, href(p.id), current)),
        ];
        entries.push(group("Submods", subEntries, !hasCurrent(subEntries)));
      }
      return group(overview.title, entries, false);
    });
  } else if (parts[0] === "howto" && parts.length >= 4) {
    const groupDir = `howto/${parts[1]}/${parts[2]}`;
    const gIndex = find(groupDir, "index.md");
    if (!gIndex) return;
    const topicDirs = [...dirs.keys()].filter((d) => d.startsWith(groupDir + "/") && d.split("/").length === 4);
    const topics = topicDirs
      .map((d) => ({ dir: d, ov: find(d, "overview.md") }))
      .filter((t): t is { dir: string; ov: Page } => Boolean(t.ov))
      .sort((a, b) => a.ov.title.localeCompare(b.ov.title));
    const currentTopicDir = parts.length >= 5 ? parts.slice(0, 4).join("/") : undefined;
    replaceLink(sidebar, href(gIndex.id), () => {
      const entries: any[] = [link("Overview", href(gIndex.id), current)];
      for (const t of topics) {
        if (t.dir !== currentTopicDir) {
          entries.push(link(t.ov.title, href(t.ov.id), current));
          continue;
        }
        const tIndex = find(t.dir, "index.md");
        const sub: any[] = [
          ...(tIndex ? [link("Topic index", href(tIndex.id), current)] : []),
          link("Overview", href(t.ov.id), current),
          ...pages(t.dir)
            .filter((p) => !["index.md", "log.md", "overview.md"].includes(p.name))
            .sort(byName)
            .map((p) => link(p.title, href(p.id), current)),
        ];
        entries.push(group(t.ov.title, sub, false));
      }
      return group(gIndex.title, entries, false);
    });
  }
});
