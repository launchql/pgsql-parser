import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { ObjectType, CommentStmt, DiscardMode, CoercionForm } from '@pgsql/types';

describe('Maintenance Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CheckPointStmt', () => {
    it('should deparse CHECKPOINT statement', () => {
      const ast = {
        CheckPointStmt: {}
      };
      
      expect(deparser.visit(ast, context)).toBe('CHECKPOINT');
    });
  });

  describe('LoadStmt', () => {
    it('should deparse LOAD statement', () => {
      const ast = {
        LoadStmt: {
          filename: 'pg_stat_statements'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("LOAD 'pg_stat_statements'");
    });

    it('should deparse LOAD statement with path', () => {
      const ast = {
        LoadStmt: {
          filename: '/usr/lib/postgresql/extensions/uuid-ossp'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("LOAD '/usr/lib/postgresql/extensions/uuid-ossp'");
    });

    it('should throw error for LOAD statement without filename', () => {
      const ast = {
        LoadStmt: {
          filename: undefined as any
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('LoadStmt requires filename');
    });
  });

  describe('DiscardStmt', () => {
    it('should deparse DISCARD ALL statement', () => {
      const ast = {
        DiscardStmt: {
          target: 'DISCARD_ALL' as DiscardMode
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DISCARD ALL');
    });

    it('should deparse DISCARD PLANS statement', () => {
      const ast = {
        DiscardStmt: {
          target: 'DISCARD_PLANS' as DiscardMode
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DISCARD PLANS');
    });

    it('should deparse DISCARD SEQUENCES statement', () => {
      const ast = {
        DiscardStmt: {
          target: 'DISCARD_SEQUENCES' as DiscardMode
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DISCARD SEQUENCES');
    });

    it('should deparse DISCARD TEMP statement', () => {
      const ast = {
        DiscardStmt: {
          target: 'DISCARD_TEMP' as DiscardMode
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DISCARD TEMP');
    });

    it('should throw error for unsupported DISCARD target', () => {
      const ast = {
        DiscardStmt: {
          target: 'DISCARD_UNKNOWN' as any
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('Unsupported DiscardStmt target: DISCARD_UNKNOWN');
    });
  });

  describe('CommentStmt', () => {
    it('should deparse COMMENT ON TABLE statement', () => {
      const ast: { CommentStmt: CommentStmt } = {
        CommentStmt: {
          objtype: "OBJECT_TABLE" as ObjectType,
          object: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          comment: 'User information table'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON TABLE users IS 'User information table'");
    });

    it('should deparse COMMENT ON COLUMN statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_COLUMN" as ObjectType,
          object: {
            ColumnRef: {
              fields: [
                { String: { sval: 'users' } },
                { String: { sval: 'email' } }
              ],
              location: -1
            }
          },
          comment: 'User email address'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON COLUMN users.email IS 'User email address'");
    });

    it('should deparse COMMENT ON INDEX statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_INDEX" as ObjectType,
          object: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'idx_users_email',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          comment: 'Index on user email for fast lookups'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON INDEX idx_users_email IS 'Index on user email for fast lookups'");
    });

    it('should deparse COMMENT ON FUNCTION statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_FUNCTION" as ObjectType,
          object: {
            FuncCall: {
              funcname: [{ String: { sval: 'calculate_age' } }],
              args: [] as any[],
              agg_order: null as any,
              agg_filter: null as any,
              over: null as any,
              agg_within_group: false,
              agg_star: false,
              agg_distinct: false,
              func_variadic: false,
              funcformat: "COERCE_EXPLICIT_CALL" as CoercionForm,
              location: -1
            }
          },
          comment: 'Calculates user age from birth date'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON FUNCTION calculate_age() IS 'Calculates user age from birth date'");
    });

    it('should deparse COMMENT ON VIEW statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_VIEW" as ObjectType,
          object: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'active_users',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          comment: 'View showing only active users'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON VIEW active_users IS 'View showing only active users'");
    });

    it('should deparse COMMENT ON SCHEMA statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_SCHEMA" as ObjectType,
          object: {
            String: { sval: 'public' }
          },
          comment: 'Default public schema'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON SCHEMA public IS 'Default public schema'");
    });

    it('should deparse COMMENT ON DATABASE statement', () => {
      const ast = {
        CommentStmt: {
          objtype: "OBJECT_DATABASE" as ObjectType,
          object: {
            String: { sval: 'myapp' }
          },
          comment: 'Main application database'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("COMMENT ON DATABASE myapp IS 'Main application database'");
    });

    it('should deparse COMMENT statement with NULL comment', () => {
      const ast: { CommentStmt: CommentStmt } = {
        CommentStmt: {
          objtype: "OBJECT_TABLE" as ObjectType,
          object: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'temp_table',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          comment: undefined
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COMMENT ON TABLE temp_table IS NULL');
    });
  });

  describe('LockStmt', () => {
    it('should deparse LOCK statement with single table', () => {
      const ast = {
        LockStmt: {
          relations: [
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
          mode: 4, // SHARE mode
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('LOCK users IN SHARE MODE');
    });

    it('should deparse LOCK statement with multiple tables', () => {
      const ast = {
        LockStmt: {
          relations: [
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
          mode: 6, // EXCLUSIVE mode
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('LOCK users, orders IN EXCLUSIVE MODE');
    });

    it('should deparse LOCK statement with NOWAIT', () => {
      const ast = {
        LockStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'products',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          mode: 7, // ACCESS EXCLUSIVE mode
          nowait: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('LOCK products IN ACCESS EXCLUSIVE MODE NOWAIT');
    });

    it('should deparse LOCK statement with ACCESS SHARE mode', () => {
      const ast = {
        LockStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'inventory',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          mode: 0, // ACCESS SHARE mode
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('LOCK inventory IN ACCESS SHARE MODE');
    });

    it('should deparse LOCK statement with ROW EXCLUSIVE mode', () => {
      const ast = {
        LockStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'accounts',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          mode: 2, // ROW EXCLUSIVE mode
          nowait: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('LOCK accounts IN ROW EXCLUSIVE MODE');
    });
  });
});
