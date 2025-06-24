# AST Transformation Plan

This document outlines the comprehensive strategy for implementing PostgreSQL AST transformations between versions 13-17. Based on the research findings in `AST_RESEARCH.md` and the translation strategies in `AST_TRANSLATION.md`, this plan provides a roadmap for creating sequential transformation functions.

## Overview

The goal is to create a series of AST transformers that can upgrade PostgreSQL ASTs from older versions to newer ones, supporting the forward-only transformation path: 13 → 14 → 15 → 16 → 17.

## Transformation Strategy

### Sequential Upgrades Approach

We will implement **sequential upgrades** rather than direct transformations. This approach:
- Keeps transformation functions small and focused
- Allows reuse of existing transforms when supporting new versions
- Makes it easier to handle the incremental changes in each release
- Simplifies debugging and testing

### Functional Node-Level Transforms

Each transformation will be implemented as pure functions that:
1. Accept an instance of a node from the older version
2. Produce the equivalent structure in the newer version
3. Rename fields or populate new defaults as required
4. Handle enum format changes appropriately

## Version-Specific Transformation Requirements

### 13 → 14 Transformation

**Key Changes:**
- **Enum format**: Both versions use integer enum values
- **New enum types**: `SetQuantifier`
- **Field renames**: `relkind` → `objtype` in `AlterTableStmt`/`CreateTableAsStmt`
- **New interfaces**: `CTECycleClause`, `CTESearchClause`, `PLAssignStmt`, `ReturnStmt`, `StatsElem`
- **Enum value shifts**: 
  - `A_Expr_Kind`: Removed `AEXPR_OF` and `AEXPR_PAREN`
  - `RoleSpecType`: Added `ROLESPEC_CURRENT_ROLE` at position 1
  - `TableLikeOption`: Added `CREATE_TABLE_LIKE_COMPRESSION` at position 1

**Implementation Priority**: Medium complexity - relatively small changes

### 14 → 15 Transformation

**Key Changes:**
- **Critical**: Enum format changes from integers to strings
- **Scalar node refactoring**:
  - `String.str` → `String.sval`
  - `BitString.str` → `BitString.bsval`
  - `Float.str` → `Float.fval`
  - New `Boolean` node with `boolval` field
- **New enum types**: `AlterPublicationAction`, `PublicationObjSpecType`
- **Field renames**: 
  - `tables` → `pubobjects` in `CreatePublicationStmt`/`AlterPublicationStmt`
  - `tableAction` → `action` in `AlterPublicationStmt`
- **New interfaces**: `AlterDatabaseRefreshCollStmt`, `Boolean`, `MergeAction`, `MergeStmt`, `MergeWhenClause`, `PublicationObjSpec`, `PublicationTable`
- **Enum value shifts**: `WCOKind`, `ObjectType`

**Implementation Priority**: High complexity - major enum format change

### 15 → 16 Transformation

**Key Changes:**
- **Major version jump**: 2634 diff lines - largest change set
- **Enum format**: Continues using string enum values
- **New enum types**: `JsonConstructorType`, `JsonEncoding`, `JsonFormatType`, `JsonValueType`, `PartitionStrategy`
- **Field renames**:
  - `varnosyn` & `varattnosyn` → `varnullingrels` in `Var`
  - `aggtranstype` → `aggtransno` in `Aggref`
- **New interfaces**: Extensive JSON-related constructs (`JsonAggConstructor`, `JsonArrayAgg`, `JsonArrayConstructor`, `JsonArrayQueryConstructor`, `JsonConstructorExpr`, `JsonFormat`, `JsonIsPredicate`, `JsonKeyValue`, `JsonObjectAgg`, `JsonObjectConstructor`, `JsonOutput`, `JsonReturning`, `JsonValueExpr`, `RTEPermissionInfo`)
- **Enum value shifts**: `JoinType` (added `JOIN_RIGHT_ANTI`), `AlterTableType`

**Implementation Priority**: Highest complexity - SQL/JSON enhancements

### 16 → 17 Transformation

**Key Changes:**
- **Enum format**: Continues using string enum values
- **New enum types**: `JsonBehaviorType`, `JsonExprOp`, `JsonQuotes`, `JsonTableColumnType`, `JsonWrapper`, `MergeMatchKind`, `TableFuncType`
- **New interfaces**: Additional JSON and table function constructs (`JsonArgument`, `JsonBehavior`, `JsonExpr`, `JsonFuncExpr`, `JsonParseExpr`, `JsonScalarExpr`, `JsonSerializeExpr`, `JsonTable`, `JsonTableColumn`, `JsonTablePath`, `JsonTablePathScan`, `JsonTablePathSpec`, `JsonTableSiblingJoin`, `MergeSupportFunc`, `SinglePartitionSpec`, `WindowFuncRunCondition`)
- **Enum value shifts**: `AlterTableType` (introduces `AT_SetExpression`)

**Implementation Priority**: Medium-high complexity - builds on PG16 JSON features

## Implementation Architecture

### Core Transform Functions

```typescript
// Sequential transformation pipeline
export function transform13To14(node: PG13Node): PG14Node
export function transform14To15(node: PG14Node): PG15Node  
export function transform15To16(node: PG15Node): PG16Node
export function transform16To17(node: PG16Node): PG17Node

// Convenience function for full upgrade path
export function transformToLatest(node: PG13Node | PG14Node | PG15Node | PG16Node, fromVersion: number): PG17Node
```

### Utility Functions

```typescript
// Enum handling utilities
function convertIntegerEnumsToStrings(node: any): any  // For 14→15 transition
function mapEnumValues(oldValue: string | number, enumType: string, fromVersion: number, toVersion: number): string

// Field transformation utilities  
function renameFields(node: any, fieldMappings: Record<string, string>): any
function addDefaultFields(node: any, defaults: Record<string, any>): any
function removeObsoleteFields(node: any, fieldsToRemove: string[]): any

// Node creation utilities
function createNewNodeTypes(oldNode: any, nodeType: string, version: number): any
```

### Error Handling

- Comprehensive error messages for unsupported node types
- Validation of required fields after transformation
- Graceful handling of missing optional fields
- Clear error reporting for enum mapping failures

## Testing Strategy

### Fixture-Based Testing

The testing approach uses the `__fixtures__/transform/` directory structure:

```
__fixtures__/transform/
├── 13/
│   ├── select_integer.json
│   ├── select_null.json
│   ├── select_string.json
│   ├── select_boolean.json
│   └── select_expression.json
├── 14/ (same files)
├── 15/ (same files)  
├── 16/ (same files)
└── 17/ (same files)
```

### Test Queries

Each version directory contains AST JSON files generated from these SQL queries:
1. `SELECT 1` - Basic integer literal
2. `SELECT NULL` - Null value handling
3. `SELECT 'hello'` - String literal (tests scalar node changes)
4. `SELECT true` - Boolean literal (tests Boolean node introduction)
5. `SELECT 1 + 1` - Expression handling

### Test Categories

1. **Baseline Parsing**: Verify each version can parse basic queries
2. **Enum Handling**: Test integer→string conversion and enum preservation
3. **Scalar Node Changes**: Validate field renames in String/BitString/Float/Boolean nodes
4. **Field Renames**: Test renamed fields like `relkind`→`objtype`
5. **Sequential Upgrades**: Verify each transformation step works correctly
6. **Full Query Upgrade**: End-to-end transformation testing

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Set up testing infrastructure with fixture files
- Implement utility functions for enum and field transformations
- Create basic node transformation framework

### Phase 2: Simple Transformations (Week 2)
- Implement 13→14 transformation (lowest complexity)
- Implement 14→15 transformation (enum format change)
- Comprehensive testing of scalar node changes

### Phase 3: Complex Transformations (Week 3-4)
- Implement 15→16 transformation (highest complexity)
- Handle JSON-related node types and field mappings
- Extensive testing of new node type creation

### Phase 4: Final Integration (Week 5)
- Implement 16→17 transformation
- Create convenience functions for full upgrade paths
- Performance optimization and comprehensive testing

### Phase 5: Documentation & Polish (Week 6)
- Complete API documentation
- Performance benchmarking
- Integration with existing codebase

## Success Criteria

1. **Functional Completeness**: All transformation functions handle their respective version boundaries correctly
2. **Test Coverage**: 100% test coverage for all transformation functions
3. **Performance**: Transformations complete in reasonable time for typical AST sizes
4. **Accuracy**: Round-trip testing shows semantic equivalence is preserved
5. **Maintainability**: Code is well-structured and easy to extend for future PostgreSQL versions

## Future Considerations

### Adding New PostgreSQL Versions

When PostgreSQL 18+ is released:
1. Generate new type definitions using `pg-proto-parser`
2. Analyze differences using the same methodology as `AST_RESEARCH.md`
3. Implement new transformation function (17→18)
4. Update convenience functions to include new version
5. Add comprehensive test fixtures

### Performance Optimization

- Consider memoization for frequently transformed node types
- Implement streaming transformations for very large ASTs
- Profile and optimize hot paths in transformation functions

### Backward Compatibility

While not implementing backward transformations, maintain compatibility with:
- Existing parser interfaces
- Current deparser functionality  
- Type definitions and enum mappings

This plan provides a comprehensive roadmap for implementing robust, maintainable AST transformations that will serve as the foundation for PostgreSQL version migration tools.
