# How-to plan summary

One line per topic: `category | slug | approaches | mods | merged-from`. Generated from `ai/catalog/howto-plan.yml`; the existing `getting-started/game-loop-and-lifecycle` topic belongs to group `lifecycle` (move it to `content/howto/getting-started/lifecycle/game-loop-and-lifecycle/`).

getting-started | create-a-minimal-starmap-mod | 2 | starmap, kitten-engineer-redux, unscience | host-several-features-in-one-mod-or-standalone
getting-started | how-starmap-launches-ksa | 4 | starmap, ksagolf, realatmospheres | ksa-mod-folders-and-manifest, separate-game-instances, patch-a-lazily-loaded-game-assembly
getting-started | mod-toml-reference | 1 | starmap, kitten-engineer-redux, ohmystars | -
getting-started | ship-content-and-code-in-one-mod | 3 | ksacars, ksagolf, ohmystars, starmap | find-your-mod-folder-at-runtime
getting-started | choose-a-starmap-startup-hook | 4 | starmap, realatmospheres, shaderextensions, ksa-advancedflightcomputer, compendium, ksarmory, gatos, ksaero | diagnose-a-starmap-hook-that-never-fires
getting-started | contain-exceptions-in-starmap-hooks | 2 | ksarmory, ksacars, ksastructures, ksa-public-telemetry | -
getting-started | clean-up-on-game-exit | 2 | starmap, ksa-measuretools | relaunch-the-game-from-a-mod
getting-started | write-a-per-mod-log-file | 7 | ksagolf, ksacars, ksarmory, ksastructures, purrtty, gatos, ksa-advancedflightcomputer, ksa-measuretools, ksa-public-telemetry | log-to-the-game-log, log-each-problem-once
getting-started | check-the-game-version | 2 | ksaero, ksa-measuretools, ksagolf, ksacars, ksarmory | -
getting-started | declare-a-mod-dependency | 3 | starmap, ksarmory, shaderextensions, gatos, purrtty, ksa-advancedflightcomputer | integrate-with-an-optional-mod, detect-a-conflicting-or-superseded-mod
getting-started | share-types-between-mods | 5 | purrtty, starmap, gatos, ksarmory, shaderextensions, mpfx, ksa-aircrafthud, kittenextensions | discover-plugins-by-attribute-name, fork-a-library-mod-compatibly, design-an-inter-mod-registry-contract, design-an-inter-mod-registration-api, register-with-another-mods-plugin-registry, expose-an-api-to-other-mods-without-a-shared-assembly, record-and-check-the-api-other-mods-bind-to
getting-started | ship-third-party-dlls-with-a-mod | 2 | kitten-engineer-redux, ksa-aircrafthud, starmap, unscience | -
getting-started | ship-native-libraries-with-a-mod | 2 | purrtty, starmap, ksa-advancedflightcomputer | -
getting-started | reference-game-assemblies-from-a-mod-project | 3 | ksa-aircrafthud, ksaero, ksagolf, kittenextensions | -
getting-started | deploy-a-mod-on-every-build | 5 | ksaero, ksa-deltavmap, ksa-measuretools, ksa-aircrafthud, ksa-advancedflightcomputer, ksarmory, ohmystars, kitten-engineer-redux, gatos, starmap | run-and-debug-a-starmap-mod-from-an-ide
getting-started | generate-mod-toml-from-msbuild | 1 | kittenextensions, shaderextensions, mpfx | -
getting-started | build-a-mod-without-game-references | 4 | realatmospheres, gatos, unscience, ksacars | isolate-game-api-access-behind-providers
getting-started | build-in-ci-without-the-game-installed | 3 | kittenextensions, mpfx, shaderextensions, ksa-advancedflightcomputer, gatos | -
getting-started | package-and-publish-a-mod-release | 6 | ksaero, ksa-deltavmap, realatmospheres, ksa-advancedflightcomputer, ksacars, ksagolf, ohmystars, ksa-measuretools, unscience, purrtty, starmap | package-a-mod-release-zip, publish-a-release-from-ci
patching | skip-the-original-method-with-a-prefix | 5 | gatos, ohmystars, unscience, ksa-measuretools, purrtty | replace-a-game-method-with-a-prefix, consume-game-input-with-a-skipping-prefix
patching | run-cleanup-or-recover-from-exceptions-with-a-finalizer | 7 | unscience, ksa-advancedflightcomputer, compendium, ksastructures | scope-a-patch-to-your-own-calls
patching | coexist-with-other-mods-patching-the-same-method | 5 | gatos, ksastructures, shaderextensions, ksaero, unscience, ksa-advancedflightcomputer | share-one-patch-between-several-features
patching | patch-methods-that-run-on-background-threads | 5 | ksa-advancedflightcomputer, realatmospheres, ksacars, compendium | pass-data-to-patches-on-the-flight-computer-worker-copy
patching | refuse-a-patch-and-roll-back-when-the-game-changes | 3 | ksaero, ksa-advancedflightcomputer, shaderextensions | -
patching | isolate-patch-failures-and-fault-proof-patch-bodies | 5 | purrtty, ksa-measuretools, unscience, ksagolf, realatmospheres | isolate-patch-failures-per-class-or-feature, make-patch-bodies-fault-proof, apply-harmony-patches-independently
patching | validate-patch-targets-and-detect-game-update-breakage | 3 | ksa-advancedflightcomputer, unscience, ksagolf | validate-game-reflection-targets-at-load, detect-game-update-breakage-in-patches
patching | remove-your-patches-safely-at-runtime-and-at-exit | 3 | ksagolf, ksaero, gatos, unscience | -
patching | write-a-harmony-transpiler | 4 | ksaero, ksa-advancedflightcomputer, realatmospheres, unscience | rewrite-a-comparison-or-value-read-with-a-transpiler
patching | swap-one-call-inside-a-game-method-with-a-transpiler | 5 | ksaero, ksa-advancedflightcomputer, compendium, shaderextensions, unscience | -
patching | identify-a-call-by-its-argument-il | 4 | ksaero, shaderextensions, ksa-advancedflightcomputer, compendium | make-game-null-checks-see-mod-state
patching | insert-calls-into-a-game-method-at-an-il-anchor | 4 | ksa-advancedflightcomputer, unscience, shaderextensions | -
patching | call-private-game-members-through-reflection-and-delegates | 7 | ksa-deltavmap, unscience, ksa-advancedflightcomputer, ksaero, kittenextensions, shaderextensions | access-private-members-with-reflection, call-a-private-game-method-through-a-delegate, write-readonly-game-statics-with-unsafeaccessor
patching | patch-a-private-game-method-by-name | 7 | ksa-aircrafthud, ksarmory, ksagolf, ksaero, ksa-advancedflightcomputer, compendium, ohmystars, ksastructures, unscience | resolve-overloaded-and-byref-game-methods, patch-private-method-with-field-injection
patching | patch-around-aggressive-inlining | 4 | ksaero, ohmystars, ksa-advancedflightcomputer, unscience | -
ui | cursor-to-world-ray | 5 | ksarmory, ksagolf, ksacars, purrtty, ksa-measuretools | work-in-the-cameras-ego-frame, place-points-under-the-cursor-on-a-construction-plane
ui | pick-objects-under-the-cursor | 5 | ksagolf, ksacars, ksarmory, purrtty, gatos | raycast-terrain-from-the-cursor, teleport-a-craft-to-a-latitude-and-longitude, pick-a-surface-point-under-the-cursor, pick-a-vehicle-under-the-cursor
ui | place-pieces-on-a-grid-with-a-ghost | 2 | ksagolf, ksacars | draw-gizmos-and-meshes-in-the-world
ui | coordinate-imgui-focus-with-game-input | 5 | ksagolf, ksarmory, ksacars | swallow-game-input-while-a-tool-is-active, make-a-vehicle-respond-to-a-key
ui | block-game-hotkeys-while-typing | 2 | unscience, purrtty | -
ui | rebindable-hotkeys | 2 | ksa-public-telemetry, purrtty | -
ui | read-typed-text-and-key-chords-from-imgui | 2 | purrtty, ksa-measuretools | copy-text-to-the-clipboard-from-imgui
ui | subclass-the-stock-imguiwindow | 5 | ksa-deltavmap, ksa-measuretools, ksa-public-telemetry, purrtty, ksastructures | give-mod-windows-stable-ids-and-persisted-placement, build-a-chromeless-window-that-snaps-to-a-grid
ui | match-the-stock-console-ui-style | 4 | ksa-deltavmap, ksa-measuretools, ohmystars, ksa-advancedflightcomputer, unscience | theme-the-whole-game-ui
ui | build-a-tabbed-imgui-window | 5 | purrtty, ksarmory, ohmystars, mpfx, kitten-engineer-redux | pop-out-panel-sections-into-windows
ui | show-live-vehicle-data-in-a-window | 3 | ksaero, kitten-engineer-redux | add-a-panel-to-the-vehicle-editor
ui | build-a-settings-window | 6 | mpfx, purrtty, ksa-aircrafthud, ksagolf, ksastructures, ksacars, unscience | pick-colors-in-imgui, build-a-developer-panel
ui | build-searchable-lists-and-browsers | 6 | purrtty, compendium, ksa-deltavmap, unscience | build-a-two-pane-browser-window, build-a-filesystem-file-picker, add-search-to-imgui-combos-and-lists
ui | show-alerts-and-popups-in-game | 2 | ksa-advancedflightcomputer, ohmystars | show-a-game-styled-popup, show-a-transient-on-screen-alert
ui | show-a-dialog-during-loading | 2 | starmap, kittenextensions | -
ui | draw-a-fullscreen-click-through-overlay | 5 | ksa-aircrafthud, compendium, ksarmory, ksa-advancedflightcomputer, ohmystars, ksa-measuretools, ksa-deltavmap, ksa-public-telemetry, purrtty | paint-overlays-on-secondary-and-detached-viewports, choose-a-draw-list-for-world-overlays
ui | draw-ui-while-the-hud-is-hidden | 4 | ksa-aircrafthud, ksa-public-telemetry, unscience, ksarmory, ksagolf, gatos, ksastructures, ksacars | patch-a-game-method-without-referencing-harmony, step-mod-simulation-on-sim-time, keep-overlays-updating-when-hud-hidden
ui | draw-hud-instruments-with-the-draw-list | 3 | ksa-public-telemetry, ksa-aircrafthud | animate-imgui-overlays-with-easing, draw-scrolling-tapes-and-rotated-ladders, draw-arc-gauges-and-gradient-shapes
ui | draw-a-chart-with-imdrawlist | 3 | kitten-engineer-redux, compendium, ksarmory | draw-a-radar-scope-and-relief-map
ui | build-custom-drawn-imgui-widgets | 5 | kitten-engineer-redux, ksarmory, ksa-deltavmap, kittenextensions | draw-a-custom-tree-view, show-threshold-alerts-in-a-hud
ui | draw-a-monospace-text-grid | 3 | purrtty, ksa-deltavmap, ksa-measuretools | keep-per-frame-imgui-text-allocation-free
ui | build-a-pan-zoom-canvas-in-imgui | 2 | ksa-deltavmap, unscience | cull-overlapping-labels, draw-and-pick-in-a-3d-imgui-canvas, undo-redo-in-an-editor
ui | lay-out-a-tree-or-graph-diagram | 4 | ksa-deltavmap | keep-a-large-diagram-usable, detect-vessel-and-soi-changes-from-ui
ui | load-a-custom-font-into-imgui | 4 | ksa-aircrafthud, compendium, ksa-public-telemetry, purrtty | survive-a-game-font-rebuild
ui | add-items-to-the-game-menu-bar | 3 | unscience, ksa-deltavmap, ksa-measuretools, purrtty, ksagolf, ksastructures, ksarmory | -
ui | list-a-mod-in-modmenu | 4 | compendium, ohmystars, mpfx, ksa-aircrafthud, ksa-public-telemetry, ksacars, ksagolf, ksarmory, ksastructures, realatmospheres | call-imgui-without-referencing-brutal
ui | add-a-menu-with-modmenu-fallback | 3 | purrtty, gatos, kitten-engineer-redux, ksa-public-telemetry | -
ui | inject-ui-into-a-stock-window | 4 | ksa-advancedflightcomputer | add-entries-to-the-orbit-context-menu
ui | work-with-stock-cockpit-gauges | 5 | ksa-advancedflightcomputer, ksacars, ksa-public-telemetry, ohmystars | show-stock-gauges-for-a-custom-craft, hide-the-stock-flight-hud, add-a-navball-marker, add-or-change-a-stock-gauge-button
rendering | submit-your-own-vulkan-commands | 4 | unscience, purrtty | render-a-vulkan-scene-offscreen-into-imgui
rendering | insert-a-custom-pass-into-render-game | 5 | unscience, gatos, purrtty, ksarmory, ksastructures, shaderextensions | -
rendering | build-a-vulkan-pipeline-for-the-scene-target | 3 | unscience, gatos, purrtty | -
rendering | modify-the-hdr-scene-with-a-compute-pass | 3 | ksarmory, ksastructures | ship-a-compute-shader-as-a-mod-asset, tune-compute-shader-constants-live-with-specialization-constants, read-the-light-prepass-irradiance-in-a-compute-shader
rendering | handle-renderer-rebuilds | 3 | shaderextensions, purrtty, unscience | -
rendering | free-vulkan-resources-safely | 3 | purrtty, gatos, unscience | -
rendering | capture-rendered-frames | 2 | gatos, unscience | render-part-thumbnails-at-runtime
rendering | project-world-positions-to-screen | 6 | ksarmory, ksa-deltavmap, ksagolf, ksa-advancedflightcomputer, ohmystars, ksa-measuretools, compendium | occlude-overlays-behind-bodies, project-world-to-screen, point-at-off-screen-targets
rendering | choose-a-render-frame-and-anchor-effects | 6 | ksagolf, ksarmory, unscience | choose-ecl-or-ego-positions-for-rendering, keep-effects-fixed-to-a-rotating-body, anchor-rendered-objects-to-parts-and-terrain
rendering | draw-lines-on-the-sky | 2 | ohmystars | draw-a-sky-coordinate-grid, convert-sky-coordinates-to-the-game-frame
rendering | draw-markers-and-annotations-on-world-objects | 5 | ksarmory, ksa-measuretools, ksa-deltavmap, ksa-advancedflightcomputer, compendium, ohmystars | point-at-an-offscreen-target
rendering | draw-world-space-lines-and-gizmos | 3 | ksarmory, ksagolf, ksa-advancedflightcomputer | draw-world-space-gizmos, draw-extra-orbit-lines-with-the-game-line-renderer
rendering | upload-an-image-as-a-vulkan-texture | 3 | gatos, unscience | -
rendering | show-an-image-in-imgui | 2 | compendium, purrtty | -
rendering | replace-a-game-texture-at-runtime | 3 | gatos, unscience | give-mod-objects-a-private-material-buffer
rendering | render-imgui-into-a-texture | 3 | purrtty, ksastructures | put-a-live-screen-on-a-part
rendering | draw-a-textured-quad-in-the-world | 3 | unscience, gatos, purrtty | -
rendering | project-decals-onto-scene-geometry | 4 | unscience, gatos, ksarmory, ksastructures | -
rendering | paint-vessel-parts-with-custom-colours | 4 | unscience, gatos, ksacars | tint-emissive-glow-per-part
rendering | draw-mod-meshes-with-the-engine-renderers | 4 | ksagolf, unscience, ksarmory | -
rendering | grow-game-gpu-buffers-for-runtime-content | 2 | unscience, ohmystars | restyle-background-stars
rendering | add-invisible-shadow-casters | 1 | ksastructures | -
rendering | hide-parts-or-subparts-from-rendering | 6 | unscience, ksarmory, ksacars, gatos | show-iva-interiors-from-outside, render-kitten-equipment-in-the-right-order
rendering | keep-vessels-rendered-at-any-distance | 4 | unscience, gatos, ksarmory | -
rendering | add-dynamic-lights-to-the-world | 3 | ksacars, ksastructures, ksarmory | -
rendering | control-part-light-color-and-state | 5 | unscience, gatos | animate-part-lights
rendering | spawn-particle-effects | 3 | ksarmory, gatos | -
rendering | draw-exhaust-plumes-without-an-engine | 5 | ksacars, unscience, gatos, ksarmory | edit-exhaust-and-cloud-templates-live, lay-volumetric-smoke-trails
shaders | write-a-post-processing-fragment-shader | 4 | mpfx, shaderextensions, ksa-aircrafthud | build-a-fullscreen-pass-with-rendertechnique, bind-extra-textures-and-buffers-to-a-shader, implement-a-shader-asset-type-with-its-own-descriptor-set
shaders | declare-post-processing-shader-assets-in-xml | 3 | mpfx, ksa-aircrafthud, shaderextensions | chain-post-processing-passes
shaders | choose-pre-or-post-imgui-post-processing | 2 | shaderextensions, mpfx | -
shaders | feed-uniform-buffers-to-a-shaderextensions-shader | 3 | mpfx, shaderextensions, ksa-aircrafthud | use-shaderextensions-without-referencing-its-assembly, create-a-persistently-mapped-uniform-buffer
shaders | send-push-constants-to-a-shaderextensions-shader | 4 | ksa-aircrafthud, shaderextensions, mpfx, realatmospheres | toggle-a-post-processing-pass, animate-shaders-with-game-time, update-shader-parameters-at-the-right-time
shaders | replace-or-patch-game-glsl-without-editing-game-files | 1 | realatmospheres | redirect-game-shaders-to-a-patched-copy, patch-game-glsl-with-anchored-text-edits
shaders | patch-game-shaders-in-memory-at-compile-time | 3 | unscience, gatos | make-the-game-rebuild-shaders-and-luts-after-a-change
shaders | send-extra-data-to-stock-shaders-without-new-uniforms | 4 | realatmospheres, unscience, gatos | dispatch-shader-variants-with-sentinel-values
shaders | branch-per-body-inside-shared-game-shaders | 2 | realatmospheres | ship-lookup-data-inside-glsl-source
shaders | extend-stock-sky-and-cloud-shaders | 4 | realatmospheres | fix-volumetric-cloud-lighting-and-the-2d-handover, add-per-pixel-detail-over-the-atmosphere-luts
shaders | include-the-game-shader-library-in-mod-glsl | 3 | ksarmory, ksastructures, realatmospheres | -
shaders | compile-glsl-at-runtime | 3 | purrtty, unscience, gatos | write-glsl-for-a-mod-draw-pipeline
shaders | reload-a-mod-shader-in-a-running-game | 2 | ksastructures, ksarmory | hot-reload-mod-shaders
shaders | check-mod-shaders-offline-with-glslang | 3 | ksarmory, ksastructures | keep-glsl-constants-in-sync-with-csharp, compile-mod-shaders-offline
shaders | colour-grade-the-frame-and-add-a-vignette | 2 | mpfx, ksarmory | grade-a-camera-feed-into-a-tv-or-thermal-look
shaders | blur-the-screen-with-a-separable-gaussian | 2 | mpfx, ksa-aircrafthud | -
shaders | add-film-grain-and-blue-noise-dithering | 2 | mpfx, ksa-aircrafthud | -
shaders | bend-the-picture-with-crt-curvature-and-chromatic-aberration | 3 | ksa-aircrafthud, shaderextensions | shade-one-imgui-window-with-a-custom-fragment-shader, tag-imgui-windows-for-shaders
shaders | refract-and-distort-the-scene | 3 | ksa-aircrafthud, ksarmory | flash-and-shake-the-view-from-a-compute-pass
shaders | pack-parameters-for-a-compute-effect | 4 | ksarmory | give-a-mod-shader-the-camera-pose-and-global-data
shaders | reconstruct-scene-positions-from-depth-in-a-compute-shader | 3 | ksarmory | draw-many-streaks-with-tiled-compute
shaders | raymarch-a-local-volume-into-the-hdr-scene | 3 | ksarmory | light-and-occlude-a-mod-volume-with-ksa-atmosphere-data, draw-analytic-sky-effects-in-a-compute-pass
assets | patch-game-xml-data | 2 | kittenextensions, ksa-advancedflightcomputer | -
assets | xpath-xml-patch-recipes | 3 | ksa-advancedflightcomputer, kittenextensions | -
assets | redirect-game-xml-loading | 4 | realatmospheres, kittenextensions, ksastructures | patch-xml-text-with-anchors-and-markers, coordinate-file-edits-between-mods, patching/redirect-game-xml-loading, change-stock-system-and-body-xml-without-editing-core
assets | asset-xml-element-reference | 1 | ksagolf, ksacars, ksarmory | -
assets | mod-xml-load-order | 1 | kittenextensions, realatmospheres, ksacars | -
assets | resolve-asset-ids-and-mod-relative-paths | 2 | ksacars, ksagolf, realatmospheres | -
assets | register-custom-xml-asset-type | 3 | kittenextensions, shaderextensions, mpfx | inject-child-elements-into-game-xml
assets | ship-and-share-data-files-between-mods | 4 | ohmystars, compendium, ksarmory, unscience | ship-data-files-with-a-mod, cross-mod-data-files, write-a-mod-folder-from-game
assets | declare-gltf-and-pbr-material-assets | 4 | ksagolf, ksacars, unscience, ksarmory, ksastructures | author-pbr-texture-sets, dilate-baked-texture-atlas
assets | add-a-part-model-with-glb-and-pbr-textures | 2 | ksacars, ksarmory | -
assets | export-glb-from-blender-for-ksa | 4 | ksacars, ksagolf, ksarmory, ksastructures | generate-parts-with-headless-blender, generate-glb-without-blender
assets | import-glb-models-at-runtime | 3 | unscience | convert-gltf-pbr-to-game-materials, read-the-game-asset-registries
assets | composite-png-over-stock-texture | 2 | unscience, realatmospheres | -
assets | find-z-fighting-and-degenerate-uvs-in-glb | 3 | ksagolf, ksacars, ksarmory, unscience | read-glb-mesh-names-and-bounds, check-glb-meshes-for-z-fighting-offline
assets | validate-asset-xml-references | 3 | ksacars, ksagolf, ksarmory, ksastructures, unscience | deserialize-asset-bundle-with-game-serializer, check-and-generate-mod-assets-offline, validate-asset-xml-offline
assets | debug-xml-patches | 2 | kittenextensions | testing-and-tooling/debug-xml-patches
physics | mutate-vehicles-at-a-physics-safe-point | 4 | ksacars, ksarmory, ksastructures, gatos, ksagolf, unscience | -
physics | write-worker-thread-safe-solver-patches | 6 | ksaero, realatmospheres, ksastructures, unscience, ksagolf, ksa-advancedflightcomputer | -
physics | inject-forces-and-impulses-at-the-physics-safe-point | 5 | ksacars, ksarmory, gatos, ksa-advancedflightcomputer | apply-impulses-and-velocity-changes-to-a-vehicle, reposition-or-rotate-a-vehicle-in-place, add-lift-hover-boost-and-downforce-to-a-craft, keep-custom-forces-stable-under-time-warp
physics | keep-a-pushed-craft-off-rails | 2 | ksacars, ksa-advancedflightcomputer | -
physics | simulate-bodies-outside-the-vehicle-system | 6 | ksarmory, ksagolf, ksacars | simulate-projectiles-and-balls-outside-the-vehicle-system, advance-mod-physics-on-simulated-time, sample-world-state-at-a-consistent-epoch, simulate-in-the-planet-fixed-frame, roll-and-bounce-a-ball-on-terrain, keep-physics-maths-free-of-game-types
physics | prevent-tunnelling-of-fast-bodies | 3 | ksarmory, ksagolf | collide-with-analytic-shapes-instead-of-meshes
physics | ray-cast-against-vessel-meshes-and-terrain | 6 | ksarmory, ksagolf, ksa-measuretools, unscience, ksacars | hit-test-a-path-against-vessel-part-meshes, pick-a-world-point-with-the-cursor, raycast-against-part-meshes
physics | apply-drag-and-gravity-to-a-mod-simulated-body | 3 | ksagolf, ksarmory, ksa-advancedflightcomputer | apply-quadratic-drag-to-a-mod-simulated-body, apply-gravity-to-a-mod-simulated-body, lead-a-moving-target-with-an-unguided-round
physics | mutate-the-shared-bepu-shape-registry | 3 | ksagolf, unscience, ksacars | -
physics | add-static-colliders-to-physics-bubbles | 3 | unscience, ksagolf, ksastructures | let-kittens-stand-on-mod-geometry, choose-box-or-mesh-collision-for-imported-geometry
physics | give-ground-clutter-custom-colliders | 4 | unscience, ksacars, ksagolf | make-ground-clutter-react-to-vehicles
physics | suppress-collisions-for-one-vessel | 1 | unscience | -
physics | scale-or-move-a-vessels-colliders-at-runtime | 2 | unscience, ksacars | scale-a-vessels-colliders-at-runtime, move-or-toggle-a-parts-colliders-at-runtime
physics | build-a-moving-platform-kittens-can-ride | 1 | ksastructures | -
physics | run-your-own-bepu-simulation | 1 | gatos | apply-fictitious-forces-in-a-moving-vessel
physics | teleport-a-vessel-by-building-a-new-orbit | 3 | gatos, ksarmory, unscience | teleport-a-vessel-to-an-orbit-or-site, teleport-a-vehicle, fire-an-eva-kitten-from-the-camera
physics | place-a-vessel-on-a-surface-at-latitude-and-longitude | 4 | ksagolf, ksacars, ksarmory, unscience, ksastructures | spawn-a-craft-on-top-of-a-structure
physics | weld-one-vessel-to-another | 3 | unscience, gatos | animate-a-weld-with-eased-queues, store-named-presets-in-toml-with-tomlyn, weld-vehicles-together
physics | replace-the-stock-aerodynamic-force-model | 2 | ksaero, ksa-advancedflightcomputer | compute-mach-number-from-the-game-atmosphere, measure-drag-and-lift-of-the-active-aero-model
physics | override-atmosphere-and-ocean-in-the-physics-environment | 2 | realatmospheres, ksastructures | replace-a-bodys-atmosphere-density-profile, remove-the-ocean-from-a-region-of-a-body
physics | override-terrain-height-for-roofs-and-platforms | 1 | ksastructures | -
physics | sample-the-ground-under-each-wheel | 3 | ksacars, ksagolf | raycast-the-surface-of-launch-pads
physics | simulate-wheels-and-suspension-without-a-wheel-module | 1 | ksacars | add-a-friction-circle-tyre-and-grip-limited-steering
vehicles-and-parts | spawn-a-vehicle-at-runtime | 3 | ksacars, ksarmory, ksastructures | load-a-craft-from-the-vehicle-library
vehicles-and-parts | change-vehicles-without-racing-the-solver | 7 | ksacars, ksarmory, unscience, gatos | create-or-dispose-vehicles-without-racing-the-solver, destroy-vehicles-and-fail-parts-safely, write-state-where-the-vehicle-solver-sees-it, change-a-part-mass-at-runtime
vehicles-and-parts | take-control-of-another-vehicle | 2 | ksastructures, ksarmory | autopilot-a-vehicle-from-a-mod
vehicles-and-parts | make-a-vehicle-indestructible | 4 | ksacars, unscience, ksarmory | damage-parts-against-crash-tolerance, make-a-vessel-indestructible, persist-vessel-references-across-save-and-load
vehicles-and-parts | scale-a-vessel-or-its-parts-at-runtime | 4 | unscience, gatos | unclamp-editor-part-scaling, visually-scale-a-vessel
vehicles-and-parts | define-a-part-with-game-data | 3 | ksacars, ksarmory, ksastructures | -
vehicles-and-parts | ship-ready-made-craft | 3 | ksacars, ksastructures | make-a-single-part-a-whole-craft
vehicles-and-parts | add-crew-seats-and-eva-doors | 2 | ksacars, ksastructures | -
vehicles-and-parts | evolve-a-shipped-part-without-breaking-saves | 2 | ksarmory | repair-saves-and-craft-files-at-startup
vehicles-and-parts | define-and-animate-subparts | 4 | ksacars, ksarmory | hide-show-and-fly-subparts-as-projectiles, animate-subparts-from-code
vehicles-and-parts | load-and-unload-part-mods-at-runtime | 3 | unscience | load-part-mods-at-runtime, unload-runtime-parts-safely, validate-part-xml-before-loading
vehicles-and-parts | read-live-part-module-state | 2 | gatos, ksarmory | read-propellant-remaining
vehicles-and-parts | refill-or-drain-resources | 3 | unscience, gatos, ksarmory | -
vehicles-and-parts | command-engines-throttle-and-rcs-from-code | 4 | gatos, unscience, ksa-advancedflightcomputer | allocate-rcs-thrusters
vehicles-and-parts | add-parts-to-a-live-vessel | 3 | unscience, kitten-engineer-redux | feed-runtime-engines-from-tanks, find-tanks-an-engine-can-draw-from
vehicles-and-parts | customize-parachute-materials-and-limits | 2 | unscience | substitute-parachute-canopy-material, tune-parachutes-beyond-the-editor-limits
vehicles-and-parts | read-staged-delta-v-from-the-game | 4 | kitten-engineer-redux, ksa-deltavmap, ksa-advancedflightcomputer | estimate-stage-delta-v-yourself
vehicles-and-parts | compute-engine-thrust-at-ambient-pressure | 2 | ksa-advancedflightcomputer, kitten-engineer-redux | find-the-throttle-for-a-thrust-demand
vehicles-and-parts | stage-a-vehicle-from-code | 3 | gatos, ksarmory | fire-a-decoupler-or-undock-from-code
vehicles-and-parts | stage-automatically | 3 | ksa-advancedflightcomputer | delay-ignition-and-decoupling-after-staging
vehicles-and-parts | get-part-points-in-vehicle-and-world-frames | 5 | ksa-measuretools, unscience | read-part-mesh-geometry
vehicles-and-parts | anchor-to-parts-across-vehicle-changes | 4 | ksa-measuretools, unscience | access-parts-in-the-vehicle-editor
vehicles-and-parts | draw-an-engine-diagram-from-nozzle-positions | 1 | ksa-public-telemetry | -
vehicles-and-parts | give-inert-parts-behaviour-by-part-id | 3 | ksarmory | simulate-decoys-flares-and-chaff
vehicles-and-parts | track-and-classify-craft | 4 | ksacars, ksarmory, ksa-public-telemetry | detect-staging-and-vehicle-loss
vehicles-and-parts | target-and-gate-automated-weapons | 3 | ksarmory | classify-threats-by-closest-point-of-approach, model-radar-search-and-lock, gate-automation-with-an-explainable-ladder
flight-and-orbits | understand-ksa-coordinate-frames-and-epochs | 5 | gatos, kitten-engineer-redux, ksarmory, ksa-measuretools, ksa-advancedflightcomputer, ksagolf | understand-ksa-coordinate-frames, sample-positions-at-a-consistent-epoch, convert-position-to-latitude-longitude
flight-and-orbits | read-vehicle-flight-state | 4 | gatos, ksa-public-telemetry, ksa-aircrafthud, ksaero | read-altitude-speed-and-g-load
flight-and-orbits | read-flight-state-in-a-local-horizon-frame | 2 | ksa-aircrafthud, ksa-advancedflightcomputer | compute-attitude-in-the-local-horizon-frame, compute-angle-of-attack-and-sideslip
flight-and-orbits | read-orbit-elements-and-timing | 3 | kitten-engineer-redux, gatos, ksa-deltavmap | read-orbit-elements-and-body-data
flight-and-orbits | compute-mission-elapsed-time-and-detect-liftoff | 3 | ksa-public-telemetry, ksarmory, gatos | choose-a-clock-under-time-warp
flight-and-orbits | set-simulation-speed-from-a-mod | 3 | gatos, ksa-advancedflightcomputer, ksarmory | -
flight-and-orbits | create-and-read-maneuver-nodes | 5 | ksa-advancedflightcomputer, gatos, ksa-public-telemetry | create-a-maneuver-node-from-code, plan-apse-and-plane-change-burns, chain-burns-through-the-flight-plan, read-planned-maneuver-burns, draw-a-mission-timeline-with-planned-burns
flight-and-orbits | execute-planned-burns-with-the-stock-autopilot | 5 | ksa-advancedflightcomputer | execute-planned-burns-hands-free, split-a-long-burn-into-passes, hand-a-maneuver-to-the-stock-autopilot, react-to-stock-burn-completion, remove-finished-burns-from-the-plan
flight-and-orbits | execute-burns-with-rcs-and-throttle-inputs | 4 | ksa-advancedflightcomputer, ksarmory, gatos | execute-burns-with-rcs-translation, drive-throttle-and-rcs-inputs-from-code, deploy-multiple-payloads-from-a-bus
flight-and-orbits | drive-the-flight-computer-and-attitude-modes-from-a-mod | 9 | ohmystars, ksarmory, gatos, ksa-advancedflightcomputer, compendium | command-attitude-through-the-flight-computer, choose-a-moment-to-write-flight-computer-state, run-code-after-physics-results-land, queue-vehicle-changes-through-input-events, actuate-gimbals-and-thrust-from-a-guidance-loop, arbitrate-control-of-a-vehicle
flight-and-orbits | run-an-autopilot-for-every-vehicle-each-step | 4 | ksa-advancedflightcomputer, ksarmory | arbitrate-control-of-a-vehicle
flight-and-orbits | set-and-clear-the-vehicle-target | 2 | compendium | target-bodies-the-game-cannot-target, queue-vehicle-changes-through-input-events
flight-and-orbits | synthesize-a-navigation-target-for-the-flight-computer | 2 | compendium | -
flight-and-orbits | estimate-transfer-delta-v-with-patched-conics | 2 | kitten-engineer-redux, ksa-deltavmap | estimate-hohmann-transfer-delta-v
flight-and-orbits | plan-multi-leg-and-interstellar-delta-v-routes | 3 | ksa-deltavmap | plan-multi-leg-delta-v-routes, classify-vessel-orbit-state, estimate-interstellar-trip
flight-and-orbits | compute-transfer-windows | 2 | ksa-deltavmap, ksa-advancedflightcomputer | -
flight-and-orbits | build-a-site-frame-and-compute-a-launch-window | 4 | ksa-advancedflightcomputer, ksagolf, kitten-engineer-redux | compute-launch-window-to-a-target-plane, build-a-local-site-frame
flight-and-orbits | aim-a-transfer-at-a-flyby-periapsis | 3 | ksa-advancedflightcomputer, ksarmory | predict-encounter-for-a-planned-burn, solve-lambert-transfer
flight-and-orbits | add-plan-type-to-the-transfer-planner | 5 | ksa-advancedflightcomputer, ksa-deltavmap | inject-ui-into-the-transfer-planner-window, open-and-preselect-the-stock-transfer-planner, let-the-transfer-planner-target-hyperbolic-bodies
flight-and-orbits | compute-a-suicide-burn | 3 | kitten-engineer-redux, ksa-public-telemetry, ksa-advancedflightcomputer | compute-live-engine-thrust
flight-and-orbits | plan-and-fly-a-powered-landing | 4 | ksa-advancedflightcomputer | fuel-optimal-powered-landing, hover-and-touch-down-under-engine-power, plan-a-deorbit-burn-to-a-landing-site
flight-and-orbits | fly-closed-loop-ascent-guidance | 2 | ksa-advancedflightcomputer | plan-an-optimal-ascent-trajectory
flight-and-orbits | run-an-expensive-solve-without-stalling-the-frame | 5 | ksa-advancedflightcomputer, ksarmory, compendium | -
flight-and-orbits | predict-impact-point-and-build-a-ballistic-computer | 3 | ksa-advancedflightcomputer, ksarmory | predict-impact-point-with-drag, measure-lift-and-drag-under-the-active-aero-model, guide-a-ballistic-flight-by-velocity-to-be-gained
flight-and-orbits | fly-a-boostback-and-glide-to-a-landing-site | 2 | ksa-advancedflightcomputer | fly-a-boostback-to-a-landing-site, steer-descent-with-angle-of-attack
flight-and-orbits | steer-by-zero-effort-miss | 4 | ksarmory, ksa-advancedflightcomputer | steer-a-falling-object-by-predicted-impact, model-sensor-field-of-view-and-line-of-sight
flight-and-orbits | find-closest-approach-along-the-flight-plan | 2 | compendium, ksarmory | override-stock-gauge-readouts
flight-and-orbits | anchor-and-pick-points-on-bodies | 4 | ksarmory, ksa-measuretools | anchor-a-point-to-a-rotating-body, pick-bodies-and-orbit-lines-under-the-cursor
flight-and-orbits | draw-a-predicted-trajectory-and-map-markers | 6 | ksa-advancedflightcomputer, ksarmory, ksa-deltavmap, compendium | draw-a-predicted-trajectory, draw-markers-and-lines-in-the-map-view, set-orbit-line-visibility-and-color
camera | understand-camera-modes-and-controllers | 4 | ksagolf, ksarmory, unscience, gatos | read-the-main-camera-pose-and-mode
camera | replace-a-viewport-camera-controller | 6 | ksagolf, ksastructures, ksarmory, gatos, unscience | take-input-through-a-camera-controller
camera | write-the-camera-pose-in-phase-with-the-frame | 4 | ksagolf, ksastructures, ksarmory, gatos, unscience | pre-empt-a-stock-camera-controller-for-a-while
camera | drive-the-main-camera-in-fixed-mode | 6 | ksagolf, ksarmory, gatos, ksastructures | control-camera-roll-with-an-up-vector
camera | borrow-the-main-camera-and-hand-it-back | 5 | ksarmory, ksagolf, ksastructures, gatos | arbitrate-camera-ownership-between-features
camera | follow-a-point-that-is-not-a-vehicle | 5 | gatos, ksarmory, unscience | change-the-camera-follow-target-without-a-jump
camera | chase-a-fast-body-with-the-main-camera | 2 | ksarmory, ksagolf | -
camera | override-the-camera-field-of-view | 3 | unscience, ksarmory, ksagolf | -
camera | unlock-the-iva-camera | 1 | unscience | -
camera | first-person-camera-for-a-kitten | 2 | ksastructures, ksagolf | look-around-with-the-mouse-in-a-character-view, make-a-walking-kitten-follow-the-look, look-through-a-kittens-eyes
camera | play-cinematic-camera-tracks | 4 | gatos, ksagolf, unscience | blend-and-ease-camera-transitions
camera | chain-camera-moves-into-keyframe-sequences | 2 | unscience | animate-the-player-camera-with-eased-moves, save-authored-camera-sequences-with-the-scene
camera | borrow-a-secondary-viewport | 3 | ksarmory, ksastructures, unscience | show-a-secondary-camera-in-your-own-window
camera | aim-a-secondary-viewport-camera | 2 | ksarmory, unscience | give-a-secondary-camera-its-nearby-body
camera | mount-a-camera-on-a-part | 3 | unscience, ksarmory | -
celestials | query-terrain-height-and-line-of-sight | 4 | ksagolf, ksarmory, ksa-advancedflightcomputer | query-the-terrain-height-field, choose-accurate-or-coarse-terrain-sampling, check-line-of-sight-across-terrain, query-terrain-height-under-a-point
celestials | measure-slope-and-detect-ground-contact-on-terrain | 3 | ksagolf, unscience, ksarmory | measure-ground-slope-and-surface-normal, stop-a-mod-simulated-body-at-the-ground
celestials | add-terrain-decals-and-dig-a-site | 2 | ksastructures | add-terrain-decals-from-code, flatten-or-dig-terrain-for-a-site
celestials | place-static-objects-on-a-planet-surface | 3 | ksastructures, unscience, ksagolf | place-a-static-object-landmark-on-a-planet, draw-a-static-object-the-engine-culls, anchor-a-placed-model-to-the-ground
celestials | exclude-or-replace-ground-clutter | 3 | ksastructures, unscience | keep-ground-clutter-off-a-site, replace-ground-clutter-on-a-body, keep-clutter-removals-across-swaps-and-saves
celestials | click-a-planet-to-get-latitude-and-longitude | 2 | ksa-measuretools | draw-a-great-circle-arc-over-a-planet
celestials | define-atmospheres-and-cloud-layers-in-system-xml | 3 | realatmospheres | add-an-atmosphere-to-an-airless-body, tune-atmosphere-scattering-in-system-xml, add-a-volumetric-cloud-layer-to-a-body, build-cloud-masks-and-flowmaps-for-ksa
celestials | generate-measured-atmosphere-tables-offline | 1 | realatmospheres | generate-mod-data-as-csharp, fit-parameters-with-an-offline-port-of-the-renderer
celestials | add-or-restyle-planetary-rings | 2 | unscience | add-planetary-rings-to-a-body, swap-planetary-ring-meshes-and-textures, render-planetary-rings-with-custom-textures
celestials | change-loaded-game-data-and-make-the-renderer-notice | 4 | unscience, ksastructures | edit-planet-biome-materials-live
celestials | choose-which-body-the-game-renders-in-detail | 1 | realatmospheres | -
celestials | enumerate-star-systems-and-bodies | 3 | ksa-deltavmap, compendium, gatos | handle-multi-star-systems-and-barycenters
celestials | read-body-properties-and-orbit-elements | 4 | gatos, ksa-deltavmap, compendium | read-atmosphere-and-ocean-parameters-of-a-body, read-rotation-tilt-and-tidal-lock-of-a-body, read-celestial-orbit-and-body-data
celestials | cache-and-key-body-data-per-loaded-system | 5 | ksa-deltavmap, gatos, compendium | cache-derived-data-per-loaded-celestial-system, attach-extra-data-to-bodies-by-stable-key
celestials | move-or-reparent-a-celestial-body | 2 | unscience | reparent-a-celestial-body, reposition-a-celestial-body-at-runtime
celestials | bundle-and-query-a-star-catalog | 2 | ohmystars | load-stellarium-sky-cultures
celestials | read-and-replace-star-binaries | 2 | ohmystars | read-stock-star-binaries, reload-or-replace-the-star-field-at-runtime
kittens | reach-a-kittens-avatar-and-skeleton | 4 | ksagolf, ksastructures, unscience, ksacars | understand-how-kittens-are-rendered, enumerate-kitten-animation-clips-and-processors
kittens | define-a-kitten-character-in-asset-xml | 1 | unscience, ksagolf | -
kittens | spawn-an-eva-kitten-from-code | 2 | unscience, ksarmory | place-a-spawned-vessel-relative-to-another, track-select-and-despawn-spawned-kittens
kittens | restore-kitten-customizations-after-a-load | 3 | unscience | -
kittens | pose-kitten-bones-with-an-anim-processor | 6 | ksagolf, ksacars, ksastructures | aim-a-kitten-limb-at-a-target, convert-between-kitten-model-space-and-the-world, draw-a-kitten-displaced-without-moving-its-body, keep-custom-kitten-animation-running-at-distance
kittens | play-a-specific-kitten-animation-clip | 1 | unscience | beat-the-games-per-frame-writes
kittens | make-a-kitten-pull-a-facial-expression | 2 | unscience | -
kittens | animate-and-draw-seated-kitten-crew | 3 | ksacars, ksastructures | animate-a-seated-kitten-driver, draw-seated-crew-on-unflown-craft, fly-another-craft-from-a-seated-kitten
kittens | kitten-locomotion-and-servo-reference | 2 | unscience, ksastructures | tune-kitten-locomotion-and-animation-parameters
kittens | steer-a-walking-kitten | 2 | ksastructures, ksagolf | swing-a-tool-with-the-mouse-as-a-kitten
kittens | treat-an-eva-kitten-as-a-rocket | 3 | unscience | route-vessel-input-and-flight-hud-to-an-eva-kitten, call-a-base-class-method-bypassing-an-override
kittens | open-the-vehicle-editor-on-a-live-eva-kitten | 3 | unscience | show-an-eva-kitten-in-the-vehicle-editor, add-per-instance-attachment-nodes-that-survive-saves
kittens | tint-and-restyle-kitten-appearance | 5 | unscience, gatos, ksagolf | tint-kitten-materials, create-and-budget-runtime-gpu-materials, hide-kitten-helmet-and-visor
kittens | attach-a-prop-to-a-kitten-bone | 2 | ksagolf | build-a-static-mesh-renderable-from-mod-assets
kittens | hide-a-kitten-body-from-one-viewport | 2 | ksastructures, ksagolf | draw-a-different-skinned-pose-into-the-shadow-pass, hide-a-kitten-from-its-own-first-person-view, keep-the-shadow-of-a-hidden-body
persistence | save-and-load-the-game-from-code | 3 | unscience, ksagolf, ksastructures, ksacars, ksarmory | create-a-native-save-from-code, load-a-save-from-code
persistence | detect-save-load | 6 | ksarmory, ksagolf, ksastructures, ksa-advancedflightcomputer, ohmystars, ksa-measuretools, ksa-public-telemetry, ksacars | reset-mod-state-on-load, rebuild-mod-state-from-the-loaded-world
persistence | save-mod-state-with-the-game-save | 3 | ksarmory, ohmystars, ksa-advancedflightcomputer | detect-game-save
persistence | save-mod-state-with-the-scene | 3 | unscience | hook-native-save-and-load, save-sidecar-state-per-scene, save-mod-state-with-native-saves
persistence | identify-vessels-and-parts-across-saves | 4 | ksa-advancedflightcomputer, ksarmory, purrtty, unscience | understand-which-ids-survive-a-save, reference-a-part-stably-across-saves
persistence | keep-mod-vehicles-out-of-saves | 1 | ksastructures | vehicles-and-parts/keep-mod-vehicles-out-of-saves
persistence | persist-mod-settings-ini | 4 | ohmystars, compendium, ksa-aircrafthud, ksa-measuretools | -
persistence | persist-mod-settings-as-json | 2 | kitten-engineer-redux, ksa-public-telemetry | -
persistence | persist-mod-settings-toml | 3 | gatos, purrtty, realatmospheres | -
persistence | write-and-load-config-files-safely | 4 | ksa-public-telemetry, kitten-engineer-redux, gatos, ksa-measuretools, purrtty | write-config-files-atomically, load-config-without-losing-user-edits
persistence | choose-where-a-mod-stores-its-files | 5 | ohmystars, compendium, ksa-measuretools, ksa-aircrafthud, ksa-public-telemetry, purrtty, realatmospheres, kitten-engineer-redux, gatos, ksagolf, ksastructures, starmap | where-ksa-stores-user-data, ship-default-config-and-keep-user-edits
persistence | persist-user-created-presets-and-content | 6 | ksa-measuretools, purrtty, ksa-public-telemetry, mpfx, ksagolf, unscience | persist-named-color-palettes, ship-presets-as-xml-assets-and-export-them, import-user-files-into-a-mod-catalog, save-user-built-layouts-as-versioned-json-files
persistence | persist-imgui-window-state | 3 | ohmystars, compendium, unscience, purrtty | persist-imgui-window-layout, save-and-restore-named-window-layouts
audio | play-a-sound-at-a-world-position-and-hold-its-channel | 3 | ksagolf, ksarmory, ksacars | play-a-sound-at-a-world-position, hold-and-move-a-spatial-channel-every-frame
audio | drive-sound-parameters-from-code | 3 | ksacars, ksarmory | reuse-the-stock-engine-sound-for-custom-thrust, play-a-stock-explosion-sound-on-your-own-schedule
audio | play-a-spin-up-loop-tail-sound-and-crossfade-engine-loops | 2 | ksacars, ksarmory | crossfade-layered-engine-loops-by-rpm, play-a-spin-up-loop-tail-sound, cut-looping-sounds-from-recordings
audio | delay-a-sound-until-the-blast-front-arrives | 1 | ksarmory | merge-coincident-events-into-one-effect
audio | understand-the-games-sound-and-music-xml-types | 1 | ksacars, ksarmory, unscience | -
audio | ship-custom-sounds-as-xml-assets | 3 | ksagolf, ksacars, ksarmory | -
audio | add-a-music-playlist-for-a-location | 1 | unscience | -
audio | play-sound-files-through-the-games-fmod-system | 3 | gatos, unscience | load-fmod-streams-without-blocking-the-game-thread, attach-an-imported-sound-to-a-vessel-in-3d
audio | keep-mod-sounds-sensible-under-time-warp | 3 | ksagolf, ksacars, unscience | -
audio | release-sound-channels-at-scene-change-and-exit | 4 | ksarmory, ksacars, unscience, gatos | -
external-io | marshal-commands-to-the-game-thread | 2 | gatos | -
external-io | schedule-timed-commands | 1 | gatos | -
external-io | let-ai-agents-control-the-game-over-mcp | 2 | gatos, ksacars, ksagolf, ksastructures, ksarmory | design-an-agent-facing-game-api, expose-a-running-game-to-an-ai-agent-with-mcp
external-io | build-external-clients-and-autopilots-with-a-typed-sdk | 1 | gatos | build-a-typed-client-over-files-and-http, write-an-external-autopilot-for-ksa
external-io | export-game-state-to-other-threads | 2 | gatos, ksa-public-telemetry | sample-telemetry-at-a-fixed-interval
external-io | detect-flight-events-from-snapshots | 2 | gatos, ksa-public-telemetry | -
external-io | record-telemetry-and-diagnostics-to-files | 3 | kitten-engineer-redux, ksa-advancedflightcomputer, ksa-deltavmap | record-telemetry-to-csv, dump-and-record-diagnostics-from-a-running-game, dump-state-from-a-running-game-once, dump-layouts-and-geometry-to-svg, record-diagnostics-without-flooding-the-frame-or-the-log
external-io | host-and-supervise-an-external-process-from-a-mod | 4 | gatos, purrtty | run-a-virtual-machine-alongside-the-game, detect-installed-shells-and-launch-commands, keep-big-user-data-in-copy-on-write-overlays
external-io | host-guest-transports-tcp-9p-and-ssh | 4 | gatos | connect-a-vm-guest-to-the-game-over-tcp, expose-game-data-and-host-folders-to-a-guest-over-9p, design-synthetic-files-for-live-data, pin-ssh-host-keys
external-io | bind-and-vendor-native-c-libraries | 3 | purrtty, ksa-advancedflightcomputer | bind-a-native-c-library-with-p-invoke, vendor-and-patch-a-third-party-binding, call-variadic-c-functions-via-p-invoke-on-apple-arm64
external-io | host-http-and-mqtt-servers-in-the-game-process | 2 | gatos | serve-a-telemetry-and-control-api-over-http, publish-telemetry-and-accept-commands-over-mqtt
external-io | bridge-a-serial-port-and-bus-protocols-to-the-game | 1 | gatos | -
external-io | make-an-http-request-from-a-mod-without-blocking-the-frame | 1 | ksarmory | add-an-in-game-bug-report-form
external-io | host-a-terminal-with-pty-sessions-and-frame-handoff | 4 | purrtty, gatos | hand-background-thread-output-to-the-game-frame, add-a-custom-shell-to-purrtty, run-ksa-console-commands-and-capture-output
external-io | let-a-terminal-program-set-the-system-clipboard | 1 | purrtty | -
external-io | stream-the-game-screen-to-a-terminal | 1 | gatos | -
testing-and-tooling | drive-a-running-game-through-a-file-bridge | 5 | ksagolf, ksacars, ksarmory, ksastructures, kittenextensions, ksa-deltavmap | step-the-simulation-an-exact-number-of-seconds, load-a-save-from-code, script-gameplay-through-a-command-bridge, gate-developer-only-features, gate-developer-only-features-behind-a-marker-file
testing-and-tooling | take-screenshots-from-code | 5 | ksagolf, ksastructures, ksarmory, ksacars | external-io/take-screenshots-from-code, hold-a-composed-camera-shot-for-screenshots
testing-and-tooling | visual-regression-for-mods | 2 | ksagolf, ksacars, ksastructures, ksarmory | -
testing-and-tooling | run-unattended-scenarios-and-report-a-verdict | 3 | ksarmory, ksacars, ksagolf, ksastructures | ab-test-mod-behaviour-in-flight, run-an-unattended-scenario-and-report-pass-or-fail, load-a-save-from-code, step-the-simulation-an-exact-number-of-seconds
testing-and-tooling | live-tweak-constants-in-game | 1 | ksa-public-telemetry | -
testing-and-tooling | measure-and-budget-mod-performance | 6 | ksa-deltavmap, ksa-measuretools, ksa-advancedflightcomputer, gatos, ksarmory | lightweight-perf-scopes, measure-gpu-cost-of-a-mod-pass, throttle-expensive-ui-computation, profile-mod-frame-cost, warm-up-hot-code-at-load
testing-and-tooling | unit-test-mod-logic-without-game | 5 | ksagolf, ksacars, ksarmory, ksastructures, ksaero, ksa-deltavmap, ksa-advancedflightcomputer, purrtty, gatos | split-game-adapters-from-pure-logic, make-time-gated-code-deterministic-in-tests, gate-slow-or-platform-specific-tests
testing-and-tooling | run-mod-simulation-in-a-headless-rig | 3 | ksacars, ksarmory, ksagolf | test-frame-timing-and-epoch-logic
testing-and-tooling | headless-test-harness-for-game-mods | 2 | ksa-advancedflightcomputer, ksa-deltavmap | test-against-the-games-own-routines, make-time-gated-code-deterministic-in-tests
testing-and-tooling | test-harmony-patches-without-the-game | 3 | unscience, purrtty, ksa-advancedflightcomputer | test-patches-without-the-game
testing-and-tooling | test-a-solver-or-controller-offline | 2 | ksa-advancedflightcomputer | closed-loop-simulator-for-guidance, verify-a-solve-is-pure-before-threading, replay-a-live-game-problem-offline
testing-and-tooling | run-repo-checks-from-a-pre-push-hook-and-ci | 4 | ksarmory, ksastructures, ksacars, ksagolf, ksa-advancedflightcomputer, gatos | enforce-code-rules-with-textual-guards, build-and-abi-check-native-libraries, ship-a-linux-guest-image-with-a-mod
testing-and-tooling | decompile-the-game-for-reference | 2 | compendium, ksarmory, ksacars, ksagolf | -
testing-and-tooling | track-the-game-api-your-mod-uses | 1 | ksarmory, ksacars, ksagolf | pin-harmony-targets-at-compile-time
testing-and-tooling | pin-the-game-build-with-a-hashed-lock | 1 | ksarmory, ksagolf, ksacars, ksastructures | detect-a-new-ksa-build-automatically
testing-and-tooling | upgrade-a-mod-to-a-new-ksa-build | 3 | ksarmory, ksacars, ksagolf, purrtty, gatos | degrade-one-feature-on-api-drift
