import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { DefElemAction } from '@pgsql/types';

describe('Type Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateEnumStmt', () => {
    it('should deparse CREATE TYPE AS ENUM statement', () => {
      const ast = {
        CreateEnumStmt: {
          typeName: [{ String: { sval: 'status_type' } }],
          vals: [
            { String: { sval: 'active' } },
            { String: { sval: 'inactive' } },
            { String: { sval: 'pending' } }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("CREATE TYPE status_type AS ENUM ('active', 'inactive', 'pending')");
    });

    it('should deparse schema-qualified enum type', () => {
      const ast = {
        CreateEnumStmt: {
          typeName: [
            { String: { sval: 'public' } },
            { String: { sval: 'priority_type' } }
          ],
          vals: [
            { String: { sval: 'low' } },
            { String: { sval: 'medium' } },
            { String: { sval: 'high' } }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("CREATE TYPE public.priority_type AS ENUM ('low', 'medium', 'high')");
    });

    it('should deparse empty enum type', () => {
      const ast = {
        CreateEnumStmt: {
          typeName: [{ String: { sval: 'empty_type' } }],
          vals: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TYPE empty_type AS ENUM ()');
    });
  });

  describe('CreateDomainStmt', () => {
    it('should deparse CREATE DOMAIN statement', () => {
      const ast = {
        CreateDomainStmt: {
          domainname: [{ String: { sval: 'email_domain' } }],
          typeName: {
            names: [{ String: { sval: 'varchar' } }],
            typemod: -1
          },
          collClause: null as any,
          constraints: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE DOMAIN email_domain AS varchar');
    });

    it('should deparse schema-qualified domain', () => {
      const ast = {
        CreateDomainStmt: {
          domainname: [
            { String: { sval: 'public' } },
            { String: { sval: 'positive_int' } }
          ],
          typeName: {
            names: [{ String: { sval: 'integer' } }],
            typemod: -1
          },
          collClause: null as any,
          constraints: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE DOMAIN public.positive_int AS integer');
    });

    it('should deparse domain with type modifier', () => {
      const ast = {
        CreateDomainStmt: {
          domainname: [{ String: { sval: 'short_text' } }],
          typeName: {
            names: [{ String: { sval: 'varchar' } }],
            typemod: 164
          },
          collClause: null as any,
          constraints: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE DOMAIN short_text AS varchar(100)');
    });
  });

  describe('CreateRoleStmt', () => {
    it('should deparse CREATE ROLE statement', () => {
      const ast = {
        CreateRoleStmt: {
          stmt_type: 'ROLESTMT_ROLE',
          role: 'test_role',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE ROLE test_role');
    });

    it('should deparse CREATE USER statement', () => {
      const ast = {
        CreateRoleStmt: {
          stmt_type: 'ROLESTMT_USER',
          role: 'test_user',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE USER test_user');
    });

    it('should deparse CREATE GROUP statement', () => {
      const ast = {
        CreateRoleStmt: {
          stmt_type: 'ROLESTMT_GROUP',
          role: 'test_group',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE GROUP test_group');
    });

    it('should deparse CREATE ROLE with options', () => {
      const ast = {
        CreateRoleStmt: {
          stmt_type: 'ROLESTMT_ROLE',
          role: 'admin_role',
          options: [
            {
              DefElem: {
                defname: 'login',
                arg: { Boolean: { boolval: true } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'superuser',
                arg: { Boolean: { boolval: true } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE ROLE admin_role LOGIN SUPERUSER');
    });
  });
});
