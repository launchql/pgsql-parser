ALTER TABLE myschema.role
    ADD CONSTRAINT fk_myschema_role_actor_id
    FOREIGN KEY (actor_id)
    REFERENCES actors.actor (id)
    ON DELETE CASCADE;

CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);

CREATE TABLE actors_private.actor_info (
    actor_id uuid PRIMARY KEY REFERENCES actors.actor (id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
    password_hash text NOT NULL
);


-- one row with (1,1)
CREATE TABLE foo ( a int, b int,
  PRIMARY KEY (a,b)
);

--
-- two child tables to reference it
-- 
CREATE TABLE t_full ( a int, b int,
  FOREIGN KEY (a,b) REFERENCES foo MATCH FULL
);

CREATE TABLE t_simple ( a int, b int,
  FOREIGN KEY (a,b) REFERENCES foo MATCH SIMPLE
);
