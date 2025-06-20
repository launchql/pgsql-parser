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

## Current Status (Latest - Full Test Suite Results - June 20, 2025)
- **Test Suites**: 9 failed, 343 passed, 352 total
- **Tests**: 9 failed, 343 passed, 352 total
- **Pass Rate**: 97.4% test suites (343/352), 97.4% individual tests
- **Last Updated**: June 20, 2025 23:42 UTC (confirmed 97.4% pass rate with complete kitchen sink test suite)

## Priority Failing Tests (Fix in this order)
**Previously prioritized tests - NOW FIXED:**
1. `original-policies-custom.test.ts` - AST mismatch after parse/deparse cycle ✅ **FIXED**
2. `original-triggers-create.test.ts` - AST mismatch after parse/deparse cycle ✅ **FIXED**
3. `original-upstream-create_type.test.ts` - AST mismatch after parse/deparse cycle ✅ **FIXED**
4. `original-comments-custom.test.ts` - Invalid deparsed SQL ✅ **FIXED**
5. `original-upstream-rules.test.ts` - AST mismatch after parse/deparse cycle ✅ **FIXED**
9. `latest-postgres-create_function_sql.test.ts` - AST mismatch after parse/deparse cycle ✅ **FIXED**

**Currently failing tests from original priority list:**
6. `original-statements-conflicts.test.ts` - AST mismatch after parse/deparse cycle
7. `original-upstream-plpgsql.test.ts` - AST mismatch after parse/deparse cycle
8. `latest-postgres-create_view.test.ts` - AST mismatch after parse/deparse cycle
10. `latest-postgres-create_am.test.ts` - Invalid deparsed SQL
11. `latest-postgres-create_type.test.ts` - AST mismatch after parse/deparse cycle

**Additional failing tests identified (27 total failures):**
- `original-upstream-with.test.ts` - Invalid deparsed SQL
- `original-upstream-event_trigger.test.ts` - Invalid deparsed SQL
- `original-upstream-truncate.test.ts` - Invalid deparsed SQL
- `latest-postgres-create_procedure.test.ts` - Invalid deparsed SQL
- `original-upstream-union.test.ts` - AST mismatch after parse/deparse cycle
- `original-upstream-select.test.ts` - Invalid deparsed SQL
- `original-upstream-groupingsets.test.ts` - Invalid deparsed SQL
- `latest-postgres-create_aggregate.test.ts` - Invalid deparsed SQL
- `original-upstream-plancache.test.ts` - Invalid deparsed SQL
- `original-upstream-select_views.test.ts` - AST mismatch after parse/deparse cycle
- `original-upstream-create_aggregate.test.ts` - Invalid deparsed SQL
- `original-upstream-random.test.ts` - Invalid deparsed SQL
- And others (see full test output for complete list)
