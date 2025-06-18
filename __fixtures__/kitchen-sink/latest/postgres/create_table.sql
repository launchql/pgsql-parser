-- Kitchen Sink: CREATE TABLE Syntax Tests (PostgreSQL)

-- Basic table
CREATE TABLE base_table (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Data types and defaults
CREATE TABLE data_types (
  a BOOLEAN DEFAULT TRUE,
  b INTEGER,
  c TEXT DEFAULT 'hello',
  d NUMERIC(10,2) CHECK (d > 0),
  e TIMESTAMP DEFAULT now()
);

-- Advanced constraints
CREATE TABLE constraint_types (
  id INT PRIMARY KEY,
  x INT NOT NULL,
  y INT,
  UNIQUE (x, y),
  CHECK (x <> y)
);

-- Inheritance
CREATE TABLE parent_table (
  id INT,
  created_at TIMESTAMP
);
CREATE TABLE child_table (
  description TEXT
) INHERITS (parent_table);

-- Unlogged & Temporary
CREATE UNLOGGED TABLE unlogged_test (id INT);
CREATE TEMPORARY TABLE temp_test (id INT);

-- Partitioned tables
CREATE TABLE part_list (a INT) PARTITION BY LIST (a);
CREATE TABLE part_range (a DATE) PARTITION BY RANGE (a);
CREATE TABLE part_hash (a INT) PARTITION BY HASH (a);

-- Partition children
CREATE TABLE part_list_a PARTITION OF part_list FOR VALUES IN (1, 2);
CREATE TABLE part_range_a PARTITION OF part_range FOR VALUES FROM ('2020-01-01') TO ('2021-01-01');
CREATE TABLE part_hash_a PARTITION OF part_hash FOR VALUES WITH (MODULUS 4, REMAINDER 0);

-- Invalid types and expressions
-- CREATE TABLE bad_type (x unknown);
-- CREATE TABLE default_expr (id INT DEFAULT (id));
-- CREATE TABLE invalid_agg (x INT DEFAULT avg(x));

-- Generated columns
CREATE TABLE generated_cols (
  a INT,
  b INT GENERATED ALWAYS AS (a * 2) STORED
);

-- Composite & domain
CREATE TYPE comp_type AS (x INT, y TEXT);
CREATE TABLE uses_comp (
  id INT,
  data comp_type
);
CREATE DOMAIN posint AS INT CHECK (VALUE > 0);
CREATE TABLE uses_domain (
  id posint
);

-- Collation tests
CREATE TABLE collate_test (
  a TEXT COLLATE "C",
  b TEXT COLLATE "POSIX"
);

-- WITH options (fillfactor etc.)
CREATE TABLE storage_options (
  id INT
) WITH (fillfactor = 70);

-- Comments
CREATE TABLE table_with_comment (
  id INT,
  description TEXT
);
COMMENT ON TABLE table_with_comment IS 'A table with a comment';
COMMENT ON COLUMN table_with_comment.description IS 'Describes the item';

-- Index with expressions
CREATE TABLE index_expr_test (
  a INT,
  b INT
);
CREATE INDEX idx_expr ON index_expr_test ((a + b));

-- Subtransactions
BEGIN;
CREATE TABLE subtx_test (id INT);
SAVEPOINT s1;
DROP TABLE subtx_test;
ROLLBACK TO s1;
COMMIT;

-- Partition function
CREATE FUNCTION plusone(x INT) RETURNS INT AS $$ SELECT x + 1; $$ LANGUAGE SQL;
CREATE TABLE func_part (
  a INT
) PARTITION BY RANGE (plusone(a));

-- Default partition
CREATE TABLE def_parted (
  a INT
) PARTITION BY LIST (a);
CREATE TABLE def_part PARTITION OF def_parted DEFAULT;

-- Multilevel partition
CREATE TABLE multilevel (
  a INT
) PARTITION BY LIST (a);
CREATE TABLE mlvl_sub PARTITION OF multilevel FOR VALUES IN (1) PARTITION BY RANGE (a);
CREATE TABLE mlvl_leaf PARTITION OF mlvl_sub FOR VALUES FROM (1) TO (10);

-- DROP cleanup
DROP FUNCTION plusone(INT);
DROP TYPE comp_type;
DROP DOMAIN posint;
