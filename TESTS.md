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

## Current Status (After Latest Fixes - June 19, 2025)
- **Test Suites**: 55 failed, 297 passed, 352 total
- **Tests**: 55 failed, 297 passed, 352 total  
- **Pass Rate**: 84.4% test suites, 84.4% individual tests
- **Last Updated**: June 19, 2025 04:28 UTC

**Recent Changes**:
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
**Progress**: 84.4% pass rate with 55 failing test suites - maintaining excellent progress with systematic fixes
**Next Priority**: High-impact failing tests like CREATE PROCEDURE, CREATE ROLE, trigger handling, and other SQL construct patterns
**Status**: Excellent progress - continuing systematic improvements to reach higher pass rates

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
