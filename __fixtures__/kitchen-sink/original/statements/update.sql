UPDATE update_test SET c = repeat('x', 10000) WHERE c = 'car';

UPDATE update_test SET (b,a) = (select a+1,b from update_test where a = 1000)
  WHERE a = 11;

UPDATE something SET (b,a) = (1,2)
  WHERE a = 11;


UPDATE update_test SET (c,b,a) = ('bugle', b+11, DEFAULT) WHERE c = 'foo';

UPDATE shoelace_data
       SET sl_name = NEW.sl_name,
           sl_avail = NEW.sl_avail,
           sl_color = NEW.sl_color,
           sl_len = NEW.sl_len,
           sl_unit = NEW.sl_unit
     WHERE sl_name = OLD.sl_name;

UPDATE something SET a = 1
RETURNING a;

UPDATE something SET a = 1
RETURNING a AS b, c;

UPDATE something SET a = 1
FROM b;

UPDATE something SET a = 1, b = 'b'
FROM c JOIN d ON (x = d.y), (SELECT * FROM e) f
WHERE something.x = d.x AND LEAST(something.y, 0) = f.z + 1;

UPDATE something SET a = 1
RETURNING b AS "b#1";

UPDATE something SET a = 1
FROM b
WHERE c
RETURNING *;

UPDATE foo SET f2 = lower(f2), f3 = DEFAULT RETURNING foo.*, f1+f3 AS sum13;
