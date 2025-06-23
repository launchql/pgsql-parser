import { deparseSync } from '../../src';
import { parse } from 'libpg-query';
import { expectParseDeparse } from '../../test-utils';

describe('Pretty Misc SQL formatting', () => {
  const misc1Sql = `WITH recent_orders AS (
  SELECT o.id, o.user_id, o.created_at
  FROM orders o
  WHERE o.created_at > NOW() - INTERVAL '30 days'
), high_value_orders AS (
  SELECT r.user_id, COUNT(*) AS order_count, SUM(oi.price * oi.quantity) AS total_spent
  FROM recent_orders r
  JOIN order_items oi ON r.id = oi.order_id
  GROUP BY r.user_id
)
SELECT u.id, u.name, h.total_spent
FROM users u
JOIN high_value_orders h ON u.id = h.user_id
WHERE h.total_spent > 1000
ORDER BY h.total_spent DESC`;

  const misc2Sql = `SELECT
  department,
  employee_id,
  COUNT(*) FILTER (WHERE status = 'active') OVER (PARTITION BY department) AS active_count,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank
FROM employee_status
GROUP BY GROUPING SETS ((department), (department, employee_id))`;

  const misc3Sql = `SELECT u.id, u.name, j.key, j.value
FROM users u,
LATERAL jsonb_each_text(u.preferences) AS j(key, value)
WHERE j.key LIKE 'notif_%' AND j.value::boolean = true`;

  const misc4Sql = `SELECT p.id, p.title,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM reviews r
      WHERE r.product_id = p.id AND r.rating >= 4
    ) THEN 'Popular'
    ELSE 'Unrated'
  END AS status
FROM products p
WHERE p.archived = false`;

  const misc5Sql = `WITH logs AS (
  SELECT id, payload::json->>'event' AS event, (payload::json->>'ts')::timestamp AS ts
  FROM event_log
  WHERE ts > NOW() - INTERVAL '7 days'
)
SELECT event, COUNT(*) AS freq
FROM (
  SELECT DISTINCT event, ts::date AS event_day
  FROM logs
) d
GROUP BY event
ORDER BY freq DESC`;

  const misc6Sql = `SELECT 
  o.id AS order_id,
  u.name AS user_name,
  p.name AS product_name,
  s.status,
  sh.shipped_at,
  r.refund_amount
FROM orders o
JOIN users u 
  ON o.user_id = u.id
JOIN order_items oi 
  ON oi.order_id = o.id
JOIN products p 
  ON (
    (p.id = oi.product_id AND p.available = true)
    OR 
    (p.sku = oi.product_sku AND (p.discontinued = false OR p.replacement_id IS NOT NULL))
  )
LEFT JOIN shipping sh 
  ON (
    sh.order_id = o.id 
    AND (
      (sh.carrier = 'UPS' AND sh.tracking_number IS NOT NULL)
      OR 
      (sh.carrier = 'FedEx' AND sh.shipped_at > o.created_at + INTERVAL '1 day')
    )
  )
LEFT JOIN statuses s 
  ON s.id = o.status_id 
  AND (
    s.name != 'cancelled'
    OR (s.name = 'cancelled' AND s.updated_at > NOW() - INTERVAL '7 days')
  )
LEFT JOIN refunds r 
  ON r.order_id = o.id 
  AND (
    (r.status = 'approved' AND r.processed_at IS NOT NULL)
    OR 
    (r.status = 'pending' AND r.requested_at < NOW() - INTERVAL '14 days')
  )
WHERE o.created_at > NOW() - INTERVAL '90 days'
  AND u.active = true
  AND (
    s.status = 'shipped' 
    OR (
      s.status = 'processing' 
      AND EXISTS (
        SELECT 1 FROM order_notes n WHERE n.order_id = o.id AND n.note ILIKE '%expedite%'
      )
    )
  )
ORDER BY o.created_at DESC`;

  it('should format misc-1: Complex CTE with joins and aggregation (pretty)', async () => {
    const result = await expectParseDeparse(misc1Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-1: Complex CTE with joins and aggregation (non-pretty)', async () => {
    const result = await expectParseDeparse(misc1Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-2: Window functions with FILTER and GROUPING SETS (pretty)', async () => {
    const result = await expectParseDeparse(misc2Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-2: Window functions with FILTER and GROUPING SETS (non-pretty)', async () => {
    const result = await expectParseDeparse(misc2Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-3: LATERAL joins with JSON functions (pretty)', async () => {
    const result = await expectParseDeparse(misc3Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-3: LATERAL joins with JSON functions (non-pretty)', async () => {
    const result = await expectParseDeparse(misc3Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-4: EXISTS with nested subqueries and CASE (pretty)', async () => {
    const result = await expectParseDeparse(misc4Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-4: EXISTS with nested subqueries and CASE (non-pretty)', async () => {
    const result = await expectParseDeparse(misc4Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-5: Nested CTEs with type casts and subqueries (pretty)', async () => {
    const result = await expectParseDeparse(misc5Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-5: Nested CTEs with type casts and subqueries (non-pretty)', async () => {
    const result = await expectParseDeparse(misc5Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-6: Complex multi-table joins with nested conditions (pretty)', async () => {
    const result = await expectParseDeparse(misc6Sql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format misc-6: Complex multi-table joins with nested conditions (non-pretty)', async () => {
    const result = await expectParseDeparse(misc6Sql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should validate AST equivalence for all misc cases', async () => {
    const testCases = [misc1Sql, misc2Sql, misc3Sql, misc4Sql, misc5Sql, misc6Sql];
    
    for (const sql of testCases) {
      await expectParseDeparse(sql, { pretty: false });
      await expectParseDeparse(sql, { pretty: true });
    }
  });
});
