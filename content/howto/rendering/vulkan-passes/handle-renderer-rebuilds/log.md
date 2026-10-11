# Recreate mod render targets when KSA rebuilds its renderer history

## 2026-10-10
* **Creation**: Added the overview and three approaches (postfix on `Program.RebuildRenderer`, in-place rebuild on a live size change, re-entering a private construction scope around `RebuildFrameResources`) from the ShaderExtensions, purrtty and unscience feature pages, checked against `Program.RebuildRenderer` and `Renderer.ExtentOverride` in build 2026.10.10.5554.
* **Update**: Review: added the `Universe.ExecuteNextClothSolvers` prefix named in approach 3 to the frontmatter.
