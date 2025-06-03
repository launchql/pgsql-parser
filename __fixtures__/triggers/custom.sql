DROP SCHEMA IF EXISTS fb;
DROP SCHEMA IF EXISTS fb CASCADE;
CREATE SCHEMA fb;
SET search_path TO fb,"$user",public;
CREATE EXTENSION "uuid-ossp";

CREATE TABLE "user" (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created       timestamptz NOT NULL DEFAULT now(),
  full_name     text NOT NULL DEFAULT ''
);


CREATE TABLE post (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created       timestamptz NOT NULL DEFAULT now(),
  content       text NOT NULL DEFAULT '',
  "user"        uuid REFERENCES "user" NOT NULL
);


CREATE TABLE friendship (
  first         uuid REFERENCES "user" NOT NULL,
  second        uuid REFERENCES "user" NOT NULL,
  created       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (first, second)
);

CREATE FUNCTION check_friendship_symmetry() RETURNS TRIGGER AS $$
DECLARE
  link friendship;
BEGIN
  SELECT * INTO link FROM friendship
   WHERE second = NEW.first AND first = NEW.second;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Friendships must be INSERTed as pairs.';
  END IF;
  RETURN NEW;
END
$$ LANGUAGE plpgsql
   SET search_path FROM CURRENT;

CREATE CONSTRAINT TRIGGER friendship_symmetry
AFTER INSERT ON friendship
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE PROCEDURE check_friendship_symmetry();

create trigger _500_increase_job_queue_count_update
after update of queue_name on app.jobs
for each row execute procedure app.jobs__increase_job_queue_count();
