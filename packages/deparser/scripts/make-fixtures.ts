#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { splitStatements, generateStatementKey } from '../src/utils/statement-splitter';

const FIXTURE_DIR = path.join(__dirname, '../../../__fixtures__/kitchen-sink');
const OUT_DIR = path.join(__dirname, '../../../__fixtures__/generated');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(OUT_DIR);

const fixtures = globSync(path.join(FIXTURE_DIR, '**/*.sql'));

async function main() {
  // Collect original SQL in a single JSON
  const results: Record<string, string> = {};
  
  for (const fixturePath of fixtures) {
    const relPath = path.relative(FIXTURE_DIR, fixturePath);
    const sql = fs.readFileSync(fixturePath, 'utf-8');
    
    try {
      const statements = await splitStatements(sql);
      
      for (const stmt of statements) {
        const key = generateStatementKey(relPath, stmt.index);
        results[key] = stmt.statement;
      }
    } catch (err: any) {
      console.error(`Failed to parse ${relPath}:`, err);
      continue;
    }
  }

  // Write aggregated JSON to output file
  const outputFile = path.join(OUT_DIR, 'generated.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Wrote JSON to ${outputFile}`);
}

main().catch(console.error);
