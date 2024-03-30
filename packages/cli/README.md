# @launchql/proto-cli

<p align="center" width="100%">
  <a href="https://github.com/launchql/pg-proto-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pg-proto-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/launchql/pg-proto-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://github.com/launchql/pg-proto-parser/blob/main/LICENSE-Apache"><img height="20" src="https://img.shields.io/badge/license-Apache-blue.svg"></a>
</p>

`@launchql/proto-cli` is a command-line interface to facilitate the parsing of [pganalyze/libpg_query](https://github.com/pganalyze/libpg_query) PostgreSQL query protobufs into structured TypeScript definitions and utilities.



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
pg-proto-parser --inputFile pg_query.proto --outputDir out
```


## Features

- Converts PostgreSQL protobuf files to TypeScript definitions.
- Automatically generates enums, interfaces, and utility functions from protobufs.
- Supports custom output directories for generated files.


## Usage

After installation, you can run the `pg-proto-parser` command as follows:

```bash
pg-proto-parser --inputFile <path-to-proto> --outputDir <output-directory>
```

- `--inputFile`: Path to the `.proto` file to be parsed.
- `--outputDir`: Directory to save the generated TypeScript files.


## Related

- [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A PostgreSQL parser that interprets and converts SQL syntax into a structured format.
- [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.

