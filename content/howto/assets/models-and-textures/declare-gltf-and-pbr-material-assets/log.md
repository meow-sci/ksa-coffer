# Declare glTF meshes and PBR materials in asset XML and author their texture sets history

## 2026-10-13

* **Update**: Independent source review checked UNORM KTX2, ORM packing, normal conversion, emissive painting and ramp baking against the pinned encoder and native shader; no content defect found.

* **Update**: Added [Author PBR textures and bake emissive paint into native material assets](declare-gltf-and-pbr-material-assets-5.md) from the independently reviewed Flexo mechanisms, with source-backed implementation steps and explicit browser/native validation limits; updated the approach comparison and source pins.

## 2026-10-10
* **Update**: Independent review of the topic against the decompiled build 2026.10.10.5554 and the pinned mod checkouts. Cited `cotangent_frame` in `SharedFrag.glsl` for the NaN-tangent explanation; overview `demonstrated_by` is now the union of the articles. Link text of cross references now names the target article, unresolved topic placeholders became links and truncated snippets are marked with an elision.
* **Creation**: Added [Declare bare GltfFile and PbrMaterial assets and pair them by id in code](declare-gltf-and-pbr-material-assets-1.md), [Bake diffuse, normal, ORM and emissive maps from Blender and dilate the atlas](declare-gltf-and-pbr-material-assets-2.md), [Generate a flat-swatch palette atlas with a JSON swatch map](declare-gltf-and-pbr-material-assets-3.md), [Emit flat-colour textures from the same script that generates the geometry](declare-gltf-and-pbr-material-assets-4.md), [Declare glTF meshes and PBR materials in asset XML and author their texture sets](overview.md). Four approaches: bare GltfFile and PbrMaterial, baked PBR sets with atlas dilation, a generated flat-swatch palette, and generated flat-colour textures. Verified against the decompiled game build 2026.10.10.5554 and the pinned mod checkouts.
