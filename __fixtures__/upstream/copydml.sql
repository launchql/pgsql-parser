--
-- Test cases for COPY (INSERT/UPDATE/DELETE) TO
--
create table copydml_test (id serial, t text);
insert into copydml_test (t) values ('a');
insert into copydml_test (t) values ('b');
insert into copydml_test (t) values ('c');
insert into copydml_test (t) values ('d');
insert into copydml_test (t) values ('e');

--
-- Test COPY (insert/update/delete ...)
--

drop rule qqq on copydml_test;

























































































































































create rule qqq as on insert to copydml_test where new.t <> 'f' do instead delete from copydml_test;

create rule qqq as on update to copydml_test do instead nothing;

create rule qqq as on delete to copydml_test do instead nothing;
create rule qqq as on delete to copydml_test where old.t <> 'f' do instead insert into copydml_test default values;

-- triggers
create function qqq_trig() returns trigger as $$
begin
if tg_op in ('INSERT', 'UPDATE') then
    raise notice '% %', tg_op, new.id;
    return new;
else
    raise notice '% %', tg_op, old.id;
    return old;
end if;
end
$$ language plpgsql;
create trigger qqqbef before insert or update or delete on copydml_test
    for each row execute procedure qqq_trig();
create trigger qqqaf after insert or update or delete on copydml_test
    for each row execute procedure qqq_trig();
