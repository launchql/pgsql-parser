# PostgreSQL AST Transformation Tasks

## Project Overview

This project implements a comprehensive PostgreSQL AST transformation system that enables upgrading Abstract Syntax Trees (ASTs) across PostgreSQL versions 13 through 17. The system provides a modular, type-safe approach to handling the structural differences between PostgreSQL versions while preserving semantic equivalence.

## Goals

### Primary Objectives
1. **Eliminate `any` types** - Implement precise type-safe transformations using proper PostgreSQL version-specific types
2. **Sequential version transformations** - Build transformers for each version transition: 13→14, 14→15, 15→16, 16→17
3. **Semantic equivalence preservation** - Ensure transformed ASTs maintain the same semantic meaning across versions
4. **Complex node type conversions** - Handle intricate AST structure changes like A_Const field restructuring, Integer value transformations, and ObjectWithArgs context-sensitive rules

### Technical Goals
- **End-to-end integration testing** - Parse with PG13 → Transform to PG17 → Deparse → Parse again → Verify semantic equality
- **Dynamic method dispatch** - Use node type names as method names (like deparser pattern) for clean, maintainable code
- **Context-aware transformations** - Handle complex rules for adding/removing fields based on statement context
- **Field preservation** - Maintain all necessary AST fields while applying version-specific transformations

## Architecture

### Core Components

#### 1. Base Transformer (`src/visitors/base.ts`)
- **BaseTransformer class** - Foundation for all version-specific transformers
- **Dynamic method dispatch** - Automatically calls methods based on node type names
- **Field preservation logic** - Ensures critical fields are maintained during transformations
- **Context passing** - Supports transformation context for complex rules

#### 2. Version-Specific Transformers
- **V13ToV14Transformer** (`src/transformers/v13-to-v14.ts`) - Handles PG13→PG14 transformations
- **V14ToV15Transformer** (`src/transformers/v14-to-v15.ts`) - Handles PG14→PG15 transformations including A_Const restructuring
- **V15ToV16Transformer** (`src/transformers/v15-to-v16.ts`) - Handles PG15→PG16 transformations
- **V16ToV17Transformer** (`src/transformers/v16-to-v17.ts`) - Handles PG16→PG17 transformations

#### 3. Orchestration Layer (`src/transformer.ts`)
- **ASTTransformer** - Coordinates individual version transformers
- **PG13ToPG17Transformer** - Chains all transformations for complete 13→17 upgrade
- **ParseResult handling** - Manages wrapper structures and version metadata

#### 4. Test Infrastructure
- **FixtureTestUtils** (`test-utils/index.ts`) - Comprehensive testing utilities
- **Full transformation flow** (`test-utils/full-transform-flow.ts`) - End-to-end testing workflow
- **Kitchen sink tests** (`__tests__/kitchen-sink/`) - Real-world SQL test cases organized by version transitions

## Setup Instructions

### Prerequisites
- Node.js with yarn package manager
- PostgreSQL parser packages (@pgsql/parser, @pgsql/deparser)

### Installation & Build
```bash
# From repository root
yarn install
yarn build

# Navigate to transform package
cd packages/transform
```

### Development Environment
```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Watch mode for development
yarn test:watch

# Run specific test suites
yarn test __tests__/kitchen-sink/13-14/
yarn test __tests__/kitchen-sink/14-15/
```

## Testing Strategy

### Test Categories

#### 1. Unit Tests (`__test__/`)
- **Individual transformer tests** - Test each version transformer in isolation
- **Method-specific tests** - Verify individual node transformation methods
- **Debug tests** - Targeted tests for specific transformation issues

#### 2. Integration Tests (`__tests__/kitchen-sink/`)
- **Version transition tests** - Organized by version pairs (13-14, 14-15, etc.)
- **Real SQL fixtures** - Test against actual PostgreSQL SQL statements
- **Semantic equivalence verification** - Parse→Transform→Parse→Compare workflow

#### 3. End-to-End Tests
- **Full transformation flow** - Complete PG13→PG17 transformation pipeline
- **Round-trip testing** - Verify semantic equivalence after full transformation
- **Deparser integration** - Test with actual PostgreSQL deparser output

### Test Workflow
1. **Parse SQL with source version parser** (e.g., PG13)
2. **Transform AST through version chain** (13→14→15→16→17)
3. **Deparse with target version deparser** (PG17)
4. **Parse deparsed SQL with target parser** (PG17)
5. **Compare transformed AST with native parsed AST** (using cleanTree for location/spacing normalization)

## Current Status

### Completed Features
- ✅ Base transformer infrastructure with dynamic method dispatch
- ✅ V13ToV14Transformer with ObjectWithArgs context-sensitive handling
- ✅ V14ToV15Transformer with A_Const restructuring and Integer field preservation
- ✅ V15ToV16Transformer and V16ToV17Transformer foundations
- ✅ PG13ToPG17Transformer orchestration
- ✅ Comprehensive test infrastructure
- ✅ End-to-end integration testing framework

### Key Transformations Implemented
- **A_Const restructuring** - Transform `val.Integer.ival` to `ival.ival` structure in PG14→PG15
- **Integer boundary values** - Handle special cases like -2147483647, -32767 that should result in empty ival objects
- **ObjectWithArgs context rules** - Add/remove objfuncargs based on statement type and context
- **String field transformations** - Convert String.str to String.sval across versions
- **Field preservation** - Maintain critical fields like location, inh, relpersistence during transformations

### Active Development Areas
- **Remaining test failures** - Systematically addressing failing kitchen-sink tests
- **Type safety improvements** - Replacing remaining `any` types with proper PostgreSQL version types
- **Complex node transformations** - Handling edge cases in AST structure differences
- **Performance optimization** - Improving transformation speed for large ASTs

## Development Workflow

### Adding New Transformations
1. **Identify failing test** - Use kitchen-sink tests to find transformation issues
2. **Analyze AST differences** - Compare expected vs actual AST structures
3. **Implement transformation method** - Add method to appropriate version transformer
4. **Test and iterate** - Verify fix resolves issue without breaking other tests
5. **Update documentation** - Document new transformation rules and edge cases

### Debugging Transformation Issues
1. **Create targeted debug test** - Isolate specific SQL statement causing issues
2. **Trace transformation pipeline** - Follow AST through each version transformer
3. **Compare runtime schemas** - Use runtime schema imports to understand node structures
4. **Implement fix** - Update transformer method with proper field handling
5. **Verify semantic equivalence** - Ensure fix maintains semantic meaning

### Code Patterns
- **Method naming** - Use PostgreSQL node type names (e.g., `SelectStmt`, `A_Const`, `FuncCall`)
- **Field preservation** - Always preserve original fields unless explicitly transforming
- **Context awareness** - Pass context for complex transformation rules
- **Type safety** - Use version-specific types for method parameters

## Key Challenges & Solutions

### Challenge: A_Const Structure Changes
**Problem**: PG14→PG15 changes A_Const from `val.Integer.ival` to `ival.ival` structure
**Solution**: Implemented A_Const method with special handling for boundary values and proper field restructuring

### Challenge: ObjectWithArgs Context Sensitivity
**Problem**: objfuncargs field should be added/removed based on statement context
**Solution**: Context-aware ObjectWithArgs method that checks statement type and object type

### Challenge: Integer Field Preservation
**Problem**: Integer nodes losing ival field during transformation
**Solution**: Explicit Integer methods that ensure ival field preservation with proper default values

### Challenge: Dynamic Method Dispatch
**Problem**: Maintaining clean visitor pattern while handling diverse node types
**Solution**: BaseTransformer with automatic method dispatch based on node type names

## Future Enhancements

### Short Term
- Complete remaining kitchen-sink test fixes
- Eliminate all remaining `any` types
- Optimize transformation performance
- Add comprehensive error handling

### Long Term
- Support for additional PostgreSQL versions (18+)
- Bidirectional transformations (downgrade support)
- AST validation and integrity checking
- Performance benchmarking and optimization

## Resources

### Documentation
- `README.md` - Package overview and basic usage
- `AST_PLAN.md` - Detailed AST transformation planning
- `TRANSFORM_GUIDE.md` - Comprehensive transformation guide
- `TEST_STRATEGY.md` - Testing approach and methodology

### Key Files
- `src/index.ts` - Main package exports
- `src/transformer.ts` - Orchestration layer
- `src/visitors/base.ts` - Base transformer infrastructure
- `test-utils/index.ts` - Testing utilities
- `__tests__/kitchen-sink/` - Integration test suites

### External Dependencies
- `@pgsql/parser` - PostgreSQL parsing for all versions
- `@pgsql/deparser` - PostgreSQL deparsing (PG17)
- Runtime schemas for each PostgreSQL version
- Type definitions for PostgreSQL AST nodes
