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

## Current Status (After EXCLUDE Constraint Fix)
- **Test Suites**: 93 failed, 282 passed, 375 total
- **Tests**: 110 failed, 540 passed, 650 total
- **Pass Rate**: 75.2% test suites, 83.1% individual tests

**Progress**: ✅ Improved from 95→93 failed test suites after adding CONSTR_EXCLUSION support
**Recent Fix**: Added EXCLUDE USING constraint handling to resolve rangetypes test failures

## Known Regressions Introduced
Based on `yarn test` output, recent changes broke several previously passing tests:

### Foreign Data Wrapper Issues
- `ALTER FOREIGN DATA WRAPPER foo OPTIONS (ADD x '1', DROP x)` 
- Deparsed as: `ALTER FOREIGN DATA WRAPPER foo OPTIONS (x '1', X)`
- **Issue**: Missing ADD/DROP keywords in DefElem handling

### CREATE TABLE EXCLUDE Constraints
- `CREATE TABLE test_range_excl (..., EXCLUDE USING gist (...))`
- Deparsed as: `CREATE TABLE test_range_excl (..., , )`
- **Issue**: EXCLUDE constraints being rendered as empty clauses

### Failed Test Suites (Partial List)
- original-upstream-foreign_data.test.ts
- original-upstream-rangetypes.test.ts  
- original-comments-custom.test.ts
- original-policies-custom.test.ts
- original-grants-custom.test.ts
- original-triggers-create.test.ts
- original-triggers-custom.test.ts
- original-parens.test.ts
- original-rules-create.test.ts
- original-tables-custom.test.ts
- original-enums-alter.test.ts
- original-roles-create.test.ts
- original-statements-conflicts.test.ts
- original-sequences-sequences.test.ts
- original-statements-alias.test.ts
- original-pg_catalog.test.ts
- original-statements-select.test.ts
- original-extensions-custom.test.ts
- original-tables-exclude.test.ts
- original-statements-cte.test.ts

## Next Steps
1. Identify and revert problematic changes causing regressions
2. Fix specific issues one by one with targeted testing
3. Update this file with progress after each fix
4. Only proceed to new test failures after regressions are resolved

## Workflow
- Make changes → `yarn test --testNamePattern="specific-test"` → `yarn test` (check regressions) → update this file
