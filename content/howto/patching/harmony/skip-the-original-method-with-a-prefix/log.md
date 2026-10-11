# Skipping Harmony prefixes history

## 2026-10-10
* **Creation**: Added [Skipping Harmony prefixes](overview.md) and 5 How-To articles ([skip-the-original-method-with-a-prefix-1](skip-the-original-method-with-a-prefix-1.md), [skip-the-original-method-with-a-prefix-2](skip-the-original-method-with-a-prefix-2.md), [skip-the-original-method-with-a-prefix-3](skip-the-original-method-with-a-prefix-3.md), [skip-the-original-method-with-a-prefix-4](skip-the-original-method-with-a-prefix-4.md), [skip-the-original-method-with-a-prefix-5](skip-the-original-method-with-a-prefix-5.md)), checked against build 2026.10.10.5554 and the pinned reference repositories.
* **Update**: Review pass: Corrected the claim that a skipping prefix stops all later prefixes: a local test against Lib.Harmony 2.4.2 shows only later prefixes that return `bool` are skipped, `void` prefixes (with or without `__runOriginal`) still run; updated the overview table and articles 1 and 2.
