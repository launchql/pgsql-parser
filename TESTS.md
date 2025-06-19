# Test Progress Tracking

## Testing Process & Workflow
**Our systematic approach to fixing deparser issues:**

1. **One test at a time**: Focus on individual failing tests using `yarn test --testNamePattern="specific-test"`
2. **Always check for regressions**: After each fix, run full `yarn test` to ensure no previously passing tests broke
3. **Track progress**: Update this file with current pass/fail counts after each significant change
4. **Build before testing**: Always run `yarn build` after code changes before testing
5. **Clean commits**: Stage files explicitly with `git add <file>`, never use `git add .`
6. **Tight feedback loops**: Use isolated debug scripts for complex issues, but don't commit them

**Workflow**: Make changes → `yarn test --testNamePattern="target-test"` → `yarn test` (check regressions) → Update this file → Commit & push

## Current Status (Corrected - Full Test Suite Results - June 19, 2025)
- **Test Suites**: 29 failed, 323 passed, 352 total
- **Tests**: 29 failed, 323 passed, 352 total  
- **Pass Rate**: 91.8% test suites (323/352), 91.8% individual tests
- **Last Updated**: June 19, 2025 16:59 UTC (after DefElem connectionlimit fix - full yarn test without testNamePattern)

**Recent Changes**:
- ✅ **DefElem CreateRoleStmt connectionlimit Fix**: Added missing "connectionlimit" case to DefElem method - now generates "CONNECTION LIMIT 5" instead of "connectionlimit = '5'" for CREATE ROLE statements - maintains 91.8% pass rate (29 failed, 323 passed)
- ✅ **Full Test Suite Verification**: Confirmed accurate test status using full yarn test suite (29 failed, 323 passed) - no testNamePattern filtering as Dan corrected
- ✅ **Context System Robustness Verified**: Comprehensive analysis confirmed that parentNodeTypes is already a required array (`parentNodeTypes: string[]`) with robust `includes()` checks throughout the deparser - no brittle array indexing patterns exist - context system meets all requirements for nested node handling
- ✅ **Reverted Duck Typing**: Removed hacky property-based node type detection from getNodeType() method - restored to original `Object.keys(node)[0]` approach per Dan's feedback
- ✅ **AlterObjectSchemaStmt Matview Fix**: Fixed AlterObjectSchemaStmt to include OBJECT_MATVIEW in relation handling condition - resolves missing table name in `ALTER MATERIALIZED VIEW mvtest_tvm SET SCHEMA mvtest_mvschema` statements - improved pass rate from 92.0% to 92.6% (12 failed, 151 passed)
- ✅ **Context Array Migration**: Successfully migrated DeparserContext to use required `parentNodeTypes: string[]` instead of optional `parentNodeType?: string` - enables robust nested context tracking with `.includes()` checks without optional chaining - maintains 92.0% pass rate with no regressions
- ✅ **DeclareCursorStmt SCROLL Option Fix**: Fixed cursor option bit flag mapping from 256 back to 1 for SCROLL detection - resolves unwanted "SCROLL" keyword being added to basic cursor declarations - now correctly outputs `DECLARE foo CURSOR FOR SELECT 1 INTO b` instead of `DECLARE foo SCROLL CURSOR FOR SELECT 1 INTO b`
- ✅ **original-upstream-select_into Test**: Now fully passing - resolved DeclareCursorStmt SCROLL option regression
- ✅ **CREATE TABLE WITH Options Context Fix**: Fixed CreateStmt method to pass parentNodeType: 'CreateStmt' context when processing table options - resolves DefElem method receiving empty context and falling through to default quoted format - now correctly outputs `WITH (fillfactor=10)` instead of `WITH (fillfactor = '10')`
- ✅ **original-upstream-brin Test**: Now fully passing - resolved CREATE TABLE WITH options DefElem context handling issues
- ✅ **FetchStmt Direction and ALL Logic**: Fixed FetchStmt to handle direction first, then check for ALL within each direction - supports `FETCH BACKWARD ALL` and other direction/count combinations
- ✅ **original-upstream-rangefuncs Test**: Now fully passing - resolved FETCH statement direction handling issues
- ✅ **TRIM Function Optional Trim Character**: Enhanced TRIM function handling to include optional trim character parameter - supports `TRIM(BOTH 'char' FROM string)` syntax
- ✅ **original-upstream-strings Test**: Now fully passing - resolved TRIM function trim character omission issues
- ✅ **OVERLAPS Operator Infix Syntax**: Added special handling for pg_catalog.overlaps function calls to preserve infix syntax `(left1, left2) OVERLAPS (right1, right2)` instead of converting to function call format
- ✅ **original-upstream-horology Test**: Now fully passing - resolved OVERLAPS operator syntax preservation issues
- ✅ **TransactionStmt Boolean Value Parsing**: Fixed complex boolean value parsing for SET TRANSACTION and START TRANSACTION statements - handles nested ival structures in A_Const nodes for transaction_read_only and transaction_deferrable options
- ✅ **original-upstream-transactions Test**: Now fully passing - resolved READ WRITE vs READ ONLY and DEFERRABLE vs NOT DEFERRABLE parsing issues
- ✅ **VariableSetStmt SESSION CHARACTERISTICS**: Added support for `SET SESSION CHARACTERISTICS AS TRANSACTION` statements alongside regular `SET TRANSACTION` statements
- ✅ **Nested A_Const Structure Handling**: Comprehensive fix for accessing nested `{ ival: { ival: 1 } }` and `{ sval: { sval: "value" } }` structures in both TransactionStmt and VariableSetStmt methods
- ✅ **Timestamp Type Aliases Fix**: Added `timestamptz` → `timestamp with time zone` and `timetz` → `time with time zone` mappings in TypeName method - resolves CREATE TABLE column type formatting
- ✅ **CREATE TABLE WITH Options Support**: Added table options handling in CreateStmt method for WITH clauses like `WITH (fillfactor=10)` - includes DefElem compact formatting for CreateStmt context
- ✅ **CREATE FOREIGN DATA WRAPPER DefElem Fix**: Added proper quoting for FDW option names containing spaces or special characters - resolves `CREATE FOREIGN DATA WRAPPER foo OPTIONS ("test wrapper" 'true')` vs `CREATE FOREIGN DATA WRAPPER foo OPTIONS (test wrapper 'true')` mismatch
- ✅ **original-upstream-foreign_data Test**: Now passing - resolved option name quoting issue in DefElem method
- ✅ **GrantStmt DATABASE Object Type Fix**: Added `OBJECT_DATABASE` support to GrantStmt method - resolves missing "DATABASE" keyword in grant statements like `GRANT create ON DATABASE regression TO regression_user1`
- ✅ **original-upstream-dependency Test**: Now passing - resolved DATABASE keyword issue in GrantStmt
- ✅ **CREATE ROLE DefElem Options Fix**: Added support for `password`, `validUntil`, and `adminmembers` role options using keyword format instead of key=value format
- ✅ **original-roles-create Test**: Now passing - resolved CREATE ROLE statement formatting issues
- ✅ **IndexStmt NULLS NOT DISTINCT Fix**: Added support for `nulls_not_distinct` clause in CREATE INDEX statements
- ✅ **COLLATION FOR SQL Syntax Fix**: Resolved `pg_catalog.pg_collation_for` function format preservation - now uses `COLLATION FOR (args)` syntax instead of function call format for `COERCE_SQL_SYNTAX` cases
- ✅ **original-upstream-collate Test**: Now passing - fixed AST mismatch where `funcformat` was changing from `COERCE_SQL_SYNTAX` to `COERCE_EXPLICIT_CALL`
- ✅ **LockStmt Lock Mode Mapping Fix**: Corrected PostgreSQL lock mode array to use 1-based indexing (modes 1-8) instead of 0-based (0-7)
- ✅ **original-upstream-privileges Test**: Now passing - resolved "ACCESS SHARE MODE" vs "ROW SHARE MODE" mapping issue
- ✅ **LOCK TABLE Keyword**: Added missing "TABLE" keyword to LockStmt output for proper PostgreSQL syntax
- ✅ **JOIN Expression Parentheses Fix**: Resolved double parentheses issue in nested JOIN expressions with aliases
- ✅ **RenameStmt OBJECT_SCHEMA Fix**: Added schema name extraction from `node.subname` for ALTER SCHEMA RENAME statements
- ✅ **CollateClause Quoting Fix**: Expanded needsQuotes logic from single character `/^[A-Z]$/` to multi-character `/^[A-Z]+$/`
- ✅ **Dan's Updates**: Removed all ast-driven tests (32 files, 7977 lines) - now focusing exclusively on kitchen-sink tests
- ✅ **Comprehensive Quoting**: Dan's needsQuotes regex and RESERVED_WORDS set implemented in deparser

**Current Focus**: Kitchen-sink tests only (ast-driven tests removed per Dan's request)
**Progress**: 91.8% pass rate with 29 failing test suites - significant progress but more work needed
**Next Priority**: Systematic fixes for 29 failing tests including AST mismatch and invalid SQL issues across various PostgreSQL constructs
**Status**: Good progress - improved from ~50% to 91.8% pass rate, targeting higher completion rate through systematic deparser fixes

## Current High-Impact Issues to Fix
Based on latest `yarn test` output, key patterns causing multiple test failures:

### CREATE FOREIGN DATA WRAPPER - Options Format ⭐ HIGH PRIORITY
- **Expected**: `CREATE FOREIGN DATA WRAPPER custom_fdw OPTIONS (HOST localhost, PORT 5432)`
- **Actual**: `CREATE FOREIGN DATA WRAPPER custom_fdw OPTIONS (host 'localhost', port '5432')`
- **Issue**: DefElem context handling for FDW options should use uppercase names and no quotes for certain contexts
- **Test**: `__tests__/ast-driven/extension-stmt.test.ts`
- **Pattern**: Multiple failures show DefElem nodes need context-aware formatting

### CREATE USER MAPPING - Server Name Quoting ⭐ HIGH PRIORITY
- **Expected**: `CREATE USER MAPPING FOR local_user SERVER "foreign_server" OPTIONS (user = 'remote_user', password = 'secret123')`
- **Actual**: `CREATE USER MAPPING FOR local_user SERVER foreign_server OPTIONS (user 'remote_user', password 'secret123')`
- **Issue**: Server names should be quoted when necessary in CreateUserMappingStmt, and DefElem options need proper key=value formatting
- **Test**: `__tests__/ast-driven/advanced-policy-stmt.test.ts`

### LOCK STATEMENT - Mode Mapping Issues ⭐ HIGH PRIORITY  
- **Expected**: `LOCK users IN SHARE MODE`
- **Actual**: `LOCK TABLE users IN SHARE UPDATE EXCLUSIVE MODE`
- **Issue**: LockStmt method has incorrect lock mode number to string mapping
- **Test**: `__tests__/ast-driven/maintenance-stmt.test.ts`

### ✅ FIXED: GrantRoleStmt - WITH ADMIN OPTION
- **Status**: ✅ Fixed GrantRoleStmt method to handle both String and DefElem admin option structures
- **Impact**: Resolved "WITH ADMIN OPTION" vs "WITH ADMIN FALSE" test failures

### ✅ FIXED: DropStmt - RESTRICT/CASCADE
- **Status**: ✅ Fixed DropStmt method to handle RESTRICT/CASCADE behavior
- **Impact**: Resolved multiple DROP statement test failures

### ✅ FIXED: CREATE INDEX - USING btree
- **Status**: ✅ Fixed IndexStmt method to omit default "USING btree" access method
- **Impact**: Resolved multiple CREATE INDEX test failures

## Next Steps
1. Fix DefElem method to handle context-aware formatting for FDW options (uppercase names, no quotes)
2. Fix CreateUserMappingStmt to properly quote server names when necessary
3. Continue systematically through remaining 63 failed test suites
4. Focus on commonly used SQL constructs that appear across multiple test failures
5. Prioritize fixes that will resolve multiple test failures simultaneously

## Workflow
- Make changes → `yarn test --testNamePattern="specific-test"` → `yarn test` (check regressions) → update this file
