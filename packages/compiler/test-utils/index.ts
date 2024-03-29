import generate from '@babel/generator';
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