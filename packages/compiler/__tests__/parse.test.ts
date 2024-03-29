import { join, basename, dirname } from 'path';
import { sync as glob } from 'glob';
import { sync as mkdirp } from 'mkdirp';
import { readFileSync, writeFileSync } from 'fs';
import { parse as babelParse } from '@babel/parser';
import { stringify } from 'ast-stringify';
import cases from 'jest-in-case';
import { fileToAst } from '../src/utils';
import { expectAstsCodeToEqual, generateCode, printAst } from '../test-utils';
import { getCleanReactAst } from '../src/react/clean-ast-parse';
import { parse, deparse } from '../src/react/ast';
import { expectAst } from '../test-utils';
import generate from '@babel/generator';
import { prettyPrint } from 'recast';

const OUTPUT_TYPE = 'react';
const FIXTURE_DIR = join(__dirname, '../../../__fixtures__')
const COMPONENTS_DIR = join(FIXTURE_DIR, 'components')
const OUTPUT_DIR = join(FIXTURE_DIR, 'output')
// const OUTPUT_DIR = join(FIXTURE_DIR, 'output')

const componentFiles = glob(COMPONENTS_DIR + '/**/*.tsx');

const verifyOutput = (filename) => {
    if (filename.split('.').length !== 3) {
        throw new Error('impromper interweb-ui output fixture')
    }
};
const getOutputType = (filename) => {
    return filename.split('.')[1];
};

interface Component {
    type: string;
    output: string;
    test: string;
    filename: string;
    path: string;
    code: string;
}

const components: Component[] = componentFiles
    .map(a => {
        const p = a.replace(COMPONENTS_DIR, '');
        const filename = basename(p);
        let type;
        let output;
        switch (true) {
            case filename.startsWith('input'):
                type = 'input'
                break;
            case filename.startsWith('output'):
                type = 'output'
                verifyOutput(filename);
                output = getOutputType(filename);
                break;
            default:
                throw new Error('not a proper interweb-ui tsx fixture!')
        }
        return {
            type,
            output,
            test: dirname(p).replace(/^\//, ''),
            filename,
            path: a,
            code: readFileSync(a, 'utf-8')
        }
    }).map(c => {
        switch (c.type) {
            case 'input':
                return c;
            case 'output':
                if (c.output === OUTPUT_TYPE) {
                    return c;
                }
            default:
        }
    }).filter(Boolean);

const asts = components.map(c => {
    const ast = babelParse(readFileSync(c.path, 'utf-8'), {
        sourceType: 'module',
        plugins: [
            'jsx', 'typescript'
        ]
    });
    return {
        ...c,
        ast: JSON.parse(stringify(ast))
    }
});

interface TestMap {
    [key: string]: Component[]
}

interface Test {
    name: string;

    input: Component;
    output: Component;
}

const testMap: TestMap = components.reduce((m, c) => {
    m[c.test] = m[c.test] || [];
    m[c.test].push(c);
    return m;
}, {});

// temporary
const SKIP = [
    // '01-simple',
    // '02-svg-attrs',
    // '03-forward-ref',
    // '04-looping-jsx',
    // '05-ternary',
    '06-default-props',
    '07-getters',
    '08-misc',
    '09-recursion',
    '10-vue',
];

const tests: Test[] = Object.entries(testMap)
    .map(([key, value]) => {
        return {
            name: key,
            input: value.find(a => a.type === 'input'),
            output: value.find(a => a.type === 'output'),
        }
    }).filter(t => !SKIP.includes(t.name));

cases('parse()', opts => {
    const output = fileToAst(opts.output.path);
    const input = fileToAst(opts.input.path);
    const parseResult = parse(input, true);
    const result = deparse(parseResult.ast, parseResult.scope);

    expectAst(result.ast);
    expect(JSON.stringify(result.scope, null, 2)).toMatchSnapshot();

    // prepare output
    const outputDir = join(OUTPUT_DIR, opts.output.test);
    const outputFile = join(outputDir, opts.output.filename);
    const outputFilePretty = join(outputDir, opts.output.filename.replace('.tsx', '.pretty.tsx'));
    const outputAstPath = join(outputDir, opts.output.test + '.ast.json');
    const scopeAstPath = join(outputDir, opts.output.test + '.scope.json');
    const inJSON = join(outputDir, opts.output.test + '.input.json');
    const outJSON = join(outputDir, opts.output.test + '.ouput.json');
    const outCode = generate(result.ast).code;
    const outCodePretty = prettyPrint(result.ast).code;
    mkdirp(outputDir);
    writeFileSync(scopeAstPath, JSON.stringify(result.scope, null, 2));
    writeFileSync(outputFile, outCode);
    writeFileSync(outputFilePretty, outCodePretty);
    writeFileSync(inJSON, stringify(input));
    writeFileSync(outJSON, stringify(output));
    writeFileSync(outputAstPath, stringify(getCleanReactAst(result.ast)));

    // console.log(prettyPrint(output).code);

    // NOW — AST vs. AST
    expectAstsCodeToEqual(output, result.ast);


}, tests)