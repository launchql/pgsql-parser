const parse = require('pg-plpgsql-query-native').parseQuerySync;
import Deparser from './deparser';
import { walk, all, first, tables, byType, clean } from './utils';

const deparse = Deparser.deparse;
const verify = (query) => {
  const result = deparse(parse(query));

  const json1 = clean(parse(query));
  const json2 = clean(parse(result));

  return JSON.stringify(json1) === JSON.stringify(json2);
};

export { parse, deparse, walk, first, all, tables, byType, clean, verify, Deparser };
