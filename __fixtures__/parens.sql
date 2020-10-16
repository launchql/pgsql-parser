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