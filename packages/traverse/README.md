# @pgsql/traverse

PostgreSQL AST traversal utilities for pgsql-parser. This package provides a visitor pattern for traversing PostgreSQL Abstract Syntax Tree (AST) nodes, similar to Babel's traverse functionality but specifically designed for PostgreSQL AST structures.

## Installation

```bash
npm install @pgsql/traverse
```

## Usage

### Basic Traversal

```typescript
import { visit } from '@pgsql/traverse';
import type { Visitor } from '@pgsql/traverse';

const visitor: Visitor = {
  SelectStmt: (node, ctx) => {
    console.log('Found SELECT statement:', node);
  },
  RangeVar: (node, ctx) => {
    console.log('Found table reference:', node.relname);
  }
};

const ast = {
  SelectStmt: {
    targetList: [
      {
        ResTarget: {
          val: {
            ColumnRef: {
              fields: [{ A_Star: {} }]
            }
          }
        }
      }
    ],
    fromClause: [
      {
        RangeVar: {
          relname: 'users',
          inh: true,
          relpersistence: 'p'
        }
      }
    ],
    limitOption: 'LIMIT_OPTION_DEFAULT',
    op: 'SETOP_NONE'
  }
};

visit(ast, visitor);
```

### Working with ParseResult

```typescript
import { visit } from '@pgsql/traverse';
import type { Visitor } from '@pgsql/traverse';

const visitor: Visitor = {
  ParseResult: (node, ctx) => {
    console.log('PostgreSQL version:', node.version);
  },
  RawStmt: (node, ctx) => {
    console.log('Found statement at path:', ctx.path);
  }
};

const parseResult = {
  ParseResult: {
    version: 170004,
    stmts: [
      {
        RawStmt: {
          stmt: {
            SelectStmt: {
              targetList: [],
              limitOption: 'LIMIT_OPTION_DEFAULT',
              op: 'SETOP_NONE'
            }
          }
        }
      }
    ]
  }
};

visit(parseResult, visitor);
```

### Using Visitor Context

The visitor context provides useful information about the current traversal state:

```typescript
import { visit } from '@pgsql/traverse';
import type { Visitor, VisitorContext } from '@pgsql/traverse';

const visitor: Visitor = {
  RangeVar: (node, ctx: VisitorContext) => {
    console.log('Table name:', node.relname);
    console.log('Path to this node:', ctx.path);
    console.log('Parent object:', ctx.parent);
    console.log('Key in parent:', ctx.key);
  }
};
```

### Collecting Information During Traversal

```typescript
import { visit } from '@pgsql/traverse';
import type { Visitor } from '@pgsql/traverse';

const tableNames: string[] = [];
const columnRefs: string[] = [];

const visitor: Visitor = {
  RangeVar: (node) => {
    if (node.relname) {
      tableNames.push(node.relname);
    }
  },
  ColumnRef: (node) => {
    if (node.fields) {
      node.fields.forEach(field => {
        if (field.String?.sval) {
          columnRefs.push(field.String.sval);
        }
      });
    }
  }
};

visit(ast, visitor);

console.log('Tables referenced:', tableNames);
console.log('Columns referenced:', columnRefs);
```

## API

### `visit(node, visitor, ctx?)`

Recursively visits a PostgreSQL AST node, calling any matching visitor functions.

**Parameters:**
- `node: KnownNode` - The AST node to traverse (can be a ParseResult, wrapped node, or any PostgreSQL AST node)
- `visitor: Visitor` - Object containing visitor functions for different node types
- `ctx?: VisitorContext` - Optional initial context (usually not needed)

### Types

#### `Visitor`

An object where keys are PostgreSQL AST node type names and values are visitor functions:

```typescript
type Visitor = {
  [K in keyof KnownNode]?: (node: KnownNode[K], ctx: VisitorContext) => void;
};
```

#### `VisitorContext`

Context information provided to each visitor function:

```typescript
type VisitorContext = {
  path: (string | number)[];  // Path to current node (e.g., ['SelectStmt', 'fromClause', 0])
  parent: any;                // Parent object containing this node
  key: string | number;       // Key or index of this node in its parent
};
```

## Supported Node Types

This package works with all PostgreSQL AST node types defined in `@pgsql/types`, including:

- `ParseResult` - Root parse result from libpg-query
- `SelectStmt` - SELECT statements
- `InsertStmt` - INSERT statements
- `UpdateStmt` - UPDATE statements
- `DeleteStmt` - DELETE statements
- `RangeVar` - Table references
- `ColumnRef` - Column references
- `A_Expr` - Expressions
- `A_Const` - Constants
- And many more...

## Integration with pgsql-parser

This package is designed to work seamlessly with the pgsql-parser ecosystem:

```typescript
import { parse } from 'pgsql-parser';
import { visit } from '@pgsql/traverse';

const sql = 'SELECT name, email FROM users WHERE age > 18';
const ast = await parse(sql);

const visitor = {
  RangeVar: (node) => {
    console.log('Table:', node.relname);
  },
  ColumnRef: (node) => {
    console.log('Column:', node.fields?.[0]?.String?.sval);
  }
};

visit(ast, visitor);
```

## Related

* [pgsql-parser](https://www.npmjs.com/package/pgsql-parser): The real PostgreSQL parser for Node.js
* [pgsql-deparser](https://www.npmjs.com/package/pgsql-deparser): Convert PostgreSQL ASTs back into SQL queries
* [@pgsql/types](https://www.npmjs.com/package/@pgsql/types): TypeScript type definitions for PostgreSQL AST nodes
* [@pgsql/utils](https://www.npmjs.com/package/@pgsql/utils): Utility library for PostgreSQL AST node creation

## License

SEE LICENSE IN LICENSE
