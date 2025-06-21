# Wrapped Type System Refactoring Summary

## Overview
Successfully refactored the wrapped type system in pg-proto-parser to simplify the codebase and improve clarity.

## Changes Made

### 1. Renamed Configuration and Variables
- **options/types.ts**: Renamed `wrappedTypesSource` to `typesSource`
- **defaults.ts**: Updated default value for `typesSource` from `'./wrapped'` to `'./types'`
- **RuntimeSchemaGenerator**: 
  - Renamed `wrappedTypes` to `nodeTypes`
  - Renamed `extractWrappedTypes()` to `extractNodeTypes()`
  - Renamed `getWrappedTypes()` to `getNodeTypes()`
  - Renamed `getWrappedTypesCount()` to `getNodeTypesCount()`

### 2. Updated Runtime Schema
- **runtime-schema.ts**: Changed `wrapped: boolean` to `isNode: boolean` in:
  - `NodeSpec` interface
  - `FieldSpec` interface
  - `createNodeSpec()` function
  - `createFieldSpec()` function
  - `generateRuntimeSchemaTypeScript()` function

### 3. Removed Wrapped Type Functionality
- **store.ts**: 
  - Removed `writeWrappedTypes()` method
  - Removed `isWrappedType()` method
- **ast/types/types.ts**: Removed `convertTypeToWrappedTsInterface` function and its import
- **options/types.ts**: Removed `types.wrapped` configuration option
- **defaults.ts**: Set `wrappedNodeTypeExport` to `true` by default

### 4. Updated Documentation
- **README.md**: 
  - Removed wrapped types section
  - Updated `wrappedNodeTypeExport` default value to `true`

### 5. Updated Tests
- Removed the `wrapped` test from `types.test.ts`
- Updated test configurations to remove `wrapped` options
- Updated all test snapshots to reflect the changes from `wrapped` to `isNode`
- Updated import paths from `"./wrapped"` to `"./types"` in astHelpers

## Result
The refactoring successfully:
- Simplified the type system by removing the concept of "wrapped types"
- Renamed variables to better reflect their purpose (node types)
- Maintained backward compatibility where possible
- All tests pass successfully