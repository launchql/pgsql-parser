#!/usr/bin/env node
import { resolve, join } from 'path';
import { readFileSync } from 'fs';
import { parse } from './index';
import { cleanTreeWithStmt } from './utils';
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.warn('Usage: pgsql-parser <sqlfile>');
  process.exit(1);
}

const content = readFileSync(resolve(join(process.cwd(), args[0])), 'utf-8');
const query = parse(content);
process.stdout.write(JSON.stringify(cleanTreeWithStmt(query), null, 2));
