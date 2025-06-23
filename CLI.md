# CLI Consolidation Plan

## Overview

Consolidate all CLI functionality from `@launchql/proto-cli`, `pgsql-parser`, and add deparser capabilities into a unified `@pgsql/cli` package.

## Current State

### 1. `@launchql/proto-cli` (packages/cli)
- **Binary**: `pg-proto-parser`
- **Commands**:
  - `codegen`: Generate TypeScript from protobuf files
  - `protogen`: Download and process proto files
  - `runtime-schema`: Generate runtime schema for AST nodes
- **Dependencies**: Uses `inquirerer` for interactive CLI, `minimist` for arg parsing

### 2. `pgsql-parser` (packages/parser)
- **Binary**: `pgsql-parser`
- **Functionality**: Parse SQL files and output JSON AST
- **Options**: 
  - `--pl`: Parse PL/pgSQL functions only
- **Dependencies**: Uses `minimist` directly in cli.js

### 3. `deparser` (packages/deparser)
- **No CLI**: Currently no CLI interface
- **Functionality**: Convert AST back to SQL

## New CLI Structure: `@pgsql/cli`

### Package Changes

1. **Rename**: `@launchql/proto-cli` → `@pgsql/cli`
2. **Binary**: `pgsql` (shorter, cleaner)
3. **Remove minimist** from parser and deparser packages
4. **Centralize** all CLI logic in the cli package

### Command Structure

```
pgsql <command> [options]

Commands:
  parse         Parse SQL to AST
  deparse       Convert AST to SQL
  proto-gen     Generate TypeScript from protobuf (formerly codegen)
  proto-fetch   Download and process proto files (formerly protogen)
  runtime-schema Generate runtime schema for AST nodes

Global Options:
  -h, --help    Show help
  -v, --version Show version
```

### Command Details

#### 1. `pgsql parse`
```bash
pgsql parse <sqlfile> [options]

Options:
  -o, --output <file>    Output to file instead of stdout
  -f, --format <format>  Output format: json, pretty (default: pretty)
  --pl                   Parse as PL/pgSQL function only
  --clean                Clean the AST tree (remove location info)
  -h, --help            Show help
```

#### 2. `pgsql deparse`
```bash
pgsql deparse <jsonfile> [options]

Options:
  -o, --output <file>    Output to file instead of stdout
  -i, --input <file>     Input JSON file (or use stdin)
  --format <format>      SQL formatting options
  -h, --help            Show help
```

#### 3. `pgsql proto-gen`
```bash
pgsql proto-gen --inFile <proto> --outDir <dir> [options]

Options:
  --inFile <file>        Input .proto file (required)
  --outDir <dir>         Output directory (required)
  --enums                Generate TypeScript enums
  --enums-json           Generate JSON enum mappings
  --types                Generate TypeScript interfaces
  --utils                Generate utility functions
  --ast-helpers          Generate AST helper methods
  --wrapped-helpers      Generate wrapped AST helpers
  --optional             Make all fields optional
  --keep-case            Keep original field casing
  --remove-undefined     Remove UNDEFINED enum at position 0
  -h, --help            Show help
```

#### 4. `pgsql proto-fetch`
```bash
pgsql proto-fetch [options]

Options:
  --url <url>            Proto file URL to download
  --inFile <file>        Where to save the proto file
  --outFile <file>       Generated JS output file
  --replace-pkg <old>    Original package name to replace
  --with-pkg <new>       New package name
  -h, --help            Show help
```

#### 5. `pgsql runtime-schema`
```bash
pgsql runtime-schema --inFile <proto> --outDir <dir> [options]

Options:
  --inFile <file>        Input .proto file (required)
  --outDir <dir>         Output directory (required)
  --format <format>      Output format: json, typescript (default: json)
  --filename <name>      Output filename (default: runtime-schema)
  -h, --help            Show help
```

## Implementation Steps

### Phase 1: Setup New Package
1. Copy `packages/cli` to new location (keep history)
2. Update package.json:
   - Name: `@pgsql/cli`
   - Binary: `pgsql`
   - Update dependencies
3. Remove `minimist` dependency from parser/deparser packages

### Phase 2: Implement Core Commands
1. Create new command structure without `inquirerer` for non-interactive mode
2. Implement `parse` command:
   - Move logic from parser/src/cli.js
   - Add output options
   - Add format options
3. Implement `deparse` command:
   - Import deparser functionality
   - Add file I/O handling
   - Add formatting options

### Phase 3: Refactor Proto Commands
1. Rename `codegen` → `proto-gen`
2. Rename `protogen` → `proto-fetch`
3. Update command options to use consistent naming
4. Add new options for wrapped helpers

### Phase 4: Improve Help System
1. Create detailed help for each command
2. Add examples to help text
3. Create man page style documentation

### Phase 5: Testing & Documentation
1. Add comprehensive tests for all commands
2. Update README with new command structure
3. Create migration guide from old CLIs
4. Add shell completion scripts

## Benefits

1. **Single Entry Point**: One CLI tool for all PostgreSQL AST operations
2. **Consistent Interface**: Unified command structure and options
3. **Better Discoverability**: Clear command hierarchy with good help
4. **Reduced Dependencies**: Remove minimist from individual packages
5. **Extensibility**: Easy to add new commands in the future

## Migration Guide

### For `pgsql-parser` users:
```bash
# Old
pgsql-parser file.sql

# New
pgsql parse file.sql
```

### For `pg-proto-parser` users:
```bash
# Old
pg-proto-parser codegen --inFile pg_query.proto --outDir out

# New
pgsql proto-gen --inFile pg_query.proto --outDir out
```

## Future Enhancements

1. **Interactive Mode**: Keep inquirerer for interactive command selection
2. **Config Files**: Support `.pgsqlrc` configuration files
3. **Plugins**: Allow extending with custom commands
4. **Watch Mode**: Auto-regenerate on file changes
5. **Batch Processing**: Process multiple files at once