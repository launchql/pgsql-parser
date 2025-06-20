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
- **Test Suites**: 11 failed, 341 passed, 352 total
- **Tests**: 11 failed, 341 passed, 352 total
- **Pass Rate**: 96.9% test suites (341/352), 96.9% individual tests
- **Last Updated**: June 20, 2025 21:52 UTC (confirmed 96.9% pass rate with complete kitchen sink test suite)

## Priority Failing Tests (Fix in this order)
1. `original-policies-custom.test.ts` - AST mismatch after parse/deparse cycle
2. `original-triggers-create.test.ts` - AST mismatch after parse/deparse cycle
3. `original-upstream-create_type.test.ts` - AST mismatch after parse/deparse cycle
4. `original-comments-custom.test.ts` - Invalid deparsed SQL
5. `original-upstream-rules.test.ts` - AST mismatch after parse/deparse cycle
6. `original-statements-conflicts.test.ts` - AST mismatch after parse/deparse cycle
7. `original-upstream-plpgsql.test.ts` - AST mismatch after parse/deparse cycle
8. `latest-postgres-create_view.test.ts` - AST mismatch after parse/deparse cycle
9. `latest-postgres-create_function_sql.test.ts` - AST mismatch after parse/deparse cycle
10. `latest-postgres-create_am.test.ts` - Invalid deparsed SQL
11. `latest-postgres-create_type.test.ts` - AST mismatch after parse/deparse cycle
