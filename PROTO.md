# PostgreSQL Proto Parser - Runtime Schema and Type System Analysis

## Overview

This document provides a comprehensive analysis of the `SPECIAL_TYPES` constant, the runtime schema system, and recommendations for improving the type handling in the PostgreSQL proto parser.

## SPECIAL_TYPES Analysis

### Current Definition

The `SPECIAL_TYPES` constant is currently defined in `packages/parser/src/constants.ts`:

```typescript
export const SPECIAL_TYPES = ['TypeName', 'RangeVar'];
```

**Previous state:** Only contained `['TypeName']`, which was incomplete since RangeVar is also a wrapped type that requires special handling.

### Usage Locations

`SPECIAL_TYPES` is used in three main locations within the parser:

#### 1. AST Helper Generation (`packages/parser/src/ast/types/types.ts`, lines 21-35)

```typescript
export const generateAstHelperMethods = (types: Type[], options: PgProtoParserOptions) => {
  // ... code ...
  const specialTypes = SPECIAL_TYPES.map(type => {
    return `${type}: (${type.toLowerCase()}: ${type}['${type}']) => ({ ${type}: ${type.toLowerCase()} })`;
  }).join(',\n  ');
  // ... code ...
};
```

**Purpose**: Generates helper methods for creating AST nodes with special handling for types that need unwrapping.

#### 2. Wrapped Type Generation (`packages/parser/src/ast/types/types.ts`, lines 183-207)

```typescript
export const convertTypeToWrappedTsInterface = (type: Type, options: PgProtoParserOptions) => {
  // ... code ...
  if (SPECIAL_TYPES.includes(type.name)) {
    // Special handling for wrapped types
    return generateWrappedInterface(type, options);
  }
  // ... code ...
};
```

**Purpose**: Determines whether a type should be generated as a wrapped interface or a standard interface.

#### 3. Meta AST Code Generation (`packages/parser/src/utils/meta.ts`, line 13)

```typescript
// TODO — handle TypeName and SPECIAL_TYPES cases
```

**Purpose**: Incomplete implementation for handling special types in meta-level AST code generation.

### Analysis of Wrapped Types

Based on the protobuf definition in `__fixtures__/proto/17-latest.proto`, the `Node` message contains a `oneof` block with **268 wrapped types**. Here are some key findings:

#### Both TypeName and RangeVar are Wrapped Types

- **TypeName** (line 83): `TypeName type_name = 65 [json_name="TypeName"];`
- **RangeVar** (line 20): `RangeVar range_var = 2 [json_name="RangeVar"];`

Both types are listed in the `Node.oneof` block, making them wrapped types, yet only `TypeName` is included in `SPECIAL_TYPES`.

#### TypeName Message Definition (line 1050)

```protobuf
message TypeName {
  repeated Node names = 1 [json_name="names"];
  uint32 type_oid = 2 [json_name="typeOid"];
  int32 typemod = 3 [json_name="typemod"];
  repeated Node array_bounds = 4 [json_name="arrayBounds"];
  int32 location = 5 [json_name="location"];
}
```

#### RangeVar Message Definition (line 349)

```protobuf
message RangeVar {
  string catalogname = 1 [json_name="catalogname"];
  string schemaname = 2 [json_name="schemaname"];
  string relname = 3 [json_name="relname"];
  bool inh = 4 [json_name="inh"];
  string relpersistence = 5 [json_name="relpersistence"];
  Alias alias = 6 [json_name="alias"];
  int32 location = 7 [json_name="location"];
}
```

### Complete List of Wrapped Types

The `Node.oneof` block contains 268 wrapped types, including but not limited to:

- Alias, RangeVar, TableFunc, IntoClause, Var, Param
- Aggref, GroupingFunc, WindowFunc, SubscriptingRef, FuncExpr
- TypeName, ColumnRef, ParamRef, A_Expr, TypeCast
- CreateStmt, InsertStmt, DeleteStmt, UpdateStmt, SelectStmt
- Integer, Float, Boolean, String, BitString, List, IntList, OidList, A_Const
- And 240+ more types...

## Runtime Schema System

### NodeSpec Interface

The runtime schema system introduces a `NodeSpec` interface to represent AST nodes at runtime:

```typescript
interface FieldSpec {
  name: string;        // Field name (e.g., "relation", "typeName")
  type: string;        // Field type (e.g., "RangeVar", "string", "Node")
  isNode: boolean;     // true if the field is a Node or wrapped type
  isArray: boolean;    // true if the field is repeated
  optional: boolean;   // true if the field is optional (proto3 default)
}

interface NodeSpec {
  name: string;        // Node type name (e.g., "CreateStmt")
  wrapped: boolean;    // true if listed in Node.oneof
  fields: FieldSpec[]; // All fields for this type
}
```

### Example NodeSpec for CreateStmt

```json
{
  "name": "CreateStmt",
  "wrapped": true,
  "fields": [
    {
      "name": "relation",
      "type": "RangeVar",
      "isNode": true,
      "isArray": false,
      "optional": true
    },
    {
      "name": "tableElts",
      "type": "Node",
      "isNode": true,
      "isArray": true,
      "optional": true
    }
  ]
}
```

## Recommendations

### 1. Should SPECIAL_TYPES Stay?

**Recommendation: Eliminate SPECIAL_TYPES in favor of automated detection**

**Rationale:**
- The current `SPECIAL_TYPES` list is incomplete and inconsistent (missing RangeVar)
- The wrapped status can be automatically determined from the `Node.oneof` structure
- Manual maintenance of `SPECIAL_TYPES` is error-prone and doesn't scale
- The runtime schema system provides a more comprehensive and automated approach

### 2. Can SPECIAL_TYPES be Derived from the Schema?

**Recommendation: Yes, replace with automated wrapped type detection**

**Implementation:**
```typescript
// Instead of SPECIAL_TYPES constant
const isWrappedType = (typeName: string): boolean => {
  return runtimeSchemaGenerator.getWrappedTypes().includes(typeName);
};

// Or use the runtime schema directly
const getWrappedTypes = (): string[] => {
  return nodeSpecs.filter(spec => spec.wrapped).map(spec => spec.name);
};
```

### 3. Better Classification of Types

**Recommendation: Use a comprehensive type classification system**

```typescript
interface TypeClassification {
  wrapped: boolean;      // Listed in Node.oneof
  primitive: boolean;    // Basic types (string, int32, bool, etc.)
  literal: boolean;      // Value types (Integer, String, Boolean, etc.)
  container: boolean;    // Collection types (List, IntList, OidList)
  statement: boolean;    // SQL statement types (*Stmt)
  expression: boolean;   // Expression types (*Expr)
}
```

### 4. Should TypeName be a Wrapped Type?

**Recommendation: Yes, maintain TypeName as wrapped**

**Rationale:**
- TypeName is correctly listed in `Node.oneof` (line 83)
- It's used extensively throughout the AST for type references
- Wrapping provides consistent access patterns: `node.TypeName.names`
- Current implementation in SPECIAL_TYPES is correct but incomplete

### 5. Should RangeVar be a Wrapped Type?

**Recommendation: Yes, RangeVar should remain wrapped and be added to SPECIAL_TYPES**

**Rationale:**
- RangeVar is listed in `Node.oneof` (line 20)
- It represents table/relation references, a fundamental AST concept
- Consistent with other wrapped types for major AST components
- Used in many statement types (CreateStmt, InsertStmt, etc.)
- Should be treated the same as TypeName in SPECIAL_TYPES

### 6. Should Both TypeName and RangeVar be Wrapped Types?

**Recommendation: Yes, both should be wrapped types with consistent handling**

**Implementation:**
```typescript
// Updated SPECIAL_TYPES should include both
export const SPECIAL_TYPES = ['TypeName', 'RangeVar'];

// Generate both wrapped and unwrapped interfaces consistently
interface TypeName {
  names: Node[];
  typeOid: number;
  // ... other fields
}

interface RangeVar {
  catalogname: string;
  schemaname: string;
  relname: string;
  // ... other fields
}

// Wrapped versions for AST building
interface WrappedTypeName {
  TypeName: TypeName;
}

interface WrappedRangeVar {
  RangeVar: RangeVar;
}
```

**Access Patterns:**
- Use `TypeName['TypeName']` to access unwrapped type when needed
- Use `RangeVar['RangeVar']` to access unwrapped type when needed
- Maintain consistent patterns across all wrapped types

### 7. Migration Strategy

**Phase 1: Add Runtime Schema Generation**
- Implement `RuntimeSchemaGenerator` class
- Add configuration options for runtime schema output
- Generate NodeSpec arrays for all AST nodes

**Phase 2: Deprecate SPECIAL_TYPES**
- Replace `SPECIAL_TYPES` usage with runtime schema queries
- Add deprecation warnings for `SPECIAL_TYPES` constant
- Update AST helper generation to use wrapped type detection

**Phase 3: Remove SPECIAL_TYPES**
- Remove `SPECIAL_TYPES` constant entirely
- Update all references to use automated detection
- Clean up legacy code patterns

## CLI Tool for Runtime Schema Generation

A dedicated CLI tool has been created for generating runtime schemas:

```bash
# Generate runtime schema from protobuf file
node packages/parser/src/runtime-schema/cli.ts __fixtures__/proto/17-latest.proto ./output

# This will create ./output/runtime-schema.json with the complete NodeSpec array
```

## Usage Examples

### Programmatic Usage

```typescript
import { PgProtoParser } from '@launchql/pg-proto-parser';

const options = {
  outDir: './generated',
  runtimeSchema: {
    enabled: true,
    filename: 'ast-schema',
    format: 'typescript' // or 'json'
  }
};

const parser = new PgProtoParser('./proto/pg_query.proto', options);
parser.write();
```

### Runtime Schema Consumption

```typescript
import { runtimeSchema } from './generated/ast-schema';
import { NodeSpec } from '@launchql/pg-proto-parser/runtime-schema/types';

// Find all wrapped types
const wrappedTypes = runtimeSchema.filter(spec => spec.wrapped);

// Find all statement types
const statementTypes = runtimeSchema.filter(spec => 
  spec.name.endsWith('Stmt') && spec.wrapped
);

// Get field information for a specific type
const createStmtSpec = runtimeSchema.find(spec => spec.name === 'CreateStmt');
const nodeFields = createStmtSpec?.fields.filter(field => field.isNode) || [];
```

## Benefits of the New Approach

1. **Automation**: No manual maintenance of type lists
2. **Consistency**: All wrapped types handled uniformly
3. **Completeness**: Covers all 268 wrapped types automatically
4. **Maintainability**: Single source of truth (protobuf schema)
5. **Extensibility**: Easy to add new type classifications
6. **Tool Support**: Enables advanced deparsers, validators, and GUI tools
7. **Runtime Introspection**: AST structure queryable at runtime
8. **Developer Experience**: Rich tooling for AST manipulation

## Implementation Status

✅ **Completed:**
- NodeSpec and FieldSpec type definitions
- RuntimeSchemaGenerator class implementation
- Integration with ProtoStore and configuration system
- JSON and TypeScript output formats
- CLI tool for standalone generation
- Updated SPECIAL_TYPES to include both TypeName and RangeVar
- Comprehensive documentation and analysis

🔄 **Future Enhancements:**
- Deprecation warnings for direct SPECIAL_TYPES usage
- Migration guide for existing codebases
- Enhanced type classification (statements, expressions, literals)
- Integration with existing deparser and validator tools

## Conclusion

The current `SPECIAL_TYPES` approach is a legacy pattern that should be replaced with automated type detection based on the protobuf schema. The runtime schema system provides a comprehensive foundation for building advanced AST tooling while maintaining consistency and reducing maintenance overhead.

Both TypeName and RangeVar should be treated as wrapped types consistently, and the type system should be enhanced to support automated classification of all AST node types based on their protobuf definitions.

The runtime schema system enables powerful new capabilities for PostgreSQL AST manipulation, validation, and tooling while maintaining backward compatibility and providing a clear migration path.
