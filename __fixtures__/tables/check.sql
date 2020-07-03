CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0)
);
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CONSTRAINT positive_price CHECK (price > 0)
);
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric CONSTRAINT check_price CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);

CREATE TABLE boomin (d date, CHECK (false) NO INHERIT NOT VALID);
CREATE TABLE boomin (d date, CHECK (true) NO INHERIT NOT VALID);

ALTER TABLE checkitout
  ADD CHECK (d between '2010-01-01'::date and '2010-12-31'::date) NOT VALID;

ALTER TABLE checkitout2
  ADD CHECK (d NOT BETWEEN '2010-01-01'::date and '2010-12-31'::date) NOT VALID;

create table atacc3 (test3 int) inherits (atacc1, atacc2);
