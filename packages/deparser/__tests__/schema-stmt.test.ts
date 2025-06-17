import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { ObjectType, RoleSpecType, DropBehavior, DropStmt } from '@pgsql/types';

describe('Schema Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateSchemaStmt', () => {
    it('should deparse CREATE SCHEMA statement', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: null as any,
          schemaElts: [] as any[],
          if_not_exists: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA test_schema');
    });

    it('should deparse CREATE SCHEMA IF NOT EXISTS statement', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: null as any,
          schemaElts: [] as any[],
          if_not_exists: true,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA IF NOT EXISTS test_schema');
    });

    it('should deparse CREATE SCHEMA with AUTHORIZATION', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: {
            rolename: 'test_user',
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            location: -1
          },
          schemaElts: [] as any[],
          if_not_exists: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA test_schema AUTHORIZATION test_user');
    });

    it('should deparse CREATE SCHEMA without name (AUTHORIZATION only)', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: undefined as string | undefined,
          authrole: {
            rolename: 'test_user',
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            location: -1
          },
          schemaElts: [] as any[],
          if_not_exists: false,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA AUTHORIZATION test_user');
    });
  });

  describe('DropStmt', () => {
    it('should deparse DROP TABLE statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'users' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users');
    });

    it('should deparse DROP TABLE IF EXISTS statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'users' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: null as any,
          missing_ok: true,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE IF EXISTS users');
    });

    it('should deparse DROP TABLE CASCADE statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'users' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_CASCADE' as DropBehavior,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users CASCADE');
    });

    it('should deparse DROP INDEX CONCURRENTLY statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'idx_users_email' } }] as any
          ],
          removeType: "OBJECT_INDEX" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP INDEX CONCURRENTLY idx_users_email');
    });

    it('should deparse DROP VIEW statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'user_view' } }] as any
          ],
          removeType: "OBJECT_VIEW" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP VIEW user_view');
    });

    it('should deparse DROP FUNCTION statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'calculate_total' } }] as any
          ],
          removeType: "OBJECT_FUNCTION" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP FUNCTION calculate_total');
    });

    it('should deparse DROP multiple objects statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'table1' } }] as any,
            [{ String: { sval: 'table2' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE table1, table2');
    });

    it('should deparse DROP schema-qualified object', () => {
      const ast = {
        DropStmt: {
          objects: [
            [
              { String: { sval: 'public' } },
              { String: { sval: 'users' } }
            ] as any
          ],
          removeType: 'OBJECT_TABLE' as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE public.users');
    });
  });

  describe('TruncateStmt', () => {
    it('should deparse TRUNCATE statement', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as any,
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          restart_seqs: false,
          behavior: null as any,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users');
    });

    it('should deparse TRUNCATE with RESTART IDENTITY', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as any,
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          restart_seqs: true,
          behavior: null as any,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users RESTART IDENTITY');
    });

    it('should deparse TRUNCATE CASCADE', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as any,
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          restart_seqs: false,
          behavior: 'DROP_CASCADE' as DropBehavior,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users CASCADE');
    });

    it('should deparse TRUNCATE multiple tables', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                schemaname: undefined as any,
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            },
            {
              RangeVar: {
                schemaname: undefined as any,
                relname: 'orders',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          restart_seqs: false,
          behavior: null as any,
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users, orders');
    });
  });
});
