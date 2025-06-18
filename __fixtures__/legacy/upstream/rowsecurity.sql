--
-- Test of Row-level security feature
--

-- Clean up in case a prior regression run failed

-- Suppress NOTICE messages when users/groups don't exist
SET client_min_messages TO 'warning';

DROP USER IF EXISTS regress_rls_alice;
DROP USER IF EXISTS regress_rls_bob;
DROP USER IF EXISTS regress_rls_carol;
DROP USER IF EXISTS regress_rls_exempt_user;
DROP ROLE IF EXISTS regress_rls_group1;
DROP ROLE IF EXISTS regress_rls_group2;

DROP SCHEMA IF EXISTS regress_rls_schema CASCADE;

RESET client_min_messages;

-- initial setup
CREATE USER regress_rls_alice NOLOGIN;
CREATE USER regress_rls_bob NOLOGIN;
CREATE USER regress_rls_carol NOLOGIN;
CREATE USER regress_rls_exempt_user BYPASSRLS NOLOGIN;
CREATE ROLE regress_rls_group1 NOLOGIN;
CREATE ROLE regress_rls_group2 NOLOGIN;

GRANT regress_rls_group1 TO regress_rls_bob;
GRANT regress_rls_group2 TO regress_rls_carol;

CREATE SCHEMA regress_rls_schema;
GRANT ALL ON SCHEMA regress_rls_schema to public;
SET search_path = regress_rls_schema;

-- setup of malicious function
-- CREATE OR REPLACE FUNCTION f_leak(text) RETURNS bool
--     COST 0.0000001 LANGUAGE plpgsql
--     AS 'BEGIN RAISE NOTICE ''f_leak => %'', $1; RETURN true; END';
-- GRANT EXECUTE ON FUNCTION f_leak(text) TO public;

-- BASIC Row-Level Security Scenario

SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE uaccount (
    pguser      name primary key,
    seclv       int
);
GRANT SELECT ON uaccount TO public;
INSERT INTO uaccount VALUES
    ('regress_rls_alice', 99),
    ('regress_rls_bob', 1),
    ('regress_rls_carol', 2),
    ('regress_rls_dave', 3);

CREATE TABLE category (
    cid        int primary key,
    cname      text
);
GRANT ALL ON category TO public;
INSERT INTO category VALUES
    (11, 'novel'),
    (22, 'science fiction'),
    (33, 'technology'),
    (44, 'manga');

CREATE TABLE document (
    did         int primary key,
    cid         int references category(cid),
    dlevel      int not null,
    dauthor     name,
    dtitle      text
);
GRANT ALL ON document TO public;
INSERT INTO document VALUES
    ( 1, 11, 1, 'regress_rls_bob', 'my first novel'),
    ( 2, 11, 2, 'regress_rls_bob', 'my second novel'),
    ( 3, 22, 2, 'regress_rls_bob', 'my science fiction'),
    ( 4, 44, 1, 'regress_rls_bob', 'my first manga'),
    ( 5, 44, 2, 'regress_rls_bob', 'my second manga'),
    ( 6, 22, 1, 'regress_rls_carol', 'great science fiction'),
    ( 7, 33, 2, 'regress_rls_carol', 'great technology book'),
    ( 8, 44, 1, 'regress_rls_carol', 'great manga');

ALTER TABLE document ENABLE ROW LEVEL SECURITY;

-- user's security level must be higher than or equal to document's
CREATE POLICY p1 ON document
    USING (dlevel <= (SELECT seclv FROM uaccount WHERE pguser = current_user));

-- viewpoint from regress_rls_bob
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO ON;
SELECT * FROM document WHERE f_leak(dtitle) ORDER BY did;
SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle) ORDER BY did;

-- try a sampled version
SELECT * FROM document TABLESAMPLE BERNOULLI(50) REPEATABLE(0)
  WHERE f_leak(dtitle) ORDER BY did;

-- viewpoint from regress_rls_carol
SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM document WHERE f_leak(dtitle) ORDER BY did;
SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle) ORDER BY did;

-- try a sampled version
SELECT * FROM document TABLESAMPLE BERNOULLI(50) REPEATABLE(0)
  WHERE f_leak(dtitle) ORDER BY did;

EXPLAIN (COSTS OFF) SELECT * FROM document WHERE f_leak(dtitle);
EXPLAIN (COSTS OFF) SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle);

-- only owner can change policies
ALTER POLICY p1 ON document USING (true);    --fail
DROP POLICY p1 ON document;                  --fail

SET SESSION AUTHORIZATION regress_rls_alice;
ALTER POLICY p1 ON document USING (dauthor = current_user);

-- viewpoint from regress_rls_bob again
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM document WHERE f_leak(dtitle) ORDER BY did;
SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle) ORDER by did;

-- viewpoint from rls_regres_carol again
SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM document WHERE f_leak(dtitle) ORDER BY did;
SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle) ORDER by did;

EXPLAIN (COSTS OFF) SELECT * FROM document WHERE f_leak(dtitle);
EXPLAIN (COSTS OFF) SELECT * FROM document NATURAL JOIN category WHERE f_leak(dtitle);

-- interaction of FK/PK constraints
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE POLICY p2 ON category
    USING (CASE WHEN current_user = 'regress_rls_bob' THEN cid IN (11, 33)
           WHEN current_user = 'regress_rls_carol' THEN cid IN (22, 44)
           ELSE false END);

ALTER TABLE category ENABLE ROW LEVEL SECURITY;

-- cannot delete PK referenced by invisible FK
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM document d FULL OUTER JOIN category c on d.cid = c.cid;
DELETE FROM category WHERE cid = 33;    -- fails with FK violation

-- can insert FK referencing invisible PK
SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM document d FULL OUTER JOIN category c on d.cid = c.cid;
INSERT INTO document VALUES (10, 33, 1, current_user, 'hoge');

-- UNIQUE or PRIMARY KEY constraint violation DOES reveal presence of row
SET SESSION AUTHORIZATION regress_rls_bob;
INSERT INTO document VALUES (8, 44, 1, 'regress_rls_bob', 'my third manga'); -- Must fail with unique violation, revealing presence of did we can't see
SELECT * FROM document WHERE did = 8; -- and confirm we can't see it

-- RLS policies are checked before constraints
INSERT INTO document VALUES (8, 44, 1, 'regress_rls_carol', 'my third manga'); -- Should fail with RLS check violation, not duplicate key violation
UPDATE document SET did = 8, dauthor = 'regress_rls_carol' WHERE did = 5; -- Should fail with RLS check violation, not duplicate key violation

-- database superuser does bypass RLS policy when enabled
RESET SESSION AUTHORIZATION;
SET row_security TO ON;
SELECT * FROM document;
SELECT * FROM category;

-- database superuser does bypass RLS policy when disabled
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;
SELECT * FROM document;
SELECT * FROM category;

-- database non-superuser with bypass privilege can bypass RLS policy when disabled
SET SESSION AUTHORIZATION regress_rls_exempt_user;
SET row_security TO OFF;
SELECT * FROM document;
SELECT * FROM category;

-- RLS policy does not apply to table owner when RLS enabled.
SET SESSION AUTHORIZATION regress_rls_alice;
SET row_security TO ON;
SELECT * FROM document;
SELECT * FROM category;

-- RLS policy does not apply to table owner when RLS disabled.
SET SESSION AUTHORIZATION regress_rls_alice;
SET row_security TO OFF;
SELECT * FROM document;
SELECT * FROM category;

--
-- Table inheritance and RLS policy
--
SET SESSION AUTHORIZATION regress_rls_alice;

SET row_security TO ON;

ALTER TABLE t1 DROP COLUMN junk1;    -- just a disturbing factor
GRANT ALL ON t1 TO public;














CREATE TABLE t2 (c float) INHERITS (t1);
GRANT ALL ON t2 TO public;














ALTER TABLE t3 INHERIT t1;
GRANT ALL ON t3 TO public;












CREATE POLICY p1 ON t1 FOR ALL TO PUBLIC USING (a % 2 = 0); -- be even number
CREATE POLICY p2 ON t2 FOR ALL TO PUBLIC USING (a % 2 = 1); -- be odd number

ALTER TABLE t1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE t2 ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;

SELECT * FROM t1;
EXPLAIN (COSTS OFF) SELECT * FROM t1;

SELECT * FROM t1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM t1 WHERE f_leak(b);

-- reference to system column
SELECT oid, * FROM t1;
EXPLAIN (COSTS OFF) SELECT *, t1 FROM t1;

-- reference to whole-row reference
SELECT *, t1 FROM t1;
EXPLAIN (COSTS OFF) SELECT *, t1 FROM t1;

-- for share/update lock
SELECT * FROM t1 FOR SHARE;
EXPLAIN (COSTS OFF) SELECT * FROM t1 FOR SHARE;

SELECT * FROM t1 WHERE f_leak(b) FOR SHARE;
EXPLAIN (COSTS OFF) SELECT * FROM t1 WHERE f_leak(b) FOR SHARE;

-- union all query
SELECT a, b, oid FROM t2 UNION ALL SELECT a, b, oid FROM t3;
EXPLAIN (COSTS OFF) SELECT a, b, oid FROM t2 UNION ALL SELECT a, b, oid FROM t3;

-- superuser is allowed to bypass RLS checks
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;
SELECT * FROM t1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM t1 WHERE f_leak(b);

-- non-superuser with bypass privilege can bypass RLS policy when disabled
SET SESSION AUTHORIZATION regress_rls_exempt_user;
SET row_security TO OFF;
SELECT * FROM t1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM t1 WHERE f_leak(b);

----- Dependencies -----
SET SESSION AUTHORIZATION regress_rls_alice;
SET row_security TO ON;

CREATE TABLE dependee (x integer, y integer);

CREATE TABLE dependent (x integer, y integer);
CREATE POLICY d1 ON dependent FOR ALL
    TO PUBLIC
    USING (x = (SELECT d.x FROM dependee d WHERE d.y = y));

DROP TABLE dependee; -- Should fail without CASCADE due to dependency on row security qual?

DROP TABLE dependee CASCADE;

EXPLAIN (COSTS OFF) SELECT * FROM dependent; -- After drop, should be unqualified

-----   RECURSION    ----

--
-- Simple recursion
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE rec1 (x integer, y integer);
CREATE POLICY r1 ON rec1 USING (x = (SELECT r.x FROM rec1 r WHERE y = r.y));
ALTER TABLE rec1 ENABLE ROW LEVEL SECURITY;
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rec1; -- fail, direct recursion

--
-- Mutual recursion
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE rec2 (a integer, b integer);
ALTER POLICY r1 ON rec1 USING (x = (SELECT a FROM rec2 WHERE b = y));
CREATE POLICY r2 ON rec2 USING (a = (SELECT x FROM rec1 WHERE y = b));
ALTER TABLE rec2 ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rec1;    -- fail, mutual recursion

--
-- Mutual recursion via views
--
SET SESSION AUTHORIZATION regress_rls_bob;
CREATE VIEW rec1v AS SELECT * FROM rec1;
CREATE VIEW rec2v AS SELECT * FROM rec2;
SET SESSION AUTHORIZATION regress_rls_alice;
ALTER POLICY r1 ON rec1 USING (x = (SELECT a FROM rec2v WHERE b = y));
ALTER POLICY r2 ON rec2 USING (a = (SELECT x FROM rec1v WHERE y = b));

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rec1;    -- fail, mutual recursion via views

--
-- Mutual recursion via .s.b views
--
SET SESSION AUTHORIZATION regress_rls_bob;
-- Suppress NOTICE messages when doing a cascaded drop.
SET client_min_messages TO 'warning';

DROP VIEW rec1v, rec2v CASCADE;
RESET client_min_messages;

CREATE VIEW rec1v WITH (security_barrier) AS SELECT * FROM rec1;
CREATE VIEW rec2v WITH (security_barrier) AS SELECT * FROM rec2;
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE POLICY r1 ON rec1 USING (x = (SELECT a FROM rec2v WHERE b = y));
CREATE POLICY r2 ON rec2 USING (a = (SELECT x FROM rec1v WHERE y = b));

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rec1;    -- fail, mutual recursion via s.b. views

--
-- recursive RLS and VIEWs in policy
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE s1 (a int, b text);
INSERT INTO s1 (SELECT x, md5(x::text) FROM generate_series(-10,10) x);

CREATE TABLE s2 (x int, y text);
INSERT INTO s2 (SELECT x, md5(x::text) FROM generate_series(-6,6) x);

GRANT SELECT ON s1, s2 TO regress_rls_bob;

CREATE POLICY p1 ON s1 USING (a in (select x from s2 where y like '%2f%'));
CREATE POLICY p2 ON s2 USING (x in (select a from s1 where b like '%22%'));
CREATE POLICY p3 ON s1 FOR INSERT WITH CHECK (a = (SELECT a FROM s1));

ALTER TABLE s1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE s2 ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;
CREATE VIEW v2 AS SELECT * FROM s2 WHERE y like '%af%';
SELECT * FROM s1 WHERE f_leak(b); -- fail (infinite recursion)

INSERT INTO s1 VALUES (1, 'foo'); -- fail (infinite recursion)

SET SESSION AUTHORIZATION regress_rls_alice;
DROP POLICY p3 on s1;
ALTER POLICY p2 ON s2 USING (x % 2 = 0);

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM s1 WHERE f_leak(b);	-- OK
EXPLAIN (COSTS OFF) SELECT * FROM only s1 WHERE f_leak(b);

SET SESSION AUTHORIZATION regress_rls_alice;
ALTER POLICY p1 ON s1 USING (a in (select x from v2)); -- using VIEW in RLS policy
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM s1 WHERE f_leak(b);	-- OK
EXPLAIN (COSTS OFF) SELECT * FROM s1 WHERE f_leak(b);

SELECT (SELECT x FROM s1 LIMIT 1) xx, * FROM s2 WHERE y like '%28%';
EXPLAIN (COSTS OFF) SELECT (SELECT x FROM s1 LIMIT 1) xx, * FROM s2 WHERE y like '%28%';

SET SESSION AUTHORIZATION regress_rls_alice;
ALTER POLICY p2 ON s2 USING (x in (select a from s1 where b like '%d2%'));
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM s1 WHERE f_leak(b);	-- fail (infinite recursion via view)

-- prepared statement with regress_rls_alice privilege
PREPARE p1(int) AS SELECT * FROM t1 WHERE a <= $1;
EXECUTE p1(2);
EXPLAIN (COSTS OFF) EXECUTE p1(2);

-- superuser is allowed to bypass RLS checks
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;
SELECT * FROM t1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM t1 WHERE f_leak(b);

-- plan cache should be invalidated
EXECUTE p1(2);
EXPLAIN (COSTS OFF) EXECUTE p1(2);

PREPARE p2(int) AS SELECT * FROM t1 WHERE a = $1;
EXECUTE p2(2);
EXPLAIN (COSTS OFF) EXECUTE p2(2);

-- also, case when privilege switch from superuser
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO ON;
EXECUTE p2(2);
EXPLAIN (COSTS OFF) EXECUTE p2(2);

--
-- UPDATE / DELETE and Row-level security
--
SET SESSION AUTHORIZATION regress_rls_bob;
EXPLAIN (COSTS OFF) UPDATE t1 SET b = b || b WHERE f_leak(b);
UPDATE t1 SET b = b || b WHERE f_leak(b);

EXPLAIN (COSTS OFF) UPDATE only t1 SET b = b || '_updt' WHERE f_leak(b);
UPDATE only t1 SET b = b || '_updt' WHERE f_leak(b);

-- returning clause with system column
UPDATE only t1 SET b = b WHERE f_leak(b) RETURNING oid, *, t1;
UPDATE t1 SET b = b WHERE f_leak(b) RETURNING *;
UPDATE t1 SET b = b WHERE f_leak(b) RETURNING oid, *, t1;

-- updates with from clause
EXPLAIN (COSTS OFF) UPDATE t2 SET b=t2.b FROM t3
WHERE t2.a = 3 and t3.a = 2 AND f_leak(t2.b) AND f_leak(t3.b);

UPDATE t2 SET b=t2.b FROM t3
WHERE t2.a = 3 and t3.a = 2 AND f_leak(t2.b) AND f_leak(t3.b);

EXPLAIN (COSTS OFF) UPDATE t1 SET b=t1.b FROM t2
WHERE t1.a = 3 and t2.a = 3 AND f_leak(t1.b) AND f_leak(t2.b);

UPDATE t1 SET b=t1.b FROM t2
WHERE t1.a = 3 and t2.a = 3 AND f_leak(t1.b) AND f_leak(t2.b);

EXPLAIN (COSTS OFF) UPDATE t2 SET b=t2.b FROM t1
WHERE t1.a = 3 and t2.a = 3 AND f_leak(t1.b) AND f_leak(t2.b);

UPDATE t2 SET b=t2.b FROM t1
WHERE t1.a = 3 and t2.a = 3 AND f_leak(t1.b) AND f_leak(t2.b);

-- updates with from clause self join
EXPLAIN (COSTS OFF) UPDATE t2 t2_1 SET b = t2_2.b FROM t2 t2_2
WHERE t2_1.a = 3 AND t2_2.a = t2_1.a AND t2_2.b = t2_1.b
AND f_leak(t2_1.b) AND f_leak(t2_2.b) RETURNING *, t2_1, t2_2;

UPDATE t2 t2_1 SET b = t2_2.b FROM t2 t2_2
WHERE t2_1.a = 3 AND t2_2.a = t2_1.a AND t2_2.b = t2_1.b
AND f_leak(t2_1.b) AND f_leak(t2_2.b) RETURNING *, t2_1, t2_2;

EXPLAIN (COSTS OFF) UPDATE t1 t1_1 SET b = t1_2.b FROM t1 t1_2
WHERE t1_1.a = 4 AND t1_2.a = t1_1.a AND t1_2.b = t1_1.b
AND f_leak(t1_1.b) AND f_leak(t1_2.b) RETURNING *, t1_1, t1_2;

UPDATE t1 t1_1 SET b = t1_2.b FROM t1 t1_2
WHERE t1_1.a = 4 AND t1_2.a = t1_1.a AND t1_2.b = t1_1.b
AND f_leak(t1_1.b) AND f_leak(t1_2.b) RETURNING *, t1_1, t1_2;

RESET SESSION AUTHORIZATION;
SET row_security TO OFF;
SELECT * FROM t1 ORDER BY a,b;

SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO ON;
EXPLAIN (COSTS OFF) DELETE FROM only t1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) DELETE FROM t1 WHERE f_leak(b);

DELETE FROM only t1 WHERE f_leak(b) RETURNING oid, *, t1;
DELETE FROM t1 WHERE f_leak(b) RETURNING oid, *, t1;

--
-- S.b. view on top of Row-level security
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE b1 (a int, b text);
INSERT INTO b1 (SELECT x, md5(x::text) FROM generate_series(-10,10) x);

CREATE POLICY p1 ON b1 USING (a % 2 = 0);
ALTER TABLE b1 ENABLE ROW LEVEL SECURITY;
GRANT ALL ON b1 TO regress_rls_bob;

SET SESSION AUTHORIZATION regress_rls_bob;
CREATE VIEW bv1 WITH (security_barrier) AS SELECT * FROM b1 WHERE a > 0 WITH CHECK OPTION;
GRANT ALL ON bv1 TO regress_rls_carol;

SET SESSION AUTHORIZATION regress_rls_carol;

EXPLAIN (COSTS OFF) SELECT * FROM bv1 WHERE f_leak(b);
SELECT * FROM bv1 WHERE f_leak(b);

INSERT INTO bv1 VALUES (-1, 'xxx'); -- should fail view WCO
INSERT INTO bv1 VALUES (11, 'xxx'); -- should fail RLS check
INSERT INTO bv1 VALUES (12, 'xxx'); -- ok

EXPLAIN (COSTS OFF) UPDATE bv1 SET b = 'yyy' WHERE a = 4 AND f_leak(b);
UPDATE bv1 SET b = 'yyy' WHERE a = 4 AND f_leak(b);

EXPLAIN (COSTS OFF) DELETE FROM bv1 WHERE a = 6 AND f_leak(b);
DELETE FROM bv1 WHERE a = 6 AND f_leak(b);

SET SESSION AUTHORIZATION regress_rls_alice;
SELECT * FROM b1;
--
-- INSERT ... ON CONFLICT DO UPDATE and Row-level security
--

SET SESSION AUTHORIZATION regress_rls_alice;
DROP POLICY p1 ON document;

CREATE POLICY p1 ON document FOR SELECT USING (true);
CREATE POLICY p2 ON document FOR INSERT WITH CHECK (dauthor = current_user);
CREATE POLICY p3 ON document FOR UPDATE
  USING (cid = (SELECT cid from category WHERE cname = 'novel'))
  WITH CHECK (dauthor = current_user);

SET SESSION AUTHORIZATION regress_rls_bob;

-- Exists...
SELECT * FROM document WHERE did = 2;

-- ...so violates actual WITH CHECK OPTION within UPDATE (not INSERT, since
-- alternative UPDATE path happens to be taken):
INSERT INTO document VALUES (2, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_carol', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle, dauthor = EXCLUDED.dauthor;

-- Violates USING qual for UPDATE policy p3.
--
-- UPDATE path is taken, but UPDATE fails purely because *existing* row to be
-- updated is not a "novel"/cid 11 (row is not leaked, even though we have
-- SELECT privileges sufficient to see the row in this instance):
INSERT INTO document VALUES (33, 22, 1, 'regress_rls_bob', 'okay science fiction'); -- preparation for next statement
INSERT INTO document VALUES (33, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'Some novel, replaces sci-fi') -- takes UPDATE path
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle;
-- Fine (we UPDATE, since INSERT WCOs and UPDATE security barrier quals + WCOs
-- not violated):
INSERT INTO document VALUES (2, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle RETURNING *;
-- Fine (we INSERT, so "cid = 33" ("technology") isn't evaluated):
INSERT INTO document VALUES (78, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'some technology novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle, cid = 33 RETURNING *;
-- Fine (same query, but we UPDATE, so "cid = 33", ("technology") is not the
-- case in respect of *existing* tuple):
INSERT INTO document VALUES (78, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'some technology novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle, cid = 33 RETURNING *;
-- Same query a third time, but now fails due to existing tuple finally not
-- passing quals:
INSERT INTO document VALUES (78, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'some technology novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle, cid = 33 RETURNING *;
-- Don't fail just because INSERT doesn't satisfy WITH CHECK option that
-- originated as a barrier/USING() qual from the UPDATE.  Note that the UPDATE
-- path *isn't* taken, and so UPDATE-related policy does not apply:
INSERT INTO document VALUES (79, (SELECT cid from category WHERE cname = 'technology'), 1, 'regress_rls_bob', 'technology book, can only insert')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle RETURNING *;
-- But this time, the same statement fails, because the UPDATE path is taken,
-- and updating the row just inserted falls afoul of security barrier qual
-- (enforced as WCO) -- what we might have updated target tuple to is
-- irrelevant, in fact.
INSERT INTO document VALUES (79, (SELECT cid from category WHERE cname = 'technology'), 1, 'regress_rls_bob', 'technology book, can only insert')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle RETURNING *;

-- Test default USING qual enforced as WCO
SET SESSION AUTHORIZATION regress_rls_alice;
DROP POLICY p1 ON document;
DROP POLICY p2 ON document;
DROP POLICY p3 ON document;

CREATE POLICY p3_with_default ON document FOR UPDATE
  USING (cid = (SELECT cid from category WHERE cname = 'novel'));

SET SESSION AUTHORIZATION regress_rls_bob;
-- Just because WCO-style enforcement of USING quals occurs with
-- existing/target tuple does not mean that the implementation can be allowed
-- to fail to also enforce this qual against the final tuple appended to
-- relation (since in the absence of an explicit WCO, this is also interpreted
-- as an UPDATE/ALL WCO in general).
--
-- UPDATE path is taken here (fails due to existing tuple).  Note that this is
-- not reported as a "USING expression", because it's an RLS UPDATE check that originated as
-- a USING qual for the purposes of RLS in general, as opposed to an explicit
-- USING qual that is ordinarily a security barrier.  We leave it up to the
-- UPDATE to make this fail:
INSERT INTO document VALUES (79, (SELECT cid from category WHERE cname = 'technology'), 1, 'regress_rls_bob', 'technology book, can only insert')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle RETURNING *;

-- UPDATE path is taken here.  Existing tuple passes, since it's cid
-- corresponds to "novel", but default USING qual is enforced against
-- post-UPDATE tuple too (as always when updating with a policy that lacks an
-- explicit WCO), and so this fails:
INSERT INTO document VALUES (2, (SELECT cid from category WHERE cname = 'technology'), 1, 'regress_rls_bob', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET cid = EXCLUDED.cid, dtitle = EXCLUDED.dtitle RETURNING *;

SET SESSION AUTHORIZATION regress_rls_alice;
DROP POLICY p3_with_default ON document;

--
-- Test ALL policies with ON CONFLICT DO UPDATE (much the same as existing UPDATE
-- tests)
--
CREATE POLICY p3_with_all ON document FOR ALL
  USING (cid = (SELECT cid from category WHERE cname = 'novel'))
  WITH CHECK (dauthor = current_user);

SET SESSION AUTHORIZATION regress_rls_bob;

-- Fails, since ALL WCO is enforced in insert path:
INSERT INTO document VALUES (80, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_carol', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle, cid = 33;
-- Fails, since ALL policy USING qual is enforced (existing, target tuple is in
-- violation, since it has the "manga" cid):
INSERT INTO document VALUES (4, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET dtitle = EXCLUDED.dtitle;
-- Fails, since ALL WCO are enforced:
INSERT INTO document VALUES (1, (SELECT cid from category WHERE cname = 'novel'), 1, 'regress_rls_bob', 'my first novel')
    ON CONFLICT (did) DO UPDATE SET dauthor = 'regress_rls_carol';

--
-- ROLE/GROUP
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE z1 (a int, b text);
CREATE TABLE z2 (a int, b text);

GRANT SELECT ON z1,z2 TO regress_rls_group1, regress_rls_group2,
    regress_rls_bob, regress_rls_carol;

INSERT INTO z1 VALUES
    (1, 'aaa'),
    (2, 'bbb'),
    (3, 'ccc'),
    (4, 'ddd');

CREATE POLICY p1 ON z1 TO regress_rls_group1 USING (a % 2 = 0);
CREATE POLICY p2 ON z1 TO regress_rls_group2 USING (a % 2 = 1);

ALTER TABLE z1 ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM z1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM z1 WHERE f_leak(b);

PREPARE plancache_test AS SELECT * FROM z1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) EXECUTE plancache_test;

PREPARE plancache_test2 AS WITH q AS (SELECT * FROM z1 WHERE f_leak(b)) SELECT * FROM q,z2;
EXPLAIN (COSTS OFF) EXECUTE plancache_test2;

PREPARE plancache_test3 AS WITH q AS (SELECT * FROM z2) SELECT * FROM q,z1 WHERE f_leak(z1.b);
EXPLAIN (COSTS OFF) EXECUTE plancache_test3;

SET ROLE regress_rls_group1;
SELECT * FROM z1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM z1 WHERE f_leak(b);

EXPLAIN (COSTS OFF) EXECUTE plancache_test;
EXPLAIN (COSTS OFF) EXECUTE plancache_test2;
EXPLAIN (COSTS OFF) EXECUTE plancache_test3;

SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM z1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM z1 WHERE f_leak(b);

EXPLAIN (COSTS OFF) EXECUTE plancache_test;
EXPLAIN (COSTS OFF) EXECUTE plancache_test2;
EXPLAIN (COSTS OFF) EXECUTE plancache_test3;

SET ROLE regress_rls_group2;
SELECT * FROM z1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM z1 WHERE f_leak(b);

EXPLAIN (COSTS OFF) EXECUTE plancache_test;
EXPLAIN (COSTS OFF) EXECUTE plancache_test2;
EXPLAIN (COSTS OFF) EXECUTE plancache_test3;

--
-- Views should follow policy for view owner.
--
-- View and Table owner are the same.
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE VIEW rls_view AS SELECT * FROM z1 WHERE f_leak(b);
GRANT SELECT ON rls_view TO regress_rls_bob;

-- Query as role that is not owner of view or table.  Should return all records.
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rls_view;
EXPLAIN (COSTS OFF) SELECT * FROM rls_view;

-- Query as view/table owner.  Should return all records.
SET SESSION AUTHORIZATION regress_rls_alice;
SELECT * FROM rls_view;
EXPLAIN (COSTS OFF) SELECT * FROM rls_view;
DROP VIEW rls_view;

-- View and Table owners are different.
SET SESSION AUTHORIZATION regress_rls_bob;
CREATE VIEW rls_view AS SELECT * FROM z1 WHERE f_leak(b);
GRANT SELECT ON rls_view TO regress_rls_alice;

-- Query as role that is not owner of view but is owner of table.
-- Should return records based on view owner policies.
SET SESSION AUTHORIZATION regress_rls_alice;
SELECT * FROM rls_view;
EXPLAIN (COSTS OFF) SELECT * FROM rls_view;

-- Query as role that is not owner of table but is owner of view.
-- Should return records based on view owner policies.
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM rls_view;
EXPLAIN (COSTS OFF) SELECT * FROM rls_view;

-- Query as role that is not the owner of the table or view without permissions.
SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM rls_view; --fail - permission denied.
EXPLAIN (COSTS OFF) SELECT * FROM rls_view; --fail - permission denied.

-- Query as role that is not the owner of the table or view with permissions.
SET SESSION AUTHORIZATION regress_rls_bob;
GRANT SELECT ON rls_view TO regress_rls_carol;
SELECT * FROM rls_view;
EXPLAIN (COSTS OFF) SELECT * FROM rls_view;

SET SESSION AUTHORIZATION regress_rls_bob;
DROP VIEW rls_view;

--
-- Command specific
--
SET SESSION AUTHORIZATION regress_rls_alice;

CREATE TABLE x1 (a int, b text, c text);
GRANT ALL ON x1 TO PUBLIC;

INSERT INTO x1 VALUES
    (1, 'abc', 'regress_rls_bob'),
    (2, 'bcd', 'regress_rls_bob'),
    (3, 'cde', 'regress_rls_carol'),
    (4, 'def', 'regress_rls_carol'),
    (5, 'efg', 'regress_rls_bob'),
    (6, 'fgh', 'regress_rls_bob'),
    (7, 'fgh', 'regress_rls_carol'),
    (8, 'fgh', 'regress_rls_carol');

CREATE POLICY p0 ON x1 FOR ALL USING (c = current_user);
CREATE POLICY p1 ON x1 FOR SELECT USING (a % 2 = 0);
CREATE POLICY p2 ON x1 FOR INSERT WITH CHECK (a % 2 = 1);
CREATE POLICY p3 ON x1 FOR UPDATE USING (a % 2 = 0);
CREATE POLICY p4 ON x1 FOR DELETE USING (a < 8);

ALTER TABLE x1 ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM x1 WHERE f_leak(b) ORDER BY a ASC;
UPDATE x1 SET b = b || '_updt' WHERE f_leak(b) RETURNING *;

SET SESSION AUTHORIZATION regress_rls_carol;
SELECT * FROM x1 WHERE f_leak(b) ORDER BY a ASC;
UPDATE x1 SET b = b || '_updt' WHERE f_leak(b) RETURNING *;
DELETE FROM x1 WHERE f_leak(b) RETURNING *;

--
-- Duplicate Policy Names
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE y1 (a int, b text);
CREATE TABLE y2 (a int, b text);

GRANT ALL ON y1, y2 TO regress_rls_bob;

CREATE POLICY p1 ON y1 FOR ALL USING (a % 2 = 0);
CREATE POLICY p2 ON y1 FOR SELECT USING (a > 2);
CREATE POLICY p1 ON y1 FOR SELECT USING (a % 2 = 1);  --fail
CREATE POLICY p1 ON y2 FOR ALL USING (a % 2 = 0);  --OK

ALTER TABLE y1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE y2 ENABLE ROW LEVEL SECURITY;

--
-- Expression structure with SBV
--
-- Create view as table owner.  RLS should NOT be applied.
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE VIEW rls_sbv WITH (security_barrier) AS
    SELECT * FROM y1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM rls_sbv WHERE (a = 1);
DROP VIEW rls_sbv;

-- Create view as role that does not own table.  RLS should be applied.
SET SESSION AUTHORIZATION regress_rls_bob;
CREATE VIEW rls_sbv WITH (security_barrier) AS
    SELECT * FROM y1 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM rls_sbv WHERE (a = 1);
DROP VIEW rls_sbv;

--
-- Expression structure
--
SET SESSION AUTHORIZATION regress_rls_alice;
INSERT INTO y2 (SELECT x, md5(x::text) FROM generate_series(0,20) x);
CREATE POLICY p2 ON y2 USING (a % 3 = 0);
CREATE POLICY p3 ON y2 USING (a % 4 = 0);

SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM y2 WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM y2 WHERE f_leak(b);

--
-- Qual push-down of leaky functions, when not referring to table
--
SELECT * FROM y2 WHERE f_leak('abc');
EXPLAIN (COSTS OFF) SELECT * FROM y2 WHERE f_leak('abc');

CREATE TABLE test_qual_pushdown (
    abc text
);

INSERT INTO test_qual_pushdown VALUES ('abc'),('def');

SELECT * FROM y2 JOIN test_qual_pushdown ON (b = abc) WHERE f_leak(abc);
EXPLAIN (COSTS OFF) SELECT * FROM y2 JOIN test_qual_pushdown ON (b = abc) WHERE f_leak(abc);

SELECT * FROM y2 JOIN test_qual_pushdown ON (b = abc) WHERE f_leak(b);
EXPLAIN (COSTS OFF) SELECT * FROM y2 JOIN test_qual_pushdown ON (b = abc) WHERE f_leak(b);

DROP TABLE test_qual_pushdown;

--
-- Plancache invalidate on user change.
--
RESET SESSION AUTHORIZATION;
-- Suppress NOTICE messages when doing a cascaded drop.
SET client_min_messages TO 'warning';

DROP TABLE t1 CASCADE;
RESET client_min_messages;

CREATE TABLE t1 (a integer);

GRANT SELECT ON t1 TO regress_rls_bob, regress_rls_carol;

CREATE POLICY p1 ON t1 TO regress_rls_bob USING ((a % 2) = 0);
CREATE POLICY p2 ON t1 TO regress_rls_carol USING ((a % 4) = 0);

ALTER TABLE t1 ENABLE ROW LEVEL SECURITY;

-- Prepare as regress_rls_bob
SET ROLE regress_rls_bob;
PREPARE role_inval AS SELECT * FROM t1;
-- Check plan
EXPLAIN (COSTS OFF) EXECUTE role_inval;

-- Change to regress_rls_carol
SET ROLE regress_rls_carol;
-- Check plan- should be different
EXPLAIN (COSTS OFF) EXECUTE role_inval;

-- Change back to regress_rls_bob
SET ROLE regress_rls_bob;
-- Check plan- should be back to original
EXPLAIN (COSTS OFF) EXECUTE role_inval;

--
-- CTE and RLS
--
RESET SESSION AUTHORIZATION;
DROP TABLE t1 CASCADE;
CREATE TABLE t1 (a integer, b text);
CREATE POLICY p1 ON t1 USING (a % 2 = 0);

ALTER TABLE t1 ENABLE ROW LEVEL SECURITY;

GRANT ALL ON t1 TO regress_rls_bob;

INSERT INTO t1 (SELECT x, md5(x::text) FROM generate_series(0,20) x);

SET SESSION AUTHORIZATION regress_rls_bob;

WITH cte1 AS (SELECT * FROM t1 WHERE f_leak(b)) SELECT * FROM cte1;
EXPLAIN (COSTS OFF) WITH cte1 AS (SELECT * FROM t1 WHERE f_leak(b)) SELECT * FROM cte1;

WITH cte1 AS (UPDATE t1 SET a = a + 1 RETURNING *) SELECT * FROM cte1; --fail
WITH cte1 AS (UPDATE t1 SET a = a RETURNING *) SELECT * FROM cte1; --ok

WITH cte1 AS (INSERT INTO t1 VALUES (21, 'Fail') RETURNING *) SELECT * FROM cte1; --fail
WITH cte1 AS (INSERT INTO t1 VALUES (20, 'Success') RETURNING *) SELECT * FROM cte1; --ok

--
-- Rename Policy
--
RESET SESSION AUTHORIZATION;
ALTER POLICY p1 ON t1 RENAME TO p1; --fail

SELECT polname, relname
    FROM pg_policy pol
    JOIN pg_class pc ON (pc.oid = pol.polrelid)
    WHERE relname = 't1';

ALTER POLICY p1 ON t1 RENAME TO p2; --ok

SELECT polname, relname
    FROM pg_policy pol
    JOIN pg_class pc ON (pc.oid = pol.polrelid)
    WHERE relname = 't1';

--
-- Check INSERT SELECT
--
SET SESSION AUTHORIZATION regress_rls_bob;
CREATE TABLE t2 (a integer, b text);
INSERT INTO t2 (SELECT * FROM t1);
EXPLAIN (COSTS OFF) INSERT INTO t2 (SELECT * FROM t1);
SELECT * FROM t2;
EXPLAIN (COSTS OFF) SELECT * FROM t2;
CREATE TABLE t3 AS SELECT * FROM t1;
SELECT * FROM t3;
SELECT * INTO t4 FROM t1;
SELECT * FROM t4;

--
-- RLS with JOIN
--
SET SESSION AUTHORIZATION regress_rls_alice;
CREATE TABLE blog (id integer, author text, post text);
CREATE TABLE comment (blog_id integer, message text);

GRANT ALL ON blog, comment TO regress_rls_bob;

CREATE POLICY blog_1 ON blog USING (id % 2 = 0);

ALTER TABLE blog ENABLE ROW LEVEL SECURITY;

INSERT INTO blog VALUES
    (1, 'alice', 'blog #1'),
    (2, 'bob', 'blog #1'),
    (3, 'alice', 'blog #2'),
    (4, 'alice', 'blog #3'),
    (5, 'john', 'blog #1');

INSERT INTO comment VALUES
    (1, 'cool blog'),
    (1, 'fun blog'),
    (3, 'crazy blog'),
    (5, 'what?'),
    (4, 'insane!'),
    (2, 'who did it?');

SET SESSION AUTHORIZATION regress_rls_bob;
-- Check RLS JOIN with Non-RLS.
SELECT id, author, message FROM blog JOIN comment ON id = blog_id;
-- Check Non-RLS JOIN with RLS.
SELECT id, author, message FROM comment JOIN blog ON id = blog_id;

SET SESSION AUTHORIZATION regress_rls_alice;
CREATE POLICY comment_1 ON comment USING (blog_id < 4);

ALTER TABLE comment ENABLE ROW LEVEL SECURITY;

SET SESSION AUTHORIZATION regress_rls_bob;
-- Check RLS JOIN RLS
SELECT id, author, message FROM blog JOIN comment ON id = blog_id;
SELECT id, author, message FROM comment JOIN blog ON id = blog_id;

SET SESSION AUTHORIZATION regress_rls_alice;
DROP TABLE blog, comment;

--
-- Default Deny Policy
--
RESET SESSION AUTHORIZATION;
DROP POLICY p2 ON t1;
ALTER TABLE t1 OWNER TO regress_rls_alice;

-- Check that default deny does not apply to superuser.
RESET SESSION AUTHORIZATION;
SELECT * FROM t1;
EXPLAIN (COSTS OFF) SELECT * FROM t1;

-- Check that default deny does not apply to table owner.
SET SESSION AUTHORIZATION regress_rls_alice;
SELECT * FROM t1;
EXPLAIN (COSTS OFF) SELECT * FROM t1;

-- Check that default deny applies to non-owner/non-superuser when RLS on.
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO ON;
SELECT * FROM t1;
EXPLAIN (COSTS OFF) SELECT * FROM t1;
SET SESSION AUTHORIZATION regress_rls_bob;
SELECT * FROM t1;
EXPLAIN (COSTS OFF) SELECT * FROM t1;

--
-- COPY TO/FROM
--

RESET SESSION AUTHORIZATION;
DROP TABLE copy_t CASCADE;
CREATE TABLE copy_t (a integer, b text);
CREATE POLICY p1 ON copy_t USING (a % 2 = 0);

ALTER TABLE copy_t ENABLE ROW LEVEL SECURITY;

GRANT ALL ON copy_t TO regress_rls_bob, regress_rls_exempt_user;

INSERT INTO copy_t (SELECT x, md5(x::text) FROM generate_series(0,10) x);

-- Check COPY TO as Superuser/owner.
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user with permissions.
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user with permissions and BYPASSRLS
SET SESSION AUTHORIZATION regress_rls_exempt_user;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user without permissions. SET row_security TO OFF;
SET SESSION AUTHORIZATION regress_rls_carol;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY relation TO; keep it just one row to avoid reordering issues
RESET SESSION AUTHORIZATION;
SET row_security TO ON;
CREATE TABLE copy_rel_to (a integer, b text);
CREATE POLICY p1 ON copy_rel_to USING (a % 2 = 0);

ALTER TABLE copy_rel_to ENABLE ROW LEVEL SECURITY;

GRANT ALL ON copy_rel_to TO regress_rls_bob, regress_rls_exempt_user;

INSERT INTO copy_rel_to VALUES (1, md5('1'));

-- Check COPY TO as Superuser/owner.
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user with permissions.
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user with permissions and BYPASSRLS
SET SESSION AUTHORIZATION regress_rls_exempt_user;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY TO as user without permissions. SET row_security TO OFF;
SET SESSION AUTHORIZATION regress_rls_carol;
SET row_security TO OFF;


SET row_security TO ON;



-- Check COPY FROM as Superuser/owner.
RESET SESSION AUTHORIZATION;
SET row_security TO OFF;












SET row_security TO ON;













-- Check COPY FROM as user with permissions.
SET SESSION AUTHORIZATION regress_rls_bob;
SET row_security TO OFF;



























-- Check COPY FROM as user without permissions.
SET SESSION AUTHORIZATION regress_rls_carol;
SET row_security TO OFF;

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































