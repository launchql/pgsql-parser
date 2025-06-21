# Deparser Entry Point Analysis

## Overview

This document analyzes the entry points of the deparser system, focusing on how users interact with the top-level API and how we can refactor to make the system more consistent and intuitive.

## Current Entry Points

### 1. Constructor Entry Point
```typescript
constructor(tree: Node | Node[] | t.ParseResult, opts: DeparserOptions = {})
```

The constructor currently accepts three types of input:
- Single `Node` object
- Array of `Node` objects
- `ParseResult` object

### 2. Static Deparse Method
```typescript
static deparse(query: Node | Node[] | t.ParseResult, opts: DeparserOptions = {}): string
```

This is the primary public API that users call.

### 3. Instance Method
```typescript
deparseQuery(): string
```

This method processes the internal tree array.

## Type Analysis

### ParseResult Type
```typescript
export interface ParseResult {
  version?: number;
  stmts?: RawStmt[];
}
```

`ParseResult` is the top-level structure returned by the PostgreSQL parser. It contains:
- `version`: The parser version
- `stmts`: An array of `RawStmt` objects

### RawStmt Type
```typescript
export interface RawStmt {
  stmt?: Node;
  stmt_location?: number;
  stmt_len?: number;
}
```

`RawStmt` wraps the actual statement node with metadata:
- `stmt`: The actual statement node (e.g., `SelectStmt`, `InsertStmt`, etc.)
- `stmt_location`: Character position in the original query
- `stmt_len`: Length of the statement in the original query

### Node Type
The `Node` type is a discriminated union of all possible AST node types, including `ParseResult` itself:
```typescript
export type Node = {
  ParseResult: ParseResult;
} | {
  RawStmt: RawStmt;
} | {
  SelectStmt: SelectStmt;
} | ... // many more node types
```

## Current Implementation Issues

### 1. Inconsistent Handling of ParseResult

In the constructor, `ParseResult` is handled specially:
```typescript
if (tree && typeof tree === 'object' && !Array.isArray(tree) && 'stmts' in tree) {
  // This is a ParseResult
  const parseResult = tree as t.ParseResult;
  // Extract the actual Node from each RawStmt
  this.tree = (parseResult.stmts || []).map(rawStmt => rawStmt.stmt).filter(stmt => stmt !== undefined) as Node[];
}
```

This duck-typing approach checks for the presence of `stmts` property rather than properly checking the node type.

### 2. Missing ParseResult Method

There's no `ParseResult` method in the deparser, even though `ParseResult` is a valid `Node` type. This means if someone passes `{ ParseResult: parseResult }` (the wrapped form), it will fail.

### 3. Inconsistent stmt Method

The `stmt` method appears to handle wrapped statement nodes:
```typescript
stmt(node: any, context: DeparserContext = { parentNodeTypes: [] }): string {
  // Handle stmt wrapper nodes that contain the actual statement
  const keys = Object.keys(node);
  if (keys.length === 1) {
    const statementType = keys[0];
    const methodName = statementType as keyof this;
    if (typeof this[methodName] === 'function') {
      return (this[methodName] as any)(node[statementType], context);
    }
  }
}
```

But this method is never called in the normal flow - statements are handled directly.

### 4. Unused version Method

The `version` method exists but is never called because version information is stripped during ParseResult processing.

## Proposed Refactoring

### 1. Add Proper ParseResult Method

```typescript
ParseResult(node: t.ParseResult, context: DeparserContext): string {
  if (!node.stmts || node.stmts.length === 0) {
    return '';
  }
  
  return node.stmts
    .map(rawStmt => this.RawStmt(rawStmt, context))
    .join(this.formatter.newline() + this.formatter.newline());
}
```

### 2. Simplify Constructor

The constructor should treat all inputs uniformly:

```typescript
constructor(tree: Node | Node[] | t.ParseResult, opts: DeparserOptions = {}) {
  this.formatter = new SqlFormatter(opts.newline, opts.tab);
  this.options = {
    functionDelimiter: '$$',
    functionDelimiterFallback: '$EOFCODE$',
    ...opts
  };
  
  // Only allow duck-typing for ParseResult (not wrapped)
  if (tree && typeof tree === 'object' && !Array.isArray(tree) && 'stmts' in tree && !('ParseResult' in tree)) {
    // This is a bare ParseResult object
    this.tree = [{ ParseResult: tree as t.ParseResult }];
  } else if (Array.isArray(tree)) {
    this.tree = tree;
  } else {
    this.tree = [tree as Node];
  }
}
```

### 3. Update deparseQuery Method

```typescript
deparseQuery(): string {
  return this.tree
    .map(node => {
      // For top-level nodes, we want to handle them directly
      const nodeType = this.getNodeType(node);
      
      // Special handling for ParseResult at the top level
      if (nodeType === 'ParseResult') {
        return this.ParseResult((node as any).ParseResult, { parentNodeTypes: [] });
      }
      
      return this.deparse(node);
    })
    .filter(result => result !== null && result !== '')
    .join(this.formatter.newline() + this.formatter.newline());
}
```

### 4. Remove Redundant Methods

- The `stmt` method appears to be unused and can be removed
- The `version` method is also unused in the current flow

### 5. Improve Type Safety

Instead of using `any` types and duck-typing, we should use proper type guards:

```typescript
function isParseResult(obj: any): obj is t.ParseResult {
  return obj && typeof obj === 'object' && 'stmts' in obj;
}

function isWrappedNode(obj: any): obj is Node {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  return keys.length === 1 && typeof obj[keys[0]] === 'object';
}
```

## Benefits of Refactoring

1. **Consistency**: All node types, including `ParseResult`, would be handled uniformly through their respective methods
2. **Type Safety**: Proper type guards instead of duck-typing
3. **Clarity**: Clear separation between wrapped nodes (`{ ParseResult: ... }`) and bare objects
4. **Extensibility**: Easy to add new top-level node types in the future
5. **Debugging**: Each node type has its own method, making it easier to trace execution

## Current Usage Patterns

Based on the test suite analysis, the current usage pattern is:
```typescript
// Tests parse SQL and extract individual statements
const tree = await parse(sql);
tree.stmts.forEach(stmt => {
  // Pass the inner stmt directly, not the RawStmt wrapper
  const outSql = deparse(stmt.stmt);
});
```

This shows that users are currently:
1. Parsing SQL to get a `ParseResult`
2. Iterating over `stmts` array to get `RawStmt` objects
3. Extracting the `stmt` property from each `RawStmt`
4. Passing the bare statement to `deparse()`

This pattern bypasses the `RawStmt` wrapper entirely, losing the `stmt_location` and `stmt_len` metadata.

## Migration Path

1. **Phase 1: Add Missing Methods** (backward compatible)
   - Add `ParseResult` method to handle wrapped ParseResult nodes
   - Ensure `RawStmt` method properly handles semicolon addition based on `stmt_len`
   - Keep existing duck-typing for bare ParseResult objects

2. **Phase 2: Encourage Best Practices** (minor version)
   - Add documentation showing preferred usage: `deparse(parseResult)`
   - Add optional warnings when duck-typing is used
   - Show how to preserve statement metadata by passing full structures

3. **Phase 3: Deprecate Duck-Typing** (major version)
   - Remove duck-typing support for bare ParseResult objects
   - Require all inputs to be properly wrapped Node types
   - This ensures consistent handling and preserves all metadata

## Example of Improved Usage

```typescript
// Current (loses metadata)
const tree = await parse(sql);
tree.stmts.forEach(stmt => {
  const outSql = deparse(stmt.stmt);
});

// Improved (preserves all metadata)
const tree = await parse(sql);
const outSql = deparse(tree); // Pass the entire ParseResult

// Or for individual statements with metadata
tree.stmts.forEach(rawStmt => {
  const outSql = deparse({ RawStmt: rawStmt });
});
```

This refactoring would make the deparser more consistent with the AST structure and easier to understand and maintain.