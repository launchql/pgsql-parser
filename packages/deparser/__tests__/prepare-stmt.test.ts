import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';
import { A_Expr_Kind } from '@pgsql/types';

describe('Prepare Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('PrepareStmt', () => {
    it('should deparse PREPARE statement without parameters', () => {
      const ast = {
        PrepareStmt: {
          name: 'my_query',
          argtypes: [] as any[],
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { A_Star: {} },
                    name: undefined,
                    indirection: null as any,
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: undefined as string | undefined,
                    relname: 'users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ],
              whereClause: null as any,
              groupClause: null as any,
              havingClause: null as any,
              windowClause: null as any,
              valuesLists: null as any,
              sortClause: null as any,
              limitOffset: null as any,
              limitCount: null as any,
              lockingClause: null as any,
              withClause: null as any,
              op: 'SETOP_NONE',
              all: false,
              larg: null as any,
              rarg: null as any
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('PREPARE my_query AS SELECT * FROM users');
    });

    it('should deparse PREPARE statement with parameters', () => {
      const ast = {
        PrepareStmt: {
          name: 'user_query',
          argtypes: [
            {
              TypeName: {
                names: [{ String: { sval: 'integer' } }],
                typemod: -1,
                arrayBounds: null as any,
                location: -1
              }
            },
            {
              TypeName: {
                names: [{ String: { sval: 'text' } }],
                typemod: -1,
                arrayBounds: null as any,
                location: -1
              }
            }
          ],
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { A_Star: {} },
                    name: undefined,
                    indirection: null as any,
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: undefined as string | undefined,
                    relname: 'users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ],
              whereClause: {
                A_Expr: {
                  kind: "AEXPR_OP" as A_Expr_Kind,
                  name: [{ String: { sval: '=' } }],
                  lexpr: {
                    ColumnRef: {
                      fields: [{ String: { sval: 'id' } }],
                      location: -1
                    }
                  },
                  rexpr: {
                    ParamRef: {
                      number: 1,
                      location: -1
                    }
                  },
                  location: -1
                }
              },
              groupClause: null as any,
              havingClause: null as any,
              windowClause: null as any,
              valuesLists: null as any,
              sortClause: null as any,
              limitOffset: null as any,
              limitCount: null as any,
              lockingClause: null as any,
              withClause: null as any,
              op: 'SETOP_NONE',
              all: false,
              larg: null as any,
              rarg: null as any
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('PREPARE user_query (integer, text) AS SELECT * FROM users WHERE id = $1');
    });
  });

  describe('ExecuteStmt', () => {
    it('should deparse EXECUTE statement without parameters', () => {
      const ast = {
        ExecuteStmt: {
          name: 'my_query',
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('EXECUTE my_query');
    });

    it('should deparse EXECUTE statement with parameters', () => {
      const ast = {
        ExecuteStmt: {
          name: 'user_query',
          params: [
            { A_Const: { val: { Integer: { ival: 123 } }, location: -1 } },
            { A_Const: { val: { String: { sval: 'john' } }, location: -1 } }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("EXECUTE user_query (123, 'john')");
    });
  });

  describe('DeallocateStmt', () => {
    it('should deparse DEALLOCATE statement', () => {
      const ast = {
        DeallocateStmt: {
          name: 'my_query',
          isall: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DEALLOCATE my_query');
    });

    it('should deparse DEALLOCATE ALL statement', () => {
      const ast = {
        DeallocateStmt: {
          name: undefined,
          isall: true,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DEALLOCATE ALL');
    });
  });
});
