import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { z } from "astro/zod";
import { BASE, dirDescription, dirTitle } from "./lib/okf.ts";

const loose = z.any().optional();

/** Wraps the glob loader so title-less index.md / log.md files get frontmatter. */
function okfLoader() {
  const inner = glob({ pattern: "**/*.md", base: "../content" });
  return {
    ...inner,
    name: "okf-loader",
    load: (ctx: any) =>
      inner.load({
        ...ctx,
        parseData: (opts: any) => {
          const data = opts.data ?? {};
          if (data.title) return ctx.parseData(opts);
          const file = String(opts.filePath ?? "").replace(/\\/g, "/");
          const rel = file.slice(file.lastIndexOf("/content/") + "/content/".length);
          const slash = rel.lastIndexOf("/");
          const dir = slash === -1 ? "" : rel.slice(0, slash);
          const name = rel.slice(slash + 1);
          let extra: Record<string, unknown> = {};
          if (name === "index.md" && dir === "") {
            extra = {
              title: "KSA Coffer",
              description:
                "A knowledge corpus for building Kitten Space Agency mods: how-to articles and analyzed community mods",
              template: "splash",
              hero: {
                tagline:
                  "A knowledge corpus for building Kitten Space Agency mods: how-to articles and analyzed community mods",
                // Starlight does not prefix hero action links with the base path.
                actions: [
                  { text: "Browse how-to articles", link: `${BASE}howto/`, icon: "right-arrow", variant: "primary" },
                  { text: "Browse analyzed mods", link: `${BASE}mods/`, variant: "minimal" },
                  // The route middleware resolves this to the current dated archive at render time.
                  { text: "Download agent skill", link: "#agent-skill", icon: "download", variant: "secondary" },
                  { text: "Source mods", link: "#source-mods", variant: "minimal" },
                ],
              },
            };
          } else if (name === "index.md") {
            extra = { title: dirTitle(dir) };
            const d = dirDescription(dir);
            if (d) extra.description = d;
          } else if (name === "log.md") {
            extra = { title: `Change log: ${dirTitle(dir)}`, pagefind: false };
          }
          return ctx.parseData({ ...opts, data: { ...data, ...extra } });
        },
      }),
  };
}

export const collections = {
  docs: defineCollection({
    loader: okfLoader(),
    schema: docsSchema({
      extend: z.object({
        type: loose,
        status: loose,
        difficulty: loose,
        mod: loose,
        category: loose,
        group: loose,
        topic: loose,
        demonstrated_by: loose,
        repo: z.string().optional(),
        author: z.string().optional(),
        license: z.string().optional(),
      }),
    }),
  }),
};
