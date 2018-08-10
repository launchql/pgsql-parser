BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
            SELECT
                1
            FROM
                pg_roles
            WHERE
                rolname = 'authenticated') THEN
            CREATE ROLE authenticated;
            COMMENT ON ROLE authenticated IS 'Authenticated group';
    END IF;
END $$;

COMMIT;
