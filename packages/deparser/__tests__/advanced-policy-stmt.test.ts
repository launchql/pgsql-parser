import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { RoleSpecType, A_Expr_Kind, DefElemAction, CoercionForm } from '@pgsql/types';

describe('Advanced Policy Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreatePolicyStmt', () => {
    it('should deparse CREATE POLICY statement with basic structure', () => {
      const ast = {
        CreatePolicyStmt: {
          policy_name: 'user_policy',
          table: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          cmd_name: 'SELECT',
          roles: [
            {
              RoleSpec: {
                roletype: "ROLESPEC_CSTRING",
                rolename: 'app_user',
                location: -1
              }
            }
          ],
          qual: {
            A_Expr: {
              kind: "AEXPR_OP",
              name: [{ String: { sval: '=' } }],
              lexpr: {
                ColumnRef: {
                  fields: [{ String: { sval: 'user_id' } }],
                  location: -1
                }
              },
              rexpr: {
                FuncCall: {
                  funcname: [{ String: { sval: 'current_user_id' } }],
                  args: [] as any[],
                  agg_order: null as any,
                  agg_filter: null as any,
                  over: null as any,
                  agg_within_group: false,
                  agg_star: false,
                  agg_distinct: false,
                  func_variadic: false,
                  funcformat: "COERCE_EXPLICIT_CALL",
                  location: -1
                }
              },
              location: -1
            }
          },
          with_check: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE POLICY "user_policy" ON users FOR SELECT TO app_user USING (user_id = current_user_id())');
    });

    it('should deparse CREATE POLICY statement with WITH CHECK clause', () => {
      const ast = {
        CreatePolicyStmt: {
          policy_name: 'insert_policy',
          table: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'documents',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          cmd_name: 'INSERT',
          roles: [
            {
              RoleSpec: {
                roletype: "ROLESPEC_CSTRING",
                rolename: 'editor',
                location: -1
              }
            }
          ],
          qual: null as any,
          with_check: {
            A_Expr: {
              kind: "AEXPR_OP",
              name: [{ String: { sval: '=' } }],
              lexpr: {
                ColumnRef: {
                  fields: [{ String: { sval: 'owner_id' } }],
                  location: -1
                }
              },
              rexpr: {
                FuncCall: {
                  funcname: [{ String: { sval: 'current_user_id' } }],
                  args: [] as any[],
                  agg_order: null as any,
                  agg_filter: null as any,
                  over: null as any,
                  agg_within_group: false,
                  agg_star: false,
                  agg_distinct: false,
                  func_variadic: false,
                  funcformat: "COERCE_EXPLICIT_CALL",
                  location: -1
                }
              },
              location: -1
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE POLICY "insert_policy" ON documents FOR INSERT TO editor WITH CHECK (owner_id = current_user_id())');
    });
  });

  describe('CreateUserMappingStmt', () => {
    it('should deparse CREATE USER MAPPING statement', () => {
      const ast = {
        CreateUserMappingStmt: {
          if_not_exists: false,
          user: {
            RoleSpec: {
              roletype: 'ROLESPEC_CSTRING',
              rolename: 'local_user',
              location: -1
            }
          },
          servername: 'foreign_server',
          options: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'user',
                arg: { String: { sval: 'remote_user' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            },
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'password',
                arg: { String: { sval: 'secret123' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE USER MAPPING FOR local_user SERVER "foreign_server" OPTIONS (user = \'remote_user\', password = \'secret123\')');
    });

    it('should deparse CREATE USER MAPPING IF NOT EXISTS statement', () => {
      const ast = {
        CreateUserMappingStmt: {
          if_not_exists: true,
          user: null as any,
          servername: 'pg_server',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE IF NOT EXISTS USER MAPPING FOR CURRENT_USER SERVER "pg_server"');
    });
  });

  describe('CreateStatsStmt', () => {
    it('should deparse CREATE STATISTICS statement', () => {
      const ast = {
        CreateStatsStmt: {
          if_not_exists: false,
          defnames: [
            { String: { sval: 'my_stats' } }
          ],
          stat_types: [
            { String: { sval: 'ndistinct' } },
            { String: { sval: 'dependencies' } }
          ],
          exprs: [
            {
              ColumnRef: {
                fields: [{ String: { sval: 'col1' } }],
                location: -1
              }
            },
            {
              ColumnRef: {
                fields: [{ String: { sval: 'col2' } }],
                location: -1
              }
            }
          ],
          relations: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'test_table',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE STATISTICS my_stats (ndistinct, dependencies) ON col1, col2 FROM test_table');
    });

    it('should deparse CREATE STATISTICS IF NOT EXISTS statement', () => {
      const ast = {
        CreateStatsStmt: {
          if_not_exists: true,
          defnames: [
            { String: { sval: 'schema' } },
            { String: { sval: 'stats_name' } }
          ],
          stat_types: [] as any[],
          exprs: [
            {
              ColumnRef: {
                fields: [{ String: { sval: 'id' } }],
                location: -1
              }
            }
          ],
          relations: [
            {
              RangeVar: {
                schemaname: 'public',
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE IF NOT EXISTS STATISTICS schema.stats_name ON id FROM public.users');
    });
  });

  describe('CreatePublicationStmt', () => {
    it('should deparse CREATE PUBLICATION statement with specific tables', () => {
      const ast = {
        CreatePublicationStmt: {
          pubname: 'my_publication',
          pubobjects: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            },
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
          for_all_tables: false,
          options: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'publish',
                arg: { String: { sval: 'insert,update,delete' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE PUBLICATION "my_publication" FOR TABLE users, orders WITH (publish = \'insert,update,delete\')');
    });

    it('should deparse CREATE PUBLICATION FOR ALL TABLES statement', () => {
      const ast = {
        CreatePublicationStmt: {
          pubname: 'all_tables_pub',
          pubobjects: [] as any[],
          for_all_tables: true,
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE PUBLICATION "all_tables_pub" FOR ALL TABLES');
    });
  });

  describe('CreateSubscriptionStmt', () => {
    it('should deparse CREATE SUBSCRIPTION statement', () => {
      const ast = {
        CreateSubscriptionStmt: {
          subname: 'my_subscription',
          conninfo: 'host=publisher.example.com port=5432 user=repuser dbname=testdb',
          publication: [
            { String: { sval: 'pub1' } },
            { String: { sval: 'pub2' } }
          ],
          options: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'copy_data',
                arg: { String: { sval: 'false' } },
                defaction: 'DEFELEM_UNSPEC',
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SUBSCRIPTION "my_subscription" CONNECTION \'host=publisher.example.com port=5432 user=repuser dbname=testdb\' PUBLICATION pub1, pub2 WITH (copy_data = \'false\')');
    });

    it('should deparse CREATE SUBSCRIPTION statement without options', () => {
      const ast = {
        CreateSubscriptionStmt: {
          subname: 'simple_sub',
          conninfo: 'host=localhost port=5432',
          publication: [
            { String: { sval: 'main_publication' } }
          ],
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SUBSCRIPTION "simple_sub" CONNECTION \'host=localhost port=5432\' PUBLICATION main_publication');
    });
  });
});
