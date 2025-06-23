## PostgreSQL Deparser for PG17: Architecture Analysis and Implementation Guide

This document provides guidance for working in the `deparser` repository. It is intended for internal developers and agents contributing to the PostgreSQL 17 upgrade.

---

### Key Technical Goals

* Compatibility for PostgreSQL 17
* Expand test coverage with thorough kitchen-sink tests
* Document architecture, types, and helper modules clearly

---

### Architecture Overview

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

---

### Key Utility Modules

* **SqlFormatter**: Manages indentation and spacing
* **QuoteUtils**: Quotes/escapes identifiers per PostgreSQL rules
* **ListUtils**: Unwraps `List` nodes, standardizes array access
* **DeparserContext**: Maintains traversal and formatting state
* **Node Types (`@pgsql/types`)**: Canonical TypeScript types for all nodes

**Source references for types:**

* `packages/types/src/types.ts`
* `packages/types/src/enums.ts`

---

### Context-Driven Rendering

Use `DeparserContext` to manage behavior across complex node trees. For example, strings may require different escaping depending on context (e.g., identifier vs. expression). Avoid duplicating logic in node handlers—use `context` to guide formatting.

```ts
export interface DeparserContext {
  isStringLiteral?: boolean;
  parentNodeTypes: string[];
  [key: string]: any;
}
```

`parentNodeTypes` keeps track of the path to the leaf nodes during tree traversal so that formatting and behavior in leaf nodes can be adjusted based on their position in the tree.

---

### QuoteUtils: Identifier Handling

```ts
export class QuoteUtils {
  static quote(identifier: string): string {
    if (!identifier) return '';
    if (this.needsQuoting(identifier)) return `"${identifier.replace(/"/g, '""')}"`;
    return identifier;
  }

  private static needsQuoting(identifier: string): boolean {
    return !/^[a-z_][a-z0-9_$]*$/i.test(identifier) || RESERVED_KEYWORDS.has(identifier.toLowerCase());
  }
}
```

---

### ListUtils: List Handling

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

---

### Testing Strategy

* Focus on `deparser/__tests__/kitchen-sink`
* Run targeted tests with:

```bash
cd packages/deparser
yarn test --testNamePattern="specific-test"
```

---

### AST Debugging: How to Identify and Fix Errors

When a test fails, it shows AST diffs for diagnosis.

Example failure:

```diff
-   "rexpr": { "FuncCall": { "args": [ "A_Const" ] } }
+   "rexpr": { "FuncCall": { "args": [ { "FuncCall": { "args": [...] } ] } } }
```

Fix: prevent accidental nested `FuncCall` by inspecting and unwrapping recursively.

## Custom testing strategy

Parse the any deparsed or pretty-formatted SQL back and verify the AST matches the original. This ensures the formatting doesn't break the SQL semantics.

Please review the test utilities — note that exact SQL string equality is not required. The focus is on comparing the resulting ASTs.

Refer to `expectAstMatch` to understand how correctness is validated.

The pipeline is:
parse(sql1) → ast → deparse(ast) → sql2
While sql2 !== sql1 (textually), a correct round-trip means:
parse(sql1) === parse(sql2) (AST-level equality).

You can see `expectAstMatch` here: packages/deparser/test-utils/index.ts


---

### Development Setup

#### Prerequisites

* Node.js v14+
* Yarn

#### Install & Build

```bash
yarn
yarn build
```

#### Test Commands

```bash
yarn test
# or
yarn test --testNamePattern="specific-test"
yarn test:watch
```

Update `TESTS.md` with latest test status and passing percentages.

---

### Package Structure

* `packages/deparser`: SQL output generator
* `packages/parser`: SQL AST generator
* `packages/types`: PG AST type definitions
* `packages/utils`: Shared helpers (quote, list, context)

---

### Suggested Workflow

1. Begin with `kitchen-sink` cases
2. Use stderr to view AST diff output
3. Use expected AST block as source of truth
4. Match deparsed output to expected structure
5. Fix one issue at a time—validate before moving forward

---

## Testing Process & Workflow

**Our systematic approach to fixing deparser issues:**

1. **One test at a time**: Focus on individual failing tests using `yarn test --testNamePattern="specific-test"`
2. **Always check for regressions**: After each fix, run full `yarn test` to ensure no previously passing tests broke
3. **Track progress**: Update this file with current pass/fail counts after each significant change
4. **Build before testing**: Always run `yarn build` after code changes before testing
5. **Clean commits**: Stage files explicitly with `git add <file>`, never use `git add .`
6. **Tight feedback loops**: Use isolated debug scripts for complex issues, but don't commit them

**Workflow**: Make changes → `yarn test --testNamePattern="target-test"` → `yarn test` (check regressions) → Update this file → Commit & push

**When committing to TESTS.md, always run all tests — do not use testNamePattern, only `yarn test`**

PostgreSQL AST nodes are wrapped with type names as keys — `{ RangeVar: {...} }`, `{ String: {...} }`, etc. — see `Node` type in `@pgsql/types`.

Node type detection should use the wrapper key — `Object.keys(node)[0]` — for wrapped nodes from `@pgsql/types`.

`@pgsql/types` provides comprehensive type definitions for all PostgreSQL AST node types. The `Node` type is the wrapped form.

Parent context should inform node type resolution when wrapper detection fails.

`visit()` should only be called on wrapped `Node` instances — avoid duck typing by checking for properties like `schemaname`, `sval`, `ival`, etc. These should be handled by specific node visitor methods in the deparser.
