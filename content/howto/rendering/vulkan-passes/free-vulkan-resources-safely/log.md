# Free mod-owned Vulkan resources without device loss history

## 2026-10-10
* **Creation**: Added the overview and three approaches (detach now and free two frames later, counter-based retire queue, publish after fence and retire after idle) from the purrtty, gatOS and unscience feature pages, checked against `Renderer`, `ImGuiBackendVulkanImpl`, `ImageEx` and `Program.Dispose` in build 2026.10.10.5554.
* **Update**: Review: added the `GameViewport.OnFrame` prefix hook to approach 2 and the `ExecuteNextClothSolvers`-style hooks named in the body to the frontmatter.
