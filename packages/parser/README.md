# pg-proto-parser

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/launchql/pg-proto-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pg-proto-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/launchql/pg-proto-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://github.com/launchql/pg-proto-parser/blob/main/LICENSE-Apache"><img height="20" src="https://img.shields.io/badge/license-Apache-blue.svg"></a>
</p>


`pg-proto-parser` is a TypeScript project that parses [pganalyze/libpg_query](https://github.com/pganalyze/libpg_query) PostgreSQL Protocol Buffers (protobuf) definitions and generates TypeScript interfaces, utility functions, and JSON mappings for the enums defined in the protobuf schema. Designed to work with [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser) for maintainable upgrades.

## Features

- Parses protobuf definitions and creates a structured representation in TypeScript.
- Generates TypeScript interfaces for protobuf messages.
- Creates utility functions for enum value conversions.
- Produces JSON files mapping enum names to integer values and vice versa

## Parsing and Generating Files

Here's how to parse protobuf files and generate the output:

```js
import { PgProtoParser } from 'pg-proto-parser';

// Create PgProtoParser
const parser = new PgProtoParser(inFile, { outDir });

// Generate TypeScript and JSON files
await parser.write();
```

This will generate the following files in the specified [`outDir`](https://github.com/launchql/pg-proto-parser/tree/main/__fixtures__/output/parser):

- [`types.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/types.ts): TypeScript file containing interfaces for protobuf messages.
- [`enums.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/enums.ts): TypeScript file containing enums for protobuf messages.
- [`asts.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/asts.ts): TypeScript file containing helpers to create PostgreSQL ASTs.
- [`utils.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/utils.ts): TypeScript file containing utility functions for enums.
- [`enums2int.json`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/enums2int.json): JSON mapping of enum names to integer values.
- [`enums2str.json`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/parser/enums2str.json): JSON mapping of integer values to enum names.

## Configuration

You can configure `pg-proto-parser` by passing different parameters to the `ProtoStore` constructor:

- `root`: The protobuf `Root` object containing your schema.
- `options`: Options defined as `PgProtoParserOptions` (see below)

## Options

This table describes the options available for `PgProtoParserOptions`, their functionality, and default values.

| Option                        | Description                                                                                                                     | Default Value            |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| `includeAstHelpers`          | Outputs TypeScript helpers for building PostgreSQL ASTs enums.                                                                  | `true`                   |
| `includeEnums`                | Outputs TypeScript enum types for the PostgreSQL enums.                                                                         | `true`                   |
| `includeEnumsJSON`            | Whether to generate JSON files mapping enum names to integer values and vice versa.                                             | `true`                   |
| `includeEnumTypeUnion`        | Uses strings to define enum types as specified for the fields of each proto message type (the PostgreSQL node types' fields type). | `true`                  |
| `includeHeader`               | Includes a header at the top of generated TypeScript files to avoid manual manipulation which could cause issues in CI/CD pipelines. | `true`                |
| `includeTypes`                | Whether to generate TypeScript interfaces for protobuf messages.                                                                | `true`                   |
| `includeUtils`                | Whether to generate TypeScript utility functions for enums.                                                                     | `true`                   |
| `optionalFields`              | Generates TypeScript interfaces with optional fields mapping to the PostgreSQL node types' fields; sets all fields to optional. | `true`                   |
| `outDir`                      | The directory where the generated files will be saved.                                                                          | `process.cwd() + "/out"` |
| `parser.alternateCommentMode` | Use alternate comment mode. Useful if the default parsing of comments is problematic.                                          | `true`                   |
| `parser.keepCase`             | Keeps field casing as defined in the protobuf file. If false, fields will be converted to camelCase.                           | `true`                   |
| `parser.preferTrailingComment`| Give preference to trailing comments during parsing.                                                                           | `false`                  |
| `removeUndefinedAt0`          | Removes the initial `UNDEFINED` enum entry and adjusts the subsequent values by decrementing them.                             | `true`                   |

Each of these options can be set when initializing the `PgProtoParser` to customize its behavior and output.

## Related

* [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A node.js PostgreSQL parser/deparser that interprets and converts PostgresSQL syntax.
* [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.