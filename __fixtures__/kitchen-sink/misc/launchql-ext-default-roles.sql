DO $$
  BEGIN
    IF NOT EXISTS (
        SELECT
            1
        FROM
            pg_roles
        WHERE
            rolname = 'anonymous') THEN
    CREATE ROLE anonymous;
    COMMENT ON ROLE anonymous IS 'Anonymous group';
    ALTER USER anonymous WITH NOCREATEDB;
    ALTER USER anonymous WITH NOCREATEROLE;
    ALTER USER anonymous WITH NOLOGIN;
    ALTER USER anonymous WITH NOBYPASSRLS;
END IF;
END $$;

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
    ALTER USER authenticated WITH NOCREATEDB;
    ALTER USER authenticated WITH NOCREATEROLE;
    ALTER USER authenticated WITH NOLOGIN;
    ALTER USER authenticated WITH NOBYPASSRLS;
END IF;
END $$;

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
    ALTER USER administrator WITH NOCREATEDB;
    ALTER USER administrator WITH NOCREATEROLE;
    ALTER USER administrator WITH NOLOGIN;
    ALTER USER administrator WITH BYPASSRLS;
    GRANT anonymous TO administrator;
    GRANT authenticated TO administrator;
END IF;
END $$;