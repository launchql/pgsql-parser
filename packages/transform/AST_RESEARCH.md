# PostgreSQL AST Research

This document summarizes differences in the AST type definitions shipped with the `libpg-query-node` project. Each PostgreSQL version directory under `types/` contains TypeScript definitions generated from PostgreSQL's protobuf specification.

## Versioned type files

| Version | Lines in `types.ts` | Lines in `enums.ts` |
|---------|--------------------|---------------------|
| 13 | 2098 | 61 |
| 14 | 2159 | 61 |
| 15 | 2219 | 63 |
| 16 | 2325 | 68 |
| 17 | 2484 | 75 |

Line counts increase steadily and provide a proxy for growing AST complexity.

## Diff sizes between versions

Measured using `diff -u` on the generated `types.ts` and `enums.ts` files.

| Versions compared | Diff lines `types.ts` | Diff lines `enums.ts` |
|-------------------|----------------------|----------------------|
| 13 → 14 | 287 | 55 |
| 14 → 15 | 304 | 47 |
| 15 → 16 | 2634 | 43 |
| 16 → 17 | 401 | 58 |
| 13 → 17 | 2911 | 91 |

Versions 13–15 show relatively small changes. A dramatic increase occurs between PG15 and PG16 with over 2600 changed lines, reflecting large parser changes. PG17 differs from PG16 by about 400 lines.

## Observed differences

A brief inspection of the diffs highlights:

- New enum values across versions (e.g. additional `WCOKind` options in 15, `JsonEncoding` variants in 16).
- New node interfaces such as `ReturnStmt`, `PLAssignStmt`, and JSON-related constructs appearing in later versions.
- Some existing structures rename or move fields (for example `relkind` → `objtype` in `AlterTableStmt`).
### Enum differences by version

| Version | New enum types |
|---------|----------------|
| 14 | SetQuantifier |
| 15 | AlterPublicationAction, PublicationObjSpecType |
| 16 | JsonConstructorType, JsonEncoding, JsonFormatType, JsonValueType, PartitionStrategy |
| 17 | JsonBehaviorType, JsonExprOp, JsonQuotes, JsonTableColumnType, JsonWrapper, MergeMatchKind, TableFuncType |

### Enum value shifts

The numeric assignments within several enums changed between releases. The table
below lists notable examples.

| Enum | Changed in | Notes |
|------|------------|-------|
| `A_Expr_Kind` | PG14 | Removed `AEXPR_OF` and `AEXPR_PAREN`, causing indices to shift |
| `RoleSpecType` | PG14 | Added `ROLESPEC_CURRENT_ROLE` at position 1 |
| `TableLikeOption` | PG14 | Added `CREATE_TABLE_LIKE_COMPRESSION` at position 1 |
| `WCOKind` | PG15 | Added `WCO_RLS_MERGE_UPDATE_CHECK` and `WCO_RLS_MERGE_DELETE_CHECK` |
| `ObjectType` | PG15 | Inserted `OBJECT_PUBLICATION_NAMESPACE` and `OBJECT_PUBLICATION_REL` before existing entries |
| `JoinType` | PG16 | Added `JOIN_RIGHT_ANTI`, shifting subsequent values |
| `AlterTableType` | PG16–17 | Many values renumbered; PG17 introduces `AT_SetExpression` |
| `Token` | multiple | Token list grows each release, with new codes inserted |

Counting all enums, roughly **11** changed between PG13 and PG14, **8** changed from PG14 to PG15, **8** changed from PG15 to PG16, and **10** changed from PG16 to PG17.


### Scalar node changes

The basic scalar nodes were refactored in PG15. Prior to that release the `String` and `BitString` nodes carried a generic `str` field, while `Float` relied on `str` as well. From PG15 onward these nodes were split into

- `String` with field `sval`
- `BitString` with field `bsval`
- `Float` with field `fval`
- A new `Boolean` node with field `boolval`

| Version | String field | BitString field | Float field | Boolean field |
|---------|--------------|-----------------|-------------|---------------|
| 13–14 | `str` | `str` | `str` | n/a |
| 15+ | `sval` | `bsval` | `fval` | `boolval` |

These nodes keep the same role but use more explicit property names. Translating from PG13/14 to PG17 therefore requires renaming these fields when constructing the newer AST representation.

These changes indicate incremental evolution in the ASTs, with PG16 introducing the most significant updates.
### Renamed fields

| From | To | Node type | Introduced in |
|------|----|-----------|--------------|
| `relkind` | `objtype` | AlterTableStmt / CreateTableAsStmt | PG14 |
| `tables` | `pubobjects` | CreatePublicationStmt / AlterPublicationStmt | PG15 |
| `tableAction` | `action` | AlterPublicationStmt | PG15 |
| `varnosyn` & `varattnosyn` | `varnullingrels` | Var | PG16 |
| `aggtranstype` | `aggtransno` | Aggref | PG16 |

### Enum representation changes

Historically libpg_query exposed enum fields in the JSON output as **numeric**
codes. Starting with the PG15 bindings this switched to returning the **string**
name of each enum value. The TypeScript type definitions reflect string literal
unions across all versions, but the underlying JSON changed in PG15.

| Version | Enum format |
|---------|-------------|
| 13–14   | integers    |
| 15–17   | strings     |


## Version similarity

Based on diff sizes, PG13 and PG14 are close, as are PG14 and PG15. PG16 introduces major differences, likely due to language features such as the SQL/JSON enhancements. PG17 again adjusts the AST but retains most PG16 structures. Thus PG13–15 form one similar group and PG16–17 another.

## Viability of translation (PG13 → PG17)

Going forward only, translating PG13 ASTs to PG17 is plausible. Many node types remain compatible, and differences are largely additive. A translation layer would need to

1. Map renamed fields (e.g. `relkind` to `objtype`).
2. Populate newly introduced fields with defaults or derived values.
3. Handle removed or deprecated fields when present in PG13.

Because PG16 introduced large changes, direct translation from PG13 to PG17 may require bridging PG16 first. Still, each version’s ASTs are defined in TypeScript, so programmatic transforms are feasible.
### New interface nodes

| Version | Interfaces added |
|---------|-----------------|
| 14 | CTECycleClause, CTESearchClause, PLAssignStmt, ReturnStmt, StatsElem |
| 15 | AlterDatabaseRefreshCollStmt, Boolean, MergeAction, MergeStmt, MergeWhenClause, PublicationObjSpec, PublicationTable |
| 16 | JsonAggConstructor, JsonArrayAgg, JsonArrayConstructor, JsonArrayQueryConstructor, JsonConstructorExpr, JsonFormat, JsonIsPredicate, JsonKeyValue, JsonObjectAgg, JsonObjectConstructor, JsonOutput, JsonReturning, JsonValueExpr, RTEPermissionInfo |
| 17 | JsonArgument, JsonBehavior, JsonExpr, JsonFuncExpr, JsonParseExpr, JsonScalarExpr, JsonSerializeExpr, JsonTable, JsonTableColumn, JsonTablePath, JsonTablePathScan, JsonTablePathSpec, JsonTableSiblingJoin, MergeSupportFunc, SinglePartitionSpec, WindowFuncRunCondition |

## Generating AST Samples

To fully understand structural differences we will compile **libpg-query** for
each supported PostgreSQL version and capture JSON output for a library of
representative queries. This multi-runtime parser setup lets us record actual
ASTs from PG13 through PG17. These samples are essential for training upgrade
logic and verifying enum representations:

- PG13 and PG14 output enum values as integers
- PG15+ output enums as their string names

The generated samples will live under a dedicated directory and can be compared
programmatically to spot changes beyond what the protobuf types reveal.


## Conclusion

The repository already provides versioned definitions which can be compared programmatically. Diff metrics suggest PG13–15 are most similar, while PG16 marks a major jump and PG17 follows that design. Building an automated translation will require detailed mapping but appears viable, particularly when only upgrading ASTs.