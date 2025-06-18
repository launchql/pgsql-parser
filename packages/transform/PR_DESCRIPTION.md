# PG13 to PG17 AST Transformer

This PR implements a comprehensive transformer function that converts PostgreSQL AST nodes from version 13 format to version 17 format.

## Overview

The transformer provides a one-way conversion (PG13 → PG17) for PostgreSQL Abstract Syntax Tree nodes, handling:

- **Node type transformations**: All 100+ node types in the discriminated union
- **Interface modifications**: Updated fields and properties between versions
- **New PG17 node types**: Graceful handling of PG17-only nodes
- **Recursive transformation**: Deep transformation of nested AST structures

## Key Features

### Core Transformer Function
- `transformPG13ToPG17(node: PG13Node): PG17Node` - Main transformation entry point
- Handles all node types in the discriminated union pattern
- Recursive transformation of nested Node properties

### Interface Updates
- **TableFunc**: Added new PG17 fields (`functype`, `colvalexprs`, `passingvalexprs`, `plan`)
- **A_Const**: Proper handling of all value types with explicit undefined defaults
- **RangeVar**: Added `catalogname`, `inh`, `relpersistence` fields
- **Query**: Removed deprecated `mergeUseOuterJoin` field
- **SubPlan**: Removed deprecated `paramIds`, `setParam`, `parParam` fields

### New PG17 Node Types
The transformer gracefully handles PG17-only node types by passing them through unchanged:
- `WindowFuncRunCondition`
- `MergeSupportFunc` 
- `JsonBehavior`
- `JsonExpr`

### Helper Functions
- `transformNodeArray()` - Transforms arrays of nodes recursively
- `transformOptionalNode()` - Handles optional node properties
- Specific transform functions for each node type

## Testing

The implementation includes comprehensive tests covering:
- Basic node transformations (String, Integer, Boolean)
- Complex nested structures (Query with multiple clauses)
- Interface modifications (TableFunc with new fields)
- Edge cases and error handling

## Usage

```typescript
import { transformPG13ToPG17 } from '@pgsql/transform';

const pg13Node = { String: { sval: 'example' } };
const pg17Node = transformPG13ToPG17(pg13Node);
```

## Exports

The package exports both the transformer function and type definitions:
- `transformPG13ToPG17` - Main transformer function
- `PG13Node`, `PG17Node` - Node type aliases
- `PG13Types`, `PG17Types` - Complete type namespaces

Link to Devin run: https://app.devin.ai/sessions/c968f2746e934525ab825e6e99425b02

Requested by: Dan Lynch (pyramation@gmail.com)
