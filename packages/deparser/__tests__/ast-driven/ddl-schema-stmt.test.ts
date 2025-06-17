import { Deparser } from '../../src/deparser';
import { DeparserContext } from '../../src/visitors/base';
import { ObjectType, RoleSpecType, DropBehavior, CoercionForm, AlterTableType } from '@pgsql/types';

describe('DDL Schema Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateSchemaStmt', () => {
    it('should deparse CREATE SCHEMA statement', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: null as any,
          schemaElts: [] as any[],
          if_not_exists: false
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
          if_not_exists: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA IF NOT EXISTS test_schema');
    });

    it('should deparse CREATE SCHEMA with AUTHORIZATION', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: 'test_schema',
          authrole: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'test_user',
            location: -1
          },
          schemaElts: [] as any[],
          if_not_exists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA test_schema AUTHORIZATION test_user');
    });

    it('should deparse CREATE SCHEMA without schema name', () => {
      const ast = {
        CreateSchemaStmt: {
          schemaname: undefined as string | undefined,
          authrole: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'test_user',
            location: -1
          },
          schemaElts: [] as any[],
          if_not_exists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE SCHEMA AUTHORIZATION test_user');
    });
  });

  describe('DropStmt', () => {
    it('should deparse DROP TABLE statement', () => {
      const ast = {
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

    it('should deparse DROP TABLE CASCADE statement', () => {
      const ast = {
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

    it('should deparse DROP TABLE RESTRICT statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'users' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: 'DROP_RESTRICT' as DropBehavior,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users RESTRICT');
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

    it('should deparse DROP INDEX statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'idx_users_email' } }] as any
          ],
          removeType: "OBJECT_INDEX" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP INDEX idx_users_email');
    });

    it('should deparse DROP SCHEMA statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            {
              String: { sval: 'test_schema' }
            }
          ],
          removeType: "OBJECT_SCHEMA" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("DROP SCHEMA test_schema");
    });

    it('should deparse DROP DATABASE statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            {
              String: { sval: 'test_db' }
            }
          ],
          removeType: "OBJECT_DATABASE" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("DROP DATABASE test_db");
    });

    it('should deparse DROP FUNCTION statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'calculate_age' } }] as any
          ],
          removeType: "OBJECT_FUNCTION" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP FUNCTION calculate_age');
    });

    it('should deparse DROP multiple tables statement', () => {
      const ast = {
        DropStmt: {
          objects: [
            [{ String: { sval: 'users' } }] as any,
            [{ String: { sval: 'orders' } }] as any
          ],
          removeType: "OBJECT_TABLE" as ObjectType,
          behavior: null as any,
          missing_ok: false,
          concurrent: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLE users, orders');
    });
  });

  describe('AlterTableStmt', () => {
    it('should deparse ALTER TABLE statement', () => {
      const ast = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as any,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_AddColumn' as AlterTableType,
                name: 'email',
                def: {
                  ColumnDef: {
                    colname: 'email',
                    typeName: {
                      names: [{ String: { sval: 'varchar' } }],
                      typemod: -1,
                      arrayBounds: null as any,
                      location: -1
                    },
                    inhcount: 0,
                    is_local: true,
                    is_not_null: false,
                    is_from_type: false,
                    storage: '\0',
                    raw_default: null as any,
                    cooked_default: null as any,
                    identity: '\0',
                    identitySequence: null as any,
                    generated: '\0',
                    collClause: null as any,
                    collOid: 0,
                    constraints: [] as any[],
                    fdwoptions: null as any,
                    location: -1
                  }
                },
                newowner: null as any,
                behavior: 'DROP_RESTRICT' as DropBehavior,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_TABLE" as ObjectType
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE users ADD COLUMN email varchar');
    });

    it('should deparse ALTER VIEW statement', () => {
      const ast = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as any,
            relname: 'user_view',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_SetRelOptions' as AlterTableType,
                name: undefined as any,
                def: null as any,
                newowner: null as any,
                behavior: 'DROP_RESTRICT' as DropBehavior,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_VIEW" as ObjectType
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER VIEW user_view SET ()');
    });

    it('should deparse ALTER MATERIALIZED VIEW statement', () => {
      const ast = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as any,
            relname: 'mat_view',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [] as any[],
          objtype: "OBJECT_MATVIEW" as ObjectType
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER MATERIALIZED VIEW mat_view');
    });

    it('should deparse ALTER TABLE with multiple commands', () => {
      const ast = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as any,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_AddColumn' as AlterTableType,
                name: 'email',
                def: {
                  ColumnDef: {
                    colname: 'email',
                    typeName: {
                      names: [{ String: { sval: 'varchar' } }],
                      typemod: -1,
                      arrayBounds: null as any,
                      location: -1
                    },
                    inhcount: 0,
                    is_local: true,
                    is_not_null: false,
                    is_from_type: false,
                    storage: '\0',
                    raw_default: null as any,
                    cooked_default: null as any,
                    identity: '\0',
                    identitySequence: null as any,
                    generated: '\0',
                    collClause: null as any,
                    collOid: 0,
                    constraints: [] as any[],
                    fdwoptions: null as any,
                    location: -1
                  }
                },
                newowner: null as any,
                behavior: 'DROP_RESTRICT' as DropBehavior,
                missing_ok: false
              }
            },
            {
              AlterTableCmd: {
                subtype: 'AT_DropColumn' as AlterTableType,
                name: 'old_column',
                def: null as any,
                newowner: null as any,
                behavior: 'DROP_CASCADE' as DropBehavior,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_TABLE" as ObjectType
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE users ADD COLUMN email varchar, DROP COLUMN old_column CASCADE');
    });
  });
});
