# @pgsql/traverse

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>


<p align="center" width="100%">
  <a href="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/launchql/pgsql-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
</p>


PostgreSQL AST traversal utilities for pgsql-parser. This package provides a visitor pattern for traversing PostgreSQL Abstract Syntax Tree (AST) nodes, similar to Babel's traverse functionality but specifically designed for PostgreSQL AST structures.

## Installation

```bash
npm install @pgsql/traverse
```

## Usage

### Walk API (Recommended)

The `walk` function provides improved traversal with NodePath context and early return support:

```typescript
import { walk, NodePath } from '@pgsql/traverse';
import type { Walker, Visitor } from '@pgsql/traverse';

// Using a simple walker function
const walker: Walker = (path: NodePath) => {
  console.log(`Visiting ${path.tag} at path:`, path.path);
  
  // Return false to skip traversing children
  if (path.tag === 'SelectStmt') {
    return false; // Skip SELECT statement children
  }
};

walk(ast, walker);

// Using a visitor object (recommended for multiple node types)
const visitor: Visitor = {
  SelectStmt: (path) => {
    console.log('SELECT statement:', path.node);
  },
  RangeVar: (path) => {
    console.log('Table:', path.node.relname);
    console.log('Path to table:', path.path);
    console.log('Parent node:', path.parent?.tag);
  }
};

walk(ast, visitor);
```

### NodePath Class

The `NodePath` class provides rich context information:

```typescript
class NodePath<TTag extends NodeTag = NodeTag> {
  tag: TTag;           // Node type (e.g., 'SelectStmt', 'RangeVar')
  node: Node[TTag];    // The actual node data
  parent: NodePath | null;  // Parent NodePath (null for root)
  keyPath: readonly (string | number)[];  // Full path array
  
  get path(): (string | number)[];  // Copy of keyPath
  get key(): string | number;       // Last element of path
}
```

### Runtime Schema Integration

The new implementation uses PostgreSQL's runtime schema to precisely determine which fields contain Node types that need traversal, eliminating guesswork and improving accuracy.

### Visit API

The original `visit` function is still available for backward compatibility:

```typescript
import { visit } from '@pgsql/traverse';

const visitor = {
  SelectStmt: (node, ctx) => {
    console.log('Found SELECT statement:', node);
    console.log('Path:', ctx.path);
  },
  RangeVar: (node, ctx) => {
    console.log('Found table reference:', node.relname);
  }
};

// Parse some SQL and traverse the AST
const ast = /* your parsed AST */;
visit(ast, visitor);
```

### Working with ParseResult

```typescript
import { walk } from '@pgsql/traverse';

const visitor = {
  ParseResult: (path) => {
    console.log('Parse result version:', path.node.version);
    console.log('Number of statements:', path.node.stmts.length);
  },
  SelectStmt: (path) => {
    console.log('SELECT statement found');
  }
};

walk(parseResult, visitor);
```

### Using Visitor Context

The visitor context provides information about the current traversal state:

```typescript
const visitor = {
  RangeVar: (path) => {
    console.log('Table name:', path.node.relname);
    console.log('Path to this node:', path.path);
    console.log('Parent node:', path.parent?.tag);
    console.log('Key in parent:', path.key);
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

### `walk(root, callback, parent?, keyPath?)`

Walks the tree of PostgreSQL AST nodes using runtime schema for precise traversal.

**Parameters:**
- `root`: The AST node to traverse
- `callback`: A walker function or visitor object
- `parent?`: Optional parent NodePath (for internal use)
- `keyPath?`: Optional key path array (for internal use)

**Example:**
```typescript
walk(ast, {
  SelectStmt: (path) => {
    // Handle SELECT statements
    // Return false to skip children
  },
  RangeVar: (path) => {
    // Handle table references
  }
});
```

### `visit(node, visitor, ctx?)` (Legacy)

Recursively visits a PostgreSQL AST node, calling any matching visitor functions. Maintained for backward compatibility.

**Parameters:**
- `node`: The AST node to traverse
- `visitor`: An object with visitor functions for different node types
- `ctx?`: Optional initial visitor context

### Types

#### `Visitor`

An object type where keys are node type names and values are walker functions:

```typescript
type Visitor = {
  [TTag in NodeTag]?: Walker<NodePath<TTag>>;
};
```

#### `Walker`

A function that receives a NodePath and can return false to skip children:

```typescript
type Walker<TNodePath extends NodePath = NodePath> = (
  path: TNodePath,
) => boolean | void;
```

#### `NodePath`

A class that encapsulates node traversal context:

```typescript
class NodePath<TTag extends NodeTag = NodeTag> {
  tag: TTag;                                    // Node type
  node: Node[TTag];                            // Node data
  parent: NodePath | null;                     // Parent path
  keyPath: readonly (string | number)[];       // Full path
  
  get path(): (string | number)[];             // Path copy
  get key(): string | number;                  // Current key
}
```

#### `VisitorContext` (Legacy)

Context information provided to legacy visitor functions:

```typescript
type VisitorContext = {
  path: (string | number)[];  // Path to current node
  parent: any;                // Parent node
  key: string | number;       // Key in parent node
};
```

#### `NodeTag`

Union type of all PostgreSQL AST node type names:

```typescript
type NodeTag = keyof Node;
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

* [pgsql-parser](https://www.npmjs.com/package/pgsql-parser): The real PostgreSQL parser for Node.js, providing symmetric parsing and deparsing of SQL statements with actual PostgreSQL parser integration.
* [pgsql-deparser](https://www.npmjs.com/package/pgsql-deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [@pgsql/parser](https://www.npmjs.com/package/@pgsql/parser): Multi-version PostgreSQL parser with dynamic version selection at runtime, supporting PostgreSQL 15, 16, and 17 in a single package.
* [@pgsql/types](https://www.npmjs.com/package/@pgsql/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/enums](https://www.npmjs.com/package/@pgsql/enums): Provides TypeScript enum definitions for PostgreSQL constants, enabling type-safe usage of PostgreSQL enums and constants in your applications.
* [@pgsql/utils](https://www.npmjs.com/package/@pgsql/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.
* [@pgsql/traverse](https://www.npmjs.com/package/@pgsql/traverse): PostgreSQL AST traversal utilities for pgsql-parser, providing a visitor pattern for traversing PostgreSQL Abstract Syntax Tree nodes, similar to Babel's traverse functionality but specifically designed for PostgreSQL AST structures.
* [pg-proto-parser](https://www.npmjs.com/package/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
