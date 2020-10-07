import Deparser from './deparser';
const parse = require('@pgql/parse').parseQuerySync;
const deparse = Deparser.deparse;
const enums = require('./libpg_enums');
export { parse, deparse, Deparser, enums };
