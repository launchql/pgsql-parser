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

function extractOriginalSQL(originalSQL: string, rawStmt: RawStmt, isFirst: boolean = false): string | null {
  let extracted: string | null = null;
  
  if (rawStmt.stmt_location !== undefined && rawStmt.stmt_len !== undefined) {
    // Check if we need to adjust location - if the character before the location looks like part of a SQL keyword
    let adjustedLocation = rawStmt.stmt_location;
    if (rawStmt.stmt_location > 0) {
      const charBefore = originalSQL[rawStmt.stmt_location - 1];
      const charAtLocation = originalSQL[rawStmt.stmt_location];
      // If the char before looks like it should be part of the statement (e.g., 'C' before 'REATE')
      if (/[A-Za-z]/.test(charBefore) && /[A-Za-z]/.test(charAtLocation)) {
        adjustedLocation = rawStmt.stmt_location - 1;
      }
    }
    extracted = originalSQL.substring(adjustedLocation, adjustedLocation + rawStmt.stmt_len);
  } else if (rawStmt.stmt_location !== undefined && rawStmt.stmt_len === undefined) {
    // We have location but no length - extract from location to end of file
    let adjustedLocation = rawStmt.stmt_location;
    if (rawStmt.stmt_location > 0) {
      const charBefore = originalSQL[rawStmt.stmt_location - 1];
      const charAtLocation = originalSQL[rawStmt.stmt_location];
      // If the char before looks like it should be part of the statement (e.g., 'C' before 'REATE')
      if (/[A-Za-z]/.test(charBefore) && /[A-Za-z]/.test(charAtLocation)) {
        adjustedLocation = rawStmt.stmt_location - 1;
      }
    }
    extracted = originalSQL.substring(adjustedLocation);
  } else if (isFirst && rawStmt.stmt_len !== undefined) {
    // For first statement when location is missing but we have length
    extracted = originalSQL.substring(0, rawStmt.stmt_len);
  } else if (isFirst && rawStmt.stmt_location === undefined && rawStmt.stmt_len === undefined) {
    // For first statement when both location and length are missing, use entire SQL
    extracted = originalSQL;
  }
  
  if (extracted) {
    // Split into lines to handle leading whitespace and comments properly
    const lines = extracted.split('\n');
    let startLineIndex = 0;
    
    // Find the first line that contains actual SQL content
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Skip empty lines and comment-only lines
      if (line === '' || line.startsWith('--')) {
        continue;
      }
      startLineIndex = i;
      break;
    }
    
    // Reconstruct from the first SQL line, preserving the original indentation of that line
    if (startLineIndex < lines.length) {
      const resultLines = lines.slice(startLineIndex);
      extracted = resultLines.join('\n').trim();
    }
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
