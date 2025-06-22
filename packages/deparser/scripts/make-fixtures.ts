#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs';
import { sync as globSync } from 'glob';
import { parse, deparse } from 'libpg-query';
import { ParseResult, RawStmt } from '@pgsql/types';

const FIXTURE_DIR = path.join(__dirname, '../../../__fixtures__/kitchen-sink');
const OUT_DIR = path.join(__dirname, '../../../__fixtures__/generated');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(OUT_DIR);

const fixtures = globSync(path.join(FIXTURE_DIR, '**/*.sql'));

function stripLeadingComments(sql: string): string {
  const lines = sql.split('\n');
  let startIndex = 0;
  
  // Find the first non-comment, non-empty line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '' || line.startsWith('--')) {
      continue;
    }
    startIndex = i;
    break;
  }
  
  return lines.slice(startIndex).join('\n').trim();
}

function extractOriginalSQL(originalSQL: string, rawStmt: RawStmt, isFirst: boolean = false): string | null {
  let extracted: string | null = null;
  
  if (rawStmt.stmt_location !== undefined && rawStmt.stmt_len !== undefined) {
    extracted = originalSQL.substring(rawStmt.stmt_location, rawStmt.stmt_location + rawStmt.stmt_len).trim();
  } else if (isFirst && rawStmt.stmt_len !== undefined) {
    // For first statement when location is missing
    extracted = originalSQL.substring(0, rawStmt.stmt_len).trim();
  }
  
  if (extracted) {
    // Strip leading comments and empty lines
    extracted = stripLeadingComments(extracted);
  }
  
  return extracted;
}

async function main() {
  // Collect both deparsed and original SQL in a single JSON
  const results: Record<string, { deparsed: string; original?: string }> = {};
  
  for (const fixturePath of fixtures) {
    const relPath = path.relative(FIXTURE_DIR, fixturePath);
    const sql = fs.readFileSync(fixturePath, 'utf-8');
    let parseResult: ParseResult;
    try {
      parseResult = await parse(sql);
    } catch (err: any) {
      console.error(`Failed to parse ${relPath}:`, err);
      continue;
    }
    
    for (let idx = 0; idx < parseResult.stmts.length; idx++) {
      const stmt = parseResult.stmts[idx];
      let deparsedSql: string;
      try {
        deparsedSql = await deparse({ version: 170000, stmts: [stmt] });
      } catch (err: any) {
        console.error(`Failed to deparse statement ${idx + 1} in ${relPath}:`, err);
        continue;
      }
      
      // Extract original SQL using location info
      const originalSql = extractOriginalSQL(sql, stmt, idx === 0);
      
      const key = `${relPath.replace(/\.sql$/, '')}-${idx + 1}.sql`;
      results[key] = {
        deparsed: deparsedSql,
        ...(originalSql && { original: originalSql })
      };
    }
  }

  // Write aggregated JSON to output file
  const outputFile = path.join(OUT_DIR, 'generated.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Wrote JSON to ${outputFile}`);
}

main().catch(console.error);
