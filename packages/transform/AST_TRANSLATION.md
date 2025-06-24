# AST Translation Strategies

This document explores approaches for translating PostgreSQL ASTs between the versioned type definitions under `types/`.

## Goals

- Upgrade an AST produced for an older PostgreSQL release so that it conforms to the latest definitions
- Avoid a downgrade path; only translation forward is needed
- Keep the process transparent and manageable as new versions appear

## Design options

### Functional transforms

One model is to create a set of pure functions, each responsible for upgrading a single node type. These functions would:

1. Accept an instance of a node from the older version
2. Produce the equivalent structure in the newer version
3. Rename fields or populate new defaults as required

Benefits:

- Fine grained and testable; each function does one thing well
- Easier to reason about complex nodes such as `String` or `Var`
- Composable: an overall upgrade is just a pipeline of node-level transforms

### Nested deparser / reparser

Another idea is to build a new deparser that understands multiple versions simultaneously. The deparser would parse using the old types and re-emit using the newest ones. This could be structured as a visitor that walks the AST, writing out SQL and immediately reparsing with the updated parser.

Benefits:

- Eliminates manual field mapping by relying on the parser to create valid nodes
- Might handle edge cases automatically where semantics changed

Trade-offs:

- Performance hit due to serializing and parsing again
- Potential loss of fidelity if certain node properties are not round-trippable

### Handling enums

Older versions of `libpg_query` (PG13 and PG14) emitted numeric codes for enum
fields. From PG15 onward the JSON output uses the enum **name** as a string.
Translation code must therefore convert numeric enums to their string
equivalents when upgrading from PG13/14. When moving between PG15–17 the
representations already match.

## Translation step ordering

### Sequential upgrades

A straightforward approach is to perform sequential upgrades: 13 → 14 → 15 → 16 → 17. Each step focuses on the incremental changes in that release. This keeps functions small and reuses existing transforms when supporting new versions.

### Direct upgrades

Alternatively, we could implement direct translations for each older version to the newest (13 → 17, 14 → 17, 15 → 17). This avoids running multiple steps but requires larger, more complex functions because they must handle every change introduced across several releases at once.

### Which is better?

Sequential upgrades favor simplicity and reuse. The majority of changes between 13 and 15 are minor, while 16 introduces significant restructuring (see `AST_RESEARCH.md`). Incremental steps allow us to focus on these differences in isolation. Direct upgrades may be feasible for the relatively small jumps (15 → 17), but are harder to implement for 13 → 17.

## Recommended plan

1. Implement functional node-level transforms for each release boundary starting with 13 → 14.
2. Compose those functions so that upgrading from any supported version to 17 is just a series of transformations.
3. Provide utilities for renaming fields (e.g. `str` → `sval` in `String` nodes) and filling defaults for new enum values or optional fields.
4. Optionally develop a proof-of-concept reparse approach for comparison, but keep the functional pipeline as the core strategy.

By building translation functions per version we keep the code maintainable and make it easy to add support for future releases.

## Should we implement a deparser?

The nested deparser approach would walk the old AST, generate SQL, and parse it with the newer parser. This mirrors the visitor pattern and can adapt automatically to certain changes, but it adds overhead and may drop information that doesn't round-trip cleanly. Maintaining explicit transform functions keeps upgrades deterministic and easy to test. A deparser prototype might help with tricky cases, yet the primary strategy should be these per-version transform functions.