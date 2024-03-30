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

```ts
import { CreateStmt, ColumnDef } from '@pgsql/types';
import ast from '@pgsql/utils';

const newColumn: ColumnDef = ast.columnDef({
    colname: 'id',
    typeName: ast.typeName({
        names: [ast.string({ str: 'int4' })]
    })
});

const createStmt: CreateStmt = ast.createStmt({
    relation: ast.rangeVar({
        relname: 'new_table'
    }),
    tableElts: [newColumn]
});
```

### Enum Value Conversion

`@pgsql/utils` provides the `getEnumValue` function to convert between the string and integer representations of enum values.

Here are a couple of examples demonstrating how to use `@pgsql/utils` in real applications:

#### Example 1: Converting Enum Name to Integer

Suppose you are working with the A_Expr_Kind enum and you have the name of an enum value. You can get its integer representation like this:

```ts
import { getEnumValue } from '@pgsql/utils';

const enumName = 'AEXPR_OP';
const enumValue = getEnumValue('A_Expr_Kind', enumName);

console.log(enumValue); // Outputs the integer value corresponding to 'AEXPR_OP'
```

#### Example 2: Converting Integer to Enum Name

```ts
import { getEnumValue } from '@pgsql/utils';

const intValue = 1;
const enumName = getEnumValue('SortByDir', intValue);

console.log(enumName); // Outputs 'SORTBY_ASC' if 1 corresponds to 'SORTBY_ASC'
```

## Related

* [pgsql-parser](https://github.com/launchql/pgsql-parser): The real PostgreSQL parser for Node.js, providing symmetric parsing and deparsing of SQL statements with actual PostgreSQL parser integration.
* [pgsql-deparser](https://github.com/launchql/pgsql-parser/tree/main/packages/deparser): A streamlined tool designed for converting PostgreSQL ASTs back into SQL queries, focusing solely on deparser functionality to complement `pgsql-parser`.
* [pgsql-enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums-json): A utility package offering easy access to PostgreSQL enumeration types in JSON format, aiding in string and integer conversions of enums used within ASTs to compliment `pgsql-parser`
* [@pgsql/enums](https://github.com/launchql/pgsql-parser/tree/main/packages/enums): Provides PostgreSQL AST enums in TypeScript, enhancing type safety and usability in projects interacting with PostgreSQL AST nodes.
* [@pgsql/types](https://github.com/launchql/pgsql-parser/tree/main/packages/types): Offers TypeScript type definitions for PostgreSQL AST nodes, facilitating type-safe construction, analysis, and manipulation of ASTs.
* [@pgsql/utils](https://github.com/launchql/pgsql-parser/tree/main/packages/utils): A comprehensive utility library for PostgreSQL, offering type-safe AST node creation and enum value conversions, simplifying the construction and manipulation of PostgreSQL ASTs.
* [pg-proto-parser](https://github.com/launchql/pg-proto-parser): A TypeScript tool that parses PostgreSQL Protocol Buffers definitions to generate TypeScript interfaces, utility functions, and JSON mappings for enums.
* [libpg-query](https://github.com/launchql/libpg-query-node): The real PostgreSQL parser exposed for Node.js, used primarily in `pgsql-parser` for parsing and deparsing SQL queries.

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Software code or Software CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.