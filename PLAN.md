# PostgreSQL Deparser v17 Implementation Plan

## Executive Summary
Comprehensive plan to upgrade the PostgreSQL deparser from v13 to v17 with full symmetric parsing/deparsing capabilities, addressing critical type handling issues and implementing a robust visitor pattern architecture.

## Current State Analysis

### Project Structure
- **Repository**: pgsql-parser-v2 (Lerna monorepo)
- **Branch**: feat/pgsql-v2-base
- **Packages**: @pgsql/parser, @pgsql/deparser, @pgsql/types, @pgsql/utils
- **Dependencies**: libpg-query-node, libpg_query (core parsing libraries)

### Critical Issues Identified
1. **Build Failures**: Missing @pgsql/types imports in deparser
2. **Type System**: Wrapped vs unwrapped node handling inconsistencies
3. **Test Infrastructure**: Jest not found, dependency resolution issues
4. **Test AST Typing Issues**: Inconsistent String node formats in test files
5. **PostgreSQL Compatibility**: Need upgrade from v13 to v17 support

### Key Requirements from TODO.md
- Fix RangeVar and TypeName "wrapped" vs "inlined" node type handling
- Implement symmetric round-trip parsing (SQL → AST → SQL)
- Maintain type safety throughout the deparser
- Comprehensive test coverage for all statement types
- Fix inconsistent AST typing in test files

### Test AST Typing Issues Discovered
Analysis of test files reveals inconsistent String node representations:
- Some tests use: `{ String: { sval: "value" } }` (correct format)
- Others use: `{ String: { str: "value" } }` (incorrect format)
- This affects multiple test files including deparser.test.ts, security-stmt.test.ts, and others
- These inconsistencies cause type errors and test failures

## Implementation Strategy

### Phase 1: Foundation & Build System (Week 1)
**Objective**: Establish working build environment and fix critical infrastructure issues

#### 1.1 Dependency Resolution
- Run `yarn` in the root directory to install all dependencies
- Run `yarn build` in the root to build all packages and make them available to each other
- This should resolve @pgsql/types import issues in deparser package (Lerna/Yarn workspace setup)
- Ensure proper Lerna workspace linking is established
- Install missing Jest dependencies for testing

#### 1.2 Type System Fixes
- Address wrapped vs unwrapped node type handling in:
  - RangeVar nodes (currently wrapped, should be inlined per TODO.md)
  - TypeName nodes (property access issues)
  - All AST node types requiring consistent handling

#### 1.3 Test AST Typing Fixes
- Standardize String node format across all test files to use `{ String: { sval: "value" } }`
- Fix inconsistent node representations in:
  - `/packages/deparser/__tests__/deparser.test.ts`
  - `/packages/deparser/__tests__/security-stmt.test.ts`
  - `/packages/deparser/__tests__/type-stmt.test.ts`
  - And 16+ other test files with similar issues
- Ensure all test ASTs conform to the correct type definitions

#### 1.4 Build Infrastructure
- Fix TypeScript compilation errors
- Ensure all packages build successfully
- Establish working test environment (run `cd packages/deparser && yarn test` for deparser-specific tests)
- Set up proper linting and formatting

### Phase 2: Core Deparser Architecture (Week 2)
**Objective**: Rebuild deparser with robust visitor pattern and PostgreSQL 17 compatibility

#### 2.1 Visitor Pattern Enhancement
Based on existing deparser.ts structure, enhance the visitor pattern:
- Improve getNodeType() and getNodeData() methods for reliable node detection
- Implement consistent error handling for unknown node types
- Add comprehensive logging and debugging capabilities

#### 2.2 Node Type Handlers - Simple Statements
Following the phased approach from IMPLEMENTATION_PLAN.md:
- **Transaction Statements**: BEGIN, COMMIT, ROLLBACK, SAVEPOINT
- **Variable Statements**: SET, SHOW, RESET
- **Utility Statements**: EXPLAIN, ANALYZE, VACUUM

#### 2.3 PostgreSQL 17 Compatibility
- Update type definitions for new PostgreSQL 17 features
- Handle new AST node types introduced in v17
- Focus exclusively on PostgreSQL 17 support (no backward compatibility needed)

### Phase 3: DDL Statement Support (Week 3)
**Objective**: Implement comprehensive DDL statement deparsing

#### 3.1 Table Operations
- CREATE TABLE (all variants: temporary, if not exists, with constraints)
- ALTER TABLE (add/drop columns, constraints, indexes)
- DROP TABLE (with cascade options)

#### 3.2 Index and Constraint Operations
- CREATE/DROP INDEX (unique, partial, expression indexes)
- Primary key, foreign key, unique, check constraints
- Table-level vs column-level constraint handling

#### 3.3 Schema Operations
- CREATE/DROP SCHEMA
- CREATE/DROP DATABASE
- User and role management statements

### Phase 4: DML Statement Support (Week 4)
**Objective**: Complete DML statement deparsing with complex expression support

#### 4.1 Query Statements
- SELECT (with all clauses: WHERE, GROUP BY, HAVING, ORDER BY, LIMIT)
- Complex joins (INNER, LEFT, RIGHT, FULL OUTER, CROSS)
- Subqueries and CTEs (Common Table Expressions)
- Window functions and aggregations

#### 4.2 Modification Statements
- INSERT (VALUES, SELECT, ON CONFLICT)
- UPDATE (with joins, subqueries)
- DELETE (with joins, subqueries)
- MERGE statements (PostgreSQL 15+ feature)

#### 4.3 Advanced Expressions
- Function calls (built-in and user-defined)
- Operators (arithmetic, comparison, logical, pattern matching)
- Type casting and coercion
- Array and JSON operations
- Case expressions and conditionals

### Phase 5: Testing & Validation (Week 5)
**Objective**: Comprehensive testing and round-trip validation

#### 5.1 Test Infrastructure Enhancement
- Expand existing test suites in __tests__ directory
- Add round-trip testing: SQL → parse → deparse → compare
- Performance benchmarking for large queries
- Edge case and error condition testing

#### 5.2 PostgreSQL 17 Feature Testing
- Test new PostgreSQL 17 syntax and features
- Comprehensive validation of PostgreSQL 17 capabilities
- Performance testing with PostgreSQL 17 specific features

#### 5.3 Integration Testing
- Test with real-world SQL queries
- Validate against PostgreSQL regression test suite
- Performance and memory usage optimization

## Technical Implementation Details

### Node Type Handling Strategy
Based on analysis of types.ts and current deparser implementation:

```typescript
// Correct node type detection - only handles wrapped nodes
getNodeType(node: any): string {
  return Object.keys(node)[0];
}

// Inlined nodes are handled directly in deparser methods, e.g.:
// Inside SelectStmt method: this.RangeVar(node.relation, context)
// Inside CreateStmt method: this.TypeName(node.typeName, context)
```

**Important**: Inlined nodes should NEVER be handled in getNodeType. They are handled directly within the specific deparser methods that encounter them. For example:
- `node.relation` (inlined RangeVar) is handled by calling `this.RangeVar(node.relation, context)`
- `node.typeName` (inlined TypeName) is handled by calling `this.TypeName(node.typeName, context)`

### Test AST Standardization Strategy
All test ASTs must use consistent node formats:

```typescript
// Correct String node format
{ String: { sval: "value" } }

// Incorrect formats to be fixed
{ String: { str: "value" } }  // Wrong property name
```

### Error Handling Strategy
- Graceful degradation for unknown node types
- Comprehensive error messages with context
- Fallback to raw SQL representation when possible
- Detailed logging for debugging

### Testing Strategy
- **Unit Tests**: Individual node type handlers (use `cd packages/deparser && yarn test` for deparser tests)
- **Integration Tests**: Complete statement deparsing
- **Round-trip Tests**: SQL → AST → SQL validation
- **Regression Tests**: Ensure no breaking changes
- **Performance Tests**: Large query handling

## Dependencies and Integration

### Repository Relationships
1. **libpg_query** (pyramation/libpg_query): Core C library for PostgreSQL parsing
2. **libpg-query-node** (launchql/libpg-query-node): Node.js bindings for libpg_query
3. **pgsql-parser-v2**: High-level TypeScript interface and deparser

### Build Dependencies
- Node.js and Yarn for package management
- TypeScript for type safety
- Jest for testing framework
- Lerna for monorepo management
- ESLint and Prettier for code quality

## Risk Mitigation

### Technical Risks
- **Type System Complexity**: Mitigated by comprehensive testing and gradual implementation
- **PostgreSQL Version Compatibility**: Addressed through feature detection and fallbacks
- **Performance Concerns**: Monitored through benchmarking and optimization
- **Test AST Inconsistencies**: Addressed through systematic standardization in Phase 1

### Project Risks
- **Scope Creep**: Controlled through phased implementation approach
- **Integration Issues**: Addressed through early integration testing
- **Maintenance Burden**: Minimized through clean architecture and documentation

## Success Criteria

### Functional Requirements
- [ ] All PostgreSQL 17 statement types supported
- [ ] Round-trip parsing accuracy > 99.9%
- [ ] Full PostgreSQL 17 feature support
- [ ] Comprehensive test coverage > 95%
- [ ] All test ASTs properly typed and consistent

### Non-Functional Requirements
- [ ] Build time < 2 minutes for full project
- [ ] Memory usage < 100MB for typical queries
- [ ] Performance within 10% of PostgreSQL native parser
- [ ] Zero TypeScript compilation errors

### Quality Requirements
- [ ] All linting rules pass
- [ ] Documentation complete and up-to-date
- [ ] Code review approval from maintainers
- [ ] CI/CD pipeline green

## Timeline and Milestones

| Phase | Duration | Key Deliverables | Success Metrics |
|-------|----------|------------------|-----------------|
| 1 | Week 1 | Working build system, basic tests passing, AST typing fixed | All packages compile, Jest runs, tests use consistent AST format |
| 2 | Week 2 | Core visitor pattern, simple statements | Transaction/variable statements work |
| 3 | Week 3 | DDL statement support | CREATE/ALTER/DROP statements work |
| 4 | Week 4 | DML statement support | SELECT/INSERT/UPDATE/DELETE work |
| 5 | Week 5 | Testing and optimization | 95%+ test coverage, performance targets met |

## Detailed Test AST Fixes Required

### Files Requiring String Node Format Standardization
Based on search analysis, the following files need AST typing fixes:

1. **deparser.test.ts**: Line 206, 215, 267 - `str` should be `sval`
2. **security-stmt.test.ts**: Multiple instances of correct `sval` format (good examples)
3. **type-stmt.test.ts**: Multiple instances using correct `sval` format
4. **create-table.test.ts**: Uses correct format throughout
5. **Additional 16+ test files**: Need systematic review and standardization

### AST Node Format Standards
All test ASTs must conform to the type definitions in `/packages/types/src/types.ts`:

```typescript
// String nodes
{ String: { sval: string } }

// Integer nodes  
{ Integer: { ival: number } }

// Boolean nodes
{ Boolean: { boolval: boolean } }

// List nodes
{ List: { items: Node[] } }
```

## Next Steps

1. **Immediate Actions**:
   - Fix build system and dependency issues
   - Standardize test AST typing across all test files
   - Create working test environment
   - Begin Phase 1 implementation

2. **Short-term Goals**:
   - Establish robust visitor pattern architecture
   - Implement simple statement types
   - Set up comprehensive testing framework

3. **Long-term Vision**:
   - Complete PostgreSQL 17 compatibility
   - Achieve production-ready quality
   - Establish maintenance and update procedures

## Implementation Patterns and Conventions

### Existing Visitor Pattern Architecture
The current deparser uses a visitor pattern in `/packages/deparser/src/deparser.ts`:

```typescript
visit(node: Node, context: DeparserContext = {}): string {
  const nodeType = this.getNodeType(node);
  const nodeData = this.getNodeData(node);

  const methodName = nodeType as keyof this;
  if (typeof this[methodName] === 'function') {
    return (this[methodName] as any)(nodeData, context);
  }
  
  throw new Error(`Deparser does not handle node type: ${nodeType}`);
}

getNodeType(node: Node): string {
  return Object.keys(node)[0];  // Only handles wrapped nodes
}

getNodeData(node: Node): any {
  const type = this.getNodeType(node);
  return (node as any)[type];   // Unwraps the node data
}
```

### Node Data Extraction Pattern
```typescript
getNodeData(node: any): any {
  if (!node || typeof node !== 'object') return node;
  
  const keys = Object.keys(node);
  if (keys.length === 1 && typeof node[keys[0]] === 'object') {
    return node[keys[0]]; // Unwrap wrapped nodes
  }
  
  return node; // Return inlined nodes as-is
}
```

### RangeVar Handler Example
```typescript
RangeVar(node: t.RangeVar, context: DeparserContext): string {
  const output: string[] = [];

  let tableName = '';
  if (node.schemaname) {
    tableName = QuoteUtils.quote(node.schemaname) + '.' + QuoteUtils.quote(node.relname);
  } else {
    tableName = QuoteUtils.quote(node.relname);
  }
  output.push(tableName);

  if (node.alias) {
    const aliasStr = this.Alias(node.alias, context);
    output.push(aliasStr);
  }

  return output.join(' ');
}
```

## Conclusion

This plan provides a comprehensive roadmap for upgrading the PostgreSQL deparser to v17 with full symmetric parsing capabilities. The phased approach ensures manageable complexity while maintaining quality and reliability throughout the implementation process.

Key focus areas include:
1. **Foundation fixes**: Build system, dependencies, and test AST typing
2. **Architecture enhancement**: Robust visitor pattern and PostgreSQL 17 compatibility
3. **Comprehensive coverage**: All DDL and DML statement types
4. **Quality assurance**: Extensive testing and validation

The success of this project will establish pgsql-parser-v2 as the definitive TypeScript solution for PostgreSQL query parsing and deparsing, enabling advanced SQL analysis, transformation, and generation capabilities for the JavaScript/TypeScript ecosystem.
