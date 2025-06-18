# Deparser Implementation Progress

## Current Status
Working on implementing missing deparser functionality for PostgreSQL 13→17 upgrade compatibility in the kitchen-sink test suite. The goal is to achieve pixel-perfect AST matching through the parse → deparse → reparse cycle.

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

## Next Steps

### Immediate Priority
1. **Fix A_Expr Parentheses**: Complete the complex expression parentheses fix
2. **Test Validation**: Verify the fix resolves the type_sanity-40.sql case
3. **Build & Test**: Rebuild deparser and run kitchen-sink tests

### Known Issues to Address
1.  Strings sometimes render with quotes when they should not, and likely can be solved using the DeparserContext, e.g. this is the current, bad, inccorrect output for a deparse: 
  CREATE OPERATOR "##" ( LEFTARG = path, RIGHTARG = path, PROCEDURE = path_inter, COMMUTATOR = "##" )
The hashes should not be in quotes... but they are because the AST represents them as strings.
2. other places (maybe also solved with context, I'm not sure) but you use comma instead of period to join:
      ❌ INPUT SQL: ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id
      ❌ DEPARSED SQL: ALTER SEQUENCE public."User_id_seq" OWNED_BY public, User, id

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
