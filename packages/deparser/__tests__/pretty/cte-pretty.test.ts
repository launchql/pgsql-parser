import { expectParseDeparse } from '../../test-utils';

describe('Pretty CTE (Common Table Expressions) formatting', () => {
  const basicCteSql = `WITH regional_sales AS (SELECT region, SUM(sales_amount) as total_sales FROM sales GROUP BY region) SELECT * FROM regional_sales;`;
  
  const complexCteSql = `WITH regional_sales AS (SELECT region, SUM(sales_amount) as total_sales FROM sales GROUP BY region), top_regions AS (SELECT region FROM regional_sales WHERE total_sales > 1000000) SELECT * FROM top_regions;`;

  const recursiveCteSql = `WITH RECURSIVE employee_hierarchy AS (SELECT id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id, eh.level + 1 FROM employees e JOIN employee_hierarchy eh ON e.manager_id = eh.id) SELECT * FROM employee_hierarchy;`;

  const nestedCteSql = `WITH sales_summary AS (SELECT region, product_category, SUM(amount) as total FROM sales GROUP BY region, product_category), regional_totals AS (SELECT region, SUM(total) as region_total FROM sales_summary GROUP BY region) SELECT s.region, s.product_category, s.total, r.region_total FROM sales_summary s JOIN regional_totals r ON s.region = r.region;`;

  it('should format basic CTE with pretty option enabled', async () => {
    const result = await expectParseDeparse(basicCteSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const result = await expectParseDeparse(basicCteSql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex CTE with multiple CTEs with pretty option enabled', async () => {
    const result = await expectParseDeparse(complexCteSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format recursive CTE with pretty option enabled', async () => {
    const result = await expectParseDeparse(recursiveCteSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format nested CTE with complex joins with pretty option enabled', async () => {
    const result = await expectParseDeparse(nestedCteSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const result = await expectParseDeparse(basicCteSql, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });
});
