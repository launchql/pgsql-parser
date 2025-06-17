import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { DefElemAction, ReindexObjectType } from '@pgsql/types';

describe('Maintenance Operations Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('ClusterStmt', () => {
    it('should deparse CLUSTER statement without table', () => {
      const ast = {
        ClusterStmt: {
          relation: null as any,
          indexname: undefined as string | undefined,
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('CLUSTER');
    });

    it('should deparse CLUSTER statement with table only', () => {
      const ast = {
        ClusterStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          indexname: undefined as string | undefined,
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('CLUSTER users');
    });

    it('should deparse CLUSTER statement with table and index', () => {
      const ast = {
        ClusterStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'orders',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          indexname: 'idx_orders_date',
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('CLUSTER orders USING "idx_orders_date"');
    });

    it('should deparse CLUSTER statement with parameters', () => {
      const ast = {
        ClusterStmt: {
          relation: {
            schemaname: 'public',
            relname: 'products',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          indexname: undefined as string | undefined,
          params: [
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'verbose',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('CLUSTER public.products (verbose = \'true\')');
    });
  });

  describe('VacuumStmt', () => {
    it('should deparse VACUUM statement without options or relations', () => {
      const ast = {
        VacuumStmt: {
          options: [] as any[],
          rels: [] as any[],
          is_vacuumcmd: true
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VACUUM');
    });

    it('should deparse VACUUM statement with options', () => {
      const ast = {
        VacuumStmt: {
          options: [
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'analyze',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'verbose',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ],
          rels: [] as any[],
          is_vacuumcmd: true
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VACUUM (analyze = \'true\', verbose = \'true\')');
    });

    it('should deparse VACUUM statement with specific tables', () => {
      const ast = {
        VacuumStmt: {
          options: [] as any[],
          rels: [
            {
              VacuumRelation: {
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
                oid: 0,
                va_cols: [] as any[]
              }
            },
            {
              VacuumRelation: {
                relation: {
                  RangeVar: {
                    schemaname: undefined as string | undefined,
                    relname: 'orders',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                },
                oid: 0,
                va_cols: [] as any[]
              }
            }
          ],
          is_vacuumcmd: true
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VACUUM users, orders');
    });

    it('should deparse VACUUM statement with table and specific columns', () => {
      const ast = {
        VacuumStmt: {
          options: [] as any[],
          rels: [
            {
              VacuumRelation: {
                relation: {
                  RangeVar: {
                    schemaname: undefined as string | undefined,
                    relname: 'products',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                },
                oid: 0,
                va_cols: [
                  { String: { sval: 'name' } },
                  { String: { sval: 'price' } }
                ]
              }
            }
          ],
          is_vacuumcmd: true
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VACUUM products (name, price)');
    });

    it('should deparse VACUUM statement with options and relations', () => {
      const ast = {
        VacuumStmt: {
          options: [
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'full',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ],
          rels: [
            {
              VacuumRelation: {
                relation: {
                  RangeVar: {
                    schemaname: 'public',
                    relname: 'inventory',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                },
                oid: 0,
                va_cols: [] as any[]
              }
            }
          ],
          is_vacuumcmd: true
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('VACUUM (full = \'true\') public.inventory');
    });
  });

  describe('ExplainStmt', () => {
    it('should deparse EXPLAIN statement with simple query', () => {
      const ast = {
        ExplainStmt: {
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { A_Star: {} },
                    name: undefined as string | undefined,
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
          },
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('EXPLAIN SELECT * FROM users');
    });

    it('should deparse EXPLAIN statement with options', () => {
      const ast = {
        ExplainStmt: {
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: {
                      ColumnRef: {
                        fields: [{ String: { sval: 'id' } }],
                        location: -1
                      }
                    },
                    name: undefined as string | undefined,
                    indirection: null as any,
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: undefined as string | undefined,
                    relname: 'orders',
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
          },
          options: [
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'analyze',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'verbose',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('EXPLAIN (analyze = \'true\', verbose = \'true\') SELECT id FROM orders');
    });
  });

  describe('ReindexStmt', () => {
    it('should deparse REINDEX INDEX statement', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_INDEX',
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'idx_users_email',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          name: undefined as string | undefined,
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX INDEX idx_users_email');
    });

    it('should deparse REINDEX TABLE statement', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_TABLE',
          relation: {
            schemaname: 'public',
            relname: 'products',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          name: undefined as string | undefined,
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX TABLE public.products');
    });

    it('should deparse REINDEX SCHEMA statement', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_SCHEMA',
          relation: null as any,
          name: 'public',
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX SCHEMA "public"');
    });

    it('should deparse REINDEX DATABASE statement', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_DATABASE',
          relation: null as any,
          name: 'myapp',
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX DATABASE "myapp"');
    });

    it('should deparse REINDEX SYSTEM statement', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_SYSTEM',
          relation: null as any,
          name: 'myapp',
          params: [] as any[]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX SYSTEM "myapp"');
    });

    it('should deparse REINDEX statement with parameters', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_INDEX',
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'idx_orders_date',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          name: undefined as string | undefined,
          params: [
            {
              DefElem: {
                defnamespace: undefined as string | undefined,
                defname: 'verbose',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast as any, context)).toBe('REINDEX INDEX idx_orders_date (verbose = \'true\')');
    });

    it('should throw error for unsupported REINDEX kind', () => {
      const ast = {
        ReindexStmt: {
          kind: 'REINDEX_OBJECT_UNKNOWN' as any,
          relation: null as any,
          name: undefined as string | undefined,
          params: [] as any[]
        }
      };
      
      expect(() => deparser.visit(ast as any, context)).toThrow('Unsupported ReindexStmt kind: REINDEX_OBJECT_UNKNOWN');
    });
  });
});
