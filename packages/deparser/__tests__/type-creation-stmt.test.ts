import { Deparser } from '../src/deparser';
import { DeparserContext } from '../src/visitors/base';
import { DefElemAction } from '@pgsql/types';

describe('Type Creation Statement Deparsers', () => {
  const deparser = new Deparser([]);
  const context: DeparserContext = {};

  describe('CompositeTypeStmt', () => {
    it('should deparse CREATE TYPE composite statement', () => {
      const ast = {
        CompositeTypeStmt: {
          typevar: {
            RangeVar: {
              schemaname: undefined as string | undefined,
              relname: 'address_type',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          coldeflist: [
            {
              ColumnDef: {
                colname: 'street',
                typeName: {
                  names: [{ String: { sval: 'text' } }],
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
            {
              ColumnDef: {
                colname: 'city',
                typeName: {
                  names: [{ String: { sval: 'text' } }],
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
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TYPE address_type AS (street text, city text)');
    });

    it('should deparse CREATE TYPE composite statement with schema', () => {
      const ast = {
        CompositeTypeStmt: {
          typevar: {
            RangeVar: {
              schemaname: 'public',
              relname: 'person_type',
              inh: true,
              relpersistence: 'p',
              alias: null as any,
              location: -1
            }
          },
          coldeflist: [
            {
              ColumnDef: {
                colname: 'name',
                typeName: {
                  names: [{ String: { sval: 'varchar' } }],
                  typemod: 104,
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
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TYPE public.person_type AS (name varchar(40))');
    });
  });

  describe('CreateRangeStmt', () => {
    it('should deparse CREATE TYPE range statement', () => {
      const ast = {
        CreateRangeStmt: {
          typeName: [
            { String: { sval: 'int4range_custom' } }
          ],
          params: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'subtype',
                arg: { String: { sval: 'int4' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            },
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'subtype_opclass',
                arg: { String: { sval: 'int4_ops' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TYPE int4range_custom AS RANGE (subtype = int4, subtype_opclass = int4_ops)');
    });

    it('should deparse CREATE TYPE range statement with schema', () => {
      const ast = {
        CreateRangeStmt: {
          typeName: [
            { String: { sval: 'public' } },
            { String: { sval: 'daterange_custom' } }
          ],
          params: [
            {
              DefElem: {
                defnamespace: undefined,
                defname: 'subtype',
                arg: { String: { sval: 'date' } },
                defaction: 'DEFELEM_UNSPEC' as DefElemAction,
                location: -1
              }
            }
          ]
        }
      };
      
      expect(deparser.visit(ast, context)).toBe('CREATE TYPE public.daterange_custom AS RANGE (subtype = date)');
    });
  });

  describe('AlterEnumStmt', () => {
    it('should deparse ALTER TYPE ADD VALUE statement', () => {
      const ast = {
        AlterEnumStmt: {
          typeName: [
            { String: { sval: 'status_enum' } }
          ],
          oldVal: undefined,
          newVal: 'pending',
          newValNeighbor: undefined,
          newValIsAfter: false,
          skipIfNewValExists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ALTER TYPE status_enum ADD VALUE 'pending'");
    });

    it('should deparse ALTER TYPE ADD VALUE IF NOT EXISTS statement', () => {
      const ast = {
        AlterEnumStmt: {
          typeName: [
            { String: { sval: 'public' } },
            { String: { sval: 'priority_enum' } }
          ],
          oldVal: undefined,
          newVal: 'urgent',
          newValNeighbor: undefined,
          newValIsAfter: false,
          skipIfNewValExists: true
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ALTER TYPE public.priority_enum ADD VALUE IF NOT EXISTS 'urgent'");
    });

    it('should deparse ALTER TYPE ADD VALUE AFTER statement', () => {
      const ast = {
        AlterEnumStmt: {
          typeName: [
            { String: { sval: 'status_enum' } }
          ],
          oldVal: undefined,
          newVal: 'processing',
          newValNeighbor: 'pending',
          newValIsAfter: true,
          skipIfNewValExists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ALTER TYPE status_enum ADD VALUE 'processing' AFTER 'pending'");
    });

    it('should deparse ALTER TYPE ADD VALUE BEFORE statement', () => {
      const ast = {
        AlterEnumStmt: {
          typeName: [
            { String: { sval: 'status_enum' } }
          ],
          oldVal: undefined,
          newVal: 'draft',
          newValNeighbor: 'pending',
          newValIsAfter: false,
          skipIfNewValExists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ALTER TYPE status_enum ADD VALUE 'draft' BEFORE 'pending'");
    });

    it('should deparse ALTER TYPE RENAME VALUE statement', () => {
      const ast = {
        AlterEnumStmt: {
          typeName: [
            { String: { sval: 'status_enum' } }
          ],
          oldVal: 'old_status',
          newVal: 'new_status',
          newValNeighbor: undefined,
          newValIsAfter: false,
          skipIfNewValExists: false
        }
      };
      
      expect(deparser.visit(ast, context)).toBe("ALTER TYPE status_enum RENAME VALUE 'old_status' TO 'new_status'");
    });
  });
});
