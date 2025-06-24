# AST Translation Test Plan

This document outlines a set of incremental tests for building and validating a PostgreSQL AST translation layer. The goal is to ensure ASTs parsed from older versions can be upgraded to the latest version without changing semantic meaning.

## 0. Generate Example ASTs from simple queries

make a new directory called transform/ inside of the root __fixtures__ dir. 

in here, we should have a folder for each version 13/,14/,15/,16/,17/

then, create a series of example .json files that are the resulting output of a handful of sql queries. 

This will be the basis for how we can do our testing, and understand, truly understand the differences in the ASTs.

IMPORANT: update, improve, and leverage `expectOldAstToTransformToNewAst` in packages/transform/test-utils/expect-ast.ts

## 1. Baseline Parsing

1. **Parse basic queries for each version**
   - Verify `parseSync` and `parse` return a single statement for simple queries (`SELECT 1`, `SELECT NULL`).
2. **Round-trip parsing**
   - Parse a query, deparse it back to SQL, and parse again. The ASTs should match after removing location data.

## 2. Enum Handling

1. **Integer to string conversion (PG13/14)**
   - Feed known enum codes to the translation layer and assert the upgraded AST uses the correct enum names.
2. **Preserve string enums (PG15+)**
   - Ensure enums already represented as strings remain unchanged after translation.

## 3. Scalar Node Changes

1. **Field rename checks**
   - Confirm that `String.str` becomes `String.sval`, `BitString.str` becomes `BitString.bsval`, and `Float.str` becomes `Float.fval` when translating from PG13/14.
2. **Boolean node introduction**
   - Translating `A_Const` nodes containing boolean values should yield the new `Boolean` node starting in PG15.

## 4. Renamed Fields

Create fixtures demonstrating renamed fields such as `relkind` → `objtype` and `tables` → `pubobjects`. Tests should confirm the new field names and that values are correctly copied.

## 5. Sequential Upgrade Steps

For each release boundary (13→14, 14→15, 15→16, 16→17):
1. Apply the specific upgrade function to a representative AST.
2. Validate that required fields are present and obsolete ones removed.
3. Verify that running all steps in sequence produces the same result as any direct upgrade path (once implemented).

## 6. Full Query Upgrade

1. Parse a library of real-world queries using the oldest supported version.
2. Upgrade the resulting ASTs to the latest version.
3. Deparse the upgraded ASTs and execute them against a running PostgreSQL instance to ensure semantics are preserved.

## 7. Future Regression Tests

As translation functions evolve, capture edge cases that previously failed and assert they remain fixed.

---

These tests build confidence incrementally: start with simple node transformations, then cover whole query upgrades. The plan emphasizes functional, deterministic checks that can run in CI.