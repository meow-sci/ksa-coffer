# Game Feature

* [Validate asset XML ids and paths before launching the game (offline)](overview.md) - Compare offline XML and reference checks, generated-geometry checks, game-serializer rules and browser export regression workflows

# How-To

* [Check asset XML ids and paths offline with check-xml.sh and validate-parts.py](validate-asset-xml-references-1.md) - A well-formedness check and a reference validator that cross-check SubPart InstanceOf, Material and Mesh ids against the mod's own files, the atlas mesh names and Core's library, with case-exact paths and an offline mode, run from the deploy script and CI
* [Extend the validator for generated geometry, ids named in C# and shared planes](validate-asset-xml-references-2.md) - Add checks for XML not listed in mod.toml, ids declared twice including atlas mesh names, launch geometry disagreeing with a generated report, textures shared between materials, ids named as strings in C#, unsized stacking connectors and planes shared between subparts
* [Parse an AssetBundle with the game serializer, without OnDataLoad, and apply pure rules](validate-asset-xml-references-3.md) - Fetch the AssetBundle serializer from XmlHelper.Serializers, parse an XDocument with line info, never call OnDataLoad, and hand the object tree to isolated validation rules so a runtime loader can reject a document set before anything is registered
* [Supply catalog assets and regression-test browser exports](validate-asset-xml-references-4.md) - Configure a prepared KSA asset tree, refresh XML fixtures and check browser export regressions with unit tests, smoke runs and incremental thumbnails
