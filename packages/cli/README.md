# @launchql/proto-cli

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

`@launchql/proto-cli` is a command-line interface to facilitate the parsing of [pganalyze/libpg_query](https://github.com/pganalyze/libpg_query) PostgreSQL query protobufs into structured TypeScript definitions and utilities. Designed to work with [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser) for maintainable upgrades.

## Installation

```bash
npm install -g @launchql/proto-cli
```

## Getting Started

First, download the latest protobuf definition from `libpg_query`:

```bash
wget https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
```


Run the CLI to parse the protobuf file and generate TypeScript outputs:

```bash
pg-proto-parser --inFile pg_query.proto --outDir out
```


## Features

- Converts PostgreSQL protobuf files to TypeScript definitions.
- Automatically generates enums, interfaces, and utility functions from protobufs.
- Supports custom output directories for generated files.


## Usage

After installation, you can run the `pg-proto-parser` command for code generation as follows:

### codegen

```bash
pg-proto-parser codegen --inFile <path-to-proto> --outDir <output-directory> \
                        [--enums] [--enumsJSON] [--typeUnion] \
                        [--header] [--types] [--utils] \
                        [--case] [--optional] [--removeUndefined]
```

#### Options for codegen

| Option              | Description                                                                                                               | Default Value |
|---------------------|---------------------------------------------------------------------------------------------------------------------------|---------------|
| `--inFile`          | Path to the `.proto` file to be parsed.                                                                                   | *Required*    |
| `--outDir`          | Directory to save the generated TypeScript files.                                                                         | *Required*    |
| `--enums`           | Generate TypeScript enum types for PostgreSQL enums.                                                                      | `false`       |
| `--enumsJSON`       | Generate JSON files mapping enum names to values.                                                                         | `false`       |
| `--typeUnion`       | Generate TypeScript unions from enum types.                                                                               | `false`       |
| `--header`          | Include a header in the generated TypeScript files to aid in integration.                                                 | `false`       |
| `--types`           | Generate TypeScript interfaces for protobuf messages.                                                                     | `false`       |
| `--utils`           | Generate TypeScript utility functions for enums.                                                                          | `false`       |
| `--case`            | Keep field casing as defined in the protobuf file. If false, fields will be converted to camelCase.                       | `false`       |
| `--optional`        | Generate TypeScript interfaces with optional fields.                                                                      | `false`       |
| `--removeUndefined` | Remove the 'UNDEFINED' enum entry if it exists.                                                                           | `false`       |
| `--help`, `-h`      | Show this help message and exit.                                                                                          |               |
| `--version`, `-v`   | Show the version number and exit.                                                                                         |               |

To explicitly set a boolean option to false, prepend the option with `--no-`. For example, to disable JSON enum mapping, use `--no-enumsJSON`.

### protogen

You can also generate code using the `protogen` command:

```bash
pg-proto-parser protogen --protoUrl <URL to proto file> \
                         --inFile <path to proto file> \
                         --outFile <path to output JS file> \
                         --originalPackageName <original package name> \
                         --newPackageName <new package name>
```

#### Options for protogen

| Option                  | Description                                                                         | Default Value |
|-------------------------|-------------------------------------------------------------------------------------|---------------|
| `--protoUrl`            | Full URL to download the proto file (optional).                                     |               |
| `--inFile`              | Path where the proto file will be saved or path to an existing proto file.          | *Required*    |
| `--outFile`             | Path where the generated JavaScript file will be saved.                             | *Required*    |
| `--originalPackageName` | Original package name to be replaced in the JS file.                                | protobufjs/minimal |
| `--newPackageName`      | New package name to replace in the JS file.                                         | @launchql/protobufjs/minimal |
| `--help`, `-h`          | Show this help message.                                                             |               |
| `--version`, `-v`       | Show the version number.                                                            |               |

### runtime-schema

Generate runtime schema for PostgreSQL AST nodes:

```bash
pg-proto-parser runtime-schema --inFile <path-to-proto> --outDir <output-directory> \
                               [--format <json|typescript>] [--filename <filename>]
```

#### Options for runtime-schema

| Option              | Description                                                                         | Default Value |
|---------------------|-------------------------------------------------------------------------------------|---------------|
| `--inFile`          | Path to the `.proto` file to be parsed.                                             | *Required*    |
| `--outDir`          | Directory to save the generated runtime schema files.                               | *Required*    |
| `--format`          | Output format for runtime schema ('json' or 'typescript').                          | `json`        |
| `--filename`        | Filename for the runtime schema file (without extension).                           | `runtime-schema` |
| `--help`, `-h`      | Show this help message and exit.                                                   |               |
| `--version`, `-v`   | Show the version number and exit.                                                  |               |


## Related

* [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A node.js PostgreSQL parser/deparser that interprets and converts PostgresSQL syntax.
* [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.

