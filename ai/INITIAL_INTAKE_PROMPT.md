you have access to the full ksa game decompiled sources at /Users/asherwin/repos/meow-sci/ksa-game-assemblies for reference

the references/ folder relative to this repo root holds a git repo checkout of various ksa mods

data/references.yml details a list of all the repositories as well with a bit of metadata

your job is to:

- fill in the content/mods/ folder with a okf bundle for each mod which contains
  - general information about
  - features the mod provides, with metadata such as code links and simple snippets that refer back to the mod's source code, always relative to the given mod repo root
- fill in the content/howto/ folder with a okf bundle for each how-to articles which contains
  - a brief description of the fiven ksa game feature this howto article
  - instructions, with code snippets and references to relevant mod features or source code, always relative to the given mod repo root for code references
  - detailed information and snippets that illustrate how to implement a given feature in ksa

the over arching goal i have for this task is to analyze, learn, glean, and extract relevant information from the decompiled game sources and game mod original sources

community members are each figuring out how to do independent, novel things with the game, and I want to provide a central repository of knowledge that can be used to help others learn and implement their own mods or features

the game uses a bespoke game engine just for ksa with a vulkan rendering backend so no existing game engine documentation will be directly applicable, and the decompiled sources are the only way to understand how the game works under the hood

your task is to catalog all the novel things that each mod does, per-mod, and then pivot to looking at them from a per-feature lens (not tied to a specific mod) and create a howto article about that particular feature

this can be all kinds of things like how to draw lines on the sky (ohmystars), how to do interesting things in imgui windows, how to implement wheel physics, how to add models and textures to the game, how to add or modify shaders, etc.

there may be multiple solutions to a given problem, and the goal is to catalog all of them and provide a central reference for the community to learn from

if there are multiple implementations of a given feature, suffix it with a number to differentiate them (e.g., "howto_feature_1", "howto_feature_2", etc.)

use sensible common names for the features so they are obvious and self descriptive

ensure that the okf bundle format used to describe each mod and howto article is okf compliant, AND, organized such that it will be easy or trivial (little to no changes needed) to also reuse that content in a astro starlight static documentation site (a later task, DO NOT do this now, just be cognizant of this reuse of the produced data)

this is a VERY LARGE SCALE task.

you are the orchestrator, you may use a tier of subagents to survey, research and write the documentation as needed.  i may suggest two tiers of subagents if you can support that where tier 1 is the research coordinators and tier 2 is the workers that do the deep research and report back, and tier 1 can also launch tier 2 workers to write docs

the subagents can be opus 5.5 / xhigh when reasoning is needed and opus 5.5 / high for less reasoning intensive tasks

be thorough, use critical review subagents with opus 5.5 / xhigh after each okf bundle is supposedly done to ensure it has a high quality bar

each root okf bundle for both the mods AND the howto articles should contain a custom frontmatter data array which is the referenced repositories inside the bundle and the repo ref (so the git uri and repo ref hash), so later refreshes of knowledge can simply look at the updated reference git repo checkouts to see if they have changed, and know which okf doc bundles (mods or howto) are impacted so they can be re-analyzed, and the actual content in the mod and hotwo articles should similarly link to referenced source code paths in those repos using relative paths from the repo roots so that later doc refreshes can be efficient

use good judgement to be thorough in surveying each mod to discover all of its novel features so we get broad coverage of all possible features for our howto articles

