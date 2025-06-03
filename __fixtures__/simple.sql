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

SELECT
  *
FROM
  table_name
WHERE
  last_name > first_name;

SELECT
  *
FROM
  table_name
WHERE
  last_name <> first_name;

SELECT
  *
FROM
  table_name
WHERE
  last_name = ANY (stuff);

SELECT
  *
FROM
  table_name
WHERE
  last_name = ALL (stuff);

SELECT
    title,
    category_id
FROM
    film
INNER JOIN film_category
        USING(film_id)
WHERE
    category_id = ANY(
        SELECT
            category_id
        FROM
            category
        WHERE
            NAME = 'Action'
            OR NAME = 'Drama'
    );

SELECT
    title,
    category_id
FROM
    film
INNER JOIN film_category
        USING(film_id)
WHERE
    category_id IN(
        SELECT
            category_id
        FROM
            category
        WHERE
            NAME = 'Action'
            OR NAME = 'Drama'
    );

    SELECT
    title,
    category_id
FROM
    film
INNER JOIN film_category
        USING(film_id)
WHERE
    category_id NOT IN(
        SELECT
            category_id
        FROM
            category
        WHERE
            NAME = 'Action'
            OR NAME = 'Drama'
    );

SELECT title
FROM film
WHERE length >= ANY(
    SELECT MAX( length )
    FROM film
    INNER JOIN film_category USING(film_id)
    GROUP BY  category_id );

SELECT * FROM transactions.transaction
  WHERE
transaction_date
BETWEEN to_date('2020-01-01','YYYY-MM-DD') AND to_date('2020-12-31','YYYY-MM-DD')
AND owner=0;

SELECT * FROM transactions.transaction
  WHERE
transaction_date
NOT BETWEEN to_date('2020-01-01','YYYY-MM-DD') AND to_date('2020-12-31','YYYY-MM-DD')
AND owner=0;