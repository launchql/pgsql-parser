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
</p>

## PostgreSQL Parsing, Deparsing & AST Tools

A comprehensive monorepo for PostgreSQL Abstract Syntax Tree (AST) parsing, manipulation, and code generation. This collection of packages provides everything you need to work with PostgreSQL at the AST level, from parsing SQL queries to generating type-safe TypeScript definitions.

## 🚀 Quick Start

### Installation

Choose the packages you need:

```bash
# For parsing SQL to AST and back (includes deparser)
npm install pgsql-parser

# For only converting AST to SQL (lighter weight)
npm install pgsql-deparser

# For the unified CLI tool
npm install -g @pgsql/cli

# For programmatic AST construction
npm install @pgsql/utils

# For protobuf parsing and code generation
npm install pg-proto-parser
```

### Basic Usage

#### Parse SQL to AST
```typescript
import { parse } from 'pgsql-parser';

const ast = await parse('SELECT * FROM users WHERE id = 1');
console.log(JSON.stringify(ast, null, 2));
// {"version":170004,"stmts":[{"stmt":{"SelectStmt":{"targetList":[{"ResTarget": ... ,"op":"SETOP_NONE"}}}]}
```

#### Convert AST back to SQL
```typescript
import { deparse } from 'pgsql-deparser';

const sql = await deparse(ast);
console.log(sql); // SELECT * FROM users WHERE id = 1
```

#### Build AST with Types
```typescript
import { deparse } from 'pgsql-deparser';
import { SelectStmt } from '@pgsql/types';

const stmt: { SelectStmt: SelectStmt } = {
    SelectStmt: {
        targetList: [
            {
                ResTarget: {
                    val: {
                        ColumnRef: {
                            fields: [{ A_Star: {} }]
                        }
                    }
                }
            }
        ],
        fromClause: [
            {
                RangeVar: {
                    relname: 'some_table',
                    inh: true,
                    relpersistence: 'p'
                }
            }
        ],
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
    }
};

await deparse(stmt);
```

#### Build AST Programmatically
```typescript
import * as t from '@pgsql/utils';
import { deparse } from 'pgsql-deparser';
import { SelectStmt } from '@pgsql/types';

const stmt: { SelectStmt: SelectStmt } = t.nodes.selectStmt({
  targetList: [
    t.nodes.resTarget({
      val: t.nodes.columnRef({
        fields: [t.nodes.aStar()]
      })
    })
  ],
  fromClause: [
    t.nodes.rangeVar({
      relname: 'some_table',
      inh: true,
      relpersistence: 'p'
    })
  ],
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});

await deparse(stmt);
```

## 📦 Packages 

| Package | Description | Key Features |
|---------|-------------|--------------|
| [**pgsql-parser**](./packages/parser) | The real PostgreSQL parser for Node.js | • Uses actual PostgreSQL C parser via WebAssembly<br>• Symmetric parsing and deparsing<br>• Battle-tested with 23,000+ SQL statements |
| [**pgsql-deparser**](./packages/deparser) | Lightning-fast SQL generation from AST | • Pure TypeScript, zero runtime dependencies<br>• No WebAssembly overhead<br>• Perfect for AST-to-SQL conversion only |
| [**@pgsql/cli**](./packages/pgsql-cli) | Unified CLI for all PostgreSQL AST operations | • Parse SQL to AST<br>• Deparse AST to SQL<br>• Generate TypeScript from protobuf<br>• Single tool for all operations |
| [**@pgsql/utils**](./packages/utils) | Type-safe AST node creation utilities | • Programmatic AST construction<br>• Runtime Schema<br>• Seamless integration with types |
| [**pg-proto-parser**](./packages/proto-parser) | PostgreSQL protobuf parser and code generator | • Generate TypeScript interfaces from protobuf<br>• Create enum mappings and utilities<br>• AST helper generation |
| [**@pgsql/transform**](./packages/transform) | Multi-version PostgreSQL AST transformer | • Transform ASTs between PostgreSQL versions (13→17)<br>• Single source of truth deparser pipeline<br>• Backward compatibility for legacy SQL |


## 🛠️ Development

This project uses Yarn workspaces and Lerna for monorepo management. See [DEVELOPMENT.md](DEVELOPMENT.md) for more info.

### Setup
```bash
# Install dependencies
yarn install

# Build all packages
yarn build
```

### Building Individual Packages
```bash
cd packages/parser
npm run build
```


## More Examples

### Transform a Query

```typescript
import { parse } from 'pgsql-parser';
import { deparse } from 'pgsql-deparser';

// Parse the original query
const ast = await parse('SELECT * FROM users WHERE active = true');

// Modify the table name
ast[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'customers';

// Generate the modified SQL
const newSql = await deparse(ast);
console.log(newSql); // SELECT * FROM customers WHERE active = TRUE
```

### Build a Query Programmatically

```typescript
import ast from '@pgsql/utils';
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

console.log(await deparse(query));
// SELECT name, email FROM users WHERE age > 18
```

## Related

* [pgsql-parser](https://www.npmjs.com/package/pgsql-parser): The real PostgreSQL parser for Node.js, providing symmetric parsing and deparsing of SQL statements with actual PostgreSQL parser integration.
* [pgsql-deparser](https://www.npmjs.com/package/pgsql-deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [@pgsql/parser](https://www.npmjs.com/package/@pgsql/parser): Multi-version PostgreSQL parser with dynamic version selection at runtime, supporting PostgreSQL 15, 16, and 17 in a single package.
* [@pgsql/types](https://www.npmjs.com/package/@pgsql/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/enums](https://www.npmjs.com/package/@pgsql/enums): Provides TypeScript enum definitions for PostgreSQL constants, enabling type-safe usage of PostgreSQL enums and constants in your applications.
* [@pgsql/utils](https://www.npmjs.com/package/@pgsql/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.
* [pg-proto-parser](https://www.npmjs.com/package/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
