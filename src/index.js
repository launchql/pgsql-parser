import { parse } from 'pg-query-native';
import Deparser from './deparser';
import { walk, all, first, tables, byType, clean } from './utils';

const deparse = Deparser.deparse;

const verify = (query) => {
  const result = deparse(parse(query).query);

  const json1 = clean(parse(query).query);
  const json2 = clean(parse(result).query);

  return JSON.stringify(json1) === JSON.stringify(json2);
};

export { parse, deparse, walk, first, all, tables, byType, clean, verify, Deparser };
