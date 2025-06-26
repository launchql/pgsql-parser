-- 1. Simple function call with one string arg
SELECT handle_insert('TYPE_A');

-- 2. Function call with mixed-case literal (should preserve case)
SELECT "HandleInsert"('TYPE_A', 'Region-1');

-- 3. Function call with numeric and boolean args
SELECT compute_score(42, TRUE);

-- 4. Schema-qualified function call
SELECT metrics.get_total('2025-01-01', '2025-01-31');

-- 5. Function call in WHERE clause
SELECT * FROM users WHERE is_active(user_id);

-- 6. Function call returning composite type
SELECT * FROM get_user_details(1001);

-- 7. Function call inside FROM clause (set-returning)
SELECT * FROM get_recent_events('login') AS events;

-- 8. Function call with quoted identifiers and args
SELECT "Analytics"."RunQuery"('Q-123', '2025-06');

-- 9. Function call with nested expressions
SELECT calculate_discount(price * quantity, customer_tier);

-- 10. Procedure-style call (PL/pgSQL do-nothing)
SELECT perform_backup('daily', FALSE);
