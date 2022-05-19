import { Deparser, deparse } from 'pgsql-deparser';
import { enums } from 'pgsql-enums';
import { parseQuerySync, parsePlPgSQLSync as parseFunction } from 'libpg-query';

export const parse = (sql) => {
  if (!sql) throw new Error('no SQL provided to parser');
  const result = parseQuerySync(sql);
  return result.stmts.map(({ stmt, stmt_len, stmt_location }) => {
    return {
      RawStmt: {
        stmt,
        stmt_len,
        stmt_location: stmt_location || 0
      }
    };
  });
};

export { deparse, Deparser, enums, parseFunction };
