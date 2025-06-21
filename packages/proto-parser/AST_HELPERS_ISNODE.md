# AST Helper Methods Enhancement: isNode Parameter

## Overview

The `generateAstHelperMethods` function has been enhanced to add an optional `isNode` parameter to all generated helper methods. This parameter allows the methods to return either the raw type or a wrapped version of the type.

## Changes Made

### 1. Function Signature Update

Each generated method now accepts an optional second parameter `isNode`:

**Before:**
```typescript
alias(_p?: Alias): Alias {
  // ...
}
```

**After:**
```typescript
alias(_p?: Alias, isNode?: boolean): Alias | { Alias: Alias } {
  // ...
}
```

### 2. Return Type Update

The return type is now a union of:
- The original type (e.g., `Alias`)
- A wrapped object with the type name as key (e.g., `{ Alias: Alias }`)

### 3. Conditional Return Logic

The method body now includes a conditional check:

```typescript
if (isNode) {
  return {
    Alias: _j
  };
}
return _j;
```

## Usage Examples

### Default Behavior (isNode = false or undefined)
```typescript
import ast from './asts';

// Returns the raw Alias object
const alias = ast.alias({
  aliasname: "t",
  colnames: ["id", "name"]
});
// Result: { aliasname: "t", colnames: ["id", "name"] }
```

### Wrapped Output (isNode = true)
```typescript
import ast from './asts';

// Returns a wrapped object
const wrappedAlias = ast.alias({
  aliasname: "t",
  colnames: ["id", "name"]
}, true);
// Result: { Alias: { aliasname: "t", colnames: ["id", "name"] } }
```

## Benefits

1. **Backward Compatibility**: Existing code continues to work without modification since `isNode` defaults to `false`.

2. **Node Type Identification**: When `isNode` is true, the wrapped format makes it easy to identify the node type programmatically:
   ```typescript
   const node = ast.alias({ aliasname: "t" }, true);
   if ('Alias' in node) {
     // We know this is an Alias node
   }
   ```

3. **Flexible AST Construction**: Useful when building ASTs that need type information embedded in the structure.

4. **Type Safety**: TypeScript's union types ensure type safety for both return formats.

## Implementation Details

The changes were made in `/workspace/packages/proto-parser/src/ast/types/types.ts` in the `generateAstHelperMethods` function:

1. Added `isNodeParam` parameter with boolean type annotation
2. Created conditional return statement that wraps the object when `isNode` is true
3. Updated the return type to be a union type including both possibilities

All existing tests pass with updated snapshots to reflect the new function signatures.