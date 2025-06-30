import { Parser } from '@pgsql/parser';
import { deparse } from 'pgsql-deparser';
import { cleanTree } from './clean-tree';
import { PG13ToPG17Transformer } from '../src/transformer';

/**
 * Result of the full transformation flow
 */
export interface FullTransformResult {
  /** Original SQL input */
  originalSql: string;
  /** PG13 parsed AST */
  pg13Ast: any;
  /** PG17 transformed AST */
  pg17Ast: any;
  /** Deparsed SQL from PG17 AST */
  deparsedSql: string;
  /** Reparsed AST from deparsed SQL (if validation enabled) */
  reparsedAst?: any;
}

/**
 * Options for the full transform flow
 */
export interface FullTransformOptions {
  /** Whether to validate the round-trip by reparsing the deparsed SQL */
  validateRoundTrip?: boolean;
  /** Whether to use case-insensitive comparison for SQL strings */
  caseInsensitive?: boolean;
  /** Custom assertion function to run on the result */
  customAssertion?: (result: FullTransformResult) => void;
}

/**
 * Performs the complete transformation flow:
 * 1. Parse SQL with PG13 parser
 * 2. Transform PG13 AST → PG17 AST
 * 3. Deparse PG17 AST back to SQL
 * 4. Optionally reparse and validate round-trip
 * 
 * @param sql - The SQL statement to transform
 * @param options - Configuration options
 * @returns Complete transformation result
 */
export async function fullTransformFlow(
  sql: string,
  options: FullTransformOptions = {}
): Promise<FullTransformResult> {
  const {
    validateRoundTrip = false,
    customAssertion
  } = options;

  // Initialize parsers and transformer
  const pg13Parser = new Parser({ version: 13 });
  const pg17Parser = new Parser({ version: 17 });
  const transformer = new PG13ToPG17Transformer();

  // Step 1: Parse with PG13
  const pg13Ast = await pg13Parser.parse(sql);
  
  // Step 2: Transform PG13 → PG17
  const pg17Ast = transformer.transform(pg13Ast);
  
  // Step 3: Deparse with PG17 deparser
  const deparsedSql = await deparse(pg17Ast);

  // Step 4: Optional round-trip validation
  let reparsedAst: any;

  if (validateRoundTrip) {
    reparsedAst = await pg17Parser.parse(deparsedSql);
    // Direct AST equality assertion instead of boolean property
    expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
  }

  const result: FullTransformResult = {
    originalSql: sql,
    pg13Ast,
    pg17Ast,
    deparsedSql,
    reparsedAst
  };

  // Run custom assertion if provided
  if (customAssertion) {
    customAssertion(result);
  }

  return result;
}

/**
 * Convenience function for testing basic SQL transformation
 * Expects exact SQL match (case-sensitive)
 */
export async function expectSqlTransform(sql: string): Promise<FullTransformResult> {
  const result = await fullTransformFlow(sql, { validateRoundTrip: true });
  
  expect(result.pg13Ast).toBeDefined();
  expect(result.pg17Ast).toBeDefined();
  expect(result.deparsedSql).toBe(sql);

  return result;
}

/**
 * Convenience function for testing SQL transformation with custom SQL expectations
 */
export async function expectSqlTransformWithContains(
  sql: string,
  expectedContains: string[]
): Promise<FullTransformResult> {
  const result = await fullTransformFlow(sql, { validateRoundTrip: true });
  
  expect(result.pg13Ast).toBeDefined();
  expect(result.pg17Ast).toBeDefined();
  
  expectedContains.forEach(expected => {
    expect(result.deparsedSql.toLowerCase()).toContain(expected.toLowerCase());
  });
  
  return result;
}