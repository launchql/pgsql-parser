CREATE OR REPLACE FUNCTION someschema.myfunc (some_id obj.geo_type, other_id obj.geo_type) RETURNS TABLE (path text, name integer)
AS $$
SELECT * FROM
    mytable
$$
LANGUAGE 'sql' VOLATILE;
