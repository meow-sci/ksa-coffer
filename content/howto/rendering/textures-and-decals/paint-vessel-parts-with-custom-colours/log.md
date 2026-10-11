# Recolour vessel parts and kittens with a patched part shader history

## 2026-10-10
* **Creation**: Added the overview and four approaches (7:7:7 colour in state bits with a patched MeshIndirect.frag, runtime-controlled shader transform with EVA material clones, ADD_EMISSIVE_COLOR via a WriteState postfix, heat override via PartModelDynamic.AddInstance) from the unscience, gatOS and KSACars feature pages, checked against `PartTreeRenderData`, `ShaderReference` and `PartModelDynamic` in build 2026.10.10.5554.
* **Update**: Review: added hooks named in the body (`StarMapAllModsLoaded`, `GameViewport.OnFrame` prefix) to the frontmatter.
