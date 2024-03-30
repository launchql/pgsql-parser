import { describe, expect, test } from '@jest/globals';
import { CreateStmt } from '../src'

const myTypedFunction = (createStmt: CreateStmt) => {
  expect(createStmt).toBeTruthy();
};

test('types', () => {
  // here we just want to ensure there are no type errors
  // purposefully a simple test
  const ast: CreateStmt = {
    relation: {
      alias: {
        aliasname: 'string',
        colnames: []
      },
      catalogname: 'sdf',
      inh: true,
      location: 52,
      relname: 'job_queues',
      relpersistence: 'p',
      schemaname: 'app_jobs',
    },
    tableElts: [
      {
        ColumnDef: {
          colname: 'queue_name',
          constraints: [
            {
              Constraint: {
                contype: 'CONSTR_NOTNULL',
                location: 95,
              },
            },
            {
              Constraint: {
                contype: 'CONSTR_PRIMARY',
                location: 104,
              },
            },
          ],
          is_local: true,
          location: 76,
          typeName: {
            location: 87,
            names: [
              {
                String: {
                  str: 'pg_catalog',
                },
              },
              {
                String: {
                  str: 'varchar',
                },
              },
            ],
            typemod: -1,
          },
        },
      },
      {
        ColumnDef: {
          colname: 'job_count',
          constraints: [
            {
              Constraint: {
                contype: 'CONSTR_DEFAULT',
                location: 133,
                raw_expr: {
                  A_Const: {
                    location: 141,
                    val: {
                      Integer: {
                        ival: 0,
                      },
                    },
                  },
                },
              },
            },
            {
              Constraint: {
                contype: 'CONSTR_NOTNULL',
                location: 143,
              },
            },
          ],
          is_local: true,
          location: 119,
          typeName: {
            location: 129,
            names: [
              {
                String: {
                  str: 'pg_catalog',
                },
              },
              {
                String: {
                  str: 'int4',
                },
              },
            ],
            typemod: -1,
          },
        },
      },
      {
        ColumnDef: {
          colname: 'locked_at',
          is_local: true,
          location: 155,
          typeName: {
            location: 165,
            names: [
              {
                String: {
                  str: 'pg_catalog',
                },
              },
              {
                String: {
                  str: 'timestamptz',
                },
              },
            ],
            typemod: -1,
          },
        },
      },
      {
        ColumnDef: {
          colname: 'locked_by',
          is_local: true,
          location: 193,
          typeName: {
            location: 203,
            names: [
              {
                String: {
                  str: 'pg_catalog',
                },
              },
              {
                String: {
                  str: 'varchar',
                },
              },
            ],
            typemod: -1,
          },
        },
      },
    ],
  };
  myTypedFunction(ast);
});