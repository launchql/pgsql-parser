# PostgreSQL AST Transform Guide

This guide provides detailed information about the AST transformation system in @pgsql/transform.

## Overview

The @pgsql/transform package provides a system for transforming PostgreSQL ASTs between versions 13-17. It handles structural changes, field renames, and other modifications needed to upgrade ASTs to newer PostgreSQL versions.

## Quick Start

```typescript
import { transformAST, transformASTWithResult } from '@pgsql/transform';

// Parse a query with v13
const v13AST = parser.parse('ALTER TABLE users ADD COLUMN email TEXT', { version: 13 });

// Transform to v17
const v17AST = transformAST(v13AST, 13, 17);

// Or get detailed results
const result = transformASTWithResult(v13AST, 13, 17, { collectStats: true });
console.log(result.stats); // { nodesTransformed: 11, fieldsRenamed: 1, ... }
```

## Version-Specific Tooling

Each version directory (`src/13/`, `src/14/`, etc.) contains:

### 1. Enum Definitions (`enums.ts`)
Type definitions for all PostgreSQL enums in that version:

```typescript
import { ObjectType, AlterTableType } from '@pgsql/transform/src/13/enums';
```

### 2. Enum Converters (`enum-to-int.ts`, `enum-to-str.ts`)
Convert between numeric and string representations:

```typescript
import { getEnumInt, getEnumString } from '@pgsql/transform/src/13/enum-to-int';

// String to number (for raw AST compatibility)
const objTypeInt = getEnumInt('ObjectType', 'OBJECT_TABLE'); // → 18

// Number to string
const objTypeStr = getEnumString('ObjectType', 18); // → 'OBJECT_TABLE'
```

Note: @pgsql/parser already converts numeric enums to strings, so these are mainly useful for:
- Working with raw PostgreSQL ASTs
- Debugging enum-related issues
- Building custom transformers

### 3. Runtime Schema (`runtime-schema.ts`)
Describes the structure of AST nodes:

```typescript
import { runtimeSchema } from '@pgsql/transform/src/13/runtime-schema';

// Find node specification
const nodeSpec = runtimeSchema.find(n => n.name === 'AlterTableStmt');
console.log(nodeSpec.fields);
// [
//   { name: 'relation', type: 'RangeVar', isArray: false, optional: false },
//   { name: 'cmds', type: 'AlterTableCmd', isArray: true, optional: true },
//   { name: 'relkind', type: 'ObjectType', isArray: false, optional: true },
//   ...
// ]
```

## Transformation Details

### v13 → v14

**Field Renames:**
- `AlterTableStmt.relkind` → `AlterTableStmt.objtype`
- `CreateTableAsStmt.relkind` → `CreateTableAsStmt.objtype`

### v14 → v15

**A_Const Restructuring:**

The most significant change is the flattening of A_Const structure:

```typescript
// v14 structure
{
  "A_Const": {
    "val": {
      "String": { "str": "hello" }
    },
    "location": 7
  }
}

// v15 structure
{
  "A_Const": {
    "sval": { "sval": "hello" },
    "location": 7
  }
}
```

**Field mappings:**
- String: `val.String.str` → `sval.sval`
- Integer: `val.Integer.ival` → `ival.ival`
- Float: `val.Float.fval` → `fval.fval`
- BitString: `val.BitString.bsval` → `bsval.bsval`
- Boolean: `val.Boolean.boolval` → `boolval.boolval`
- Null: `val.Null` → `isnull: true`

**Other String Field Renames:**
- `String.str` → `String.sval`
- `BitString.str` → `BitString.bsval`
- `Float.str` → `Float.fval`

**Publication Changes:**
- `AlterPublicationStmt.tables` → `AlterPublicationStmt.pubobjects`
- `AlterPublicationStmt.tableAction` → `AlterPublicationStmt.action`

### v15 → v16

Minimal changes for basic queries. For advanced features:
- `Aggref.aggtranstype` → `Aggref.aggtransno`

### v16 → v17

No changes for basic queries. Pass-through transformer.

## Creating Custom Transformers

To add support for new versions or custom transformations:

```typescript
import { BaseTransformer } from '@pgsql/transform/src/base-transformer';
import { TransformContext } from '@pgsql/transform/src/types';

export class V17ToV18Transformer extends BaseTransformer {
  constructor() {
    super(
      { from: 17, to: 18 },
      'Transform PostgreSQL AST from v17 to v18'
    );
  }

  protected createDefaultContext(): TransformContext {
    return {
      version: { from: 17, to: 18 },
      fieldRenames: {
        'SomeNode': {
          'oldFieldName': 'newFieldName'
        }
      },
      enumMappings: {
        'SomeEnum': {
          'OLD_VALUE': 'NEW_VALUE'
        }
      }
    };
  }

  protected transformNode(node: any): any {
    // Handle special cases
    if (node.SomeSpecialNode) {
      return this.transformSomeSpecialNode(node);
    }
    
    // Delegate to base transformer for generic handling
    return this.transformGenericNode(node);
  }
  
  private transformSomeSpecialNode(node: any): any {
    // Custom transformation logic
    const transformed = { ...node.SomeSpecialNode };
    // ... modifications ...
    return { SomeSpecialNode: transformed };
  }
}
```

## Testing Transformations

The package includes comprehensive test fixtures:

```bash
# Run all tests
npm test

# Run the demo
node demo.js

# Test specific transformations
node dist/test-transformers.js
```

## Performance Considerations

- Transformations are performed in-place where possible
- The system uses shallow copying to minimize memory usage
- Statistics collection can be disabled for better performance
- Location fields are preserved by default but can be stripped

## Debugging

Enable statistics to track transformation progress:

```typescript
const result = transformASTWithResult(ast, 13, 17, { 
  collectStats: true,
  preserveLocation: true 
});

console.log(result.stats);
// {
//   nodesTransformed: 467,
//   fieldsRenamed: 1,
//   enumsConverted: 0,
//   errors: []
// }
```

Check for errors in the stats:
```typescript
if (result.stats.errors.length > 0) {
  console.error('Transformation errors:', result.stats.errors);
}
```