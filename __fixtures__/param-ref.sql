SELECT
  *
FROM
  table_name
WHERE
  name = ?;

SELECT
  *
FROM
  table_name
WHERE
  name = $1;

SELECT
  $1::text as name;
