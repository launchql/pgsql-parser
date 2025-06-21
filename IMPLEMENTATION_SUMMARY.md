# Implementation Summary: Unidirectional Enum Conversion Functions

## What Was Implemented

### 1. New Functions in `src/ast/enums/enums.ts`

- **`generateEnumToIntFunctions`**: Generates a function that converts enum string values to integers
  - Function name: `getEnumInt`
  - Signature: `(enumType: EnumType, key: string): number`
  - Returns typed number values

- **`generateEnumToStringFunctions`**: Generates a function that converts enum integer values to strings
  - Function name: `getEnumString`
  - Signature: `(enumType: EnumType, key: number): string`
  - Returns typed string values

### 2. Configuration Options

Added new options to `PgProtoStoreOptions`:

```typescript
utils: {
  enums: {
    enabled: boolean;           // Default: false
    filename: string;           // Default: 'utils.ts'
    unidirectional?: boolean;   // Default: false (NEW)
    toIntFilename?: string;     // Default: 'enum-to-int.ts' (NEW)
    toStringFilename?: string;  // Default: 'enum-to-string.ts' (NEW)
  }
}
```

### 3. Store Logic Updates

Modified `writeUtilsEnums()` in `store.ts` to:
- Check the `unidirectional` flag
- Generate separate files for each direction when enabled
- Maintain backward compatibility with bidirectional generation

### 4. Key Benefits

1. **Cleaner Types**: Each function has a precise signature (string → number or number → string)
2. **Better IDE Support**: More accurate IntelliSense and autocomplete
3. **Tree-Shaking**: Applications can import only the direction they need
4. **Performance**: No runtime type checking for the input parameter type

### 5. Usage Examples

#### Configuration
```typescript
// Enable unidirectional functions
{
  utils: {
    enums: {
      enabled: true,
      unidirectional: true,
      toIntFilename: 'enum-to-int.ts',
      toStringFilename: 'enum-to-string.ts'
    }
  }
}
```

#### Generated Code Usage
```typescript
import { getEnumInt } from './enum-to-int';
import { getEnumString } from './enum-to-string';

// Convert string to number
const value = getEnumInt("OverridingKind", "OVERRIDING_USER_VALUE"); // Returns: 1

// Convert number to string  
const name = getEnumString("OverridingKind", 1); // Returns: "OVERRIDING_USER_VALUE"
```

### 6. Testing

Added comprehensive tests in `__tests__/enum-utils.test.ts` covering:
- Bidirectional generation (default behavior)
- Unidirectional generation
- Custom filenames
- Explicit bidirectional mode

All tests pass and generate appropriate snapshots.