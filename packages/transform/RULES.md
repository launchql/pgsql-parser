# Transform Package Rules

## Critical Parser Usage

**⚠️ MUST ONLY USE @pgsql/parser for AST parsing in the transform project**

The `@pgsql/parser` is the ONLY multi-version parser that can handle different PostgreSQL versions correctly. Using any other parser (like `/packages/parser/dist/index.js`) will result in incorrect version handling and field naming issues.

## Correct Parser Usage

### Basic Import and Usage
```javascript
import { parse, PgParser } from '@pgsql/parser';

// Parse with specific version
const result15 = await parse('SELECT 1+1 as sum', 15);
console.log(result15);
// { version: 15, result: { version: 150007, stmts: [...] } }

// Using PgParser class
const parser = new PgParser(16);
const result16 = await parser.parse('SELECT * FROM users');
```

### Version-Specific Imports
```javascript
// Import specific version
import * as pg17 from '@pgsql/parser/v17';

await pg17.loadModule();
const result = await pg17.parse('SELECT 1');
console.log(result);
// { version: 170004, stmts: [...] }
```

### Error Handling
```javascript
const result = await parse('INVALID SQL');
if (result.error) {
  console.error(result.error);
  // { type: 'syntax', message: 'syntax error at or near "INVALID"', position: 0 }
}
```

## What NOT to Use

❌ **NEVER use these incorrect parser imports:**
```javascript
// WRONG - This is NOT multi-version
const parser = require('/home/ubuntu/pgsql-parser/packages/parser/dist/index.js');
const pg13Result = await parser.parse(sql, { version: 130000 });
const pg14Result = await parser.parse(sql, { version: 140000 });
```

## Field Naming Issues

When using the wrong parser:
- All versions return the same result version (170004)
- String nodes use "sval" fields instead of version-appropriate field names
- Version parameters are ignored
- Transformations fail because they're not testing actual version differences

When using the correct @pgsql/parser:
- Each version returns its proper version number
- Field names match the actual PostgreSQL version specifications
- String nodes use correct field names per version
- Transformations work because they test real version differences

## Debug Script Template

```javascript
import { parse, PgParser } from '@pgsql/parser';

async function debugTransformation() {
  const testSql = `SELECT 'test'`;
  
  // Parse with different versions
  const pg13Result = await parse(testSql, 13);
  const pg14Result = await parse(testSql, 14);
  
  console.log(`PG13 version: ${pg13Result.version}`);
  console.log(`PG14 version: ${pg14Result.version}`);
  
  // Now you'll see actual version differences
  const pg13Str = JSON.stringify(pg13Result, null, 2);
  const pg14Str = JSON.stringify(pg14Result, null, 2);
  
  // Check for field differences
  const pg13StrCount = (pg13Str.match(/"str":/g) || []).length;
  const pg13SvalCount = (pg13Str.match(/"sval":/g) || []).length;
  const pg14StrCount = (pg14Str.match(/"str":/g) || []).length;
  const pg14SvalCount = (pg14Str.match(/"sval":/g) || []).length;
  
  console.log(`PG13: "str" fields: ${pg13StrCount}, "sval" fields: ${pg13SvalCount}`);
  console.log(`PG14: "str" fields: ${pg14StrCount}, "sval" fields: ${pg14SvalCount}`);
}
```

## Transformer Testing

When testing transformers, always use the correct parser:

```javascript
import { parse } from '@pgsql/parser';
import { ASTTransformer } from '../dist/index.js';

async function testTransformer() {
  const transformer = new ASTTransformer();
  const sql = `ALTER TABLE test ADD CONSTRAINT name CHECK (col = 'value')`;
  
  // Parse with correct versions
  const pg13Result = await parse(sql, 13);
  const pg14Result = await parse(sql, 14);
  
  // Transform PG13 to PG14
  const astToTransform = JSON.parse(JSON.stringify(pg13Result.result));
  
  if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
    astToTransform.stmts = astToTransform.stmts.map((stmtWrapper) => {
      if (stmtWrapper.stmt) {
        const transformedStmt = transformer.transform(stmtWrapper.stmt, 13, 14);
        return { ...stmtWrapper, stmt: transformedStmt };
      }
      return stmtWrapper;
    });
  }
  
  astToTransform.version = pg14Result.result.version;
  
  // Compare transformed result with actual PG14 result
  const expectedStr = JSON.stringify(pg14Result.result, null, 2);
  const transformedStr = JSON.stringify(astToTransform, null, 2);
  
  if (expectedStr === transformedStr) {
    console.log('✅ Transformation successful');
  } else {
    console.log('❌ Transformation failed');
  }
}
```

## Key Lessons Learned

1. **Parser Selection is Critical**: Using the wrong parser wastes significant compute resources and produces incorrect results
2. **Version Parameters Must Work**: If all versions return the same result, you're using the wrong parser
3. **Field Names Matter**: Different PostgreSQL versions use different field names, and transformers must handle these correctly
4. **Test Framework Alignment**: Debug scripts must use the same parser as the actual test framework
5. **ACU Conservation**: Using the correct tools from the start prevents wasted debugging cycles

## Critical: Parser Methods Are Async

**⚠️ The @pgsql/parser's `parse()` method is async and returns a Promise.**

You MUST use `await` or `.then()` when calling parser methods:

```javascript
// ❌ WRONG - returns unresolved Promise, not AST
const { Parser } = require('@pgsql/parser');
const parser = new Parser(13);
const result = parser.parse(sql, { version: '13' }); // Missing await!

// ✅ CORRECT - returns actual AST structure  
const { Parser } = require('@pgsql/parser');
const parser = new Parser(13);
const result = await parser.parse(sql, { version: '13' }); // With await
```

**Impact on Transformers:** If parser calls are not properly awaited, the transformer will receive empty objects `{}` instead of AST structures, causing visitor pattern methods (like `FuncCall`) to never be invoked.

**Common Symptoms:**
- Transformer methods like `FuncCall` never get called
- Empty AST objects `{}` instead of proper structures
- Visitor pattern appears broken but works with mock data
- Tests fail because transformations aren't applied

## Summary

Always use `@pgsql/parser` for multi-version PostgreSQL AST parsing in the transform package. This is the only way to get accurate version-specific results and build working transformers. Remember that all parser methods are async and must be awaited.
