ALTER TYPE electronic_mail RENAME TO email;

ALTER TYPE email OWNER TO joe;
ALTER TYPE email SET SCHEMA customers;
ALTER TYPE compfoo ADD ATTRIBUTE f3 int;
ALTER TYPE colors ADD VALUE 'orange' AFTER 'red';
ALTER TYPE colors ADD VALUE 'orange' BEFORE 'red';

ALTER TYPE enum_type ADD VALUE 'new_value';

