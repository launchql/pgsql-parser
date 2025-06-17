import { Deparser } from '../src/deparser';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';
import { CreateSchemaStmt, DropStmt, TruncateStmt, DropBehavior, ObjectType } from '@pgsql/types';

describe('DDL Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context = {};

  describe('CreateSchemaStmt', () => {
    it('should deparse CREATE SCHEMA statement', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA test_schema');
      
      const correctAst = parse('CREATE SCHEMA test_schema');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse CREATE SCHEMA IF NOT EXISTS statement', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          if_not_exists: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA IF NOT EXISTS test_schema');
      
      const correctAst = parse('CREATE SCHEMA IF NOT EXISTS test_schema');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse CREATE SCHEMA with AUTHORIZATION', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'test_user',
            location: 40
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA test_schema AUTHORIZATION test_user');
    });

    it('should deparse CREATE SCHEMA without name (AUTHORIZATION only)', () => {
      const ast = {
        CreateSchemaStmt: {
          authrole: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'test_user',
            location: 28
          }
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
            {
              List: {
                items: [
                  { String: { sval: 'users' } }
                ]
              }
            }
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users RESTRICT');
      
      const correctAst = parse('DROP TABLE users RESTRICT');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP TABLE IF EXISTS statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            {
              List: {
                items: [
                  { String: { sval: 'users' } }
                ]
              }
            }
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior,
          missing_ok: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE IF EXISTS users RESTRICT');
      
      const correctAst = parse('DROP TABLE IF EXISTS users RESTRICT');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP TABLE CASCADE statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            {
              List: {
                items: [
                  { String: { sval: 'users' } }
                ]
              }
            }
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_CASCADE' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users CASCADE');
      
      const correctAst = parse('DROP TABLE users CASCADE');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP INDEX CONCURRENTLY statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            {
              List: {
                items: [
                  { String: { sval: 'idx_users_email' } }
                ]
              }
            }
          ],
          removeType: "OBJECT_INDEX" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior,
          concurrent: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP INDEX CONCURRENTLY idx_users_email RESTRICT');
    });

    it('should deparse DROP SCHEMA statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            { String: { sval: 'test_schema' } }
          ],
          removeType: "OBJECT_SCHEMA" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP SCHEMA test_schema RESTRICT');
      
      const correctAst = parse('DROP SCHEMA test_schema RESTRICT');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP multiple objects statement', () => {
      const ast: { DropStmt: DropStmt } = {
        DropStmt: {
          objects: [
            {
              List: {
                items: [
                  { String: { sval: 'table1' } }
                ]
              }
            },
            {
              List: {
                items: [
                  { String: { sval: 'table2' } }
                ]
              }
            }
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE table1, table2 RESTRICT');
    });

    it('should throw error for unsupported DROP object type', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'test' } }]
          ],
          removeType: 'INVALID_TYPE',
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('Unsupported DROP object type: INVALID_TYPE');
    });
  });

  describe('TruncateStmt', () => {
    it('should deparse TRUNCATE statement', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                location: 9
              }
            }
          ],
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users');
      
      const correctAst = parse('TRUNCATE users');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse TRUNCATE RESTART IDENTITY statement', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                location: 9
              }
            }
          ],
          restart_seqs: true,
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users RESTART IDENTITY');
      
      const correctAst = parse('TRUNCATE users RESTART IDENTITY');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse TRUNCATE CASCADE statement', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                location: 9
              }
            }
          ],
          behavior: 'DROP_CASCADE' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users CASCADE');
      
      const correctAst = parse('TRUNCATE users CASCADE');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse TRUNCATE multiple tables statement', () => {
      const ast = {
        TruncateStmt: {
          relations: [
            {
              RangeVar: {
                relname: 'users',
                inh: true,
                relpersistence: 'p',
                location: 9
              }
            },
            {
              RangeVar: {
                relname: 'orders',
                inh: true,
                relpersistence: 'p',
                location: 16
              }
            }
          ],
          behavior: 'DROP_RESTRICT' as DropBehavior
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('TRUNCATE users, orders');
      
      const correctAst = parse('TRUNCATE users, orders');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });
  });
});
