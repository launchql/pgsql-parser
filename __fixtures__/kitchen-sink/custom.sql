SELECT * FROM tab ORDER BY col USING <;

SELECT * FROM tab ORDER BY col USING >;

SELECT * FROM tab ORDER BY col USING =;

SELECT * FROM tab ORDER BY col USING = NULLS FIRST, col2 USING < NULLS LAST;

SELECT mleast(VARIADIC arr := ARRAY[10, -1, 5, 4.4]);

SELECT encode(E'''123\\000\\001', 'base64');

SELECT U&'\0441\043B\043E\043D';

SELECT U&'d\0061t\+000061';

SELECT 3 OPERATOR(pg_catalog.+) 4;

SELECT * FROM ROWS FROM( getfoo6(1) AS (fooid int, foosubid int, fooname text), getfoo7(1) as (fooid int, foosubid int, fooname text) ) AS (fooid int, foosubid int, fooname text);

select a from b where a < (select 1);

select a from b where a < all (select 1);

select a from b where a < any (select 1);

select a from b where exists (select 1);

select a from b where a < ARRAY (select distinct (select 1), (select distinct 1 group by 7 having 1 < (select 1)));

SELECT 1 WHERE 'abc' SIMILAR TO 'abc';

SELECT 1 WHERE 'abc' SIMILAR TO test('test');

SELECT 1 WHERE 'abc' SIMILAR TO test('test') ESCAPE 't';

select 1::bit;

SET client_encoding='UNICODE';

SET client_encoding TO 'UNICODE';

SET client_min_messages=notice;

SHOW client_encoding;
