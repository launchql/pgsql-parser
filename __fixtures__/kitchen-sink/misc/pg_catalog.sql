SELECT json_object('{}');

SELECT * FROM generate_series(1, 5);

SELECT get_byte(E'\\xDEADBEEF'::bytea, 1);

SELECT now();

SELECT clock_timestamp();

SELECT to_char(now(), 'YYYY-MM-DD HH24:MI:SS');

SELECT json_build_object('name', 'Alice', 'age', 30);

SELECT pg_typeof(42), pg_typeof('hello'), pg_typeof(now());

SELECT substring('abcdefg' FROM 2 FOR 3);

SELECT replace('hello world', 'l', 'L');

SELECT length('yolo');

SELECT position('G' IN 'ChatGPT');

SELECT trim('  padded text  ');  -- 'padded text'

SELECT ltrim('---abc', '-');     -- 'abc'

SELECT array_agg(id) FROM (VALUES (1), (2), (3)) AS t(id);

SELECT string_agg(name, ', ') FROM (VALUES ('Alice'), ('Bob'), ('Carol')) AS t(name);

SELECT json_agg(name) FROM (VALUES ('A'), ('B')) AS t(name);
