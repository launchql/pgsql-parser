-- CREATE OR REPLACE FUNCTION someschema.myfunc (some_id uuid, other_id uuid) RETURNS void
-- AS $$
-- UPDATE
--     mytable
-- SET
--     ref_id = new_ref_id
-- WHERE
--     id = some_id
-- $$
-- LANGUAGE 'sql' VOLATILE;
--
-- CREATE OR REPLACE FUNCTION someschema.myfunc (some_id uuid, other_id uuid) RETURNS SETOF obj.geo
-- AS $$
-- UPDATE
--     mytable
-- SET
--     ref_id = new_ref_id
-- WHERE
--     id = some_id
-- $$
-- LANGUAGE 'sql' VOLATILE;
--
CREATE OR REPLACE FUNCTION someschema.myfunc (some_id obj.geo_type, other_id obj.geo_type) RETURNS SETOF obj.geo
AS $$
UPDATE
    mytable
SET
    ref_id = new_ref_id
WHERE
    id = some_id
$$
LANGUAGE 'sql' VOLATILE;

CREATE OR REPLACE FUNCTION someschema.myfunc (some_id obj.geo_type, other_id obj.geo_type) RETURNS integer
AS $$
SELECT * FROM
    mytable
$$
LANGUAGE 'sql' VOLATILE;

CREATE OR REPLACE FUNCTION someschema.myfunc (some_id obj.geo_type, other_id obj.geo_type) RETURNS TABLE (path text, name integer)
AS $$
SELECT * FROM
    mytable
$$
LANGUAGE 'sql' VOLATILE;

CREATE OR REPLACE FUNCTION helpers.some_method ()
    RETURNS TRIGGER
AS $$
BEGIN
    IF tg_op = 'INSERT' THEN
        NEW.some_prop = helpers.do_magic (NEW.data);
        RETURN NEW;
    END IF;
END;
$$
LANGUAGE 'plpgsql';
