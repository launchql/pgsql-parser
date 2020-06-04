# pgsql-parser [![Build Status](https://travis-ci.org/pyramation/pgsql-parser.svg?branch=master)](https://travis-ci.org/pyramation/pgsql-parser)

The real PostgreSQL parser for nodejs. The primary objective of this module is to provide symmetric parsing
and deparsing of SQL statements. With this module you can modify parts of a SQL query statement and
serialize the query tree back into a formatted SQL statement. It uses the *real* [PostgreSQL parser](https://github.com/lfittl/libpg_query).

The main functionality provided by this module is deparsing, which PostgreSQL does not have internally.

Thanks to https://github.com/zhm/pg-query-parser we've been able to start this repo and add a lot of functionality

## Installation

```sh
npm install pgsql-parser
```

## Example

Rewrite part of a SQL query:

```js
const parser = require('pgsql-parser');

const query = parser.parse('SELECT * FROM test_table').query;

query[0].SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

console.log(parser.deparse(query));

// SELECT * FROM "another_table"
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

## Related

* [pg-query-native](https://github.com/zhm/node-pg-query-native)
* [libpg_query](https://github.com/lfittl/libpg_query)
* [pg_query](https://github.com/lfittl/pg_query)
* [pg_query.go](https://github.com/lfittl/pg_query.go)
