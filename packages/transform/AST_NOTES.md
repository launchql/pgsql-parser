# AST Transformer Implementation

IMPORANT: update, improve, and leverage `expectOldAstToTransformToNewAst` in packages/transform/test-utils/expect-ast.ts


## Visitor Pattern Architecture

The deparser in `packages/deparser` demonstrates an elegant visitor pattern that can be leveraged for building AST transformers. The core approach follows these principles:

### Key Components

1. **Main Visitor Class**: A central class that implements the visitor interface
2. **Dynamic Method Dispatch**: Uses node type names to automatically route to handler methods
3. **Context Propagation**: Passes context through the visitor tree for state management
4. **Simple Method Signatures**: Each node handler follows a consistent `NodeType(node, context)` pattern

### Core Pattern from Deparser

```typescript
// Main visitor method - routes to specific handlers
visit(node: Node, context: Context): ResultType {
  const nodeType = this.getNodeType(node);
  const nodeData = this.getNodeData(node);
  
  const methodName = nodeType as keyof this;
  if (typeof this[methodName] === 'function') {
    return (this[methodName] as any)(nodeData, context);
  }
  
  throw new Error(`Handler not found for: ${nodeType}`);
}

// Individual node handlers - clean, focused methods
SelectStmt(node: SelectStmt, context: Context): ResultType {
  // Transform logic here
  return transformedResult;
}

A_Const(node: A_Const, context: Context): ResultType {
  // Transform logic here  
  return transformedResult;
}
```

### Benefits for AST Transformation

- **Extensible**: Easy to add new node type handlers
- **Maintainable**: Each transformation is isolated to its own method
- **Debuggable**: Clear method names match AST node types exactly — method names match the Type.
- **Composable**: Handlers can call `visit()` recursively for child nodes, OR directly call another vistor function directly if it's not a `Node` type and inlined.

### Implementation Strategy

Apply this same pattern to build transformers for PG version migrations (13→14, 14→15, etc.) where each transformer class handles the specific changes needed for that version transition.

## Runtime Schema and Enum Tools

Check the `src/13`, `src/14`, `src/15`, `src/16`, `src/16` directories for useful runtime schema utilities that may help with AST generation.

The enum tooling is particularly helpful for earlier PostgreSQL versions (PG13 and PG14) that used numeric enums in their AST instead of strings. These directories contain:

- Type definitions
- Enum mappings  
- Enum conversion functions for translating between numeric and string representations

### Scripts

The `scripts/` directory contains several analysis tools for understanding AST differences and enum representations across PostgreSQL versions. These tools depend on fixtures generated from actual PostgreSQL ASTs.

#### Core Scripts

**1. `generate-ast-fixtures.js`** - Foundation for all analysis
- **Purpose**: Generates AST fixtures for PostgreSQL versions 13-17
- **Output**: Creates `__fixtures__/transform/{version}/` directories with JSON files
- **Query Coverage**: 
  - Basic operations: SELECT, INSERT, UPDATE, DELETE
  - DDL: CREATE TABLE, ALTER TABLE
  - Advanced: Complex queries with CTEs, JOINs, window functions
- **Usage**: `node packages/transform/scripts/generate-ast-fixtures.js`
- **Note**: Must be run first to create the fixture data that other scripts depend on

**2. `analyze-ast-differences.js`** - Version migration analysis
- **Purpose**: Deep comparison of AST structures between PostgreSQL versions
- **Capabilities**:
  - Detects field renames (e.g., `relkind` → `objtype`)
  - Identifies structure changes (e.g., A_Const flattening in v14→v15)
  - Finds enum value changes
  - Categorizes differences by type and affected nodes
- **Output**: Console report + `ast-differences-analysis.json`
- **Usage**: `node packages/transform/scripts/analyze-ast-differences.js`

**3. `analyze-enum-representation.js`** - Enum format analysis
- **Purpose**: Analyzes how enums are represented across versions (numeric vs string)
- **Key Insights**:
  - PG13/14 use numeric enums in many cases
  - PG15+ moved to string-based enums
  - Identifies fields that need enum conversion during transformation
- **Usage**: `node packages/transform/scripts/analyze-enum-representation.js`

**4. `pg-proto-parser.ts`** - Type generation utility
- **Purpose**: Generates TypeScript types and utilities from PostgreSQL protobuf definitions
- **Output**: Creates `src/{version}/` directories with:
  - Type definitions
  - Enum mappings
  - Runtime schema information
  - Enum conversion utilities (`enum-to-int.ts`, `enum-to-str.ts`)

#### Analysis Workflow

1. **Generate Fixtures**: Run `generate-ast-fixtures.js` to create base data
2. **Analyze Differences**: Use `analyze-ast-differences.js` to understand version changes
3. **Study Enums**: Run `analyze-enum-representation.js` for enum conversion patterns
4. **Generate Types**: Use `pg-proto-parser.ts` for type definitions and utilities

#### Fixture Quality & Coverage

**Current State**: The fixtures provide good coverage for common SQL operations but could benefit from expansion.

**Improvement Areas**:
- More complex DDL operations (CREATE INDEX, constraints, etc.)
- Advanced SQL features (window functions, recursive CTEs)
- PostgreSQL-specific syntax (arrays, JSON operations, etc.)
- Edge cases and error conditions

**Adding New Test Cases**: Modify the `queries` object in `generate-ast-fixtures.js`:

```javascript
const queries = {
  // ... existing queries ...
  'new_feature': [
    'SELECT ARRAY[1,2,3]',
    'SELECT jsonb_path_query(data, "$.key")'
  ]
};
```

#### Script Limitations

- **Robustness**: These are analysis tools, not production utilities
- **Error Handling**: Limited error recovery for malformed ASTs
- **Performance**: Not optimized for large-scale analysis
- **Dependencies**: Require consistent fixture generation to be meaningful

#### Practical Usage Tips

- **Incremental Analysis**: Focus on specific version transitions (e.g., 14→15)
- **Query Expansion**: Add representative queries for your specific use cases
- **Pattern Recognition**: Look for consistent patterns across multiple query types
- **Validation**: Cross-reference findings with PostgreSQL release notes

### Transformers

#### v13 → v14 (`v13-to-v14.ts`)
- **Changes**: Field rename `relkind` → `objtype`
- **Affected nodes**: `AlterTableStmt`, `CreateTableAsStmt`

#### v14 → v15 (`v14-to-v15.ts`)
- **Major change**: A_Const structure flattening
  - Before: `A_Const.val.String.str`
  - After: `A_Const.sval.sval`
- **Field renames**:
  - `String.str` → `String.sval`
  - `BitString.str` → `BitString.bsval`
  - `Float.str` → `Float.fval`
- **Other changes**:
  - `tables` → `pubobjects` in publication statements
  - `tableAction` → `action` in `AlterPublicationStmt`

#### v15 → v16 (`v15-to-v16.ts`)
- **Changes**: Minimal for basic queries
- **Advanced features**: Support for Var node changes, Aggref field rename

#### v16 → v17 (`v16-to-v17.ts`)
- **Changes**: None for basic queries
- **Note**: Pass-through transformer for compatibility
