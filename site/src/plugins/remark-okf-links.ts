// Rewrites OKF file-relative `.md` links to site routes and demotes h1 in title-less files.
import path from "node:path";
import { fileURLToPath } from "node:url";

interface Options {
  base: string; // e.g. "/ksa-coffer/"
  contentRoot: string; // absolute path of content/
  repoRoot: string; // absolute path of the repo
  repoBlobUrl: string; // e.g. "https://github.com/meow-sci/ksa-coffer/blob/main"
}

const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|#|\/|\?)/i;

function walk(node: any, fn: (n: any) => void) {
  fn(node);
  if (node.children) for (const c of node.children) walk(c, fn);
}

export default function remarkOkfLinks(options: Options) {
  const base = options.base.endsWith("/") ? options.base : options.base + "/";
  const contentRoot = path.resolve(options.contentRoot);
  const repoRoot = path.resolve(options.repoRoot);

  return (tree: any, file: any) => {
    let filePath: string | undefined = file.path;
    if (filePath?.startsWith("file:")) filePath = fileURLToPath(filePath);
    if (!filePath) return;
    const fileDir = path.dirname(filePath);
    const titled = Boolean(file.data?.astro?.frontmatter?.title);

    walk(tree, (node) => {
      if (node.type === "heading" && node.depth === 1 && !titled) node.depth = 2;
      if ((node.type !== "link" && node.type !== "definition") || typeof node.url !== "string") return;
      const url: string = node.url;
      if (!url || ABSOLUTE.test(url)) return;
      const hashAt = url.search(/[#?]/);
      const target = hashAt === -1 ? url : url.slice(0, hashAt);
      const suffix = hashAt === -1 ? "" : url.slice(hashAt);
      if (!target) return;
      const abs = path.resolve(fileDir, decodeURI(target));
      const relContent = path.relative(contentRoot, abs);
      if (!relContent.startsWith("..") && !path.isAbsolute(relContent) && abs.endsWith(".md")) {
        let route = relContent.split(path.sep).join("/").replace(/\.md$/, "");
        if (route === "index") route = "";
        else if (route.endsWith("/index")) route = route.slice(0, -"/index".length);
        node.url = base + (route ? route + "/" : "") + suffix;
      } else {
        const relRepo = path.relative(repoRoot, abs).split(path.sep).join("/");
        node.url = `${options.repoBlobUrl}/${relRepo}${suffix}`;
      }
    });
  };
}
