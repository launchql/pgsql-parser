# PostgreSQL 13->14 AST Transformer Notes

## Current Status
- **Pass Rate**: 124/258 tests (48%)
- **Baseline**: Stable at 124/258 despite comprehensive transformations
- **Branch**: devin/1750826349-v13-to-v14-transformer

## Primary Challenge: funcformat Field Transformation

### Problem Description
The main blocker for improving beyond 124/258 is the `funcformat` field in `FuncCall` nodes. The current transformer adds `funcformat: "COERCE_EXPLICIT_CALL"` to all FuncCall nodes, but PG14's actual behavior is more nuanced:

### Observed Patterns from Failing Tests

#### 1. SQL Syntax Functions (should use COERCE_SQL_SYNTAX)
- **TRIM functions**: `TRIM(BOTH FROM '  text  ')` → `funcformat: "COERCE_SQL_SYNTAX"`
- **String functions**: `SUBSTRING`, `POSITION`, `OVERLAY`
- **Date/time functions**: `EXTRACT`, `CURRENT_DATE`, `CURRENT_TIMESTAMP`

**Example failure** (strings-41.sql):
```
Expected: "funcformat": "COERCE_SQL_SYNTAX"
Received: "funcformat": "COERCE_EXPLICIT_CALL"
```

#### 2. Aggregate Functions in TypeCast (should have NO funcformat)
- **Aggregate + TypeCast**: `CAST(AVG(column) AS NUMERIC(10,3))` → no funcformat field
- **Mathematical functions in casts**: Similar pattern

**Example failure** (aggregates-3.sql):
```
Expected: (no funcformat field)
Received: "funcformat": "COERCE_EXPLICIT_CALL"
```

#### 3. Context-Specific Exclusions (already implemented)
Current exclusions working correctly:
- CHECK constraints
- COMMENT statements  
- TypeCast contexts
- XmlExpr contexts
- INSERT statements
- RangeFunction contexts

### Technical Implementation Challenges

#### Current Approach
```typescript
// Current: One-size-fits-all
if (!this.shouldExcludeFuncformat(node, context)) {
  result.funcformat = "COERCE_EXPLICIT_CALL";
}
```

#### Needed Approach
```typescript
// Needed: Function-specific logic
if (!this.shouldExcludeFuncformat(node, context)) {
  result.funcformat = this.getFuncformatValue(node, context);
}

private getFuncformatValue(node: any, context: TransformerContext): string {
  const funcname = this.getFunctionName(node);
  
  // SQL syntax functions
  if (sqlSyntaxFunctions.includes(funcname.toLowerCase())) {
    return 'COERCE_SQL_SYNTAX';
  }
  
  // Default to explicit call
  return 'COERCE_EXPLICIT_CALL';
}
```

### Analysis of Remaining 134 Failing Tests

#### Test Categories with funcformat Issues:
1. **String manipulation**: TRIM, SUBSTRING, etc. (need COERCE_SQL_SYNTAX)
2. **Aggregates in TypeCast**: AVG, SUM, etc. in CAST expressions (need exclusion)
3. **Date/time functions**: EXTRACT, date arithmetic (need COERCE_SQL_SYNTAX)
4. **Array operations**: Array functions and operators
5. **Numeric operations**: Mathematical functions in various contexts

#### Root Cause Analysis:
The 124/258 plateau suggests that:
- Context-specific exclusions are working (no regressions)
- But function-specific `funcformat` values are the missing piece
- Need to distinguish between SQL syntax vs explicit call functions
- Need better detection of aggregate-in-typecast patterns

### Next Steps to Break the Plateau

1. **Implement function-specific funcformat logic**
   - Create mapping of SQL syntax functions
   - Add getFuncformatValue() method
   - Test with TRIM/string function failures

2. **Enhance TypeCast + Aggregate detection**
   - Improve context detection for aggregates in casts
   - May need parent node analysis beyond current path checking

3. **Systematic testing approach**
   - Target specific failing test categories
   - Verify each improvement maintains baseline
   - Focus on high-impact function types first

### Key Insights
- The transformer architecture is sound (124/258 baseline is stable)
- Context-specific exclusions work correctly
- The remaining challenge is function-type-specific behavior
- PG14 parser behavior varies significantly by function category
- Need more granular funcformat assignment logic

## Implementation Strategy
Focus on breaking the 124/258 plateau by implementing function-specific funcformat logic, starting with the most common failing patterns (TRIM, aggregates in TypeCast).
