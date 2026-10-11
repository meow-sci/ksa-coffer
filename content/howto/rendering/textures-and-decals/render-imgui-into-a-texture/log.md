# Render ImGui UI into a Vulkan texture for use in the 3D world history

## 2026-10-10
* **Creation**: Added the overview and three approaches (secondary ImGui context with a second backend, bindless re-point to a viewport image, world-space quad with ray-pick focus) from the purrtty and KSAStructures feature pages, checked against `ImGuiBackendVulkanImpl`, `ViewportRegistry` and `BindlessTextureLibrary` in build 2026.10.10.5554.
* **Update**: Review: added the `StarMapAllModsLoaded` hook to approach 1.
