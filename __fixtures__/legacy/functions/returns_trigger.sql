CREATE OR REPLACE FUNCTION helpers.some_method ()
    RETURNS TRIGGER
AS $$
BEGIN
    IF tg_op = 'INSERT' THEN
        NEW.some_prop = helpers.do_magic (NEW.data);
        RETURN NEW;
    END IF;
END;
$$
LANGUAGE 'plpgsql';
