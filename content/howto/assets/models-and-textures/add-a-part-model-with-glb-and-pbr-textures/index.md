# Game Feature

* [Add a part's art with its own GLB model and PBR textures](overview.md) - How modeled or browser-authored geometry becomes a placeable part through named mesh atlases, materials, SubParts and picking meshes

# How-To

* [Build a part from one atlas per vehicle with subparts for moving bodies, glass and hidden doors](add-a-part-model-with-glb-and-pbr-textures-1.md) - Declare a MeshAtlas and a PbrMaterial, one SubPart per rigid or moving body with PartModel and a MeshView twin, a PartModelGlass window, mesh-less hidden subparts and a Part that instances them with Transform positions
* [Import models and author procedural meshes in a browser asset pipeline](add-a-part-model-with-glb-and-pbr-textures-3.md) - Normalize imported or procedural browser geometry into named mesh atlases, material-bearing SubParts and separate picking twins
* [Share one palette atlas across parts, add _VM preview twins and keep subpart ids apart](add-a-part-model-with-glb-and-pbr-textures-2.md) - Eleven GLB atlases, generated parts sharing one flat palette material, hand-modelled parts with a material per body, MeshView _VM twins beside every PartModel and the split between the Assets and GameData files
