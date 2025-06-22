# AST Code Generation Methods Documentation

This document describes the various code generation methods in the proto-parser package, explaining what each method generates and how they're used in the parsing pipeline.

## Overview

The proto-parser package processes protobuf definitions and generates TypeScript code for working with PostgreSQL AST nodes. The main entry point is the `ProtoStore` class in `src/store.ts`, which orchestrates the code generation process.

## Type Generation Methods (`src/ast/types/types.ts`)

### `generateTypeImports(types, source, suffix?)`
- **Purpose**: Generates import statements for types from a specified source module
- **Output**: `import { Type1, Type2 } from './source'` or with suffix: `import { Type1 as Type1Suffix } from './source'`
- **Used in**: Importing types into other generated files

### `generateAstHelperMethods(types)`
- **Purpose**: Creates factory functions for instantiating AST nodes that return the type directly
- **Output**: An object with camelCase methods for each type
- **Example**:
  ```typescript
  export default {
    selectStmt: (_p?: SelectStmt) => SelectStmt,
    insertStmt: (_p?: InsertStmt) => InsertStmt
  }
  ```
- **Used in**: `asts.ts` file generation (when `utils.astHelpers.enabled` is true)

### `generateWrappedAstHelperMethods(types)`
- **Purpose**: Creates factory functions that return AST nodes wrapped in type-specific objects
- **Output**: An object with camelCase methods that return wrapped types
- **Example**:
  ```typescript
  export default {
    selectStmt: (_p?: SelectStmt) => { SelectStmt: SelectStmt },
    insertStmt: (_p?: InsertStmt) => { InsertStmt: InsertStmt }
  }
  ```
- **Used in**: `wrapped-asts.ts` file generation (when `utils.wrappedAstHelpers.enabled` is true)

### `generateNodeUnionType(options, types)`
- **Purpose**: Creates a union type of all AST node types
- **Output**: 
  - Simple: `export type Node = SelectStmt | InsertStmt | ...`
  - Wrapped: `export type Node = { SelectStmt: SelectStmt } | { InsertStmt: InsertStmt } | ...`
- **Used in**: `types.ts` file generation

### `convertTypeToTsInterface(type, options)`
- **Purpose**: Converts protobuf Type definitions to TypeScript interfaces
- **Output**: 
  ```typescript
  export interface SelectStmt {
    targetList?: Node[];
    fromClause?: Node[];
    // ... other fields
  }
  ```
- **Used in**: `types.ts` file generation

### `generateTypeImportSpecifiers(types, options)`
- **Purpose**: Creates import specifiers for types from configured source
- **Output**: `import { SelectStmt, InsertStmt, ... } from './types'`
- **Used in**: `ast-helpers.ts` to import type definitions

## Enum Generation Methods

### Core Enum Methods (`src/ast/enums/enums.ts`)

### `convertEnumToTsEnumDeclaration(enumData)`
- **Purpose**: Converts protobuf enums to TypeScript enum declarations
- **Output**: 
  ```typescript
  export enum MyEnum {
    VALUE1 = 0,
    VALUE2 = 1
  }
  ```
- **Used in**: `enums.ts` file generation (when not using union types)

### `convertEnumToTsUnionType(enumData)`
- **Purpose**: Converts protobuf enums to TypeScript union types
- **Output**: `export type MyEnum = 'VALUE1' | 'VALUE2' | ...`
- **Used in**: `enums.ts` file generation (when `enumsAsTypeUnion` is true)

### `generateEnumImports(enums, source)`
- **Purpose**: Generates import statements for enums
- **Output**: `import { Enum1, Enum2 } from './enums'`
- **Used in**: Importing enums into `types.ts`

### `generateEnumValueFunctions(enumData)`
- **Purpose**: Creates bidirectional enum converter function
- **Output**: 
  ```typescript
  export const getEnumValue = (enumType: EnumType, key: string | number) => {
    // Returns number for string input, string for number input
  }
  ```
- **Used in**: `utils/enums.ts` (bidirectional mode)

### `generateEnumToIntFunctions(enumData)`
- **Purpose**: Creates function to convert enum strings to numbers
- **Output**: `export const getEnumInt = (enumType: EnumType, key: string): number => { ... }`
- **Used in**: `utils/enums-to-int.ts` (unidirectional mode)

### `generateEnumToStringFunctions(enumData)`
- **Purpose**: Creates function to convert enum numbers to strings
- **Output**: `export const getEnumString = (enumType: EnumType, key: number): string => { ... }`
- **Used in**: `utils/enums-to-str.ts` (unidirectional mode)

### `generateEnumToIntFunctionsNested(enumData)`
- **Purpose**: Creates nested object with individual enum converters
- **Output**: 
  ```typescript
  export const enumToIntMap = {
    MyEnum: (key: string) => number,
    OtherEnum: (key: string) => number
  }
  ```
- **Used in**: `utils/enums-to-int.ts` (nested object format)

### `generateEnumToStringFunctionsNested(enumData)`
- **Purpose**: Creates nested object for number-to-string conversion
- **Output**: 
  ```typescript
  export const enumToStringMap = {
    MyEnum: (value: number) => string,
    OtherEnum: (value: number) => string
  }
  ```
- **Used in**: `utils/enums-to-str.ts` (nested object format)

### JSON Generation Methods (`src/ast/enums/enums-json.ts`)

### `generateEnum2StrJSON(enums)`
- **Purpose**: Creates JSON mapping from enum values to names
- **Output**: 
  ```json
  {
    "MyEnum": {
      "0": "VALUE1",
      "1": "VALUE2"
    }
  }
  ```
- **Used in**: `writeEnumMaps()` for generating enum mapping files

### `generateEnum2IntJSON(enums)`
- **Purpose**: Creates JSON mapping from enum names to values
- **Output**: 
  ```json
  {
    "MyEnum": {
      "VALUE1": 0,
      "VALUE2": 1
    }
  }
  ```
- **Used in**: `writeEnumMaps()` for generating enum mapping files

## Type Resolution Utilities (`src/ast/types/utils.ts`)

### `getTSType(type)`
- **Purpose**: Maps protobuf primitive types to TypeScript types
- **Mappings**:
  - `string` → `string`
  - `double`, `float`, `int32`, etc. → `number`
  - `int64`, `uint64`, etc. → `bigint`
  - `bytes` → `Uint8Array`
  - `bool` → `boolean`
  - Custom types → Type reference

### `resolveTypeName(type)`
- **Purpose**: Main entry point for type resolution
- **Logic**: Uses `getTSType` for primitives, creates type references for custom types

## Code Generation Flow

1. **Parse Phase** (`ProtoStore._parse`)
   - Processes protobuf definitions
   - Collects types, enums, and services
   - Handles enum value transformations (e.g., removing UNDEFINED at 0)

2. **Write Phase** (`ProtoStore.write`)
   - `writeEnumMaps()`: Generates JSON or TypeScript enum mapping files
   - `writeTypes()`: Generates TypeScript interfaces for all types
   - `writeEnums()`: Generates enum declarations or union types
   - `writeUtilsEnums()`: Generates enum utility functions
   - `writeAstHelpers()`: Generates AST node factory functions
   - `writeRuntimeSchema()`: Generates runtime schema information

## Configuration Options

The generation behavior is controlled by options in `PgProtoStoreOptions`:

- `types.enabled`: Enable type generation
- `types.optionalFields`: Make all fields optional
- `types.wrappedNodeTypeExport`: Use wrapped object format for Node union
- `enums.enabled`: Enable enum generation
- `enums.enumsAsTypeUnion`: Generate union types instead of enums
- `enums.removeUndefinedAt0`: Remove UNDEFINED enum value at position 0
- `utils.enums.unidirectional`: Generate separate to-int and to-string functions
- `utils.enums.outputFormat`: Use 'nestedObjects' for better type safety
- `utils.astHelpers.enabled`: Generate AST helper methods in `asts.ts`
- `utils.wrappedAstHelpers.enabled`: Generate wrapped AST helper methods in `wrapped-asts.ts`

## Output Files

Based on configuration, the following files are typically generated:

- `types.ts`: TypeScript interfaces for all AST node types
- `enums.ts`: Enum declarations or union types
- `utils/enums.ts`: Bidirectional enum converter (or separate files for unidirectional)
- `asts.ts`: AST helper methods that return type instances directly
- `wrapped-asts.ts`: AST helper methods that return `{ TypeName: instance }`
- `utils/ast-helpers.ts`: Factory functions for creating AST nodes
- `enums-map-to-int.json/ts`: Enum to integer mappings
- `enums-map-to-str.json/ts`: Integer to enum string mappings