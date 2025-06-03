CREATE VIEW superschema.app_authorized_grants AS
      SELECT
        coalesce(nullif(s[1], ''), 'PUBLIC') as grantee,
        relname as table_name,
        nspname as table_schema,
        string_agg(s[2], ', ') as privileges,
        relkind as table_type
      FROM
        pg_class c
        join pg_namespace n on n.oid = relnamespace
        join pg_roles r on r.oid = relowner,
        unnest(coalesce(relacl::text[], format('{%%s=arwdDxt/%%s}', rolname, rolname)::text[])) acl, 
        regexp_split_to_array(acl, '=|/') s
      WHERE (s[1] = 'authenticated' or s[1] is null) and nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
      GROUP BY grantee, table_name, table_schema, relkind
      ORDER BY relkind != 'r', relkind != 'v', relkind != 'm', relkind != 'i', relkind, nspname, relname;

-- AEXPR_OP
select a = b;

-- AEXPR_OP_ANY
SELECT foo = ANY(x) FROM vtable;

-- AEXPR_OP_ALL
SELECT foo = ALL(x) FROM vtable;

-- AEXPR_DISTINCT
-- AEXPR_NOT_DISTINCT

SELECT foo,bar FROM vtable WHERE foo IS DISTINCT FROM bar;
SELECT foo,bar FROM vtable WHERE foo IS NOT DISTINCT FROM bar;

SELECT t1.foo,t1.bar,t1.baz
FROM t1
LEFT OUTER JOIN t2 ON (
 t1.foo IS NOT DISTINCT FROM t2.foo
 AND t1.bar IS NOT DISTINCT FROM t2.bar
 AND t1.baz IS NOT DISTINCT FROM t2.baz
)
WHERE ( t2.foo IS NULL );



-- AEXPR_NULLIF

select nullif(null, '');

-- AEXPR_OF

-- SELECT x, x IS OF (text) AS is_text FROM q;
-- SELECT x, x IS NOT OF (text) AS is_text FROM q;
-- SELECT COALESCE(4::domainint4, 7::domainint4) IS OF ( domainint4 ) AS t;

-- AEXPR_IN

SELECT
    value IN (SELECT column_name FROM table_name);

SELECT
    value NOT IN (SELECT column_name FROM table_name);

SELECT customer_id,
	rental_id,
	return_date
FROM
	rental
WHERE
	customer_id IN (1, 2)
ORDER BY
	return_date DESC;


SELECT
	customer_id,
	rental_id,
	return_date
FROM
	rental
WHERE
	customer_id NOT IN (1, 2);

SELECT
	customer_id,
	rental_id,
	return_date
FROM
	rental
WHERE
	customer_id <> 1
AND customer_id <> 2;

SELECT *
FROM Employees
WHERE name IN ('James John', 'Mercy Bush', 'Kate Joel');

SELECT *
FROM Employees
WHERE name NOT IN ('James John', 'Mercy Bush', 'Kate Joel');

SELECT customer_id
FROM rental
WHERE CAST (return_date AS DATE) = '2005-05-27'
ORDER BY customer_id;

SELECT
	customer_id,
	first_name,
	last_name
FROM
	customer
WHERE
	customer_id IN (
		SELECT customer_id
		FROM rental
		WHERE CAST (return_date AS DATE) = '2005-05-27'
	)
ORDER BY customer_id;

-- AEXPR_LIKE

SELECT * FROM student WHERE name LIKE 'a%';
SELECT * FROM student WHERE name NOT LIKE 'a%';
SELECT
	'foo' LIKE 'foo', 
	'foo' LIKE 'f%', 
	'foo' LIKE '_o_', 
	'bar' LIKE 'b_'; 

-- AEXPR_ILIKE

SELECT * FROM student WHERE name ILIKE 'a%';
SELECT * FROM student WHERE name NOT ILIKE 'a%';


-- AEXPR_SIMILAR

select 'xyz' SIMILAR TO 'xyz'; 
select 'xyz' SIMILAR TO 'x';    
select 'xyz' SIMILAR TO '%(y|a)%'; 
select 'xyz' SIMILAR TO '(y|z)%';

select 'xyz' SIMILAR TO 'xyz' ESCAPE 'x'; 
select 'xyz' SIMILAR TO 'x' ESCAPE 'x';    
select 'xyz' SIMILAR TO '%(y|a)%' ESCAPE 'x'; 
select 'xyz' SIMILAR TO '(y|z)%' ESCAPE 'x';

select 'xyz' NOT SIMILAR TO 'xyz'; 
select 'xyz' NOT SIMILAR TO 'x';    
select 'xyz' NOT SIMILAR TO '%(y|a)%'; 
select 'xyz' NOT SIMILAR TO '(y|z)%';

select 'xyz' NOT SIMILAR TO 'xyz' ESCAPE 'x'; 
select 'xyz' NOT SIMILAR TO 'x' ESCAPE 'x';    
select 'xyz' NOT SIMILAR TO '%(y|a)%' ESCAPE 'x'; 
select 'xyz' NOT SIMILAR TO '(y|z)%' ESCAPE 'x';

-- AEXPR_BETWEEN
-- AEXPR_NOT_BETWEEN
-- AEXPR_BETWEEN_SYM
-- AEXPR_NOT_BETWEEN_SYM

select * from generate_series(1,10) as numbers(a)
    where numbers.a between symmetric 6 and 3;

select * from generate_series(1,10) as numbers(a)
    where numbers.a between 6 and 3;

select * from generate_series(1,10) as numbers(a)
    where numbers.a not between symmetric 6 and 3;

select * from generate_series(1,10) as numbers(a)
    where numbers.a not between 6 and 3;
