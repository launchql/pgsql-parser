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

This will generate the following files in the specified `outDir`:

- [`types.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/types/optionalFields/types.ts): TypeScript file containing interfaces for protobuf messages.
- [`enums.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/enums/pure/removeUndef/enums.ts): TypeScript file containing enums for protobuf messages.
- [`asts.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/utils/astHelpers/inlineNestedObj/asts.ts): TypeScript file containing helpers to create PostgreSQL ASTs.
- [`utils.ts`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/utils/astHelpers/inlineNestedObj/utils.ts): TypeScript file containing utility functions for enums.
- [`enums2int.json`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/enums/json/enabled/enums2int.json): JSON mapping of enum names to integer values.
- [`enums2str.json`](https://raw.githubusercontent.com/launchql/pg-proto-parser/main/__fixtures__/output/enums/json/enabled/enums2str.json): JSON mapping of integer values to enum names.

## Configuration

You can configure `pg-proto-parser` by passing different parameters to the `ProtoStore` constructor:

- `root`: The protobuf `Root` object containing your schema.
- `options`: Options defined as `PgProtoParserOptions` (see below)

## Options

This table describes the options available for `PgProtoParserOptions`, their functionality, and default values.


| Option                                   | Description                                                                                                                     | Default Value            |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| `outDir`                                 | The directory where the generated files will be saved.                                                                          | `process.cwd() + "/out"` |
| `exclude`                                | List of type or enum names to exclude during processing.                                                                        | `[]`                     |
| `utils.enums.enabled`                    | Whether to generate TypeScript utility functions for enums.                                                                     | `false`                  |
| `utils.enums.filename`                   | Filename for the generated enums utilities.                                                                                    | `'utils.ts'`             |
| `utils.astHelpers.enabled`               | Outputs TypeScript helpers for building PostgreSQL ASTs.                                                                        | `false`                  |
| `utils.astHelpers.wrappedTypesSource`    | Path to the TypeScript types to use when generating AST helpers.                                                                | `'./wrapped'`            |
| `utils.astHelpers.inlineNestedObj`       | Whether to inline `nested-obj` code within the generated file.                                                                  | `false`                  |
| `utils.astHelpers.nestedObjFile`         | Filename for the inlined `nested-obj` code, if `inlineNestedObj` is true.                                                      | `'nested-obj.ts'`        |
| `utils.astHelpers.filename`              | Filename for the generated AST helpers.                                                                                        | `'asts.ts'`              |
| `types.enabled`                          | Whether to generate TypeScript interfaces for protobuf messages.                                                                | `false`                  |
| `types.filename`                         | Filename for the generated TypeScript interfaces.                                                                               | `'types.ts'`             |
| `types.optionalFields`                   | Generates TypeScript interfaces with optional fields mapping to the PostgreSQL node types' fields; sets all fields to optional. | `true`                   |
| `types.enumsSource`                      | Path to the TypeScript enums to use when generating TypeScript interfaces.                                                      | `'./enums'`              |
| `types.wrapped.enabled`                  | Whether to generate wrapped TypeScript interfaces to match AST nodes.                                                           | `false`                  |
| `types.wrapped.enumsSource`              | Path to the TypeScript enums to use when generating wrapped TypeScript interfaces.                                              | `'./enums'`              |
| `types.wrapped.filename`                 | Filename for the generated wrapped TypeScript interfaces.                                                                       | `'wrapped.ts'`           |
| `enums.enabled`                          | Outputs TypeScript enum types for the PostgreSQL enums.                                                                         | `false`                  |
| `enums.filename`                         | Filename for the generated TypeScript enums.                                                                                    | `'enums.ts'`             |
| `enums.enumsAsTypeUnion`                 | Uses strings to define enum types as specified for the fields of each proto message type.                                       | `true`                   |
| `enums.json.enabled`                     | Whether to generate JSON files mapping enum names to integer values and vice versa.                                             | `false`                  |
| `enums.json.toIntOutFile`                | Output file name for the JSON mapping of enum names to integer values.                                                          | `'enums2int.json'`       |
| `enums.json.toStrOutFile`                | Output file name for the JSON mapping of integer values to enum names.                                                          | `'enums2str.json'`       |
| `enums.removeUndefinedAt0`               | Removes the initial `UNDEFINED` enum entry and adjusts the subsequent values by decrementing them.                             | `true`                   |
| `includeHeader`                          | Includes a header at the top of generated TypeScript files to avoid manual manipulation which could cause issues in CI/CD pipelines. | `true`                |


Each of these options can be set when initializing the `PgProtoParser` to customize its behavior and output.

## Meta AST (`generateTsAstCodeFromPgAst`)

`generateTsAstCodeFromPgAst` is a method that transforms a PostgreSQL Abstract Syntax Tree (AST) into TypeScript code capable of generating an equivalent AST. This function facilitates the dynamic creation of ASTs, allowing for programmable query construction and manipulation in TypeScript.

It generates code with syntax for [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils), assuming you import the `ast` as as default import from `@pgsql/utils`:

```ts
import { 
  generateTsAstCodeFromPgAst
} from 'pg-proto-parser';
import { parse } from 'pgsql-parser';

// Example SQL query
const sql = 'SELECT * FROM my_table WHERE id = 1';

// Parse the SQL query to get the PostgreSQL AST
const pgAst = parse(sql);

// Generate TypeScript AST builder code from the PostgreSQL AST
const tsAstBuilderCode = generateTsAstCodeFromPgAst(
  pgAst[0].RawStmt.stmt
);

console.log(tsAstBuilderCode);
// OUTPUT BELOW:
// make sure to use this import when using
// import ast from '@pgsql/utils';

ast.selectStmt({
  targetList: [ast.resTarget({
    val: ast.columnRef({
      fields: [ast.aStar({})],
      location: 7
    }),
    location: 7
  })],
  fromClause: [ast.rangeVar({
    relname: "my_table",
    inh: true,
    relpersistence: "p",
    location: 14
  })],
  whereClause: ast.aExpr({
    kind: "AEXPR_OP",
    name: [ast.string({
      str: "="
    })],
    lexpr: ast.columnRef({
      fields: [ast.string({
        str: "id"
      })],
      location: 29
    }),
    rexpr: ast.aConst({
      val: ast.integer({
        ival: 1
      }),
      location: 34
    }),
    location: 32
  }),
  limitOption: "LIMIT_OPTION_DEFAULT",
  op: "SETOP_NONE"
})
```

## Related

* [launchql/pgsql-parser](https://github.com/launchql/pgsql-parser): A node.js PostgreSQL parser/deparser that interprets and converts PostgresSQL syntax.
* [launchql/libpg-query-node](https://github.com/launchql/libpg-query-node): Node.js bindings for the libpg_query library, allowing parsing of PostgreSQL queries into parse trees.
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.