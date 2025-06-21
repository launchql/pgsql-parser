# Windows Compatibility Improvements

## Overview

Made the codebase Windows-compatible by fixing path handling issues that would cause problems on Windows systems due to hardcoded forward slashes and string concatenation for paths.

## Changes Made

### 1. Fixed Default Output Directory Path
**File:** `/workspace/packages/proto-parser/src/options/defaults.ts`

**Before:**
```typescript
outDir: `${process.cwd()}/out`,
```

**After:**
```typescript
import { join } from 'path';
// ...
outDir: join(process.cwd(), 'out'),
```

### 2. Fixed Glob Pattern in Test Utils
**File:** `/workspace/packages/proto-parser/test-utils/index.ts`

**Before:**
```typescript
glob(outDir + '**/*')
```

**After:**
```typescript
glob(join(outDir, '**/*'))
```

### 3. Fixed Glob Patterns in Deparser Scripts
**Files:**
- `/workspace/packages/deparser/scripts/make-fixtures-sql.ts`
- `/workspace/packages/deparser/scripts/make-fixtures-ast.ts`
- `/workspace/packages/deparser/scripts/make-fixtures.ts`
- `/workspace/packages/deparser/scripts/make-kitchen-sink.ts`

**Before:**
```typescript
const fixtures = globSync(`${FIXTURE_DIR}/**/*.sql`);
```

**After:**
```typescript
const fixtures = globSync(path.join(FIXTURE_DIR, '**/*.sql'));
```

## Why These Changes Matter

1. **Cross-Platform Compatibility**: Using `path.join()` ensures that the correct path separator is used for each operating system (forward slash on Unix-like systems, backslash on Windows).

2. **Glob Pattern Compatibility**: While glob patterns typically use forward slashes even on Windows, using `path.join()` ensures consistency and prevents potential issues with path resolution.

3. **Future-Proof**: These changes make the codebase more maintainable and prevent future Windows-related issues.

## Verification

All existing path operations in the codebase were already using proper Node.js path module functions:
- `mkdirSync` with `{ recursive: true }` for directory creation
- `path.join()`, `path.resolve()`, `path.dirname()`, `path.basename()` for path manipulation
- `readFileSync` and `writeFileSync` for file operations

## No Breaking Changes

These changes are purely internal and do not affect the public API or behavior of the packages. All functionality remains the same across all platforms.