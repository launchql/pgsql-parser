import { parse } from '@pgsql/parser';
import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import * as path from 'path';

const GENERATED_JSON = path.join(__dirname, '../../../__fixtures__/generated/generated.json');
const SINGLE_TEST = process.env.SINGLE_TEST;
// const SINGLE_TEST = 'upstream/rowtypes-88.sql';

function printErrorMessage(sql: string, position: number) {
  const lineNumber = sql.slice(0, position).match(/\n/g)?.length || 0;
  const lines = sql.split('\n');
  let colNumber = position - 1;
  for (let l = 0; l < lineNumber; l++) {
    colNumber -= lines[l].length + 1;
  }
  const errMessage = [`Error line ${lineNumber + 1}, column ${colNumber + 1}`];
  // print the previous line if there is one
  if (lineNumber > 0) {
    errMessage.push(lines[lineNumber - 1]);
  }
  // print the errant line itself
  errMessage.push(lines[lineNumber]);
  // print a marker at the exact column
  errMessage.push(' '.repeat(colNumber) + '^');
  // print the line after if there is one
  if (lineNumber < lines.length - 1) {
    errMessage.push(lines[lineNumber + 1]);
  }
  console.error(errMessage.join('\n'));
}
function tryParse(sql: string) {
  try {
    return parse(sql);
  } catch (err: any) {
    // if there is position information, print a readable error message
    if (err.cursorPosition) {
      printErrorMessage(sql, err.cursorPosition);
    }
    throw err;
  }
}

// Read aggregated fixtures from JSON
const fixtures: Record<string, string> = JSON.parse(readFileSync(GENERATED_JSON, 'utf-8'));

describe('kitchen sink', () => {
  // Determine which entries to test: if SINGLE_TEST is set, filter to match; otherwise test all
  const entries = SINGLE_TEST
    ? Object.entries(fixtures).filter(([relPath]) => relPath === SINGLE_TEST)
    : Object.entries(fixtures);

  entries.forEach(([relativePath, sql]) => {
    it(relativePath, () => {
      const tree = tryParse(sql);
      if (tree.stmts) {
        tree.stmts.forEach((stmt) => {
          expect(stmt).toMatchSnapshot();
          if (stmt.stmt) {
            const outSql = deparse(stmt.stmt);

            expect(cleanLines(outSql)).toMatchSnapshot();
            const reparsed = parse(outSql);
            expect(cleanTree(reparsed.stmts || [])).toEqual(cleanTree([stmt]));
          }
        });
      }
    });
  });
});
