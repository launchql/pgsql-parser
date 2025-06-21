# Deparser Usage Guide

The deparser converts PostgreSQL AST nodes back to SQL strings. It handles various input formats from libpg-query and custom node structures.

## Entry Points

### 1. ParseResult from libpg-query

The most common entry point - handles the complete parse result from libpg-query:

```typescript
import deparse from '@pgsql/deparser';

const parseResult = {
  version: 170004,
  stmts: [
    { stmt: { SelectStmt: {...} }, stmt_len: 32 },
    { stmt: { InsertStmt: {...} }, stmt_location: 20, stmt_len: 39 }
  ]
};

const sql = deparse(parseResult);
// Returns: "SELECT ...;\nINSERT ..."
```

**Structure:**
```typescript
ParseResult {
  version: number;
  stmts: RawStmt[];  // Array contains RawStmt objects inline
}

RawStmt {
  stmt: Node;
  stmt_len?: number;
  stmt_location?: number;
}
```

### 2. Wrapped ParseResult Node

When ParseResult is explicitly wrapped as a Node:

```typescript
const wrappedParseResult = {
  ParseResult: {
    version: 170004,
    stmts: [{ stmt: { SelectStmt: {...} }, stmt_len: 32 }]
  }
};

const sql = deparse(wrappedParseResult);
```

### 3. Wrapped RawStmt Node

For deparsing individual statements wrapped as nodes:

```typescript
const rawStmtNode = {
  RawStmt: {
    stmt: { SelectStmt: {...} },
    stmt_len: 32
  }
};

const sql = deparse(rawStmtNode);
// Returns: "SELECT ...;"
```

### 4. Array of Nodes

For deparsing multiple statement nodes:

```typescript
const nodes = [
  { SelectStmt: {...} },
  { InsertStmt: {...} }
];

const sql = deparse(nodes);
// Returns: "SELECT ...;\n\nINSERT ...;"
```

### 5. Single Statement Node

For deparsing individual statement nodes directly:

```typescript
const selectNode = { SelectStmt: {...} };
const sql = deparse(selectNode);
// Returns: "SELECT ..."
```

## Options

The deparser accepts an optional second parameter for configuration:

```typescript
const options = {
  // Add semicolons to statements (default: true for RawStmt with stmt_len)
  semicolons: true,
  
  // Custom context can be passed through
  myCustomOption: 'value'
};

const sql = deparse(parseResult, options);
```

## Instance Usage

You can also create a deparser instance:

```typescript
import { Deparser } from '@pgsql/deparser';

const deparser = new Deparser(parseResult);
const sql = deparser.deparse();

// Or with options
const deparserWithOpts = new Deparser(parseResult, options);
const sqlWithOpts = deparserWithOpts.deparse();
```

## Important Notes

1. **RawStmt in ParseResult**: The `stmts` array in ParseResult contains RawStmt objects inline (not wrapped as nodes) due to the protobuf "repeated RawStmt" definition.

2. **Semicolon Handling**: Semicolons are automatically added to RawStmt objects that have a `stmt_len` property, indicating they were complete statements in the original SQL.

3. **Empty Statements**: Empty or null statements are filtered out automatically.

4. **Statement Joining**: 
   - Multiple statements in arrays are joined with `;\n\n` (semicolon + double newline)
   - Multiple statements from ParseResult are joined with `\n\n` (double newline)

## Type Guards

The deparser uses internal type guards to detect input types:

- `isParseResult()` - Detects bare ParseResult objects
- `isWrappedParseResult()` - Detects wrapped ParseResult nodes

These ensure proper handling of different input formats automatically.

## Examples

### Complete Example

```typescript
import deparse from '@pgsql/deparser';
import { parse } from '@pgsql/parser';

// Parse SQL
const sql = 'SELECT * FROM users; INSERT INTO logs (action) VALUES ($1);';
const parseResult = parse(sql);

// Deparse back to SQL
const regeneratedSql = deparse(parseResult);
console.log(regeneratedSql);
// Output: "SELECT * FROM users;\n\nINSERT INTO logs (action) VALUES ($1);"
```

### Custom Node Example

```typescript
// Creating a custom SELECT node
const customSelect = {
  SelectStmt: {
    targetList: [{
      ResTarget: {
        val: { ColumnRef: { fields: [{ String: { sval: '*' } }] } }
      }
    }],
    fromClause: [{
      RangeVar: {
        relname: 'users',
        inh: true,
        relpersistence: 'p'
      }
    }]
  }
};

const sql = deparse(customSelect);
// Output: "SELECT * FROM users"
```