TODO


- read DEVELOPMENT.md to understand how to develop
- read DEPARSER.md to udnerstand the tasks
- read IMPLEMENTATION_PLAN.md to udnerstand the tasks
- read packages/types/src/enums.ts to find any enums for types
- read, if for some reason, you need to parse enums/numbers (which you should not as they should be strings) — you can read this packages/enums/src/enums.ts
- read packages/types/src/types.ts to see the AST types for parse/deparse

- fix the tests that are currently written, you'll see they have some issues with RangeVar being a "wrapped" node type when it should be inlined, all you need to do is look at the types in @pgsql/types and you'll see. See below to ensure you have the correct ASTs:


HINT to help you with making sure your ASTs are correct:

const ast = {
        CallStmt: {
          funccall: {
            funcname: [{ String: { sval: 'my_procedure' } }],
            args: [
              { A_Const: { ival: { ival: 123 }, location: -1 } },
              { A_Const: { sval: { sval: 'test' }, location: -1 } }
            ],
            funcformat: 'COERCE_EXPLICIT_CALL',
            location: -1
          }
        }
      };


Should actually have 
import * as t from '@pgsql/types';
const ast: { CallStmt: t.CallStmt } = {
        CallStmt: {
          funccall: {
            funcname: [{ String: { sval: 'my_procedure' } }],
            args: [
              { A_Const: { ival: { ival: 123 }, location: -1 } },
              { A_Const: { sval: { sval: 'test' }, location: -1 } }
            ],
            funcformat: 'COERCE_EXPLICIT_CALL',
            location: -1
          }
        }
      };



Or another one:

const ast = {
        CallStmt: {
          funccall: null as any,
          funcexpr: {
            FuncExpr: {
              funcid: 12345,
              funcresulttype: 2278,
              funcretset: false,
              funcvariadic: false,
              funcformat: 'COERCE_EXPLICIT_CALL',
              funccollid: 0,
              inputcollid: 0,
              args: [] as any[],
              location: -1
            }
          },
          outargs: [] as any[]
        }
      };

should actually be:

 const ast: { CallStmt: t.CallStmt } = {
        CallStmt: {
          funccall: null,
          funcexpr: {
              funcid: 12345,
              funcresulttype: 2278,
              funcretset: false,
              funcvariadic: false,
              funcformat: 'COERCE_EXPLICIT_CALL',
              funccollid: 0,
              inputcollid: 0,
              args: [] as any[],
              location: -1
            },
          outargs: []
        }
      };

notice that you really have to pay attention to the `@pgsql/types` — if there is a `Node` in the schema, then you can "wrap" it, like this: { CallStmt: CallStmt }. If the schema references a type directly, then you don't wrap it, that's why the `FuncExpr` in the example above was removed because the type for `CallStmt` looks like this:

```ts
export interface CallStmt {
  funccall?: FuncCall;
  funcexpr?: FuncExpr;
  outargs?: Node[];
}
```

However, if we were to have `outargs`, it would be wrapped, meaning we have a single object property key which represents the `Node` type.


Another example, `RenameStmt`

export interface RenameStmt {
  renameType?: ObjectType;
  relationType?: ObjectType;
  relation?: RangeVar;
  object?: Node;
  subname?: string;
  newname?: string;
  behavior?: DropBehavior;
  missing_ok?: boolean;
}

So the RangeVar would be "inlined", not "wrapped", so if you were in the deparser method for RenameStmt, you would do this.RangeVar(node.relation, context), not this.deparse(node.relation, context) and not this.visit(node.relation, context)




FUTURE STUFF, after we get deparser working
- get wrapped types working again
- docs, kitchen sink tests