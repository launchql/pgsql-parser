GRANT USAGE ON SCHEMA users TO administrator;
GRANT EXECUTE ON FUNCTION auth.authenticate TO anonymous;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE auth.token TO administrator;
