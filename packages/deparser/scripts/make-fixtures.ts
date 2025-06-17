#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { parse, deparse as deparseSync } from '@pgsql/parser';
import { ParseResult, RawStmt } from '@pgsql/types';

const FIXTURE_DIR = path.join(__dirname, '../../../__fixtures__/legacy');
const OUT_DIR = path.join(__dirname, '../../../__fixtures__/generated/sql');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(OUT_DIR);

const fixtures = globSync(`${FIXTURE_DIR}/**/*.sql`);

// Collect deparsed SQL in a single JSON
const results: Record<string, string> = {};
fixtures.forEach((fixturePath) => {
  const relPath = path.relative(FIXTURE_DIR, fixturePath);
  const sql = fs.readFileSync(fixturePath, 'utf-8');
  let parseResult: ParseResult;
  try {
    parseResult = parse(sql);
  } catch (err: any) {
    console.error(`Failed to parse ${relPath}:`, err);
    return;
  }
  parseResult.stmts.forEach((stmt: RawStmt, idx: number) => {
    let deparsedSql: string;
    try {
      deparsedSql = deparseSync({ version: 170000, stmts: [stmt] });
    } catch (err: any) {
      console.error(`Failed to deparse statement ${idx + 1} in ${relPath}:`, err);
      return;
    }
    const key = `${relPath.replace(/\.sql$/, '')}-${idx + 1}.sql`;
    results[key] = deparsedSql;
  });
});

// Write aggregated JSON to output file
const outputFile = path.join(OUT_DIR, 'generated.json');
fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`Wrote JSON to ${outputFile}`);
