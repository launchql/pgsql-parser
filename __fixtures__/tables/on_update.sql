CREATE TABLE order_items (
    product_no integer REFERENCES products ON UPDATE RESTRICT,
    order_id integer REFERENCES orders ON UPDATE CASCADE,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
