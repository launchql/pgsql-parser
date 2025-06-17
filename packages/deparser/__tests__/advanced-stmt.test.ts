import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { parse } from '@pgsql/parser';
import { cleanTree } from '../src/utils';
import { ReturnStmt, PLAssignStmt, CopyStmt, AlterTableStmt, AlterObjectSchemaStmt, ObjectType, DropBehavior } from '@pgsql/types';

describe('Advanced Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('ReturnStmt', () => {
    it('should deparse RETURN statement with value', () => {
      const ast: { ReturnStmt: ReturnStmt } = {
        ReturnStmt: {
          returnval: {
            A_Const: {
              ival: { ival: 42 },
              isnull: false,
              location: -1
            }
          }
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RETURN 42');
    });

    it('should deparse RETURN statement without value', () => {
      const ast: { ReturnStmt: ReturnStmt } = {
        ReturnStmt: {
          returnval: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('RETURN');
    });

    it('should deparse RETURN statement with expression', () => {
      const ast: { ReturnStmt: ReturnStmt } = {
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
  });

  describe('PLAssignStmt', () => {
    it('should deparse simple assignment statement', () => {
      const ast: { PLAssignStmt: PLAssignStmt } = {
        PLAssignStmt: {
          name: 'my_var',
          indirection: undefined,
          nnames: 1,
          val: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    A_Const: {
                      ival: { ival: 100 },
                      isnull: false,
                      location: -1
                    }
                  },
                  location: -1
                }
              }
            ],
            op: null as any,
            all: false,
            larg: null as any,
            rarg: null as any
          },
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('my_var := SELECT 100');
    });

    it('should deparse assignment with array indirection', () => {
      const ast: { PLAssignStmt: PLAssignStmt } = {
        PLAssignStmt: {
          name: 'my_array',
          indirection: [
            {
              A_Indices: {
                is_slice: false,
                lidx: null as any,
                uidx: {
                  A_Const: {
                    ival: { ival: 1 },
                    isnull: false,
                    location: -1
                  }
                }
              }
            }
          ],
          nnames: 1,
          val: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    A_Const: {
                      sval: { sval: 'value' },
                      isnull: false,
                      location: -1
                    }
                  },
                  location: -1
                }
              }
            ],
            op: null as any,
            all: false,
            larg: null as any,
            rarg: null as any
          },
          location: -1
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('my_array[1] := SELECT \'value\'');
    });
  });

  describe('CopyStmt', () => {
    it('should deparse COPY table TO file', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          query: null as any,
          attlist: undefined,
          is_from: false,
          is_program: false,
          filename: '/tmp/users.csv',
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY users TO \'/tmp/users.csv\'');
    });

    it('should deparse COPY table FROM file', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          query: null as any,
          attlist: undefined,
          is_from: true,
          is_program: false,
          filename: '/tmp/users.csv',
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY users FROM \'/tmp/users.csv\'');
    });

    it('should deparse COPY with column list', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          query: null as any,
          attlist: [
            { String: { sval: 'id' } },
            { String: { sval: 'name' } },
            { String: { sval: 'email' } }
          ],
          is_from: false,
          is_program: false,
          filename: '/tmp/users.csv',
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY users (id, name, email) TO \'/tmp/users.csv\'');
    });

    it('should deparse COPY from query', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: null as any,
          query: {
            SelectStmt: {
              targetList: [
                {
                  ResTarget: {
                    val: { A_Star: {} },
                    location: -1
                  }
                }
              ],
              fromClause: [
                {
                  schemaname: undefined as string | undefined,
                  relname: 'users',
                  inh: true,
                  relpersistence: 'p',
                  alias: null as any,
                  location: -1
                }
              ],
              op: null as any,
              all: false,
              larg: null as any,
              rarg: null as any
            }
          },
          attlist: undefined,
          is_from: false,
          is_program: false,
          filename: '/tmp/query_result.csv',
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY (SELECT * FROM users) TO \'/tmp/query_result.csv\'');
    });

    it('should deparse COPY with PROGRAM', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          query: null as any,
          attlist: undefined,
          is_from: false,
          is_program: true,
          filename: 'gzip > /tmp/users.csv.gz',
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY users TO PROGRAM \'gzip > /tmp/users.csv.gz\'');
    });

    it('should deparse COPY to STDIN', () => {
      const ast: { CopyStmt: CopyStmt } = {
        CopyStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          query: null as any,
          attlist: undefined,
          is_from: true,
          is_program: false,
          filename: undefined,
          options: undefined,
          whereClause: null as any
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('COPY users FROM STDIN');
    });
  });

  describe('AlterTableStmt', () => {
    it('should deparse ALTER TABLE statement', () => {
      const ast: { AlterTableStmt: AlterTableStmt } = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_AddColumn',
                name: 'new_column',
                def: {
                  ColumnDef: {
                    colname: 'new_column',
                    typeName: {
                      names: [{ String: { sval: 'text' } }],
                      typemod: -1,
                      arrayBounds: undefined,
                      location: -1
                    },
                    inhcount: 0,
                    is_local: true,
                    is_not_null: false,
                    is_from_type: false,
                    storage: undefined,
                    raw_default: null as any,
                    cooked_default: null as any,
                    identity: undefined,
                    identitySequence: null as any,
                    generated: undefined,
                    collClause: null as any,
                    collOid: 0,
                    constraints: undefined,
                    fdwoptions: undefined,
                    location: -1
                  }
                },
                behavior: undefined,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_TABLE",
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE users ADD COLUMN new_column text');
    });

    it('should deparse ALTER TABLE IF EXISTS statement', () => {
      const ast: { AlterTableStmt: AlterTableStmt } = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'users',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_DropColumn',
                name: 'old_column',
                def: null as any,
                behavior: 'DROP_CASCADE' as DropBehavior,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_TABLE",
          missing_ok: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER TABLE IF EXISTS users DROP COLUMN old_column CASCADE');
    });

    it('should deparse ALTER INDEX statement', () => {
      const ast: { AlterTableStmt: AlterTableStmt } = {
        AlterTableStmt: {
          relation: {
            schemaname: undefined as string | undefined,
            relname: 'idx_users_email',
            inh: true,
            relpersistence: 'p',
            alias: null as any,
            location: -1
          },
          cmds: [
            {
              AlterTableCmd: {
                subtype: 'AT_SetTableSpace',
                name: 'new_tablespace',
                def: null as any,
                behavior: undefined,
                missing_ok: false
              }
            }
          ],
          objtype: "OBJECT_INDEX",
          missing_ok: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('ALTER INDEX idx_users_email SET TABLESPACE new_tablespace');
    });
  });
});
