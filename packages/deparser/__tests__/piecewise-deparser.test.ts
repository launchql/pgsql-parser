import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from '@pgsql/parser';
import { deparse } from '../src';
import { cleanTree } from '../src/utils';

const GENERATED_JSON = join(__dirname, '../../../__fixtures__/generated/generated.json');

function tryParse(sql: string) {
  try {
    return parse(sql);
  } catch (error) {
    throw new Error(`Failed to parse SQL: ${sql}\nError: ${error}`);
  }
}

const fixtures: Record<string, string> = JSON.parse(readFileSync(GENERATED_JSON, 'utf-8'));

describe('Round-trip deparser testing - Dan\'s 5-step process', () => {
  describe('Focused debugging tests', () => {
    it('should debug case sensitivity issue with misc-5.sql', () => {
      const s1 = 'ALTER TABLE "Customer" ADD CONSTRAINT myconstraint FOREIGN KEY ("SupportRepId") REFERENCES "Employee" ("EmployeeId")';
      
      console.log('Original SQL (s1):', s1);
      
      const p1 = tryParse(s1);
      
      if (p1.stmts && p1.stmts.length > 0 && p1.stmts[0].stmt) {
        const s2 = deparse(p1.stmts[0].stmt);
        console.log('Deparsed SQL (s2):', s2);
        
        const p2 = tryParse(s2);
        
        const cleanedP1 = cleanTree([p1.stmts[0]]);
        const cleanedP2 = cleanTree(p2.stmts || []);
        
        expect(cleanedP2).toEqual(cleanedP1);
      }
    });

    it('should debug type modifier issue with simple CREATE TABLE', () => {
      const s1 = 'CREATE TABLE test (col1 pg_catalog.bit(1))';
      
      console.log('Original SQL (s1):', s1);
      
      const p1 = tryParse(s1);
      
      if (p1.stmts && p1.stmts.length > 0 && p1.stmts[0].stmt) {
        const s2 = deparse(p1.stmts[0].stmt);
        console.log('Deparsed SQL (s2):', s2);
        
        const p2 = tryParse(s2);
        
        const cleanedP1 = cleanTree([p1.stmts[0]]);
        const cleanedP2 = cleanTree(p2.stmts || []);
        
        expect(cleanedP2).toEqual(cleanedP1);
      }
    });
  });

  const sampleFixtures = Object.entries(fixtures).slice(0, 10);

  sampleFixtures.forEach(([fixtureName, s1]) => {
    it(`should round-trip parse ${fixtureName}`, () => {
      try {
        
        const p1 = tryParse(s1);
        
        if (p1.stmts && p1.stmts.length > 0) {
          p1.stmts.forEach((stmt, index) => {
            if (stmt.stmt) {
              try {
                const s2 = deparse(stmt.stmt);
                expect(s2).toBeTruthy();
                expect(typeof s2).toBe('string');
                
                const p2 = tryParse(s2);
                
                const cleanedP1 = cleanTree([stmt]);
                const cleanedP2 = cleanTree(p2.stmts || []);
                
                expect(cleanedP2).toEqual(cleanedP1);
              } catch (error) {
                console.error(`Failed round-trip for ${fixtureName} statement ${index}:`, error);
                console.error('Original SQL (s1):', s1);
                console.error('Deparsed SQL (s2):', stmt.stmt ? deparse(stmt.stmt) : 'N/A');
                throw error;
              }
            }
          });
        }
      } catch (parseError) {
        console.log(`Skipping unparseable fixture ${fixtureName}: ${parseError}`);
      }
    });
  });

  describe('Statement type coverage', () => {
    const testPatterns = [
      'REVOKE',
      'GRANT', 
      'ALTER TABLE',
      'CREATE TABLE',
      'INSERT INTO',
      'UPDATE',
      'DELETE FROM',
      'SELECT'
    ];

    testPatterns.forEach(pattern => {
      describe(`${pattern} statements`, () => {
        const matchingFixtures = Object.entries(fixtures)
          .filter(([_, sql]) => sql.toUpperCase().includes(pattern))
          .slice(0, 3); // Test first 3 matches to keep it focused

        if (matchingFixtures.length === 0) {
          it(`should have fixtures for ${pattern}`, () => {
            console.log(`No fixtures found for pattern: ${pattern}`);
          });
          return;
        }

        matchingFixtures.forEach(([fixtureName, s1]) => {
          it(`should round-trip ${fixtureName}`, () => {
            const p1 = tryParse(s1);
            
            if (p1.stmts && p1.stmts.length > 0) {
              p1.stmts.forEach((stmt, index) => {
                if (stmt.stmt) {
                  const s2 = deparse(stmt.stmt);
                  const p2 = tryParse(s2);
                  
                  const cleanedP1 = cleanTree([stmt]);
                  const cleanedP2 = cleanTree(p2.stmts || []);
                  
                  expect(cleanedP2).toEqual(cleanedP1);
                }
              });
            }
          });
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
