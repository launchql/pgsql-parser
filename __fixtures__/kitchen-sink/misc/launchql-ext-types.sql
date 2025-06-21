CREATE DOMAIN attachment AS jsonb CHECK ( value ?& ARRAY['url', 'mime'] AND (value->>'url') ~ '^(https?)://[^\s/$.?#].[^\s]*$' );

COMMENT ON DOMAIN attachment IS E'@name launchqlInternalTypeAttachment';

CREATE DOMAIN email AS citext CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

COMMENT ON DOMAIN email IS E'@name launchqlInternalTypeEmail';

CREATE DOMAIN hostname AS text CHECK ( value ~ '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$' );

COMMENT ON DOMAIN hostname IS E'@name launchqlInternalTypeHostname';

CREATE DOMAIN image AS jsonb CHECK ( value ?& ARRAY['url', 'mime'] AND (value->>'url') ~ '^(https?)://[^\s/$.?#].[^\s]*$' );

COMMENT ON DOMAIN image IS E'@name launchqlInternalTypeImage';

CREATE DOMAIN multiple_select AS jsonb CHECK ( value ?& ARRAY['value'] );

COMMENT ON DOMAIN multiple_select IS E'@name launchqlInternalTypeMultipleSelect';

CREATE DOMAIN single_select AS jsonb CHECK ( value ?& ARRAY['value'] );

COMMENT ON DOMAIN single_select IS E'@name launchqlInternalTypeSingleSelect';

CREATE DOMAIN upload AS text CHECK ( value ~ '^(https?)://[^\s/$.?#].[^\s]*$' );

COMMENT ON DOMAIN upload IS E'@name launchqlInternalTypeUpload';

CREATE DOMAIN url AS text CHECK ( value ~ '^(https?)://[^\s/$.?#].[^\s]*$' );

COMMENT ON DOMAIN url IS E'@name launchqlInternalTypeUrl';