# pg-proto-parser

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
import { ProtoStore } from 'pg-proto-parser';

// Load your protobuf definitions into a Root object
const root = Root.fromJSON(/* your protobuf JSON */);

// Create an instance of ProtoStore with the loaded root
const protoStore = new ProtoStore(root, 'outputDir');

// Generate TypeScript and JSON files
protoStore.write();
```

This will generate the following files in the specified `outputDir`:

- `enums2int.json`: JSON mapping of enum names to integer values.
- `enums2str.json`: JSON mapping of integer values to enum names.
- `types.ts`: TypeScript file containing interfaces for protobuf messages.
- `utils.ts`: TypeScript file containing utility functions for enums.

## Configuration

You can configure `pg-proto-parser` by passing different parameters to the `ProtoStore` constructor:

- `root`: The protobuf `Root` object containing your schema.
- `outputDir`: Directory where the generated files will be saved.

## Contributing

Contributions to `pg-proto-parser` are welcome. Please ensure that your code adheres to the project's coding standards and includes tests covering your changes.

## Related

- [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A node.js PostgreSQL parser/deparser that interprets and converts PostgresSQL syntax.
- [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.

