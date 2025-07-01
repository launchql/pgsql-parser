# Transform Test Strategy

## Test Execution Order

Work on transformations in sequential order:

1. **13→14** - Field renames (`relkind` → `objtype`)
2. **14→15** - Major A_Const structure changes
3. **15→16** - Minimal changes, Var node updates
4. **16→17** - Pass-through transformer

we have all the tests for each transformation type, in it's own folder, which can be useful for scoping the tests:

└── kitchen-sink
    ├── 13-14
    ├── 14-15
    ├── 15-16
    └── 16-17

## Workflow

### Single Transformer Scope
```bash
yarn test __tests__/kitchen-sink/13-14
```

### Single Test Focus
```bash
yarn test __tests__/kitchen-sink/13-14 --testNamePattern="specific-test"
```

### Regression Check
```bash
yarn test  # Run after each fix
```

### Build Before Test
```bash
yarn build && yarn test
```

## Process

1. **Focus**: One failing test at a time
2. **Fix**: Make targeted changes
3. **Verify**: Check no regressions with full test suite
4. **Commit**: Stage files explicitly (`git add <file>`)
5. **Document**: Update progress in `TESTS.md`

**Rule**: No regressions allowed - all previously passing tests must continue to pass.
