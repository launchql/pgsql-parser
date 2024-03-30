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

The real PostgreSQL parser for nodejs. The primary objective of this module is to provide symmetric parsing and deparsing of SQL statements. With this module you can modify parts of a SQL query statement and serialize the query tree back into a formatted SQL statement. It uses the *real* [PostgreSQL parser](https://github.com/pganalyze/libpg_query).

The main functionality provided by this module is deparsing, which PostgreSQL does not have internally.

## Installation

```sh
npm install pgsql-parser
```

## Parser Example

Rewrite part of a SQL query:

```js
const { parse, deparse } = require('pgsql-parser');

const stmts = parse('SELECT * FROM test_table');

stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

console.log(deparse(stmts));

// SELECT * FROM "another_table"
```

## Deparser Example

The deparser can be used separately, which removes many deps required for the parser:

```js
const { parse } = require('pgsql-parser');
const { deparse } = require('pgsql-deparser');

const stmts = parse('SELECT * FROM test_table');

stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

console.log(deparse(stmts));

// SELECT * FROM "another_table"
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

* [libpg-query-node](https://github.com/launchql/libpg-query-node)
* [libpg_query](https://github.com/pganalyze/libpg_query)
* [pg_query](https://github.com/lfittl/pg_query)
* [pg_query.go](https://github.com/lfittl/pg_query.go)

## Credits

* [pg-query-parser](https://github.com/zhm/pg-query-parser)
* [pg-query-native](https://github.com/zhm/node-pg-query-native)

License: https://github.com/zhm/pg-query-parser/blob/master/LICENSE.md

Thanks to https://github.com/zhm/pg-query-parser we've been able to start this repo and add a lot of functionality
