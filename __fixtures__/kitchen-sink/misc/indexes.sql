CREATE INDEX CONCURRENTLY IF NOT EXISTS index_email_logs_on_created_at ON public.email_logs USING btree (created_at DESC);

DROP INDEX my_index;
DROP INDEX CONCURRENTLY my_index;
DROP INDEX IF EXISTS my_index;
DROP INDEX CONCURRENTLY IF EXISTS my_index;
DROP INDEX schema.my_index;
DROP INDEX CONCURRENTLY schema.my_index;
DROP INDEX CONCURRENTLY IF EXISTS schema.my_index;
DROP INDEX my_index CASCADE;
DROP INDEX CONCURRENTLY my_index CASCADE;
DROP INDEX CONCURRENTLY IF EXISTS my_index CASCADE;


CREATE UNIQUE INDEX new_unique_idx ON new_example(a, b) INCLUDE (c);

CREATE INDEX CONCURRENTLY idx_with_operator ON boom.merkle_tree USING GIN ( name gin_trgm_ops ( param1 = 32, param2 = true) );