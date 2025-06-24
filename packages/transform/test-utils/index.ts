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
    astToTransform.stmts = astToTransform.stmts.map((stmtWrapper: any) => {
      if (stmtWrapper.stmt) {
        // Transform the actual statement using the ASTTransformer
        const transformedStmt = transformer.transform(stmtWrapper.stmt, versionPrevious, versionNext);
        return { ...stmtWrapper, stmt: transformedStmt };
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
  
  expect(nextAst).toEqual(previousTransformedAst);
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
      } catch (err) {
        throw err;
      }
    }
  }
}
