# Declare a dependency on another StarMap mod, required or optional history

## 2026-10-10
* **Creation**: Added [Declare a dependency on another StarMap mod, required or optional](overview.md) (engine background, approach comparison) and 3 how-to articles: [Declare a required dependency with ImportedAssemblies](declare-a-mod-dependency-1.md), [Make a dependency optional and ship a vendored fallback copy of the contract](declare-a-mod-dependency-2.md), [Probe for another mod at AllModsLoaded and stand down when a conflicting one is present](declare-a-mod-dependency-3.md). Verified against the decompiled game build 2026.10.10.5554 and the pinned reference repositories.
* **Update**: Review fix in [Declare a required dependency with ImportedAssemblies](declare-a-mod-dependency-1.md): the generated mod.toml snippet is now labelled as adapted from the CopyOutput.targets output shape.
