import { Node } from '@pgsql/types';
import { parsePlPgSQLSync as parseFunction } from 'libpg-query';
export declare const parse: (sql: any) => Node;
export declare const parseAsync: (sql: any) => Promise<any>;
export { parseFunction };
