import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { BASE, SITE_ROOT } from "./okf.ts";

export const SKILL_BUILD_COMMAND = "node scripts/skill_build.ts --tarball site/public/downloads/ksa-modding.tar.gz";

interface SkillDownload {
  filename: string;
  builtAt: string;
  contentRefreshedAt: string;
  gameBuilds: string[];
  href: string;
  size: string;
}

/** The build manifest keeps the filename, UI dates and download links in sync. */
export function readSkillDownload(required: boolean): SkillDownload | undefined {
  const downloads = path.join(SITE_ROOT, "public/downloads");
  const manifest = path.join(downloads, "ksa-modding.json");
  try {
    if (!existsSync(manifest)) throw new Error("missing downloads/ksa-modding.json");
    const data = JSON.parse(readFileSync(manifest, "utf8"));
    if (
      typeof data.filename !== "string" ||
      !/^ksa-modding-\d{4}-\d{2}-\d{2}T\d{6}Z\.tar\.gz$/.test(data.filename) ||
      typeof data.builtAt !== "string" || !Number.isFinite(Date.parse(data.builtAt)) ||
      typeof data.contentRefreshedAt !== "string" || !Number.isFinite(Date.parse(data.contentRefreshedAt)) ||
      !Array.isArray(data.gameBuilds) || !data.gameBuilds.length ||
      !data.gameBuilds.every((build: unknown) => typeof build === "string" && build.length > 0)
    ) throw new Error("invalid skill download metadata");
    const file = path.join(downloads, data.filename);
    const stat = statSync(file);
    if (!stat.isFile() || stat.size === 0) throw new Error(`missing or empty ${data.filename}`);
    return {
      filename: data.filename,
      builtAt: data.builtAt,
      contentRefreshedAt: data.contentRefreshedAt,
      gameBuilds: data.gameBuilds,
      href: `${BASE}downloads/${data.filename}`,
      size: `${(stat.size / 1048576).toFixed(1)} MB`,
    };
  } catch (error) {
    if (required) throw new Error(`${error instanceof Error ? error.message : error}; run \`${SKILL_BUILD_COMMAND}\` before building the site`);
    return undefined;
  }
}

export function formatUtcDate(value: string): string {
  return new Date(value).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}
