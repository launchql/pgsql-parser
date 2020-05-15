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
