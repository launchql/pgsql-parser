# PostgreSQL AST Tools

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

A comprehensive monorepo for PostgreSQL Abstract Syntax Tree (AST) parsing, manipulation, and code generation. This collection of packages provides everything you need to work with PostgreSQL at the AST level, from parsing SQL queries to generating type-safe TypeScript definitions.

## 📦 Packages Overview

| Package | Description | Key Features |
|---------|-------------|--------------|
| [**pgsql-parser**](./packages/parser) | The real PostgreSQL parser for Node.js | • Uses actual PostgreSQL C parser via WebAssembly<br>• Symmetric parsing and deparsing<br>• Battle-tested with 23,000+ SQL statements |
| [**pgsql-deparser**](./packages/deparser) | Lightning-fast SQL generation from AST | • Pure TypeScript, zero dependencies<br>• No WebAssembly overhead<br>• Perfect for AST-to-SQL conversion only |
| [**@pgsql/cli**](./packages/pgsql-cli) | Unified CLI for all PostgreSQL AST operations | • Parse SQL to AST<br>• Deparse AST to SQL<br>• Generate TypeScript from protobuf<br>• Single tool for all operations |
| [**@pgsql/utils**](./packages/utils) | Type-safe AST node creation utilities | • Programmatic AST construction<br>• Enum value conversions<br>• Seamless integration with types |
| [**pg-proto-parser**](./packages/proto-parser) | PostgreSQL protobuf parser and code generator | • Generate TypeScript interfaces from protobuf<br>• Create enum mappings and utilities<br>• AST helper generation |

## 🚀 Quick Start

### Installation

Choose the packages you need:

```bash
# For parsing SQL to AST and back
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
```

#### Convert AST back to SQL
```typescript
import { deparse } from 'pgsql-deparser';

const sql = deparse(ast);
console.log(sql); // SELECT * FROM users WHERE id = 1
```

#### Build AST Programmatically
```typescript
import ast from '@pgsql/utils';

const selectStmt = ast.selectStmt({
  targetList: [
    ast.resTarget({
      val: ast.columnRef({
        fields: [ast.aStar()]
      })
    })
  ],
  fromClause: [
    ast.rangeVar({
      relname: 'users',
      inh: true,
      relpersistence: 'p'
    })
  ],
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});
```

#### Use the CLI
```bash
# Parse SQL file
pgsql parse query.sql

# Convert AST to SQL
pgsql deparse ast.json

# Generate TypeScript from protobuf
pgsql proto-gen --inFile pg_query.proto --outDir out --types --enums
```

## 🏗️ Architecture

This monorepo is organized to provide modular, focused tools that work together seamlessly:

```
pgsql-parser/
├── packages/
│   ├── parser/          # Core parser with WebAssembly
│   ├── deparser/        # Pure TypeScript deparser
│   ├── pgsql-cli/       # Unified CLI tool
│   ├── utils/           # AST construction utilities
│   ├── proto-parser/    # Protobuf code generation
│   └── transform/       # (Not production-ready yet)
└── ...
```

### Package Relationships

- **pgsql-parser** provides full parsing and deparsing capabilities using the actual PostgreSQL parser
- **pgsql-deparser** offers a lightweight alternative for just converting AST to SQL
- **@pgsql/utils** helps construct ASTs programmatically with type safety
- **pg-proto-parser** generates TypeScript definitions from PostgreSQL protobuf files
- **@pgsql/cli** unifies all functionality into a single command-line tool

## 🛠️ Development

This project uses Yarn workspaces and Lerna for monorepo management.

### Setup
```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Run tests
yarn test
```

### Building Individual Packages
```bash
cd packages/parser
npm run build
```

## 📚 Documentation

Each package has its own detailed README:

- [pgsql-parser Documentation](./packages/parser/README.md)
- [pgsql-deparser Documentation](./packages/deparser/README.md)
- [@pgsql/cli Documentation](./packages/pgsql-cli/README.md)
- [@pgsql/utils Documentation](./packages/utils/README.md)
- [pg-proto-parser Documentation](./packages/proto-parser/README.md)

## 🎯 Use Cases

- **SQL Query Analysis**: Parse queries to understand their structure and components
- **Query Transformation**: Modify queries programmatically at the AST level
- **SQL Generation**: Build complex queries programmatically with type safety
- **Code Generation**: Generate TypeScript types from PostgreSQL schemas
- **Query Validation**: Validate SQL syntax using the real PostgreSQL parser
- **Database Tooling**: Build developer tools that understand PostgreSQL deeply

## 💡 Examples

### Transform a Query
```typescript
import { parse } from 'pgsql-parser';
import { deparse } from 'pgsql-deparser';

// Parse the original query
const ast = await parse('SELECT * FROM users WHERE active = true');

// Modify the table name
ast[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'customers';

// Generate the modified SQL
const newSql = deparse(ast);
console.log(newSql); // SELECT * FROM customers WHERE active = TRUE
```

### Build a Query Programmatically
```typescript
import ast from '@pgsql/utils';
import { deparse } from 'pgsql-deparser';

const query = ast.selectStmt({
  targetList: [
    ast.resTarget({
      val: ast.columnRef({
        fields: [ast.string({ str: 'name' })]
      })
    }),
    ast.resTarget({
      val: ast.columnRef({
        fields: [ast.string({ str: 'email' })]
      })
    })
  ],
  fromClause: [
    ast.rangeVar({
      relname: 'users',
      inh: true,
      relpersistence: 'p'
    })
  ],
  whereClause: ast.aExpr({
    kind: 'AEXPR_OP',
    name: [ast.string({ str: '>' })],
    lexpr: ast.columnRef({
      fields: [ast.string({ str: 'age' })]
    }),
    rexpr: ast.aConst({
      val: ast.integer({ ival: 18 })
    })
  }),
  limitOption: 'LIMIT_OPTION_DEFAULT',
  op: 'SETOP_NONE'
});

console.log(deparse(query));
// SELECT name, email FROM users WHERE age > 18
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE-MIT) file for details.

## 🙏 Credits

Built on the excellent work of several contributors:

* **[Dan Lynch](https://github.com/pyramation)** — official maintainer since 2018 and architect of the current implementation
* **[Lukas Fittl](https://github.com/lfittl)** for [libpg_query](https://github.com/pganalyze/libpg_query) — the core PostgreSQL parser that powers this project
* **[Greg Richardson](https://github.com/gregnr)** for AST guidance and pushing the transition to WASM for better interoperability
* **[Ethan Resnick](https://github.com/ethanresnick)** for the original Node.js N-API bindings
* **[Zac McCormick](https://github.com/zhm)** for the foundational [node-pg-query-native](https://github.com/zhm/node-pg-query-native) parser

## 🔗 Related Projects

### Core Packages (in this monorepo)
* [pgsql-parser](https://www.npmjs.com/package/pgsql-parser): The real PostgreSQL parser for Node.js
* [pgsql-deparser](https://www.npmjs.com/package/pgsql-deparser): Lightning-fast SQL generation from AST
* [@pgsql/cli](https://www.npmjs.com/package/@pgsql/cli): Unified CLI for PostgreSQL AST operations
* [@pgsql/utils](https://www.npmjs.com/package/@pgsql/utils): Type-safe AST construction utilities
* [pg-proto-parser](https://www.npmjs.com/package/pg-proto-parser): PostgreSQL protobuf parser and code generator



### External Dependencies
* [libpg-query](https://github.com/launchql/libpg-query-node): The PostgreSQL parser exposed for Node.js

## ⚖️ Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.