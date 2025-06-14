import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';

describe('Set Operation Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('SetOperationStmt', () => {
    it('should deparse UNION statement', () => {
      const ast = {
        SetOperationStmt: {
          op: 'SETOP_UNION',
          all: false,
          larg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'table1',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          rarg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'table2',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          colTypes: [] as any[],
          colTypmods: [] as any[],
          colCollations: [] as any[],
          groupClauses: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SELECT id FROM table1 UNION SELECT id FROM table2');
    });

    it('should deparse UNION ALL statement', () => {
      const ast = {
        SetOperationStmt: {
          op: 'SETOP_UNION',
          all: true,
          larg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'name' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          rarg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'name' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'customers',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          colTypes: [] as any[],
          colTypmods: [] as any[],
          colCollations: [] as any[],
          groupClauses: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SELECT name FROM users UNION ALL SELECT name FROM customers');
    });

    it('should deparse INTERSECT statement', () => {
      const ast = {
        SetOperationStmt: {
          op: 'SETOP_INTERSECT',
          all: false,
          larg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'email' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'active_users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          rarg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'email' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'premium_users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          colTypes: [] as any[],
          colTypmods: [] as any[],
          colCollations: [] as any[],
          groupClauses: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SELECT email FROM active_users INTERSECT SELECT email FROM premium_users');
    });

    it('should deparse EXCEPT statement', () => {
      const ast = {
        SetOperationStmt: {
          op: 'SETOP_EXCEPT',
          all: false,
          larg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'user_id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'all_users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          rarg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'user_id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'banned_users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          colTypes: [] as any[],
          colTypmods: [] as any[],
          colCollations: [] as any[],
          groupClauses: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SELECT user_id FROM all_users EXCEPT SELECT user_id FROM banned_users');
    });

    it('should deparse EXCEPT ALL statement', () => {
      const ast = {
        SetOperationStmt: {
          op: 'SETOP_EXCEPT',
          all: true,
          larg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'product_id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'inventory',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          rarg: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { ColumnRef: { fields: [{ String: { sval: 'product_id' } }] } },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'sold_items',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          colTypes: [] as any[],
          colTypmods: [] as any[],
          colCollations: [] as any[],
          groupClauses: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SELECT product_id FROM inventory EXCEPT ALL SELECT product_id FROM sold_items');
    });
  });

  describe('ReturnStmt', () => {
    it('should deparse RETURN statement with value', () => {
      const ast = {
        ReturnStmt: {
          returnval: {
            A_Const: {
              isnull: false,
              val: { Integer: { ival: 42 } },
              location: -1
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RETURN 42');
    });

    it('should deparse RETURN statement with expression', () => {
      const ast = {
        ReturnStmt: {
          returnval: {
            ColumnRef: {
              fields: [{ String: { sval: 'result' } }],
              location: -1
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RETURN result');
    });

    it('should deparse RETURN statement without value', () => {
      const ast = {
        ReturnStmt: {
          returnval: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RETURN');
    });
  });

  describe('PLAssignStmt', () => {
    it('should deparse simple assignment statement', () => {
      const ast = {
        PLAssignStmt: {
          name: 'counter',
          indirection: [] as any[],
          nnames: 1,
          val: {
            A_Const: {
              isnull: false,
              val: { Integer: { ival: 10 } },
              location: -1
            }
          },
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('counter := 10');
    });

    it('should deparse assignment with array access', () => {
      const ast = {
        PLAssignStmt: {
          name: 'arr',
          indirection: [
            {
              A_Indices: {
                is_slice: false,
                lidx: null as any,
                uidx: {
                  A_Const: {
                    isnull: false,
                    val: { Integer: { ival: 1 } },
                    location: -1
                  }
                }
              }
            }
          ],
          nnames: 1,
          val: {
            A_Const: {
              isnull: false,
              val: { String: { sval: 'value' } },
              location: -1
            }
          },
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('arr[1] := \'value\'');
    });

    it('should deparse assignment with SELECT statement', () => {
      const ast = {
        PLAssignStmt: {
          name: 'user_count',
          indirection: [] as any[],
          nnames: 1,
          val: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: {
                      FuncCall: {
                        funcname: [{ String: { sval: 'count' } }],
                        args: [{ A_Star: {} }],
                        agg_order: [] as any[],
                        agg_filter: null as any,
                        over: null as any,
                        agg_within_group: false,
                        agg_star: true,
                        agg_distinct: false,
                        func_variadic: false,
                        funcformat: 'COERCE_EXPLICIT_CALL',
                        location: -1
                      }
                    },
                    name: null as string | null,
                    indirection: [] as any[],
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  RangeVar: {
                    schemaname: null as string | null,
                    relname: 'users',
                    inh: true,
                    relpersistence: 'p',
                    alias: null as any,
                    location: -1
                  }
                }
              ]
            }
          },
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('user_count := SELECT count(*) FROM users');
    });
  });
});
