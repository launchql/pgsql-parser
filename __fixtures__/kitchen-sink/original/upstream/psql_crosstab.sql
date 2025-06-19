--
-- \crosstabview
--

CREATE TABLE ctv_data (v, h, c, i, d) AS
VALUES
   ('v1','h2','foo', 3, '2015-04-01'::date),
   ('v2','h1','bar', 3, '2015-01-02'),
   ('v1','h0','baz', NULL, '2015-07-12'),
   ('v0','h4','qux', 4, '2015-07-15'),
   ('v0','h4','dbl', -3, '2014-12-15'),
   ('v0',NULL,'qux', 5, '2014-07-15'),
   ('v1','h2','quux',7, '2015-04-04');

-- running \crosstabview after query uses query in buffer
SELECT v, EXTRACT(year FROM d), count(*)
 FROM ctv_data
 GROUP BY 1, 2
 ORDER BY 1, 2;
-- basic usage with 3 columns



-- ordered months in horizontal header, quoted column name
SELECT v, to_char(d, 'Mon') AS "month name", EXTRACT(month FROM d) AS num,
 count(*) FROM ctv_data  GROUP BY 1,2,3 ORDER BY 1;



-- ordered months in vertical header, ordered years in horizontal header
-- SELECT EXTRACT(year FROM d) AS year, to_char(d,'Mon') AS "month name",
--   EXTRACT(month FROM d) AS month,
--   format('sum=%s avg=%s', sum(i), avg(i)::numeric(2,1))
--   FROM ctv_data
--   GROUP BY EXTRACT(year FROM d), to_char(d,'Mon'), EXTRACT(month FROM d)
-- ORDER BY month



-- combine contents vertically into the same cell (V/H duplicates)
-- SELECT v, h, string_agg(c, E'\n') FROM ctv_data GROUP BY v, h ORDER BY 1,2,3



-- horizontal ASC order from window function
SELECT v,h, string_agg(c, E'\n') AS c, row_number() OVER(ORDER BY h) AS r
FROM ctv_data GROUP BY v, h ORDER BY 1,3,2;



-- horizontal DESC order from window function
SELECT v, h, string_agg(c, E'\n') AS c, row_number() OVER(ORDER BY h DESC) AS r
FROM ctv_data GROUP BY v, h ORDER BY 1,3,2;



-- horizontal ASC order from window function, NULLs pushed rightmost
SELECT v,h, string_agg(c, E'\n') AS c, row_number() OVER(ORDER BY h NULLS LAST) AS r
FROM ctv_data GROUP BY v, h ORDER BY 1,3,2;



-- only null, no column name, 2 columns: error
-- SELECT null,null \crosstabview

-- only null, no column name, 3 columns: works
-- SELECT null,null,null \crosstabview

-- null display


SELECT v,h, string_agg(i::text, E'\n') AS i FROM ctv_data
GROUP BY v, h ORDER BY h,v;





-- refer to columns by position
SELECT v,h,string_agg(i::text, E'\n'), string_agg(c, E'\n')
FROM ctv_data GROUP BY v, h ORDER BY h,v;



-- refer to columns by positions and names mixed
SELECT v,h, string_agg(i::text, E'\n') AS i, string_agg(c, E'\n') AS c
FROM ctv_data GROUP BY v, h ORDER BY h,v;



-- refer to columns by quoted names, check downcasing of unquoted name
SELECT 1 as "22", 2 as b, 3 as "Foo";



-- error: bad column name
SELECT v,h,c,i FROM ctv_data;



-- error: need to quote name
SELECT 1 as "22", 2 as b, 3 as "Foo";



-- error: need to not quote name
SELECT 1 as "22", 2 as b, 3 as "Foo";



-- error: bad column number
SELECT v,h,i,c FROM ctv_data;



-- error: same H and V columns
SELECT v,h,i,c FROM ctv_data;



-- error: too many columns
SELECT a,a,1 FROM generate_series(1,3000) AS a;



-- error: only one column
-- SELECT 1 \crosstabview

DROP TABLE ctv_data;
