select node->'relation'->'RangeVar' IS NOT NULL
FROM my_json_store;

select node->'relation'->'RangeVar' IS NOT NULL AND
        node->'relation'->'RangeVar'->>'inh' IS NULL
FROM my_json_store;

select a IS NOT NULL AND
        b IS NULL OR
        (c IS NOT NULL AND
        (a->'inh')::bool IS FALSE)
FROM my_json_store;

select node->'relation'->'RangeVar' IS NOT NULL AND
        node->'relation'->'RangeVar'->'inh' IS NULL OR
        (node->'relation'->'RangeVar'->'inh' IS NOT NULL AND
        (node->'relation'->'RangeVar'->'inh')::bool IS FALSE)
FROM my_json_store;

SELECT 
A AND B 
AND C OR D
FROM t;

SELECT 
A AND B 
AND C OR D OR (E AND F OR G)
FROM t;

SELECT 
A AND B 
AND (C)::bool IS TRUE OR D OR (E AND F OR G)
FROM t;

SELECT 
NOT (A AND B)
AND C OR NOT D
FROM t;

SELECT 
NOT (A AND B)
AND C
FROM t;

SELECT (NOT ((a AND b)) AND c) FROM t;

SELECT (field=1 OR field=2) IS TRUE;

SELECT field=1 OR field=2 IS TRUE;