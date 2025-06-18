-- GRANT ALL ON SCHEMA alt_nsp1, alt_nsp2 TO public;

GRANT app_authenticated TO app_user;
GRANT app_authenticated, app_anonymous TO app_user;

GRANT app_authenticated, app_anonymous TO app_user, super_app_user;
