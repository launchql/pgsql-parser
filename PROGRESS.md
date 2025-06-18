# Deparser Implementation Progress

## Current Status
Working on implementing missing deparser functionality for PostgreSQL 13→17 upgrade compatibility in the kitchen-sink test suite. The goal is to achieve pixel-perfect AST matching through the parse → deparse → reparse cycle.

## Last Working Session Summary
- **Branch**: `devin/1750203087-fix-sublink-deparser`
- **PR**: #15 - "feat: comprehensive deparser improvements for PostgreSQL 13→17 upgrade"
- **Current Focus**: Fixing parentheses handling in A_Expr for complex expressions

## Recent Progress Made

### ✅ Completed Fixes
1. **Window Function Handling**: Fixed clause ordering, named window references, empty window definitions
2. **SubLink Support**: EXISTS, IN, NOT IN, ANY, ALL subquery types  
3. **Multi-column Assignments**: MultiAssignRef detection and handling
4. **DDL Improvements**: AlterTableCmd, CompositeTypeStmt, CreateTableAsStmt enhancements
5. **Expression Handling**: NamedArgExpr, DropStmt, and other node type fixes
6. **TypeName Method**: Added SETOF support and nested type handling
7. **Window Frame Options**: Complex bit-based and hardcoded mapping logic for frame specifications

### ✅ Fixed: Parentheses Issue in A_Expr

**Problem**: The SQL expression `(t.typanalyze = 'range_typanalyze'::regproc) <> (r.rngtypid IS NOT NULL)` was being deparsed as `t.typanalyze = CAST ( 'range_typanalyze' AS regproc ) <> (r.rngtypid IS NOT NULL)` - missing parentheses around the left side.

**Root Cause**: The A_Expr method's parentheses logic was using `if/else if` structure, preventing complex expressions from getting parentheses when they were also A_Expr nodes.

**Solution Implemented**:
1. Added `isComplexExpression()` helper method to identify expressions needing parentheses
2. Modified A_Expr parentheses logic from `if/else if` to separate boolean flags
3. Enhanced precedence checking for nested expressions

**Status**: ✅ RESOLVED - Tests now pass the original `type_sanity-40.sql` case

### ✅ Fixed: A_Indirection Parentheses Issue

**Problem**: The SQL expression `(ts_token_type(cfgparser)).tokid` was being deparsed as `ts_token_type(cfgparser).tokid` - missing parentheses around function calls when accessing fields.

**Root Cause**: The A_Indirection method didn't include FuncCall in the list of node types requiring parentheses.

**Solution Implemented**: Added FuncCall to the parentheses condition in A_Indirection method:
```typescript
if (argType === 'TypeCast' || argType === 'SubLink' || argType === 'A_Expr' || argType === 'FuncCall') {
  argStr = `(${argStr})`;
}
```

**Status**: ✅ RESOLVED - Tests now pass the `upstream/tsearch-6.sql` case

### 🔧 Currently Debugging: DefineStmt OBJECT_TSDICTIONARY Support

**Problem**: CREATE TEXT SEARCH DICTIONARY statements are not supported in the deparser.

**Failing Test**: `upstream/tsdicts-1.sql`
**Error**: "Unsupported DefineStmt kind: OBJECT_TSDICTIONARY"
**SQL**: `CREATE TEXT SEARCH DICTIONARY ispell (template = ispell, dictfile = ispell_sample, afffile = ispell_sample)`

**Root Cause**: The DefineStmt method doesn't handle OBJECT_TSDICTIONARY kind.

**Next Steps**:
1. Examine DefineStmt method implementation
2. Add support for OBJECT_TSDICTIONARY kind
3. Implement proper text search dictionary syntax generation

## Failing Tests Analysis

### Current Failing Test: `alter-table-column.test.ts`
- **Specific Case**: `upstream/tsdicts-1.sql`
- **Error**: "Unsupported DefineStmt kind: OBJECT_TSDICTIONARY"
- **Issue**: Missing DefineStmt support for CREATE TEXT SEARCH DICTIONARY

### Previously Fixed: 
- ✅ `upstream/type_sanity-40.sql` - A_Expr parentheses issue resolved
- ✅ `upstream/tsearch-6.sql` - A_Indirection parentheses issue resolved

### Test Pattern
All kitchen-sink tests follow the pattern:
1. Parse original SQL → AST1
2. Deparse AST1 → SQL2  
3. Parse SQL2 → AST2
4. Compare AST1 === AST2 (must be identical)

When step 3 fails with syntax error, it indicates the deparser generated invalid SQL.

## Debugging Approach

### Systematic Testing Strategy
1. **Isolated Test Cases**: Created focused debug scripts to test specific expressions
2. **Incremental Fixes**: Address one node type at a time
3. **AST Comparison**: Use FixtureTestUtils for precise AST matching
4. **Tight Feedback Loop**: Test individual cases before running full suite

### Debug Scripts Created
- `debug_parentheses_issue.js`: Tests complex expression parentheses
- `debug_frame_options.js`: Window frame specification debugging
- `debug_multiassign_detection.js`: Multi-column assignment testing
- Various frame option specific debuggers

## Next Steps

### Immediate Priority
1. **Fix A_Expr Parentheses**: Complete the complex expression parentheses fix
2. **Test Validation**: Verify the fix resolves the type_sanity-40.sql case
3. **Build & Test**: Rebuild deparser and run kitchen-sink tests

### Remaining Kitchen-Sink Tests
Based on previous runs, these test files likely need attention:
- `alter-table-column.test.ts` (current focus)
- `basic.test.ts`
- `select.test.ts` 
- `plpgsql.test.ts`
- `foreign_key.test.ts`
- `jsonb.test.ts`
- `numeric.test.ts`

### Known Issues to Address
1. **SIMILAR TO Expression**: May need AEXPR_SIMILAR handling fixes
2. **RangeFunction Handling**: Complex function call parsing
3. **XML Expression Parsing**: Specialized XML syntax support
4. **TypeName Method Signatures**: Critical signature compatibility issues

## Technical Architecture Notes

### Visitor Pattern Implementation
- Uses `getNodeType()` method that returns first key of node object
- Each node type has corresponding `visit[NodeType]` method
- Context passing crucial for statement type differentiation

### Key Deparser Components
- **SqlFormatter**: Handles SQL formatting and parentheses
- **QuoteUtils**: Manages identifier quoting
- **ListUtils**: Processes PostgreSQL list structures
- **Precedence Logic**: Operator precedence for parentheses decisions

### Critical Success Factors
- **Pixel-Perfect Matching**: AST structures must be identical
- **PostgreSQL Version Compatibility**: Support 13→17 upgrade path
- **Complex Expression Handling**: Nested structures with proper precedence
- **Context Awareness**: Different behavior based on statement context

## Confidence Level
**High** 🟢 - Successfully resolved the A_Expr parentheses issue and identified the next problem (A_Indirection). The systematic debugging approach is working well, moving through different node types that need parentheses fixes.

---
*Last Updated: Current session - successfully fixed A_Expr and A_Indirection parentheses, now working on DefineStmt OBJECT_TSDICTIONARY support*
