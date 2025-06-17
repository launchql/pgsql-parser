import { parse } from '@pgsql/parser';
import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import * as path from 'path';

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
            const reparsed = parse(outSql);
            expect(cleanTree(reparsed.stmts || [])).toEqual(cleanTree([stmt]));
          }
        });
      }
    } catch (err) {
      console.error(`\n❌ BROKEN FIXTURE: ${relativePath}\n❌ FIXTURE SQL: ${sql}${tree ? `\n❌ FIXTURE AST: ${JSON.stringify(cleanTree(tree), null, 2)}` : ''}`);
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
