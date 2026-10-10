#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["pyyaml>=6.0"]
# ///
"""Regenerate index.md files for an Open Knowledge Format (OKF v0.2) bundle.

For every directory that contains concepts (directly or below), writes an
index.md following OKF section 8: one `# <Type>` section per concept type
(alphabetical), entries sorted by title, then a `# Subdirectories` section
listing child directories. Entry descriptions come from each concept's
frontmatter `description`. Subdirectory descriptions are preserved from the
existing index.md when present, otherwise taken from the sole concept in that
directory, otherwise left blank (reported on stderr so you can fill them in
with --dir-description).

Usage:
  build_indexes.py BUNDLE_ROOT [--check] [--dry-run] [--bullet '*'|'-']
                   [--dir-description PATH=TEXT ...]

Options:
  --check                 do not write; exit 1 if any index.md is missing or
                          differs from the generated content.
  --dry-run               do not write; print the generated content of every
                          index that would change.
  --bullet CHAR           bullet marker, '*' (default, spec) or '-'.
  --dir-description P=T   description for subdirectory P (bundle-relative,
                          e.g. tables=BigQuery tables the bundle grounds against).
                          Repeatable. Overrides the preserved description.

Exit codes:
  0  success (or --check with no differences)
  1  --check found differences
  2  usage error or bundle root not found
"""
from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write(
        "error: pyyaml is required. Run with `uv run scripts/build_indexes.py ...` "
        "or `pip install pyyaml`.\n"
    )
    sys.exit(2)

RESERVED = {"index.md", "log.md"}
BULLET_RE = re.compile(r"^[*-] \[(?P<title>[^\]]+)\]\((?P<link>[^)\s]+)\)(?: - (?P<desc>.*))?$")


class _StrLoader(yaml.SafeLoader):
    pass


_StrLoader.yaml_implicit_resolvers = {
    ch: [(tag, rx) for tag, rx in resolvers if tag != "tag:yaml.org,2002:timestamp"]
    for ch, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}


def split_frontmatter(text: str) -> Tuple[Optional[str], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1:])
    return None, text


def load_frontmatter(path: Path) -> Optional[dict]:
    fm_text, _ = split_frontmatter(path.read_text(encoding="utf-8", errors="replace"))
    if fm_text is None:
        return None
    try:
        data = yaml.load(fm_text, Loader=_StrLoader)
    except yaml.YAMLError:
        return None
    return data if isinstance(data, dict) else None


def existing_subdir_descriptions(index_path: Path) -> Dict[str, str]:
    """Map child directory name -> description from an existing index.md."""
    out: Dict[str, str] = {}
    if not index_path.exists():
        return out
    _, body = split_frontmatter(index_path.read_text(encoding="utf-8", errors="replace"))
    for line in body.splitlines():
        m = BULLET_RE.match(line.rstrip())
        if not m:
            continue
        link = m.group("link")
        name = None
        if link.endswith("/index.md"):
            name = link[: -len("/index.md")]
        elif link.endswith("/"):
            name = link[:-1]
        if name and "/" not in name and m.group("desc"):
            out[name] = m.group("desc").strip()
    return out


def existing_root_frontmatter(index_path: Path) -> Optional[str]:
    if not index_path.exists():
        return None
    fm_text, _ = split_frontmatter(index_path.read_text(encoding="utf-8", errors="replace"))
    return fm_text


def dirs_to_index(root: Path) -> List[Path]:
    dirs = set()
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        if any(f.endswith(".md") and f not in RESERVED for f in filenames):
            cur = Path(dirpath)
            while True:
                dirs.add(cur)
                if cur == root:
                    break
                cur = cur.parent
    # deepest first so subdirectory descriptions are known before parents
    return sorted(dirs, key=lambda p: (-len(p.relative_to(root).parts), str(p)))


def render(sections: List[Tuple[str, List[Tuple[str, str, str]]]], bullet: str, fm_text: Optional[str]) -> str:
    parts: List[str] = []
    if fm_text is not None:
        parts.append(f"---\n{fm_text}\n---\n")
    blocks = []
    for heading, entries in sections:
        lines = [f"# {heading}", ""]
        for title, link, desc in entries:
            suffix = f" - {desc}" if desc else ""
            lines.append(f"{bullet} [{title}]({link}){suffix}")
        blocks.append("\n".join(lines))
    parts.append("\n\n".join(blocks) + "\n")
    return "\n".join(parts) if fm_text is not None else parts[0]


def main(argv: Optional[List[str]] = None) -> int:
    ap = argparse.ArgumentParser(description="Regenerate OKF index.md files.", formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__.split("Usage:")[0])
    ap.add_argument("bundle_root", help="directory containing the bundle (the one whose index.md lists the top-level groups)")
    ap.add_argument("--check", action="store_true", help="do not write; exit 1 if any index.md is missing or out of date")
    ap.add_argument("--dry-run", action="store_true", help="do not write; print the generated content of every index that would change")
    ap.add_argument("--bullet", choices=("*", "-"), default="*", help="bullet marker for entries (default: *)")
    ap.add_argument("--dir-description", action="append", default=[], metavar="PATH=TEXT", help="description for a subdirectory, bundle-relative (repeatable, overrides preserved text)")
    args = ap.parse_args(argv)

    root = Path(args.bundle_root)
    if not root.is_dir():
        sys.stderr.write(f"error: bundle root {root} is not a directory\n")
        return 2

    overrides: Dict[str, str] = {}
    for item in args.dir_description:
        if "=" not in item:
            sys.stderr.write(f"error: --dir-description expects PATH=TEXT, got {item!r}\n")
            return 2
        p, t = item.split("=", 1)
        overrides[p.strip("/").replace(os.sep, "/")] = t.strip()

    dir_desc: Dict[Path, str] = {}
    changed: List[Path] = []
    missing_desc: List[str] = []

    for directory in dirs_to_index(root):
        index_path = directory / "index.md"
        preserved = existing_subdir_descriptions(index_path)
        by_type: Dict[str, List[Tuple[str, str, str]]] = {}
        subdirs: List[Tuple[str, str, str]] = []
        for child in sorted(directory.iterdir()):
            if child.name.startswith("."):
                continue
            if child.is_file() and child.suffix == ".md" and child.name not in RESERVED:
                fm = load_frontmatter(child)
                if fm is None:
                    sys.stderr.write(f"warning: skipping {child.relative_to(root)}: no parseable frontmatter\n")
                    continue
                typ = str(fm.get("type") or "Other")
                title = str(fm.get("title") or child.stem)
                desc = str(fm.get("description") or "").strip().replace("\n", " ")
                by_type.setdefault(typ, []).append((title, child.name, desc))
            elif child.is_dir() and (child in dir_desc or (child / "index.md").exists()):
                # a directory with concepts below it, or a code-only directory that ships its own index.md
                rel = child.relative_to(root).as_posix()
                desc = overrides.get(rel) or preserved.get(child.name) or dir_desc.get(child, "")
                if not desc:
                    missing_desc.append(rel)
                subdirs.append((child.name, f"{child.name}/index.md", desc))
        sections: List[Tuple[str, List[Tuple[str, str, str]]]] = []
        for typ in sorted(by_type):
            sections.append((typ, sorted(by_type[typ], key=lambda e: e[0].lower())))
        if subdirs:
            sections.append(("Subdirectories", sorted(subdirs, key=lambda e: e[0].lower())))
        if not sections:
            continue

        # description this directory contributes to its parent's index
        all_entries = [e for _, es in sections for e in es]
        if len(all_entries) == 1 and all_entries[0][2]:
            dir_desc[directory] = all_entries[0][2]
        else:
            dir_desc[directory] = ""  # parent falls back to preserved/override

        fm_text = existing_root_frontmatter(index_path) if directory == root else None
        content = render(sections, args.bullet, fm_text)
        current = index_path.read_text(encoding="utf-8") if index_path.exists() else None
        if current == content:
            continue
        changed.append(index_path)
        if args.dry_run:
            print(f"--- {index_path.relative_to(root) if directory != root else 'index.md'}")
            print(content)
        elif not args.check:
            index_path.write_text(content, encoding="utf-8")

    for rel in sorted(set(missing_desc)):
        sys.stderr.write(f"warning: no description for subdirectory {rel!r}; pass --dir-description {rel}=...\n")

    if args.check:
        for p in changed:
            print(f"out of date: {p.relative_to(root) if p.parent != root else 'index.md'}")
        print(f"{len(changed)} index file(s) out of date")
        return 1 if changed else 0
    if not args.dry_run:
        for p in changed:
            print(f"wrote {p.relative_to(root) if p.parent != root else 'index.md'}")
        print(f"{len(changed)} index file(s) written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
