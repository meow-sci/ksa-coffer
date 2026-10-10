---
type: <Type Name>
title: <Display title>
description: <One sentence summary; reused verbatim in index.md>
resource: <canonical URI of the underlying asset; delete this line for abstract concepts>
tags: [<tag>, <tag>]
generated: { by: <producer>/<version> | human:<id> | process:<id>, at: <YYYY-MM-DDTHH:MM:SSZ> }
status: stable
stale_after: <YYYY-MM-DDTHH:MM:SSZ; delete this line if the content has no natural expiry>
sources:
  - id: <stable-id>
    resource: <URL | bundle path | scope descriptor>
    title: <Human-readable source label>
---

<One to three paragraphs: what this is, its grain or scope, how it is used,
caveats such as version applicability or partial coverage. Cite claims with
footnotes keyed to sources[].id.>[^stable-id]

# Schema

| Field | Type | Description |
|---|---|---|
| `<name>` | <type> | <meaning, constraints, defaults> |

# Examples

### 1. <Purpose of the example>

```<language>
<minimal runnable example>
```

# See also

- [<Related concept title>](<relative/path/to/concept.md>) - <why it is related>

[^stable-id]: <Human-readable source label>
