CREATE USER MAPPING FOR local_user SERVER "foreign_server" OPTIONS (user 'remote_user', password 'secret123');
CREATE USER MAPPING FOR local_user SERVER foreign_server OPTIONS (user 'remote_user', password 'secret123');

-- This file contains examples of SQL string literals requiring E-prefixed strings

-- Basic string with newline
SELECT E'Line 1\nLine 2';

-- Tab character and single quote
SELECT E'Column\tValue with quote: \'' AS formatted_string';

-- Escaped backslash and carriage return
SELECT E'Path is C:\\Program Files\\PostgreSQL\r\nDone.';

-- Unicode escapes
SELECT E'Unicode heart: \u2764' AS unicode_heart;
SELECT E'Extended Unicode: \U0001F680' AS rocket_emoji;

-- Octal escape
SELECT E'Bell sound: \007' AS octal_escape;

-- Hex-looking string that is NOT bytea
-- This needs E because it has \x but also other escapes
SELECT E'This is not a bytea literal: \\xDEAD and a newline \n';

-- Proper bytea hex string (should NOT need E prefix)
SELECT '\\xDEADBEEF'::bytea;

-- A_Const-style literal in INSERT
INSERT INTO messages (content) VALUES (
  E'Line one.\nLine two with tab:\tEnd.'
);

-- Another INSERT with a tricky string in a comment
-- Comment: escaped quote and newline: \n and \'
INSERT INTO logs (message) VALUES (
  E'Escaped comment info: \nAuthor said: \'yes\''
);

-- String that would cause parsing issues without E
SELECT E'Invalid path: C:\\Users\\Me\\Documents';

-- Control character (form feed)
SELECT E'Page break here:\fNext page';

-- JSON-like string that *requires* E because of escaped quotes
INSERT INTO configs (data) VALUES (
  E'{\"theme\": \"dark\", \"alert\": \"bell\\nchime\"}'
);

-- Nested comment trick: using E-string inside a comment-containing SQL
-- This shows a string literal *inside* a SQL statement that also includes a SQL comment
INSERT INTO docs (note) VALUES (
  E'This value includes a SQL-style comment -- tricky!\nBut it''s safe here.'
);

-- Example where normal string is okay (no E needed)
SELECT E'Just a plain string, nothing to escape.';
SELECT 'Just a plain string, nothing to escape.';

-- Just to make sure we're parsing string types correctly
-- sval.String.str with embedded backslashes and quotes
SELECT E'This string has \"quotes\" and \\slashes\\' AS tricky_string;
