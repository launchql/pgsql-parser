CREATE OR REPLACE FUNCTION someschema.myfunc (some_id uuid, other_id uuid) RETURNS void
AS $$
UPDATE
    mytable
SET
    ref_id = new_ref_id
WHERE
    id = some_id
$$
LANGUAGE 'sql' VOLATILE;

CREATE OR REPLACE FUNCTION someschema.myfunc (some_id uuid, other_id uuid) RETURNS obj.geo
AS $$
UPDATE
    mytable
SET
    ref_id = new_ref_id
WHERE
    id = some_id
$$
LANGUAGE 'sql' VOLATILE;
