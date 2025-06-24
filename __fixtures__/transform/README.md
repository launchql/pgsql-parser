# PostgreSQL AST Transform Fixtures

This directory contains AST fixtures generated from PostgreSQL versions 13-17 using @pgsql/parser.

## Directory Structure

```
transform/
├── 13/           # ASTs generated with PostgreSQL 13 parser
├── 14/           # ASTs generated with PostgreSQL 14 parser
├── 15/           # ASTs generated with PostgreSQL 15 parser
├── 16/           # ASTs generated with PostgreSQL 16 parser
├── 17/           # ASTs generated with PostgreSQL 17 parser
├── generation-summary.json      # Summary of generated queries
└── ast-differences-analysis.json # Analysis of differences between versions
```

## Fixture Files

Each version directory contains the following JSON files:

- `select_simple.json` - Basic SELECT queries (SELECT 1, SELECT NULL, SELECT 'hello'::text)
- `select_with_join.json` - SELECT with JOIN clause
- `insert_basic.json` - Basic INSERT statement
- `update_basic.json` - Basic UPDATE statement
- `delete_basic.json` - Basic DELETE statement
- `create_table.json` - CREATE TABLE with various column types
- `alter_table.json` - ALTER TABLE operations (ADD/DROP/RENAME COLUMN)
- `complex_query.json` - Complex query with CTEs and window functions

## File Format

Each JSON file contains an array of objects with the following structure:

```json
[
  {
    "query": "SELECT 1",
    "ast": { /* PostgreSQL AST */ }
  },
  // ... more queries
]
```

## Key Differences Between Versions

### v13 → v14
- Field rename: `relkind` → `objtype` in AlterTableStmt

### v14 → v15
- Major A_Const structure change:
  - Before: `A_Const.val.String.str`
  - After: `A_Const.sval.sval`
- String field renames: `str` → `sval`

### v15 → v16
- No significant changes in basic queries

### v16 → v17
- No significant changes in basic queries

## Generation

These fixtures were generated using:
```bash
node packages/transform/scripts/generate-ast-fixtures.js
```

## Analysis

To analyze differences between versions:
```bash
node packages/transform/scripts/analyze-ast-differences.js
```