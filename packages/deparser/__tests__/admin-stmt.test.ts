import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';
import { RoleSpecType, CoercionForm, ObjectType, CallStmt, CreatedbStmt, DropdbStmt, RenameStmt, AlterOwnerStmt, DefElem, DefElemAction } from '@pgsql/types';

describe('Administrative Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CallStmt', () => {
    it('should deparse CALL statement with function call', () => {
      const ast: { CallStmt: CallStmt } = {
        CallStmt: {
          funccall: {
            funcname: [{ String: { sval: 'my_procedure' } }],
            args: [
              { A_Const: { ival: { ival: 123 }, location: -1 } },
              { A_Const: { sval: { sval: 'test' }, location: -1 } }
            ],
            funcformat: "COERCE_EXPLICIT_CALL",
            location: -1
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CALL my_procedure(123, \'test\')');
    });

    it('should deparse CALL statement with function expression', () => {
      const ast: { CallStmt: CallStmt } = {
        CallStmt: {
          funccall: null as any,
          funcexpr: {
            funcid: 12345,
            funcresulttype: 2278,
            funcretset: false,
            funcvariadic: false,
            funcformat: "COERCE_EXPLICIT_CALL",
            funccollid: 0,
            inputcollid: 0,
            args: [] as any[],
            location: -1
          },
          outargs: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CALL func_12345()');
    });

    it('should throw error for CALL statement without function', () => {
      const ast = {
        CallStmt: {
          funccall: null as any,
          funcexpr: null as any,
          outargs: [] as any[]
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('CallStmt requires either funccall or funcexpr');
    });
  });

  describe('CreatedbStmt', () => {
    it('should deparse CREATE DATABASE statement', () => {
      const ast: { CreatedbStmt: CreatedbStmt } = {
        CreatedbStmt: {
          dbname: 'myapp'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE DATABASE "myapp"');
      
      const correctAst = parse('CREATE DATABASE "myapp"');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse CREATE DATABASE statement with options', () => {
      const ast: { CreatedbStmt: CreatedbStmt } = {
        CreatedbStmt: {
          dbname: 'testdb',
          options: [
            {
              DefElem: {
                defname: 'owner',
                arg: { String: { sval: 'postgres' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'encoding',
                arg: { String: { sval: 'UTF8' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE DATABASE "testdb" WITH owner = \'postgres\' encoding = \'UTF8\'');
      
      const correctAst = parse('CREATE DATABASE "testdb" WITH owner = \'postgres\' encoding = \'UTF8\'');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should throw error for CREATE DATABASE without dbname', () => {
      const ast: { CreatedbStmt: CreatedbStmt } = {
        CreatedbStmt: {
          dbname: undefined as any,
          options: [] as any[]
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('CreatedbStmt requires dbname');
    });
  });

  describe('DropdbStmt', () => {
    it('should deparse DROP DATABASE statement', () => {
      const ast = {
        DropdbStmt: {
          dbname: 'olddb'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP DATABASE "olddb"');
      
      const correctAst = parse('DROP DATABASE "olddb"');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP DATABASE IF EXISTS statement', () => {
      const ast = {
        DropdbStmt: {
          dbname: 'tempdb',
          missing_ok: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP DATABASE IF EXISTS "tempdb"');
      
      const correctAst = parse('DROP DATABASE IF EXISTS "tempdb"');
      expect(cleanTree(ast)).toEqual(cleanTree(correctAst.stmts![0].stmt));
    });

    it('should deparse DROP DATABASE statement with options', () => {
      const ast: { DropdbStmt: DropdbStmt } = {
        DropdbStmt: {
          dbname: 'testdb',
          missing_ok: false,
          options: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'force',
                arg: { String: { sval: 'true' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP DATABASE "testdb" WITH force = \'true\'');
    });

    it('should throw error for DROP DATABASE without dbname', () => {
      const ast: { DropdbStmt: DropdbStmt } = {
        DropdbStmt: {
          dbname: undefined as any,
          missing_ok: false,
          options: [] as any[]
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('DropdbStmt requires dbname');
    });
  });

  describe('RenameStmt', () => {
    it('should deparse ALTER TABLE RENAME TO statement', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: "OBJECT_TABLE",
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'old_table',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          newname: 'new_table',
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE old_table RENAME TO "new_table"');
    });

    it('should deparse ALTER TABLE RENAME COLUMN statement', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: "OBJECT_COLUMN",
          relationType: null as any,
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          object: null as any,
          subname: 'old_column',
          newname: 'new_column',
          behavior: null as any,
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE users RENAME COLUMN "old_column" TO "new_column"');
    });

    it('should deparse ALTER SCHEMA RENAME TO statement', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: "OBJECT_SCHEMA",
          relationType: null as any,
          relation: null as any,
          object: {
            String: { sval: 'old_schema' }
          },
          subname: undefined,
          newname: 'new_schema',
          behavior: null as any,
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER SCHEMA old_schema RENAME TO "new_schema"');
    });

    it('should deparse ALTER VIEW IF EXISTS RENAME TO statement', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: "OBJECT_VIEW",
          relationType: null as any,
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'old_view',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          object: null as any,
          subname: undefined,
          newname: 'new_view',
          behavior: null as any,
          missing_ok: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER VIEW IF EXISTS old_view RENAME TO "new_view"');
    });

    it('should throw error for unsupported rename type', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: 'OBJECT_UNKNOWN' as any,
          relationType: null as any,
          relation: null as any,
          object: null as any,
          subname: undefined,
          newname: 'new_name',
          behavior: null as any,
          missing_ok: false
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('Unsupported RenameStmt renameType: OBJECT_UNKNOWN');
    });

    it('should throw error for RENAME without newname', () => {
      const ast: { RenameStmt: RenameStmt } = {
        RenameStmt: {
          renameType: "OBJECT_TABLE",
          relationType: null as any,
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'test_table',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          object: null as any,
          subname: undefined,
          newname: undefined,
          behavior: null as any,
          missing_ok: false
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('RenameStmt requires newname');
    });
  });

  describe('AlterOwnerStmt', () => {
    it('should deparse ALTER TABLE OWNER TO statement', () => {
      const ast: { AlterOwnerStmt: AlterOwnerStmt } = {
        AlterOwnerStmt: {
          objectType: "OBJECT_TABLE",
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          object: null as any,
          newowner: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'new_owner',
            location: -1
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE users OWNER TO new_owner');
    });

    it('should deparse ALTER SCHEMA OWNER TO statement', () => {
      const ast: { AlterOwnerStmt: AlterOwnerStmt } = {
        AlterOwnerStmt: {
          objectType: "OBJECT_SCHEMA",
          relation: null as any,
          object: {
            String: { sval: 'public' }
          },
          newowner: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'schema_owner',
            location: -1
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER SCHEMA public OWNER TO schema_owner');
    });

    it('should deparse ALTER DATABASE OWNER TO statement', () => {
      const ast: { AlterOwnerStmt: AlterOwnerStmt } = {
        AlterOwnerStmt: {
          objectType: "OBJECT_DATABASE",
          relation: null as any,
          object: {
            String: { sval: 'myapp' }
          },
          newowner: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'db_admin',
            location: -1
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER DATABASE myapp OWNER TO db_admin');
    });

    it('should throw error for unsupported object type', () => {
      const ast: { AlterOwnerStmt: AlterOwnerStmt } = {
        AlterOwnerStmt: {
          objectType: 'OBJECT_UNKNOWN' as any,
          relation: null as any,
          object: null as any,
          newowner: {
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            rolename: 'owner',
            location: -1
          }
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('Unsupported AlterOwnerStmt objectType: OBJECT_UNKNOWN');
    });

    it('should throw error for ALTER OWNER without newowner', () => {
      const ast: { AlterOwnerStmt: AlterOwnerStmt } = {
        AlterOwnerStmt: {
          objectType: "OBJECT_TABLE",
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'test_table',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          object: null as any,
          newowner: null as any
        }
      };
      
      expect(() => deparser.visit(ast, context)).toThrow('AlterOwnerStmt requires newowner');
    });
  });
});
