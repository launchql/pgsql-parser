import Deparser from './deparser';
const parse = require('@pgql/parse').parseQuerySync;
const deparse = Deparser.deparse;
export { parse, deparse, Deparser };
