#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["pyyaml>=6.0"]
# ///
"""Validate an Open Knowledge Format (OKF v0.2) bundle.

Checks the conformance rules of OKF v0.2 section 11 (errors) and the
producer SHOULDs of sections 4 to 10 (warnings), and emits a catalog of
every concept with its derived trust tier and staleness.

Usage:
  validate_bundle.py BUNDLE_ROOT [--format text|json] [--strict] [--quiet]

Options:
  --format FORMAT  text (default) prints findings grouped by file; json prints
                   a single object with "findings", "catalog", and "summary".
  --strict         exit 1 on warnings as well as errors.
  --quiet          text mode: print only the summary line and errors.

Exit codes:
  0  no errors (and no warnings with --strict)
  1  errors found (or warnings with --strict)
  2  usage error or bundle root not found

Severity levels:
  error    violates a MUST in the spec; the bundle is not conformant.
  warning  violates a SHOULD or a convention consumers depend on.
  info     advisory (missing index.md, unused footnote definition).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write(
        "error: pyyaml is required. Run with `uv run scripts/validate_bundle.py ...` "
        "or `pip install pyyaml`.\n"
    )
    sys.exit(2)

RESERVED = {"index.md", "log.md"}
STATUS_VALUES = {"draft", "stable", "deprecated"}
ACTOR_RE = re.compile(r"^(?:(?:human|process|team):\S+|[^/\s]+/[^/\s]+)$")
SEGMENT_RE = re.compile(r"[A-Za-z0-9_][A-Za-z0-9_.\-]*")
ISO_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$"
)
DATE_HEADING_RE = re.compile(r"^## (\d{4}-\d{2}-\d{2})\s*$")
INDEX_BULLET_RE = re.compile(r"^[*-] \[(?P<title>[^\]]+)\]\((?P<link>[^)\s]+)\)(?: - (?P<desc>.*))?$")
LINK_RE = re.compile(r"(?<!!)\[[^\]]*\]\((?P<target>[^)\s]+)(?:\s+\"[^\"]*\")?\)")
FOOTNOTE_REF_RE = re.compile(r"\[\^([^\]\s]+)\](?!:)")
FOOTNOTE_DEF_RE = re.compile(r"^\[\^([^\]\s]+)\]:", re.MULTILINE)
FENCE_RE = re.compile(r"^(```|~~~).*?^\1[ \t]*$", re.MULTILINE | re.DOTALL)
HEADING_RE = re.compile(r"^#{1,6}\s+(.*)$", re.MULTILINE)
SCHEME_RE = re.compile(r"^[A-Za-z][A-Za-z0-9+.\-]*:")


class _StrLoader(yaml.SafeLoader):
    """SafeLoader that keeps timestamps as the literal text the author wrote."""


_StrLoader.yaml_implicit_resolvers = {
    ch: [(tag, rx) for tag, rx in resolvers if tag != "tag:yaml.org,2002:timestamp"]
    for ch, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}


@dataclass
class Finding:
    severity: str  # error | warning | info
    path: str
    message: str
    rule: str


@dataclass
class Catalog:
    path: str
    id: str
    type: str
    title: Optional[str]
    status: str
    trust_tier: str
    stale: bool
    generated_at: Optional[str]
    description: Optional[str]


@dataclass
class Report:
    findings: List[Finding] = field(default_factory=list)
    catalog: List[Catalog] = field(default_factory=list)

    def add(self, severity: str, path: Path, message: str, rule: str) -> None:
        self.findings.append(Finding(severity, str(path), message, rule))


# ---------------------------------------------------------------------------
# parsing helpers

def split_frontmatter(text: str) -> Tuple[Optional[str], str, Optional[str]]:
    """Return (frontmatter_text, body, error). frontmatter_text is None when absent."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text, None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1:]), None
    return None, text, "unterminated frontmatter block (no closing ---)"


def parse_frontmatter(fm_text: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    try:
        data = yaml.load(fm_text, Loader=_StrLoader)
    except yaml.YAMLError as exc:
        return None, f"invalid YAML in frontmatter: {str(exc).splitlines()[0]}"
    if data is None:
        return {}, None
    if not isinstance(data, dict):
        return None, "frontmatter must be a YAML mapping"
    return data, None


def strip_fences(body: str) -> str:
    return FENCE_RE.sub("", body)


def valid_timestamp(value: Any) -> bool:
    if not isinstance(value, str) or not ISO_RE.match(value.strip()):
        return False
    try:
        datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError:
        return False
    return True


def parse_timestamp(value: Any) -> Optional[datetime]:
    if not valid_timestamp(value):
        return None
    return datetime.fromisoformat(str(value).strip().replace("Z", "+00:00"))


def normalize_verified(fm: Dict[str, Any]) -> List[Dict[str, Any]]:
    v = fm.get("verified")
    if v is None:
        return []
    if isinstance(v, dict):
        return [v]
    if isinstance(v, list):
        return [e for e in v if isinstance(e, dict)]
    return []


def trust_tier(fm: Dict[str, Any]) -> str:
    events = normalize_verified(fm)
    if not events:
        return "unverified"
    if any(str(e.get("by", "")).startswith("human:") for e in events):
        return "human-reviewed"
    return "machine-confirmed"


def is_stale(fm: Dict[str, Any], now: datetime) -> bool:
    ts = parse_timestamp(fm.get("stale_after"))
    return ts is not None and now >= ts


def resolve_link(target: str, file_path: Path, root: Path) -> Optional[Path]:
    """Resolve a markdown link target to a filesystem path, or None if external."""
    target = target.split("#", 1)[0]
    if not target or SCHEME_RE.match(target):
        return None
    if target.startswith("/"):
        return (root / target.lstrip("/")).resolve()
    return (file_path.parent / target).resolve()


# ---------------------------------------------------------------------------
# checks

def check_concept(path: Path, root: Path, report: Report, now: datetime, all_md: set) -> None:
    rel = path.relative_to(root)
    text = path.read_text(encoding="utf-8", errors="replace")
    fm_text, body, err = split_frontmatter(text)
    if err:
        report.add("error", rel, err, "S4.1-frontmatter")
        return
    if fm_text is None:
        report.add("error", rel, "missing YAML frontmatter block (every non-reserved .md must start with ---)", "S11-1")
        return
    fm, err = parse_frontmatter(fm_text)
    if err or fm is None:
        report.add("error", rel, err or "unparseable frontmatter", "S11-1")
        return

    typ = fm.get("type")
    if not isinstance(typ, str) or not typ.strip():
        report.add("error", rel, "frontmatter `type` is missing or empty", "S11-2")
        typ = ""

    for seg in rel.with_suffix("").parts:
        if not SEGMENT_RE.fullmatch(seg):
            report.add("warning", rel, f"path segment {seg!r} is not a safe concept-id segment ([A-Za-z0-9_][A-Za-z0-9_.-]*)", "concept-id")

    title = fm.get("title")
    desc = fm.get("description")
    if title is None:
        report.add("warning", rel, "no `title` (recommended)", "S4.1-title")
    if desc is None:
        report.add("warning", rel, "no `description` (recommended; used verbatim in index.md)", "S4.1-description")
    elif isinstance(desc, str):
        if "\n" in desc.strip():
            report.add("warning", rel, "`description` spans multiple lines; keep it to one sentence", "S4.1-description")
        if len(desc) > 300:
            report.add("warning", rel, f"`description` is {len(desc)} chars; keep it to one short sentence", "S4.1-description")

    if "timestamp" in fm and "generated" not in fm:
        report.add("warning", rel, "v0.1 `timestamp` key found; use `generated: { by, at }`", "S13.1")

    gen = fm.get("generated")
    if gen is None:
        report.add("warning", rel, "no `generated: { by, at }` (recommended trust field)", "S5.2")
    elif not isinstance(gen, dict):
        report.add("warning", rel, "`generated` must be a mapping { by, at }", "S5.2")
    else:
        by = gen.get("by")
        if not by:
            report.add("warning", rel, "`generated.by` is required within `generated`", "S5.2")
        elif not ACTOR_RE.match(str(by)):
            report.add("warning", rel, f"`generated.by` {by!r} does not follow the actor convention (<producer>/<version>, human:<id>, process:<id>)", "S7")
        if "at" in gen and not valid_timestamp(gen.get("at")):
            report.add("warning", rel, f"`generated.at` {gen.get('at')!r} is not ISO 8601 with a UTC offset", "S5-timestamps")

    raw_verified = fm.get("verified")
    if raw_verified is not None and not isinstance(raw_verified, (dict, list)):
        report.add("warning", rel, "`verified` must be a { by, at } mapping or a list of them", "S5.2")
    for i, ev in enumerate(normalize_verified(fm)):
        by = ev.get("by")
        if not by:
            report.add("warning", rel, f"`verified[{i}].by` missing", "S5.2")
        elif not ACTOR_RE.match(str(by)):
            report.add("warning", rel, f"`verified[{i}].by` {by!r} does not follow the actor convention", "S7")
        if not valid_timestamp(ev.get("at")):
            report.add("warning", rel, f"`verified[{i}].at` {ev.get('at')!r} is not ISO 8601 with a UTC offset", "S5-timestamps")

    status = fm.get("status", "stable")
    if status not in STATUS_VALUES:
        report.add("warning", rel, f"`status` {status!r} is not one of draft|stable|deprecated", "S5.4")

    if "stale_after" in fm and not valid_timestamp(fm.get("stale_after")):
        report.add("warning", rel, f"`stale_after` {fm.get('stale_after')!r} is not ISO 8601 with a time and UTC offset; consumers will ignore it", "S5.5")

    source_ids: set = set()
    sources = fm.get("sources")
    if sources is not None:
        if not isinstance(sources, list):
            report.add("warning", rel, "`sources` must be a list of mappings", "S5.1")
            sources = []
        for i, src in enumerate(sources):
            if not isinstance(src, dict):
                report.add("warning", rel, f"`sources[{i}]` must be a mapping", "S5.1")
                continue
            if not src.get("resource"):
                report.add("warning", rel, f"`sources[{i}].resource` is required within a sources entry", "S5.1")
            sid = src.get("id")
            if sid is not None:
                if str(sid) in source_ids:
                    report.add("warning", rel, f"duplicate `sources[].id` {sid!r}", "S5.1")
                source_ids.add(str(sid))
            if "author" in src and not ACTOR_RE.match(str(src["author"])):
                report.add("warning", rel, f"`sources[{i}].author` {src['author']!r} does not follow the actor convention", "S7")
            if "last_modified" in src and not valid_timestamp(src["last_modified"]):
                report.add("warning", rel, f"`sources[{i}].last_modified` is not ISO 8601 with a UTC offset", "S5-timestamps")
            if "usage_count" in src and not isinstance(src["usage_count"], int):
                report.add("warning", rel, f"`sources[{i}].usage_count` should be an integer", "S5.1")
    for key in ("usage_window",):
        uw = fm.get(key)
        if uw is not None:
            if not isinstance(uw, dict) or not valid_timestamp(uw.get("from")) or not valid_timestamp(uw.get("to")):
                report.add("warning", rel, "`usage_window` must be { from, to } ISO 8601 datetimes", "S5.1")

    prose = strip_fences(body)
    refs = set(FOOTNOTE_REF_RE.findall(prose))
    defs = set(FOOTNOTE_DEF_RE.findall(body))
    for label in sorted(refs):
        if label not in source_ids:
            report.add("warning", rel, f"footnote [^{label}] has no matching `sources[].id`", "S5.1-footnotes")
        if label not in defs:
            report.add("warning", rel, f"footnote [^{label}] is referenced but never defined", "S5.1-footnotes")
    for label in sorted(defs - refs):
        report.add("info", rel, f"footnote definition [^{label}] is never referenced", "S5.1-footnotes")

    for heading in HEADING_RE.findall(prose):
        if heading.strip().lower().rstrip(":") == "citations":
            report.add("warning", rel, "body has a `# Citations` section (v0.1); move provenance to `sources`", "S13.1")
        if LINK_RE.search(heading):
            report.add("info", rel, f"link inside heading {heading.strip()!r}; avoid links in headings", "style-links")

    for m in LINK_RE.finditer(prose):
        target = m.group("target")
        resolved = resolve_link(target, path, root)
        if resolved is None:
            continue
        if resolved == path.resolve():
            report.add("info", rel, "concept links to itself", "style-links")
            continue
        if not resolved.exists():
            report.add("warning", rel, f"broken link target {target!r}", "S6.1-links")

    if typ == "Attested Computation":
        if not fm.get("runtime"):
            report.add("warning", rel, "`runtime` is required for type Attested Computation", "S10.2")
        comp_sections = [h for h in HEADING_RE.findall(body) if h.strip().lower() == "computation"]
        has_file = bool(fm.get("computation"))
        if not comp_sections and not has_file:
            report.add("warning", rel, "no `# Computation` section and no `computation:` path", "S10.3")
        if comp_sections and has_file:
            report.add("info", rel, "both a `# Computation` section and a `computation:` path; the file takes precedence", "S10.3")
        params = fm.get("parameters")
        if params is not None:
            if not isinstance(params, list):
                report.add("warning", rel, "`parameters` must be a list of { name, type, required }", "S10.2")
            else:
                for i, p in enumerate(params):
                    if not isinstance(p, dict) or not p.get("name"):
                        report.add("warning", rel, f"`parameters[{i}]` must be a mapping with at least `name`", "S10.2")
        for key in ("executor", "attester"):
            val = fm.get(key)
            if val is not None and (not isinstance(val, dict) or not val.get("resource")):
                report.add("warning", rel, f"`{key}` must be a mapping with `resource`", "S10.2")
    elif any(k in fm for k in ("runtime", "executor", "attester")):
        report.add("info", rel, "computation keys present on a concept that is not `type: Attested Computation`", "S10")

    report.catalog.append(
        Catalog(
            path=str(rel),
            id=str(rel.with_suffix("")).replace(os.sep, "/"),
            type=str(typ),
            title=str(title) if title is not None else None,
            status=str(status),
            trust_tier=trust_tier(fm),
            stale=is_stale(fm, now),
            generated_at=str(gen.get("at")) if isinstance(gen, dict) and gen.get("at") else None,
            description=str(desc) if desc is not None else None,
        )
    )


def check_index(path: Path, root: Path, report: Report, descriptions: Dict[Path, str]) -> None:
    rel = path.relative_to(root)
    text = path.read_text(encoding="utf-8", errors="replace")
    fm_text, body, err = split_frontmatter(text)
    if err:
        report.add("error", rel, err, "S8")
        return
    if fm_text is not None:
        fm, perr = parse_frontmatter(fm_text)
        if perr or fm is None:
            report.add("error", rel, perr or "unparseable frontmatter in index.md", "S8")
        elif path.parent.resolve() != root.resolve():
            report.add("error", rel, "index.md must not have frontmatter (only the bundle root may declare okf_version)", "S8")
        elif set(fm) - {"okf_version"}:
            report.add("error", rel, f"root index.md frontmatter may only contain okf_version, found {sorted(fm)}", "S12")
    saw_heading = False
    for lineno, line in enumerate(body.splitlines(), start=1 + (fm_text.count("\n") + 3 if fm_text is not None else 0)):
        s = line.rstrip()
        if not s:
            continue
        if s.startswith("# "):
            saw_heading = True
            continue
        m = INDEX_BULLET_RE.match(s)
        if m:
            if not saw_heading:
                report.add("warning", rel, f"line {lineno}: entry appears before any `# Heading` section", "S8")
            link = m.group("link")
            target = resolve_link(link, path, root)
            if target is not None:
                if not target.exists():
                    report.add("warning", rel, f"line {lineno}: entry links to missing {link!r}", "S8")
                else:
                    concept = target
                    if target.is_dir():
                        concept = None
                    elif target.name == "index.md":
                        concept = None
                    if concept is not None and concept.suffix == ".md":
                        expected = descriptions.get(concept.resolve())
                        given = (m.group("desc") or "").strip()
                        if expected is not None and given and given != expected.strip():
                            report.add("info", rel, f"line {lineno}: description for {link!r} differs from the concept's frontmatter description", "S8-descriptions")
                        if expected and not given:
                            report.add("info", rel, f"line {lineno}: entry for {link!r} has no description", "S8-descriptions")
            continue
        report.add("warning", rel, f"line {lineno}: not a heading or `* [Title](link) - description` bullet: {s[:60]!r}", "S8")


def check_log(path: Path, root: Path, report: Report) -> None:
    rel = path.relative_to(root)
    text = path.read_text(encoding="utf-8", errors="replace")
    fm_text, body, err = split_frontmatter(text)
    if err:
        report.add("error", rel, err, "S9")
        return
    if fm_text is not None:
        _, perr = parse_frontmatter(fm_text)
        if perr:
            report.add("error", rel, perr, "S9")
    dates: List[str] = []
    for line in body.splitlines():
        if line.startswith("## "):
            m = DATE_HEADING_RE.match(line)
            if not m:
                report.add("error", rel, f"log heading {line.strip()!r} is not an ISO 8601 `## YYYY-MM-DD` date", "S9")
                continue
            try:
                datetime.strptime(m.group(1), "%Y-%m-%d")
            except ValueError:
                report.add("error", rel, f"log heading {line.strip()!r} is not a valid calendar date", "S9")
                continue
            dates.append(m.group(1))
    if dates != sorted(dates, reverse=True):
        report.add("warning", rel, "log date sections are not in newest-first order", "S9")
    if not dates:
        report.add("info", rel, "log.md has no `## YYYY-MM-DD` sections", "S9")
    for m in LINK_RE.finditer(strip_fences(body)):
        resolved = resolve_link(m.group("target"), path, root)
        if resolved is not None and not resolved.exists():
            report.add("warning", rel, f"broken link target {m.group('target')!r}", "S6.1-links")


# ---------------------------------------------------------------------------
# driver

def iter_md(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
        for name in sorted(filenames):
            if name.endswith(".md"):
                yield Path(dirpath) / name


def validate(root: Path) -> Report:
    report = Report()
    now = datetime.now(timezone.utc)
    files = list(iter_md(root))
    all_md = {p.resolve() for p in files}
    concepts = [p for p in files if p.name not in RESERVED]
    for p in concepts:
        check_concept(p, root, report, now, all_md)
    descriptions = {
        (root / c.path).resolve(): c.description for c in report.catalog if c.description is not None
    }
    for p in files:
        if p.name == "index.md":
            check_index(p, root, report, descriptions)
        elif p.name == "log.md":
            check_log(p, root, report)
    dirs_with_concepts = {p.parent for p in concepts}
    for d in sorted(dirs_with_concepts):
        cur = d
        while True:
            if not (cur / "index.md").exists():
                report.add("info", cur.relative_to(root) if cur != root else Path("."), "directory has no index.md (consumers may synthesize one; producers should ship it)", "S8-missing-index")
            if cur == root:
                break
            cur = cur.parent
    # dedupe
    seen = set()
    unique: List[Finding] = []
    for f in report.findings:
        key = (f.severity, f.path, f.message)
        if key not in seen:
            seen.add(key)
            unique.append(f)
    report.findings = unique
    return report


def main(argv: Optional[List[str]] = None) -> int:
    ap = argparse.ArgumentParser(description="Validate an OKF v0.2 bundle.", formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__.split("Usage:")[0])
    ap.add_argument("bundle_root", help="directory containing the bundle (the one whose index.md lists the top-level groups)")
    ap.add_argument("--format", choices=("text", "json"), default="text")
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors for the exit code")
    ap.add_argument("--quiet", action="store_true", help="text mode: only errors and the summary")
    args = ap.parse_args(argv)

    root = Path(args.bundle_root)
    if not root.is_dir():
        sys.stderr.write(f"error: bundle root {root} is not a directory\n")
        return 2
    report = validate(root)
    counts = {"error": 0, "warning": 0, "info": 0}
    for f in report.findings:
        counts[f.severity] += 1
    summary = {"concepts": len(report.catalog), **counts}

    if args.format == "json":
        json.dump(
            {"bundle_root": str(root), "summary": summary, "findings": [asdict(f) for f in report.findings], "catalog": [asdict(c) for c in report.catalog]},
            sys.stdout,
            indent=2,
        )
        sys.stdout.write("\n")
    else:
        order = {"error": 0, "warning": 1, "info": 2}
        by_path: Dict[str, List[Finding]] = {}
        for f in sorted(report.findings, key=lambda f: (f.path, order[f.severity])):
            if args.quiet and f.severity != "error":
                continue
            by_path.setdefault(f.path, []).append(f)
        for p, fs in by_path.items():
            print(p)
            for f in fs:
                print(f"  {f.severity:7} {f.message}  [{f.rule}]")
        print(
            f"{summary['concepts']} concepts, {counts['error']} errors, {counts['warning']} warnings, {counts['info']} info"
        )
    failed = counts["error"] > 0 or (args.strict and counts["warning"] > 0)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
