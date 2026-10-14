# Flexo bundle history

## 2026-10-13
* **Update**: Clarified [solid grain profile validation](features/solid-motor-grain-design.md): browser import filters non-finite rows, whereas native KSA rejects the original malformed table.
* **Update**: Checked the new [source citation](overview.md) against the complete pinned file and corrected its cited line range.
* **Update**: Checked the new [source citation](features/static-object-composition.md) against the complete pinned file and corrected its cited line range.

* **Update**: Corrected [mass and resource authoring](features/mass-and-resource-authoring.md) after the how-to review: tank serialization describes geometry, wall material, affinity and containment settings, without authoring a substance fill.
* **Update**: Independent review expanded [animation fitting](features/animation-import-and-linear-baking.md), [archive adoption](features/project-persistence-and-archives.md), [static collision scaling](features/static-object-composition.md), [texture conversion](features/material-and-ktx2-pipeline.md), [layered glow](features/emissive-paint-and-ramp-baking.md), [model import limits](features/gltf-model-import.md) and [thumbnail tooling](features/asset-pipeline-and-regression-tooling.md); clarified [external export timing](features/native-asset-mod-export.md) and [command dispatch](features/command-registry-and-mode-routing.md). Added the missing [offline ground-clutter generator](features/offline-ground-clutter-generation.md) with current-build incompatibilities and synchronized the [overview](overview.md) and 32-feature catalog. Source snippets, engine contracts and scoped validators were checked; no browser or in-game execution is claimed.

* **Creation**: Added [Flexo](overview.md) and 31 source-grounded [feature concepts](features/index.md) for browser composition, XML export, imported/procedural assets, materials and emissives, animation, engine design, project tooling and static launch sites; pinned Flexo `e804879abfc1d45ca1c174a9c95c5fded58c1bf2` and KSA `2026.10.10.5554`, and explicitly separated external authoring from native generated-content consumption.
