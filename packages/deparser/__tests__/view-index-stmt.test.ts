import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';
import { A_Expr_Kind } from '@pgsql/types';

describe('View and Index Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('NamedArgExpr', () => {
    it('should deparse named argument expression', () => {
      const ast = {
        NamedArgExpr: {
          xpr: null as any,
          arg: { String: { sval: 'test_value' } },
          name: 'param_name',
          argnumber: 1,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('param_name => test_value');
    });

    it('should deparse named argument without name', () => {
      const ast = {
        NamedArgExpr: {
          xpr: null as any,
          arg: { Integer: { ival: 42 } },
          name: undefined,
          argnumber: 1,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('42');
    });

    it('should deparse named argument with complex expression', () => {
      const ast = {
        NamedArgExpr: {
          xpr: null as any,
          arg: {
            A_Const: {
              isnull: false,
              sval: 'complex_value',
              location: -1
            }
          },
          name: 'complex_param',
          argnumber: 1,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('complex_param => \'complex_value\'');
    });
  });

  describe('ViewStmt', () => {
    it('should deparse CREATE VIEW statement', () => {
      const ast = {
        ViewStmt: {
          view: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'test_view',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          aliases: undefined,
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    name: undefined,
                    indirection: undefined,
                    val: { A_Star: {} },
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
              groupClause: undefined,
              havingClause: null as any,
              windowClause: undefined,
              distinctClause: undefined,
              intoClause: null as any,
              sortClause: undefined,
              limitOffset: null as any,
              limitCount: null as any,
              limitOption: null as any,
              lockingClause: undefined,
              withClause: null as any,
              op: null as any,
              all: false,
              larg: null as any,
              rarg: null as any
            }
          },
          replace: false,
          options: undefined,
          withCheckOption: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE VIEW test_view AS SELECT * FROM users');
    });

    it('should deparse CREATE OR REPLACE VIEW statement', () => {
      const ast = {
        ViewStmt: {
          view: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'test_view',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          aliases: undefined,
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    name: undefined,
                    indirection: undefined,
                    val: { A_Star: {} },
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
              groupClause: undefined,
              havingClause: null as any,
              windowClause: undefined,
              distinctClause: undefined,
              intoClause: null as any,
              sortClause: undefined,
              limitOffset: null as any,
              limitCount: null as any,
              limitOption: null as any,
              lockingClause: undefined,
              withClause: null as any,
              op: null as any,
              all: false,
              larg: null as any,
              rarg: null as any
            }
          },
          replace: true,
          options: undefined,
          withCheckOption: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE OR REPLACE VIEW test_view AS SELECT * FROM users');
    });

    it('should deparse VIEW with column aliases', () => {
      const ast = {
        ViewStmt: {
          view: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'test_view',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          aliases: [
            { String: { sval: 'col1' } },
            { String: { sval: 'col2' } }
          ],
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    name: undefined,
                    indirection: undefined,
                    val: { A_Star: {} },
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
              groupClause: undefined,
              havingClause: null as any,
              windowClause: undefined,
              distinctClause: undefined,
              intoClause: null as any,
              sortClause: undefined,
              limitOffset: null as any,
              limitCount: null as any,
              limitOption: null as any,
              lockingClause: undefined,
              withClause: null as any,
              op: null as any,
              all: false,
              larg: null as any,
              rarg: null as any
            }
          },
          replace: false,
          options: undefined,
          withCheckOption: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE VIEW test_view (col1, col2) AS SELECT * FROM users');
    });

    it('should deparse VIEW with CHECK OPTION', () => {
      const ast = {
        ViewStmt: {
          view: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'test_view',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          aliases: undefined,
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    name: undefined,
                    indirection: undefined,
                    val: { A_Star: {} },
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
              groupClause: undefined,
              havingClause: null as any,
              windowClause: undefined,
              distinctClause: undefined,
              intoClause: null as any,
              sortClause: undefined,
              limitOffset: null as any,
              limitCount: null as any,
              limitOption: null as any,
              lockingClause: undefined,
              withClause: null as any,
              op: null as any,
              all: false,
              larg: null as any,
              rarg: null as any
            }
          },
          replace: false,
          options: undefined,
          withCheckOption: 'CASCADED_CHECK_OPTION'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE VIEW test_view AS SELECT * FROM users WITH CASCADED CHECK OPTION');
    });
  });

  describe('IndexStmt', () => {
    it('should deparse CREATE INDEX statement', () => {
      const ast = {
        IndexStmt: {
          idxname: 'idx_users_email',
          relation: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          accessMethod: 'btree',
          tableSpace: undefined,
          indexParams: [
            {
              IndexElem: {
                name: 'email',
                expr: null as any,
                indexcolname: undefined,
                collation: undefined,
                opclass: undefined,
                opclassopts: undefined,
                ordering: null as any,
                nulls_ordering: null as any
              }
            }
          ],
          indexIncludingParams: undefined,
          options: undefined,
          whereClause: null as any,
          excludeOpNames: undefined,
          idxcomment: undefined,
          indexOid: 0,
          oldNumber: 0,
          oldCreateSubid: 0,
          oldFirstRelfilelocatorSubid: 0,
          unique: false,
          nulls_not_distinct: false,
          primary: false,
          isconstraint: false,
          deferrable: false,
          initdeferred: false,
          transformed: false,
          concurrent: false,
          if_not_exists: false,
          reset_default_tblspc: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE INDEX idx_users_email ON users (email)');
    });

    it('should deparse CREATE UNIQUE INDEX statement', () => {
      const ast = {
        IndexStmt: {
          idxname: 'idx_users_email_unique',
          relation: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          accessMethod: 'btree',
          tableSpace: undefined,
          indexParams: [
            {
              IndexElem: {
                name: 'email',
                expr: null as any,
                indexcolname: undefined,
                collation: undefined,
                opclass: undefined,
                opclassopts: undefined,
                ordering: null as any,
                nulls_ordering: null as any
              }
            }
          ],
          indexIncludingParams: undefined,
          options: undefined,
          whereClause: null as any,
          excludeOpNames: undefined,
          idxcomment: undefined,
          indexOid: 0,
          oldNumber: 0,
          oldCreateSubid: 0,
          oldFirstRelfilelocatorSubid: 0,
          unique: true,
          nulls_not_distinct: false,
          primary: false,
          isconstraint: false,
          deferrable: false,
          initdeferred: false,
          transformed: false,
          concurrent: false,
          if_not_exists: false,
          reset_default_tblspc: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE UNIQUE INDEX idx_users_email_unique ON users (email)');
    });

    it('should deparse CREATE INDEX CONCURRENTLY statement', () => {
      const ast = {
        IndexStmt: {
          idxname: 'idx_users_name',
          relation: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          accessMethod: 'btree',
          tableSpace: undefined,
          indexParams: [
            {
              IndexElem: {
                name: 'name',
                expr: null as any,
                indexcolname: undefined,
                collation: undefined,
                opclass: undefined,
                opclassopts: undefined,
                ordering: null as any,
                nulls_ordering: null as any
              }
            }
          ],
          indexIncludingParams: undefined,
          options: undefined,
          whereClause: null as any,
          excludeOpNames: undefined,
          idxcomment: undefined,
          indexOid: 0,
          oldNumber: 0,
          oldCreateSubid: 0,
          oldFirstRelfilelocatorSubid: 0,
          unique: false,
          nulls_not_distinct: false,
          primary: false,
          isconstraint: false,
          deferrable: false,
          initdeferred: false,
          transformed: false,
          concurrent: true,
          if_not_exists: false,
          reset_default_tblspc: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE INDEX CONCURRENTLY idx_users_name ON users (name)');
    });

    it('should deparse CREATE INDEX with WHERE clause', () => {
      const ast = {
        IndexStmt: {
          idxname: 'idx_users_active',
          relation: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          accessMethod: 'btree',
          tableSpace: undefined,
          indexParams: [
            {
              IndexElem: {
                name: 'id',
                expr: null as any,
                indexcolname: undefined,
                collation: undefined,
                opclass: undefined,
                opclassopts: undefined,
                ordering: null as any,
                nulls_ordering: null as any
              }
            }
          ],
          indexIncludingParams: undefined,
          options: undefined,
          whereClause: {
            A_Expr: {
              kind: "AEXPR_OP",
              name: [{ String: { sval: '=' } }],
              lexpr: {
                ColumnRef: {
                  fields: [{ String: { sval: 'active' } }],
                  location: -1
                }
              },
              rexpr: {
                A_Const: {
                  isnull: false,
                  boolval: { Boolean: { boolval: true } },
                  location: -1
                }
              },
              location: -1
            }
          },
          excludeOpNames: undefined,
          idxcomment: undefined,
          indexOid: 0,
          oldNumber: 0,
          oldCreateSubid: 0,
          oldFirstRelfilelocatorSubid: 0,
          unique: false,
          nulls_not_distinct: false,
          primary: false,
          isconstraint: false,
          deferrable: false,
          initdeferred: false,
          transformed: false,
          concurrent: false,
          if_not_exists: false,
          reset_default_tblspc: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE INDEX idx_users_active ON users (id) WHERE active = true');
    });
  });
});
