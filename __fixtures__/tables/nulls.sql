CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric
);
CREATE TABLE products (
    product_no integer NULL,
    name text NULL,
    price numeric NULL
);
CREATE TABLE products (
    product_no integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL CHECK (price > 0)
);
