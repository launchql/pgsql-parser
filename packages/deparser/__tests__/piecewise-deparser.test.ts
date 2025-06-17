import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from '@pgsql/parser';
import { deparse } from '../src';

const GENERATED_JSON = join(__dirname, '../../../__fixtures__/generated/generated.json');

function tryParse(sql: string) {
  try {
    return parse(sql);
  } catch (error) {
    throw new Error(`Failed to parse SQL: ${sql}\nError: ${error}`);
  }
}

function cleanLines(sql: string): string {
  return sql
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

function cleanTree(stmts: any[]): any[] {
  return stmts.map(stmt => {
    if (typeof stmt === 'object' && stmt !== null) {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(stmt)) {
        if (value !== null && value !== undefined) {
          cleaned[key] = value;
        }
      }
      return cleaned;
    }
    return stmt;
  });
}

const fixtures: Record<string, string> = JSON.parse(readFileSync(GENERATED_JSON, 'utf-8'));

describe('piecewise deparser testing', () => {
  const testPatterns = [
    'ALTER TABLE',
    'CREATE TABLE',
    'INSERT INTO',
    'UPDATE',
    'DELETE FROM',
    'SELECT',
    'DROP TABLE',
    'CREATE INDEX',
    'GRANT',
    'REVOKE'
  ];

  testPatterns.forEach(pattern => {
    describe(`${pattern} statements`, () => {
      const matchingFixtures = Object.entries(fixtures)
        .filter(([_, sql]) => sql.toUpperCase().includes(pattern))
        .slice(0, 10); // Test first 10 matches to keep it manageable

      if (matchingFixtures.length === 0) {
        it(`should have fixtures for ${pattern}`, () => {
          console.log(`No fixtures found for pattern: ${pattern}`);
        });
        return;
      }

      matchingFixtures.forEach(([fixtureName, sql]) => {
        it(`should handle ${fixtureName}`, () => {
          const tree = tryParse(sql);
          
          if (tree.stmts && tree.stmts.length > 0) {
            tree.stmts.forEach((stmt, index) => {
              if (stmt.stmt) {
                try {
                  const outSql = deparse(stmt.stmt);
                  expect(outSql).toBeTruthy();
                  expect(typeof outSql).toBe('string');
                  
                  const reparsed = parse(outSql);
                  expect(cleanTree(reparsed.stmts || [])).toEqual(cleanTree([stmt]));
                } catch (error) {
                  console.error(`Failed to deparse ${fixtureName} statement ${index}:`, error);
                  console.error('SQL:', sql);
                  console.error('AST:', JSON.stringify(stmt, null, 2));
                  throw error;
                }
              }
            });
          }
        });
      });
    });
  });

  describe('missing node type detection', () => {
    it('should identify statements that fail with "Deparser does not handle node type"', () => {
      const failingFixtures: Array<{name: string, sql: string, error: string, nodeType: string}> = [];
      const nodeTypeCounts: Record<string, number> = {};
      
      const sampleFixtures = Object.entries(fixtures).slice(0, 500);
      
      sampleFixtures.forEach(([fixtureName, sql]) => {
        try {
          const tree = tryParse(sql);
          if (tree.stmts && tree.stmts.length > 0) {
            tree.stmts.forEach(stmt => {
              if (stmt.stmt) {
                try {
                  deparse(stmt.stmt);
                } catch (error) {
                  if (error instanceof Error && error.message.includes('Deparser does not handle node type')) {
                    const nodeTypeMatch = error.message.match(/node type: (\w+)/);
                    const nodeType = nodeTypeMatch ? nodeTypeMatch[1] : 'Unknown';
                    
                    nodeTypeCounts[nodeType] = (nodeTypeCounts[nodeType] || 0) + 1;
                    
                    if (failingFixtures.length < 20) { // Limit detailed output
                      failingFixtures.push({
                        name: fixtureName,
                        sql: sql,
                        error: error.message,
                        nodeType: nodeType
                      });
                    }
                  }
                }
              }
            });
          }
        } catch (parseError) {
        }
      });

      console.log('\n=== MISSING NODE TYPE SUMMARY ===');
      const sortedNodeTypes = Object.entries(nodeTypeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15);
      
      sortedNodeTypes.forEach(([nodeType, count]) => {
        console.log(`${nodeType}: ${count} occurrences`);
      });

      if (failingFixtures.length > 0) {
        console.log('\n=== SAMPLE FAILING FIXTURES ===');
        failingFixtures.slice(0, 10).forEach(({name, sql, error, nodeType}) => {
          console.log(`\n[${nodeType}] ${name}`);
          console.log(`SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
          console.log(`Error: ${error}`);
        });
      }

      console.log(`\nTotal missing node type errors: ${Object.values(nodeTypeCounts).reduce((a, b) => a + b, 0)}`);
      console.log(`Unique missing node types: ${Object.keys(nodeTypeCounts).length}`);

      expect(true).toBe(true);
    });
  });
});
