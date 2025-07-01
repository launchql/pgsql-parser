CREATE VIEW superschema.app_authorized_grants AS
          SELECT
            coalesce(nullif(s[1], ''), 'PUBLIC') as grantee,
            relname as table_name,
            nspname as table_schema,
            string_agg(s[2], ', ') as privileges,
            relkind as table_type
          FROM
            pg_class c
            join pg_namespace n on n.oid = relnamespace
            join pg_roles r on r.oid = relowner,
            unnest(coalesce(relacl::text[], format('{%%s=arwdDxt/%%s}', rolname, rolname)::text[])) acl,
            regexp_split_to_array(acl, '=|/') s
          WHERE (s[1] = 'authenticated' or s[1] is null) and nspname not in ('pg_catalog', 'information_schema', 'pg_toast')
          GROUP BY grantee, table_name, table_schema, relkind
          ORDER BY relkind != 'r', relkind != 'v', relkind != 'm', relkind != 'i', relkind, nspname, relname;