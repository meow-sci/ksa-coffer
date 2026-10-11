# Lonely Planets how-to batch review

Reviewed the two `celestials/systems-and-stars` topic bundles against LonelyPlanets `a5dd50de5ffad938d9737f86526a2fae00aa4c98`, KSA build `2026.10.10.5554` (`935a32b4dbc34cbcd16e87d16cf9732eb90030c0`), the plan excerpt and the three reviewed mod feature pages on 2026-10-11.

| Measure | Score (1–5) |
|---|---:|
| Accuracy | 5 |
| Coverage | 5 |
| Lifecycle correctness | 5 |
| Conformance | 5 |

| File | Defect found | Fixed? |
|---|---|---|
| `compose-reduced-star-systems/compose-reduced-star-systems.md` | “Does not depend on Dummy” could be read as runtime proof; only the XML has no reference to it. | Yes |
| Same | Optional body instructions could invite reuse of `Dummy`'s 0.1 km orbit and 1 Yg mass as practical values; the full template and texture replacements needed clearer guidance. | Yes |
| Same | Body-only example gave no game-type guidance, although Testing tries to follow/control a starting vehicle; the example declares none. | Yes |
| Same | Said the repository did not measure VRAM savings, which cannot be established from the checked sources. | Yes |
| `place-starting-vessels-in-custom-systems/place-starting-vessels-in-custom-systems.md` | Reused `MarsStartingSituation`, a globally registered ID that could collide with LonelyPlanets when both mods are installed. | Yes |
| Same | The XML example provided only a situation element after telling the reader to create a new asset file; it needed a complete `<Assets>` document. | Yes |
| Same | The Testing-mode vehicle/location choice lacked a direct source for the startup picker controls. | Yes |

Both planned topics have one overview and one article. `demonstrated_by` covers all three planned feature concepts, and the overview approach rows match the articles. The adapted manifest and XML examples use native fields found in the pinned game code. The body-only system XML and situation XML parse as documents; the starter block parses when inserted into the body-only system. The mod source snippets and line anchors were checked against the checkout. No concepts were added or removed.

Both topic logs record the review updates. Scoped OKF validation and code-reference checks pass with zero errors or warnings; both topic indexes are current.

Open concerns: KSA was not run. The runtime effect of omitting `Dummy`, the author's Venus and vehicle-creator reports, and actual VRAM savings remain unverified. The optional custom-body path requires the reader's own legally usable textures and chosen physical values; the article does not claim the source `Dummy` values are suitable for another body.
