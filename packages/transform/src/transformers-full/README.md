# Direct Transformers

This directory contains optimized, direct transformers for upgrading PostgreSQL ASTs from specific versions directly to PG17. These transformers are designed to support tree-shaking, allowing you to import only the transformer you need without pulling in unnecessary code for other version transformations.

## Available Transformers

- **PG13ToPG17Transformer**: Transforms ASTs from PostgreSQL 13 to 17
- **PG14ToPG17Transformer**: Transforms ASTs from PostgreSQL 14 to 17
- **PG15ToPG17Transformer**: Transforms ASTs from PostgreSQL 15 to 17
- **PG16ToPG17Transformer**: Transforms ASTs from PostgreSQL 16 to 17

## Usage

### Basic Usage

```typescript
import { PG15ToPG17Transformer } from '@pgsql/transform/transformers-direct/v15-to-v17';
import { Parser } from '@pgsql/parser';

// Parse with PG15
const pg15Parser = new Parser({ version: 15 });
const pg15Ast = await pg15Parser.parse('SELECT * FROM users');

// Transform to PG17
const transformer = new PG15ToPG17Transformer();
const pg17Ast = transformer.transform(pg15Ast);
```

### Using Pre-instantiated Transformers

For convenience, each module also exports a pre-instantiated transformer:

```typescript
import { pg15ToPg17Transformer } from '@pgsql/transform/transformers-direct/v15-to-v17';

const pg17Ast = pg15ToPg17Transformer.transform(pg15Ast);
```

### Transforming Individual Statements

You can also transform individual statements without the parse result wrapper:

```typescript
import { PG15ToPG17Transformer } from '@pgsql/transform/transformers-direct/v15-to-v17';

const transformer = new PG15ToPG17Transformer();
const transformedStmt = transformer.transformStatement(selectStmt);
```

## Tree-Shaking Benefits

By importing only the specific transformer you need, your bundle will only include:

- The transformer for your specific version upgrade path
- Only the intermediate transformers needed for that path
- Only the type definitions for your source and target versions

For example:
- Importing `PG16ToPG17Transformer` only includes the v16->v17 transformer
- Importing `PG15ToPG17Transformer` includes v15->v16 and v16->v17 transformers
- Importing `PG14ToPG17Transformer` includes v14->v15, v15->v16, and v16->v17 transformers
- Importing `PG13ToPG17Transformer` includes all transformers in the chain

## Type Safety

Each transformer is fully typed with the appropriate input and output types:

```typescript
import { PG15ToPG17Transformer } from '@pgsql/transform/transformers-direct/v15-to-v17';
import type { ParseResult as PG15ParseResult } from '@pgsql/transform/15/types';
import type { ParseResult as PG17ParseResult } from '@pgsql/transform/17/types';

const transformer = new PG15ToPG17Transformer();

// Type-safe transformation
const transform = (pg15Ast: PG15ParseResult): PG17ParseResult => {
  return transformer.transform(pg15Ast);
};
```

## Implementation Details

Each direct transformer:
1. Chains the necessary intermediate transformers internally
2. Handles the parse result structure with `stmts` array
3. Updates the version number to PG17 (170004)
4. Preserves all other properties of the parse result

The transformers are implemented as separate modules to ensure proper tree-shaking by modern bundlers.