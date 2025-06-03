CREATE VIEW collaboration_public.direct_project_permits AS
SELECT * FROM permits;

CREATE MATERIALIZED VIEW collaboration_public.direct_project_permits AS
SELECT * FROM permits;

CREATE VIEW superschema.app_columns AS
SELECT
    attname AS name,
    t.typname AS TYPE,
    c.relname AS table_name,
    n.nspname AS schema_name
FROM
    pg_attribute a
    JOIN pg_type t ON (t.oid = a.atttypid)
    JOIN pg_class c ON (c.oid = a.attrelid)
    JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE
    n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND attnum > 0
    AND NOT attisdropped
ORDER BY
    attnum;

CREATE VIEW superschema.app_columns AS
SELECT
    attname AS name,
    t.typname AS TYPE,
    c.relname AS table_name,
    n.nspname AS schema_name
FROM
    pg_attribute a
    JOIN pg_type t ON (t.oid = a.atttypid)
    JOIN pg_class c ON (c.oid = a.attrelid)
    JOIN pg_namespace n ON (n.oid = c.relnamespace)
WHERE
    n.nspname IN ('pg_catalog', 'information_schema', 'pg_toast')
    AND attnum > 0
    AND NOT attisdropped
ORDER BY
    attnum;
