CREATE SCHEMA IF NOT EXISTS app_jobs;

CREATE TABLE app_jobs.job_queues (
  queue_name varchar NOT NULL PRIMARY KEY,
  job_count int DEFAULT 0 NOT NULL,
  locked_at timestamp with time zone,
  locked_by varchar
);

ALTER TABLE app_jobs.job_queues ENABLE ROW LEVEL SECURITY;

CREATE TABLE foo (
  name text,
  foo_timestamp timestampz DEFAULT CURRENT_DATE
);

ALTER TABLE foo RENAME COLUMN name TO city;

ALTER TABLE foo
    ALTER COLUMN foo_timestamp DROP DEFAULT,
    ALTER COLUMN foo_timestamp TYPE timestamp with time zone
    USING
        timestamp with time zone 'epoch' + foo_timestamp * interval '1 second',
    ALTER COLUMN foo_timestamp SET DEFAULT now();

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id);

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON DELETE CASCADE;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON DELETE RESTRICT;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON DELETE NO ACTION;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON DELETE SET NULL;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE SET DEFAULT;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE CASCADE;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE RESTRICT;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE NO ACTION;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE SET NULL;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) ON UPDATE SET DEFAULT;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (order_id) REFERENCES othr.orders (id) 
    ON UPDATE SET DEFAULT
    ON DELETE SET NULL
    ;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (a,b) REFERENCES othr.orders (c,d) MATCH FULL;

ALTER TABLE scha.foo 
  ADD CONSTRAINT my_constraint_fey
  FOREIGN KEY (a, b) REFERENCES othr.orders (c,d) MATCH SIMPLE;

ALTER TABLE ONLY collections.mfield
    ADD CONSTRAINT col_field_pkey PRIMARY KEY (id);

ALTER TABLE collections.mfield
    ADD CONSTRAINT col_field_pkey PRIMARY KEY (id);


-- TODO MATCH after upgrading to newer engine: https://github.com/lfittl/libpg_query/issues/66

-- ALTER TABLE scha.foo 
--   ADD CONSTRAINT my_constraint_fey
--   FOREIGN KEY (order_id) REFERENCES othr.orders (id) 
--     MATCH FULL
--     ON UPDATE SET DEFAULT
--     ON DELETE SET NULL
--     ;

-- MATCH PARTIAL not yet implemented

-- ALTER TABLE scha.foo 
--   ADD CONSTRAINT my_constraint_fey
--   FOREIGN KEY (a,b) REFERENCES othr.orders (c,d) MATCH PARTIAL;

ALTER TABLE schema_name.table_name ALTER COLUMN column_name SET DATA TYPE new_column_type USING column_name::new_column_type;
ALTER TABLE schema_name.table_name ALTER COLUMN column_name TYPE new_column_type USING column_name::new_column_type;

ALTER TABLE schema_name.table_name ADD COLUMN column_name column_type;
ALTER TABLE schema_name.table_name ADD COLUMN column_name Geometry(Polygon, 4326);
ALTER TABLE schema_name.table_name ADD COLUMN "column-name" Geometry(Polygon, 4326);
ALTER TABLE schema_name.table_name ADD COLUMN column_name int;

ALTER TABLE schema_name.table_name DROP COLUMN column_name;



ALTER TABLE mytable OWNER TO regtest_alter_user2;

ALTER FUNCTION alt_func3(int) RENAME TO alt_func4;
ALTER FUNCTION alt_func1(int) RENAME TO alt_func4;
ALTER FUNCTION alt_func3(int) OWNER TO regtest_alter_user2;
ALTER FUNCTION alt_func2(int) OWNER TO regtest_alter_user3;
ALTER FUNCTION alt_func3(int) SET SCHEMA alt_nsp2;      
ALTER FUNCTION alt_func2(int) SET SCHEMA alt_nsp2;

ALTER TABLE old_schema_name.table_name
    SET SCHEMA new_schema_name;

ALTER FOREIGN DATA WRAPPER alt_fdw1 RENAME TO alt_fdw2; 
ALTER FOREIGN DATA WRAPPER alt_fdw1 RENAME TO alt_fdw3;  

ALTER SERVER alt_fserv1 RENAME TO alt_fserv2;  
ALTER SERVER alt_fserv1 RENAME TO alt_fserv3;   


ALTER TYPE test_type2 ADD ATTRIBUTE c text; 
ALTER TYPE test_type2 ADD ATTRIBUTE c text CASCADE;
ALTER TYPE test_type2 ALTER ATTRIBUTE b TYPE varchar; 
ALTER TYPE test_type2 ALTER ATTRIBUTE b TYPE varchar CASCADE;
ALTER TYPE test_type2 DROP ATTRIBUTE b; 
ALTER TYPE test_type2 DROP ATTRIBUTE b CASCADE;
ALTER TYPE test_type2 RENAME ATTRIBUTE a TO aa; 
ALTER TYPE test_type2 RENAME ATTRIBUTE a TO aa CASCADE;

ALTER TYPE test_type3 DROP ATTRIBUTE a, ADD ATTRIBUTE b int;
CREATE TYPE tt_t0 AS (z inet, x int, y numeric(8,2));
ALTER TYPE tt_t0 DROP ATTRIBUTE z;

ALTER TABLE tt7 DROP q;								

ALTER TABLE tt1 OF tt_t0;
ALTER TABLE tt7 NOT OF;

ALTER TABLE ONLY test_drop_constr_parent DROP CONSTRAINT "test_drop_constr_parent_c_check";

ALTER TABLE IF EXISTS tt8 ADD COLUMN f int;
ALTER TABLE IF EXISTS tt8 ADD CONSTRAINT xxx PRIMARY KEY(f);
ALTER TABLE IF EXISTS tt8 ADD CHECK (f BETWEEN 0 AND 10);
ALTER TABLE IF EXISTS tt8 ALTER COLUMN f SET DEFAULT 0;
ALTER TABLE IF EXISTS tt8 RENAME COLUMN f TO f1;
ALTER TABLE IF EXISTS tt8 SET SCHEMA alter2;

ALTER TABLE IF EXISTS tt8 ADD COLUMN f int;
ALTER TABLE IF EXISTS tt8 ADD CONSTRAINT xxx PRIMARY KEY(f);
ALTER TABLE IF EXISTS tt8 ADD CHECK (f BETWEEN 0 AND 10);
ALTER TABLE IF EXISTS tt8 ALTER COLUMN f SET DEFAULT 0;
ALTER TABLE IF EXISTS tt8 RENAME COLUMN f TO f1;
ALTER TABLE IF EXISTS tt8 SET SCHEMA alter2;

ALTER TABLE comment_test ALTER COLUMN indexed_col SET DATA TYPE int;
ALTER TABLE comment_test ALTER COLUMN indexed_col SET DATA TYPE text;

ALTER TABLE test_add_column
	ADD COLUMN IF NOT EXISTS c2 integer,
	ADD COLUMN IF NOT EXISTS c3 integer,
	ADD COLUMN c4 integer;

ALTER TYPE bogus ADD VALUE 'good';
ALTER TYPE schemaname.bogus ADD VALUE 'good';
ALTER TYPE "schema-name".bogus ADD VALUE 'good';
ALTER TYPE "schema-name"."bog-us" ADD VALUE 'good';
ALTER TYPE "schema-name"."bog-us" ADD VALUE 'goo''d';

ALTER TYPE bogus RENAME TO bogon;
ALTER TYPE test8b ADD ATTRIBUTE c testdomain1;
ALTER TYPE test8b ALTER ATTRIBUTE b TYPE testdomain1;
REVOKE ALL ON TYPE testtype1 FROM PUBLIC;

ALTER DOMAIN things ADD CONSTRAINT meow CHECK (VALUE < 11);
ALTER DOMAIN things ADD CONSTRAINT meow CHECK (VALUE < 11) NOT VALID;
ALTER DOMAIN things VALIDATE CONSTRAINT meow;

alter domain con add constraint t check (VALUE < 1); -- fails

alter domain con add constraint t check (VALUE < 34);
alter domain con add check (VALUE > 0);

create domain dinter vchar4 check (substring(VALUE, 1, 1) = 'x');
create domain dtop dinter check (substring(VALUE, 2, 1) = '1');

alter domain testdomain1 rename to testdomain2;
alter type testdomain2 rename to testdomain3;  -- alter type also works

create domain testdomain1 as int constraint unsigned check (value > 0);
alter domain testdomain1 rename constraint unsigned to unsigned_foo;
alter domain testdomain1 drop constraint unsigned_foo;
drop domain testdomain1;

ALTER TABLE mytable ADD COLUMN height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED;

ALTER SCHEMA schemaname RENAME TO newname;
ALTER SCHEMA schemaname OWNER TO newowner;