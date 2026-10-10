---
type: Attested Computation
title: <What the computation produces>
description: <One sentence: the figure, its scope, and the governing definition>
tags: [<domain>, attested]
status: stable
runtime: <bigquery | postgres | dbt | python | ...>
parameters:
  - { name: <param>, type: <integer | string | date | ...>, required: true }
executor:
  resource: <path to the executor skill or code, e.g. skills/run-on-bq.md>
  receipt: [<field>, <field>, result]
attester:
  resource: <path to deterministic attester code, e.g. attesters/sql_equality.py>
generated: { by: <actor>, at: <YYYY-MM-DDTHH:MM:SSZ> }
stale_after: <YYYY-MM-DDTHH:MM:SSZ>
sources:
  - id: <policy-id>
    resource: <URL or bundle path to the governing definition>
    title: <Policy or standard title>
---

# Computation

```<language>
<the single sanctioned computation, using runtime-native parameter binding such as @param>
```

<One paragraph mapping each rule of the governing definition to the
computation.>[^policy-id]

# What the attester checks

1. **Provenance:** the receipt's executed/compiled artifact, canonicalized, equals this computation bound with the supplied parameters.
2. **Fidelity:** the value displayed equals the receipt's authoritative result.

# Freshness

`stale_after` mirrors <the review cycle of the governing definition>. After that instant, re-verify before serving.

[^policy-id]: <Policy or standard title>
