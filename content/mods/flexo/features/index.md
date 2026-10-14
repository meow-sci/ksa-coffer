# Mod Feature

* [Assemble parts from the built-in SubPart catalog](builtin-part-composition.md) - Resolve Core assets and GameData into reusable SubPart templates and complete editable part assemblies
* [Asset pipeline and regression tooling](asset-pipeline-and-regression-tooling.md) - Supply a private KSA catalog to browser builds and exercise parsers and workflows with fixtures, unit tests and smoke tools
* [Author collision shapes and inspect sampled coverage](collider-authoring-and-coverage.md) - Normalize collision data by owner and measure where analytic or convex hull shapes leave visual geometry uncovered
* [Author connectors and scoped resource feed wiring](connector-and-feed-authoring.md) - Preserve attachment flags, connector capabilities and placement-scoped feed targets in a data-only part
* [Author hierarchical part animation with an explicit rest anchor](keyframe-animation-authoring.md) - Represent hinges, member SubParts and keyframe poses without conflating the modeled assembly with the start of a clip
* [Author IVA seats and interior visibility](iva-seat-authoring.md) - Convert editable seat rotations into explicit camera axes and preserve reversible interior-export choices
* [Author mass shapes, tanks and power GameData](mass-and-resource-authoring.md) - Represent inert mass and resource modules as editable native schemas with source-aware mass estimates
* [Author part and SubPart cast lights](cast-light-authoring.md) - Serialize native point and spot lights with owner-aware transforms and explicit preview diagnostics
* [Bake kitten geometry into static part assets](kitten-pose-baking.md) - Reuse character meshes as browser reference figures or static SubParts by baking bind-pose geometry and attachment transforms
* [Bridge KSA transforms to a three.js editor](coordinate-transform-bridge.md) - Keep authoring data in KSA space and centralize Euler-order conversion plus explicit XML defaults
* [Build KSA material channels and KTX2 textures in the browser](material-and-ktx2-pipeline.md) - Convert images and scalar surface choices into explicit diffuse, normal and packed ORM KTX2 textures
* [Command registry and mode routing](command-registry-and-mode-routing.md) - Share browser commands across menus, palettes and shortcuts while keeping editor mode transitions outside document undo
* [Create primitive meshes with per-face surfaces](procedural-mesh-and-surface-authoring.md) - Generate editable primitive geometry and bake face-specific surface choices into exported SubParts
* [Demand-driven browser preview](demand-driven-preview.md) - Coalesce scene invalidations into requested frames while adapting KSA material channels for a Three.js preview
* [Embedded part preview](embedded-part-preview.md) - Build a standalone catalog viewer and matching manifest while sharing static assets with the main authoring application
* [Engine design and validation](engine-design-and-validation.md) - Preview propulsion performance and diagnose scoped module, reaction and feed references before exporting an asset-only mod
* [Export named mesh atlases with separate picking geometry](mesh-atlas-and-picking-export.md) - Emit indexed named GLB meshes and optional simplified view meshes that remain selectable in the game editor
* [Generate ground-clutter atlases and audit legacy scenario output](offline-ground-clutter-generation.md) - Convert PNGs into shared clutter textures and named GLB geometry while identifying obsolete XML and selection assumptions in the offline generator
* [Import native animation rigs and bake easing into linear GLB samples](animation-import-and-linear-baking.md) - Read named animation hierarchies and export per-channel easing as dense linear samples with explicit approximation limits
* [Isolate customized built-in SubParts with export variants](isolated-subpart-variants.md) - Redeclare only changed built-in templates under deterministic per-part IDs while reusing their Core meshes and materials
* [Isolate multiple parts within one browser project](multi-part-project-isolation.md) - Park inactive documents with their own history and merge selected parts into one collision-checked export namespace
* [Launch-site system export](launch-site-system-export.md) - Export static launch sites through cloned celestial Assets and a selectable System that references the cloned bodies
* [Native asset-only mod export from a browser](native-asset-mod-export.md) - Package part XML, GameData, custom assets and animations into a native mod folder or downloadable ZIP
* [Normalize imported glTF into reusable KSA SubParts](gltf-model-import.md) - Analyze GLB or glTF scenes and normalize mesh instances, materials and handedness for native part export
* [Paint emissive masks and bake color ramps](emissive-paint-and-ramp-baking.md) - Create glow textures from a blank paint surface or image and bake editable ramps into diffuse and grayscale emissive outputs
* [Persist browser projects and archive their binary assets](project-persistence-and-archives.md) - Separate project metadata, snapshots, undo history and blobs while exporting complete portable project archives
* [Preserve unmodeled GameData through structured XML passthrough](schema-aware-gamedata-roundtrip.md) - Combine typed editable modules with raw XML children and attributes to retain unsupported GameData during import and export
* [Propulsion design wizards](propulsion-design-wizards.md) - Build complete liquid, solid and RCS propulsion assemblies as validated candidate documents committed in one undo step
* [Read mesh-only collision atlases for convex hull previews](convex-hull-atlas-import.md) - Decode named GLB position accessors directly when collision atlases contain no ordinary scene or node hierarchy
* [Solid-motor grain design](solid-motor-grain-design.md) - Resolve authored grain stacks and preview vacuum thrust curves by combining grain regression, pressure balance and automatic nozzle sizing
* [Static-object composition](static-object-composition.md) - Compose built-in static and vessel pieces into native StaticObject assets with scaled collider variants and separate GameData
* [Undoable action chains](undoable-action-chains.md) - Evaluate transform and array operations once for both ghost previews and atomic document commits
