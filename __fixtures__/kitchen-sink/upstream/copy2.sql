CREATE FUNCTION fn_x_before () RETURNS TRIGGER AS '
  BEGIN
		NEW.e := ''before trigger fired''::text;
		return NEW;
	END;
' LANGUAGE plpgsql;

CREATE FUNCTION fn_x_after () RETURNS TRIGGER AS '
  BEGIN
		UPDATE x set e=''after trigger fired'' where c=''stuff'';
		return NULL;
	END;
' LANGUAGE plpgsql;

CREATE TRIGGER trg_x_after AFTER INSERT ON x
FOR EACH ROW EXECUTE PROCEDURE fn_x_after();

CREATE TRIGGER trg_x_before BEFORE INSERT ON x
FOR EACH ROW EXECUTE PROCEDURE fn_x_before();













































-- non-existent column in column list: should fail































-- extra data: should fail







-- various COPY options: delimiters, oids, NULL string, encoding









































-- check results of copy in
SELECT * FROM x;

INSERT INTO no_oids (a, b) VALUES (5, 10);
INSERT INTO no_oids (a, b) VALUES (20, 30);

-- should fail























































































-- test end of copy marker
CREATE TEMP TABLE testeoc (a text);




































SELECT * FROM testnull;

BEGIN;
CREATE TABLE vistest (LIKE testeoc);








COMMIT;
SELECT * FROM vistest;
BEGIN;
TRUNCATE vistest;








SELECT * FROM vistest;
SAVEPOINT s1;
TRUNCATE vistest;








SELECT * FROM vistest;
COMMIT;
SELECT * FROM vistest;

BEGIN;
TRUNCATE vistest;








SELECT * FROM vistest;
SAVEPOINT s1;
TRUNCATE vistest;








SELECT * FROM vistest;
COMMIT;
SELECT * FROM vistest;

BEGIN;
TRUNCATE vistest;








SELECT * FROM vistest;
COMMIT;
TRUNCATE vistest;








BEGIN;
TRUNCATE vistest;
SAVEPOINT s1;








COMMIT;
BEGIN;
INSERT INTO vistest VALUES ('z');
SAVEPOINT s1;
TRUNCATE vistest;
ROLLBACK TO SAVEPOINT s1;








COMMIT;
CREATE FUNCTION truncate_in_subxact() RETURNS VOID AS
$$
BEGIN
	TRUNCATE vistest;
EXCEPTION
  WHEN OTHERS THEN
	INSERT INTO vistest VALUES ('subxact failure');
END;
$$ language plpgsql;
BEGIN;
INSERT INTO vistest VALUES ('z');
SELECT truncate_in_subxact();








SELECT * FROM vistest;
COMMIT;
SELECT * FROM vistest;
-- Test FORCE_NOT_NULL and FORCE_NULL options
CREATE TEMP TABLE forcetest (
    a INT NOT NULL,
    b TEXT NOT NULL,
    c TEXT,
    d TEXT,
    e TEXT
);
-- should succeed with no effect ("b" remains an empty string, "c" remains NULL)
BEGIN;






COMMIT;
SELECT b, c FROM forcetest WHERE a = 1;
-- should succeed, FORCE_NULL and FORCE_NOT_NULL can be both specified
BEGIN;






COMMIT;
SELECT c, d FROM forcetest WHERE a = 2;
-- should fail with not-null constraint violation
BEGIN;






ROLLBACK;
-- should fail with "not referenced by COPY" error
BEGIN;
















































select * from check_con_tbl;

DROP TABLE forcetest;
DROP TABLE vistest;
DROP FUNCTION truncate_in_subxact();
DROP TABLE x, y;
DROP FUNCTION fn_x_before();
DROP FUNCTION fn_x_after();
