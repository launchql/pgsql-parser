import * as u from '../src';
import ast, { CreateStmt, ColumnDef, SelectStmt } from '../src';
import { deparse } from 'pgsql-deparser';

it('getEnumValue', () => {
  expect(u.getEnumValue('A_Expr_Kind', 0)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 1)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 2)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 3)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 4)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 5)).toMatchSnapshot();
});

it('asts', () => {
  const newColumn: ColumnDef = ast.columnDef({
    colname: 'id',
    typeName: ast.typeName({
      names: [ast.string({ str: 'int4' })]
    })
  });

  const createStmt: CreateStmt = ast.createStmt({
    relation: ast.rangeVar({
      relname: 'new_table'
    }),
    tableElts: [newColumn]
  })
  expect(createStmt).toMatchSnapshot();
  expect(deparse(createStmt, {})).toMatchSnapshot();
});

it('SelectStmt', () => {
  const selectStmt: SelectStmt = ast.selectStmt({
    targetList: [
      ast.resTarget({
        val: ast.columnRef({
          fields: [ast.aStar()]
        })
      })
    ],
    fromClause: [
      ast.rangeVar({
        schemaname: 'myschema',
        relname: 'mytable',
        inh: true,
        relpersistence: 'p'
      })
    ],
    whereClause: ast.aExpr({
      kind: 'AEXPR_OP',
      name: [ast.string({ str: '=' })],
      lexpr: ast.columnRef({
        fields: [ast.string({ str: 'a' })]
      }),
      rexpr: ast.typeCast({
        arg: ast.aConst({
          val: ast.string({ str: 't' })
        }),
        typeName: ast.typeName({
          names: [
            ast.string({ str: 'pg_catalog' }),
            ast.string({ str: 'bool' })
          ],
          typemod: -1
        })
      })
    }),
    limitOption: 'LIMIT_OPTION_DEFAULT',
    op: 'SETOP_NONE'
  });
  expect(deparse(selectStmt, {})).toEqual('SELECT * FROM myschema.mytable WHERE a = TRUE');
});

it('dynamic creation of tables', () => {
  // Example JSON schema
  const schema = {
    "tableName": "users",
    "columns": [
      { "name": "id", "type": "int", "constraints": ["PRIMARY KEY"] },
      { "name": "username", "type": "string" },
      { "name": "email", "type": "string", "constraints": ["UNIQUE"] },
      { "name": "created_at", "type": "timestamp", "constraints": ["NOT NULL"] }
    ]
  };

  // Construct the CREATE TABLE statement
  const createStmt = ast.createStmt({
    relation: ast.rangeVar({ relname: schema.tableName }),
    tableElts: schema.columns.map(column => ast.columnDef({
      colname: column.name,
      typeName: ast.typeName({
        names: [ast.string({ str: column.type })]
      }),
      constraints: column.constraints?.map(constraint =>
        ast.constraint({
          contype: constraint === "PRIMARY KEY" ? "CONSTR_PRIMARY" : constraint === "UNIQUE" ? "CONSTR_UNIQUE" : "CONSTR_NOTNULL",
          keys: [ast.string({ str: column.name })]
        })
      )
    }))
  });

  // Assuming `deparse` function converts AST to SQL string
  const sql = deparse(createStmt, {});
  expect(sql).toMatchSnapshot();
})