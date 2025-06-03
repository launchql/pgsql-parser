INSERT INTO shoelace_data
  VALUES (1, 2, 3, 'truth', TRUE);

INSERT INTO shoelace_data (id, col1, col2, val1, bl2)
  VALUES (1, 2, 3, 'truth', TRUE);

INSERT INTO shoelace_data DEFAULT VALUES;

INSERT INTO foo (f2,f3)
  VALUES ('test', DEFAULT), ('More', 11), (upper('more'), 7+9)
  RETURNING *, f1+f3 AS sum;

INSERT INTO customers (name, email)
VALUES
	(
		'Microsoft',
		'hotline@microsoft.com'
	) 
ON CONFLICT (id, project_id) 
DO
		UPDATE
	  SET 
        email = EXCLUDED.email || ';' || customers.email,
        level = customers.level + 1,
        other = EXCLUDED.other
    RETURNING *;


INSERT INTO v8.modules (name, code)
  VALUES ('ajv', $code$ (function () { var module = { exports: { } };
var exports = module.exports;

/* plv8 bundle begins */

/* plv8 bundle ends */
return module; 

})(); $code$);
