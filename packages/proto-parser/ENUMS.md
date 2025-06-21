# Enum Utilities in Proto Parser

## Overview

The proto-parser package provides three enum utility generation functions:

1. **`generateEnumValueFunctions`**: Generates bidirectional enum value lookups (string ↔ number)
2. **`generateEnumToIntFunctions`**: Generates unidirectional string → number conversions
3. **`generateEnumToStringFunctions`**: Generates unidirectional number → string conversions

These utilities create runtime functions that can convert between enum string names and their numeric values with full type safety.

## Function Location

- **File**: `src/ast/enums/enums.ts`
- **Export**: Named exports from the enums module

## Function Signatures

### Bidirectional Function

```typescript
export const generateEnumValueFunctions = (enumData: Enum[]) => {
  // Returns an array of two AST nodes:
  // 1. EnumType type alias export
  // 2. getEnumValue function export
}
```

### Unidirectional Functions

```typescript
export const generateEnumToIntFunctions = (enumData: Enum[]) => {
  // Returns an array of two AST nodes:
  // 1. EnumType type alias export
  // 2. getEnumInt function export
}

export const generateEnumToStringFunctions = (enumData: Enum[]) => {
  // Returns an array of two AST nodes:
  // 1. EnumType type alias export
  // 2. getEnumString function export
}
```

## Purpose

These functions generate TypeScript utilities that provide:

1. **Flexible enum conversions**: 
   - Bidirectional: Convert between names and values in both directions
   - Unidirectional: Optimized single-direction conversions with cleaner types
2. **Type safety**: Uses a union type of all enum names for compile-time checking
3. **Runtime validation**: Throws descriptive errors for invalid inputs
4. **Better type inference**: Unidirectional functions have more precise return types

## Generated Code Structure

### 1. EnumType Type Alias

```typescript
export type EnumType = "Enum1" | "Enum2" | "Enum3" | ...;
```

A union type of all enum names in the protobuf schema, providing type safety when calling the utility function.

### 2. Generated Functions

#### Bidirectional Function (getEnumValue)

```typescript
export const getEnumValue = (enumType: EnumType, key: string | number) => {
  switch (enumType) {
    case "EnumName":
      {
        switch (key) {
          case "ENUM_VALUE_1": return 0;
          case "ENUM_VALUE_2": return 1;
          case 0: return "ENUM_VALUE_1";
          case 1: return "ENUM_VALUE_2";
          default: throw new Error("Key not recognized in enum EnumName");
        }
      }
    // ... more enum cases
    default: throw new Error("Enum type not recognized");
  }
}
```

#### String to Int Function (getEnumInt)

```typescript
export const getEnumInt = (enumType: EnumType, key: string): number => {
  switch (enumType) {
    case "EnumName":
      {
        switch (key) {
          case "ENUM_VALUE_1": return 0;
          case "ENUM_VALUE_2": return 1;
          default: throw new Error("Key not recognized in enum EnumName");
        }
      }
    // ... more enum cases
    default: throw new Error("Enum type not recognized");
  }
}
```

#### Int to String Function (getEnumString)

```typescript
export const getEnumString = (enumType: EnumType, key: number): string => {
  switch (enumType) {
    case "EnumName":
      {
        switch (key) {
          case 0: return "ENUM_VALUE_1";
          case 1: return "ENUM_VALUE_2";
          default: throw new Error("Value not recognized in enum EnumName");
        }
      }
    // ... more enum cases
    default: throw new Error("Enum type not recognized");
  }
}
```

## Implementation Details

### AST Generation Process

1. **Type Union Creation**:
   - Creates a union type of all enum names as string literals
   - Exported as `EnumType` for type-safe enum selection

2. **Function Structure**:
   - Uses nested switch statements for performance
   - Outer switch: Selects the enum by name
   - Inner switch: Performs the bidirectional lookup

3. **Bidirectional Mapping**:
   - String → Number: `case "ENUM_VALUE": return numericValue;`
   - Number → String: `case numericValue: return "ENUM_VALUE";`

4. **Error Handling**:
   - Throws specific errors for unrecognized enum types
   - Throws specific errors for unrecognized keys within an enum

### Code Generation Using Babel AST

The function uses Babel's AST builders to construct the code:

```typescript
// Type alias creation
const enumTypeUnion = t.tsUnionType(
  enumData.map(enumDef => t.tsLiteralType(t.stringLiteral(enumDef.name)))
);

// Function parameter with type annotation
const enumTypeParam = t.identifier('enumType');
enumTypeParam.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(enumTypeIdentifier));

// Switch case generation
const outerCases = enumData.map(enumDef => {
  const innerCases = Object.entries(enumDef.values).map(([key, value]) => {
    // Forward mapping (string to number)
    return t.switchCase(t.stringLiteral(key), [t.returnStatement(t.numericLiteral(value))]);
  });
  
  // Reverse mapping (number to string)
  innerCases.push(...Object.entries(enumDef.values).map(([key, value]) => {
    return t.switchCase(t.numericLiteral(value), [t.returnStatement(t.stringLiteral(key))]);
  }));
  
  // ... error handling
});
```

## Usage Configuration

The enum utilities are controlled by the following configuration:

```typescript
utils: {
  enums: {
    enabled: boolean;           // Default: false
    filename: string;           // Default: 'utils.ts'
    unidirectional?: boolean;   // Default: false
    toIntFilename?: string;     // Default: 'enum-to-int.ts'
    toStringFilename?: string;  // Default: 'enum-to-string.ts'
  }
}
```

### Configuration Examples

#### Bidirectional Functions (Default)

```typescript
const options = {
  utils: {
    enums: {
      enabled: true,
      filename: 'enum-utils.ts'
    }
  }
};
```

#### Unidirectional Functions

```typescript
const options = {
  utils: {
    enums: {
      enabled: true,
      unidirectional: true,
      toIntFilename: 'enums-to-int.ts',
      toStringFilename: 'enums-to-string.ts'
    }
  }
};
```

## Generated File Example

When enabled, the function generates a file (default: `utils.ts`) containing:

```typescript
/**
* This file was automatically generated by pg-proto-parser@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source proto file,
* and run the pg-proto-parser generate command to regenerate this file.
*/

export type EnumType = "OverridingKind" | "QuerySource" | "SortByDir" | ...;

export const getEnumValue = (enumType: EnumType, key: string | number) => {
  switch (enumType) {
    case "OverridingKind":
      {
        switch (key) {
          case "OVERRIDING_NOT_SET": return 0;
          case "OVERRIDING_USER_VALUE": return 1;
          case "OVERRIDING_SYSTEM_VALUE": return 2;
          case 0: return "OVERRIDING_NOT_SET";
          case 1: return "OVERRIDING_USER_VALUE";
          case 2: return "OVERRIDING_SYSTEM_VALUE";
          default: throw new Error("Key not recognized in enum OverridingKind");
        }
      }
    // ... more cases
  }
}
```

## Use Cases

### 1. Dynamic Enum Value Resolution

#### Bidirectional Function
```typescript
// Get numeric value from string
const value = getEnumValue("OverridingKind", "OVERRIDING_USER_VALUE"); // Returns: 1

// Get string from numeric value
const name = getEnumValue("OverridingKind", 1); // Returns: "OVERRIDING_USER_VALUE"
```

#### Unidirectional Functions
```typescript
// String to number conversion with precise types
const value: number = getEnumInt("OverridingKind", "OVERRIDING_USER_VALUE"); // Returns: 1

// Number to string conversion with precise types
const name: string = getEnumString("OverridingKind", 1); // Returns: "OVERRIDING_USER_VALUE"
```

### 2. Type-Safe Enum Operations

```typescript
// TypeScript will enforce valid enum names
getEnumInt("InvalidEnum", "VALUE"); // Type error!

// Runtime validation for values
getEnumInt("OverridingKind", "INVALID_VALUE"); // Throws: "Key not recognized in enum OverridingKind"
getEnumString("OverridingKind", 999); // Throws: "Value not recognized in enum OverridingKind"
```

### 3. Protocol Message Parsing

Useful when parsing protocol buffer messages where you need to convert between wire format (numbers) and readable format (strings).

### 4. Benefits of Unidirectional Functions

1. **Cleaner Types**: Function signatures are more precise (string → number or number → string)
2. **Better IntelliSense**: IDEs can provide better autocomplete and type hints
3. **Smaller Bundle Size**: When using tree-shaking, you only include the direction you need
4. **Performance**: Slightly faster as there's no runtime type checking for the input parameter

## Performance Considerations

1. **Switch Statement Optimization**: Modern JavaScript engines optimize switch statements well, making this approach efficient
2. **No Object Allocation**: The function doesn't create intermediate objects, reducing memory pressure
3. **Direct Returns**: Each case immediately returns, avoiding unnecessary computation

## Integration with Other Features

The enum utilities work alongside:

1. **Enum Declarations**: Regular TypeScript enum exports (`enums.ts`)
2. **Enum Maps**: JSON/TypeScript enum mapping files (`enumMap` feature)
3. **Type Definitions**: Interface definitions that use the enums

## Best Practices

1. **Enable When Needed**: Only enable if you need runtime enum conversions
2. **Import Selectively**: Import only the `getEnumValue` function where needed
3. **Type Safety**: Always use the `EnumType` type for the first parameter
4. **Error Handling**: Wrap calls in try-catch if handling untrusted input

## Limitations

1. **File Size**: For schemas with many enums, the generated file can be large (4000+ lines)
2. **No Partial Generation**: Currently generates utilities for all enums, not selectively
3. **No Custom Names**: The function is always named `getEnumValue`

## Future Enhancements

Potential improvements could include:

1. **Selective Generation**: Generate utilities only for specified enums
2. **Multiple Output Files**: Split large utility files
3. **Custom Function Names**: Allow configuration of the generated function name
4. **Tree Shaking**: Better support for dead code elimination
5. **Enum Filtering**: Option to exclude certain enums from utility generation