import { parse } from 'pgsql-parser';
import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../../../__fixtures__`;

export const check = (file: string) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}`).map((f) =>
    readFileSync(f).toString()
  )[0];
  const tree = parse(testsql);
  expect(tree).toMatchSnapshot();
  const sql = deparse(tree, {
    newline: ' ',
    tab: '  '
  });
  expect(cleanLines(sql)).toMatchSnapshot();
  expect(cleanTree(parse(sql))).toEqual(cleanTree(tree));
};

it('parens', () => {
  check('parens.sql');
});
