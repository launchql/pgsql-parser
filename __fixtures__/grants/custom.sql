GRANT USAGE ON SCHEMA users TO administrator;
GRANT EXECUTE ON FUNCTION auth.authenticate TO anonymous;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE auth.token TO administrator;

REVOKE USAGE ON SCHEMA users FROM administrator;
REVOKE EXECUTE ON FUNCTION auth.authenticate FROM anonymous;
REVOKE SELECT,INSERT,UPDATE,DELETE ON TABLE auth.token FROM administrator;
