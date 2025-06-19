-- Drop Table with cascade
DROP TABLE IF EXISTS some_table CASCADE;

-- Drop View with cascade
DROP VIEW IF EXISTS some_view CASCADE;

-- Drop Materialized View with cascade
DROP MATERIALIZED VIEW IF EXISTS some_mat_view CASCADE;

-- Drop Index with cascade
DROP INDEX IF EXISTS some_index CASCADE;

-- Drop Schema with cascade
DROP SCHEMA IF EXISTS some_schema CASCADE;

-- Drop Type with cascade
DROP TYPE IF EXISTS some_composite_type CASCADE;

-- Drop Function with cascade
DROP FUNCTION IF EXISTS some_function(int) CASCADE;

-- Drop Procedure with cascade
DROP PROCEDURE IF EXISTS some_proc(int) CASCADE;

-- Drop Aggregate with cascade
DROP AGGREGATE IF EXISTS some_agg(int) CASCADE;

-- Drop Operator with cascade
DROP OPERATOR IF EXISTS + (integer, integer) CASCADE;

-- Drop Trigger with cascade
DROP TRIGGER IF EXISTS some_trigger ON some_table CASCADE;

-- Drop Rule with cascade
DROP RULE IF EXISTS some_rule ON some_view CASCADE;

-- Drop Sequence with cascade
DROP SEQUENCE IF EXISTS some_sequence CASCADE;

-- Drop Domain with cascade
DROP DOMAIN IF EXISTS some_domain CASCADE;

-- Drop Extension with cascade
DROP EXTENSION IF EXISTS some_extension CASCADE;

-- Drop Publication with cascade
DROP PUBLICATION IF EXISTS some_pub CASCADE;

-- Drop Subscription with cascade
DROP SUBSCRIPTION IF EXISTS some_sub CASCADE;

-- -- Drop Role with cascade
-- DROP ROLE IF EXISTS some_role CASCADE;

-- Drop Policy with cascade
DROP POLICY IF EXISTS some_policy ON some_table CASCADE;

-- Drop Server with cascade
DROP SERVER IF EXISTS some_fdw_server CASCADE;

-- -- Drop User Mapping with cascade
-- DROP USER MAPPING IF EXISTS FOR some_user SERVER some_fdw_server CASCADE;

-- Drop Collation with cascade
-- DROP COLLATION IF EXISTS some_collation CASCADE;

-- Drop Tablespace with cascade
-- DROP TABLESPACE IF EXISTS some_tablespace CASCADE;

-- Drop Foreign Table with cascade
DROP FOREIGN TABLE IF EXISTS some_foreign_table CASCADE;

-- -- Drop Foreign Data Wrapper with cascade
DROP FOREIGN DATA WRAPPER IF EXISTS some_fdw CASCADE;

-- Drop Cast with cascade
DROP CAST IF EXISTS (integer AS text) CASCADE;

-- Drop Transform with cascade
DROP TRANSFORM IF EXISTS FOR some_type LANGUAGE plpgsql CASCADE;

-- Alter Table Drop Column with cascade
ALTER TABLE some_table DROP COLUMN some_column CASCADE;

-- Alter Table Drop Constraint with cascade
ALTER TABLE some_table DROP CONSTRAINT some_constraint CASCADE;
