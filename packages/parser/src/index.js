import { Deparser, deparse } from 'pgsql-deparser';
import { enums } from 'pgsql-enums';
const parse = require('@pgql/parse').parseQuerySync;
const parseFunction = require('@pgql/parse').parsePlPgSQLSync;
export { parse, deparse, Deparser, enums, parseFunction };
