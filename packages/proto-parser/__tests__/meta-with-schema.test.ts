import * as t from '../test-utils/meta';
import { A_Expr, List, ParseResult, ResTarget, SelectStmt } from '@pgsql/types';
import { generateTsAstCodeFromPgAstWithSchema } from '../src/utils';
import generate from '@babel/generator';
import { runtimeSchema } from '../test-utils/meta/runtime-schema';

describe('AST to AST with runtime schema', () => {
  it('should generate t.ast.* for wrapped nodes and t.nodes.* for non-wrapped nodes', () => {
    // Create a simple AST using the wrapped helpers
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
          relname: 'users_table',
          inh: true,
          relpersistence: 'p'
        })
      ],
      limitOption: 'LIMIT_OPTION_DEFAULT',
      op: 'SETOP_NONE'
    });

    // Generate code using the new function with runtime schema
    const astForAst = generateTsAstCodeFromPgAstWithSchema(selectStmt, runtimeSchema);
    const generatedCode = generate(astForAst).code;
    expect(generatedCode).toMatchSnapshot();
  });

  it('should handle mixed wrapped and non-wrapped nodes', () => {
    // Create an AST with both wrapped and non-wrapped nodes
    const testAst: { A_Expr: A_Expr } = t.nodes.aExpr({
      kind: 'AEXPR_OP',
      name: [t.nodes.string({ sval: '=' })],
      lexpr: t.nodes.columnRef({
        fields: [t.nodes.string({ sval: 'id' })]
      }),
      rexpr: t.nodes.aConst({
        ival: t.ast.integer({ ival: 42 })
      })
    });

    const astForAst = generateTsAstCodeFromPgAstWithSchema(testAst, runtimeSchema);
    const generatedCode = generate(astForAst).code;
    expect(generatedCode).toMatchSnapshot();
  });

  it('should handle arrays of nodes', () => {
    const testAst: { List: List } = t.nodes.list({
      items: [
        t.nodes.string({ sval: 'first' }),
        t.nodes.string({ sval: 'second' }),
        t.nodes.string({ sval: 'third' })
      ]
    });

    const astForAst = generateTsAstCodeFromPgAstWithSchema(testAst, runtimeSchema);
    const generatedCode = generate(astForAst).code;
    expect(generatedCode).toMatchSnapshot();
  });

  it('should handle empty objects and null values', () => {
    const testAst: { ResTarget: ResTarget } = t.nodes.resTarget({
      name: null,
      val: t.nodes.columnRef({
        fields: [t.nodes.aStar()]
      })
    });

    const astForAst = generateTsAstCodeFromPgAstWithSchema(testAst, runtimeSchema);
    const generatedCode = generate(astForAst).code;
    expect(generatedCode).toMatchSnapshot();
  });

  it('should use t.nodes.* for non-wrapped nodes', () => {
    // Test that unwrapped nodes (plain objects) are converted to t.nodes.* calls
    const testAst: { ParseResult: ParseResult } = t.nodes.parseResult({
      version: 160001,
      stmts: [
        t.ast.rawStmt({
          stmt: {
            // This is an unwrapped SelectStmt - just a plain object with SelectStmt fields
            targetList: [
              {
                ResTarget: {
                  val: {
                    ColumnRef: {
                      fields: [
                        { A_Star: {} }
                      ]
                    }
                  }
                }
              }
            ],
            limitOption: 'LIMIT_OPTION_DEFAULT',
            op: 'SETOP_NONE'
          }
        })
      ]
    });

    const astForAst = generateTsAstCodeFromPgAstWithSchema(testAst, runtimeSchema);
    const generatedCode = generate(astForAst).code;
    expect(generatedCode).toMatchSnapshot();
  });
});