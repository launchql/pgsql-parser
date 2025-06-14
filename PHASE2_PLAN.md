# Phase 2: Fix CREATE TABLE Issues

## Overview
Phase 1 successfully implemented simple statement visitors (TransactionStmt, VariableSetStmt, VariableShowStmt) with all 21 tests passing. Phase 2 focuses on fixing the existing CREATE TABLE deparser issues revealed by the test failures.

## Current CREATE TABLE Test Results
- **Passing**: 9/14 tests
- **Failing**: 5/14 tests

## Issues to Fix

### 1. TEMPORARY Table Keyword Missing
**Problem**: "CREATE TEMPORARY TABLE" becomes "CREATE TABLE"
**Root Cause**: CreateStmt visitor not handling `relpersistence` property
**Fix Location**: `CreateStmt` visitor in deparser.ts

### 2. Schema Name Spacing Issue  
**Problem**: "public.users" becomes "public . users" (extra spaces)
**Root Cause**: RangeVar visitor adding unnecessary spaces in schema.table formatting
**Fix Location**: `RangeVar` visitor in deparser.ts

### 3. Boolean DEFAULT Value Issue
**Problem**: "DEFAULT true" becomes "DEFAULT NULL"  
**Root Cause**: Boolean constant handling in A_Const or Boolean visitor
**Fix Location**: `A_Const` or `Boolean` visitor in deparser.ts

### 4. Type Modifier Handling
**Problem**: "varchar(40)" becomes "varchar", "numeric(10,2)" becomes "numeric"
**Root Cause**: TypeName visitor not properly handling `typmods` property
**Fix Location**: `TypeName` visitor in deparser.ts (already partially fixed)

### 5. Table-level PRIMARY KEY Constraint
**Problem**: "PRIMARY KEY (user_id, role_id)" becomes "PRIMARY KEY"
**Root Cause**: Constraint visitor not handling column list for table-level constraints
**Fix Location**: `Constraint` visitor in deparser.ts

## Implementation Strategy

### Step 1: Fix TEMPORARY Table Support
```typescript
CreateStmt(node: t.CreateStmt['CreateStmt'], context: DeparserContext): string {
  const output: string[] = [];
  
  output.push('CREATE');
  
  // Handle TEMPORARY tables
  if (node.relation?.relpersistence === 't') {
    output.push('TEMPORARY');
  }
  
  output.push('TABLE');
  // ... rest of implementation
}
```

### Step 2: Fix Schema Name Spacing
```typescript
RangeVar(node: t.RangeVar['RangeVar'], context: DeparserContext): string {
  const output: string[] = [];

  if (node.schemaname) {
    output.push(QuoteUtils.quote(node.schemaname));
    output.push('.'); // Remove extra spaces
  }

  output.push(QuoteUtils.quote(node.relname));
  // ... rest of implementation
}
```

### Step 3: Fix Boolean DEFAULT Values
```typescript
Boolean(node: t.Boolean, context: DeparserContext): string {
  return node.boolval ? 'true' : 'false';
}
```

### Step 4: Fix Type Modifiers
```typescript
TypeName(node: t.TypeName, context: DeparserContext): string {
  // ... existing name handling ...
  
  // Fix typmods handling
  const args = node.typmods ? this.formatTypeMods(node.typmods, context) : null;
  
  // Apply modifiers correctly
  return args ? `${typeName}${args}` : typeName;
}
```

### Step 5: Fix Table-level Constraints
```typescript
Constraint(node: t.Constraint['Constraint'], context: DeparserContext): string {
  // ... existing constraint handling ...
  
  // Handle column lists for table-level constraints
  if (node.keys && node.keys.length > 0) {
    const keyList = ListUtils.unwrapList(node.keys)
      .map(key => this.visit(key, context))
      .join(', ');
    output.push(`(${keyList})`);
  }
  
  // ... rest of implementation
}
```

## Testing Strategy

### Level 1: Individual Issue Testing
Create focused unit tests for each issue:
- `temporary-table.test.ts`
- `schema-spacing.test.ts` 
- `boolean-defaults.test.ts`
- `type-modifiers.test.ts`
- `table-constraints.test.ts`

### Level 2: Integration Testing
Run full CREATE TABLE test suite after each fix to ensure no regressions.

### Level 3: Verification
Ensure all 14 CREATE TABLE tests pass before proceeding to Phase 3.

## Success Criteria
- All 14 CREATE TABLE tests passing
- No regressions in existing functionality
- Proper handling of PostgreSQL DDL syntax
- Clean, maintainable code following existing patterns

## Next Phase Preview
Phase 3 will focus on implementing missing DDL statement visitors and enhancing existing ones for full PostgreSQL 17 compatibility.
