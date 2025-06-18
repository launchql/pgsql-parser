CREATE TYPE myschema.mycustomtype AS (
  id uuid,
  verify_code text,
  verify_code_expires_on TIMESTAMPTZ,
  actor_id uuid
);
