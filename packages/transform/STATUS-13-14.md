# PostgreSQL 13-to-14 AST Transformer Status

## Current Test Results
- **Tests Passing**: 237/258 (91.9%)
- **Tests Failing**: 21/258 (8.1%)
- **Last Updated**: June 28, 2025

## Test Status Summary
The 13-14 transformer is in good shape with 237 out of 258 tests passing. The remaining 21 failures are primarily edge cases and specialized PostgreSQL features.

## Failure Categories

### 1. objfuncargs Creation Issues (8 failures)
- `original-upstream-object_address.test.ts` - CreateTransformStmt objfuncargs creation
- `latest-postgres-create_cast.test.ts` - CreateCastStmt objfuncargs creation  
- `original-upstream-create_cast.test.ts` - CreateCastStmt objfuncargs creation
- `original-upstream-alter_table.test.ts` - AlterTableStmt objfuncargs creation
- Related to context-aware objfuncargs generation logic

### 2. Parameter Name Issues (3 failures)
- `original-drops.test.ts` - Unwanted parameter name "a" in DropStmt context
- `original-upstream-polymorphism.test.ts` - Variadic parameter mode handling
- Parameter names being added in contexts where they shouldn't exist

### 3. Function Format Issues (3 failures)
- `original-upstream-indirect_toast.test.ts` - funcformat should be COERCE_SQL_SYNTAX not COERCE_EXPLICIT_CALL
- `latest-postgres-create_procedure.test.ts` - funcformat should be COERCE_SQL_SYNTAX not COERCE_EXPLICIT_CALL
- `pg_catalog` prefix issues with substring function

### 4. Node Wrapping Issues (2 failures)
- `latest-postgres-create_table_like.test.ts` - Extra StatsElem wrapper
- `original-upstream-portals.test.ts` - DeclareCursorStmt options value mismatch (274 vs 290)

### 5. Syntax Errors (7 failures)
These are PostgreSQL version compatibility issues where PG13 parser cannot handle newer syntax:
- `latest-postgres-create_role.test.ts` - "OPTION" syntax
- `latest-postgres-create_index.test.ts` - "NULLS" syntax  
- `latest-postgres-create_schema.test.ts` - "CURRENT_ROLE" syntax
- `latest-postgres-create_am.test.ts` - "ACCESS" syntax
- `misc-issues.test.ts` - "NULLS" syntax

## Key Accomplishments
- ✅ Context-aware function parameter handling
- ✅ Variadic parameter detection and mode preservation
- ✅ Enum mapping and transformation
- ✅ objfuncargs creation for most contexts
- ✅ Function format detection for most cases
- ✅ Parameter name handling for most contexts

## Known Issues to Address
1. **objfuncargs Logic**: Need more precise context detection for when to create objfuncargs
2. **Parameter Names**: Improve logic to avoid adding names in DropStmt and similar contexts  
3. **Function Formats**: Better detection of when to use COERCE_SQL_SYNTAX vs COERCE_EXPLICIT_CALL
4. **Variadic Parameters**: Edge cases in polymorphic function handling

## Stability Note
⚠️ **DO NOT EDIT 13-14 CODE FURTHER** - To prevent regressions, the 13-14 transformer should be considered stable at 235/258 passing tests. Focus efforts on 14-15 transformer instead.

## Architecture Strengths
- Robust context propagation system
- Comprehensive enum handling utilities
- Systematic approach to node transformation
- Good separation of concerns between transformation logic
