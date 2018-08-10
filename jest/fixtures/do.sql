DO $$
BEGIN
    IF NOT EXISTS (
            SELECT
                1
            FROM
                pg_roles
            WHERE
                rolname = 'administrator') THEN
            CREATE ROLE administrator;
            COMMENT ON ROLE administrator IS 'Administration group';
    END IF;
END $$;
