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
