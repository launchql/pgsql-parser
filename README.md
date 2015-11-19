# pg-query-parser [![Build Status](https://travis-ci.org/zhm/pg-query-parser.svg?branch=master)](https://travis-ci.org/zhm/pg-query-parser)

The real PostgreSQL parser for nodejs.

## Installation

```sh
npm install pg-query-parser
```

### Documentation

### `query.parse(query)`

Parses the query and returns the parse tree.

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

## Example

```js
var parse = require('pg-query').parse;

console.log(parse('select 1').query);
```

## Related

* [pg-query-native](https://github.com/zhm/pg-query-native)
* [libpg_query](https://github.com/lfittl/libpg_query)
* [pg_query](https://github.com/lfittl/pg_query)
* [pg_query.go](https://github.com/lfittl/pg_query.go)
