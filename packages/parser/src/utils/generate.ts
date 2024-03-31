import generate from '@babel/generator';
import * as t from '@babel/types';

export const convertAstToCode = (body: any[]) => {
  const ast = t.file(t.program(body));
  const { code } = generate(ast);
  return code;
};