# TODO: Transform Package Improvements

## Type Safety Improvements

### Add Return Type Annotations to Transformer Methods
- **Priority**: High
- **Description**: Add proper TypeScript return type annotations to all transformer methods in v15-to-v16.ts (and other transformers)
- **Benefit**: Would catch structural issues like double-wrapping at compile time instead of runtime
- **Example**: 
  ```typescript
  TypeName(node: PG15.TypeName, context: TransformerContext): { TypeName: PG16.TypeName } {
    // implementation
  }
  ```
- **Impact**: Prevents bugs like the double-wrapping issue we encountered where `{"TypeName": {"TypeName": {...}}}` was produced instead of `{"TypeName": {...}}`

### Improve Type Definitions
- Add stricter typing for node transformation methods
- Consider using mapped types for consistent return type patterns
- Add compile-time validation for node wrapping consistency

## Testing Improvements
- Add unit tests for individual transformer methods
- Create focused test cases for edge cases like empty Integer nodes
- Improve error messages in transformation mismatches

## Documentation
- Document transformation patterns and conventions
- Add examples of proper node wrapping
- Document debugging strategies for transformation issues
