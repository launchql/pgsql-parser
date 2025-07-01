-- 1. Basic enum type
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');

-- 2. Enum with mixed-case and quoted values
CREATE TYPE "AlertLevel" AS ENUM ('Low', 'MEDIUM', 'High', 'CRITICAL');

-- 3. Composite type (record-style)
CREATE TYPE address AS (
  street text,
  city text,
  zip_code int
);

-- 4. Composite type with quoted field names and types
CREATE TYPE "PostalInfo" AS (
  "Street" text,
  "City" text,
  "ZipCode" integer
);

-- 5. Schema-qualified composite type
CREATE TYPE public.user_metadata AS (
  key text,
  value jsonb
);

-- 6. Range type with canonical, subtype and collation
CREATE TYPE tsrange_custom AS RANGE (
  subtype = timestamp with time zone,
  subtype_diff = timestamp_diff,
  canonical = normalize_tsrange
);

-- 7. Enum with numeric-looking labels (quoted)
CREATE TYPE version_enum AS ENUM ('1.0', '1.1', '2.0');

-- 8. Composite with nested types
CREATE TYPE full_location AS (
  address address,
  region_code char(2)
);

-- 9. Complex enum type with hyphens and special chars (quoted)
CREATE TYPE "Workflow-State" AS ENUM ('draft', 'in-review', 'needs-fix', 'finalized');
