 SELECT * FROM myschema.mytable WHERE a = TRUE;
 SELECT * FROM myschema.mytable WHERE a = CAST('t' AS boolean);
 SELECT * FROM myschema.mytable WHERE a = 't'::boolean;