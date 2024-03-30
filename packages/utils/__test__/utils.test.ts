import * as u from '../src';

it('A_Expr_Kind', () => {
  expect(u.getEnumValue('A_Expr_Kind', 0)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 1)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 2)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 3)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 4)).toMatchSnapshot();
  expect(u.getEnumValue('A_Expr_Kind', 5)).toMatchSnapshot();
});