# pgsql-parser 

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://www.npmjs.com/package/pgsql-parser"><img height="20" src="https://img.shields.io/npm/dt/pgsql-parser"></a>
   <a href="https://www.npmjs.com/package/pgsql-parser"><img height="20" src="https://img.shields.io/npm/dw/pgsql-parser"/></a>
   <a href="https://github.com/launchql/pgsql-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
   <a href="https://www.npmjs.com/package/pgsql-parser"><img height="20" src="https://img.shields.io/github/package-json/v/launchql/pgsql-parser?filename=packages%2Fparser%2Fpackage.json"/></a>
</p>

The real PostgreSQL parser for Node.js, `pgsql-parser` provides symmetric parsing and deparsing of SQL statements using the actual [PostgreSQL parser](https://github.com/pganalyze/libpg_query). It allows you to parse SQL queries into AST and modify or reconstruct SQL queries from the AST.

## Installation

```sh
npm install pgsql-parser
```

## Key Features

- **True PostgreSQL Parsing:** Utilizes the real PostgreSQL source code for accurate parsing.
- **Symmetric Parsing and Deparsing:** Convert SQL to AST and back, enabling query manipulation.
- **AST Manipulation:** Easily modify parts of a SQL statement through the AST.

## Parser Example

Rewrite part of a SQL query:

```js
import { parse, deparse } from 'pgsql-parser';

const stmts = parse('SELECT * FROM test_table');

// Assuming the structure of stmts is known and matches the expected type
stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

console.log(deparse(stmts));

// SELECT * FROM "another_table"
```

## Deparser Example

The `pgsql-deparser` module serializes ASTs to SQL in pure TypeScript, avoiding the full parser's native dependencies. It's useful when only SQL string conversion from ASTs is needed, and is written in pure TypeScript for easy cross-environment deployment.

Here's how you can use the deparser in your TypeScript code, using [`@pgsql/utils`](https://github.com/launchql/pgsql-parser/tree/main/packages/utils) to create an AST for `deparse`:

```ts
import ast, { SelectStmt } from '@pgsql/utils';
import { deparse } from 'pgsql-deparser';

// This could have been obtained from any JSON or AST, not necessarily @pgsql/utils
const stmt: SelectStmt = ast.selectStmt({
  targetList: [
    ast.resTarget({
      val: ast.columnRef({
        fields: [ast.aStar()]
      })
    })
  ],
  fromClause: [
    ast.rangeVar({
      relname: 'some_table',
      inh: true,
      relpersistence: 'p'
    })
  ],
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});

// Modify the AST if needed
stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

// Deparse the modified AST back to a SQL string
console.log(deparse(stmts));

// Output: SELECT * FROM another_table
```

## CLI

```
npm install -g pgsql-parser
```

### usage

```sh
pgsql-parser <sqlfile>
```

### Documentation

### `parser.parse(sql)`

Parses the query and returns a parse object.

### Parameters

| parameter            | type               | description                                               |
| -------------------- | ------------------ | --------------------------------------------------------- |
| `query`              | String             | SQL query                                                 |

Returns an object in the format:

```
{ query: <query|Object>,
  error: { message: <message|String>,
           fileName: <fileName|String>,
           lineNumber: <line|Number>,
           cursorPosition: <cursor|Number> }
```

### `parser.deparse(query)`

Deparses the query tree and returns a formatted SQL statement. This function takes as input a query AST
in the same format as the `query` property of on the result of the `parse` method. This is the primary
functionality of this module.

### Parameters

| parameter            | type               | description                                               |
| -------------------- | ------------------ | --------------------------------------------------------- |
| `query`              | Object             | Query tree obtained from `parse`                          |

Returns a normalized formatted SQL string.

## Versions

As of PG 13, PG majors versions maintained will have a matching dedicated major npm version. Only the latest Postgres stable release receives active updates.

Our latest is built with `13-latest` branch from libpg_query

| PostgreSQL Major Version | libpg_query | Status              | npm 
|--------------------------|-------------|---------------------|---------|
| 13                       | 13-latest   | Active development  | `latest`
| 12                       | (n/a)       | Not supported       |
| 11                       | (n/a)       | Not supported       |
| 10                       | 10-latest   | Not supported       | `@1.3.1` ([tree](https://github.com/launchql/pgsql-parser/tree/39b7b1adc8914253226e286a48105785219a81ca))      | 


## Related

* [pgsql-parser](https://github.com/launchql/pgsql-parser): The real PostgreSQL parser for Node.js, providing symmetric parsing and deparsing of SQL statements with actual PostgreSQL parser integration.
* [pgsql-deparser](https://github.com/launchql/pgsql-parser/tree/main/packages/deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [pgsql-enums](https://github.com/launchql/pgsql-parser/tree/main/packages/pgsql-enums): A utility package offering easy access to PostgreSQL enumeration types in JSON format, aiding in string and integer conversions of enums used within ASTs to compliment `pgsql-parser`
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.
* [pg-proto-parser](https://github.com/launchql/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

Thanks [@lfittl](https://github.com/lfittl) for building the core `libpg_query` suite:

* [libpg_query](https://github.com/pganalyze/libpg_query)
* [pg_query](https://github.com/lfittl/pg_query)
* [pg_query.go](https://github.com/lfittl/pg_query.go)

## Credits

Thanks to [@zhm](https://github.com/zhm) for the OG parser that started it all:

* [pg-query-parser](https://github.com/zhm/pg-query-parser)
* [pg-query-native](https://github.com/zhm/node-pg-query-native)
* [Original LICENSE](https://github.com/zhm/pg-query-parser/blob/master/LICENSE.md)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.