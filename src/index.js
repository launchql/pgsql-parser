import Deparser from './deparser';
const parse = require('@pgql/parse').parseQuerySync;
const parseFunction = require('@pgql/parse').parsePlPgSQLSync;
const deparse = Deparser.deparse;
const enums = require('./libpg_enums');
export { parse, deparse, Deparser, enums, parseFunction };
