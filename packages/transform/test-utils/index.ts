import { Parser } from '@pgsql/parser';
import { cleanTree } from './clean-tree';
import { readFileSync } from 'fs';
import * as path from 'path';
import { expect } from '@jest/globals';

const parser13 = new Parser(13 as any);
const parser14 = new Parser(14 as any);
const parser15 = new Parser(15 as any);
const parser16 = new Parser(16 as any);
const parser17 = new Parser(17 as any);

import { ASTTransformer } from '../src/transformer';

/**
 * Get the appropriate parsers for version transformation
 */
export function getParsersForVersions(versionPrevious: number, versionNext: number): { parserPrevious: any, parserNext: any } {
  if (versionNext - versionPrevious !== 1) {
    throw new Error('Version difference must be 1');
  }

  let parserPrevious;
  let parserNext;
  
  switch (versionPrevious) {
    case 13:
      parserPrevious = parser13;
      parserNext = parser14;
      break;
    case 14:
      parserPrevious = parser14;
      parserNext = parser15;
      break;
    case 15:
      parserPrevious = parser15;
      parserNext = parser16;
      break;
    case 16:
      parserPrevious = parser16;
      parserNext = parser17;
      break;
    default:
      throw new Error('Unsupported version');
  }

  return { parserPrevious, parserNext };
}

/**
 * Get the appropriate transformer for version transformation
 */
export function getTransformerForVersion(versionPrevious: number, versionNext: number): ASTTransformer {
  // Return a single ASTTransformer instance that can handle all transformations
  return new ASTTransformer();
}

/**
 * Helper function to find the first difference between two objects
 */
function findFirstDifference(obj1: any, obj2: any, path: string = ''): { path: string; expected: any; actual: any } | null {
  // Handle primitive values
  if (obj1 === obj2) return null;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return { path, expected: obj1, actual: obj2 };
  }
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return { path: `${path}.length`, expected: obj1.length, actual: obj2.length };
    }
    for (let i = 0; i < obj1.length; i++) {
      const diff = findFirstDifference(obj1[i], obj2[i], `${path}[${i}]`);
      if (diff) return diff;
    }
    return null;
  }
  
  // Handle objects
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  
  // Check for missing/extra keys
  if (keys1.length !== keys2.length || keys1.some((k, i) => k !== keys2[i])) {
    const missingInObj2 = keys1.filter(k => !keys2.includes(k));
    const extraInObj2 = keys2.filter(k => !keys1.includes(k));
    if (missingInObj2.length > 0) {
      return { path: `${path}.${missingInObj2[0]}`, expected: obj1[missingInObj2[0]], actual: undefined };
    }
    if (extraInObj2.length > 0) {
      return { path: `${path}.${extraInObj2[0]}`, expected: undefined, actual: obj2[extraInObj2[0]] };
    }
  }
  
  // Check values
  for (const key of keys1) {
    const diff = findFirstDifference(obj1[key], obj2[key], path ? `${path}.${key}` : key);
    if (diff) return diff;
  }
  
  return null;
}

/**
 * Perform the parse-transform-parse equality test
 */
export async function expectTransformedAstToEqualParsedAst(
  sql: string,
  parserPrevious: any,
  parserNext: any,
  transformer: ASTTransformer,
  versionPrevious: number,
  versionNext: number
): Promise<void> {
  const parsedPrevious = await parserPrevious.parse(sql);
  const parsedNext = await parserNext.parse(sql);
  
  // Create a copy of the previous AST to transform
  const astToTransform = JSON.parse(JSON.stringify(parsedPrevious));
  
  // Transform the statements within the AST
  if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
    astToTransform.stmts = astToTransform.stmts.map((stmtWrapper: any, index: number) => {
      if (stmtWrapper.stmt) {
        try {
          // Transform the actual statement using the ASTTransformer
          const transformedStmt = transformer.transform(stmtWrapper.stmt, versionPrevious, versionNext);
          return { ...stmtWrapper, stmt: transformedStmt };
        } catch (error: any) {
          const errorMessage = [
            `\n❌ TRANSFORMATION ERROR`,
            `   Previous Version: ${versionPrevious}`,
            `   Next Version: ${versionNext}`,
            `   Statement Index: ${index}`,
            `   Statement Type: ${Object.keys(stmtWrapper.stmt)[0]}`,
            `   Error: ${error.message}`,
            `\n   Original Statement:`,
            JSON.stringify(stmtWrapper.stmt, null, 2)
          ].join('\n');
          
          console.error(errorMessage);
          throw error;
        }
      }
      return stmtWrapper;
    });
  }
  
  // Update the version to match the target version
  astToTransform.version = parsedNext.version;
  
  const nextAst = cleanTree(parsedNext);
  const previousTransformedAst = cleanTree(astToTransform);
  
  // Remove version fields for comparison
  delete nextAst.version;
  delete previousTransformedAst.version;
  
  try {
    expect(nextAst).toEqual(previousTransformedAst);
  } catch (error: any) {
    // Try to find the first difference
    const diff = findFirstDifference(nextAst, previousTransformedAst);
    
    const errorMessage = [
      `\n❌ TRANSFORMATION MISMATCH`,
      `   Previous Version: ${versionPrevious}`,
      `   Next Version: ${versionNext}`,
      `   SQL: ${sql}`,
      `\n   Expected (parsed with v${versionNext}):`,
      JSON.stringify(nextAst, null, 2),
      `\n   Actual (transformed from v${versionPrevious}):`,
      JSON.stringify(previousTransformedAst, null, 2),
      diff ? `\n   First difference at path: ${diff.path}` : '',
      diff ? `   Expected: ${JSON.stringify(diff.expected)}` : '',
      diff ? `   Actual: ${JSON.stringify(diff.actual)}` : ''
    ].filter(line => line !== '').join('\n');
    
    console.error(errorMessage);
    throw error;
  }
}

/**
 * Combined helper that uses all three modular functions
 */
export async function expectParseTransformParseToBeEqual(sql: string, versionPrevious: number, versionNext: number) {
  const { parserPrevious, parserNext } = getParsersForVersions(versionPrevious, versionNext);
  const transformer = getTransformerForVersion(versionPrevious, versionNext);
  
  await expectTransformedAstToEqualParsedAst(sql, parserPrevious, parserNext, transformer, versionPrevious, versionNext);
}

export class FixtureTestUtils {
  private fixtures: Record<string, string>;
  versionPrevious: number;
  versionNext: number;

  transformer: ASTTransformer;
  parserPrevious: any;
  parserNext: any;

  constructor(versionPrevious: number, versionNext: number) {
    if (versionNext - versionPrevious !== 1) {
      throw new Error('Version difference must be 1');
    }
    this.versionNext = versionNext;
    this.versionPrevious = versionPrevious;

    // Use the modular helper functions
    this.transformer = getTransformerForVersion(versionPrevious, versionNext);
    const { parserPrevious, parserNext } = getParsersForVersions(versionPrevious, versionNext);
    this.parserPrevious = parserPrevious;
    this.parserNext = parserNext;

    const GENERATED_JSON = path.join(__dirname, '../../../__fixtures__/generated/generated.json');
    this.fixtures = JSON.parse(readFileSync(GENERATED_JSON, 'utf-8'));
  }

  getTestEntries(filters: string[]) {
    if (filters.length === 0) {
      return Object.entries(this.fixtures);
    }
    return Object.entries(this.fixtures).filter(([relPath]) =>
      filters.includes(relPath)
    );
  }

  async expectParseTransformParseToBeEqual(relativePath: string, sql: string) {
    // Use the modular helper function instead of duplicating logic
    await expectTransformedAstToEqualParsedAst(sql, this.parserPrevious, this.parserNext, this.transformer, this.versionPrevious, this.versionNext);
  }

  async runFixtureTests(filters: string[]) {
    if (filters.length === 0) {
      console.log('no filters provided, skipping tests.');
      return;
    }
    
    const entries = this.getTestEntries(filters);
    for (const [relativePath, sql] of entries) {
      try {
        await this.expectParseTransformParseToBeEqual(relativePath, sql);
      } catch (error: any) {
        console.error(`\n❌ FAILED: ${relativePath}`);
        throw error;
      }
    }
  }
}
