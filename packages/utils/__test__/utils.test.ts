import * as u from '../src';
import ast from '../src/asts';
import { CreateStmt, ColumnDef } from '@pgsql/types';

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
  expect(createStmt).toBeTruthy();
});