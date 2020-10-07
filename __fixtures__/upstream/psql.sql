create temporary table gexec_test(a int, b text, c date, d float);
select format('create index on gexec_test(%I)', attname)
from pg_attribute
where attrelid = 'gexec_test'::regclass and attnum > 0
order by attnum;

execute q;
deallocate q;

prepare q as select repeat('x',2*n) as "0123456789abcdef", repeat('y',20-2*n) as "0123456789" from generate_series(1,10) as n;
prepare q as select ' | = | lkjsafi\\/ /oeu rio)(!@&*#)*(!&@*) \ (&' as " | -- | 012345678 9abc def!*@#&!@(*&*~~_+-=\ \", '11' as "0123456789", 11 as int from generate_series(1,10) as n;

do $$
begin
  raise notice 'foo';
  raise exception 'bar';
end $$;

do $$
begin
  raise notice 'foo';
  raise exception 'bar';
end $$;

do $$
begin
  raise notice 'foo';
  raise exception 'bar';
end $$;