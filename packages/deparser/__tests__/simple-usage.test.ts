import { parse } from 'pgsql-parser';
import { deparse } from '../src';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../../../__fixtures__`;

export const getSql = (file: string) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}`).map((f) =>
    readFileSync(f).toString()
  )[0];
  return testsql;
};

it('simple "dumb" api', () => {
  const testsql1 = getSql('drops.sql');
  const testsql2 = getSql('a_expr.sql');
  const testsql3 = getSql('policies/custom.sql');
  const tree1 = parse(testsql1);
  const tree2 = parse(testsql2);
  const tree3 = parse(testsql3);
  // @ts-ignore
  expect(deparse(tree2[3])).toMatchSnapshot();
  // @ts-ignore
  expect(deparse([tree1[0], tree2[1]])).toMatchSnapshot();

  expect(
    // @ts-ignore
    deparse(tree3[0].RawStmt.stmt.CreatePolicyStmt.roles)
  ).toMatchSnapshot();
  expect(
    // @ts-ignore
    deparse(tree3[0].RawStmt.stmt.CreatePolicyStmt.qual)
  ).toMatchSnapshot();

  // not that you'd want to, but it's nice for deparser to be "dumb"
  expect(
    // @ts-ignore
    deparse([
      tree3[0].RawStmt.stmt.CreatePolicyStmt.qual,
      tree3[0].RawStmt.stmt.CreatePolicyStmt.roles[0]
    ])
  ).toMatchSnapshot();
});
