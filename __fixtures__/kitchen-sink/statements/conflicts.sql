INSERT INTO yo.table (project_id, name, field_name)
  VALUES (v_obj_key_id, v_secret_name::bytea, v_secret_value)
  ON CONFLICT (project_id, name)
  DO
  UPDATE
  SET
    field_name = EXCLUDED.field_name;


INSERT INTO yo.table (project_id, name, field_name)
  VALUES (v_obj_key_id, v_secret_name::bytea, v_secret_value)
  ON CONFLICT (project_id, name)
  DO
  UPDATE
  SET
    field_name = EXCLUDED.field_name
  WHERE prop = 1;

INSERT INTO yo.table (project_id, name, field_name)
  VALUES (v_obj_key_id, v_secret_name::bytea, v_secret_value)
  ON CONFLICT (project_id, name)
  DO NOTHING;

INSERT INTO customers (NAME, email)
VALUES
	(
		'Microsoft',
		'hotline@microsoft.com'
	) 
ON CONFLICT 
ON CONSTRAINT customers_name_key 
DO NOTHING;


INSERT INTO customers (name, email)
VALUES
	(
		'Microsoft',
		'hotline@microsoft.com'
	) 
ON CONFLICT (name) 
DO
		UPDATE
	  SET email = EXCLUDED.email || ';' || customers.email;