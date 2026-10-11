# Brief: refresh pages after an upstream change

You are re-verifying a small, precise set of pages in the KSA modding corpus after a reference mod
or the decompiled game moved to a new commit. You are NOT re-analyzing whole mods. The deterministic
planner (`scripts/content_refresh_plan.ts`) has already re-pinned every page whose cited code is
unchanged; what you get is only the pages where a real diff hunk overlaps a line range the page cites
(or a changed file the page cites without ranges, or a deleted file).

Read first: `docs/content-conventions.md` (frontmatter pins, lifecycle vocabulary, snippet rules) and
the orchestrator's assignment: a list of `content/...` pages plus the change ids (`h-...`/`f-...`)
from `ai/refresh/plan.md` that put them there.

## Per page

1. Read the plan entry for the page: repo, `from..to` commits, the cited ranges that overlap, and the
   hunk text. Get the full context with the command the plan prints:
   `git -C <checkout> diff <from> <to> -- '<path>'`.
2. Read only the parts of the page that cite those ranges (search the page for the path). Decide
   for each claim, snippet and lifecycle statement whether the change alters it.
3. Run `node scripts/content_refresh_plan.ts --accept content/<page>.md`. It moves every pin on the
   page to HEAD, remaps every line anchor and snippet header through the diff, and prints the
   ranges it could only remap approximately (`~L..`). Those printed ranges are your whole edit list.
4. Fix those ranges against HEAD: re-copy snippets verbatim from the new file (path comment first
   line, correct `Lx-Ly`), correct anchors, and rewrite any claim, `lifecycle`, `hooks` or
   `game_types` value the change invalidated. If a cited file was deleted or a member vanished,
   find where it moved (`git -C <checkout> log --follow`, grep the decomp) or rewrite the claim.
5. If the change is large enough that the page's mechanism no longer exists, say so in the page
   (set `status: draft` or `deprecated` per the OKF skill) and report it; do not invent a
   replacement.
6. Set `generated: { by: <your actor>, at: <now UTC> }` on pages you changed materially, and add one
   `**Update**` bullet to the bundle's `log.md` (the mod bundle or the how-to topic) naming the
   commits and what changed.
7. `node scripts/content_check_refs.ts content/<page>.md` must report 0 errors.

How-to pages listed under "How-to pages depending on reviewed features" cite a feature you changed
through `demonstrated_by`. Re-read only the sections that describe that feature's mechanism and fix
them if your feature edit changed the facts; otherwise leave them alone.

## Rules

- Never bump a pin by hand without verifying the cited code; always go through `--accept` or
  `--repin` so anchors are remapped consistently.
- Every snippet stays verbatim from the checkout at the new pin; every engine claim is grepped in
  the decomp at the new pin.
- Touch only the pages you were assigned (and their logs). No git state changes.
- Return at most 200 words: pages fixed, pages marked draft or deprecated, and anything that looks
  like a new feature or a lifecycle-reference change the orchestrator should triage.
