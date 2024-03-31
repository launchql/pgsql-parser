import generate from '@babel/generator';
import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'
import { PgProtoParserOptions } from '../src/options';
import { prettyPrint } from 'recast';

export const printAst = (ast: any) => {
    const results = generate(ast);
    console.log(results.code);
}

export const generateCode = (ast: any) => {
    const results = generate(ast);
    return results.code;
}

export const expectAst = (ast: any) => {
    expect(generateCode(ast)).toMatchSnapshot();
}

export const expectAstsCodeToEqual = (testAst: any, expectAst: any) => {
    const expectCode = prettyPrint(expectAst).code;
    const testCode = prettyPrint(testAst).code;
    expect(expectCode).toEqual(testCode);
}

export const readFilesFromDir = (outDir) => 
    glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
   
export const FIXTURES_DIR = resolve(join(__dirname, '../../../__fixtures__/'));

export const getTestProtoPath = (filename: string = '16-latest.proto') => 
    resolve(join(FIXTURES_DIR, 'proto', filename));    

export const getOutDir = (testname: string): string => resolve(FIXTURES_DIR, 'output', testname);

export const parseAndSnap = (
    testname: string,
    options: PgProtoParserOptions,
    protofile: string = '16-latest.proto'
) => {
    const outDir = getOutDir(testname);
    options.outDir = outDir;
    const parser = new PgProtoParser(getTestProtoPath(protofile), options);
    parser.write();
    const out = readFilesFromDir(outDir);
    expect(out).toMatchSnapshot();
}