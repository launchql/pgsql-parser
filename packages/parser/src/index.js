import { Deparser, deparse } from 'pgsql-deparser';
import { enums } from 'pgsql-enums';
const parse = require('libpg-query').parseQuerySync;
const parseFunction = require('libpg-query').parsePlPgSQLSync;
export { parse, deparse, Deparser, enums, parseFunction };
