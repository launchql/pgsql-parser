DELETE FROM shoelace_data
     WHERE sl_name = OLD.sl_name;

DELETE FROM delete_test AS dt WHERE dt.a > 75;

DELETE FROM delete_test dt WHERE delete_test.a > 25;

DELETE FROM delete_test WHERE a > 25;