import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { unified } from "@astrojs/markdown-remark";
import { BASE as base, buildSidebar, CONTENT_ROOT, REPO_ROOT } from "./src/lib/okf.ts";
import remarkOkfLinks from "./src/plugins/remark-okf-links.ts";

export default defineConfig({
  site: "https://meow.science.fail",
  base,
  integrations: [
    starlight({
      title: "KSA Coffer",
      description:
        "A knowledge corpus for building Kitten Space Agency mods: how-to articles and analyzed community mods.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/meow-sci/ksa-coffer" }],
      // entry.filePath is "../content/<path>" relative to site/, so "site/" + "../content" resolves to content/.
      editLink: { baseUrl: "https://github.com/meow-sci/ksa-coffer/edit/main/site/" },
      sidebar: buildSidebar(),
      pagination: false,
      lastUpdated: false,
      routeMiddleware: "./src/routeMiddleware.ts",
      components: {
        PageTitle: "./src/components/PageTitle.astro",
        MarkdownContent: "./src/components/MarkdownContent.astro",
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        [
          remarkOkfLinks,
          {
            base,
            contentRoot: CONTENT_ROOT,
            repoRoot: REPO_ROOT,
            repoBlobUrl: "https://github.com/meow-sci/ksa-coffer/blob/main",
          },
        ],
      ],
    }),
  },
  vite: { server: { fs: { allow: [REPO_ROOT] } } },
});
