--
-- Test access privileges
--

-- Clean up in case a prior regression run failed

-- Suppress NOTICE messages when users/groups don't exist
SET client_min_messages TO 'warning';

DROP ROLE IF EXISTS regressgroup1;
DROP ROLE IF EXISTS regressgroup2;

DROP ROLE IF EXISTS regressuser1;
DROP ROLE IF EXISTS regressuser2;
DROP ROLE IF EXISTS regressuser3;
DROP ROLE IF EXISTS regressuser4;
DROP ROLE IF EXISTS regressuser5;
DROP ROLE IF EXISTS regressuser6;

SELECT lo_unlink(oid) FROM pg_largeobject_metadata;

RESET client_min_messages;

-- test proper begins here

CREATE USER regressuser1;
CREATE USER regressuser2;
CREATE USER regressuser3;
CREATE USER regressuser4;
CREATE USER regressuser5;
CREATE USER regressuser5;	-- duplicate

CREATE GROUP regressgroup1;
CREATE GROUP regressgroup2 WITH USER regressuser1, regressuser2;

ALTER GROUP regressgroup1 ADD USER regressuser4;

ALTER GROUP regressgroup2 ADD USER regressuser2;	-- duplicate
ALTER GROUP regressgroup2 DROP USER regressuser2;
GRANT regressgroup2 TO regressuser4 WITH ADMIN OPTION;

-- test owner privileges

SET SESSION AUTHORIZATION regressuser1;
SELECT session_user, current_user;

CREATE TABLE atest1 ( a int, b text );
SELECT * FROM atest1;
INSERT INTO atest1 VALUES (1, 'one');
DELETE FROM atest1;
UPDATE atest1 SET a = 1 WHERE b = 'blech';
TRUNCATE atest1;
BEGIN;
LOCK atest1 IN ACCESS EXCLUSIVE MODE;
COMMIT;

REVOKE ALL ON atest1 FROM PUBLIC;
SELECT * FROM atest1;

GRANT ALL ON atest1 TO regressuser2;
GRANT SELECT ON atest1 TO regressuser3, regressuser4;
SELECT * FROM atest1;

CREATE TABLE atest2 (col1 varchar(10), col2 boolean);
GRANT SELECT ON atest2 TO regressuser2;
GRANT UPDATE ON atest2 TO regressuser3;
GRANT INSERT ON atest2 TO regressuser4;
GRANT TRUNCATE ON atest2 TO regressuser5;


SET SESSION AUTHORIZATION regressuser2;
SELECT session_user, current_user;

-- try various combinations of queries on atest1 and atest2

SELECT * FROM atest1; -- ok
SELECT * FROM atest2; -- ok
INSERT INTO atest1 VALUES (2, 'two'); -- ok
INSERT INTO atest2 VALUES ('foo', true); -- fail
INSERT INTO atest1 SELECT 1, b FROM atest1; -- ok
UPDATE atest1 SET a = 1 WHERE a = 2; -- ok
UPDATE atest2 SET col2 = NOT col2; -- fail
SELECT * FROM atest1 FOR UPDATE; -- ok
SELECT * FROM atest2 FOR UPDATE; -- fail
DELETE FROM atest2; -- fail
TRUNCATE atest2; -- fail
BEGIN;
LOCK atest2 IN ACCESS EXCLUSIVE MODE; -- fail
COMMIT;
GRANT ALL ON atest1 TO PUBLIC; -- fail

-- checks in subquery, both ok
SELECT * FROM atest1 WHERE ( b IN ( SELECT col1 FROM atest2 ) );
SELECT * FROM atest2 WHERE ( col1 IN ( SELECT b FROM atest1 ) );


SET SESSION AUTHORIZATION regressuser3;
SELECT session_user, current_user;

SELECT * FROM atest1; -- ok
SELECT * FROM atest2; -- fail
INSERT INTO atest1 VALUES (2, 'two'); -- fail
INSERT INTO atest2 VALUES ('foo', true); -- fail
INSERT INTO atest1 SELECT 1, b FROM atest1; -- fail
UPDATE atest1 SET a = 1 WHERE a = 2; -- fail
UPDATE atest2 SET col2 = NULL; -- ok
UPDATE atest2 SET col2 = NOT col2; -- fails; requires SELECT on atest2
UPDATE atest2 SET col2 = true FROM atest1 WHERE atest1.a = 5; -- ok
SELECT * FROM atest1 FOR UPDATE; -- fail
SELECT * FROM atest2 FOR UPDATE; -- fail
DELETE FROM atest2; -- fail
TRUNCATE atest2; -- fail
BEGIN;
LOCK atest2 IN ACCESS EXCLUSIVE MODE; -- ok
COMMIT;

-- checks in subquery, both fail
SELECT * FROM atest1 WHERE ( b IN ( SELECT col1 FROM atest2 ) );
SELECT * FROM atest2 WHERE ( col1 IN ( SELECT b FROM atest1 ) );

SET SESSION AUTHORIZATION regressuser4;
SELECT * FROM atest1; -- ok


-- groups

SET SESSION AUTHORIZATION regressuser3;
CREATE TABLE atest3 (one int, two int, three int);
GRANT DELETE ON atest3 TO GROUP regressgroup2;

SET SESSION AUTHORIZATION regressuser1;

SELECT * FROM atest3; -- fail
DELETE FROM atest3; -- ok


-- views

SET SESSION AUTHORIZATION regressuser3;

CREATE VIEW atestv1 AS SELECT * FROM atest1; -- ok
/* The next *should* fail, but it's not implemented that way yet. */
CREATE VIEW atestv2 AS SELECT * FROM atest2;
CREATE VIEW atestv3 AS SELECT * FROM atest3; -- ok
/* Empty view is a corner case that failed in 9.2. */
CREATE VIEW atestv0 AS SELECT 0 as x WHERE false; -- ok

SELECT * FROM atestv1; -- ok
SELECT * FROM atestv2; -- fail
GRANT SELECT ON atestv1, atestv3 TO regressuser4;
GRANT SELECT ON atestv2 TO regressuser2;

SET SESSION AUTHORIZATION regressuser4;

SELECT * FROM atestv1; -- ok
SELECT * FROM atestv2; -- fail
SELECT * FROM atestv3; -- ok
SELECT * FROM atestv0; -- fail

-- Appendrels excluded by constraints failed to check permissions in 8.4-9.2.
select * from
  ((select a.q1 as x from int8_tbl a offset 0)
   union all
   (select b.q2 as x from int8_tbl b offset 0)) ss
where false;

set constraint_exclusion = on;
select * from
  ((select a.q1 as x, random() from int8_tbl a where q1 > 0)
   union all
   (select b.q2 as x, random() from int8_tbl b where q2 > 0)) ss
where x < 0;
reset constraint_exclusion;

CREATE VIEW atestv4 AS SELECT * FROM atestv3; -- nested view
SELECT * FROM atestv4; -- ok
GRANT SELECT ON atestv4 TO regressuser2;

SET SESSION AUTHORIZATION regressuser2;

-- Two complex cases:

SELECT * FROM atestv3; -- fail
SELECT * FROM atestv4; -- ok (even though regressuser2 cannot access underlying atestv3)

SELECT * FROM atest2; -- ok
SELECT * FROM atestv2; -- fail (even though regressuser2 can access underlying atest2)

-- Test column level permissions

SET SESSION AUTHORIZATION regressuser1;
CREATE TABLE atest5 (one int, two int unique, three int, four int unique);
CREATE TABLE atest6 (one int, two int, blue int);
GRANT SELECT (one), INSERT (two), UPDATE (three) ON atest5 TO regressuser4;
GRANT ALL (one) ON atest5 TO regressuser3;

INSERT INTO atest5 VALUES (1,2,3);

SET SESSION AUTHORIZATION regressuser4;
SELECT * FROM atest5; -- fail
SELECT one FROM atest5; -- ok
SELECT two FROM atest5; -- fail
SELECT atest5 FROM atest5; -- fail
SELECT 1 FROM atest5; -- ok
SELECT 1 FROM atest5 a JOIN atest5 b USING (one); -- ok
SELECT 1 FROM atest5 a JOIN atest5 b USING (two); -- fail
SELECT 1 FROM atest5 a NATURAL JOIN atest5 b; -- fail
SELECT (j.*) IS NULL FROM (atest5 a JOIN atest5 b USING (one)) j; -- fail
SELECT 1 FROM atest5 WHERE two = 2; -- fail
SELECT * FROM atest1, atest5; -- fail
SELECT atest1.* FROM atest1, atest5; -- ok
SELECT atest1.*,atest5.one FROM atest1, atest5; -- ok
SELECT atest1.*,atest5.one FROM atest1 JOIN atest5 ON (atest1.a = atest5.two); -- fail
SELECT atest1.*,atest5.one FROM atest1 JOIN atest5 ON (atest1.a = atest5.one); -- ok
SELECT one, two FROM atest5; -- fail

SET SESSION AUTHORIZATION regressuser1;
GRANT SELECT (one,two) ON atest6 TO regressuser4;

SET SESSION AUTHORIZATION regressuser4;
SELECT one, two FROM atest5 NATURAL JOIN atest6; -- fail still

SET SESSION AUTHORIZATION regressuser1;
GRANT SELECT (two) ON atest5 TO regressuser4;

SET SESSION AUTHORIZATION regressuser4;
SELECT one, two FROM atest5 NATURAL JOIN atest6; -- ok now

-- test column-level privileges for INSERT and UPDATE
INSERT INTO atest5 (two) VALUES (3); -- ok
INSERT INTO atest5 (three) VALUES (4); -- fail
INSERT INTO atest5 VALUES (5,5,5); -- fail
UPDATE atest5 SET three = 10; -- ok
UPDATE atest5 SET one = 8; -- fail
UPDATE atest5 SET three = 5, one = 2; -- fail
-- Check that column level privs are enforced in RETURNING
-- Ok.
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set three = 10;
-- Error. No SELECT on column three.
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set three = 10 RETURNING atest5.three;
-- Ok.  May SELECT on column "one":
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set three = 10 RETURNING atest5.one;
-- Check that column level privileges are enforced for EXCLUDED
-- Ok. we may select one
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set three = EXCLUDED.one;
-- Error. No select rights on three
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set three = EXCLUDED.three;
INSERT INTO atest5(two) VALUES (6) ON CONFLICT (two) DO UPDATE set one = 8; -- fails (due to UPDATE)
INSERT INTO atest5(three) VALUES (4) ON CONFLICT (two) DO UPDATE set three = 10; -- fails (due to INSERT)
-- Check that the the columns in the inference require select privileges
-- Error. No privs on four
INSERT INTO atest5(three) VALUES (4) ON CONFLICT (four) DO UPDATE set three = 10;

SET SESSION AUTHORIZATION regressuser1;
REVOKE ALL (one) ON atest5 FROM regressuser4;
GRANT SELECT (one,two,blue) ON atest6 TO regressuser4;

SET SESSION AUTHORIZATION regressuser4;
SELECT one FROM atest5; -- fail
UPDATE atest5 SET one = 1; -- fail
SELECT atest6 FROM atest6; -- ok

-- check error reporting with column privs
SET SESSION AUTHORIZATION regressuser1;
CREATE TABLE t1 (c1 int, c2 int, c3 int check (c3 < 5), primary key (c1, c2));
GRANT SELECT (c1) ON t1 TO regressuser2;
GRANT INSERT (c1, c2, c3) ON t1 TO regressuser2;
GRANT UPDATE (c1, c2, c3) ON t1 TO regressuser2;

-- seed data
INSERT INTO t1 VALUES (1, 1, 1);
INSERT INTO t1 VALUES (1, 2, 1);
INSERT INTO t1 VALUES (2, 1, 2);
INSERT INTO t1 VALUES (2, 2, 2);
INSERT INTO t1 VALUES (3, 1, 3);

SET SESSION AUTHORIZATION regressuser2;
INSERT INTO t1 (c1, c2) VALUES (1, 1); -- fail, but row not shown
UPDATE t1 SET c2 = 1; -- fail, but row not shown
INSERT INTO t1 (c1, c2) VALUES (null, null); -- fail, but see columns being inserted
INSERT INTO t1 (c3) VALUES (null); -- fail, but see columns being inserted or have SELECT
INSERT INTO t1 (c1) VALUES (5); -- fail, but see columns being inserted or have SELECT
UPDATE t1 SET c3 = 10; -- fail, but see columns with SELECT rights, or being modified

SET SESSION AUTHORIZATION regressuser1;
DROP TABLE t1;

-- test column-level privileges when involved with DELETE
SET SESSION AUTHORIZATION regressuser1;
ALTER TABLE atest6 ADD COLUMN three integer;
GRANT DELETE ON atest5 TO regressuser3;
GRANT SELECT (two) ON atest5 TO regressuser3;
REVOKE ALL (one) ON atest5 FROM regressuser3;
GRANT SELECT (one) ON atest5 TO regressuser4;

SET SESSION AUTHORIZATION regressuser4;
SELECT atest6 FROM atest6; -- fail
SELECT one FROM atest5 NATURAL JOIN atest6; -- fail

SET SESSION AUTHORIZATION regressuser1;
ALTER TABLE atest6 DROP COLUMN three;

SET SESSION AUTHORIZATION regressuser4;
SELECT atest6 FROM atest6; -- ok
SELECT one FROM atest5 NATURAL JOIN atest6; -- ok

SET SESSION AUTHORIZATION regressuser1;
ALTER TABLE atest6 DROP COLUMN two;
REVOKE SELECT (one,blue) ON atest6 FROM regressuser4;

SET SESSION AUTHORIZATION regressuser4;
SELECT * FROM atest6; -- fail
SELECT 1 FROM atest6; -- fail

SET SESSION AUTHORIZATION regressuser3;
DELETE FROM atest5 WHERE one = 1; -- fail
DELETE FROM atest5 WHERE two = 2; -- ok

-- check inheritance cases
SET SESSION AUTHORIZATION regressuser1;
CREATE TABLE atestc (fz int) INHERITS (atestp1, atestp2);
GRANT SELECT(fx,fy,oid) ON atestp2 TO regressuser2;
GRANT SELECT(fx) ON atestc TO regressuser2;

SET SESSION AUTHORIZATION regressuser2;
SELECT fx FROM atestp2; -- ok
SELECT fy FROM atestp2; -- ok
SELECT atestp2 FROM atestp2; -- ok
SELECT oid FROM atestp2; -- ok
SELECT fy FROM atestc; -- fail

SET SESSION AUTHORIZATION regressuser1;
GRANT SELECT(fy,oid) ON atestc TO regressuser2;

SET SESSION AUTHORIZATION regressuser2;
SELECT fx FROM atestp2; -- still ok
SELECT fy FROM atestp2; -- ok
SELECT atestp2 FROM atestp2; -- ok
SELECT oid FROM atestp2; -- ok

-- privileges on functions, languages

-- switch to superuser



REVOKE ALL PRIVILEGES ON LANGUAGE sql FROM PUBLIC;
GRANT USAGE ON LANGUAGE sql TO regressuser1; -- ok
GRANT USAGE ON LANGUAGE c TO PUBLIC; -- fail

SET SESSION AUTHORIZATION regressuser1;
GRANT USAGE ON LANGUAGE sql TO regressuser2; -- fail
CREATE FUNCTION testfunc1(int) RETURNS int AS 'select 2 * $1;' LANGUAGE sql;
CREATE FUNCTION testfunc2(int) RETURNS int AS 'select 3 * $1;' LANGUAGE sql;

REVOKE ALL ON FUNCTION testfunc1(int), testfunc2(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION testfunc1(int), testfunc2(int) TO regressuser2;
GRANT USAGE ON FUNCTION testfunc1(int) TO regressuser3; -- semantic error
GRANT ALL PRIVILEGES ON FUNCTION testfunc1(int) TO regressuser4;
GRANT ALL PRIVILEGES ON FUNCTION testfunc_nosuch(int) TO regressuser4;

CREATE FUNCTION testfunc4(boolean) RETURNS text
  AS 'select col1 from atest2 where col2 = $1;'
  LANGUAGE sql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION testfunc4(boolean) TO regressuser3;

SET SESSION AUTHORIZATION regressuser2;
SELECT testfunc1(5), testfunc2(5); -- ok
CREATE FUNCTION testfunc3(int) RETURNS int AS 'select 2 * $1;' LANGUAGE sql; -- fail

SET SESSION AUTHORIZATION regressuser3;
SELECT testfunc1(5); -- fail
SELECT col1 FROM atest2 WHERE col2 = true; -- fail
SELECT testfunc4(true); -- ok

SET SESSION AUTHORIZATION regressuser4;
SELECT testfunc1(5); -- ok

DROP FUNCTION testfunc1(int); -- fail




DROP FUNCTION testfunc1(int); -- ok
-- restore to sanity
GRANT ALL PRIVILEGES ON LANGUAGE sql TO PUBLIC;

-- privileges on types

-- switch to superuser



CREATE TYPE testtype1 AS (a int, b text);
REVOKE USAGE ON TYPE testtype1 FROM PUBLIC;
GRANT USAGE ON TYPE testtype1 TO regressuser2;
GRANT USAGE ON TYPE _testtype1 TO regressuser2; -- fail
GRANT USAGE ON DOMAIN testtype1 TO regressuser2; -- fail

CREATE DOMAIN testdomain1 AS int;
REVOKE USAGE on DOMAIN testdomain1 FROM PUBLIC;
GRANT USAGE ON DOMAIN testdomain1 TO regressuser2;
GRANT USAGE ON TYPE testdomain1 TO regressuser2; -- ok

SET SESSION AUTHORIZATION regressuser1;

-- commands that should fail

CREATE AGGREGATE testagg1a(testdomain1) (sfunc = int4_sum, stype = bigint);

CREATE DOMAIN testdomain2a AS testdomain1;

CREATE DOMAIN testdomain3a AS int;
CREATE FUNCTION castfunc(int) RETURNS testdomain3a AS $$ SELECT $1::testdomain3a $$ LANGUAGE SQL;
CREATE CAST (testdomain1 AS testdomain3a) WITH FUNCTION castfunc(int);
DROP FUNCTION castfunc(int) CASCADE;
DROP DOMAIN testdomain3a;

CREATE FUNCTION testfunc5a(a testdomain1) RETURNS int LANGUAGE SQL AS $$ SELECT $1 $$;
CREATE FUNCTION testfunc6a(b int) RETURNS testdomain1 LANGUAGE SQL AS $$ SELECT $1::testdomain1 $$;

CREATE OPERATOR !+! (PROCEDURE = int4pl, LEFTARG = testdomain1, RIGHTARG = testdomain1);

CREATE TABLE test5a (a int, b testdomain1);
CREATE TABLE test6a OF testtype1;
CREATE TABLE test10a (a int[], b testtype1[]);

CREATE TABLE test9a (a int, b int);
ALTER TABLE test9a ADD COLUMN c testdomain1;
ALTER TABLE test9a ALTER COLUMN b TYPE testdomain1;

CREATE TYPE test7a AS (a int, b testdomain1);

CREATE TYPE test8a AS (a int, b int);
ALTER TYPE test8a ADD ATTRIBUTE c testdomain1;
ALTER TYPE test8a ALTER ATTRIBUTE b TYPE testdomain1;

CREATE TABLE test11a AS (SELECT 1::testdomain1 AS a);

REVOKE ALL ON TYPE testtype1 FROM PUBLIC;

SET SESSION AUTHORIZATION regressuser2;

-- commands that should succeed

CREATE AGGREGATE testagg1b(testdomain1) (sfunc = int4_sum, stype = bigint);

CREATE DOMAIN testdomain2b AS testdomain1;

CREATE DOMAIN testdomain3b AS int;
CREATE FUNCTION castfunc(int) RETURNS testdomain3b AS $$ SELECT $1::testdomain3b $$ LANGUAGE SQL;
CREATE CAST (testdomain1 AS testdomain3b) WITH FUNCTION castfunc(int);

CREATE FUNCTION testfunc5b(a testdomain1) RETURNS int LANGUAGE SQL AS $$ SELECT $1 $$;
CREATE FUNCTION testfunc6b(b int) RETURNS testdomain1 LANGUAGE SQL AS $$ SELECT $1::testdomain1 $$;

CREATE OPERATOR !! (PROCEDURE = testfunc5b, RIGHTARG = testdomain1);

CREATE TABLE test5b (a int, b testdomain1);
CREATE TABLE test6b OF testtype1;
CREATE TABLE test10b (a int[], b testtype1[]);

CREATE TABLE test9b (a int, b int);
ALTER TABLE test9b ADD COLUMN c testdomain1;
ALTER TABLE test9b ALTER COLUMN b TYPE testdomain1;

CREATE TYPE test7b AS (a int, b testdomain1);

CREATE TYPE test8b AS (a int, b int);
ALTER TYPE test8b ADD ATTRIBUTE c testdomain1;
ALTER TYPE test8b ALTER ATTRIBUTE b TYPE testdomain1;

CREATE TABLE test11b AS (SELECT 1::testdomain1 AS a);

REVOKE ALL ON TYPE testtype1 FROM PUBLIC;



DROP AGGREGATE testagg1b(testdomain1);
DROP DOMAIN testdomain2b;
DROP OPERATOR !! (NONE, testdomain1);
DROP FUNCTION testfunc5b(a testdomain1);
DROP FUNCTION testfunc6b(b int);
DROP TABLE test5b;
DROP TABLE test6b;
DROP TABLE test9b;
DROP TABLE test10b;
DROP TYPE test7b;
DROP TYPE test8b;
DROP CAST (testdomain1 AS testdomain3b);
DROP FUNCTION castfunc(int) CASCADE;
DROP DOMAIN testdomain3b;
DROP TABLE test11b;

DROP TYPE testtype1; -- ok
DROP DOMAIN testdomain1; -- ok


-- truncate
SET SESSION AUTHORIZATION regressuser5;
TRUNCATE atest2; -- ok
TRUNCATE atest3; -- fail

-- has_table_privilege function

-- bad-input checks
select has_table_privilege(NULL,'pg_authid','select');
select has_table_privilege('pg_shad','select');
select has_table_privilege('nosuchuser','pg_authid','select');
select has_table_privilege('pg_authid','sel');
select has_table_privilege(-999999,'pg_authid','update');
select has_table_privilege(1,'select');

-- superuser



select has_table_privilege(current_user,'pg_authid','select');
select has_table_privilege(current_user,'pg_authid','insert');

select has_table_privilege(t2.oid,'pg_authid','update')
from (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,'pg_authid','delete')
from (select oid from pg_roles where rolname = current_user) as t2;

-- 'rule' privilege no longer exists, but for backwards compatibility
-- has_table_privilege still recognizes the keyword and says FALSE
select has_table_privilege(current_user,t1.oid,'rule')
from (select oid from pg_class where relname = 'pg_authid') as t1;
select has_table_privilege(current_user,t1.oid,'references')
from (select oid from pg_class where relname = 'pg_authid') as t1;

select has_table_privilege(t2.oid,t1.oid,'select')
from (select oid from pg_class where relname = 'pg_authid') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,t1.oid,'insert')
from (select oid from pg_class where relname = 'pg_authid') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;

select has_table_privilege('pg_authid','update');
select has_table_privilege('pg_authid','delete');
select has_table_privilege('pg_authid','truncate');

select has_table_privilege(t1.oid,'select')
from (select oid from pg_class where relname = 'pg_authid') as t1;
select has_table_privilege(t1.oid,'trigger')
from (select oid from pg_class where relname = 'pg_authid') as t1;

-- non-superuser
SET SESSION AUTHORIZATION regressuser3;

select has_table_privilege(current_user,'pg_class','select');
select has_table_privilege(current_user,'pg_class','insert');

select has_table_privilege(t2.oid,'pg_class','update')
from (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,'pg_class','delete')
from (select oid from pg_roles where rolname = current_user) as t2;

select has_table_privilege(current_user,t1.oid,'references')
from (select oid from pg_class where relname = 'pg_class') as t1;

select has_table_privilege(t2.oid,t1.oid,'select')
from (select oid from pg_class where relname = 'pg_class') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,t1.oid,'insert')
from (select oid from pg_class where relname = 'pg_class') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;

select has_table_privilege('pg_class','update');
select has_table_privilege('pg_class','delete');
select has_table_privilege('pg_class','truncate');

select has_table_privilege(t1.oid,'select')
from (select oid from pg_class where relname = 'pg_class') as t1;
select has_table_privilege(t1.oid,'trigger')
from (select oid from pg_class where relname = 'pg_class') as t1;

select has_table_privilege(current_user,'atest1','select');
select has_table_privilege(current_user,'atest1','insert');

select has_table_privilege(t2.oid,'atest1','update')
from (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,'atest1','delete')
from (select oid from pg_roles where rolname = current_user) as t2;

select has_table_privilege(current_user,t1.oid,'references')
from (select oid from pg_class where relname = 'atest1') as t1;

select has_table_privilege(t2.oid,t1.oid,'select')
from (select oid from pg_class where relname = 'atest1') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;
select has_table_privilege(t2.oid,t1.oid,'insert')
from (select oid from pg_class where relname = 'atest1') as t1,
  (select oid from pg_roles where rolname = current_user) as t2;

select has_table_privilege('atest1','update');
select has_table_privilege('atest1','delete');
select has_table_privilege('atest1','truncate');

select has_table_privilege(t1.oid,'select')
from (select oid from pg_class where relname = 'atest1') as t1;
select has_table_privilege(t1.oid,'trigger')
from (select oid from pg_class where relname = 'atest1') as t1;


-- Grant options

SET SESSION AUTHORIZATION regressuser1;

CREATE TABLE atest4 (a int);

GRANT SELECT ON atest4 TO regressuser2 WITH GRANT OPTION;
GRANT UPDATE ON atest4 TO regressuser2;
GRANT SELECT ON atest4 TO GROUP regressgroup1 WITH GRANT OPTION;

SET SESSION AUTHORIZATION regressuser2;

GRANT SELECT ON atest4 TO regressuser3;
GRANT UPDATE ON atest4 TO regressuser3; -- fail

SET SESSION AUTHORIZATION regressuser1;

REVOKE SELECT ON atest4 FROM regressuser3; -- does nothing
SELECT has_table_privilege('regressuser3', 'atest4', 'SELECT'); -- true
REVOKE SELECT ON atest4 FROM regressuser2; -- fail
REVOKE GRANT OPTION FOR SELECT ON atest4 FROM regressuser2 CASCADE; -- ok
SELECT has_table_privilege('regressuser2', 'atest4', 'SELECT'); -- true
SELECT has_table_privilege('regressuser3', 'atest4', 'SELECT'); -- false

SELECT has_table_privilege('regressuser1', 'atest4', 'SELECT WITH GRANT OPTION'); -- true


-- Admin options

SET SESSION AUTHORIZATION regressuser4;
CREATE FUNCTION dogrant_ok() RETURNS void LANGUAGE sql SECURITY DEFINER AS
	'GRANT regressgroup2 TO regressuser5';
GRANT regressgroup2 TO regressuser5; -- ok: had ADMIN OPTION
SET ROLE regressgroup2;
GRANT regressgroup2 TO regressuser5; -- fails: SET ROLE suspended privilege

SET SESSION AUTHORIZATION regressuser1;
GRANT regressgroup2 TO regressuser5; -- fails: no ADMIN OPTION
SELECT dogrant_ok();			-- ok: SECURITY DEFINER conveys ADMIN
SET ROLE regressgroup2;
GRANT regressgroup2 TO regressuser5; -- fails: SET ROLE did not help

SET SESSION AUTHORIZATION regressgroup2;
GRANT regressgroup2 TO regressuser5; -- ok: a role can self-admin
CREATE FUNCTION dogrant_fails() RETURNS void LANGUAGE sql SECURITY DEFINER AS
	'GRANT regressgroup2 TO regressuser5';
SELECT dogrant_fails();			-- fails: no self-admin in SECURITY DEFINER
DROP FUNCTION dogrant_fails();

SET SESSION AUTHORIZATION regressuser4;
DROP FUNCTION dogrant_ok();
REVOKE regressgroup2 FROM regressuser5;


-- has_sequence_privilege tests



CREATE SEQUENCE x_seq;

GRANT USAGE on x_seq to regressuser2;

SELECT has_sequence_privilege('regressuser1', 'atest1', 'SELECT');
SELECT has_sequence_privilege('regressuser1', 'x_seq', 'INSERT');
SELECT has_sequence_privilege('regressuser1', 'x_seq', 'SELECT');

SET SESSION AUTHORIZATION regressuser2;

SELECT has_sequence_privilege('x_seq', 'USAGE');

-- largeobject privilege tests


SET SESSION AUTHORIZATION regressuser1;

SELECT lo_create(1001);
SELECT lo_create(1002);
SELECT lo_create(1003);
SELECT lo_create(1004);
SELECT lo_create(1005);

GRANT ALL ON LARGE OBJECT 1001 TO PUBLIC;
GRANT SELECT ON LARGE OBJECT 1003 TO regressuser2;
GRANT SELECT,UPDATE ON LARGE OBJECT 1004 TO regressuser2;
GRANT ALL ON LARGE OBJECT 1005 TO regressuser2;
GRANT SELECT ON LARGE OBJECT 1005 TO regressuser2 WITH GRANT OPTION;

GRANT SELECT, INSERT ON LARGE OBJECT 1001 TO PUBLIC;	-- to be failed
GRANT SELECT, UPDATE ON LARGE OBJECT 1001 TO nosuchuser;	-- to be failed
GRANT SELECT, UPDATE ON LARGE OBJECT  999 TO PUBLIC;	-- to be failed



SET SESSION AUTHORIZATION regressuser2;

SELECT lo_create(2001);
SELECT lo_create(2002);

SELECT loread(lo_open(1001, x'40000'::int), 32);
SELECT loread(lo_open(1002, x'40000'::int), 32);	-- to be denied
SELECT loread(lo_open(1003, x'40000'::int), 32);
SELECT loread(lo_open(1004, x'40000'::int), 32);

SELECT lowrite(lo_open(1001, x'20000'::int), 'abcd');
SELECT lowrite(lo_open(1002, x'20000'::int), 'abcd');	-- to be denied
SELECT lowrite(lo_open(1003, x'20000'::int), 'abcd');	-- to be denied
SELECT lowrite(lo_open(1004, x'20000'::int), 'abcd');

GRANT SELECT ON LARGE OBJECT 1005 TO regressuser3;
GRANT UPDATE ON LARGE OBJECT 1006 TO regressuser3;	-- to be denied
REVOKE ALL ON LARGE OBJECT 2001, 2002 FROM PUBLIC;
GRANT ALL ON LARGE OBJECT 2001 TO regressuser3;

SELECT lo_unlink(1001);		-- to be denied
SELECT lo_unlink(2002);



-- confirm ACL setting
SELECT oid, pg_get_userbyid(lomowner) ownername, lomacl FROM pg_largeobject_metadata;

SET SESSION AUTHORIZATION regressuser3;

SELECT loread(lo_open(1001, x'40000'::int), 32);
SELECT loread(lo_open(1003, x'40000'::int), 32);	-- to be denied
SELECT loread(lo_open(1005, x'40000'::int), 32);

SELECT lo_truncate(lo_open(1005, x'20000'::int), 10);	-- to be denied
SELECT lo_truncate(lo_open(2001, x'20000'::int), 10);

-- compatibility mode in largeobject permission


SET lo_compat_privileges = false;	-- default setting
SET SESSION AUTHORIZATION regressuser4;

SELECT loread(lo_open(1002, x'40000'::int), 32);	-- to be denied
SELECT lowrite(lo_open(1002, x'20000'::int), 'abcd');	-- to be denied
SELECT lo_truncate(lo_open(1002, x'20000'::int), 10);	-- to be denied
SELECT lo_unlink(1002);					-- to be denied
SELECT lo_export(1001, '/dev/null');			-- to be denied



SET lo_compat_privileges = true;	-- compatibility mode
SET SESSION AUTHORIZATION regressuser4;

SELECT loread(lo_open(1002, x'40000'::int), 32);
SELECT lowrite(lo_open(1002, x'20000'::int), 'abcd');
SELECT lo_truncate(lo_open(1002, x'20000'::int), 10);
SELECT lo_unlink(1002);
SELECT lo_export(1001, '/dev/null');			-- to be denied

-- don't allow unpriv users to access pg_largeobject contents


SELECT * FROM pg_largeobject LIMIT 0;

SET SESSION AUTHORIZATION regressuser1;
SELECT * FROM pg_largeobject LIMIT 0;			-- to be denied

-- test default ACLs



CREATE SCHEMA testns;
GRANT ALL ON SCHEMA testns TO regressuser1;

CREATE TABLE testns.acltest1 (x int);
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'SELECT'); -- no
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'INSERT'); -- no

ALTER DEFAULT PRIVILEGES IN SCHEMA testns GRANT SELECT ON TABLES TO public;

SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'SELECT'); -- no
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'INSERT'); -- no

DROP TABLE testns.acltest1;
CREATE TABLE testns.acltest1 (x int);

SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'SELECT'); -- yes
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'INSERT'); -- no

ALTER DEFAULT PRIVILEGES IN SCHEMA testns GRANT INSERT ON TABLES TO regressuser1;

DROP TABLE testns.acltest1;
CREATE TABLE testns.acltest1 (x int);

SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'SELECT'); -- yes
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'INSERT'); -- yes

ALTER DEFAULT PRIVILEGES IN SCHEMA testns REVOKE INSERT ON TABLES FROM regressuser1;

DROP TABLE testns.acltest1;
CREATE TABLE testns.acltest1 (x int);

SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'SELECT'); -- yes
SELECT has_table_privilege('regressuser1', 'testns.acltest1', 'INSERT'); -- no

ALTER DEFAULT PRIVILEGES FOR ROLE regressuser1 REVOKE EXECUTE ON FUNCTIONS FROM public;

SET ROLE regressuser1;

CREATE FUNCTION testns.foo() RETURNS int AS 'select 1' LANGUAGE sql;

SELECT has_function_privilege('regressuser2', 'testns.foo()', 'EXECUTE'); -- no

ALTER DEFAULT PRIVILEGES IN SCHEMA testns GRANT EXECUTE ON FUNCTIONS to public;

DROP FUNCTION testns.foo();
CREATE FUNCTION testns.foo() RETURNS int AS 'select 1' LANGUAGE sql;

SELECT has_function_privilege('regressuser2', 'testns.foo()', 'EXECUTE'); -- yes

DROP FUNCTION testns.foo();

ALTER DEFAULT PRIVILEGES FOR ROLE regressuser1 REVOKE USAGE ON TYPES FROM public;

CREATE DOMAIN testns.testdomain1 AS int;

SELECT has_type_privilege('regressuser2', 'testns.testdomain1', 'USAGE'); -- no

ALTER DEFAULT PRIVILEGES IN SCHEMA testns GRANT USAGE ON TYPES to public;

DROP DOMAIN testns.testdomain1;
CREATE DOMAIN testns.testdomain1 AS int;

SELECT has_type_privilege('regressuser2', 'testns.testdomain1', 'USAGE'); -- yes

DROP DOMAIN testns.testdomain1;

RESET ROLE;

SELECT count(*)
  FROM pg_default_acl d LEFT JOIN pg_namespace n ON defaclnamespace = n.oid
  WHERE nspname = 'testns';

DROP SCHEMA testns CASCADE;

SELECT d.*     -- check that entries went away
  FROM pg_default_acl d LEFT JOIN pg_namespace n ON defaclnamespace = n.oid
  WHERE nspname IS NULL AND defaclnamespace != 0;


-- Grant on all objects of given type in a schema



CREATE SCHEMA testns;
CREATE TABLE testns.t1 (f1 int);
CREATE TABLE testns.t2 (f1 int);

SELECT has_table_privilege('regressuser1', 'testns.t1', 'SELECT'); -- false

GRANT ALL ON ALL TABLES IN SCHEMA testns TO regressuser1;

SELECT has_table_privilege('regressuser1', 'testns.t1', 'SELECT'); -- true
SELECT has_table_privilege('regressuser1', 'testns.t2', 'SELECT'); -- true

REVOKE ALL ON ALL TABLES IN SCHEMA testns FROM regressuser1;

SELECT has_table_privilege('regressuser1', 'testns.t1', 'SELECT'); -- false
SELECT has_table_privilege('regressuser1', 'testns.t2', 'SELECT'); -- false

CREATE FUNCTION testns.testfunc(int) RETURNS int AS 'select 3 * $1;' LANGUAGE sql;

SELECT has_function_privilege('regressuser1', 'testns.testfunc(int)', 'EXECUTE'); -- true by default

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA testns FROM PUBLIC;

SELECT has_function_privilege('regressuser1', 'testns.testfunc(int)', 'EXECUTE'); -- false

SET client_min_messages TO 'warning';
DROP SCHEMA testns CASCADE;
RESET client_min_messages;


-- Change owner of the schema & and rename of new schema owner



CREATE ROLE schemauser1 superuser login;
CREATE ROLE schemauser2 superuser login;

SET SESSION ROLE schemauser1;
CREATE SCHEMA testns;

SELECT nspname, rolname FROM pg_namespace, pg_roles WHERE pg_namespace.nspname = 'testns' AND pg_namespace.nspowner = pg_roles.oid;

ALTER SCHEMA testns OWNER TO schemauser2;
ALTER ROLE schemauser2 RENAME TO schemauser_renamed;
SELECT nspname, rolname FROM pg_namespace, pg_roles WHERE pg_namespace.nspname = 'testns' AND pg_namespace.nspowner = pg_roles.oid;

set session role schemauser_renamed;
SET client_min_messages TO 'warning';
DROP SCHEMA testns CASCADE;
RESET client_min_messages;

-- clean up



DROP ROLE schemauser1;
DROP ROLE schemauser_renamed;


-- test that dependent privileges are revoked (or not) properly



set session role regressuser1;
create table dep_priv_test (a int);
grant select on dep_priv_test to regressuser2 with grant option;
grant select on dep_priv_test to regressuser3 with grant option;
set session role regressuser2;
grant select on dep_priv_test to regressuser4 with grant option;
set session role regressuser3;
grant select on dep_priv_test to regressuser4 with grant option;
set session role regressuser4;
grant select on dep_priv_test to regressuser5;


set session role regressuser2;
revoke select on dep_priv_test from regressuser4 cascade;


set session role regressuser3;
revoke select on dep_priv_test from regressuser4 cascade;


set session role regressuser1;
drop table dep_priv_test;


-- clean up




drop sequence x_seq;

DROP FUNCTION testfunc2(int);
DROP FUNCTION testfunc4(boolean);

DROP VIEW atestv0;
DROP VIEW atestv1;
DROP VIEW atestv2;
-- this should cascade to drop atestv4
DROP VIEW atestv3 CASCADE;
-- this should complain "does not exist"
DROP VIEW atestv4;

DROP TABLE atest1;
DROP TABLE atest2;
DROP TABLE atest3;
DROP TABLE atest4;
DROP TABLE atest5;
DROP TABLE atest6;
DROP TABLE atestc;
DROP TABLE atestp1;
DROP TABLE atestp2;

SELECT lo_unlink(oid) FROM pg_largeobject_metadata;

DROP GROUP regressgroup1;
DROP GROUP regressgroup2;

-- these are needed to clean up permissions
REVOKE USAGE ON LANGUAGE sql FROM regressuser1;
DROP OWNED BY regressuser1;

DROP USER regressuser1;
DROP USER regressuser2;
DROP USER regressuser3;
DROP USER regressuser4;
DROP USER regressuser5;
DROP USER regressuser6;


-- permissions with LOCK TABLE
CREATE USER locktable_user;
CREATE TABLE lock_table (a int);

-- LOCK TABLE and SELECT permission
GRANT SELECT ON lock_table TO locktable_user;
SET SESSION AUTHORIZATION locktable_user;
BEGIN;
LOCK TABLE lock_table IN ROW EXCLUSIVE MODE; -- should fail
ROLLBACK;
BEGIN;
LOCK TABLE lock_table IN ACCESS SHARE MODE; -- should pass
COMMIT;
BEGIN;
LOCK TABLE lock_table IN ACCESS EXCLUSIVE MODE; -- should fail
ROLLBACK;


REVOKE SELECT ON lock_table FROM locktable_user;

-- LOCK TABLE and INSERT permission
GRANT INSERT ON lock_table TO locktable_user;
SET SESSION AUTHORIZATION locktable_user;
BEGIN;
LOCK TABLE lock_table IN ROW EXCLUSIVE MODE; -- should pass
COMMIT;
BEGIN;
LOCK TABLE lock_table IN ACCESS SHARE MODE; -- should fail
ROLLBACK;
BEGIN;
LOCK TABLE lock_table IN ACCESS EXCLUSIVE MODE; -- should fail
ROLLBACK;


REVOKE INSERT ON lock_table FROM locktable_user;

-- LOCK TABLE and UPDATE permission
GRANT UPDATE ON lock_table TO locktable_user;
SET SESSION AUTHORIZATION locktable_user;
BEGIN;
LOCK TABLE lock_table IN ROW EXCLUSIVE MODE; -- should pass
COMMIT;
BEGIN;
LOCK TABLE lock_table IN ACCESS SHARE MODE; -- should fail
ROLLBACK;
BEGIN;
LOCK TABLE lock_table IN ACCESS EXCLUSIVE MODE; -- should pass
COMMIT;


REVOKE UPDATE ON lock_table FROM locktable_user;

-- LOCK TABLE and DELETE permission
GRANT DELETE ON lock_table TO locktable_user;
SET SESSION AUTHORIZATION locktable_user;
BEGIN;
LOCK TABLE lock_table IN ROW EXCLUSIVE MODE; -- should pass
COMMIT;
BEGIN;
LOCK TABLE lock_table IN ACCESS SHARE MODE; -- should fail
ROLLBACK;
BEGIN;
LOCK TABLE lock_table IN ACCESS EXCLUSIVE MODE; -- should pass
COMMIT;


REVOKE DELETE ON lock_table FROM locktable_user;

-- LOCK TABLE and TRUNCATE permission
GRANT TRUNCATE ON lock_table TO locktable_user;
SET SESSION AUTHORIZATION locktable_user;
BEGIN;
LOCK TABLE lock_table IN ROW EXCLUSIVE MODE; -- should pass
COMMIT;
BEGIN;
LOCK TABLE lock_table IN ACCESS SHARE MODE; -- should fail
ROLLBACK;
BEGIN;
LOCK TABLE lock_table IN ACCESS EXCLUSIVE MODE; -- should pass
COMMIT;


REVOKE TRUNCATE ON lock_table FROM locktable_user;

-- clean up
DROP TABLE lock_table;
DROP USER locktable_user;
