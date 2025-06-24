import { expectSqlTransform, fullTransformFlow } from '../test-utils/full-transform-flow';

describe('Full Transform Integration - PG13 to PG17', () => {
  describe('Basic SQL Operations', () => {
    it('should handle simple SELECT statement', async () => {
      const sql = 'SELECT 1';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle SELECT with string constants', async () => {
      const sql = "SELECT 'hello world'";
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle INSERT statements', async () => {
      const sql = "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')";
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle UPDATE statements', async () => {
      const sql = "UPDATE users SET name = 'Jane' WHERE id = 1";
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle DELETE statements', async () => {
      const sql = 'DELETE FROM users WHERE id = 1';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });
  });

  describe('DDL Operations', () => {
    it('should handle CREATE TABLE statements', async () => {
      const sql = 'CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email VARCHAR(255))';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle ALTER TABLE statements', async () => {
      const sql = 'ALTER TABLE users ADD COLUMN email TEXT';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });
  });

  describe('Complex Queries', () => {
    it('should handle JOINs', async () => {
      const sql = 'SELECT * FROM users u JOIN orders o ON u.id = o.user_id';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
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
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle window functions', async () => {
      const sql = `
        SELECT 
          name,
          salary,
          RANK() OVER (ORDER BY salary DESC) as rank
        FROM employees
      `;
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });
  });

  describe('Critical Transformation Points', () => {
    // These tests focus on the specific changes that happen during transformation

    it('should handle A_Const structure changes (PG14→PG15)', async () => {
      const sql = "SELECT 'test_string', 42, 3.14";
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle AlterTableStmt objtype field (PG13→PG14)', async () => {
      const sql = 'ALTER TABLE users ADD COLUMN email TEXT';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
    });

    it('should handle publication statement changes (PG14→PG15)', async () => {
      const sql = 'CREATE PUBLICATION test_pub FOR TABLE users';
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();
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
      const result = await fullTransformFlow(sql, { validateRoundTrip: true });
      expect(result.deparsedSql).toBeTruthy();
      expect(result.deparsedSql.toLowerCase()).toContain('with recursive');
      expect(result.deparsedSql.toLowerCase()).toContain('union all');
      expect(result.deparsedSql.toLowerCase()).toContain('count(*) over');
      expect(result.deparsedSql.toLowerCase()).toContain('limit 100');
    });

    it('should handle PostgreSQL-specific features', async () => {
      const sql = `
        SELECT 
          ARRAY[1,2,3] as numbers,
          '{"key": "value"}'::jsonb as data,
          generate_series(1, 10) as series
      `;
      
      const result = await expectSqlTransform(sql);
      expect(result.deparsedSql).toBeTruthy();

    });
  });
});
