DROP POLICY policy_name ON schema_name.table_name;
DROP POLICY policy_name ON table_name;

REVOKE DELETE ON TABLE schema_name.table_name FROM authenticated;
REVOKE DELETE ON TABLE table_name FROM authenticated;

DROP TABLE table_name;
DROP TABLE schema_name.table_name;

ALTER TABLE schema_name.table_name DROP COLUMN column_name;
ALTER TABLE "schema-name".table_name DROP COLUMN column_name;
ALTER TABLE "schema-name"."aa-bdd" DROP COLUMN "sdf-sdf";
ALTER TABLE "table-name" DROP COLUMN column_name;
ALTER TABLE table_name DROP COLUMN column_name;

DROP sequence if exists hsseq;
DROP sequence if exists "some-thing".hsseq;

ALTER TABLE schemaname.table_name RENAME column_name1 TO new_column_name1;
ALTER TABLE table_name RENAME column_name1 TO new_column_name1;

DROP TYPE test_type;
DROP TYPE schema_name.test_type;
DROP TYPE "schema-name".test_type;
DROP TYPE "schema-name"."test-type";
DROP TYPE IF EXISTS test_type_exists;
DROP TYPE IF EXISTS "aa-bb".test_type_exists;
drop type eitype cascade;

-- DROP AGGREGATE testagg1b(testdomain1);
DROP DOMAIN testdomain2b;
DROP DOMAIN schema_name.testdomain2b;
-- DROP OPERATOR !! (NONE, testdomain1);
DROP FUNCTION testfunc5b(a testdomain1);
DROP FUNCTION "my-schema".testfunc5b(a testdomain1);
DROP FUNCTION testfunc6b(b int);
DROP FUNCTION "my-schema".testfunc6b(b int);
DROP FUNCTION "my-schema"."test-func6b"(b int);
DROP FUNCTION testfunc7777;
DROP FUNCTION "my-schema".testfunc7777;

-- DROP CAST (testdomain1 AS testdomain3b);
