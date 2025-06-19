 TODO Later, not now.
 
 would be cool to have a context for TypeCast, so it's mostly the later syntax, but possible to achieve the former:


 TypeCast(node: t.TypeCast, context: DeparserContext): string {
    return this.formatter.format([
      'CAST',
      '(',
      this.visit(node.arg, context),
      'AS',
      this.TypeName(node.typeName, context),
      ')'
    ]);
  }

vs

   TypeCast(node: t.TypeCast, context: DeparserContext): string {
    return `${this.visit(node.arg, context)}::${this.TypeName(node.typeName, context)}`;
  }


  Other diffs to check


      - SELECT ((SELECT ROW(1, 1, 1, 1)::test)::test).*
      + SELECT (CAST ( (SELECT CAST ( ROW(1, 1, 1, 1) AS test )) AS test )).*






      - ALTER DEFAULT PRIVILEGES IN SCHEMA schema_name GRANT ALL ON TABLES TO your_user
      + ALTER DEFAULT PRIVILEGES IN SCHEMA schema_name GRANT ALL PRIVILEGES ON TABLES TO your_user





      - CREATE INDEX index_email_logs_on_created_at ON public.email_logs USING btree (created_at DESC, another_prop ASC)
      + CREATE INDEX index_email_logs_on_created_at ON public.email_logs (created_at DESC, another_prop ASC)


   - SELECT (a AND b AND c::bool IS TRUE) OR d OR ((e AND f) OR g) FROM t
      + SELECT (a AND b AND CAST ( c AS bool ) IS TRUE) OR d OR ((e AND f) OR g) FROM t


   - SELECT customer_id FROM rental WHERE return_date::date = '2005-05-27' ORDER BY customer_id
      + SELECT customer_id FROM rental WHERE CAST ( return_date AS date ) = '2005-05-27' ORDER BY customer_id




      - SET client_encoding TO "UNICODE"
      + SET client_encoding = 'UNICODE'



      - SELECT * FROM ROWS FROM (getfoo6(1) AS (fooid int, foosubid int, fooname text), getfoo7(1) AS (fooid int, foosubid int, fooname text)) AS (fooid int, foosubid int, fooname text)
      + SELECT * FROM ROWS FROM (getfoo6(1) AS (fooid pg_catalog.int4, foosubid pg_catalog.int4, fooname text), getfoo7(1) AS (fooid pg_catalog.int4, foosubid pg_catalog.int4, fooname text)) AS (fooid pg_catalog.int4, foosubid pg_catalog.int4, fooname text)





      - SELECT mleast(VARIADIC arr := ARRAY[10, -1, 5, 4.4])
      + SELECT mleast(VARIADIC arr => ARRAY[10, -1, 5, 4.4])



   - DROP FOREIGN TABLE IF EXISTS no_such_schema.foo
      + DROP FOREIGN TABLE IF EXISTS no_such_schema.foo RESTRICT

