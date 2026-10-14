# Blasto bundle history

## 2026-10-13

* **Update**: Cross-checked a how-to review finding in [worker exposure handoff](features/worker-nozzle-exposure-handoff.md): the global epoch gate does not acknowledge successful application of each physics bubble, so a sample captured before a later bubble failure can still deposit exposure.
* **Update**: Checked the additional renderer rebuild call directly in `Program.PostRender` and made that placement explicit in [pipeline swapping](features/private-terrain-pipeline-swap.md) and [GPU limit validation](features/unsigned-vulkan-limit-validation.md).
* **Update**: Independently reviewed [Blasto](overview.md) and all twelve [feature pages](features/index.md); clarified main-thread particle spawning, delayed native handle reclamation, both renderer rebuild windows, initialization failure scope, ray rejection and exposure saturation, then synchronized catalog lifecycle metadata and verified every quoted snippet.
* **Creation**: Added [Blasto](overview.md) and twelve source-grounded [feature pages](features/index.md) covering worker exposure, terrain sampling, persistent sites, private Vulkan pipelines, material shaders, native dust, save transactions, cleanup, controls and offline validation at commit `21f7657c42534774001acabcf93289e9412c5242`; live 0.1.3 visual and performance acceptance remains unverified.
