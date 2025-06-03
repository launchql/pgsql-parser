import { Deparser, deparse } from 'pgsql-deparser';
import {
  parseQuery,
  parseQuerySync,
  parsePlPgSQLSync as parseFunction
} from 'libpg-query';
import type { RawStmt } from '@pgsql/types';

function mapStmt({ stmt, stmt_len, stmt_location }: RawStmt): { RawStmt: RawStmt } {
  return {
    RawStmt: {
      stmt,
      stmt_len,
      stmt_location: stmt_location || 0
    }
  };
}

export const parse = (sql: string) => {
  if (!sql) throw new Error('no SQL provided to parser');
  const result = parseQuerySync(sql);
  return result.stmts.map(mapStmt);
};

export const parseAsync = async (sql: string) => {
  if (!sql) throw new Error('no SQL provided to parser');
  const result = await parseQuery(sql);
  return result.stmts.map(mapStmt);
};

export { deparse, Deparser, parseFunction };
