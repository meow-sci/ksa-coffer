# Mod Feature

* [Frame and viewport terrain buffers](frame-viewport-terrain-buffers.md) - Extend native terrain descriptors with isolated frame-view storage buffers and camera-relative double-to-float packing
* [Live effect tuning and input](live-effect-tuning-and-input.md) - Expose validated live appearance controls and persistent scene settings through a HUD-independent ImGui window with rendering diagnostics
* [Offline rendering validation](offline-rendering-validation.md) - Test portable production logic and exact shader transforms without the game while packaging only the mod's required output files
* [Owned surface dust emitters](owned-surface-dust-emitters.md) - Create bounded native volumetric particle bursts anchored to a celestial surface with explicit handle ownership and separate optical tuning
* [Persistent exposure site store](persistent-exposure-site-store.md) - Accumulate pressure-time exposure in bounded body-fixed sites while preserving stable pattern seeds and tangent frames
* [Private terrain pipeline swap](private-terrain-pipeline-swap.md) - Build guarded private terrain pipelines and substitute them only during the native terrain draw with exception-safe restoration
* [Save-bound sidecar transactions](save-bound-sidecar-transactions.md) - Capture detached mod state alongside native saves and write an integrity-bound validated sidecar with bounded recovery data
* [Scene reset and native cleanup](scene-reset-and-native-cleanup.md) - Separate scene state from GPU lifetime and join workers before resets or disposal so queued exposure cannot leak across scenes
* [Terrain material shader injection](terrain-material-shader-injection.md) - Inject persistent surface marks before native terrain lighting while carrying displaced positions and filtering procedural radial streaks
* [Terrain plume intersection](terrain-plume-intersection.md) - Intersect exhaust rays with radial terrain heights and construct a dry-surface footprint from slope and biome metadata
* [Unsigned Vulkan limit validation](unsigned-vulkan-limit-validation.md) - Decode signed interop representations of Vulkan limits as unsigned values before validating private terrain buffer requirements
* [Worker nozzle exposure handoff](worker-nozzle-exposure-handoff.md) - Capture actual rocket nozzle burn intervals on vehicle workers and consume immutable samples after solver results are applied
