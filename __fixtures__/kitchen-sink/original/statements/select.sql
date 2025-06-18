WITH regional_sales AS (
        SELECT region, SUM(amount) AS total_sales
        FROM orders
        GROUP BY region
     ), top_regions AS (
        SELECT region
        FROM regional_sales
        WHERE total_sales > (SELECT SUM(total_sales)/10 FROM regional_sales)
     )
SELECT region,
       product,
       SUM(quantity) AS product_units,
       SUM(amount) AS product_sales
FROM orders
WHERE region IN (SELECT region FROM top_regions)
GROUP BY region, product;

with chars2bits AS (
    select
        character,
        (index - 1)::bit(5)::text AS index
    from unnest('{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,2,3,4,5,6,7}'::text[]) with ordinality as t (character, index)
)
select string_agg(c.index, '')
from regexp_split_to_table('abcde', '') s
inner join chars2bits c ON (s = c.character);

select
        character,
        (index - 1)::bit(5)::text AS index
    from unnest('{a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,2,3,4,5,6,7}'::text[]) with ordinality as t (character, index);