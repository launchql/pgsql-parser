import ast from '../test-utils/utils/asts';
import { generateTsAstCodeFromPgAst } from '../src/utils'
import generate from '@babel/generator';

it('AST to AST to create AST — meta 🤯', () => {
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
            relname: 'some_amazing_table',
            inh: true,
            relpersistence: 'p'
          })
        ],
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
      });

      expect(selectStmt).toMatchSnapshot();
      
      const astForAst = generateTsAstCodeFromPgAst(selectStmt);
      expect(generate(astForAst).code).toMatchSnapshot();
      expect(generate(astForAst).code).toEqual(
`ast.selectStmt({
  targetList: [ast.resTarget({
    val: ast.columnRef({
      fields: [ast.aStar({})]
    })
  })],
  fromClause: [ast.rangeVar({
    relname: "some_amazing_table",
    inh: true,
    relpersistence: "p"
  })],
  limitOption: "LIMIT_OPTION_DEFAULT",
  op: "SETOP_NONE"
})`);

})

it('works', () => {
    const parsedResult = [
        {
          "RawStmt": {
            "stmt": {
              "SelectStmt": {
                "targetList": [
                  {
                    "ResTarget": {
                      "val": {
                        "ColumnRef": {
                          "fields": [
                            {
                              "A_Star": {}
                            }
                          ],
                          "location": 7
                        }
                      },
                      "location": 7
                    }
                  }
                ],
                "fromClause": [
                  {
                    "RangeVar": {
                      "relname": "my_table",
                      "inh": true,
                      "relpersistence": "p",
                      "location": 14
                    }
                  }
                ],
                "whereClause": {
                  "A_Expr": {
                    "kind": "AEXPR_OP",
                    "name": [
                      {
                        "String": {
                          "str": "="
                        }
                      }
                    ],
                    "lexpr": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "id"
                            }
                          }
                        ],
                        "location": 29
                      }
                    },
                    "rexpr": {
                      "A_Const": {
                        "val": {
                          "Integer": {
                            "ival": 1
                          }
                        },
                        "location": 34
                      }
                    },
                    "location": 32
                  }
                },
                "limitOption": "LIMIT_OPTION_DEFAULT",
                "op": "SETOP_NONE"
              }
            },
            "stmt_location": 0
          }
        }
      ];

      const astForAst = generateTsAstCodeFromPgAst(parsedResult[0].RawStmt.stmt);
      expect(generate(astForAst).code).toMatchSnapshot();

})