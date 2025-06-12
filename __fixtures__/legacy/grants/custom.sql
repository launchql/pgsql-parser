GRANT USAGE ON SCHEMA users TO administrator;
GRANT EXECUTE ON FUNCTION auth.authenticate TO anonymous;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE auth.token TO administrator;

REVOKE USAGE ON SCHEMA users FROM administrator;
REVOKE EXECUTE ON FUNCTION auth.authenticate FROM anonymous;
REVOKE SELECT,INSERT,UPDATE,DELETE ON TABLE auth.token FROM administrator;

GRANT SELECT, INSERT ON someschema.sometable2 TO somerole; 

GRANT UPDATE (col2) ON someschema.sometable2 TO somerole;
GRANT UPDATE (col2,col3) ON someschema.sometable2 TO somerole;
GRANT UPDATE (col2,"another-column") ON someschema.sometable2 TO somerole;
GRANT INSERT (col2), UPDATE (col2,"another-column"), DELETE ON someschema.sometable2 TO somerole;
GRANT INSERT (col2,col3) ON someschema.sometable2 TO somerole;
GRANT INSERT (col2,"another-column") ON someschema.sometable2 TO somerole;
