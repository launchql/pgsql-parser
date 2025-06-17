# Runtime Schema Generator

This module provides runtime schema generation for PostgreSQL AST nodes based on protobuf definitions.

## Overview

The runtime schema system extracts metadata from protobuf definitions to create a comprehensive schema that describes:
- All AST node types and their structure
- Which types are wrapped (listed in Node.oneof)
- Field specifications including type, optionality, and array status
- Node field detection for AST references

## Usage

### Basic Usage

```typescript
import { RuntimeSchemaGenerator } from './generator';
import { NodeSpec } from './types';

const generator = new RuntimeSchemaGenerator(protoRoot);
const nodeSpecs: NodeSpec[] = generator.generateNodeSpecs();
```

### Integration with Parser

```typescript
import { PgProtoParser } from '../parser';

const options = {
  outDir: './output',
  runtimeSchema: {
    enabled: true,
    filename: 'ast-schema',
    format: 'json' // or 'typescript'
  }
};

const parser = new PgProtoParser('./proto/pg_query.proto', options);
parser.write();
```

## Generated Schema Structure

### NodeSpec

Each AST node type is represented by a NodeSpec:

```typescript
interface NodeSpec {
  name: string;        // e.g. "CreateStmt"
  wrapped: boolean;    // true if listed in Node.oneof
  fields: FieldSpec[]; // all fields for this type
}
```

### FieldSpec

Each field within a node is represented by a FieldSpec:

```typescript
interface FieldSpec {
  name: string;        // field name
  type: string;        // field type (e.g. "RangeVar", "string", "Node")
  isNode: boolean;     // true if field references AST nodes
  isArray: boolean;    // true if field is repeated
  optional: boolean;   // true if field is optional
}
```

## CLI Tool

A CLI tool is available for generating runtime schemas:

```bash
pg-proto-parser runtime-schema --inFile <proto-file> --outDir <output-directory>
```

For more options, see the CLI documentation or run:
```bash
pg-proto-parser runtime-schema --help
```

## Applications

The runtime schema enables:
- Dynamic AST validation
- Automated deparser generation
- GUI tools for AST manipulation
- Runtime type introspection
- Advanced code analysis tools
