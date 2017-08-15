CREATE TABLE "customer_product_categories" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "effective" tstzrange DEFAULT '[-infinity,infinity]'
)
