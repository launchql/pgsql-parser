#!/usr/bin/env node
import { resolve, join } from 'path';
import { readFileSync } from 'fs';
import { parse, parseFunction } from './index';
import { cleanTreeWithStmt } from './utils';
const argv = require('minimist')(process.argv.slice(2));
const args = argv._;
if (args.length !== 1) {
  console.log(argv);
  console.warn('Usage: pgsql-parser <sqlfile>');
  process.exit(1);
}
const content = readFileSync(resolve(join(process.cwd(), args[0])), 'utf-8');
let query;
if (argv.pl) {
  // plpgsql ONLY
  query = parseFunction(content);
} else {
  query = parse(content);
}

process.stdout.write(JSON.stringify(cleanTreeWithStmt(query), null, 2));
