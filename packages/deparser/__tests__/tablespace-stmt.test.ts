import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { RoleSpecType, DefElemAction } from '@pgsql/types';

describe('Tablespace Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CreateTableSpaceStmt', () => {
    it('should deparse CREATE TABLESPACE statement', () => {
      const ast = {
        CreateTableSpaceStmt: {
          tablespacename: 'my_tablespace',
          owner: null as any,
          location: '/var/lib/postgresql/tablespaces/my_tablespace',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("CREATE TABLESPACE my_tablespace LOCATION '/var/lib/postgresql/tablespaces/my_tablespace'");
    });

    it('should deparse CREATE TABLESPACE with OWNER', () => {
      const ast = {
        CreateTableSpaceStmt: {
          tablespacename: 'user_tablespace',
          owner: {
            rolename: 'postgres',
            roletype: "ROLESPEC_CSTRING" as RoleSpecType,
            location: -1
          },
          location: '/var/lib/postgresql/tablespaces/user_tablespace',
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("CREATE TABLESPACE user_tablespace OWNER postgres LOCATION '/var/lib/postgresql/tablespaces/user_tablespace'");
    });

    it('should deparse CREATE TABLESPACE with options', () => {
      const ast = {
        CreateTableSpaceStmt: {
          tablespacename: 'ssd_tablespace',
          owner: null as any,
          location: '/ssd/postgresql/tablespaces/ssd_tablespace',
          options: [
            {
              DefElem: {
                defname: 'seq_page_cost',
                arg: { Float: { fval: '0.1' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("CREATE TABLESPACE ssd_tablespace LOCATION '/ssd/postgresql/tablespaces/ssd_tablespace' WITH (SEQ_PAGE_COST 0.1)");
    });

    it('should deparse minimal CREATE TABLESPACE', () => {
      const ast = {
        CreateTableSpaceStmt: {
          tablespacename: 'simple_tablespace',
          owner: null as any,
          location: undefined,
          options: [] as any[]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TABLESPACE simple_tablespace');
    });
  });

  describe('DropTableSpaceStmt', () => {
    it('should deparse DROP TABLESPACE statement', () => {
      const ast = {
        DropTableSpaceStmt: {
          tablespacename: 'old_tablespace',
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLESPACE old_tablespace');
    });

    it('should deparse DROP TABLESPACE IF EXISTS statement', () => {
      const ast = {
        DropTableSpaceStmt: {
          tablespacename: 'maybe_tablespace',
          missing_ok: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('DROP TABLESPACE IF EXISTS maybe_tablespace');
    });
  });

  describe('AlterTableSpaceOptionsStmt', () => {
    it('should deparse ALTER TABLESPACE SET statement', () => {
      const ast = {
        AlterTableSpaceOptionsStmt: {
          tablespacename: 'my_tablespace',
          options: [
            {
              DefElem: {
                defname: 'seq_page_cost',
                arg: { Float: { fval: '0.2' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ],
          isReset: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLESPACE my_tablespace SET (SEQ_PAGE_COST 0.2)');
    });

    it('should deparse ALTER TABLESPACE RESET statement', () => {
      const ast = {
        AlterTableSpaceOptionsStmt: {
          tablespacename: 'my_tablespace',
          options: [
            {
              DefElem: {
                defname: 'seq_page_cost',
                arg: null as any,
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ],
          isReset: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLESPACE my_tablespace RESET (SEQ_PAGE_COST)');
    });

    it('should deparse ALTER TABLESPACE with multiple options', () => {
      const ast = {
        AlterTableSpaceOptionsStmt: {
          tablespacename: 'performance_tablespace',
          options: [
            {
              DefElem: {
                defname: 'seq_page_cost',
                arg: { Float: { fval: '0.1' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defname: 'random_page_cost',
                arg: { Float: { fval: '0.1' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ],
          isReset: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLESPACE performance_tablespace SET (SEQ_PAGE_COST 0.1, RANDOM_PAGE_COST 0.1)');
    });
  });
});
