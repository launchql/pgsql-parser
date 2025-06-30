WITH regional_sales AS (SELECT region, SUM(sales_amount) as total_sales FROM sales GROUP BY region) SELECT * FROM regional_sales;

WITH regional_sales AS (SELECT region, SUM(sales_amount) as total_sales FROM sales GROUP BY region), top_regions AS (SELECT region FROM regional_sales WHERE total_sales > 1000000) SELECT * FROM top_regions;

WITH RECURSIVE employee_hierarchy AS (SELECT id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, e.manager_id, eh.level + 1 FROM employees e JOIN employee_hierarchy eh ON e.manager_id = eh.id) SELECT * FROM employee_hierarchy;

WITH sales_summary AS (SELECT region, product_category, SUM(amount) as total FROM sales GROUP BY region, product_category), regional_totals AS (SELECT region, SUM(total) as region_total FROM sales_summary GROUP BY region) SELECT s.region, s.product_category, s.total, r.region_total FROM sales_summary s JOIN regional_totals r ON s.region = r.region;
