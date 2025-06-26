-- 1. Insert with simple mixed-case string
INSERT INTO users (name) VALUES ('John Doe');

-- 2. Insert with ALL CAPS
INSERT INTO users (name) VALUES ('ADMINISTRATOR');

-- 3. Insert with lowercase only
INSERT INTO users (name) VALUES ('lowercase');

-- 4. Insert with camelCase
INSERT INTO users (name) VALUES ('camelCaseString');

-- 5. Insert with snake_case
INSERT INTO users (name) VALUES ('snake_case_string');

-- 6. Insert with kebab-case (string literal)
INSERT INTO users (name) VALUES ('kebab-case-value');

-- 7. Insert with JSON-looking string
INSERT INTO data.snapshots (metadata) VALUES ('{"Type": "Full", "Status": "OK"}');

-- 8. Insert into quoted table and column
INSERT INTO "AppSchema"."User Data" ("Full Name") VALUES ('Jane Smith');

-- 9. Insert multiple values with mixed casing
INSERT INTO logtable (message) VALUES ('Init'), ('Reboot'), ('ERROR'), ('Warning'), ('info');

-- 10. Insert a string that looks like a function
INSERT INTO metrics.logs (message) VALUES ('NOW()');

-- 11. Insert with exact keyword-looking string
INSERT INTO users (name) VALUES ('SELECT');

-- 12. Insert lowercase string with special characters
INSERT INTO users (name) VALUES ('john_doe@example.com');

-- 13. Select mixed-case string literal
SELECT 'MixedCase';

-- 14. Select all uppercase
SELECT 'UPPERCASE';

-- 15. Select lowercase
SELECT 'lowercase';

-- 16. Select camelCase
SELECT 'camelCase';

-- 17. Select snake_case
SELECT 'snake_case';

-- 18. Select kebab-case
SELECT 'kebab-case';

-- 19. Select string that looks like SQL
SELECT 'SELECT * FROM users';

-- 20. Select string that looks like a function
SELECT 'sum(a + b)';

-- 21. Select with alias and quoted output name
SELECT name AS "UserLabel" FROM users;

-- 22. Select where literal is camelCase
SELECT * FROM users WHERE name = 'camelCaseString';

-- 23. Select where literal is lowercase
SELECT * FROM users WHERE name = 'lowercase';

-- 24. Select where literal is ALL CAPS
SELECT * FROM users WHERE name = 'ADMINISTRATOR';

-- 25. Select where message starts with capital W
SELECT * FROM logs WHERE message LIKE 'Warn%';

-- 26. Select with multiple casing in IN clause
SELECT * FROM alerts WHERE level IN ('Low', 'MEDIUM', 'High', 'CRITICAL');

-- 27. Select string with escaped quote
SELECT 'It''s working';

-- 28. Select with E-prefixed escape string
SELECT E'Line1\\nLine2';

-- 29. Select with Unicode emoji string
SELECT 'Status: ✅';

-- 30. Select into quoted alias
SELECT 'ALERT' AS "Level";

-- 31. Select with quoted function name
SELECT "HandleInsert"('TYPE_A', 'Region-1');

-- 32. Select with quoted table name
SELECT * FROM "dataPoints";
