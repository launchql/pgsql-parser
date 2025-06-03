--
-- Test cases for COPY (select) TO
--
create table test1 (id serial, t text);
insert into test1 (t) values ('a');
insert into test1 (t) values ('b');
insert into test1 (t) values ('c');
insert into test1 (t) values ('d');
insert into test1 (t) values ('e');

create table test2 (id serial, t text);
insert into test2 (t) values ('A');
insert into test2 (t) values ('B');
insert into test2 (t) values ('C');
insert into test2 (t) values ('D');
insert into test2 (t) values ('E');

create view v_test1
as select 'v_'||t from test1;

--
-- Test COPY table TO
--
drop table test2;
drop view v_test1;
drop table test1;











































































































































select * from test3;
drop table test3;
