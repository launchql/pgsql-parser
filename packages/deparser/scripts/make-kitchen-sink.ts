#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { parse, deparse as deparseSync } from '@pgsql/parser';
import { ParseResult, RawStmt } from '@pgsql/types';
import { cleanTree } from '../src/utils';

const FIXTURE_DIR = path.join(__dirname, '../../../__fixtures__/legacy');
const OUT_DIR = path.join(__dirname, '../__tests__/kitchen-sink');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(OUT_DIR);

const fixtures = globSync(`${FIXTURE_DIR}/**/*.sql`);
fixtures.forEach((fixturePath) => {
  const relPath = path.relative(FIXTURE_DIR, fixturePath);
  const sql = fs.readFileSync(fixturePath, 'utf-8');
  let statements: ParseResult;
  try {
    statements = parse(sql);
  } catch (err: any) {
    console.error(`Failed to parse ${relPath}:`, err);
    return;
  }

  const names = statements.stmts.map((stmt: RawStmt, idx: number) => {
    const outDir = path.join(OUT_DIR, path.dirname(relPath));
    ensureDir(outDir);
    const base = path.basename(relPath, '.sql');
    const outName = `${base}-${idx + 1}.sql`;
    return outName;
  });

  const testFile = generateTestFile(path.basename(relPath, '.sql'), names);
  fs.writeFileSync(path.join(OUT_DIR, `${path.basename(relPath, '.sql')}.test.ts`), testFile);
});


const generateTestFile = (name: string, tests: string[]) => {
return `
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('${name}', () => {
  fixtures.runFixtureTests(${JSON.stringify(tests, null, 2)});
});
`    
};
