-- timestamp(2) with time zone
CREATE TABLE public."ACTIVITY" (
  "ACTIVITY_ID" bigint NOT NULL,
  "PUBLISHED" timestamp(2) with time zone
);

-- timestamp(2)
CREATE TABLE public."ACTIVITY" (
  "ACTIVITY_ID" bigint NOT NULL,
  "PUBLISHED" timestamp(2)
);

-- text
CREATE TABLE public."EXAMPLE" (
  "MESSAGE" text
);

-- TIME WITHOUT TIME ZONE
CREATE TABLE public."EXAMPLE_TIME" (
  "START_TIME" time
);

-- TIME WITH TIME ZONE (aka timetz)
CREATE TABLE public."EXAMPLE_TIMETZ" (
  "START_TIME" time with time zone
);

-- TIME(n) WITHOUT TIME ZONE
CREATE TABLE public."EXAMPLE_TIME_PRECISION" (
  "START_TIME" time(3)
);

-- TIME(n) WITH TIME ZONE (aka timetz(n))
CREATE TABLE public."EXAMPLE_TIMETZ_PRECISION" (
  "START_TIME" time(3) with time zone
);

-- TIMESTAMP WITHOUT TIME ZONE (alias of timestamp)
CREATE TABLE public."EXAMPLE_TIMESTAMP" (
  "CREATED_AT" timestamp
);

-- TIMESTAMP WITH TIME ZONE (alias of timestamptz)
CREATE TABLE public."EXAMPLE_TIMESTAMPTZ" (
  "CREATED_AT" timestamp with time zone
);

-- INTERVAL
CREATE TABLE public."EXAMPLE_INTERVAL" (
  "DURATION" interval
);

-- INTERVAL with precision
CREATE TABLE public."EXAMPLE_INTERVAL_PRECISION" (
  "DURATION" interval(2)
);

-- DATE
CREATE TABLE public."EXAMPLE_DATE" (
  "BIRTHDAY" date
);

-- BOOLEAN
CREATE TABLE public."EXAMPLE_BOOL" (
  "IS_ACTIVE" boolean
);
