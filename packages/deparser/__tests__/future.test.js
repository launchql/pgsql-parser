import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../../../__future__`;

export const check = (file) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}*.sql`).map((f) =>
    readFileSync(f).toString()
  )[0];
  const testjson = glob(`${FIXTURE_DIR}/${file}*.json`).map((f) =>
    JSON.parse(readFileSync(f, 'utf-8'))
  )[0];

  console.log(JSON.stringify(testjson, null, 2));
  const sql = deparse(testjson);
  console.log(sql);
  expect(sql).toMatchSnapshot();
};

it('include-index', () => {
  check('include-index');
});


