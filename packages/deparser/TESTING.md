## Custom testing strategy

Parse the any deparsed or pretty-formatted SQL back and verify the AST matches the original. This ensures the formatting doesn't break the SQL semantics.

Please review the test utilities — note that exact SQL string equality is not required. The focus is on comparing the resulting ASTs.

Refer to `expectAstMatch` to understand how correctness is validated.

The pipeline is:
parse(sql1) → ast → deparse(ast) → sql2
While sql2 !== sql1 (textually), a correct round-trip means:
parse(sql1) === parse(sql2) (AST-level equality).

You can see `expectAstMatch` here: packages/deparser/test-utils/index.ts

## Testing Process & Workflow

**Our systematic approach to fixing deparser issues:**

1. **One test at a time**: Focus on individual failing tests using `pnpm test --testNamePattern="specific-test"`
2. **Always check for regressions**: After each fix, run full `pnpm test` to ensure no previously passing tests broke
3. **Track progress**: Update this file with current pass/fail counts after each significant change
4. **Build before testing**: Always run `pnpm build` after code changes before testing
5. **Clean commits**: Stage files explicitly with `git add <file>`, never use `git add .`
6. **Tight feedback loops**: Use isolated debug scripts for complex issues, but don't commit them

**Workflow**: Make changes → `pnpm test --testNamePattern="target-test"` → `pnpm test` (check regressions) → Update this file → Commit & push

**When committing to TESTS.md, always run all tests — do not use testNamePattern, only `pnpm test`**