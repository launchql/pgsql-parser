
DROP TABLE IF EXISTS users CASCADE;
CREATE TEMP TABLE users (
  id integer NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS post_type CASCADE;
CREATE TEMP TABLE post_type (
  id integer NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS assembly_seat CASCADE;
CREATE TEMP TABLE assembly_seat (
  id integer NOT NULL PRIMARY KEY
);

-- TODO MATCH after upgrading to newer engine: https://github.com/lfittl/libpg_query/issues/66

-- DROP TABLE IF EXISTS post CASCADE;
-- CREATE TEMP TABLE post (
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
-- CREATE TEMP TABLE post_state (
--   post_id integer NOT NULL
--  ,revision integer NOT NULL
--  ,assembly_seat_id integer NOT NULL
--     REFERENCES assembly_seat (id) MATCH FULL ON UPDATE CASCADE ON DELETE RESTRICT
--  ,PRIMARY KEY(post_id, revision)
--  ,FOREIGN KEY (post_id, revision) REFERENCES post (post_id, revision)
-- );