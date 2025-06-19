## PostgreSQL Deparser for PG17: Architecture Analysis and Implementation Guide

This document explains how to work in the `deparser` repository. It is intended for internal developers and agents contributing to the PostgreSQL 17 upgrade.

### Key Technical Goals

* Upgrade compatibility from PostgreSQL 13 to 17
* Strengthen test coverage, especially for kitchen-sink tests
* Document structure, types, and helper modules clearly

### Architecture Breakdown

#### Visitor Pattern Core (`packages/deparser/src/deparser.ts`)

```ts
export class Deparser implements DeparserVisitor {
  private formatter: SqlFormatter;
  private tree: Node[];

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    if (this[nodeType]) return this[nodeType](node, context);
    throw new Error(`Unsupported node type: ${nodeType}`);
  }

  getNodeType(node: Node): string {
    return Object.keys(node)[0];
  }

  getNodeData(node: Node): any {
    return (node as any)[this.getNodeType(node)];
  }
}
```

#### Utility Modules

* **SqlFormatter**: SQL string indentation and spacing
* **QuoteUtils**: Handles quoting/escaping identifiers using PostgreSQL rules
* **ListUtils**: Unwraps `List` nodes and standardizes array access
* **DeparserContext**: Contextual info for traversal state and formatting
* **Node Types (********`@pgsql/types`****\*\*\*\*)**: Canonical type definitions for every node

If you need to study the actual source of the node types, refer to:

* `packages/types/src/types.ts`
* `packages/types/src/enums.ts`

### Context Enhancements

Context can be used to handle corner cases in leaf nodes, especially when a generic type like `String` needs to behave differently based on location. For instance, quoting behavior may depend on whether a string is used in an expression, identifier, constraint, or function. Avoid hardcoding logic in multiple node visitors—use `context` instead to pass information down the tree and guide formatting or escaping decisions correctly.

```ts
export interface DeparserContext {
  parentNode?: Node;
  parentNodeType?: string;
  parentField?: string;
  indentLevel?: number;
  inSubquery?: boolean;
  inConstraint?: boolean;
  inExpression?: boolean;
  jsonFormatting?: boolean;
  xmlFormatting?: boolean;
  partitionContext?: boolean;
}
```

### QuoteUtils (Identifier Handling)

These are utility functions for quoting and escaping PostgreSQL identifiers. You should be familiar with these methods if working on quoting logic or identifier rendering.

```ts
export class QuoteUtils {
  static quote(identifier: string): string {
    if (!identifier) return '';
    if (this.needsQuoting(identifier)) return `"${identifier.replace(/"/g, '""')}"`;
    return identifier;
  }

  private static needsQuoting(identifier: string): boolean {
    return !/^[a-z_][a-z0-9_$]*$/.test(identifier) || RESERVED_KEYWORDS.has(identifier.toLowerCase());
  }
}
```

### ListUtils (List Unwrapping)

These are helper utilities for traversing and standardizing node lists. Be familiar with this when handling `List` types inside the AST structure.

```ts
export class ListUtils {
  static unwrapList(listNode: any): any[] {
    if (!listNode) return [];
    if (listNode.List) return listNode.List.items || [];
    if (Array.isArray(listNode)) return listNode;
    return [listNode];
  }

  static processNodeList(nodes: any[], visitor: (node: any) => string): string[] {
    return this.unwrapList(nodes).map(visitor);
  }
}
```

### Testing Requirements

* Focus exclusively on `deparser/__tests__/kitchen-sink`
* After green status, expand to `deparser/__tests__/ast-driven`

### Debugging AST Mismatches

* Test failures display meaningful diffs showing AST mismatches
* Use expected vs actual AST comparison output to isolate:

  * extra wrapping function calls
  * incorrect nested structures
  * missing locations or misquoted identifiers

#### Example Failure (from `simple-5.sql`)

```diff
-   "rexpr": { "FuncCall": { "args": [ "A_Const" ] } }
+   "rexpr": { "FuncCall": { "args": [ { "FuncCall": { "args": [...] } ] } } }
```

> Fix: Prevent nested `FuncCall` in deparser output

### Development Workflow and Setup

#### Example: Run tests for the deparser package

```bash
cd packages/deparser
yarn test
```

Use `yarn test --testNamePattern="specific-test"` to narrow the test scope during debugging.

To contribute effectively, follow this setup and workflow:

**Initial Setup:**

* Requires Node.js v14+ and Yarn
* Run `yarn` to install dependencies
* Run `yarn build` to build all packages

**Running Tests:**

* Run `yarn test --testNamePattern="specific-test"` to test a specific case
* Use `yarn test` to check for regressions
* Run `yarn test:watch` during active development
* Update `TESTS.md` with the current percentage of passing tests

**Available Packages:**

* `packages/deparser`: SQL deparser
* `packages/parser`: SQL parser
* `packages/types`: TypeScript AST definitions
* `packages/utils`: Utility functions

Steps:

1. Start with `kitchen-sink` tests
2. Use stderr output to compare ASTs
3. Use the `expected AST` block as ground truth
4. Match the structure via the deparsed output
5. Fix one mismatch at a time before moving on

---

This document excludes high-level marketing prose and focuses strictly on the actionable implementation details needed to maintain and upgrade the deparser for PostgreSQL 17.
