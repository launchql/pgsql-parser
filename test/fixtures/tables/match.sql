-- this works in postgres, just NOT here, maybe need to upgrade the binary?

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id integer NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS post_type CASCADE;
CREATE TABLE post_type (
  id integer NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS assembly_seat CASCADE;
CREATE TABLE assembly_seat (
  id integer NOT NULL PRIMARY KEY
);

-- TODO MATCH after upgrading to newer engine: https://github.com/lfittl/libpg_query/issues/66
-- DROP TABLE IF EXISTS post CASCADE;
-- CREATE TABLE post (
--   post_id serial NOT NULL
--  ,revision integer NOT NULL DEFAULT 0
--  ,summary text NOT NULL
--  ,description text NOT NULL
--  ,user_id integer NOT NULL
--     REFERENCES users (id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT
--  ,post_type_id integer NOT NULL
--     REFERENCES post_type (id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT
--  ,ctime timestamptz DEFAULT NOW()
--  ,PRIMARY KEY(post_id, revision)
-- );

-- DROP TABLE IF EXISTS post_state CASCADE;
-- CREATE TABLE post_state (
--   post_id integer NOT NULL
--  ,revision integer NOT NULL
--  ,assembly_seat_id integer NOT NULL
--     REFERENCES assembly_seat (id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT
--  ,PRIMARY KEY(post_id, revision)
--  ,FOREIGN KEY (post_id, revision) REFERENCES post (post_id, revision)
-- );