-- 1. Single simple target (no newline)
SELECT 1;

-- 2. Single casted literal (no newline)
SELECT 'abc'::text;

-- 3. Single function call with operator (no newline)
SELECT now() AT TIME ZONE 'UTC';

-- 4. Multiple literals (newline format)
SELECT
  1,
  2;

-- 5. Multiple identifiers (newline format)
SELECT
  id,
  name,
  email
FROM users;

-- 6. SELECT with DISTINCT and single target (no newline)
SELECT DISTINCT id FROM users;

-- 7. SELECT with DISTINCT and multiple targets (newline format)
SELECT DISTINCT
  id,
  name
FROM users;

-- 8. SELECT with aliasing and expressions (newline format)
SELECT
  id,
  upper(name) AS name_upper,
  created_at + interval '1 day' AS expires_at
FROM accounts;

-- 9. SELECT with subselect (single target, no newline)
SELECT (SELECT max(score) FROM results);

-- 10. SELECT with function and window (multiple targets, newline format)
SELECT
  count(*) OVER (),
  u.id
FROM users u;


-- 11. Union query combining customer and supplier names with ALL modifier
SELECT
  name
FROM customers
UNION
ALL
SELECT
  name
FROM suppliers
ORDER BY
  name;


-- 12. Complex join query demonstrating multiple join types (INNER, LEFT, RIGHT)
SELECT
  u.id,
  u.name,
  u.email,
  p.title
FROM users AS u
JOIN profiles AS p ON u.id = p.user_id
LEFT JOIN orders AS o ON u.id = o.user_id
RIGHT JOIN addresses AS a ON u.id = a.user_id
WHERE
  u.active = true;

-- 13. Subquery in WHERE clause using IN operator
SELECT
  id,
  name
FROM users
WHERE
  id IN (SELECT
  user_id
FROM orders
WHERE
  total > 100);


-- 14. Basic SELECT with WHERE clause filtering active users
SELECT
  id,
  name,
  email
FROM users
WHERE
  active = true;
  
-- 15. Complex query with JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT and OFFSET
SELECT
  u.id,
  u.name,
  u.email,
  p.title
FROM users AS u
JOIN profiles AS p ON u.id = p.user_id
WHERE
  u.active = true
  AND u.created_at > '2023-01-01'
GROUP BY
  u.id,
  u.name,
  u.email,
  p.title
HAVING
  count(*) > 1
ORDER BY
  u.created_at DESC,
  u.name ASC
LIMIT 10
OFFSET 5;