# PostgreSQL Deparser for PG17: Architecture Analysis and Implementation Guide

## Executive Summary

This document provides a comprehensive analysis of the current PostgreSQL deparser implementation and outlines the approach for rebuilding it to support PostgreSQL 17 compatibility. The deparser is responsible for converting Abstract Syntax Trees (ASTs) back into SQL strings, enabling symmetric parsing and deparsing operations.

### Key Objectives
- Fix critical TypeName method signature error causing build failures
- Upgrade from PostgreSQL 13 to PostgreSQL 17 compatibility
- Improve node unwrapping and visitor pattern architecture
- Enhance test coverage and maintainability
- Provide comprehensive documentation for future development

### Current Status
- **Build Status**: Failing due to TypeName property access error
- **PostgreSQL Version**: Transitioning from PG13 to PG17
- **Architecture**: Visitor pattern with wrapped and unwrapped node types
- **Test Coverage**: Basic CREATE TABLE statements implemented

## Current Architecture Analysis

### Visitor Pattern Implementation

The current deparser uses a visitor pattern implemented in `packages/deparser/src/deparser.ts`. The core architecture consists of:

```typescript
export class Deparser implements DeparserVisitor {
  private formatter: SqlFormatter;
  private tree: Node[];

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);
    
    if (this[nodeType]) {
      return this[nodeType](node, context);
    }
    
    throw new Error(`Unsupported node type: ${nodeType}`);
  }

  getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  getNodeData(node: Node): any {
    const type = this.getNodeType(node);
    return (node as any)[type];
  }
}
```

### Key Components

1. **SqlFormatter**: Handles SQL formatting with configurable newlines and tabs
2. **QuoteUtils**: Manages identifier quoting and escaping
3. **ListUtils**: Utilities for unwrapping and processing node lists
4. **DeparserContext**: Context object passed through visitor methods
5. **Node Types**: Type definitions from `@pgsql/types`

### Current Utility Classes

- **SqlFormatter**: Provides consistent SQL formatting
- **QuoteUtils**: Handles identifier quoting based on PostgreSQL rules
- **ListUtils**: Unwraps List nodes and processes arrays
- **DeparserVisitor**: Interface defining visitor method signatures

## Reference Materials Analysis

### PostgreSQL C Implementation (`postgres_deparse.c`)

The C reference implementation provides comprehensive patterns for:

**Key Functions**:
- `deparseStringLiteral()`: String escaping and quoting
- `isReservedKeyword()`: Keyword detection for quoting
- `deparseAnyName()`: Name list processing
- `deparseExpr()`: Expression handling
- `deparseTypeName()`: Type name processing

**Context Handling**:
```c
typedef enum DeparseNodeContext {
  DEPARSE_NODE_CONTEXT_NONE,
  DEPARSE_NODE_CONTEXT_INSERT_RELATION,
  DEPARSE_NODE_CONTEXT_A_EXPR,
  DEPARSE_NODE_CONTEXT_CREATE_TYPE,
  DEPARSE_NODE_CONTEXT_ALTER_TYPE,
  DEPARSE_NODE_CONTEXT_SET_STATEMENT,
  DEPARSE_NODE_CONTEXT_FUNC_EXPR,
  DEPARSE_NODE_CONTEXT_IDENTIFIER,
  DEPARSE_NODE_CONTEXT_CONSTANT
} DeparseNodeContext;
```

### Legacy PG13 Implementation (`reference/deparser.ts`)

The old implementation (4,221 lines) provides insights into:

- Function-based approach vs. class-based visitor pattern
- Direct property access without proper unwrapping
- Extensive use of utility functions for formatting
- Complex type modification handling

**Key Patterns**:
```typescript
function deparse(node, context) {
  if (node.TypeName) {
    return deparseTypeName(node.TypeName);
  }
  // ... other node types
}
```

### Node Types (`@pgsql/types`)

These are the types you should use to navigate the deparse, study them well!

## Test Requirements Analysis

### Current Test Structure (`create-table.test.ts`)

The tests define expected behavior for CREATE TABLE statements:

```typescript
describe('CREATE TABLE statements', () => {
  it('should deparse simple CREATE TABLE', () => {
    const ast = {
      RawStmt: {
        stmt: {
          CreateStmt: {
            relation: {
              relname: 'users',
              inh: true,
              relpersistence: 'p'
            },
            tableElts: [
              {
                ColumnDef: {
                  colname: 'id',
                  typeName: {
                    names: [{ String: { sval: 'int4' } }],
                    typemod: -1
                  }
                }
              }
            ]
          }
        }
      }
    };
    
    const result = Deparser.deparse(ast);
    expect(result).toBe('CREATE TABLE users (id int4)');
  });
});
```

This test confirms that TypeName nodes are passed as direct objects with `names` and `typemod` properties, not wrapped in a `TypeName` property.

### Test Coverage Areas

1. **Basic CREATE TABLE**: Simple table creation
2. **IF NOT EXISTS**: Conditional creation
3. **TEMPORARY TABLE**: Temporary table handling
4. **Schema-qualified names**: Schema.table syntax
5. **Constraints**: PRIMARY KEY, NOT NULL, CHECK, UNIQUE
6. **DEFAULT values**: Integer, string, boolean defaults
7. **Data types**: Various PostgreSQL data types with modifiers
8. **Table-level constraints**: Composite keys, table checks

## Proposed Architecture

### 1. Context Enhancement

**Expanded Context System**:
```typescript
export interface DeparserContext {
  // Current context
  parentNode?: Node;
  parentNodeType?: string;
  parentField?: string;
  
  // New context enhancements
  indentLevel?: number;
  inSubquery?: boolean;
  inConstraint?: boolean;
  inExpression?: boolean;
  
  // PostgreSQL 17 specific
  jsonFormatting?: boolean;
  xmlFormatting?: boolean;
  partitionContext?: boolean;
}
```

### 2. Utility Function Organization

**Enhanced QuoteUtils**:
```typescript
export class QuoteUtils {
  static quote(identifier: string): string {
    if (!identifier) return '';
    
    // Check if quoting is needed
    if (this.needsQuoting(identifier)) {
      return `"${identifier.replace(/"/g, '""')}"`;
    }
    
    return identifier;
  }
  
  private static needsQuoting(identifier: string): boolean {
    // PostgreSQL identifier rules
    if (!/^[a-z_][a-z0-9_$]*$/.test(identifier)) {
      return true;
    }
    
    // Check reserved keywords
    return RESERVED_KEYWORDS.has(identifier.toLowerCase());
  }
}
```

**Enhanced ListUtils**:
```typescript
export class ListUtils {
  static unwrapList(listNode: any): any[] {
    if (!listNode) return [];
    
    if (listNode.List) {
      return listNode.List.items || [];
    }
    
    if (Array.isArray(listNode)) {
      return listNode;
    }
    
    return [listNode];
  }
  
  static processNodeList(nodes: any[], visitor: (node: any) => string): string[] {
    return this.unwrapList(nodes).map(visitor);
  }
}
```

## Implementation Roadmap

### Phase 1: Critical Fixes 

1. **Fix TypeName and RangeVar usage in tests**
   - Update TypeName and RangeVar method to use correct unwrapped signature
   - Test with existing CREATE TABLE tests

2. **Node Type Pattern Audit**
   - Review all visitor methods for correct wrapped/unwrapped patterns
   - Identify other methods with similar signature issues
   - Implement consistent pattern recognition

3. **Basic Test Validation**
   - Ensure all existing tests pass
   - Fix any regression issues
   - Validate CREATE TABLE functionality

### Phase 2: PostgreSQL 17 Compatibility 

1. **AST Structure Updates**
   - Compare PG13 vs PG17 AST differences
   - Update node type definitions
   - Handle new node types

2. **Expression Handling Enhancement**
   - Update A_Expr processing
   - Enhance operator handling
   - Improve function call processing

3. **Constraint System Updates**
   - Update constraint processing
   - Handle new constraint types
   - Improve constraint validation

### Phase 3: Testing and Documentation

1. **Comprehensive Test Suite**
   - Add tests for all statement types
   - Include edge case testing
   - Performance benchmarking

2. **Documentation Updates**
   - API documentation
   - Usage examples
   - Migration guide

3. **Integration Testing**
   - End-to-end testing
   - Compatibility validation
   - Regression testing

## Testing Strategy

### 1. Unit Testing Approach

**Test Structure**:
```typescript
describe('Deparser', () => {
  describe('TypeName handling', () => {
    it('should handle simple type names', () => {
      const ast = {
        TypeName: {
          names: [{ String: { sval: 'int4' } }],
          typemod: -1
        }
      };
      
      const deparser = new Deparser([]);
      const result = deparser.TypeName(ast, {});
      expect(result).toBe('int4');
    });
    
    it('should handle type modifiers', () => {
      const ast = {
        TypeName: {
          names: [{ String: { sval: 'varchar' } }],
          typemod: 104 // varchar(100)
        }
      };
      
      const deparser = new Deparser([]);
      const result = deparser.TypeName(ast, {});
      expect(result).toBe('varchar(100)');
    });
  });
});
```

### 2. Integration Testing

**Round-trip Testing**:

Since the strings may differ slightly (whitespace, etc.) use the ASTs to check equality:

```typescript
describe('Round-trip testing', () => {
  it('should parse and deparse identically', () => {
    const sql = 'CREATE TABLE users (id int4, name text)';
    const ast = parse(sql);
    const deparsed = Deparser.deparse(ast);
    const parsedDeparse = parse(deparsed);
    expect(deparsed).toBe(parsedDeparse);
  });
});
```

Although, this should all be made into a test utilties inside of packages/deparser/test-utils/

## Verification Strategy

### Code Quality Checks
1. **TypeScript Compilation**: Ensure all type errors are resolved
2. **Linting**: Follow project coding standards
3. **Test Coverage**: Maintain >90% test coverage

### Functional Validation
1. **Test Suite**: All tests must pass
2. **Round-trip Testing**: Parse → Deparse → Parse consistency
3. **PostgreSQL Compatibility**: Validate against actual PostgreSQL 17
4. **Regression Testing**: Ensure no functionality loss