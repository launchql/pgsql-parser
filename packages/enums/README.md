# @pgsql/enums

<p align="center" width="100%">
  <img height="120" src="https://github.com/launchql/pgsql-parser/assets/545047/6440fa7d-918b-4a3b-8d1b-755d85de8bea" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/launchql/pgsql-parser/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <!-- <a href="https://www.npmjs.com/package/@pgsql/enums"><img height="20" src="https://img.shields.io/npm/dt/@pgsql/enums"></a> -->
   <!-- <a href="https://www.npmjs.com/package/@pgsql/enums"><img height="20" src="https://img.shields.io/npm/dw/@pgsql/enums"/></a> -->
   <a href="https://github.com/launchql/pgsql-parser/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
   <a href="https://www.npmjs.com/package/@pgsql/enums"><img height="20" src="https://img.shields.io/github/package-json/v/launchql/pgsql-parser?filename=packages%2Fenums%2Fpackage.json"/></a>
</p>

`@pgsql/enums` is a package that provides PostgreSQL AST enums in TypeScript for easier usage and type safety within your projects that interact with PostgreSQL's AST nodes.

## Installation

```bash
npm install @pgsql/enums
```

## Usage

After installation, you can import the enums directly from the package and use them in your code. This helps in maintaining type safety and ensuring that only valid enum values are used.

```ts
import { A_Expr_Kind } from '@pgsql/enums';

// Example usage
const exprKind: A_Expr_Kind = A_Expr_Kind.AEXPR_LIKE;

switch(exprKind) {
    case A_Expr_Kind.AEXPR_IN:
    case A_Expr_Kind.AEXPR_BETWEEN:
    case A_Expr_Kind.AEXPR_BETWEEN_SYM:
    // Add other enum cases as needed
        console.log('Enum value is valid');
        break;
    default:
        throw new Error('Unexpected enum value');
}
```

In this example, `A_Expr_Kind` is an enum imported from `@pgsql/enums`, and exprKind is a variable of type `A_Expr_Kind`. This setup ensures that exprKind can only hold values that are valid members of the `A_Expr_Kind` enum, providing compile-time type checking and reducing runtime errors.

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