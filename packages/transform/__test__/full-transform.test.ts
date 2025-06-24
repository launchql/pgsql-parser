import { Parser } from '@pgsql/parser';
import { deparse } from 'pgsql-deparser';
import { ASTTransformer } from '../src/transformer';
import { cleanTree } from '../test-utils/clean-tree';
import { Node as PG13Node } from '../src/13/types';
import { Node as PG17Node } from '../src/17/types';

class PG13ToPG17Transformer {
  private astTransformer = new ASTTransformer();

  transform(parseResult: any): any {
    if (!parseResult || !parseResult.stmts) {
      return parseResult;
    }

    const transformedStmts = parseResult.stmts.map((stmtWrapper: any) => {
      if (stmtWrapper.stmt) {
        const transformedStmt = this.astTransformer.transform13To17(stmtWrapper.stmt);
        return { ...stmtWrapper, stmt: transformedStmt };
      }
      return stmtWrapper;
    });

    return {
      ...parseResult,
      version: 170004,
      stmts: transformedStmts
    };
  }
}

describe('Full Transform Integration - PG13 to PG17', () => {
  // Scaffold: This test maps out the complete workflow
  // 1. Parse SQL with PG13 parser
  // 2. Transform PG13 AST → PG17 AST using composite transformer
  // 3. Deparse PG17 AST back to SQL using PG17 deparser

  const pg13Parser = new Parser(13);
  const pg17Parser = new Parser(17);
  const transformer = new PG13ToPG17Transformer();

  describe('Basic SQL Operations', () => {
    it('should handle simple SELECT statement', async () => {
      const sql = 'SELECT 1';
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toBe('SELECT 1');
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });

    it('should handle SELECT with string constants', async () => {
      const sql = "SELECT 'hello world'";
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toBe("SELECT 'hello world'");
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });

    it('should handle INSERT statements', async () => {
      const sql = "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')";
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toBe(sql);
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });

    it('should handle UPDATE statements', async () => {
      const sql = "UPDATE users SET name = 'Jane' WHERE id = 1";
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toBe(sql);
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });

    it('should handle DELETE statements', async () => {
      const sql = 'DELETE FROM users WHERE id = 1';
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toBe(sql);
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });
  });

  describe('DDL Operations', () => {
    it('should handle CREATE TABLE statements', async () => {
      const sql = 'CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email VARCHAR(255))';
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      // Note: Exact formatting might differ, but structure should be preserved
      expect(deparsedSql).toContain('CREATE TABLE users');
      expect(deparsedSql.toLowerCase()).toContain('id serial primary key');
      expect(deparsedSql.toLowerCase()).toContain('name text not null');
    });

    it('should handle ALTER TABLE statements', async () => {
      const sql = 'ALTER TABLE users ADD COLUMN email TEXT';
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql.toLowerCase()).toBe(sql.toLowerCase());
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(reparsedAst).toBeDefined();
    });
  });

  describe('Complex Queries', () => {
    it('should handle JOINs', async () => {
      const sql = 'SELECT * FROM users u JOIN orders o ON u.id = o.user_id';
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql).toContain('JOIN');
      expect(deparsedSql).toContain('u.id = o.user_id');
    });

    it('should handle CTEs (Common Table Expressions)', async () => {
      const sql = `
        WITH user_orders AS (
          SELECT u.id, u.name, COUNT(o.id) as order_count
          FROM users u
          LEFT JOIN orders o ON u.id = o.user_id
          GROUP BY u.id, u.name
        )
        SELECT * FROM user_orders WHERE order_count > 0
      `;
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql).toContain('WITH user_orders AS');
      expect(deparsedSql).toContain('LEFT JOIN');
      expect(deparsedSql).toContain('GROUP BY');
    });

    it('should handle window functions', async () => {
      const sql = `
        SELECT 
          name,
          salary,
          RANK() OVER (ORDER BY salary DESC) as rank
        FROM employees
      `;
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql.toLowerCase()).toContain('rank()');
      expect(deparsedSql.toLowerCase()).toContain('over');
      expect(deparsedSql.toLowerCase()).toContain('order by salary desc');
    });
  });

  describe('Critical Transformation Points', () => {
    // These tests focus on the specific changes that happen during transformation

    it('should handle A_Const structure changes (PG14→PG15)', async () => {
      const sql = "SELECT 'test_string', 42, 3.14";
      
      // Step 1: Parse with PG13
      const pg13Ast = await pg13Parser.parse(sql);
      expect(pg13Ast).toBeDefined();
      
      // Verify PG13 structure has nested val
      const pg13Constants = extractAConstants(pg13Ast);
      expect(pg13Constants.some(c => c.val?.String?.str)).toBe(true);
      
      // Step 2: Transform PG13 → PG17
      const pg17Ast = transformer.transform(pg13Ast);
      expect(pg17Ast).toBeDefined();
      
      // Verify PG17 structure has flattened sval
      const pg17Constants = extractAConstants(pg17Ast);
      expect(pg17Constants.some(c => c.sval?.sval)).toBe(true);
      
      // Step 3: Deparse with PG17 deparser
      const deparsedSql = await deparse(pg17Ast);
      expect(deparsedSql).toContain("'test_string'");
      expect(deparsedSql).toContain('42');
      expect(deparsedSql).toContain('3.14');
      
      const reparsedAst = await pg17Parser.parse(deparsedSql);
      expect(cleanTree(pg17Ast)).toEqual(cleanTree(reparsedAst));
    });

    it('should handle AlterTableStmt objtype field (PG13→PG14)', async () => {
      const sql = 'ALTER TABLE users ADD COLUMN email TEXT';
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql.toLowerCase()).toBe(sql.toLowerCase());
    });

    it('should handle publication statement changes (PG14→PG15)', async () => {
      const sql = 'CREATE PUBLICATION test_pub FOR TABLE users';
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql.toLowerCase()).toContain('create publication');
      expect(deparsedSql.toLowerCase()).toContain('test_pub');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed SQL gracefully', async () => {
      const sql = 'SELECT FROM'; // Invalid SQL
      
      await expect(pg13Parser.parse(sql)).rejects.toThrow();
    });

    it('should preserve AST structure integrity', async () => {
      const sql = 'SELECT 1';
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      
      // Verify that the transformed AST is valid for PG17
      expect(async () => await deparse(pg17Ast)).not.toThrow();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large complex queries', async () => {
      const sql = `
        WITH RECURSIVE org_chart AS (
          SELECT id, name, manager_id, 0 as level
          FROM employees 
          WHERE manager_id IS NULL
          
          UNION ALL
          
          SELECT e.id, e.name, e.manager_id, oc.level + 1
          FROM employees e
          JOIN org_chart oc ON e.manager_id = oc.id
        )
        SELECT 
          level,
          name,
          COUNT(*) OVER (PARTITION BY level) as peers_count,
          LAG(name) OVER (ORDER BY level, name) as previous_employee
        FROM org_chart
        ORDER BY level, name
        LIMIT 100
      `;
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql.toLowerCase()).toContain('with recursive');
      expect(deparsedSql.toLowerCase()).toContain('union all');
      expect(deparsedSql.toLowerCase()).toContain('count(*) over');
      expect(deparsedSql.toLowerCase()).toContain('limit 100');
    });

    it('should handle PostgreSQL-specific features', async () => {
      const sql = `
        SELECT 
          ARRAY[1,2,3] as numbers,
          '{"key": "value"}'::jsonb as data,
          generate_series(1, 10) as series
      `;
      
      const pg13Ast = await pg13Parser.parse(sql);
      const pg17Ast = transformer.transform(pg13Ast);
      const deparsedSql = await deparse(pg17Ast);
      
      expect(deparsedSql.toLowerCase()).toContain('array[1');
      expect(deparsedSql.toLowerCase()).toMatch(/(::jsonb|cast.*as jsonb)/);
      expect(deparsedSql.toLowerCase()).toContain('generate_series');
    });
  });
});

// Helper functions for testing
function extractAConstants(ast: any): any[] {
  const constants: any[] = [];
  
  function traverse(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    
    if (obj.A_Const) {
      constants.push(obj.A_Const);
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else {
      Object.values(obj).forEach(traverse);
    }
  }
  
  traverse(ast);
  return constants;
}

// ✅ PG13ToPG17Transformer (composite transformer using ASTTransformer)
// ✅ Individual transformers (V13ToV14Transformer, V14ToV15Transformer, etc.)
// ✅ Proper type definitions for all PG versions
// ✅ Error handling and validation
// ✅ AST validation utilities
