import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { ObjectType, RoleSpecType, DropBehavior, CoercionForm } from '@pgsql/types';

describe('Security Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('GrantStmt', () => {
    it('should deparse GRANT ALL PRIVILEGES statement', () => {
      const ast = {
        GrantStmt: {
          is_grant: true,
          targtype: 'ACL_TARGET_OBJECT',
          privileges: [] as any[],
          objects: [
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
          grantees: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'app_user',
                location: -1
              }
            }
          ],
          grant_option: false,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('GRANT ALL PRIVILEGES ON users TO app_user');
    });

    it('should deparse GRANT specific privileges statement', () => {
      const ast = {
        GrantStmt: {
          is_grant: true,
          targtype: 'ACL_TARGET_OBJECT',
          privileges: [
            { String: { sval: 'SELECT' } },
            { String: { sval: 'INSERT' } }
          ],
          objects: [
            {
              RangeVar: {
                schemaname: 'public',
                relname: 'orders',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          grantees: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'read_user',
                location: -1
              }
            }
          ],
          grant_option: true,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('GRANT SELECT, INSERT ON public.orders TO read_user WITH GRANT OPTION');
    });

    it('should deparse REVOKE statement', () => {
      const ast = {
        GrantStmt: {
          is_grant: false,
          targtype: 'ACL_TARGET_OBJECT',
          privileges: [
            { String: { sval: 'DELETE' } }
          ],
          objects: [
            {
              RangeVar: {
                schemaname: undefined as string | undefined,
                relname: 'sensitive_data',
                inh: true,
                relpersistence: 'p',
                alias: null as any,
                location: -1
              }
            }
          ],
          grantees: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'temp_user',
                location: -1
              }
            }
          ],
          grant_option: false,
          behavior: 'DROP_CASCADE'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('REVOKE DELETE ON sensitive_data FROM temp_user CASCADE');
    });

    it('should deparse GRANT ALL TABLES IN SCHEMA statement', () => {
      const ast = {
        GrantStmt: {
          is_grant: true,
          targtype: 'ACL_TARGET_ALL_IN_SCHEMA',
          privileges: [
            { String: { sval: 'SELECT' } }
          ],
          objects: [
            { String: { sval: 'public' } }
          ],
          grantees: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'readonly_user',
                location: -1
              }
            }
          ],
          grant_option: false,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user');
    });
  });

  describe('GrantRoleStmt', () => {
    it('should deparse GRANT role statement', () => {
      const ast = {
        GrantRoleStmt: {
          is_grant: true,
          granted_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'admin_role',
                location: -1
              }
            }
          ],
          grantee_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'user1',
                location: -1
              }
            }
          ],
          opt: [] as any[],
          grantor: null as any,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('GRANT admin_role TO user1');
    });

    it('should deparse GRANT role WITH ADMIN OPTION statement', () => {
      const ast = {
        GrantRoleStmt: {
          is_grant: true,
          granted_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'manager_role',
                location: -1
              }
            }
          ],
          grantee_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'supervisor',
                location: -1
              }
            }
          ],
          opt: [{ String: { sval: 'admin' } }],
          grantor: null as any,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('GRANT manager_role TO supervisor WITH ADMIN OPTION');
    });

    it('should deparse REVOKE role statement', () => {
      const ast = {
        GrantRoleStmt: {
          is_grant: false,
          granted_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'temp_role',
                location: -1
              }
            }
          ],
          grantee_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'former_employee',
                location: -1
              }
            }
          ],
          opt: [] as any[],
          grantor: null as any,
          behavior: 'DROP_RESTRICT'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('REVOKE temp_role FROM former_employee RESTRICT');
    });

    it('should deparse REVOKE role ADMIN OPTION statement', () => {
      const ast = {
        GrantRoleStmt: {
          is_grant: false,
          granted_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'admin_role',
                location: -1
              }
            }
          ],
          grantee_roles: [
            {
              RoleSpec: {
                roletype: 'ROLESPEC_CSTRING',
                rolename: 'demoted_user',
                location: -1
              }
            }
          ],
          opt: [{ String: { sval: 'admin' } }],
          grantor: null as any,
          behavior: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('REVOKE admin_role FROM demoted_user ADMIN OPTION FOR');
    });
  });

  describe('SecLabelStmt', () => {
    it('should deparse SECURITY LABEL statement for table', () => {
      const ast = {
        SecLabelStmt: {
          objtype: "OBJECT_TABLE",
          object: {
            RangeVar: {
              schemaname: null as string | null,
              relname: 'classified_data',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          provider: 'selinux',
          label: 'system_u:object_r:sepgsql_table_t:s0'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SECURITY LABEL FOR "selinux" ON TABLE classified_data IS \'system_u:object_r:sepgsql_table_t:s0\'');
    });

    it('should deparse SECURITY LABEL statement for function', () => {
      const ast = {
        SecLabelStmt: {
          objtype: "OBJECT_FUNCTION",
          object: {
            FuncCall: {
              funcname: [{ String: { sval: 'sensitive_function' } }],
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
          provider: 'dummy',
          label: 'classified'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SECURITY LABEL FOR "dummy" ON FUNCTION sensitive_function() IS \'classified\'');
    });

    it('should deparse SECURITY LABEL statement with NULL label', () => {
      const ast = {
        SecLabelStmt: {
          objtype: "OBJECT_SCHEMA",
          object: { String: { sval: 'public' } },
          provider: 'selinux',
          label: undefined
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SECURITY LABEL FOR "selinux" ON SCHEMA public IS NULL');
    });

    it('should deparse SECURITY LABEL statement without provider', () => {
      const ast = {
        SecLabelStmt: {
          objtype: "OBJECT_ROLE",
          object: {
            RoleSpec: {
              roletype: 'ROLESPEC_CSTRING',
              rolename: 'test_user',
              location: -1
            }
          },
          provider: undefined,
          label: 'trusted'
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('SECURITY LABEL ON ROLE test_user IS \'trusted\'');
    });
  });
});
