# PostgreSQL Deparser PG17 Implementation Plan

## Overview

This document outlines the progressive implementation strategy for building all node deparse visitors for the PostgreSQL 17 deparser. We'll start with the simplest statement types and gradually move to more complex expressions, following a structured testing approach.

## Implementation Strategy

### Phase 1: Simple Statement Types 

#### 1.1 Transaction Statements
**Priority: HIGH** - Simple enum-based logic, good starting point

**Target Nodes:**
- `TransactionStmt` - BEGIN/COMMIT/ROLLBACK statements
- `TransactionStmtKind` enum handling

**Current Implementation Reference:**
```typescript
// From packages/deparser/src/deparser.ts:3609-3701
TransactionStmt(node: t.TransactionStmt['TransactionStmt'], context: DeparserContext): string {
  // Enum-based logic for transaction kinds
}
```

**Test Strategy:**
```typescript
// Unit test with hardcoded AST
describe('TransactionStmt', () => {
  it('should deparse BEGIN statement', () => {
    const ast = {
      TransactionStmt: {
        kind: TransactionStmtKind.TRANS_STMT_BEGIN,
        options: []
      }
    };
    expect(deparser.visit(ast, context)).toBe('BEGIN');
  });
});
```

#### 1.2 Variable Statements
**Priority: HIGH** - String formatting, straightforward logic

**Target Nodes:**
- `VariableSetStmt` - SET commands
- `VariableShowStmt` - SHOW commands
- `SetToDefault` - DEFAULT keyword

**Implementation Pattern:**
```typescript
VariableSetStmt(node: t.VariableSetStmt, context: DeparserContext): string {
  // Handle SET variable = value patterns
}
```

#### 1.3 Simple Expression Types
**Priority: MEDIUM** - Foundation for complex expressions

**Target Nodes:**
- `A_Const` - Constants (strings, numbers, booleans)
- `String` - String literals
- `Integer` - Integer literals
- `Float` - Float literals
- `Boolean` - Boolean literals

### Phase 2: Basic DDL Statements (Phase 3-4)

#### 2.1 CREATE TABLE (Fix Existing)
**Priority: HIGH** - Already has tests, needs TypeName fix

**Current Issue:**
```typescript
// BROKEN: packages/deparser/src/deparser.ts:612
TypeName(node: t.TypeName['TypeName'], context: DeparserContext): string {
  // ERROR: Property 'TypeName' does not exist on type 'TypeName'
```

**Fix Required:**
```typescript
TypeName(node: t.TypeName, context: DeparserContext): string {
  if (!node.names) {
    return '';
  }
  
  const names = node.names.map((name: any) => {
    if (name.String) {
      return name.String.sval || name.String.str;
    }
    return this.visit(name, context);
  }).join('.');
  
  return names;
}
```

#### 2.2 Column Definitions
**Priority: HIGH** - Required for CREATE TABLE

**Target Nodes:**
- `ColumnDef` - Column definitions
- `Constraint` - Column constraints
- `TypeName` - Data types (FIXED)

#### 2.3 Simple DDL Operations
**Priority: MEDIUM** - Build on CREATE TABLE foundation

**Target Nodes:**
- `CreateStmt` - CREATE TABLE statements
- `DropStmt` - DROP statements
- `AlterTableStmt` - Basic ALTER TABLE

### Phase 3: DML Statements (Phase 5-6)

#### 3.1 SELECT Statements
**Priority: HIGH** - Most complex, foundational

**Target Nodes:**
- `SelectStmt` - SELECT queries
- `ResTarget` - SELECT list items
- `FromExpr` - FROM clauses
- `JoinExpr` - JOIN operations

#### 3.2 INSERT/UPDATE/DELETE
**Priority: HIGH** - Core DML operations

**Target Nodes:**
- `InsertStmt` - INSERT statements
- `UpdateStmt` - UPDATE statements
- `DeleteStmt` - DELETE statements

### Phase 4: Complex Expressions (Phase 7-8)

#### 4.1 Function Calls and Operators
**Priority: MEDIUM** - Build on expression foundation

**Target Nodes:**
- `FuncCall` - Function calls
- `A_Expr` - Binary/unary expressions
- `BoolExpr` - Boolean expressions
- `CaseExpr` - CASE expressions

#### 4.2 Subqueries and CTEs
**Priority: LOW** - Most complex features

**Target Nodes:**
- `SubLink` - Subqueries
- `CommonTableExpr` - CTEs
- `WithClause` - WITH clauses

## Testing Strategy

### Level 1: Unit Tests with Hardcoded ASTs
**Phases 1-4** - Build confidence with known structures

```typescript
describe('TransactionStmt Deparser', () => {
  const deparser = new Deparser();
  const context = new DeparserContext();

  it('should handle BEGIN statement', () => {
    const ast = {
      TransactionStmt: {
        kind: TransactionStmtKind.TRANS_STMT_BEGIN,
        options: [],
        savepoint_name: null
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('BEGIN');
  });

  it('should handle COMMIT statement', () => {
    const ast = {
      TransactionStmt: {
        kind: TransactionStmtKind.TRANS_STMT_COMMIT,
        options: [],
        savepoint_name: null
      }
    };
    
    expect(deparser.visit(ast, context)).toBe('COMMIT');
  });
});
```

### Level 2: Parse-Generated AST Tests
**Phases 3-6** - Real-world AST structures

```typescript
describe('CREATE TABLE Integration', () => {
  it('should round-trip CREATE TABLE statements', () => {
    const sql = 'CREATE TABLE users (id INTEGER, name TEXT)';
    const parsed = parse(sql);
    const deparsed = deparser.deparse(parsed);
    
    // Should be functionally equivalent
    expect(parse(deparsed)).toEqual(parsed);
  });
});
```

### Level 3: Kitchen Sink Comprehensive Tests
**Phases 7-8** - Full SQL file testing

```typescript
// Extend existing packages/deparser/__tests__/kitchen-sink.test.ts
describe('Kitchen Sink SQL Files', () => {
  const sqlFiles = [
    'transaction-statements.sql',
    'ddl-statements.sql',
    'dml-statements.sql',
    'complex-queries.sql'
  ];

  sqlFiles.forEach(file => {
    it(`should handle all statements in ${file}`, () => {
      const sql = readFileSync(path.join(__dirname, 'sql', file), 'utf8');
      const statements = sql.split(';').filter(s => s.trim());
      
      statements.forEach(stmt => {
        const parsed = parse(stmt);
        const deparsed = deparser.deparse(parsed);
        expect(() => parse(deparsed)).not.toThrow();
      });
    });
  });
});
```

## Implementation Checklist

### Phase 1: Foundation
- [ ] Fix TypeName method signature error
- [ ] Implement TransactionStmt deparser
- [ ] Create unit tests for TransactionStmt
- [ ] Implement VariableSetStmt/VariableShowStmt
- [ ] Create unit tests for variable statements

### Phase 2: Basic Types
- [ ] Implement A_Const, String, Integer, Float, Boolean deparsers
- [ ] Create comprehensive constant type tests
- [ ] Fix any remaining wrapped/unwrapped type issues
- [ ] Establish testing patterns and utilities

### Phase 3: DDL Foundation
- [ ] Fix CREATE TABLE TypeName issue
- [ ] Implement ColumnDef deparser
- [ ] Create comprehensive CREATE TABLE tests
- [ ] Implement basic constraint deparsers

### Phase 4: DDL Completion
- [ ] Complete CreateStmt deparser
- [ ] Implement DropStmt deparser
- [ ] Add ALTER TABLE basic support
- [ ] Create parse-generated AST tests

### Phase 5: DML Foundation
- [ ] Implement SelectStmt deparser (basic)
- [ ] Implement ResTarget and FromExpr
- [ ] Create SELECT statement tests
- [ ] Begin INSERT/UPDATE/DELETE implementation

### Phase 6: DML Completion
- [ ] Complete INSERT/UPDATE/DELETE deparsers
- [ ] Add JOIN support to SELECT
- [ ] Create comprehensive DML tests
- [ ] Begin complex expression work

### Phase 7: Complex Expressions
- [ ] Implement FuncCall and A_Expr deparsers
- [ ] Add BoolExpr and CaseExpr support
- [ ] Create expression hierarchy tests
- [ ] Begin subquery implementation

### Phase 8: Advanced Features
- [ ] Complete subquery support
- [ ] Implement CTE deparsers
- [ ] Create kitchen sink test suite
- [ ] Performance optimization and cleanup

## Node Type Reference

### Wrapped Node Types (Access via `node.NodeType`)
```typescript
// Examples from current deparser
ColumnRef(node: t.ColumnRef['ColumnRef'], context: DeparserContext)
SelectStmt(node: t.SelectStmt['SelectStmt'], context: DeparserContext)
CreateStmt(node: t.CreateStmt['CreateStmt'], context: DeparserContext)
```

### Unwrapped Node Types (Direct access)
```typescript
// Examples that need fixing
TypeName(node: t.TypeName, context: DeparserContext)  // NOT t.TypeName['TypeName']
A_Const(node: t.A_Const, context: DeparserContext)   // Check if wrapped or not
```

### Utility Patterns
```typescript
// List unwrapping
const items = ListUtils.unwrapList(node.items);

// String quoting
const quoted = QuoteUtils.quote(stringValue);

// Context-aware formatting
const formatted = SqlFormatter.format(sql, context.indent);
```

## Error Handling Strategy

### Type Safety
```typescript
// Always check for required properties
if (!node.names || !Array.isArray(node.names)) {
  throw new Error(`Invalid TypeName node: missing names array`);
}

// Handle optional properties gracefully
const typemod = node.typemod ?? -1;
```

### Debugging Support
```typescript
// Add context information for debugging
context.addDebugInfo(`Processing ${nodeType} at line ${node.location}`);

// Comprehensive error messages
throw new Error(`Unsupported ${nodeType} variant: ${JSON.stringify(node)}`);
```

## Performance Considerations

### Visitor Pattern Optimization
- Cache frequently used utility instances
- Minimize string concatenation operations
- Use StringBuilder pattern for complex formatting

### Memory Management
- Reuse context objects where possible
- Clear temporary data structures
- Monitor memory usage during kitchen sink tests

## Success Metrics

### Code Quality
- [ ] All TypeScript compilation errors resolved
- [ ] 100% test coverage for implemented deparsers
- [ ] No runtime errors in kitchen sink tests
- [ ] Performance benchmarks within acceptable ranges

### Functional Completeness
- [ ] All PostgreSQL 17 statement types supported
- [ ] Round-trip parsing (parse → deparse → parse) works
- [ ] Generated SQL is valid and equivalent
- [ ] Edge cases and error conditions handled

### Documentation
- [ ] All deparser methods documented
- [ ] Testing patterns established and documented
- [ ] Performance characteristics documented
- [ ] Migration guide from PG13 to PG17 created

## Next Steps

1. **Immediate (This Phase)**:
   - Fix TypeName method signature in current deparser
   - Create first TransactionStmt unit test
   - Establish testing framework patterns

2. **Short Term (Next 2 Phases)**:
   - Complete Phase 1 implementation (simple statements)
   - Establish comprehensive testing patterns
   - Fix all wrapped/unwrapped type issues

3. **Medium Term (Month 2)**:
   - Complete DDL and DML statement support
   - Implement complex expression handling
   - Create comprehensive test suite

4. **Long Term (Month 3)**:
   - Performance optimization
   - Advanced PostgreSQL 17 features
   - Production readiness and documentation

This implementation plan provides a structured, testable approach to rebuilding the PostgreSQL deparser with comprehensive PG17 support while maintaining code quality and ensuring correctness through progressive testing strategies.
