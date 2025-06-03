CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS plpgsql;

CREATE INDEX index_email_logs_on_created_at ON public.email_logs USING btree (created_at DESC);
CREATE INDEX index_email_logs_on_created_at ON public.email_logs USING btree (created_at DESC, another_prop ASC);


ALTER TABLE "Customer" ADD CONSTRAINT myconstraint
  FOREIGN KEY ("SupportRepId") REFERENCES "Employee" ("EmployeeId") ON DELETE NO ACTION ON UPDATE NO ACTION;


ALTER FUNCTION public.delayed_jobs_after_delete_row_tr_fn() OWNER TO prisma;
ALTER FUNCTION public.delayed_jobs_after_delete_row_tr_fn OWNER TO prisma;


create table if not exists users (
  id uuid primary key not null default gen_random_uuid(),
  "name" text not null,
  handle text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
)