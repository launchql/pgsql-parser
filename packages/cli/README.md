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
npm install -g @lauchql/proto-cli
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

After installation, you can run the `pg-proto-parser` command as follows:

```bash
pg-proto-parser --inFile <path-to-proto> --outDir <output-directory>
```

- `--inFile`: Path to the `.proto` file to be parsed.
- `--outDir`: Directory to save the generated TypeScript files.

## Options

```bash
pg-proto-parser --inFile <path-to-proto> \
                --outDir <output-directory> \
                [--alternateCommentMode] \
                [--includeEnums] \
                [--includeEnumsJSON] \
                [--includeEnumTypeUnion] \
                [--includeHeader] \
                [--includeTypes] \
                [--includeUtils] \
                [--keepCase] \
                [--optionalFields] \
                [--preferTrailingComment] \
                [--removeUndefinedAt0]

```

| Option                        | Description                                                                                                                     | Default Value            |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| `--inFile`                    | Path to the `.proto` file to be parsed.                                                                                         | *Required*               |
| `--outDir`                    | Directory to save the generated TypeScript files.                                                                               | *Required*               |
| `--alternateCommentMode`      | Use alternate comment mode. Useful if the default parsing of comments is problematic.                                           | `true`                   |
| `--includeEnums`              | Outputs TypeScript enum types for the PostgreSQL enums.                                                                         | `true`                   |
| `--includeEnumsJSON`          | Generate JSON files mapping enum names to integer values and vice versa.                                                        | `true`                   |
| `--includeEnumTypeUnion`      | Uses strings to define enum types as specified for the fields of each proto message type (the PostgreSQL node types' fields type). | `true`                  |
| `--includeHeader`             | Includes a header at the top of generated TypeScript files to avoid manual manipulation which could cause issues in CI/CD pipelines. | `true`                |
| `--includeTypes`              | Generate TypeScript interfaces for protobuf messages.                                                                           | `true`                   |
| `--includeUtils`              | Generate TypeScript utility functions for enums.                                                                                | `true`                   |
| `--keepCase`                  | Keeps field casing as defined in the protobuf file. If false, fields will be converted to camelCase.                           | `true`                   |
| `--optionalFields`            | Generates TypeScript interfaces with optional fields mapping to the PostgreSQL node types' fields; sets all fields to optional. | `true`                   |
| `--preferTrailingComment`     | Give preference to trailing comments during parsing.                                                                            | `false`                  |
| `--removeUndefinedAt0`        | Removes the initial `UNDEFINED` enum entry and adjusts the subsequent values by decrementing them.                             | `true`                   |


To explicitly set a boolean option to false, prepend the option with `--no-`. For example, to disable JSON enum mapping, use `--no-includeEnumsJSON`.

Note: Boolean flags default to true when specified without a value. To set them to false, use the no- prefix (e.g., `--no-includeEnumsJSON` will set `includeEnumsJSON` to false).

## Related

* [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A node.js PostgreSQL parser/deparser that interprets and converts PostgresSQL syntax.
* [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A utility library for working with PostgreSQL AST node enumerations in a type-safe way, easing enum name and value conversions.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.

