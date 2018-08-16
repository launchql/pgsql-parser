CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&)
);
CREATE TABLE "customer_product_categories" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "effective" tstzrange DEFAULT '[-infinity,infinity]',
  EXCLUDE USING gist (LOWER("name") WITH =, "effective" WITH &&)
)
