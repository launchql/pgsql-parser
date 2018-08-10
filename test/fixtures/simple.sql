SELECT
  *
FROM
  table_name
WHERE
  name = 'test' AND num > 7 AND
  last_name LIKE '%''test''%';

SELECT
  *
FROM
  table_name
WHERE
  name = 'test' AND num > 7 AND
  last_name NOT LIKE '%''test''%';

SELECT
  *
FROM
  table_name
WHERE
  name = 'test' AND num > 7 AND
  last_name ILIKE '%''test''%';

SELECT
  *
FROM
  table_name
WHERE
  name = 'test' AND num > 7 AND
  last_name NOT ILIKE '%''test''%';

SELECT
  *
FROM
  table_name
WHERE
  last_name SIMILAR TO '%(b|d)%';

SELECT
  *
FROM
  table_name
WHERE
  last_name SIMILAR TO '%(b|d)%' ESCAPE 'a';

SELECT
  *
FROM
  table_name
WHERE
  last_name NOT SIMILAR TO '%(b|d)%';

SELECT
  *
FROM
  table_name
WHERE
  last_name NOT SIMILAR TO '%(b|d)%' ESCAPE 'a';
