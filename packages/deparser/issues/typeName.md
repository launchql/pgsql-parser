You're working with a PostgreSQL AST deparser. There is a bug where the deparser incorrectly wraps `TypeName` objects inside an extra `{ TypeName: { ... } }` object. This causes the output AST to be invalid. The correct structure for `ColumnDef.typeName` should look like:

```ts
typeName: {
  names: [{ String: { sval: 'text' } }],
  typemod: -1
}
```

Instead, the incorrect output looks like:

```ts
typeName: {
  TypeName: {
    names: [{ String: { sval: 'text' } }],
    typemod: -1
  }
}
```

**Your task:**
Update the deparser logic so that it avoids double-wrapping nested nodes like `TypeName`. Ensure that `typeName` is rendered as a direct object of type `TypeName`, not a node wrapper. You might need to inspect how `Node` wrappers are handled inside `RawStmt`, and fix nested type unwrap behavior for deparsing.

**Hint:** Use the `@pgsql/utils/wrapped` module and inspect how node unwrapping is handled. Make sure to write the deparser so it matches the correct AST as returned by the parser, especially in the test:

> `"should deparse simple CREATE TABLE"`
