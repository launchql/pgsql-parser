# pgsql-deparser 

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://www.npmjs.com/package/pgsql-deparser"><img height="20" src="https://img.shields.io/npm/dt/pgsql-deparser"></a>
   <a href="https://www.npmjs.com/package/pgsql-deparser"><img height="20" src="https://img.shields.io/npm/dw/pgsql-deparser"/></a>
   <a href="https://github.com/launchql/pgsql-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
   <a href="https://www.npmjs.com/package/pgsql-deparser"><img height="20" src="https://img.shields.io/github/package-json/v/launchql/pgsql-deparser?filename=packages%2Fparser%2Fpackage.json"/></a>
</p>

`pgsql-deparser` is a streamlined tool designed to convert PostgreSQL Abstract Syntax Trees (AST) back into SQL queries. It is a companion module to [`pgsql-parser`](https://github.com/launchql/pgsql-parser), which is capable of both parsing SQL queries into ASTs and deparsing these ASTs back into SQL. However, unlike `pgsql-parser`, which incorporates the full PostgreSQL parser, `pgsql-deparser` focuses solely on the deparser functionality. This makes it an excellent choice for scenarios where only AST-to-SQL conversion is needed, avoiding the extra overhead associated with the full parsing capabilities.

## Installation

```sh
npm install pgsql-deparser
```

## Key Features

- **Lightweight and Pure TypeScript**: Built entirely in TypeScript, `pgsql-deparser` is lightweight and doesn't rely on native dependencies, facilitating easier integration and deployment across various environments.
- **Focused Functionality**: By concentrating on decompiling ASTs to SQL, `pgsql-deparser` offers a specialized, efficient solution for those who need to generate SQL statements from ASTs without the full parsing mechanism.
- **Compatibility**: Ideal for use cases where the AST is already obtained from another source or process, allowing for seamless SQL generation from AST representations.

## Deparser Example

The deparser functionality is provided as a standalone module, enabling you to serialize AST (Abstract Syntax Tree) objects back to SQL statements without the need for the full parsing engine. This separation is particularly beneficial for environments where the native dependencies of the full parser are problematic or unnecessary. For instance, if you already have an AST representation of your SQL query and merely need to convert it back to a SQL string, you can use the pgsql-deparser module directly. This module is implemented in pure TypeScript, avoiding the need for native bindings and thereby simplifying deployment and compatibility across different environments.

Here's how you can use the deparser in your TypeScript code:

```ts
import { deparse } from 'pgsql-deparser';

// Assuming `stmts` is an AST object for the query 'SELECT * FROM test_table'
// This could have been obtained from any source, not necessarily the pgsql-parser
const stmts = getAstFromSomewhere();

// Modify the AST as needed
stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

// Deparse the modified AST back to a SQL string
console.log(deparse(stmts));

// Output: SELECT * FROM "another_table"

```

## Why Use `pgsql-deparser`?

`pgsql-deparser` is particularly useful in development environments where native dependencies are problematic or in applications where only the deparser functionality is required. Its independence from the full `pgsql-parser` package allows for more focused and lightweight SQL generation tasks.

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
* [pgsql-deparser](https://github.com/launchql/pgsql-parser/tree/master/packages/deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [pgsql-enums](https://github.com/launchql/pgsql-parser/tree/master/packages/enums-json): A utility package offering easy access to PostgreSQL enumeration types in JSON format, aiding in string and integer conversions of enums used within ASTs to compliment `pgsql-parser`
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/master/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/master/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/master/packages/utils): A utility library for working with PostgreSQL AST node enumerations in a type-safe way, easing enum name and value conversions.
* [pg-proto-parser](https://github.com/launchql/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query-node](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

Thanks @lfittl for building the core `libpg_query` suite:

* [libpg_query](https://github.com/pganalyze/libpg_query)
* [pg_query](https://github.com/lfittl/pg_query)
* [pg_query.go](https://github.com/lfittl/pg_query.go)

## Credits

Thanks to @zhm for the OG parser that started it all:

* [pg-query-parser](https://github.com/zhm/pg-query-parser)
* [pg-query-native](https://github.com/zhm/node-pg-query-native)
* [Original LICENSE](https://github.com/zhm/pg-query-parser/blob/master/LICENSE.md)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.