# @pgsql/utils

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <!-- <a href="https://www.npmjs.com/package/@pgsql/utils"><img height="20" src="https://img.shields.io/npm/dt/@pgsql/utils"></a> -->
   <!-- <a href="https://www.npmjs.com/package/@pgsql/utils"><img height="20" src="https://img.shields.io/npm/dw/@pgsql/utils"/></a> -->
   <a href="https://github.com/launchql/pgsql-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
   <a href="https://www.npmjs.com/package/@pgsql/utils"><img height="20" src="https://img.shields.io/github/package-json/v/launchql/pgsql-parser?filename=packages%2Futils%2Fpackage.json"/></a>
</p>

`@pgsql/utils` is a companion utility library for `@pgsql/types`, offering convenient functions to work with PostgreSQL Abstract Syntax Tree (AST) nodes and enums in a type-safe manner. This library facilitates the creation of AST nodes and simplifies the process of converting between enum names and their respective integer values, as defined in the PostgreSQL parser output.

# Table of Contents

1. [@pgsql/utils](#pgsql-utils)
   - [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
   - [AST Node Creation](#ast-node-creation)
     - [JSON AST](#json-ast)
     - [Select Statement](#select-statement)
     - [Creating Table Schemas Dynamically](#creating-table-schemas-dynamically)
   - [Enum Value Conversion](#enum-value-conversion)
     - [Example 1: Converting Enum Name to Integer](#example-1-converting-enum-name-to-integer)
     - [Example 2: Converting Integer to Enum Name](#example-2-converting-integer-to-enum-name)
4. [Related Projects](#related)
5. [Disclaimer](#disclaimer)

## Features

- **AST Node Creation**: Simplifies the process of constructing PostgreSQL AST nodes, allowing for easy assembly of SQL queries or statements programmatically.
- **Type-safe Enum Conversion**: Convert between string and integer representations of PostgreSQL AST enum values.
- **Comprehensive Coverage**: Supports all enum types and node types defined in the PostgreSQL AST.
- **Seamless Integration**: Designed to be used alongside the `@pgsql/types` package for a complete AST handling solution.


## Installation

To add `@pgsql/utils` to your project, use the following npm command:

```bash
npm install @pgsql/utils
```

## Usage

### AST Node Creation

With the AST helper methods, creating complex SQL ASTs becomes straightforward and intuitive.

#### JSON AST

Explore the PostgreSQL Abstract Syntax Tree (AST) as JSON objects with ease using `@pgsql/utils`. Below is an example of how you can generate a JSON AST using TypeScript:

```ts
import * as t from '@pgsql/utils';
import { SelectStmt } from '@pgsql/types';
import { deparse } from 'pgsql-deparser';

const selectStmt: { SelectStmt: SelectStmt } = t.nodes.selectStmt({
  targetList: [
    t.nodes.resTarget({
      val: t.nodes.columnRef({
        fields: [t.nodes.aStar()]
      })
    })
  ],
  fromClause: [
    t.nodes.rangeVar({
      relname: 'some_amazing_table',
      inh: true,
      relpersistence: 'p'
    })
  ],
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});
console.log(selectStmt);
// Output: { "SelectStmt": { "targetList": [ { "ResTarget": { "val": { "ColumnRef": { "fields": [ { "A_Star": {} } ] } } } } ], "fromClause": [ { "RangeVar": { "relname": "some_amazing_table", "inh": true, "relpersistence": "p" } } ], "limitOption": "LIMIT_OPTION_DEFAULT", "op": "SETOP_NONE" } }
console.log(await deparse(stmt))
// Output: SELECT * FROM some_amazing_table
```

#### Select Statement

```ts
import * as t from '@pgsql/utils';
import { SelectStmt } from '@pgsql/types';
import { deparse } from 'pgsql-deparser';

const query: { SelectStmt: SelectStmt } = t.nodes.selectStmt({
  targetList: [
    t.nodes.resTarget({
      val: t.nodes.columnRef({
        fields: [t.nodes.string({ sval: 'name' })]
      })
    }),
    t.nodes.resTarget({
      val: t.nodes.columnRef({
        fields: [t.nodes.string({ sval: 'email' })]
      })
    })
  ],
  fromClause: [
    t.nodes.rangeVar({
      relname: 'users',
      inh: true,
      relpersistence: 'p'
    })
  ],
  whereClause: t.nodes.aExpr({
    kind: 'AEXPR_OP',
    name: [t.nodes.string({ sval: '>' })],
    lexpr: t.nodes.columnRef({
      fields: [t.nodes.string({ sval: 'age' })]
    }),
    rexpr: t.nodes.aConst({
      ival: t.ast.integer({ ival: 18 })
    })
  }),
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});

await deparse(createStmt);
// SELECT name, email FROM users WHERE age > 18
```

#### Creating Table Schemas Dynamically

```ts
// Example JSON schema
const schema = {
  "tableName": "users",
  "columns": [
    { "name": "id", "type": "int", "constraints": ["PRIMARY KEY"] },
    { "name": "username", "type": "text" },
    { "name": "email", "type": "text", "constraints": ["UNIQUE"] },
    { "name": "created_at", "type": "timestamp", "constraints": ["NOT NULL"] }
  ]
};

// Construct the CREATE TABLE statement
const createStmt = t.nodes.createStmt({
  relation: t.ast.rangeVar({ 
    relname: schema.tableName,
    inh: true,
    relpersistence: 'p'
  }),
  tableElts: schema.columns.map(column => t.nodes.columnDef({
    colname: column.name,
    typeName: t.ast.typeName({
      names: [t.nodes.string({ sval: column.type })]
    }),
    constraints: column.constraints?.map(constraint =>
      t.nodes.constraint({
        contype: constraint === "PRIMARY KEY" ? "CONSTR_PRIMARY" : constraint === "UNIQUE" ? "CONSTR_UNIQUE" : "CONSTR_NOTNULL"
      })
    )
  }))
});

// `deparse` function converts AST to SQL string
const sql = await deparse(createStmt, { pretty: true });

console.log(sql);
// OUTPUT: 

// CREATE TABLE users (
//  id int PRIMARY KEY,
// 	username text,
// 	email text UNIQUE,
// 	created_at timestamp NOT NULL 
// )
```

## Related

* [pgsql-parser](https://www.npmjs.com/package/pgsql-parser): The real PostgreSQL parser for Node.js, providing symmetric parsing and deparsing of SQL statements with actual PostgreSQL parser integration.
* [pgsql-deparser](https://www.npmjs.com/package/pgsql-deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [@pgsql/parser](https://www.npmjs.com/package/@pgsql/parser): Multi-version PostgreSQL parser with dynamic version selection at runtime, supporting PostgreSQL 15, 16, and 17 in a single package.
* [@pgsql/types](https://www.npmjs.com/package/@pgsql/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/enums](https://www.npmjs.com/package/@pgsql/enums): Provides TypeScript enum definitions for PostgreSQL constants, enabling type-safe usage of PostgreSQL enums and constants in your applications.
* [@pgsql/utils](https://www.npmjs.com/package/@pgsql/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.
* [@pgsql/traverse](https://www.npmjs.com/package/@pgsql/traverse): PostgreSQL AST traversal utilities for pgsql-parser, providing a visitor pattern for traversing PostgreSQL Abstract Syntax Tree nodes, similar to Babel's traverse functionality but specifically designed for PostgreSQL AST structures.
* [pg-proto-parser](https://www.npmjs.com/package/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.