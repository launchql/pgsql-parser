import { Deparser, deparse } from 'pgsql-deparser';
import { parsePlPgSQLSync as parseFunction } from 'libpg-query';
export declare const parse: (sql: any) => any;
export declare const parseAsync: (sql: any) => Promise<any>;
export { deparse, Deparser, parseFunction };
