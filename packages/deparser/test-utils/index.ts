import { parse } from '@pgsql/parser';
import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import * as path from 'path';
import { expect } from '@jest/globals';
import {diff} from 'jest-diff'

type ParseErrorType = 
  | 'PARSE_FAILED'
  | 'INVALID_STATEMENT'
  | 'REPARSE_FAILED'
  | 'AST_MISMATCH'
  | 'UNEXPECTED_ERROR'
  | 'INVALID_DEPARSED_SQL';

interface ParseError extends Error {
  type: ParseErrorType;
  relativePath: string;
  sql: string;
  deparsedSql?: string;
  originalAst?: any;
  reparsedAst?: any;
  parseError?: string;
}

function createParseError(
  type: ParseErrorType,
  relativePath: string,
  sql: string,
  deparsedSql?: string,
  originalAst?: any,
  reparsedAst?: any,
  parseError?: string
): ParseError {
  const error = new Error(getErrorMessage(type)) as ParseError;
  error.type = type;
  error.relativePath = relativePath;
  error.sql = sql;
  error.deparsedSql = deparsedSql;
  error.originalAst = originalAst;
  error.reparsedAst = reparsedAst;
  error.parseError = parseError;
  return error;
}

function getErrorMessage(type: ParseErrorType): string {
  switch (type) {
    case 'PARSE_FAILED':
      return 'Parse failed - no statements returned';
    case 'INVALID_STATEMENT':
      return 'Invalid statement structure';
    case 'REPARSE_FAILED':
      return 'Reparse failed - no statements returned';
    case 'AST_MISMATCH':
      return 'AST mismatch after parse/deparse cycle';
    case 'UNEXPECTED_ERROR':
      return 'Unexpected error during parse/deparse cycle';
    case 'INVALID_DEPARSED_SQL':
      return 'Invalid deparsed SQL';
  }
}

export class TestUtils {
  protected printErrorMessage(sql: string, position: number) {
    const lineNumber = sql.slice(0, position).match(/\n/g)?.length || 0;
    const lines = sql.split('\n');
    let colNumber = position - 1;
    for (let l = 0; l < lineNumber; l++) {
      colNumber -= lines[l].length + 1;
    }
    const errMessage = [`Error line ${lineNumber + 1}, column ${colNumber + 1}`];
    if (lineNumber > 0) {
      errMessage.push(lines[lineNumber - 1]);
    }
    errMessage.push(lines[lineNumber]);
    errMessage.push(' '.repeat(colNumber) + '^');
    if (lineNumber < lines.length - 1) {
      errMessage.push(lines[lineNumber + 1]);
    }
    console.error(errMessage.join('\n'));
  }

  tryParse(sql: string) {
    try {
      return parse(sql);
    } catch (err: any) {
      if (err.cursorPosition) {
        this.printErrorMessage(sql, err.cursorPosition);
      }
      throw err;
    }
  }

  expectAstMatch(relativePath: string, sql: string) {
    let tree: any;
    try {
      tree = this.tryParse(sql);
      if (tree.stmts) {
        tree.stmts.forEach((stmt: any) => {
          if (stmt.stmt) {
            const outSql = deparse(stmt.stmt);
            let reparsed;
            try {
              reparsed = parse(outSql);
            } catch (parseErr) {
              throw createParseError(
                'INVALID_DEPARSED_SQL',
                relativePath,
                sql,
                outSql,
                cleanTree([stmt]),
                undefined,
                parseErr instanceof Error ? parseErr.message : String(parseErr)
              );
            }
            const originalClean = cleanTree([stmt]);
            const reparsedClean = cleanTree(reparsed.stmts || []);
            
            if (!tree.stmts) {
              throw createParseError('PARSE_FAILED', relativePath, sql);
            }
            
            if (!stmt.stmt) {
              throw createParseError('INVALID_STATEMENT', relativePath, sql, undefined, cleanTree(tree));
            }
            
            if (!reparsed.stmts) {
              throw createParseError('REPARSE_FAILED', relativePath, sql, outSql, originalClean);
            }
            
            try {
              expect(reparsedClean).toEqual(originalClean);
            } catch (err) {
              throw createParseError('AST_MISMATCH', relativePath, sql, outSql, originalClean, reparsedClean);
            }
          }
        });
      }
    } catch (err) {
      const errorMessages: string[] = [];
      
      if (err instanceof Error && 'type' in err) {
        const parseError = err as ParseError;
        errorMessages.push(`\n❌ ${parseError.type}: ${parseError.relativePath}`);
        errorMessages.push(`❌ INPUT SQL: ${parseError.sql}`);
        
        if (parseError.deparsedSql) {
          errorMessages.push(`❌ DEPARSED SQL: ${parseError.deparsedSql}`);
        }
        
        if (parseError.type === 'INVALID_DEPARSED_SQL') {
          errorMessages.push(
            `\n❌ DEPARSER GENERATED INVALID SQL:`,
            `ORIGINAL AST:`,
            JSON.stringify(parseError.originalAst, null, 2),
            `\nPARSE ERROR: ${parseError.parseError}`
          );
        } else if (parseError.type === 'AST_MISMATCH') {
          errorMessages.push(
            `\n❌ AST COMPARISON:`,
            `EXPECTED AST:`,
            JSON.stringify(parseError.originalAst, null, 2),
            `\nACTUAL AST:`,
            JSON.stringify(parseError.reparsedAst, null, 2),
            `\nDIFF (what's missing from actual vs expected):`,
            diff(parseError.originalAst, parseError.reparsedAst)
          );
        } else if (parseError.originalAst) {
          errorMessages.push(`❌ AST: ${JSON.stringify(parseError.originalAst, null, 2)}`);
        }
      } else {
        // Handle unexpected errors
        errorMessages.push(
          `\n❌ UNEXPECTED ERROR: ${relativePath}`,
          `❌ INPUT SQL: ${sql}`,
          `❌ ERROR: ${err instanceof Error ? err.message : String(err)}`
        );
        if (tree) {
          errorMessages.push(`❌ PARSED AST: ${JSON.stringify(cleanTree(tree), null, 2)}`);
        }
      }
      
      console.log(errorMessages.join('\n'));
      throw err;
    }
  }
}

export class FixtureTestUtils extends TestUtils {
  private fixtures: Record<string, string>;

  constructor() {
    super();
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

  runFixtureTests(filters: string[]) {
    this.getTestEntries(filters).forEach(([relativePath, sql]) => {
      try {
        this.expectAstMatch(relativePath, sql);
      } catch (err) {
        throw err;
      }
    });
  }
}
