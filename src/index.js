import { parse } from 'pg-query-native';
import Deparser from './deparser';
import { walk, all, first, tables, byType, clean } from './utils';

const deparse = Deparser.deparse;

export { parse, deparse, walk, first, all, tables, byType, clean, Deparser };
