import { readFileSync } from 'fs';
import {
    generateTsAstCodeFromPgAst
} from 'pg-proto-parser';
import { parse } from 'pgsql-parser';
import generate from '@babel/generator';

// Example SQL query
const sql = readFileSync(__dirname + '/query.sql', 'utf-8');

// Parse the SQL query to get the PostgreSQL AST
const pgAst = parse(sql);

// Generate TypeScript AST builder code from the PostgreSQL AST
const tsAstBuilderCode = generateTsAstCodeFromPgAst(
    pgAst[0].RawStmt.stmt
);


const code = generate(tsAstBuilderCode).code;
console.log(code);