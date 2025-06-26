# PostgreSQL 13->14 AST Transformer Notes

## Current Status
- **Pass Rate**: 125/258 tests (48.4%)
- **Baseline**: Improved from 124 to 125 with enum transformations
- **Branch**: devin/1750826349-v13-to-v14-transformer
- **Last Updated**: June 26, 2025 22:04 UTC

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
Focus on breaking the 125/258 plateau by implementing function-specific funcformat logic, starting with the most common failing patterns (TRIM, aggregates in TypeCast).

## Recent Enum Transformations (June 26, 2025)

### Implemented Enum Mappings
Added systematic enum transformations to handle PG13->PG14 differences:

#### A_Expr_Kind Transformations
```typescript
private transformA_Expr_Kind(kind: string): string {
  const pg13ToP14Map: { [key: string]: string } = {
    'AEXPR_OF': 'AEXPR_IN',     // AEXPR_OF removed in PG14
    'AEXPR_PAREN': 'AEXPR_OP',  // AEXPR_PAREN removed in PG14
    // ... other values preserved
  };
  return pg13ToP14Map[kind] || kind;
}
```

#### RoleSpecType Transformations
```typescript
private transformRoleSpecType(type: string): string {
  // Handles addition of ROLESPEC_CURRENT_ROLE at position 1 in PG14
  // Maps existing PG13 values to correct PG14 positions
}
```

### Integration Points
- **A_Expr method**: Now calls `this.transformA_Expr_Kind(node.kind)` for enum transformation
- **RoleSpec method**: Calls `this.transformRoleSpecType(node.roletype)` for role type mapping
- **Fixed duplicate functions**: Removed conflicting transformRoleSpecType implementations

### Results
- **Pass Rate**: Maintained 125/258 (no regression from enum changes)
- **Stability**: Enum transformations working correctly without breaking existing functionality
- **Foundation**: Prepared for additional enum transformations (TableLikeOption, SetQuantifier)

### Analysis Scripts Created
- `analyze_funcformat_failures.js`: Systematic funcformat failure analysis
- `test_extract_direct.js`: Direct PG13 vs PG14 parser comparison
- `test_date_part_transform.js`: Function name transformation testing
- `investigate_enums.js`: Enum value investigation across versions
