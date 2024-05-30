import * as u from '../src';
import ast, { SelectStmt, RangeVar } from '../src';
import { deparse } from 'pgsql-deparser';

it('getEnumValue snapshots', () => {
  for (let i = 0; i <= 5; i++) {
    expect(u.getEnumValue('A_Expr_Kind', i)).toMatchSnapshot();
  }
});

it('simple SelectStmt', () => {
  const stmt: SelectStmt = ast.selectStmt({
    targetList: [
      ast.resTarget({
        val: ast.columnRef({
          fields: [ast.aStar()]
        })
      })
    ],
    fromClause: [
      ast.rangeVar({
        relname: 'some_table',
        inh: true,
        relpersistence: 'p'
      })
    ],
    limitOption: 'LIMIT_OPTION_DEFAULT',
    op: 'SETOP_NONE'
  });
  
  // @ts-ignore (because of optional args)
  stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

  expect(stmt).toMatchSnapshot();
  expect(deparse(stmt, {})).toMatchSnapshot();
});

it('SelectStmt with WHERE clause', () => {
  const selectStmt: SelectStmt = ast.selectStmt({
    targetList: [ast.resTarget({
      val: ast.columnRef({
        fields: [ast.aStar({})],
        location: 7
      }),
      location: 7
    })],
    fromClause: [ast.rangeVar({
      relname: "my_table",
      inh: true,
      relpersistence: "p",
      location: 14
    })],
    whereClause: ast.aExpr({
      kind: "AEXPR_OP",
      name: [ast.string({
        str: "="
      })],
      lexpr: ast.columnRef({
        fields: [ast.string({
          str: "id"
        })],
        location: 29
      }),
      rexpr: ast.aConst({
        val: ast.integer({
          ival: 1
        }),
        location: 34
      }),
      location: 32
    }),
    limitOption: "LIMIT_OPTION_DEFAULT",
    op: "SETOP_NONE"
  })
  expect(deparse(selectStmt, {})).toEqual('SELECT * FROM myschema.mytable WHERE a = TRUE');
});


// it('dynamic creation of tables', () => {
//   // Example JSON schema
//   const schema = {
//     "tableName": "users",
//     "columns": [
//       { "name": "id", "type": "int", "constraints": ["PRIMARY KEY"] },
//       { "name": "username", "type": "text" },
//       { "name": "email", "type": "text", "constraints": ["UNIQUE"] },
//       { "name": "created_at", "type": "timestamp", "constraints": ["NOT NULL"] }
//     ]
//   };

//   // Construct the CREATE TABLE statement
//   const createStmt = ast.createStmt({
//     relation: ast.rangeVar({ 
//       relname: schema.tableName,
//       inh: true,
//       relpersistence: 'p'
//     }).RangeVar as RangeVar, // special case due to PG AST
//     tableElts: schema.columns.map(column => ast.columnDef({
//       colname: column.name,
//       typeName: ast.typeName({
//         names: [ast.string({ str: column.type })]
//       }),
//       constraints: column.constraints?.map(constraint =>
//         ast.constraint({
//           contype: constraint === "PRIMARY KEY" ? "CONSTR_PRIMARY" : constraint === "UNIQUE" ? "CONSTR_UNIQUE" : "CONSTR_NOTNULL"
//         })
//       )
//     }))
//   });

//   // `deparse` function converts AST to SQL string
//   const sql = deparse(createStmt, {});
//   expect(sql).toMatchSnapshot();
// })