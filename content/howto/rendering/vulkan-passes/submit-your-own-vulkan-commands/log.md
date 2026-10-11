# Record and submit your own Vulkan work history

## 2026-10-10
* **Creation**: Added the overview and four approaches (private one-shot command buffer and fence, command pool with fence ring, transient pool for thumbnails and readback, private images with runtime GLSL) from the unscience and purrtty feature pages, checked against build 2026.10.10.5554.
* **Update**: Review: reworded the same-queue ordering claim in approach 2 (no semaphore or barrier links the mod submit to the frame submit).
