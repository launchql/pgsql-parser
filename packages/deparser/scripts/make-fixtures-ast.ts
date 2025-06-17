#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { parse, deparse as deparseSync } from '@pgsql/parser';
import { ParseResult, RawStmt } from '@pgsql/types';
import { cleanTree } from '../src/utils';

const FIXTURE_DIR = path.join(__dirname, '../../../__fixtures__/legacy');
const OUT_DIR = path.join(__dirname, '../../../__fixtures__/generated/asts');

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

  statements.stmts.forEach((stmt: RawStmt, idx: number) => {
    const outDir = path.join(OUT_DIR, path.dirname(relPath));
    ensureDir(outDir);
    const base = path.basename(relPath, '.sql');
    const outName = `${base}-${idx + 1}.sql`;
    const outPath = path.join(outDir, outName);
    
    fs.writeFileSync(outPath, JSON.stringify(cleanTree(stmt.stmt), null, 2));
    console.log(`Generated ${outPath}`);
  });
});
