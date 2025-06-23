SELECT id, name, email FROM users WHERE active = true;

SELECT 
  u.id,
  u.name,
  u.email,
  p.title as profile_title
FROM users u
JOIN profiles p ON u.id = p.user_id
WHERE u.active = true
  AND u.created_at > '2023-01-01'
GROUP BY u.id, u.name, u.email, p.title
HAVING COUNT(*) > 1
ORDER BY u.created_at DESC, u.name ASC
LIMIT 10
OFFSET 5;

SELECT id, name FROM users WHERE id IN (
  SELECT user_id FROM orders WHERE total > 100
);

SELECT name FROM customers
UNION ALL
SELECT name FROM suppliers
ORDER BY name;

SELECT name, email FROM users WHERE status = 'active';

SELECT u.name, o.total FROM users u, orders o WHERE u.id = o.user_id;
