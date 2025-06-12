comment on column my_schema.my_table.my_column is
  E'@name meta\n@isImportant\n@jsonField date timestamp\n@jsonField name text\n@jsonField episode enum ONE=1 TWO=2\nThis field has a load of arbitrary tags.';

comment on table my_schema.my_table is
  E'@name my_new_table_name\n@omit update,delete\nThis is the documentation.';

comment on view my_schema.mv_view is
  E'@name my_new_view_name\n@omit update,delete\nThis is the documentation.';

comment on materialized view my_schema.mv_view is
  E'@name my_new_view_name\n@omit update,delete\nThis is the documentation.';

comment on type my_schema.my_type is
  E'@name my_new_type_name\nThis is the documentation.';

comment on column my_schema.my_table.my_column is
  E'@name my_new_column\n@omit create,update\nThis is the documentation.';

comment on constraint my_constraint on my_schema.my_table is
  E'@foreignFieldName foos\n@fieldName bar\nDocumentation here.';

comment on function my_function(arg_type_1, arg_type_2) is
  E'@name my_new_function_name\nDocumentation here.';

-- test out the raw vs non-raw

comment on function my_function(arg_type_1, arg_type_2) is
  E'\ninmycomment';

comment on function my_function(arg_type_1, arg_type_2) is
  'inmycomment';